# Bridge Crossing — Mission Contract

## Purpose

Bridge Crossing is the first landmark contract used to prove that the Builders Valley Production Bible can move coherently from product intent to world form, gameplay, runtime ownership, and verification.

The landmark must teach through the environment before explicit instruction. The player should understand that a crossing is needed because the terrain creates a meaningful separation between two reachable spaces.

## Player Experience

The intended experience is:

1. Notice a destination beyond a terrain cut.
2. Understand that the direct route is blocked.
3. Explore the local area and discover the means to create or restore a crossing.
4. Build, repair, or activate the bridge through the landmark gameplay loop.
5. Cross successfully and gain access to the next meaningful area.
6. Leave with increased confidence that the world can be understood and changed through observation and action.

## Learning Intent

Bridge Crossing introduces the core Builders Valley idea that problems can be represented spatially and solved through construction, sequencing, comparison, and verification.

The landmark may support mathematics through dimensions, quantities, balance, ordering, shape, or measurement, but the exact learning activity must be defined by its owning gameplay module rather than improvised by terrain or rendering code.

## Landmark Promise

The landmark promises that:

- the crossing problem is readable without relying on dense UI;
- the bridge exists because the terrain makes it necessary;
- the destination is visible or inferable before the player solves the crossing;
- the solution changes the player's reachable world state;
- the completed crossing remains visually understandable after the interaction is finished.

## Scope

This contract owns the Bridge Crossing landmark-specific mission, gameplay meaning, local terrain relationship, composition, asset rules, and acceptance criteria.

It does not own global camera, lighting, material families, world coordinates, persistence, or shared interaction infrastructure. Those remain governed by Foundation contracts and their authoritative runtime owners.

## Non-Goals

Bridge Crossing is not intended to:

- become a generic construction system for every landmark;
- redefine global camera behavior;
- add decorative assets before terrain and route readability are solved;
- teach through text when the environment can communicate the same idea;
- become a one-off visual set piece with no meaningful player action.

## Success Criteria

The mission succeeds when a first-time player can:

- identify the destination;
- identify why the route is blocked;
- discover the relevant action or resources;
- complete the crossing interaction;
- confirm visually and operationally that the new route is usable.

## Required References

Implementation must comply with:

- `00-product/00-WORLD-BIBLE.md`
- `00-product/01-DESIGN-VOCABULARY.md`
- `00-product/10-IMPLEMENTATION-GATE.md`
- `10-foundation/10-spatial/*`
- `10-foundation/20-visual/*`
- `10-foundation/30-runtime/*`
