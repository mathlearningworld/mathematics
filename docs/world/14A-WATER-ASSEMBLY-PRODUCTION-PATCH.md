# 14A — Water Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014A
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 4 — Water Assembly
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 4 water assembly workflow for Builder's Valley. It extends MLW-DOC-014 without replacing its existing terrain, zone, or assembly authority.

Water is treated as a structural gameplay and composition system rather than a decorative surface. The river, waterfall, basin, shoreline, foam, mist, audio sources, collision boundaries, and runtime controls must operate as one continuous system grounded in the terrain contract established by Phase 3.

## 4 Water Assembly

### 4.1 Water Objective

Water provides the natural spine of Builder's Valley. It communicates elevation, direction, depth, zone transition, environmental identity, and the relationship between the Waterfall Vista, Bridge Crossing, and Workshop Terrace.

The water system is accepted only when it:

- follows a physically understandable source-to-outflow direction;
- reinforces the intended player journey without creating false routes;
- remains compatible with bridge geometry and shoreline safety;
- supports the Waterfall Vista as a readable natural landmark;
- integrates with terrain, rocks, vegetation, lighting, FX, and audio without hiding structural failures;
- remains within measured or explicitly owned provisional runtime budgets.

Water visual richness does not compensate for a broken channel, implausible elevation, unsafe edge, discontinuous flow, or excessive shader and transparency cost.

### 4.2 Authoritative Water Assembly Order

Water must be assembled in the following dependency order:

```text
Terrain Water Contract Review
→ River Centerline and Flow Direction
→ River Surface Blockout
→ Waterfall Crest and Drop
→ Receiving Basin and Outflow
→ Shoreline and Bank Integration
→ Bridge and Landmark Integration
→ Gameplay Safety and Collision
→ Surface Material and Motion
→ Foam, Ripples, and Wetness Support
→ Mist and Supporting FX Ownership
→ Audio Source Placement
→ Runtime Measurement and Evidence
```

A downstream water layer must not be used to conceal a failure in an upstream layer. Foam cannot hide a broken shoreline, mist cannot hide a misaligned waterfall, and reflections cannot hide incorrect flow or elevation.

### 4.3 Terrain Entry Contract

Production water assembly begins only when Phase 3 provides the following stable inputs:

- approved river centerline and flow direction;
- approved channel width, depth, and bank profile;
- stable waterfall crest, drop, basin, and outflow terrain;
- bridge support and crossing clearances;
- safe playable edges near the river and basin;
- shoreline space for foam, wetness, rocks, and vegetation;
- approved gameplay-camera views for Arrival Path, River Corridor, Waterfall Vista, Bridge Approach, and Bridge Crossing;
- terrain collision and partition ownership sufficient for water integration.

If any required terrain input remains provisional, the corresponding water work remains prototype-only and cannot be reported as production-frozen.

### 4.4 River Corridor Assembly

The river corridor must read as one continuous natural system across all zones.

Required river properties:

- the surface follows the approved terrain gradient;
- the visible flow direction remains consistent from source to outflow;
- width changes occur intentionally and support composition or gameplay;
- bends preserve a readable continuation rather than appearing to terminate unexpectedly;
- banks frame the river without repeating a uniform procedural profile;
- the surface does not intersect terrain, float above the channel, or expose gaps under normal cameras;
- the player can distinguish water, shoreline, safe ground, and non-traversable edges;
- bridge approaches and supports remain visually and physically compatible with the water corridor;
- long views preserve the river as an orienting feature without overpowering primary landmarks.

The river surface may be authored as a spline, mesh system, terrain-water integration, or engine-native water body. The implementation form is flexible, but ownership, collision behavior, culling, and material cost must be explicit.

### 4.5 Waterfall Assembly

The waterfall is the primary natural landmark and must be resolved structurally before decorative FX are added.

The waterfall system consists of:

```text
Source Reach
→ Crest and Lip
→ Falling Water Body
→ Impact Zone
→ Receiving Basin
→ Outflow Continuation
```

Required conditions:

- the source reach visibly supplies the waterfall;
- the crest aligns with the terrain lip without floating or clipping;
- the falling body follows a credible vertical path;
- the waterfall silhouette remains readable from the approved vista and river views;
- the impact zone aligns with the basin surface and terrain depression;
- the basin has sufficient volume and visible outflow continuity;
- mist, spray, splash, and foam remain supporting layers rather than structural substitutes;
- the waterfall does not block required route, bridge, workshop, or camera visibility;
- distant and near views use appropriate representation and runtime cost.

The final waterfall look must be validated with FX disabled and enabled. If the system fails when FX are disabled, the structural assembly has not passed.

### 4.6 Receiving Basin and Outflow

The receiving basin must connect the waterfall drop to the river corridor without appearing as an isolated decorative pool.

The basin must:

- receive the falling water at the approved impact location;
- preserve a believable water level relative to the river;
- provide visible or strongly implied outflow direction;
- avoid terrain-water seams and exposed underside geometry;
- preserve safe player boundaries and recovery behavior;
- provide controlled space for impact foam, ripples, mist, wet rocks, and shoreline vegetation;
- remain readable from the Waterfall Vista and nearby gameplay cameras;
- avoid excessive transparency stacking and overdraw.

Where the player cannot access the basin, visual containment must communicate that condition before collision is encountered.

### 4.7 Shoreline and Bank Integration

Shoreline assembly is a shared contract between water, terrain, rock, vegetation, and gameplay readability.

Shorelines must:

- maintain continuous contact between terrain and water;
- avoid visible gaps, hard floating edges, and repeated uniform borders;
- use macro bank form before small rocks, decals, foam, or vegetation;
- preserve path-water separation along traversable routes;
- communicate safe approach areas and blocked edges consistently;
- reserve space for wetness, foam, rock sockets, roots, reeds, and ground cover without overfilling the edge;
- avoid vegetation or props that visually imply a traversable route into unsafe water;
- remain stable across expected water motion and camera distance.

Shoreline decoration is applied only after the structural edge and collision contract pass.

### 4.8 Bridge and Landmark Integration

Water and the Bridge Crossing form one production dependency.

The bridge integration pass must confirm:

- the bridge span matches the approved river width;
- bridge supports do not create implausible water intersections;
- abutments connect cleanly to both banks;
- water motion and foam do not obscure required bridge clearance or collision evidence;
- the bridge silhouette remains dominant over local water detail;
- the crossing reads safely from both approach directions;
- reflections, glare, mist, or spray do not hide the workshop route or bridge entry;
- water representation below and beyond the bridge remains continuous under normal gameplay cameras.

Any material change to river width, water level, bridge span, support position, or crossing elevation reopens both Water Assembly and Landmark Assembly review.

### 4.9 Gameplay Safety and Collision

Water gameplay behavior must be explicit. No water body may rely on visual appearance alone to define player consequences.

Each water region must declare one of the following behaviors:

- non-interactive background water;
- visible but inaccessible water;
- blocked shoreline water;
- recoverable shallow water;
- hazardous or failure-state water;
- explicitly traversable water, only when supported by gameplay design.

Required safety controls include:

- consistent collision or trigger ownership;
- no gaps between shoreline blockers and terrain collision;
- no hidden pockets that trap the player or camera;
- no accidental walkable water surface unless intentionally designed;
- recovery or reset behavior for supported failure cases;
- readable edge treatment before the player reaches the blocker;
- bridge, basin, and river tests in both supported travel directions;
- debug visualization for water bounds, collision, triggers, and recovery volumes.

The guide does not invent gameplay consequences. Missing behavior decisions must be recorded as unresolved authority and block final acceptance for the affected region.

### 4.10 Water Surface Material and Motion

The water material must support readability, depth, and flow while remaining subordinate to gameplay and landmark hierarchy.

Required material controls include:

- base color and depth response appropriate to Builder's Valley;
- flow direction aligned with the river and waterfall system;
- motion scale that remains believable at gameplay distance;
- controlled opacity and refraction;
- reflection quality appropriate to the target runtime;
- normal detail that does not create noisy or contradictory flow;
- edge response compatible with shoreline foam and wetness;
- stable appearance under approved lighting and fog conditions;
- fallbacks or reduced-cost modes where required by target hardware.

Surface animation must not make stationary water appear to flow uphill, move sideways across the channel, or contradict the waterfall source.

### 4.11 Foam, Ripples, Wetness, and Supporting Detail

Supporting water detail is introduced only after river, waterfall, basin, shoreline, bridge integration, and safety behavior are stable.

Use foam where water behavior justifies it:

- waterfall crest and impact;
- receiving basin turbulence;
- controlled shoreline contact;
- bridge support disturbance;
- bends, rocks, or narrow channels where flow visibly accelerates.

Use ripples and wetness to reinforce contact and local activity, not to cover seams.

Supporting detail must:

- avoid continuous uniform foam borders;
- preserve route and landmark contrast;
- avoid excessive transparent layer overlap;
- use reusable and cullable systems where possible;
- remain visible at meaningful gameplay distances;
- declare ownership between Water Assembly and Phase 10 FX Assembly.

### 4.12 Mist and FX Ownership Boundary

Phase 4 establishes location, scale envelope, visibility requirement, and budget ownership for water-related FX. Phase 10 defines final FX implementation and polish.

Phase 4 owns:

- waterfall mist source location;
- impact spray envelope;
- river and basin foam requirements;
- visibility constraints from gameplay cameras;
- collision and route exclusion requirements;
- provisional density and runtime budget.

Phase 10 owns:

- final particle implementation;
- emission tuning;
- lifetime, motion, and variation;
- lighting response;
- final LOD, culling, and platform quality levels.

FX may not change the approved structural water silhouette, hide route cues, or invalidate runtime targets without reopening Water Assembly review.

### 4.13 Ambient Audio Source Contract

Phase 4 establishes the physical source logic for water audio. Phase 11 defines final ambient audio assembly.

Required source locations include:

- waterfall crest or falling body, where appropriate;
- impact and receiving basin;
- river corridor segments where flow character changes;
- bridge crossing, when local water presence must support spatial orientation.

Audio planning must preserve:

- believable attenuation from visible sources;
- smooth transitions across adjacent zones;
- no dominant waterfall sound where the waterfall is neither visible nor spatially plausible;
- separation between river ambience and workshop ambience;
- runtime ownership for source count, attenuation, and activation zones.

### 4.14 Runtime Controls and Budgets

Water runtime cost must be measured as part of assembly, not deferred to final optimization.

Required controls include:

- water mesh or spline segmentation and culling ownership;
- shader variant and material count;
- transparency and overdraw measurement;
- reflection and refraction quality level;
- planar, screen-space, probe, or fallback reflection ownership where applicable;
- shadow reception and casting behavior;
- normal, foam, flow, and depth texture memory;
- waterfall and shoreline FX density;
- water audio source count and activation ranges;
- collision, trigger, and recovery-volume cost;
- platform or quality-level fallback behavior.

Until numeric targets are approved by runtime implementation, every cost remains provisional and must have a measurement, owner, and correction gate. Provisional does not mean unlimited.

### 4.15 Water Validation Procedure

Water validation must be conducted in this order:

1. **Terrain Contract Review** — confirm channel, crest, basin, banks, bridge support space, and safety edges.
2. **Flow Review** — verify continuous source-to-outflow direction.
3. **River Surface Review** — inspect width, bends, elevation, seams, and camera continuity.
4. **Waterfall Structure Review** — inspect source, lip, fall, impact, basin, and outflow with supporting FX disabled.
5. **Shoreline Review** — inspect contact, gaps, path separation, and edge readability.
6. **Bridge Integration Review** — inspect span, supports, abutments, clearance, and both approach views.
7. **Gameplay Safety Review** — test collision, triggers, traps, recovery, and intended water behavior.
8. **Material and Motion Review** — inspect flow, opacity, reflection, refraction, noise, and lighting response.
9. **Supporting Detail Review** — inspect foam, ripples, wetness, mist envelopes, and visual hierarchy.
10. **Audio Source Review** — confirm physical source logic and transition ownership.
11. **Runtime Review** — measure shader, reflection, transparency, FX, audio, collision, and memory cost.
12. **Evidence Capture** — record results, failures, corrections, owner, and reviewer decision.

Failure at an earlier stage blocks acceptance of later visual polish.

### 4.16 Required Water Evidence

The Water Assembly acceptance package must contain:

- top-down river, waterfall, basin, bridge, and shoreline overview;
- source-to-outflow flow-direction evidence;
- River Corridor gameplay-camera captures;
- Waterfall Vista near and distant captures;
- waterfall structure capture with supporting FX disabled;
- receiving basin and outflow continuity capture;
- shoreline contact and path-separation evidence;
- bridge integration captures from both approach directions;
- water collision, trigger, and recovery debug visualization;
- water behavior declaration for each accessible region;
- material, shader, reflection, and texture inventory;
- transparency, FX, audio, collision, and memory measurement or owned provisional budget;
- known issues, deferred corrections, and affected downstream gates;
- reviewer decision and applicable freeze level.

Evidence from a superseded terrain, water surface, bridge, or shader revision is invalid.

### 4.17 Water Revalidation Triggers

Water Assembly review must reopen when any of the following changes materially:

- river centerline, width, depth, bank profile, or water level;
- waterfall source, crest, drop, impact point, basin, or outflow;
- terrain elevation or shoreline geometry;
- bridge span, supports, abutments, height, or orientation;
- player access, collision, trigger, hazard, or recovery behavior;
- water material, reflection, refraction, transparency, or flow system;
- foam, mist, spray, or ripple density that affects visibility or runtime cost;
- lighting or fog that changes water readability or landmark visibility;
- runtime partition, culling, quality level, shader variant, or audio-zone ownership;
- downstream vegetation or props that create false routes, hide shorelines, or obstruct required views.

Revalidation must identify the exact evidence and freeze levels invalidated by the change.

### 4.18 Section Exit Gate

Water Assembly is accepted when the production team can demonstrate that:

- the river reads continuously from source through waterfall, basin, corridor, bridge, and outflow;
- waterfall structure is valid without relying on final mist, spray, or foam;
- shorelines connect cleanly to terrain and communicate safe and unsafe edges;
- bridge geometry and water remain compatible from both directions;
- every accessible water region has explicit gameplay, collision, trigger, and recovery behavior;
- water material and motion reinforce rather than contradict flow and elevation;
- foam, ripples, wetness, mist, and audio have clear ownership boundaries;
- runtime cost is measured or held by an explicit provisional budget and owner;
- required evidence represents the current terrain, bridge, and water revision;
- material changes trigger targeted downstream revalidation.

Until this gate passes, Vegetation Assembly may proceed only as controlled prototype work near water. Landmark, lighting, FX, and ambient audio work must not treat water-dependent placement or budgets as production-frozen.

## Integration Authority

MLW-DOC-014 and MLW-DOC-014A must be reviewed as one production package for Phase 4. When MLW-DOC-014 is next safely replaced as a complete file, this patch may be merged into Section 4 without changing its authority or acceptance requirements.
