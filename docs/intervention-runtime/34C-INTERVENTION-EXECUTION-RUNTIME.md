# 34C — Intervention Execution Runtime

## 1. Purpose

The Intervention Execution Runtime governs the delivery of an approved intervention plan across learning, mission, gameplay, assessment, teacher, parent, tutor, or hybrid channels.

Its responsibility is not merely to start activities. It must preserve execution authority, sequence phases, enforce dosage and safety limits, capture evidence, handle interruption, coordinate retries, and report what actually occurred without claiming effectiveness prematurely.

---

## 2. Execution Boundary

The runtime owns:

- activation and execution session identity,
- phase and activity sequencing,
- execution-channel coordination,
- dosage accounting,
- interruption, pause, resume, retry, and timeout behavior,
- execution evidence capture,
- safety-trigger enforcement,
- bounded automatic adaptation requests,
- execution completion and handoff to effectiveness evaluation.

It does not own:

- diagnostic truth,
- intervention-plan approval,
- learning-content authority,
- final effectiveness judgment,
- learner progress truth outside intervention-scoped evidence.

---

## 3. Execution Aggregate

```ts
interface InterventionExecution {
  executionId: string
  interventionId: string
  planId: string
  tenantId: string
  learnerId: string
  status: InterventionExecutionStatus
  currentPhaseId?: string
  currentActivityId?: string
  sessions: InterventionExecutionSession[]
  dosage: InterventionDosageLedger
  safetyState: InterventionSafetyState
  evidenceRefs: string[]
  adaptationCount: number
  versionPins: InterventionVersionPins
  version: number
  startedAt?: string
  endedAt?: string
}
```

---

## 4. Execution Lifecycle

```text
READY
ACTIVATING
ACTIVE
WAITING_FOR_CHANNEL
WAITING_FOR_LEARNER
WAITING_FOR_HUMAN
PAUSED
INTERRUPTED
RETRY_PENDING
ADAPTATION_PENDING
COMPLETING
COMPLETED
ABORTED
EXPIRED
FAILED
```

Meaning:

- `READY`: approved and schedulable.
- `ACTIVATING`: authority and bindings are being validated.
- `ACTIVE`: an intervention phase or activity is in progress.
- `WAITING_FOR_CHANNEL`: dependent runtime or human channel is unavailable.
- `WAITING_FOR_LEARNER`: awaiting learner continuation within policy.
- `WAITING_FOR_HUMAN`: teacher, parent, tutor, or reviewer action is required.
- `PAUSED`: intentionally suspended with preserved state.
- `INTERRUPTED`: execution stopped unexpectedly.
- `RETRY_PENDING`: a policy-authorized retry is queued.
- `ADAPTATION_PENDING`: execution cannot continue until an adaptation decision is resolved.
- `COMPLETING`: final execution records are being sealed.
- `COMPLETED`: planned execution has finished.
- `ABORTED`: deliberately terminated before completion.
- `EXPIRED`: execution authority or time window expired.
- `FAILED`: execution could not continue because of a runtime or policy failure.

---

## 5. Execution Session

```ts
interface InterventionExecutionSession {
  sessionId: string
  sequence: number
  scheduledStart?: string
  actualStart?: string
  actualEnd?: string
  channel: string
  actorRefs: string[]
  phaseExecutions: PhaseExecution[]
  status: string
  interruptionReason?: string
  evidenceRefs: string[]
}
```

Every session is independently auditable and contributes to the dosage ledger.

---

## 6. Phase Execution

```ts
interface PhaseExecution {
  phaseExecutionId: string
  phaseId: string
  status:
    | 'NOT_STARTED'
    | 'ACTIVE'
    | 'PAUSED'
    | 'COMPLETED'
    | 'SKIPPED_BY_POLICY'
    | 'FAILED'
  entryCriteriaEvaluation: CriterionEvaluation[]
  activities: ActivityExecution[]
  exitCriteriaEvaluation: CriterionEvaluation[]
  evidenceRefs: string[]
  startedAt?: string
  endedAt?: string
}
```

A phase may begin only after entry criteria are evaluated. It may complete only through declared exit criteria or an explicit policy-authorized override.

---

## 7. Activity Execution

```ts
interface ActivityExecution {
  activityExecutionId: string
  plannedActivityId: string
  capabilityId: string
  capabilityVersion: string
  status: string
  attempt: number
  inputsRef: string
  outputsRef?: string
  evidenceRefs: string[]
  startedAt?: string
  endedAt?: string
  failureCode?: string
}
```

Activity completion records delivery. It does not establish learning or understanding.

---

## 8. Activation Flow

```text
Validate intervention status
        │
        ▼
Validate approved plan and versions
        │
        ▼
Validate schedule and learner context
        │
        ▼
Resolve execution bindings
        │
        ▼
Validate channel capabilities
        │
        ▼
Initialize dosage and safety ledgers
        │
        ▼
Activate first eligible phase
```

Activation must fail closed when authority-sensitive versions or bindings are unavailable.

---

## 9. Channel Coordination

The runtime coordinates through explicit commands and receipts.

```ts
interface InterventionExecutionDispatch {
  executionId: string
  sessionId: string
  phaseId: string
  activityId: string
  channel: string
  capabilityId: string
  capabilityVersion: string
  learnerContextRef: string
  evidenceContractRef: string
  safetyContractRef: string
  idempotencyKey: string
}
```

```ts
interface InterventionExecutionReceipt {
  dispatchId: string
  channelExecutionId: string
  acceptedAt: string
  status: 'ACCEPTED' | 'REJECTED' | 'DEFERRED'
  rejectionCode?: string
}
```

Silent channel substitution is prohibited.

---

## 10. Dosage Ledger

```ts
interface InterventionDosageLedger {
  plannedSessions: number
  completedSessions: number
  plannedMinutes?: number
  deliveredMinutes: number
  attempts: number
  consecutiveAttempts: number
  pauses: number
  retries: number
  adaptations: number
  lastExecutionAt?: string
}
```

The ledger must be derived from execution facts, not inferred from scheduling alone.

Dosage enforcement includes:

- maximum session duration,
- maximum consecutive attempts,
- minimum spacing,
- total session ceiling,
- intervention-window expiry,
- mandatory rest or review gates.

---

## 11. Safety Runtime

```ts
interface InterventionSafetyState {
  status: 'CLEAR' | 'WARNING' | 'PAUSE_REQUIRED' | 'STOP_REQUIRED' | 'HUMAN_REVIEW_REQUIRED'
  activeSignals: SafetySignal[]
  lastEvaluatedAt: string
  policyVersion: string
}
```

Safety signals may originate from:

- learner frustration indicators,
- repeated non-response,
- excessive pressure or repetition,
- accessibility failure,
- inappropriate language,
- privacy or consent conflict,
- teacher or parent concern,
- channel capability mismatch,
- contradictory diagnostic evidence.

`PAUSE_REQUIRED` and `STOP_REQUIRED` are blocking states.

---

## 12. Evidence Capture

Execution evidence categories:

```text
DISPATCH_EVIDENCE
PARTICIPATION_EVIDENCE
ACTIVITY_OUTPUT
HINT_AND_SUPPORT_USAGE
ERROR_PATTERN
STRATEGY_TRACE
HUMAN_OBSERVATION
SAFETY_SIGNAL
INTERRUPTION_RECORD
DOSAGE_RECORD
TRANSFER_RESPONSE
REFLECTION_RESPONSE
```

Rules:

1. Evidence must retain source, timestamp, channel, capability version, and activity context.
2. Execution telemetry is not automatically understanding evidence.
3. Missing evidence must be represented explicitly.
4. Failed or interrupted activities remain part of the record.
5. Derived execution features must reference source evidence.

---

## 13. Retry Policy

A retry is permitted only when:

- the failure is classified as retryable,
- retry count remains within plan bounds,
- safety state allows continuation,
- the activity and channel versions remain valid,
- the idempotency boundary is preserved,
- retry will not duplicate an already completed effect.

Retry categories:

```text
TECHNICAL_RETRY
LEARNER_REQUESTED_RETRY
POLICY_RETRY
RESCHEDULED_RETRY
ADAPTED_RETRY
```

Repeated identical retries without new rationale are prohibited.

---

## 14. Pause and Resume

Pause reasons include:

```text
LEARNER_REQUEST
HUMAN_REQUEST
SAFETY_TRIGGER
SCHEDULE_LIMIT
CHANNEL_UNAVAILABLE
EVIDENCE_GAP
ADAPTATION_REVIEW
POLICY_REVIEW
```

Resume requires revalidation of:

- intervention authority,
- plan and strategy versions,
- schedule window,
- safety state,
- current phase entry conditions,
- channel availability.

A resumed execution must not silently skip expired or invalid assumptions.

---

## 15. Interruption Recovery

Unexpected interruption must produce a durable recovery record containing:

- last confirmed phase and activity state,
- last accepted channel receipt,
- last durable evidence reference,
- dosage state,
- safety state,
- retry eligibility,
- version pins,
- recovery decision.

Recovery outcomes:

```text
RESUME_FROM_CHECKPOINT
RESTART_ACTIVITY
RESTART_PHASE
WAIT_FOR_HUMAN
REQUEST_ADAPTATION
ABORT_EXECUTION
EXPIRE_EXECUTION
```

Conversation state or UI state alone cannot establish recovery completion.

---

## 16. Adaptation Request Boundary

The Execution Runtime may detect adaptation triggers but may only apply changes pre-authorized by the plan.

```ts
interface ExecutionAdaptationRequest {
  executionId: string
  triggerType: string
  triggerEvidenceRefs: string[]
  currentPhaseId: string
  requestedAdjustment: string
  withinAutomaticBounds: boolean
  requestedAt: string
}
```

Changes outside automatic bounds must move execution to `ADAPTATION_PENDING` and require the Adaptive Intervention Runtime or human authority.

---

## 17. Completion Rules

Execution may enter `COMPLETED` only when:

- all required phases are complete or explicitly waived,
- required execution evidence has been sealed,
- dosage ledger is final for the execution window,
- unresolved safety blocks are absent,
- channel receipts and outputs are reconciled,
- completion event is durably written.

`COMPLETED` must transition the intervention to outcome-evidence collection or effectiveness evaluation. It must not directly mark the intervention `EFFECTIVE`.

---

## 18. Commands

```text
ActivateInterventionExecution
StartInterventionSession
DispatchInterventionActivity
AcknowledgeInterventionDispatch
RecordInterventionActivityResult
RecordInterventionEvidence
PauseInterventionExecution
ResumeInterventionExecution
InterruptInterventionExecution
RetryInterventionActivity
RequestExecutionAdaptation
CompleteInterventionPhase
CompleteInterventionSession
CompleteInterventionExecution
AbortInterventionExecution
ExpireInterventionExecution
RecoverInterventionExecution
```

Every command must include expected aggregate version and idempotency metadata where side effects are possible.

---

## 19. Events

```text
InterventionExecutionActivated
InterventionSessionStarted
InterventionActivityDispatched
InterventionDispatchAcknowledged
InterventionActivityResultRecorded
InterventionEvidenceRecorded
InterventionExecutionPaused
InterventionExecutionResumed
InterventionExecutionInterrupted
InterventionActivityRetryScheduled
InterventionAdaptationRequested
InterventionPhaseCompleted
InterventionSessionCompleted
InterventionExecutionCompleted
InterventionExecutionAborted
InterventionExecutionExpired
InterventionExecutionRecovered
InterventionSafetyStateChanged
```

---

## 20. Failure Codes

```text
INTERVENTION_EXECUTION_NOT_READY
INTERVENTION_EXECUTION_VERSION_CONFLICT
INTERVENTION_PLAN_NOT_APPROVED
INTERVENTION_BINDING_UNAVAILABLE
INTERVENTION_CAPABILITY_VERSION_UNAVAILABLE
INTERVENTION_DISPATCH_REJECTED
INTERVENTION_DUPLICATE_SIDE_EFFECT
INTERVENTION_DOSAGE_LIMIT_REACHED
INTERVENTION_SAFETY_BLOCKED
INTERVENTION_PHASE_ENTRY_FAILED
INTERVENTION_PHASE_EXIT_FAILED
INTERVENTION_RETRY_NOT_ALLOWED
INTERVENTION_RESUME_REVALIDATION_FAILED
INTERVENTION_EVIDENCE_CAPTURE_FAILED
INTERVENTION_EXECUTION_EXPIRED
INTERVENTION_RECOVERY_INCONCLUSIVE
```

---

## 21. Concurrency and Idempotency

1. Intervention execution uses optimistic version control.
2. Activity dispatches require stable idempotency keys.
3. Duplicate channel receipts must not duplicate dosage or evidence.
4. Late results are accepted only through explicit temporal policy.
5. Concurrent human and automated actions must resolve through authority ordering, not last-write-wins.
6. Terminal states reject further execution side effects.

---

## 22. Execution Invariants

1. No execution begins without an approved plan and authorized intervention.
2. Every activity runs through a declared versioned binding.
3. Execution records what happened, not what was intended.
4. Completion is distinct from effectiveness.
5. Safety blocks override schedule and optimization goals.
6. Retries are bounded, classified, and auditable.
7. Interruption recovery requires durable runtime evidence.
8. Automatic adaptation remains within pre-authorized bounds.
9. Missing evidence is never silently treated as success.
10. Learner dignity, pause, and human override remain available throughout execution.

---

## 23. Completion Condition

34C is complete when approved intervention plans can be activated and delivered through versioned channels with durable execution sessions, phase sequencing, dosage accounting, evidence capture, safety enforcement, retry and interruption recovery, bounded adaptation requests, idempotent side effects, and an explicit handoff from execution completion to effectiveness evaluation.
