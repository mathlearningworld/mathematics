# Chapter 28E — Mission Progress Runtime

## 1. Purpose

Mission Progress Runtime governs how accepted activity is recorded against an active mission.

It answers:

> What has the learner actually done within this mission, which objective did it affect, how much progress is durably recognized, and what remains?

Progress is operational truth. It is not a learning claim.

```text
Activity occurred
  ↓
Progress Runtime validates and records
  ↓
Mission progress changes
  ↓
Evidence is forwarded
  ↓
Assessment interprets learning meaning
```

---

## 2. Authority Boundary

Mission Progress Runtime owns:

- objective-level progress
- accepted progress events
- progress sequencing
- progress versioning
- progress caps and bounds
- attempt accounting
- milestone attainment
- progress rollback through compensating records
- progress snapshots
- progress event publication

It does not own:

- mastery
- misconception state
- Assessment confidence
- Recommendation priority
- mission activation
- mission completion confirmation
- reward issuance
- gameplay scoring rules

---

## 3. Core Principle

```text
Mission progress ≠ mastery
Mission activity ≠ understanding
Mission score ≠ Assessment confidence
Mission time spent ≠ learning success
```

Progress records what happened inside the mission contract. Assessment decides what the activity means educationally.

---

## 4. Mission Objective Model

A mission contains one or more objectives.

```ts
interface MissionObjective {
  objectiveId: string
  missionId: string
  type: ObjectiveType
  titleKey: string
  required: boolean
  targetQuantity?: number
  targetUnit?: ProgressUnit
  minimumEvidenceCount?: number
  sequence?: number
  prerequisites?: string[]
  completionPolicyId: string
}
```

Objective types may include:

```text
LEARN_CONCEPT
COMPLETE_LESSON
PRACTICE_SKILL
SOLVE_PROBLEMS
DEMONSTRATE_REPRESENTATION
APPLY_IN_CONTEXT
EXPLORE_LOCATION
COLLECT_EVIDENCE
REQUEST_SUPPORT
COMPLETE_ASSESSMENT
TRANSFER_STRATEGY
```

---

## 5. Progress Units

```text
ITEM
ATTEMPT
SUCCESS
STEP
ACTIVITY
LESSON
MINUTE
EVIDENCE
CHECKPOINT
LOCATION
INTERACTION
CUSTOM
```

Units are operational counters only. Their educational meaning must come from linked evidence interpreted elsewhere.

---

## 6. Progress Event Contract

```ts
interface MissionProgressCommand {
  tenantId: string
  learnerId: string
  missionId: string
  objectiveId: string
  expectedMissionVersion: number
  expectedProgressVersion: number
  activityId: string
  activityType: string
  delta: ProgressDelta
  evidenceRefs: string[]
  sourceRuntime: ProgressSourceRuntime
  occurredAt: string
  receivedAt: string
  correlationId: string
  causationId?: string
  idempotencyKey: string
}
```

Sources may include:

```text
GAMEPLAY_RUNTIME
LEARNING_ENGINE
PRACTICE_ENGINE
ASSESSMENT_DELIVERY
TEACHER_INPUT
MENTOR_INPUT
PARENT_INPUT
SYSTEM_IMPORT
```

Human-entered progress must preserve actor identity and authority.

---

## 7. Progress Delta

```ts
interface ProgressDelta {
  operation: 'INCREMENT' | 'SET_MILESTONE' | 'ACKNOWLEDGE' | 'COMPENSATE'
  quantity?: number
  unit?: ProgressUnit
  milestoneId?: string
  reasonCode?: string
}
```

Arbitrary absolute replacement is prohibited. Corrections use compensating entries so history remains append-only.

---

## 8. Progress Validation Pipeline

```text
Identity and scope
  ↓
Mission lifecycle eligibility
  ↓
Objective existence
  ↓
Objective availability
  ↓
Source authority
  ↓
Activity uniqueness
  ↓
Evidence reference validation
  ↓
Delta bounds
  ↓
Sequence policy
  ↓
Version checks
  ↓
Durable write
```

A mission normally accepts progress only in:

```text
ACTIVE
IN_PROGRESS
```

A paused or blocked mission rejects new progress unless an explicit policy permits offline activity reconciliation.

---

## 9. Objective Availability

An objective is available when:

- mission state permits progress
- required earlier objectives are satisfied where sequence is strict
- objective prerequisites are met
- objective is not already locked or superseded
- delivery capability is authorized

Progress against unavailable objectives is rejected, not silently queued.

---

## 10. Accepted Activity

An activity contributes progress only when:

- its source is authorized
- it belongs to the same tenant and learner
- it belongs to this mission or is explicitly linked
- its activity identifier is unique
- its evidence references are valid where required
- its timing is within policy
- its delta does not exceed objective bounds

Duplicate delivery must not double-count progress.

---

## 11. Progress Bounds

Progress is bounded by objective policy.

```text
recognizedQuantity = min(current + acceptedDelta, objectiveMaximum)
```

Over-delivery may be recorded as activity evidence but must not inflate mission progress beyond the contract.

Negative progress is prohibited except through an explicit compensating record tied to a prior event.

---

## 12. Attempts and Successes

Attempts and successes must remain separate.

```text
attemptCount
acceptedAttemptCount
successCount
assistedSuccessCount
independentSuccessCount
```

A success label provided by Gameplay Runtime is an activity fact under that runtime's rules. It is not automatically an Assessment claim.

---

## 13. Assistance Context

Progress events should preserve assistance level:

```text
NONE
PROMPT
HINT
STEP_BY_STEP
TEACHER_GUIDED
PARENT_GUIDED
MENTOR_GUIDED
SYSTEM_AUTOCORRECT
```

Assisted completion may satisfy an operational objective when policy allows, but must not be projected as independent mastery.

---

## 14. Milestones

Milestones represent meaningful mission checkpoints.

```ts
interface MissionMilestone {
  milestoneId: string
  missionId: string
  objectiveIds: string[]
  policy: 'ALL' | 'ANY' | 'THRESHOLD'
  threshold?: number
  required: boolean
}
```

Milestone attainment is derived deterministically from accepted progress records.

Milestones do not directly complete the mission unless the Completion Runtime confirms the whole mission contract.

---

## 15. Progress Snapshot

```ts
interface MissionProgressSnapshot {
  missionId: string
  missionVersion: number
  progressVersion: number
  objectiveProgress: ObjectiveProgressSnapshot[]
  attainedMilestones: string[]
  totalAcceptedActivities: number
  lastAcceptedActivityAt?: string
  computedAt: string
  sourceEventPosition: number
}
```

Snapshots are rebuildable projections. The append-only progress ledger remains the durable source of truth.

---

## 16. Objective Progress State

```text
NOT_STARTED
AVAILABLE
IN_PROGRESS
SATISFIED
BLOCKED
WAIVED
SUPERSEDED
```

`SATISFIED` means the objective's operational condition has been met. It does not mean the learner has mastered the underlying skill.

---

## 17. Sequencing

Mission objective sequencing may be:

```text
STRICT
GUIDED
FLEXIBLE
PARALLEL
```

- `STRICT`: only the next eligible objective accepts progress
- `GUIDED`: recommended sequence, deviations allowed by policy
- `FLEXIBLE`: any eligible objective may progress
- `PARALLEL`: multiple objectives may progress from one linked activity

One activity may affect multiple objectives only when the mission contract explicitly permits it. Each allocation must be deterministic and auditable.

---

## 18. Shared Activity Allocation

When one activity contributes to multiple objectives:

```ts
interface ProgressAllocation {
  activityId: string
  allocations: Array<{
    objectiveId: string
    quantity: number
    unit: ProgressUnit
    allocationReason: string
  }>
}
```

Allocation policy must prevent accidental double counting.

---

## 19. Offline and Delayed Activity

Delayed activity may be accepted only when:

- activity occurred while mission state permitted it
- source can prove occurrence time
- activity ID is stable
- mission has not been superseded in a way that invalidates the activity
- reconciliation policy allows it

The system distinguishes:

```text
occurredAt
receivedAt
recordedAt
```

Late arrival must not rewrite historical mission state.

---

## 20. Corrections

Corrections are append-only.

```text
Original progress event
  ↓
Compensation event referencing original
  ↓
Recomputed snapshot
```

No administrator or runtime may delete or mutate accepted progress history in place.

---

## 21. Optimistic Concurrency

Progress commands validate both:

```text
expectedMissionVersion
expectedProgressVersion
```

This protects lifecycle state and progress ordering independently.

Version mismatch returns a typed conflict. Last-write-wins is prohibited.

---

## 22. Idempotency

Idempotency scope:

```text
tenantId + missionId + activityId + idempotencyKey
```

The same activity cannot create progress twice even if delivered by retry, reconnect, or outbox replay.

Same key with changed payload produces `PROGRESS_IDEMPOTENCY_CONFLICT`.

---

## 23. Durable Transaction Boundary

One accepted progress command writes:

- progress ledger entry
- objective progress projection update
- progress version
- milestone changes
- activity uniqueness record
- idempotency record
- evidence linkage record
- audit record
- outbox events

No event is published before commit.

---

## 24. Progress Events

```text
MissionProgressAccepted
MissionObjectiveStarted
MissionObjectiveProgressed
MissionObjectiveSatisfied
MissionMilestoneAttained
MissionProgressCompensated
MissionProgressRejected
MissionCompletionEligibilityChanged
```

Events express operational facts only.

---

## 25. Completion Eligibility Signal

Progress Runtime may calculate:

```text
NOT_ELIGIBLE
POTENTIALLY_ELIGIBLE
```

It may not publish `COMPLETED`.

When all required operational conditions appear satisfied:

```text
MissionCompletionEligibilityChanged(POTENTIALLY_ELIGIBLE)
```

Chapter 28F then performs authoritative completion verification.

---

## 26. Failure Codes

```text
MISSION_NOT_PROGRESSABLE
MISSION_SCOPE_MISMATCH
OBJECTIVE_NOT_FOUND
OBJECTIVE_NOT_AVAILABLE
OBJECTIVE_ALREADY_SATISFIED
SOURCE_NOT_AUTHORIZED
ACTIVITY_ALREADY_RECORDED
EVIDENCE_REFERENCE_INVALID
PROGRESS_DELTA_INVALID
PROGRESS_LIMIT_EXCEEDED
SEQUENCE_VIOLATION
MISSION_VERSION_CONFLICT
PROGRESS_VERSION_CONFLICT
PROGRESS_IDEMPOTENCY_CONFLICT
OFFLINE_ACTIVITY_NOT_ELIGIBLE
COMPENSATION_TARGET_NOT_FOUND
```

---

## 27. Determinism

Given identical:

- mission contract
- progress ledger
- command
- allocation policy
- clock inputs

The accepted delta, objective state, milestones, and snapshot must be identical.

---

## 28. Progress Invariants

1. Progress is operational truth, not mastery truth.
2. Only eligible mission states accept progress.
3. Every progress event belongs to one tenant, learner, mission, and objective scope.
4. Duplicate activity never double-counts.
5. Progress cannot exceed objective bounds.
6. Corrections are compensating records, never destructive edits.
7. Assisted and independent activity remain distinguishable.
8. Objective satisfaction does not complete the mission by itself.
9. Progress snapshots are rebuildable from the ledger.
10. Every mutation uses optimistic concurrency.
11. Outbox publication occurs after commit.
12. Late activity cannot rewrite historical lifecycle state.
13. Shared activity allocation is explicit and deterministic.
14. Progress Runtime cannot alter Assessment claims.

---

## 29. Verification Scenarios

Minimum automated scenarios:

- first activity starts objective
- valid increment accepted
- duplicate activity rejected or idempotently returned
- progress capped at objective maximum
- strict sequence violation rejected
- flexible sequence accepted
- shared activity allocated deterministically
- assisted success preserved
- paused mission rejects activity
- delayed eligible activity reconciled
- delayed ineligible activity rejected
- compensation reverses prior contribution
- stale mission version rejected
- stale progress version rejected
- all objectives emit potential completion eligibility
- transaction rollback publishes no event
- ledger rebuild matches stored snapshot

---

## 30. Architectural Result

After 28E, Mission Engine can durably explain what happened inside a mission without overstating educational meaning.

```text
Mission Lifecycle
  ↓
Activity Validation
  ↓
Objective Progress Ledger
  ↓
Milestones and Eligibility
  ↓
Completion Verification
```

The next slice defines when a mission may be authoritatively completed and how completion evidence is handed back to Assessment.
