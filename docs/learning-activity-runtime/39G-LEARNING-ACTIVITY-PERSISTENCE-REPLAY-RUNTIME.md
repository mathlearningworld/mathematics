# Chapter 39G — Learning Activity Persistence & Replay Runtime

## 1. Purpose

The Learning Activity Persistence & Replay Runtime defines how activity authority becomes durable, recoverable, replayable, and auditable without allowing storage or recovery mechanics to reinterpret learning decisions.

This chapter extends the Learning Activity Runtime established in Chapters 39A–39F. It owns the persistence contracts, event history, snapshots, command idempotency, recovery rules, and deterministic reconstruction needed to preserve activity state across process restarts, partial failures, retries, migrations, and operational incidents.

Its governing rule is:

> Persistence records authority. Replay reconstructs authority. Neither persistence nor replay creates new learning decisions.

## 2. Runtime Boundary

The runtime owns:

- durable aggregate storage for LearningActivity instances
- append-only activity event history
- atomic state and event commit behavior
- optimistic concurrency
- command idempotency
- inbox and outbox durability
- snapshot and checkpoint contracts
- deterministic replay
- crash recovery
- ambiguous outcome recovery
- integrity validation
- tenant-safe persistence
- backup and restore reconciliation

The runtime does not own:

- path planning policy
- activity authorization policy
- adaptive decisions
- mastery evaluation
- evidence interpretation
- learner-facing projection semantics
- curriculum meaning

## 3. Persistence Authority Model

The durable authority model consists of four coordinated records:

1. **Aggregate State** — the current operational state of a LearningActivity.
2. **Event Stream** — the immutable historical record of accepted transitions.
3. **Command Ledger** — the idempotency record for commands that may be retried.
4. **Outbox Record** — the durable publication record for cross-runtime events.

These records must be committed atomically whenever a command changes activity authority.

A successful durable transition therefore means:

```text
validate command
→ verify expected version
→ apply deterministic transition
→ append event(s)
→ update aggregate state
→ record command result
→ enqueue outbox messages
→ commit atomically
```

No partial subset of this transaction may be treated as success.

## 4. LearningActivity Durable Aggregate

A durable LearningActivity record should include at minimum:

```text
activityId
tenantId
learnerId
pathId
pathVersion
activityDefinitionId
activityDefinitionVersion
authorizationId
authorizationVersion
activityType
lifecycleState
attemptNumber
retryPolicyVersion
adaptationLineageId
activeSessionId
aggregateVersion
createdAt
updatedAt
terminalAt
schemaVersion
integrityMetadata
```

Additional runtime fields may exist, but they must not blur ownership boundaries with Learning Path, Session, Evidence, or Mastery runtimes.

## 5. Event Stream Contract

Every authoritative transition emits one or more immutable events.

Representative event types include:

- LearningActivityCreated
- LearningActivityAuthorized
- LearningActivityAuthorizationRevoked
- LearningActivityStarted
- LearningActivitySessionBound
- LearningActivityPaused
- LearningActivityResumed
- LearningActivityCheckpointAccepted
- LearningActivityAttemptCompleted
- LearningActivityCompletionAccepted
- LearningActivityClosed
- LearningActivityCancelled
- LearningActivityAborted
- LearningActivityExpired
- LearningActivityFailed
- LearningActivityRetryScheduled
- LearningActivityAdaptationRequested
- LearningActivitySuperseded
- LearningActivityEvidenceLinked
- LearningActivityRecoveryRecorded

Each event must include:

```text
eventId
aggregateId
aggregateType
tenantId
aggregateVersion
eventType
eventSchemaVersion
occurredAt
recordedAt
commandId
correlationId
causationId
actorId
payload
integrityHash
```

## 6. Append-Only Rule

Accepted events are immutable.

Corrections must be expressed through new events, such as:

- ActivityMetadataCorrected
- EvidenceLinkSuperseded
- ProjectionCorrectionRequested
- ActivityRecordQuarantined

Historical events must never be edited in place to simulate a cleaner history.

## 7. Atomic Commit Invariant

For every state-changing command:

```text
aggregate state + appended events + idempotency result + outbox records
```

must either all commit or all fail.

This prevents:

- state without history
- history without state
- published events without committed state
- committed state without reproducible command result

## 8. Optimistic Concurrency

All state-changing commands must carry or resolve an expected aggregate version.

A transition is accepted only when:

```text
expectedVersion == persistedAggregateVersion
```

On mismatch, the runtime returns a concurrency conflict and performs no mutation.

Blind overwrites are forbidden.

## 9. Command Idempotency

Every externally retryable command must have a stable commandId.

The command ledger stores:

```text
commandId
tenantId
aggregateId
commandType
requestFingerprint
acceptedAggregateVersion
resultPayload
resultStatus
recordedAt
```

If the same commandId is received again:

- identical fingerprint → return the recorded result
- different fingerprint → reject as idempotency conflict

This rule applies to start, pause, resume, complete, close, cancel, retry, adapt, and evidence-link commands.

## 10. Inbox Durability

Cross-runtime messages consumed by Learning Activity Runtime must be recorded before application.

The inbox record contains:

```text
messageId
sourceRuntime
sourceAggregateId
sourceVersion
messageType
receivedAt
processedAt
processingStatus
failureCode
```

Duplicate messages are acknowledged without repeating side effects.

## 11. Outbox Durability

Cross-runtime events must be published from a durable outbox.

The outbox lifecycle is:

```text
PENDING → PUBLISHING → PUBLISHED
                    ↘ FAILED_RETRYABLE
                    ↘ FAILED_TERMINAL
```

Publication retries must not mutate the LearningActivity aggregate.

## 12. Snapshot Model

Snapshots are optimization artifacts, not primary historical authority.

A snapshot should include:

```text
aggregateId
tenantId
aggregateVersion
schemaVersion
snapshotPayload
createdAt
sourceEventPosition
integrityHash
```

Snapshots may be used only when their integrity and compatibility are verified.

If a snapshot is missing, stale, corrupted, or incompatible, replay starts from the event stream.

## 13. Checkpoint Semantics

Activity execution checkpoints and persistence snapshots are different concepts.

- **Execution checkpoint**: learner/session progress within an activity attempt.
- **Persistence snapshot**: optimized representation of aggregate state.

The runtime must not confuse them.

An execution checkpoint may be linked to Session Runtime and Evidence Runtime, while a persistence snapshot belongs solely to storage reconstruction.

## 14. Deterministic Replay

Replay reconstructs aggregate state by applying recorded events in strict aggregate-version order.

Replay must use:

- the event type
- the recorded event payload
- the recorded event schema version
- deterministic upcasters when required
- pure state transition functions

Replay must not call:

- current recommendation policies
- current authorization policies
- current mastery algorithms
- external services
- random generators
- current time

The expected result is:

```text
replay(events[1..N]) == persisted aggregate state at version N
```

## 15. Replay Modes

Supported replay modes:

### 15.1 Full Aggregate Replay

Rebuild one LearningActivity from event version 1.

### 15.2 Snapshot-Assisted Replay

Load a verified snapshot and apply events after its source position.

### 15.3 Tenant Rebuild

Reconstruct all LearningActivity aggregates for one tenant.

### 15.4 Projection Rebuild Feed

Republish authoritative activity events to projection rebuild workers.

### 15.5 Audit Replay

Reconstruct state and produce a comparison report without mutating production authority.

## 16. Replay Safety

Replay is read-only by default.

A replay process may create new projections, audit reports, or migration artifacts, but it must not silently replace production aggregate state.

Any repair write requires:

- explicit repair command
- operator authorization
- recorded reason
- before/after evidence
- compatibility verification
- rollback plan

## 17. Ambiguous Outcome Recovery

An ambiguous outcome occurs when the caller cannot determine whether a command committed.

Examples:

- network timeout after commit
- process crash after database commit
- response lost after outbox creation

Recovery procedure:

1. Query the command ledger by commandId.
2. If found, return the recorded result.
3. If not found, inspect aggregate version and event stream.
4. If no matching transition exists, safely retry with the same commandId.
5. Never infer success only from caller-side timing.

## 18. Crash Recovery

After restart, the runtime must recover from durable truth.

Recovery priorities:

1. reconcile incomplete inbox processing
2. resume outbox publication
3. verify aggregate/event consistency
4. rebuild stale projections when necessary
5. surface quarantined records
6. never re-run business decisions from memory

## 19. Recovery States

Operational recovery state may include:

- HEALTHY
- REPLAY_REQUIRED
- OUTBOX_RECOVERY_REQUIRED
- INBOX_RECOVERY_REQUIRED
- SNAPSHOT_INVALID
- EVENT_GAP_DETECTED
- HASH_MISMATCH
- QUARANTINED
- MANUAL_REPAIR_REQUIRED

These states are operational metadata and must not overwrite the learner-facing activity lifecycle.

## 20. Event Integrity

Event integrity may be protected with:

- payload hash
- previous-event hash
- stream hash
- tenant-scoped signing metadata
- immutable storage controls

Integrity failure must fail closed for authoritative reconstruction.

## 21. Event Gap Detection

For every aggregate stream:

```text
version sequence = 1, 2, 3, ... N
```

Missing, duplicated, or out-of-order versions are integrity failures.

The runtime must not guess the missing transition.

## 22. Tenant Isolation

Every persistence query and mutation must include tenant scope.

An activityId alone is insufficient authority for access.

The minimum durable identity is:

```text
tenantId + activityId
```

Cross-tenant joins, replay, repair, export, and projection rebuild are forbidden unless executed by a separately governed platform operation.

## 23. Encryption and Sensitive Data

Sensitive learner data must be minimized in activity events.

Where sensitive values are unavoidable:

- encrypt at rest
- restrict event payload fields
- use references rather than duplicated personal data
- redact projection rebuild exports
- maintain key rotation compatibility

## 24. Retention

Retention policies must distinguish:

- authoritative activity history
- operational logs
- transient retry metadata
- projections
- diagnostics
- personal data references

Deleting projections does not delete authoritative history.

Any legally required erasure must preserve system integrity through governed tombstones, anonymization, or crypto-shredding rather than silent event deletion.

## 25. Backup and Restore

A valid backup set must preserve:

- aggregate tables
- event streams
- command ledger
- inbox
- outbox
- schema metadata
- snapshot metadata
- integrity metadata

Restore verification must confirm:

```text
aggregate version == highest event version
command result links remain valid
outbox/inbox state is coherent
snapshot source positions exist
integrity hashes pass
```

## 26. Restore Reconciliation

After restore:

1. pause external writes
2. validate event continuity
3. compare aggregate state with replayed state
4. reconcile inbox/outbox
5. rebuild projections
6. resume writes only after verification passes

## 27. Projection Rebuild Contract

Projection rebuild consumes authoritative events.

It may not query learner-facing projections as source authority.

A rebuild worker records:

```text
projectionName
tenantId
sourcePosition
rebuildVersion
startedAt
completedAt
status
```

## 28. Cross-Runtime Persistence Contract

Learning Activity Runtime must preserve stable references to:

- Learning Path identifiers and versions
- Authorization identifiers and versions
- Learning Session identifiers
- Evidence bundle identifiers
- Mastery evaluation request identifiers
- adaptation lineage identifiers

It must not persist foreign runtime state as if locally authoritative.

## 29. Persistence Failure Semantics

Representative failure codes:

- ACTIVITY_NOT_FOUND
- ACTIVITY_VERSION_CONFLICT
- COMMAND_IDEMPOTENCY_CONFLICT
- EVENT_APPEND_FAILED
- AGGREGATE_WRITE_FAILED
- ATOMIC_COMMIT_FAILED
- EVENT_GAP_DETECTED
- EVENT_INTEGRITY_FAILED
- SNAPSHOT_INCOMPATIBLE
- REPLAY_DIVERGENCE
- TENANT_SCOPE_VIOLATION
- OUTBOX_PUBLISH_FAILED
- INBOX_PROCESSING_FAILED
- MANUAL_REPAIR_REQUIRED

Failures must be explicit, typed, and observable.

## 30. Observability

Required signals include:

- aggregate write latency
- event append latency
- version conflict rate
- idempotent replay rate
- outbox age
- inbox retry count
- replay duration
- replay divergence count
- snapshot hit rate
- snapshot invalidation count
- integrity failure count
- quarantined aggregate count

Metrics must not expose sensitive learner data.

## 31. Repair Operations

Permitted repair operations include:

- rebuild aggregate from verified event stream
- rebuild projection
- republish outbox message
- reprocess inbox message
- invalidate snapshot
- quarantine aggregate
- create correction event

Forbidden repair operations include:

- editing historical events
- decreasing aggregate version
- inventing missing events
- changing command results without audit
- treating projections as authoritative recovery sources

## 32. Persistence Verification Scenarios

Minimum scenarios:

1. command commits state, event, command ledger, and outbox atomically
2. duplicate command returns same result
3. duplicate command with different payload fails
4. stale expected version fails without mutation
5. replay reproduces persisted state
6. corrupted snapshot falls back to event replay
7. event gap causes quarantine
8. timeout after commit resolves through command ledger
9. outbox retry does not duplicate aggregate mutation
10. tenant-scoped replay cannot access another tenant
11. restore reconciliation detects divergence
12. projection rebuild uses events, not existing projections

## 33. Core Persistence Invariants

1. Durable authority must be reproducible from accepted events.
2. Aggregate state and appended events commit atomically.
3. Event history is append-only.
4. Command retries are idempotent by stable commandId.
5. Replay never re-decides policy.
6. Projections are never recovery authority.
7. Snapshots are disposable optimization artifacts.
8. Version conflicts fail without mutation.
9. Event gaps fail closed.
10. Tenant scope is mandatory for every persistence operation.
11. Outbox publication cannot create duplicate aggregate transitions.
12. Ambiguous outcomes resolve from durable records, not inference.
13. Repair is explicit, governed, and auditable.
14. Backup restoration must pass replay reconciliation before writes resume.

## 34. Final Boundary

```text
Learning Activity Runtime decides and records activity transitions.
Persistence makes those transitions durable.
Event history preserves how authority changed.
Replay reconstructs the accepted history.
Recovery resumes from committed truth.
None of these mechanisms may invent a new learning decision.
```
