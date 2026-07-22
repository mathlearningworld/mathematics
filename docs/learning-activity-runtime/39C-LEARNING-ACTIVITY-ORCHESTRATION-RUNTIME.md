# Chapter 39C — Learning Activity Orchestration Runtime

## 1. Purpose

Learning Activity Orchestration Runtime coordinates the valid execution lifecycle of an authorized activity instance.

It is responsible for moving a learner activity from readiness into active work, through pause/resume and completion, while preserving authority, concurrency safety, session linkage, deadlines, retries, cancellation, and recovery.

```text
Authorization decides whether execution may begin.
Orchestration decides how an authorized activity advances safely.
```

---

## 2. Runtime Boundary

Orchestration owns:

- readiness transition
- start coordination
- active-session binding
- pause and resume coordination
- completion acceptance
- close coordination
- cancellation and abort coordination
- timeout and expiry coordination
- retry sequencing
- activity dependency sequencing
- crash and ambiguous-outcome recovery

Orchestration does not own:

- path planning
- authorization policy decisions
- detailed in-session interaction state
- evidence interpretation
- mastery decisions

---

## 3. Primary Flow

```text
Create Activity
      ↓
Request Authorization
      ↓
Authorize
      ↓
Mark Ready
      ↓
Start
      ↓
Execute through Learning Session Runtime
      ↓
Pause / Resume when needed
      ↓
Receive Session Outcome
      ↓
Complete Activity
      ↓
Link Evidence
      ↓
Close Activity
```

Alternative flows include cancellation, revocation, expiry, abort, replacement, and retry.

---

## 4. Orchestration State

```ts
interface ActivityOrchestrationState {
  activityId: string;
  activityVersion: number;
  status: string;
  activeSessionId?: string;
  activeAttemptNumber?: number;
  orchestrationEpoch: number;
  pendingOperation?: PendingActivityOperation;
  lastCompletedOperationId?: string;
  lastTransitionAt: string;
}
```

`orchestrationEpoch` increments whenever execution authority is re-established after pause, retry, replacement, or recovery.

---

## 5. Pending Operations

Long-running or cross-runtime actions are represented explicitly.

```ts
interface PendingActivityOperation {
  operationId: string;
  operationType:
    | 'START_SESSION'
    | 'PAUSE_SESSION'
    | 'RESUME_SESSION'
    | 'COMPLETE_ACTIVITY'
    | 'ABORT_SESSION'
    | 'CLOSE_ACTIVITY';
  status: 'REQUESTED' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'COMPLETED' | 'FAILED' | 'UNKNOWN';
  requestedAt: string;
  correlationId: string;
  attempt: number;
}
```

Ambiguous external outcomes must be recorded as `UNKNOWN`, not guessed as success or failure.

---

## 6. Start Coordination

Starting an activity requires all of the following:

- status is `READY`
- authorization remains valid
- learner and tenant match
- current time is within execution window
- no active session already exists
- attempt limit permits start
- activity definition version remains executable
- expected activity version matches

Start flow:

```text
StartLearningActivity command
      ↓
Validate activity state and authorization
      ↓
Record SessionStartRequested operation
      ↓
Request Learning Session Runtime session creation
      ↓
Receive session identity
      ↓
Bind activity to session
      ↓
Transition activity to IN_PROGRESS
```

The binding and lifecycle transition must be recoverable if a crash occurs between external session creation and local commit.

---

## 7. Session Binding

An activity may have at most one active session at a time.

```ts
interface ActivitySessionBinding {
  activityId: string;
  sessionId: string;
  learnerId: string;
  attemptNumber: number;
  orchestrationEpoch: number;
  boundAt: string;
}
```

A session outcome from an unbound, stale, or mismatched session must be rejected.

Historical session references remain attached to the activity attempt timeline.

---

## 8. Pause Coordination

Pause is permitted only when:

- activity is `IN_PROGRESS`
- active session exists
- session supports pause
- activity has not been revoked or force-aborted
- expected versions match

Pause flow:

```text
PauseLearningActivity
      ↓
Request session pause
      ↓
Confirm session checkpoint
      ↓
Record checkpoint reference
      ↓
Transition activity to PAUSED
```

A UI-only pause without session checkpoint confirmation must not change aggregate state.

---

## 9. Resume Coordination

Resume requires:

- activity is `PAUSED`
- authorization permits continuation
- checkpoint is valid
- activity has not expired under continuation policy
- no competing session exists

Resume may:

1. resume the existing session, or
2. create a continuation session tied to the same attempt.

The policy must define which model applies.

Resume increments orchestration epoch when execution authority is re-established.

---

## 10. Completion Coordination

Activity completion begins from an authoritative session outcome report.

```ts
interface CompleteActivityFromSessionCommand {
  commandId: string;
  tenantId: string;
  activityId: string;
  expectedActivityVersion: number;
  sessionId: string;
  sessionOutcomeVersion: number;
  outcomeCode: string;
  completedAt: string;
  evidenceReferences: string[];
  correlationId: string;
}
```

Validation includes:

- activity is in progress or valid paused-completion state
- session matches active binding
- learner and tenant match
- outcome report is final
- report has not already been consumed
- evidence references are structurally valid

Completion does not assert mastery. It records that the bounded activity execution ended with a defined outcome.

---

## 11. Close Coordination

`COMPLETED` and `CLOSED` are distinct.

```text
COMPLETED = execution outcome accepted
CLOSED = all required post-execution obligations finalized
```

Closure may require:

- required evidence links persisted
- session finalization confirmed
- outstanding operations resolved
- audit metadata complete
- downstream notifications dispatched or safely queued

Closure must not wait synchronously for optional analytics or projection updates.

---

## 12. Cancellation

Cancellation applies before or outside active execution when policy allows.

Examples:

- learner or teacher cancels before start
- path adaptation removes the activity
- replacement activity is created
- assignment is withdrawn

Cancellation must preserve reason, actor, timestamp, and source.

A cancellation request during active execution must either be rejected or converted into an abort flow according to policy.

---

## 13. Abort

Abort terminates active execution.

Abort may be triggered by:

- learner exit with explicit abandonment
- safety incident
- revocation requiring immediate stop
- unrecoverable session failure
- operator intervention
- maximum session duration breach

Abort flow:

```text
AbortLearningActivity
      ↓
Request session termination
      ↓
Capture final checkpoint or failure evidence where possible
      ↓
Unbind active session
      ↓
Transition activity to ABORTED
```

Abort must never be represented as completion.

---

## 14. Expiry and Timeout

Expiry and timeout are separate.

```text
Activity expiry = no new execution may begin
Session timeout = active execution exceeded session policy
Operation timeout = cross-runtime acknowledgement did not arrive in time
```

An activity expiry scheduler may emit `ExpireLearningActivity` only after checking current aggregate version and status.

Stale scheduled commands must fail harmlessly.

---

## 15. Retry Orchestration

Retry begins only after explicit retry authorization.

Possible models:

### Same activity, new attempt

```text
ABORTED or COMPLETED
      ↓ retry authorized
READY
      ↓
new session, incremented attemptNumber
```

### New activity lineage

```text
Original activity terminal
      ↓
New activity created with parentActivityId
```

The runtime must not mix these models for the same policy version.

---

## 16. Dependency Sequencing

Activities may depend on prior activities.

```ts
interface ActivityDependency {
  dependencyActivityId: string;
  requiredState: 'COMPLETED' | 'CLOSED';
  requiredOutcomeCodes?: string[];
}
```

Dependencies affect readiness, not historical identity.

Dependency completion must be validated against authoritative activity state, not projection alone.

Circular dependencies are forbidden.

---

## 17. Concurrency

Potential races include:

- start versus revoke
- start versus expire
- pause versus complete
- complete versus abort
- close versus invalidate
- retry versus replacement

All transitions require expected version and deterministic precedence policy.

A recommended precedence for simultaneous authoritative facts:

```text
Safety abort/revocation
    > accepted completion already committed
    > pause/resume request
    > learner cancellation
    > scheduled expiry
```

The actual committed order remains authoritative.

---

## 18. Idempotency

Every orchestration command and external operation must be idempotent.

Idempotency keys include:

- command ID
- operation ID
- session outcome report ID or version
- event ID

Repeated completion reports must not create duplicate activity completion or evidence links.

Repeated session-start requests must return the existing session binding when the original request succeeded.

---

## 19. Ambiguous Outcome Recovery

Example: session creation succeeded remotely, but the activity runtime crashed before storing the session ID.

Recovery procedure:

1. load pending operation
2. query external runtime by operation ID or idempotency key
3. reconcile authoritative result
4. commit binding if session exists
5. retry request only when external runtime confirms no prior success
6. record recovery event

Never create a second session merely because the first response was lost.

---

## 20. Crash Recovery

On restart, the runtime scans or queries activities with unresolved pending operations.

Recovery states:

```text
REQUESTED
DISPATCHED
UNKNOWN
ACKNOWLEDGED
```

Recovery must be bounded, retryable, observable, and safe under repeated execution.

---

## 21. Commands

```text
MarkActivityReady
StartLearningActivity
BindActivitySession
PauseLearningActivity
ConfirmActivityPaused
ResumeLearningActivity
ConfirmActivityResumed
CompleteLearningActivity
CloseLearningActivity
CancelLearningActivity
AbortLearningActivity
ExpireLearningActivity
AuthorizeActivityRetryExecution
RecoverPendingActivityOperation
```

---

## 22. Events

```text
LearningActivityMarkedReady
ActivitySessionStartRequested
ActivitySessionBound
LearningActivityStarted
ActivityPauseRequested
LearningActivityPaused
ActivityResumeRequested
LearningActivityResumed
ActivityCompletionReported
LearningActivityCompleted
ActivityCloseRequested
LearningActivityClosed
LearningActivityCancelled
ActivityAbortRequested
LearningActivityAborted
LearningActivityExpired
ActivityRetryExecutionAuthorized
ActivityPendingOperationRecovered
ActivityOperationFailed
```

---

## 23. Failure Codes

```text
ORCHESTRATION_ACTIVITY_NOT_READY
ORCHESTRATION_AUTHORIZATION_INVALID
ORCHESTRATION_ACTIVE_SESSION_EXISTS
ORCHESTRATION_SESSION_BINDING_MISMATCH
ORCHESTRATION_SESSION_OUTCOME_NOT_FINAL
ORCHESTRATION_SESSION_OUTCOME_ALREADY_CONSUMED
ORCHESTRATION_PAUSE_NOT_SUPPORTED
ORCHESTRATION_RESUME_CHECKPOINT_INVALID
ORCHESTRATION_ACTIVITY_EXPIRED
ORCHESTRATION_ACTIVITY_REVOKED
ORCHESTRATION_RETRY_NOT_AUTHORIZED
ORCHESTRATION_DEPENDENCY_NOT_SATISFIED
ORCHESTRATION_OPERATION_OUTCOME_UNKNOWN
ORCHESTRATION_VERSION_CONFLICT
ORCHESTRATION_INVALID_TRANSITION
```

---

## 24. Projection Expectations

Operational projection must expose:

- current activity status
- active session reference
- attempt number
- pending operation and age
- next allowed command
- blockers
- deadline and expiry
- dependency state
- retry eligibility
- recovery state

Learner projection should simplify this to current task, progress state, pause/resume availability, and next action.

---

## 25. Observability

Required metrics:

- ready-to-start latency
- session start failure rate
- duplicate start prevention count
- pause/resume success rate
- completion acceptance latency
- close latency
- abort rate
- expiry rate
- unresolved operation count
- ambiguous-outcome recovery count
- stale scheduled command count
- concurrency conflict count

---

## 26. Orchestration Invariants

1. At most one active session may be bound to an activity.
2. An activity cannot start without valid authorization.
3. Start must bind the exact learner and tenant.
4. Session outcome must match the active binding.
5. Completion does not imply mastery.
6. Close occurs only after required post-execution obligations.
7. Abort is never recorded as completion.
8. Pause requires a valid session checkpoint when policy requires it.
9. Resume cannot create concurrent execution.
10. Retry requires explicit authorization.
11. Ambiguous external outcomes are reconciled before retry.
12. Duplicate commands cannot duplicate sessions or transitions.
13. Terminal activities cannot re-enter execution.
14. Scheduled expiry must be version checked.
15. Projection cannot authorize orchestration transitions.

---

## 27. Architectural Summary

```text
Authorization grants bounded permission.
Orchestration turns that permission into one safe execution lifecycle.
Learning Session performs the live work.
Activity completion records outcome without claiming mastery.
```

Learning Activity Orchestration Runtime is the execution coordinator that preserves correctness across lifecycle transitions and runtime boundaries.
