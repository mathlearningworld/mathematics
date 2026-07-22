# Bridge Crossing — Acceptance Contract

## Purpose

This document is the final readiness and acceptance authority for Bridge Crossing. The landmark is not considered complete because files exist, screenshots look attractive, or one interaction succeeds once.

Acceptance requires agreement across Product, Repository, Runtime, Operational, and Visual evidence.

## Status Vocabulary

Each criterion must be recorded as one of:

- `PASS`
- `FAIL`
- `DEFERRED`
- `NOT APPLICABLE`

`DEFERRED` must include the missing evidence and the owner of the next action.

## Gate 1 — Contract Readiness

Before implementation begins:

- [ ] Mission contract is approved.
- [ ] Terrain contract is approved.
- [ ] Composition contract is approved.
- [ ] Gameplay contract is approved.
- [ ] Asset rules are approved.
- [ ] Runtime owners are identified.
- [ ] Landmark local boundary and origin are defined.
- [ ] Learning activity contract is defined when applicable.
- [ ] Persistence behavior is defined when applicable.
- [ ] Required verification artifacts are named.

Failure at this gate means implementation is not ready.

## Gate 2 — Repository Verification

Repository evidence must confirm:

- [ ] Bridge Crossing remains isolated as its own module or landmark-owned surface.
- [ ] No duplicate World, Terrain, Camera, Lighting, Material, or Persistence authority was introduced.
- [ ] Public contracts and exports match the approved Runtime Mapping.
- [ ] State transitions are explicit and reviewable.
- [ ] Workflow-specific UI and components remain owned by Bridge Crossing.
- [ ] Shared code is limited to neutral primitives and approved infrastructure.
- [ ] Verification scripts or tests cover contract-critical behavior where practical.
- [ ] Changed paths remain within approved scope, or exceptions are documented.

Repository PASS does not imply Runtime or Operational PASS.

## Gate 3 — Runtime Verification

Runtime evidence must confirm:

- [ ] The world loads with exactly one active authority for each global runtime domain.
- [ ] Bridge Crossing assembles at the approved location and scale.
- [ ] The pre-completion route is blocked operationally.
- [ ] Valid interactions can advance the landmark state.
- [ ] Invalid actions do not produce completion.
- [ ] The completed bridge updates visible structure and collision/traversability together.
- [ ] The player can cross from approach to destination.
- [ ] Interruption and re-entry preserve a coherent state.
- [ ] Completion effects end without leaving camera, input, or interaction state corrupted.
- [ ] Build, lint, typecheck, tests, or applicable runtime verification commands pass.

## Gate 4 — Operational Flow Verification

The complete player flow must be exercised:

```text
Enter approach
  ↓
Observe obstacle and destination
  ↓
Discover next valid action
  ↓
Prepare required input or resources
  ↓
Complete bridge action
  ↓
Verify route activation
  ↓
Cross bridge
  ↓
Reach destination continuation
```

Operational PASS requires the flow to work through the real runtime path, including any API, learning engine, persistence, projection, or UI surfaces involved.

## Gate 5 — Screenshot Verification

The evidence package must include uniquely named artifacts for:

### Hero Frame

- [ ] Player approach, obstacle, span, and destination are readable.
- [ ] Foreground does not obscure the mission.
- [ ] Visual hierarchy survives grayscale review.

### Gameplay Frame

- [ ] Current action and relevant structure are visible.
- [ ] Interaction cues do not dominate the environment.
- [ ] Player scale and reachable surfaces are believable.

### Exploration Frame

- [ ] The landmark connects coherently to the wider world.
- [ ] False routes and visual dead ends are not introduced accidentally.

### Scale Validation

- [ ] Bridge width, rail height, supports, route width, and landing areas are credible relative to the player.

### Lighting Validation

- [ ] Lighting guides attention toward the crossing and destination.
- [ ] Exposure, fog, and effects preserve silhouette and route clarity.

Screenshot PASS does not prove collision, state transitions, persistence, or learning correctness.

## Gate 6 — Product Acceptance

A human reviewer must confirm:

- [ ] The environment teaches the crossing problem before dense UI is needed.
- [ ] The bridge is necessary because of terrain, not merely decorative.
- [ ] The solution creates a meaningful change in reachable world space.
- [ ] The interaction feels understandable and recoverable.
- [ ] The result supports curiosity, confidence, and continued exploration.
- [ ] The landmark belongs visually and philosophically within Builders Valley.

## Mandatory Failure Conditions

Bridge Crossing must be marked `FAIL` when any of the following is observed:

- more than one authoritative owner mutates a global runtime domain;
- the player can bypass the crossing unintentionally;
- visible bridge completion and traversability disagree;
- the destination or obstacle cannot be read from the approved approach;
- gameplay correctness is decided by terrain, renderer, or decorative code;
- a reload creates duplicate completion, rewards, or contradictory state;
- screenshot polish is used to declare success while Runtime or Operational evidence is missing;
- implementation changes the Product Contract without approval.

## Evidence Package

The final Bridge Crossing evidence package should record:

- repository branch and commit SHA;
- changed paths;
- verification commands and results;
- runtime owner map;
- state transition evidence;
- Hero, Gameplay, Exploration, Scale, and Lighting screenshots;
- known limitations;
- human validation result;
- final status for each gate.

Artifact names must be unique and must not overwrite previous review rounds.

## Completion Rule

Bridge Crossing is complete only when:

```text
Contract Ready
AND Repository PASS
AND Runtime PASS
AND Operational PASS
AND Screenshot PASS
AND Human Product Acceptance PASS
```

Any missing gate leaves the landmark incomplete, regardless of progress in the other gates.
