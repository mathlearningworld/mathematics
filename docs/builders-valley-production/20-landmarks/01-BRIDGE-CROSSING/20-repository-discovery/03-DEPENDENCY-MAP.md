# Bridge Crossing Repository Discovery — Dependency Map

## Current Dependency State

No executable dependency graph was discovered for Builders Valley runtime. The following map therefore records required architectural dependencies derived from approved contracts, while clearly distinguishing them from implemented repository dependencies.

## Required Direction

```text
World Composition Root
    -> Landmark Registry
        -> Bridge Crossing Module
            -> Landmark State Controller
            -> Interaction Controller
            -> Visual Projection
            -> Completion Verifier

Bridge Crossing Module
    -> Terrain Port
    -> Camera Request Port
    -> Player Observation Port
    -> Persistence Port
    -> Feedback Port
```

## Dependency Rules

1. Bridge Crossing may depend on neutral runtime ports, but global runtime authorities must not depend on Bridge Crossing workflow details.
2. Landmark UI and feedback remain inside the Bridge Crossing module.
3. Visual projection reads authoritative landmark state and cannot mutate it directly.
4. Terrain and camera integration must occur through explicit boundaries.
5. Persistence records valid transitions; it does not decide transition validity.
6. Verification observes public runtime behavior and must not become production state authority.

## Repository Evidence Status

| Dependency | Implemented evidence | Status |
| --- | --- | --- |
| World root → Landmark registry | None found | MISSING |
| Registry → Bridge Crossing | None found | MISSING |
| Interaction → State controller | None found | MISSING |
| State controller → Persistence port | None found | MISSING |
| State → Visual projection | None found | MISSING |
| Player position → Completion verifier | None found | MISSING |

## Constraint

This planned dependency map must not be reported as implemented until concrete source paths and public exports exist in the repository.
