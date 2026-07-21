# PES-001C1 — Ground, Water, and Cliff Asset Pack

**Status:** CONTRACT READY — SOURCE ASSETS REQUIRED  
**Authority:** PES-001C / Builders Valley Art Bible / PES-001B Foundation  
**Repository branch:** `main`

## 1. Purpose

PES-001C1 is the first production-asset replacement package. It replaces the highest-impact Phaser Graphics surfaces with authored pixel-art assets while preserving the approved terrain composition and gameplay geometry.

This package owns only:

- ground material assets;
- river and waterfall assets;
- cliff and shoreline assets;
- their preload, composition, fallback, and runtime evidence.

## 2. Replacement target

Current fallback owners remain active until replacement approval:

| Surface | Current fallback owner | Production replacement |
|---|---|---|
| Grass / dirt / path | `drawPixelWorld` and terrain composers | ground tileset / atlas |
| Deep / mid / shallow water | `WaterRenderer.js` | animated water sheet / atlas |
| Foam / waterfall impact | `WaterRenderer.js` and hero slice | effect atlas |
| Cliff faces / shelves | `ShorelineGenerator.js`, `TerrainMassGenerator.js`, composers | cliff atlas |
| Gorge shoulder | `GorgeComposer.js` | authored gorge pieces |

Fallback removal is prohibited before local runtime approval.

## 3. Asset IDs

Required manifest identities:

```text
BV_GROUND_TERRAIN_ATLAS_01
BV_WATER_RIVER_SHEET_01
BV_CLIFF_ATLAS_01
BV_EFFECT_WATER_ATLAS_01
```

Asset IDs are stable. File names may evolve only through a manifest version update.

## 4. Delivery paths

```text
frontend/public/assets/builders-valley/
├── ground/
│   ├── builders-valley-ground-atlas.png
│   └── builders-valley-ground-atlas.json
├── water/
│   ├── builders-valley-river-sheet.png
│   └── builders-valley-river-sheet.json
├── cliff/
│   ├── builders-valley-cliff-atlas.png
│   └── builders-valley-cliff-atlas.json
└── effects/
    ├── builders-valley-water-effects.png
    └── builders-valley-water-effects.json
```

Names above are the target convention. The manifest remains disabled until exact files exist.

## 5. Ground frame contract

Minimum frames:

```text
grass_01
grass_02
grass_03
dirt_01
dirt_02
path_center_01
path_edge_n
path_edge_s
path_edge_e
path_edge_w
path_outer_corner_*
path_inner_corner_*
stone_terrace_01
damp_ground_01
wear_decal_01
pebble_decal_01
flower_decal_01
```

Ground frames should align to the 32 px grid unless explicitly declared as decals.

## 6. Water frame contract

Required animation groups:

```text
river_deep_01..N
river_mid_01..N
river_shallow_left_01..N
river_shallow_right_01..N
river_current_01..N
waterfall_ribbon_01..N
gorge_pool_01..N
foam_impact_01..N
reflection_01..N
bridge_shadow_01
```

Animation rates must be documented in the atlas metadata or integration module.

## 7. Cliff frame contract

Required frames:

```text
cliff_face_01..N
cliff_cap_grass_01..N
cliff_wet_face_01..N
cliff_outer_corner_*
cliff_inner_corner_*
cliff_projection_01..N
cliff_recess_01..N
cliff_broken_edge_01..N
rock_shelf_01..N
gorge_shoulder_left
gorge_shoulder_right
bridge_foundation_left
bridge_foundation_right
```

Left and right banks must be independently composable. Mirroring is not the default production strategy.

## 8. Integration architecture

Preferred implementation modules:

```text
frontend/src/sandbox/scenes/assets/
├── BuildersValleyGroundAssetLayer.js
├── BuildersValleyWaterAssetLayer.js
├── BuildersValleyCliffAssetLayer.js
└── BuildersValleyAssetFallbackController.js
```

These modules own rendering only. They must not own:

- collision;
- player movement;
- pickup logic;
- placement authority;
- resource coordinates;
- bridge crossing rules.

## 9. Fallback policy

Each family must support three states:

```text
DISABLED
ASSET_ACTIVE
FALLBACK_ACTIVE
```

On missing texture, invalid frame, or load failure:

1. record failure in `getProductionAssetPipeline()`;
2. keep the PES-001B fallback visible;
3. do not partially hide a family unless the replacement layer is complete;
4. do not fail game boot.

## 10. Runtime inspection

Expected C1 evidence fields:

```text
c1Status
activeFamilies
groundMode
waterMode
cliffMode
loadedAssetIds
failedAssetIds
fallbackOwners
frameValidation
pixelFiltering
collisionAuthority
gameplayGeometryChanged
```

## 11. Acceptance gates

### Repository gate

- Art Bible and C1 contract agree;
- manifest entries are explicit;
- asset folders and naming conventions are stable;
- replacement modules are family-owned;
- fallback behavior is deterministic;
- gameplay authority files remain untouched.

### Asset gate

- all required frames exist;
- atlas JSON resolves every declared frame;
- transparent edges are clean;
- no unintended filtering or scaling blur;
- palette and material treatment match the Art Bible.

### Runtime gate

- no texture or frame errors;
- no seams at normal gameplay zoom;
- animated water loops cleanly;
- cliff corners and bank transitions read correctly;
- bridge, player, resources, and placement previews remain readable;
- missing assets restore fallback without boot failure.

### Creative gate

Required screenshots:

- waterfall and gorge;
- river above bridge;
- bridge crossing;
- workshop terrace edge;
- wide frame comparing fallback and production assets.

## 12. Completion rule

PES-001C1 is complete only when:

```text
Repository PASS
+ Asset PASS
+ Runtime PASS
+ Gameplay Preservation PASS
+ Creative Approval
```

Creating an empty atlas contract or enabling missing files does not count as implementation progress.
