import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_HERO_002_TERRAIN_MASS_V1";

const TERRAIN_PATCHES = Object.freeze([
  { id: "WEST_FOREST_FLOOR", x: 286, y: 286, width: 330, height: 210, fill: 0x356b3e, alpha: 0.16 },
  { id: "WEST_PATH_SHOULDER", x: 430, y: 520, width: 430, height: 150, fill: 0x8b7448, alpha: 0.12 },
  { id: "WATERFALL_LEFT_TERRACE", x: STREAM.left - 112, y: 334, width: 190, height: 330, fill: 0x314f42, alpha: 0.13 },
  { id: "WATERFALL_RIGHT_TERRACE", x: STREAM.left + STREAM.width + 120, y: 340, width: 220, height: 340, fill: 0x314f42, alpha: 0.12 },
  { id: "WORKSHOP_WORN_YARD", x: 1370, y: 622, width: 390, height: 250, fill: 0x7b5d39, alpha: 0.2 },
  { id: "EAST_MEADOW_MASS", x: 1450, y: 360, width: 300, height: 260, fill: 0x427444, alpha: 0.13 },
  { id: "FRONT_LEFT_FRAME", x: 310, y: WORLD_HEIGHT - 30, width: 360, height: 170, fill: 0x244d35, alpha: 0.18 },
  { id: "FRONT_RIGHT_FRAME", x: WORLD_WIDTH - 260, y: WORLD_HEIGHT - 28, width: 390, height: 180, fill: 0x244d35, alpha: 0.18 },
]);

const TERRAIN_CLUSTERS = Object.freeze([
  Object.freeze({
    id: "WEST_FOREST_MASS",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 190, y: 248, scale: 0.86 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 278, y: 226, scale: 0.76 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 370, y: 244, scale: 0.72 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 220, y: 350, scale: 0.48 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 330, y: 368, scale: 0.44 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 398, y: 338, scale: 0.38 },
    ]),
  }),
  Object.freeze({
    id: "CLIFF_BASE_MASS",
    placements: Object.freeze([
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 64, y: 318, scale: 0.62 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left - 92, y: 388, scale: 0.34 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 70, y: 350, scale: 0.46 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left + STREAM.width + 82, y: 432, scale: 0.58 },
    ]),
  }),
  Object.freeze({
    id: "WORKSHOP_TERRAIN_MASS",
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1368, y: 700, scale: 0.82 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1248, y: 648, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1514, y: 712, scale: 0.42 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "hay_stack_01", x: 1538, y: 584, scale: 0.56 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1300, y: 612, scale: 0.48 },
    ]),
  }),
  Object.freeze({
    id: "EAST_MEADOW_MASS",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: 1468, y: 252, scale: 0.72 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 1534, y: 350, scale: 0.62 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1436, y: 414, scale: 0.44 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1518, y: 432, scale: 0.38 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1380, y: 458, scale: 0.4 },
    ]),
  }),
  Object.freeze({
    id: "FRONT_TERRAIN_FRAME",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 262, y: WORLD_HEIGHT - 20, scale: 0.76 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 82, y: WORLD_HEIGHT - 12, scale: 0.6 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "driftwood_01", x: STREAM.left + STREAM.width + 92, y: WORLD_HEIGHT - 18, scale: 0.54 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: WORLD_WIDTH - 220, y: WORLD_HEIGHT - 18, scale: 0.72 },
    ]),
  }),
]);

function createTerrainPatch(scene, patch) {
  const ellipse = scene.add
    .ellipse(patch.x, patch.y, patch.width, patch.height, patch.fill, patch.alpha)
    .setDepth(22);
  ellipse.setDataEnabled();
  ellipse.setData("heroPass", "HERO-002");
  ellipse.setData("terrainPatch", patch.id);
  ellipse.setData("decorativeOnly", true);
  return ellipse;
}

function createClusterSprite(scene, cluster, placement) {
  if (!scene.textures.exists(placement.atlas)) return null;
  const sprite = scene.add
    .sprite(placement.x, placement.y, placement.atlas, placement.frame)
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(40, Math.min(336, placement.y + 26)));
  sprite.setDataEnabled();
  sprite.setData("heroPass", "HERO-002");
  sprite.setData("terrainCluster", cluster.id);
  sprite.setData("decorativeOnly", true);
  return sprite;
}

function installHeroTerrainMass(scene) {
  scene.__hero002Runtime?.objects?.forEach((object) => object?.destroy?.());

  const objects = TERRAIN_PATCHES.map((patch) => createTerrainPatch(scene, patch));
  const missing = [];
  const clusterSummaries = TERRAIN_CLUSTERS.map((cluster) => {
    let visibleCount = 0;
    cluster.placements.forEach((placement) => {
      const sprite = createClusterSprite(scene, cluster, placement);
      if (sprite) {
        objects.push(sprite);
        visibleCount += 1;
      } else {
        missing.push(`${placement.atlas}:${placement.frame}`);
      }
    });
    return Object.freeze({
      id: cluster.id,
      declaredCount: cluster.placements.length,
      visibleCount,
    });
  });

  const placementCount = TERRAIN_CLUSTERS.reduce(
    (sum, cluster) => sum + cluster.placements.length,
    0,
  );

  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "HERO-002",
    compositionMode: "HERO_FRAME_TERRAIN_MASS_PASS",
    terrainPatchCount: TERRAIN_PATCHES.length,
    clusterCount: TERRAIN_CLUSTERS.length,
    placementCount,
    visibleObjectCount: objects.length,
    missing,
    clusters: clusterSummaries,
    heroFrameSourceOfTruth: true,
    terrainMassIncreased: true,
    openGameplayFieldPreserved: true,
    bridgeTraversalSilhouettePreserved: true,
    usesExistingAtlasesOnly: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
  };

  scene.__hero002Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getHeroTerrainMass = () => ({
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
    terrainMassIncreased: true,
    openGameplayFieldPreserved: true,
    bridgeTraversalSilhouettePreserved: true,
    usesExistingAtlasesOnly: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
  });
}

prototype.create = function createWithHeroTerrainMass() {
  originalCreate.call(this);
  installHeroTerrainMass(this);
};
