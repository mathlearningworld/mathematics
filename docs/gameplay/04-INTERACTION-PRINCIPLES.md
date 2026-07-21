# 04 — Interaction Principles

## Purpose

This document records the interaction principles that should guide future Builders Valley gameplay refinements.

## 1. Preserve Flow

Repeated actions should require fewer repeated selections. The game should remember valid ongoing intent and reduce unnecessary hotbar management.

## 2. Assist Without Taking Control

Automation may anticipate the likely next action, but manual player input remains authoritative.

## 3. Separate Intent from Context

Persistent player plans and temporary environmental needs are different states:

```text
player intent = persistent
world context = temporary
visible selection = resolved result
```

## 4. Make Automatic Changes Reversible

When the reason for an automatic change disappears, the game should return to the still-valid previous intention.

## 5. Require Evidence Before State Changes

Collection intent should update only after inventory actually increases. Placement continuity should update only after placement actually succeeds.

## 6. Avoid Selection Oscillation

Targeting and tool selection must remain stable enough that nearby objects do not cause rapid, confusing hotbar switching.

## 7. Respect Inventory Truth

The game must never select a placement material that is unavailable. Inventory state is authoritative over remembered intent.

## 8. Keep Feedback Legible

The selected hotbar slot, highlighted target, held item, and available action should communicate the same current interaction state.

## 9. Prefer Small Verified Loops

Gameplay intelligence should be added through small loops that can be manually tested:

```text
implement
→ play
→ observe friction
→ adjust rule
→ verify again
```

Large speculative systems should not replace a loop that is already understandable and playable.

## 10. Human Playtesting Is the Final Gameplay Gate

Lint, build, and automated tests can prove technical integrity. They cannot prove that an interaction feels natural. Gameplay changes remain incomplete until verified through actual play.

## Current Proven Rule

The first proven rule in this document set is:

> A proximity-selected gathering tool is a temporary contextual override and must restore the active placement material after the player leaves the resource, provided the intent remains valid.

## Related Documents

- `01-PLAYER-INTENT.md`
- `02-CONTEXTUAL-TOOL-SELECTION.md`
- `03-PLACEMENT-INTENT-LOOP.md`
