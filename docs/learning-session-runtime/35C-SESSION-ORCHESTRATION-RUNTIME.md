# Chapter 35C — Session Orchestration Runtime

## 1. Purpose

Session Orchestration Runtime coordinates the authorized session plan as it becomes a live learning experience.

It owns runtime progression across phases and activities, channel activation, participant coordination, checkpoint creation, interruption handling, and completion handoff while preserving plan authority and evidence integrity.

## 2. Orchestration Boundary

Orchestration owns:

- session activation,
- phase activation and completion,
- activity dispatch and acknowledgement,
- channel coordination,
- participant wait states,
- runtime progression,
- pause and resume,
- interruption detection,
- checkpoint requests,
- retry coordination,
- completion coordination,
- terminal failure coordination.

It does not own:

- plan authoring,
- diagnostic revision,
- unrestricted adaptation,
- mastery declaration,
- long-term progress aggregation,
- channel-internal business logic.

## 3. Runtime Inputs

Activation requires:

```text
sessionId
expectedSessionVersion
authorizedPlanId
authorizedPlanVersion
activationCommandId
requestedStartAt
actorId
actorRole
correlationId
```

The runtime must verify that:

- the session is ready,
- the plan is authorized and current,
- required participants are valid,
- mandatory channels are available or an authorized fallback exists,
- no conflicting active session policy is violated,
- safety and expiry checks pass.

## 4. Runtime State

The session runtime state includes:

```text
sessionId
sessionVersion
state
planId
planVersion
currentPhaseId
currentActivityId
activeChannelBindings
participantStates
activityRuntimeStates
lastCheckpointId
evidenceCursor
startedAt
lastActiveAt
activeDuration
pausedDuration
waitingDuration
interruptionCount
retryCount
```

This state is authoritative only when reconstructed from the durable session ledger and valid snapshots.

## 5. Phase Runtime Lifecycle

Each phase follows:

```text
PENDING
READY
ACTIVE
WAITING
PAUSED
COMPLETING
COMPLETED
SKIPPED
BLOCKED
FAILED
```

A phase may be skipped only when the authorized plan allows it and the reason is recorded.

## 6. Activity Runtime Lifecycle

Each activity follows:

```text
PENDING
READY
DISPATCHING
ACTIVE
WAITING_FOR_LEARNER
WAITING_FOR_HUMAN
WAITING_FOR_CHANNEL
PAUSED
RETRY_PENDING
COMPLETING
COMPLETED
SKIPPED
INTERRUPTED
ABORTED
EXPIRED
FAILED
```

Activity completion does not automatically complete the phase or objective.

## 7. Activation Pipeline

```text
Receive activation command
Validate idempotency
Load authoritative session
Validate expected version
Load authorized plan version
Validate runtime preconditions
Acquire session execution lease
Create activation event
Activate initial phase
Resolve first executable activity
Dispatch activity to authorized channel
Persist dispatch facts
Publish projection notifications
```

External dispatch occurs only after the intent to dispatch is durably recorded through the outbox or equivalent mechanism.

## 8. Execution Lease

A session execution lease prevents concurrent orchestrators from advancing the same session.

Lease fields:

```text
leaseId
sessionId
holderId
acquiredAt
expiresAt
heartbeatAt
fencingToken
```

A stale holder cannot advance the session after a newer fencing token is issued.

## 9. Activity Dispatch

Dispatch contract:

```text
dispatchId
sessionId
planVersion
phaseId
activityId
activityVersion
channelId
channelVersion
participantBindings
runtimeParameters
evidenceRequirements
idempotencyKey
correlationId
```

The channel must acknowledge acceptance, rejection, duplicate delivery, temporary unavailability, or permanent incompatibility.

## 10. Channel Responses

```text
ACCEPTED
DUPLICATE
TEMPORARILY_UNAVAILABLE
PERMANENTLY_UNAVAILABLE
UNSUPPORTED_VERSION
POLICY_REJECTED
SAFETY_REJECTED
INVALID_BINDING
```

A rejected dispatch cannot be treated as learner non-participation.

## 11. Runtime Progression

Progression requires explicit evidence that the current activity reached an allowed exit condition.

The orchestrator evaluates:

- activity completion policy,
- required evidence capture acknowledgement,
- retry status,
- phase exit conditions,
- stop conditions,
- pending adaptation requests,
- mandatory checkpoint boundary.

The orchestrator never infers completion solely from UI navigation.

## 12. Participant Coordination

Participant state may be:

```text
NOT_REQUIRED
EXPECTED
PRESENT
ACTIVE
WAITING
UNAVAILABLE
DECLINED
DISCONNECTED
REMOVED
```

Participant unavailability may cause wait, fallback, re-plan, pause, or cancellation according to the plan.

## 13. Pause Semantics

Pause reasons include:

```text
LEARNER_REQUEST
HUMAN_REQUEST
BREAK_POLICY
FATIGUE_SIGNAL
CHANNEL_DISRUPTION
SAFETY_REVIEW
ADAPTATION_REVIEW
SYSTEM_MAINTENANCE
```

Pause must record:

```text
pauseId
reason
requestedBy
pausedAt
checkpointRef
resumeConditions
expiryAt
```

A pause preserves the session identity and active plan version.

## 14. Resume Semantics

Resume requires:

- a non-terminal session,
- a valid checkpoint or replay position,
- satisfied resume conditions,
- valid plan version,
- available required channels and participants,
- fresh safety validation,
- execution lease acquisition.

Resume must not duplicate already completed activities or evidence.

## 15. Interruption Semantics

An interruption is an unplanned loss of orchestration continuity.

Sources include:

- process termination,
- device loss,
- network loss,
- channel crash,
- lease loss,
- browser closure,
- human disconnect,
- dependency outage.

Interruption is detected from durable runtime signals, lease expiry, heartbeat loss, or channel status—not merely UI absence.

## 16. Recovery Pipeline

```text
Detect interruption
Mark recovery pending
Stop unsafe external dispatch
Load ledger and latest valid snapshot
Validate plan and policy freshness
Reconstruct runtime state
Reconcile channel dispatches
Reconcile evidence cursor
Resolve incomplete activity state
Create recovery checkpoint
Acquire new fenced lease
Resume, pause, re-plan, or terminate
```

Recovery must prefer recorded evidence over assumptions.

## 17. Retry Policy

Retries require an authorized retry policy with:

```text
maximumAttempts
retryableFailureClasses
backoffPolicy
sameChannelAllowed
fallbackChannelAllowed
learnerImpactLimit
humanReviewThreshold
```

Retries must be idempotent and must not duplicate scoring, rewards, evidence, or progress updates.

## 18. Waiting States

Waiting is explicit runtime state, not invisible inactivity.

Waiting must track:

```text
waitingFor
waitingReason
startedAt
maximumWait
fallbackAction
escalationAction
```

Waiting duration is separated from active learning duration.

## 19. Checkpoint Coordination

Mandatory checkpoint moments may include:

- after phase completion,
- before channel switch,
- before human handoff,
- before a non-idempotent external interaction,
- after evidence batch acknowledgement,
- before pause,
- before adaptation activation,
- before session completion.

The orchestrator requests checkpoints; persistence authority determines durable success.

## 20. Evidence Coordination

The orchestrator records evidence references and capture acknowledgements but does not rewrite evidence meaning.

It must preserve:

```text
evidenceId
captureSource
activityRef
objectiveRefs
capturedAt
receivedAt
validationState
privacyClass
```

Missing evidence may block activity, phase, or session completion according to policy.

## 21. Completion Pipeline

```text
Receive completion signal
Validate current activity state
Validate phase exit conditions
Validate session completion policy
Ensure required evidence acknowledgements
Create final checkpoint
Close active channels
Release participant bindings
Persist session completion event
Release execution lease
Publish downstream handoff events
```

Downstream handoff may trigger assessment interpretation, progress aggregation, intervention effectiveness evaluation, or mission progression.

## 22. Cancellation, Abandonment, Expiry, and Failure

These terminal outcomes remain distinct:

- `CANCELLED`: authorized decision to stop before completion.
- `ABANDONED`: continuation was possible but the session was intentionally left beyond policy limits.
- `EXPIRED`: authorized time window ended.
- `FAILED`: runtime could not safely or correctly continue.

Each requires an explicit reason and outcome summary.

## 23. Commands

```text
ActivateLearningSession
ActivateSessionPhase
DispatchSessionActivity
AcknowledgeActivityDispatch
RecordActivityRuntimeUpdate
CompleteSessionActivity
SkipSessionActivity
PauseLearningSession
ResumeLearningSession
MarkSessionInterrupted
RequestSessionRecovery
RetrySessionActivity
CompleteLearningSession
CancelLearningSession
AbandonLearningSession
ExpireLearningSession
FailLearningSession
```

## 24. Events

```text
LearningSessionActivated
SessionPhaseActivated
SessionActivityDispatchRequested
SessionActivityDispatched
SessionActivityAccepted
SessionActivityStarted
SessionActivityWaiting
SessionActivityCompleted
SessionActivitySkipped
SessionActivityFailed
SessionPaused
SessionResumeRequested
SessionResumed
SessionInterrupted
SessionRecoveryStarted
SessionRecovered
SessionCheckpointRequested
LearningSessionCompleted
LearningSessionCancelled
LearningSessionAbandoned
LearningSessionExpired
LearningSessionFailed
```

## 25. Orchestration Failure Codes

```text
SESSION_NOT_READY
PLAN_NOT_AUTHORIZED
PLAN_VERSION_MISMATCH
SESSION_VERSION_CONFLICT
EXECUTION_LEASE_CONFLICT
CHANNEL_UNAVAILABLE
CHANNEL_REJECTED
PARTICIPANT_UNAVAILABLE
ACTIVITY_NOT_EXECUTABLE
EVIDENCE_REQUIREMENT_UNSATISFIED
CHECKPOINT_FAILED
RECOVERY_STATE_AMBIGUOUS
RETRY_LIMIT_EXCEEDED
SAFETY_BLOCKED
POLICY_BLOCKED
SESSION_EXPIRED
TERMINAL_SESSION
```

## 26. Orchestration Invariants

1. Only one valid fenced executor may advance a session.
2. Dispatch intent must be durable before external delivery.
3. Duplicate dispatch must not duplicate activity effects.
4. UI navigation cannot establish activity completion.
5. A channel rejection cannot be classified as learner failure.
6. Pause and interruption remain distinct.
7. Recovery must use ledger evidence and valid checkpoints.
8. Resume cannot duplicate completed work or evidence.
9. Retry cannot duplicate rewards, scoring, or progress.
10. Waiting time cannot be counted as active learning time.
11. Terminal sessions cannot resume.
12. Session completion cannot establish mastery by itself.
13. Safety and policy blocks override progression.
14. The active plan version cannot change silently.
15. Every transition must remain correlated to its command and cause.

## 27. Acceptance Criteria

35C is complete when the architecture defines:

- orchestration ownership and runtime state,
- phase and activity lifecycles,
- activation, dispatch, progression, pause, resume, interruption, recovery, retry, waiting, checkpoint, evidence, and completion flows,
- execution leases and fencing,
- commands, events, failure codes, and invariants,
- clear boundaries with planning, channels, evidence, assessment, progress, intervention, mission, and gameplay runtimes.

## 28. Final Doctrine

Session Orchestration Runtime must advance only what has been authorized, record what actually happened, survive interruption through durable evidence, and never confuse channel activity, learner activity, session completion, or learning success with one another.
