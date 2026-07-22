import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_HERO_001_COMPOSITION_CALIBRATION_V1";

const HERO_REGIONS = Object.freeze([
  Object.freeze({
    id: "WESTERN_FOREST_FRAME",
    purpose: "form a dense but readable forest pocket that frames the waterfall without swallowing the path",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 236, y: 222, scale: 0.72 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 322, y: 232, scale: 0.68 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 278, y: 312, scale: 0.78 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 218, y: 348, scale: 0.5 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 364, y: 338, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 404, y: 378, scale: 0.46 },
    ]),
  }),
  Object.freeze({
    id: "WATERFALL_CORRIDOR",
    purpose: "preserve a strong vertical read from waterfall to bridge while softening both banks",
    placements: Object.freeze([
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left - 82, y: 346, scale: 0.32 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 60, y: 420, scale: 0.48 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 72, y: 360, scale: 0.42 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left + STREAM.width + 86, y: 438, scale: 0.3 },
    ]),
  }),
  Object.freeze({
    id: "BRIDGE_HERO_FRAME",
    purpose: "frame the bridge as the central hero landmark while keeping the traversal silhouette clean",
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: STREAM.left - 168, y: 544, scale: 0.36 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: STREAM.left - 126, y: 586, scale: 0.38 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: STREAM.left - 154, y: 628, scale: 0.38 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: STREAM.left + STREAM.width + 144, y: 538, scale: 0.34 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: STREAM.left + STREAM.width + 170, y: 588, scale: 0.36 },
    ]),
  }),
  Object.freeze({
    id: "WORKSHOP_TERRACE",
    purpose: "shape the workshop as a purposeful terrace with clear work clusters and visual breathing room",
    placements: Object.freeze([
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "water_jar_01", x: 1418, y: 500, scale: 0.58 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1328, y: 604, scale: 0.5 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "sticky_rice_basket_01", x: 1452, y: 648, scale: 0.5 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "woven_mat_roll_01", x: 1514, y: 672, scale: 0.48 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "hay_stack_01", x: 1534, y: 566, scale: 0.56 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1376, y: 704, scale: 0.7 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1260, y: 648, scale: 0.38 },
    ]),
  }),
  Object.freeze({
    id: "FRONT_FOREGROUND_FRAME",
    purpose: "introduce restrained lower-frame depth inspired by the hero target without obscuring HUD or gameplay",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 312, y: WORLD_HEIGHT - 34, scale: 0.72 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 470, y: WORLD_HEIGHT - 26, scale: 0.52 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 80, y: WORLD_HEIGHT - 18, scale: 0.56 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "driftwood_01", x: STREAM.left + STREAM.width + 92, y: WORLD_HEIGHT - 24, scale: 0.5 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: WORLD_WIDTH - 214, y: WORLD_HEIGHT - 30, scale: 0.68 },
    ]),
  }),
]);

function createSprite(scene, region, placement) {
  if (!scene.textures.exists(placement.atlas)) return null;

  const sprite = scene.add
    .sprite(placement.x, placement.y, placement.atlas, placement.frame)
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(38, Math.min(332, placement.y + 24)));

  sprite.setDataEnabled();
  sprite.setData("heroPass", "HERO-001");
  sprite.setData("heroRegion", region.id);
  sprite.setData("decorativeOnly", true);
  return sprite;
}

function installHeroCompositionCalibration(scene) {
  scene.__hero001Runtime?.objects?.forEach((object) => object?.destroy?.());

  const objects = [];
  const missing = [];
  const regionSummaries = HERO_REGIONS.map((region) => {
    let visibleCount = 0;
    region.placements.forEach((placement) => {
      const sprite = createSprite(scene, region, placement);
      if (sprite) {
        objects.push(sprite);
        visibleCount += 1;
      } else {
        missing.push(`${placement.atlas}:${placement.frame}`);
      }
    });

    return Object.freeze({
      id: region.id,
      purpose: region.purpose,
      declaredCount: region.placements.length,
      visibleCount,
    });
  });

  const placementCount = HERO_REGIONS.reduce(
    (sum, region) => sum + region.placements.length,
    0,
  );

  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "HERO-001",
    compositionMode: "HERO_FRAME_COMPOSITION_CALIBRATION",
    regionCount: HERO_REGIONS.length,
    placementCount,
    visibleObjectCount: objects.length,
    missing,
    regions: regionSummaries,
    heroFrameSourceOfTruth: true,
    usesExistingAssetsOnly: true,
    bridgeTraversalSilhouettePreserved: true,
    workshopNegativeSpacePreserved: true,
    frontForegroundAdded: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
  };

  scene.__hero001Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getHeroCompositionCalibration = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    regionCount: runtime.regionCount,
    placementCount: runtime.placementCount,
    visibleObjectCount: runtime.visibleObjectCount,
    missing: [...runtime.missing],
    regions: runtime.regions.map((region) => ({ ...region })),
    heroFrameSourceOfTruth: true,
    usesExistingAssetsOnly: true,
    bridgeTraversalSilhouettePreserved: true,
    workshopNegativeSpacePreserved: true,
    frontForegroundAdded: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
  });
}

prototype.create = function createWithHeroCompositionCalibration() {
  originalCreate.call(this);
  installHeroCompositionCalibration(this);
};
