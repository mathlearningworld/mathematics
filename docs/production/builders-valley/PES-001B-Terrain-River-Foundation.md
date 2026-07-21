# PES-001B — Terrain and River Foundation

**Status:** FOUNDATION APPROVED — PRODUCTION ASSETS DEFERRED  
**Authority:** PCP-001 / VSC-001 / PES-001A  
**Repository branch:** `main`  
**Runtime evidence:** Vite boot, repeated in-engine screenshots, gameplay preservation review  
**Successor:** PES-001C — Production Asset Pipeline and Integration

## 1. Purpose

PES-001B establishes the authored terrain-and-river foundation for the Builders Valley hero frame while preserving the gather → carry → place gameplay contract.

The package evolved from a straight prototype water corridor into a presentation-owned environment foundation with continuous river geometry, authored gorge composition, protected bridge approaches, workshop terrain integration, and left-side composition rhythm.

## 2. Approved foundation outcome

The accepted foundation provides:

- a continuous river silhouette with centerline drift and controlled width rhythm;
- shared-edge water and shoreline rendering without visible segment seams;
- waterfall-to-river gorge composition;
- non-repeating shoreline recess and shelf grammar;
- rock masses integrated with the shoreline;
- protected bridge clearing and readable crossing approaches;
- workshop terrace and work-yard support;
- authored forest-pocket composition;
- controlled foreground framing;
- runtime inspection evidence;
- unchanged gameplay geometry and collision authority.

## 3. Runtime ownership

Primary owner:

```text
frontend/src/sandbox/scenes/BuildersValleyTerrainRiverPatch.js
```

Internal environment modules:

```text
frontend/src/sandbox/scenes/terrain/
├── RiverGeometry.js
├── WaterRenderer.js
├── ShorelineGenerator.js
├── TerrainMassGenerator.js
├── TerrainPathGenerator.js
├── GorgeComposer.js
├── WorkshopTerraceComposer.js
├── BridgeApproachComposer.js
├── ForestPocketComposer.js
└── ForegroundFramingComposer.js
```

These modules own presentation only. `BuildersValleyScene.js` and `worldContract.js` remain gameplay and geometry authority.

## 4. Preserved invariants

PES-001B did not change:

- player spawn;
- world bounds;
- stream collision contract;
- crossing rules;
- resource-node positions;
- pickup range;
- carry intent;
- placement authority;
- placed-object coordinates;
- hotbar behavior;
- gather → carry → place flow.

Runtime evidence continues to report:

```text
gameplayGeometryChanged: false
collisionAuthority: UNCHANGED_STREAM_CONTRACT
```

## 5. Review result

| Gate | Result |
|---|---|
| Repository architecture | PASS |
| Runtime boot and module loading | PASS |
| Continuous river rendering | PASS |
| Shoreline continuity | PASS |
| Authored environment zones | PASS |
| Bridge and workshop readability | PASS — foundation level |
| Gameplay preservation | PASS based on human runtime evidence |
| Production sprite/tile quality | DEFERRED TO PES-001C+ |

## 6. Approval meaning

`FOUNDATION APPROVED` does not claim that procedural Phaser Graphics are final production artwork.

It means:

```text
Composition and geometry foundation approved
+ Runtime integration approved
+ Gameplay preservation approved
+ Asset replacement anchors ready
```

The remaining visual gap to the painted target frame is primarily an asset-production and material-authoring gap, not a terrain-layout gap.

## 7. Deferred asset work

The following are explicitly routed to the production asset pipeline:

- cliff faces, caps, cracks and moss sprites;
- shoreline blend tiles;
- water foam, ripple and highlight textures;
- bridge modular asset kit;
- workshop yard, paver, retaining-edge and prop assets;
- vegetation clusters and foreground occlusion sprites;
- atlas-backed animated water details;
- final lighting and atmospheric grading.

Existing Graphics-based composition remains the safe fallback until production assets are registered and verified.

## 8. Completion record

PES-001B is closed as:

```text
FOUNDATION APPROVED
PRODUCTION ART NOT YET COMPLETE
READY FOR ASSET PIPELINE INTEGRATION
```

No later package may silently change the approved terrain composition or gameplay corridor. Asset integration must project onto the approved anchors or introduce an explicit contract amendment.
