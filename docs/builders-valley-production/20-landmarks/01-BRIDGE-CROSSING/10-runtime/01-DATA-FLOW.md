# Bridge Crossing Data Flow

## Purpose

This document defines the approved runtime data flow for Bridge Crossing from player input to durable progress and visual projection.

## Primary Flow

```text
Player enters approach boundary
  -> World runtime activates landmark context
  -> Bridge Crossing state is loaded or initialized
  -> Observation projection derives visible meaning
  -> Player performs landmark interaction
  -> Interaction controller validates command
  -> State controller applies valid transition
  -> Persistence authority records durable progress when required
  -> Visual and UI projections update from authoritative state
  -> Completion verifier observes destination entry
  -> CROSSING_VERIFIED is committed and projected
```

## Inputs

Bridge Crossing may consume:

- player position and movement events
- landmark activation and deactivation events
- approved interaction commands
- inventory or resource availability projections
- persisted landmark progress
- world, terrain, camera, lighting, and material services through defined boundaries

It must not read mutable internals from another runtime domain merely for convenience.

## Commands

Representative commands include:

- `DISCOVER_BRIDGE_CROSSING`
- `BEGIN_OBSERVATION`
- `BEGIN_PREPARATION`
- `APPLY_BRIDGE_ACTION`
- `CONFIRM_CROSSABLE`
- `BEGIN_CROSSING`
- `VERIFY_DESTINATION_ENTRY`

Names may differ in code, but command meaning must remain explicit and auditable.

## Authoritative Processing

Each command follows this sequence:

```text
Command
  -> identity and context validation
  -> current-state validation
  -> prerequisite validation
  -> transition decision
  -> state mutation by the single state owner
  -> domain event emission
  -> persistence request where required
  -> projection refresh
```

A renderer, UI component, collision callback, or animation callback must not bypass this sequence to mutate landmark progress directly.

## State Projection

Runtime projections should expose only the information consumers need, such as:

- current landmark state
- whether observation is available
- whether preparation requirements are satisfied
- whether the bridge is crossable
- current interaction affordance
- destination verification status
- recoverable failure or blocked reason

Projections are derived from authoritative state and are not independent stores of truth.

## Event Flow

Representative events include:

- `BridgeCrossingDiscovered`
- `BridgeCrossingObserved`
- `BridgePreparationStarted`
- `BridgeActionApplied`
- `BridgeBecameCrossable`
- `BridgeCrossingStarted`
- `BridgeDestinationEntered`
- `BridgeCrossingVerified`

Events describe completed facts. They are not commands disguised as events.

## Persistence Flow

Durable progress should be written at meaningful transition boundaries, including at minimum:

- discovery when the product requires discovery persistence
- preparation or repair progress that must survive reload
- crossable completion
- final crossing verification

Persistence flow:

```text
Valid transition
  -> persistence request
  -> persistence authority validates aggregate identity/version
  -> durable write
  -> write result returned
  -> runtime confirms or recovers projection
```

The runtime must define recovery behavior for write failure rather than silently displaying success.

## Reload and Recovery

On load or re-entry:

1. resolve Bridge Crossing identity
2. load durable progress
3. validate the persisted state
4. reconstruct the authoritative runtime state
5. derive visual and interaction projections
6. reject impossible combinations instead of guessing

Examples of impossible combinations:

- `CROSSING_VERIFIED` while the bridge is not crossable
- crossing in progress without a crossable state
- destination verified before landmark discovery

## UI and Feedback Flow

Workflow-bound UI belongs to Bridge Crossing and receives a projection from its runtime boundary.

```text
Authoritative landmark state
  -> Bridge Crossing projection
  -> module-owned UI / environmental feedback
  -> player action
  -> explicit command
```

The UI must not become the state owner. Environmental feedback should communicate before text-heavy UI whenever the product contract allows it.

## Failure Flow

Failures must be classified as one of:

- invalid transition
- unmet prerequisite
- unavailable interaction
- persistence failure
- missing runtime dependency
- contract or mapping conflict

Every failure must provide a recoverable next action or an explicit escalation path. Runtime code must not invent product behavior to hide a missing contract decision.

## Data-Flow Acceptance

The mapping passes only when repository evidence identifies:

- the input source
- the command boundary
- the authoritative state owner
- the event or transition output
- the persistence boundary
- the visual and UI projection consumers
- the reload and failure path
