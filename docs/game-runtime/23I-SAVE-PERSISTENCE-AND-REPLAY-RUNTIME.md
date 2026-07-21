# 23I — Save, Persistence & Replay Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23I
- Authority: Architecture documentation
- Scope: Save boundaries, durable world state, snapshots, event history, replay, recovery, migration, and runtime invariants

## 1. Purpose

The Save, Persistence & Replay Runtime defines how world meaning survives process termination, device change, scene teardown, network interruption, and version evolution.

It governs:

- what must be durable,
- when state is considered confirmed,
- how snapshots and events relate,
- how uncertain writes recover,
- how a world resumes,
- how replay is bounded,
- and how stored state evolves safely across versions.

## 2. Core Principle

> Persistence preserves authoritative world meaning, not incidental scene objects or presentation state.

A save operation must not serialize the scene graph and call that the world.

## 3. Persistence Boundary

Durable data may include:

- world identity and revision,
- durable entities and components,
- inventory and resource ledgers,
- construction occupancy,
- mission and progression state,
- world clock and scheduled actions,
- discovery or learning evidence references,
- player position when product policy requires it,
- definition and schema versions.

Projection-only state should normally remain transient.

## 4. Save Model

```ts
interface WorldSaveManifest {
  saveId: string;
  worldId: string;
  ownerId: string;
  worldRevision: number;
  schemaVersion: number;
  contentVersion: number;
  snapshotRef: string;
  eventCursor?: string;
  checksum: string;
  createdAt: string;
}
```

The manifest identifies one coherent durable checkpoint.

## 5. Confirmed, Pending, and Uncertain State

The runtime must distinguish:

```text
PENDING
  → CONFIRMED
  → SUPERSEDED

PENDING
  → UNCERTAIN
    → CONFIRMED or REJECTED through recovery
```

A successful local animation or UI message is not proof of durable confirmation.

## 6. Snapshot Strategy

A snapshot is a coherent representation of authoritative state at a known revision.

```ts
interface WorldSnapshot {
  worldId: string;
  revision: number;
  clock: PersistedWorldClock;
  entities: PersistedEntity[];
  inventories: PersistedInventory[];
  missions: PersistedMission[];
  progression: PersistedProgression[];
  scheduler: PersistedSchedule[];
  metadata: SnapshotMetadata;
}
```

Snapshots must be internally consistent and validated before activation.

## 7. Event History

Event history may supplement snapshots for:

- audit,
- recovery,
- replay,
- debugging,
- synchronization,
- evidence lineage.

Events must have stable identity, ordering, aggregate reference, and version.

```ts
interface PersistedWorldEvent {
  eventId: string;
  worldId: string;
  aggregateId: string;
  aggregateRevision: number;
  sequence: number;
  eventType: string;
  payloadVersion: number;
  occurredAt: string;
}
```

## 8. Snapshot Plus Event Tail

Recommended loading model:

```text
Load Latest Valid Snapshot
  → Validate Manifest and Checksum
    → Read Events After Snapshot Cursor
      → Replay Event Tail
        → Validate Invariants
          → Activate World
```

Replay should be bounded by snapshot frequency and operational budgets.

## 9. Transaction Boundaries

Mutations spanning multiple authorities must commit coherently.

Examples:

- place entity + consume inventory + reserve occupancy,
- pickup entity + remove occupancy + add inventory,
- complete mission + grant reward + unlock progression,
- scheduled action + world mutation + event emission.

The persistence design must support atomic commit or explicit compensating recovery.

## 10. Optimistic Concurrency

Durable writes should include expected revision.

```ts
interface PersistWorldCommand {
  worldId: string;
  expectedRevision: number;
  mutationId: string;
  correlationId: string;
}
```

Conflicts must be surfaced as structured outcomes, not overwritten silently.

## 11. Idempotency

Every durable mutation that may be retried requires stable identity.

Rules:

- the same mutation ID cannot apply twice,
- retry must return the prior committed result where possible,
- recovery must not duplicate inventory, rewards, or world entities,
- event append must not fork aggregate history silently.

## 12. Autosave Policy

Autosave may be triggered by:

- durable world mutation,
- mission transition,
- checkpoint,
- elapsed time,
- application backgrounding,
- explicit player request.

Autosave frequency must balance durability, cost, and interruption risk.

A debounce timer must not become the only guarantee for critical mutations.

## 13. Save Barriers

Certain actions may require a save barrier before continuation.

Examples:

- leaving a world,
- entering a destructive migration,
- transferring ownership,
- consuming a unique resource,
- completing a major mission.

```text
Request Barrier
  → Flush Pending Mutations
    → Confirm Durable Revision
      → Continue Transition
```

## 14. Crash Recovery

Recovery pipeline:

```text
Detect Unclean Shutdown
  → Load Last Confirmed Manifest
    → Inspect Pending Journal
      → Resolve Idempotent Mutations
        → Validate World Invariants
          → Resume or Quarantine
```

Corrupted or ambiguous state must not be activated as if healthy.

## 15. Local and Remote Persistence

The architecture may support:

- local-only saves,
- remote authoritative saves,
- local cache of remote worlds,
- eventual synchronization.

Authority must be explicit per deployment mode.

Local cache must not silently override a newer remote revision.

## 16. Synchronization

Synchronization requires:

- world identity,
- revision comparison,
- mutation identity,
- conflict policy,
- durable acknowledgements,
- resumable transfer.

Blind last-write-wins is unsafe for inventory, progression, and constructed worlds unless product policy explicitly accepts loss.

## 17. Conflict Handling

Possible conflict outcomes:

- fast-forward local state,
- reject stale mutation,
- rebase supported command,
- require user choice,
- fork world intentionally,
- quarantine inconsistent save.

Conflict handling must preserve evidence and never invent a merged state from incompatible histories without policy.

## 18. Save Slots and World Copies

A save slot is a reference to a world lineage, not merely a file name.

Copying a world should create explicit lineage metadata.

```ts
interface WorldLineage {
  worldId: string;
  parentWorldId?: string;
  forkedFromRevision?: number;
  createdBy: string;
  reason: string;
}
```

## 19. Replay

Replay may serve several purposes:

- deterministic debugging,
- player-visible history,
- evidence review,
- synchronization recovery,
- simulation validation.

Not every presentation detail must replay identically.

Replay authority focuses on semantic world outcomes.

## 20. Replay Inputs

A replayable session may require:

- initial snapshot,
- accepted commands,
- authoritative random seeds,
- event order,
- definition versions,
- clock steps,
- external decisions.

Uncontrolled device time and presentation randomness must not influence replayed authoritative outcomes.

## 21. Replay Validation

Replay should produce checkpoints such as:

- world revision,
- entity count and identities,
- inventory balances,
- mission states,
- progression states,
- checksums of canonical state.

Divergence must identify the earliest mismatched tick or mutation.

## 22. Schema and Content Versioning

Persistence must distinguish:

- storage schema version,
- domain model version,
- world content version,
- mission definition version,
- entity specification version.

These versions evolve independently and must not be collapsed into one ambiguous application version.

## 23. Migration

Migration pipeline:

```text
Read Old Manifest
  → Verify Supported Source Version
    → Transform Snapshot and Event Payloads
      → Validate Invariants
        → Write New Checkpoint
          → Preserve Rollback Reference
```

Migrations must be deterministic, testable, and non-destructive until the new checkpoint is confirmed.

## 24. Corruption Detection

Use checksums, referential validation, and invariant checks to detect:

- missing entities,
- orphan occupancy,
- negative resource balances,
- broken mission references,
- invalid scheduler entries,
- revision gaps,
- incompatible versions.

## 25. Quarantine and Repair

When a save cannot be trusted, the runtime may enter quarantine.

Quarantine should preserve:

- original artifacts,
- detected failures,
- attempted repairs,
- repair version,
- user-visible status.

Repair must never silently discard durable player meaning.

## 26. Privacy and Security Boundary

Save data may contain player identity, learning evidence, social relationships, or child-related records.

Persistence policy must support:

- least-data storage,
- access control,
- encryption where required,
- deletion and retention policy,
- separation of gameplay state from sensitive learning records.

## 27. Observability

Persistence telemetry should expose:

- pending mutation count,
- last confirmed revision,
- save latency,
- snapshot size,
- event-tail length,
- retry count,
- conflict count,
- migration version,
- recovery outcome.

## 28. Runtime Invariants

1. A scene graph is never the canonical save model.
2. Every activated save has verified identity, version, and integrity.
3. Durable multi-system mutations cannot diverge silently.
4. Retried mutations cannot duplicate effects.
5. Conflicts are explicit and traceable.
6. Snapshot revision and event cursor form a coherent checkpoint.
7. Migration preserves rollback evidence until confirmation.
8. Replay uses governed time and randomness.
9. Corrupted saves are quarantined rather than trusted.
10. Sensitive learning data is not mixed casually into world state.

## 29. Verification Targets

Verification must cover:

- snapshot round-trip,
- event-tail replay,
- expected-version conflicts,
- duplicate mutation retry,
- crash during commit,
- unclean shutdown recovery,
- local/remote revision conflict,
- migration rollback,
- corruption detection,
- deterministic replay checkpoints.

## 30. Architectural Outcome

This slice establishes persistence as a governed continuity mechanism for world meaning.

It enables reliable resume, recovery, migration, and replay without allowing scene serialization, UI state, or last-write-wins behavior to become hidden durability policy.