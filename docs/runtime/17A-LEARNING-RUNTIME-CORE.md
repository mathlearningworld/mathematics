# 17A — Learning Runtime Core

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 17A — Learning Runtime Core  
**Document Type:** Runtime Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`, `docs/world/16F-HINT-AND-MENTOR-SUPPORT.md`, `docs/world/16G-MASTERY-AND-PROGRESSION.md`, `docs/world/16H-REMEDIATION.md`, `docs/world/16I-PARENT-AND-TEACHER-PROJECTION.md`, `docs/world/16J-ANALYTICS-AND-GOVERNANCE.md`  
**Downstream Consumers:** Phase 17B runtime modules, Phase 18 domain model, application commands and queries, persistence adapters, API contracts, frontend runtime, analytics and audit tooling

---

## 1. Purpose

This guide defines the authoritative runtime core that coordinates the Learning Mission System from learner entry through diagnosis, mission execution, evidence capture, assessment, mastery, progression, remediation, projection, and analytics emission.

The central doctrine is:

> The learning runtime owns progression through verified state transitions; no database row, UI action, analytics result, or downstream service may silently redefine runtime truth.

A conforming runtime must answer:

> What state is the learner's active learning flow in, which command is being attempted, which invariant authorizes or rejects the transition, which events prove what happened, and how can the result be resumed, replayed, audited, and recovered safely?

The runtime is not a CRUD façade over persistence. It is the execution authority for the learning lifecycle.

---

## 2. Architectural Position

```text
Learning Mission System Blueprint (16A–16J)
        ↓
Learning Runtime Core (17A)
        ↓
Specialized Runtime Modules (17B+)
        ↓
Domain Model (18)
        ↓
Application Commands and Queries (19)
        ↓
Persistence and Event Infrastructure (20)
        ↓
API and Frontend Runtime Contracts (21–22)
```

Phase 17A establishes the common runtime laws. Specialized modules may extend these laws but may not weaken them.

---

## 3. Runtime Authority Boundary

### 3.1 Phase 17A owns

- the top-level learning runtime lifecycle;
- runtime aggregate identity and version;
- command admission and command execution pipeline;
- transition authorization;
- invariant evaluation;
- event production rules;
- idempotency semantics;
- correlation and causation semantics;
- runtime suspension and resumption;
- timeout and lease semantics;
- optimistic concurrency expectations;
- recovery entry and exit rules;
- replay requirements;
- snapshot semantics;
- runtime failure taxonomy;
- module orchestration boundaries;
- projection publication boundary;
- audit envelope requirements;
- deterministic transition requirements.

### 3.2 Phase 17A does not own

- curriculum truth;
- cognitive diagnosis algorithms;
- mission generation algorithms;
- world rendering or physics;
- mathematical evidence interpretation;
- mastery policy content;
- remediation strategy content;
- parent or teacher wording;
- analytics metric definitions;
- database schema design;
- transport protocol shape;
- UI navigation state.

Those concerns are delegated to their owning blueprint or downstream runtime module.

---

## 4. Core Runtime Aggregate

The authoritative top-level aggregate is `LearningRuntime`.

```text
LearningRuntime
├── runtimeId
├── learnerId
├── tenantId
├── lifecycleState
├── activeTargetRef
├── activeDiagnosisRef
├── activeMissionRef
├── activeActivityRef
├── activeEvidenceCycleRef
├── activeAssessmentRef
├── activeMasteryEvaluationRef
├── activeRemediationRef
├── runtimeVersion
├── startedAt
├── lastTransitionAt
├── suspendedAt
├── completedAt
├── correlationId
└── policyVersionSet
```

The aggregate records authoritative references, not duplicated truth owned by specialized modules.

### 4.1 Aggregate identity

`runtimeId` identifies one bounded learning flow for one learner.

A runtime may span multiple mission attempts when they belong to the same declared learning objective and progression flow. A new runtime is required when the active objective, ownership context, or policy boundary changes in a way that makes replay under the old identity misleading.

### 4.2 Aggregate version

Every accepted command that changes authoritative runtime state increments `runtimeVersion` exactly once.

Rejected commands do not increment the version.

No-op idempotent retries return the previously committed result and version.

---

## 5. Lifecycle State Machine

### 5.1 Primary states

```text
CREATED
  ↓
READINESS_PENDING
  ↓
DIAGNOSIS_RUNNING
  ↓
MISSION_PLANNING
  ↓
MISSION_READY
  ↓
ACTIVITY_RUNNING
  ↓
EVIDENCE_PENDING
  ↓
ASSESSMENT_RUNNING
  ↓
MASTERY_EVALUATION
  ↓
PROGRESSION_DECISION
  ├──→ MISSION_PLANNING
  ├──→ REMEDIATION_PLANNING
  └──→ COMPLETED
```

### 5.2 Control states

```text
SUSPENDED
RECOVERY_REQUIRED
CANCELLED
FAILED_TERMINAL
```

Control states are not shortcuts around the primary lifecycle. They preserve the last authoritative transition and require explicit entry and exit evidence.

### 5.3 State meanings

#### `CREATED`

The runtime identity exists, but readiness evaluation has not started.

#### `READINESS_PENDING`

The runtime is gathering or validating learner, target, policy, prerequisite, and contextual inputs.

#### `DIAGNOSIS_RUNNING`

Diagnosis execution is active. No mission may become authoritative until diagnosis completion or an explicit diagnosis-bypass policy is recorded.

#### `MISSION_PLANNING`

The runtime is requesting or validating a mission plan.

#### `MISSION_READY`

A mission has been accepted and bound to the active target, learner context, and policy versions.

#### `ACTIVITY_RUNNING`

The learner-facing world activity is active.

#### `EVIDENCE_PENDING`

Activity execution has ended or paused at an evidence boundary, and the runtime is waiting for sufficient evidence qualification.

#### `ASSESSMENT_RUNNING`

Qualified evidence is being interpreted by the assessment authority.

#### `MASTERY_EVALUATION`

Assessment results are being evaluated against mastery policy.

#### `PROGRESSION_DECISION`

The runtime is selecting the next authorized path: continue, advance, remediate, suspend, or complete.

#### `REMEDIATION_PLANNING`

A diagnosed learning gap is being converted into an authorized remediation plan.

#### `COMPLETED`

The declared runtime objective is complete. Completion is immutable except through a separately governed correction process.

#### `SUSPENDED`

Execution is intentionally paused and may resume when suspension conditions are satisfied.

#### `RECOVERY_REQUIRED`

The runtime cannot safely continue because committed state, module state, or external execution evidence is inconsistent or incomplete.

#### `CANCELLED`

The runtime was intentionally ended without satisfying completion criteria.

#### `FAILED_TERMINAL`

A non-recoverable failure ended the runtime. This state requires an auditable failure reason.

---

## 6. Transition Contract

Every state-changing operation is modeled as a transition.

```text
Transition Request
    ↓
Identity Validation
    ↓
Expected-Version Validation
    ↓
Command Idempotency Check
    ↓
Current-State Validation
    ↓
Cross-Module Preconditions
    ↓
Invariant Evaluation
    ↓
Decision
    ↓
Domain Event Production
    ↓
Atomic Commit
    ↓
Projection Publication
    ↓
Result
```

A transition must be deterministic for the same:

- aggregate state;
- command payload;
- policy version set;
- referenced authoritative module outputs;
- logical time input when time is part of policy.

External side effects may occur only after the authoritative commit or through an outbox-equivalent mechanism.

---

## 7. Command Model

### 7.1 Command envelope

Every command must carry:

```text
commandId
commandType
runtimeId
learnerId
tenantId
actor
expectedRuntimeVersion
issuedAt
correlationId
causationId
policyVersionSet
payload
```

### 7.2 Actor model

The actor must be explicit:

```text
LEARNER
PARENT
TEACHER
MENTOR
SYSTEM
ADMINISTRATOR
RECOVERY_WORKER
```

Actor identity does not itself grant authority. Authorization is resolved from actor, relationship, tenant, runtime state, and command policy.

### 7.3 Command result

A successful result includes:

```text
commandId
runtimeId
previousVersion
runtimeVersion
previousState
currentState
committedEventIds
occurredAt
idempotentReplay
```

A rejected result includes a stable failure code and must not pretend that execution partially succeeded.

---

## 8. Event Model

### 8.1 Event envelope

Every authoritative runtime event includes:

```text
eventId
eventType
schemaVersion
aggregateType
aggregateId
aggregateVersion
tenantId
learnerId
occurredAt
recordedAt
actor
correlationId
causationId
commandId
policyVersionSet
payload
```

### 8.2 Core runtime events

```text
LearningRuntimeCreated
ReadinessEvaluationRequested
ReadinessConfirmed
DiagnosisStarted
DiagnosisCompleted
MissionPlanningRequested
MissionAccepted
WorldActivityStarted
WorldActivitySuspended
WorldActivityCompleted
EvidenceCycleOpened
EvidenceQualified
AssessmentStarted
AssessmentCompleted
MasteryEvaluationStarted
MasteryDecisionRecorded
ProgressionDecisionRecorded
RemediationPlanningRequested
RemediationPlanAccepted
RuntimeSuspended
RuntimeResumed
RuntimeRecoveryRequired
RuntimeRecovered
LearningRuntimeCompleted
LearningRuntimeCancelled
LearningRuntimeFailed
```

Specialized modules own detailed events. The core runtime emits orchestration events and records references to module-authoritative outcomes.

### 8.3 Event immutability

Committed events are immutable.

Corrections are represented by compensating or superseding events. Historical payloads must never be rewritten to make the present appear cleaner.

---

## 9. Runtime Invariants

The following invariants apply globally.

### 9.1 Identity invariants

- one runtime belongs to exactly one learner;
- tenant identity cannot change during the runtime;
- a command learner identity must match the runtime learner identity;
- module outputs referenced by a runtime must belong to the same learner and tenant.

### 9.2 Version invariants

- accepted mutations require the expected current version;
- each accepted mutation increments the version by one;
- events produced by one command use a single aggregate version boundary;
- concurrent commands cannot both commit against the same expected version.

### 9.3 Lifecycle invariants

- an activity cannot start without an accepted mission;
- evidence cannot be assessed before qualification;
- mastery cannot be evaluated without an accepted assessment result;
- progression cannot be decided without a mastery or governed exception outcome;
- remediation cannot become active without an identified remediation target;
- completion requires no unresolved blocking recovery condition;
- a terminal runtime cannot resume through an ordinary command.

### 9.4 Authority invariants

- analytics cannot mutate learner runtime truth;
- projections cannot mutate learner runtime truth;
- UI state cannot override runtime state;
- persistence availability cannot redefine policy;
- a downstream module cannot declare another module's truth.

### 9.5 Evidence invariants

- evidence references must be immutable and traceable;
- assessment must record the exact evidence set and policy version used;
- mastery must record the exact assessment result and policy version used;
- progression must record the exact mastery or remediation decision used.

---

## 10. Module Orchestration

The core runtime coordinates specialized modules through explicit contracts.

```text
LearningRuntime
├── Readiness / Diagnosis Runtime
├── Mission Planning Runtime
├── World Activity Runtime
├── Evidence Runtime
├── Assessment Runtime
├── Mastery Runtime
├── Progression Runtime
├── Remediation Runtime
├── Projection Runtime
└── Analytics Emission Boundary
```

### 10.1 Module rules

- modules own their internal state and detailed events;
- the core runtime stores references and orchestration state;
- module completion is not recognized until its output contract is accepted;
- module retries must be idempotent;
- module failure must be classified as retryable, recoverable, or terminal;
- module timeouts do not imply educational failure;
- module outputs must include version and provenance.

### 10.2 Synchronous versus asynchronous execution

A module may execute synchronously or asynchronously without changing the educational meaning of the transition.

The runtime must represent pending work explicitly rather than assuming that a request means completion.

---

## 11. Idempotency

### 11.1 Command idempotency

`commandId` is globally unique within the runtime authority boundary.

Reusing a `commandId` with the same canonical payload returns the original result.

Reusing a `commandId` with a different canonical payload fails with `COMMAND_ID_REUSED_WITH_DIFFERENT_PAYLOAD`.

### 11.2 External request idempotency

Transport-layer idempotency keys may map to runtime command IDs, but the runtime command ID remains the authoritative key.

### 11.3 Module invocation idempotency

Every module request carries an invocation ID derived from or linked to the causative command. A module retry must not create duplicate authoritative outcomes.

---

## 12. Concurrency Model

The core runtime uses optimistic concurrency.

```text
load(runtimeId)
assert version == expectedRuntimeVersion
decide(command)
append(events, expectedVersion)
publish(outbox)
```

Long-running module work must not hold a database transaction open.

Instead:

1. commit a pending transition;
2. invoke or schedule the module;
3. receive a module result command;
4. validate the current runtime version and pending reference;
5. commit the accepted result.

Late results that no longer match the active pending reference are rejected or routed to recovery review.

---

## 13. Suspension and Resumption

Suspension is an explicit runtime transition, not an absence of activity.

A suspension record includes:

```text
suspensionId
reasonCode
initiatedBy
suspendedFromState
resumeEligibility
resumeDeadline
contextSnapshotRef
```

Resumption requires:

- the runtime is `SUSPENDED`;
- the suspension is still eligible for resumption;
- required context can be reconstructed;
- referenced mission and policy versions remain valid or a governed migration is accepted;
- no blocking recovery issue exists.

The runtime resumes into the recorded continuation state, not automatically into `ACTIVITY_RUNNING`.

---

## 14. Recovery Model

### 14.1 Recovery entry conditions

The runtime enters `RECOVERY_REQUIRED` when any of the following occurs:

- committed runtime state references missing module output;
- module output exists but runtime acknowledgement is missing;
- event sequence and snapshot disagree;
- outbox publication cannot be reconciled;
- duplicate side effects cannot be classified safely;
- a late asynchronous result conflicts with a newer accepted transition;
- policy or schema migration cannot reconstruct authoritative meaning;
- an invariant breach is detected after commit.

### 14.2 Recovery record

```text
recoveryCaseId
runtimeId
detectedAt
detectionSource
failureCode
lastVerifiedVersion
lastVerifiedState
suspectedEvents
suspectedModuleRefs
recommendedAction
status
resolvedBy
resolvedAt
resolutionEvidence
```

### 14.3 Recovery principles

- recovery uses committed evidence, never conversational assumptions;
- the last verified version is the recovery anchor;
- replay is preferred over manual state editing;
- compensation is preferred over deletion;
- recovery cannot silently erase educational evidence;
- human review is required when two plausible educational truths remain.

### 14.4 Recovery exit

Recovery exits only through `RuntimeRecovered`, `LearningRuntimeCancelled`, or `LearningRuntimeFailed`.

A recovery worker cannot directly mutate the runtime outside the same command and event contract used by ordinary execution.

---

## 15. Replay and Snapshot Model

### 15.1 Replay

The authoritative runtime can be reconstructed from its ordered events.

Replay must be deterministic against the event schema and policy references recorded at the time of each transition.

### 15.2 Snapshots

Snapshots are optimization artifacts, not independent truth.

A snapshot includes:

```text
runtimeId
snapshotVersion
lifecycleState
activeReferences
policyVersionSet
createdAt
checksum
```

A snapshot is valid only when its checksum and version align with the event stream.

### 15.3 Schema evolution

Event upcasters may translate historical event schemas for runtime reconstruction. Upcasting must preserve meaning and must not apply current policy retroactively.

---

## 16. Time Semantics

The runtime distinguishes:

- `issuedAt`: time declared by the command source;
- `occurredAt`: authoritative logical transition time;
- `recordedAt`: persistence time;
- `deadlineAt`: policy deadline;
- `lastTransitionAt`: last accepted runtime transition.

Policy decisions must use an injected authoritative clock.

Tests must not depend on wall-clock time.

Client-provided timestamps are evidence inputs, not automatic authority.

---

## 17. Projection and Analytics Boundaries

### 17.1 Projection boundary

Projection consumers receive committed events or stable read models.

A projection failure does not roll back a committed educational transition. It creates publication retry or recovery work.

### 17.2 Analytics boundary

Analytics receives qualified immutable events with lineage metadata.

Analytics findings may create review commands, but cannot directly alter runtime state.

### 17.3 Notification boundary

Notifications are effects of committed state. Notification delivery must not be treated as proof that the learner saw, understood, or acted on the message.

---

## 18. Failure Taxonomy

### 18.1 Admission failures

```text
RUNTIME_NOT_FOUND
TENANT_MISMATCH
LEARNER_MISMATCH
ACTOR_NOT_AUTHORIZED
EXPECTED_VERSION_REQUIRED
EXPECTED_VERSION_MISMATCH
COMMAND_ID_REUSED_WITH_DIFFERENT_PAYLOAD
INVALID_COMMAND_PAYLOAD
```

### 18.2 Transition failures

```text
INVALID_RUNTIME_STATE
TRANSITION_NOT_ALLOWED
RUNTIME_ALREADY_TERMINAL
RUNTIME_SUSPENDED
RUNTIME_RECOVERY_REQUIRED
PRECONDITION_NOT_SATISFIED
INVARIANT_VIOLATION
POLICY_VERSION_MISMATCH
```

### 18.3 Module failures

```text
MODULE_REQUEST_REJECTED
MODULE_RESULT_INVALID
MODULE_RESULT_STALE
MODULE_TIMEOUT
MODULE_UNAVAILABLE
MODULE_OUTPUT_NOT_FOUND
MODULE_PROVENANCE_INVALID
```

### 18.4 Persistence and concurrency failures

```text
CONCURRENT_RUNTIME_MODIFICATION
EVENT_APPEND_FAILED
SNAPSHOT_MISMATCH
OUTBOX_PUBLICATION_PENDING
DUPLICATE_EVENT_DETECTED
```

### 18.5 Recovery failures

```text
RECOVERY_EVIDENCE_INSUFFICIENT
RECOVERY_REPLAY_DIVERGED
RECOVERY_ACTION_NOT_AUTHORIZED
RECOVERY_CASE_ALREADY_RESOLVED
TERMINAL_CORRECTION_REQUIRED
```

Failure codes are stable contracts. Human-readable messages may change without changing the code meaning.

---

## 19. Runtime API-Agnostic Contracts

Phase 17A defines behavior independently of HTTP, queues, or framework choices.

Conceptual ports:

```text
LearningRuntimeRepository
RuntimeEventStore
RuntimeSnapshotStore
RuntimeOutbox
RuntimeClock
RuntimeIdGenerator
RuntimePolicyResolver
RuntimeAuthorizationPort
RuntimeModuleGateway
RuntimeRecoveryRepository
```

No core runtime decision may import Express, Prisma, a message broker client, or UI-specific types.

---

## 20. Proposed Source Layout

```text
backend/src/
├── runtime/
│   ├── core/
│   │   ├── learning-runtime.js
│   │   ├── learning-runtime-state.js
│   │   ├── learning-runtime-transition.js
│   │   ├── runtime-command.js
│   │   ├── runtime-event.js
│   │   ├── runtime-failures.js
│   │   ├── runtime-invariants.js
│   │   ├── runtime-policy.js
│   │   └── index.js
│   ├── diagnosis/
│   ├── mission/
│   ├── activity/
│   ├── evidence/
│   ├── assessment/
│   ├── mastery/
│   ├── progression/
│   ├── remediation/
│   ├── projection/
│   └── analytics/
├── domain/
├── application/
├── contracts/
└── infrastructure/
```

This layout is directional, not yet an implementation mandate. Phase 18 will decide domain boundaries after runtime contracts are stable.

---

## 21. Validation Slice

The first executable validation slice should use one narrow mathematical flow, such as ratio reasoning, without implementing the entire platform.

```text
CreateLearningRuntime
    ↓
ConfirmReadiness
    ↓
RecordDiagnosisCompleted
    ↓
AcceptMission
    ↓
StartActivity
    ↓
CompleteActivity
    ↓
QualifyEvidence
    ↓
RecordAssessmentCompleted
    ↓
RecordMasteryDecision
    ↓
RecordProgressionDecision
    ↓
CompleteLearningRuntime
```

The slice must prove:

- accepted transitions increment version exactly once;
- invalid state transitions are rejected;
- duplicate commands are idempotent;
- stale expected versions are rejected;
- event causation and correlation remain intact;
- replay reconstructs the same final state;
- a projection subscriber can rebuild a read model;
- an injected failure can enter and exit recovery without manual state mutation.

---

## 22. Verification Gates

### Gate A — Repository Gate

- architecture matches 16A–16J authority boundaries;
- lifecycle and invariants are explicit;
- command and event contracts are versioned;
- failure taxonomy is stable;
- no infrastructure dependency leaks into the runtime core;
- validation slice is bounded and traceable.

### Gate B — Runtime Gate

- automated transition tests pass;
- replay determinism tests pass;
- concurrency tests pass;
- idempotency tests pass;
- recovery tests pass;
- snapshot consistency tests pass;
- module contract tests pass.

### Gate C — Operational Gate

- UI or client command reaches the runtime;
- runtime commits events atomically;
- module work resumes safely;
- projection updates from committed events;
- analytics receives qualified events;
- restart and retry do not duplicate outcomes;
- recovery can be observed and resolved operationally.

Repository completion does not imply runtime or operational completion.

---

## 23. Non-Negotiable Rules

1. Runtime truth changes only through accepted commands and committed events.
2. Every mutation is version-checked.
3. Every command is idempotent.
4. Every consequential event is traceable by correlation and causation.
5. Specialized modules cannot mutate the core aggregate directly.
6. UI, analytics, and projections are not runtime authorities.
7. Pending asynchronous work is represented explicitly.
8. Recovery is an ordinary governed runtime flow, not a database edit.
9. Snapshots accelerate replay but never replace event truth.
10. Current policy is never retroactively substituted for historical policy during replay.
11. Educational evidence is never silently deleted to simplify recovery.
12. Completion is a verified transition, not merely the absence of remaining UI tasks.

---

## 24. Handoff to Phase 17B

Phase 17B should decompose the specialized runtime modules and define their contracts with `LearningRuntime`, beginning with:

1. Diagnosis Runtime;
2. Mission Planning Runtime;
3. Activity and Evidence Runtime;
4. Assessment and Mastery Runtime;
5. Progression and Remediation Runtime;
6. Projection and Analytics emission boundaries.

Phase 17B must preserve the command, event, version, recovery, and authority laws established here.

---

## 25. Completion Statement

Phase 17A is complete when the Learning Mission System has one explicit runtime authority, one deterministic lifecycle, one governed command pipeline, one immutable event model, one concurrency model, and one recovery model from which the domain model can be derived without inventing database-led behavior.

The resulting design establishes a runtime-first foundation for Math Learning World: pedagogically faithful, replayable, recoverable, testable, and safe to extend.