# PES-001A — Camera and Composition Audit

**Status:** IMPLEMENTATION STARTED  
**Authority:** PCP-001 / VSC-001  
**Reference viewport:** 960 × 540  
**World:** 1536 × 1024 (48 × 32 tiles at 32 px)

## 1. Repository ownership map

| Concern | Current owner |
|---|---|
| World dimensions, viewport, stream corridor | `frontend/src/sandbox/config/worldContract.js` |
| Base camera bounds, follow, zoom | `frontend/src/sandbox/scenes/BuildersValleyScene.js` |
| Base terrain and pixel world | `frontend/src/sandbox/art/pixelArtFactory.js` |
| River production overlay | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Waterfall and gorge | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Cliff banks | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Hero bridge | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Workshop cluster | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Framing vegetation | `frontend/src/sandbox/scenes/BuildersValleyHeroSlicePatch.js` |
| Player, resource nodes, collision and interaction | `frontend/src/sandbox/scenes/BuildersValleyScene.js` plus interaction patches |
| PES-001A camera and blockout authority | `frontend/src/sandbox/scenes/BuildersValleyCompositionPatch.js` |

## 2. Baseline findings

The runtime uses an orthographic Phaser camera following the player with smoothing `0.12 / 0.12` and zoom `1.0`. The player begins at `(192, 256)`. At the left and upper world clamp, the initial visible frame is approximately `x 0–960`, `y 0–540`.

The existing hero overlay placed the bridge at `y 640` and workshop at approximately `(1014, 512)`. Consequently:

- the bridge was below the initial reference frame;
- the workshop was mostly outside the right edge;
- the waterfall was visible without the bridge that explains the river crossing;
- the primary, secondary and tertiary focal points could not read together in one normal gameplay frame;
- the player and resource runtime remained operational, but the scene did not yet satisfy the authored-composition requirement.

## 3. PES-001A target measurements

The first blockout target uses the existing world and gameplay geometry. Only presentation containers and camera framing are adjusted.

| Setting | Target |
|---|---:|
| Projection | Orthographic 2D |
| Reference viewport | 960 × 540 |
| Gameplay zoom | `0.90` |
| Camera smoothing | `0.12 / 0.12` (preserved) |
| Deadzone | 288 × 184 px |
| Bridge visual anchor | `(768, 448)` |
| Workshop visual anchor | `(994, 320)` |
| Waterfall visual anchor | `(768, 18)` |
| Initial visible world at clamped origin | about 1067 × 600 world px |

This target places:

- waterfall in the upper background;
- the river as a continuous vertical leading line;
- bridge near the lower-right rule-of-thirds region;
- workshop on the right edge as a tertiary destination;
- player and gathering space in the left gameplay plane;
- enough negative space between player, river and workshop for normal interaction.

## 4. Interaction-space protection

PES-001A does not change:

- player spawn or body size;
- world bounds;
- stream collision or grid contract;
- resource-node coordinates;
- pickup range;
- carry intent;
- placement authority;
- placed-object coordinates;
- hotbar behavior.

The bridge and workshop changes are visual-container offsets only. Camera zoom and deadzone must still be validated locally for pointer targeting, placement preview alignment and mobile readability.

## 5. Layer audit

Current hero layers are intentionally simple blockout layers:

1. river base (`-17`);
2. cliffs and waterfall (`-8`);
3. terrain support (`-4`, reserved);
4. hero architecture (`48`);
5. ambient framing (`52`);
6. gameplay objects and player (dynamic depth above `100`).

This is sufficient for composition blockout, but it is not the final production sorting model. Foreground foliage must later use controlled occlusion zones rather than a single global ambient depth.

## 6. Known gaps routed forward

### PES-001B — Terrain and river foundation

- authored shoreline transitions;
- river bends and obstruction response;
- non-repeating bank silhouettes;
- terrain paths connecting workshop and crossing.

### PES-001C — Bridge production asset

- modular deck, post, rope, foundation and end-cap kit;
- actual bridge interaction state and reconstruction readability;
- contact shadows and bank integration.

### PES-001D — Workshop production cluster

- coherent building scale;
- storage, construction and maintenance prop groups;
- path wear and terrain response;
- readable function without excessive detail.

### PES-001E — Vegetation, lighting and atmosphere

- ecological vegetation clusters;
- foreground occlusion budget;
- key/fill lighting separation;
- depth atmosphere without screen wash.

## 7. Evidence status

| Evidence | Status |
|---|---|
| Exact implementation paths | PASS |
| Camera/world measurements | PASS |
| Repository blockout implementation | STARTED |
| Before/after screenshots | PENDING LOCAL RUNTIME |
| Interaction review | PENDING LOCAL RUNTIME |
| Creative Director frame approval | PENDING |

Repository changes alone do not complete PES-001A. Runtime and operational approval remain separate gates.