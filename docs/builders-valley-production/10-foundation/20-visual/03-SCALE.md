# Builders Valley Scale Standard

## Status

Foundation Contract — Active

## Purpose

Scale establishes physical credibility, gameplay comfort, landmark importance, and visual consistency across Builders Valley.

## Core Principle

**Player scale is the world reference.**

Every terrain mass, route, structure, prop, and landmark must be evaluated in relation to the player and the intended camera—not in isolated asset-preview space.

## Scale Reference System

The canonical player capsule and visible character height are the primary reference units.

Each production slice must record the active runtime values for:

- player visible height;
- player collision width and height;
- normal movement clearance;
- jump or step capability where applicable;
- camera distance and framing assumptions.

Blueprint documents may use relative units such as player-heights when exact runtime units are not yet locked.

## Gameplay Scale Classes

### Hand Scale

Objects directly handled, collected, placed, or inspected by the player.

They must remain readable at normal gameplay distance and must not require camera zoom unless inspection is an explicit mechanic.

### Interaction Scale

Workbenches, learning artifacts, resource nodes, doors, and other player-facing interaction points.

Their active area, silhouette, and approach space must be legible before the player reaches collision distance.

### Human Structure Scale

Homes, workshops, bridges, gates, stairs, platforms, and shelters.

These must provide believable clearance, circulation, support, and construction logic.

### Terrain Scale

Hills, cliffs, ravines, river cuts, terraces, and forest boundaries.

Terrain scale must create route choice and spatial meaning without making the playable area feel like a miniature diorama or an empty oversized field.

### Landmark Scale

Major world anchors that support navigation, story, progression, or learning identity.

A landmark may exceed ordinary structure scale, but its size must be justified by its world role and remain readable from the intended approach path.

## Route and Clearance Policy

All routes must be reviewed against player movement and camera behavior.

A route contract must declare:

- minimum clear width;
- expected passing or turning space;
- vertical clearance;
- maximum step, slope, or obstacle assumptions;
- camera obstruction risk;
- whether the route is primary, secondary, or optional.

A visually plausible path that fails movement comfort is not accepted.

## Vertical Scale

Vertical differences must communicate gameplay meaning.

Examples:

- a low rise may signal a walkable transition;
- a terrace may organize progression;
- a cliff must clearly read as blocked or hazardous;
- a high landmark may support long-distance orientation.

Arbitrary vertical exaggeration that only improves one screenshot is forbidden.

## Bridge and Crossing Scale

A bridge must be evaluated as a complete relationship among:

- player width;
- deck width;
- guard or edge treatment;
- span length;
- support size;
- terrain cut;
- camera framing;
- approach and exit space.

The crossing must feel required by the terrain. An oversized bridge over a trivial gap or a narrow bridge across a major route breaks world credibility.

## Vegetation and Prop Scale

Vegetation must support biome identity, boundary, depth, and navigation.

Trees and props must not be scaled randomly to fill composition holes. Variation must remain biologically or structurally plausible within the art direction.

Repeated props require controlled scale ranges rather than unrestricted randomization.

## Landmark Hierarchy

Scale must reinforce the world hierarchy:

1. player and immediate interaction;
2. local route and supporting structure;
3. primary landmark;
4. distant world context.

A secondary prop must not accidentally become more visually dominant than the landmark through size alone.

## Camera Relationship

Scale approval is inseparable from the canonical camera.

An object is not correctly scaled merely because its numeric dimensions appear plausible. It must also:

- read clearly at gameplay distance;
- fit intended framing;
- preserve route visibility;
- avoid excessive camera clipping or occlusion;
- support foreground, midground, and background depth.

## Runtime Ownership

The project must maintain one authoritative source for:

- player dimensions;
- world-unit assumptions;
- movement clearance constants;
- shared modular construction dimensions;
- reusable scale presets where applicable.

Landmark modules must reference those standards rather than silently redefining them.

## Landmark Scale Contract

Before implementation, each landmark must declare:

- local player-scale reference;
- primary structure dimensions or relative ratios;
- route widths and clearances;
- terrain height relationships;
- intended near, mid, and far readability;
- deliberate scale exaggerations and their reason;
- forbidden scale distortions.

## Verification

Scale passes when:

- the player feels correctly proportioned to the world;
- routes are comfortable and readable;
- structures communicate believable use and support;
- terrain creates meaningful separation without wasted emptiness;
- the landmark hierarchy is clear;
- repeated assets remain consistent;
- canonical camera views preserve the intended proportions.

## Failure Conditions

Scale fails when:

- assets appear imported from unrelated worlds;
- a route looks correct but feels too narrow, wide, low, or empty in motion;
- props are resized merely to repair composition;
- landmark size has no gameplay or narrative justification;
- one Hero Frame works while runtime movement exposes disproportion;
- duplicate local constants diverge from global scale authority.
