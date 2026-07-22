# Chapter 38G — Learning Path Persistence & Replay Runtime

## 1. Purpose

The Learning Path Persistence & Replay Runtime defines how learning-path authority becomes durable, reconstructable, auditable, recoverable, and safe under retries, crashes, concurrent commands, migrations, and downstream projection lag.

This runtime does not decide what should be learned next. Planning owns proposals. Orchestration owns bounded execution. Adaptation owns reconsideration. Persistence owns durable historical truth.

Core rule:

> A learning path exists operationally only when its authoritative state transition is durably committed.

## 2. Authority Boundary

Persistence owns:

- durable learning-path aggregate state,
- append-only event history,
- expected-version enforcement,
- command deduplication,
- atomic state and event commit,
- snapshot and checkpoint storage,
- replay inputs,
- outbox publication records,
- inbox deduplication records,
- recovery markers,
- integrity metadata,
- tenant-safe storage access.

Persistence does not own:

- planning policy,
- sequencing heuristics,
- adaptation policy,
- mastery evaluation,
- learner-facing projection semantics,
- UI state,
- speculative forecasts.

## 3. Durable Aggregate

The durable learning-path aggregate MUST preserve at least:

- `tenantId`
- `learnerId`
- `pathId`
- `pathVersion`
- `lifecycleState`
- `goalRefs`
- `masteryContextRef`
- `curriculumVersionRef`
- `skillGraphVersionRef`
- `planningPolicyVersion`
- `adaptationPolicyVersion`
- `activeNodeId`
- `executionCursor`
- `nodeStates`
- `blockers`
- `approvedAt`
- `activatedAt`
- `pausedAt`
- `completedAt`
- `supersededByPathVersion`
- `lastDecisionId`
- `lastCommandId`
- `createdAt`
- `updatedAt`

Stored aggregate state is an optimization and operational authority snapshot. Historical meaning remains reconstructable from the event stream.

## 4. Event Stream

Each learning path owns an ordered event stream identified by:

```text
streamType = LEARNING_PATH
streamId   = tenantId + pathId
```

Every event MUST contain:

- event ID,
- tenant ID,
- learner ID,
- path ID,
- path version,
- aggregate version,
- event type,
- event schema version,
- occurred-at timestamp,
- recorded-at timestamp,
- actor identity,
- command ID,
- correlation ID,
- causation ID,
- policy version refs,
- payload,
- payload integrity hash.

Representative events:

- `LearningPathDrafted`
- `LearningPathApproved`
- `LearningPathActivated`
- `LearningPathNodeAuthorized`
- `LearningPathNodeStarted`
- `LearningPathNodeCompleted`
- `LearningPathNodeBlocked`
- `LearningPathPaused`
- `LearningPathResumed`
- `LearningPathReplanRequested`
- `LearningPathVersionSuperseded`
- `LearningPathCompleted`
- `LearningPathCancelled`
- `LearningPathEvidenceLinked`
- `LearningPathRecoveryRecorded`

## 5. Atomic Commit Boundary

A command that changes learning-path authority MUST commit atomically:

1. expected-version validation,
2. command-idempotency validation,
3. new event records,
4. aggregate state mutation,
5. command result record,
6. outbox records,
7. integrity metadata.

The transaction either commits all of these or none of them.

No UI success response may be treated as proof of durable completion before the transaction commits.

## 6. Optimistic Concurrency

Every state-changing command MUST provide an expected aggregate version unless the command is explicitly create-only.

Conflict behavior:

```text
expectedVersion == persistedVersion → command may proceed
expectedVersion != persistedVersion → reject with VERSION_CONFLICT
```

The runtime MUST NOT silently merge concurrent path mutations.

The caller must reload current authority, reconsider intent, and issue a new command.

## 7. Command Idempotency

Every externally initiated state-changing operation MUST carry a stable `commandId`.

For a repeated command:

- same command ID + same canonical payload → return the persisted prior result,
- same command ID + different payload → reject as `IDEMPOTENCY_CONFLICT`,
- unknown command ID → execute normally.

Canonical payload hashing MUST exclude volatile transport metadata and include all fields that affect authority.

## 8. Decision and Policy Lineage

Every durable path transition MUST preserve enough lineage to explain why it occurred.

Required refs include, where applicable:

- mastery snapshot/version,
- planning decision ID,
- adaptation decision ID,
- curriculum version,
- skill graph version,
- content catalog version,
- accessibility profile version,
- policy version,
- human approval identity.

Replays MUST use the versions recorded with the historical transition, not whatever versions are current today.

## 9. Snapshot Policy

Snapshots MAY be created to accelerate reads and replay.

A snapshot MUST include:

- stream ID,
- aggregate version,
- path version,
- serialized aggregate state,
- snapshot schema version,
- source event hash boundary,
- created-at timestamp,
- compatibility metadata.

A snapshot is valid only when:

- all events through its version are durably present,
- integrity verification succeeds,
- its schema can be read or upcast,
- the stored source event hash matches.

Snapshot failure MUST fall back to event replay.

## 10. Checkpoints

Operational checkpoints represent resumable execution positions and are distinct from snapshots.

Examples:

- last safely completed node,
- last committed evidence linkage,
- last published outbox offset,
- last rebuilt projection offset,
- migration cursor.

A checkpoint MUST never claim progress beyond committed authority.

## 11. Deterministic Replay

Replay reconstructs aggregate state by applying historical events in strict aggregate-version order.

Replay rules:

- no network calls,
- no random values,
- no current-time reads,
- no email, notification, or analytics side effects,
- no re-evaluation using current policies,
- no rewriting of original events,
- no skipping unknown events silently.

Pseudo-flow:

```text
load compatible snapshot if available
load events after snapshot version
verify ordering and hashes
upcast event schemas deterministically
apply events sequentially
verify final aggregate version
return reconstructed state
```

## 12. Replay Modes

Supported modes:

### 12.1 Aggregate Replay

Reconstruct one learning path for runtime recovery or verification.

### 12.2 Projection Replay

Feed historical events into projection rebuilders without mutating aggregate authority.

### 12.3 Audit Replay

Reconstruct historical state at a specified aggregate version or timestamp boundary.

### 12.4 Shadow Replay

Run a candidate reader or policy interpreter against historical data without changing production state.

### 12.5 Migration Replay

Read historical events through approved upcasters to produce compatible new snapshots or derived stores.

## 13. Event Ordering

Aggregate event ordering is authoritative by aggregate version, not wall-clock timestamp.

Requirements:

- aggregate versions are contiguous,
- duplicate versions are invalid,
- gaps are integrity failures,
- event timestamps may be equal,
- recorded-at may differ from occurred-at,
- cross-stream global ordering must not be inferred without a dedicated global offset.

## 14. Outbox

All downstream signals caused by a learning-path commit MUST be written to an outbox within the same transaction.

Typical signals:

- path activated,
- next node authorized,
- path blocked,
- replan requested,
- path superseded,
- path completed,
- projection rebuild requested.

Outbox publication is at-least-once. Consumers MUST deduplicate.

## 15. Inbox

When consuming external runtime events, the Learning Path Runtime MUST store inbox deduplication state.

Examples:

- mastery decision updated,
- session outcome committed,
- evidence withdrawn,
- curriculum version retired,
- content item unavailable.

The same external event MUST NOT mutate a path twice.

## 16. Ambiguous Outcome Recovery

A transport timeout after command submission does not prove failure.

Recovery procedure:

1. query command result by `commandId`,
2. if committed, return persisted result,
3. if definitely absent, retry safely,
4. if storage outcome is ambiguous, block further conflicting commands until resolved,
5. record a recovery event when operator intervention changes runtime state.

## 17. Crash Recovery

After process restart:

- load durable aggregate state or replay it,
- restore execution cursor only from committed state,
- never resume an uncommitted node transition,
- inspect incomplete outbox records,
- inspect stale command leases if leases are used,
- reconcile external session outcomes by stable IDs,
- emit no duplicate authority transition.

## 18. Partial External Work

External work may finish before the local path transaction is committed, or vice versa.

The runtime MUST model external coordination explicitly using states such as:

- `REQUESTED`
- `ACKNOWLEDGED`
- `COMPLETED_EXTERNAL`
- `COMMITTED_LOCAL`
- `RECONCILIATION_REQUIRED`

Never infer local path completion solely from an external success callback.

## 19. Persistence Tables / Stores

A reference relational layout may include:

- `learning_path_aggregates`
- `learning_path_events`
- `learning_path_snapshots`
- `learning_path_command_results`
- `learning_path_outbox`
- `learning_path_inbox`
- `learning_path_integrity_checks`
- `learning_path_migration_checkpoints`

Every table MUST include tenant isolation fields and suitable unique constraints.

Representative uniqueness:

```text
UNIQUE (tenant_id, path_id)
UNIQUE (tenant_id, path_id, aggregate_version)
UNIQUE (tenant_id, command_id)
UNIQUE (tenant_id, inbox_source, external_event_id)
```

## 20. Tenant Isolation

Tenant scope MUST be present in every storage key, query predicate, uniqueness rule, foreign key strategy, cache key, snapshot key, and replay request.

A path ID alone is never sufficient storage authority.

Cross-tenant replay, projection rebuild, or event publication is forbidden.

## 21. Integrity

Integrity verification SHOULD include:

- event payload hash,
- previous-event hash chain,
- snapshot source hash,
- contiguous aggregate versions,
- command/result hash consistency,
- tenant/path identity consistency,
- immutable event columns,
- known event schema versions.

An integrity failure MUST produce a non-authoritative recovery state rather than silently continuing.

## 22. Data Retention

Retention policy MUST distinguish:

- authoritative events,
- snapshots,
- projections,
- transient logs,
- sensitive evidence references,
- command deduplication records.

Authoritative event deletion requires an explicit legal and governance process. Projection data may be rebuilt and can follow shorter retention where appropriate.

## 23. Privacy and Redaction

Events SHOULD store stable references instead of unnecessary sensitive payload copies.

Redaction must not destroy the ability to verify historical authority. Where legal deletion is required, use governed tombstones, cryptographic erasure, or detached protected stores according to policy.

## 24. Backups and Restore

A valid backup strategy MUST preserve a transactionally consistent set of:

- aggregate rows,
- event streams,
- command results,
- outbox state,
- snapshots,
- schema/version metadata.

Restore verification MUST include deterministic replay and aggregate-to-event reconciliation.

## 25. Reconciliation Jobs

Periodic reconciliation SHOULD detect:

- aggregate/event version mismatch,
- unpublished outbox records,
- orphaned snapshots,
- duplicate command results,
- missing evidence references,
- stale externally completed operations,
- projection lag beyond policy,
- integrity hash failures.

Reconciliation may report or repair only according to explicit policy. It must not invent educational decisions.

## 26. Failure Codes

Recommended failure codes:

- `PATH_NOT_FOUND`
- `VERSION_CONFLICT`
- `IDEMPOTENCY_CONFLICT`
- `EVENT_STREAM_GAP`
- `EVENT_INTEGRITY_FAILURE`
- `SNAPSHOT_INCOMPATIBLE`
- `REPLAY_FAILED`
- `TENANT_SCOPE_VIOLATION`
- `COMMAND_OUTCOME_AMBIGUOUS`
- `EXTERNAL_RECONCILIATION_REQUIRED`
- `PERSISTENCE_UNAVAILABLE`
- `MIGRATION_REQUIRED`

## 27. Observability

Metrics SHOULD include:

- commit latency,
- version-conflict rate,
- duplicate-command rate,
- replay duration,
- replay failure rate,
- snapshot hit rate,
- outbox publication lag,
- inbox duplicate rate,
- ambiguous-outcome count,
- reconciliation backlog,
- integrity failure count.

Logs MUST include tenant-safe correlation fields without exposing sensitive learner data unnecessarily.

## 28. Verification Requirements

Persistence and replay verification MUST include:

- atomic rollback test,
- optimistic concurrency race test,
- repeated command test,
- idempotency payload mismatch test,
- crash after commit before response,
- crash before commit,
- outbox retry test,
- inbox duplicate test,
- replay from zero,
- replay from snapshot,
- corrupted snapshot fallback,
- event gap detection,
- tenant isolation test,
- historical-version replay test,
- restore reconciliation test.

## 29. Non-Goals

This runtime does not:

- select the best learning activity,
- judge mastery,
- render dashboards,
- reinterpret historical decisions using current policy,
- guarantee exactly-once delivery across distributed systems,
- treat snapshots as independent historical truth.

## 30. Runtime Guarantees

When implemented correctly, the runtime guarantees:

- committed path authority survives process failure,
- retries do not duplicate transitions,
- concurrent writers cannot silently overwrite each other,
- historical path state can be reconstructed,
- downstream consumers receive durable at-least-once signals,
- tenant boundaries remain enforced,
- recovery begins from persisted authority,
- policy and decision lineage remain explainable.

## 31. Final Doctrine

```text
Event history is historical authority.
Aggregate state is operational authority.
Snapshots accelerate reconstruction.
Replay reconstructs; it does not re-decide.
Recovery starts from committed truth.
```
