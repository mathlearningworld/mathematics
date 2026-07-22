# 37G — Mastery Persistence & Replay Runtime

## Purpose

Mastery Persistence & Replay Runtime defines how mastery authority survives process restarts, concurrent commands, infrastructure failures, policy evolution, and deterministic reconstruction.

The runtime must preserve one educational truth:

> A mastery state is durable only when its decision lineage, evidence references, policy context, and version history can be reconstructed and verified.

Persistence is not a storage detail. It is part of mastery correctness.

---

## Runtime Responsibilities

This runtime owns:

- durable mastery aggregate storage;
- append-only mastery event history;
- atomic decision persistence;
- command idempotency;
- optimistic concurrency;
- evidence-reference integrity;
- evaluation and decision lineage;
- snapshot creation and validation;
- deterministic replay;
- outbox publication;
- inbox deduplication;
- recovery after partial infrastructure failure;
- projection rebuild support;
- audit-grade historical reconstruction.

It does not own:

- creation of learning evidence;
- calculation of evaluation candidates;
- authorization of mastery transitions;
- curriculum truth;
- skill graph truth;
- user-facing projection semantics.

---

## Durable Aggregate Model

Each persisted mastery aggregate must include at minimum:

```text
MasteryAggregate
├── tenantId
├── learnerId
├── skillId
├── masteryId
├── aggregateVersion
├── decisionVersion
├── status
├── confirmedLevel
├── confidenceBand
├── coverageSummary
├── durabilityState
├── contradictionState
├── activeEvaluationId
├── activeDecisionId
├── policyVersion
├── curriculumVersion
├── skillGraphVersion
├── evidenceBundleId
├── lastChangedAt
└── createdAt
```

Identity is immutable after aggregate creation.

The authoritative key is:

```text
(tenantId, learnerId, skillId)
```

A separate `masteryId` may be used for opaque public references, but it must never weaken tenant and learner isolation.

---

## Event Ledger

Every accepted state transition must append a mastery event.

Representative events:

- `MasteryTrackingStarted`
- `MasteryEvaluationRequested`
- `MasteryEvaluationCompleted`
- `MasteryDecisionProposed`
- `MasteryConfirmed`
- `MasteryLevelChanged`
- `MasteryMarkedAtRisk`
- `MasteryReviewRequired`
- `MasteryRevoked`
- `MasterySuperseded`
- `MasteryAppealOpened`
- `MasteryAppealResolved`
- `MasteryEvidenceBundleReplaced`
- `MasteryPolicyContextChanged`

Each event envelope must contain:

```text
EventEnvelope
├── eventId
├── eventType
├── eventSchemaVersion
├── aggregateId
├── aggregateVersion
├── tenantId
├── learnerId
├── skillId
├── commandId
├── correlationId
├── causationId
├── actorId
├── actorType
├── occurredAt
├── recordedAt
├── policyVersion
├── evaluationId?
├── decisionId?
└── payload
```

The event ledger is append-only.

Historical events are never edited in place.

Corrections are represented by new events that explicitly supersede or invalidate prior interpretations.

---

## Atomic Write Boundary

A successful mastery command must commit the following in one transaction:

1. validate expected aggregate version;
2. validate expected decision version when applicable;
3. append mastery event(s);
4. update aggregate state;
5. record command idempotency result;
6. persist decision lineage;
7. persist evidence-bundle reference;
8. enqueue outbox records;
9. update snapshot eligibility metadata.

If any step fails, none of the state-changing steps may become visible.

The atomicity rule is:

> Aggregate state, event history, decision lineage, idempotency result, and outbound signals must agree or must not commit.

---

## Optimistic Concurrency

Every state-changing command carries:

```text
expectedAggregateVersion
expectedDecisionVersion?
```

The repository must reject stale writes.

A rejected stale write must not:

- append events;
- advance aggregate version;
- publish outbox records;
- overwrite a newer decision;
- silently retry with changed semantics.

The caller may reload authority and submit a new command with an explicit new intent.

---

## Command Idempotency

Every externally initiated command requires a stable `commandId`.

The idempotency record stores:

```text
CommandReceipt
├── tenantId
├── commandId
├── commandType
├── aggregateId
├── requestHash
├── resultHash
├── resultingAggregateVersion
├── resultingDecisionVersion?
├── status
└── completedAt
```

Rules:

- same command ID + same request hash returns the original result;
- same command ID + different request hash is rejected;
- retries never create duplicate mastery events;
- idempotency scope is tenant-safe;
- command receipts must survive process restarts.

---

## Evidence Reference Integrity

Persistence stores references to evidence bundles, not mutable copies disguised as authority.

Every accepted decision must reference a frozen evidence bundle containing:

- bundle ID;
- bundle version;
- evidence item IDs;
- source versions;
- trust classifications;
- dependence groups;
- freshness timestamps;
- correction and withdrawal status;
- bundle hash.

A decision cannot be replayed as equivalent if its referenced evidence bundle cannot be resolved or verified.

Missing evidence authority is a replay failure, not an invitation to approximate.

---

## Evaluation and Decision Lineage

The durable lineage chain is:

```text
Evidence Bundle
      ↓
Evaluation Request
      ↓
Evaluation Result
      ↓
Decision Command
      ↓
Decision Record
      ↓
Mastery Event(s)
      ↓
Aggregate Version
```

Each link must be independently addressable and hash-verifiable.

A projection may summarize this chain, but cannot replace it.

---

## Snapshot Model

Snapshots accelerate loading but do not replace event authority.

A snapshot must include:

```text
MasterySnapshot
├── snapshotId
├── aggregateId
├── aggregateVersion
├── state
├── decisionVersion
├── lastEventId
├── eventSchemaVector
├── policyVersion
├── curriculumVersion
├── skillGraphVersion
├── evidenceBundleId
├── stateHash
└── createdAt
```

Snapshot validity requires:

- matching aggregate identity;
- verifiable state hash;
- known event schema vector;
- no skipped aggregate version;
- resolvable decision lineage;
- compatible runtime version.

An invalid snapshot must be discarded and rebuilt from events.

---

## Deterministic Replay

Replay reconstructs mastery state from durable events under an explicit replay context.

Replay must be:

- deterministic;
- side-effect free;
- schema-aware;
- tenant-isolated;
- version-explicit;
- auditable.

Replay must never:

- redispatch notifications;
- recreate external learning activities;
- regenerate evidence;
- call current policy as though it were historical policy;
- mutate source events;
- infer missing event payloads.

The same ordered event stream, upcaster chain, and replay context must produce the same aggregate hash.

---

## Replay Modes

### Authority Replay

Reconstruct the historical authoritative aggregate exactly as committed.

### Projection Replay

Rebuild read models from mastery events without changing mastery authority.

### Audit Replay

Reconstruct decision lineage, policy context, and evidence references for inspection.

### Migration Replay

Apply approved upcasters and migration rules under an explicit target version.

### Shadow Replay

Compare old and candidate runtime interpretations without publishing candidate authority.

These modes must not be conflated.

---

## Event Ordering

Events are applied by aggregate version, not by transport arrival time.

Rules:

- aggregate versions are contiguous;
- duplicate event IDs are ignored idempotently;
- a version gap blocks replay;
- an event for an earlier already-applied version must match the recorded event hash;
- conflicting events for the same aggregate version are integrity failures.

Wall-clock order is informative, not authoritative.

---

## Inbox and Outbox

### Inbox

The inbox protects mastery authority from duplicate upstream messages.

It records:

- source runtime;
- source message ID;
- payload hash;
- processing status;
- resulting command ID;
- processed at.

### Outbox

The outbox publishes accepted mastery changes to:

- Progress Runtime;
- Recommendation Engine;
- Learning Journey Runtime;
- Curriculum readiness projections;
- teacher attention queues;
- parent and learner notification pipelines;
- analytics consumers.

Outbox publication may be retried independently after the authoritative transaction commits.

Failure to publish does not roll back already committed mastery authority.

---

## Recovery Model

Recovery starts from durable authority, never from memory of the failed process.

Recovery sequence:

```text
Load command receipt
→ Load aggregate or valid snapshot
→ Replay missing events
→ Verify lineage and hashes
→ Inspect outbox state
→ Reconcile pending publication
→ Resume safe processing
```

A process crash between commit and response must resolve through command idempotency.

A process crash before commit must leave no partial mastery change.

---

## Ambiguous Outcome Reconciliation

When a caller cannot determine whether a command committed:

1. query by tenant ID and command ID;
2. compare request hash;
3. return committed result when present;
4. report not committed when absent;
5. reject hash mismatch;
6. never issue a semantically different retry under the same command ID.

This prevents accidental duplicate confirmations or revocations.

---

## Soft Deletion and Historical Retention

Authoritative mastery history is not physically deleted as a normal product operation.

Privacy deletion workflows must use governed redaction or cryptographic erasure strategies that preserve required structural integrity while removing protected content according to law and policy.

A projection may hide superseded or revoked states, but the audit ledger must retain their existence where legally permitted and operationally required.

---

## Tenant Isolation

Every read and write path must include tenant authority.

Forbidden patterns:

- lookup by mastery ID without tenant scope;
- cross-tenant replay;
- shared command-id namespace without tenant binding;
- projection rebuild that mixes tenants;
- evidence resolution without tenant verification.

Tenant mismatch is an authorization failure, not a not-found approximation inside trusted runtime boundaries.

---

## Integrity Verification

The persistence layer must support verification of:

- event-chain continuity;
- aggregate version continuity;
- decision-lineage completeness;
- evidence-bundle hash;
- snapshot hash;
- command receipt consistency;
- outbox completeness;
- tenant identity consistency;
- schema compatibility;
- replay result hash.

Integrity failures must be observable and quarantinable.

They must never be silently repaired through guesswork.

---

## Failure Classes

Representative failure codes:

```text
MASTERY_AGGREGATE_NOT_FOUND
MASTERY_VERSION_CONFLICT
MASTERY_DECISION_VERSION_CONFLICT
MASTERY_COMMAND_HASH_MISMATCH
MASTERY_EVENT_VERSION_GAP
MASTERY_EVENT_HASH_CONFLICT
MASTERY_SNAPSHOT_INVALID
MASTERY_EVIDENCE_BUNDLE_MISSING
MASTERY_LINEAGE_INCOMPLETE
MASTERY_REPLAY_NON_DETERMINISTIC
MASTERY_TENANT_MISMATCH
MASTERY_OUTBOX_RECONCILIATION_REQUIRED
MASTERY_SCHEMA_UNSUPPORTED
```

Each failure must be stable enough for tests, operations, and recovery logic.

---

## Repository Contract

A durable repository interface should expose operations equivalent to:

```text
load(tenantId, learnerId, skillId)
loadAtVersion(tenantId, masteryId, aggregateVersion)
appendDecision(transaction, command, events, nextState)
findCommandReceipt(tenantId, commandId)
loadEventStream(tenantId, masteryId, fromVersion)
loadSnapshot(tenantId, masteryId)
writeSnapshot(transaction, snapshot)
claimOutboxBatch(workerId, lease)
markOutboxPublished(messageId)
verifyIntegrity(tenantId, masteryId)
```

Infrastructure adapters may vary, but the authority semantics may not.

---

## Operational Metrics

Required metrics include:

- mastery command commit latency;
- optimistic concurrency conflict rate;
- duplicate command rate;
- replay duration;
- replay hash mismatch count;
- invalid snapshot count;
- evidence-reference resolution failure rate;
- outbox backlog age;
- lineage-integrity failure count;
- tenant-isolation rejection count.

Metrics must not expose protected learner content.

---

## Acceptance Criteria

37G is complete when:

- mastery decisions persist atomically;
- event history is append-only and versioned;
- retries are idempotent;
- stale writes are rejected;
- evidence and decision lineage are durable;
- snapshots are optional acceleration only;
- replay is deterministic and side-effect free;
- outbox publication is recoverable;
- tenant isolation is enforced on every path;
- integrity failures are explicit;
- projection rebuild can occur without modifying mastery authority.

---

## Permanent Rules

1. Event history is historical authority.
2. Snapshot state is acceleration, not truth replacement.
3. Persistence correctness is part of educational correctness.
4. A mastery decision without durable lineage is not auditable authority.
5. Replay reconstructs; it does not redispatch side effects.
6. Recovery starts from persisted authority.
7. Idempotency survives process restarts.
8. Tenant scope is mandatory on every persistence operation.
9. Missing lineage blocks authoritative replay.
10. Silent repair is forbidden.