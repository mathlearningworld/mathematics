# Bridge Crossing Runtime Mapping

## Purpose

This document maps the approved Bridge Crossing landmark contract into runtime responsibilities without allowing runtime code to redefine product intent.

The mapping is authoritative for implementation planning. It does not certify that the runtime already conforms.

## Source Contracts

Implementation must remain consistent with:

- `00-MISSION.md`
- `01-TERRAIN.md`
- `02-COMPOSITION.md`
- `03-GAMEPLAY.md`
- `04-ASSET-RULES.md`
- `05-ACCEPTANCE.md`
- the Builders Valley Product Constitution
- Spatial, Visual, and Runtime Foundation standards

## Runtime Boundary

Bridge Crossing owns only the landmark-specific workflow and projection required to deliver this experience:

```text
Approach
  -> Observe
  -> Prepare
  -> Build / Repair / Activate
  -> Verify
  -> Cross
```

It does not own global camera, terrain, lighting, material, persistence, player movement, or world lifecycle authority.

## Runtime Domains

| Runtime domain | Authority | Bridge Crossing permission |
| --- | --- | --- |
| World lifecycle | World runtime authority | Read and request landmark activation |
| Terrain | Terrain authority | Consume approved terrain contract; request landmark terrain assembly |
| Camera | Camera authority | Request approved framing or focus intent |
| Lighting | Lighting authority | Request approved landmark lighting intent |
| Materials | Material authority | Reference approved material families |
| Player movement | Player runtime authority | Observe approach, crossing, and destination entry |
| Interaction | Bridge Crossing interaction runtime | Own landmark actions and feedback |
| Landmark state | Bridge Crossing state runtime | Own landmark state transitions |
| Persistence | Persistence authority | Request durable landmark progress writes |
| UI | Bridge Crossing module | Own workflow-bound UI and feedback |

## Required Runtime Components

The implementation should expose equivalent responsibilities even when repository naming differs:

### Landmark Registration

Registers Bridge Crossing with the world runtime and provides:

- landmark identity
- world or zone anchor
- activation boundary
- destination boundary
- required runtime dependencies

### Landmark State Controller

Owns the Bridge Crossing state machine and rejects invalid transitions.

### Observation Projection

Projects the information needed for the player to understand:

- where the destination is
- why the route is blocked
- where the bridge action occurs
- what action is currently available

### Interaction Controller

Accepts landmark-specific interaction commands and coordinates validation, state transitions, feedback, and persistence requests.

### Bridge Visual Projection

Renders the bridge-specific state without becoming a second terrain, camera, lighting, or material authority.

### Completion Verifier

Confirms that the player has crossed into the destination region after the bridge has become crossable.

## Ownership Invariants

1. Bridge Crossing has exactly one landmark-state authority.
2. Visual components may project state but may not mutate it directly.
3. Terrain geometry is not privately mutated by a Bridge Crossing UI component.
4. Camera focus is requested through camera authority rather than set by multiple landmark components.
5. Persistence is requested only after a valid transition.
6. Reloaded state must reconstruct the same meaningful landmark condition.
7. Runtime implementation may not weaken the approved acceptance contract.

## Runtime Mapping Record

Before implementation begins, the Executor must record the actual repository paths for:

| Responsibility | Actual runtime path | Status |
| --- | --- | --- |
| World registration | TBD | UNMAPPED |
| Landmark state owner | TBD | UNMAPPED |
| Interaction controller | TBD | UNMAPPED |
| Visual projection | TBD | UNMAPPED |
| Terrain integration | TBD | UNMAPPED |
| Camera integration | TBD | UNMAPPED |
| Persistence integration | TBD | UNMAPPED |
| Verification entry point | TBD | UNMAPPED |

`TBD` is intentional at the contract stage. It must be replaced using repository evidence before code modification begins.

## Implementation Readiness

Runtime implementation is READY only when:

- all actual runtime owners are identified
- no duplicate authority is found
- required contracts and state transitions are understood
- the data flow is mapped
- the evidence package is defined
- unresolved architectural conflicts are escalated instead of patched around

## Non-Goals

This mapping does not:

- choose a framework-specific component hierarchy
- authorize a rewrite of world runtime
- create shared workflow components for other landmarks
- certify runtime or operational completion
