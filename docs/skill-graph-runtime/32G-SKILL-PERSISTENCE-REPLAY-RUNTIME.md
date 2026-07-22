# 32G — Skill Persistence & Replay Runtime

## 1. Purpose

This runtime defines how skill graph authority is durably stored, reconstructed, audited, repaired, and replayed without rewriting historical meaning.

The runtime exists to ensure that:

- graph history is durable,
- graph reconstruction is deterministic,
- projections can be rebuilt,
- historical skill meaning remains inspectable,
- divergence can be detected,
- snapshots accelerate recovery without becoming authority,
- replay never silently changes semantics.

---

## 2. Core Authority Model

The durable authority hierarchy is:

1. append-only skill graph event ledger,
2. verified aggregate state reconstructed from that ledger,
3. optional snapshots used only as replay accelerators,
4. projections used only for query and display.

Runtime law:

> The event ledger is durable authority. Aggregate state and projections are derived state.

A snapshot may reduce replay cost, but it must never replace the authoritative event history.

---

## 3. Persisted Aggregate Families

The persistence boundary must support at least these aggregate families:

- Skill
- SkillVersion
- SkillAlias
- SkillRelationship
- GraphPublication
- PrerequisitePolicy
- SkillEvolutionPlan
- GraphVerificationRecord
- ProjectionCheckpoint

Every aggregate record must include:

```text
aggregateId
aggregateType
tenantId or authorityNamespace
version
createdAt
updatedAt
lastEventId
lastEventSequence
```

Where applicable it must also include:

```text
skillId
skillVersionId
graphVersionId
publicationId
provenanceId
```

---

## 4. Event Envelope

Every durable skill graph event must use a canonical envelope:

```text
eventId
eventType
eventVersion
aggregateId
aggregateType
aggregateVersion
authorityNamespace
graphVersionId
occurredAt
recordedAt
actorId
commandId
correlationId
causationId
policyVersion
schemaVersion
payload
metadata
checksum
```

Required properties:

- `eventId` is globally unique.
- `aggregateVersion` is monotonic per aggregate.
- `occurredAt` captures domain time.
- `recordedAt` captures persistence time.
- `eventVersion` identifies event schema version.
- `checksum` protects payload integrity.
- `commandId` supports idempotency.
- `causationId` preserves causal traceability.

---

## 5. Canonical Event Categories

The ledger may contain events such as:

```text
SkillDefined
SkillVersionCreated
SkillMeaningChanged
SkillLabelUpdated
SkillAliasAdded
SkillAliasRemoved
SkillRelationshipProposed
SkillRelationshipVerified
SkillRelationshipPublished
SkillRelationshipWithdrawn
PrerequisitePolicyDefined
GraphVersionCreated
GraphVersionPublished
GraphVersionActivated
GraphVersionSuperseded
SkillSplitPlanned
SkillSplitCompleted
SkillMergePlanned
SkillMergeCompleted
SkillDeprecated
SkillRetired
ProjectionCheckpointRecorded
VerificationRecorded
ReplayCompleted
ReplayDivergenceDetected
```

The exact event set may evolve, but unknown events must never be silently discarded.

---

## 6. Optimistic Concurrency

All authoritative writes must include an expected aggregate version.

Write outcomes:

```text
WRITTEN
IDEMPOTENT_REPLAY
VERSION_CONFLICT
DUPLICATE_COMMAND
INVALID_EVENT_SEQUENCE
PERSISTENCE_FAILURE
```

Rules:

- no last-write-wins mutation,
- no blind overwrite,
- no version skipping,
- no duplicate command producing a second semantic mutation,
- no publication event committed against stale graph state.

---

## 7. Atomicity

When a command changes authoritative graph state, the following must be atomic:

1. event append,
2. aggregate version advancement,
3. outbox record creation,
4. idempotency record creation.

Runtime law:

> State change and integration publication intent must commit together.

A committed graph mutation without its outbox record is invalid.

---

## 8. Outbox Runtime

The runtime must persist integration messages through an outbox table or equivalent durable mechanism.

Outbox record:

```text
outboxId
eventId
eventType
aggregateId
graphVersionId
payload
createdAt
publishedAt
attemptCount
lastError
status
```

Statuses:

```text
PENDING
PUBLISHING
PUBLISHED
FAILED_RETRYABLE
FAILED_TERMINAL
```

Publishing may be retried, but event application must remain idempotent.

---

## 9. Snapshot Runtime

Snapshots may be created for:

- a single skill aggregate,
- a relationship aggregate,
- a full graph version,
- a publication boundary,
- a projection checkpoint.

Snapshot envelope:

```text
snapshotId
aggregateId or graphVersionId
snapshotVersion
lastEventId
lastEventSequence
createdAt
schemaVersion
state
checksum
```

Rules:

- snapshots are immutable,
- snapshots are replaceable accelerators,
- snapshots never delete source events,
- snapshot checksum failure forces replay from an earlier trusted boundary,
- snapshot schema migration must be explicit.

---

## 10. Replay Modes

The runtime supports:

```text
AGGREGATE_REPLAY
GRAPH_VERSION_REPLAY
PROJECTION_REBUILD
POINT_IN_TIME_REPLAY
POLICY_BOUND_REPLAY
SHADOW_REPLAY
INCIDENT_REPLAY
MIGRATION_REPLAY
```

### Aggregate Replay

Reconstructs one aggregate from its events.

### Graph Version Replay

Reconstructs all nodes, edges, policies, and publication state for one graph version.

### Projection Rebuild

Recreates derived read models from verified authority.

### Point-in-Time Replay

Reconstructs graph state as of an event sequence or domain timestamp.

### Policy-Bound Replay

Replays using the policy versions originally recorded by events.

### Shadow Replay

Reconstructs state into an isolated target for comparison before replacement.

### Incident Replay

Replays a bounded event interval for diagnosis and recovery.

### Migration Replay

Reconstructs effects of a skill evolution or migration plan without rewriting source history.

---

## 11. Determinism Requirements

Replay must be deterministic for the same:

- ordered event stream,
- event schemas,
- policy versions,
- interpretation rules,
- projection code version where projection parity is being verified.

Replay output must expose:

```text
inputEventCount
firstEventId
lastEventId
resultingVersion
resultChecksum
policyVersions
schemaVersions
warnings
divergenceStatus
```

Replay must not use current wall-clock time as hidden decision input.

---

## 12. Unknown Event Handling

Unknown event outcomes:

```text
BLOCKED_UNKNOWN_EVENT
QUARANTINED_UNKNOWN_EVENT
SUPPORTED_BY_UPCASTER
SUPPORTED_BY_COMPATIBILITY_READER
```

Rules:

- authoritative replay must block on unknown semantic events,
- projection replay may continue only if the event is explicitly declared irrelevant to that projection,
- no unknown event is ignored by default,
- event upcasters must preserve original meaning.

---

## 13. Event Upcasting

Event upcasting may adapt older event schemas to current readers.

An upcaster must:

- be deterministic,
- preserve semantic meaning,
- record source event version,
- avoid inserting facts not present in historical data,
- remain independently testable.

Upcasting must never convert an approximate dependency into a verified prerequisite.

---

## 14. Historical Inspection

The runtime must support historical questions such as:

- What did this skill mean on a given date?
- Which graph version was active?
- Which prerequisite edges were authoritative?
- Which curriculum mappings referenced this skill version?
- Which policy version produced a readiness decision?
- When was a relationship withdrawn?
- Which evolution plan superseded this identity?

Historical inspection must resolve explicit versions and must not silently float to latest.

---

## 15. Replay Divergence

Divergence types:

```text
AGGREGATE_STATE_DIVERGENCE
GRAPH_TOPOLOGY_DIVERGENCE
EDGE_SEMANTIC_DIVERGENCE
PROJECTION_DIVERGENCE
CHECKSUM_DIVERGENCE
POLICY_VERSION_DIVERGENCE
SCHEMA_INTERPRETATION_DIVERGENCE
```

Divergence record:

```text
divergenceId
replayRunId
divergenceType
aggregateId or graphVersionId
expectedChecksum
actualChecksum
firstDifferingEventId
severity
detectedAt
status
resolutionNote
```

Rules:

- unexplained divergence blocks authoritative replacement,
- projection divergence may trigger rebuild,
- authority divergence requires investigation,
- divergence evidence must remain durable.

---

## 16. Recovery Workflow

Recommended recovery sequence:

```text
Detect
Freeze affected write scope
Capture event boundary
Run shadow replay
Compare checksums
Classify divergence
Repair reader or data through explicit event
Verify reconstruction
Resume writes
Record incident evidence
```

Recovery must never mutate historical events directly.

---

## 17. Retention and Archival

Historical events carrying authoritative meaning must not be deleted merely because they are old.

Archival may change storage tier, but must preserve:

- ordering,
- checksums,
- event identity,
- schema version,
- replay accessibility,
- provenance.

A projection may be discarded and rebuilt. The event ledger may not.

---

## 18. Security and Isolation

Persistence must enforce:

- namespace isolation,
- tenant isolation where applicable,
- actor traceability,
- immutable audit metadata,
- protected publication writes,
- restricted replay privileges,
- redaction only for non-semantic private metadata.

Security redaction must not destroy mathematical meaning or graph provenance.

---

## 19. Cross-Engine Replay Boundaries

Skill Graph replay may reconstruct graph authority, but it must not independently rewrite:

- learner mastery evidence,
- assessment results,
- curriculum authority,
- recommendation decisions,
- mission completion history,
- progress history.

Downstream engines may rebuild their own projections from stable graph identities and events.

---

## 20. Verification Gates

Persistence and replay are acceptable only when automated checks prove:

- monotonic aggregate versions,
- duplicate command idempotency,
- deterministic replay,
- snapshot equivalence,
- outbox atomicity,
- unknown-event blocking,
- checksum validation,
- point-in-time resolution,
- graph topology parity,
- projection rebuild parity.

---

## 21. Failure Codes

```text
SKILL_EVENT_VERSION_CONFLICT
SKILL_EVENT_DUPLICATE_COMMAND
SKILL_EVENT_SEQUENCE_INVALID
SKILL_EVENT_UNKNOWN_TYPE
SKILL_EVENT_CHECKSUM_INVALID
SKILL_SNAPSHOT_INVALID
SKILL_REPLAY_DIVERGENCE
SKILL_REPLAY_POLICY_MISSING
SKILL_REPLAY_SCHEMA_UNSUPPORTED
SKILL_OUTBOX_ATOMICITY_FAILED
SKILL_PERSISTENCE_UNAVAILABLE
SKILL_GRAPH_RECONSTRUCTION_FAILED
```

---

## 22. Runtime Invariants

1. Historical graph meaning is never rewritten in place.
2. The event ledger remains the durable authority.
3. Snapshots never replace source events.
4. Unknown semantic events are never silently ignored.
5. Replay uses recorded policy and schema context.
6. Authoritative writes use optimistic concurrency.
7. State change and outbox publication intent are atomic.
8. Duplicate commands are idempotent.
9. Unexplained divergence blocks authority replacement.
10. Projection rebuild cannot manufacture new graph authority.
11. Historical version resolution never silently floats.
12. Replay cannot create learner mastery evidence.

---

## 23. Completion Criteria

32G is complete when the implementation can demonstrate:

- durable event storage,
- version-safe writes,
- idempotent commands,
- deterministic aggregate replay,
- full graph reconstruction,
- projection rebuild,
- point-in-time inspection,
- unknown event safety,
- divergence detection,
- snapshot parity,
- atomic outbox behavior,
- durable recovery evidence.
