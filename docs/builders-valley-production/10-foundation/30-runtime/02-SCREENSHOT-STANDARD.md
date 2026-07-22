# Builders Valley Screenshot Standard

## Status

Authoritative verification standard for visual evidence produced from the Builders Valley runtime.

## Purpose

Screenshots are verification artifacts. They are not decoration, marketing captures, or substitutes for runtime tests.

A screenshot package must make it possible to judge whether the implemented world matches the approved Product Constitution, Foundation contracts, and Landmark acceptance criteria.

## Evidence Principles

- Evidence must come from the actual runtime under review.
- Evidence must show the implemented state clearly.
- A flattering angle must not hide a defect.
- A single hero image is never sufficient for acceptance.
- Screenshots do not prove interaction, persistence, initialization order, or error recovery by themselves.
- Visual acceptance and runtime verification remain separate gates.

## Required Screenshot Set

Every landmark review must include the following views unless the Landmark Contract explicitly marks one as not applicable.

### 1. Hero Frame

Purpose:

- prove landmark identity
- prove focal hierarchy
- prove silhouette and visual promise
- show the intended primary composition

Must show:

- hero landmark
- surrounding terrain mass
- route relationship
- player or scale reference when applicable
- foreground, midground, and background separation

Must not:

- crop out the route dependency
- conceal unfinished terrain with fog or extreme depth of field
- use a camera position unavailable to the actual runtime unless labeled as a separate cinematic frame

### 2. Gameplay Frame

Purpose:

- prove that the landmark is readable during actual play
- show player position, route, and actionable space

Must show:

- normal gameplay camera
- player
- immediate route
- relevant interaction target
- sufficient surrounding context

### 3. Exploration Frame

Purpose:

- prove spatial continuity before or after the hero view
- show how the player discovers, approaches, or leaves the landmark

Must show:

- approach or departure path
- environmental cues
- landmark visibility or intentional concealment
- boundary behavior

### 4. Scale Validation Frame

Purpose:

- prove that player, route, bridge, terrain, props, and structures share a coherent scale system

Must show:

- player beside the primary structure or terrain feature
- route width
- vertical clearance where relevant
- nearby props used as secondary references

### 5. Lighting Validation Frame

Purpose:

- prove that lighting supports gameplay and composition

Must show:

- primary light direction
- player readability
- route readability
- landmark separation
- shadow and fog behavior

When lighting changes dynamically, include the required states defined by the Landmark Contract.

## Conditional Evidence

Depending on the landmark, also include:

### Interaction Frame

Shows target eligibility, active feedback, and the visible result of the action.

### Before / After Frame

Shows a meaningful state transition from the same or equivalently matched camera position.

### Failure Frame

Shows rejected, blocked, unavailable, or recovery state when that behavior is part of acceptance.

### Boundary Frame

Shows cliffs, water, collision edges, barriers, or world limits that affect navigation.

### Mobile Frame

Shows the same gameplay state at the supported mobile viewport and control layout.

## Capture Conditions

Every evidence package must record:

```text
Repository / Branch
Commit SHA
Runtime Command
Environment
Viewport Size
Device or Browser
World / Landmark
Runtime State
Capture Date
Known Deviations
```

Where practical, include the commit SHA or evidence package identifier in the filename or accompanying manifest.

## Framing Rules

### Camera Authenticity

Use the authoritative runtime camera for gameplay evidence.

A debug, editor, cinematic, or free camera may be used only when:

- the frame is explicitly labeled
- it supplements rather than replaces gameplay evidence
- it does not determine acceptance for normal player readability

### Stable Comparison

For before-and-after or patch comparison:

- preserve viewport
- preserve camera position and rotation where possible
- preserve runtime state unless the state change is the subject
- preserve time-of-day and lighting configuration

### No Evidence Manipulation

Do not:

- edit geometry into the image
- remove defects from the image
- change colors or exposure outside the runtime
- crop away required context
- add labels that obscure defects

Annotations are allowed on a duplicate copy when the unmodified original is also supplied.

## Review Order

Review screenshots in this order:

```text
1. Terrain Mass
2. Route and Navigation
3. Landmark Silhouette
4. Composition and Depth
5. Player Readability
6. Scale
7. Lighting
8. Materials and Color
9. Environmental Storytelling
10. Decorative Detail
```

A failure at an earlier level must not be accepted because later visual detail is attractive.

## Acceptance Checklist

### Spatial

- [ ] Primary terrain mass is readable.
- [ ] Terrain creates the landmark's gameplay need.
- [ ] Route is understandable without explanatory UI.
- [ ] Foreground, midground, and background are distinct.
- [ ] Boundaries are intentional and readable.

### Composition

- [ ] Primary focal point is unambiguous.
- [ ] Secondary elements support rather than compete.
- [ ] Landmark silhouette is recognizable.
- [ ] Negative space supports readability.
- [ ] Player is not lost in visual noise.

### Scale

- [ ] Player scale is coherent.
- [ ] Route width supports intended movement.
- [ ] Structures and props relate consistently.
- [ ] Vertical dimensions communicate intended danger or safety.
- [ ] No prop has been enlarged merely to repair composition.

### Lighting and Color

- [ ] Lighting guides attention.
- [ ] Route and player remain readable.
- [ ] Global and local lighting do not conflict.
- [ ] Saturation hierarchy is controlled.
- [ ] Critical information does not depend on color alone.

### Materials

- [ ] Material families match structural purpose.
- [ ] Terrain form remains readable without texture detail.
- [ ] Shared materials are consistent.
- [ ] Variation does not become noise.

### Runtime Projection

- [ ] No duplicate terrain or renderer is visible.
- [ ] No overlapping authority creates visual overdraw.
- [ ] Camera matches the approved camera contract.
- [ ] Expected landmark state is shown.
- [ ] Known fallback or degraded state is clearly labeled.

## Pass / Fail Language

Use explicit results:

```text
PASS
FAIL
DEFERRED
NOT APPLICABLE
```

Do not use ambiguous completion language such as "looks fine," "mostly done," or "probably correct."

Every FAIL must identify:

```text
Failed Criterion
Observed Evidence
Expected Contract
Likely Owning Domain
Required Next Evidence
```

## Screenshot Evidence Package

Recommended structure:

```text
evidence/
└── <landmark>-<commit-sha>/
    ├── manifest.md
    ├── 01-hero-frame.png
    ├── 02-gameplay-frame.png
    ├── 03-exploration-frame.png
    ├── 04-scale-validation.png
    ├── 05-lighting-validation.png
    └── optional/
```

Use unique artifact names. Never overwrite evidence from an earlier runtime round.

## Screenshot Review Is Not Completion

A visually approved landmark may still fail because:

- interaction does not complete
- collision is incorrect
- save/load is broken
- the wrong runtime owner produced the frame
- initialization depends on a race condition
- build or runtime verification failed

Likewise, a technically functioning landmark may fail visual acceptance.

Completion requires the applicable repository, runtime, operational, visual, and human gates to pass independently.

## Human Validation

The human reviewer confirms whether the world communicates the intended experience during actual play.

Human validation should answer:

- Did I know where to go?
- Did the terrain explain why the landmark exists?
- Did I understand what was important before reading UI?
- Did scale and lighting feel consistent?
- Did the interaction result match the visual promise?

This judgment is recorded as evidence and must not be inferred from an automated screenshot comparison.
