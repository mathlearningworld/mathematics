# PES-001C1 — Ground, Water, and Cliff Asset Delivery Checklist

Use this checklist before enabling any C1 manifest record.

## Delivery order

1. `ground/terrain-atlas.png` + `ground/terrain-atlas.json`
2. `water/river-sheet.png`
3. `cliff/cliff-atlas.png` + `cliff/cliff-atlas.json`
4. `effects/water-effects-atlas.png` + `effects/water-effects-atlas.json`

Do not enable multiple families in one activation commit. Each family must preserve the approved PES-001B fallback until its own local runtime evidence is accepted.

## Ground atlas minimum frames

- `grass_base_01`
- `grass_base_02`
- `grass_edge_n`
- `grass_edge_s`
- `grass_edge_e`
- `grass_edge_w`
- `dirt_base_01`
- `dirt_path_straight`
- `dirt_path_corner`
- `dirt_path_worn`
- `stone_terrace_base`
- `stone_terrace_edge`

## Water sheet minimum sequence

The sheet uses 32 × 32 frames.

- deep-water idle: 4 frames
- mid-current: 4 frames
- shallow edge: 4 frames
- foam: 4 frames
- waterfall: 6 frames

Frame order must be recorded in the C1 activation evidence before enabling the sheet.

## Cliff atlas minimum frames

- `cliff_face_01`
- `cliff_face_02`
- `cliff_cap_grass_01`
- `cliff_inner_corner`
- `cliff_outer_corner`
- `cliff_recess`
- `cliff_projection`
- `rock_shelf_01`
- `rock_shelf_02`
- `gorge_shoulder_left`
- `gorge_shoulder_right`
- `bridge_foundation_left`
- `bridge_foundation_right`

## Water-effects atlas minimum frames

- `foam_cluster_01`
- `foam_cluster_02`
- `ripple_01`
- `ripple_02`
- `waterfall_spray_01`
- `waterfall_spray_02`
- `reflection_glint_01`
- `reflection_glint_02`

## Technical checks

- PNG transparency has no matte fringe.
- Pixel edges remain sharp at integer scale.
- Atlas JSON parses successfully.
- Frame names are stable and unique.
- Frame rectangles stay inside texture bounds.
- No enabled manifest record points to a missing file.
- `npm run verify:builders-valley-assets` passes.
- `npm run build` passes locally.

## Runtime checks per family

- no console errors;
- fallback remains available;
- pointer and placement alignment are unchanged;
- bridge crossing and resource access remain unchanged;
- frame rate remains acceptable at 960 × 540;
- before/after screenshots are captured;
- `gameplayGeometryChanged` remains `false`.

## Activation commit rule

A family may be enabled only in a dedicated commit after its binary files, metadata, verifier result, runtime screenshots, and fallback behavior have been reviewed.
