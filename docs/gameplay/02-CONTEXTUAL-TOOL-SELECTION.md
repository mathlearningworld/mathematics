# 02 — Contextual Tool Selection

## Purpose

This document defines when the game may automatically select a tool because of nearby world context.

## Core Principle

> Contextual selection is a reversible assistive layer. It must improve responsiveness without destroying the player’s ongoing plan.

## Entry Condition

A contextual override may activate when:

- a valid interactable resource becomes the current target;
- the target requires a specific tool;
- the required tool exists in the hotbar;
- the target is inside the approved interaction range.

## Exit Condition

The contextual override ends when:

- the target leaves interaction range;
- the target is destroyed or becomes invalid;
- another eligible target becomes authoritative;
- the player manually selects a different slot;
- the gameplay mode changes.

## Restoration Rule

When the override ends, the system must restore the active placement intent if:

- that intent still exists;
- the material remains in inventory;
- no manual selection has superseded it.

Otherwise, the system falls back to the current manual/default selection.

## Multiple Nearby Targets

When multiple targets are eligible, selection should be deterministic. Future implementations should prefer, in order:

1. target explicitly aimed at or facing the player;
2. nearest valid target;
3. stable previous target to avoid rapid switching;
4. deterministic tie-breaker.

The current implementation may use the existing target authority until a dedicated targeting policy is introduced.

## Stability Rules

- Do not switch tools repeatedly for the same unchanged target.
- Do not clear placement intent during context updates.
- Do not interpret framework-driven selection as manual selection.
- Do not restore a material slot with zero inventory.
- Avoid oscillation when two targets have nearly equal priority.

## Verified Loop

```text
Placement material selected
→ enter resource proximity
→ required gathering tool selected
→ leave resource proximity
→ placement material restored
```

## Current Implementation Reference

```text
frontend/src/sandbox/scenes/BuildersValleyIntentPatch.js
```
