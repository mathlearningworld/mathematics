# Builders Valley — Production Art Bible

**Status:** ACTIVE AUTHORITY  
**Version:** 1.0  
**Repository branch:** `main`  
**Applies to:** Builders Valley vertical slice and all later world regions derived from it

## 1. Purpose

This Art Bible defines the visual language that production assets must follow when replacing the current Phaser Graphics foundation.

The painted hero frame remains the visual aspiration. This document converts that aspiration into repeatable asset, material, scale, depth, and integration rules.

## 2. Core visual identity

Builders Valley should feel:

- warm, handcrafted, and inviting;
- readable at normal gameplay zoom;
- materially rich without visual noise;
- grounded in believable terrain and construction logic;
- suitable for both exploration and mathematics interactions;
- stylized rather than physically realistic.

The environment must support player intention before decoration.

## 3. Projection and scale

| Property | Authority |
|---|---:|
| Projection | Top-down 3/4 orthographic 2D |
| Reference viewport | 960 × 540 |
| World tile | 32 × 32 px |
| Preferred asset pixel density | authored for 32 px world grid |
| Gameplay zoom baseline | 0.90 |
| Pixel filtering | nearest-neighbour unless an approved effect requires otherwise |

Assets may extend beyond a tile, but their logical anchor and collision meaning must remain explicit.

## 4. Shape language

### Terrain

- Avoid perfect rectangles, circles, and repeated silhouettes in final assets.
- Use broad readable masses before small detail.
- Terrain transitions should use broken edges, recesses, projections, and material overlap.
- Repetition must be interrupted through authored variants.

### Architecture

- Construction should look assembled from understandable pieces.
- Structural posts, braces, foundations, and contact points must read clearly.
- Silhouettes should remain readable when internal detail is reduced.

### Vegetation

- Use clustered growth rather than uniform scatter.
- Large, medium, and small forms should appear together.
- Vegetation should frame gameplay space, not conceal required interactions.

## 5. Material families

### Grass and dirt

- Warm green base with subtle hue and value variation.
- Dirt paths use compacted warm earth, worn centers, and broken grass edges.
- Avoid single flat fills across large gameplay areas.

### Rock and cliff

- Cool grey-green base.
- Warm or pale highlights on upper planes.
- Dark contact shadows and cracks provide depth.
- Moss and grass caps appear selectively, not on every piece.

### Wood

- Warm brown family with dark structural edges.
- Planks require variation in value, grain direction, and end treatment.
- Frequently used surfaces may show controlled wear.

### Water

- Deep water: dark blue-green.
- Mid water: clearer saturated blue.
- Shallows: lighter cyan-green near banks.
- Foam and highlights: sparse, directional, and brightest near turbulence.
- Water must communicate downstream movement.

### Metal

- Used, maintained, and functional rather than pristine.
- Highlights should be narrow and controlled.

## 6. Base palette intent

The palette is relational rather than a fixed unrestricted list:

- terrain stays warmer and less saturated than water highlights;
- cliffs remain cooler than wood structures;
- interaction objects maintain stronger contrast than ambient props;
- the player must remain readable against every approved terrain material;
- the bridge and workshop use warm construction tones against cool river and cliff materials.

Any new palette entry must preserve these relationships.

## 7. Lighting and shadow

- Default time of day: late morning.
- Key light direction: upper-left.
- Ambient fill: cool sky contribution.
- Contact shadows: soft but clearly present beneath structures, rocks, trees, and props.
- Highlights should describe form, not outline every object.
- Lighting must not reduce interaction readability.

## 8. Layer model

```text
BACKGROUND
  waterfall backdrop / distant cliff

TERRAIN BASE
  grass / dirt / stone ground

TERRAIN EDGE
  cliff faces / shore transitions / retaining walls

WATER
  deep / mid / shallow / foam / reflection

STRUCTURE
  bridge / workshop / construction props

GAMEPLAY OBJECTS
  player / resource nodes / placed objects / interaction targets

AMBIENT
  vegetation / flowers / non-interactive props

FOREGROUND
  controlled framing and approved occlusion

EFFECTS
  particles / glow / water spray / feedback
```

Foreground assets must use deliberate occlusion zones. They must never rely on one unrestricted global depth.

## 9. Ground tileset requirements

Minimum production set:

- grass base variants;
- dirt base variants;
- grass-to-dirt edges and corners;
- worn path center and edge variants;
- stone terrace base;
- damp ground near water;
- small decal variants for wear, pebbles, and flowers.

Required rule: a large visible area must not expose obvious short-period tile repetition.

## 10. Cliff atlas requirements

Minimum production set:

- straight cliff face;
- upper grass cap;
- lower wet face;
- outer corners;
- inner corners;
- convex projection;
- concave recess;
- broken edge;
- rock shelf;
- gorge shoulder;
- bridge-foundation integration pieces.

Cliff assets must support asymmetric authored composition rather than forcing mirrored banks.

## 11. Water asset requirements

Minimum production set:

- animated deep-water base;
- animated mid-current bands;
- shallow edge animation;
- foam and turbulence loops;
- waterfall ribbons;
- waterfall impact spray;
- gorge pool ripples;
- bridge-shadow treatment;
- sparse reflection accents.

Animation must remain subtle enough that mathematics interactions and placement previews stay readable.

## 12. Bridge asset requirements

The production bridge must be modular:

- deck plank segments;
- structural beams;
- posts;
- rail and rope segments;
- foundation pieces;
- end caps;
- lantern attachment;
- contact shadows;
- damaged and reconstruction-state variants when required by gameplay.

Bridge visuals may not silently change crossing or placement authority.

## 13. Workshop asset requirements

The workshop cluster should communicate function through:

- stable building scale;
- workbench and tool silhouettes;
- storage and maintenance props;
- stone or compacted yard surface;
- retaining edge and terrain contact;
- path connection to the bridge;
- controlled clutter with open interaction space.

## 14. Vegetation grammar

Use three scales:

1. canopy or large framing form;
2. medium shrub or grass mass;
3. small flower, reed, or ground accent.

Rules:

- do not distribute every asset uniformly;
- preserve negative space around the player, bridge, and interaction targets;
- use vegetation to reinforce terrain planes and path edges;
- avoid repeated identical clusters within one gameplay frame.

## 15. Asset technical standard

Every production asset entry must declare:

- stable asset ID;
- asset family;
- file path;
- load type;
- frame dimensions when applicable;
- anchor or origin rule;
- intended depth family;
- fallback owner;
- collision impact (`NONE` unless separately approved);
- version.

Preferred formats:

- PNG for spritesheets and static transparent assets;
- Phaser-compatible JSON atlas for packed assets;
- Tiled JSON only when a tilemap becomes the explicit owner;
- no lossy compression for pixel-art source assets.

## 16. Review checklist

An asset pack cannot replace fallback graphics until:

- dimensions and filtering are correct;
- material and palette match this Bible;
- seams and tile repetition are reviewed;
- normal gameplay zoom remains readable;
- fallback can be restored independently;
- no collision or interaction meaning changes silently;
- local runtime screenshots are approved.

## 17. Production sequence

```text
C1 Ground + Water + Cliff
→ C2 Bridge
→ C3 Workshop
→ C4 Vegetation + Props
→ C5 Effects + Lighting
```

Each stage must integrate through `BuildersValleyAssetManifest.js` and preserve the PES-001B fallback until its replacement passes runtime review.
