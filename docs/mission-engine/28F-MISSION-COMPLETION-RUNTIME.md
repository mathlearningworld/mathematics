# Chapter 28F — Mission Completion Runtime

## 1. Purpose

Mission Completion Runtime is the authority that decides whether an active mission has satisfied its operational completion contract.

It answers:

> Has this mission met every required operational condition, is the completion request trustworthy, and may the lifecycle transition to COMPLETED now?

Completion is an operational conclusion. It is not a mastery conclusion.

```text
Mission objectives satisfied
  ↓
Completion requested
  ↓
Completion Runtime verifies
  ↓
Mission COMPLETED
  ↓
Evidence forwarded to Assessment
```

---

## 2. Authority Boundary

Mission Completion Runtime owns:

- completion request validation
- completion eligibility verification
- required objective verification
- required milestone verification
- evidence completeness checks
- completion policy execution
- completion decision records
- completion timestamp
- transition request to lifecycle authority
- completion event publication after durable commit

It does not own:

- mastery decisions
- misconception resolution
- Assessment confidence
- Recommendation recalculation
- reward settlement
- mission progress mutation
- gameplay result interpretation beyond declared operational contracts

---

## 3. Core Semantic Boundary

```text
Mission completed
  ≠ learner mastered the skill
  ≠ misconception resolved
  ≠ readiness confirmed
  ≠ recommendation succeeded
  ≠ future remediation unnecessary
```

Mission completion means only:

> The durable operational conditions defined by this mission contract were satisfied and verified.

---

## 4. Completion Request Contract

```ts
interface MissionCompletionRequest {
  tenantId: string
  learnerId: string
  missionId: string
  expectedMissionVersion: number
  expectedProgressVersion: number
  requestedBy: MissionActorRef
  requestSource: CompletionRequestSource
  evidenceRefs: string[]
  requestedAt: string
  correlationId: string
  causationId?: string
  idempotencyKey: string
}
```

Completion request sources:

```text
LEARNER
GAMEPLAY_RUNTIME
LEARNING_ENGINE
PRACTICE_ENGINE
ASSESSMENT_DELIVERY
TEACHER
MENTOR
PARENT
SYSTEM_POLICY
```

A request starts verification. It does not itself complete the mission.

---

## 5. Completion Policy Contract

```ts
interface MissionCompletionPolicy {
  policyId: string
  version: number
  requiredObjectiveMode: 'ALL_REQUIRED' | 'THRESHOLD' | 'CUSTOM'
  requiredMilestoneIds: string[]
  minimumAcceptedActivities?: number
  minimumEvidenceCount?: number
  independentEvidenceRequired?: boolean
  humanApprovalRequired?: boolean
  allowedCompletionActors: string[]
  maximumEvidenceAgeMs?: number
  customRuleRef?: string
}
```

Completion policy is versioned and bound to the mission at activation time.

A later policy version does not silently alter an already active mission unless an explicit migration or supersession occurs.

---

## 6. Completion Verification Pipeline

```text
Identity and scope
  ↓
Mission state eligibility
  ↓
Version checks
  ↓
Request actor authority
  ↓
Completion policy resolution
  ↓
Required objective verification
  ↓
Milestone verification
  ↓
Evidence completeness and freshness
  ↓
Assistance and independence constraints
  ↓
Blocker and pause status
  ↓
Human approval where required
  ↓
Duplicate completion check
  ↓
Durable completion decision
```

Any critical failure rejects or holds completion without partial mutation.

---

## 7. Eligible Mission States

Normal completion may be evaluated from:

```text
IN_PROGRESS
COMPLETION_PENDING
```

Direct completion from `ACTIVE`, `PAUSED`, or `BLOCKED` is prohibited unless an explicit mission-type policy defines a safe exception.

Terminal missions reject new completion requests idempotently or with a typed terminal-state response.

---

## 8. Required Objectives

Every required objective must be evaluated from the durable Progress Runtime snapshot and ledger position.

Possible objective outcomes:

```text
SATISFIED
UNSATISFIED
WAIVED_WITH_AUTHORITY
INVALIDATED
UNKNOWN
```

`UNKNOWN` never counts as satisfied.

Optional objectives may enrich evidence but cannot block completion unless the policy explicitly promotes them to required.

---

## 9. Waivers

Objective waivers require explicit authority and a durable reason.

```ts
interface ObjectiveWaiver {
  objectiveId: string
  waivedBy: MissionActorRef
  authorityPolicyId: string
  reasonCode: string
  reasonText?: string
  waivedAt: string
}
```

A waiver changes the operational completion contract. It does not assert that the learner achieved the waived objective.

Waivers must be visible to Assessment and audit projections.

---

## 10. Evidence Completeness

Completion may require linked evidence.

Evidence checks include:

- evidence exists
- evidence belongs to the same tenant and learner
- evidence is linked to the mission or objective
- evidence source is eligible
- evidence has not been withdrawn
- evidence age is within policy
- minimum evidence count is satisfied
- required evidence kinds are present

Completion Runtime verifies evidence presence and eligibility. Assessment interprets its educational meaning.

---

## 11. Independent Evidence

Some missions require at least one independent performance artifact.

Assistance levels:

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

When `independentEvidenceRequired = true`, assisted activity alone cannot satisfy the completion policy.

This still does not mean independent mastery is confirmed; it only means the mission's operational requirement for independent evidence was met.

---

## 12. Human Approval

Mission types may require human approval before completion, including:

```text
TEACHER_GUIDED
MENTOR_SUPPORTED
PARENT_SUPPORTED
SAFETY_SENSITIVE
MANUAL_PROJECT
REAL_WORLD_ACTIVITY
```

Approval contract:

```ts
interface MissionCompletionApproval {
  missionId: string
  approver: MissionActorRef
  authorityPolicyId: string
  decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES'
  reasonCode?: string
  decidedAt: string
}
```

Automation cannot fabricate or bypass required human approval.

---

## 13. Completion Decision

```ts
interface MissionCompletionDecision {
  missionId: string
  decision: 'CONFIRM' | 'REJECT' | 'HOLD'
  previousState: MissionState
  resultingState: MissionState
  missionVersion: number
  progressVersion: number
  policyId: string
  policyVersion: number
  satisfiedObjectiveIds: string[]
  waivedObjectiveIds: string[]
  missingObjectiveIds: string[]
  evidenceRefs: string[]
  limitationCodes: string[]
  reasonCode: string
  decidedAt: string
}
```

Decision meanings:

- `CONFIRM`: all operational requirements are satisfied
- `REJECT`: a definitive requirement is not satisfied
- `HOLD`: verification cannot safely conclude yet

---

## 14. Hold Conditions

Completion is held when:

```text
EVIDENCE_PENDING
HUMAN_APPROVAL_PENDING
CONFLICTING_PROGRESS_SNAPSHOT
SOURCE_RUNTIME_RECONCILIATION_PENDING
MISSION_VERSION_UNCERTAIN
POLICY_UNAVAILABLE
AUDIT_REVIEW_REQUIRED
```

Hold is not failure. It preserves the mission in `COMPLETION_PENDING` until resolution.

---

## 15. Completion Transaction Boundary

One confirmed completion transaction writes:

- completion decision record
- mission lifecycle transition to `COMPLETED`
- new mission aggregate version
- final progress ledger position
- completion policy identity and version
- evidence linkage set
- waiver references
- idempotency record
- audit record
- outbox events

The transition and decision must commit atomically.

---

## 16. Completion Timestamp

The canonical `completedAt` is assigned by the authoritative transaction clock when the completion decision commits.

It is not:

- the time the final activity occurred
- the time the user opened a success screen
- the time a client submitted the request

These times may be preserved separately:

```text
lastActivityAt
completionRequestedAt
completionDecidedAt
completedAt
```

---

## 17. Idempotency

Completion idempotency scope:

```text
tenantId + missionId + idempotencyKey
```

A repeated identical request returns the original completion decision.

A reused key with different evidence, actor, version, or semantic request is rejected as `COMPLETION_IDEMPOTENCY_CONFLICT`.

---

## 18. Optimistic Concurrency

Completion checks:

```text
expectedMissionVersion == storedMissionVersion
expectedProgressVersion == storedProgressVersion
```

If progress changes during verification, the decision must fail or restart from a new consistent snapshot.

Last-write-wins is prohibited.

---

## 19. Assessment Handoff

After completion commits, Mission Engine emits an evidence-oriented handoff.

```ts
interface MissionCompletionEvidenceEnvelope {
  tenantId: string
  learnerId: string
  missionId: string
  missionType: string
  objectiveResults: ObjectiveOperationalResult[]
  evidenceRefs: string[]
  assistanceSummary: AssistanceSummary
  waiverRefs: string[]
  limitations: string[]
  completedAt: string
  missionVersion: number
  progressVersion: number
}
```

Assessment may conclude:

- evidence supports readiness
- evidence is insufficient
- misconception remains
- more assessment is required
- no educational claim can be made

Mission Engine does not predetermine that outcome.

---

## 20. Recommendation Feedback

Recommendation Engine may consume subsequent Assessment claims and generate a new next action.

Correct loop:

```text
Mission completed
  ↓
Evidence produced
  ↓
Assessment interprets
  ↓
Recommendation recalculates
  ↓
New mission may be proposed
```

Incorrect loop:

```text
Mission completed
  ↓
Automatically mark mastery
```

The incorrect loop is prohibited.

---

## 21. Reward Boundary

Reward systems may observe `MissionCompleted`, but reward settlement is outside Completion Runtime.

Reward issuance must not:

- mutate completion truth
- strengthen Assessment confidence
- hide waivers or limitations
- cause duplicate completion

A failed reward transaction cannot roll back an already committed mission completion unless the architecture explicitly uses one shared transaction boundary, which is not the default.

---

## 22. Rejection Reasons

```text
REQUIRED_OBJECTIVE_UNSATISFIED
REQUIRED_MILESTONE_MISSING
MINIMUM_ACTIVITY_NOT_REACHED
MINIMUM_EVIDENCE_NOT_REACHED
INDEPENDENT_EVIDENCE_MISSING
EVIDENCE_INVALID
EVIDENCE_STALE
MISSION_BLOCKED
MISSION_PAUSED
MISSION_NOT_COMPLETABLE
ACTOR_NOT_AUTHORIZED
HUMAN_APPROVAL_REJECTED
VERSION_CONFLICT
POLICY_VIOLATION
```

Rejection should explain what operational condition remains without presenting it as a judgment about learner ability.

---

## 23. Failure Codes

```text
MISSION_NOT_FOUND
MISSION_SCOPE_MISMATCH
MISSION_NOT_COMPLETABLE
MISSION_ALREADY_COMPLETED
MISSION_ALREADY_TERMINAL
MISSION_VERSION_CONFLICT
PROGRESS_VERSION_CONFLICT
COMPLETION_POLICY_NOT_FOUND
COMPLETION_POLICY_VERSION_MISMATCH
OBJECTIVE_STATE_INCONSISTENT
EVIDENCE_REFERENCE_INVALID
EVIDENCE_SCOPE_MISMATCH
HUMAN_APPROVAL_REQUIRED
HUMAN_APPROVAL_INVALID
COMPLETION_IDEMPOTENCY_CONFLICT
COMPLETION_TRANSACTION_FAILED
```

---

## 24. Completion Events

```text
MissionCompletionRequested
MissionCompletionHeld
MissionCompletionRejected
MissionCompletionConfirmed
MissionCompleted
MissionCompletionEvidencePublished
```

`MissionCompleted` is emitted only after durable lifecycle mutation.

---

## 25. Replay

Historical completion replay uses:

- historical mission contract
- historical completion policy version
- historical progress ledger position
- historical evidence eligibility rules
- recorded clock inputs

Replay may verify that the same decision would occur. It must not rewrite the historical decision.

A divergent replay creates a diagnostic record.

---

## 26. Determinism

Given identical:

- mission snapshot
- progress snapshot and ledger position
- completion request
- policy version
- evidence eligibility snapshot
- approval records
- clock input

The completion decision must be identical.

---

## 27. Completion Invariants

1. Completion is an operational decision, not a mastery decision.
2. A request does not complete a mission.
3. Completion is verified against a versioned policy.
4. Required objectives cannot be averaged away.
5. Unknown objective state never counts as satisfied.
6. Waivers are explicit, authorized, and visible.
7. Required human approval cannot be automated away.
8. Evidence scope must match tenant and learner.
9. Mission and progress versions are checked atomically.
10. Completion and lifecycle transition commit together.
11. Completion events publish after commit.
12. Duplicate completion requests are idempotent.
13. Historical completion records are append-only.
14. Completion limitations are preserved in downstream handoff.
15. Reward processing cannot strengthen completion meaning.
16. Mission completion never directly mutates Assessment claims.

---

## 28. Verification Scenarios

Minimum automated scenarios:

- all required objectives satisfied → confirm
- one required objective missing → reject
- optional objective missing → still confirm when policy allows
- required milestone missing → reject
- stale evidence → reject or hold by policy
- independent evidence missing → reject
- valid human approval → confirm
- human approval pending → hold
- blocked mission → reject
- completion request replay → same decision
- same idempotency key with changed payload → conflict
- mission version conflict → reject
- progress version conflict → reject
- waived objective preserved in decision and handoff
- transaction rollback emits no completion event
- Assessment envelope contains limitations
- historical replay matches recorded decision

---

## 29. Architectural Result

After 28F, Mission Engine supports the full operational commitment loop:

```text
Mission Candidate
  ↓
Activation
  ↓
Lifecycle
  ↓
Progress
  ↓
Completion Verification
  ↓
Durable MissionCompleted
  ↓
Evidence to Assessment
```

Mission Engine can now close work responsibly without claiming more than the evidence proves.

The next batch defines how mission truth is projected to learners and supporting adults, persisted and replayed, verified before publication, and protected by runtime-wide invariants.
