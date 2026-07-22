# Bridge Crossing Interaction Flow

## Purpose

This document defines the player-facing interaction sequence for Bridge Crossing and the runtime responsibilities behind each step.

## Experience Principle

The environment should communicate the destination, obstacle, and available solution before text-heavy UI. Interaction support may clarify meaning but must not replace spatial understanding.

## Primary Interaction Flow

```text
Enter approach region
  -> perceive destination and blocked route
  -> inspect the bridge problem
  -> receive available-action feedback
  -> prepare required resources or tool
  -> apply bridge action
  -> receive progress and completion feedback
  -> traverse the bridge
  -> enter destination region
  -> receive verified completion feedback
```

## Step 1 — Approach

### Trigger

The player enters the approved activation boundary.

### Runtime response

- activate Bridge Crossing context
- load or initialize landmark state
- request approved camera/composition support when necessary
- reveal environmental cues without forcing an intrusive modal

### Acceptance

The player can identify a destination and a blocked route from the scene.

## Step 2 — Observation

### Trigger

The player enters the observation area, faces the landmark, or performs an approved inspect action.

### Runtime response

- project the bridge problem
- expose the valid interaction affordance
- communicate unmet prerequisites through environmental and module-owned feedback

### Acceptance

The player understands that the crossing is unavailable and that the bridge is the solution surface.

## Step 3 — Preparation

### Trigger

The player begins a valid preparation action.

### Runtime response

- validate required tool, material, skill, or prior progress
- select or focus the relevant workflow only within the Bridge Crossing module boundary
- preserve existing progress when interruption is recoverable

### Acceptance

The next meaningful action is clear, and unavailable actions provide a reason rather than failing silently.

## Step 4 — Build, Repair, or Activate

### Trigger

The player applies the approved bridge interaction.

### Runtime response

- issue an explicit command
- validate current state and prerequisites
- apply progress through the single landmark-state authority
- project visual, audio, animation, and UI feedback from authoritative progress
- request persistence at meaningful durable boundaries

### Acceptance

Feedback accurately reflects committed progress. Animation or visuals must not imply success before the authoritative transition succeeds.

## Step 5 — Crossable Confirmation

### Trigger

All required bridge actions are complete.

### Runtime response

- validate collision and traversal safety
- transition to `CROSSABLE`
- project a clearly usable route
- remove obsolete blocked-state affordances

### Acceptance

The player can recognize that the route is now open without relying solely on a text message.

## Step 6 — Crossing

### Trigger

The player enters the bridge traversal region while the bridge is crossable.

### Runtime response

- transition to `CROSSING`
- maintain player control unless the approved design specifies otherwise
- monitor retreat, interruption, fall, and destination entry

### Acceptance

Crossing feels spatially continuous and does not use hidden teleportation as a substitute for the landmark experience unless explicitly approved.

## Step 7 — Verification

### Trigger

The player enters the approved destination verification region.

### Runtime response

- validate the active landmark instance and crossable state
- transition to `CROSSING_VERIFIED`
- persist final completion
- project completion feedback and continuation route

### Acceptance

Completion occurs only after valid destination entry, survives reload, and cannot be awarded twice.

## Interruption and Recovery

The runtime must support these cases:

- player leaves during observation
- player leaves during preparation
- interaction is cancelled
- resources become unavailable before commit
- persistence fails after a valid local action
- player retreats while crossing
- player reloads at any durable stage

Recovery must preserve valid committed progress and must not preserve uncommitted visual success.

## Invalid Interaction Handling

Examples:

- attempting bridge work before observation
- attempting crossing before `CROSSABLE`
- applying an unsupported tool or resource
- triggering destination verification through another route
- repeating final completion

Expected handling:

```text
Invalid action
  -> structured rejection
  -> state remains valid
  -> clear recoverable feedback
  -> no duplicate persistence or reward
```

## UI Ownership

Bridge Crossing owns workflow-bound UI such as:

- action availability
- preparation status
- bridge progress
- landmark-specific failure feedback
- completion confirmation

It must not move this workflow into a shared/common component merely because another landmark has superficially similar actions. Only neutral primitives may be shared after proving they do not create coupling.

## Accessibility and Input

The interaction must preserve meaning across supported input methods. Critical state must not rely only on color, tiny text, hover, or precise pointer input.

## Interaction Acceptance Checklist

- [ ] Destination and obstacle are readable before instruction-heavy UI.
- [ ] Every interaction issues an explicit runtime command.
- [ ] Invalid actions do not mutate state.
- [ ] Visual feedback follows authoritative state.
- [ ] Interruption and reload behavior are defined.
- [ ] Crossing completion requires destination verification.
- [ ] Module-owned UI remains inside the Bridge Crossing boundary.
