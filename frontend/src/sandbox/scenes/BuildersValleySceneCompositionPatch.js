import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PAL_SCENE_001_1_COMPOSITION_CALIBRATION_V1";

const ZONES = Object.freeze([
  Object.freeze({
    id: "WESTERN_GROVE",
    purpose: "anchor orchard vegetation with low-detail ground clusters and restrained accents",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 286, y: 224, scale: 0.82 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 408, y: 216, scale: 0.76 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 336, y: 316, scale: 0.74 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 264, y: 344, scale: 0.72 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 432, y: 346, scale: 0.6 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 360, y: 380, scale: 0.66 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 382, y: 292, scale: 0.58 },
    ]),
  }),
  Object.freeze({
    id: "BRIDGE_APPROACH",
    purpose: "keep the bridge silhouette and traversal lane visually clear while framing the approach",
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: STREAM.left - 146, y: 494, scale: 0.52 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: STREAM.left - 118, y: 558, scale: 0.58 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left - 64, y: 430, scale: 0.46 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 58, y: 626, scale: 0.7 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: STREAM.left - 112, y: 646, scale: 0.62 },
    ]),
  }),
  Object.freeze({
    id: "WORKSHOP_COURTYARD",
    purpose: "preserve readable negative space while grouping craft props into purposeful workplace clusters",
    placements: Object.freeze([
      { atlas: "PAL_TH_CHARACTER_NPC_ATLAS_01", frame: "carpenter_idle_south_01", x: 1276, y: 468, scale: 0.88 },
      { atlas: "PAL_TH_CHARACTER_NPC_ATLAS_01", frame: "merchant_idle_south_01", x: 1460, y: 534, scale: 0.84 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "water_jar_01", x: 1412, y: 486, scale: 0.66 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1320, y: 604, scale: 0.62 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "mortar_pestle_01", x: 1482, y: 608, scale: 0.6 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "sticky_rice_basket_01", x: 1402, y: 650, scale: 0.62 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "drying_rack_01", x: 1226, y: 414, scale: 0.68 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "woven_mat_roll_01", x: 1514, y: 674, scale: 0.62 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "hay_stack_01", x: 1530, y: 560, scale: 0.64 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "wood_cart_01", x: 1442, y: 742, scale: 0.66 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1368, y: 706, scale: 0.8 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1522, y: 756, scale: 0.56 },
    ]),
  }),
  Object.freeze({
    id: "EASTERN_RIVERBANK",
    purpose: "soften the bank edge with low-profile wetland detail without touching bridge or workshop access",
    placements: Object.freeze([
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 46, y: 352, scale: 0.64 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left + STREAM.width + 68, y: 444, scale: 0.44 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "driftwood_01", x: STREAM.left + STREAM.width + 58, y: 770, scale: 0.68 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left + STREAM.width + 70, y: 808, scale: 0.66 },
    ]),
  }),
  Object.freeze({
    id: "EASTERN_FIELD",
    purpose: "balance the eastern visual weight with two compact clusters while preserving the central play field",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: 1458, y: 236, scale: 0.76 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 1518, y: 334, scale: 0.68 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1416, y: 350, scale: 0.56 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1540, y: 424, scale: 0.58 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1468, y: 448, scale: 0.6 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1346, y: 678, scale: 0.5 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1394, y: 720, scale: 0.54 },
    ]),
  }),
]);

function createSprite(scene, zone, placement) {
  if (!scene.textures.exists(placement.atlas)) return null;

  const sprite = scene.add
    .sprite(placement.x, placement.y, placement.atlas, placement.frame)
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(44, Math.min(320, placement.y + 20)));

  sprite.setDataEnabled();
  sprite.setData("palComposition", "PAL-SCENE-001.1");
  sprite.setData("sceneZone", zone.id);
  sprite.setData("decorativeOnly", true);
  return sprite;
}

function installSceneComposition(scene) {
  scene.__palComp001Runtime?.objects?.forEach((object) => object?.destroy?.());
  scene.__palScene001Runtime?.objects?.forEach((object) => object?.destroy?.());

  const objects = [];
  const missing = [];
  const zoneSummaries = ZONES.map((zone) => {
    let visibleCount = 0;
    zone.placements.forEach((placement) => {
      const sprite = createSprite(scene, zone, placement);
      if (sprite) {
        objects.push(sprite);
        visibleCount += 1;
      } else {
        missing.push(`${placement.atlas}:${placement.frame}`);
      }
    });
    return Object.freeze({
      id: zone.id,
      purpose: zone.purpose,
      declaredCount: zone.placements.length,
      visibleCount,
    });
  });

  const placementCount = ZONES.reduce((sum, zone) => sum + zone.placements.length, 0);
  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "PAL-SCENE-001.1",
    compositionMode: "CALIBRATED_AUTHORED_LIVED_IN_ZONE_COMPOSITION",
    zoneCount: ZONES.length,
    placementCount,
    visibleObjectCount: objects.length,
    missing,
    zones: zoneSummaries,
    calibration: {
      bridgeSilhouetteCleared: true,
      workshopNegativeSpaceImproved: true,
      easternFieldBalanced: true,
      flowerMarkerScaleReduced: true,
      riverEdgeDepthReduced: true,
    },
    replacedLooseComposition: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
  };

  scene.__palScene001Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getSceneComposition = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    zoneCount: runtime.zoneCount,
    placementCount: runtime.placementCount,
    visibleObjectCount: runtime.visibleObjectCount,
    missing: [...runtime.missing],
    zones: runtime.zones.map((zone) => ({ ...zone })),
    calibration: { ...runtime.calibration },
    replacedLooseComposition: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
  });
  window.__BUILDERS_VALLEY__.debugSceneComposition = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getSceneComposition();
    console.group(`Builders Valley Scene Composition — ${snapshot.packageStatus}`);
    console.table(snapshot.zones);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithSceneComposition() {
  originalCreate.call(this);
  installSceneComposition(this);
};
