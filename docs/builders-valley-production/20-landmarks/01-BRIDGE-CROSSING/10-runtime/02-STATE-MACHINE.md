# Bridge Crossing State Machine

## Purpose

This document defines the authoritative state model for Bridge Crossing. Runtime implementations may use different code symbols, but they must preserve the same meaning, transition rules, and invariants.

## States

### `UNDISCOVERED`

The landmark has not entered the player's meaningful experience.

### `APPROACHING`

The player is within the approach region and the landmark is active, but the obstacle has not yet been deliberately observed.

### `OBSERVING`

The destination, blocked route, and bridge problem are being communicated through environment, framing, and optional support UI.

### `PREPARING`

The player has understood the problem and is gathering, selecting, or applying the required means to solve it.

### `CROSSABLE`

The bridge solution is complete and the route is safe and available for crossing.

### `CROSSING`

The player has begun traversing the bridge toward the destination.

### `CROSSING_VERIFIED`

The player has entered the approved destination region after crossing a valid bridge. This is the terminal success state for the landmark contract.

## Allowed Transitions

```text
UNDISCOVERED
  -> APPROACHING

APPROACHING
  -> OBSERVING
  -> UNDISCOVERED        only when discovery is not yet durable and the player leaves

OBSERVING
  -> PREPARING
  -> APPROACHING         when observation is interrupted without progress

PREPARING
  -> CROSSABLE
  -> OBSERVING           when preparation is cancelled or invalidated safely

CROSSABLE
  -> CROSSING

CROSSING
  -> CROSSABLE           when the player retreats before destination verification
  -> CROSSING_VERIFIED

CROSSING_VERIFIED
  -> CROSSING_VERIFIED   idempotent reload/re-entry only
```

No other transition is valid without an approved contract revision.

## Transition Preconditions

### `UNDISCOVERED -> APPROACHING`

- player enters the approved activation boundary
- landmark identity is resolved
- required runtime dependencies are available

### `APPROACHING -> OBSERVING`

- the player can perceive the blocked route and destination
- the landmark observation condition is met

### `OBSERVING -> PREPARING`

- the problem has been acknowledged through explicit interaction or approved implicit discovery
- the preparation action is available

### `PREPARING -> CROSSABLE`

- all required bridge actions are validly completed
- bridge geometry and collision are safe
- visual projection agrees with the authoritative state
- required durable write succeeds or the runtime uses an explicitly approved pending-write policy

### `CROSSABLE -> CROSSING`

- player enters the approved bridge traversal region
- bridge remains crossable

### `CROSSING -> CROSSING_VERIFIED`

- player enters the destination verification region
- the same landmark instance is active
- bridge state is still crossable
- final verification is accepted and persisted where required

## Invariants

1. `CROSSING` requires `CROSSABLE` bridge capability.
2. `CROSSING_VERIFIED` implies that the bridge solution was completed.
3. Destination entry before a valid crossing must not produce success.
4. Visual bridge completion must not precede authoritative completion.
5. UI cannot force a state transition without a valid command.
6. Persistence reload must never regress `CROSSING_VERIFIED` to an earlier state.
7. Repeated valid commands must be idempotent or explicitly rejected without duplicating rewards or writes.
8. Leaving and re-entering the landmark must reconstruct meaningful progress consistently.
9. Invalid persisted combinations must be surfaced as recovery failures, not normalized by guesswork.

## Failure and Recovery States

Failure is represented as structured metadata alongside the authoritative state unless implementation evidence proves that a dedicated failure state is necessary.

Required failure categories:

- `INVALID_TRANSITION`
- `PREREQUISITE_NOT_MET`
- `INTERACTION_UNAVAILABLE`
- `PERSISTENCE_FAILED`
- `RUNTIME_DEPENDENCY_MISSING`
- `STATE_RECOVERY_REQUIRED`

A failure must not falsely advance the state.

## Idempotency

The following operations must be safe under repetition:

- landmark activation
- state loading
- observation projection
- crossable confirmation
- destination verification
- final completion persistence

Repeated destination verification after `CROSSING_VERIFIED` returns the existing success meaning rather than creating a second completion.

## Verification Matrix

| Current state | Action | Expected result |
| --- | --- | --- |
| `UNDISCOVERED` | Enter approach boundary | `APPROACHING` |
| `APPROACHING` | Observe obstacle | `OBSERVING` |
| `OBSERVING` | Begin valid preparation | `PREPARING` |
| `PREPARING` | Complete all bridge requirements | `CROSSABLE` |
| `CROSSABLE` | Enter bridge traversal | `CROSSING` |
| `CROSSING` | Enter destination boundary | `CROSSING_VERIFIED` |
| `OBSERVING` | Attempt crossing | Reject; state unchanged |
| `PREPARING` | Enter destination through invalid route | Reject completion |
| `CROSSING_VERIFIED` | Reload | Remain `CROSSING_VERIFIED` |

## Runtime Gate

Before implementation is accepted, automated or human runtime evidence must demonstrate every valid forward transition, representative invalid transitions, reload reconstruction, and idempotent final verification.
