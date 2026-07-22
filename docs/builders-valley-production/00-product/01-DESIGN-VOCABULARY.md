# Builders Valley Design Vocabulary

Status: APPROVED FOUNDATION V1
Authority: Product Constitution
Scope: Shared language for product, world design, runtime, implementation, and review

## 1. Purpose

This document defines the domain language used to design, implement, and review Builders Valley.

Terms in this document are operational definitions. They must be used consistently by the product owner, architects, implementers, reviewers, and AI executors.

When a term is used differently in runtime code or discussion, this document has authority unless a more specific approved contract explicitly narrows the meaning.

## 2. Core Terms

### World

The connected playable environment of Builders Valley, including geography, traversal, landmarks, atmosphere, interaction spaces, and their relationships.

A World is not merely a scene container or background image.

### Landmark

A major place that combines navigation, gameplay purpose, environmental storytelling, and recognizable composition.

Examples:

- Bridge Crossing
- Forest Entrance
- Mine Entrance
- Home Village

Counter-examples:

- one tree;
- one rock prop;
- an isolated decorative sign;
- a UI marker with no meaningful place beneath it.

### Terrain Mass

A large geological or landform volume that defines the world silhouette, playable elevation, boundary, or traversal problem.

Examples:

- canyon wall;
- mountain shoulder;
- river bank;
- raised terrace;
- valley floor;
- cliff shelf.

Counter-examples:

- decorative pebble;
- tree;
- building;
- fence;
- loose prop used to imitate a missing landform.

### Terrain Layer

A coherent geological or ground stratum used to communicate height, depth, erosion, playable surface, or material transition.

A Terrain Layer must belong to the terrain system and must not be simulated by unrelated stacked props.

### Traversal Surface

A surface the player can intentionally move across.

Examples include paths, bridge decks, terraces, ramps, and readable open ground.

A visually flat surface is not automatically a Traversal Surface; it must be intentionally included in gameplay and collision authority.

### Traversal Problem

A geographic or structural condition that creates a meaningful need for movement, construction, repair, or reasoning.

Examples:

- a canyon requiring a bridge;
- a blocked forest threshold;
- an elevation requiring stairs or a ramp;
- a river requiring a crossing decision.

### Composition

The intentional arrangement of terrain, paths, landmarks, negative space, light, depth, and visual mass within a camera view.

Composition is not equivalent to placing assets.

### Visual Hierarchy

The ordered importance of visible elements as perceived by the player.

A strong hierarchy lets the player quickly identify:

1. where they are;
2. where they can go;
3. what matters;
4. what can be interacted with.

### Silhouette

The readable outer shape of a terrain mass, structure, or landmark when detail is ignored.

Silhouette quality is evaluated before material detail.

### Negative Space

Intentional open visual or playable space that separates major forms and preserves readability.

Negative Space is not unfinished space. It is a compositional resource.

### Environmental Storytelling

World information communicated through geography, structures, materials, wear, arrangement, light, or evidence of prior activity.

Counter-example:

A decorative object with no relationship to place, gameplay, or story.

### World Readability

The degree to which the player can understand location, direction, destination, traversable space, and interaction opportunity from the world itself.

World Readability must not depend primarily on text labels or HUD arrows.

### Landmark Readability

The degree to which a landmark has a distinct identity, recognizable silhouette, clear approach, and understandable gameplay purpose.

### Gameplay Readability

The degree to which the player can recognize usable tools, interactable objects, valid placement areas, hazards, and progress states.

### Hero Frame

A fixed or reproducible reference view used to judge the production quality of a world area.

A Hero Frame must define:

- camera position and orientation;
- framing intent;
- visible landmarks;
- terrain hierarchy;
- lighting condition;
- expected gameplay readability.

A Hero Frame is evidence and an acceptance target, not a decorative concept image only.

### Production Reference

An approved visual reference whose relevant properties must be translated into explicit production contracts.

Relevant properties can include:

- camera;
- terrain logic;
- scale;
- composition;
- lighting;
- materials;
- silhouette;
- gameplay readability.

### Asset

A reusable visual or interactive unit such as a model, texture, animation, sound, or prefab.

An Asset does not own world composition merely because it is visible.

### Asset Contract

A specification describing the purpose, scale, orientation, material role, interaction role, variants, and placement rules of an asset within a landmark.

### Prop

A secondary object used to support gameplay, storytelling, scale, or atmosphere.

A Prop must not be used to replace missing Terrain Mass or primary landmark architecture.

### Material Language

The controlled system of surface families, value ranges, texture density, and semantic meaning used across the world.

### Color Language

The controlled use of hue, saturation, value, and contrast to communicate hierarchy, state, destination, safety, danger, or interactivity.

### Lighting Language

The controlled use of key light, fill, ambient light, shadow, atmospheric depth, and local emphasis to support readability and mood.

### Camera Standard

The global rules governing projection, angle, distance, height, framing, follow behavior, and gameplay visibility.

### World Grid

The authoritative spatial framework used to locate terrain regions, landmarks, traversal routes, boundaries, and runtime chunks.

The World Grid is a design authority, not necessarily a visible grid or a specific engine implementation.

### Runtime Owner

The single declared system responsible for producing or controlling one runtime concern.

Examples:

- terrain owner;
- camera owner;
- vegetation owner;
- landmark structure owner;
- lighting owner.

### Ownership Boundary

The explicit limit of what a Runtime Owner may create, mutate, hide, replace, or evaluate.

### World Authority

The top-level runtime coordinator that enforces ownership, ordering, lifecycle, and approved world contracts.

World Authority does not automatically draw every element. It establishes who may do so.

### Renderer

A runtime component that produces a visible concern within an approved ownership boundary.

A Renderer must not silently redefine product or landmark intent.

### Visual Patch

A limited, temporary modification applied to an existing presentation system.

Visual Patches are acceptable only when:

- ownership remains clear;
- the patch has a removal or consolidation plan;
- it does not compete with an authoritative renderer;
- it does not become the Source of Truth.

Stacking independent Visual Patches to approximate composition is prohibited.

### Runtime Mapping

The explicit mapping from approved design concerns to runtime owners, files, modules, lifecycle points, and verification evidence.

### Source of Truth

The highest approved authority for a decision.

For Builders Valley design intent, the Production Bible is the Source of Truth. Runtime code is implementation evidence, not design authority.

### Implementation Gate

The readiness decision that determines whether an approved design is sufficiently complete to begin runtime implementation.

### Definition of Ready

The minimum approved evidence required before implementation may start.

### Definition of Done

The minimum implementation and verification evidence required before a mission can be accepted as complete.

### Screenshot Acceptance

A formal review of a reproducible runtime image against approved composition, terrain, camera, lighting, landmark, and gameplay criteria.

### Runtime Verification

Evidence that the implementation executes correctly in the target environment without breaking required behavior.

### Operational Verification

Evidence that the complete player-facing flow works through the real runtime, including interaction, camera, world state, and visible feedback.

### Legacy Presentation

Any older visual system that remains active while a new authoritative system is introduced.

Legacy Presentation must be inventoried and either retired, migrated, or explicitly retained under a declared boundary.

### Visual Overdraw

Multiple systems drawing competing or redundant world elements in the same concern or location.

Examples include duplicated terrain, overlapping paths, stacked cliffs, and multiple landmark renderers.

### Organic Terrain

Terrain whose silhouette, transitions, erosion logic, and material layering read as a coherent landform rather than as repeated geometric blocks.

Organic does not mean random. It means intentionally irregular within a controlled terrain language.

### Visual Mass

The perceived weight and area of a major form in the composition.

Terrain, architecture, and vegetation groups can create Visual Mass. Small decorative assets generally cannot replace it.

## 3. Language Rules

Use terms that describe purpose and ownership.

Prefer:

- Forest Boundary
- Terrain Mass
- Traversal Route
- Landmark Structure
- Environmental Storytelling Cluster
- Runtime Owner

Avoid vague implementation-first terms such as:

- stuff;
- decoration layer;
- random rocks;
- visual fix;
- make it prettier;
- patch until it looks right.

## 4. Naming Rule

Mission and document names should identify the design concern, not only the asset being added.

Prefer:

- Terrain Authority
- Organic Canyon Calibration
- Bridge Crossing Composition
- Landmark Readability Pass

Avoid:

- Add More Rocks
- Add Trees V3
- Hero Patch 7
- Make River Better

## 5. Change Control

A new term should be added when:

- an important concept is repeatedly interpreted differently;
- a new production authority is introduced;
- a runtime boundary needs a shared name;
- review criteria require a precise distinction.

A term must include:

- definition;
- purpose;
- examples when useful;
- counter-examples when ambiguity is likely.
