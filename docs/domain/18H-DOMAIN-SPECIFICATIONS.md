# 18H — Domain Specifications

## 1. Purpose

This document defines the architectural contract for Domain Specifications in Math Learning World.

A Domain Specification expresses a reusable business predicate in the domain language. It answers a focused question such as:

- Is this learner eligible to attempt this challenge?
- Has this skill reached the minimum mastery threshold?
- Can this learning path be unlocked?
- Does this remediation plan satisfy the learner's current needs?
- Is this mentor relationship valid for this learning activity?

Specifications exist to prevent business rules from becoming duplicated, scattered, infrastructure-dependent, or hidden inside orchestration code.

This document is the source of truth for:

- what qualifies as a Domain Specification,
- where specifications belong,
- how they are composed,
- how they interact with aggregates, policies, services, and repositories,
- how they are tested,
- and which patterns are forbidden.

---

## 2. Scope

This document covers:

- specification semantics,
- specification interfaces,
- atomic specifications,
- composite specifications,
- aggregate-local specifications,
- cross-aggregate specifications,
- repository query specifications,
- validation specifications,
- eligibility specifications,
- progression specifications,
- mastery specifications,
- remediation specifications,
- mentorship specifications,
- specification evaluation context,
- failure explanation,
- testing strategy,
- naming conventions,
- anti-patterns,
- implementation guidance,
- completion criteria.

This document does not replace:

- aggregate invariants,
- domain policies,
- domain services,
- authorization checks,
- transport validation,
- persistence constraints,
- application use-case orchestration.

---

## 3. Core Definition

A Domain Specification is a domain object that encapsulates a business predicate.

Conceptually:

```ts
Specification<T>.isSatisfiedBy(candidate: T): boolean
```

A useful specification has five properties:

1. It represents a meaningful domain question.
2. It has stable business semantics.
3. It can be named using domain language.
4. It can be tested independently.
5. It does not depend directly on framework or transport concerns.

Examples:

```ts
MinimumMasteryReachedSpecification
LearningPathUnlockableSpecification
LearnerEligibleForChallengeSpecification
RemediationRequiredSpecification
MentorAssignmentAllowedSpecification
```

Non-examples:

```ts
RequestBodyIsValidSpecification
DatabaseRowExistsSpecification
JwtTokenIsValidSpecification
ButtonShouldBeEnabledSpecification
```

The non-examples are technical or presentation predicates, not domain specifications.

---

## 4. Architectural Role

Specifications provide a reusable vocabulary for business decisions.

Without specifications, the same rule often appears in multiple places:

- aggregate methods,
- application services,
- route handlers,
- repository queries,
- UI conditionals,
- background jobs,
- tests.

That creates drift.

For example, the rule "a learner may unlock the next skill only when all mandatory prerequisites meet their minimum mastery threshold" must not be independently reimplemented in six different modules.

Instead, the rule should be modeled once as a named domain specification and reused where appropriate.

Specifications therefore provide:

- explicit business meaning,
- rule reuse,
- consistency,
- composability,
- testability,
- reduced duplication,
- clearer architecture boundaries.

---

## 5. Specification Contract

The minimum specification contract is:

```ts
export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}
```

For Math Learning World, a richer result is usually preferable:

```ts
export type SpecificationFailure = {
  code: string;
  message: string;
  metadata?: Readonly<Record<string, unknown>>;
};

export type SpecificationResult =
  | { satisfied: true }
  | {
      satisfied: false;
      failures: readonly SpecificationFailure[];
    };

export interface ExplainableSpecification<T> {
  evaluate(candidate: T): SpecificationResult;
}
```

Boolean evaluation is sufficient when only the decision matters.

Explainable evaluation is required when the caller needs to understand why the rule failed, for example:

- learner progress feedback,
- parent dashboards,
- teacher diagnosis,
- remediation planning,
- audit evidence,
- domain event payloads.

---

## 6. Boolean vs Explainable Specifications

### 6.1 Boolean Specification

Use when:

- only yes/no matters,
- failure reasons are not surfaced,
- the rule is simple,
- the rule participates in repository filtering.

Example:

```ts
class ActiveSkillSpecification implements Specification<Skill> {
  isSatisfiedBy(skill: Skill): boolean {
    return skill.status === 'ACTIVE';
  }
}
```

### 6.2 Explainable Specification

Use when:

- learners need actionable feedback,
- multiple failure reasons may coexist,
- downstream policy decisions depend on specific failures,
- evidence must be retained.

Example:

```ts
class LearnerEligibleForChallengeSpecification
  implements ExplainableSpecification<ChallengeEligibilityContext> {
  evaluate(context: ChallengeEligibilityContext): SpecificationResult {
    const failures: SpecificationFailure[] = [];

    if (!context.prerequisitesSatisfied) {
      failures.push({
        code: 'PREREQUISITES_NOT_MASTERED',
        message: 'Mandatory prerequisite skills are not yet mastered.',
      });
    }

    if (context.challengeStatus !== 'AVAILABLE') {
      failures.push({
        code: 'CHALLENGE_NOT_AVAILABLE',
        message: 'The challenge is not currently available.',
      });
    }

    return failures.length === 0
      ? { satisfied: true }
      : { satisfied: false, failures };
  }
}
```

---

## 7. Atomic Specifications

An atomic specification represents one indivisible business predicate.

Examples:

- mastery score is at or above threshold,
- skill is active,
- learner has completed prerequisite assessment,
- mentorship relationship is active,
- remediation attempt count exceeds policy threshold.

Atomic specifications should be:

- focused,
- deterministic,
- side-effect free,
- named by business meaning,
- independently testable.

Good:

```ts
MinimumMasteryReachedSpecification
```

Too broad:

```ts
LearnerCanDoEverythingSpecification
```

Too technical:

```ts
ProgressPercentageGreaterThanOrEqualToSpecification
```

Prefer business meaning over implementation detail.

---

## 8. Composite Specifications

Specifications may be combined using logical operators.

Supported composition operators:

- AND,
- OR,
- NOT.

Conceptually:

```ts
specA.and(specB)
specA.or(specB)
specA.not()
```

A common abstraction is:

```ts
abstract class CompositeSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other);
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other);
  }

  not(): Specification<T> {
    return new NotSpecification(this);
  }
}
```

Composite specifications are useful when rules share reusable parts.

Example:

```ts
const unlockable = activeSkill
  .and(prerequisitesMastered)
  .and(notAlreadyCompleted);
```

Composition must not become unreadable. When a composed rule carries important business meaning, create a named specification around the composition.

Prefer:

```ts
LearningPathUnlockableSpecification
```

Over exposing a long chain everywhere:

```ts
active.and(prerequisites).and(levelAllowed).and(notLocked).and(...)
```

---

## 9. AND Semantics

An AND specification is satisfied only when all child specifications are satisfied.

For explainable specifications, failure handling should normally accumulate all child failures rather than stop at the first failure.

Example:

```ts
class AndSpecification<T> implements ExplainableSpecification<T> {
  constructor(
    private readonly left: ExplainableSpecification<T>,
    private readonly right: ExplainableSpecification<T>,
  ) {}

  evaluate(candidate: T): SpecificationResult {
    const leftResult = this.left.evaluate(candidate);
    const rightResult = this.right.evaluate(candidate);

    const failures = [
      ...(leftResult.satisfied ? [] : leftResult.failures),
      ...(rightResult.satisfied ? [] : rightResult.failures),
    ];

    return failures.length === 0
      ? { satisfied: true }
      : { satisfied: false, failures };
  }
}
```

Failure accumulation is especially valuable for learner-facing diagnosis.

---

## 10. OR Semantics

An OR specification is satisfied when at least one child specification is satisfied.

For explainable evaluation:

- if one branch succeeds, the result succeeds,
- if all branches fail, failures may be accumulated,
- the final failure should preserve branch meaning.

Example domain rule:

A learner may access enrichment content when either:

- the current grade threshold is mastered, or
- a teacher has approved early advancement.

```ts
const enrichmentAccess = gradeThresholdMastered.or(
  teacherApprovedEarlyAdvancement,
);
```

---

## 11. NOT Semantics

A NOT specification inverts the result of another specification.

Use NOT sparingly.

Good:

```ts
new NotSpecification(new LearningPathLockedSpecification())
```

Better when business language exists:

```ts
LearningPathAvailableSpecification
```

Avoid double negatives because they reduce readability.

Poor:

```ts
NotNotEligibleSpecification
```

---

## 12. Aggregate-Local Specifications

An aggregate-local specification evaluates information already owned by one aggregate.

Examples:

- whether a learner skill progress aggregate has reached mastery,
- whether a mentorship aggregate is active,
- whether a challenge attempt can be finalized,
- whether a learning pathway is complete.

Aggregate-local specifications must not load data from repositories.

They receive either:

- the aggregate,
- a domain snapshot,
- or a small immutable evaluation context.

Example:

```ts
class SkillMasteredSpecification
  implements Specification<SkillProgress> {
  constructor(private readonly threshold: MasteryThreshold) {}

  isSatisfiedBy(progress: SkillProgress): boolean {
    return progress.masteryScore.meets(this.threshold);
  }
}
```

If the rule protects an invariant during state transition, the aggregate remains the final authority.

A specification may help express the rule, but the aggregate must enforce it.

---

## 13. Cross-Aggregate Specifications

A cross-aggregate specification evaluates a business rule requiring information from more than one aggregate.

Examples:

- learner eligibility based on learner state, skill state, and curriculum requirement,
- mentorship eligibility based on mentor status and learner relationship,
- remediation requirement based on current mastery and attempt history,
- pathway unlock based on multiple prerequisite progress records.

Cross-aggregate specifications must not silently query repositories themselves.

Preferred pattern:

1. Application layer loads required aggregates or projections.
2. Application layer creates an immutable domain evaluation context.
3. Specification evaluates the context.
4. Application layer coordinates the resulting action.

Example:

```ts
export type PathwayUnlockContext = Readonly<{
  pathway: LearningPathway;
  prerequisiteProgress: readonly SkillProgressSnapshot[];
  learnerGrade: GradeLevel;
  teacherApproval?: TeacherApproval;
}>;
```

Then:

```ts
class LearningPathUnlockableSpecification
  implements ExplainableSpecification<PathwayUnlockContext> {
  evaluate(context: PathwayUnlockContext): SpecificationResult {
    // Pure business evaluation only.
  }
}
```

This keeps repository access and transaction control outside the domain specification.

---

## 14. Specification Evaluation Context

A specification context is an immutable domain-oriented data structure containing exactly the information needed to evaluate a rule.

Contexts should:

- use domain names,
- avoid HTTP/request terminology,
- avoid ORM models,
- avoid mutable collections,
- contain only relevant data,
- preserve value-object semantics where possible.

Good:

```ts
export type ChallengeEligibilityContext = Readonly<{
  learnerId: LearnerId;
  challenge: ChallengeSnapshot;
  prerequisiteMastery: readonly SkillMasterySnapshot[];
  activeRestrictions: readonly LearningRestriction[];
}>;
```

Poor:

```ts
export type EligibilityContext = {
  req: Request;
  prisma: PrismaClient;
  body: any;
  rows: any[];
};
```

---

## 15. Specification vs Aggregate Invariant

An aggregate invariant is a rule that must always hold for an aggregate to remain valid.

A specification is a reusable predicate that may support decisions.

The difference is authority.

Example invariant:

- A finalized challenge attempt cannot accept new answers.

This must be enforced inside the ChallengeAttempt aggregate.

Example specification:

- A learner is eligible to start a challenge.

This may depend on curriculum, mastery, restrictions, and availability.

Rule:

> Specifications may express invariant logic, but they do not remove the aggregate's responsibility to enforce its own invariants.

Never rely on a caller remembering to evaluate a specification before invoking an aggregate method.

---

## 16. Specification vs Domain Policy

A Domain Policy answers:

- What business decision should be made?
- Which outcome should be selected?
- What threshold or strategy applies?

A Specification answers:

- Is this condition satisfied?

Example:

```ts
RemediationRequiredSpecification
```

Determines whether remediation is required.

```ts
RemediationPlanSelectionPolicy
```

Determines which remediation plan should be selected.

A policy may use one or more specifications.

A specification should not become a hidden policy engine returning many unrelated decisions.

---

## 17. Specification vs Domain Service

A Domain Service performs domain behavior that does not naturally belong to one aggregate or value object.

A Specification evaluates a predicate.

Example:

```ts
LearnerEligibleForChallengeSpecification
```

returns whether eligibility is satisfied.

```ts
ChallengeAssignmentService
```

may coordinate the domain operation of assigning an eligible challenge.

A Domain Service may invoke a specification.

A specification must remain side-effect free and must not execute the assignment.

---

## 18. Specification vs Value Object

A Value Object represents a domain concept with identity defined by its value.

A Specification evaluates whether a candidate satisfies a rule.

Examples of Value Objects:

- MasteryScore,
- MasteryThreshold,
- GradeLevel,
- AttemptCount,
- LearningDuration.

Examples of Specifications:

- MinimumMasteryReachedSpecification,
- GradeEligibleSpecification,
- AttemptLimitExceededSpecification.

Specifications should use value objects instead of primitive obsession.

Prefer:

```ts
progress.masteryScore.meets(threshold)
```

Over:

```ts
progress.score >= 0.8
```

---

## 19. Eligibility Specifications

Eligibility specifications determine whether an actor or aggregate is permitted by domain rules to begin or receive an activity.

Examples:

- LearnerEligibleForChallengeSpecification,
- LearnerEligibleForMentorshipSpecification,
- SkillEligibleForPracticeSpecification,
- PathwayEligibleForUnlockSpecification.

Eligibility specifications must not be confused with authorization.

Authorization asks:

- Is this actor allowed to invoke this use case?

Eligibility asks:

- Does the domain state allow this action?

Both checks may be required.

---

## 20. Mastery Specifications

Mastery specifications express whether learning evidence satisfies a mastery rule.

Examples:

- MinimumMasteryReachedSpecification,
- StableMasteryReachedSpecification,
- MasteryEvidenceSufficientSpecification,
- MasteryDecayRequiresReviewSpecification.

A mastery rule may consider:

- score,
- evidence count,
- recency,
- consistency,
- prerequisite coverage,
- assessment type,
- confidence.

Do not reduce mastery to one percentage if the product model requires richer evidence.

Example context:

```ts
export type MasteryEvaluationContext = Readonly<{
  score: MasteryScore;
  evidenceCount: EvidenceCount;
  lastEvidenceAt: DomainTimestamp;
  requiredThreshold: MasteryThreshold;
  requiredEvidenceCount: EvidenceCount;
}>;
```

---

## 21. Progression Specifications

Progression specifications determine whether a learner may advance.

Examples:

- NextSkillUnlockableSpecification,
- GradeThresholdSatisfiedSpecification,
- PathwayCompletionSpecification,
- AboveGradeAdvancementAllowedSpecification.

Progression specifications should preserve the product principle:

- learners may advance beyond grade level when ready,
- learners must not skip critical foundations without evidence,
- missing foundations should create remediation paths rather than invisible failure.

A progression specification should explain unmet requirements in domain language.

Example failure codes:

```ts
PREREQUISITE_SKILL_NOT_MASTERED
MINIMUM_EVIDENCE_NOT_REACHED
FOUNDATION_GAP_DETECTED
REQUIRED_ASSESSMENT_INCOMPLETE
```

---

## 22. Remediation Specifications

Remediation specifications determine whether additional support is required.

Examples:

- RemediationRequiredSpecification,
- RepeatedRemediationRequiredSpecification,
- ParentReviewRecommendedSpecification,
- TeacherInterventionRecommendedSpecification.

Possible inputs:

- repeated failed attempts,
- regression after prior mastery,
- prerequisite gaps,
- excessive hint dependence,
- low confidence,
- long inactivity,
- inconsistency across evidence types.

Specifications should identify the condition.

Policies should decide the response.

For example:

```ts
RepeatedRemediationRequiredSpecification
```

may be used by:

```ts
RemediationEscalationPolicy
```

which selects self-practice, mentor help, parent review, or teacher intervention.

---

## 23. Mentorship Specifications

Mentorship specifications express business conditions for family or peer tutoring.

Examples:

- MentorEligibleSpecification,
- MentorAssignmentAllowedSpecification,
- MentorshipCreditEarnableSpecification,
- MentorshipSessionValidSpecification.

Rules may include:

- mentor relationship is active,
- mentor has sufficient mastery,
- learner and mentor are distinct accounts,
- session evidence exists,
- credit limits are respected,
- prohibited self-reward patterns are rejected.

These rules must not be hidden only in credit transaction code.

---

## 24. Repository Query Specifications

A query specification describes criteria for selecting domain records from a repository.

Example:

```ts
export type SkillProgressQuerySpecification = Readonly<{
  learnerId: LearnerId;
  skillIds?: readonly SkillId[];
  masteryState?: MasteryState;
  updatedBefore?: DomainTimestamp;
}>;
```

Repository query specifications may include:

- criteria,
- ordering,
- pagination,
- result limit,
- projection requirements.

However, query specifications must not expose ORM-specific constructs such as:

- Prisma where objects,
- SQL fragments,
- table names,
- database column names.

The repository adapter translates domain query specifications into infrastructure queries.

---

## 25. Behavioral vs Query Specifications

Behavioral specifications evaluate domain objects or contexts in memory.

Query specifications describe which persisted records are needed.

They are related but not identical.

Example behavioral specification:

```ts
MinimumMasteryReachedSpecification
```

Example query specification:

```ts
FindPrerequisiteProgressForLearnerSpecification
```

Do not force one abstraction to serve both purposes when semantics differ.

Recommended naming:

- `...Specification` for behavioral predicates,
- `...Query` or `...QuerySpecification` for repository selection criteria.

---

## 26. Validation Specifications

Validation specifications determine whether a domain candidate satisfies a business condition.

They may be used for:

- candidate acceptance,
- transition preconditions,
- plan validation,
- curriculum consistency,
- mentorship validity.

Validation specifications must not replace transport validation.

Transport validation checks:

- required fields,
- JSON shape,
- string format,
- primitive ranges.

Domain validation checks:

- business meaning,
- eligibility,
- state compatibility,
- domain consistency.

Example:

Transport validation:

```ts
masteryScore must be a number between 0 and 1
```

Domain specification:

```ts
MasteryEvidenceSufficientSpecification
```

---

## 27. Specification Results and Failure Codes

Failure codes are stable domain contracts.

They should be:

- machine-readable,
- domain-specific,
- transport-neutral,
- stable across UI changes.

Example:

```ts
export const SpecificationFailureCode = {
  PREREQUISITE_NOT_MASTERED: 'PREREQUISITE_NOT_MASTERED',
  MINIMUM_EVIDENCE_NOT_REACHED: 'MINIMUM_EVIDENCE_NOT_REACHED',
  PATHWAY_LOCKED: 'PATHWAY_LOCKED',
  REMEDIATION_REQUIRED: 'REMEDIATION_REQUIRED',
} as const;
```

Failure messages may be translated or adapted later.

Domain code must not depend on Thai or English presentation text.

---

## 28. Determinism

Specifications must be deterministic for the same input.

Forbidden hidden inputs include:

- current system clock,
- random values,
- global configuration,
- mutable singleton state,
- direct database reads,
- environment variables.

When time matters, pass time explicitly:

```ts
export type ReviewRequirementContext = Readonly<{
  lastMasteredAt: DomainTimestamp;
  evaluatedAt: DomainTimestamp;
  reviewInterval: LearningDuration;
}>;
```

This makes evaluation reproducible and testable.

---

## 29. Side-Effect Freedom

Specification evaluation must not:

- mutate aggregates,
- write repositories,
- publish events,
- send notifications,
- call external services,
- award credits,
- change progression state.

A specification observes and evaluates.

It does not act.

Actions belong to:

- aggregates,
- domain services,
- application services,
- event handlers.

---

## 30. Dependency Rules

A Domain Specification may depend on:

- entities,
- aggregates,
- value objects,
- domain snapshots,
- immutable domain contexts,
- other specifications.

A Domain Specification must not depend on:

- Express,
- Prisma,
- React,
- HTTP requests,
- database clients,
- message brokers,
- file systems,
- browser APIs,
- infrastructure adapters.

Dependency direction remains inward toward the domain model.

---

## 31. Constructor Dependencies

A specification may receive stable domain configuration through its constructor.

Example:

```ts
class MinimumMasteryReachedSpecification {
  constructor(private readonly threshold: MasteryThreshold) {}
}
```

Constructor dependencies must be:

- immutable,
- domain meaningful,
- deterministic,
- not infrastructure services.

Do not inject repositories merely to make the specification "smart."

---

## 32. Rule Versioning

Some learning rules may evolve over time.

Examples:

- mastery threshold changes,
- curriculum requirement changes,
- remediation trigger changes,
- credit qualification changes.

When historical reproducibility matters, the evaluation context should contain the applicable rule version or policy snapshot.

Example:

```ts
export type MasteryRuleSnapshot = Readonly<{
  version: string;
  threshold: MasteryThreshold;
  minimumEvidence: EvidenceCount;
  stabilityWindow: LearningDuration;
}>;
```

Do not evaluate historical evidence using an unspecified current rule when the business requires auditability.

---

## 33. Naming Conventions

Specification names should form a meaningful statement when paired with `isSatisfiedBy` or `evaluate`.

Good:

```ts
MinimumMasteryReachedSpecification
PrerequisitesSatisfiedSpecification
LearningPathUnlockableSpecification
MentorAssignmentAllowedSpecification
```

Avoid vague names:

```ts
ValidSpecification
RuleSpecification
CheckSpecification
BusinessSpecification
```

Avoid implementation-driven names:

```ts
ScoreGreaterThanEightySpecification
ArrayLengthAtLeastThreeSpecification
```

Prefer domain language:

```ts
MinimumEvidenceReachedSpecification
```

---

## 34. File Organization

Recommended modular structure:

```text
src/modules/
  learning-progress/
    domain/
      specifications/
        minimum-mastery-reached.specification.ts
        stable-mastery-reached.specification.ts
        index.ts

  progression/
    domain/
      specifications/
        prerequisites-satisfied.specification.ts
        learning-path-unlockable.specification.ts
        index.ts

  mentorship/
    domain/
      specifications/
        mentor-eligible.specification.ts
        mentorship-credit-earnable.specification.ts
        index.ts
```

Specifications belong to the module that owns their business meaning.

Do not create a global shared specifications folder containing unrelated workflow-specific rules.

Shared abstractions may contain only neutral primitives such as:

- `Specification<T>`,
- `SpecificationResult`,
- `AndSpecification<T>`,
- `OrSpecification<T>`,
- `NotSpecification<T>`.

---

## 35. Public Exports

Each module should explicitly export the specifications that form part of its domain contract.

Example:

```ts
export {
  MinimumMasteryReachedSpecification,
  StableMasteryReachedSpecification,
} from './specifications/index.js';
```

Internal helper specifications should remain internal when they are not intended as reusable domain contracts.

Public exports must remain deliberate and reviewable.

---

## 36. Testing Strategy

Every specification requires focused unit tests.

Minimum test coverage:

- clearly satisfied case,
- clearly unsatisfied case,
- boundary case,
- invalid or impossible context handling where relevant,
- composition behavior,
- deterministic repeated evaluation,
- failure code verification for explainable specifications.

Example:

```ts
describe('MinimumMasteryReachedSpecification', () => {
  it('is satisfied when score equals the threshold', () => {});
  it('is satisfied when score exceeds the threshold', () => {});
  it('is not satisfied below the threshold', () => {});
});
```

Boundary tests are essential because specifications often encode thresholds.

---

## 37. Composite Specification Tests

Composite specifications require explicit truth-table tests.

AND:

| Left | Right | Result |
|---|---|---|
| true | true | true |
| true | false | false |
| false | true | false |
| false | false | false |

OR:

| Left | Right | Result |
|---|---|---|
| true | true | true |
| true | false | true |
| false | true | true |
| false | false | false |

NOT:

| Input | Result |
|---|---|
| true | false |
| false | true |

Explainable compositions must also test failure accumulation and preservation.

---

## 38. Property-Based Testing

Property-based tests are valuable for specifications involving:

- numeric ranges,
- threshold monotonicity,
- time windows,
- evidence counts,
- set inclusion,
- prerequisite graphs.

Example property:

> Increasing mastery evidence without reducing score must not turn a satisfied minimum-evidence specification into an unsatisfied result.

Property-based testing supplements example-based tests; it does not replace domain scenario tests.

---

## 39. Integration Testing

Specification logic itself should remain unit-testable without infrastructure.

Integration tests may verify:

- repository adapters correctly translate query specifications,
- application services load the correct evaluation context,
- specification failures map correctly to application outcomes,
- aggregate transitions remain protected after specification evaluation.

Integration tests must not be the only place where business rules are tested.

---

## 40. Performance Guidance

Specifications should be cheap to evaluate in memory.

When evaluation requires large datasets:

- load only required projections,
- use repository query specifications,
- avoid N+1 loading,
- prefer summarized evidence snapshots,
- keep semantics explicit.

Do not hide expensive database traversal inside `isSatisfiedBy`.

A method that appears to be a pure predicate must not unexpectedly perform network or database operations.

---

## 41. Caching

Specifications should not internally cache mutable evaluation results.

Caching, when needed, belongs outside the specification and must respect:

- candidate identity,
- aggregate version,
- rule version,
- evaluation timestamp,
- tenant boundary.

Incorrect caching can produce stale business decisions and is therefore an application or infrastructure concern.

---

## 42. Tenant Safety

When contexts include tenant-owned data, every record must belong to the same tenant boundary before evaluation.

Tenant validation belongs primarily to application and repository boundaries.

A cross-aggregate specification may defensively reject inconsistent tenant identity when tenant IDs are part of the domain context.

It must never silently combine records from different tenants.

---

## 43. Authorization Separation

Specifications do not replace authorization.

Example:

- Authorization: Can this teacher manage this learner?
- Domain specification: Is this learner eligible for this advanced challenge?

The application layer should perform both where required.

Do not encode roles, JWT claims, or route permissions inside general domain specifications unless role itself is a genuine domain concept in that bounded context.

---

## 44. Error Handling

Specification failure is normally a business result, not an exception.

Use a result type for expected unsatisfied conditions.

Exceptions are reserved for programmer errors or impossible states, such as:

- missing required constructor dependency,
- invalid value object creation that escaped earlier validation,
- contradictory context that cannot exist legitimately.

Do not throw exceptions merely because a learner is not eligible.

---

## 45. Application Layer Usage

Recommended application flow:

1. Authenticate and authorize actor.
2. Load required aggregates or projections.
3. Build immutable domain evaluation context.
4. Evaluate specification.
5. Return business failure if unsatisfied.
6. Invoke aggregate or domain service when satisfied.
7. Persist changes.
8. Publish recorded domain events after successful persistence.

Example:

```ts
const context = buildChallengeEligibilityContext(...);
const result = eligibilitySpecification.evaluate(context);

if (!result.satisfied) {
  return ChallengeStartResult.rejected(result.failures);
}

attempt.start(command.startedAt);
await attemptRepository.save(attempt);
```

---

## 46. Domain Event Collaboration

Specifications do not publish events.

However, their results may inform aggregate decisions that produce domain events.

Example:

1. `LearningPathUnlockableSpecification` evaluates successfully.
2. `LearningPathway.unlock(...)` performs the state transition.
3. Aggregate records `LearningPathUnlocked`.

The event represents a domain fact.

The specification represents the rule that allowed the fact to occur.

---

## 47. Common Anti-Patterns

### 47.1 Repository Inside Specification

```ts
class EligibleSpecification {
  constructor(private readonly prisma: PrismaClient) {}
}
```

Why forbidden:

- hides I/O,
- destroys determinism,
- couples domain to infrastructure,
- complicates testing.

### 47.2 Generic Validation Bucket

```ts
class EverythingValidSpecification {}
```

Why forbidden:

- unclear ownership,
- low reuse,
- difficult diagnosis,
- becomes a god object.

### 47.3 Primitive Obsession

```ts
score >= 80 && attempts > 2
```

Repeated everywhere without domain objects or named rules.

### 47.4 UI Rule Leakage

```ts
ShowGreenButtonSpecification
```

Presentation decisions do not belong in the domain.

### 47.5 Side Effects During Evaluation

Awarding credits or updating progress inside `evaluate` is forbidden.

### 47.6 Duplicate Rule Implementations

The same mastery threshold must not be reimplemented independently across API, UI, jobs, and reports.

### 47.7 Long Anonymous Composition Chains

Complex compositions without a named domain concept reduce readability and auditability.

### 47.8 Treating All Failures as Exceptions

Unsatisfied business predicates are expected outcomes.

---

## 48. Reference Specification Set

The initial Math Learning World domain may include the following specifications.

### Learning Progress

- MinimumMasteryReachedSpecification
- StableMasteryReachedSpecification
- MasteryEvidenceSufficientSpecification
- ReviewRequiredSpecification

### Progression

- PrerequisitesSatisfiedSpecification
- LearningPathUnlockableSpecification
- GradeThresholdSatisfiedSpecification
- AboveGradeAdvancementAllowedSpecification

### Challenge

- LearnerEligibleForChallengeSpecification
- ChallengeAttemptStartableSpecification
- ChallengeAttemptFinalizableSpecification

### Remediation

- RemediationRequiredSpecification
- RepeatedRemediationRequiredSpecification
- TeacherInterventionRecommendedSpecification

### Mentorship

- MentorEligibleSpecification
- MentorAssignmentAllowedSpecification
- MentorshipCreditEarnableSpecification

This is a reference set, not a mandate to create every class immediately.

Specifications should be introduced when concrete domain behavior requires them.

---

## 49. Reference Interface

```ts
export type SpecificationFailure<Code extends string = string> = Readonly<{
  code: Code;
  message: string;
  metadata?: Readonly<Record<string, unknown>>;
}>;

export type SpecificationResult<Code extends string = string> =
  | Readonly<{ satisfied: true }>
  | Readonly<{
      satisfied: false;
      failures: readonly SpecificationFailure<Code>[];
    }>;

export interface Specification<T, Code extends string = string> {
  evaluate(candidate: T): SpecificationResult<Code>;
}
```

This interface is illustrative.

Implementation may be adjusted to match repository language and established domain primitives, but must preserve:

- deterministic evaluation,
- explicit result semantics,
- domain-oriented failure codes,
- side-effect freedom.

---

## 50. Reference Composition API

```ts
export interface ComposableSpecification<T, Code extends string = string>
  extends Specification<T, Code> {
  and(
    other: Specification<T, Code>,
  ): ComposableSpecification<T, Code>;

  or(
    other: Specification<T, Code>,
  ): ComposableSpecification<T, Code>;

  not(): ComposableSpecification<T, Code>;
}
```

Composition infrastructure should remain neutral.

Domain-specific composed rules should receive domain-specific names.

---

## 51. Decision Guide

Use an aggregate method when:

- the rule protects aggregate validity,
- state changes occur,
- invariant enforcement is required.

Use a specification when:

- the rule is a reusable predicate,
- the result is satisfied or unsatisfied,
- composition is valuable,
- independent testing is useful.

Use a domain policy when:

- a decision or strategy must be selected,
- multiple valid outcomes exist,
- thresholds or choices vary by rule set.

Use a domain service when:

- domain behavior spans concepts,
- no single aggregate naturally owns the behavior,
- action rather than predicate evaluation is required.

Use a repository query specification when:

- selection criteria must cross the persistence boundary,
- infrastructure translation is required.

---

## 52. Review Checklist

Before accepting a new specification, confirm:

- Does it represent a real domain question?
- Is its name expressed in domain language?
- Is it deterministic?
- Is it side-effect free?
- Is repository access outside the specification?
- Does it avoid framework dependencies?
- Is the evaluation input explicit?
- Are failure codes stable and domain-specific?
- Does the aggregate still enforce its own invariants?
- Is composition readable?
- Are boundary cases tested?
- Is the specification owned by the correct module?
- Is it public only when reuse is intentional?

---

## 53. Completion Criteria

18H is complete when the architecture establishes all of the following:

- Domain Specification has a precise definition.
- Boolean and explainable forms are distinguished.
- Atomic and composite specifications are defined.
- AND, OR, and NOT semantics are explicit.
- Aggregate-local and cross-aggregate specifications are separated.
- Repository query specifications are distinguished from behavioral specifications.
- Specification, Policy, Domain Service, Value Object, and Aggregate responsibilities are clearly separated.
- Determinism and side-effect freedom are mandatory.
- Infrastructure dependencies are prohibited.
- Domain-oriented failure codes are defined.
- Application-layer evaluation flow is documented.
- Testing expectations are explicit.
- Anti-patterns are documented.
- Module ownership and file organization are defined.
- Reference examples reflect Math Learning World business language.

---

## 54. Final Architectural Position

In Math Learning World, a Domain Specification is not a generic validation helper.

It is a named, reusable, deterministic expression of business truth.

Specifications make the learning model explicit:

- what mastery means,
- when progression is allowed,
- when foundations are missing,
- when remediation is required,
- when mentorship is valid,
- and when a learner is ready for the next meaningful step.

The architecture must preserve a clear boundary:

> Specifications evaluate business conditions. Aggregates and services perform business actions.

This separation keeps the domain model understandable, testable, and trustworthy as the product grows.
