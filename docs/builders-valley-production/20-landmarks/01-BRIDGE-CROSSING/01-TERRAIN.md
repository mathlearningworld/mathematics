# Bridge Crossing — Terrain Contract

## Terrain Mission

The terrain must make the bridge necessary before the bridge itself is considered. The crossing must solve a legible spatial problem rather than decorate an otherwise traversable route.

## Required Terrain Structure

The landmark must contain:

- an approach area where the player can safely observe the problem;
- a terrain cut, river, ravine, collapsed route, or equivalent separation;
- a destination side that is visually meaningful;
- clear bridge anchors or construction edges;
- a readable return or continuation route after crossing.

## Spatial Sequence

The intended spatial reading is:

```text
Approach
  ↓
Observation Point
  ↓
Blocked Edge
  ↓
Crossing Span
  ↓
Destination Landing
  ↓
Continuation Route
```

## Terrain Construction Order

Runtime implementation must follow this order:

1. Primary terrain masses
2. Terrain cut or separation
3. Approach and destination routes
4. Bridge anchor geometry
5. Walkable landing surfaces
6. Material zones
7. Supporting environmental details

Decoration must not be used to hide unresolved terrain form.

## Elevation Rules

- The observation point must provide enough elevation or openness to read both the obstacle and destination.
- The destination must not be hidden entirely by foreground mass.
- Elevation changes must remain compatible with player movement and camera constraints.
- Any cliff or drop must communicate danger through form, silhouette, and route boundaries rather than invisible collision alone.

## Route Rules

- Before completion, the intended route must clearly terminate at the blocked edge.
- Alternative routes must not accidentally bypass the landmark unless explicitly part of the mission.
- After completion, the bridge must connect two valid walkable surfaces without ambiguous gaps.
- The destination landing must be wide enough to support arrival, camera recovery, and next-step readability.

## Terrain and Bridge Relationship

The bridge must be dimensioned from the terrain span and player scale. Terrain must not be reshaped merely to fit a preselected decorative bridge asset without an approved contract change.

Bridge anchors should appear structurally connected to terrain masses. Floating, clipped, or unsupported endpoints are unacceptable.

## Local Coordinate Authority

Bridge Crossing uses a landmark-local origin defined during Runtime Mapping. Local coordinates may be transformed into world coordinates only through the authoritative world assembly path.

The landmark may request terrain features but must not mutate global terrain outside its approved spatial boundary.

## Collision Expectations

- Walkable surfaces must align with visible surfaces.
- Blocked edges must not allow accidental traversal.
- Bridge completion must update both visible and operational traversability.
- Collision behavior must be verified in runtime and cannot be proven by screenshots alone.

## Terrain Acceptance

Terrain is ready when:

- the obstacle is readable without UI;
- the destination is visible or strongly implied;
- the bridge span has clear structural endpoints;
- the pre-completion route is genuinely blocked;
- the completed route is continuously traversable;
- primary terrain silhouettes remain readable from the approved camera.
