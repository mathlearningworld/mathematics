# Bridge Crossing Implementation Skeleton — Runtime Ports

## Purpose

This document defines the boundaries Bridge Crossing may use to request services from global runtime authorities.

Ports preserve one-owner authority and make landmark behavior testable without creating duplicate world systems.

## Proposed Paths

```text
src/builders-valley/runtime-ports/
├── camera.port.ts
├── terrain.port.ts
├── persistence.port.ts
├── player-observation.port.ts
├── lighting.port.ts
├── material.port.ts
└── index.ts
```

## Camera Port

Bridge Crossing may request framing intent, focus intent, and release of landmark-specific focus. It may not set global camera state directly.

Minimum operations:

```ts
interface CameraPort {
  requestLandmarkFocus(intent: LandmarkFocusIntent): Promise<void>;
  releaseLandmarkFocus(landmarkId: string): Promise<void>;
}
```

## Terrain Port

Bridge Crossing may request approved landmark terrain assembly and read collision or boundary information. It may not become terrain authority.

```ts
interface TerrainPort {
  ensureLandmarkTerrain(request: LandmarkTerrainRequest): Promise<LandmarkTerrainHandle>;
  readBoundary(boundaryId: string): SpatialBoundary | null;
}
```

## Persistence Port

Persistence accepts valid state records only after the landmark state authority approves a transition.

```ts
interface LandmarkPersistencePort {
  load(landmarkId: string): Promise<LandmarkStateRecord | null>;
  save(record: LandmarkStateRecord, expectedVersion: number): Promise<PersistedLandmarkState>;
}
```

Required semantics:

- optimistic version protection
- idempotent replay support
- explicit failure reporting
- no visual success before durable confirmation when durability is required

## Player Observation Port

Provides read-only player position or boundary-entry observations.

```ts
interface PlayerObservationPort {
  subscribeToBoundary(boundary: SpatialBoundary, listener: BoundaryListener): Unsubscribe;
  getCurrentPosition(): WorldPosition;
}
```

## Lighting and Material Ports

These ports accept approved intent or material-family references. Landmark code must not redefine global standards.

## Port Rules

1. Ports expose the smallest capability required by the landmark.
2. Command methods request work; read methods do not mutate state.
3. Framework-specific objects must not leak into the landmark domain.
4. Adapter failure is explicit and recoverable where the contract permits.
5. Test doubles must conform to the same public contract.
6. A port cannot be bypassed by direct imports from a global implementation.

## Failure Mapping

Adapter failures must be translated into stable runtime failures such as:

- `CAMERA_REQUEST_REJECTED`
- `TERRAIN_ASSEMBLY_FAILED`
- `PERSISTENCE_CONFLICT`
- `PERSISTENCE_UNAVAILABLE`
- `PLAYER_OBSERVATION_UNAVAILABLE`

These failures do not authorize invalid state transitions.

## Evidence Required

Implementation evidence must include:

- actual port paths
- concrete adapter paths
- public exports
- unit tests for failure translation
- proof that Bridge Crossing does not import concrete global authorities directly
