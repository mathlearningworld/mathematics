# 23E — Construction & Environment Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23E
- Authority: Architecture documentation
- Scope: Placement, occupancy, construction mutation, environment state, preview, validation, removal, replacement, and invariants

## 1. Purpose

The Construction Runtime defines how the player changes the physical and semantic structure of the world.

It governs:

- placing blocks and objects,
- validating candidate positions,
- showing placement previews,
- reserving and releasing occupancy,
- replacing or removing constructed entities,
- updating navigation and collision consequences,
- synchronizing world, inventory, and projection state,
- recovering from interrupted construction operations.

## 2. Core Principle

> Construction is an authoritative world mutation, not a visual spawn operation.

A ghost preview, sprite, physics body, or scene child cannot independently define that placement succeeded.

## 3. Runtime Position

```text
Player Intent
    ↓
Placement Candidate Resolver
    ↓
Construction Policy
    ↓
Resource Reservation
    ↓
World Mutation
    ↓
Spatial / Collision / Occupancy Update
    ↓
Projection
```

## 4. Construction Authority

The Construction Runtime owns canonical decisions about:

- whether a location is buildable,
- what footprint is occupied,
- whether replacement is allowed,
- which resources are consumed,
- which entity is created or removed,
- what world revision results.

The scene may request and project construction, but does not own these decisions.

## 5. Construction Intent

```ts
interface ConstructionIntent {
  intentId: string;
  actorEntityId: string;
  kind: 'PLACE' | 'REMOVE' | 'REPLACE' | 'ROTATE' | 'UPGRADE';
  constructionTypeId?: string;
  targetEntityId?: string;
  requestedPoint?: WorldPoint;
  requestedOrientation?: number;
  inventoryRef?: InventoryReference;
  createdAt: number;
}
```

## 6. Placement Candidate

A placement candidate is the single semantic description shared by preview and commit.

```ts
interface PlacementCandidate {
  candidateId: string;
  worldPoint: WorldPoint;
  gridAnchor?: GridPoint;
  orientation: number;
  footprint: SpatialFootprint;
  supportFootprint?: SpatialFootprint;
  expectedWorldRevision: number;
  validity: PlacementValidity;
}
```

## 7. Candidate Authority

The same placement candidate must drive:

- ghost position,
- validity feedback,
- collision check,
- occupancy check,
- placement command payload,
- final entity spawn location.

The preview must not round, offset, snap, or transform the point differently from the committed placement.

## 8. Placement Geometry

Placement geometry is derived from declared spatial rules, not sprite dimensions.

Inputs may include:

- actor collision footprint,
- actor facing,
- construction footprint,
- allowed placement distance,
- grid or free-placement policy,
- world bounds,
- support surfaces,
- neighboring occupancy.

For adjacent placement, the anchor should derive from the actor collision edge plus the construction footprint offset.

## 9. Coordinate Conversion

Conversion order must be explicit:

```text
Actor collision geometry
    ↓
World-space candidate
    ↓
Optional grid snap
    ↓
Footprint projection
    ↓
Validation
```

Screen coordinates are never stored as authoritative placement coordinates.

## 10. Occupancy Model

Occupancy describes which semantic regions of the world are reserved by entities.

```ts
interface OccupancyRecord {
  entityId: string;
  footprint: SpatialFootprint;
  layer: OccupancyLayer;
  blockingMode: 'exclusive' | 'shared' | 'decorative';
  worldRevision: number;
}
```

Suggested occupancy layers:

- terrain,
- structure,
- resource,
- actor,
- interaction,
- decoration.

Different layers may overlap according to explicit policy.

## 11. Occupancy Authority

The occupancy registry is canonical for placement conflicts.

Physics overlap may provide evidence, but physics state alone is not sufficient because:

- bodies may be delayed,
- bodies may be disabled,
- semantic occupancy may exceed collision bounds,
- non-colliding objects may still reserve space.

## 12. Placement Validation

Validation is a composed decision.

```ts
interface PlacementValidity {
  allowed: boolean;
  reasons: PlacementRefusal[];
  warnings: PlacementWarning[];
}
```

Checks may include:

1. world bounds,
2. actor placement range,
3. footprint validity,
4. occupancy conflict,
5. support requirement,
6. terrain compatibility,
7. orientation rule,
8. inventory availability,
9. mission restriction,
10. world lifecycle state,
11. structural dependency,
12. expected revision.

## 13. Refusal Model

```ts
interface PlacementRefusal {
  code: string;
  category: 'geometry' | 'occupancy' | 'support' | 'resource' | 'authority' | 'state';
  recoverable: boolean;
  conflictingEntityId?: string;
}
```

The runtime must preserve refusal evidence for UI and diagnostics.

## 14. Ghost Preview

The ghost preview is a projection of one placement candidate.

It may show:

- valid or invalid state,
- footprint outline,
- orientation,
- support requirement,
- occupied conflict,
- resource shortage.

It must not:

- invent a second position,
- mutate occupancy,
- consume resources,
- create durable entities,
- become evidence of success.

## 15. Preview Stability

Preview movement should be stable under small input changes.

Recommended controls:

- deterministic snap,
- stable facing direction,
- candidate hysteresis where needed,
- fixed tie-breakers,
- no dependence on render interpolation.

## 16. Occupied Candidate Reinterpretation

When a valid adjacent placement point is occupied, the runtime may expose the occupant as an interaction target.

```text
Candidate occupied
    + occupant pickup-capable
    + actor within pickup range
        ↓
Construction refusal + pickup focus suggestion
```

Construction must still refuse the placement unless replacement policy explicitly allows it.

## 17. Construction Command

```ts
interface PlaceConstructionCommand {
  commandId: string;
  actorEntityId: string;
  constructionTypeId: string;
  candidate: PlacementCandidate;
  sourceInventoryRef: InventoryReference;
  expectedInventoryRevision: number;
  expectedWorldRevision: number;
  issuedAt: number;
}
```

## 18. Atomic Placement

A successful placement must atomically coordinate:

- inventory resource deduction,
- entity identity allocation,
- entity creation,
- occupancy registration,
- world revision update,
- construction event emission.

No partial result may appear as committed success.

## 19. Placement Transaction

```text
VALIDATE
    ↓
RESERVE RESOURCE
    ↓
RESERVE OCCUPANCY
    ↓
CREATE ENTITY
    ↓
COMMIT WORLD + INVENTORY
    ↓
EMIT EVENT
    ↓
PROJECT
```

Failure before commit releases all reservations.

## 20. Construction Entity Specification

A construction type is defined by specification.

```ts
interface ConstructionSpecification {
  constructionTypeId: string;
  entityType: string;
  footprint: SpatialFootprint;
  supportPolicy: SupportPolicy;
  occupancyPolicy: OccupancyPolicy;
  resourceCost: ResourceCost[];
  defaultComponents: ComponentDefinition[];
  allowedOrientations?: number[];
  removable: boolean;
  replaceable: boolean;
}
```

Specifications are data authority; scene prefab names are projection details.

## 21. Environment Runtime

The Environment Runtime represents world conditions that affect construction and simulation.

Examples:

- terrain type,
- elevation,
- water,
- temperature zone,
- light state,
- hazard state,
- protected region,
- mission-specific region rules.

Environment state must be queryable without inspecting rendered pixels.

## 22. Environment Region

```ts
interface EnvironmentRegion {
  regionId: string;
  footprint: SpatialFootprint;
  attributes: Readonly<Record<string, unknown>>;
  revision: number;
}
```

Regions may overlap when their attributes belong to different semantic layers.

## 23. Support Policy

Some constructions require support.

Examples:

- a block must touch valid terrain,
- a bridge segment must connect to another support,
- an object must stand on a stable surface,
- a wall must align to an allowed edge.

Support is checked from semantic footprints and structure relations, not only collision contact.

## 24. Structural Relations

```ts
interface StructuralRelation {
  fromEntityId: string;
  toEntityId: string;
  kind: 'supports' | 'attached-to' | 'contains' | 'connected-to';
}
```

Structural relations are updated with construction mutations and validated before destructive removal.

## 25. Removal Intent

Removal is a governed world mutation.

Validation may require:

- target is removable,
- actor is in range,
- no protected mission dependency exists,
- dependent structures remain valid or are handled,
- inventory destination can accept returned resources,
- expected entity revision matches.

## 26. Removal Transaction

```text
VALIDATE TARGET
    ↓
LOCK ENTITY
    ↓
RESOLVE DEPENDENCIES
    ↓
REMOVE OCCUPANCY
    ↓
DESPAWN ENTITY
    ↓
RETURN OR DISCARD RESOURCES
    ↓
COMMIT
```

The policy must explicitly define whether removal returns full, partial, or no resources.

## 27. Replacement

Replacement is not implemented as unrelated remove then place operations unless the runtime can guarantee atomicity.

A replacement command should validate:

- target replaceability,
- new footprint compatibility,
- resource delta,
- preserved relationships,
- resulting occupancy,
- resulting entity identity policy.

## 28. Entity Identity During Replacement

The product must choose one explicit rule:

- preserve entity identity and change specification,
- create a new entity and tombstone the old entity.

The choice depends on whether the world considers the replacement the same meaningful object.

## 29. Rotation and Reorientation

Rotation is a mutation when it changes:

- footprint,
- collision,
- interaction geometry,
- structural relations,
- environment effects.

Rotation must revalidate occupancy before commitment.

## 30. Navigation and Collision Integration

After committed construction changes, adapters may update:

- physics bodies,
- navigation meshes or grids,
- pathfinding blockers,
- interaction indexes,
- render layers.

These adapters project committed state and must not race ahead as canonical truth.

## 31. World Revision

Every committed construction mutation increments or advances the relevant world revision.

Commands containing stale world or entity revisions must be rejected or revalidated.

## 32. Concurrency

Two construction commands must not reserve overlapping exclusive occupancy simultaneously.

A reservation model may use:

```ts
interface ConstructionReservation {
  reservationId: string;
  commandId: string;
  footprint: SpatialFootprint;
  expiresAt: number;
}
```

Reservations are temporary and never projected as durable structures.

## 33. Save and Load

Durable construction state includes at minimum:

- entity identity,
- construction type,
- transform,
- orientation,
- component state,
- occupancy footprint or enough data to rebuild it,
- structural relations,
- entity revision.

On load, occupancy and spatial indexes are rebuilt before the world becomes active.

## 34. Recovery

For uncertain placement or removal:

1. stop conflicting construction commands,
2. reload authoritative world and inventory revisions,
3. determine whether entity creation or removal committed,
4. rebuild occupancy,
5. reconcile resource balances,
6. recreate projection,
7. resume only after invariants pass.

## 35. Event Model

Suggested events:

- `PlacementCandidateResolved`
- `ConstructionPlacementRefused`
- `ConstructionPlaced`
- `ConstructionRemoved`
- `ConstructionReplaced`
- `ConstructionRotated`
- `OccupancyChanged`
- `StructuralRelationChanged`

Events describe committed meaning, not animation frames.

## 36. Learning Boundary

Construction produces rich learning evidence:

- spatial arrangement,
- repeated measurement,
- symmetry,
- area and perimeter use,
- quantity planning,
- structural reasoning.

The Construction Runtime emits factual world events.

Discovery and Learning systems interpret those events without controlling construction validity.

## 37. Diagnostics

Minimum diagnostics include:

- requested point,
- resolved candidate,
- actor and construction footprints,
- occupancy conflicts,
- validation reasons,
- inventory revision,
- world revision,
- command result,
- created or removed entity identifier.

## 38. Failure Modes

The architecture prevents:

- ghost and final placement divergence,
- sprite bounds becoming placement authority,
- duplicate occupancy,
- resource deduction without entity creation,
- entity creation without resource deduction,
- removal leaving stale collision or occupancy,
- replacement producing a temporary invalid world,
- stale preview committing against changed world state,
- scene reload losing constructed meaning.

## 39. Runtime Invariants

1. Every durable construction entity has stable identity.
2. Every exclusive construction footprint has exactly one occupancy owner.
3. Preview and commit use the same placement candidate authority.
4. A committed placement updates world and inventory atomically.
5. No resource is consumed for a refused placement.
6. No durable entity is projected before authoritative creation.
7. Occupancy is rebuilt before an loaded world becomes active.
8. Removal clears occupancy and semantic indexes with the entity mutation.
9. Replacement preserves a valid world before and after commit.
10. Stale revisions cannot silently commit.
11. Physics and navigation adapters reflect canonical construction state.
12. Construction events represent committed mutations only.

## 40. Verification Expectations

Verification should cover:

- exact preview-to-placement coordinate equality,
- adjacent placement from actor collision edge,
- grid snap determinism,
- occupancy conflict across layers,
- resource and world atomicity,
- occupied candidate pickup suggestion,
- removal dependency refusal,
- replacement atomicity,
- stale revision rejection,
- load-time occupancy reconstruction,
- interruption and recovery.

## 41. Relationship to Other Slices

- 23A owns world lifecycle and revision authority.
- 23B defines coordinate spaces and footprints.
- 23C defines construction entities and components.
- 23D supplies placement, removal, and replacement intents.
- 23F supplies inventory resources and transfer guarantees.
- 23H applies environment and simulation effects.
- 23I persists construction and recovery evidence.
- 23J verifies cross-runtime invariants.

## 42. Completion Statement

23E establishes construction as a coherent world transaction.

Placement, preview, occupancy, resources, entity creation, removal, environment rules, and projection now share one authority instead of being coordinated through scene-side assumptions.