# 31G — Curriculum Persistence & Replay Runtime

## 1. Purpose

This slice defines the durable storage, append-only history, snapshot, outbox, rebuild, and replay rules for Curriculum Runtime.

The central rule is:

> Durable curriculum truth must be reconstructable from authorized historical records without rewriting prior meaning.

Persistence exists to preserve identity, provenance, version history, publication state, alignment state, and migration evidence across time.

Replay exists to reconstruct authorized state, compare runtime interpretations, recover projections, and verify that no silent semantic drift has occurred.

Persistence and replay must never manufacture authority that was absent from the original records.

---

## 2. Scope

This runtime owns persistence and replay semantics for:

- Curriculum identities
- Curriculum versions
- Curriculum nodes
- Grade and subject placement
- Publication records
- Lifecycle transitions
- Alignment records
- Overlay records
- Correction records
- Supersession records
- Migration records
- Verification evidence
- Projection rebuild checkpoints

This runtime does not own:

- Learner mastery
- Assessment scoring
- Recommendation policy
- Mission completion
- Skill dependency truth
- Lesson content authoring
- Search ranking policy

---

## 3. Source-of-Truth Model

### 3.1 Primary authority

The primary authority is the ordered curriculum event ledger.

Each accepted mutation must append an immutable event that captures:

- aggregate identity
- aggregate type
- curriculum identity
- curriculum version identity when applicable
- event type
- event payload
- actor identity
- tenant or institution context when applicable
- policy version
- command identity
- correlation identity
- causation identity
- occurred-at timestamp
- recorded-at timestamp
- expected prior version
- resulting aggregate version
- provenance classification

### 3.2 Derived state

Current aggregate state is derived from the ordered event stream.

Derived state may be materialized for runtime efficiency, but materialized state is not permitted to contradict the ledger.

### 3.3 Snapshots

Snapshots are recovery accelerators only.

A snapshot must include:

- aggregate identity
- aggregate version
- last included event position
- schema version
- policy version context
- content digest
- creation timestamp

A snapshot must never be treated as an independent source of curriculum truth.

If a snapshot and the ledger disagree, the ledger wins and the snapshot must be rejected.

---

## 4. Persistence Boundaries

Recommended persistence boundaries:

### 4.1 Curriculum aggregate

Owns long-lived curriculum identity and high-level jurisdiction, authority, and provenance metadata.

### 4.2 Curriculum version aggregate

Owns one immutable published expression of a curriculum.

### 4.3 Curriculum node aggregate

Owns stable node identity and version-bound curriculum meaning.

### 4.4 Alignment aggregate

Owns version-bound relationships between curriculum nodes and external entities.

### 4.5 Publication aggregate

Owns publication preparation, approval, scheduling, activation, withdrawal, and revocation history.

### 4.6 Overlay aggregate

Owns institution- or teacher-specific overlays without mutating official curriculum records.

These boundaries may be implemented separately while preserving one shared event-ordering and transaction policy.

---

## 5. Event Ledger Rules

The event ledger must be append-only.

Forbidden operations:

- in-place event mutation
- silent event deletion
- event reordering
- timestamp rewriting
- actor rewriting
- policy-version rewriting
- provenance rewriting
- payload strengthening after acceptance

Corrections must be represented by new events that explicitly reference the corrected record.

Revocation must be represented by a revocation event, not by deletion.

Supersession must preserve the superseded version and its entire history.

---

## 6. Transactional Write Model

A successful command must atomically persist:

1. the new event or events
2. the updated aggregate version
3. any required idempotency record
4. the outbox message or messages

The write must fail atomically if any part cannot be committed.

The runtime must use optimistic concurrency.

Each command must provide an expected aggregate version when modifying existing state.

If the stored version differs from the expected version, the runtime must reject the command with a concurrency conflict.

No last-write-wins policy is permitted for authoritative curriculum state.

---

## 7. Idempotency

Every externally submitted curriculum command must have a stable command identity.

The runtime must ensure that repeating the same command identity:

- does not append duplicate events
- does not create duplicate publication records
- does not duplicate alignments
- does not repeat a migration transition
- returns the previously accepted result when safe

A different payload under the same command identity must be rejected as an idempotency conflict.

---

## 8. Outbox Runtime

All downstream projection and integration notifications must be written through an outbox within the same transaction as the authoritative state change.

Outbox records should include:

- event identity
- aggregate identity
- aggregate version
- event type
- payload digest
- destination category
- created timestamp
- delivery status
- attempt count

Delivery may be retried, but authoritative events must never be re-appended merely because downstream delivery failed.

At-least-once delivery is acceptable only when downstream consumers are idempotent.

---

## 9. Replay Modes

### 9.1 Aggregate reconstruction

Rebuild one aggregate from its event stream.

### 9.2 Full curriculum rebuild

Reconstruct an entire curriculum version, including all nodes, publication state, and alignments.

### 9.3 Projection rebuild

Rebuild one or more read models from authoritative events.

### 9.4 Historical point-in-time replay

Reconstruct curriculum state as of a historical event position or timestamp.

### 9.5 Current-runtime reinterpretation

Replay historical events using the current runtime implementation for comparison purposes.

This mode must not overwrite historical truth.

### 9.6 Policy-bound replay

Replay using the exact policy versions recorded with the original events.

This is the authoritative historical interpretation mode.

### 9.7 Shadow replay

Replay into an isolated environment and compare outputs before publication or migration.

### 9.8 Incident replay

Replay a bounded sequence to diagnose corruption, divergence, or failed migration.

---

## 10. Replay Ordering

Replay order must be deterministic.

The primary ordering key must be the durable ledger position or aggregate event version.

Timestamps may support inspection but must not replace the authoritative ordering key.

When multiple aggregates participate in one curriculum publication or migration operation, the runtime must preserve transaction or operation boundaries where recorded.

---

## 11. Replay Compatibility

Every event type must have an explicit schema version.

The replay runtime may use upcasters to translate older event representations into the current in-memory form.

Upcasters must:

- preserve original meaning
- remain deterministic
- avoid adding unsupported authority
- expose their version
- be testable independently
- never mutate stored historical events

If an event cannot be interpreted safely, replay must stop and report a blocking compatibility failure.

Silent dropping of unknown events is forbidden.

---

## 12. Replay Output Classification

Replay output must be classified as one of:

- AUTHORITATIVE_RECONSTRUCTION
- HISTORICAL_VIEW
- SHADOW_RESULT
- DIAGNOSTIC_RESULT
- MIGRATION_PREVIEW
- PROJECTION_REBUILD

Only authoritative reconstruction from the complete accepted ledger may replace current durable aggregate state.

Diagnostic and shadow outputs must remain isolated.

---

## 13. Divergence Detection

Replay must calculate and compare deterministic digests for:

- aggregate state
- curriculum tree structure
- node identity set
- lifecycle state
- publication state
- alignment set
- overlay set
- migration state

Divergence must be categorized:

- EXPECTED_IMPLEMENTATION_CHANGE
- EXPECTED_POLICY_CHANGE
- SNAPSHOT_CORRUPTION
- PROJECTION_DRIFT
- EVENT_SCHEMA_INCOMPATIBILITY
- ORDERING_FAILURE
- UNKNOWN_SEMANTIC_DIVERGENCE

Unknown semantic divergence must block publication, migration completion, and authoritative replacement.

---

## 14. Historical Integrity

The runtime must preserve:

- who authorized a change
- what policy version governed it
- which curriculum version was affected
- when it became effective
- why it was corrected, superseded, withdrawn, or revoked
- which downstream versions referenced it

Historical views must be reproducible even after newer curriculum versions become active.

A newer interpretation must not erase the ability to show the prior official state.

---

## 15. Retention

Authoritative curriculum events, publication records, correction records, and migration evidence must be retained for the lifetime of the product unless a legal requirement mandates a different policy.

Retention rules must distinguish:

- authoritative curriculum history
- operational logs
- transient projection caches
- temporary replay workspaces
- diagnostic artifacts

Deleting transient artifacts must never delete authoritative records.

---

## 16. Backup and Recovery

Backup strategy must cover:

- event ledger
- aggregate metadata
- idempotency records
- outbox records
- snapshot records
- schema registry
- replay compatibility code version references

Recovery procedure:

1. restore authoritative ledger
2. verify ledger integrity
3. restore or rebuild aggregate state
4. rebuild projections
5. verify publication and migration state
6. compare digests
7. resume downstream delivery

Projection backups are optional because projections must be rebuildable.

---

## 17. Failure Codes

Recommended failure codes:

- CURRICULUM_EVENT_APPEND_FAILED
- CURRICULUM_CONCURRENCY_CONFLICT
- CURRICULUM_IDEMPOTENCY_CONFLICT
- CURRICULUM_LEDGER_GAP
- CURRICULUM_EVENT_ORDER_INVALID
- CURRICULUM_EVENT_SCHEMA_UNSUPPORTED
- CURRICULUM_SNAPSHOT_REJECTED
- CURRICULUM_REPLAY_DIVERGENCE
- CURRICULUM_REPLAY_INCOMPLETE
- CURRICULUM_OUTBOX_WRITE_FAILED
- CURRICULUM_RECOVERY_VERIFICATION_FAILED

Failure responses must include enough evidence to locate the aggregate, event position, schema version, and policy context without leaking protected content.

---

## 18. Verification Gates

Persistence and replay verification must include:

### Repository gate

- event contracts exist
- aggregate boundaries are explicit
- append-only rules are documented
- snapshot semantics are explicit
- replay modes are explicit
- failure codes are explicit

### Runtime gate

- optimistic concurrency test
- idempotency test
- atomic state-plus-outbox test
- snapshot rejection test
- deterministic replay test
- unknown-event blocking test
- replay digest comparison test

### Operational gate

- full curriculum reconstruction from ledger
- point-in-time historical reconstruction
- projection destruction and rebuild
- recovery from backup
- shadow replay before migration
- publication blocked on unexplained divergence

---

## 19. Security and Audit

Persistence operations must enforce actor authorization before append.

Audit access must be read-only by default.

Sensitive institution overlays must remain tenant-scoped.

Replay workspaces must not bypass authorization merely because they are diagnostic.

Exported history must preserve provenance and version labels.

---

## 20. Runtime Invariants

1. The event ledger is the durable authority.
2. Materialized aggregate state is derived.
3. Snapshots are recovery accelerators only.
4. Published historical meaning is never rewritten in place.
5. Replay is deterministic for a fixed ledger, runtime version, and policy set.
6. Unknown events are never silently ignored.
7. No authoritative mutation uses last-write-wins.
8. State change and outbox publication are atomic.
9. Replay outputs cannot strengthen source authority.
10. Unexplained divergence blocks authoritative replacement.
11. Projection loss must be recoverable from the ledger.
12. Historical curriculum views remain reproducible.

---

## 21. Completion Criteria

31G is complete when Curriculum Runtime has a durable, append-only, version-aware persistence model; deterministic replay modes; snapshot and outbox rules; divergence detection; recovery procedures; and verification gates that protect historical curriculum meaning.
