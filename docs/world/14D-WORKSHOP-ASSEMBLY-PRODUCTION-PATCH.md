# 14D — Workshop Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014D
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 7 — Workshop Assembly
- Scope: Builder's Valley — Production Environment Slice 001D

## Purpose

This production patch defines the authoritative Phase 7 workshop assembly workflow for Builder's Valley. It extends MLW-DOC-014 and depends on the approved terrain, water, vegetation, and landmark contracts established by Phases 3–6.

The workshop is not treated as a decorative building. It is the primary destination, learning hub, interaction anchor, and operational identity of Builder's Valley. Its exterior, approach, threshold, interior, tool language, navigation, interaction clearances, lighting support, audio ownership, and runtime structure must operate as one coherent gameplay system.

## 7 Workshop Assembly

### 7.1 Workshop Objective

The workshop must:

- read as the primary destination from the approved arrival and bridge routes;
- communicate purpose before the player enters;
- support clear movement from exterior approach to interior activity zones;
- preserve the visual and gameplay hierarchy established by the landmark phase;
- create a believable place for building, learning, experimentation, storage, and progression;
- support future mission, tutorial, NPC, tool, crafting, and progression systems without forcing premature implementation;
- remain understandable with minimal language dependence;
- remain within measured or explicitly owned provisional runtime budgets.

Decorative richness does not compensate for unclear entry, blocked circulation, poor interaction spacing, incorrect scale, visual noise, inaccessible tools, or unstable runtime behavior.

### 7.2 Authoritative Workshop Assembly Order

Workshop assembly must follow this dependency order:

```text
Entry Contract Review
→ Exterior Massing and Silhouette
→ Terrace and Approach Integration
→ Primary Entrance and Threshold
→ Interior Spatial Blockout
→ Functional Zone Allocation
→ Player Circulation and Camera Clearances
→ Primary Workstations and Interaction Anchors
→ Storage, Tools, and Prop Families
→ Structural Detail and Material Language
→ Lighting Support Contract
→ Audio Source Contract
→ Collision, Navigation, and Gameplay Safety
→ Runtime Segmentation and Budget Review
→ Evidence Capture and Acceptance
```

No later detail layer may be used to conceal an unresolved problem in an earlier layer. Props cannot hide poor circulation, lighting cannot hide an unreadable entrance, and clutter cannot substitute for functional zoning.

### 7.3 Entry Contract

Production workshop assembly begins only when the following inputs are stable:

- approved Workshop Terrace terrain elevation and playable boundary;
- approved approach path from Bridge Crossing to Workshop Terrace;
- approved workshop landmark silhouette and visibility envelope;
- stable vegetation exclusions around the approach, entrance, and exterior activity areas;
- approved water, mist, glare, and sightline constraints affecting the workshop route;
- approved gameplay cameras for long-range destination read, approach, threshold, and interior entry;
- known player capsule, camera boom, navigation, and interaction clearance requirements;
- explicit ownership of provisional workshop dimensions and target runtime constraints.

If any required input remains provisional, dependent workshop work remains prototype-only and cannot be reported as production-frozen.

### 7.4 Workshop Role and Spatial Identity

The workshop must communicate its role through form, layout, and visible activity rather than relying on signage or text alone.

Its spatial identity should express:

- a welcoming destination rather than a sealed industrial facility;
- a place where objects are made, tested, repaired, and learned from;
- a progression from public approach to active workspace to specialized support areas;
- visible evidence of use, iteration, and practical creativity;
- a coherent relationship between exterior structures, interior workstations, storage, and future expansion.

The workshop should feel established enough to be trusted, but flexible enough to support growth and new systems.

### 7.5 Exterior Massing and Silhouette

The exterior must preserve the landmark authority established in Phase 6.

Required conditions:

- the primary mass remains recognizable from the approved long-range views;
- roofline, tower, crane, chimney, wheel, banner, or other silhouette features are intentional and subordinate to the primary mass;
- the building does not visually merge with cliffs, dense vegetation, or background structures;
- exterior additions preserve a clear main entrance hierarchy;
- scale remains believable relative to the player, bridge, terrace, and nearby props;
- the silhouette remains readable under approved lighting, fog, and weather conditions;
- distant representation and near representation remain visually consistent;
- modular construction seams do not create accidental visual fragmentation.

Any change to workshop height, footprint, roof profile, entrance location, or major silhouette feature reopens Landmark Assembly review.

### 7.6 Terrace and Approach Integration

The Workshop Terrace must operate as a transition zone between journey and activity.

The terrace and approach must:

- provide a clear route from the bridge or primary path to the entrance;
- preserve sufficient stopping space for orientation before entry;
- avoid terrain steps, props, vegetation, or railings that narrow the route unexpectedly;
- support readable secondary exterior activity areas without competing with the main entrance;
- provide safe edges near slopes, water, drops, or machinery;
- maintain clear sightlines to the doorway and key exterior interaction anchors;
- preserve camera room for approach, turn, pause, and threshold movement;
- avoid decorative routes that imply inaccessible doors or false entrances.

The player should understand where to go before reaching the final approach segment.

### 7.7 Primary Entrance and Threshold

The entrance is a gameplay transition and must be assembled before interior decoration.

Required entrance properties:

- visible from the approved approach path;
- visually dominant over service doors and decorative openings;
- sufficient width and height for player, camera, and supported carried-object states;
- collision-free threshold with no hidden step, lip, snag, or ceiling conflict;
- readable transition between exterior and interior lighting;
- clear framing through architecture, floor treatment, doors, awnings, or controlled contrast;
- no prop, foliage, FX, or signage blocking the entry silhouette;
- support for open, closed, animated, or future stateful door behavior without changing the base route contract.

Threshold validation must include slow movement, sprinting, turning, camera rotation, and any supported carry or interaction stance.

### 7.8 Interior Spatial Blockout

The interior must be resolved as navigable space before workstations, tools, or decorative props are introduced.

The blockout must establish:

- entrance landing and orientation view;
- primary circulation loop or spine;
- central activity space;
- primary workstation locations;
- storage and support zones;
- vertical circulation, if any;
- future expansion or locked-zone boundaries, if applicable;
- exterior-to-interior sightline relationships;
- ceiling, beam, doorway, and camera clearances;
- collision ownership for floors, walls, platforms, railings, stairs, and machinery envelopes.

The player should not need text instructions to understand the basic spatial organization.

### 7.9 Functional Zone Allocation

Each workshop zone must have one clear primary purpose.

Recommended functional categories include:

- Welcome and Orientation Zone;
- Core Building or Assembly Zone;
- Tool Selection Zone;
- Material and Object Storage Zone;
- Test or Demonstration Zone;
- Repair or Upgrade Zone;
- Mission or Planning Zone;
- Display and Progress Zone;
- Support or Service Zone;
- Future Expansion Zone.

The exact feature implementation may remain deferred, but the spatial allocation, circulation, visibility, and ownership must be explicit.

Zones must not be created solely because empty floor area remains. Every zone requires a gameplay, narrative, operational, or future-system justification.

### 7.10 Circulation and Camera Clearances

Workshop circulation must support natural movement without precision steering.

Required controls include:

- primary routes wider and clearer than secondary service paths;
- turning space around major workstations;
- no dead-end pockets unless intentionally used for a clear destination;
- no narrow gaps between props that appear traversable but are not;
- sufficient camera clearance near walls, beams, stairs, shelves, and large machines;
- safe transitions between floor elevations;
- readable stair, ramp, ladder, or platform access;
- no collision protrusions that catch the player capsule;
- no camera clipping that reveals exterior voids or hidden geometry under normal play;
- navigation continuity between entrance, core activity, storage, and exit.

Circulation must be tested with debug collision and navigation visualization enabled.

### 7.11 Primary Workstations and Interaction Anchors

Primary workstations establish the operational heart of the workshop.

Each workstation must declare:

- functional role;
- player approach direction;
- interaction point or interaction envelope;
- camera behavior and readable focal area;
- required standing clearance;
- relationship to nearby tools, materials, storage, or output area;
- idle-state visual communication;
- future active-state, animation, UI, or feedback ownership;
- collision and navigation behavior;
- runtime activation and culling behavior where applicable.

Primary workstations should use distinctive silhouettes and spatial placement. They must not depend on labels alone to communicate different functions.

### 7.12 Interaction Envelope Contract

Every planned interaction anchor must reserve physical and visual space before detailed prop dressing.

The interaction envelope must preserve:

- unobstructed player approach;
- sufficient rotation and exit space;
- camera visibility of the active surface or object;
- no overlap with doors, stairs, navigation pinch points, or other interaction zones;
- no small decorative collision inside the player envelope;
- support for expected hand, tool, carried-object, or placement animations;
- readable focus against surrounding clutter;
- stable behavior under supported field of view and aspect ratio conditions.

Any interaction that cannot be tested yet must remain visibly marked as provisional and owned by a future gameplay integration gate.

### 7.13 Tool, Material, and Storage Language

Tools and storage must communicate category, availability, and workshop logic with minimal language dependence.

Required principles:

- related tools use coherent silhouettes, colors, racks, containers, or spatial grouping;
- storage shows a believable relationship between input materials, active work, and finished objects;
- important tools remain visually accessible rather than buried in decoration;
- empty, available, occupied, locked, and future states can be represented without rebuilding the entire prop system;
- repeated containers use controlled variation rather than random clutter;
- tool scale remains compatible with player interaction and world proportions;
- storage placement does not block circulation or interaction envelopes;
- high-frequency objects receive stronger readability than low-priority background detail.

The workshop may appear busy, but it must never become visually unsearchable.

### 7.14 Prop Hierarchy and Clutter Control

Props must be assembled in three levels:

```text
Primary Functional Props
→ Secondary Supporting Props
→ Tertiary Story and Surface Detail
```

Primary Functional Props define gameplay or major workshop identity. Secondary Supporting Props explain how the space operates. Tertiary Story Detail adds history, personality, and use.

Clutter is accepted only when it:

- reinforces zone purpose;
- preserves movement and interaction clarity;
- does not create false affordances;
- remains visually grouped rather than uniformly scattered;
- avoids excessive collision complexity;
- supports batching, instancing, culling, and reuse;
- remains subordinate to primary workstations and routes.

Random density is not environmental storytelling.

### 7.15 Structural Detail and Construction Logic

Workshop architecture must show a coherent construction system.

Structural assembly must confirm:

- walls, posts, beams, roof, floor, platforms, and supports connect plausibly;
- stairs, ramps, railings, balconies, and service structures are physically understandable;
- large machinery or suspended objects have credible support;
- material transitions align with construction logic;
- weather exposure, wear, repair, and reinforcement appear in plausible locations;
- modular repetition is broken through meaningful structural variation rather than arbitrary noise;
- inaccessible decorative architecture does not suggest playable routes;
- structural detail does not reduce camera or player clearance.

### 7.16 Material and Surface Language

The workshop material system must distinguish function and wear without creating excessive material complexity.

Required material groups may include:

- structural timber or equivalent primary frame;
- stone, masonry, or foundation materials;
- metal supports, hardware, tools, and machinery;
- floor and work-surface materials;
- storage and container materials;
- glass, fabric, rope, paper, ceramic, or other controlled accents;
- worn, repaired, scorched, wet, dusty, or polished variants where justified.

Materials must:

- preserve major form readability;
- use controlled roughness and value ranges;
- avoid high-frequency noise across every surface;
- support lighting and interaction readability;
- minimize unnecessary unique material instances;
- provide platform-appropriate fallback quality;
- remain consistent between exterior and interior representation.

### 7.17 Visual Guidance Without Language Dependence

The workshop must support intuitive use through spatial and visual cues.

Guidance may use:

- route width and floor direction;
- light and value contrast;
- repeated shape or color families;
- visible tools and outputs;
- workstation silhouettes;
- controlled animation or motion;
- open space around important targets;
- framing through architecture;
- progressive reveal from entrance to activity zone.

Text signs may support understanding but cannot be the only indicator of destination, function, or interaction.

### 7.18 Gameplay Safety and Collision

Workshop gameplay behavior must be explicit.

Required safety controls include:

- collision on all structural boundaries needed for play;
- no trap gaps behind machinery, shelving, stairs, or exterior attachments;
- no accidental access to roofs, beams, voids, or incomplete spaces unless designed;
- no sharp collision edges in primary circulation;
- railings or blockers at meaningful drop hazards;
- supported recovery behavior for accessible vertical or machinery hazards;
- consistent treatment of decorative versus interactive props;
- clear ownership of movable, static, breakable, animated, or future-state objects;
- no invisible blocker where a visible structural explanation is expected;
- debug visualization for collision, navigation, interaction envelopes, and restricted zones.

Missing gameplay consequence decisions block final acceptance for the affected space.

### 7.19 Lighting Support Contract

Phase 7 establishes workshop lighting needs and fixture logic. Phase 9 owns final lighting assembly and tuning.

Phase 7 owns:

- location and purpose of practical fixtures;
- daylight opening and occlusion requirements;
- entrance adaptation and threshold readability;
- workstation illumination requirements;
- route and stair safety requirements;
- fixture geometry, attachment, and visual source logic;
- provisional shadow, emissive, and activation ownership;
- restrictions needed to preserve landmark visibility from outside.

Phase 9 owns:

- final light types and intensities;
- color temperature and contrast tuning;
- final shadow quality;
- baked, mixed, or dynamic implementation;
- exposure adaptation;
- final platform quality and runtime budgets.

Lighting may not redefine workshop circulation or hide unresolved spatial readability failures.

### 7.20 Ambient and Operational Audio Contract

Phase 7 establishes physical audio-source logic. Phase 11 owns final ambient audio assembly.

Required source categories may include:

- exterior workshop identity source;
- machinery or powered system locations;
- tool activity zones;
- fire, furnace, waterwheel, ventilation, or similar environmental systems;
- storage and material handling zones;
- entrance and threshold transition;
- quiet planning, display, or learning zones;
- future NPC or mission activity areas.

Audio planning must preserve:

- believable location and attenuation;
- separation from waterfall and river ambience;
- clear transition between exterior and interior sound fields;
- no dominant operational sound from inactive or invisible machinery;
- activation, concurrency, culling, and platform ownership.

### 7.21 Runtime Segmentation and Controls

Workshop runtime cost must be planned during assembly.

Required controls include:

- modular mesh count and merge strategy;
- interior/exterior visibility and culling ownership;
- occlusion behavior for walls, floors, roof, and large machinery;
- LOD or representation strategy for exterior landmark views;
- material and shader variant count;
- texture resolution and memory ownership;
- prop instancing and repeated-family strategy;
- collision complexity and simplified collision ownership;
- animated-object and future-interaction activation rules;
- lighting fixture count and shadow ownership;
- audio source count and activation ranges;
- particle, dust, smoke, spark, or machinery FX ownership;
- platform-specific fallback and quality levels.

Until numeric targets are approved, each provisional cost must have a measurement method, owner, and correction gate. Provisional does not mean unlimited.

### 7.22 Workshop Validation Procedure

Workshop validation must be conducted in this order:

1. **Entry Contract Review** — confirm terrace, route, landmark, clearance, and runtime inputs.
2. **Exterior Massing Review** — inspect scale, silhouette, entrance hierarchy, and long-range read.
3. **Approach Review** — test bridge-to-terrace route, stopping space, camera room, and entry visibility.
4. **Threshold Review** — test doorway, floor transition, collision, camera, and lighting transition.
5. **Interior Blockout Review** — inspect orientation, circulation, vertical clearance, and spatial hierarchy.
6. **Functional Zone Review** — verify each zone has one clear purpose and sufficient area.
7. **Circulation Review** — test all primary and secondary routes with collision and navigation debug views.
8. **Workstation Review** — inspect silhouettes, approach directions, interaction envelopes, and focal readability.
9. **Storage and Prop Review** — inspect category grouping, clutter control, false affordances, and movement clearance.
10. **Construction and Material Review** — inspect structural logic, material hierarchy, wear, and repetition.
11. **Safety Review** — test traps, blockers, drops, restricted areas, and recovery behavior.
12. **Lighting and Audio Contract Review** — verify source logic and downstream ownership.
13. **Runtime Review** — measure geometry, materials, textures, collision, lights, audio, animation, and culling.
14. **Evidence Capture** — record results, failures, corrections, owners, and reviewer decision.

Failure at an earlier stage blocks acceptance of later decoration or polish.

### 7.23 Required Workshop Evidence

The Workshop Assembly acceptance package must contain:

- top-down Workshop Terrace and building footprint overview;
- long-range landmark capture from approved arrival and bridge views;
- exterior silhouette and primary entrance capture;
- bridge-to-workshop approach sequence;
- threshold clearance and collision evidence;
- interior floor plan with functional zones identified;
- primary circulation and navigation debug visualization;
- camera-clearance captures at constrained interior locations;
- primary workstation layout and interaction-envelope visualization;
- storage, tool, and prop-family inventory;
- false-affordance and blocked-route review;
- structural construction and material-group inventory;
- practical-light fixture and daylight-opening plan;
- ambient and operational audio-source plan;
- exterior/interior visibility, LOD, and culling evidence;
- geometry, material, texture, collision, lighting, audio, and animation measurements or owned provisional budgets;
- known issues, deferred systems, owners, and affected downstream phases;
- final Section 7 reviewer decision.

### 7.24 Revalidation Triggers

Workshop Assembly must be reopened when any of the following changes materially:

- Workshop Terrace elevation, slope, boundary, or approach route;
- bridge exit or workshop approach alignment;
- workshop footprint, height, roofline, or primary silhouette;
- entrance location, dimensions, or threshold behavior;
- interior floor plan or major circulation route;
- primary workstation location or interaction envelope;
- player capsule, camera, carry, placement, or navigation requirements;
- functional zone purpose or future-system allocation;
- major structural, machinery, storage, or prop-family placement;
- collision, restricted-area, or recovery behavior;
- daylight openings, practical fixtures, or lighting source logic;
- audio source location or activation behavior;
- runtime segmentation, LOD, culling, material, texture, or performance targets;
- downstream gameplay implementation that invalidates provisional assumptions.

A revalidation trigger reopens only the affected workshop layers and their dependent downstream phases unless evidence shows a broader structural impact.

### 7.25 Section Exit Gate

Phase 7 is complete only when:

- the workshop reads as Builder's Valley's primary destination;
- the exterior silhouette remains consistent with the approved landmark hierarchy;
- the approach and entrance are unambiguous;
- the threshold is safe and camera-compatible;
- the interior has a readable spatial hierarchy and circulation system;
- every functional zone has an explicit purpose and owner;
- primary workstations have reserved interaction envelopes;
- tools, storage, and props communicate function without requiring text;
- clutter does not compromise movement, interaction, or visual search;
- structural and material logic are coherent;
- gameplay collision, navigation, safety, and restricted zones are explicit;
- lighting and audio source contracts are ready for downstream assembly;
- runtime controls are measured or provisionally owned;
- required evidence is complete;
- unresolved issues are documented with owner and correction gate;
- the designated reviewer records PASS.

Phase 8 — Gameplay Readability may begin only after this exit gate passes or after explicitly approved, bounded exceptions are recorded.
