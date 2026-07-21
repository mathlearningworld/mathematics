# 23A — World Runtime Foundation

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23A
- Authority: Architecture documentation
- Scope: Runtime meaning, ownership, lifecycle, boundaries, and invariants of a playable world

## 1. Purpose

The World Runtime is the authoritative client-side execution environment for a loaded game world. It turns durable world state, player input, simulation rules, and presentation assets into a coherent playable experience.

The World Runtime is not the entire product runtime. It is a bounded runtime inside the Frontend Runtime defined in Chapter 22.

It owns the live meaning of:

- the currently loaded world,
- its entities and spatial state,
- active gameplay systems,
- simulation progression,
- player intent interpretation,
- transient prediction,
- world-local recovery,
- and the projection rendered by the game scene.

It does not own:

- account identity,
- curriculum authority,
- billing,
- durable server authorization,
- cross-world progression authority,
- or final mastery decisions.

## 2. Product Position

Math Learning World is not a menu that launches disconnected exercises. The world itself is the medium through which players observe, manipulate, build, compare, predict, and discover mathematical relationships.

Therefore the world must be treated as a governed runtime rather than a collection of scene scripts.

The architecture must support this sequence:

```text
Player enters world
  → World runtime restores a coherent world snapshot
  → Player observes and acts
  → Runtime interprets action as intent
  → World rules resolve consequences
  → Scene projects visible feedback
  → Evidence may be emitted for later learning interpretation
```

The world remains playable even when no explicit lesson overlay is active.

## 3. Core Principle

> The world is a deterministic meaning system; rendering is only one projection of that meaning.

A sprite position, ghost preview, pickup highlight, inventory count, or construction result must never become the hidden source of truth.

The runtime meaning must exist independently of its visual projection.

## 4. Runtime Boundary

The World Runtime begins when a world entry request has been accepted by the Frontend Runtime and ends when the world is unloaded or replaced.

### Inputs

- authenticated player context,
- selected world or zone identity,
- world snapshot,
- player profile projection,
- permitted capabilities,
- asset manifest,
- local recovery state,
- device and performance capabilities.

### Outputs

- render projection,
- audio and haptic cues,
- gameplay events,
- durable commands,
- local save checkpoints,
- learning evidence candidates,
- diagnostics and verification evidence.

### Forbidden authority

The World Runtime must not invent server-confirmed facts. It may predict, stage, or optimistically project a result, but must preserve the distinction between:

```text
predicted
confirmed
rejected
uncertain
```

## 5. World Runtime Composition

A loaded world is composed from explicit runtime services:

```text
WorldRuntime
├── WorldLifecycleController
├── WorldStateStore
├── SpatialRuntime
├── EntityRuntime
├── InteractionRuntime
├── ConstructionRuntime
├── InventoryRuntime
├── MissionRuntime
├── SimulationClock
├── PersistenceCoordinator
├── EvidenceEmitter
└── WorldProjectionBridge
```

Each service owns one runtime meaning. Scene code may consume these services but must not silently reimplement them.

## 6. World Identity

Every loaded world requires stable identity.

Minimum identity contract:

```ts
interface WorldIdentity {
  worldId: string;
  worldType: string;
  worldVersion: number;
  zoneId?: string;
  instanceId?: string;
}
```

Definitions:

- `worldId` identifies the durable world.
- `worldType` identifies the rule family.
- `worldVersion` identifies the durable revision loaded.
- `zoneId` identifies a spatial partition where applicable.
- `instanceId` identifies a temporary runtime instance.

A scene name is not a world identity.

## 7. Lifecycle State Machine

The runtime lifecycle is explicit:

```text
UNLOADED
  → PREPARING
  → LOADING_SNAPSHOT
  → HYDRATING
  → READY
  → ACTIVE
  → SUSPENDED
  → RECOVERING
  → UNLOADING
  → UNLOADED
```

Failure states:

```text
LOAD_FAILED
RUNTIME_FAULTED
RECOVERY_BLOCKED
SAVE_UNCERTAIN
```

### Lifecycle requirements

- No gameplay intent may execute before `READY`.
- Rendering may show loading projections before `READY`, but those projections cannot mutate world state.
- `ACTIVE` permits input and simulation.
- `SUSPENDED` freezes gameplay mutation while preserving resumable state.
- `RECOVERING` may rebuild projections and transient indices but must not duplicate durable consequences.
- `UNLOADING` rejects new player intents and flushes permitted checkpoints.

## 8. Bootstrap Sequence

The canonical bootstrap sequence is:

```text
1. Validate entry context
2. Resolve world identity
3. Load asset manifest
4. Load durable snapshot
5. Load pending local recovery record
6. Construct runtime services
7. Hydrate world state
8. Build spatial and entity indices
9. Reconcile pending intents
10. Build initial projection
11. Verify runtime invariants
12. Mark READY
13. Activate input and simulation
```

Input must not be enabled merely because the scene renderer has mounted.

## 9. World State Categories

World state is classified by authority and lifetime.

### Durable authoritative state

Examples:

- placed structures,
- harvested resources,
- durable inventory,
- unlocked world capabilities,
- mission completion accepted by authority.

### Runtime authoritative state

Examples:

- current entity transforms,
- active interaction focus,
- simulation phase,
- local world clock position,
- active tool intent.

### Predicted state

Examples:

- placement preview,
- anticipated pickup focus,
- pending construction result,
- provisional inventory delta.

### Projection-only state

Examples:

- animation frame,
- particle lifetime,
- camera shake,
- highlight opacity,
- tooltip visibility.

Projection-only state must never be used to reconstruct durable meaning.

## 10. Tick and Event Model

The World Runtime uses both ordered ticks and semantic events.

### Tick responsibilities

- advance simulation time,
- integrate movement,
- update spatial indices,
- resolve focus candidates,
- expire transient state,
- schedule projections.

### Event responsibilities

- represent semantic transitions,
- decouple systems,
- support diagnostics,
- produce replayable evidence where appropriate.

Examples:

```text
PLAYER_MOVED
INTERACTION_FOCUS_CHANGED
PLACEMENT_PREVIEW_CHANGED
RESOURCE_PICKUP_REQUESTED
ENTITY_PLACED
INVENTORY_CHANGED
MISSION_SIGNAL_EMITTED
WORLD_CHECKPOINT_CREATED
```

Events are not permission to create an ungoverned global event bus. Event ownership, payload contracts, ordering, and lifetime must remain explicit.

## 11. Determinism Policy

The world should be deterministic wherever product meaning depends on the result.

Deterministic areas include:

- target selection priority,
- placement validation,
- collision resolution rules,
- resource consumption,
- mission signal evaluation,
- save reconciliation.

Non-deterministic presentation may include:

- particles,
- cosmetic animation variation,
- ambient sound selection,
- decorative motion.

Random gameplay behavior must use a controlled seed when replay, testing, or evidence integrity requires reproducibility.

## 12. Runtime Ownership Rules

### Scene ownership

A scene owns:

- assembly of render objects,
- camera projection,
- visual effects,
- scene-local adapters.

A scene does not own:

- canonical interaction priority,
- durable inventory rules,
- mission completion authority,
- placement validity semantics.

### System ownership

A gameplay system owns one semantic responsibility and exposes a narrow contract.

### Module ownership

Feature modules retain ownership of their workflows. Shared code is permitted only for neutral primitives that do not leak feature policy.

## 13. Player Intent Pipeline

All meaningful player actions pass through a governed pipeline:

```text
Raw input
  → Input normalization
  → Player intent
  → Capability validation
  → World rule evaluation
  → Predicted consequence
  → Command or local transition
  → Confirmation/rejection
  → Projection update
```

Examples of player intent:

```text
MOVE(direction)
FOCUS(targetId)
PICK_UP(targetId)
PLACE(itemType, location)
USE_TOOL(toolId, target)
CONFIRM_ACTION(actionId)
CANCEL_ACTION(actionId)
```

Raw keyboard keys or pointer coordinates must not cross the semantic runtime boundary.

## 14. Pause, Suspend, and Resume

Pause is a gameplay state. Suspend is a runtime lifecycle state.

### Pause

- world remains loaded,
- selected systems may stop advancing,
- UI remains interactive,
- save may continue.

### Suspend

- input mutation stops,
- simulation stops,
- transient timers are checkpointed or discarded according to policy,
- runtime may release expensive resources,
- resume requires invariant verification.

Browser visibility changes, device sleep, route changes, and memory pressure may trigger suspension.

## 15. Recovery Model

Recovery follows this order:

```text
Restore durable snapshot
  → restore safe local checkpoint
  → reconcile pending commands
  → rebuild derived indices
  → discard invalid projections
  → verify invariants
  → resume
```

The runtime must never recover from a screenshot, sprite position, DOM state, or animation state.

Recovery records require:

- world identity,
- base durable version,
- checkpoint sequence,
- pending intent identifiers,
- creation timestamp,
- compatibility version.

## 16. Fault Containment

A fault in one projection or optional system must not automatically corrupt the entire world.

Fault classes:

```text
PROJECTION_FAULT
OPTIONAL_SYSTEM_FAULT
WORLD_RULE_FAULT
PERSISTENCE_FAULT
IDENTITY_MISMATCH
INVARIANT_VIOLATION
```

Policy:

- Projection faults may degrade visuals.
- Optional systems may be disabled with diagnostics.
- World-rule faults suspend mutation.
- Persistence uncertainty blocks destructive continuation when duplication is possible.
- Identity mismatch forces unload rather than cross-world contamination.

## 17. Performance Boundary

The world runtime must budget separately for:

- simulation,
- spatial queries,
- interaction resolution,
- rendering,
- asset streaming,
- persistence,
- diagnostics.

The simulation cannot depend on React render frequency, DOM layout, or frame-perfect UI scheduling.

Rendering may skip frames; world meaning must remain coherent.

## 18. Learning Boundary

The World Runtime emits evidence candidates but does not decide mastery.

Example:

```text
WORLD_EVENT:
  player created three equal groups of four objects

LEARNING INTERPRETATION:
  possible evidence related to multiplication and equal grouping
```

The world reports what happened. The future Discovery and Learning Engines interpret educational meaning.

This preserves the world's integrity as a playable system.

## 19. Minimum Runtime Contract

```ts
interface WorldRuntime {
  readonly identity: WorldIdentity;
  readonly status: WorldRuntimeStatus;

  prepare(input: WorldEntryInput): Promise<void>;
  activate(): void;
  suspend(reason: SuspendReason): Promise<void>;
  resume(): Promise<void>;
  dispatch(intent: PlayerIntent): IntentResult;
  createCheckpoint(reason: CheckpointReason): Promise<CheckpointResult>;
  unload(reason: UnloadReason): Promise<void>;
}
```

The implementation may vary, but these meanings must remain explicit.

## 20. World Invariants

The following invariants are mandatory:

1. One runtime instance has exactly one active world identity.
2. An entity belongs to exactly one loaded world instance.
3. Durable consequences are never inferred from render state.
4. Player intent cannot mutate an unloaded, loading, suspended, or faulted world.
5. Predicted state is distinguishable from confirmed state.
6. Recovery never duplicates an accepted durable command.
7. Spatial, entity, and inventory references cannot silently cross world identity.
8. Scene disposal releases listeners, timers, subscriptions, and transient indices.
9. Learning interpretation cannot rewrite world history.
10. World verification must be possible without visual inspection alone.

## 21. Verification Expectations

Repository verification must confirm:

- lifecycle contract exists,
- ownership boundaries are documented,
- world identity is explicit,
- prediction and confirmation states are distinguishable,
- recovery inputs are defined,
- invariants are testable.

Runtime verification must confirm:

- bootstrap order,
- input gating,
- suspend/resume behavior,
- deterministic target selection,
- disposal behavior,
- recovery without duplicate consequences.

Operational verification must confirm a real loop:

```text
Enter world
  → move
  → focus
  → interact
  → checkpoint
  → suspend
  → resume
  → continue coherently
```

## 22. Architecture Decision

The World Runtime is established as a first-class bounded runtime beneath the Frontend Runtime and above individual scenes.

Scenes project the world.

Gameplay systems interpret and mutate world meaning.

Persistence preserves accepted world history.

Future Discovery and Learning Engines consume evidence from the world without becoming the owner of world rules.
