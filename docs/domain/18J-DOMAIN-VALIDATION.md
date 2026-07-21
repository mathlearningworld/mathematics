# 18J — Domain Validation

## 1. Purpose

This document defines the architectural contract for Domain Validation in Math Learning World.

Domain Validation protects the truth of the domain. It ensures that aggregates, entities, value objects, policies, specifications, and state transitions cannot represent or produce states that violate the meaning of the learning model.

This document is the Source of Truth for:

- what Domain Validation means;
- where validation belongs;
- which rules are domain invariants;
- how validation differs across value objects, entities, aggregates, policies, specifications, application inputs, and infrastructure;
- when validation must reject an operation;
- how failures are modeled and explained;
- how validation participates in creation, mutation, transition, reconstitution, and persistence;
- how deterministic and testable validation is maintained;
- which validation anti-patterns are forbidden.

The purpose is not to add defensive checks everywhere. The purpose is to place each rule at the boundary that owns its meaning and to make invalid domain state unrepresentable wherever practical.

---

## 2. Scope

This document covers:

- Domain Validation definition
- Validation ownership
- Domain invariants
- Value Object validation
- Entity validation
- Aggregate validation
- Creation validation
- Mutation validation
- State-transition validation
- Policy validation
- Specification-based validation
- Cross-aggregate validation
- Reconstitution validation
- Persistence-boundary validation
- Domain event validation
- Validation result modeling
- Stable failure codes
- Failure accumulation vs fail-fast behavior
- Determinism
- Time-sensitive validation
- Authorization-adjacent rules
- Validation composition
- Validation testing
- Observability boundaries
- Performance considerations
- Math Learning World validation catalog
- Anti-patterns
- Completion criteria

This document does not define:

- HTTP request parsing;
- transport schema syntax;
- UI form validation behavior;
- database constraint implementation;
- ORM validation decorators;
- API error serialization;
- authentication mechanism details;
- infrastructure retry policy;
- presentation-layer localization.

Those concerns may reflect domain failures, but they do not own domain truth.

---

## 3. Definition

Domain Validation is the evaluation of domain facts, proposed changes, or reconstructed state against rules that must hold for the domain model to remain meaningful and internally consistent.

A rule is Domain Validation when violating it would make the model false, contradictory, unsafe, or semantically invalid regardless of which user interface, API, database, or integration initiated the operation.

Examples include:

- a mastery score must remain within its defined range;
- a learning attempt cannot be completed before it starts;
- a skill cannot depend on itself;
- a learner cannot unlock a pathway when required prerequisite mastery is absent;
- a closed remediation cycle cannot accept another attempt;
- a mentorship credit grant cannot be negative;
- an aggregate transition must follow its lifecycle graph.

Domain Validation answers:

> Can this domain object, fact, or operation exist truthfully in the current domain context?

---

## 4. Core Principle

> Validation belongs where the rule has authority.

A rule must be enforced by the smallest domain boundary that can fully own and evaluate it.

Examples:

- format and range intrinsic to one concept belong in a Value Object;
- consistency between fields of one entity belongs in the Entity;
- consistency across aggregate members belongs in the Aggregate Root;
- reusable decision logic requiring supplied domain facts belongs in a Specification or Policy;
- coordination requiring multiple aggregates belongs in a Domain Service or application orchestration using domain rules;
- transport shape belongs outside the domain.

Validation must not be pushed outward merely because an outer layer has easier access to the data.

---

## 5. Validation Objectives

Domain Validation must achieve all of the following:

1. prevent invalid domain state from being created;
2. prevent valid state from transitioning into invalid state;
3. make rejection reasons explicit and stable;
4. preserve aggregate invariants across every public behavior;
5. support deterministic testing;
6. avoid coupling domain rules to transport, persistence, or UI concerns;
7. preserve explainability for learners, parents, teachers, mentors, and operators;
8. distinguish malformed input from valid input that violates a business rule;
9. provide reusable rules without duplicating domain meaning;
10. remain auditable as curriculum and mastery policy evolve.

---

## 6. Validation Taxonomy

Math Learning World recognizes the following validation categories.

### 6.1 Structural Validation

Structural Validation checks whether required domain facts are present and structurally representable.

Examples:

- required identity is present;
- a non-empty collection contains at least one member;
- a dependency edge has both source and target skill identifiers;
- a mastery window has a start and end boundary.

Structural validity does not imply business validity.

### 6.2 Intrinsic Validation

Intrinsic Validation checks rules belonging entirely to one concept.

Examples:

- percentage lies between 0 and 100;
- grade level is within the supported curriculum range;
- attempt count is a non-negative integer;
- locale code is one of the supported domain values.

Intrinsic rules usually belong in Value Objects.

### 6.3 Relational Validation

Relational Validation checks relationships between facts inside one entity or aggregate.

Examples:

- `completedAt` cannot precede `startedAt`;
- a pathway target cannot also appear as its own prerequisite;
- minimum mastery threshold cannot exceed excellence threshold;
- remaining remediation attempts cannot exceed allocated attempts.

### 6.4 Lifecycle Validation

Lifecycle Validation checks whether an operation is legal in the current state.

Examples:

- an active attempt may be completed;
- a completed attempt may not be completed again;
- a locked pathway may be unlocked only after eligibility is satisfied;
- an archived skill may not receive new curriculum mappings.

### 6.5 Eligibility Validation

Eligibility Validation checks whether a subject qualifies for an operation.

Examples:

- learner eligibility for a mission;
- mentor eligibility for credit;
- teacher eligibility to verify a classroom milestone;
- skill eligibility for publication.

Eligibility is often expressed through Specifications or Policies.

### 6.6 Consistency Validation

Consistency Validation checks whether a set of facts agrees with the authoritative model.

Examples:

- a progress record references the same learner and skill as the attempt being applied;
- an event aggregate ID matches the aggregate emitting it;
- a reconstituted aggregate version matches its event or persistence metadata;
- curriculum mapping subject agrees with the mapped skill subject.

### 6.7 Temporal Validation

Temporal Validation checks rules involving time.

Examples:

- an attempt cannot start in the impossible future relative to the supplied authoritative clock;
- a verification window must still be open;
- a cooldown must have elapsed;
- a learning streak date must follow the previously recorded date according to the domain calendar.

Temporal validation must use an explicit clock or supplied timestamp. It must not read system time implicitly inside domain logic.

### 6.8 Quantitative Validation

Quantitative Validation checks counts, scores, limits, balances, and thresholds.

Examples:

- credit balance cannot become negative;
- score cannot exceed the maximum possible score;
- required evidence count must be satisfied;
- mastery confidence must remain within its valid range.

### 6.9 Semantic Validation

Semantic Validation checks whether a fact means what it claims to mean.

Examples:

- a “mastered” skill must satisfy the mastery policy;
- a “remediation completed” state requires closure evidence;
- a “parent verified” milestone requires a valid verifier relationship;
- a “curriculum prerequisite” must represent an allowed dependency type.

---

## 7. Validation Ownership Hierarchy

Validation ownership follows this order:

1. Value Object
2. Entity
3. Aggregate Root
4. Specification or Policy
5. Domain Service
6. Application Service
7. Infrastructure
8. Presentation

The list is not a sequence in which every rule must pass. It is a decision hierarchy for locating authority.

A lower item must not duplicate a rule already authoritatively enforced by a higher domain boundary, except for non-authoritative early feedback or technical safety.

Example:

- UI may indicate that a mastery percentage should be between 0 and 100;
- API schema may reject a non-number;
- `MasteryPercentage` remains the authoritative owner of the 0–100 invariant.

---

## 8. Invariants

An invariant is a rule that must always hold for a domain object whenever it is observable outside its internal operation.

### 8.1 Invariant Properties

A valid invariant must be:

- domain meaningful;
- consistently enforceable;
- independent of transport representation;
- testable;
- explicit enough to name;
- stable enough to receive a failure code when externally relevant.

### 8.2 Invariant Timing

Invariants must hold:

- after factory creation;
- after every successful public mutation;
- after every successful lifecycle transition;
- after reconstitution completes;
- before persistence is authorized;
- before domain events describing the new state are released.

Temporary internal inconsistency is permitted only within one atomic method execution and must never escape through a callback, event, repository write, or returned reference.

### 8.3 Local and Global Invariants

A local invariant can be evaluated using one object or aggregate.

A global invariant requires facts outside the aggregate boundary.

Local invariants must be enforced by the owning object.

Global invariants must not cause an aggregate to reach into repositories. Required external facts must be supplied by the application layer, a Domain Service, Policy context, or Specification context.

---

## 9. Value Object Validation

Value Objects are the preferred boundary for intrinsic validation.

A Value Object constructor or factory must reject invalid values immediately.

Examples:

- `MasteryScore`
- `ConfidenceLevel`
- `AttemptNumber`
- `CreditAmount`
- `GradeLevel`
- `SkillCode`
- `CurriculumCode`
- `LearningDuration`
- `EvidenceCount`
- `ProgressPercentage`

### 9.1 Value Object Rule

> A Value Object instance is proof that its intrinsic invariant has already been satisfied.

Callers must not repeatedly check the same range or format after a valid Value Object exists.

### 9.2 Value Object Failure

Value Object creation should return or throw a domain-recognized failure according to the project’s established result convention.

Failure must identify:

- stable code;
- field or concept when relevant;
- rejected value metadata when safe;
- human-readable domain explanation;
- optional structured parameters for localization.

### 9.3 Forbidden Value Object Behavior

A Value Object must not:

- silently clamp an invalid value unless clamping is explicitly part of the domain concept;
- silently substitute a default for invalid input;
- depend on repositories;
- read current system time;
- perform network calls;
- mutate after creation;
- accept an invalid sentinel state such as `UNKNOWN` merely to avoid validation.

---

## 10. Entity Validation

Entity Validation owns rules involving the entity’s identity, fields, and lifecycle that do not require aggregate-wide authority.

Examples:

- a learning attempt start time precedes completion time;
- an evidence item cannot be attached twice under the same entity identity;
- a mentorship event cannot have the same account as mentor and beneficiary when self-mentoring is forbidden;
- an assessment item maximum score must be positive.

An Entity must expose behavior, not unrestricted setters.

Bad:

```text
attempt.status = COMPLETED
attempt.completedAt = now
```

Required:

```text
attempt.complete(result, completedAt)
```

The behavior method validates the transition and updates all related facts atomically.

---

## 11. Aggregate Validation

The Aggregate Root is the authoritative guardian of invariants spanning aggregate members.

Examples:

- only one active attempt may exist for a learner-skill cycle when that is the modeled rule;
- a pathway cannot contain duplicate prerequisite links;
- progress status must agree with mastery evidence;
- credit transaction application must preserve balance and ledger consistency;
- a remediation plan cannot close while mandatory activities remain incomplete.

### 11.1 Aggregate Entry Rule

All state-changing operations from outside the aggregate must enter through the Aggregate Root.

External code must not mutate child entities or collections directly.

### 11.2 Aggregate Validation Sequence

A state-changing aggregate behavior should generally follow this sequence:

1. confirm command identity and target consistency;
2. validate current lifecycle state;
3. validate supplied value objects;
4. evaluate operation-specific rules;
5. calculate proposed state;
6. validate aggregate-wide invariants;
7. apply state atomically;
8. record domain events;
9. return success result.

No domain event should be recorded for a rejected mutation.

### 11.3 Postcondition Validation

For critical aggregate behavior, an explicit internal invariant assertion may run after mutation during tests or controlled runtime modes.

Postcondition assertions must not replace precondition validation. They are a safety net, not the primary rule engine.

---

## 12. Creation Validation

Creation validation ensures that a newly created domain object begins in a valid lifecycle state.

Creation must validate:

- identity availability and format;
- required facts;
- initial status;
- initial child entities;
- initial collections;
- initial timestamps;
- initial version;
- creation policy eligibility;
- initial event correctness.

A Factory must return either:

- a complete valid object; or
- an explicit failure.

It must not return a partially initialized object that requires callers to finish validation later.

Creation validation is defined further in `18I-DOMAIN-FACTORIES.md`.

---

## 13. Mutation Validation

Every public mutation must validate the proposed change in the context of current state.

Mutation validation must distinguish:

- malformed or intrinsically invalid value;
- operation not permitted in current lifecycle state;
- proposed value identical to existing value;
- conflict with another aggregate member;
- external eligibility not satisfied;
- optimistic concurrency conflict, which belongs at the persistence boundary rather than domain validation.

### 13.1 No-op Operations

The domain must explicitly define whether a no-op is:

- successful and idempotent;
- rejected as already applied;
- ignored without event emission;
- translated into a stable domain result.

This choice must be operation-specific and documented.

### 13.2 Atomicity

A rejected mutation must leave the aggregate unchanged.

Implementation must avoid mutating state before all rejecting checks complete unless rollback is guaranteed inside the same encapsulated method.

---

## 14. State-Transition Validation

Lifecycle state transitions require explicit validation.

A transition is valid only when:

1. the current state permits the target state;
2. required evidence is present;
3. required thresholds are satisfied;
4. required actors or verification facts are supplied;
5. transition time is valid;
6. transition-specific invariants hold.

### 14.1 Transition Graph

Each lifecycle-bearing aggregate must define an allowed transition graph.

Example:

```text
NOT_STARTED -> ACTIVE
ACTIVE -> COMPLETED
ACTIVE -> ABANDONED
COMPLETED -> VERIFIED
COMPLETED -> REMEDIATION_REQUIRED
REMEDIATION_REQUIRED -> ACTIVE
VERIFIED -> ARCHIVED
```

The example is illustrative. The authoritative graph belongs to the relevant aggregate lifecycle document.

### 14.2 Illegal Transition Failure

Illegal transitions must produce a stable code such as:

```text
LEARNING_ATTEMPT_NOT_ACTIVE
PATHWAY_ALREADY_UNLOCKED
REMEDIATION_PLAN_ALREADY_CLOSED
MASTERY_NOT_ELIGIBLE_FOR_VERIFICATION
```

Generic codes such as `INVALID_STATE` should be avoided when a stable domain meaning can be named.

---

## 15. Validation and Specifications

Specifications answer whether a candidate satisfies a reusable domain predicate.

Validation may use a Specification when:

- the rule is reusable across multiple operations;
- the rule can be expressed as a side-effect-free predicate;
- the rule benefits from composition;
- the same eligibility decision is needed for querying and behavior, subject to the distinction between behavioral and repository specifications.

Examples:

- `LearnerEligibleForMissionSpecification`
- `SkillMasterySatisfiedSpecification`
- `RemediationRequiredSpecification`
- `MentorCreditEligibleSpecification`
- `PathwayUnlockableSpecification`

A Specification result may be adapted into a Validation Failure, but a Specification must not mutate the candidate.

The Specification architecture is defined in `18H-DOMAIN-SPECIFICATIONS.md`.

---

## 16. Validation and Policies

A Policy decides how domain rules apply under a named business context.

Validation should use a Policy when the result depends on configurable or contextual business decisions such as:

- mastery threshold by curriculum or age band;
- remediation trigger threshold;
- evidence sufficiency rules;
- mentorship reward eligibility;
- repeated-attempt escalation;
- parent-verification requirement.

A Policy must receive all required facts explicitly.

A Policy must not fetch configuration, repositories, or current time internally.

Policy output should be explicit, for example:

```text
MasteryDecision
RemediationDecision
UnlockDecision
CreditEligibilityDecision
```

Each decision should state:

- accepted or rejected;
- decision code;
- evaluated thresholds;
- relevant measured values;
- explanation parameters.

---

## 17. Cross-Aggregate Validation

An aggregate must not directly load another aggregate to validate itself.

Cross-aggregate validation must be coordinated by:

- an Application Service;
- a Domain Service;
- a Policy supplied with snapshots or facts;
- a Specification supplied with a context;
- a process manager where the rule spans time and multiple operations.

### 17.1 Fact Snapshot Rule

External aggregate information should be supplied as immutable domain facts or snapshots containing only what the rule requires.

Example:

```text
LearnerMasterySnapshot
PrerequisiteCompletionSnapshot
MentorRelationshipSnapshot
CurriculumEligibilityContext
```

Passing full mutable aggregates unnecessarily increases coupling and risks hidden mutation.

### 17.2 Freshness

The Application Layer owns obtaining facts with the freshness required by the use case.

The Domain Layer owns evaluating those facts.

When stale facts are a material risk, the command or decision context must carry version, observed-at time, or evidence identity so the application and persistence boundaries can detect conflict.

---

## 18. Reconstitution Validation

Reconstitution rebuilds an existing domain object from trusted persistence data or historical events.

Reconstitution is not new creation, but it must not permit impossible domain state to enter runtime silently.

### 18.1 Reconstitution Modes

The project recognizes two conceptual modes:

- strict reconstitution;
- diagnostic reconstitution.

Strict reconstitution rejects invalid persisted state and prevents normal operation.

Diagnostic reconstitution may collect detailed corruption evidence for migration, repair, or audit tooling. It must not expose the invalid object as a normal valid aggregate.

### 18.2 Reconstitution Checks

Reconstitution should validate:

- aggregate identity;
- required fields;
- enum and lifecycle values;
- child identity uniqueness;
- collection consistency;
- version validity;
- timestamp ordering;
- state-dependent required data;
- invariant consistency;
- event sequence consistency when event sourced.

### 18.3 Reconstitution Failure

A reconstitution failure is not automatically a user-caused domain rejection. It may indicate:

- corrupted persistence;
- incompatible migration;
- obsolete data model;
- invalid historical writer;
- manual database modification;
- software defect.

It should be classified separately for operational handling while preserving the violated domain invariant.

---

## 19. Persistence-Boundary Validation

The repository and persistence layer must preserve domain integrity but must not become the sole owner of domain rules.

Database constraints are encouraged for defense in depth, including:

- unique keys;
- non-null columns;
- foreign keys;
- check constraints;
- optimistic version constraints;
- immutable ledger protections.

However:

> A database constraint is not a substitute for domain validation.

The domain should reject invalid intent before persistence whenever the rule is known at the domain boundary.

Persistence-specific failures must be mapped carefully:

- optimistic conflict -> concurrency failure;
- uniqueness conflict representing a domain invariant -> stable conflict result;
- foreign-key failure -> likely application or integrity defect unless a modeled race exists;
- check constraint failure -> integrity defect if the domain should have rejected earlier.

---

## 20. Domain Event Validation

A Domain Event states that a valid domain fact occurred.

Before an event is recorded, validate:

- event type matches the operation;
- aggregate type and ID match the emitter;
- event timestamp is supplied by the operation context;
- event payload contains required facts;
- event version ordering is correct;
- no sensitive or unnecessary data is included;
- the state change has succeeded.

An invalid event payload must not be emitted merely because aggregate mutation succeeded. Event creation is part of the same atomic domain operation.

Events must not be used as a substitute for validating the aggregate state that produced them.

---

## 21. Validation Result Model

Validation must use an explicit result model for expected business rejection.

A recommended conceptual model is:

```text
ValidationResult
  valid: boolean
  failures: ValidationFailure[]
```

A failure contains:

```text
ValidationFailure
  code
  category
  messageKey
  path?
  parameters?
  severity?
  ruleId?
```

The exact code representation may vary by implementation, but domain meaning must remain stable.

### 21.1 Failure Fields

#### Code

A stable machine-readable identifier.

#### Category

Examples:

- INTRINSIC
- INVARIANT
- LIFECYCLE
- ELIGIBILITY
- CONSISTENCY
- TEMPORAL
- CONFLICT
- RECONSTITUTION

#### Message Key

A localization-neutral key used outside the domain to render a user-facing explanation.

#### Path

An optional domain path such as:

```text
masteryScore
attempt.completedAt
prerequisites[skillId]
```

Paths must describe domain concepts, not transport JSON structure unless they happen to align.

#### Parameters

Structured facts required to explain the failure, such as:

```text
minimumRequired: 80
actual: 72
skillId: ALGEBRA_LINEAR_EQUATIONS
```

Parameters must not expose secrets or unnecessary personal data.

#### Severity

Severity is optional and should be used only when the domain distinguishes blocking errors from warnings or review-required outcomes.

Warnings must never allow an invariant violation.

---

## 22. Stable Failure Codes

Failure codes are part of the domain contract.

They must be:

- explicit;
- stable;
- uniquely meaningful;
- independent of wording;
- independent of transport status codes;
- testable;
- suitable for analytics without exposing personal data.

Examples:

```text
MASTERY_SCORE_OUT_OF_RANGE
MASTERY_THRESHOLD_NOT_REACHED
PREREQUISITE_SKILL_NOT_MASTERED
LEARNING_ATTEMPT_ALREADY_COMPLETED
LEARNING_ATTEMPT_END_BEFORE_START
REMEDIATION_PLAN_NOT_ACTIVE
REMEDIATION_EVIDENCE_INCOMPLETE
MENTORSHIP_SELF_REWARD_FORBIDDEN
MENTOR_CREDIT_AMOUNT_INVALID
PATHWAY_CONTAINS_DUPLICATE_SKILL
SKILL_DEPENDENCY_SELF_REFERENCE
CURRICULUM_MAPPING_GRADE_MISMATCH
DOMAIN_STATE_RECONSTITUTION_FAILED
```

Forbidden vague codes include:

```text
INVALID
BAD_REQUEST
VALIDATION_ERROR
RULE_FAILED
UNKNOWN_ERROR
```

A generic outer code may group failures, but each domain failure should retain its specific identity.

---

## 23. Exception vs Expected Failure

Expected business rejection should use explicit domain results rather than exceptional control flow where practical.

Examples of expected failure:

- threshold not reached;
- transition not allowed;
- prerequisite missing;
- credit not eligible;
- duplicate domain member.

Exceptions are appropriate for:

- programming defects;
- impossible internal state;
- corrupted reconstitution data when no result boundary exists;
- violated method contract that callers cannot recover from normally.

The project must not use one generic exception type for all expected validation outcomes.

---

## 24. Fail-Fast vs Failure Accumulation

Both fail-fast and accumulation are valid when used intentionally.

### 24.1 Fail-Fast

Use fail-fast when:

- later checks depend on an earlier valid fact;
- the first failure determines the operation outcome;
- evaluating further rules is expensive or unsafe;
- lifecycle rejection makes all later checks irrelevant.

Example:

```text
if attempt is not ACTIVE, do not evaluate completion evidence.
```

### 24.2 Accumulation

Use accumulation when:

- rules are independent;
- callers benefit from correcting multiple issues together;
- validating a complete creation command;
- diagnostic reconstitution or administrative review is occurring.

### 24.3 Ordering

When failures are accumulated, ordering must be deterministic.

Recommended order:

1. structural;
2. intrinsic;
3. identity consistency;
4. lifecycle;
5. relational;
6. eligibility;
7. policy;
8. invariant postconditions.

---

## 25. Determinism

Domain Validation must be deterministic.

Given the same:

- domain state;
- command facts;
- policy configuration;
- specification context;
- clock value;
- identity and sequence inputs;

the validation result must be identical.

Validation must not directly depend on:

- system clock;
- random number generation;
- network state;
- environment variables;
- process-local mutable configuration;
- unordered iteration with unstable output ordering;
- database queries hidden inside the rule.

Required nondeterministic facts must be supplied explicitly.

---

## 26. Time-Sensitive Validation

Time-sensitive rules must use a domain-recognized instant supplied to the operation.

Bad:

```text
if Date.now() > deadline
```

Required conceptually:

```text
validateAt(deadline, evaluationTime)
```

The application layer obtains `evaluationTime` from an authoritative clock and passes it into the domain operation.

All checks and events in one operation should use the same captured instant unless the domain explicitly models multiple times.

Time zones and school calendar boundaries must be represented explicitly where domain meaning requires them.

---

## 27. Authorization-Adjacent Rules

Authentication and technical authorization belong outside the domain, but some actor rules are domain rules.

Examples of technical authorization:

- bearer token is valid;
- caller has API scope;
- session is authenticated.

Examples of domain authorization:

- only the learner’s linked parent may verify this milestone;
- only an assigned teacher may approve this classroom evidence;
- only a qualifying mentor relationship may earn mentorship credit;
- only the owner of a learning plan may abandon it.

The application layer resolves authenticated identity and permissions. The domain evaluates actor relationship facts required by the business rule.

---

## 28. Validation Composition

Validation rules may be composed when composition preserves clarity and ownership.

Conceptual operators include:

- all rules must pass;
- any rule may pass;
- rule negation;
- conditional rule;
- dependent rule sequence.

Composition must not create an anonymous rule maze.

Each externally meaningful rule should retain:

- a name;
- stable code;
- ownership;
- test coverage;
- explanation.

Reusable predicates should normally be Specifications. Configurable decisions should normally be Policies.

---

## 29. Validation Pipeline

A typical application-to-domain validation pipeline is:

```text
Transport parsing
  -> Application command validation
  -> Identity and tenant resolution
  -> Load aggregate and required external facts
  -> Construct validated Value Objects
  -> Evaluate Specifications and Policies
  -> Invoke aggregate behavior
  -> Aggregate validates lifecycle and invariants
  -> Record domain events
  -> Persist with optimistic concurrency
  -> Map domain result to transport response
```

Each stage has distinct authority.

The pipeline must not collapse all rules into one DTO validator.

---

## 30. Application Validation vs Domain Validation

Application Validation checks whether a use case can be orchestrated correctly.

Examples:

- required command field exists;
- target aggregate can be located;
- authenticated actor context is available;
- idempotency key format is present;
- requested operation belongs to the selected tenant or workspace.

Domain Validation checks whether the intended operation is valid in the domain.

Examples:

- attempt may be completed;
- mastery threshold is satisfied;
- evidence is sufficient;
- mentor relationship qualifies for reward.

The Application Layer may stop invalid commands early, but it must not become the sole authority for domain invariants.

---

## 31. Transport Validation vs Domain Validation

Transport Validation checks representation.

Examples:

- JSON is well formed;
- field is a string rather than an array;
- numeric syntax is parseable;
- maximum request size is respected.

Domain Validation checks meaning.

Example:

- transport confirms `score` is numeric;
- `MasteryScore` confirms the numeric value is allowed;
- mastery policy decides whether the score is sufficient.

Transport errors may map to HTTP 400. Domain failures may map differently depending on semantics. HTTP status mapping is not defined by the domain.

---

## 32. UI Validation vs Domain Validation

UI validation improves usability but is never authoritative.

UI may:

- disable impossible actions;
- display threshold hints;
- validate input before submission;
- show all correctable fields at once;
- explain why a mission remains locked.

However, every authoritative rule must still be enforced behind the UI boundary because:

- clients may be stale;
- requests may bypass the UI;
- concurrent state may change;
- integrations may use different interfaces.

---

## 33. Infrastructure Validation vs Domain Validation

Infrastructure Validation protects technical contracts.

Examples:

- database connection is available;
- serialized payload conforms to storage schema;
- foreign key target exists;
- event bus envelope is valid;
- file storage checksum matches.

Infrastructure must not decide domain meaning such as mastery, eligibility, remediation, or progression.

When an infrastructure constraint mirrors a domain invariant, the domain remains the primary semantic owner.

---

## 34. Math Learning World Validation Catalog

The following catalog identifies expected validation ownership. It is a baseline and may evolve through approved domain changes.

### 34.1 Learner

Rules include:

- learner identity is valid;
- learner profile grade level is supported;
- current learning stage is consistent with selected curriculum context;
- linked parent or guardian relationship is not duplicated;
- learner account cannot be its own guardian.

### 34.2 Skill

Rules include:

- skill code is valid and unique at persistence authority;
- title and semantic identity are present;
- skill cannot depend on itself;
- prerequisite links are unique;
- dependency types are supported;
- archived skill cannot accept new active mappings;
- mastery policy reference is compatible with skill type.

### 34.3 Curriculum Mapping

Rules include:

- curriculum exists as supplied authoritative fact;
- subject and grade are supported;
- mapping points to a valid skill identity;
- required mastery level is valid;
- duplicate active mapping is forbidden;
- effective period boundaries are ordered;
- national curriculum version is explicit.

### 34.4 Learning Attempt

Rules include:

- attempt number is positive;
- start time is valid;
- completion follows start;
- active attempt can be completed once;
- submitted answer set belongs to the attempt activity;
- score cannot exceed available score;
- evidence identity is unique;
- abandoned attempt cannot later complete without an explicit restoration rule.

### 34.5 Skill Progress

Rules include:

- learner and skill identity remain immutable;
- evidence applied to progress belongs to the same learner and skill;
- attempt application is idempotent;
- mastery value is valid;
- status agrees with mastery decision;
- progress cannot regress when policy forbids regression;
- history entry version follows current version.

### 34.6 Mastery

Rules include:

- score and confidence values are valid;
- minimum evidence count is satisfied;
- recency window is satisfied where required;
- prerequisite mastery is satisfied;
- verification requirement is satisfied;
- mastery declaration is produced by authoritative policy;
- manual override carries actor, reason, and audit facts.

### 34.7 Learning Pathway

Rules include:

- target skill is defined;
- pathway nodes are unique;
- dependency graph is acyclic where the model requires a DAG;
- prerequisite ordering is valid;
- unlock operation requires eligibility;
- completed node cannot be reopened without an explicit remediation transition;
- pathway completion requires all mandatory nodes.

### 34.8 Mission

Rules include:

- mission objective is explicit;
- mission activities reference compatible skills;
- required activity count is positive;
- unlock requirements are satisfied;
- active mission cannot be activated again;
- completion evidence meets mission policy;
- reward cannot be granted twice.

### 34.9 Remediation Plan

Rules include:

- remediation reason is explicit;
- target weaknesses are present;
- required activities are non-empty;
- plan starts only from an eligible learning state;
- attempt limits are valid;
- completed or closed plan cannot accept activity results;
- closure requires required evidence;
- escalation is triggered according to policy.

### 34.10 Mentorship

Rules include:

- mentor and learner are distinct where self-mentoring is forbidden;
- relationship is active during the event;
- mentoring activity qualifies under policy;
- evidence is present;
- reward event is idempotent;
- credit amount is positive;
- daily or period limits are not exceeded;
- beneficiary and account ownership are consistent.

### 34.11 Credits

Rules include:

- amount is valid;
- currency or credit type is supported;
- balance cannot fall below allowed minimum;
- transaction reference is unique;
- debit and credit direction agree with transaction type;
- reversal references an existing reversible transaction;
- a transaction cannot be reversed twice;
- ledger sequence remains ordered.

### 34.12 Verification

Rules include:

- verifier relationship qualifies;
- evidence belongs to the learner and milestone;
- verification window is open;
- verification has not already been finalized;
- rejection includes a reason where required;
- actor cannot verify a prohibited self-authored record.

---

## 35. Graph Validation

Skill dependencies and learning pathways may form graphs.

Graph validation must explicitly define:

- whether cycles are forbidden;
- whether disconnected nodes are allowed;
- whether multiple paths to one skill are allowed;
- whether duplicate edges are allowed;
- edge direction semantics;
- maximum practical traversal depth;
- behavior when referenced nodes are archived.

Cycle detection and topology checks may be implemented in a Domain Service when the graph spans multiple aggregates or a large catalog.

The service must operate on supplied graph facts rather than querying infrastructure directly.

---

## 36. Numeric and Precision Validation

Scores, percentages, confidence, durations, and credits require explicit precision rules.

The domain must define:

- allowed scale;
- rounding mode;
- minimum and maximum;
- comparison semantics;
- whether equality at a threshold passes;
- whether values are stored as integers, decimals, or rational representations.

Floating-point ambiguity must not determine mastery or credit outcomes accidentally.

Threshold decisions should use Value Objects or decimal-safe domain representations.

---

## 37. Idempotency and Validation

Idempotency is not merely a transport concern when repeating a domain command could duplicate a domain fact.

Validation must help prevent duplicate application of:

- attempt results;
- mastery evidence;
- reward grants;
- credit transactions;
- verification decisions;
- pathway unlock events;
- remediation completion.

Idempotency identity should be explicit, such as:

```text
commandId
evidenceId
attemptId
rewardReference
transactionReference
verificationId
```

The domain may recognize an already-applied fact, while durable race protection belongs to persistence and application coordination.

---

## 38. Concurrency and Validation

Domain Validation evaluates a supplied state snapshot. It does not guarantee that the state remains current until persistence.

Optimistic concurrency is required where concurrent writes could invalidate the decision.

The sequence is:

1. load aggregate version;
2. validate and execute behavior;
3. persist using expected version;
4. reject or retry on conflict according to application policy.

A concurrency conflict is not evidence that domain validation was unnecessary. It means a valid decision was based on a state that lost authority before commit.

---

## 39. Explainability

Validation failures should support meaningful explanation without embedding presentation language in the domain.

For learning decisions, explainability is essential.

A failure such as `MASTERY_THRESHOLD_NOT_REACHED` should expose enough structured facts to explain:

- current result;
- required threshold;
- missing evidence count;
- prerequisite status;
- recommended next domain action where defined.

The Domain Layer provides facts and codes. The Presentation Layer chooses language, tone, and localization.

Explainability must not reveal hidden assessment answers, private learner information, or exploitable anti-cheating details.

---

## 40. Observability Boundary

Domain Validation must not log directly to infrastructure sinks.

The domain may return structured failures and record domain events. Outer layers may produce:

- metrics;
- traces;
- audit logs;
- support diagnostics;
- analytics.

Observability must preserve:

- failure code;
- aggregate type;
- operation type;
- correlation identity;
- safe rule metadata.

It should avoid recording raw learner answers or sensitive personal data unless explicitly required and protected.

---

## 41. Performance Considerations

Validation correctness takes priority, but rules should be designed efficiently.

Guidelines:

- do not repeat intrinsic checks already guaranteed by Value Objects;
- avoid hidden repository calls per rule;
- supply precomputed immutable facts for cross-aggregate evaluation;
- use sets or maps for duplicate detection where appropriate;
- define graph traversal limits;
- cache immutable policy configuration outside the domain object while supplying it explicitly;
- separate expensive diagnostic validation from normal mutation validation when safe;
- preserve deterministic failure ordering.

Performance optimization must not weaken invariants.

---

## 42. Security Considerations

Validation must not trust external identifiers, actor claims, or ownership facts merely because they arrived in a command.

The Application Layer must establish authoritative actor and tenant context.

The Domain Layer then validates business relationships using those trusted facts.

Failures should avoid exposing:

- existence of unauthorized resources;
- secret policy details;
- hidden assessment answers;
- private learner relationships;
- internal database identity.

Security-driven response redaction occurs outside the domain, but domain failure structures should support safe mapping.

---

## 43. Validation Testing Strategy

Validation requires focused tests at the owning boundary.

### 43.1 Value Object Tests

Test:

- valid boundaries;
- values immediately below and above boundaries;
- normalization rules;
- equality;
- serialization contract where relevant;
- stable failure code.

### 43.2 Entity Tests

Test:

- valid behavior;
- illegal state transition;
- relational field invariants;
- no partial mutation on rejection;
- idempotent behavior where defined.

### 43.3 Aggregate Tests

Test:

- aggregate-wide invariant enforcement;
- child uniqueness;
- state transition graph;
- event emission on success;
- no event on failure;
- version and timestamp behavior;
- externally supplied facts;
- deterministic failure ordering.

### 43.4 Specification Tests

Test:

- satisfied candidate;
- unsatisfied candidate;
- boundary cases;
- AND, OR, and NOT composition;
- explanation result;
- side-effect freedom.

### 43.5 Policy Tests

Test:

- every threshold boundary;
- policy configuration variants;
- deterministic decision output;
- evaluated facts included in decision;
- no infrastructure dependency.

### 43.6 Reconstitution Tests

Test:

- valid persisted state;
- missing required fields;
- illegal lifecycle state;
- duplicate children;
- version inconsistency;
- timestamp inconsistency;
- corruption classification.

### 43.7 Property-Based Tests

Property-based testing is recommended for:

- score and percentage ranges;
- credit arithmetic;
- graph acyclicity;
- event ordering;
- lifecycle transition closure;
- Value Object round trips;
- invariant preservation across random valid operation sequences.

### 43.8 Mutation Testing

Critical validation rules should be suitable for mutation testing to detect tests that pass even when comparison operators, boundaries, or rejection branches are altered.

---

## 44. Test Naming

Test names should express domain behavior.

Good:

```text
rejects_mastery_when_required_evidence_is_missing
prevents_completion_when_attempt_is_not_active
allows_pathway_unlock_at_exact_mastery_threshold
rejects_self_referencing_skill_dependency
preserves_credit_balance_when_debit_is_rejected
```

Weak:

```text
validation_test_1
returns_false
throws_error
works_correctly
```

---

## 45. Anti-Patterns

### 45.1 DTO Validator as Domain Authority

Putting all rules in request schemas leaves non-HTTP flows unprotected.

### 45.2 Validation Only in UI

Clients are not authoritative and may be bypassed or stale.

### 45.3 Validation Only in Database

Database errors are too late and often cannot express domain explanation clearly.

### 45.4 Public Setters

Public setters allow callers to bypass lifecycle and relational validation.

### 45.5 Boolean-Only Failure

Returning only `false` removes domain meaning and explainability.

### 45.6 Generic Validation Exception

One generic exception for every rule destroys stable contracts.

### 45.7 Hidden Repository Access

A validator that queries repositories hides dependencies, reduces determinism, and couples domain logic to infrastructure.

### 45.8 Implicit System Time

Reading current time inside validation makes tests unstable and operations internally inconsistent.

### 45.9 Silent Correction

Silently clamping, defaulting, removing duplicates, or rewriting invalid facts can hide upstream defects and change user intent.

### 45.10 Partial Mutation Before Rejection

Changing some aggregate fields before all checks pass can leave invalid state after failure.

### 45.11 Duplicate Rule Ownership

Copying the same rule across UI, DTO, service, aggregate, and database without one declared authority causes drift.

### 45.12 Validation God Service

A single global validator containing every rule erases aggregate boundaries and creates coupling.

### 45.13 Primitive Obsession

Passing raw numbers and strings everywhere forces repeated checks and weakens guarantees.

### 45.14 Validation by Comments

A comment saying “must be positive” is not enforcement.

### 45.15 Catch-and-Ignore

Ignoring validation failures or replacing them with defaults corrupts domain truth.

### 45.16 Event Before Validation

Recording or publishing an event before the state change is accepted creates false history.

### 45.17 Reconstitution Bypass Without Integrity Check

A private constructor may bypass creation rules, but reconstitution still requires invariant verification.

---

## 46. Validation Design Checklist

For every new rule, answer:

1. What domain truth does the rule protect?
2. Which boundary owns that truth?
3. Is the rule intrinsic, relational, lifecycle, eligibility, temporal, quantitative, or semantic?
4. Can invalid state be made unrepresentable with a Value Object?
5. Does the rule require only one aggregate?
6. Does it require supplied external facts?
7. Is it reusable enough to become a Specification?
8. Is it configurable enough to become a Policy?
9. What stable failure code represents rejection?
10. Should evaluation fail fast or accumulate failures?
11. What exact boundary values require tests?
12. Is time or randomness explicit?
13. Can rejection occur without partial mutation?
14. Does successful validation lead to an event?
15. Does persistence need a defensive constraint?
16. Can the result be explained safely?

---

## 47. Reference Validation Flow: Completing a Learning Attempt

Conceptual flow:

```text
Application receives CompleteLearningAttempt command
  -> validates command structure
  -> resolves authenticated learner and tenant
  -> loads LearningAttempt aggregate
  -> constructs Score and CompletionTime value objects
  -> loads required policy configuration and evidence facts
  -> calls attempt.complete(...)
      -> validates attempt is ACTIVE
      -> validates completion time follows start time
      -> validates score is compatible with activity maximum
      -> validates evidence identity and uniqueness
      -> updates state atomically
      -> records LearningAttemptCompleted event
  -> repository persists with expected version
  -> application maps result
```

The aggregate does not parse JSON, authenticate tokens, query policy tables, or choose HTTP status codes.

---

## 48. Reference Validation Flow: Unlocking a Pathway

Conceptual flow:

```text
Application loads pathway
Application gathers mastery and prerequisite snapshots
Application supplies unlock policy and evaluation time
Pathway evaluates unlock specification
  -> target is currently locked
  -> prerequisite skills are mastered
  -> minimum evidence is satisfied
  -> remediation block is absent
  -> curriculum context is compatible
Pathway applies unlock transition
Pathway records PathwayUnlocked event
Repository persists with expected version
```

A rejected unlock returns explicit unmet conditions without changing pathway state.

---

## 49. Reference Validation Flow: Mentorship Credit

Conceptual flow:

```text
Application resolves mentor, learner, account, and relationship facts
Application loads credit account aggregate
Mentorship policy evaluates qualifying activity
  -> mentor differs from learner
  -> relationship was active
  -> evidence qualifies
  -> reward reference has not been used
  -> period reward cap is not exceeded
Credit account grants validated amount
Ledger entry is added atomically
MentorshipCreditGranted event is recorded
Repository persists with concurrency protection
```

The policy decides eligibility. The credit aggregate protects balance and ledger invariants.

---

## 50. Migration and Legacy Data

When introducing stricter validation to legacy data:

1. inventory existing invalid states;
2. define whether each state is corrupt, obsolete, or previously valid;
3. create diagnostic validation tooling;
4. define repair or migration rules explicitly;
5. preserve audit history;
6. avoid silently coercing data during normal reads;
7. activate strict reconstitution only after migration readiness;
8. add persistence constraints after data is repaired;
9. monitor new failures by stable code.

Legacy compatibility must not permanently weaken new domain invariants without an explicit versioned rule.

---

## 51. Versioned Validation Rules

Curriculum, mastery, and remediation rules may evolve.

When historical interpretation depends on the rule version, the domain must preserve relevant version identity.

Examples:

- curriculum version;
- mastery policy version;
- assessment scoring version;
- remediation policy version;
- mentorship reward policy version.

A historical decision should remain explainable under the rule version used at the time.

Do not recalculate historical truth under new policy silently unless the business process explicitly requires re-evaluation.

---

## 52. Documentation Requirements

Every significant validation rule must document:

- rule name;
- owner;
- invariant or policy statement;
- input facts;
- success condition;
- failure code;
- lifecycle applicability;
- event impact;
- persistence defense where relevant;
- tests;
- versioning implications.

Rules with learner progression impact must additionally document explainability facts and any remediation consequence.

---

## 53. Completion Criteria

Domain Validation architecture is complete when:

- validation ownership is explicit;
- intrinsic invalid state is prevented by Value Objects where practical;
- entities protect their own relational and lifecycle rules;
- aggregates protect all aggregate-wide invariants;
- all public mutations are atomic on rejection;
- state transitions have explicit allowed paths;
- external facts are supplied rather than fetched by the domain;
- reusable predicates are modeled as Specifications;
- configurable decisions are modeled as Policies;
- expected rejection uses stable domain failures;
- reconstitution validates persisted integrity;
- time and nondeterminism are explicit;
- domain events are emitted only after successful validation;
- database constraints provide defense in depth;
- tests cover boundaries, transitions, failures, and invariant preservation;
- anti-patterns in this document are absent;
- Math Learning World validation catalog is represented in implementation or approved implementation plans.

---

## 54. Chapter 18 Closure

With this document, Chapter 18 defines the complete Domain Layer architecture for Math Learning World:

- 18A — Domain Model
- 18B — Aggregates
- 18C — Entities
- 18D — Value Objects
- 18E — Domain Events
- 18F — Repository Contracts
- 18G — Domain Services and Policies
- 18H — Domain Specifications
- 18I — Domain Factories
- 18J — Domain Validation

Together, these documents establish the Domain Layer as the authoritative model of learning truth, lifecycle, mastery, progression, remediation, mentorship, credits, and curriculum relationships.

The Chapter 18 documentation set is complete when all documents are present, internally consistent, reviewed against the Product Blueprint and Product Contract, and adopted as implementation authority.

---

## 55. Final Rule

> Invalid domain state must not be representable, persistable, or publishable through an accepted domain operation.

Validation is not a peripheral utility. It is the enforcement mechanism that keeps the model truthful.
