# Chapter 35A — Learning Session Runtime Foundation

## 1. Purpose

Learning Session Runtime governs the bounded period in which a learner, one or more delivery channels, and one or more learning objectives are actively coordinated into a real learning experience.

It is the runtime bridge between planned learning intent and observed learning activity.

This chapter defines the authority, language, boundaries, lifecycle, contracts, and invariants required before session planning, orchestration, adaptation, evidence capture, persistence, or verification may be implemented.

## 2. Core Distinctions

The runtime must preserve these distinctions:

- Session intent is not session execution.
- Session execution is not learner engagement.
- Learner engagement is not understanding.
- Activity completion is not objective completion.
- Objective completion is not mastery.
- Mastery evidence in one context is not transfer.
- A paused session is not a failed session.
- An interrupted session is not necessarily abandoned.
- A resumed session is not a new session unless authority explicitly creates a new session.
- Session projection is not session authority.

## 3. Runtime Responsibilities

Learning Session Runtime owns:

- session identity and lifecycle,
- session authority and ownership,
- objective bindings,
- activity sequence bindings,
- channel bindings,
- participant bindings,
- execution coordination,
- pause, resume, interrupt, cancel, and complete semantics,
- session-scoped evidence capture,
- runtime checkpoints,
- session continuity and recovery,
- cross-runtime correlation,
- session outcome handoff.

It does not own:

- curriculum truth,
- skill graph truth,
- diagnostic truth,
- intervention policy truth,
- global mastery truth,
- long-term progress truth,
- recommendation generation,
- assessment item authoring,
- gameplay world ownership.

## 4. Upstream Authorities

A session may be created from one or more upstream authorities:

- Learning Engine,
- Mission Engine,
- Intervention Runtime,
- Assessment Engine,
- Curriculum Runtime,
- Teacher or tutor authority,
- Parent-supported authority where policy allows,
- learner self-directed authority where policy allows.

Every session must record why it exists and which upstream authority authorized its creation.

## 5. Aggregate Identity

The authoritative aggregate is `LearningSession`.

Required identity fields:

```text
sessionId
learnerId
tenantId
sessionKind
createdAt
createdBy
sourceAuthorityType
sourceAuthorityId
correlationId
causationId
version
```

A session identity is stable across pause, resume, interruption recovery, and projection rebuild.

## 6. Session Kinds

Minimum supported kinds:

```text
GUIDED_LEARNING
SELF_DIRECTED_PRACTICE
INTERVENTION_SESSION
ASSESSMENT_SESSION
MISSION_SESSION
GAMEPLAY_LEARNING_SESSION
REVIEW_SESSION
REMEDIATION_SESSION
TUTOR_LED_SESSION
HYBRID_SESSION
```

Session kind informs policy and defaults but does not silently alter authority.

## 7. Lifecycle

Authoritative lifecycle:

```text
DRAFT
PLANNED
AUTHORIZED
READY
STARTING
ACTIVE
PAUSED
WAITING_FOR_LEARNER
WAITING_FOR_CHANNEL
WAITING_FOR_HUMAN
INTERRUPTED
RECOVERY_PENDING
RESUMING
COMPLETING
COMPLETED
CANCELLED
ABANDONED
EXPIRED
FAILED
```

### 7.1 Terminal States

```text
COMPLETED
CANCELLED
ABANDONED
EXPIRED
FAILED
```

A terminal session cannot return to an active state.

### 7.2 Completion Meaning

`COMPLETED` means the session completed its authorized runtime flow.

It does not prove:

- all objectives were achieved,
- understanding was established,
- mastery was reached,
- intervention was effective,
- assessment validity was satisfied.

## 8. State Transition Authority

Transitions require explicit commands and expected-version checks.

Examples:

```text
PlanLearningSession
AuthorizeLearningSession
MarkLearningSessionReady
StartLearningSession
PauseLearningSession
ResumeLearningSession
InterruptLearningSession
RequestSessionRecovery
CompleteLearningSession
CancelLearningSession
AbandonLearningSession
ExpireLearningSession
FailLearningSession
```

No UI, projection, channel, activity, or child runtime may mutate session state directly.

## 9. Session Scope

A session is bounded by:

- one learner,
- one tenant or operational context,
- one authority chain,
- one lifecycle,
- one active session plan version,
- one evidence namespace,
- one runtime ledger.

A session may contain multiple objectives, activities, phases, channels, and human participants.

## 10. Objective Binding

Each session objective must include:

```text
objectiveId
objectiveType
targetRef
targetVersion
priority
requiredEvidence
completionPolicy
sourceAuthorityRef
```

Supported objective types may include:

```text
SKILL_ACQUISITION
SKILL_REINFORCEMENT
MISCONCEPTION_REPAIR
RETENTION_CHECK
TRANSFER_PRACTICE
MISSION_PROGRESS
INTERVENTION_TARGET
ASSESSMENT_OBJECTIVE
```

Objective bindings must be versioned and immutable once the session starts. Changes require a new session plan version.

## 11. Activity Binding

Activities are executable units inside the session.

Required fields:

```text
activityId
activityType
activityVersion
objectiveRefs
channelBinding
sequencePolicy
completionPolicy
evidencePolicy
retryPolicy
```

An activity may be delivered by:

- lesson UI,
- practice UI,
- gameplay runtime,
- assessment runtime,
- tutor-led interaction,
- teacher-led interaction,
- parent-supported interaction,
- external learning channel.

## 12. Participant Model

Participants may include:

```text
LEARNER
TEACHER
TUTOR
PARENT
FACILITATOR
SYSTEM_AGENT
CHANNEL_AGENT
```

Participant presence does not imply authority. Authority must be explicit.

## 13. Session Time Model

The runtime distinguishes:

- planned start time,
- authorized start window,
- actual start time,
- active duration,
- paused duration,
- waiting duration,
- interrupted duration,
- actual completion time,
- expiry time.

Wall-clock duration and active learning duration must not be conflated.

## 14. Session Checkpoint

A checkpoint is a durable, replay-safe marker of recoverable session progress.

Minimum checkpoint fields:

```text
checkpointId
sessionId
sessionVersion
planVersion
phaseId
activityId
activityRuntimeState
evidenceCursor
channelCursor
createdAt
```

A checkpoint accelerates recovery but does not replace the event ledger.

## 15. Cross-Runtime Contracts

### 15.1 Inputs

Learning Session Runtime may receive:

- learning plan references,
- intervention plan references,
- mission objective references,
- diagnostic context references,
- curriculum and skill graph references,
- assessment configuration references,
- learner preference and accessibility references.

### 15.2 Outputs

It emits authoritative facts such as:

```text
LearningSessionPlanned
LearningSessionAuthorized
LearningSessionStarted
SessionActivityStarted
SessionActivityCompleted
SessionPaused
SessionInterrupted
SessionResumed
SessionCheckpointCreated
LearningSessionCompleted
LearningSessionCancelled
LearningSessionAbandoned
LearningSessionFailed
SessionEvidenceRecorded
```

Downstream consumers may include Progress Engine, Assessment Engine, Intervention Runtime, Diagnostic Runtime, Mission Engine, Learning Engine, and projection builders.

## 16. Failure Taxonomy

Minimum failure classes:

```text
AUTHORITY_FAILURE
PLAN_FAILURE
CHANNEL_FAILURE
PARTICIPANT_FAILURE
EVIDENCE_FAILURE
POLICY_FAILURE
SAFETY_FAILURE
RECOVERY_FAILURE
CONCURRENCY_FAILURE
EXPIRY_FAILURE
UNKNOWN_FAILURE
```

Failure classification must preserve whether the failure is retryable, recoverable, terminal, or requires human review.

## 17. Safety and Accessibility

Every session must carry applicable safeguards:

- age-appropriate interaction policy,
- workload and fatigue limits,
- accessibility accommodations,
- privacy constraints,
- content suitability constraints,
- human escalation rules,
- stop conditions.

Safety rules override schedule, engagement optimization, streaks, rewards, and completion pressure.

## 18. Concurrency

A learner may have multiple non-active sessions, but active-session concurrency must be explicitly governed.

Policies must define:

- whether multiple active sessions are allowed,
- which session kinds conflict,
- how foreground and background sessions differ,
- how duplicate starts are refused,
- how expected-version conflicts are handled.

## 19. Idempotency

Every command must support idempotent processing through a stable command or operation identifier.

Repeated delivery of the same command must not duplicate:

- session creation,
- activity dispatch,
- evidence records,
- checkpoint creation,
- completion events,
- downstream notifications.

## 20. Observability

Minimum operational observability:

```text
sessionId
learnerId
state
planVersion
currentPhaseId
currentActivityId
lastCheckpointId
lastEventAt
activeDuration
pauseDuration
waitDuration
interruptionCount
failureClass
correlationId
```

Observability data is not learner-facing truth unless projected through an authorized read model.

## 21. Foundation Invariants

1. A session cannot start without an authorized plan.
2. A session cannot have more than one authoritative active plan version.
3. A terminal session cannot resume.
4. Activity execution cannot mutate session authority directly.
5. Completion cannot establish mastery by itself.
6. Projection cannot authorize transitions.
7. Replay cannot emit external side effects.
8. Safety rules override optimization goals.
9. Recovery must continue from durable evidence, not UI memory.
10. Historical session facts remain immutable.
11. Every session outcome remains explainable through its authority chain and ledger.
12. Session activity and session objective outcomes remain distinct.

## 22. Acceptance Criteria

35A is complete when the architecture defines:

- authoritative aggregate ownership,
- session identity and lifecycle,
- command-based transition authority,
- objective and activity bindings,
- time, checkpoint, concurrency, and idempotency semantics,
- cross-runtime boundaries,
- safety and accessibility authority,
- foundational invariants.

## 23. Final Doctrine

Learning Session Runtime turns authorized learning intent into a bounded, observable, recoverable learning experience while preserving the difference between what was planned, what occurred, what evidence was captured, and what the learner ultimately understood.
