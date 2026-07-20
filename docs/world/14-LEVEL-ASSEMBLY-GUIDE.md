# 14 — Level Assembly Guide

## Document Identity

- Document ID: MLW-DOC-014
- Status: PRODUCTION GUIDE — ACTIVE DEVELOPMENT
- Parent: MLW-DOC-013 Runtime Asset Catalog
- Completion Patch: MLW-DOC-013A Runtime Asset Catalog Completion Patch
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This document defines the assembly order and production workflow for constructing Builder's Valley from the runtime assets defined in MLW-DOC-013 and MLW-DOC-013A.

It governs how approved runtime assets are transformed into a coherent, readable, performant, and reviewable playable environment. It does not replace asset specifications, gameplay logic, or engine-specific technical documentation. Its purpose is to control production sequence, dependency order, validation timing, and acceptance evidence.

## Planned Sections

1. Assembly Philosophy
2. Zone Assembly Order
3. Terrain Assembly
4. Water Assembly
5. Vegetation Assembly
6. Landmark Assembly
7. Workshop Assembly
8. Gameplay Readability
9. Lighting Assembly
10. FX Assembly
11. Ambient Audio Assembly
12. Composition Validation
13. Runtime Validation
14. Acceptance Checklist

## 1 Assembly Philosophy

### 1.1 Production Objective

The objective of level assembly is not to place every available asset. The objective is to construct the smallest complete environment that communicates the identity, route, function, and emotional geography of Builder's Valley while remaining measurable against production and runtime constraints.

Every assembly decision must answer at least one of the following questions:

- Does this improve player orientation?
- Does this strengthen the intended zone identity?
- Does this support gameplay readability or interaction?
- Does this improve foreground, midground, and background composition?
- Does this preserve the runtime budget?
- Does this provide evidence required by an acceptance gate?

Assets that answer none of these questions must not be added merely to make the scene look fuller.

### 1.2 Governing Principles

#### Composition Before Decoration

Large spatial relationships are established before small visual detail. Terrain masses, river direction, primary paths, landmark silhouettes, and zone boundaries must be readable before props, decals, ground cover, or ambient decoration are introduced.

Decoration must reinforce an already valid composition. It must never be used to hide unresolved terrain, circulation, or landmark problems.

#### Readability Before Detail

The player must understand where they are, where they can move, and what is important before the scene receives high-frequency detail.

Path contrast, landmark visibility, traversable widths, interaction clearances, and safe-zone boundaries take priority over surface richness. Detail that weakens route recognition or interaction visibility must be removed or reduced.

#### Landmark Before Props

Primary and secondary landmarks are assembled before general props. Their placement establishes orientation, hierarchy, sightlines, and zone identity.

For Builder's Valley, the following anchors must be resolved before decorative prop placement:

1. Bridge Crossing — primary constructed landmark.
2. Workshop Terrace — functional destination and secondary landmark.
3. Waterfall Vista — natural anchor and depth reference.
4. Arrival Overlook — orientation point and first composition frame.

Props may support these anchors, but must not compete with their silhouette, color hierarchy, or visual weight.

#### Gameplay Before Beauty

A visually successful scene that obstructs movement, hides interactions, creates false routes, or misrepresents safe and unsafe space is not production-ready.

Gameplay-relevant spaces must be reserved early, including:

- walkable path corridors;
- bridge approach and crossing clearance;
- workshop interaction space;
- placement and staging zones;
- camera-safe foreground space;
- navigation and recovery clearances.

Visual assets are fitted around these spaces, not the other way around.

#### Performance-Aware Assembly

Runtime constraints are assembly inputs, not late-stage optimization concerns. Density, material count, transparency, shadow use, collision complexity, LOD assignment, and culling groups must be considered when each layer is introduced.

No production pass may knowingly create a runtime debt that is deferred without an owner, evidence, and correction gate.

#### Layered Construction

The environment is assembled in controlled layers. Each layer must be reviewable before the next dependent layer begins.

The standard layer order is:

```text
Blockout and Metrics
→ Terrain and Zone Massing
→ Water and River Corridor
→ Primary Paths and Traversal
→ Landmarks and Architecture
→ Workshop Functional Layer
→ Major Vegetation Masses
→ Supporting Vegetation and Rocks
→ Gameplay Readability Layer
→ Lighting
→ FX
→ Ambient Audio
→ Final Detail and Polish
```

A later layer must not be used to compensate for a failed earlier layer. When a foundational layer changes materially, affected later layers must be revalidated.

#### Evidence Before Acceptance

A scene is not accepted because it appears complete in one editor view. Acceptance requires observable evidence against the relevant gate.

Evidence may include:

- approved camera captures from required viewpoints;
- zone and route readability captures;
- collision and traversal verification;
- hierarchy and naming inspection;
- LOD and culling verification;
- runtime frame and budget measurements;
- acceptance checklist records.

Claims without evidence remain unverified.

### 1.3 Assembly Hierarchy

Production decisions follow this hierarchy:

```text
Player Route and Functional Space
→ Zone Boundaries and Terrain Masses
→ Primary Landmarks
→ Secondary Structures and Natural Anchors
→ Vegetation and Rock Masses
→ Gameplay Readability Assets
→ Lighting, FX, and Audio
→ Decorative Detail
```

When two layers conflict, the higher layer in this hierarchy has authority unless a higher governing document explicitly states otherwise.

Examples:

- A decorative tree must move if it blocks the bridge landmark.
- A rock cluster must change if it narrows the approved path width.
- A fog effect must be reduced if it hides the workshop destination.
- A prop group must be removed if it exceeds the zone density or draw-call target.

### 1.4 Dependency Rule

Assembly work begins only when its required upstream dependency is stable enough to support it.

| Assembly Layer | Required Upstream State |
|---|---|
| Terrain detail | Blockout scale, zone bounds, and elevation flow approved |
| Water | River corridor and waterfall elevation approved |
| Paths | Terrain grade and route endpoints approved |
| Landmarks | Terrain, paths, and required sightlines approved |
| Workshop | Workshop terrace, access route, and interaction footprint approved |
| Major vegetation | Terrain, paths, landmarks, and camera views approved |
| Supporting detail | Major vegetation and gameplay clearances approved |
| Lighting | Major geometry and vegetation silhouettes approved |
| FX | Water, lighting direction, and visibility hierarchy approved |
| Audio | Zone boundaries and source locations approved |
| Final polish | Composition and runtime validation passed |

If an upstream dependency changes materially, dependent layers return to review rather than remaining implicitly accepted.

### 1.5 Rework Prevention Rules

To reduce avoidable production rework:

- Do not finalize terrain materials before terrain shape and route grades are approved.
- Do not paint dense vegetation before landmark sightlines and path clearances are locked.
- Do not place small props before workshop functional footprints are validated.
- Do not finalize lighting before major silhouettes and canopy masses are stable.
- Do not add expensive FX before the base scene meets runtime targets.
- Do not perform final polish while unresolved composition or traversal failures remain.

Temporary placeholders are permitted when they preserve correct scale, footprint, hierarchy, and dependency intent. Placeholders must be clearly named and tracked for replacement.

### 1.6 Production Pass Model

Each section of this guide should be executed through four passes:

1. **Blockout Pass** — establish scale, footprint, route, and hierarchy with minimal assets.
2. **Structure Pass** — replace or refine major terrain, architecture, water, and landmark forms.
3. **Readability Pass** — validate navigation, interaction, zone identity, and composition.
4. **Runtime and Polish Pass** — confirm budgets, LOD, culling, collision, lighting, FX, audio, and final detail.

A pass is complete only when its exit conditions are met. Visual progress alone is not an exit condition.

### 1.7 Section Exit Gate

Assembly Philosophy is accepted when the production team can demonstrate that:

- the scene will be assembled in dependency order;
- gameplay and orientation outrank decoration;
- landmarks are established before general props;
- runtime budgets are treated as active constraints;
- every assembly layer has a reviewable exit state;
- acceptance claims will be supported by evidence;
- foundational changes trigger revalidation of dependent layers.

Until these rules are adopted, downstream assembly sections remain procedural guidance but are not yet governed production execution.

## 2 Zone Assembly Order

### 2.1 Objective

Zone assembly converts the world specification into a controlled production sequence. The purpose is to prevent teams from building isolated attractive areas that later fail to connect into a readable, traversable, and performant whole.

Builder's Valley must be assembled as one continuous player journey, not as independent dioramas. Each zone must establish the entry condition for the next zone while preserving sightlines, elevation logic, route continuity, and emotional progression.

### 2.2 Authoritative Zone Sequence

The production order for Builder's Valley is:

```text
Global Blockout and Valley Envelope
→ Arrival Overlook
→ Arrival Path
→ River Corridor
→ Waterfall Vista
→ Bridge Approach
→ Bridge Crossing
→ Workshop Terrace
→ Workshop Functional Core
→ Supporting Edge and Background Zones
→ Cross-Zone Readability Pass
→ Runtime Integration Pass
```

This order is authoritative for production dependency. Teams may prototype downstream zones in isolation, but no downstream zone may be accepted before its upstream route, elevation, and sightline dependencies are approved.

### 2.3 Zone Responsibilities

| Order | Zone | Production Responsibility | Primary Output |
|---|---|---|---|
| 0 | Global Blockout and Valley Envelope | Establish total scale, valley walls, route length, elevation range, river direction, and background bounds | Approved macro blockout |
| 1 | Arrival Overlook | Establish first-frame orientation, valley reveal, destination preview, and safe starting composition | Approved arrival frame |
| 2 | Arrival Path | Establish readable descent, path width, route rhythm, and transition into the valley floor | Approved traversal corridor |
| 3 | River Corridor | Establish the central natural spine, water adjacency, movement direction, and mid-valley depth | Approved river route |
| 4 | Waterfall Vista | Establish natural anchor, vertical depth, audio source logic, and distant orientation | Approved natural landmark frame |
| 5 | Bridge Approach | Establish anticipation, sightline reveal, approach clearance, and crossing decision space | Approved bridge reveal |
| 6 | Bridge Crossing | Establish the primary constructed landmark, crossing safety, focal hierarchy, and route continuity | Approved crossing landmark |
| 7 | Workshop Terrace | Establish destination identity, arrival decompression, functional zoning, and secondary landmark hierarchy | Approved destination terrace |
| 8 | Workshop Functional Core | Establish workbench, storage, staging, interaction, and placement clearances | Approved functional footprint |
| 9 | Supporting Edge and Background Zones | Complete valley enclosure, background depth, non-playable boundaries, and composition support | Approved environmental frame |
| 10 | Cross-Zone Readability Pass | Validate continuous navigation, landmark sequence, false-route control, and visual hierarchy | Approved journey readability |
| 11 | Runtime Integration Pass | Validate budgets, collision, LOD, culling, audio zones, FX density, and final integration | Runtime-ready zone package |

### 2.4 Zone Dependency Chain

Each zone begins only when its entry dependencies are stable.

| Zone | Required Entry State | Unlocks |
|---|---|---|
| Global Blockout | Slice bounds, target scale, and governing documents available | All zone blockouts |
| Arrival Overlook | Global scale, valley direction, and destination positions approved | Arrival Path composition |
| Arrival Path | Arrival elevation and valley-floor connection approved | River Corridor route |
| River Corridor | Terrain grade, river direction, and path adjacency approved | Waterfall Vista and Bridge Approach |
| Waterfall Vista | River source direction and long sightline approved | Natural landmark layer, waterfall FX, audio planning |
| Bridge Approach | River width, crossing elevation, and bridge sightline approved | Bridge Crossing |
| Bridge Crossing | Approach paths, support points, and clearance approved | Workshop Terrace route |
| Workshop Terrace | Crossing exit, terrace elevation, and destination sightline approved | Workshop Functional Core |
| Workshop Functional Core | Terrace footprint and gameplay requirements approved | Props, interaction markers, local detail |
| Supporting Zones | Primary route, landmarks, and camera views approved | Final enclosure and background composition |
| Cross-Zone Readability | All primary zones structurally approved | Lighting, FX, audio, and polish acceptance |
| Runtime Integration | Composition and gameplay readability passed | Slice acceptance review |

A change that invalidates an entry state automatically reopens the affected zone and every dependent downstream zone.

### 2.5 Per-Zone Assembly Procedure

Every zone follows the same production sequence:

1. **Define Bounds** — identify playable, visible, supporting, and excluded space.
2. **Lock Entry and Exit** — establish where the player arrives, where the player leaves, and how the route continues.
3. **Resolve Elevation** — confirm grades, steps, ramps, drops, and sightline height relationships.
4. **Place Primary Anchor** — establish the landmark, natural feature, or functional destination that gives the zone identity.
5. **Reserve Gameplay Space** — protect path widths, interaction clearances, placement zones, camera space, and recovery space.
6. **Build Supporting Masses** — add terrain, rock, architecture, and vegetation masses that frame the route and anchor.
7. **Validate Readability** — confirm route, destination, safe space, and zone identity from required viewpoints.
8. **Apply Runtime Controls** — assign collision, LOD, culling, material, shadow, density, and audio/FX ownership.
9. **Capture Evidence** — record required views, measurements, and validation results.
10. **Close Zone Gate** — accept, reject, or return the zone for targeted correction.

No zone is complete because its asset placement appears visually dense. Completion requires entry-to-exit function, composition hierarchy, and evidence.

### 2.6 Transition Contracts

The boundary between two adjacent zones is a production contract. Each transition must preserve:

- continuous traversable width;
- understandable forward direction;
- compatible terrain grade and elevation;
- at least one readable destination or next-zone cue;
- no accidental collision trap or camera obstruction;
- no abrupt material, lighting, vegetation, or audio discontinuity unless intentionally authored;
- preserved runtime ownership for culling, audio, and FX groups.

Required transitions are:

| From | To | Transition Intent |
|---|---|---|
| Arrival Overlook | Arrival Path | Reveal becomes movement commitment |
| Arrival Path | River Corridor | Descent opens into the valley's natural spine |
| River Corridor | Waterfall Vista | Forward movement gains a distant natural anchor |
| River Corridor | Bridge Approach | River adjacency turns into a clear crossing objective |
| Bridge Approach | Bridge Crossing | Anticipation resolves into landmark traversal |
| Bridge Crossing | Workshop Terrace | Crossing resolves into functional destination arrival |
| Workshop Terrace | Workshop Functional Core | Destination identity resolves into actionable space |

A transition failure belongs to both adjacent zones. It must not be assigned only to the downstream zone.

### 2.7 Parallel Work Rules

Parallel production is permitted only where dependencies are explicit.

Safe parallel work examples:

- background valley masses may progress while the primary route is refined, provided they do not alter approved silhouettes;
- workshop prop concepts may progress while the terrace blockout is reviewed, provided final placement is deferred;
- waterfall FX prototypes may progress while the vista is blocked out, provided source position and budget remain provisional;
- vegetation asset preparation may progress before placement, provided density and sightline decisions remain open.

Unsafe parallel work examples:

- final bridge placement before river width and approach grades are approved;
- dense vegetation painting before cross-zone sightlines are validated;
- final workshop prop placement before interaction clearances are locked;
- final lighting before valley enclosure and landmark silhouettes are stable;
- audio zone finalization before zone boundaries and source locations are approved.

Parallel work that violates dependency order is prototype work and must not be reported as accepted production completion.

### 2.8 Zone Freeze Levels

Zones use controlled freeze levels instead of a single ambiguous "done" state.

| Freeze Level | Meaning | Permitted Changes |
|---|---|---|
| Z0 — Open | Zone is exploratory | Any change within governing scope |
| Z1 — Blockout Frozen | Bounds, route, scale, and elevation are approved | Structural changes require review |
| Z2 — Composition Frozen | Anchors, silhouettes, sightlines, and major masses are approved | No unreviewed landmark or route changes |
| Z3 — Gameplay Frozen | Traversal, interaction space, safe zones, and clearances are approved | Gameplay-impacting changes require revalidation |
| Z4 — Runtime Frozen | Collision, LOD, culling, materials, density, FX, and audio budgets are approved | Runtime-affecting changes require measurement |
| Z5 — Accepted | Required evidence and cross-zone validation passed | Changes reopen affected acceptance gates |

A zone may not advance to a higher freeze level while failures from a lower level remain unresolved.

### 2.9 Required Evidence by Zone

Each zone acceptance package must contain:

- one entry-view capture;
- one exit-view capture;
- one primary-anchor capture;
- one top-down or debug view showing bounds and route;
- traversal and collision confirmation;
- path-width and interaction-clearance measurements where applicable;
- LOD and culling assignment confirmation;
- zone budget result or provisional budget statement;
- known issues and deferred corrections;
- reviewer decision and freeze level.

Additional required evidence:

| Zone | Additional Evidence |
|---|---|
| Arrival Overlook | First-frame composition and destination visibility |
| Arrival Path | Grade, width, and route continuity |
| River Corridor | River direction, edge safety, and path-water separation |
| Waterfall Vista | Long-distance visibility and waterfall source alignment |
| Bridge Approach | Bridge reveal distance and approach clearance |
| Bridge Crossing | Crossing collision, rail safety, and both-direction readability |
| Workshop Terrace | Destination arrival frame and functional-zone separation |
| Workshop Functional Core | Interaction radius, staging area, and placement clearance |
| Supporting Zones | Background silhouette and non-playable boundary control |

### 2.10 Cross-Zone Revalidation Triggers

Cross-zone review is mandatory when any of the following changes:

- global terrain scale or valley elevation range;
- river course, width, or waterfall source;
- primary route endpoint or path grade;
- bridge position, span, height, or orientation;
- workshop terrace position, elevation, or footprint;
- primary landmark silhouette or visibility;
- camera framing that affects arrival or destination readability;
- vegetation mass that blocks a previously approved sightline;
- lighting, fog, or FX that alters route or landmark visibility;
- runtime partition, culling group, or audio-zone boundary.

The review must identify every dependent zone and revoke only the freeze levels affected by the change. Revalidation must be targeted, but it must never be skipped.

### 2.11 Section Exit Gate

Zone Assembly Order is accepted when the production team can demonstrate that:

- the complete Builder's Valley journey has an authoritative zone sequence;
- every zone has defined bounds, entry, exit, anchor, gameplay space, and evidence requirements;
- upstream and downstream dependencies are explicit;
- transition ownership is shared by adjacent zones;
- parallel work is separated from accepted production completion;
- freeze levels replace ambiguous completion claims;
- cross-zone changes trigger targeted revalidation;
- the final journey can be reviewed continuously from Arrival Overlook to Workshop Functional Core.

Until this gate passes, detailed terrain, water, vegetation, landmark, and workshop assembly may proceed only as controlled blockout or prototype work.