# Builders Valley World Coordinate System

Status: Active Foundation Standard  
Authority: Builders Valley Production Bible  
Scope: Every Builders Valley landmark, camera, terrain system, runtime renderer, verification screenshot, and implementation plan.

## 1. Purpose

This document establishes one shared spatial language for Builders Valley. Camera, terrain, composition, landmark layout, runtime placement, and screenshot review must describe the world through the same coordinate and depth model.

The coordinate system is a design contract. Runtime code may implement it, but runtime code must not redefine it.

## 2. World axes

Builders Valley uses a horizontal world plane.

- `X` is the horizontal east-west axis.
- `Y` is the horizontal north-south axis.
- `Z` is elevation.
- Positive `X` points east.
- Negative `X` points west.
- Positive `Y` points north, away from the primary hero camera.
- Negative `Y` points south, toward the primary hero camera.
- Positive `Z` points upward.

When an engine uses a different native axis convention, the adapter or world owner must perform the conversion. Design documents continue to use this Production Bible convention.

## 3. Player-facing depth language

The following terms describe visual depth from the approved hero camera, not permanent compass directions:

### Foreground

The nearest readable layer. It frames the scene, establishes scale, and provides visual entry into the world. Foreground mass must not hide the primary gameplay route.

### Midground

The principal gameplay and landmark layer. The active route, bridge, workshop, characters, and primary interaction space normally belong here.

### Background

The distant world boundary and destination layer. It provides silhouette, atmosphere, orientation, and future promise without competing with the active landmark.

### Horizon band

The transition between distant terrain and sky. Its silhouette must remain intentional and must not be created accidentally by repeated patch layers.

## 4. Canonical world origin

Each landmark owns a local origin at its primary gameplay anchor.

For Bridge Crossing, the provisional local origin is the center of the traversable bridge deck. The final landmark contract may refine the exact anchor, but it must not change the global axis convention.

Local landmark coordinates must be convertible to world coordinates through one explicit transform owned by the authoritative world runtime.

## 5. Spatial hierarchy

The world is described through four nested levels:

1. World — the complete Builders Valley journey.
2. Region — a major geographic or progression area.
3. Landmark — a memorable navigational and gameplay destination.
4. Gameplay zone — a bounded interaction, traversal, learning, or construction space within a landmark.

Objects and decorative instances are not spatial authority levels. They belong to a zone, landmark, or terrain system.

## 6. World grid policy

The grid is an implementation aid, not the visible design language.

- Terrain silhouettes must not reveal the grid unintentionally.
- Rivers, cliffs, paths, and vegetation boundaries must read as geographic forms rather than rectangles.
- Snapping may be used for collision, construction, and deterministic placement.
- Visual geometry may deviate from the logical grid while preserving gameplay alignment.

The detailed cell scale and regional partitioning are defined in `02-WORLD-GRID.md`.

## 7. Hero-frame reference

Every landmark must declare:

- hero camera position and target;
- player spawn or evaluation position;
- foreground, midground, and background ownership;
- primary route direction;
- primary landmark silhouette;
- safe UI exclusion areas.

A hero frame is invalid when its spatial reading depends on debug labels, minimaps, or explanatory text.

## 8. Directional naming

Use compass terms for stable world geography and camera-relative terms for visual composition.

Correct:

- eastern cliff wall;
- northern destination ridge;
- foreground river bank;
- background temple silhouette.

Avoid ambiguous phrases such as `left side` or `behind the bridge` unless the camera context is explicitly named.

## 9. Runtime authority

Only the authoritative Builders Valley world owner may translate landmark-local coordinates into final runtime world placement.

Independent patches must not establish competing origins, axis interpretations, camera-relative offsets, or duplicate terrain coordinate systems.

## 10. Acceptance criteria

This standard passes when:

- all spatial documents use the same axis convention;
- every landmark has one declared local origin;
- runtime placement can be traced from world to region to landmark to zone;
- hero-frame descriptions distinguish foreground, midground, and background;
- visual terrain does not expose the logical grid unintentionally;
- no runtime patch invents an independent coordinate authority.

## 11. Non-goals

This document does not define:

- final world dimensions;
- engine-specific units;
- final landmark coordinates;
- collision resolution;
- navigation mesh implementation;
- decorative asset placement.

Those decisions belong to World Grid, Landmark Contracts, and Runtime Architecture.