# Builders Valley World Bible

Status: APPROVED FOUNDATION V1
Authority: Product Constitution
Scope: Entire Builders Valley world, all landmarks, all runtime implementations

## 1. World Identity

Builders Valley is a world of learning through building.

The player is not primarily taught by instructions. The player learns through exploration, observation, experimentation, construction, correction, and discovery.

Builders Valley must feel like a coherent place whose geography, structures, pathways, landmarks, and visual hierarchy help the player understand what can be done next.

## 2. Product Purpose

Builders Valley exists to turn mathematical learning into meaningful action inside a navigable world.

The world must support three simultaneous goals:

1. Make learning goals visible through places and activities.
2. Let the environment communicate before explanatory UI is required.
3. Build confidence through successful interaction, not only through scores or text feedback.

## 3. Core World Principles

### 3.1 Learning by Discovery

The world should create opportunities to notice, test, compare, build, repair, and improve.

A system that only tells the player what to do is weaker than a system that lets the player understand why an action matters.

### 3.2 Environment Teaches Before UI

Terrain, paths, landmarks, affordances, staging, and visual contrast must communicate intent before HUD text is used.

UI may clarify. UI must not compensate for an unreadable world.

### 3.3 World Before Interface

Players should orient themselves through the world itself.

Landmarks, terrain silhouettes, paths, light, scale, and spatial relationships are the primary navigation language. Minimap markers and text prompts are supporting tools only.

### 3.4 Terrain Creates Purpose

Terrain must establish the reason an object or landmark exists.

A bridge exists because geography creates a crossing problem. A mine exists because the mountain mass supports extraction. A forest entrance exists because vegetation and terrain form a threshold.

Large structures must not appear as isolated decorative assets placed on flat ground.

### 3.5 Landmarks Are Navigation

Each major landmark must have a recognizable silhouette, spatial role, gameplay purpose, and visual relationship to adjacent landmarks.

The player should be able to remember the world as a sequence of places, not as a collection of disconnected props.

### 3.6 Everything Has Purpose

Visible elements should support at least one of these purposes:

- gameplay readability;
- navigation;
- environmental storytelling;
- terrain structure;
- visual hierarchy;
- atmosphere;
- progression;
- interaction feedback.

Decoration without purpose must not compete with primary terrain, paths, interaction areas, or landmarks.

### 3.7 Composition Before Decoration

World quality is evaluated in this order:

1. terrain mass;
2. silhouette;
3. path and traversal readability;
4. landmark hierarchy;
5. camera framing;
6. lighting and depth;
7. materials;
8. vegetation and secondary assets;
9. decorative detail.

No decorative pass may be used to hide a weak composition.

### 3.8 One Authoritative Owner Per Concern

Every visible world concern must have one declared runtime owner.

Competing renderers, stacked visual patches, duplicate terrain systems, and hidden presentation overrides are architectural defects.

## 4. Player Journey

The world is designed around an experience sequence rather than only a map layout:

1. Arrival — the player enters a readable and safe space.
2. Curiosity — the environment reveals an interesting problem or destination.
3. First Action — the player performs a simple meaningful interaction.
4. First Build — the player changes the world or completes a construction step.
5. First Success — the world visibly acknowledges progress.
6. Confidence — the player understands that exploration and reasoning produce results.
7. Expansion — additional paths, landmarks, and learning goals become meaningful.
8. Challenge — the player faces more complex construction and mathematical reasoning.
9. Mastery — the player can apply knowledge with reduced guidance.

Landmarks must support this journey and must not exist only to fill map space.

## 5. Art Direction

Builders Valley uses a friendly stylized world language suitable for young learners without appearing disposable or visually shallow.

The production target is:

- readable silhouettes;
- strong terrain layers;
- warm and inviting atmosphere;
- clear playable surfaces;
- controlled detail density;
- visual depth without photorealism;
- architecture integrated with geography;
- minimal reliance on text for orientation.

Reference images approved by the product owner are production targets and design evidence, not loose inspiration. Their composition, terrain logic, camera intent, material hierarchy, lighting, scale relationships, and readability must be extracted into explicit contracts before runtime implementation.

## 6. World Structure

Builders Valley is organized as a connected sequence of major landmarks:

1. Bridge Crossing
2. Forest Entrance
3. Mine Entrance
4. Home Village
5. Farm Terrace
6. Academy Terrace
7. Mathematics Temple
8. Final Peak

The exact world grid and traversal relationships are governed by Foundation and Landmark Contracts. This list defines the initial landmark authority set, not an immutable final content limit.

## 7. Production Authority

The authority order is:

1. Product Constitution
2. Foundation Standards
3. Landmark Contracts
4. Runtime Architecture and Mapping
5. Implementation
6. Verification Evidence

When runtime behavior or visuals conflict with an approved higher-level contract, the runtime is incorrect.

Runtime code must not independently define:

- world philosophy;
- landmark purpose;
- world layout;
- terrain intent;
- camera standard;
- composition target;
- visual hierarchy;
- acceptance criteria.

Runtime exists to implement approved contracts.

## 8. Non-Goals

Builders Valley is not intended to become:

- a collection of unrelated decorative scenes;
- a flat map populated by independent assets;
- a HUD-driven activity selector disguised as a world;
- a production process based on repeated visual patch stacking;
- a world whose meaning depends on long text explanations;
- a runtime-controlled design system without explicit blueprint authority.

## 9. Success Criteria

Builders Valley succeeds when:

- players can identify major destinations from world composition;
- terrain explains why traversal structures exist;
- gameplay areas are visually readable without excessive UI;
- landmarks are distinct yet belong to one world;
- the camera consistently communicates terrain, destination, and playable space;
- each visible concern has one runtime owner;
- implementation can be reviewed against explicit screenshot and landmark contracts;
- future contributors can determine why the world is designed a certain way without reverse-engineering runtime patches.

## 10. Change Control

Changes to this document affect the entire Builders Valley production system.

A proposed change must state:

- the principle being changed;
- the product reason;
- affected Foundation standards;
- affected Landmark Contracts;
- runtime migration impact;
- verification impact.

Local runtime convenience is not sufficient justification for changing the World Bible.
