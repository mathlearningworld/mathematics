# 23C — Entity & Component Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23C
- Authority: Architecture documentation
- Scope: Entity identity, lifecycle, component ownership, runtime composition, mutation, projection, and invariants

## 1. Purpose

The Entity Runtime defines how meaningful things exist inside a loaded world.

An entity may represent:

- a player,
- an NPC,
- a placed block,
- a resource node,
- a tool,
- a trigger,
- a mission object,
- an environmental object,
- or a temporary world effect with semantic behavior.

The runtime must distinguish entity meaning from scene objects, sprites, physics bodies, and UI widgets.

## 2. Core Principle

> An entity is a stable world identity with governed state and capabilities; components describe owned aspects of that entity without becoming independent authorities.

A sprite is not an entity.

A physics body is not an entity.

A component bag is not a domain model by itself.

## 3. Entity Identity

Every entity has stable identity within one world instance.

```ts
interface EntityIdentity {
  entityId: string;
  entityType: string;
  worldId: string;
  instanceId?: string;
}
```

Rules:

- `entityId` is stable for the entity's authoritative lifetime.
- `entityType` identifies the behavioral family.
- `worldId` prevents cross-world reference contamination.
- `instanceId` may distinguish runtime materializations where needed.

Array index, sprite name, scene child index, and memory address are not valid entity identity.

## 4. Entity Categories

Entities are classified by authority and persistence.

### Durable entities

Examples:

- placed structures,
- persistent NPCs,
- player avatars,
- durable resource nodes.

### Session entities

Examples:

- temporary mission actors,
- session-specific obstacles,
- temporary tools.

### Ephemeral semantic entities

Examples:

- projectiles,
- timed area effects,
- simulation agents.

### Projection-only objects

Examples:

- particles,
- damage numbers,
- decorative sprites,
- cursor indicators.

Projection-only objects must not receive durable entity identity unless product meaning requires it.

## 5. Entity Record

Canonical runtime entity shape:

```ts
interface RuntimeEntity {
  identity: EntityIdentity;
  lifecycle: EntityLifecycleState;
  revision: number;
  components: ComponentMap;
  tags: ReadonlySet<string>;
}
```

The entity revision changes when canonical runtime state changes.

Projection-only animation changes do not necessarily change entity revision.

## 6. Lifecycle State Machine

```text
DECLARED
  → SPAWNING
  → ACTIVE
  → DISABLED
  → DESPAWNING
  → REMOVED
```

Optional recovery states:

```text
RESTORING
RECONCILING
FAULTED
```

Lifecycle semantics:

- `DECLARED`: identity and specification exist, but runtime services are not attached.
- `SPAWNING`: components are validated and indices are being registered.
- `ACTIVE`: entity may participate in permitted systems.
- `DISABLED`: entity remains present but cannot perform selected behaviors.
- `DESPAWNING`: new interactions are rejected and cleanup is underway.
- `REMOVED`: entity no longer participates in the loaded world.

## 7. Spawn Pipeline

Canonical spawn order:

```text
1. Validate world identity
2. Validate entity identity uniqueness
3. Resolve entity specification
4. Construct canonical components
5. Validate component dependencies
6. Register entity record
7. Register spatial footprint
8. Attach permitted systems
9. Build projection
10. Emit ENTITY_SPAWNED
11. Mark ACTIVE
```

A visible sprite must not appear as an actionable entity before registration succeeds.

## 8. Despawn Pipeline

```text
1. Mark DESPAWNING
2. Reject new intents against entity
3. Cancel or settle owned transient operations
4. Detach interaction focus
5. Remove from spatial indices
6. Dispose system subscriptions
7. Remove projection
8. Remove entity record or retain tombstone
9. Emit ENTITY_REMOVED
```

Despawn must be idempotent.

## 9. Component Model

Components hold one coherent aspect of entity state.

Examples:

```text
TransformComponent
SpatialFootprintComponent
MovementComponent
FacingComponent
InteractableComponent
PickupComponent
PlaceableComponent
InventoryCarrierComponent
HealthComponent
MissionSignalComponent
RenderableComponent
PersistenceComponent
```

A component contract includes:

- component type,
- schema version,
- owner entity identity,
- canonical data,
- mutation authority,
- persistence policy.

## 10. Component Ownership

Every component has one owning entity and one mutation authority.

Examples:

- Spatial Runtime mutates canonical transform after movement resolution.
- Inventory Runtime mutates inventory holdings.
- Interaction Runtime mutates effective focus state.
- Rendering adapters consume `RenderableComponent` but do not mutate domain state.

Multiple systems may read a component. Only the declared authority may write canonical state.

## 11. Component Dependency Rules

Component dependencies are explicit.

Examples:

```text
MovementComponent requires TransformComponent
PickupComponent requires InteractableComponent
PlaceableComponent requires SpatialFootprintComponent
RenderableComponent may require TransformComponent
```

Forbidden pattern:

```text
system assumes component exists because entityType usually has it
```

Required pattern:

```text
entity specification declares component set
runtime validates dependencies before activation
```

## 12. Entity Specifications

Entity types are instantiated from versioned specifications.

```ts
interface EntitySpecification {
  entityType: string;
  specificationVersion: string;
  componentFactories: ComponentFactory[];
  tags: string[];
  persistencePolicy: EntityPersistencePolicy;
}
```

Specifications define defaults and composition, but runtime state belongs to the entity instance.

Changing a specification does not silently mutate already durable entities without migration policy.

## 13. Tags and Capabilities

Tags support broad classification.

Examples:

```text
BUILD_MATERIAL
PICKUP_TARGET
SOLID
MISSION_RELEVANT
LEARNING_EVIDENCE_SOURCE
```

Capabilities express actionable contracts.

Examples:

```text
CAN_MOVE
CAN_BE_PICKED_UP
CAN_BE_PLACED
CAN_HOLD_INVENTORY
CAN_EMIT_MISSION_SIGNAL
```

Tags must not replace component validation.

A `PICKUP_TARGET` tag may help candidate discovery, but the pickup capability and current state determine whether pickup is valid.

## 14. Entity References

References must include identity context.

```ts
interface EntityReference {
  worldId: string;
  entityId: string;
  expectedRevision?: number;
}
```

Rules:

- References are resolved through the Entity Runtime.
- Systems must handle missing, removed, or revision-mismatched entities.
- Direct references to scene objects cannot cross runtime boundaries.

## 15. Mutation Model

Canonical mutation follows semantic transitions.

```text
intent or system signal
  → entity lookup
  → lifecycle validation
  → capability validation
  → rule evaluation
  → component transition
  → revision increment
  → dependent index update
  → semantic event
  → projection refresh
```

Components must not be mutated by arbitrary object assignment from unrelated scene code.

## 16. Transition Example: Pickup

```text
PICK_UP(targetId)
  → resolve target entity
  → require ACTIVE
  → require PickupComponent
  → validate spatial adjacency
  → validate inventory capacity
  → transition target to DESPAWNING or depleted state
  → transition inventory carrier holdings
  → emit RESOURCE_PICKED_UP
  → update projections
```

The target sprite disappearing is a result of the transition, not the transition itself.

## 17. Transition Example: Placement

```text
PLACE(itemType, candidate)
  → resolve player/inventory entity
  → validate Placeable specification
  → validate canonical spatial candidate
  → reserve inventory quantity
  → create entity identity
  → spawn placed entity
  → confirm inventory consumption
  → emit ENTITY_PLACED
```

On failure, reservation and predicted projection must be reconciled explicitly.

## 18. Entity Store

The Entity Store is indexed by stable identity.

Minimum operations:

```ts
interface EntityStore {
  get(reference: EntityReference): RuntimeEntity | undefined;
  has(reference: EntityReference): boolean;
  add(entity: RuntimeEntity): void;
  transition(command: EntityTransition): EntityTransitionResult;
  remove(reference: EntityReference): void;
  query(query: EntityQuery): RuntimeEntity[];
}
```

The store must prevent duplicate active identity.

## 19. Query Model

Entity queries are semantic and index-aware.

Examples:

```text
all ACTIVE entities with PickupComponent in region
all SOLID entities overlapping footprint
all mission-relevant entities with tag X
entity by stable identity
```

Query order must be deterministic when order affects gameplay.

## 20. System Attachment

Systems operate on eligible entities.

Attachment may be:

- declared by component presence,
- registered during spawn,
- resolved dynamically through queries.

Systems must not retain stale entity object references after removal.

Recommended approach:

```text
retain EntityReference
resolve current entity state when needed
```

## 21. Projection Bridge

The projection bridge maps entity state to scene objects.

```text
Runtime entity
  → projection descriptor
  → sprite/mesh/audio/label adapters
```

Projection responsibilities:

- create visual object,
- update transform and appearance,
- play semantic feedback,
- dispose visual resources.

Projection must not:

- invent entity identity,
- decide interaction validity,
- consume inventory,
- complete missions,
- or become persistence authority.

## 22. Physics Adapter

Where a physics engine is used, the physics body is an adapter owned by the entity projection or spatial integration layer.

Canonical flow:

```text
entity transform
  ↔ governed physics integration
  → resolved transform
  → canonical Spatial Runtime update
```

The architecture must declare whether physics is authoritative for a given movement mode.

Uncontrolled two-way synchronization is forbidden.

## 23. Persistence Policy

Each component declares persistence behavior:

```text
DURABLE
CHECKPOINTED
RECONSTRUCTED
EPHEMERAL
```

Examples:

- placed structure identity: `DURABLE`
- current player location: `CHECKPOINTED`
- spatial index membership: `RECONSTRUCTED`
- animation frame: `EPHEMERAL`

A durable entity snapshot stores only canonical state required for restoration.

## 24. Versioning and Migration

Entity and component schemas are versioned.

A restored snapshot may require:

- component migration,
- renamed entity type mapping,
- default insertion,
- removed capability handling,
- incompatible snapshot rejection.

Migration must be deterministic and testable.

## 25. Tombstones and Removed Entities

Durable systems may require tombstones to distinguish:

```text
never existed
removed
not loaded
unknown due to synchronization
```

Tombstones are not required for every ephemeral entity.

The persistence policy decides whether removal history must survive.

## 26. Concurrency and Revision Safety

When commands may race, entity revision supports expected-state validation.

```text
command expected revision = 12
current revision = 13
  → reject or re-evaluate
```

Optimistic client prediction must retain the base revision used for prediction.

## 27. Player Entity

The player is an entity but may be composed from multiple authorities:

- world-local transform,
- durable account identity,
- avatar appearance,
- world inventory projection,
- session permissions.

The Entity Runtime must not collapse account, learner profile, and avatar entity into one unrestricted object.

## 28. NPC Entities

NPC behavior state should be separated into:

- canonical identity and capabilities,
- simulation state,
- behavior controller state,
- presentation state.

An NPC animation state must not be used as the authoritative behavior state.

## 29. Resource Entities

Resource entities declare:

- resource type,
- quantity or depletion policy,
- pickup capability,
- respawn policy,
- persistence policy,
- evidence relevance where applicable.

A placed construction block and a loose pickup item may share a resource type but remain different entity types and capabilities.

## 30. Entity Events

Examples:

```text
ENTITY_DECLARED
ENTITY_SPAWNED
ENTITY_ENABLED
ENTITY_DISABLED
ENTITY_COMPONENT_CHANGED
ENTITY_DESPAWNING
ENTITY_REMOVED
ENTITY_RESTORED
```

Events include:

- world identity,
- entity identity,
- resulting revision,
- transition reason,
- correlation identifier where relevant.

## 31. Fault Handling

Entity faults are classified:

```text
SPECIFICATION_INVALID
COMPONENT_DEPENDENCY_MISSING
DUPLICATE_IDENTITY
INVALID_LIFECYCLE_TRANSITION
STALE_REVISION
PROJECTION_FAILURE
DISPOSAL_FAILURE
```

Projection failure may degrade one entity visually.

Canonical component or identity corruption must suspend affected gameplay mutation and emit diagnostics.

## 32. Entity Invariants

1. One active entity identity maps to one canonical runtime entity.
2. Every entity belongs to exactly one loaded world.
3. Every component belongs to one entity.
4. Canonical components have one declared mutation authority.
5. Component dependencies are validated before entity activation.
6. Removed entities cannot remain interaction targets.
7. Projection objects cannot outlive their entity without explicit detached-effect policy.
8. Entity revision increases monotonically for canonical mutations.
9. Spatial indices and projections are reconstructable from canonical entity state.
10. Persistent state excludes purely visual data.
11. Scene object identity never substitutes for entity identity.
12. Spawn and despawn are idempotent at their external boundaries.

## 33. Verification Expectations

Repository verification must confirm:

- entity identity contract,
- lifecycle state machine,
- component ownership,
- dependency validation,
- persistence classification,
- projection boundary,
- testable invariants.

Runtime verification must cover:

- duplicate identity rejection,
- valid spawn/despawn ordering,
- stale reference handling,
- component dependency failure,
- pickup and placement transitions,
- projection disposal,
- snapshot restoration,
- deterministic entity queries.

Operational verification must exercise:

```text
Spawn resource
  → focus resource
  → pick up resource
  → remove resource entity
  → update inventory entity
  → place new structure entity
  → save world
  → reload
  → restore stable identities and state
```

## 34. Architecture Decision

The Entity Runtime is established as the authoritative registry and lifecycle controller for meaningful world objects.

Components organize entity state by concern.

Systems govern mutations.

Spatial Runtime governs geometry.

Projection adapters render entities.

Persistence restores canonical meaning.

No scene object, sprite, patch, or physics body may independently become the entity authority.
