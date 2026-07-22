# Builders Valley Composition Standard

Status: Active Foundation Standard  
Authority: Builders Valley Production Bible

## 1. Purpose

Composition organizes terrain, routes, landmarks, player scale, structures, lighting, and environmental storytelling into one readable experience.

Composition is not asset placement. It is the intentional hierarchy that tells the player where they are, where they can go, what matters now, and what may matter later.

## 2. Composition doctrine

Composition before decoration.

The required order is:

1. Geographic purpose.
2. Terrain silhouette.
3. Primary route.
4. Landmark anchor.
5. Player and interaction readability.
6. Depth layers.
7. Structure grouping.
8. Lighting hierarchy.
9. Environmental storytelling.
10. Decorative detail.

A scene may not advance to decoration while higher-order composition remains unresolved.

## 3. Visual hierarchy

Every landmark must declare one primary visual subject and no more than two supporting subjects in its hero frame.

### Primary subject

The dominant geographic or gameplay idea that defines the landmark.

### Supporting subjects

Elements that explain, frame, or reinforce the primary subject.

### Background promise

A distant element that suggests progression without competing with the current landmark.

When every object has equal contrast, scale, or detail, the composition fails.

## 4. Depth structure

The hero frame must contain intentional depth layers:

- Foreground frames the scene and establishes proximity.
- Midground contains primary gameplay and landmark identity.
- Background establishes world scale, direction, and future destination.

Depth must be created through overlap, elevation, value grouping, scale, atmosphere, and route direction—not by scattering props at different coordinates.

## 5. Terrain-led composition

The primary terrain mass and terrain cut establish the large shapes of the composition.

Structures must:

- sit on believable anchor surfaces;
- respond to path and elevation;
- reinforce route direction;
- preserve the primary terrain silhouette;
- avoid creating unrelated visual centers.

For Bridge Crossing, the canyon and crossing route must remain legible before the bridge, workshop, vegetation, or props are judged.

## 6. Route readability

The player should infer the principal route through:

- terrain opening;
- path continuity;
- bridge or entrance alignment;
- contrast and material rhythm;
- landmark orientation;
- controlled framing.

The route must not depend on arrows, minimaps, or text during ordinary traversal.

Secondary routes may be less prominent, but they must not visually contradict the primary route.

## 7. Landmark silhouette

A landmark requires a memorable silhouette at gameplay scale.

The silhouette must:

- be distinguishable from surrounding terrain;
- remain readable under supported aspect ratios;
- preserve recognizable negative space;
- avoid merging with background masses;
- communicate function where possible.

Landmark recognition should survive the removal of small props and surface detail.

## 8. Visual mass and negative space

Large masses create stability and identity. Negative space creates separation, route clarity, and breathing room.

Required balance:

- do not fill every open area with decoration;
- preserve clear space around active interactions;
- use clustered environmental elements rather than uniform scatter;
- maintain gaps that separate primary and supporting subjects;
- avoid dense borders that flatten the scene into one wall of detail.

## 9. Player scale and presence

The player is both a gameplay unit and a scale reference.

The composition must preserve:

- visible body silhouette;
- contrast from the active ground;
- readable facing or action state where required;
- sufficient space around interaction targets;
- believable scale relative to bridge, workshop, trees, and cliffs.

The world must feel larger than the player without making the player insignificant.

## 10. Environmental storytelling

Environmental storytelling may reinforce:

- prior activity;
- construction purpose;
- local resources;
- progression state;
- safety or danger;
- connection to another landmark.

It must not create a new visual subject that competes with the landmark mission.

Every storytelling cluster needs a reason, owner, and relationship to the player route.

## 11. Lighting and color relationship

Lighting and color support hierarchy established by terrain and layout.

They may:

- separate depth layers;
- guide attention;
- clarify traversable surfaces;
- distinguish safe and active areas;
- reinforce atmosphere.

They must not be used to compensate for an unreadable route, weak silhouette, or conflicting masses.

## 12. UI-safe composition

Each hero frame and gameplay framing state must declare critical world areas and safe UI regions.

UI may overlap peripheral decoration. It must not cover:

- player;
- active interaction;
- primary route decision;
- landmark entrance;
- required learning feedback;
- dominant terrain event.

## 13. Composition review sequence

Review screenshots in this order:

1. Blur or thumbnail test: do major masses and hierarchy remain readable?
2. Silhouette test: do terrain and landmark shapes remain distinct?
3. Route test: can the primary route be inferred without UI?
4. Depth test: are foreground, midground, and background separated?
5. Player test: is the player readable and correctly scaled?
6. Ownership test: are duplicate terrain or structure systems visible?
7. Detail test: does secondary detail reinforce rather than compete?

A failure in an earlier test blocks approval of later detail.

## 14. Acceptance criteria

Composition passes when:

- the landmark has one clear primary subject;
- geographic purpose is visible;
- the principal route is inferable without UI;
- terrain, structure, and player form one coherent scene;
- depth layers are intentional;
- landmark silhouette remains memorable at gameplay scale;
- negative space protects interactions and hierarchy;
- desktop and mobile framing preserve the same meaning;
- decoration does not conceal structural problems;
- runtime ownership conflicts are not visually present.

## 15. Failure conditions

Composition fails when:

- the scene reads as a collection of individually attractive assets;
- the workshop, bridge, canyon, paths, and vegetation compete equally;
- added props are used to create interest before terrain is resolved;
- the route becomes ambiguous;
- foreground elements repeatedly hide gameplay;
- old and new render systems produce duplicate visual masses;
- the screenshot looks acceptable only at one accidental camera position.