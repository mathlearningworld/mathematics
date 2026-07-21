# 18G — Domain Services & Policies

## 1. Purpose

This document defines the architectural contracts for Domain Services, Domain Policies, Specifications, and cross-aggregate business-rule coordination in Math Learning World.

The objective is to ensure that business logic remains explicit, testable, deterministic, and owned by the domain layer without allowing aggregates, application services, repositories, or infrastructure adapters to absorb responsibilities that do not belong to them.

This document establishes:

- when logic belongs inside an aggregate;
- when a Domain Service is justified;
- when a Domain Policy is required;
- how Specifications represent reusable business predicates;
- how cross-aggregate decisions are coordinated;
- how repositories may be consulted without leaking persistence concerns;
- how domain events participate in policy evaluation and downstream reactions;
- how authorization differs from business eligibility;
- how domain logic is tested and evolved safely.

This document is normative for domain-layer design.

---

## 2. Scope

This document covers:

- Domain Service responsibilities;
- Domain Policy responsibilities;
- aggregate versus service ownership;
- cross-aggregate business rules;
- stateless business logic;
- policy hierarchy and composition;
- Specification pattern;
- repository interaction rules;
- transaction-boundary expectations;
- domain event interaction;
- authorization versus business-policy separation;
- anti-corruption expectations;
- testing guidance;
- anti-patterns;
- completion criteria.

This document does not define:

- HTTP controllers;
- transport DTOs;
- persistence implementation details;
- database transactions or ORM syntax;
- UI workflow behavior;
- deployment configuration;
- infrastructure retries;
- process orchestration outside the domain boundary.

---

## 3. Core Principle

Business behavior must live as close as possible to the domain object that owns the invariant.

The ownership order is:

1. Value Object, when the rule concerns validity or behavior of one conceptual value.
2. Entity, when the rule concerns one entity and does not require aggregate-wide authority.
3. Aggregate Root, when the rule protects aggregate consistency or lifecycle.
4. Domain Policy or Specification, when the rule is a named reusable decision predicate.
5. Domain Service, when the behavior is domain-significant but does not naturally belong to one aggregate.
6. Application Service, when the responsibility is orchestration rather than business meaning.
7. Infrastructure Service, when the responsibility is technical integration.

A Domain Service must never be the default destination for logic that is difficult to place.

---

## 4. Definitions

### 4.1 Domain Service

A Domain Service is a stateless domain-layer component that performs meaningful business behavior which:

- requires knowledge from more than one aggregate or domain concept;
- cannot be owned naturally by a single aggregate root;
- expresses business terminology;
- produces a domain decision, value, command result, or event intent;
- remains independent from transport and infrastructure concerns.

A Domain Service is not an application orchestrator and is not a repository wrapper.

### 4.2 Domain Policy

A Domain Policy is an explicit, named business rule that determines whether an action, transition, classification, or outcome is permitted, required, preferred, or prohibited.

A policy should answer a domain question such as:

- Is this learner eligible to unlock this skill?
- Must remediation be assigned?
- May this mastery state advance?
- Which progression path is appropriate?
- Does this mentorship reward qualify?

A policy expresses decision authority, not workflow execution.

### 4.3 Specification

A Specification is a composable predicate that evaluates whether a candidate satisfies a business condition.

A Specification:

- returns a deterministic result;
- has no side effects;
- may be composed using AND, OR, and NOT;
- should use domain language;
- may return structured reasons in addition to a boolean result.

### 4.4 Application Service

An Application Service coordinates a use case. It may:

- load aggregates;
- invoke aggregate behavior;
- invoke Domain Services or Policies;
- persist changed aggregates;
- publish committed events;
- define transaction scope;
- map failures into application results.

It must not become the owner of domain rules.

### 4.5 Infrastructure Service

An Infrastructure Service implements technical capabilities such as:

- database access;
- external API integration;
- message delivery;
- clock access;
- randomness;
- storage;
- analytics transport.

Infrastructure services may support domain execution through ports, but they do not define business truth.

---

## 5. Aggregate Versus Domain Service Ownership

### 5.1 Logic belongs in an Aggregate when

- it changes aggregate state;
- it enforces an aggregate invariant;
- it validates an aggregate lifecycle transition;
- it requires private aggregate data;
- it emits events representing aggregate state changes;
- the aggregate has sufficient information to decide safely.

Examples:

- recording a learning attempt;
- advancing a mastery status;
- rejecting an invalid lifecycle transition;
- consuming an allowed retry;
- closing a mentorship session.

### 5.2 Logic belongs in a Domain Service when

- multiple aggregates contribute facts to one business decision;
- no aggregate has legitimate authority over the complete decision;
- the operation produces a domain result without directly owning persistence;
- the rule is stable domain behavior rather than use-case sequencing;
- duplicating the behavior across aggregates would create inconsistency.

Examples:

- evaluating progression readiness from mastery, prerequisite, and curriculum facts;
- selecting an appropriate remediation route from several domain signals;
- calculating mentorship reward eligibility across completed activity and account policy;
- resolving a learning-path recommendation from multiple independent domain facts.

### 5.3 Logic does not belong in a Domain Service when

- one aggregate already owns the invariant;
- the logic only maps request data;
- the logic coordinates repositories and transactions;
- the logic sends notifications;
- the logic formats UI output;
- the logic calls an external API directly;
- the logic exists only to avoid adding a method to an aggregate.

---

## 6. Domain Service Characteristics

Every Domain Service must be:

- stateless between invocations;
- deterministic for the same domain inputs;
- named using domain language;
- free of HTTP, ORM, UI, and framework dependencies;
- explicit about required facts;
- explicit about produced decisions or results;
- testable without a running database;
- safe to invoke more than once when inputs are unchanged.

A Domain Service may depend on:

- Value Objects;
- immutable domain facts;
- aggregate snapshots or read-only domain views;
- Domain Policies;
- Specifications;
- domain ports whose semantics are business-relevant.

A Domain Service must not retain mutable request-specific state.

---

## 7. Service Inputs and Outputs

### 7.1 Inputs

Inputs should be domain types rather than primitive bags.

Preferred:

```ts
interface ProgressionEvaluationInput {
  learnerId: LearnerId;
  targetSkill: SkillRef;
  mastery: MasterySnapshot;
  prerequisites: PrerequisiteStatus;
  curriculumContext: CurriculumContext;
}
```

Avoid:

```ts
function evaluate(data: any): boolean;
```

### 7.2 Outputs

Outputs should communicate business meaning.

Preferred output forms include:

- Decision objects;
- Result types;
- Value Objects;
- recommendations with reasons;
- policy verdicts;
- event intents that still require aggregate acceptance.

Example:

```ts
type ProgressionDecision =
  | {
      outcome: 'ALLOW';
      targetSkill: SkillRef;
      reasons: readonly ProgressionReason[];
    }
  | {
      outcome: 'REQUIRE_REMEDIATION';
      remediationSkills: readonly SkillRef[];
      reasons: readonly ProgressionReason[];
    }
  | {
      outcome: 'DENY';
      reasons: readonly ProgressionReason[];
    };
```

A boolean result is acceptable only for truly simple Specifications. Important policies should return structured reasons.

---

## 8. Domain Policy Model

### 8.1 Policy Responsibilities

A Domain Policy may determine:

- eligibility;
- transition permission;
- required intervention;
- classification;
- priority;
- recommendation;
- reward qualification;
- threshold satisfaction;
- exception applicability.

### 8.2 Policy Naming

Policy names must identify the business question.

Preferred:

- `SkillUnlockPolicy`
- `MasteryAdvancementPolicy`
- `RemediationRequirementPolicy`
- `MentorshipRewardEligibilityPolicy`
- `CurriculumProgressionPolicy`

Avoid generic names such as:

- `RuleService`
- `ValidationHelper`
- `PolicyManager`
- `BusinessLogicService`
- `CommonPolicy`

### 8.3 Policy Result

A policy verdict should normally contain:

- outcome;
- reason codes;
- supporting facts or evidence references;
- optional recommended next action;
- policy version when decisions must be auditable.

Example:

```ts
interface PolicyVerdict<TOutcome, TReason> {
  outcome: TOutcome;
  reasons: readonly TReason[];
  evaluatedAt: DomainTimestamp;
  policyVersion: PolicyVersion;
}
```

The timestamp must be supplied as an explicit input or through an approved Clock port. Policies must not call the system clock implicitly.

---

## 9. Policy Hierarchy

Policies should be organized into clear levels.

### 9.1 Invariant Policy

Protects a rule that must never be violated.

Examples:

- mastery cannot advance without required evidence;
- a closed mentorship session cannot accept new activity;
- a skill cannot depend on itself.

Invariant policies are mandatory and cannot be overridden by convenience settings.

### 9.2 Eligibility Policy

Determines whether an actor or aggregate qualifies for an action or outcome.

Examples:

- learner qualifies to unlock a skill;
- mentor qualifies for reward credit;
- learner qualifies for accelerated progression.

### 9.3 Progression Policy

Determines movement through a learning path or lifecycle.

Examples:

- continue current skill;
- unlock next skill;
- assign prerequisite recovery;
- permit above-grade advancement.

### 9.4 Intervention Policy

Determines when assistance or remediation is required.

Examples:

- repeated failure requires remediation;
- prolonged inactivity requires review;
- confidence deterioration requires diagnostic reassessment.

### 9.5 Recommendation Policy

Produces a preferred option without creating an invariant.

Recommendations may be overridden by an authorized use case when the domain contract permits it. Overrides must be explicit and auditable.

---

## 10. Policy Composition

Complex decisions should be assembled from smaller named policies or Specifications.

Example conceptual composition:

```text
SkillUnlockPolicy
  = PrerequisitesSatisfied
  AND MinimumMasteryEvidenceSatisfied
  AND CurriculumConstraintSatisfied
  AND LearnerAccountActive
```

Composition rules:

- each component must have one clear meaning;
- composition order must not affect the result unless priority is explicitly part of the policy;
- failure reasons must remain traceable to the originating component;
- mandatory invariant policies must not be bypassed by recommendation policies;
- composed policies must define conflict resolution.

### 10.1 AND Composition

All component conditions must pass.

### 10.2 OR Composition

At least one permitted alternative must pass.

### 10.3 NOT Composition

The candidate must not satisfy the prohibited condition.

### 10.4 Ordered Decision Composition

Use only when policy precedence is itself a domain rule.

Example:

1. hard invariant denial;
2. safety or integrity restriction;
3. remediation requirement;
4. normal progression;
5. optional recommendation.

Ordered policies must document precedence explicitly.

---

## 11. Specification Pattern

### 11.1 Contract

A basic Specification may expose:

```ts
interface Specification<TCandidate, TReason> {
  evaluate(candidate: TCandidate): SpecificationResult<TReason>;
}

interface SpecificationResult<TReason> {
  satisfied: boolean;
  reasons: readonly TReason[];
}
```

### 11.2 Requirements

Specifications must:

- be side-effect free;
- avoid repository access where possible;
- consume complete domain facts;
- return stable reason codes;
- be independently testable;
- avoid mutation of the candidate;
- avoid throwing for normal business rejection.

### 11.3 When not to use a Specification

Do not create a Specification when:

- an aggregate method can express the rule clearly;
- the rule changes aggregate state;
- the condition is used only once and naming it adds no clarity;
- evaluation requires orchestration rather than a predicate;
- the result is a rich decision better represented by a Domain Policy.

---

## 12. Cross-Aggregate Coordination

### 12.1 Principle

An aggregate must not directly mutate another aggregate.

Cross-aggregate coordination is performed by an Application Service using Domain Services or Policies to decide what should happen.

Typical sequence:

1. Application Service loads required aggregates or immutable domain views.
2. Application Service constructs domain facts.
3. Domain Policy or Domain Service evaluates the business decision.
4. Application Service invokes behavior on the aggregate that owns each state change.
5. Application Service persists aggregates within the required consistency boundary.
6. Committed domain events trigger asynchronous follow-up where appropriate.

### 12.2 Strong Consistency

Use one transaction only when the business invariant truly requires atomic consistency across persisted changes.

Strong consistency must be justified by a named invariant.

### 12.3 Eventual Consistency

Use eventual consistency when:

- aggregates have independent transaction boundaries;
- follow-up behavior can be delayed;
- retries are acceptable;
- idempotent event handling is available;
- temporary projection lag does not violate an invariant.

### 12.4 Forbidden Coupling

A Domain Service must not:

- call `save()` on multiple repositories;
- start or commit transactions;
- coordinate distributed locks;
- perform retry loops;
- publish infrastructure messages directly;
- mutate unrelated aggregates internally.

Those responsibilities belong to the application or infrastructure layers.

---

## 13. Repository Interaction Rules

### 13.1 Preferred Model

Domain Policies and Domain Services should receive required facts as inputs after the Application Service loads them.

This keeps policy evaluation:

- deterministic;
- transparent;
- easy to test;
- independent of persistence;
- free from hidden query cost.

### 13.2 Domain Query Ports

A Domain Service may depend on a read-only domain port only when the queried fact is inherently part of the domain capability and cannot reasonably be supplied as a finite input.

Example:

```ts
interface SkillDependencyKnowledge {
  resolvePrerequisites(skill: SkillRef): Promise<readonly SkillRef[]>;
}
```

Requirements for a domain query port:

- the interface lives in the domain layer;
- naming expresses domain meaning, not storage mechanics;
- the port is read-only;
- the port does not expose ORM records;
- the service does not control transaction mechanics;
- tests use deterministic in-memory implementations.

### 13.3 Forbidden Repository Usage

Domain Services and Policies must not:

- import Prisma clients;
- depend on SQL concepts;
- use generic repository methods with untyped filters;
- query infrastructure tables directly;
- return persistence records;
- hide N+1 query behavior inside policy composition.

---

## 14. Transaction Boundaries

Domain Services do not own transaction boundaries.

The Application Service defines the transaction based on:

- aggregate consistency needs;
- repository contract;
- optimistic concurrency requirements;
- idempotency requirements;
- event publication strategy.

A Domain Service may produce a plan or decision that spans multiple changes, but the Application Service is responsible for applying that plan safely.

Example:

```ts
interface RemediationPlan {
  learnerAction: LearnerAction;
  masteryAction: MasteryAction;
  pathwayAction: PathwayAction;
  reasons: readonly RemediationReason[];
}
```

The plan does not mutate repositories. It describes intended domain consequences.

---

## 15. Domain Event Interaction

### 15.1 Aggregate Events

Only the aggregate that owns a state transition may emit the authoritative event for that transition.

A Domain Service may:

- recommend an event-producing action;
- return an event intent;
- derive a decision from historical domain facts;
- evaluate whether an event-triggered reaction is permitted.

A Domain Service must not fabricate an aggregate state-change event without the aggregate accepting and applying the transition.

### 15.2 Policy Evaluation from Events

An event handler in the application layer may:

1. receive a committed domain event;
2. load required facts;
3. invoke a Domain Policy;
4. invoke behavior on another aggregate;
5. persist the resulting change;
6. emit new authoritative domain events.

### 15.3 Idempotency

When policy-driven behavior is triggered by an event:

- the application handler must enforce idempotency;
- policies must remain deterministic;
- resulting aggregate commands should include correlation and causation identity where required;
- duplicate delivery must not create duplicate business effects.

---

## 16. Authorization Versus Business Policy

Authorization and domain eligibility are distinct.

### 16.1 Authorization

Authorization answers:

> Is this actor permitted to invoke this operation?

Examples:

- Is the actor authenticated?
- Does the actor belong to the account?
- Does the actor have the required role?
- May this teacher access this learner record?

Authorization usually belongs to application security or access-control boundaries.

### 16.2 Domain Policy

Domain Policy answers:

> Is this operation valid or appropriate according to business rules?

Examples:

- Has the learner satisfied prerequisites?
- Is there enough mastery evidence?
- Is remediation mandatory?
- Does this mentorship activity qualify for reward?

An authorized actor may still receive a domain-policy rejection.

A domain-qualified operation may still be denied by authorization.

The two decisions must not be collapsed into one generic `allowed` flag without distinct reasons.

---

## 17. Anti-Corruption Rules

External systems, curriculum sources, analytics providers, and payment systems must not leak foreign models into Domain Services or Policies.

An anti-corruption layer must translate external data into domain concepts before evaluation.

Examples:

- external grade codes become `GradeLevel`;
- external curriculum identifiers become `CurriculumRef`;
- payment statuses become domain-recognized account facts;
- analytics scores become validated `LearningEvidence` or `DiagnosticSignal` values.

Domain logic must not depend directly on:

- vendor response objects;
- external enum names;
- webhook payload structures;
- database column conventions;
- UI-specific labels.

---

## 18. Time, Randomness, and External Facts

### 18.1 Time

Policies that depend on time must receive a `DomainTimestamp` or an approved Clock port.

Forbidden:

```ts
new Date()
Date.now()
```

inside domain logic without an injected time source.

### 18.2 Randomness

If a domain decision legitimately requires randomness, the random source must be supplied through an explicit domain port and the resulting decision must remain reproducible for audit or test purposes.

Randomness must not be used to bypass clear business rules.

### 18.3 External Facts

External facts must be:

- validated;
- normalized;
- timestamped when freshness matters;
- converted into domain types;
- supplied explicitly to the policy or service.

---

## 19. Failure Semantics

Normal business rejection is not a technical exception.

Policies and Domain Services should return typed outcomes for expected conditions.

Examples:

- `PREREQUISITE_NOT_MASTERED`
- `INSUFFICIENT_EVIDENCE`
- `REMEDIATION_REQUIRED`
- `ACCOUNT_NOT_ELIGIBLE`
- `MENTORSHIP_REWARD_LIMIT_REACHED`

Exceptions are reserved for impossible or corrupted states such as:

- violated internal invariant caused by invalid construction;
- unsupported policy configuration;
- contradictory domain facts that should never coexist;
- missing mandatory domain knowledge that the caller contract promised.

Failure reason codes must be stable enough for application mapping and audit, but domain code must not contain HTTP status codes.

---

## 20. Versioning and Auditability

Policies whose decisions affect progression, remediation, rewards, or financial value should be versioned.

A decision record may include:

- policy name;
- policy version;
- evaluated facts or fact references;
- outcome;
- reason codes;
- evaluation timestamp;
- actor or process context where applicable;
- correlation and causation identifiers.

Policy versioning must not require old aggregate models to import current policy implementations. Historical decisions should be preserved as facts rather than recomputed silently using new rules.

---

## 21. Testing Strategy

### 21.1 Unit Tests

Every Domain Policy and Domain Service must have unit tests covering:

- happy path;
- each rejection reason;
- boundary values;
- conflicting conditions;
- empty or minimal evidence;
- repeated deterministic evaluation;
- policy composition;
- version-specific behavior when versioned.

### 21.2 Property and Invariant Tests

Use property-based or table-driven tests where rules have broad input ranges.

Examples:

- mastery below the mandatory threshold never unlocks a dependent skill;
- increasing valid evidence cannot reduce eligibility unless a named contrary rule applies;
- duplicate evidence identity does not increase counted evidence;
- a hard invariant denial always outranks a recommendation.

### 21.3 Integration Tests

Integration tests should verify:

- application orchestration loads the correct facts;
- repositories satisfy domain port contracts;
- transaction scope matches the invariant;
- committed events trigger policy evaluation once effectively;
- policy results are mapped correctly into aggregate commands.

Integration tests must not replace isolated domain tests.

### 21.4 Test Doubles

Use:

- immutable fixtures;
- in-memory domain-port implementations;
- fixed clocks;
- deterministic random sources;
- explicit aggregate builders.

Avoid mocks that assert implementation details rather than business outcomes.

---

## 22. Recommended Reference Structure

```text
src/
  modules/
    progression/
      domain/
        aggregates/
        entities/
        value-objects/
        events/
        services/
          evaluate-progression-readiness.ts
          build-remediation-plan.ts
        policies/
          skill-unlock-policy.ts
          mastery-advancement-policy.ts
        specifications/
          prerequisites-satisfied.spec.ts
          minimum-evidence-satisfied.spec.ts
        ports/
          skill-dependency-knowledge.ts
        results/
          progression-decision.ts
```

The exact folder structure may vary by module, but ownership must remain local to the bounded context.

Do not create a global shared `domain-services` or `policies` directory for workflow-specific behavior.

Only genuinely neutral primitives proven to be context-independent may be shared.

---

## 23. Example: Skill Unlock Decision

### 23.1 Inputs

- target skill;
- learner mastery snapshot;
- prerequisite status;
- curriculum constraints;
- account eligibility facts;
- evaluation timestamp.

### 23.2 Policy Components

- `PrerequisitesSatisfiedSpecification`
- `MinimumMasteryEvidenceSpecification`
- `CurriculumProgressionSpecification`
- `AccountLearningAccessSpecification`

### 23.3 Outcome

```ts
type SkillUnlockDecision =
  | {
      outcome: 'UNLOCK';
      reasons: readonly SkillUnlockReason[];
    }
  | {
      outcome: 'KEEP_LOCKED';
      reasons: readonly SkillUnlockReason[];
    }
  | {
      outcome: 'REQUIRE_REMEDIATION';
      remediationTargets: readonly SkillRef[];
      reasons: readonly SkillUnlockReason[];
    };
```

### 23.4 Ownership

- Policy decides eligibility.
- Application Service coordinates loading and invocation.
- Learning Path aggregate accepts or rejects the unlock transition.
- Aggregate emits the authoritative unlock event.
- Repository persists the aggregate.

---

## 24. Example: Mentorship Reward Eligibility

The policy may evaluate:

- mentorship session completion;
- verified learner participation;
- reward limit;
- duplicate reward prevention;
- account standing;
- reward-program version.

The policy returns eligibility and reasons.

It does not:

- credit the account directly;
- write a transaction row;
- send a notification;
- call a payment provider;
- start a database transaction.

The Application Service applies the decision to the reward or credit aggregate that owns the financial state change.

---

## 25. Example: Remediation Planning Service

A remediation planning service is justified when no single aggregate owns all required facts.

It may consider:

- failed skill evidence;
- prerequisite graph;
- prior remediation attempts;
- learner confidence trend;
- curriculum priority;
- intervention policy.

It may return:

- remediation targets;
- recommended sequence;
- required minimum evidence;
- escalation classification;
- decision reasons.

It must not update learner, mastery, pathway, or billing aggregates itself.

---

## 26. Anti-Patterns

### 26.1 Anemic Aggregate with God Service

Symptom:

- aggregates expose setters;
- one large Domain Service performs all transitions and validation.

Correction:

- move invariant-protecting behavior into aggregate methods;
- keep only truly cross-aggregate behavior in the service.

### 26.2 Repository Wrapper Service

Symptom:

- service only calls `find`, `save`, or `update` methods.

Correction:

- move orchestration to the Application Service;
- preserve repositories as explicit ports.

### 26.3 Generic Policy Engine

Symptom:

- rules stored as untyped strings or generic expressions;
- domain terminology disappears;
- runtime configuration can bypass invariants.

Correction:

- model important rules as typed policies and Specifications;
- version configuration-backed policies explicitly;
- keep hard invariants in code-owned domain authority.

### 26.4 Hidden Infrastructure Dependency

Symptom:

- Domain Service imports Prisma, HTTP clients, environment variables, or framework containers.

Correction:

- define a domain port or move the technical operation to application/infrastructure.

### 26.5 Boolean-Only Important Decisions

Symptom:

- `true` or `false` is returned for progression, remediation, or reward decisions.

Correction:

- return structured outcomes and stable reason codes.

### 26.6 Policy Mutates Aggregate

Symptom:

- policy both decides and changes aggregate state.

Correction:

- policy returns a verdict;
- aggregate method performs the transition.

### 26.7 Application Service Owns Business Thresholds

Symptom:

- thresholds and business branches appear directly in use-case orchestration.

Correction:

- move them into a named Domain Policy or Value Object.

### 26.8 Shared Common Policy Module

Symptom:

- unrelated modules depend on a generic shared policy library tied to one workflow.

Correction:

- keep policies owned by their bounded context;
- share only neutral primitives with proven stable semantics.

### 26.9 Implicit Time

Symptom:

- policy behavior changes based on `Date.now()` during tests or retries.

Correction:

- supply time explicitly.

### 26.10 Recomputing Historical Decisions

Symptom:

- old progression or reward decisions are recalculated using current policy rules.

Correction:

- preserve decision facts and policy version at decision time.

---

## 27. Review Checklist

For every proposed Domain Service, reviewers must ask:

- Does one aggregate already own this behavior?
- Is the behavior genuinely domain-significant?
- Is the service stateless?
- Are inputs expressed as domain types?
- Are outputs meaningful domain results?
- Is persistence orchestration outside the service?
- Are infrastructure dependencies absent?
- Are expected rejections typed rather than thrown?
- Is deterministic testing possible without a database?
- Is the service owned by one bounded context?

For every proposed Domain Policy, reviewers must ask:

- What precise business question does it answer?
- Is the policy mandatory, eligibility-based, intervention-based, or advisory?
- Are precedence and conflicts defined?
- Are reasons structured and stable?
- Is policy versioning required?
- Is evaluation free of side effects?
- Does the aggregate still own the authoritative state transition?

---

## 28. Completion Criteria

18G is complete when all of the following are true:

- Domain Service and Domain Policy are formally distinguished.
- Aggregate ownership rules are explicit.
- Cross-aggregate coordination rules are explicit.
- Domain Services are defined as stateless and infrastructure-independent.
- Policy hierarchy and composition are defined.
- Specification contracts and usage boundaries are defined.
- Repository interaction is limited to explicit domain-oriented read ports where justified.
- Transaction ownership remains in the application layer.
- Domain event interaction preserves aggregate authority.
- Authorization and business eligibility are separated.
- Time, randomness, and external facts are explicit inputs or ports.
- Failure semantics use typed domain outcomes.
- Versioning and audit expectations are defined.
- Testing requirements cover deterministic unit and integration behavior.
- Anti-patterns are documented.
- Module ownership prevents workflow-specific shared coupling.

---

## 29. Architectural Decision Summary

Math Learning World adopts the following durable rules:

1. Aggregates own invariants and authoritative state transitions.
2. Domain Policies own named business decisions.
3. Specifications own reusable side-effect-free predicates.
4. Domain Services own domain-significant behavior that cannot naturally belong to one aggregate.
5. Application Services own use-case orchestration and transaction boundaries.
6. Repositories expose persistence ports but do not define business truth.
7. Infrastructure implements technical capabilities behind explicit boundaries.
8. Cross-aggregate consistency must be justified, explicit, and coordinated outside aggregates.
9. Domain decisions must be deterministic, explainable, and testable.
10. Domain behavior remains local to its bounded context unless a primitive is genuinely neutral and proven safe to share.

These rules preserve domain authority, reduce accidental coupling, and provide a stable foundation for progression, mastery, remediation, mentorship, curriculum, and reward capabilities across Math Learning World.
