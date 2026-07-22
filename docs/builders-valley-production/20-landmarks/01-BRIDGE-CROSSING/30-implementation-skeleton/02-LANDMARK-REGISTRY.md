# Bridge Crossing Implementation Skeleton — Landmark Registry

## Purpose

This document defines the world-level registry boundary used to discover and activate landmarks without moving landmark workflow into the world runtime.

## Proposed Path

```text
src/builders-valley/world/landmark-registry.ts
```

## Registry Record

Each registered landmark must provide an equivalent record:

```ts
interface LandmarkDescriptor {
  id: string;
  zoneId: string;
  activationBoundary: SpatialBoundary;
  destinationBoundary: SpatialBoundary;
  dependencies: readonly RuntimeDependencyKey[];
  activate(context: LandmarkActivationContext): Promise<void>;
  deactivate(): Promise<void>;
}
```

Exact syntax may differ, but identity, boundaries, dependencies, and lifecycle must remain explicit.

## Registry Responsibilities

- register each landmark identity exactly once
- expose read-only discovery by identity or zone
- activate or deactivate through landmark lifecycle boundaries
- reject duplicate identity registration
- reject descriptors missing required boundaries or dependencies
- preserve deterministic registration order when order affects startup evidence

## Registry Non-Responsibilities

The registry must not:

- own Bridge Crossing state transitions
- decide whether the bridge is crossable
- persist landmark progress
- render landmark projection
- mutate camera, terrain, lighting, or materials
- create shared workflow behavior across landmarks

## Bridge Crossing Registration

Bridge Crossing registers one descriptor from:

```text
src/builders-valley/landmarks/bridge-crossing/runtime/
bridge-crossing-registration.ts
```

The descriptor references the approved landmark identity, world or zone anchor, activation boundary, destination verification boundary, and required global ports.

## Invariants

1. `bridge-crossing` has one active registration authority.
2. Registration metadata cannot weaken the approved terrain or composition contract.
3. Activation does not imply completion.
4. Destination entry is evaluated by the Bridge Crossing completion verifier, not by the registry.
5. Deactivation preserves durable progress and releases transient subscriptions.
6. Reloaded registration exposes the same landmark identity and boundaries.

## Evidence Required

Implementation must provide:

- actual registry path
- public registry export
- Bridge Crossing descriptor path
- duplicate-registration rejection test
- missing-boundary rejection test
- activation and deactivation lifecycle test
