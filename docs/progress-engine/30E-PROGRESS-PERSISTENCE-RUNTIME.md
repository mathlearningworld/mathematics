# 30E — Progress Persistence Runtime

## 1. Purpose

The Progress Persistence Runtime defines how progress history, aggregate versions, projection checkpoints, corrections, and publication state are stored durably.

Its primary responsibility is preserving historical truth and rebuildability.

```text
Authorized Progress Inputs
          ↓
Append-only Progress Timeline
          ↓
Versioned Aggregates
          ↓
Projection Checkpoints + Outbox
```

## 2. Persistence Authority

The durable progress timeline is the source of truth for progress history.

Derived aggregates, snapshots, caches, and projections are rebuildable artifacts.

```text
Timeline Ledger = Historical Authority
Aggregate = Derived State
Snapshot = Recovery Optimization
Projection = Read Model
```

No derived artifact may overwrite or replace the ledger.

## 3. Durable Record Families

The persistence model should support at least:

- `ProgressTimelineRecord`
- `ProgressSourceReferenceRecord`
- `ProgressSupersessionRecord`
- `ProgressCorrectionRecord`
- `ProgressAggregateVersionRecord`
- `ProgressAggregateContributionRecord`
- `ProgressProjectionCheckpointRecord`
- `ProgressPolicyReferenceRecord`
- `ProgressIdempotencyRecord`
- `ProgressOutboxRecord`
- `ProgressVerificationRecord`
- `ProgressQuarantineRecord`
- `ProgressRebuildRecord`
- `ProgressAccessAuditRecord`

## 4. Append-only Timeline

Accepted progress events must be appended. Existing historical entries must not be edited in place to change semantic truth.

Corrections use explicit lineage:

```text
Original Record
      ↓ supersededBy
Correction Record
      ↓ reason / authority / policy
Effective Historical View
```

Deletion is reserved for legally required data handling and must leave an authorized tombstone or audit reference where policy permits.

## 5. Identity and Isolation

Every durable record must carry sufficient identity to enforce:

- tenant ownership;
- learner ownership;
- source engine and source record identity;
- actor or system authority;
- correlation and causation lineage;
- policy and schema version;
- idempotency identity.

A write that cannot prove tenant and learner scope must fail closed.

## 6. Versioning

### 6.1 Timeline Sequence

Each learner progress stream receives an authoritative monotonic ledger sequence.

### 6.2 Aggregate Version

Every material aggregate update creates a new version linked to:

- prior aggregate version;
- included timeline range;
- contribution set hash;
- aggregation policy version;
- generated timestamp.

### 6.3 Schema and Policy Version

Historical records preserve the versions active when the decision occurred. Current policy must not be backfilled as historical truth.

## 7. Optimistic Concurrency

Writes that depend on current stream state must include an expected version or expected sequence.

```text
Expected version matches → append
Expected version differs → conflict and retry/reconcile
```

Last-write-wins is forbidden for semantic progress state.

## 8. Idempotency

Duplicate delivery is expected across engine boundaries.

Idempotency identity should include:

- tenant;
- learner;
- source engine;
- source record identity;
- source record version;
- operation type.

An exact duplicate returns the previously committed outcome. A reused key with different content is a conflict and must be quarantined or rejected.

## 9. Transactional Boundary

When an accepted input changes durable progress state, the following must commit atomically:

- timeline append;
- idempotency record;
- aggregate update or rebuild request;
- outbox publication record;
- verification linkage where required.

```text
State without outbox = forbidden
Outbox without state = forbidden
```

## 10. Aggregate Persistence

Aggregates are versioned and replaceable, not historical authority.

Each version stores or references:

- aggregate family and scope;
- dimensional values;
- confidence and freshness;
- included and excluded contributions;
- conflict and limitation metadata;
- source timeline high-water mark;
- policy identity;
- deterministic contribution hash.

## 11. Snapshot and Checkpoint Policy

Snapshots may accelerate restart and rebuild but must be validated against:

- stream identity;
- timeline high-water mark;
- checksum;
- schema version;
- policy compatibility.

A corrupt or incompatible snapshot is discarded and rebuilt from durable history.

```text
Snapshot failure ≠ Historical loss.
```

## 12. Late-arriving and Offline Data

Late-arriving data is appended using server authority while preserving source occurrence time.

The system must not silently insert physical rows into an earlier ledger position. Semantic ordering is computed from explicit temporal and causal fields.

Offline conflicts must be:

- accepted with limitations;
- reconciled;
- held for review;
- quarantined; or
- rejected with recorded reason.

They must never disappear silently.

## 13. Retention and Privacy

Persistence policy must define:

- record retention periods;
- evidence reference retention;
- child-data protections;
- encryption requirements;
- access audit retention;
- lawful deletion workflow;
- backup and restore boundaries.

Analytics exports must use the minimum required identity and must not become a shadow source of learner truth.

## 14. Recovery

On interrupted processing, recovery resumes from durable high-water marks and outbox state.

Recovery must be safe under repeated execution and must not duplicate timeline meaning.

Required recovery cases include:

- process crash after timeline append;
- process crash before publication;
- aggregate rebuild interruption;
- stale projection checkpoint;
- idempotency race;
- outbox delivery retry;
- quarantine release.

## 15. Backup and Restore Verification

A persistence design is incomplete without verified restore behavior.

Restore verification must prove:

- ledger sequence continuity;
- lineage integrity;
- aggregate rebuildability;
- outbox reconciliation;
- tenant and learner isolation;
- checksum validity;
- no semantic records lost or duplicated.

## 16. Core Invariants

```text
Progress history is append-only.
Correction never erases prior truth.
No last-write-wins for semantic state.
Timeline is the durable historical authority.
Aggregate and projection are rebuildable.
State and outbox commit atomically.
Exact duplicates are idempotent.
Conflicting duplicates fail closed.
Late arrival never rewrites physical history.
Snapshot is not source of truth.
Restore must preserve lineage and ordering.
```