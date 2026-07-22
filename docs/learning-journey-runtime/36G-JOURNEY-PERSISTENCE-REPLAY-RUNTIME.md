# 36G — Journey Persistence & Replay Runtime

## Status

- Chapter: 36 — Learning Journey Runtime
- Slice: 36G
- Authority: Architecture Source of Truth
- Scope: Durable journey state, event history, checkpointing, replay, recovery, and effect reconciliation

---

## 1. Purpose

Journey Persistence & Replay Runtime defines how a learning journey survives process failure, deployment, long inactivity, partial integration failure, and model evolution without losing authoritative history or duplicating external effects.

The runtime must preserve the distinction between:

- durable historical truth,
- current aggregate state,
- derived projections,
- pending external effects,
- and replayed interpretation.

A journey may span weeks or months. Therefore process memory, a single database row, or a projection cache cannot be treated as sufficient authority.

---

## 2. Core Doctrine

```text
Event ledger = historical authority
Aggregate state = current write authority
Snapshot = acceleration artifact
Projection = derived read model
Outbox = pending external-effect authority
Replay = deterministic reconstruction
Recovery = continuation from persisted authority
```

Replay must never redispatch historical side effects merely because historical events are read again.

---

## 3. Persistence Responsibilities

This runtime owns:

- durable journey aggregate storage,
- append-only journey event history,
- command deduplication records,
- optimistic concurrency control,
- snapshots and checkpoints,
- orchestration leases and fencing tokens,
- durable pending-effect records,
- deterministic replay contracts,
- recovery position,
- projection dispatch checkpoints,
- evidence-reference durability,
- and integrity verification metadata.

It does not own:

- mastery judgment,
- curriculum truth,
- recommendation policy,
- session evidence content,
- or external system availability.

---

## 4. Durable Journey Aggregate

The persisted aggregate record must include at minimum:

```ts
interface PersistedLearningJourney {
  tenantId: string;
  journeyId: string;
  learnerId: string;
  missionId?: string;
  objectiveId: string;
  status: JourneyStatus;
  activePlanId?: string;
  activePhaseId?: string;
  activeMilestoneId?: string;
  activeSessionIntentId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  lastEventSequence: number;
  orchestrationEpoch: number;
}
```

The aggregate row is not a substitute for the event ledger. It is the current transactional state used for command validation and optimistic write authority.

---

## 5. Journey Event Ledger

Every accepted state transition must append a durable event.

```ts
interface JourneyEventRecord {
  tenantId: string;
  journeyId: string;
  sequence: number;
  eventId: string;
  eventType: string;
  eventVersion: number;
  aggregateVersion: number;
  occurredAt: string;
  recordedAt: string;
  actor: ActorReference;
  correlationId: string;
  causationId?: string;
  commandId?: string;
  payload: unknown;
  metadata: JourneyEventMetadata;
}
```

Required properties:

- append only,
- unique `(tenantId, journeyId, sequence)`,
- unique `eventId`,
- monotonic aggregate version,
- immutable payload after commit,
- explicit event schema version,
- explicit correlation and causation lineage.

---

## 6. Atomic Write Boundary

A valid journey write transaction must atomically perform all applicable operations:

1. validate expected aggregate version,
2. validate command idempotency,
3. update aggregate state,
4. append one or more events,
5. store command result,
6. create pending outbox records,
7. update recovery/checkpoint metadata.

No accepted transition may update aggregate state without its corresponding event.

No external effect may be sent inside the database transaction as proof that the transition committed.

---

## 7. Optimistic Concurrency

Every journey command must carry or resolve an expected version.

```ts
interface JourneyCommandEnvelope<T> {
  tenantId: string;
  journeyId: string;
  commandId: string;
  expectedVersion: number;
  issuedAt: string;
  actor: ActorReference;
  correlationId: string;
  payload: T;
}
```

If the current version differs from `expectedVersion`, the runtime must reject or re-evaluate the command. It must not silently overwrite newer journey decisions.

Typical failure:

```text
JOURNEY_VERSION_CONFLICT
```

---

## 8. Command Idempotency

The command ledger must preserve:

- command identity,
- journey identity,
- request fingerprint,
- accepted aggregate version,
- result or failure classification,
- completion timestamp.

A repeated command with the same identity and same fingerprint returns the prior result.

A repeated command identity with a different fingerprint is a contract violation.

```text
Same command ID + same intent = replay prior result
Same command ID + different intent = reject
```

---

## 9. Snapshot Runtime

Snapshots accelerate reconstruction but never replace events.

```ts
interface JourneySnapshot {
  tenantId: string;
  journeyId: string;
  snapshotVersion: number;
  aggregateVersion: number;
  lastEventSequence: number;
  schemaVersion: number;
  state: SerializedJourneyState;
  createdAt: string;
  integrityHash: string;
}
```

A snapshot is valid only when:

- its integrity hash verifies,
- its aggregate version is not ahead of the ledger,
- its schema version is readable,
- and the referenced event sequence exists.

If invalid, the runtime must discard it and replay from an earlier valid snapshot or genesis.

---

## 10. Snapshot Policy

Snapshot creation may be triggered by:

- event count threshold,
- elapsed time,
- phase completion,
- plan replacement,
- pre-deployment maintenance,
- or operational recovery needs.

Snapshot creation must not block accepted journey commands longer than the defined transaction budget.

Snapshots should normally be created asynchronously from committed authority.

---

## 11. Checkpoint Model

Separate checkpoints are required for distinct consumers.

```ts
interface JourneyCheckpoint {
  consumerName: string;
  tenantId: string;
  journeyId?: string;
  lastEventSequence?: number;
  lastGlobalPosition?: string;
  updatedAt: string;
  consumerVersion: string;
}
```

Examples:

- journey projection consumer,
- journey evidence package builder,
- journey notification dispatcher,
- journey analytics exporter,
- cross-runtime integration publisher.

One consumer's progress must never be treated as another consumer's progress.

---

## 12. Deterministic Replay

Given the same:

- ordered event stream,
- event upcaster set,
- aggregate reducer version,
- and deterministic policy inputs,

replay must reconstruct the same authoritative journey state.

The reducer must not depend on:

- current wall-clock time,
- random values,
- current external API state,
- mutable recommendation outputs,
- current curriculum contents,
- or process-local caches.

Historical decisions must be represented in events or immutable references.

---

## 13. Replay Modes

Supported replay modes:

### 13.1 Aggregate Reconstruction

Rebuild current journey write state.

### 13.2 Projection Rebuild

Recompute one or more read models without modifying aggregate authority.

### 13.3 Verification Replay

Compare reconstructed state with persisted aggregate and snapshot state.

### 13.4 Shadow Replay

Run a candidate reducer or event interpretation without changing production authority.

### 13.5 Incident Replay

Reproduce a historical journey state at a selected sequence for diagnosis.

---

## 14. Side-Effect Isolation

Historical event replay must never directly trigger:

- a new session launch,
- a new parent notification,
- a new teacher alert,
- a duplicate intervention request,
- a duplicate recommendation request,
- or any other external mutation.

External effects must be driven by durable outbox records with independent delivery state.

---

## 15. Journey Outbox

```ts
interface JourneyOutboxRecord {
  tenantId: string;
  outboxId: string;
  journeyId: string;
  sourceEventId: string;
  effectType: string;
  destination: string;
  payload: unknown;
  status: 'PENDING' | 'LEASED' | 'DELIVERED' | 'FAILED' | 'DEAD_LETTERED';
  attemptCount: number;
  nextAttemptAt?: string;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  deliveredAt?: string;
  idempotencyKey: string;
}
```

Delivery must be at-least-once with destination-side or gateway-side idempotency.

---

## 16. Inbox and External Intake

Cross-runtime results should be received through an inbox or equivalent deduplication boundary.

Examples:

- session outcome received,
- intervention decision received,
- diagnostic update received,
- mission cancellation received,
- curriculum compatibility notice received.

The inbox records source identity and processing result so duplicate delivery does not duplicate journey transitions.

---

## 17. Execution Lease

Only one active orchestrator may make authoritative progress for a journey epoch.

```ts
interface JourneyExecutionLease {
  tenantId: string;
  journeyId: string;
  leaseId: string;
  ownerId: string;
  fencingToken: number;
  acquiredAt: string;
  expiresAt: string;
  releasedAt?: string;
}
```

A stale worker with an older fencing token must be unable to commit orchestration decisions.

Lease expiry does not itself prove that the former worker stopped. Fencing token validation at write time is mandatory.

---

## 18. Recovery Runtime

Recovery begins by loading persisted authority, not by trusting process memory.

Recovery sequence:

1. resolve tenant and journey identity,
2. acquire a new execution lease,
3. validate aggregate/event consistency,
4. load the newest valid snapshot,
5. replay remaining events,
6. compare reconstructed and persisted state,
7. inspect pending session intent,
8. inspect inbox/outbox state,
9. reconcile ambiguous external effects,
10. continue from the durable lifecycle state.

```text
Resume > Restart
Reconcile > Duplicate
Persisted authority > Process memory
```

---

## 19. Ambiguous Session Dispatch

A crash may occur after a session launch request is delivered but before delivery acknowledgement is recorded.

The recovery runtime must query or reconcile by stable `sessionIntentId`.

Allowed outcomes:

- session exists and is bound: record acknowledgement,
- session does not exist: safely retry with same idempotency key,
- session state is ambiguous: pause and escalate,
- conflicting session exists: block progression and record integrity incident.

Creating a new session with a new identity is not a valid default recovery action.

---

## 20. Evidence Reference Durability

Journey evidence records must reference immutable source evidence identities and versions.

Persistence must preserve:

- source runtime,
- source aggregate identity,
- source version,
- evidence type,
- collection time,
- trust classification,
- revocation or supersession status,
- privacy classification.

The journey ledger should not silently copy mutable evidence values without lineage.

---

## 21. Data Integrity Verification

The runtime must detect:

- missing event sequences,
- duplicate sequences,
- aggregate/event version mismatch,
- invalid snapshot hash,
- snapshot ahead of ledger,
- orphaned outbox records,
- outbox records without source events,
- stale lease writes,
- cross-tenant identity mismatch,
- and unreadable event schema versions.

Integrity failures must not be treated as ordinary retryable errors.

---

## 22. Tenant Isolation

Every persistence query and write must be tenant-scoped.

A journey ID alone is insufficient authority.

Required uniqueness should include tenant identity where applicable:

```text
(tenantId, journeyId)
(tenantId, journeyId, sequence)
(tenantId, commandId)
(tenantId, idempotencyKey)
```

Cross-tenant replay, snapshot loading, or outbox delivery is prohibited.

---

## 23. Retention and Archival

Journey history may have long educational and regulatory value. Retention policy must distinguish:

- authoritative events,
- snapshots,
- projections,
- operational logs,
- transient payloads,
- personally sensitive evidence references.

Deleting a projection cache is not deleting journey history.

Archival must retain sufficient information for lawful audit and deterministic reconstruction while honoring privacy and deletion obligations.

---

## 24. Failure Classification

Suggested failure codes:

```text
JOURNEY_VERSION_CONFLICT
JOURNEY_COMMAND_ID_REUSE
JOURNEY_EVENT_SEQUENCE_GAP
JOURNEY_EVENT_DUPLICATE
JOURNEY_SNAPSHOT_INVALID
JOURNEY_REPLAY_DIVERGED
JOURNEY_LEASE_NOT_HELD
JOURNEY_FENCING_TOKEN_STALE
JOURNEY_OUTBOX_DELIVERY_FAILED
JOURNEY_EXTERNAL_EFFECT_AMBIGUOUS
JOURNEY_PERSISTENCE_UNAVAILABLE
JOURNEY_TENANT_MISMATCH
JOURNEY_EVENT_VERSION_UNREADABLE
JOURNEY_INTEGRITY_VIOLATION
```

Failures must be classified as:

- retryable,
- conflict,
- policy refusal,
- integrity incident,
- or permanent incompatibility.

---

## 25. Observability

Required operational signals:

- command commit latency,
- event append latency,
- version conflict rate,
- snapshot age,
- replay duration,
- replay divergence count,
- outbox backlog,
- oldest pending effect age,
- lease contention,
- recovery count,
- ambiguous effect count,
- integrity incident count.

Metrics must avoid exposing sensitive learner content.

---

## 26. Verification Requirements

Repository verification must confirm:

- schema and contract definitions exist,
- aggregate/event/outbox boundaries are explicit,
- replay does not invoke effects,
- idempotency and concurrency rules are documented,
- tenant isolation is explicit,
- recovery paths are defined.

Runtime verification must confirm:

- atomic writes,
- optimistic concurrency,
- duplicate command behavior,
- snapshot fallback,
- deterministic replay,
- outbox retry,
- stale lease rejection,
- and recovery after injected failure.

Operational verification must confirm a real journey can survive process termination and continue without duplicate session dispatch or lost progression.

---

## 27. Non-Negotiable Rules

1. No accepted state mutation without a durable event.
2. No historical replay may redeliver effects by itself.
3. No snapshot may become historical authority.
4. No stale lease holder may commit.
5. No duplicate command may create duplicate progression.
6. No recovery may invent a new journey identity.
7. No projection checkpoint may be used as aggregate authority.
8. No tenant boundary may be inferred from journey ID alone.
9. No integrity mismatch may be silently repaired without evidence.
10. No external-effect ambiguity may be resolved by blind duplication.

---

## 28. Completion Statement

36G is complete when Learning Journey Runtime has a durable, tenant-safe, concurrency-safe, replayable, and recoverable persistence model that preserves historical truth while preventing duplicate orchestration and external effects.