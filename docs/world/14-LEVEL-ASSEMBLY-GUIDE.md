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
