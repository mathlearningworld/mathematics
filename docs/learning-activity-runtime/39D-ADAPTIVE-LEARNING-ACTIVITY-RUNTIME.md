# 39D — Adaptive Learning Activity Runtime

## 1. Purpose

Adaptive Learning Activity Runtime governs how an authorized learning activity may be reconsidered, replaced, reinforced, simplified, accelerated, deferred, or otherwise adapted without corrupting execution history, evidence lineage, learner safety, or mastery authority.

This runtime does not mutate a completed activity in place. It creates explicit adaptive decisions and, when required, a new authorized activity lineage.

> Learning Path decides what should happen next.
>
> Learning Activity defines the executable unit of work.
>
> Adaptive Learning Activity Runtime decides when the currently authorized activity should be reconsidered.

## 2. Runtime Boundary

Adaptive Learning Activity Runtime owns:

- adaptation trigger intake,
- trigger qualification,
- adaptation policy evaluation,
- safe-boundary enforcement,
- candidate activity generation,
- replacement and reinforcement decisions,
- retry and remediation decisions,
- accessibility adaptations,
- human-review escalation,
- adaptive lineage creation,
- cooldown and anti-thrashing control,
- adaptation decision evidence,
- adaptation activation coordination.

It does not own:

- mastery truth,
- path-wide planning authority,
- learning-session execution,
- evidence interpretation into mastery,
- projection authority,
- content authoring,
- curriculum truth.

## 3. Core Principle

```text
Activity adaptation creates a new explicit decision lineage.
Completed activity history remains immutable.
```

An adaptation may alter what the learner is asked to do next, but it may never silently rewrite what already occurred.

## 4. Adaptive Decision Aggregate

```ts
interface LearningActivityAdaptationDecision {
  adaptationDecisionId: string;
  tenantId: string;
  learnerId: string;
  sourceActivityId: string;
  sourceActivityVersion: number;
  sourcePathId: string;
  sourcePathVersion: number;
  triggerIds: string[];
  policyVersion: string;
  decisionType: ActivityAdaptationDecisionType;
  decisionStatus: ActivityAdaptationDecisionStatus;
  reasonCodes: ActivityAdaptationReasonCode[];
  candidateActivityIds: string[];
  selectedActivityId?: string;
  selectedActivityVersion?: number;
  requestedAt: string;
  decidedAt?: string;
  activatedAt?: string;
  rejectedAt?: string;
  supersededAt?: string;
  cooldownUntil?: string;
  requiresHumanReview: boolean;
  humanReviewState?: HumanReviewState;
  correlationId: string;
  causationId?: string;
  integrityHash?: string;
}
```

## 5. Decision Types

```ts
type ActivityAdaptationDecisionType =
  | 'KEEP_CURRENT'
  | 'RETRY_CURRENT'
  | 'RETRY_WITH_VARIATION'
  | 'INSERT_REMEDIATION'
  | 'INSERT_REINFORCEMENT'
  | 'REDUCE_DIFFICULTY'
  | 'INCREASE_DIFFICULTY'
  | 'SUBSTITUTE_ACTIVITY'
  | 'REORDER_PENDING_ACTIVITIES'
  | 'DEFER_ACTIVITY'
  | 'CANCEL_ACTIVITY'
  | 'ESCALATE_TO_HUMAN_REVIEW'
  | 'STOP_FOR_SAFETY';
```

## 6. Trigger Model

Adaptation begins from explicit triggers.

```ts
interface ActivityAdaptationTrigger {
  triggerId: string;
  tenantId: string;
  learnerId: string;
  activityId: string;
  activityVersion: number;
  triggerType: ActivityAdaptationTriggerType;
  observedAt: string;
  observedBy: 'SYSTEM' | 'LEARNER' | 'PARENT' | 'TEACHER' | 'OPERATOR';
  sourceReference: string;
  confidence?: number;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  payload: Record<string, unknown>;
}
```

Representative triggers:

- repeated incorrect attempts,
- unusually rapid success,
- excessive latency,
- repeated abandonment,
- accessibility mismatch,
- content unavailability,
- prerequisite contradiction,
- learner frustration signal,
- safety signal,
- teacher intervention,
- parent request,
- operator correction,
- path revision,
- mastery revision,
- content deprecation.

## 7. Trigger Qualification

A trigger does not automatically authorize adaptation.

Qualification checks:

1. tenant and learner identity match,
2. source activity exists,
3. activity version matches the observed version,
4. trigger source is trusted,
5. trigger is not duplicate,
6. trigger falls within policy freshness limits,
7. activity is in an adaptable state,
8. cooldown does not prohibit repeated adaptation,
9. active session state permits evaluation,
10. required evidence has been committed,
11. safety and human-review rules are satisfied.

Possible qualification outcomes:

```text
QUALIFIED
DUPLICATE
STALE
UNTRUSTED
UNSUPPORTED
COOLDOWN_ACTIVE
UNSAFE_BOUNDARY
HUMAN_REVIEW_REQUIRED
```

## 8. Safe Mutation Boundaries

Adaptation must occur only at explicit safe boundaries.

Safe boundaries commonly include:

- before activity start,
- after an attempt is durably committed,
- after a session checkpoint,
- after pause acknowledgement,
- after completion acceptance but before next activity authorization,
- after cancellation is committed,
- after evidence linkage is complete.

Unsafe boundaries include:

- while an answer submission is unresolved,
- during an in-flight evidence commit,
- during an ambiguous persistence outcome,
- while a session checkpoint is incomplete,
- while concurrent commands are unresolved,
- while human review is pending and policy forbids automation.

## 9. In-Progress Adaptation

An active activity may not be silently replaced.

The runtime must choose one of:

```text
WAIT_FOR_SAFE_BOUNDARY
REQUEST_PAUSE
ALLOW_CURRENT_ATTEMPT_TO_FINISH
ABORT_FOR_SAFETY
NO_ADAPTATION
```

When pause is requested:

1. Orchestration Runtime receives a pause request.
2. Session Runtime creates a durable checkpoint.
3. Activity Runtime commits the paused state.
4. Adaptation Runtime revalidates trigger freshness.
5. A decision is made against the latest committed state.

## 10. Candidate Generation

Candidate activities must be generated from current authoritative inputs:

- current learning path version,
- current mastery snapshot reference,
- prerequisite graph version,
- curriculum version,
- content catalog version,
- accessibility profile version,
- retry policy version,
- adaptation policy version,
- learner constraints,
- teacher or parent constraints,
- safety policy version.

Candidate generation must not rely solely on a stale projection.

## 11. Candidate Eligibility

Every candidate must pass:

- tenant ownership,
- learner suitability,
- prerequisite compatibility,
- path compatibility,
- content availability,
- language and accessibility compatibility,
- device capability compatibility,
- retry-limit compatibility,
- safety rules,
- age and policy constraints,
- timing-window constraints.

## 12. Retry Adaptation

Retry is an explicit policy decision.

Retry modes:

```ts
type ActivityRetryMode =
  | 'SAME_ACTIVITY_SAME_VARIANT'
  | 'SAME_ACTIVITY_NEW_VARIANT'
  | 'SAME_SKILL_DIFFERENT_ACTIVITY'
  | 'REMEDIATION_BEFORE_RETRY'
  | 'HUMAN_REVIEW_BEFORE_RETRY';
```

Retry must preserve:

- original attempt lineage,
- attempt count,
- reason for retry,
- policy version,
- variant identity,
- prior evidence references.

## 13. Remediation Insertion

Remediation may be inserted when evidence suggests the current activity is blocked by a prerequisite or conceptual gap.

Remediation insertion must:

1. identify the blocked capability without claiming mastery truth,
2. select a bounded remediation activity,
3. preserve the original activity as deferred or pending,
4. record the return condition,
5. prevent infinite remediation loops,
6. define escalation after repeated failure.

## 14. Reinforcement Insertion

Reinforcement may be inserted when the learner completed an activity but retention confidence is insufficient or spacing policy requires review.

Reinforcement is distinct from remediation:

```text
Remediation addresses a blocker.
Reinforcement strengthens a demonstrated capability.
```

## 15. Difficulty Adaptation

Difficulty may be adjusted through a new activity version or replacement activity.

Difficulty adaptation must not:

- change already scored attempts,
- reinterpret prior evidence,
- alter mastery directly,
- bypass mandatory curriculum requirements,
- exceed authorized acceleration policy.

Difficulty dimensions may include:

- number magnitude,
- abstraction level,
- number of steps,
- language complexity,
- hint availability,
- representation mode,
- time pressure,
- distractor complexity,
- scaffolding depth.

## 16. Activity Substitution

Substitution replaces a pending or paused activity with another bounded unit of work.

Valid reasons include:

- content unavailable,
- accessibility mismatch,
- duplicate learning objective,
- device incompatibility,
- teacher override,
- improved representation,
- safety concern,
- prerequisite contradiction.

Substitution must record:

```ts
interface ActivitySubstitutionRecord {
  sourceActivityId: string;
  replacementActivityId: string;
  sourceObjectiveIds: string[];
  replacementObjectiveIds: string[];
  equivalenceClass?: string;
  reasonCodes: string[];
  approvedBy: string;
  policyVersion: string;
}
```

## 17. Acceleration

Acceleration may occur when authoritative evidence indicates the learner should attempt a more advanced activity.

Acceleration requires:

- prerequisite confirmation,
- path policy permission,
- safety and age compatibility,
- no unresolved required activity,
- explicit activity authorization,
- bounded jump size,
- rollback or reinforcement strategy.

Fast completion alone is insufficient evidence for acceleration.

## 18. Defer and Cancel

Defer preserves intent for later execution.

Cancel terminates the current activity lineage.

A deferred activity must have:

- defer reason,
- revisit condition,
- latest revisit time where applicable,
- dependency implications,
- path reconciliation requirement.

A cancelled activity must have:

- cancellation authority,
- cancellation reason,
- terminal timestamp,
- evidence completeness status,
- replacement relationship when applicable.

## 19. Human Review

Human review is required when:

- safety severity is high or critical,
- policy confidence is below threshold,
- repeated adaptation exceeds limits,
- teacher-imposed constraints conflict,
- accessibility needs are uncertain,
- mastery revision materially changes the path,
- a protected decision category is involved,
- policy explicitly requires approval.

Human decisions must be recorded as commands and events, not database edits.

## 20. Cooldown and Anti-Thrashing

The runtime must prevent rapid oscillation between activities.

Controls include:

- minimum observations before adaptation,
- minimum time between adaptations,
- maximum adaptations per activity lineage,
- maximum substitutions per objective window,
- hysteresis thresholds,
- evidence freshness windows,
- manual-review escalation,
- same-decision deduplication.

## 21. Adaptation Lifecycle

```text
REQUESTED
  ↓
QUALIFYING
  ↓
ELIGIBLE
  ↓
DECIDED
  ↓
PENDING_ACTIVATION
  ↓
ACTIVATED
```

Alternative terminal states:

```text
REJECTED
EXPIRED
SUPERSEDED
CANCELLED
FAILED_ACTIVATION
```

## 22. Activation

A decision is not effective until activation is durably committed.

Activation requires:

- expected source version,
- expected target version where applicable,
- source activity transition,
- target activity creation or update,
- lineage link,
- outbox events,
- idempotency record,
- atomic commit.

## 23. Activation Failure

On activation failure:

1. do not report success,
2. preserve the decision as pending or failed,
3. inspect durable state,
4. retry only with the same idempotency key or a new explicit command,
5. avoid creating duplicate replacement activities,
6. escalate ambiguous outcomes.

## 24. Concurrency

Concurrent adaptation requests must use optimistic concurrency.

Only one decision may activate against a specific expected activity version.

Losing decisions become:

```text
SUPERSEDED_BY_NEWER_ACTIVITY_VERSION
```

They may be re-evaluated only through a new request.

## 25. Idempotency

An adaptation command key must bind:

- tenantId,
- learnerId,
- sourceActivityId,
- expectedActivityVersion,
- trigger set hash,
- policy version,
- command intent.

The same key must return the same committed outcome.

## 26. Events

Representative events:

```text
ActivityAdaptationRequested
ActivityAdaptationTriggerQualified
ActivityAdaptationRejected
ActivityAdaptationDecisionMade
ActivityAdaptationHumanReviewRequested
ActivityAdaptationHumanDecisionRecorded
ActivityReplacementPrepared
ActivityAdaptationActivated
ActivityAdaptationActivationFailed
ActivityAdaptationSuperseded
ActivityAdaptationExpired
```

## 27. Evidence

Every adaptation decision must emit evidence sufficient to answer:

- what triggered reconsideration,
- which authoritative inputs were used,
- which policy version was applied,
- which candidates were considered,
- why a candidate was selected or rejected,
- whether human review occurred,
- whether activation succeeded,
- which lineage replaced which.

## 28. Projection

Adaptive projection may show:

- adaptation pending,
- reason category,
- replacement activity,
- retry availability,
- cooldown remaining,
- review required,
- history of prior adaptations.

Projection must not make the decision or authorize execution.

## 29. Cross-Runtime Interactions

### Learning Path Runtime

Provides path authority and receives path-level consequences.

### Learning Session Runtime

Provides safe checkpoints and execution state.

### Evidence Runtime

Stores adaptation and execution evidence.

### Mastery Runtime

Provides referenced mastery state; it is not mutated by this runtime.

### Curriculum and Skill Graph Runtimes

Provide objective and prerequisite authority.

### Content Runtime

Provides activity definitions and availability.

## 30. Safety

Safety-triggered adaptation may bypass normal cooldown but must not bypass durable recording.

Critical safety flow:

```text
Critical signal
→ Stop or pause execution
→ Commit checkpoint
→ Revoke authorization if needed
→ Record decision
→ Require human review where policy mandates
```

## 31. Fairness

Adaptive policies must be evaluated for:

- systematic under-challenge,
- systematic over-remediation,
- accessibility bias,
- language bias,
- device bias,
- demographic proxy effects,
- unequal escalation rates.

Fairness monitoring does not authorize individual mastery decisions.

## 32. Privacy

Adaptation explanations must be role-appropriate.

Sensitive signals may be used for policy evaluation without being exposed to learner-facing projections.

## 33. Observability

Metrics should include:

- adaptation requests,
- qualified-trigger rate,
- adaptation activation rate,
- retry rate,
- remediation insertion rate,
- substitution rate,
- human-review rate,
- cooldown suppression rate,
- activation failure rate,
- repeated-adaptation rate,
- post-adaptation completion rate.

## 34. Verification Scenarios

Minimum scenarios:

1. duplicate trigger is idempotent,
2. stale trigger is rejected,
3. unsafe in-flight attempt prevents mutation,
4. pause-checkpoint adaptation succeeds,
5. concurrent adaptations select one winner,
6. failed activation creates no duplicate target,
7. completed activity remains immutable,
8. remediation returns to original objective,
9. repeated adaptation escalates to review,
10. projection cannot activate a decision,
11. critical safety signal stops execution,
12. replay reconstructs the same adaptive lineage.

## 35. Runtime Invariants

1. Every adaptation references an existing source activity.
2. Every adaptation uses an expected source activity version.
3. Completed activity history is immutable.
4. An adaptation decision does not become effective before activation.
5. Activation is atomic across source transition, target creation, lineage, and outbox.
6. Retry never erases prior attempts.
7. Substitution preserves objective lineage.
8. Adaptation never directly changes mastery.
9. Projection never authorizes adaptation.
10. Safety stops remain durably recorded.
11. Duplicate commands do not create duplicate activities.
12. Repeated adaptation is bounded by cooldown and escalation policy.
13. Human decisions are represented as commands and events.
14. Replay reconstructs the committed decision without re-running policy.
15. Tenant identity is enforced across every adaptive object.

## 36. Final Boundary

```text
Adaptation may change what happens next.
It may not rewrite what already happened.

Adaptation may use mastery references.
It may not create mastery truth.

Adaptation may prepare a replacement.
Only durable activation makes the replacement authoritative.
```
