# 23J — World Verification & Runtime Invariants

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23J
- Authority: Architecture documentation
- Scope: Cross-runtime invariants, verification layers, evidence, failure classification, recovery checks, and Chapter 23 completion criteria

## 1. Purpose

The World Verification Runtime defines how Math Learning World proves that its world remains semantically correct while gameplay systems evolve.

It unifies verification across:

- world lifecycle,
- spatial and coordinate rules,
- entity identity and components,
- interaction and intent,
- construction and environment mutation,
- inventory and resources,
- missions and progression,
- simulation and time,
- save, persistence, and replay.

## 2. Core Principle

> A world is correct when authoritative state, transitions, evidence, and projections agree under explicit invariants—not merely when the scene appears to work.

Visual success is useful human evidence, but it is not sufficient proof of runtime correctness.

## 3. Verification Layers

### Layer A — Static Architecture Verification

Proves that runtime ownership and boundaries are represented correctly.

Examples:

- public contracts exist,
- modules do not bypass authority,
- scene code does not own durable state,
- component mutation has one writer,
- persistence models carry versions.

### Layer B — Runtime Contract Verification

Proves commands, transitions, policies, and failures.

Examples:

- illegal lifecycle transitions are rejected,
- duplicate commands are idempotent,
- placement and inventory commit atomically,
- target resolution is deterministic.

### Layer C — Simulation Verification

Proves behavior across ticks, timing, pause, resume, and replay.

### Layer D — Operational Flow Verification

Proves the complete player path through input, world mutation, persistence, projection, and recovery.

### Layer E — Human Experience Verification

Confirms that focus, feedback, pacing, and interaction feel understandable and natural to a player.

Human experience verification cannot replace the earlier layers.

## 4. Authority Map

```text
Input Authority               → Input Adapter
Intent Authority              → Interaction Runtime
Target Authority              → Spatial + Interaction Policy
Entity Authority              → Entity Runtime
Placement Authority           → Construction Runtime
Resource Authority            → Inventory Runtime
Mission Authority             → Mission Runtime
Time Authority                → Simulation Runtime
Durability Authority          → Persistence Runtime
Projection Authority          → Frontend/Scene Projection
```

Verification must detect unauthorized writes across these boundaries.

## 5. World-Level Invariants

1. Every active world has one stable world identity.
2. World lifecycle transitions are explicit and legal.
3. Canonical world state is independent from scene object lifetime.
4. World revision moves forward monotonically.
5. Uncertain mutations are not projected as confirmed facts.
6. Recovery always begins from known durable evidence.
7. A world cannot become ACTIVE until required subsystems are consistent.

## 6. Spatial Invariants

1. World, grid, screen, collision, interaction, and placement spaces are distinct.
2. Coordinate conversion is explicit and testable.
3. Sprite origin is not collision authority.
4. Pickup range uses governed semantic geometry.
5. Placement preview and final placement share the same candidate geometry.
6. Occupancy is decided by semantic policy, not pixel overlap alone.
7. Candidate ordering is deterministic.
8. Focus stability prevents uncontrolled target oscillation.

## 7. Entity Invariants

1. Entity identity is not an array index, sprite name, or memory address.
2. Durable entities survive scene reload.
3. Projection-only objects do not gain durable identity accidentally.
4. Components have explicit ownership and dependencies.
5. Each canonical field has one mutation authority.
6. Despawn clears required spatial and occupancy references.
7. Stale references fail safely.
8. Entity revision changes only for canonical state mutation.

## 8. Interaction Invariants

1. Input is translated into intent before world mutation.
2. Explicit player intent outranks contextual automation.
3. Target selection is deterministic for the same world state.
4. Focus acquisition and loss follow stable policy.
5. Contextual tool selection never invents capability.
6. Rejected interactions return structured reasons.
7. Animation completion is not command confirmation.
8. The same accepted interaction cannot apply twice.

## 9. Construction Invariants

1. Construction is a world transaction, not sprite creation.
2. Placement validation uses the same candidate shown by the preview.
3. Occupancy reservation and entity creation cannot diverge silently.
4. Resource consumption and placement commit atomically.
5. Removal clears entity, occupancy, collision, and indexes.
6. Replacement follows explicit atomic policy.
7. Environment queries do not inspect rendered pixels.
8. Construction evidence records actor, target, result, and revision.

## 10. Inventory and Resource Invariants

1. Inventory is a resource ledger, not toolbar state.
2. Selected slot does not prove resource availability.
3. Resource balances cannot become negative unless the domain explicitly supports debt.
4. Pickup removes world ownership exactly once.
5. Drop or placement transfers ownership exactly once.
6. Stack compatibility is explicit.
7. Reservations prevent double spending.
8. Automatic fallback selection cannot choose an unavailable resource.
9. Selection memory is workflow assistance, not resource authority.
10. Resource conservation holds across world and inventory boundaries.

## 11. Mission and Progression Invariants

1. UI state cannot award objective progress.
2. Mission progress is evidence-driven.
3. Duplicate evidence cannot count twice.
4. Completion and rewards cannot diverge silently.
5. Progression unlocks have traceable sources.
6. Definition version is preserved per mission instance.
7. Branch choice is explicit and durable.
8. Infrastructure failure is not mission failure.
9. Shared mission contributions follow declared ownership policy.
10. Mission Runtime does not define mathematical truth.

## 12. Simulation and Time Invariants

1. Render frame rate does not change authoritative outcomes.
2. World rules do not read uncontrolled wall-clock time.
3. Tick phase ordering is stable.
4. Scheduled actions are idempotent.
5. Pause policy is explicit per subsystem.
6. Resume applies bounded catch-up policy.
7. Authoritative randomness is governed and replayable where required.
8. Long offline periods cannot cause unbounded work.
9. Timer projection derives from canonical timing state.
10. Degraded performance cannot silently corrupt meaning.

## 13. Persistence and Replay Invariants

1. Scene serialization is not the canonical save format.
2. Every save has identity, revision, version, and integrity evidence.
3. Multi-authority durable mutations are atomic or recoverable.
4. Retried mutations cannot duplicate effects.
5. Snapshot and event cursor form one coherent checkpoint.
6. Conflict outcomes are explicit.
7. Migration preserves rollback evidence until confirmation.
8. Corrupted saves are quarantined.
9. Replay uses governed inputs, time, and randomness.
10. Sensitive learning evidence is separated according to policy.

## 14. Verification Matrix

```ts
interface RuntimeVerificationCase {
  caseId: string;
  subsystem: string;
  invariantIds: string[];
  setup: string;
  action: string;
  expectedState: string;
  expectedEvents: string[];
  expectedProjection?: string;
  evidenceArtifacts: string[];
}
```

Each critical invariant should map to at least one executable or human-observable verification case.

## 15. Deterministic Scenario Testing

A deterministic scenario specifies:

- initial world snapshot,
- accepted command sequence,
- fixed clock steps,
- random seed,
- expected events,
- expected final canonical state,
- expected projection checkpoints.

Examples:

- pick up a placed block at adjacent range,
- restore the next available build material,
- place repeatedly until material exhaustion,
- approach another pickup target and temporarily switch tool,
- leave its range and return to pending placement intent,
- suspend between reservation and confirmation,
- replay the same command stream and compare checksums.

## 16. Property-Based Verification

Useful properties include:

- resources are conserved,
- world revision never decreases,
- duplicate mutation IDs do not change state twice,
- entity IDs remain unique per world,
- placement never overlaps governed occupancy,
- no active mission references missing objectives,
- replay of the same governed inputs produces equivalent canonical state.

## 17. Fault Injection

Verification should inject failures at critical boundaries.

Examples:

- persistence timeout after local mutation,
- process termination during save,
- duplicate event delivery,
- stale expected revision,
- missing entity during focus resolution,
- occupancy reservation conflict,
- inventory commit rejection,
- corrupted snapshot checksum,
- long background suspension,
- unsupported migration version.

The expected outcome must be safe rejection, uncertainty, recovery, or quarantine—not silent corruption.

## 18. Recovery Verification

Recovery cases must prove:

```text
Known Confirmed State
  + Pending/Uncertain Evidence
    → Deterministic Resolution
      → Valid Invariants
        → Resume or Quarantine
```

A successful wake-up, route render, or scene mount does not prove recovery completion.

## 19. Projection Consistency

Projection tests should verify that:

- selected material exists and is usable,
- focus corresponds to the authoritative target,
- ghost preview corresponds to the placement candidate,
- inventory counts match canonical balances,
- mission progress matches evidence state,
- save status reflects confirmed durability.

Projection mismatch must not mutate canonical state to make the UI appear correct.

## 20. Gameplay Regression Contract

Current Builders Valley interaction loop should retain these behaviors:

```text
Approach pickup-capable target
  → contextual pickup tool becomes active
  → pickup accepted at governed adjacent range
  → acquired resource becomes placement intent
  → valid adjacent ghost appears
  → placement consumes one resource
  → next available material is restored
  → contextual target may temporarily override selection
  → leaving context restores pending build workflow
```

This loop is a verification scenario, not a source of hidden architecture policy.

## 21. Evidence Package

A verification result should identify:

- repository commit SHA,
- runtime version,
- test or scenario ID,
- initial state reference,
- command/event trace,
- final state checksum,
- logs or screenshots where relevant,
- failures and recovery outcomes,
- human validation status.

## 22. Failure Classification

Failures should be classified rather than collapsed into “gameplay bug.”

Suggested classes:

- AUTHORITY_VIOLATION
- ILLEGAL_TRANSITION
- SPATIAL_MISMATCH
- TARGET_INSTABILITY
- RESOURCE_DIVERGENCE
- OCCUPANCY_DIVERGENCE
- DUPLICATE_EFFECT
- TIME_NONDETERMINISM
- PERSISTENCE_UNCERTAIN
- REPLAY_DIVERGENCE
- PROJECTION_MISMATCH
- EXPERIENCE_FRICTION

## 23. Verification Gates

### Repository Gate

Confirms architecture, contracts, ownership, exports, snapshots, and verifier wiring.

### Runtime Gate

Confirms executable tests, build, type checks, simulation cases, and persistence adapters.

### Operational Gate

Confirms real browser/device flow through world runtime, storage, recovery, and UI projection.

A Repository PASS must not be reported as Operational PASS.

## 24. Chapter 23 Completion Criteria

Chapter 23 is architecturally complete when:

- 23A–23J exist and agree on authority boundaries,
- cross-runtime terms are consistent,
- no subsystem relies on scene or UI as canonical authority,
- critical workflows map to explicit invariants,
- persistence and recovery are defined,
- verification gates are separated,
- future Discovery and Learning Engines can consume world evidence without owning world mutation.

## 25. Handoff to Discovery Engine

The next architecture chapter may build on these outputs:

- stable world events,
- interaction evidence,
- construction and resource transitions,
- mission evidence references,
- deterministic simulation context,
- replayable histories,
- verified world invariants.

Discovery Engine should interpret meaningful patterns from world experience while respecting World Runtime authority.

## 26. Architectural Outcome

This slice closes Chapter 23 by turning the world architecture into a verifiable runtime contract.

The result is not merely a catalog of systems. It is a coherent authority model in which gameplay may evolve rapidly while identity, resources, time, progression, persistence, and player intent remain testable and recoverable.