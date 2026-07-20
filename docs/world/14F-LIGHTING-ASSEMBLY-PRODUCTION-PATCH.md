# 14F — Lighting Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014F
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 9 — Lighting Assembly
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 9 lighting-assembly workflow for Builder's Valley. It extends MLW-DOC-014 and depends on the terrain, water, vegetation, landmark, workshop, and gameplay-readability contracts established by Phases 3–8.

Lighting is not a decorative layer applied after environment assembly. It is a structural gameplay system that determines orientation, hierarchy, mood, safety, interaction visibility, destination authority, and the legibility of every previously assembled world component.

A visually attractive lighting setup is not accepted when it causes players to misread routes, lose landmarks, overlook interactions, confuse safe and hazardous space, or depend on exposure settings that are unstable across supported devices.

## 9 Lighting Assembly

### 9.1 Lighting Objective

Builder's Valley lighting must preserve gameplay meaning while establishing a coherent emotional identity for the valley.

The lighting system must:

- maintain the visual hierarchy defined by gameplay readability;
- preserve primary route, bridge, workshop, water, and landmark legibility;
- support orientation before relying on interface arrows or text;
- distinguish exterior, transition, and interior spaces;
- remain stable across representative camera angles and supported viewport sizes;
- preserve interaction and hazard visibility;
- avoid exposure pumping, crushed shadows, clipped highlights, and excessive color cast;
- support runtime quality scaling without changing gameplay meaning;
- maintain a clear ownership model for global, local, practical, emissive, and temporary lights;
- produce evidence that can be revalidated after material, geometry, atmosphere, or performance changes.

Lighting acceptance is based on player-observable runtime evidence, not on editor appearance alone.

### 9.2 Authoritative Lighting Assembly Order

Lighting must be assembled in this order:

```text
Dependency Review
→ Lighting Intent and Time-of-Day Lock
→ Global Environment Lighting
→ Exposure and Tonal Baseline
→ Primary Directional Lighting
→ Sky and Ambient Fill
→ Landmark and Route Hierarchy
→ Water and Terrain Response
→ Vegetation Response
→ Workshop Exterior Lighting
→ Workshop Interior Lighting
→ Practical and Emissive Sources
→ Shadow and Occlusion Validation
→ Atmosphere Integration
→ Gameplay Readability Revalidation
→ Performance and Quality-Level Validation
→ Runtime Validation
→ Evidence Capture
→ Section Exit Gate
```

Later steps must not hide unresolved failures from earlier steps.

### 9.3 Entry Contract

Phase 9 may begin only when:

- terrain elevations, major surfaces, and route topology are stable enough for light and shadow evaluation;
- water location, width, surface response, and crossing authority are defined;
- vegetation density and landmark framing are stable enough for occlusion review;
- bridge and workshop silhouettes are accepted;
- workshop entrance, exterior approach, and interior circulation are defined;
- gameplay-readability decision points and validation views exist;
- representative materials are assigned to terrain, water, vegetation, structures, and interactables;
- the intended time-of-day family is selected;
- temporary lights from earlier prototyping are identified and do not masquerade as final lighting authority.

If a dependency changes materially, affected lighting evidence becomes stale and must be revalidated.

### 9.4 Lighting Intent

The approved lighting identity for Builder's Valley is:

> Warm, optimistic, readable natural light with clear directional form, soft environmental fill, restrained contrast, and practical lighting that reinforces human activity without overpowering the world.

The lighting must communicate:

- a welcoming learning environment rather than a threatening survival space;
- a handcrafted valley with believable natural structure;
- a workshop that feels active, useful, and reachable;
- water as a geographic and navigational anchor;
- landmarks as orientation tools;
- progression through light hierarchy rather than arbitrary brightness.

Lighting must not shift the environment into horror, high-drama noir, extreme cinematic silhouette, or oversaturated fantasy unless a later approved world-state contract explicitly requires it.

### 9.5 Time-of-Day Authority

Production Environment Slice 001A uses one authoritative baseline time-of-day state.

The baseline must define:

| Field | Requirement |
|---|---|
| Time-of-Day ID | Stable identifier |
| Sun Direction | Approved world-relative direction |
| Sun Elevation | Range that preserves route and landmark readability |
| Sky State | Clear, lightly clouded, or approved controlled variation |
| Exposure Target | Runtime baseline, not editor-only appearance |
| Color Temperature | Approved warm/cool relationship |
| Shadow Length | Suitable for terrain form without hiding navigation |
| Atmospheric Density | Enough depth separation without landmark loss |
| Validation Views | Required journey and workshop viewpoints |

The baseline time of day must remain fixed during Phase 9 validation.

Dynamic time-of-day behavior, if introduced later, is a separate runtime system and must not be inferred from this patch.

### 9.6 Lighting Ownership Model

Every production light must belong to one ownership category.

#### 9.6.1 Global Environment Lighting

Global lighting includes:

- primary directional light;
- sky contribution;
- environment or ambient lighting;
- global exposure and tone mapping;
- global fog or atmospheric scattering;
- global reflection environment.

Global lighting owns the world baseline. Local lights must not compensate for a broken global baseline.

#### 9.6.2 Landmark Lighting

Landmark lighting supports orientation authority for:

- workshop;
- bridge;
- waterfall and river corridor;
- arrival overlook;
- other approved orientation anchors.

Landmark lighting may strengthen silhouette, material response, or local contrast, but must not turn landmarks into detached glowing objects.

#### 9.6.3 Route-Support Lighting

Route-support lighting reinforces an already valid path hierarchy.

It may use:

- directional light gradients;
- practical fixtures;
- reflected light from structures;
- controlled openings in vegetation shadow;
- localized atmosphere;
- restrained accent lighting.

Route-support lighting must not create a readable path where geometry and gameplay language remain structurally ambiguous.

#### 9.6.4 Practical Lighting

Practical lights are visible or strongly implied sources such as:

- workshop lamps;
- lanterns;
- task lights;
- furnace or machine glow;
- window illumination;
- approved environmental fixtures.

Each practical light requires a believable source, purpose, range, and ownership location.

#### 9.6.5 Interaction Lighting

Interaction lighting supports already-approved interactables.

It must:

- remain subordinate to primary environmental hierarchy;
- avoid replacing interaction-state feedback;
- avoid making decorative props appear interactive;
- preserve visibility when viewed from representative gameplay distance;
- remain stable under quality-level reduction.

#### 9.6.6 Temporary and Diagnostic Lighting

Temporary lights used for inspection, graybox validation, material review, or debugging must:

- use explicit diagnostic naming;
- remain excluded from production evidence;
- be disabled or removed before Section Exit Gate;
- never become hidden dependencies for readability.

### 9.7 Naming and Grouping Contract

Lighting objects must use stable names that identify ownership and purpose.

Recommended format:

```text
LGT_<Scope>_<Function>_<Location>_<Index>
```

Examples:

```text
LGT_GLOBAL_SUN_VALLEY_01
LGT_GLOBAL_SKY_VALLEY_01
LGT_LANDMARK_KEY_WORKSHOP_01
LGT_ROUTE_FILL_BRIDGE_APPROACH_01
LGT_PRACTICAL_TASK_WORKSHOP_CORE_01
LGT_INTERACTION_ACCENT_ASSEMBLY_TABLE_01
LGT_DEBUG_INSPECTION_TERRAIN_01
```

Lights must be grouped by functional ownership rather than by arbitrary creation order.

### 9.8 Global Environment Lighting

#### 9.8.1 Primary Directional Light

The primary directional light must:

- establish readable large-scale form;
- support terrain slope interpretation;
- preserve workshop and bridge silhouette;
- avoid placing the entire primary route in unresolved shadow;
- create shadow direction consistent across the valley;
- avoid direct glare at required gameplay views;
- preserve water reflection and surface readability;
- remain stable during normal camera movement.

The sun direction is approved only after review from all required journey viewpoints.

#### 9.8.2 Sky and Ambient Fill

Sky and ambient contribution must:

- preserve information in shaded terrain and vegetation;
- prevent interiors from becoming featureless black voids;
- maintain separation between adjacent dark materials;
- avoid flattening every surface into uniform brightness;
- retain directional form established by the primary light.

Ambient fill is not permission to eliminate contrast. It must preserve readable shape while preventing information loss.

#### 9.8.3 Reflection Environment

Reflection contribution must be reviewed on:

- water;
- wet or polished workshop materials;
- painted metal;
- stone edges;
- glass or window surfaces;
- emissive-adjacent materials.

Reflection intensity must not create false interaction signals, clipped highlights, or flickering emphasis during camera movement.

### 9.9 Exposure and Tonal Baseline

Exposure must be authored for gameplay stability.

The baseline must:

- preserve visible detail in both sunlight and normal shadow;
- avoid frequent adaptation while moving between nearby exterior spaces;
- avoid forcing the player to wait for the scene to become readable;
- preserve workshop entrance readability from outside;
- preserve exterior orientation when exiting the workshop;
- avoid highlight clipping on water and pale materials;
- avoid crushed shadow detail under vegetation and structures.

Automatic exposure, if used, must have constrained range, controlled adaptation speed, and evidence from transition testing.

Exposure must not be tuned independently per screenshot.

### 9.10 Tonal Hierarchy

The authoritative tonal hierarchy is:

1. current interaction or immediate gameplay focus;
2. primary destination and route authority;
3. nearby traversable space;
4. supporting landmarks and optional routes;
5. decorative environment detail;
6. distant background and atmospheric depth.

This hierarchy may use luminance, edge contrast, color temperature, silhouette, and motion together.

A decorative surface fails when it consistently attracts more attention than the required destination or interaction.

### 9.11 Color Temperature Contract

Color temperature must communicate spatial function without creating inconsistent local color worlds.

Approved relationship:

- direct natural light: moderately warm;
- open-sky fill: neutral to slightly cool;
- vegetation shadow: restrained cool-green influence without heavy cast;
- water reflection: responsive to sky and environment without electric-blue exaggeration;
- workshop practicals: warm and human-scaled;
- workshop task lights: neutral-warm where precision and interaction visibility matter;
- hazards or exceptional states: reserved and explicitly approved.

Warm lighting must not automatically mean important, and cool lighting must not automatically mean blocked. Gameplay meaning must come from the complete readability system.

### 9.12 Terrain Lighting Contract

Terrain lighting must preserve:

- slope readability;
- step and ledge boundaries;
- traversable width;
- cliff and non-traversable distinction;
- path continuity;
- material-family separation;
- recovery visibility from low points;
- arrival overlook orientation.

Terrain fails lighting validation when shadows make a safe route appear blocked, make a dangerous edge appear flat, or erase the hierarchy between path and surrounding ground.

Micro-normal intensity, roughness, and albedo must be reviewed under production lighting. Materials must not be compensated with unrealistic lighting.

### 9.13 Water Lighting Contract

Water lighting must preserve:

- river direction and geographic continuity;
- shoreline and depth cues;
- crossing authority at the bridge;
- safe versus unsafe water meaning;
- waterfall visibility;
- reflection stability;
- transparency or opacity appropriate to gameplay needs.

Water highlights must not:

- obscure the bridge approach;
- produce large clipped regions;
- flicker excessively during camera movement;
- resemble collectible or interaction feedback;
- erase shoreline boundaries.

Underwater, foam, mist, and caustic effects require separate ownership and must remain subordinate to route readability.

### 9.14 Vegetation Lighting Contract

Vegetation lighting must preserve mass, depth, and route openings without producing visual noise.

Vegetation must be reviewed for:

- canopy shadow density;
- repeated bright leaf highlights;
- alpha-edge shimmer;
- contact shadow stability;
- silhouette separation from landmarks;
- color cast onto terrain;
- accidental dark tunnels over required routes;
- quality-level behavior.

Vegetation lighting must not create high-frequency sparkle that competes with interactions or destination anchors.

The primary route may pass through shade, but it must not lose continuity, clearance, or recovery cues.

### 9.15 Landmark Lighting Contract

Each primary landmark requires a lighting role.

| Landmark | Lighting Role |
|---|---|
| Workshop | Destination authority and human activity |
| Bridge | Transition authority and crossing clarity |
| Waterfall / River | Geographic continuity and depth anchor |
| Arrival Overlook | Origin, reveal, and recovery orientation |

Landmark lighting must:

- preserve recognizable silhouette;
- maintain separation from background terrain and vegetation;
- remain visible from approved approach viewpoints;
- avoid detached glow or excessive local brightness;
- remain subordinate to immediate interactions when the player reaches the destination;
- survive supported quality-level reduction.

### 9.16 Bridge Lighting Contract

The bridge must read as the authoritative crossing before the player reaches it.

Lighting must preserve:

- entry and exit visibility;
- deck continuity;
- rail or edge boundaries;
- structural silhouette;
- distinction from water reflections;
- connection to the workshop approach;
- safe footing under representative camera angles.

The bridge fails when:

- its deck merges into water or terrain;
- shadow makes the crossing appear broken;
- bright reflection visually blocks the entrance;
- local accents imply interaction where none exists;
- the far exit disappears without a replacement navigation cue.

### 9.17 Workshop Exterior Lighting

Workshop exterior lighting must communicate destination, entry, function, and occupancy.

It must support:

- approach hierarchy;
- entrance identification;
- structural silhouette;
- threshold transition;
- exterior work areas;
- visible practical sources;
- continuity with the valley lighting baseline.

The entrance should be understandable by geometry first and lighting second.

Windows, lamps, and emissive details may reinforce activity, but must not create multiple false entrances.

### 9.18 Workshop Interior Lighting

Workshop interior lighting must prioritize function and interaction clarity.

It must preserve:

- circulation path;
- entry and exit orientation;
- primary assembly or work area;
- tool and resource visibility;
- interactable versus decorative distinction;
- readable floor boundaries;
- safe contrast between lit task areas and surrounding space.

Interior lighting may be richer and warmer than exterior lighting, but it must remain connected to exterior time of day through windows, doors, and threshold response.

The workshop fails when:

- players lose the exit immediately after entering;
- task surfaces are darker than decorative walls;
- practical lights produce distracting overlap;
- emissive materials replace actual illumination without readable result;
- exposure transition temporarily hides interactions.

### 9.19 Threshold and Transition Lighting

The exterior-to-interior transition must be tested in both directions.

Required transitions:

```text
Workshop Approach → Entrance Threshold → Interior Core
Interior Core → Entrance Threshold → Valley Reorientation
```

Validation must confirm:

- no prolonged unreadable exposure state;
- entrance remains identifiable from exterior;
- exit remains identifiable from interior;
- player can retain route orientation;
- nearby interactables do not disappear during adaptation;
- bright exterior does not become a featureless white field;
- interior does not become a featureless dark field.

### 9.20 Practical Light Contract

Every practical light must answer:

- What physical source emits the light?
- Why is the source present?
- What gameplay or environmental function does it serve?
- What area does it own?
- What is its maximum useful range?
- Does it overlap another source unnecessarily?
- Does it remain credible when viewed directly?

Practical lights must not be scattered solely to brighten dark areas.

Where possible, practical intensity, source size, falloff, and color should reflect the visible fixture.

### 9.21 Emissive Material Policy

Emissive materials may support:

- visible lamp sources;
- furnace or machine states;
- controlled workshop indicators;
- approved magical or learning-system elements;
- interaction feedback already defined by the product contract.

Emissive materials must not:

- become the only source of readable illumination when real light contribution is required;
- bloom into surrounding gameplay space excessively;
- create false interaction affordance;
- remain permanently brighter than primary objectives;
- conceal geometry edges;
- shift appearance unpredictably across quality levels.

Every emissive family requires an approved intensity range and bloom review.

### 9.22 Interaction Readability Under Lighting

All approved interactions must be validated under production lighting.

For each interaction state, confirm:

- idle state is discoverable but not visually dominant;
- focused state is clearly stronger than idle;
- active state communicates action in progress;
- success state communicates what changed;
- unavailable state remains distinguishable without looking broken;
- placed and collectible objects remain readable against their local background;
- feedback is not erased by direct light, shadow, fog, or bloom.

Lighting must support interaction feedback, not substitute for state design.

### 9.23 Safety and Hazard Lighting

Lighting must preserve the safety meaning established in Phase 8.

Hazard visibility may use:

- controlled contrast;
- edge lighting;
- motion or particle support;
- material response;
- localized practical or emissive source;
- atmosphere separation.

Hazards must not rely only on red color, only on darkness, or only on post-processing.

Safe routes must not be made visually threatening through excessive darkness, flicker, or unstable contrast unless that state is intentionally approved.

### 9.24 Shadow Contract

Shadows must support form and depth without removing gameplay information.

#### 9.24.1 Primary Shadows

Primary directional shadows must:

- remain directionally coherent;
- preserve route continuity;
- maintain usable edge quality at gameplay distance;
- avoid excessive aliasing or swimming;
- avoid hiding interactables;
- retain acceptable quality during camera movement.

#### 9.24.2 Local-Light Shadows

Local-light shadows should be enabled only when they materially improve:

- spatial grounding;
- interaction clarity;
- workshop task readability;
- landmark form;
- practical-source credibility.

Shadow-casting local lights require explicit performance justification.

#### 9.24.3 Contact and Ambient Occlusion

Contact shadow or ambient-occlusion effects must:

- ground objects and structures;
- preserve small-gap readability;
- avoid dirty halos;
- avoid crushing corners into black;
- remain stable on vegetation and thin geometry;
- avoid making collision boundaries appear different from visible boundaries.

### 9.25 Occlusion and Light Blocking

Geometry that blocks light must be reviewed for intended effect.

Critical blockers include:

- cliffs;
- bridge structure;
- workshop roof and walls;
- large trees;
- canopy clusters;
- landmark geometry;
- temporary proxy meshes.

Light-blocking failures include:

- invisible or temporary geometry producing production shadows;
- vegetation shadow erasing a required route;
- roof or wall leakage;
- light passing through closed surfaces;
- missing contact at structural joins;
- distant shadow changes that alter navigation meaning.

### 9.26 Atmosphere Integration

Fog, haze, mist, and volumetric lighting may support depth, mood, and landmark separation.

Atmosphere must:

- preserve primary destination visibility;
- preserve bridge and workshop approach hierarchy;
- maintain sufficient contrast at decision points;
- avoid flattening terrain layers;
- avoid hiding water boundaries;
- remain stable across supported quality levels;
- avoid excessive glowing shafts unrelated to source geometry.

Atmosphere may soften distant detail, but must not remove all recovery anchors simultaneously.

### 9.27 Waterfall Mist and Local Atmosphere

Waterfall mist may strengthen geographic identity and depth.

It must:

- remain spatially connected to the waterfall;
- avoid obscuring the bridge or route;
- avoid appearing as smoke or hazard unless intended;
- respond coherently to light direction;
- remain performant at representative distance;
- preserve water and shoreline readability.

Mist density must be validated during movement, not only in still frames.

### 9.28 Post-Processing Contract

Post-processing must support the approved lighting baseline.

Controlled systems may include:

- tone mapping;
- color grading;
- bloom;
- vignette;
- ambient occlusion;
- depth-based atmosphere;
- anti-aliasing;
- sharpening or clarity controls.

Post-processing must not:

- conceal bad light placement;
- make UI-independent interactions visible only through bloom;
- crush shadow detail;
- clip water or sky highlights;
- apply excessive vignette to gameplay edges;
- shift material families beyond approved identity;
- change route hierarchy between quality levels.

### 9.29 Color-Grading Contract

Color grading must be authored after the global lighting and exposure baseline are stable.

The grade must:

- preserve material-family distinction;
- maintain skin-safe and child-friendly visual tone for future characters;
- preserve warm and cool separation without oversaturation;
- keep interactable state colors recognizable;
- avoid grading shadows toward opaque color blocks;
- remain restrained enough for later world-state variation.

A grade is rejected when disabling it reveals unresolved lighting problems.

### 9.30 Bloom Contract

Bloom must remain restrained.

Bloom is accepted only when it:

- supports visible bright sources;
- reinforces approved emissive elements;
- preserves source shape;
- avoids masking nearby interactions;
- avoids large-area haze around water highlights;
- remains stable across resolution and quality settings.

Bloom must not be used as the primary signal for progression, interaction, or hazard state.

### 9.31 Camera and Lighting Validation

Lighting must be tested with the representative gameplay camera.

Required camera cases:

- forward travel along primary route;
- rotation at major decision points;
- low-angle view near terrain edges;
- bridge approach and crossing;
- workshop approach;
- threshold entry and exit;
- interior interaction distance;
- close view of collectibles and placeables;
- recovery view after turning away from the destination.

Validation must detect:

- glare;
- silhouette loss;
- exposure pumping;
- shadow popping;
- highlight flicker;
- occlusion-related darkness;
- local lights entering or exiting abruptly;
- reflection instability.

### 9.32 Runtime Lighting Controls

Production lighting controls must be centralized and intentional.

Runtime control groups should include:

- global environment state;
- directional-light settings;
- sky and ambient contribution;
- exposure settings;
- atmosphere settings;
- reflection settings;
- landmark-light groups;
- workshop exterior group;
- workshop interior group;
- practical-light groups;
- interaction-light groups;
- diagnostic-light group;
- quality-level overrides.

Controls must not be scattered across unrelated scene objects without ownership.

### 9.33 Quality-Level Contract

Supported quality levels may reduce cost, but must preserve gameplay meaning.

Quality reduction may adjust:

- shadow resolution;
- shadow distance;
- number of local shadow casters;
- volumetric sample quality;
- reflection resolution;
- bloom precision;
- ambient-occlusion quality;
- nonessential decorative lights.

Quality reduction must not remove:

- primary route readability;
- bridge crossing clarity;
- workshop entrance authority;
- interaction visibility;
- hazard visibility;
- threshold orientation;
- critical landmark separation.

Each quality level requires evidence from the same validation views.

### 9.34 Performance Budget Contract

Lighting performance must be measured in representative runtime conditions.

Record at minimum:

| Field | Requirement |
|---|---|
| Validation Device / Profile | Named target |
| Resolution / Viewport | Recorded |
| Quality Level | Recorded |
| Light Count | Visible and active |
| Shadow-Casting Light Count | Visible and active |
| Reflection Method | Recorded |
| Volumetric State | Recorded |
| Frame-Time Impact | Compared with approved baseline |
| Known Spikes | Location and cause |
| Mitigation | Applied or scheduled |

Performance must not be inferred from editor responsiveness.

### 9.35 Lighting Optimization Order

When optimization is required, use this order:

```text
Remove Unowned or Redundant Lights
→ Reduce Unnecessary Overlap
→ Remove Nonessential Local Shadows
→ Reduce Shadow Distance or Resolution
→ Simplify Reflection Cost
→ Simplify Volumetric Cost
→ Reduce Decorative Light Complexity
→ Apply Quality-Level Overrides
→ Revalidate Gameplay Meaning
```

Do not begin by globally darkening the scene, removing critical interaction lights, or weakening route hierarchy.

### 9.36 Validation View Set

The minimum authoritative validation views are:

1. Arrival Overlook — full valley orientation;
2. Valley Descent — primary route continuity;
3. River Orientation — water and geographic anchor;
4. Bridge Decision — crossing authority;
5. Bridge Midpoint — entry, exit, and workshop relationship;
6. Workshop Terrace Approach — destination and entrance hierarchy;
7. Workshop Threshold Exterior — entry readability;
8. Workshop Threshold Interior — exit readability;
9. Workshop Functional Core — circulation and interaction hierarchy;
10. Representative Collect / Place Interaction — state readability;
11. Representative Hazard or Blocked Edge — safety meaning;
12. Low-Quality Runtime View — hierarchy preservation.

Additional views may be added when a known failure cannot be represented by the minimum set.

### 9.37 Runtime Validation Procedure

For each required validation view:

1. launch the representative runtime build;
2. use the approved gameplay camera and movement controls;
3. confirm time-of-day and quality-level state;
4. approach the view through normal player movement;
5. pause only after the lighting system reaches its normal runtime state;
6. inspect route, landmark, interaction, safety, and tonal hierarchy;
7. rotate the camera through expected player angles;
8. move into and out of nearby shadow and practical-light zones;
9. record visible failures;
10. capture evidence only after the state is reproducible.

Still screenshots alone are insufficient for exposure, shadow stability, reflection, atmosphere, and transition validation.

### 9.38 Evidence Contract

The Phase 9 evidence package must include:

- branch and commit identity;
- file and scene paths affected;
- authoritative time-of-day settings;
- global lighting settings summary;
- exposure and tone-mapping settings;
- active light inventory by ownership category;
- validation screenshots for all required views;
- runtime capture for bridge approach and crossing;
- runtime capture for workshop exterior-to-interior transition;
- runtime capture for representative interaction states;
- quality-level comparison evidence;
- performance profile summary;
- known limitations and deferred issues;
- explicit Section Exit Gate result.

Evidence must identify the runtime build or commit used for capture.

### 9.39 Lighting Failure Codes

Use the following failure codes during review:

| Code | Meaning |
|---|---|
| LGT-GLOBAL-BASELINE-INVALID | Global lighting does not support the world baseline |
| LGT-EXPOSURE-UNSTABLE | Exposure changes disrupt readability |
| LGT-ROUTE-HIERARCHY-LOST | Primary route loses visual authority |
| LGT-LANDMARK-HIERARCHY-LOST | Required landmark cannot perform orientation role |
| LGT-BRIDGE-CROSSING-AMBIGUOUS | Bridge entry, deck, or exit is unclear |
| LGT-WORKSHOP-ENTRY-AMBIGUOUS | Workshop entrance is not readable |
| LGT-THRESHOLD-TRANSITION-FAIL | Exterior/interior transition becomes unreadable |
| LGT-INTERACTION-STATE-LOST | Lighting hides or confuses interaction state |
| LGT-HAZARD-MEANING-LOST | Lighting hides or miscommunicates danger |
| LGT-SHADOW-INFORMATION-LOSS | Shadow removes required gameplay information |
| LGT-HIGHLIGHT-CLIPPING | Highlights obscure material or gameplay meaning |
| LGT-REFLECTION-NOISE | Reflections compete with or destabilize readability |
| LGT-VEGETATION-SPARKLE | Vegetation lighting produces distracting high-frequency noise |
| LGT-ATMOSPHERE-OCCLUSION | Fog or mist hides required orientation or traversal cues |
| LGT-EMISSIVE-OVERPOWER | Emissive material dominates or creates false affordance |
| LGT-QUALITY-SEMANTIC-DRIFT | Quality reduction changes gameplay meaning |
| LGT-PERFORMANCE-BUDGET-FAIL | Lighting exceeds approved runtime budget |
| LGT-TEMPORARY-AUTHORITY | Temporary light remains a hidden production dependency |
| LGT-EVIDENCE-INCOMPLETE | Required proof is missing or stale |

A failed code remains open until corrected and revalidated.

### 9.40 Revalidation Triggers

Lighting evidence must be revalidated when any of the following changes materially:

- sun direction, elevation, intensity, color, or shadow behavior;
- sky, ambient, reflection, or exposure settings;
- terrain elevation, path shape, or cliff boundaries;
- water material, water level, waterfall, bridge, or shoreline;
- vegetation density, canopy, alpha behavior, or placement;
- landmark silhouette or placement;
- workshop structure, entrance, interior layout, or practical fixtures;
- interaction states, feedback, colors, or object placement;
- hazard placement or safety communication;
- camera height, field of view, movement, or clipping behavior;
- material albedo, roughness, normal intensity, or emissive response;
- fog, mist, volumetric, bloom, or color grading;
- shadow method, reflection method, or quality presets;
- supported device or viewport profile;
- performance optimization affecting visible lighting behavior.

Revalidation scope may be limited only when impact boundaries are explicit and supported by evidence.

### 9.41 Forbidden Practices

The following practices are not accepted:

- adding arbitrary lights until the scene looks bright enough;
- using local lights to repair broken global exposure;
- relying on editor-only camera exposure;
- hiding route ambiguity with glowing arrows or excessive pools of light;
- placing lights without a source, purpose, or ownership category;
- allowing temporary diagnostic lights into production evidence;
- using bloom as the primary interaction signal;
- crushing shadows to create artificial drama;
- clipping water and sky highlights for visual impact;
- using color grading to conceal material or lighting errors;
- disabling critical shadows or lights on lower quality without revalidation;
- accepting still screenshots as proof of transition stability;
- optimizing by removing gameplay-critical lighting first;
- changing time of day during validation without recording the change.

### 9.42 Section Exit Gate

Phase 9 is complete only when all of the following are true:

- the authoritative time-of-day state is locked and recorded;
- global directional, sky, ambient, reflection, exposure, and atmosphere systems have explicit ownership;
- primary route and recovery navigation remain readable;
- workshop, bridge, water, and arrival landmarks retain their intended authority;
- terrain slopes, edges, and traversal boundaries remain legible;
- water and shoreline meaning remain clear;
- vegetation lighting does not create route loss or visual sparkle;
- workshop exterior, entrance, threshold, interior circulation, and task areas are readable;
- representative interactions remain visible in all required states;
- safety and hazard meaning survive production lighting;
- shadows, reflections, bloom, fog, and emissive response are stable during movement;
- supported quality levels preserve gameplay meaning;
- performance evidence meets the approved target or records an accepted exception;
- temporary and diagnostic lights are removed or disabled;
- all required validation views and runtime captures exist;
- every open lighting failure code is resolved or explicitly accepted as a documented exception;
- the working tree and repository state used for evidence are identified.

The Phase 9 result must be declared as one of:

```text
LIGHTING ASSEMBLY — PASS
LIGHTING ASSEMBLY — PASS WITH ACCEPTED EXCEPTIONS
LIGHTING ASSEMBLY — BLOCKED
```

A PASS means the lighting system preserves the gameplay and world meaning established by all prior assembly phases. It does not mean later polish, dynamic weather, cinematic presentation, accessibility tuning, or final platform optimization is complete.

## Phase Boundary

This patch defines lighting assembly authority only.

It does not authorize:

- dynamic day/night implementation;
- weather-state production;
- cinematic lighting sequences;
- final character lighting;
- final VFX production;
- accessibility-mode implementation;
- platform-specific final optimization;
- replacement of gameplay-readability contracts;
- changes to terrain, water, vegetation, landmark, workshop, or interaction ownership without returning to the relevant production patch.

Any such work requires an approved later phase, blueprint, or contract update.