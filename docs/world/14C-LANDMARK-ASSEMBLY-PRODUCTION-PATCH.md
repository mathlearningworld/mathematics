# 14C — Landmark Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014C
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 6 — Landmark Assembly
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 6 landmark assembly workflow for Builder's Valley. It extends MLW-DOC-014 and depends on the terrain, water, and vegetation contracts established by Phases 3, 4, and 5.

Landmarks are not decorative hero assets. They are orientation, progression, composition, and gameplay authorities. Their placement, scale, silhouette, visibility, approach, and runtime behavior must work as one continuous landmark network across the journey from Arrival Overlook to Workshop Functional Core.

## 6 Landmark Assembly

### 6.1 Landmark Objective

The landmark system must enable the player to understand where they are, where they are going, and how the current zone relates to the wider valley.

A landmark is accepted only when it:

- has a clear role in orientation, progression, gameplay, or destination identity;
- remains readable from its required approach and decision viewpoints;
- preserves the hierarchy between primary, secondary, and supporting anchors;
- connects correctly to terrain, water, vegetation, paths, and gameplay space;
- communicates scale and function before fine detail is perceived;
- does not create a false route, false interaction, or misleading destination;
- remains within measured or explicitly owned provisional runtime budgets.

Visual spectacle alone is not landmark acceptance.

### 6.2 Landmark Hierarchy

Builder's Valley uses the following authoritative hierarchy:

| Level | Landmark | Authority |
|---|---|---|
| Primary Constructed Landmark | Bridge Crossing | Central crossing objective, route hinge, and strongest constructed silhouette |
| Primary Natural Landmark | Waterfall Vista | Natural depth anchor, river-source logic, and long-range orientation |
| Secondary Functional Landmark | Workshop Terrace | Destination identity and transition into actionable space |
| Entry Orientation Landmark | Arrival Overlook | First-frame comprehension and valley reveal |
| Supporting Landmarks | rock gates, distinctive trees, ridge breaks, path markers, workshop-edge structures | Local confirmation and transition support |

Supporting landmarks may reinforce the primary network but must not compete with the Bridge Crossing, Waterfall Vista, Workshop Terrace, or Arrival Overlook.

### 6.3 Authoritative Landmark Assembly Order

Landmarks must be assembled in the following order:

```text
Landmark Entry Contract Review
→ Global Landmark Network Blockout
→ Arrival Overlook
→ Waterfall Vista
→ Bridge Crossing
→ Workshop Terrace
→ Supporting Landmark Network
→ Cross-Landmark Sightline Pass
→ Gameplay and Interaction Integration
→ Material, Lighting, and FX Readiness
→ Runtime Controls and Evidence
```

A downstream landmark must not be finalized while an upstream route, elevation, water, vegetation, or sightline dependency remains unstable.

### 6.4 Entry Contract

Production landmark assembly begins only when the following inputs are stable enough for review:

- approved zone sequence and transition contracts;
- approved terrain scale, elevations, foundations, and traversable routes;
- approved river width, waterfall position, basin, shoreline, and bridge clearance;
- approved vegetation reservations for major sightlines, approach corridors, and landmark silhouettes;
- protected gameplay clearances for bridge approaches, vista space, workshop arrival, interaction zones, and camera movement;
- required gameplay-camera viewpoints identified;
- provisional runtime ownership for landmark geometry, materials, collision, LOD, culling, lighting, FX, and audio support.

When an input remains provisional, affected landmark work remains blockout or prototype work.

### 6.5 Global Landmark Network

Before individual landmark polish begins, the complete network must be readable as one journey.

The network must demonstrate:

- Arrival Overlook reveals at least one meaningful destination cue;
- the Waterfall Vista establishes natural depth and river-source direction;
- the Bridge Crossing becomes increasingly legible during approach;
- the Workshop Terrace becomes the dominant destination after the crossing;
- each landmark hands orientation authority to the next without abrupt loss of direction;
- supporting landmarks confirm movement but do not redirect the player incorrectly;
- no zone depends on text, minimap, or UI markers to compensate for failed spatial communication.

Required network views include the arrival frame, river-axis view, waterfall approach, bridge approach from both directions, bridge exit, and workshop arrival.

### 6.6 Arrival Overlook Assembly

The Arrival Overlook is the first orientation authority.

It must provide:

- a safe and stable starting footprint;
- protected camera foreground and unobstructed first-frame composition;
- readable valley enclosure and route direction;
- preview of at least one downstream anchor without revealing every destination equally;
- a clear transition from observation into movement;
- no vegetation, rock, prop, fog, or foreground asset that blocks the intended reveal;
- boundary treatment that prevents unintended drops without relying only on invisible collision.

The overlook must not read as an isolated viewing platform disconnected from the Arrival Path.

### 6.7 Waterfall Vista Assembly

The Waterfall Vista is the primary natural landmark.

It must:

- align visually with the approved waterfall source, crest, drop, basin, and outflow;
- remain recognizable as a single natural system from near and distant views;
- establish vertical scale without overwhelming route readability;
- preserve a safe viewing area and camera clearance;
- remain structurally readable with mist, spray, and supporting FX disabled;
- use vegetation and rock framing to strengthen the silhouette rather than hide its source or impact zone;
- avoid implying an accessible route into unsafe terrain or water;
- maintain believable spatial audio source logic for later Phase 11 assembly.

A visually impressive waterfall with an unclear source, hidden basin, broken outflow, or misleading access cue fails the landmark contract.

### 6.8 Bridge Crossing Assembly

The Bridge Crossing is the primary constructed landmark and route hinge.

It must satisfy all of the following:

- bridge span, height, orientation, and supports match the approved river and terrain contract;
- both approaches reveal the bridge early enough for decision-making;
- bridge entry, crossing, and exit remain readable in both supported travel directions;
- railings, edges, collision, and recovery behavior communicate safety consistently;
- the bridge silhouette remains stronger than local props, vegetation, foam, mist, and shoreline detail;
- supports and abutments connect cleanly to terrain and water;
- the bridge does not create camera traps, collision snags, false side routes, or hidden drop hazards;
- crossing completion hands destination authority to the Workshop Terrace;
- functional width remains protected from decorative narrowing.

Any change to river width, bridge span, crossing elevation, support placement, or approach grade reopens both Water and Landmark review.

### 6.9 Workshop Terrace Landmark Assembly

The Workshop Terrace is the secondary functional landmark and destination threshold.

It must:

- become increasingly dominant after the bridge crossing;
- communicate that the player has reached a purposeful destination rather than another scenic zone;
- preserve a clear arrival frame and decompression space;
- distinguish public arrival, circulation, staging, and functional workshop areas;
- connect naturally to the bridge exit and Workshop Functional Core;
- reserve interaction, placement, storage, camera, and recovery clearances for Phase 7;
- use structure, roofline, silhouette, material contrast, and local vegetation control to create identity;
- avoid exposing detailed workshop clutter before the destination composition is stable.

The Workshop Terrace may preview function, but detailed operational assembly remains owned by Phase 7.

### 6.10 Supporting Landmark Network

Supporting landmarks provide local confirmation between major anchors.

Permitted supporting forms include:

- distinctive rock formations;
- controlled tree silhouettes;
- ridge openings and notches;
- path gates and natural thresholds;
- river bends and shoreline features;
- workshop-edge structures;
- small constructed markers consistent with world logic.

Each supporting landmark must have one declared purpose:

- confirm current route;
- announce a zone transition;
- frame a primary landmark;
- prevent a false route;
- provide local scale;
- support return-direction navigation.

Supporting landmarks must be removed or reduced when they duplicate authority, create visual noise, or compete with a primary anchor.

### 6.11 Sightline Preservation Contract

Landmark sightlines are protected production corridors.

For every primary and secondary landmark, the team must define:

- first intended reveal point;
- minimum readable duration or travel interval;
- required approach viewpoints;
- required return-direction viewpoints where applicable;
- foreground, midground, and background framing responsibilities;
- permitted temporary occlusion;
- prohibited permanent obstruction;
- weather, fog, lighting, vegetation, and FX conditions requiring revalidation.

Vegetation, props, architecture, terrain edits, and effects must be fitted around approved sightlines. They do not gain authority by being added later.

### 6.12 Scale and Silhouette Rules

Landmarks must communicate identity at gameplay distance before surface detail becomes visible.

Required rules:

- silhouette must remain identifiable from required views;
- scale must be consistent with player, terrain, water, and adjacent structures;
- major vertical and horizontal proportions must support the landmark role;
- repeated modular pieces must not expose obvious repetition at primary views;
- decorative attachments must not weaken the core silhouette;
- materials must support form separation without depending on excessive contrast or emissive treatment;
- distant representation must preserve landmark identity through LOD transitions;
- no landmark may rely on cinematic framing unavailable during normal gameplay.

### 6.13 Composition Contracts

Each major landmark has a composition contract:

| Landmark | Composition Contract |
|---|---|
| Arrival Overlook | Clear foreground, valley reveal, readable descent, controlled destination preview |
| Waterfall Vista | Natural framing, visible vertical drop, basin relationship, preserved route context |
| Bridge Crossing | Strong crossing silhouette, readable approaches, visible continuation, subordinate water detail |
| Workshop Terrace | Destination dominance after crossing, clear arrival space, functional identity, protected workshop transition |

Every contract must be validated from the gameplay camera, not only from editor or promotional viewpoints.

### 6.14 Gameplay and Interaction Integration

Landmark assembly must protect gameplay meaning.

Required controls include:

- no false interaction affordance on decorative landmark elements;
- no landmark collision that blocks the intended route or creates snag points;
- no climbable-looking surface that is blocked without clear visual explanation;
- no decorative opening that appears traversable but is not;
- protected interaction radii and placement zones near Workshop Terrace;
- safe bridge and overlook edges;
- recovery behavior for supported falls or traversal failures;
- camera-safe space near major reveals and transitions;
- debug visualization for collision, interaction, route, and safety volumes.

Gameplay behavior must be explicit. Missing authority blocks acceptance for the affected landmark.

### 6.15 Material, Lighting, FX, and Audio Readiness

Phase 6 establishes readiness constraints for later phases without finalizing their implementation.

Landmark materials must preserve hierarchy and distance readability. Lighting must preserve silhouettes and destination visibility. FX must support rather than obscure landmark form. Audio source logic must remain spatially credible.

Phase 6 owns:

- landmark visibility requirements;
- silhouette and contrast constraints;
- protected lighting and fog conditions;
- FX exclusion zones and maximum obstruction envelopes;
- physical audio source locations and orientation purpose;
- provisional runtime budgets.

Phases 9, 10, and 11 own final implementation and tuning.

### 6.16 Runtime Controls and Budgets

Landmark runtime cost is part of assembly completion.

Required controls include:

- mesh and modular-piece inventory;
- material and shader variant count;
- texture memory and resolution ownership;
- collision complexity and ownership;
- LOD chain and transition behavior;
- instancing or batching strategy where appropriate;
- culling groups and distance ownership;
- shadow casting and reception policy;
- reflection, transparency, and FX interaction cost;
- platform or quality-level fallback behavior;
- debug views for LOD, collision, bounds, and culling.

Until numeric targets are approved, costs remain provisional and require measurement, ownership, and a correction gate.

### 6.17 Landmark Validation Procedure

Landmark validation must be conducted in this order:

1. **Entry Contract Review** — confirm terrain, water, vegetation, route, and gameplay dependencies.
2. **Network Review** — validate the complete landmark sequence from arrival to workshop.
3. **Arrival Overlook Review** — inspect first-frame orientation and movement handoff.
4. **Waterfall Vista Review** — inspect source, silhouette, basin, framing, and safety.
5. **Bridge Crossing Review** — inspect both approaches, crossing, exit, collision, and destination handoff.
6. **Workshop Terrace Review** — inspect destination identity, arrival space, and Phase 7 readiness.
7. **Supporting Landmark Review** — remove competition, duplication, false routes, and visual noise.
8. **Sightline Review** — validate required reveals under approved camera and environment conditions.
9. **Gameplay Review** — test routes, safety, collision, interaction meaning, and recovery.
10. **Runtime Review** — measure geometry, materials, textures, shadows, collision, LOD, and culling.
11. **Evidence Capture** — record results, failures, corrections, owner, and reviewer decision.

Failure at an earlier stage blocks acceptance of later polish.

### 6.18 Required Landmark Evidence

The Landmark Assembly acceptance package must contain:

- top-down landmark network overview;
- Arrival Overlook first-frame capture;
- Waterfall Vista near and distant captures;
- waterfall structural capture with supporting FX disabled;
- Bridge Crossing captures from both approaches, crossing midpoint, and exit;
- Workshop Terrace arrival and destination-identity captures;
- sightline debug views for all primary and secondary landmarks;
- collision, safety, route, and interaction debug visualization;
- landmark scale references against player and adjacent terrain;
- LOD and culling evidence at required distances;
- mesh, material, texture, collision, and shadow inventory;
- runtime measurement or explicitly owned provisional budget;
- known issues, deferred corrections, and affected downstream gates;
- reviewer decision and applicable freeze level.

Evidence must represent the current landmark revision.

### 6.19 Revalidation Triggers

Landmark review must reopen when any of the following changes materially:

- terrain elevation, route grade, foundation, ridge, or valley silhouette;
- river width, water level, waterfall position, mist envelope, or shoreline treatment;
- vegetation mass affecting a protected sightline or silhouette;
- bridge span, support, orientation, width, collision, or approach;
- Workshop Terrace position, footprint, elevation, or destination silhouette;
- player scale, movement controller, camera framing, or field of view;
- lighting, fog, weather, FX, or audio treatment affecting landmark readability;
- material, LOD, culling, shadow, collision, or runtime partition configuration;
- a downstream phase reveals a false route, hidden landmark, interaction conflict, or runtime failure.

Revalidation must identify the exact evidence and downstream freeze levels invalidated by the change.

### 6.20 Section Exit Gate

Landmark Assembly is accepted when the production team can demonstrate that:

- Builder's Valley has a coherent landmark network from Arrival Overlook to Workshop Functional Core;
- Arrival Overlook, Waterfall Vista, Bridge Crossing, and Workshop Terrace have distinct and stable authority;
- primary and secondary landmarks remain readable from required gameplay views;
- supporting landmarks reinforce rather than compete with the primary network;
- terrain, water, vegetation, route, safety, and interaction contracts remain valid;
- Bridge Crossing is safe, readable in both directions, and hands destination authority to Workshop Terrace;
- Workshop Terrace is ready for Phase 7 functional assembly;
- runtime controls, LOD, culling, collision, materials, and budgets are measured or explicitly owned;
- required evidence represents the current revision;
- material changes trigger targeted downstream revalidation.

Until this gate passes, Workshop Assembly may proceed only as controlled functional blockout. Gameplay Readability, Lighting, FX, Ambient Audio, Composition Validation, and Runtime Validation must not treat landmark-dependent work as production-frozen.
