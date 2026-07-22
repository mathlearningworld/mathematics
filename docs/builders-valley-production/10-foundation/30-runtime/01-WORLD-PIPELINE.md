# Builders Valley World Pipeline

## Status

Authoritative foundation contract for translating approved world design into runtime output.

## Purpose

This document defines the required production sequence, the responsibility of each stage, and the evidence needed before work may advance.

The pipeline exists to prevent runtime implementation from becoming an unstructured design process.

## Pipeline Overview

```text
Product Constitution
        ↓
Spatial Foundation
        ↓
Visual Foundation
        ↓
Landmark Contract
        ↓
Implementation Gate
        ↓
Runtime Mapping
        ↓
Terrain Assembly
        ↓
Composition Assembly
        ↓
Materials and Lighting
        ↓
Interaction Integration
        ↓
Runtime Verification
        ↓
Screenshot Review
        ↓
Acceptance or Targeted Patch
```

## Stage 1 — Product Constitution

### Input

- world identity
- learning philosophy
- player journey
- design principles
- non-goals

### Output

A stable statement of what Builders Valley is and what it must not become.

### Gate

Runtime work must not begin if the intended experience conflicts with the Product Constitution.

## Stage 2 — Spatial Foundation

### Input

Approved Product Constitution.

### Output

- coordinate system
- camera language
- world grid policy
- terrain rules
- composition rules

### Gate

The design must identify the route, terrain mass, landmark position, player scale reference, and required frame behavior.

## Stage 3 — Visual Foundation

### Input

Approved spatial design.

### Output

- lighting intent
- material families
- color meaning
- scale relationships

### Gate

Visual rules must support spatial readability and gameplay. They must not compensate for unresolved terrain or composition problems.

## Stage 4 — Landmark Contract

Each landmark contract defines:

- mission and player purpose
- prerequisite and outcome
- terrain requirement
- composition
- gameplay loop
- environmental story
- asset rules
- camera requirements
- runtime owner
- acceptance criteria

### Gate

A landmark cannot enter implementation while its gameplay purpose or acceptance criteria remain implicit.

## Stage 5 — Implementation Gate

The Implementation Gate confirms that the design is ready to become runtime work.

Required readiness:

- approved mission
- approved terrain
- approved composition
- approved camera
- approved scale
- approved materials and lighting intent
- declared runtime owners
- defined verification evidence

A failed gate returns the work to design. It does not create a runtime patch mission.

## Stage 6 — Runtime Mapping

The approved contract is mapped to repository modules and runtime responsibilities.

Required mapping:

```text
Contract Element
Owning Module
Runtime Domain
Input
Output
Dependency
Failure Behavior
Verification Method
```

### Gate

Every authoritative behavior must have one owner. Every visual projection must identify the state it projects.

## Stage 7 — Terrain Assembly

Terrain is assembled in this order:

```text
Primary Mass
    ↓
Cuts and Gaps
    ↓
Traversable Route
    ↓
Cliffs and Boundaries
    ↓
Collision
    ↓
Terrain Materials
```

### Gate

The route and landmark purpose must remain readable before props, vegetation, or decorative detail are added.

## Stage 8 — Composition Assembly

Composition establishes:

- focal hierarchy
- foreground, midground, and background
- hero landmark silhouette
- route legibility
- negative space
- player visibility

### Gate

A grayscale or low-detail frame must still communicate the intended route and landmark hierarchy.

## Stage 9 — Materials and Lighting

Materials and lighting reinforce already-approved form.

Required order:

```text
Material Family Assignment
    ↓
Material Variation
    ↓
Global Lighting
    ↓
Landmark-local Lighting
    ↓
Fog / Exposure / Post-processing
```

### Gate

Lighting and material detail must not create a new focal hierarchy that conflicts with composition.

## Stage 10 — Interaction Integration

Interaction is added only after the world communicates what the player should notice and approach.

Interaction integration defines:

- eligible target
- player proximity or trigger
- active tool or action
- state transition
- feedback
- failure and retry behavior

### Gate

The interaction must preserve module ownership and must not directly mutate unrelated runtime domains.

## Stage 11 — Runtime Verification

Verification must establish actual runtime behavior, not only repository presence.

Minimum evidence:

- project starts successfully
- authoritative owners initialize in the required order
- expected world and landmark appear
- interaction loop completes
- no duplicate renderer or authority remains active
- failures are visible and diagnosable

## Stage 12 — Screenshot Review

Screenshots are evaluated against the Production Bible and Landmark Contract.

Required views are defined in `02-SCREENSHOT-STANDARD.md`.

Screenshot approval does not replace runtime verification. Runtime verification and visual acceptance are separate gates.

## Stage 13 — Acceptance or Targeted Patch

### Acceptance

The landmark is accepted when:

- repository contract is complete
- runtime behavior is verified
- visual evidence meets acceptance criteria
- human validation confirms intended experience

### Targeted Patch

When evidence fails, produce a narrow patch mission tied to the failed criterion.

Preferred loop:

```text
Implementation
    ↓
Human Runtime Execution
    ↓
Evidence
    ↓
Architect Diagnosis
    ↓
Targeted Patch
    ↓
Re-verification
```

Do not restart the whole implementation when the evidence identifies a local defect.

## Change Control

Changes discovered during runtime are classified as:

### Implementation Defect

Runtime does not match an approved contract.

Action: targeted implementation patch.

### Contract Defect

The approved contract is incomplete or contradictory.

Action: return to the appropriate Production Bible or Landmark document, revise it, then remap runtime.

### Product Decision

The desired player experience has changed.

Action: revise Product Constitution or Landmark mission before implementation continues.

Runtime must never silently resolve Product Decisions.

## Pipeline Invariants

- Blueprint precedes implementation.
- Terrain precedes decoration.
- Composition precedes visual polish.
- Runtime ownership precedes mutation.
- Verification evidence precedes completion claims.
- Screenshot approval does not imply operational correctness.
- Repository completion does not imply runtime completion.
- Failed evidence produces a targeted patch, not an undocumented workaround.

## Definition of Pipeline Completion

A world slice is complete only when all applicable gates are recorded as PASS:

```text
Repository Gate
Runtime Gate
Operational Gate
Visual Acceptance Gate
Human Validation Gate
```

A deferred gate must remain explicitly marked as deferred. It must not be interpreted as passed.
