# 17D — Runtime Recovery & Snapshot Architecture

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 17D — Runtime Recovery & Snapshot Architecture  
**Document Type:** Runtime Architecture / Recovery Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/runtime/17A-LEARNING-RUNTIME-CORE.md`  
**Module Authority:** `docs/runtime/17B-SPECIALIZED-LEARNING-RUNTIME-MODULES.md`  
**Event Authority:** `docs/runtime/17C-RUNTIME-EVENT-CONTRACTS.md`  
**Upstream Authorities:** Learning Mission System Blueprint 16A–16J  
**Downstream Consumers:** Phase 18 domain model, application command handlers, event persistence, snapshot storage, projection infrastructure, outbox workers, operational tooling, audit tooling, API contracts, frontend runtime

---

## 1. Purpose

This guide defines how `LearningRuntime` is restored after interruption, retried after failure, resumed after suspension, and reconstructed from durable history without changing the meaning of accepted learning evidence.

The central doctrine is:

> Recovery restores authoritative runtime meaning from durable evidence; it never invents progress, rewrites accepted history, or treats a snapshot as a replacement for the event stream.

A conforming recovery architecture must answer:

> Which durable evidence is authoritative, where restoration begins, how state is reconstructed deterministically, how incomplete work is detected, how retries avoid duplicate effects, how corruption is isolated, how snapshots evolve, and what evidence proves that recovery was safe?

Recovery is not an exceptional side path. It is a normal runtime capability required for every meaningful learning operation.

---

## 2. Architectural Position

```text
Learning Mission System Blueprint (16A–16J)
        ↓
Learning Runtime Core (17A)
        ↓
Specialized Runtime Modules (17B)
        ↓
Runtime Event Contracts (17C)
        ↓
Runtime Recovery & Snapshot Architecture (17D)
        ↓
Domain Model (18)
        ↓
Application / Persistence / Projection Infrastructure
```

Phase 17D completes the runtime foundation by defining durable restoration semantics shared by every runtime module.

It does not select a database product, event-store vendor, message broker, serialization library, scheduler, cloud provider, or deployment topology.

---

## 3. Recovery Authority Boundary

### 3.1 Phase 17D owns

- recovery doctrine;
- snapshot authority and limitations;
- snapshot identity and metadata;
- snapshot creation eligibility;
- snapshot consistency guarantees;
- replay start-point selection;
- deterministic reconstruction;
- suspended-runtime resume semantics;
- lease-expiry recovery;
- retry and idempotency interaction;
- incomplete-command detection;
- recovery state transitions;
- corrupted-stream isolation;
- snapshot versioning and compatibility;
- snapshot invalidation;
- incremental replay;
- projection recovery boundaries;
- outbox recovery boundaries;
- recovery audit evidence;
- recovery failure taxonomy;
- repository, runtime, and operational verification requirements.

### 3.2 Phase 17D does not own

- business transition authorization;
- diagnosis, mission, mastery, or remediation policy content;
- event payload contracts already owned by 17C;
- aggregate boundaries owned by Phase 18;
- physical table definitions;
- storage-vendor configuration;
- broker-specific retry settings;
- frontend recovery wording;
- analytics interpretation;
- human support procedures beyond architectural evidence requirements.

Recovery may restore an authorized state. It may not create new business authority.

---

## 4. Runtime Recovery Doctrine

Every recovery implementation must satisfy all of the following:

1. **Event history remains authoritative** — accepted events are the durable causal record.
2. **Snapshots are derived acceleration artifacts** — they reduce replay cost but do not replace history.
3. **Restoration is deterministic** — identical accepted history and policy-compatible code produce identical aggregate state.
4. **Accepted history is immutable** — recovery never edits, deletes, reorders, or silently skips accepted events.
5. **Incomplete work is explicit** — uncertain command outcomes are resolved through evidence, not assumption.
6. **Retries are idempotent** — repeated recovery attempts cannot duplicate accepted effects.
7. **Tenant boundaries survive recovery** — no state may be restored across tenant ownership.
8. **Policy attribution survives recovery** — historical decisions retain their original policy-version evidence.
9. **Corruption fails closed** — uncertain history is isolated rather than partially trusted.
10. **Recovery is auditable** — every restoration attempt produces inspectable evidence.

The preferred operating principles are:

```text
Resume > Restart
Replay > Recompute Meaning
Evidence > Assumption
Patch > Rewrite
Fail Closed > Guess
```

---

## 5. Sources of Runtime Truth

Recovery uses a strict authority order.

### 5.1 Authoritative sources

1. accepted aggregate events;
2. durable command/idempotency records linked to accepted outcomes;
3. durable runtime ownership and lifecycle records;
4. durable outbox publication records;
5. versioned snapshots that can be proven to derive from an exact event-stream position.

### 5.2 Non-authoritative sources

The following may assist diagnosis but may not independently establish runtime truth:

- frontend local state;
- browser cache;
- in-memory module state;
- process logs;
- analytics projections;
- read-model caches;
- message-delivery attempts;
- worker heartbeat state;
- user recollection;
- timestamps without causal linkage.

A projection may report what was observed. Only the owning event stream and its accepted command evidence establish what occurred.

---

## 6. Snapshot Authority Boundary

A snapshot is a versioned, immutable representation of aggregate state after applying a contiguous prefix of accepted events.

A snapshot must be understood as:

> A verified replay checkpoint, not an independent source of business truth.

A snapshot may accelerate restoration only when all of the following are known:

- aggregate type;
- aggregate identity;
- tenant identity;
- runtime identity where applicable;
- aggregate version represented;
- last included event identity;
- snapshot schema version;
- aggregate contract version;
- creation timestamp;
- integrity evidence;
- compatibility status.

A snapshot must never:

- include uncommitted state;
- include events beyond its declared aggregate version;
- merge multiple aggregate streams into one authoritative state;
- replace missing events;
- conceal stream gaps;
- authorize a transition;
- mutate after publication;
- be treated as valid merely because deserialization succeeds.

---

## 7. Canonical Snapshot Envelope

Every durable snapshot uses the following conceptual envelope:

```ts
interface RuntimeSnapshotEnvelope<State> {
  snapshotId: string;
  snapshotSchemaVersion: number;

  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;

  runtimeId?: string;
  tenantId: string;
  learnerId?: string;

  lastEventId: string;
  lastEventSchemaVersion: number;

  aggregateContractVersion: string;
  policyVersionSet?: PolicyVersionSet;

  createdAt: string;
  createdBy: SnapshotCreatorRef;

  integrity: SnapshotIntegrityMetadata;
  state: State;
  metadata: RuntimeSnapshotMetadata;
}
```

This is an architectural contract, not a mandatory literal TypeScript declaration.

Implementations may use different language constructs but may not weaken the semantics.

---

## 8. Snapshot Identity and Immutability

### 8.1 `snapshotId`

A globally unique immutable identifier for one snapshot artifact.

Requirements:

- generated once;
- never reused;
- stable for the lifetime of the artifact;
- never used as aggregate identity;
- suitable for audit correlation.

### 8.2 Aggregate position

`aggregateVersion` identifies the exact event-stream version represented by the snapshot.

The snapshot must represent all accepted events from version `1` through `aggregateVersion`, with no gaps and no events beyond that position.

### 8.3 Last event linkage

`lastEventId` must identify the event at `aggregateVersion`.

A mismatch between `lastEventId`, aggregate version, stream ownership, or tenant ownership invalidates the snapshot.

### 8.4 Immutability

Snapshots are append-only artifacts.

A newer snapshot supersedes an older snapshot for restoration preference, but the older snapshot is not edited in place.

---

## 9. Snapshot Creation Rules

A snapshot may be created only after the represented event version is durably accepted.

Snapshot creation must occur from a reconstructed or transactionally trusted aggregate state whose version exactly matches the durable event stream.

Eligible creation triggers may include:

- fixed event-count thresholds;
- replay-cost thresholds;
- runtime suspension;
- runtime completion;
- module-boundary checkpoints;
- planned migration checkpoints;
- operational maintenance;
- explicit recovery hardening.

Triggering a snapshot does not change aggregate state and does not emit a business event merely because a snapshot was written.

### 9.1 Prohibited creation states

A snapshot must not be created from:

- speculative command state;
- pending transaction state;
- partially applied event batches;
- a projection treated as aggregate truth;
- a stale process that has lost runtime ownership;
- a stream with an unresolved version gap;
- a stream under corruption quarantine;
- an unknown aggregate contract version.

---

## 10. Snapshot Consistency Guarantees

A valid snapshot must satisfy:

```text
snapshot.aggregateVersion == lastIncludedEvent.aggregateVersion
snapshot.lastEventId == lastIncludedEvent.eventId
snapshot.aggregateId == stream.aggregateId
snapshot.aggregateType == stream.aggregateType
snapshot.tenantId == stream.tenantId
```

Additionally:

- every included event must belong to the same aggregate stream;
- event versions must be contiguous;
- the aggregate reducer must have accepted every included event;
- state serialization must be complete;
- required policy attribution must remain available;
- integrity metadata must verify before use.

A snapshot write and the represented event append do not need to share one physical transaction, but the snapshot must never claim a position that is not already durably accepted.

If snapshot creation fails, the event stream remains valid and replayable.

---

## 11. Snapshot Integrity

Snapshot integrity metadata should support detection of accidental mutation, truncation, mismatched ownership, and incompatible decoding.

Conceptual integrity fields may include:

```ts
interface SnapshotIntegrityMetadata {
  algorithm: string;
  contentHash: string;
  envelopeHash?: string;
  stateByteLength?: number;
  verifiedAtCreation: boolean;
}
```

Integrity verification proves artifact consistency, not business correctness.

A valid hash cannot make an incompatible, unauthorized, or semantically invalid snapshot trustworthy.

---

## 12. Deterministic Replay Model

Restoration follows this canonical sequence:

```text
1. Identify aggregate stream and tenant ownership
2. Select the newest valid compatible snapshot, if any
3. Verify snapshot integrity and exact stream position
4. Hydrate aggregate state from the snapshot
5. Read accepted events after snapshot.aggregateVersion
6. Verify contiguous aggregate versions
7. Upcast historical event payloads where required
8. Apply events in aggregate-version order
9. Verify final reconstructed version
10. Resolve incomplete command evidence
11. Re-establish runtime lifecycle status
12. Resume only through a newly admitted command
```

Without a valid snapshot, replay begins from the aggregate's defined initial state.

Replay must not:

- emit new business events;
- publish messages;
- call external services;
- advance wall-clock-dependent logic;
- generate new identifiers for historical facts;
- rerun policy decisions that were already recorded;
- mutate historical timestamps;
- count replay as new learner activity.

Replay reconstructs meaning. It does not repeat side effects.

---

## 13. Replay Modes

### 13.1 Full replay

Reconstruct from aggregate version `0` using the complete accepted event stream.

Used when:

- no snapshot exists;
- all snapshots are invalid or incompatible;
- verification requires independent reconstruction;
- migration tooling needs baseline comparison.

### 13.2 Snapshot replay

Hydrate from a valid snapshot and apply only later events.

Used for normal runtime restoration when compatibility and integrity are proven.

### 13.3 Verification replay

Reconstruct independently and compare against a snapshot or expected state fingerprint.

Used for:

- snapshot certification;
- migration validation;
- corruption investigation;
- deterministic reducer testing.

### 13.4 Projection replay

Reprocess accepted events into a derived read model.

Projection replay is separate from aggregate replay and cannot alter aggregate truth.

---

## 14. Resume Model

A restored runtime does not automatically continue an interrupted imperative operation.

After reconstruction, the runtime must determine whether the prior command outcome is:

```text
ACCEPTED
REJECTED
NOT_ACCEPTED
UNKNOWN
```

### 14.1 Accepted

Durable command evidence and accepted events prove the command completed.

Return or reconstruct the accepted result. Do not execute again.

### 14.2 Rejected

Durable refusal evidence proves no transition occurred.

Return the same refusal semantics where contractually required.

### 14.3 Not accepted

Evidence proves the command never crossed the acceptance boundary.

A caller may submit a new attempt under normal admission rules.

### 14.4 Unknown

Evidence cannot prove whether acceptance occurred.

The runtime must enter a recovery-blocked state or perform authoritative reconciliation. It must not guess and must not blindly re-execute.

Resume therefore means:

> Reconstruct state, resolve prior evidence, reacquire authority, and admit the next command under current runtime rules.

It does not mean restarting from an arbitrary process instruction pointer.

---

## 15. Suspension and Lease Recovery

Long-lived learning activity may be suspended because of:

- application shutdown;
- device disconnect;
- worker crash;
- process deployment;
- network loss;
- explicit learner pause;
- inactivity timeout;
- runtime lease expiry;
- infrastructure failover.

A runtime lease proves temporary execution ownership. It does not own business truth.

### 15.1 Lease rules

- only one active execution owner may mutate one aggregate stream at a time;
- lease acquisition must be tenant- and aggregate-scoped;
- lease renewal must not alter aggregate version;
- lease expiry permits recovery acquisition, not historical rewrite;
- stale owners must fail optimistic version checks;
- side effects require durable command and outbox evidence, not lease ownership alone.

### 15.2 Recovery after lease expiry

The recovering owner must:

1. acquire recovery authority;
2. reread durable aggregate state;
3. verify expected aggregate version;
4. inspect incomplete command evidence;
5. restore from valid history;
6. resume only with a newly admitted command or reconciled pending work.

---

## 16. Recovery State Machine

The conceptual recovery lifecycle is:

```text
STABLE
  ├── interruption detected ──> RECOVERY_REQUIRED
  ├── planned suspension ─────> SUSPENDED
  └── corruption detected ────> QUARANTINED

SUSPENDED
  └── resume requested ───────> RECOVERING

RECOVERY_REQUIRED
  └── authority acquired ─────> RECOVERING

RECOVERING
  ├── restoration verified ───> STABLE
  ├── evidence unresolved ────> RECOVERY_BLOCKED
  ├── incompatibility found ──> MIGRATION_REQUIRED
  └── corruption confirmed ───> QUARANTINED

MIGRATION_REQUIRED
  ├── migration verified ─────> RECOVERING
  └── migration failed ───────> RECOVERY_BLOCKED

RECOVERY_BLOCKED
  ├── evidence reconciled ────> RECOVERING
  └── corruption confirmed ───> QUARANTINED

QUARANTINED
  └── authorized repair evidence accepted ──> RECOVERING
```

These are architectural states. Implementations may use different names but must preserve the refusal boundaries.

---

## 17. Recovery Transition Invariants

### 17.1 Entering `RECOVERING`

Requires:

- known aggregate identity;
- known tenant identity;
- recovery ownership or equivalent serialization authority;
- durable history access;
- explicit recovery attempt identity.

### 17.2 Entering `STABLE`

Requires:

- successful deterministic reconstruction;
- contiguous final aggregate version;
- compatible event and snapshot schemas;
- resolved incomplete command evidence;
- no active corruption quarantine;
- recovery audit record.

### 17.3 Entering `RECOVERY_BLOCKED`

Required when:

- command acceptance is unknown;
- stream position cannot be proven;
- required policy attribution is missing;
- snapshot and stream disagree;
- external side-effect evidence is ambiguous;
- migration prerequisites are incomplete.

### 17.4 Entering `QUARANTINED`

Required when:

- event sequence is non-contiguous;
- accepted event ownership conflicts;
- event content fails integrity validation;
- an event cannot be interpreted safely;
- historical evidence appears mutated;
- tenant boundaries are violated;
- repair would require inventing business facts.

---

## 18. Incomplete Command Recovery

Every consequential command should have durable evidence sufficient to distinguish admission, acceptance, refusal, and side-effect publication.

Conceptually:

```ts
interface DurableCommandRecord {
  commandId: string;
  aggregateType: string;
  aggregateId: string;
  tenantId: string;
  expectedAggregateVersion: number;
  status: "RECEIVED" | "ACCEPTED" | "REJECTED" | "FAILED_BEFORE_ACCEPTANCE";
  acceptedEventIds?: string[];
  refusalCode?: string;
  resultReference?: string;
  recordedAt: string;
}
```

This contract is illustrative.

Recovery rules:

- `ACCEPTED` with matching events: return accepted outcome;
- `REJECTED`: preserve refusal outcome;
- `FAILED_BEFORE_ACCEPTANCE`: safe for a new command attempt;
- `RECEIVED` without decisive evidence: reconcile before execution;
- event exists but command record is incomplete: event history remains authoritative and the command record must be repaired without duplicating the event;
- command record claims acceptance but events are absent: fail closed and quarantine or reconcile through authoritative persistence evidence.

---

## 19. Idempotency During Recovery

Idempotency keys and command identifiers must survive process restart.

A retry using the same command identity must produce one of three outcomes:

1. return the previously accepted result;
2. return the previously recorded refusal;
3. continue an explicitly safe pre-acceptance attempt.

It must never create a second accepted transition for the same logical command.

Idempotency scope must include enough identity to prevent cross-tenant or cross-aggregate collision.

At minimum, scope includes:

```text
tenantId + aggregateType + aggregateId + commandId
```

Payload mismatch under a reused command identity is a contract violation and must be refused.

---

## 20. Corrupted Stream Handling

Corruption includes any condition that prevents safe deterministic interpretation of accepted history.

Examples:

- missing aggregate version;
- duplicate aggregate version with different event identity;
- event assigned to the wrong tenant;
- event assigned to the wrong aggregate;
- invalid event integrity evidence;
- unsupported event schema with no safe upcaster;
- impossible causation linkage where linkage is required;
- snapshot state inconsistent with replay;
- historical event mutation;
- truncated stream;
- unauthorized repair event.

### 20.1 Required behavior

When corruption is detected:

1. stop mutation for the affected aggregate;
2. mark the aggregate or runtime as quarantined;
3. preserve all discovered evidence;
4. record the exact failing position;
5. prevent projection rebuild from presenting uncertain state as authoritative;
6. require an explicit authorized repair procedure;
7. verify repair through full replay before returning to stable operation.

### 20.2 Prohibited repair behavior

- fabricating missing events;
- deleting inconvenient events;
- changing aggregate versions;
- editing historical payloads in place;
- copying state from a projection into the aggregate;
- advancing to the next version without causal evidence;
- silently ignoring an unreadable event.

---

## 21. Snapshot Versioning

Snapshot evolution has at least two independent version dimensions:

1. `snapshotSchemaVersion` — envelope and serialized state format;
2. `aggregateContractVersion` — aggregate state and reducer contract expected by the snapshot.

A change to one does not automatically require a change to the other.

Snapshot readers must explicitly decide whether a snapshot is:

```text
COMPATIBLE
UPGRADABLE
INCOMPATIBLE
INVALID
```

### 21.1 Compatible

Can be hydrated directly under the current aggregate contract.

### 21.2 Upgradable

Can be transformed deterministically through a tested snapshot migration.

### 21.3 Incompatible

Cannot be trusted by the current aggregate implementation. Ignore it and replay from an earlier compatible snapshot or from version `0`.

### 21.4 Invalid

Fails ownership, position, integrity, or semantic checks. Quarantine the artifact and continue only if authoritative event history remains valid.

---

## 22. Snapshot Compatibility and Migration

Snapshot migrations must be:

- deterministic;
- version-to-version explicit;
- testable through fixture replay;
- free of external side effects;
- unable to create new business facts;
- traceable to migration version;
- reversible by falling back to event replay.

Preferred strategy:

```text
Discardable snapshot + authoritative event replay
```

A system should prefer rebuilding a snapshot from accepted events over introducing complex snapshot migration logic unless replay cost or operational constraints justify migration.

Historical events require their own compatibility and upcasting rules under 17C. Snapshot migration must not be used to avoid event compatibility obligations.

---

## 23. Snapshot Invalidation

A snapshot becomes unusable when:

- its integrity evidence fails;
- its aggregate position cannot be matched;
- tenant ownership differs;
- aggregate identity differs;
- required event history before or at its position is invalid;
- its schema cannot be interpreted;
- its aggregate contract is incompatible;
- its state violates current non-negotiable invariants;
- independent verification replay disagrees.

Invalidating a snapshot does not invalidate the event stream automatically.

The recovery system should select the next-newest valid compatible snapshot or perform full replay.

---

## 24. Incremental Replay

Incremental replay begins strictly after the selected snapshot version.

For snapshot version `N`, the first replayed event must be version `N + 1`.

Required checks:

- no version gap;
- no duplicate version;
- correct aggregate ownership;
- correct tenant ownership;
- supported event schema;
- deterministic reducer acceptance;
- final reconstructed version equals durable stream head.

Incremental replay must stop immediately on the first unresolved inconsistency.

Partial reconstructed state must not be exposed as stable aggregate truth.

---

## 25. Module Recovery Responsibilities

Each specialized module defined in 17B must provide enough deterministic behavior to support replay and restoration.

Every module must declare:

- state owned by the module;
- events that reconstruct that state;
- derived values that may be recomputed;
- external effects that must not run during replay;
- pending-work markers;
- idempotency boundaries;
- recovery refusal conditions;
- snapshot representation;
- compatibility expectations.

### 25.1 Examples

- `TargetRuntime` restores active and completed targets from accepted target events.
- `DiagnosisRuntime` restores diagnosis evidence and recorded outcomes without rerunning historical diagnosis decisions.
- `MissionPlanningRuntime` restores accepted mission plans using recorded policy attribution.
- `WorldActivityRuntime` restores activity lifecycle without replaying animations or device interactions.
- `EvidenceRuntime` restores submitted evidence references without duplicating uploads.
- `AssessmentRuntime` restores accepted assessment results without rescoring historical evidence unless an explicitly new assessment command is authorized.
- `MasteryRuntime` restores recorded mastery decisions without applying current policy retroactively.
- `RemediationRuntime` restores active remediation obligations and completion evidence.
- `ProjectionRuntime` may rebuild projections but may not mutate aggregate streams during rebuild.
- `AnalyticsEmissionRuntime` reconciles durable emission evidence without counting replay as new learning activity.

---

## 26. Projection Recovery

Projections are disposable derived models.

Projection recovery may use:

- full event replay;
- checkpointed event offsets;
- projection-specific snapshots;
- deterministic rebuild jobs.

Projection checkpoints must not be confused with aggregate snapshots.

A projection checkpoint records consumer progress, not aggregate state authority.

Required projection recovery rules:

- event processing is idempotent;
- duplicate delivery does not duplicate projection effects;
- checkpoint advancement follows successful durable projection update;
- failed projection updates do not advance the checkpoint;
- projection rebuild does not emit aggregate events;
- stale projections are marked stale or unavailable rather than presented as current;
- aggregate commands do not trust a projection when authoritative aggregate state is required.

---

## 27. Outbox Recovery

The outbox provides durable evidence that accepted events require publication to external consumers.

Recovery must distinguish:

```text
EVENT_ACCEPTED / NOT_PUBLISHED
EVENT_ACCEPTED / PUBLICATION_IN_PROGRESS
EVENT_ACCEPTED / PUBLISHED
EVENT_ACCEPTED / PUBLICATION_FAILED
```

Outbox recovery rules:

- accepted events must not be recreated to trigger publication;
- publication retries use the original event identity;
- consumers must tolerate duplicate delivery;
- publication success is durably recorded;
- a worker crash after send but before acknowledgement may cause duplicate delivery, never duplicate aggregate acceptance;
- replaying an aggregate must not republish events automatically;
- explicit outbox reconciliation controls publication recovery.

Outbox state is delivery evidence, not business truth.

---

## 28. External Side-Effect Recovery

External side effects may include:

- notification delivery;
- file processing;
- media transformation;
- third-party service calls;
- export generation;
- analytics forwarding;
- parent or teacher alerts.

A side effect must be linked to a durable effect request or outbox record before execution.

Recovery must determine whether the external effect is:

```text
NOT_REQUESTED
REQUESTED
IN_PROGRESS
CONFIRMED
FAILED_RETRYABLE
FAILED_FINAL
UNKNOWN
```

`UNKNOWN` must not be treated as either success or failure without reconciliation.

Where the external provider supports idempotency keys, the durable effect identity should be reused across retries.

Where it does not, the architecture must provide reconciliation or human-review boundaries appropriate to the consequence.

---

## 29. Recovery Audit Evidence

Every recovery attempt must produce durable evidence sufficient to answer:

- which runtime or aggregate was recovered;
- which tenant owned it;
- why recovery began;
- who or what initiated recovery;
- which snapshot was considered;
- whether the snapshot was accepted or rejected;
- from which aggregate version replay began;
- how many events were applied;
- which schema migrations or upcasters ran;
- whether incomplete commands were found;
- whether outbox or external effects required reconciliation;
- final reconstructed aggregate version;
- resulting recovery state;
- exact failure code when recovery did not complete;
- timestamps for start and completion;
- correlation identity for operational tracing.

Conceptually:

```ts
interface RuntimeRecoveryRecord {
  recoveryId: string;
  runtimeId?: string;
  aggregateType: string;
  aggregateId: string;
  tenantId: string;
  reason: string;
  selectedSnapshotId?: string;
  replayFromVersion: number;
  replayToVersion?: number;
  eventsApplied: number;
  outcome: "RESTORED" | "BLOCKED" | "QUARANTINED" | "MIGRATION_REQUIRED";
  failureCode?: RuntimeRecoveryFailureCode;
  startedAt: string;
  completedAt?: string;
  correlationId: string;
}
```

---

## 30. Recovery Failure Taxonomy

The runtime recovery contract should support stable failure codes including:

```text
RECOVERY_AUTHORITY_NOT_ACQUIRED
RUNTIME_NOT_FOUND
AGGREGATE_STREAM_NOT_FOUND
TENANT_OWNERSHIP_MISMATCH
SNAPSHOT_NOT_FOUND
SNAPSHOT_INTEGRITY_FAILED
SNAPSHOT_POSITION_MISMATCH
SNAPSHOT_SCHEMA_UNSUPPORTED
SNAPSHOT_CONTRACT_INCOMPATIBLE
EVENT_STREAM_GAP
EVENT_VERSION_DUPLICATE
EVENT_SCHEMA_UNSUPPORTED
EVENT_INTEGRITY_FAILED
EVENT_OWNERSHIP_MISMATCH
EVENT_REPLAY_REJECTED
COMMAND_OUTCOME_UNKNOWN
OUTBOX_OUTCOME_UNKNOWN
EXTERNAL_EFFECT_OUTCOME_UNKNOWN
POLICY_ATTRIBUTION_MISSING
MIGRATION_REQUIRED
MIGRATION_FAILED
FINAL_VERSION_MISMATCH
RUNTIME_QUARANTINED
RECOVERY_ALREADY_IN_PROGRESS
RECOVERY_EVIDENCE_INCOMPLETE
```

Failure codes are machine-readable architectural semantics.

Human-facing explanations belong to downstream API and UI contracts.

---

## 31. Concurrency and Optimistic Recovery

Recovery must coexist safely with normal command execution.

Required safeguards:

- aggregate stream writes use optimistic expected-version enforcement;
- recovery ownership is serialized or leased;
- snapshot creation never advances aggregate version;
- a stale recovery process cannot overwrite newer state;
- final restoration verifies current durable stream head;
- if new accepted events appear during restoration, the process must continue replay safely or restart from a proven position;
- multiple recovery attempts may observe history, but only authorized owners may transition runtime recovery status.

Recovery success cannot be inferred from acquiring a lease alone.

It requires verified reconstructed state and durable recovery evidence.

---

## 32. Privacy and Security During Recovery

Recovery may process sensitive learner evidence and must preserve the privacy classification defined by runtime event contracts.

Requirements:

- tenant isolation is enforced at every read and write;
- snapshot access follows the strongest privacy class contained in state;
- recovery logs exclude unnecessary sensitive payloads;
- audit records prefer identifiers and hashes over copied learner evidence;
- encryption requirements apply equally to snapshots and events;
- quarantined artifacts remain access controlled;
- deletion and retention policies must account for both event history and derived snapshots;
- a snapshot must not extend retention beyond authoritative policy;
- recovery tooling must use least privilege.

---

## 33. Deterministic Restoration Rules

A restoration is deterministic only when:

- event order is fixed by aggregate version;
- event upcasters are pure and versioned;
- reducers are pure with respect to historical events;
- wall-clock time is not read during replay;
- random values used historically are recorded in events when consequential;
- external service responses used historically are recorded as evidence when consequential;
- policy versions used for decisions are preserved;
- locale-dependent formatting is excluded from aggregate meaning;
- floating-point or numeric rules are stable where learning outcomes depend on them;
- replay does not depend on mutable projections.

If historical state cannot be reconstructed without consulting changing external state, the event contract was incomplete and recovery must fail closed until reconciled.

---

## 34. Snapshot Frequency Policy

Snapshot frequency is an operational policy, not a domain rule.

It may consider:

- event count;
- serialized state size;
- replay duration;
- runtime criticality;
- module complexity;
- expected resume latency;
- storage cost;
- migration frequency;
- verification overhead.

The policy must avoid:

- snapshotting every transition without measured need;
- allowing replay cost to grow without bound;
- creating snapshots from unstable or speculative state;
- coupling business behavior to snapshot success;
- assuming the newest snapshot is automatically valid.

Snapshot creation failure must not reverse an already accepted business transition.

---

## 35. Recovery Checkpoints

A recovery checkpoint records progress of a recovery operation so that long verification or migration work can resume safely.

A checkpoint is not an aggregate snapshot.

It may record:

- recovery identity;
- aggregate identity;
- tenant identity;
- selected source snapshot;
- last verified event version;
- migration step;
- projection rebuild offset;
- evidence gathered;
- current recovery status.

Checkpoint rules:

- checkpoint advancement follows verified work;
- a checkpoint never proves aggregate acceptance;
- stale checkpoints are ignored when stream head or recovery identity changes incompatibly;
- checkpoint recovery must revalidate ownership and stream position;
- checkpoints are safe to discard when full recovery can restart.

---

## 36. Operational Observability

Recovery observability should expose:

- number of runtimes requiring recovery;
- recovery attempts by outcome;
- average and percentile replay duration;
- average events applied per recovery;
- snapshot hit and rejection rates;
- full replay frequency;
- incompatible snapshot count;
- quarantined aggregate count;
- unresolved command count;
- outbox reconciliation backlog;
- projection rebuild lag;
- recovery retry count;
- oldest blocked recovery age.

Observability must not redefine runtime truth and must not leak learner-sensitive payloads.

---

## 37. Repository Verification Gate

Repository verification proves that the architecture and contracts are coherent in source control.

Required evidence includes:

- 17D exists under `docs/runtime/`;
- parent authorities 17A, 17B, and 17C are referenced correctly;
- event authority remains with 17C;
- snapshot authority is explicitly subordinate to event history;
- recovery states and refusal boundaries are defined;
- deterministic replay rules are explicit;
- corruption behavior fails closed;
- projection and outbox recovery are separated from aggregate truth;
- downstream Phase 18 ownership is not preempted;
- document is committed on the intended repository and branch.

Repository PASS does not prove executable recovery.

---

## 38. Runtime Verification Gate

Runtime verification requires an executable environment.

Required evidence should include tests for:

- full replay from version `0`;
- replay from a valid snapshot;
- invalid snapshot fallback;
- snapshot integrity failure;
- snapshot version incompatibility;
- contiguous event enforcement;
- duplicate event version refusal;
- event upcasting;
- deterministic repeated replay;
- idempotent accepted-command retry;
- unknown command outcome blocking;
- lease expiry recovery;
- optimistic concurrency conflict;
- outbox retry without duplicate aggregate events;
- projection rebuild idempotency;
- corruption quarantine;
- recovery audit record creation.

Runtime PASS does not prove production operational recovery.

---

## 39. Operational Verification Gate

Operational verification requires a running system and durable infrastructure.

Evidence should demonstrate at least one end-to-end recovery flow:

```text
Client command
  → application admission
  → aggregate transition
  → event persistence
  → snapshot creation or prior snapshot selection
  → forced interruption
  → process restart / ownership reacquisition
  → snapshot verification
  → incremental replay
  → incomplete command reconciliation
  → outbox reconciliation
  → projection restoration
  → API query
  → frontend resumes correct learner state
```

Operational PASS requires proof that:

- no accepted learning progress was lost;
- no transition was duplicated;
- no historical decision was recomputed under new policy;
- tenant isolation was preserved;
- projections converged with aggregate truth;
- recovery evidence was recorded;
- the learner could resume from the authoritative state.

---

## 40. Required Phase 18 Handoff

Phase 18 must define domain aggregates and value objects that make this recovery architecture executable.

The handoff must preserve:

- aggregate-specific initial state;
- event-application functions;
- aggregate version semantics;
- invariant validation after hydration;
- snapshot state representation;
- module ownership boundaries;
- command idempotency identity;
- runtime lifecycle state;
- corruption refusal behavior;
- policy-version evidence.

Phase 18 may refine aggregate-specific details but may not weaken the recovery doctrine established here.

---

## 41. Foundation Completion Criteria

Phase 17D is foundation-complete when the architecture clearly establishes that:

- accepted events are the durable source of runtime truth;
- snapshots are immutable derived replay checkpoints;
- restoration is deterministic;
- replay cannot repeat external side effects;
- incomplete command outcomes are resolved through durable evidence;
- idempotent retries survive process restarts;
- suspended runtimes resume through authority reacquisition and command admission;
- corrupted history is quarantined and fails closed;
- snapshot and event schema evolution are explicit;
- projections and outbox records have separate recovery boundaries;
- every recovery attempt is auditable;
- repository, runtime, and operational gates remain distinct.

---

## 42. Final Runtime Foundation Doctrine

The completed Runtime Foundation (17A–17D) establishes:

```text
17A defines the runtime authority and lifecycle.
17B defines specialized runtime module responsibilities.
17C defines immutable event evidence.
17D defines deterministic restoration from that evidence.
```

Together they enforce the final doctrine:

> Math Learning World may pause, crash, restart, migrate, retry, and rebuild without losing the meaning of learner progress, because accepted history remains immutable, snapshots remain subordinate, recovery remains deterministic, and every resumed transition must regain explicit authority.
