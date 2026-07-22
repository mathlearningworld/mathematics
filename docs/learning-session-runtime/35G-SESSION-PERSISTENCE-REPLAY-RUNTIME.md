# 35G — Session Persistence & Replay Runtime

## 1. Purpose

The Session Persistence & Replay Runtime defines how Learning Session state, decisions, evidence, checkpoints, and cross-runtime effects are stored durably and reconstructed deterministically.

Its purpose is not merely to save the current screen state. Its purpose is to preserve the authoritative execution history of a learning session so that the system can recover, audit, replay, explain, and continue safely after process failure, device loss, network interruption, or runtime migration.

The runtime must preserve one durable truth:

> A session may be resumed only from persisted authority and replayable evidence, never from UI memory or inferred client state.

---

## 2. Core Distinctions

The persistence model must preserve the following distinctions:

- Persisted event ≠ projection row
- Snapshot ≠ source of truth
- Checkpoint ≠ completion
- Retry ≠ duplicate execution
- Replay ≠ re-triggering external side effects
- Recovery ≠ blind continuation
- Client cache ≠ authoritative session state
- Durable write success ≠ downstream delivery success
- Event order ≠ wall-clock arrival order
- Historical correction ≠ destructive rewrite

These distinctions are mandatory because Learning Session Runtime coordinates multiple engines and user-facing channels.

---

## 3. Authoritative Persistence Model

The authoritative model consists of four durable layers:

1. **Session Command Ledger**
2. **Session Event Ledger**
3. **Session Snapshot Store**
4. **Session Effect Outbox**

```text
Authorized Command
      ↓
Command Ledger
      ↓
Session State Transition
      ↓
Event Ledger
      ↓
Snapshot / Projection Feed / Effect Outbox
```

The event ledger remains the durable historical authority. Snapshots exist only to accelerate reconstruction.

---

## 4. Session Command Ledger

Every accepted command must be persisted with enough context to prove who requested it, under which authority, and against which expected session version.

Minimum fields:

```ts
interface SessionCommandRecord {
  commandId: string;
  sessionId: string;
  tenantId: string;
  learnerId: string;
  actorId: string;
  actorType: string;
  commandType: string;
  expectedSessionVersion: number;
  payloadHash: string;
  authorityContextId: string;
  correlationId: string;
  causationId?: string;
  receivedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  outcome: 'ACCEPTED' | 'REJECTED' | 'DUPLICATE' | 'CONFLICT';
  rejectionCode?: string;
}
```

A repeated `commandId` with an identical payload must return the prior outcome. A repeated `commandId` with a different payload must be rejected as an idempotency violation.

---

## 5. Session Event Ledger

Each state transition must append an immutable event record.

Minimum fields:

```ts
interface SessionEventRecord {
  eventId: string;
  sessionId: string;
  tenantId: string;
  learnerId: string;
  sessionVersion: number;
  eventType: string;
  schemaVersion: number;
  payload: unknown;
  occurredAt: string;
  recordedAt: string;
  commandId?: string;
  correlationId: string;
  causationId?: string;
  executorId?: string;
  fencingToken?: string;
  checksum: string;
}
```

Mandatory properties:

- append-only
- monotonic `sessionVersion`
- unique `(sessionId, sessionVersion)`
- unique `eventId`
- tenant-safe reads and writes
- checksum validation
- no in-place historical mutation

---

## 6. Event Categories

The ledger must preserve at least these categories:

### Lifecycle Events

- `SESSION_PLANNED`
- `SESSION_AUTHORIZED`
- `SESSION_STARTED`
- `SESSION_PAUSED`
- `SESSION_RESUMED`
- `SESSION_INTERRUPTED`
- `SESSION_COMPLETED`
- `SESSION_CANCELLED`
- `SESSION_ABANDONED`
- `SESSION_EXPIRED`
- `SESSION_FAILED`

### Activity Events

- `ACTIVITY_DISPATCH_INTENDED`
- `ACTIVITY_DISPATCHED`
- `ACTIVITY_ACCEPTED`
- `ACTIVITY_STARTED`
- `ACTIVITY_PROGRESS_RECORDED`
- `ACTIVITY_COMPLETED`
- `ACTIVITY_SKIPPED`
- `ACTIVITY_FAILED`

### Adaptive Events

- `ADAPTATION_PROPOSED`
- `ADAPTATION_AUTHORIZED`
- `ADAPTATION_APPLIED`
- `ADAPTATION_REJECTED`
- `HUMAN_ESCALATION_REQUESTED`

### Evidence Events

- `EVIDENCE_CANDIDATE_RECORDED`
- `EVIDENCE_QUALIFIED`
- `EVIDENCE_REJECTED`
- `EVIDENCE_CORRECTED`
- `EVIDENCE_RETRACTED`

### Recovery Events

- `CHECKPOINT_CREATED`
- `RECOVERY_REQUESTED`
- `RECOVERY_VALIDATED`
- `RECOVERY_REJECTED`
- `SESSION_REPLAYED`
- `SESSION_RECOVERED`

---

## 7. Transaction Boundary

For one accepted session command, the following must commit atomically whenever they belong to the same bounded transaction:

- command outcome
- aggregate version update
- appended session events
- checkpoint metadata when produced
- outbox messages

The runtime must never expose a state transition without the event that proves it occurred.

The runtime must never emit an external effect without a durable outbox record.

---

## 8. Optimistic Concurrency

Every state-changing command must include `expectedSessionVersion`.

The persistence adapter must enforce:

```text
storedVersion == expectedSessionVersion
```

If false, the command must fail with a version conflict and must not append events.

Concurrency rules:

- version conflicts are explicit
- clients may re-read and retry with a new command identity
- silent last-write-wins behavior is forbidden
- stale executors cannot advance the session
- fencing token validation applies during orchestration ownership

---

## 9. Execution Lease and Fencing Persistence

Lease state must be durable enough to prevent two executors from advancing the same session concurrently.

```ts
interface SessionExecutionLease {
  sessionId: string;
  executorId: string;
  leaseId: string;
  fencingToken: string;
  acquiredAt: string;
  expiresAt: string;
  renewedAt?: string;
  releasedAt?: string;
}
```

A command carrying an older fencing token than the current persisted token must be rejected even when the old lease appears locally valid.

---

## 10. Checkpoint Model

A checkpoint is a durable restart boundary, not proof of objective completion.

```ts
interface SessionCheckpoint {
  checkpointId: string;
  sessionId: string;
  sessionVersion: number;
  phaseId: string;
  activityId?: string;
  resumeCursor: unknown;
  requiredAssets: string[];
  pendingEffects: string[];
  evidenceCursor: number;
  planVersion: number;
  runtimeSchemaVersion: number;
  createdAt: string;
  checksum: string;
}
```

Checkpoint creation is required before transitions that may create long waits or external dependencies, including:

- waiting for learner
- waiting for human
- channel handoff
- device transfer
- planned pause
- long-running activity
- external assessment dispatch

---

## 11. Snapshot Strategy

Snapshots may be created by event count, time interval, lifecycle boundary, or expensive state threshold.

```ts
interface SessionSnapshot {
  sessionId: string;
  sessionVersion: number;
  snapshotSchemaVersion: number;
  aggregateState: unknown;
  lastEventId: string;
  createdAt: string;
  checksum: string;
}
```

Rules:

- snapshots are derived artifacts
- a corrupt snapshot must be discarded and rebuilt
- snapshot version must correspond to an existing event
- snapshot checksum must be verified before use
- replay from event zero must remain possible for retained history
- snapshot deletion must not destroy authoritative history

---

## 12. Deterministic Replay

Replay reconstructs session state by applying the same ordered events to the same compatible reducer logic.

```text
Load latest valid snapshot
        ↓
Read events after snapshot version
        ↓
Validate sequence and checksums
        ↓
Upcast event schemas when required
        ↓
Apply deterministic reducers
        ↓
Verify reconstructed version and invariants
```

Deterministic replay requires:

- no wall-clock reads inside reducers
- no random values inside reducers
- no network calls inside reducers
- no direct projection reads inside reducers
- all decisions that changed state must already exist as events
- external outcomes must be represented by recorded events

---

## 13. Replay Modes

### State Reconstruction Replay

Rebuilds aggregate state without emitting external effects.

### Projection Replay

Re-publishes historical events into a projection builder under a controlled rebuild cursor.

### Audit Replay

Reconstructs state and emits verification evidence for review.

### Migration Replay

Replays historical events through version-compatible upcasters and reducers.

### Shadow Replay

Runs an alternative runtime version without changing authoritative state.

No replay mode may re-award progress, currency, rewards, certificates, or external notifications unless a separate explicit reconciliation command authorizes it.

---

## 14. Outbox Model

Cross-runtime messages must be persisted transactionally with session events.

```ts
interface SessionOutboxRecord {
  outboxId: string;
  sessionId: string;
  sourceEventId: string;
  destinationRuntime: string;
  messageType: string;
  payload: unknown;
  createdAt: string;
  deliveryStatus: 'PENDING' | 'DELIVERING' | 'DELIVERED' | 'FAILED' | 'DEAD_LETTER';
  attemptCount: number;
  nextAttemptAt?: string;
  deliveredAt?: string;
}
```

Consumers must use an inbox or equivalent deduplication ledger keyed by message identity.

---

## 15. Recovery Runtime

Recovery starts only after authoritative state is re-read.

```text
Detect interruption
      ↓
Acquire fresh execution lease
      ↓
Load ledger and latest valid checkpoint
      ↓
Replay to current session version
      ↓
Verify invariants and pending effects
      ↓
Decide resume, wait, compensate, or stop
      ↓
Append recovery decision event
```

Recovery may result in:

- safe resume
- wait for learner
- wait for human
- channel rebind
- effect redelivery
- activity restart from checkpoint
- explicit abandonment
- explicit failure

Recovery must not infer success from UI state, browser route, or a previously emitted network request.

---

## 16. Pending Effect Reconciliation

For each `ACTIVITY_DISPATCH_INTENDED` without a corresponding terminal dispatch event, recovery must query the channel adapter using a stable external idempotency key.

Possible outcomes:

- effect never occurred → dispatch safely
- effect occurred and was accepted → append missing acknowledgement
- effect occurred but status unknown → move to explicit uncertainty state
- effect failed → append failure and evaluate retry policy

Unknown external outcomes must never be silently treated as success.

---

## 17. Evidence Persistence

Evidence records must remain independently traceable to source events.

Evidence persistence must preserve:

- source event identity
- activity identity
- plan and objective binding
- learner and tenant identity
- capture channel
- timing context
- accessibility context
- qualification decision
- reliability score or class
- correction and retraction lineage

A retracted evidence item remains historically visible to authorized audit readers but must no longer contribute to active inference.

---

## 18. Retention and Privacy

Retention must be policy-driven by data class.

At minimum distinguish:

- operational session events
- educational evidence
- sensitive learner observations
- temporary channel telemetry
- derived projections
- audit records

Privacy rules:

- minimize raw interaction capture
- avoid storing unnecessary free-form learner content
- separate operational identifiers from analytics identifiers where possible
- support lawful retention and deletion workflows
- preserve non-identifying integrity records when legally required
- deletion workflows must not fabricate historical events

---

## 19. Failure Handling

Persistence failures must be explicit.

Examples:

- `SESSION_VERSION_CONFLICT`
- `SESSION_LEDGER_WRITE_FAILED`
- `SESSION_EVENT_SEQUENCE_INVALID`
- `SESSION_SNAPSHOT_CORRUPT`
- `SESSION_CHECKPOINT_INVALID`
- `SESSION_LEASE_CONFLICT`
- `SESSION_FENCING_TOKEN_STALE`
- `SESSION_OUTBOX_WRITE_FAILED`
- `SESSION_REPLAY_FAILED`
- `SESSION_RECOVERY_UNSAFE`

A persistence failure must not be converted into learner failure.

---

## 20. Verification Requirements

The persistence and replay implementation must verify:

- append-only ledger behavior
- atomic event and outbox writes
- optimistic concurrency
- command idempotency
- fencing token rejection
- snapshot corruption recovery
- checkpoint validity
- deterministic replay equivalence
- no side effects during reconstruction
- outbox redelivery deduplication
- evidence correction lineage
- tenant isolation
- recovery from every durable waiting state

---

## 21. Runtime Invariants Established by 35G

1. The event ledger is the authoritative session history.
2. Snapshots cannot replace authoritative events.
3. Every accepted state-changing command produces durable proof.
4. External effects require durable intent before delivery.
5. Replay cannot repeat learner rewards or irreversible effects.
6. Recovery begins from persisted authority, not client memory.
7. Session versions are monotonic and conflict-protected.
8. Old fencing tokens cannot advance the session.
9. Corrections append history; they do not erase it.
10. A session is resumable only when replay and invariant checks succeed.

---

## 22. Completion Criteria

35G is complete when the Learning Session Runtime has a durable, tenant-safe, versioned event ledger; atomic outbox behavior; checkpoint and snapshot policies; deterministic replay; explicit recovery decisions; idempotent effect reconciliation; and verified protection against duplicate execution.