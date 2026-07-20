# 09 — Creative Governance

## Purpose

This document defines how creative decisions become authoritative, how they are reviewed, and how the project avoids drift as more people, systems, and regions are added.

## Authority order

When documents disagree, use this order:

1. Product purpose and approved business decisions;
2. Universe Bible;
3. Learning Philosophy;
4. World Bible and Civilization Bible;
5. Landmark Bible and Visual Language;
6. Math Learning World Design System;
7. approved Target Frame and production brief for the active slice;
8. gameplay and technical implementation details.

A lower layer may reveal a constraint that requires revisiting a higher layer, but it may not silently override it.

## Decision classes

### Canon decision

Changes the identity, laws, values, geography, civilization, or educational philosophy of the world.

Requires:

- explicit rationale;
- impact review across the foundation documents;
- human approval;
- recorded update to the relevant Source of Truth.

### Production direction decision

Changes a Target Frame, landmark hierarchy, scene composition, material language, lighting target, or production acceptance criteria.

Requires:

- comparison evidence;
- affected slice identified;
- Art and Gameplay readability review;
- update to the active production brief.

### Implementation decision

Chooses a technical or asset-production method without changing approved meaning or experience.

May be made by the responsible executor within the documented constraints.

### Experiment

Tests an idea without granting it authority.

Experiments must be labeled and isolated. A successful experiment becomes authoritative only after review and documentation.

## Review lenses

Every material creative change should be reviewed through five lenses.

### 1. World meaning

- Does the change belong in this universe?
- Does it strengthen the emotional purpose of the place?
- Does it make the world more coherent?

### 2. Learning meaning

- What relationship can the player notice, test, explain, or transfer?
- Does the design create curiosity before explanation?
- Does failure produce information?

### 3. Gameplay meaning

- Are the player verbs and route readable?
- Does the art support interaction rather than conceal it?
- Is the experience enjoyable without an external reward layer?

### 4. Visual meaning

- Is there a clear hierarchy?
- Does the composition work from the principal camera and target device?
- Are shape, value, color, light, and movement serving the intended read?

### 5. Production meaning

- Is the decision buildable and testable?
- Are dependencies and exclusions explicit?
- Is there evidence for acceptance rather than only explanation?

## Required evidence by gate

### Creative Foundation Gate

Evidence:

- coherent Source of Truth;
- no unresolved contradiction with approved product purpose;
- clear authority and boundaries.

Result:

`CREATIVE FOUNDATION PASS`

### Target Frame Gate

Evidence:

- approved image or composition target;
- landmark and player-path hierarchy;
- gameplay readability overlay or written proof;
- production decomposition;
- acceptance criteria.

Result:

`TARGET FRAME PASS`

### Production Slice Gate

Evidence:

- runtime captures from defined viewpoints;
- comparison against the Target Frame;
- target-device readability;
- interaction and collision validation;
- performance evidence;
- known deviations recorded.

Result:

`PRODUCTION SLICE PASS`

### Learning Experience Gate

Evidence:

- observed player loop;
- misconception and feedback behavior;
- revision opportunity;
- transfer evidence;
- human validation where appropriate.

Result:

`LEARNING EXPERIENCE PASS`

No gate implies that later gates have passed.

## Change record format

Material decisions should record:

```text
Decision:
Reason:
Authority affected:
Production surface affected:
Learning impact:
Gameplay impact:
Visual impact:
Evidence:
Status:
```

## Drift warnings

The following are warning signs:

- a region is introduced because the team has an asset rather than because the world needs it;
- a visual effect is accepted without checking readability;
- a learning mechanic is attached after the gameplay is complete;
- a Hero Frame is treated as mood inspiration but ignored during runtime comparison;
- a production constraint silently changes the emotional or learning purpose;
- multiple documents describe different versions of the same place;
- progress is reported through effort or file count rather than player-visible evidence.

## Guardian responsibility

The Guardian of the World Bible does not own every creative decision. The role protects coherence by:

- identifying authority conflicts;
- asking for missing evidence;
- preserving approved intent during implementation;
- recording accepted evolution;
- preventing experiments from becoming accidental canon;
- ensuring that the world, learning, gameplay, and art remain one experience.

## Current governed slice

The active governed slice is:

`Builder's Valley — Production Environment Slice 001`

Its current authorities are:

- Universe Foundation documents;
- Builder's Valley Hero Frame;
- Builder's Valley Production Brief;
- Production Environment Slice 001 art-direction and scene-blueprint documents;
- existing gameplay loop and runtime constraints.

The next gate is Target Frame and production-brief conformance before further environment expansion.
