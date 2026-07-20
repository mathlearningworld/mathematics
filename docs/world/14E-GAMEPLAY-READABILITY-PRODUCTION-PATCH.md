# 14E — Gameplay Readability Production Patch

## Document Identity

- Document ID: MLW-DOC-014E
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 8 — Gameplay Readability
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 8 gameplay-readability workflow for Builder's Valley. It extends MLW-DOC-014 and depends on the terrain, water, vegetation, landmark, and workshop contracts established by Phases 3–7.

Gameplay readability is the player's ability to understand space, intention, safety, traversal, interaction, destination, and progress before relying on text. It is not a final polish pass. It is a structural property of the assembled world.

A visually attractive environment is not accepted when players cannot reliably answer:

- Where am I?
- Where can I go?
- Where should I go next?
- What can I interact with?
- What is safe, blocked, hazardous, decorative, or incomplete?
- What changed after my last action?

## 8 Gameplay Readability

### 8.1 Gameplay Readability Objective

Builder's Valley must communicate its playable meaning through shape, placement, contrast, motion, spacing, sound support, and repeated visual grammar.

The gameplay-readability system must:

- preserve orientation from arrival through workshop entry;
- expose the intended primary route without turning the world into a corridor;
- distinguish optional exploration from required progression;
- distinguish traversable, interactable, hazardous, blocked, and decorative surfaces;
- maintain usable interaction visibility at representative camera distances;
- remain understandable with minimal language dependence;
- remain stable across supported viewport sizes and runtime quality levels;
- avoid requiring memorization of arbitrary exceptions.

Readability is accepted through player-observable evidence, not by author intention alone.

### 8.2 Authoritative Readability Assembly Order

Gameplay readability must be assembled in this order:

```text
Dependency Review
→ Player Journey and Decision-Point Map
→ Navigation Hierarchy
→ Traversal Language
→ Landmark and Destination Visibility
→ Interaction Readability
→ Safety and Hazard Communication
→ Camera and Occlusion Validation
→ Contrast and Visual Noise Control
→ Feedback and State-Change Readability
→ Day / Night and Quality-Level Validation
→ Runtime Validation
→ Evidence Capture
→ Section Exit Gate
```

Later steps must not hide unresolved failures from earlier steps.

### 8.3 Entry Contract

Phase 8 may begin only when:

- terrain routes and elevation transitions are stable enough to evaluate movement;
- water edges and crossings have explicit traversal meaning;
- vegetation does not occupy unresolved navigation authority;
- primary landmarks are placed and have approved approach viewpoints;
- workshop approach, entrance, and internal circulation are defined;
- representative player camera and movement behavior are available;
- known temporary geometry is labeled as temporary and does not masquerade as final guidance.

If one of these dependencies changes materially, affected readability evidence becomes stale and must be revalidated.

### 8.4 Player Journey and Decision-Point Map

The authoritative journey for this slice is:

```text
Arrival Overlook
→ Valley Descent
→ Water / River Orientation
→ Bridge Decision
→ Workshop Terrace Approach
→ Workshop Threshold
→ Workshop Functional Core
```

Every location where the player can choose between materially different directions is a decision point.

For each decision point, record:

| Field | Requirement |
|---|---|
| Decision Point ID | Stable identifier |
| Player Goal | What the player is expected to understand |
| Primary Route | Required progression direction |
| Optional Route | Exploration or supporting route |
| Visible Anchor | Landmark or destination supporting orientation |
| False Route Risk | Geometry or contrast that may mislead |
| Recovery Cue | How a lost player can reorient |
| Validation View | Screenshot or runtime capture position |

A decision point fails when the primary route is readable only after trial-and-error.

### 8.5 Navigation Hierarchy

Builder's Valley uses three navigation levels.

#### 8.5.1 Primary Navigation

Primary navigation connects the approved progression chain.

It must use the strongest combination of:

- continuous walkable width;
- deliberate terrain shaping;
- stable sightlines;
- landmark alignment;
- edge control;
- repeated material or prop rhythm;
- reduced visual obstruction;
- supportive lighting and audio direction where appropriate.

The primary route must remain readable without mandatory arrows painted onto the world.

#### 8.5.2 Secondary Navigation

Secondary navigation supports optional exploration, resource access, scenic pauses, or future mission branches.

It must:

- appear intentional but subordinate to the primary route;
- return the player to a known orientation network;
- avoid presenting stronger destination contrast than required progression;
- avoid terminating in an accidental dead end unless the endpoint is clearly meaningful.

#### 8.5.3 Tertiary Navigation

Tertiary paths are local movement opportunities, shortcuts, prop-space circulation, and small exploratory pockets.

They must not:

- resemble the primary progression route from major decision points;
- create ambiguous gaps between collision and visible geometry;
- lead into unreachable interaction promises;
- compete with workshop entry or bridge-crossing authority.

### 8.6 Path-Language Contract

Path readability is built from multiple cues. No single cue is sufficient in every context.

Approved cue families include:

- width and clearance;
- ground continuity;
- edge definition;
- slope and step rhythm;
- directional prop alignment;
- vegetation opening;
- landmark framing;
- lighting gradient;
- ambient motion;
- sound-source placement.

The primary path should generally have:

- the most reliable clearance;
- the lowest accidental obstruction density;
- the clearest forward anchor;
- the strongest recovery visibility;
- the fewest false traversal promises.

Path materials may vary by biome or function, but the underlying hierarchy must remain consistent.

### 8.7 Landmark-Based Navigation

Primary landmarks provide orientation authority:

1. Workshop — destination authority;
2. Bridge — transition authority;
3. Waterfall / river — geographic authority;
4. Arrival overlook — origin and recovery authority.

At required journey viewpoints:

- at least one meaningful orientation anchor must be visible or strongly implied;
- no supporting prop cluster may eclipse the primary destination hierarchy;
- landmark silhouettes must remain distinguishable from surrounding terrain and vegetation;
- landmark visibility may be intentionally interrupted only when a new local cue takes over.

The player must not lose all orientation anchors at the same time without an explicit enclosed-space transition.

### 8.8 Traversable Surface Rules

A surface that appears traversable should normally be traversable. A surface that is not traversable must communicate why.

Traversable surfaces require:

- sufficient visible width;
- collision matching visible boundaries;
- slope compatible with movement rules;
- no hidden blockers in the normal camera path;
- safe entry and exit points;
- stable foot placement and camera behavior.

Non-traversable boundaries must use one or more coherent signals:

- height or steepness;
- dense physical obstruction;
- water depth or flow language;
- structural barrier;
- clear broken geometry;
- owned gameplay lock with visible reason.

Invisible walls are allowed only as supporting containment. They must not contradict the visible world.

### 8.9 Safe, Hazardous, Blocked, and Decorative Communication

The environment must distinguish four meanings.

| Meaning | Required Communication |
|---|---|
| Safe | Stable surface, open clearance, non-threatening motion, expected collision |
| Hazardous | Edge emphasis, motion, depth, warning contrast, sound, or authored consequence cue |
| Blocked | Visible physical reason or explicit state-dependent lock |
| Decorative | No interaction promise, no false path, no high-priority affordance signal |

Hazard communication must occur before the player crosses the consequence threshold.

A blocked route must not look more complete or more inviting than the active route unless it is intentionally foreshadowed and clearly unavailable.

### 8.10 Interaction Readability

Interactable objects must be discoverable without turning every prop into a user-interface icon.

Readability may use:

- recognizable silhouette;
- consistent placement height;
- local contrast;
- controlled animation or idle motion;
- contextual outline or highlight;
- prompt timing;
- sound response;
- nearby staging space;
- repeated interaction grammar.

Interaction rules:

- decorative props must not share the complete affordance package of interactable props;
- prompts must appear only when the target is valid and reachable;
- multiple nearby targets require deterministic selection behavior;
- the selected target must remain visually attributable to the prompt;
- interaction feedback must confirm success, refusal, cooldown, or inventory limitation;
- collected, placed, activated, disabled, and depleted states must be visually distinguishable.

### 8.11 Collectible and Placeable Readability

Collectible objects must remain identifiable against common terrain, water, foliage, and workshop backgrounds.

They must have:

- stable silhouette at representative pickup distance;
- sufficient separation from decorative clutter;
- visible reachable placement;
- predictable target response;
- clear disappearance or state transition after collection.

Placeable-object previews must communicate:

- valid placement;
- invalid placement;
- selected object type;
- final footprint;
- collision or overlap conflict;
- expected orientation where relevant.

A placement preview must not imply success where runtime placement will be rejected.

### 8.12 Objective and Progress Readability

Objectives must be observable through world state whenever possible.

Examples include:

- a missing bridge component becoming present;
- a collected object leaving the environment and appearing in inventory;
- a workshop station changing from inactive to active;
- a blocked area gaining a clear route;
- a destination changing light, motion, or sound state.

Text may clarify meaning, but it must not be the only evidence that the world changed.

For every objective state transition, validate:

```text
Before State
→ Player Action
→ Immediate Feedback
→ Persistent World Change
→ Next Available Intention
```

### 8.13 Camera Readability

Readability must be evaluated through the actual gameplay camera, not only editor free-camera views.

Validate:

- default camera height and field of view;
- near-object occlusion;
- terrain crest visibility;
- doorway and workshop interior framing;
- bridge approach visibility;
- waterfall and water-edge depth perception;
- target visibility while moving;
- camera collision near vegetation and structures;
- readability during turns and direction reversals.

A composition that works only from a hand-picked cinematic angle does not pass gameplay readability.

### 8.14 Occlusion Management

Occlusion must support discovery rhythm without creating navigation failure.

Rules:

- vegetation may frame, but must not permanently hide, primary routes;
- large props must not block interaction prompts from normal approach angles;
- terrain may reveal destinations progressively, but recovery anchors must remain available;
- workshop structural elements must not conceal required stations or exits;
- moving FX must not repeatedly obscure hazards or targets;
- transparent materials must not create misleading depth or collision expectations.

Where intentional occlusion is used, define the reveal point and validation camera path.

### 8.15 Contrast and Visual Priority

Visual contrast is an owned gameplay resource.

Highest-priority contrast belongs to:

1. immediate hazards;
2. active interaction target;
3. current destination or objective state;
4. primary navigation cue;
5. optional opportunity;
6. decorative detail.

The environment must avoid distributing maximum saturation, brightness, motion, emissive intensity, and edge contrast across all objects.

When everything is emphasized, nothing is readable.

### 8.16 Visual Noise Control

Noise review must include:

- repeated high-frequency props;
- foliage density near paths and targets;
- competing emissive sources;
- excessive particle motion;
- material variation without hierarchy;
- clustered silhouettes that merge with interactions;
- UI prompts overlapping environment affordances;
- background detail competing with destination edges.

Noise should be reduced first by composition and density changes, not by adding stronger highlights everywhere.

### 8.17 Minimal-Language Contract

Core movement and interaction meaning must survive when explanatory text is removed.

The following must remain understandable through visual and behavioral evidence:

- route continuation;
- target selection;
- collectible availability;
- valid placement;
- invalid placement;
- hazard boundary;
- workshop entrance;
- successful action;
- unavailable action;
- objective completion.

Language may support precision, accessibility, and onboarding, but may not compensate for contradictory world communication.

### 8.18 Day, Night, Weather, and Quality-Level Contract

Readability must remain valid under every supported presentation state.

Validate representative combinations of:

- bright daylight;
- shadowed valley areas;
- workshop interior lighting;
- evening or night state when supported;
- water reflection variation;
- reduced FX quality;
- reduced shadow quality;
- reduced foliage density;
- supported display brightness and viewport ranges.

Fallbacks must preserve gameplay meaning when optional visual effects are disabled.

### 8.19 Audio Support Contract

Audio may reinforce but must not solely carry required meaning.

Approved uses include:

- waterfall orientation;
- workshop destination presence;
- interaction focus and confirmation;
- hazard proximity;
- objective-state transition;
- collection and placement feedback.

Audio cues must have clear ownership and must not create false direction through uncontrolled overlap.

### 8.20 Runtime Readability Controls

Runtime controls may include:

- interaction highlight enablement;
- prompt distance and timing;
- destination marker fallback;
- foliage density tiers;
- FX density tiers;
- emissive intensity limits;
- outline accessibility mode;
- camera field-of-view bounds;
- contrast or brightness accessibility support;
- debug visualization for paths, interaction envelopes, and occluders.

Debug controls are validation tools, not substitutes for readable production composition.

### 8.21 Readability Debug Views

Provide or document debug methods for:

- primary, secondary, and tertiary path overlays;
- traversal and collision boundaries;
- interaction range and selected target;
- hazard volumes;
- landmark sightline rays;
- occlusion blockers;
- objective state;
- contrast-priority ownership;
- active audio emitters.

Debug output must be removable from production presentation.

### 8.22 Validation Procedure

Perform validation in this order.

#### A. Static Composition Review

Capture approved viewpoints for:

- Arrival Overlook;
- first valley descent decision;
- river and bridge orientation;
- bridge entrance and exit;
- workshop terrace approach;
- workshop threshold;
- workshop interior entry;
- representative interaction cluster.

#### B. Guided Runtime Walkthrough

Walk the complete critical path without debug overlays.

Record:

- hesitation points;
- false-route attempts;
- missed interactions;
- hidden hazards;
- camera obstruction;
- unclear state changes;
- unnecessary dependence on text.

#### C. Unprompted Readability Test

A tester who did not assemble the scene should attempt the journey with only the normal game presentation.

The test is successful when the player can:

- reach the workshop;
- identify the bridge crossing;
- distinguish at least one optional route from progression;
- identify valid interactables;
- understand collection and placement outcomes;
- recover orientation after turning away from the route.

#### D. Stress Cases

Repeat representative checks with:

- reduced quality settings;
- rapid camera movement;
- reverse traversal;
- inventory or objective state changes;
- nearby multiple interactables;
- maximum expected foliage and FX load;
- supported viewport extremes.

### 8.23 Quantitative and Qualitative Evidence

Required evidence package:

1. decision-point map;
2. primary-route runtime capture;
3. reverse-route recovery capture;
4. interaction discovery and selection capture;
5. collectible before/after state capture;
6. valid and invalid placement capture;
7. hazard-boundary capture;
8. workshop entrance and internal circulation capture;
9. representative low-quality fallback capture;
10. issue register with disposition.

Evidence must identify build, branch, commit, viewport, quality setting, and validation date.

### 8.24 Failure Classification

Classify failures as:

| Code | Meaning |
|---|---|
| GR-NAV | Navigation hierarchy failure |
| GR-LMK | Landmark orientation failure |
| GR-TRV | Traversal communication failure |
| GR-INT | Interaction readability failure |
| GR-HAZ | Hazard or safety communication failure |
| GR-CAM | Camera or occlusion failure |
| GR-CON | Contrast or visual-priority failure |
| GR-STA | State-change feedback failure |
| GR-ACC | Accessibility fallback failure |
| GR-RUN | Runtime-only readability failure |

Each issue must include severity, reproduction path, affected viewpoint, owner, and revalidation requirement.

### 8.25 Revalidation Triggers

Gameplay readability must be revalidated after material changes to:

- terrain elevation or path width;
- water boundaries or bridge geometry;
- vegetation density or placement;
- landmark scale, position, or silhouette;
- workshop approach, entrance, or interior layout;
- player camera or movement behavior;
- interaction range or targeting policy;
- collectible or placement behavior;
- lighting, fog, weather, or time of day;
- FX density or motion;
- material contrast or emissive values;
- UI prompt placement;
- runtime quality tiers;
- collision or navigation mesh.

A previous screenshot is not valid evidence after its underlying composition contract changes.

### 8.26 Prohibited Shortcuts

Do not:

- solve unclear navigation only with floating arrows;
- solve every interaction with permanent outlines;
- use invisible walls that contradict visible traversal;
- hide hazardous edges behind decorative foliage;
- make optional routes visually stronger than required progression without intent;
- depend on editor-only lighting or camera views;
- use text as the only evidence of success or failure;
- increase saturation and emissive intensity globally to solve local readability;
- accept readability based only on the assembler's familiarity with the scene;
- mark the phase complete without runtime evidence.

### 8.27 Section Exit Gate

Phase 8 is complete only when all statements are true:

- the critical journey is readable through the gameplay camera;
- primary, secondary, and tertiary route hierarchy is observable;
- major decision points have visible destination or recovery support;
- traversable and non-traversable surfaces communicate consistently;
- hazards are readable before consequence thresholds;
- interactables can be discovered and selected deterministically;
- collection, placement, refusal, and objective transitions have clear feedback;
- workshop approach, entrance, and functional core remain readable;
- visual noise does not overpower gameplay priorities;
- required meaning survives supported quality and presentation states;
- an uninvolved tester can complete the representative journey;
- required evidence is captured and linked;
- unresolved critical readability failures are zero;
- affected systems have owners for any accepted non-critical debt.

## Phase 8 Completion Record

When the exit gate passes, record:

```text
Document: MLW-DOC-014E
Phase: 8 — Gameplay Readability
Result: PASS | CONDITIONAL PASS | FAIL
Branch:
Commit:
Runtime Build:
Validation Date:
Reviewers:
Critical Failures:
Accepted Debt:
Evidence Location:
Next Phase: 9 — Lighting Assembly
```

Phase 8 completion authorizes Lighting Assembly to refine and reinforce the established gameplay hierarchy. Phase 9 must not redefine navigation, interaction, hazard, or destination authority without reopening the affected Phase 8 validation scope.
