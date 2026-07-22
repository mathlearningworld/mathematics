# Chapter 34G — Intervention Persistence & Replay Runtime

## 1. Purpose

Intervention Persistence & Replay Runtime defines the durable authority needed to preserve intervention intent, authorization, planning, execution, adaptation, evidence, and effectiveness evaluation across time.

The runtime must be able to answer:

- What intervention was authorized?
- Which plan and strategy versions were used?
- What was actually delivered?
- What adaptations occurred and why?
- Which evidence existed at each point in time?
- What did the system conclude then, under which versions?
- Can current projections be rebuilt without rewriting history?

Persistence exists to preserve operational truth. Replay exists to reconstruct that truth deterministically.

## 2. Governing Doctrine

```text
Persisted intent is not persisted execution.
Persisted execution is not persisted effectiveness.
Snapshot is acceleration, not authority.
Replay reconstructs history; it does not improve history.
Migration must not silently reinterpret old evidence.
```

## 3. Durable Authority Model

The runtime separates six durable stores:

1. Intervention Case Ledger
2. Intervention Plan Store
3. Execution Event Ledger
4. Adaptation Decision Ledger
5. Evidence Reference Store
6. Effectiveness Evaluation Store

Derived projections and snapshots remain rebuildable artifacts.

## 4. Intervention Case Aggregate

An `InterventionCase` is the durable coordination boundary.

Required identity:

```ts
interface InterventionCaseIdentity {
  tenantId: string;
  learnerId: string;
  interventionCaseId: string;
  diagnosticCaseId?: string;
  recommendationId?: string;
  createdAt: string;
}
```

Required aggregate state:

```ts
interface InterventionCaseState {
  status:
    | 'DRAFT'
    | 'PENDING_REVIEW'
    | 'AUTHORIZED'
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'PAUSED'
    | 'ADAPTING'
    | 'AWAITING_EVIDENCE'
    | 'COMPLETED'
    | 'EFFECTIVE'
    | 'PARTIALLY_EFFECTIVE'
    | 'INEFFECTIVE'
    | 'ESCALATED'
    | 'CANCELLED'
    | 'EXPIRED'
    | 'INCONCLUSIVE';
  activePlanId?: string;
  activeExecutionId?: string;
  latestEvaluationId?: string;
  aggregateVersion: number;
  lastEventAt: string;
}
```

## 5. Event Ledger

All authoritative state transitions are append-only events.

Core event families:

```text
InterventionCaseCreated
InterventionAuthorizationRequested
InterventionAuthorized
InterventionAuthorizationDenied
InterventionPlanProposed
InterventionPlanActivated
InterventionScheduled
InterventionExecutionStarted
InterventionActivityDispatched
InterventionActivityObserved
InterventionExecutionPaused
InterventionExecutionResumed
InterventionExecutionInterrupted
InterventionExecutionCompleted
InterventionAdaptationRequested
InterventionAdaptationApproved
InterventionAdaptationRejected
InterventionPlanReplaced
InterventionEvidenceLinked
InterventionEvaluationStarted
InterventionEvaluationCompleted
InterventionEscalated
InterventionCancelled
InterventionExpired
```

Each event requires:

```ts
interface InterventionEventEnvelope<TPayload> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  recordedAt: string;
  tenantId: string;
  learnerId: string;
  interventionCaseId: string;
  aggregateVersion: number;
  actor: ActorReference;
  correlationId: string;
  causationId?: string;
  policyVersion?: string;
  payload: TPayload;
}
```

## 6. Optimistic Concurrency

Writes require expected aggregate version.

```text
expectedVersion == currentVersion
```

If the version differs, the write must fail with a concurrency conflict. The runtime must not auto-merge competing intervention decisions.

Examples of unsafe auto-merge:

- two plan activations
- plan cancellation racing with dispatch
- adaptation approval racing with completion
- effectiveness evaluation racing with late evidence linkage

## 7. Plan Version Persistence

An intervention plan is immutable after activation.

A new plan version must be created when changing:

- target skill or misconception
- strategy identity
- dosage bounds
- phase ordering
- execution channel
- evidence requirements
- safety constraints
- stop conditions
- adaptation envelope

```ts
interface PersistedInterventionPlan {
  planId: string;
  planVersion: number;
  interventionCaseId: string;
  status: 'PROPOSED' | 'AUTHORIZED' | 'ACTIVE' | 'SUPERSEDED' | 'CANCELLED';
  strategyId: string;
  strategyVersion: string;
  diagnosticModelVersion?: string;
  skillGraphVersion: string;
  curriculumVersion: string;
  policyVersion: string;
  target: InterventionTarget;
  phases: InterventionPhase[];
  dosage: DosageContract;
  adaptationEnvelope: AdaptationEnvelope;
  evidenceContract: EvidenceContract;
  safetyContract: SafetyContract;
  createdAt: string;
}
```

The prior plan remains queryable and replayable.

## 8. Execution Persistence

Execution truth is recorded independently from plan intent.

```ts
interface InterventionExecutionRecord {
  executionId: string;
  planId: string;
  planVersion: number;
  channel: string;
  channelVersion: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  deliveredDose: DeliveredDose;
  dispatchAttempts: DispatchAttempt[];
  interruptions: ExecutionInterruption[];
  learnerInteractions: EvidenceReference[];
}
```

The runtime must preserve:

- dispatch request
- dispatch acknowledgement
- delivery confirmation
- learner interaction evidence
- pause and resume boundaries
- retry reasons
- interruption causes
- completion reason

A planned activity that was never delivered must not appear as executed.

## 9. Adaptation Decision Ledger

Every adaptation decision must be durable, even when no change is made.

```ts
interface AdaptationDecisionRecord {
  adaptationDecisionId: string;
  interventionCaseId: string;
  executionId: string;
  requestedAt: string;
  triggerEvidenceIds: string[];
  decision:
    | 'OBSERVE_ONLY'
    | 'PARAMETER_ADJUSTMENT'
    | 'PHASE_ADJUSTMENT'
    | 'REPLAN_REQUIRED'
    | 'DIAGNOSTIC_REVIEW_REQUIRED'
    | 'HUMAN_ESCALATION_REQUIRED'
    | 'NO_CHANGE';
  rationaleCodes: string[];
  approvedBy: ActorReference;
  priorPlanVersion: number;
  resultingPlanVersion?: number;
}
```

Rejected and deferred adaptations remain part of history.

## 10. Evidence Reference Store

The ledger stores references and integrity metadata, not uncontrolled duplication of learner data.

```ts
interface InterventionEvidenceReference {
  evidenceId: string;
  evidenceType: string;
  sourceRuntime: string;
  sourceEntityId: string;
  capturedAt: string;
  linkedAt: string;
  contentHash?: string;
  schemaVersion: string;
  accessClass: string;
  retentionPolicy: string;
}
```

Late evidence must preserve both:

- when the evidence occurred
- when it became available to the intervention runtime

## 11. Effectiveness Evaluation Persistence

Evaluations are immutable records.

```ts
interface InterventionEffectivenessRecord {
  evaluationId: string;
  interventionCaseId: string;
  planId: string;
  executionId: string;
  windowType: string;
  baselineReferenceIds: string[];
  outcomeEvidenceIds: string[];
  fidelityAssessment: string;
  result:
    | 'EFFECTIVE'
    | 'PARTIALLY_EFFECTIVE'
    | 'INEFFECTIVE'
    | 'HARMFUL_OR_UNSAFE'
    | 'INCONCLUSIVE';
  confidence: number;
  confoundingFactors: string[];
  evaluationModelVersion: string;
  evaluatedAt: string;
}
```

A later evaluation does not overwrite an earlier evaluation. It adds a new temporal conclusion.

## 12. Snapshot Store

Snapshots may accelerate aggregate loading.

```ts
interface InterventionSnapshot {
  interventionCaseId: string;
  aggregateVersion: number;
  snapshotSchemaVersion: string;
  state: InterventionCaseState;
  createdAt: string;
  lastEventId: string;
  stateHash: string;
}
```

Snapshot acceptance requires:

- matching aggregate ID
- matching aggregate version
- valid state hash
- compatible schema version
- event continuity from `lastEventId`

Invalid snapshots are discarded and rebuilt from events.

## 13. Replay Modes

### 13.1 Aggregate Replay

Rebuild one intervention case from its event stream.

### 13.2 Point-in-Time Replay

Reconstruct state as known at a selected timestamp.

This must distinguish:

```text
occurredAt <= pointInTime
recordedAt <= knowledgeCutoff
```

### 13.3 Projection Replay

Rebuild one or more read models from authoritative events.

### 13.4 Comparative Replay

Run the same historical event set through two compatible projection or evaluation versions for comparison.

Comparative replay must never replace historical conclusions automatically.

### 13.5 Recovery Replay

Recover after projection corruption, interrupted writes, or snapshot failure.

## 14. Version Pinning

Deterministic replay requires pinned versions for:

- event schema
- plan schema
- strategy definition
- skill graph
- curriculum
- policy
- channel adapter
- evaluation model
- projection schema

Missing mandatory versions cause replay to become `BLOCKED`, not guessed.

## 15. Upcasting

Older event schemas may be upcast into current in-memory representations.

Rules:

- preserve original payload
- record upcaster version
- never invent unavailable facts
- never convert uncertainty into certainty
- never reinterpret actor authorization
- never rewrite event timestamps

## 16. Replay Output

```ts
interface InterventionReplayResult {
  interventionCaseId: string;
  replayMode: string;
  status: 'SUCCESS' | 'SUCCESS_WITH_WARNINGS' | 'BLOCKED' | 'FAILED';
  eventCount: number;
  finalAggregateVersion?: number;
  warnings: ReplayWarning[];
  missingDependencies: ReplayDependency[];
  stateHash?: string;
}
```

## 17. Projection Rebuild

Projection rebuild follows:

```text
Select checkpoint
Validate checkpoint
Load events after checkpoint
Apply event handlers in order
Validate projection invariants
Compare projection hash where available
Publish new generation atomically
```

Readers must never see a partially rebuilt projection generation.

## 18. Idempotency

Event append and external dispatch boundaries require idempotency keys.

Examples:

```text
intervention-authorize:{caseId}:{commandId}
intervention-dispatch:{executionId}:{activityId}:{attemptGroup}
intervention-adapt:{executionId}:{triggerSetHash}
intervention-evaluate:{caseId}:{windowType}:{cutoff}
```

Replayed events must not trigger new external side effects.

## 19. Transaction Boundaries

A transaction should atomically persist:

- authoritative event
- aggregate version advancement
- outbox message
- mandatory audit metadata

Projection updates may occur asynchronously.

External channel delivery must use an outbox or equivalent durable handoff.

## 20. Outbox Contract

```ts
interface InterventionOutboxMessage {
  outboxId: string;
  eventId: string;
  destination: string;
  messageType: string;
  payloadReference: string;
  status: 'PENDING' | 'DISPATCHED' | 'FAILED' | 'DEAD_LETTERED';
  attemptCount: number;
  nextAttemptAt?: string;
}
```

Outbox dispatch is at-least-once. Consumers must be idempotent.

## 21. Recovery States

The runtime recognizes:

```text
SNAPSHOT_INVALID
EVENT_GAP_DETECTED
VERSION_DEPENDENCY_MISSING
PROJECTION_REBUILD_REQUIRED
OUTBOX_RECOVERY_REQUIRED
EVIDENCE_REFERENCE_UNAVAILABLE
REPLAY_HASH_MISMATCH
MANUAL_REVIEW_REQUIRED
```

Recovery state must not be hidden behind a generic active status.

## 22. Quarantine

Malformed or unverifiable events are quarantined.

Quarantine records require:

- event ID
- reason code
- detected at
- detector version
- affected projections
- operational impact
- remediation status

Quarantined events must not be silently skipped when they affect authority.

## 23. Retention and Privacy

Retention is policy-driven by evidence class and jurisdiction.

The runtime must support:

- reference redaction where legally required
- encryption at rest
- tenant isolation
- field-level access control
- audit access logging
- learner-safe export
- deletion tombstones where hard deletion is prohibited by audit requirements

Deleting raw evidence must not rewrite the fact that a historical decision referenced evidence that once existed.

## 24. Audit Queries

The persistence layer must support:

```text
Why was this intervention authorized?
Which plan was active at this time?
What was delivered before this adaptation?
Which evidence triggered the change?
Which versions produced this effectiveness conclusion?
Was the projection current when a human viewed it?
Can the case be replayed deterministically?
```

## 25. Failure Semantics

```text
PERSISTENCE_WRITE_FAILED
OPTIMISTIC_CONCURRENCY_CONFLICT
EVENT_STREAM_GAP
SNAPSHOT_HASH_MISMATCH
REPLAY_VERSION_MISSING
REPLAY_HANDLER_MISSING
OUTBOX_DELIVERY_EXHAUSTED
EVIDENCE_REFERENCE_BROKEN
PROJECTION_REBUILD_FAILED
TENANT_BOUNDARY_VIOLATION
```

Failures affecting authority must fail closed.

## 26. Verification Requirements

The persistence runtime requires tests for:

- event append ordering
- concurrency conflict
- immutable plan versions
- execution vs plan separation
- late evidence timing
- snapshot invalidation
- point-in-time replay
- replay without side effects
- projection atomic generation switch
- outbox idempotency
- quarantine behavior
- tenant isolation

## 27. Final Invariants

```text
I-PERSIST-01  Authoritative intervention history is append-only.
I-PERSIST-02  Activated plans are immutable.
I-PERSIST-03  Execution truth is stored separately from plan intent.
I-PERSIST-04  Adaptation decisions are durable, including no-change decisions.
I-PERSIST-05  Evaluations are temporal records and never overwritten.
I-PERSIST-06  Snapshots never replace event authority.
I-PERSIST-07  Replay never emits external side effects.
I-PERSIST-08  Replay requires compatible pinned versions.
I-PERSIST-09  Projection rebuild publishes atomically.
I-PERSIST-10  Missing authority dependencies fail closed.
```

## 28. Completion Criterion

34G is complete when intervention history can be reconstructed from durable authority, projections can be rebuilt safely, historical conclusions remain versioned, and replay cannot silently alter learner-facing truth.