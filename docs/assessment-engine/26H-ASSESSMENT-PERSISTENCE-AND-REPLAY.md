# 26H — Assessment Persistence & Replay

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26H
- State: PERSISTENCE AND REPLAY DEFINED
- Depends on: 26A–26G

---

## 1. Purpose

Assessment Persistence & Replay provides the durable history required to explain, reproduce, audit, recover, and compare assessment decisions over time.

The runtime persists facts about assessment execution. It does not treat the latest projection, score, or dashboard as the source of truth.

The durable model must preserve:

- which evidence set was evaluated,
- which model and policy versions were used,
- which claims were produced,
- which claims were superseded,
- which limitations and contradictions were present,
- which projection versions were generated,
- whether replay reproduces the historical result.

---

## 2. Runtime Position

```text
Assessment Commands
+ Frozen Evidence Sets
+ Versioned Models and Policies
        ↓
Assessment Runtime
        ↓
Assessment Event Ledger
        ↓
Assessment Snapshots
        ↓
Replay / Recovery / Audit / Historical Comparison
```

---

## 3. Core Principle

> Assessment history is append-only; current truth is a versioned projection of durable events.

A previously valid claim may later be superseded, but it must not be silently rewritten or deleted from history.

---

## 4. Persistence Authority

The persistence boundary owns:

- durable append of assessment events,
- optimistic concurrency,
- aggregate version assignment,
- idempotent command handling records,
- snapshot storage,
- replay input retrieval,
- integrity metadata,
- retention and archival markers,
- audit-query support.

It does not own:

- evidence interpretation,
- assessment policy,
- claim classification,
- projection wording,
- recommendation ranking,
- learning-state mutation.

---

## 5. Durable Aggregate Families

```text
AssessmentCase
AssessmentEvidenceSet
AssessmentClaimSet
ReadinessEvaluation
MisconceptionAssessment
AdaptiveAssessmentSession
AssessmentProjection
AssessmentReplayRun
```

Each aggregate has an independent identity and version stream. Cross-aggregate references use immutable IDs and versions.

---

## 6. Assessment Event Envelope

```ts
export interface AssessmentEventEnvelope<TPayload> {
  eventId: string;
  eventType: AssessmentEventType;
  schemaVersion: string;
  tenantId: string;
  learnerId: string;
  aggregateType: AssessmentAggregateType;
  aggregateId: string;
  aggregateVersion: number;
  correlationId: string;
  causationId?: string;
  commandId?: string;
  actorType: 'SYSTEM' | 'LEARNER' | 'PARENT' | 'TEACHER' | 'MENTOR' | 'REVIEWER';
  actorId?: string;
  occurredAt: string;
  recordedAt: string;
  modelVersion?: string;
  policyVersion?: string;
  evidenceSetRef?: VersionedReference;
  integrity: AssessmentEventIntegrity;
  payload: TPayload;
}
```

Integrity metadata:

```ts
export interface AssessmentEventIntegrity {
  payloadHash: string;
  previousEventHash?: string;
  sourceSystem: string;
  writerVersion: string;
}
```

---

## 7. Event Types

```text
ASSESSMENT_CASE_OPENED
ASSESSMENT_SCOPE_RESOLVED
ASSESSMENT_EVIDENCE_SET_FROZEN
ASSESSMENT_EVALUATION_REQUESTED
ASSESSMENT_EVALUATION_STARTED
ASSESSMENT_DIMENSION_EVALUATED
ASSESSMENT_CLAIM_CREATED
ASSESSMENT_CLAIM_SUPERSEDED
ASSESSMENT_CLAIM_WITHDRAWN
READINESS_EVALUATED
READINESS_CLAIM_CREATED
MISCONCEPTION_HYPOTHESIS_CREATED
MISCONCEPTION_CLAIM_CREATED
MISCONCEPTION_CLAIM_UPDATED
MISCONCEPTION_CLAIM_RESOLVED
ADAPTIVE_ASSESSMENT_STARTED
ADAPTIVE_OPPORTUNITY_SELECTED
ADAPTIVE_ASSESSMENT_DEFERRED
ADAPTIVE_ASSESSMENT_STOPPED
ASSESSMENT_PROJECTION_GENERATED
ASSESSMENT_HUMAN_REVIEW_RECORDED
ASSESSMENT_CASE_CLOSED
ASSESSMENT_REPLAY_REQUESTED
ASSESSMENT_REPLAY_COMPLETED
ASSESSMENT_REPLAY_DIVERGED
```

Events record authoritative transitions, not every UI interaction.

---

## 8. Event Payload Rules

Every event payload must be:

- deterministic to serialize,
- schema-versioned,
- free of mutable embedded objects,
- scoped to one aggregate transition,
- explicit about referenced versions,
- safe for long-term interpretation.

Events must not embed unrestricted copies of raw learner data when references and governed evidence storage are sufficient.

---

## 9. Optimistic Concurrency

All aggregate writes require an expected version.

```ts
export interface AppendAssessmentEventsCommand {
  aggregateType: AssessmentAggregateType;
  aggregateId: string;
  expectedVersion: number;
  events: AssessmentEventEnvelope<unknown>[];
  commandId: string;
  correlationId: string;
}
```

Possible outcomes:

```text
WRITTEN
IDEMPOTENT_REPLAY
VERSION_CONFLICT
AGGREGATE_NOT_FOUND
INTEGRITY_FAILURE
WRITE_REJECTED
```

No last-write-wins behavior is permitted for assessment claims.

---

## 10. Idempotency

A repeated command with the same command ID and equivalent payload must not create duplicate events.

Rules:

- command IDs are unique within the tenant boundary,
- a command result is durably recorded,
- same ID plus different payload is rejected,
- retries return the original durable result,
- adaptive opportunity selection records its decision before delivery when operationally possible.

Failure code:

```text
ASSESSMENT_COMMAND_ID_REUSED_WITH_DIFFERENT_PAYLOAD
```

---

## 11. Snapshot Model

```ts
export interface AssessmentSnapshot<TState> {
  snapshotId: string;
  tenantId: string;
  learnerId: string;
  aggregateType: AssessmentAggregateType;
  aggregateId: string;
  aggregateVersion: number;
  snapshotSchemaVersion: string;
  reducerVersion: string;
  lastEventId: string;
  stateHash: string;
  createdAt: string;
  state: TState;
}
```

Snapshots are performance aids, not independent truth.

A snapshot is valid only when:

- its aggregate version exists in the ledger,
- its last event matches the event stream,
- its state hash is valid,
- its reducer version is supported,
- replay from the previous trusted checkpoint reaches the same state.

---

## 12. Snapshot Policy

Snapshots may be created:

- every configured number of events,
- after expensive model evaluation,
- at assessment case closure,
- before archival,
- after a verified migration,
- after human review when policy requires a stable checkpoint.

Snapshots must never truncate required history.

---

## 13. Replay Modes

```text
STATE_REBUILD
CLAIM_REPRODUCTION
FULL_CASE_REPLAY
POLICY_COMPARISON
MODEL_COMPARISON
MIGRATION_VERIFICATION
INCIDENT_RECOVERY
AUDIT_REPLAY
```

### State Rebuild

Reconstructs current aggregate state from durable events.

### Claim Reproduction

Replays the historical evidence set using the historical model and policy versions to verify the original claim.

### Policy Comparison

Evaluates the same frozen evidence under a newer policy without replacing the historical result.

### Model Comparison

Runs a candidate model against historical evidence for validation and impact analysis.

---

## 14. Replay Request

```ts
export interface AssessmentReplayRequest {
  replayId: string;
  mode: AssessmentReplayMode;
  tenantId: string;
  learnerId: string;
  aggregateRefs: VersionedReference[];
  fromVersion?: number;
  toVersion?: number;
  historicalModelVersion?: string;
  historicalPolicyVersion?: string;
  comparisonModelVersion?: string;
  comparisonPolicyVersion?: string;
  requestedBy: string;
  purpose: string;
  requestedAt: string;
}
```

---

## 15. Deterministic Replay Boundary

Replay must isolate nondeterministic dependencies.

Forbidden during historical reproduction:

- current wall-clock time as evaluation input,
- unversioned policy lookup,
- unversioned model lookup,
- live recommendation state,
- random selection without a recorded seed,
- current learner profile replacing historical context,
- external service output without a persisted response or versioned fixture.

Required inputs include:

```text
Frozen Evidence Set Version
Model Version
Policy Version
Reducer Version
Explanation Schema Version
Recorded Clock Values
Recorded Random Seed when applicable
Relevant Historical Context References
```

---

## 16. Replay Result

```ts
export interface AssessmentReplayResult {
  replayId: string;
  mode: AssessmentReplayMode;
  status: 'MATCHED' | 'MATCHED_WITH_MIGRATION' | 'DIVERGED' | 'INCOMPLETE' | 'FAILED';
  reconstructedVersion?: number;
  originalStateHash?: string;
  replayedStateHash?: string;
  originalClaimRefs: string[];
  replayedClaimRefs: string[];
  divergence?: AssessmentReplayDivergence;
  limitations: string[];
  completedAt: string;
}
```

Divergence categories:

```text
EVENT_GAP
EVENT_ORDER_MISMATCH
SCHEMA_MIGRATION_MISMATCH
REDUCER_DIVERGENCE
MODEL_OUTPUT_DIVERGENCE
POLICY_OUTPUT_DIVERGENCE
REFERENCE_NOT_FOUND
NONDETERMINISTIC_DEPENDENCY
INTEGRITY_HASH_MISMATCH
```

---

## 17. Supersession History

Claims are never updated in place.

```text
Claim V1
   ↓ superseded by
Claim V2
   ↓ superseded by
Claim V3
```

Each supersession records:

- predecessor claim reference,
- successor claim reference,
- reason code,
- triggering evidence set,
- model and policy versions,
- effective time,
- actor or system authority.

Valid reasons:

```text
NEW_EVIDENCE
EVIDENCE_CORRECTION
POLICY_CHANGE
MODEL_CHANGE
HUMAN_REVIEW
SCOPE_CHANGE
MISCONCEPTION_RESOLUTION
RETENTION_REASSESSMENT
```

---

## 18. Evidence Correction

Raw history is not silently edited when evidence is corrected.

Correction flow:

```text
Original Evidence Reference
        ↓
Correction Event
        ↓
Corrected Evidence Version
        ↓
New Evidence Set
        ↓
New Assessment Evaluation
        ↓
Superseding Claim
```

The original claim remains historically explainable under the information available at that time.

---

## 19. Schema Evolution

Each event and snapshot carries a schema version.

Supported strategies:

```text
UPCAST_ON_READ
MIGRATE_AND_VERIFY
DUAL_READ_TRANSITION
REPLAY_TO_NEW_SNAPSHOT
ARCHIVE_UNSUPPORTED_STREAM
```

Rules:

- migrations are deterministic,
- migration code is versioned,
- pre- and post-migration hashes are recorded,
- source events remain preserved,
- unsupported versions fail explicitly,
- migration success requires replay verification.

---

## 20. Historical Comparison

Historical comparison must preserve context.

Valid comparisons include:

- same concept across time,
- same representation across time,
- same readiness target across time,
- support-dependent versus independent performance,
- misconception status history,
- retention after a configured interval.

Invalid or misleading comparisons include:

- combining unrelated concept scopes,
- comparing different policies without disclosure,
- treating changed evidence coverage as direct learner change,
- interpreting a projection wording change as assessment change.

---

## 21. Audit Record

```ts
export interface AssessmentAuditRecord {
  auditId: string;
  tenantId: string;
  learnerId: string;
  subjectType: 'EVENT' | 'CLAIM' | 'PROJECTION' | 'REPLAY' | 'HUMAN_REVIEW';
  subjectRef: VersionedReference;
  action: string;
  actorId?: string;
  actorRole?: string;
  purpose: string;
  occurredAt: string;
  correlationId: string;
  accessDecision?: string;
}
```

Audit records must be queryable without granting access to unrestricted learner evidence.

---

## 22. Retention and Deletion

Retention policies must distinguish:

- operational events,
- assessment claims,
- projections,
- raw evidence references,
- audit metadata,
- legal hold records,
- de-identified research exports.

Deletion or anonymization must preserve referential integrity or explicitly tombstone affected references.

A deleted evidence payload must not leave a claim appearing fully explainable when its support can no longer be inspected.

Possible status:

```text
AVAILABLE
REDACTED
ANONYMIZED
EXPIRED
LEGAL_HOLD
TOMBSTONED
```

---

## 23. Recovery

Recovery order:

```text
Verify Ledger Integrity
        ↓
Load Latest Trusted Snapshot
        ↓
Replay Remaining Events
        ↓
Compare State Hash
        ↓
Restore Read Model
        ↓
Resume Pending Idempotent Commands
```

Recovery must not infer completion from a request or UI response alone. Durable event and aggregate-version verification are required.

---

## 24. Failure Codes

```text
ASSESSMENT_EVENT_APPEND_FAILED
ASSESSMENT_VERSION_CONFLICT
ASSESSMENT_EVENT_INTEGRITY_FAILED
ASSESSMENT_EVENT_SCHEMA_UNSUPPORTED
ASSESSMENT_SNAPSHOT_INVALID
ASSESSMENT_SNAPSHOT_HASH_MISMATCH
ASSESSMENT_REPLAY_INPUT_MISSING
ASSESSMENT_REPLAY_MODEL_NOT_FOUND
ASSESSMENT_REPLAY_POLICY_NOT_FOUND
ASSESSMENT_REPLAY_NONDETERMINISTIC
ASSESSMENT_REPLAY_DIVERGED
ASSESSMENT_MIGRATION_FAILED
ASSESSMENT_CLAIM_LINEAGE_BROKEN
ASSESSMENT_COMMAND_IDEMPOTENCY_CONFLICT
ASSESSMENT_RETENTION_POLICY_VIOLATION
```

---

## 25. Invariants

1. Assessment events are append-only.
2. Every aggregate transition increments version exactly once.
3. Every claim references a frozen evidence set and versioned model/policy.
4. Snapshots never replace the event ledger as source of truth.
5. Historical claims are superseded, not overwritten.
6. Replay uses historical versions for historical reproduction.
7. Unversioned dependencies are forbidden in deterministic replay.
8. A replay divergence is recorded and never silently accepted.
9. Idempotent retries cannot create duplicate assessment outcomes.
10. Evidence correction produces new history.
11. Schema migration preserves original events.
12. Recovery requires durable state verification.
13. Projection persistence cannot become assessment authority.
14. Audit access does not automatically grant raw evidence access.
15. Retention actions preserve or explicitly tombstone claim lineage.

---

## 26. Verification Expectations

Repository verification should confirm:

- event envelopes contain identity, version, causation, and integrity metadata,
- optimistic concurrency is explicit,
- idempotency behavior is defined,
- snapshot validation rules exist,
- replay modes and divergence categories are explicit,
- historical model and policy versions are retained,
- supersession lineage is traversable,
- schema evolution is replay-verifiable,
- retention does not silently break explanations.

Runtime verification should demonstrate:

```text
Frozen Evidence Set
→ Assessment Evaluation
→ Event Append
→ Snapshot
→ State Rebuild
→ Claim Reproduction
→ Matching Hash and Claim Result
```

Failure-injection verification should include:

- duplicate command delivery,
- version conflict,
- interrupted append,
- corrupt snapshot,
- missing event,
- unsupported schema,
- model-version absence,
- deterministic replay divergence.

---

## 27. Completion Statement

26H is complete when every assessment decision can be durably traced, safely recovered, historically compared, and deterministically replayed without allowing persistence or presentation artifacts to redefine assessment truth.
