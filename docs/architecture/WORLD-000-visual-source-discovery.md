# WORLD-000 — Builders Valley Visual Source Discovery

Status: COMPLETE (repository ownership discovery)

## Mission

Identify the actual runtime owners that create and decorate the Builders Valley world before any further graphics work. The purpose is to stop adding anonymous visual patches and establish a direct-owner rebuild path.

## Runtime entry chain

```text
frontend/src/main.js
  -> createSandboxGame()
  -> Phaser.Game(scene: [BuildersValleyScene])
  -> BuildersValleyScene.create()
  -> drawPixelWorld()
  -> imported prototype patches wrap preload/create/update in import order
```

## Primary owners

### 1. Product boot owner

`frontend/src/main.js`

Responsibilities:
- selects Builder's Valley as the default runtime
- imports the active patch chain
- therefore controls which visual systems execute

### 2. Phaser game owner

`frontend/src/sandbox/createSandboxGame.js`

Responsibilities:
- creates the Phaser game
- registers `BuildersValleyScene`
- imports the earliest scene patches:
  - `BuildersValleyIntentPatch.js`
  - `BuildersValleyVisualPatch.js`
  - `BuildersValleyLandmarkPatch.js`
  - `BuildersValleyEnvironmentVariantsPatch.js`

### 3. Scene lifecycle and gameplay owner

`frontend/src/sandbox/scenes/BuildersValleyScene.js`

Responsibilities:
- owns `create()` and `update()` lifecycle
- invokes `drawPixelWorld()`
- creates resource landmarks, player, ambient life, hotbar, interaction HUD and input
- establishes the gameplay objects and resource-node positions

This is the root scene owner, but it is not the final visual owner because later imported patches wrap its prototype methods.

### 4. Baseline ground and straight-stream owner

`frontend/src/sandbox/art/pixelArtFactory.js`

Function: `drawPixelWorld()`

Responsibilities:
- paints the full rectangular grass base
- adds sparse grass marks
- paints the original straight river, banks and water highlights

This is the source of the large flat green background. It remains active even when later terrain systems draw on top of it.

### 5. Original bridge/workshop/decorative composition owner

`frontend/src/sandbox/scenes/BuildersValleyLandmarkPatch.js`

Responsibilities:
- bridge gateway
- workshop yard
- field grass pockets
- environment landmark SVG pack

Important: this patch still runs from `createSandboxGame.js`; it is not controlled only by the later imports in `main.js`.

### 6. Original bridge/workshop variant owner

`frontend/src/sandbox/scenes/BuildersValleyEnvironmentVariantsPatch.js`

Responsibilities:
- bridge deck, posts and shadow
- workshop props
- foreground bushes, rock debris and water sparkles

This also runs from `createSandboxGame.js` and therefore remains active after removing only late HERO patches.

### 7. Camera and landmark position authority

`frontend/src/sandbox/scenes/BuildersValleyCompositionPatch.js`

Responsibilities:
- camera zoom/deadzone/follow policy
- waterfall, bridge and workshop composition anchors

### 8. Current world-geometry owner

`frontend/src/sandbox/scenes/BuildersValleyTerrainRiverPatch.js`

Responsibilities:
- organic river geometry
- water renderer
- shorelines
- terrain masses
- paths
- gorge, workshop terrace, bridge approach, forest pocket and foreground framing

Its declared implementation owner is itself. It hides only the superseded `__heroVisualSlice` river/cliff blockout; it does not remove `drawPixelWorld()` or the early landmark/variant composition.

### 9. Active production presentation owners

The production consolidation runtime declares these required systems:

| Visual domain | Runtime owner |
|---|---|
| world geometry | `BuildersValleyTerrainRiverPatch.js` |
| asset delivery | `BuildersValleyAssetPipelinePatch.js` |
| ground presentation | `BuildersValleyGroundAssetPatch.js` |
| water presentation | `BuildersValleyWaterAssetPatch.js` |
| cliff presentation | `BuildersValleyCliffAssetPatch.js` |
| river kit | `BuildersValleyRiverKitRuntimePatch.js` |
| world layer authority | `BuildersValleyLayerCompositionRuntimePatch.js` |
| foreground composition | `BuildersValleyForegroundCompositionRuntimePatch.js` |
| terrain material | `BuildersValleyTerrainDetailRuntimePatch.js` |
| workshop story | `BuildersValleyWorkshopDetailRuntimePatch.js` |
| vegetation composition | `BuildersValleyVegetationCompositionRuntimePatch.js` |
| lighting and atmosphere | `BuildersValleyLightingAtmosphereRuntimePatch.js` |

`BuildersValleyProductionEnvironmentConsolidationPatch.js` inspects these systems but does not replace them; it is an audit/consolidation owner.

## Root cause of the unsuccessful visual rollback

Removing the six late HERO/PAL imports could not substantially reset the scene because the visible world is produced by several earlier owners that remained active:

1. `drawPixelWorld()` still paints the full grass field and straight baseline stream.
2. `BuildersValleyLandmarkPatch.js` still composes bridge, workshop and field pockets.
3. `BuildersValleyEnvironmentVariantsPatch.js` still adds bridge/workshop/field variants.
4. `BuildersValleyTerrainRiverPatch.js` and the production presentation runtimes still draw another world layer over the baseline.
5. The scene is therefore cumulative: baseline world + early landmarks + variants + terrain foundation + asset/runtime detail systems.

The previous assumption that one late HERO patch owned the visible scene was incorrect.

## Ownership decision

Future world work must not add another anonymous `BuildersValley*Patch.js` to the end of the chain.

The rebuild authority will be split explicitly:

```text
BuildersValleyScene.js
  gameplay lifecycle and gameplay objects only

BuildersValleyWorld.js (new direct owner)
  complete visual world composition
  terrain silhouette
  river/waterfall
  cliffs and terraces
  bridge/workshop placement
  background/midground/foreground layers

pixelArtFactory.js
  reusable low-level primitives only
```

The new world owner must replace—not overlay—the baseline visual world. During migration it must explicitly retire or bypass:

- `drawPixelWorld()` as the production world renderer
- early landmark composition
- early environment variants
- superseded terrain/detail presentation patches

Gameplay geometry, collision, resource interactions and hotbar behavior must remain unchanged unless separately approved.

## Next mission

### WORLD-001 — Direct World Composition Skeleton

Deliver one direct world owner with a visually obvious screenshot change.

Definition of Done:
- one production world-composition entry point
- baseline grass/stream renderer is bypassed or retired
- no new end-of-chain art patch
- bridge, waterfall and workshop have one composition authority
- before/after screenshot reads as a different scene at thumbnail size
- gameplay and interaction loop remain operational
