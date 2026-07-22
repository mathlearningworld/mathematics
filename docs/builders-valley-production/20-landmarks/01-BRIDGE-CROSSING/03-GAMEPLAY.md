# Bridge Crossing — Gameplay Contract

## Gameplay Mission

The gameplay must convert the visible crossing problem into a short, understandable loop of observation, preparation, construction, verification, and traversal.

The player should feel that the bridge was completed through meaningful action rather than a disconnected button press.

## Core Loop

```text
Observe obstacle
  ↓
Inspect crossing requirements
  ↓
Acquire or prepare required resources/actions
  ↓
Build, repair, or activate bridge
  ↓
Verify structural completion
  ↓
Cross to destination
```

## Interaction Principles

- The environment communicates the problem before instructional UI appears.
- Interaction prompts may clarify an available action, but must not replace environmental readability.
- The landmark-specific workflow remains owned by the Bridge Crossing gameplay module.
- Shared interaction primitives may be reused, but Bridge Crossing business flow must not be extracted into a generic shared workflow.

## State Model

The minimum conceptual states are:

```text
UNDISCOVERED
OBSERVED
READY_FOR_ACTION
IN_PROGRESS
COMPLETED
CROSSING_VERIFIED
```

Runtime names may differ, but transitions must remain explicit and testable.

## Transition Expectations

### UNDISCOVERED → OBSERVED

Occurs when the player reaches an approved observation condition and the crossing problem becomes discoverable.

### OBSERVED → READY_FOR_ACTION

Occurs when required prerequisites are known and available, or when the landmark exposes the next valid preparation step.

### READY_FOR_ACTION → IN_PROGRESS

Occurs when the player begins the landmark-specific bridge action.

### IN_PROGRESS → COMPLETED

Occurs only when the bridge's required construction, repair, or activation conditions are satisfied.

### COMPLETED → CROSSING_VERIFIED

Occurs after the visible structure, collision/traversability, and destination access are confirmed operationally.

## Learning Activity Boundary

Any mathematical activity connected to Bridge Crossing must define:

- the target skill;
- prerequisite assumptions;
- input and response model;
- success and remediation behavior;
- how the mathematical result affects bridge progression.

The terrain renderer, camera, or decorative assets must not decide learning correctness.

## Feedback Rules

- Progress feedback must be immediate and tied to the player's action.
- Failure feedback must explain the recoverable condition without punishment or loss of unrelated progress.
- Completion feedback may use motion, sound, lighting, and environmental change, but must preserve camera control and route readability.
- The completed state must remain understandable after transient effects end.

## Persistence Expectations

If landmark progress is persistent:

- completion state must be owned by the approved persistence authority;
- re-entry must restore matching visual, collision, and gameplay states;
- partial progress behavior must be explicitly defined before implementation;
- screenshots alone cannot certify persistence correctness.

## Failure and Recovery

The player must be able to recover from:

- leaving the area during preparation;
- interrupting the interaction;
- exhausting an attempt where retries are allowed;
- reloading after completion;
- approaching the completed landmark from either side when supported.

Recovery must not create duplicate bridge authorities, duplicate rewards, or contradictory visual states.

## Gameplay Acceptance

Gameplay passes when:

- the player can discover the next valid action;
- state transitions occur in the intended order;
- completion cannot occur without satisfying the landmark contract;
- bridge traversal is operational after completion;
- interruption and re-entry do not corrupt progression;
- learning correctness remains outside rendering and terrain ownership;
- the workflow can be validated through runtime evidence.
