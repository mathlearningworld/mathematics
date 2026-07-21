# Chapter 28H — Mission Persistence & Replay

## Status

Architecture specification for durable Mission records, historical reconstruction, replay, supersession, and auditability.

---

## 1. Purpose

Mission Persistence & Replay answers:

> How can the system preserve every authoritative Mission decision, reconstruct Mission history, reproduce prior outcomes, diagnose divergence, and recover projections without rewriting the past?

The Mission Engine is a long-lived operational authority. Its history must be durable, attributable, versioned, replayable, and safe under concurrency.

---

## 2. Core Doctrine

```text
Mission history is append-only.
Mission state is reconstructed from durable facts.
Historical replay is not reassessment.
Supersession never erases prior truth.
```

No consumer may mutate old Mission history to make a later decision appear as if it had always been true.

---

## 3. Persistence Authority

Persistence owns durable storage mechanics, transaction integrity, concurrency checks, idempotency records, event publication boundaries, snapshots, and replay inputs.

Persistence does not own:

- Mission business policy;
- lifecycle transition meaning;
- progress interpretation;
- completion policy;
- mastery claims;
- Recommendation truth;
- human approval authority.

---

## 4. Aggregate Boundary

The Mission aggregate is the consistency boundary for:

- lifecycle state;
- active Mission version;
- objective configuration;
- current progress summary;
- blockers and holds;
- activation status;
- completion eligibility and decision;
- expiration and supersession state;
- command idempotency;
- optimistic concurrency.

Large evidence payloads may be stored separately, but references and integrity hashes must remain inside the durable Mission history.

---

## 5. Durable Record Model

Required record families include:

```text
MissionRecord
MissionSourceRecord
MissionCandidateRecord
MissionProposalRecord
MissionApprovalRecord
MissionActivationRecord
MissionLifecycleTransitionRecord
MissionObjectiveRecord
MissionProgressEventRecord
MissionProgressSnapshotRecord
MissionMilestoneRecord
MissionBlockerRecord
MissionHoldRecord
MissionCompletionRequestRecord
MissionCompletionDecisionRecord
MissionEvidenceHandoffRecord
MissionRewardEligibilityRecord
MissionSupersessionRecord
MissionExpirationRecord
MissionConsumptionRecord
MissionProjectionCheckpointRecord
MissionVerificationRecord
MissionReplayRecord
MissionIdempotencyRecord
MissionOutboxRecord
MissionAuditRecord
```

Each family must have an explicit owner and retention policy.

---

## 6. Mission Record Identity

Every durable Mission root includes:

```text
missionId
tenantId
learnerId
missionType
missionVersion
createdAt
createdBy
currentLifecycleState
policyVersion
sourceSetId
```

Mission identity is immutable.

Tenant and learner scope are immutable after creation.

Changing the learner or tenant requires a new Mission, not an update.

---

## 7. Event Identity

Every Mission event includes:

```text
eventId
missionId
missionVersion
tenantId
learnerId
eventType
occurredAt
recordedAt
actorId
actorType
commandId
correlationId
causationId
policyVersion
payloadVersion
```

`occurredAt` and `recordedAt` must remain distinct.

---

## 8. Time Model

Mission persistence distinguishes:

```text
Source Time
Decision Time
Effective Time
Recorded Time
Publication Time
```

Examples:

- a learner performed an activity offline at Source Time;
- the server accepted it later at Recorded Time;
- a completion decision was made at Decision Time;
- a Mission expiration became effective at Effective Time;
- an event reached consumers at Publication Time.

Arrival order must never be treated as semantic order without policy validation.

---

## 9. Append-only History

Authoritative events are never edited or deleted during normal operation.

Corrections are represented by new records such as:

```text
MissionProgressCompensated
MissionTransitionReversedByAuthority
MissionCompletionDecisionSuperseded
MissionEvidenceReferenceCorrected
```

The correcting record must point to the record being corrected and explain the reason and actor authority.

---

## 10. Current State Materialization

Current Mission state may be materialized for efficient reads.

Materialized state must include:

- aggregate version;
- last applied event version;
- source watermark;
- lifecycle state;
- progress summary;
- blocker summary;
- completion state;
- supersession state;
- updated timestamp.

Materialized state is derived but may be transactionally maintained with the event append.

If materialized state and event history disagree, event history plus verified policy is authoritative.

---

## 11. Snapshots

Snapshots reduce replay cost.

A snapshot includes:

```text
snapshotId
missionId
missionVersion
lastEventSequence
aggregateState
schemaVersion
policyReferences
integrityHash
createdAt
```

Snapshots are acceleration artifacts, not independent truth.

A corrupt or missing snapshot must be discardable and rebuildable from durable history.

---

## 12. Optimistic Concurrency

Every authoritative command carries:

```text
expectedMissionVersion
```

Persistence must atomically verify that the stored version matches.

On mismatch:

```text
MISSION_VERSION_CONFLICT
```

No last-write-wins policy is allowed for lifecycle, activation, progress allocation, completion, cancellation, or supersession.

---

## 13. Idempotency

Commands that can be retried must carry an idempotency key.

Recommended scope:

```text
tenantId + missionId + commandType + idempotencyKey
```

Persistence stores:

- command fingerprint;
- first result;
- resulting Mission version;
- completion status;
- recorded timestamp.

Same key with same fingerprint returns the original result.

Same key with different fingerprint returns:

```text
IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_COMMAND
```

---

## 14. Transaction Boundary

An authoritative Mission write should atomically include:

```text
Aggregate version check
State transition or progress mutation
Append-only event
Idempotency record
Audit record
Outbox record
Materialized state update
```

External publication occurs only after durable commit.

---

## 15. Outbox Pattern

Mission events are published through a durable outbox.

Required properties:

- event written in same transaction as Mission change;
- publication retry is idempotent;
- event identity remains stable across retries;
- publication ordering is preserved per Mission;
- consumers can detect duplicates;
- poison events are quarantined, not dropped.

---

## 16. Supersession

A Mission may be superseded by a newer Mission or policy decision.

Supersession requires:

```text
supersessionId
supersededMissionId
replacementMissionId?
reasonCode
actorId
policyVersion
effectiveAt
recordedAt
```

Supersession does not delete the old Mission.

Historical views must still show what was known and decided at the time.

---

## 17. Expiration

Expiration must be represented as a durable transition or effective policy event.

A clock check alone must not silently hide an active Mission without durable acknowledgement.

Expiration processing must be idempotent and version-aware.

---

## 18. Evidence Persistence Boundary

Mission Engine stores evidence references and handoff metadata, including:

```text
evidenceEnvelopeId
sourceActivityIds
integrityHash
capturedAt
submittedAt
assessmentHandoffStatus
```

Mission Engine does not store a fabricated mastery conclusion.

Assessment owns interpretation.

---

## 19. Replay Types

Supported replay modes:

```text
HISTORICAL_REPLAY
CURRENT_POLICY_SIMULATION
DIAGNOSTIC_REPLAY
PROJECTION_REPLAY
RECOVERY_REPLAY
```

### Historical Replay

Uses the historical event stream, historical policy versions, historical clocks, and historical authority records.

Goal: reconstruct what the Mission Engine decided then.

### Current Policy Simulation

Uses preserved historical inputs with current policy.

Goal: compare how the current system would decide.

It must be labeled simulation and must not replace historical truth.

### Diagnostic Replay

Adds instrumentation and trace output without changing the historical result.

### Projection Replay

Rebuilds audience projections from durable Mission truth.

### Recovery Replay

Reconstructs current materialized state after loss or corruption.

---

## 20. Replay Inputs

Replay requires immutable access to:

- ordered Mission events;
- event schema versions;
- Mission policy versions;
- authorization decisions where relevant;
- time sources or recorded effective times;
- source snapshots;
- objective definitions;
- completion policy;
- projection policy for projection replay;
- external reference snapshots or immutable identifiers.

A replay that lacks required historical policy must return `UNREPLAYABLE`, not guess.

---

## 21. Replay Outcomes

```text
MATCH
MATCH_WITH_NON_SEMANTIC_DIFFERENCE
DIVERGED
UNREPLAYABLE
FAILED
```

A replay result includes:

```text
replayId
missionId
replayType
sourceVersionRange
policyVersions
outcome
firstDivergencePoint?
semanticDifferences
nonSemanticDifferences
missingInputs
startedAt
completedAt
```

---

## 22. Deterministic Replay

Historical replay must control:

- event order;
- policy version;
- clock values;
- random seeds if any;
- locale-independent business rules;
- stable tie-breaks;
- decimal and rounding rules;
- external capability snapshots.

Non-deterministic dependencies must be captured as inputs or removed from authoritative decision paths.

---

## 23. Replay Divergence

Divergence is evidence and must be preserved.

The system must:

- identify the first divergent transition;
- show expected and actual semantic states;
- identify policy, schema, or data differences;
- avoid overwriting historical records;
- quarantine unsafe reconstructed state;
- create a repair workflow where required.

```text
Replay divergence is recorded, never hidden.
```

---

## 24. Schema Evolution

Event and snapshot schemas are versioned.

Evolution rules:

- old events remain readable;
- upcasters are pure and deterministic;
- upcasters do not invent business facts;
- semantic migrations are explicit events, not silent transforms;
- snapshot rebuild is supported;
- replay tests cover every supported schema version.

---

## 25. Retention

Retention policy must distinguish:

- authoritative Mission events;
- personally identifiable presentation data;
- large evidence payloads;
- projections;
- transient debug traces;
- replay outputs;
- audit records.

Deletion or anonymization required by policy must preserve the integrity of operational history through safe pseudonymization or tombstone records where legally permitted.

---

## 26. Backup and Recovery

Recovery objectives must define:

```text
RPO
RTO
Snapshot frequency
Event backup frequency
Outbox recovery
Projection rebuild order
Integrity verification
```

Recovery sequence:

```text
Restore durable event store
Verify integrity hashes
Restore or rebuild snapshots
Reconstruct materialized Mission state
Resume outbox publication
Rebuild projections
Run divergence and invariant checks
```

---

## 27. Integrity Hashes

Critical payloads may include cryptographic hashes for:

- event payload;
- evidence envelope;
- snapshot;
- policy bundle;
- replay input set.

Hash mismatch must trigger quarantine or hold, never silent acceptance.

---

## 28. Failure Model

Typed failures include:

```text
MISSION_NOT_FOUND
MISSION_VERSION_CONFLICT
DUPLICATE_EVENT_ID
EVENT_SEQUENCE_GAP
IDEMPOTENCY_CONFLICT
SNAPSHOT_CORRUPT
EVENT_PAYLOAD_CORRUPT
OUTBOX_WRITE_FAILED
REPLAY_INPUT_MISSING
HISTORICAL_POLICY_MISSING
REPLAY_DIVERGED
UNSUPPORTED_SCHEMA_VERSION
CROSS_TENANT_RECORD
CROSS_LEARNER_RECORD
```

---

## 29. Minimum Persistence Invariants

1. Mission history is append-only.
2. Tenant and learner identity never change.
3. Mission versions increase monotonically.
4. Every authoritative mutation has an event and audit record.
5. Every external event is published after durable commit.
6. Retry cannot duplicate semantic effects.
7. Last-write-wins is prohibited.
8. Snapshots are rebuildable.
9. Supersession never erases history.
10. Historical replay never becomes reassessment.
11. Replay divergence is preserved.
12. Missing historical policy produces `UNREPLAYABLE`.

---

## 30. Verification Scenarios

Automated tests must cover:

- aggregate write with expected version;
- concurrent lifecycle commands;
- duplicate command retry;
- idempotency key conflict;
- atomic event, state, audit, and outbox write;
- outbox retry;
- snapshot rebuild;
- corrupt snapshot fallback;
- supersession history;
- delayed offline progress event;
- historical replay match;
- current policy simulation divergence;
- missing historical policy;
- schema upcasting;
- event sequence gap;
- cross-tenant record rejection;
- disaster recovery reconstruction.

---

## 31. Exit Criteria

28H is complete when:

- durable record families are defined;
- append-only history is enforced;
- optimistic concurrency and idempotency are explicit;
- transaction and outbox boundaries are defined;
- snapshot and recovery rules are defined;
- replay modes and outcomes are explicit;
- divergence cannot rewrite history;
- automated tests can reconstruct Mission truth deterministically.

---

## 32. Final Principle

```text
The Mission Engine may change what happens next.
It must never rewrite what happened before.
```
