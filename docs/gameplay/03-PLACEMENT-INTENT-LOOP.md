# 03 — Placement Intent Loop

## Purpose

This document defines the verified gameplay loop that connects collection, contextual gathering, and continued placement.

## Loop Definition

```text
Collect material A successfully
→ record A as placement intent
→ select A for placement
→ approach resource B
→ select B's required tool as a temporary override
→ leave B's interaction range
→ remove the override
→ restore A for placement
```

## State Model

The loop depends on three distinct meanings:

```text
placementIntentMaterial
contextualOverrideTool
visibleHotbarSelection
```

These meanings must not be collapsed into one mutable selected-slot value.

## Transition Rules

### Successful Collection

- Confirm inventory increased.
- Set the collected material as the current placement intent.
- Select its material slot automatically.

### Enter Resource Context

- Preserve placement intent.
- Select the required gathering tool temporarily.
- Mark the selection as system-driven.

### Leave Resource Context

- Clear only the contextual override.
- Restore the placement-intent material if inventory remains.
- Do nothing if no valid placement intent remains.

### Successful Placement

- Decrease inventory through the existing placement behavior.
- Keep the same placement intent while at least one unit remains.
- Clear the intent when the material is depleted.

### Manual Selection

- Treat manual hotbar selection as higher authority.
- Clear the previous automatic placement intent unless the design explicitly introduces a suspend/resume action later.

## Acceptance Scenarios

### Scenario A — Basic Restore

```text
Collect wood
→ wood selected
→ approach rock
→ pickaxe selected
→ leave rock
→ wood selected again
```

### Scenario B — Continue Placement

```text
Collect three wood
→ place one wood
→ wood remains selected with two remaining
```

### Scenario C — Material Depleted

```text
Place final unit
→ inventory reaches zero
→ material is not restored afterward
```

### Scenario D — Manual Override

```text
Wood placement intent active
→ player manually selects another slot
→ wood intent is cancelled
→ leaving nearby resource does not restore wood
```

### Scenario E — New Collection

```text
Wood placement intent active
→ collect stone successfully
→ stone becomes the new placement intent
```

## Human Verification Status

The basic restore loop was manually verified in Builders Valley on 2026-07-21.

## Current Implementation Reference

```text
frontend/src/sandbox/scenes/BuildersValleyIntentPatch.js
```
