import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_HERO_002_1_TERRAIN_MASS_CALIBRATION_V1";

const MASS_PATCHES = Object.freeze([
  { id: "WEST_FOREST_CORE", x: 286, y: 284, width: 420, height: 300, fill: 0x28553a, alpha: 0.24 },
  { id: "WEST_FOREST_PATH_EDGE", x: 420, y: 486, width: 420, height: 180, fill: 0x6f6240, alpha: 0.16 },
  { id: "LEFT_CLIFF_SHOULDER", x: STREAM.left - 126, y: 352, width: 250, height: 430, fill: 0x273f39, alpha: 0.22 },
  { id: "RIGHT_CLIFF_SHOULDER", x: STREAM.left + STREAM.width + 132, y: 362, width: 270, height: 440, fill: 0x273f39, alpha: 0.22 },
  { id: "WORKSHOP_TERRACE_BASE", x: 1370, y: 620, width: 470, height: 300, fill: 0x745336, alpha: 0.28 },
  { id: "EAST_MEADOW_CORE", x: 1450, y: 374, width: 390, height: 330, fill: 0x34663f, alpha: 0.2 },
  { id: "FRONT_LEFT_MASS", x: 290, y: WORLD_HEIGHT - 34, width: 430, height: 210, fill: 0x173f2e, alpha: 0.28 },
  { id: "FRONT_RIGHT_MASS", x: WORLD_WIDTH - 280, y: WORLD_HEIGHT - 34, width: 450, height: 220, fill: 0x173f2e, alpha: 0.28 },
]);

const CALIBRATED_CLUSTERS = Object.freeze([
  {
    id: "WEST_FOREST_LAYERED_MASS",
    placements: [
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 164, y: 250, scale: 0.94 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 248, y: 236, scale: 0.82 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 338, y: 244, scale: 0.8 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 410, y: 322, scale: 0.76 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 206, y: 360, scale: 0.56 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 306, y: 382, scale: 0.52 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 388, y: 378, scale: 0.5 },
    ],
  },
  {
    id: "WATERFALL_CLIFF_MASS",
    placements: [
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 92, y: 302, scale: 0.78 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 112, y: 404, scale: 0.72 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left - 108, y: 470, scale: 0.5 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left + STREAM.width + 98, y: 314, scale: 0.78 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left + STREAM.width + 118, y: 420, scale: 0.72 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 112, y: 482, scale: 0.5 },
    ],
  },
  {
    id: "WORKSHOP_TERRACE_MASS",
    placements: [
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1364, y: 704, scale: 0.94 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1242, y: 650, scale: 0.52 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1478, y: 700, scale: 0.5 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "hay_stack_01", x: 1530, y: 588, scale: 0.6 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1304, y: 612, scale: 0.5 },
    ],
  },
  {
    id: "EAST_MEADOW_LAYERED_MASS",
    placements: [
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: 1438, y: 252, scale: 0.78 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 1512, y: 344, scale: 0.7 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 1374, y: 364, scale: 0.64 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1440, y: 432, scale: 0.52 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1354, y: 458, scale: 0.48 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1518, y: 454, scale: 0.4 },
    ],
  },
]);

function createMassPatch(scene, patch) {
  return scene.add
    .ellipse(patch.x, patch.y, patch.width, patch.height, patch.fill, patch.alpha)
    .setDepth(23)
    .setData("heroPass", "HERO-002.1")
    .setData("terrainMass", patch.id)
    .setData("decorativeOnly", true);
}

function createSprite(scene, cluster, placement) {
  if (!scene.textures.exists(placement.atlas)) return null;
  return scene.add
    .sprite(placement.x, placement.y, placement.atlas, placement.frame)
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(42, Math.min(338, placement.y + 28)))
    .setData("heroPass", "HERO-002.1")
    .setData("terrainCluster", cluster.id)
    .setData("decorativeOnly", true);
}

function installCalibration(scene) {
  scene.__hero002Runtime?.objects?.forEach((object) => object?.destroy?.());
  scene.__hero0021Runtime?.objects?.forEach((object) => object?.destroy?.());

  const objects = MASS_PATCHES.map((patch) => createMassPatch(scene, patch));
  const missing = [];
  const clusters = CALIBRATED_CLUSTERS.map((cluster) => {
    let visibleCount = 0;
    cluster.placements.forEach((placement) => {
      const sprite = createSprite(scene, cluster, placement);
      if (sprite) {
        objects.push(sprite);
        visibleCount += 1;
      } else {
        missing.push(`${placement.atlas}:${placement.frame}`);
      }
    });
    return Object.freeze({ id: cluster.id, declaredCount: cluster.placements.length, visibleCount });
  });

  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "HERO-002.1",
    compositionMode: "HERO_FRAME_TERRAIN_MASS_CALIBRATION",
    terrainPatchCount: MASS_PATCHES.length,
    clusterCount: CALIBRATED_CLUSTERS.length,
    placementCount: CALIBRATED_CLUSTERS.reduce((sum, cluster) => sum + cluster.placements.length, 0),
    visibleObjectCount: objects.length,
    missing,
    clusters,
    heroFrameSourceOfTruth: true,
    waterfallShouldersExpanded: true,
    westernForestLayered: true,
    easternMeadowWeighted: true,
    workshopTerraceStrengthened: true,
    blackReedMarkersReplaced: true,
    openGameplayFieldPreserved: true,
    bridgeTraversalSilhouettePreserved: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
  };

  scene.__hero0021Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getHeroTerrainMassCalibration = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    terrainPatchCount: runtime.terrainPatchCount,
    clusterCount: runtime.clusterCount,
    placementCount: runtime.placementCount,
    visibleObjectCount: runtime.visibleObjectCount,
    missing: [...runtime.missing],
    clusters: runtime.clusters.map((cluster) => ({ ...cluster })),
    heroFrameSourceOfTruth: true,
    waterfallShouldersExpanded: true,
    westernForestLayered: true,
    easternMeadowWeighted: true,
    workshopTerraceStrengthened: true,
    blackReedMarkersReplaced: true,
    openGameplayFieldPreserved: true,
    bridgeTraversalSilhouettePreserved: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
  });
}

prototype.create = function createWithHeroTerrainMassCalibration() {
  originalCreate.call(this);
  installCalibration(this);
};
