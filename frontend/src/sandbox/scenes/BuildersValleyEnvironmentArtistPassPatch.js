import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PAL_SCENE_002_ENVIRONMENT_ARTIST_PASS_V1";

const LAYERS = Object.freeze([
  Object.freeze({
    id: "GROUND_DETAIL",
    purpose: "break up large grass fields with restrained low-profile detail",
    depthOffset: -8,
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 188, y: 612, scale: 0.46 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 274, y: 664, scale: 0.44 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 468, y: 738, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 618, y: 778, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1288, y: 734, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1492, y: 636, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1552, y: 756, scale: 0.4 },
    ]),
  }),
  Object.freeze({
    id: "NATURAL_CLUSTER",
    purpose: "connect trees, bushes, grass, and stone into layered natural pockets",
    depthOffset: 0,
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 226, y: 246, scale: 0.66 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 314, y: 258, scale: 0.62 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 260, y: 302, scale: 0.5 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 346, y: 304, scale: 0.44 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: 1506, y: 252, scale: 0.68 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 1444, y: 330, scale: 0.6 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1480, y: 376, scale: 0.48 },
    ]),
  }),
  Object.freeze({
    id: "WORKSHOP_ACTIVITY",
    purpose: "embed workshop props into a worn, purposeful human activity zone",
    depthOffset: 0,
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1334, y: 684, scale: 0.72 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 1248, y: 636, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1510, y: 688, scale: 0.4 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1310, y: 594, scale: 0.54 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "sticky_rice_basket_01", x: 1424, y: 638, scale: 0.54 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "woven_mat_roll_01", x: 1488, y: 654, scale: 0.52 },
    ]),
  }),
  Object.freeze({
    id: "RIVER_TRANSITION",
    purpose: "soften hard river boundaries with layered bank detail",
    depthOffset: -2,
    placements: Object.freeze([
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left - 78, y: 372, scale: 0.34 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 56, y: 706, scale: 0.54 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 64, y: 366, scale: 0.48 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "driftwood_01", x: STREAM.left + STREAM.width + 72, y: 752, scale: 0.52 },
    ]),
  }),
  Object.freeze({
    id: "LANDMARK_FRAME",
    purpose: "guide attention toward the waterfall, bridge, and workshop without changing geometry",
    depthOffset: 6,
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: STREAM.left - 154, y: 548, scale: 0.4 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: STREAM.left - 112, y: 590, scale: 0.42 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: STREAM.left + STREAM.width + 124, y: 532, scale: 0.4 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: STREAM.left + STREAM.width + 154, y: 582, scale: 0.4 },
    ]),
  }),
]);

function createSprite(scene, layer, placement) {
  if (!scene.textures.exists(placement.atlas)) return null;

  const sprite = scene.add
    .sprite(placement.x, placement.y, placement.atlas, placement.frame)
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(36, Math.min(322, placement.y + 20 + layer.depthOffset)));

  sprite.setDataEnabled();
  sprite.setData("palComposition", "PAL-SCENE-002");
  sprite.setData("artistLayer", layer.id);
  sprite.setData("decorativeOnly", true);
  return sprite;
}

function installEnvironmentArtistPass(scene) {
  scene.__palScene002Runtime?.objects?.forEach((object) => object?.destroy?.());

  const objects = [];
  const missing = [];
  const layerSummaries = LAYERS.map((layer) => {
    let visibleCount = 0;
    layer.placements.forEach((placement) => {
      const sprite = createSprite(scene, layer, placement);
      if (sprite) {
        objects.push(sprite);
        visibleCount += 1;
      } else {
        missing.push(`${placement.atlas}:${placement.frame}`);
      }
    });

    return Object.freeze({
      id: layer.id,
      purpose: layer.purpose,
      declaredCount: layer.placements.length,
      visibleCount,
    });
  });

  const placementCount = LAYERS.reduce((sum, layer) => sum + layer.placements.length, 0);
  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "PAL-SCENE-002",
    compositionMode: "ENVIRONMENT_ARTIST_LAYER_PASS",
    layerCount: LAYERS.length,
    placementCount,
    visibleObjectCount: objects.length,
    missing,
    layers: layerSummaries,
    usesExistingAssetsOnly: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
  };

  scene.__palScene002Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getEnvironmentArtistPass = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    layerCount: runtime.layerCount,
    placementCount: runtime.placementCount,
    visibleObjectCount: runtime.visibleObjectCount,
    missing: [...runtime.missing],
    layers: runtime.layers.map((layer) => ({ ...layer })),
    usesExistingAssetsOnly: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
  });
}

prototype.create = function createWithEnvironmentArtistPass() {
  originalCreate.call(this);
  installEnvironmentArtistPass(this);
};
