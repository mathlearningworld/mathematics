# 01 — Player Intent

## Purpose

This document defines how Math Learning World preserves the player’s current gameplay intention across automatic assistance.

## Core Principle

> Automatic behavior may assist the player, but must not silently replace an active player intention unless a higher-authority action explicitly does so.

## Intent Sources

Player intent may originate from:

- manual hotbar selection;
- successful collection of a material that is immediately available for placement;
- an explicit cancel action;
- a new successful collection that supersedes the previous placement material;
- depletion of the intended material.

## Persistent Intent

A placement intent remains active while:

- the intended material still exists in inventory;
- the player has not manually selected another slot;
- the player has not explicitly cancelled;
- no newer successful collection has established a new placement intent.

## Temporary Context

Nearby world objects may require a context-specific tool. This selection is temporary and must be treated as an override, not as a replacement for the persistent player intent.

## Priority Model

The displayed hotbar selection should be resolved in this order:

1. active contextual override;
2. active placement intent;
3. manual/default selection.

## Intent Cancellation

Placement intent is cleared only when one of these occurs:

- intended inventory reaches zero;
- the player manually selects another slot;
- the player explicitly cancels placement;
- a new successful collection establishes a newer placement intent;
- the current gameplay mode makes placement invalid by design.

## Prohibited Behavior

- clearing placement intent merely because a resource enters proximity;
- treating an automatic tool change as manual player choice;
- restoring an empty or unavailable inventory slot;
- forcing the player to reselect the same material after every temporary interaction.

## Verified Example

```text
Collect wood
→ wood becomes active placement intent
→ approach a rock
→ pickaxe becomes temporary contextual override
→ leave the rock
→ wood is restored for placement
```

## Current Implementation Reference

```text
frontend/src/sandbox/scenes/BuildersValleyIntentPatch.js
```
