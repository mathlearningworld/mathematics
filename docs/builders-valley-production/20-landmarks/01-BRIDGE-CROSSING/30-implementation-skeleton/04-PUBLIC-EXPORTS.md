# Bridge Crossing Implementation Skeleton — Public Exports

## Purpose

This document defines the permitted import boundaries for Builders Valley and Bridge Crossing runtime code.

Public exports protect ownership, prevent deep-import coupling, and make repository review possible without relying on accidental file structure.

## Package Entry Points

Proposed public entry points:

```text
src/builders-valley/index.ts
src/builders-valley/world/index.ts
src/builders-valley/runtime-ports/index.ts
src/builders-valley/landmarks/bridge-crossing/index.ts
src/builders-valley/verification/index.ts
```

## Builders Valley Root Export

The root package may export only stable startup and read boundaries, such as:

- `createBuildersValleyRuntime`
- `BuildersValleyRuntime`
- stable world-read types

It must not export internal state-mutator implementations.

## World Package Export

The world package may export:

- composition-root factory
- landmark registry read and registration contracts
- stable world runtime types

It must not expose mutable registry storage or framework-specific internals.

## Runtime Ports Export

The runtime-ports package exports contracts and stable value types only.

Concrete adapters remain owned by their implementation packages and are wired through the composition root.

## Bridge Crossing Export

The Bridge Crossing package may export:

- registration factory
- approved commands and results
- state and projection read types
- stable failure codes
- verification hooks required by the world runtime

The package must not export:

- internal mutable state container
- private transition helpers
- concrete persistence, terrain, camera, lighting, or material adapters
- workflow components intended for unrelated landmarks

## Import Rules

1. Consumers import through the nearest package `index.ts`.
2. Deep imports into another package's internal folders are forbidden.
3. Domain code may import stable port contracts, not concrete adapters.
4. Projection may read state but may not import private mutation functions.
5. Tests may use explicit test-support exports only when those exports are isolated from production APIs.
6. Export additions require contract review because they expand coupling authority.

## Dependency Direction

```text
Application Startup
       ↓
Builders Valley Public API
       ↓
World Composition + Registry
       ↓
Bridge Crossing Public API
       ↓
Bridge Crossing Internal Layers

Bridge Crossing Domain
       ↓
Stable Runtime Port Types
```

Reverse dependencies are not allowed.

## Repository Verification

Repository review must verify:

- all package indexes exist
- no unauthorized deep imports appear
- no concrete global authority is exported from Bridge Crossing
- no private state mutation API is publicly exported
- root exports remain small and intentional

## Change Rule

Implementation may rename proposed exports, but it must preserve equivalent boundaries and update the runtime mapping and discovery records with the final paths.