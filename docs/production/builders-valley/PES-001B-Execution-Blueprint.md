# PES-001B — Execution Blueprint

**Status:** IMPLEMENTATION AUTHORIZED  
**Parent contract:** `PES-001B-Terrain-River-Foundation.md`  
**Repository branch:** `main`

## 1. Mission

Replace the mechanically repeated river and cliff-bank presentation with an authored terrain-and-river foundation while preserving all gameplay geometry and interaction contracts.

## 2. Execution slices

```text
B1 River Geometry
B2 Shoreline Grammar
B3 Terrain Massing
B4 Terrain Paths
B5 Water Rendering
B6 Runtime Inspector
B7 Repository Verification
```

## 3. Ownership layout

```text
frontend/src/sandbox/scenes/BuildersValleyTerrainRiverPatch.js
frontend/src/sandbox/scenes/terrain/RiverGeometry.js
frontend/src/sandbox/scenes/terrain/ShorelineGenerator.js
frontend/src/sandbox/scenes/terrain/TerrainMassGenerator.js
frontend/src/sandbox/scenes/terrain/TerrainPathGenerator.js
frontend/src/sandbox/scenes/terrain/WaterRenderer.js
```

`BuildersValleyTerrainRiverPatch.js` owns orchestration and inspection metadata. Internal modules own rendering only and must not mutate gameplay state.

## 4. Load order

```text
BuildersValleyScene
→ HeroSlicePatch
→ CompositionPatch
→ TerrainRiverPatch
```

The terrain-and-river package may hide superseded hero-slice river and cliff-bank containers, but it must not delete or mutate gameplay geometry.

## 5. Runtime invariants

The implementation must preserve:

- player spawn and body;
- world bounds;
- `STREAM` gameplay corridor;
- resource coordinates;
- collision rules;
- pickup range;
- carry intent;
- placement authority;
- hotbar behavior.

## 6. Visual contract

- River silhouette remains inside the existing stream corridor.
- Left and right banks are asymmetric.
- The crossing zone around the bridge remains calm and readable.
- Current marks use varied density rather than uniform horizontal repetition.
- Paths visually connect gathering space → bridge → workshop.
- Waterfall, river, bridge and workshop remain one readable composition.

## 7. Inspection contract

Expose:

```js
window.__BUILDERS_VALLEY__.getTerrainRiverFoundation()
```

The returned object must include:

- standard;
- package status;
- implementation owner;
- reference viewport;
- river corridor;
- crossing protection zone;
- path anchors;
- module list;
- `gameplayGeometryChanged: false`.

## 8. Verification

Repository verification requires:

- all modules exist;
- load order is explicit in `frontend/src/main.js`;
- no gameplay-authority file changes;
- parent contract and implementation agree;
- runtime evidence remains pending until local execution.

## 9. Completion boundary

This execution may reach `REPOSITORY PASS` before PES-001A receives final creative approval. It must not be called runtime-complete or production-complete until local evidence verifies both the inherited composition and the new terrain-and-river implementation.
