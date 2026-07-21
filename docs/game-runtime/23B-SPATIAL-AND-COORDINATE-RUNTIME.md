# 23B — Spatial & Coordinate Runtime

## Status

- Chapter: 23 — Game Runtime & World Architecture
- Slice: 23B
- Authority: Architecture documentation
- Scope: Coordinate systems, spatial ownership, collision, adjacency, placement, targeting, and spatial invariants

## 1. Purpose

The Spatial Runtime defines how the world understands position, distance, occupancy, direction, bounds, adjacency, collision, and valid interaction locations.

It exists because visual coordinates alone are not sufficient authority for gameplay meaning.

The same object may have:

- a rendered sprite origin,
- a collision body,
- an interaction footprint,
- a placement footprint,
- a navigation footprint,
- and a logical tile or region identity.

These meanings must not be mixed implicitly.

## 2. Core Principle

> Spatial meaning must be explicit, typed, and resolved from canonical geometry rather than inferred from appearance.

A ghost preview looking correct is not proof that placement geometry is correct.

A sprite visually touching an object is not proof that the player is adjacent.

A pointer hovering over an object is not proof that it is the valid interaction target.

## 3. Coordinate Spaces

The runtime recognizes distinct coordinate spaces.

### 3.1 World space

Continuous coordinates used by simulation and rendering.

```ts
interface WorldPoint {
  x: number;
  y: number;
}
```

### 3.2 Grid space

Discrete cells used by tile-aligned systems.

```ts
interface GridCell {
  column: number;
  row: number;
}
```

### 3.3 Screen space

Pointer and viewport coordinates. Screen space is input and projection data only.

### 3.4 Local entity space

Coordinates relative to an entity transform or anchor.

### 3.5 Collision space

Canonical bounds used to resolve physical obstruction and contact.

### 3.6 Interaction space

Geometry used to determine whether an entity can be focused or acted upon.

### 3.7 Placement space

Geometry used to calculate previews, occupancy, snapping, and construction validity.

No conversion between spaces may be implicit.

## 4. Conversion Contracts

Conversions must be named and testable.

Examples:

```ts
worldToGrid(point, gridDefinition)
gridToWorldCenter(cell, gridDefinition)
screenToWorld(point, camera)
entityLocalToWorld(point, transform)
collisionBoundsToPlacementAnchor(bounds, direction)
```

Every conversion contract must define:

- source space,
- target space,
- anchor convention,
- rounding policy,
- scale assumptions,
- boundary behavior.

## 5. Anchor Conventions

The runtime must not assume all positions use the same anchor.

Common anchors include:

```text
CENTER
BOTTOM_CENTER
TOP_LEFT
COLLISION_CENTER
FOOTPRINT_CENTER
TILE_CENTER
CUSTOM_OFFSET
```

Each spatially meaningful entity declares its canonical anchor.

Renderer-specific sprite origins are adapters, not world authority.

## 6. Bounds Model

Canonical bounds are represented independently of visual dimensions.

```ts
interface AxisAlignedBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
```

Derived properties:

```text
width
height
center
left edge
right edge
top edge
bottom edge
```

Bounds must satisfy:

```text
minX <= maxX
minY <= maxY
```

Zero-size logical entities are permitted only when the owning system defines their interaction semantics explicitly.

## 7. Footprints

An entity may expose multiple footprints:

```ts
interface SpatialFootprints {
  collision?: SpatialShape;
  interaction?: SpatialShape;
  placement?: SpatialShape;
  navigation?: SpatialShape;
  selection?: SpatialShape;
}
```

Rules:

- Collision footprint controls obstruction.
- Interaction footprint controls actionable proximity.
- Placement footprint controls occupancy.
- Navigation footprint controls path feasibility.
- Selection footprint may be more forgiving for input accessibility.

Selection footprint must not enlarge physical interaction authority without a separate rule check.

## 8. Direction Model

Direction is semantic, not inferred from current animation frame.

Minimum four-direction model:

```text
NORTH
EAST
SOUTH
WEST
```

Optional extension:

```text
NORTH_EAST
SOUTH_EAST
SOUTH_WEST
NORTH_WEST
```

The runtime maintains facing direction independently of velocity.

A stationary player still has a facing direction.

## 9. Player Front Geometry

Player interaction and placement frequently depend on the area directly in front of the player's collision footprint.

Canonical calculation:

```text
player collision bounds
  + facing direction
  + configured separation or adjacency rule
  + target footprint
  → candidate interaction/placement geometry
```

This calculation must not use the sprite center unless the sprite center is explicitly the collision center.

## 10. Adjacency

Adjacency is a policy, not merely a distance threshold.

Supported definitions may include:

- edge-to-edge gap,
- grid-neighbor relation,
- overlapping interaction bands,
- line-of-sight constrained proximity,
- directional front adjacency.

Example contract:

```ts
interface AdjacencyPolicy {
  mode: 'EDGE_GAP' | 'GRID_NEIGHBOR' | 'INTERACTION_BAND';
  maximumGap: number;
  requireFacing: boolean;
  allowDiagonal: boolean;
}
```

The current gameplay requirement for pickup should be expressible as:

```text
target is adjacent to player collision bounds
AND target is within an allowed interaction direction
AND no higher-priority valid target supersedes it
```

## 11. Distance Metrics

The runtime may use different distance metrics for different systems:

```text
Euclidean distance
Manhattan distance
Chebyshev distance
edge-to-edge gap
path distance
```

A system must declare which metric it uses.

Placement and pickup must not share one generic distance constant merely because both happen near the player.

## 12. Collision Runtime

Collision answers questions such as:

- Can entities occupy these positions simultaneously?
- Did movement cross a blocking boundary?
- Is a placement footprint obstructed?
- Is the player body adjacent to an interactable body?

Collision categories are explicit:

```text
PLAYER
NPC
SOLID_WORLD
PLACED_STRUCTURE
RESOURCE
TRIGGER
DECORATION
PROJECTILE
```

Collision masks define which categories interact physically.

Decorative sprites must not become blockers accidentally.

## 13. Occupancy Runtime

Occupancy is distinct from collision.

A location can be non-colliding yet unavailable for placement because it is:

- reserved,
- mission-protected,
- owned by another construction footprint,
- outside buildable terrain,
- inside a transition zone,
- or incompatible with environmental rules.

Canonical placement occupancy result:

```ts
interface OccupancyResult {
  status: 'FREE' | 'OCCUPIED' | 'RESERVED' | 'FORBIDDEN' | 'UNCERTAIN';
  blockers: SpatialBlocker[];
  reasonCode?: string;
}
```

## 14. Placement Geometry

Placement geometry must use one canonical result for both preview and committed placement.

```text
Player bounds
  → facing direction
  → candidate anchor
  → snap policy
  → candidate footprint
  → occupancy validation
  → placement decision
```

The preview must be a projection of the exact candidate used by the placement command.

Forbidden pattern:

```text
preview uses sprite offset
commit uses tile calculation
```

Required pattern:

```text
one candidate placement calculation
  → preview projection
  → commit payload
```

## 15. Occupied Placement to Pickup Focus

When the adjacent placement location is occupied by a pickup-capable entity, the runtime may convert the current effective interaction from placement to pickup focus.

This is governed by explicit priority:

```text
1. Explicit player action that remains valid
2. Valid adjacent pickup target occupying the intended placement region
3. Valid placement candidate
4. Resumable prior placement intent
5. Neutral fallback
```

The runtime must preserve the underlying placement intent when temporarily focusing pickup, provided:

- the player still owns placeable inventory,
- the selected material remains valid,
- and no explicit selection replaced it.

## 16. Target Candidate Resolution

Spatial targeting follows a deterministic pipeline:

```text
Collect candidates
  → reject world-identity mismatches
  → reject inactive or non-interactable entities
  → evaluate geometry policy
  → evaluate facing/visibility policy
  → rank by semantic priority
  → rank by spatial tie-breaker
  → select one stable target
```

Tie-breakers must be deterministic.

Recommended order:

```text
semantic priority
→ direct front alignment
→ smallest edge gap
→ smallest center distance
→ stable entity ID
```

Stable entity ID is the final tie-breaker to avoid target flicker.

## 17. Focus Stability

Interaction focus must not oscillate between nearby entities due to sub-pixel movement or frame-order changes.

Focus stability policy may include:

- hysteresis margin,
- retained focus while still valid,
- stronger threshold for switching than retaining,
- stable tie-breaking,
- minimum focus duration for presentation only.

Presentation delay must not change the actual semantic target.

## 18. Spatial Indexing

Large worlds require indexed queries.

Possible indices:

- uniform grid,
- spatial hash,
- quadtree,
- tile occupancy map,
- navigation graph.

The index is derived runtime state.

It must be rebuildable from canonical entity spatial state and must never become the only source of truth.

## 19. Movement Resolution

Movement resolution is ordered:

```text
requested movement
  → capability and state check
  → candidate transform
  → collision query
  → resolve permitted displacement
  → commit entity transform
  → update spatial index
  → emit movement event
  → refresh dependent focus/preview
```

Interaction focus should resolve after committed movement geometry, not from stale pre-movement bounds.

## 20. Camera Boundary

The camera projects world space into screen space.

It may:

- pan,
- zoom,
- shake,
- clamp,
- interpolate.

Camera effects must not mutate world coordinates.

Pointer input must be converted back to world coordinates through the active camera transform before semantic targeting.

## 21. Region and Zone Boundaries

Worlds may be partitioned into regions or zones.

A spatial reference requires world identity and, where applicable, zone identity.

```ts
interface SpatialReference {
  worldId: string;
  zoneId?: string;
  point: WorldPoint;
}
```

Coordinates without identity are unsafe for durable commands.

Cross-zone movement is a lifecycle transition, not an ordinary local transform when zones are loaded independently.

## 22. Precision and Rounding

The runtime must define precision policy.

Rules:

- Simulation may use floating-point world coordinates.
- Grid conversion uses one declared rounding mode.
- Durable coordinates use normalized precision.
- Equality uses tolerances where appropriate.
- Visual interpolation never overwrites canonical transforms.

Avoid comparing floating-point positions with raw equality unless values are intentionally quantized.

## 23. Spatial Command Contracts

Placement command input should include semantic geometry identity, not raw screen coordinates.

Example:

```ts
interface PlaceEntityIntent {
  worldId: string;
  actorEntityId: string;
  itemType: string;
  candidate: {
    anchor: WorldPoint;
    facing: Direction;
    footprintVersion: string;
  };
  expectedWorldVersion?: number;
}
```

The receiving authority must validate placement again.

Client validation improves responsiveness but is not final authority for durable multiplayer or server-backed worlds.

## 24. Diagnostics

Spatial diagnostics should be available in development mode:

- player collision bounds,
- target collision bounds,
- interaction footprints,
- placement footprints,
- selected anchor,
- edge gaps,
- candidate ranks,
- occupancy blockers,
- coordinate conversions.

Diagnostics must display canonical calculations rather than separately approximated debug geometry.

## 25. Spatial Invariants

1. Every spatial entity belongs to one world identity.
2. Every coordinate conversion declares source and target space.
3. Collision, interaction, placement, and selection footprints are not implicitly interchangeable.
4. Placement preview and committed placement use the same candidate geometry.
5. Facing direction is runtime state, not an animation inference.
6. Adjacency policy is explicit and testable.
7. Target resolution is deterministic.
8. Spatial indices are derived and rebuildable.
9. Camera state cannot mutate world state.
10. Screen coordinates cannot be persisted as world authority.
11. Occupancy and collision remain distinct meanings.
12. Focus remains stable while the current target satisfies retention rules.

## 26. Verification Expectations

Repository verification must confirm:

- coordinate spaces are named,
- conversion functions are explicit,
- footprints are classified,
- adjacency and target ranking policies are documented,
- preview and placement share one geometry contract.

Runtime verification must cover:

- four-direction front geometry,
- collision-edge adjacency,
- one-tile or configured placement distance,
- occupied placement conversion to pickup focus,
- stable focus among competing candidates,
- camera-independent world placement,
- consistent preview and committed result.

Operational verification must exercise:

```text
Move north/east/south/west
  → preview appears at canonical adjacent location
  → occupied location selects pickup
  → empty location remains placement
  → leaving pickup range restores placement intent
  → actual placement matches preview
```

## 27. Architecture Decision

The Spatial Runtime is established as the sole semantic authority for world geometry.

Rendering consumes spatial meaning.

Interaction queries spatial meaning.

Construction validates spatial meaning.

Persistence stores normalized spatial meaning.

No scene patch, sprite origin, or visual offset may become an independent spatial rule.
