# PCP-001 — Builders Valley Composition Authority

**Status:** ACTIVE  
**Applies to:** VSC-001 / Bridge Crossing  
**Current executable package:** PES-001A

## 1. Production intent

The Bridge Crossing frame is designed as an authored gameplay composition, not a catalog of assets. Every terrain mass, landmark, prop cluster, light source, and vegetation group must perform at least one of these jobs:

- direct the player;
- frame the hero landmark;
- explain world function;
- create readable depth;
- preserve gameplay space;
- establish mood and memory.

Anything that performs none of these jobs is optional and must not be added before the composition passes.

## 2. Camera authority

PES-001A must lock the gameplay camera before detailed environment production.

The approved camera must define and record:

- projection type;
- viewport reference resolution and aspect behavior;
- gameplay zoom;
- visible world bounds in the hero frame;
- player anchor range rather than one decorative fixed point;
- interaction-safe central area;
- foreground occlusion budget;
- top-edge background budget;
- camera movement and clamping behavior.

The camera is accepted only when the same setup supports normal play, interaction targeting, object carrying, placement preview, and the hero composition.

## 3. Frame structure

### Background

- waterfall source;
- upper cliffs and forest canopy;
- low-detail silhouettes and atmospheric separation.

### Midground

- river approach;
- workshop cluster;
- bridge anchoring terrain;
- major trees and cliff faces.

### Gameplay plane

- player movement space;
- gatherable objects;
- bridge reconstruction interaction;
- placement and approach zones;
- paths connecting workshop and crossing.

### Foreground

- limited framing foliage, bank edges, rocks, and shadow masses;
- never allowed to obscure interaction intent or placement previews.

## 4. Focal hierarchy

### Primary focal point — Bridge crossing

The bridge communicates the current purpose of the area. Its silhouette, value contrast, placement, approach path, and surrounding negative space must make it readable before decorative details are noticed.

### Secondary focal system — River and waterfall

The water system creates a continuous leading line from the upper environment to the crossing. It provides motion, cool color contrast, and spatial explanation for the bridge.

### Tertiary focal point — Workshop

The workshop represents habitation, tools, preparation, and rebuilding. It should be visible enough to establish purpose but must not overpower the bridge.

### Player

The player remains readable through silhouette, local value separation, and protected movement space. The player must not rely on an artificial glow or oversized scale to remain visible.

## 5. Spatial rhythm

The frame should alternate between density and rest:

```text
Dense forest framing
→ open waterfall reveal
→ active river corridor
→ hero bridge crossing
→ readable work yard
→ dense forest continuation
```

Open gameplay areas must not be filled merely because they appear visually empty. Negative space is required for navigation, interaction, placement preview, and visual rest.

## 6. Environment grammar

### Terrain

- terrain forms large readable masses before surface detail;
- grass-to-dirt, dirt-to-stone, and land-to-water transitions require authored edge logic;
- repeated rectangular patches are not acceptable in the hero frame;
- paths connect meaningful destinations and widen at activity zones.

### River

- river width and banks explain why a bridge is needed;
- water value is deeper toward the channel and lighter near edges or disturbance;
- foam, reflection, and motion support flow direction rather than create uniform noise;
- shoreline details cluster around bends, obstructions, and bank transitions.

### Cliffs and rocks

- cliffs use top, face, base, corner, break, and moss variation;
- silhouettes avoid a repeated staircase pattern;
- rocks appear in geological groups and transition into terrain rather than sit as isolated decorations.

### Vegetation

- trees form framing clusters and ecological groups;
- bushes mediate between trees and open ground;
- flowers and grass accents follow light, path edges, moisture, or disturbance;
- vegetation density must reveal the player journey rather than conceal it.

### Built structures

- bridge and workshop use one coherent scale and material family;
- contact points with terrain require foundations, wear, shadow, debris, or path response;
- props cluster by activity: storage, construction, maintenance, travel, or habitation.

## 7. Value and color authority

The frame uses warm natural land and wood against cooler water and ambient fill.

Value hierarchy:

1. bridge interaction and key path decisions;
2. player and active gameplay objects;
3. river motion and workshop landmarks;
4. supporting terrain and vegetation;
5. background forest and cliffs.

Accent color is limited. Bright warm light, magical color, and high saturation are reserved for gameplay meaning, reward, navigation, or special world state.

## 8. Lighting intent

- one coherent warm key direction;
- cooler ambient fill in forest, cliff, and water recesses;
- contact shadows connect objects to terrain;
- cast shadows help describe mass and guide the eye;
- waterfall and water may provide controlled reflected light;
- atmosphere separates depth layers without washing out gameplay contrast.

Lighting polish begins only after the value composition works in a simplified frame.

## 9. PES-001A — Current execution contract

### Mission

Lock a playable production composition target using the current in-engine scene as the starting point.

### Required work

1. Audit the current camera, world bounds, scene layers, bridge, river, waterfall, workshop, cliffs, vegetation, player scale, and interaction zones.
2. Record the current implementation paths that own each element.
3. Produce a composition blockout using simple masses or existing assets without detailed polish.
4. Lock the camera and primary landmark positions.
5. Preserve all interaction-critical spaces and verify that the core loop remains operable.
6. Capture an in-engine target screenshot for approval.
7. Document remaining deviations between the approved target and production asset needs.

### Do not do in PES-001A

- do not create a large final asset library;
- do not add unrelated gameplay systems;
- do not use post-processing to simulate completion;
- do not polish individual props before the full frame reads;
- do not expand beyond the Bridge Crossing starting area.

### Approval evidence

PES-001A requires:

- exact changed paths;
- camera settings and world-frame measurements;
- before and after screenshots from the same reference viewport;
- interaction-space review;
- known gaps for PES-001B through PES-001E;
- local runtime result clearly separated from repository review.

## 10. Creative Director review questions

PES-001A passes only when all answers are yes:

1. With UI hidden, is the bridge crossing clearly the current purpose?
2. Does the river lead the eye naturally from waterfall to bridge?
3. Does the workshop explain rebuilding without competing with the bridge?
4. Is the player readable at normal gameplay scale?
5. Is there enough negative space for movement, pickup, carry, and placement?
6. At 50% image scale, do the major masses and journey remain readable?
7. With effects disabled, does the composition still work?
8. Can the frame be produced through modular terrain and landmark kits rather than one-off decoration?
