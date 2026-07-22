# Chapter 39A — Learning Activity Runtime Foundation

## 1. Purpose

Learning Activity Runtime is the bounded runtime responsible for turning an approved learning path step into an executable unit of learner work.

Learning Path decides what should happen next.

Learning Activity defines the concrete, bounded, governable unit that can be authorized, executed, observed, completed, cancelled, expired, retried, and audited.

This runtime supports activity forms such as:

- lesson
- guided practice
- independent practice
- quiz
- challenge
- review
- diagnostic
- simulation
- exploration
- project
- assignment

The runtime does not own mastery truth, curriculum truth, session execution internals, or long-term learning-path planning. It owns the operational lifecycle of a single activity instance.

---

## 2. Architectural Position

```text
Mission Runtime
      ↓
Learning Path Runtime
      ↓
Learning Activity Runtime
      ↓
Learning Session Runtime
      ↓
Evidence Runtime
      ↓
Mastery Runtime
      ↓
Learning Path Runtime
```

Learning Activity Runtime is the operational bridge between planning and execution.

It accepts an approved path intent and materializes an activity that can safely enter learner execution.

---

## 3. Core Boundary

### Learning Path Runtime owns

- path objective
- path order
- path eligibility
- path adaptation lineage
- next-action recommendation

### Learning Activity Runtime owns

- activity identity
- activity type
- activity version
- activity authorization state
- activity execution lifecycle
- activity retry and cancellation policy
- activity deadline and expiry
- activity outcome reference
- activity evidence linkage

### Learning Session Runtime owns

- live attempt execution
- interaction stream
- in-session state
- pause and resume mechanics
- attempt completion details

### Evidence Runtime owns

- durable evidence records
- evidence integrity
- evidence classification
- evidence supersession

### Mastery Runtime owns

- justified learner capability state

---

## 4. Core Aggregate

The primary aggregate is `LearningActivity`.

```ts
interface LearningActivity {
  activityId: string;
  tenantId: string;
  learnerId: string;
  pathId: string;
  pathVersion: number;
  pathStepId: string;
  activityType: LearningActivityType;
  activityDefinitionId: string;
  activityDefinitionVersion: string;
  status: LearningActivityStatus;
  authorization: ActivityAuthorizationState;
  retryPolicy: ActivityRetryPolicy;
  timing: ActivityTimingPolicy;
  lineage: ActivityLineage;
  execution: ActivityExecutionState;
  evidence: ActivityEvidenceReference[];
  createdAt: string;
  updatedAt: string;
  version: number;
}
```

The aggregate must remain tenant-safe, learner-bound, versioned, and replayable.

---

## 5. Activity Identity

Every activity instance requires an immutable identity.

Identity must not be inferred from content ID, session ID, or path step ID alone.

```text
activityId ≠ activityDefinitionId
activityId ≠ sessionId
activityId ≠ pathStepId
```

Multiple activities may originate from the same path step when retry, remediation, or replacement is explicitly authorized.

Each activity must preserve lineage to its source path version and step.

---

## 6. Activity Types

```ts
type LearningActivityType =
  | 'LESSON'
  | 'GUIDED_PRACTICE'
  | 'INDEPENDENT_PRACTICE'
  | 'QUIZ'
  | 'CHALLENGE'
  | 'REVIEW'
  | 'DIAGNOSTIC'
  | 'SIMULATION'
  | 'EXPLORATION'
  | 'PROJECT'
  | 'ASSIGNMENT';
```

Activity type describes the operational form of learner work. It must not be used as a substitute for pedagogical objective, content identity, or mastery claim.

---

## 7. Lifecycle

```text
DRAFT
  ↓
PENDING_AUTHORIZATION
  ↓
AUTHORIZED
  ↓
READY
  ↓
IN_PROGRESS
  ↓
PAUSED
  ↓
IN_PROGRESS
  ↓
COMPLETED
  ↓
CLOSED
```

Alternative terminal transitions:

```text
DRAFT → CANCELLED
PENDING_AUTHORIZATION → REJECTED
AUTHORIZED → REVOKED
READY → EXPIRED
IN_PROGRESS → ABORTED
PAUSED → ABORTED
COMPLETED → INVALIDATED
```

Terminal states are:

- `CLOSED`
- `CANCELLED`
- `REJECTED`
- `REVOKED`
- `EXPIRED`
- `ABORTED`
- `INVALIDATED`

A terminal activity must not re-enter execution. A new activity instance must be created with explicit lineage.

---

## 8. Status Model

```ts
type LearningActivityStatus =
  | 'DRAFT'
  | 'PENDING_AUTHORIZATION'
  | 'AUTHORIZED'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'REVOKED'
  | 'EXPIRED'
  | 'ABORTED'
  | 'INVALIDATED';
```

Status is authoritative aggregate state, not a UI label.

Projection may translate status for learner-facing language but must not alter its meaning.

---

## 9. Definition and Instance Separation

An activity definition describes reusable learning content or execution structure.

An activity instance describes a learner-bound runtime object.

```text
Activity Definition = reusable design
Activity Instance = learner-specific execution authority
```

Definitions may evolve independently, but an active activity must retain the exact definition version it was created against.

Replacing a definition version on an existing active activity is forbidden.

---

## 10. Authorization State

```ts
interface ActivityAuthorizationState {
  status: 'NOT_REQUESTED' | 'PENDING' | 'AUTHORIZED' | 'REJECTED' | 'REVOKED';
  authorizedBy?: string;
  authorizedAt?: string;
  authorizationPolicyVersion?: string;
  reasonCode?: string;
}
```

Authorization confirms that the activity is allowed to proceed. It does not imply that the learner has started or completed it.

---

## 11. Execution State

```ts
interface ActivityExecutionState {
  activeSessionId?: string;
  attemptCount: number;
  startedAt?: string;
  pausedAt?: string;
  completedAt?: string;
  closedAt?: string;
  latestOutcomeCode?: string;
}
```

The activity aggregate references execution sessions but does not absorb full session event history.

---

## 12. Retry Policy

```ts
interface ActivityRetryPolicy {
  retryMode: 'NONE' | 'LIMITED' | 'POLICY_CONTROLLED';
  maxAttempts?: number;
  cooldownSeconds?: number;
  requiresReauthorization: boolean;
  createsNewActivity: boolean;
}
```

Retry behavior must be explicit.

A retry may either:

1. create a new session under the same activity, or
2. create a new activity instance with lineage.

The policy must state which model applies.

---

## 13. Timing Policy

```ts
interface ActivityTimingPolicy {
  availableFrom?: string;
  dueAt?: string;
  expiresAt?: string;
  expectedDurationSeconds?: number;
  maxSessionDurationSeconds?: number;
}
```

Due time, expiry time, and maximum session duration are different concepts.

```text
dueAt = expected completion target
expiresAt = execution no longer permitted
maxSessionDuration = individual session bound
```

---

## 14. Lineage

```ts
interface ActivityLineage {
  sourceType: 'LEARNING_PATH' | 'TEACHER_ASSIGNMENT' | 'SYSTEM_REMEDIATION' | 'LEARNER_EXPLORATION';
  sourceId: string;
  sourceVersion?: string;
  parentActivityId?: string;
  lineageReason?: 'INITIAL' | 'RETRY' | 'REPLACEMENT' | 'REMEDIATION' | 'ADAPTATION';
}
```

Lineage must explain why the activity exists.

It must remain immutable after creation except for additive, auditable metadata that does not rewrite origin.

---

## 15. Commands

Core commands include:

```text
CreateLearningActivity
RequestActivityAuthorization
AuthorizeLearningActivity
RejectLearningActivity
MarkActivityReady
StartLearningActivity
PauseLearningActivity
ResumeLearningActivity
CompleteLearningActivity
CloseLearningActivity
CancelLearningActivity
RevokeLearningActivity
ExpireLearningActivity
AbortLearningActivity
InvalidateLearningActivity
```

Every command must include:

- tenant identity
- actor identity
- activity identity
- expected aggregate version
- command ID
- correlation ID
- causation ID where available
- timestamp

---

## 16. Events

Core events include:

```text
LearningActivityCreated
ActivityAuthorizationRequested
LearningActivityAuthorized
LearningActivityRejected
LearningActivityMarkedReady
LearningActivityStarted
LearningActivityPaused
LearningActivityResumed
LearningActivityCompleted
LearningActivityClosed
LearningActivityCancelled
LearningActivityRevoked
LearningActivityExpired
LearningActivityAborted
LearningActivityInvalidated
ActivityEvidenceLinked
ActivityRetryAuthorized
```

Events are append-only historical records.

Replay must reconstruct aggregate state without re-running policy decisions.

---

## 17. Authority Rules

1. Only Learning Activity Runtime may mutate activity lifecycle state.
2. Learning Path Runtime may request activity creation but may not mark an activity started or completed.
3. Learning Session Runtime may report execution facts but may not close the activity directly.
4. Evidence Runtime may link evidence but may not declare activity completion.
5. Projection must never become a write authority.
6. UI must issue commands through the runtime boundary rather than writing lifecycle state.

---

## 18. Concurrency Rules

All mutations require optimistic concurrency using the expected aggregate version.

Conflicting commands must fail deterministically.

Examples:

- two start commands for the same ready activity
- completion after revocation
- pause after completion
- retry authorization after expiry

Idempotent re-submission of the same command ID must return the original result or a semantically equivalent acknowledgement.

---

## 19. Cross-Runtime Contracts

### From Learning Path Runtime

```ts
interface MaterializeActivityRequest {
  tenantId: string;
  learnerId: string;
  pathId: string;
  pathVersion: number;
  pathStepId: string;
  objectiveId: string;
  preferredActivityType?: LearningActivityType;
  constraints: Record<string, unknown>;
}
```

### To Learning Session Runtime

```ts
interface StartActivitySessionAuthorization {
  activityId: string;
  learnerId: string;
  activityVersion: number;
  activityDefinitionId: string;
  activityDefinitionVersion: string;
  sessionPolicy: Record<string, unknown>;
}
```

### From Learning Session Runtime

```ts
interface ActivitySessionOutcomeReport {
  activityId: string;
  sessionId: string;
  outcomeCode: string;
  completedAt: string;
  evidenceReferences: string[];
}
```

---

## 20. Failure Model

Representative failure codes:

```text
ACTIVITY_NOT_FOUND
ACTIVITY_VERSION_CONFLICT
ACTIVITY_ALREADY_TERMINAL
ACTIVITY_NOT_AUTHORIZED
ACTIVITY_NOT_READY
ACTIVITY_ALREADY_IN_PROGRESS
ACTIVITY_SESSION_MISMATCH
ACTIVITY_EXPIRED
ACTIVITY_REVOKED
ACTIVITY_RETRY_LIMIT_REACHED
ACTIVITY_INVALID_TRANSITION
ACTIVITY_DEFINITION_UNAVAILABLE
ACTIVITY_TENANT_MISMATCH
ACTIVITY_LEARNER_MISMATCH
```

Failure codes must be stable contracts. Human-readable messages may vary by locale.

---

## 21. Projection Expectations

Minimum read models:

- learner activity card
- parent activity status
- teacher assignment view
- operator lifecycle view
- activity timeline
- retry and deadline view

Projection may explain current state, next action, blockers, timing, and lineage.

Projection must not infer mastery or alter authorization.

---

## 22. Observability

Required telemetry:

- activity creation count
- authorization latency
- ready-to-start latency
- start-to-complete duration
- pause frequency
- expiry count
- cancellation count
- retry count
- invalid transition count
- concurrency conflict count
- orphan session reference count

Telemetry must preserve privacy and tenant isolation.

---

## 23. Security and Privacy

- tenant identity is mandatory on every command and query
- learner identifiers must be protected from cross-tenant access
- activity content access must honor authorization
- sensitive evidence references must be redacted by role
- operator views require explicit permission
- audit records must retain actor and reason

---

## 24. Foundation Invariants

1. Every activity has one immutable `activityId`.
2. Every activity belongs to exactly one tenant.
3. Every activity is bound to exactly one learner.
4. Every activity records its source lineage.
5. Every activity references one immutable activity-definition version.
6. Terminal activities cannot resume execution.
7. Completion does not equal mastery.
8. Authorization does not equal execution.
9. Projection does not own activity state.
10. Replay reconstructs committed state without re-deciding policy.
11. Session outcome reports must match the active activity and learner.
12. Cross-tenant activity access is forbidden.
13. Every mutation is version checked.
14. Every command is idempotent by command ID.
15. Retry behavior is policy controlled and auditable.

---

## 25. Architectural Summary

```text
Learning Path proposes the next bounded objective.
Learning Activity materializes that objective into executable work.
Learning Session performs the work.
Evidence records what happened.
Mastery decides what is justified.
```

Learning Activity Runtime is therefore the operational authority for the learner-facing unit of work between path planning and session execution.
