# 14B — Vegetation Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014B
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 5 — Vegetation Assembly
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 5 vegetation assembly workflow for Builder's Valley. It extends MLW-DOC-014 and follows the terrain and water authority established by MLW-DOC-014 Section 3 and MLW-DOC-014A.

Vegetation is treated as a composition, navigation, ecological, and runtime system rather than decorative scatter. Trees, shrubs, reeds, grass, roots, deadfall, and ground cover must reinforce zone identity, route readability, landmark hierarchy, shoreline logic, and performance constraints without hiding unresolved terrain, water, collision, or gameplay failures.

## 5 Vegetation Assembly

### 5.1 Vegetation Objective

Vegetation must make Builder's Valley feel inhabited by a coherent natural system while preserving the player's ability to understand movement, landmarks, boundaries, interaction space, and destination hierarchy.

Vegetation is accepted only when it:

- reinforces the identity and emotional role of each zone;
- frames the primary journey rather than obscuring it;
- preserves approved landmark and destination sightlines;
- supports terrain, shoreline, cliff, river, and workshop transitions;
- communicates playable and non-playable space before collision is encountered;
- avoids false paths, collision traps, camera obstruction, and interaction interference;
- remains within measured or explicitly owned provisional runtime budgets.

Visual density is not completion. A dense scene that weakens orientation, hides gameplay, or exceeds runtime limits has failed the vegetation pass.

### 5.2 Authoritative Vegetation Assembly Order

Vegetation must be assembled in the following dependency order:

```text
Terrain and Water Contract Review
→ Vegetation Zone Map
→ Landmark and Route Sightline Reservations
→ Primary Canopy Masses
→ Secondary Tree Groups
→ Shoreline and Wet-Zone Vegetation
→ Cliff, Ridge, and Boundary Vegetation
→ Workshop Transition Vegetation
→ Shrubs and Mid-Level Masses
→ Ground Cover and Grass
→ Roots, Deadfall, and Local Detail
→ Collision, LOD, Culling, and Wind Controls
→ Runtime Measurement and Evidence
```

A downstream vegetation layer must not compensate for an upstream failure. Grass cannot repair poor terrain materials, reeds cannot conceal a broken shoreline, and dense trees cannot replace a readable boundary or coherent valley silhouette.

### 5.3 Entry Contract

Production vegetation assembly begins only when the following inputs are stable enough for placement:

- approved terrain bounds, slopes, paths, cliffs, ridges, and foundation pads;
- approved river, waterfall, basin, shoreline, and bridge-water relationships;
- approved zone sequence and transition contracts;
- protected traversal corridors and interaction clearances;
- approved primary landmark positions and required sightlines;
- workshop terrace and functional footprint reservations;
- camera views required for Arrival Overlook, Waterfall Vista, Bridge Approach, Bridge Crossing, and Workshop Terrace;
- provisional runtime ownership for vegetation materials, shadows, collision, LOD, instancing, and culling.

Vegetation may be prototyped earlier, but no placement can be production-frozen while its terrain, water, route, landmark, or workshop dependency remains unresolved.

### 5.4 Vegetation Zone Map

Before individual placement begins, the production team must define a vegetation zone map that describes ecological and compositional intent across Builder's Valley.

Each zone must declare:

- dominant vegetation type;
- canopy density;
- mid-level density;
- ground-cover density;
- wetness or dryness character;
- visual openness requirement;
- landmark and route visibility requirement;
- boundary and containment function;
- runtime density class;
- exclusions for gameplay, camera, water, and architecture.

Minimum zone intentions are:

| Zone | Vegetation Intent |
|---|---|
| Arrival Overlook | Controlled framing, open first read, minimal foreground obstruction |
| Arrival Path | Directional edge rhythm, readable descent, no false side routes |
| River Corridor | Cooler and wetter character, bank reinforcement, preserved river visibility |
| Waterfall Vista | Natural landmark framing, controlled openness, mist-compatible planting |
| Bridge Approach | Anticipation framing, bridge reveal protection, clear approach width |
| Bridge Crossing | Minimal obstruction, strong landmark silhouette, low local clutter |
| Workshop Terrace | Transition from natural valley to maintained functional space |
| Workshop Functional Core | Sparse, intentional planting outside interaction and staging areas |
| Supporting Ridges and Edges | Valley enclosure, depth layering, non-playable boundary support |

The zone map must create meaningful contrast. Uniform vegetation density across the whole slice is prohibited.

### 5.5 Sightline and Clearance Reservations

Sightlines and gameplay space are reserved before vegetation placement.

Protected sightlines include:

- Arrival Overlook to the valley journey and destination cues;
- Arrival Path toward the river corridor;
- River Corridor toward Waterfall Vista and Bridge Approach;
- Waterfall Vista toward the waterfall source and basin;
- Bridge Approach toward the bridge silhouette;
- both bridge approaches toward the crossing exit;
- Bridge Crossing toward Workshop Terrace;
- Workshop Terrace toward Workshop Functional Core.

Protected clearances include:

- full traversable route width plus camera margin;
- bridge entry, exit, support, and rail clearances;
- shoreline safety and recovery space;
- workshop interaction, storage, staging, and placement zones;
- landmark foundation access and silhouette envelopes;
- camera-safe foreground space at required review views;
- runtime culling and streaming boundaries where vegetation clusters are partitioned.

Vegetation that enters a protected sightline or clearance must be explicitly reviewed. Random scatter may never have authority over these reservations.

### 5.6 Primary Canopy Masses

Primary canopy masses establish the large vegetation composition and valley enclosure.

They must:

- be placed as intentional groups rather than isolated random trees;
- frame the valley and landmarks without forming a uniform wall;
- create foreground, midground, and background depth;
- preserve route openings and long sightlines;
- respond to terrain, moisture, wind exposure, and zone identity;
- avoid repetitive spacing, scale, rotation, and silhouette;
- maintain camera clearance above and beside playable routes;
- leave bridge and workshop silhouettes visually dominant;
- remain compatible with shadow, overdraw, LOD, and culling budgets.

Primary canopy placement must be reviewed from gameplay cameras before secondary vegetation is added.

### 5.7 Secondary Tree Groups

Secondary trees refine rhythm, transition, and local identity after canopy masses pass review.

Secondary placement must:

- support rather than compete with primary groups;
- strengthen transitions between open and enclosed space;
- avoid evenly distributed procedural appearance;
- preserve route turns, recovery spaces, and camera movement;
- avoid roots, trunks, branches, or collision entering gameplay corridors;
- maintain sufficient separation from water surfaces, bridge geometry, and workshop structures;
- use reusable cluster logic where appropriate without visible repetition;
- declare collision requirements by role rather than enabling full collision by default.

Single hero trees are permitted only when they have a clear composition, navigation, or storytelling responsibility.

### 5.8 Shoreline and Wet-Zone Vegetation

Shoreline vegetation is a shared contract with Water Assembly.

Wet-zone planting may include reeds, grasses, roots, moss, low shrubs, and selected trees where the terrain and water relationship supports them.

Required rules:

- preserve continuous water-terrain contact;
- do not hide shoreline seams that remain structurally unresolved;
- keep safe and unsafe water edges readable;
- avoid implying a traversable route into blocked or hazardous water;
- preserve waterfall, basin, river, and bridge visibility;
- keep vegetation outside required foam, mist, splash, and audio-source envelopes;
- avoid excessive transparency stacking with water and FX;
- assign wind, wetness, material, LOD, and culling behavior appropriate to the zone;
- maintain clear separation from water collision, trigger, and recovery volumes.

Vegetation touching water must appear physically grounded. Floating roots, submerged trunks without intent, and repeated uniform reed borders are prohibited.

### 5.9 Cliff, Ridge, and Boundary Vegetation

Boundary vegetation supports visual containment but may not replace coherent terrain boundaries.

It must:

- reinforce non-playable space before invisible collision is encountered;
- break artificial terrain repetition without concealing major silhouette problems;
- preserve deliberate openings for landmarks and route cues;
- avoid creating accidental climbable ladders or shortcut patterns;
- maintain camera clearance near playable edges;
- use lower-cost representations for distant supporting zones where appropriate;
- avoid dense transparent overlap against the sky unless budgeted and measured;
- remain compatible with terrain culling, streaming, and shadow ownership.

Invisible barriers may supplement vegetation and terrain containment, but vegetation alone must not misrepresent actual gameplay access.

### 5.10 Workshop Transition Vegetation

The transition into Workshop Terrace must communicate a shift from natural valley to maintained functional destination.

Vegetation near the workshop must:

- reduce density as the player approaches functional space;
- preserve the workshop silhouette and arrival frame;
- keep workbench, storage, staging, and placement zones clear;
- avoid branches, roots, grass, or shrubs entering interaction radii;
- support believable maintenance through trimmed edges, compacted ground, selected planting, or controlled regrowth;
- preserve access around structures and landmark foundations;
- avoid fire, safety, or workflow conflicts where later design authority defines them;
- maintain a clear distinction between decorative planting and usable objects.

Workshop vegetation must never create ambiguity about what is interactive, collectible, placeable, or merely environmental.

### 5.11 Shrubs and Mid-Level Masses

Mid-level vegetation shapes edges, hides lower-frequency transitions, and builds local depth.

It must:

- frame paths without narrowing approved clearance;
- prevent visual emptiness without forming opaque walls;
- preserve destination and landmark visibility;
- avoid blocking interaction markers and gameplay objects;
- vary density according to the zone map;
- remain compatible with player, camera, and object collision;
- use instancing, clustering, or batching where supported;
- limit transparency overlap and shadow cost;
- remain removable without exposing an unresolved structural failure.

Shrubs may soften valid transitions, but may not be used to hide broken terrain, water, bridge, or workshop geometry.

### 5.12 Ground Cover and Grass

Ground cover is introduced only after primary and secondary vegetation, routes, shorelines, landmarks, and workshop clearances are stable.

Ground cover must:

- reinforce terrain material regions and moisture logic;
- preserve route contrast and not spread into walkable surfaces without intent;
- stay clear of interaction, placement, recovery, and camera-critical areas;
- avoid dense overlap at shoreline transparency and FX zones;
- use density falloff around paths, foundations, structures, and water edges;
- remain readable at gameplay distance rather than optimized only for close editor views;
- provide quality-level, distance, and platform fallback behavior;
- avoid collision unless explicitly required.

Uniform full-surface grass coverage is prohibited. Density must be authored according to gameplay, ecology, composition, and runtime value.

### 5.13 Roots, Deadfall, and Local Detail

Roots, fallen branches, stumps, leaf litter, small plants, and local detail are final vegetation layers.

They may be used to:

- reinforce age, moisture, disturbance, and zone history;
- connect tree placement to terrain and shoreline contact;
- add local direction or composition rhythm;
- support workshop maintenance contrast;
- break repeated cluster patterns.

They must not:

- create traversal snags or hidden collision;
- imply false routes or climbable access;
- obstruct interaction or placement zones;
- hide terrain, water, or structure seams that require correction;
- add high-frequency noise that weakens route readability;
- exceed object-count, draw, shadow, or memory budgets without evidence.

### 5.14 Collision and Gameplay Interaction

Vegetation collision must be assigned by gameplay responsibility.

Required rules:

- major trunks or barriers use simplified collision where needed;
- branches, leaves, grass, and small ground cover do not receive expensive collision by default;
- collision shapes must match the readable physical form closely enough to avoid invisible catches;
- no overlapping vegetation collision may trap the player or camera;
- no vegetation may close an approved route or recovery space;
- climbability, destruction, collection, harvesting, or interaction behavior remains unresolved unless defined by gameplay authority;
- interactive vegetation must be visually distinguishable from static environment vegetation;
- debug visualization must show vegetation collision and interaction ownership.

Missing gameplay behavior decisions must be recorded as unresolved authority and block acceptance only where they affect the current slice.

### 5.15 Wind, Motion, and Material Behavior

Vegetation motion must support life and environmental coherence without creating visual noise or runtime instability.

Required controls include:

- wind direction and intensity coherent across adjacent zones;
- reduced or specialized motion for trunks, heavy branches, reeds, grass, and small leaves;
- no extreme deformation that causes geometry clipping or collision mismatch;
- stable motion near workshop structures, bridge geometry, water, and camera-critical views;
- distance-based reduction or disabling of expensive animation;
- material variants kept within an approved or provisional shader budget;
- alpha testing, transparency, subsurface, and two-sided rendering measured where used;
- wetness or moisture response coordinated with shoreline and waterfall zones.

Wind may not obscure route cues, create distracting landmark motion, or invalidate LOD transitions.

### 5.16 LOD, Instancing, Culling, and Runtime Controls

Vegetation runtime controls are part of assembly completion.

Required controls include:

- LOD or equivalent distance representation for all repeated vegetation classes;
- stable silhouette transitions without severe popping at gameplay distances;
- instancing, batching, or cluster ownership for repeated assets;
- culling distances based on gameplay and composition value;
- shadow distance and caster selection by importance;
- density and quality-level scaling for target hardware;
- material, texture, vertex, triangle, draw, overdraw, and memory measurement;
- collision disabled or simplified for distant and decorative vegetation;
- partition, streaming, or activation ownership for vegetation groups;
- debug views for LOD, culling, overdraw, collision, and cluster boundaries.

Until numeric budgets are approved by runtime implementation, each cost remains provisional and must have measurement, owner, and correction gate. Provisional does not mean unlimited.

### 5.17 Vegetation Validation Procedure

Vegetation validation must be conducted in this order:

1. **Entry Contract Review** — confirm terrain, water, route, landmark, workshop, and camera dependencies.
2. **Zone Map Review** — confirm ecological, compositional, and density intent for every zone.
3. **Sightline Review** — validate all protected landmark, destination, and route views.
4. **Primary Canopy Review** — inspect macro groups, enclosure, depth, and silhouette.
5. **Secondary Tree Review** — inspect rhythm, transitions, repetition, and clearance.
6. **Shoreline Review** — inspect water contact, safety readability, transparency overlap, and FX envelopes.
7. **Boundary Review** — inspect non-playable containment, false routes, and camera clearance.
8. **Workshop Review** — inspect destination visibility and all functional clearances.
9. **Mid-Level and Ground-Cover Review** — inspect route contrast, density, and interaction visibility.
10. **Collision Review** — test traps, snags, shortcuts, camera interference, and interaction ownership.
11. **Motion and Material Review** — inspect wind coherence, shader behavior, transparency, and distance stability.
12. **Runtime Review** — measure LOD, culling, instancing, shadows, draw cost, overdraw, collision, and memory.
13. **Evidence Capture** — record results, failures, corrections, owners, and reviewer decision.

Failure at an earlier stage blocks acceptance of later vegetation polish.

### 5.18 Required Vegetation Evidence

The Vegetation Assembly acceptance package must contain:

- vegetation zone map with density and exclusion intent;
- top-down vegetation overview showing routes, landmarks, water, and workshop clearances;
- Arrival Overlook first-frame capture;
- Arrival Path route-readability capture;
- River Corridor and shoreline captures;
- Waterfall Vista framing capture;
- Bridge Approach and both bridge-direction captures;
- Workshop Terrace and Functional Core clearance captures;
- sightline debug evidence for all protected views;
- vegetation collision and interaction debug visualization;
- LOD and culling evidence at representative distances;
- instancing, batching, cluster, partition, or streaming ownership record;
- vegetation asset, material, texture, shadow, and collision inventory;
- runtime measurement or explicitly owned provisional budget;
- known issues, deferred corrections, and affected downstream gates;
- reviewer decision and applicable freeze level.

Evidence must represent the current terrain, water, landmark placeholder, workshop footprint, and vegetation revision. Evidence from superseded geometry or placement states is invalid.

### 5.19 Vegetation Revalidation Triggers

Vegetation review must reopen when any of the following changes materially:

- terrain shape, route width, grade, cliff, ridge, or foundation pad;
- river course, water level, shoreline, waterfall, basin, foam, mist, or safety boundary;
- bridge position, span, approach, support, or silhouette;
- workshop terrace, structure footprint, interaction area, staging zone, or destination frame;
- primary landmark position, scale, silhouette, or required sightline;
- gameplay camera framing or traversal capability;
- collision, interaction, collection, destruction, or climbability rules;
- lighting, fog, wind, material, shadow, LOD, culling, partition, or runtime configuration;
- a downstream pass reveals false routes, visibility failure, collision traps, excessive overdraw, or performance regression.

Revalidation must identify which evidence, vegetation groups, and downstream freeze levels are no longer valid.

### 5.20 Section Exit Gate

Vegetation Assembly is accepted when the production team can demonstrate that:

- every Builder's Valley zone has explicit vegetation identity, density, openness, and exclusion rules;
- primary canopy and secondary vegetation reinforce composition without obscuring the journey;
- required landmark, route, water, bridge, and workshop sightlines remain readable;
- shorelines and wet zones integrate without hiding water or terrain failures;
- cliffs, ridges, and supporting edges communicate containment without relying on vegetation alone;
- workshop functional and interaction spaces remain clear and visually distinct;
- vegetation collision, interaction ownership, wind, materials, LOD, instancing, culling, shadows, and quality scaling are explicit;
- runtime cost is measured or governed by an owned provisional budget;
- required evidence represents the current revision;
- material upstream or downstream changes trigger targeted revalidation.

Until this gate passes, Landmark Assembly may proceed only with controlled placeholders and sightline prototypes. Workshop, gameplay readability, lighting, FX, audio, composition, and runtime passes must not treat vegetation-dependent visibility or performance as production-frozen.
