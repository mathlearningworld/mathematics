# Bridge Crossing — Composition Contract

## Composition Goal

The player must read the landmark in this order:

1. destination;
2. blocked crossing;
3. bridge solution space;
4. available action or resource area;
5. continuation beyond the bridge.

The composition must communicate the problem before decorative detail competes for attention.

## Hero Frame

The approved Hero Frame must include:

- the player or player approach zone;
- the blocked edge;
- the crossing span;
- the destination landing;
- at least one environmental cue explaining why the destination matters.

The bridge may be incomplete, damaged, absent, or inactive in the pre-solution Hero Frame, but the intended span must remain understandable.

## Depth Structure

### Foreground

The foreground may frame the approach, establish safety, and provide scale. It must not obscure the blocked edge or destination.

### Midground

The midground contains the crossing problem and is the primary visual read. The bridge span, anchor points, and terrain cut belong here.

### Background

The background supports destination value, world continuity, and curiosity. It must not become more visually dominant than the crossing problem.

## Leading Lines

Routes, terrain edges, bridge rails, light direction, and material transitions should lead attention toward the crossing and destination.

Leading lines must not direct the player toward inaccessible decoration or false routes.

## Visual Hierarchy

The intended hierarchy is:

```text
Destination Landmark
Crossing Problem
Player Route
Interaction or Resource Cues
Supporting Environment
Decoration
```

Gameplay accents must be limited and must comply with the global Color contract.

## Silhouette Rules

- The terrain cut must remain legible against the destination side.
- Bridge geometry must have a distinct silhouette from surrounding terrain.
- Supports, rails, ropes, beams, or equivalent structures must not collapse into visual noise.
- The completed bridge must read as a continuous traversable object from the approved gameplay camera.

## Camera Relationship

Bridge Crossing may define approved landmark framing and request camera constraints, but it does not own the global Camera Authority.

Any landmark-specific camera behavior must:

- preserve player orientation;
- avoid hiding the destination during approach;
- avoid extreme zoom changes used to compensate for weak terrain composition;
- return cleanly to the standard gameplay camera state.

## Before and After Read

The composition must support a clear state contrast:

### Before Completion

- route ends at the obstacle;
- crossing is unavailable;
- destination remains desirable;
- solution area is discoverable.

### After Completion

- bridge becomes the dominant connection;
- route continuity is obvious;
- destination landing remains visible;
- completion effects do not obscure traversal.

## Composition Acceptance

Composition passes when:

- a reviewer can identify the destination and obstacle within the first visual read;
- the route does not depend on UI arrows for basic comprehension;
- foreground, midground, and background remain distinct;
- the bridge has clear visual priority after completion;
- decorative elements do not compete with mission-critical information;
- grayscale review preserves the main hierarchy.
