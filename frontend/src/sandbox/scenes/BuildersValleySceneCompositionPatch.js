import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PAL_SCENE_001_COMPOSITION_V1";

const ZONES = Object.freeze([
  Object.freeze({
    id: "WESTERN_GROVE",
    purpose: "cluster tropical vegetation into a readable grove instead of isolated specimens",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 286, y: 224, scale: 0.84 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 396, y: 216, scale: 0.8 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 332, y: 310, scale: 0.76 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 248, y: 342, scale: 0.82 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 420, y: 334, scale: 0.78 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 352, y: 370, scale: 0.74 },
    ]),
  }),
  Object.freeze({
    id: "BRIDGE_APPROACH",
    purpose: "frame the bridge approach while keeping the traversal lane and spawn corridor clear",
    placements: Object.freeze([
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: STREAM.left - 132, y: 504, scale: 0.7 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: STREAM.left - 88, y: 540, scale: 0.72 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left - 30, y: 456, scale: 0.78 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 48, y: 610, scale: 0.78 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: STREAM.left - 104, y: 626, scale: 0.7 },
    ]),
  }),
  Object.freeze({
    id: "WORKSHOP_COURTYARD",
    purpose: "group craft props, village objects, and people into one authored workplace",
    placements: Object.freeze([
      { atlas: "PAL_TH_CHARACTER_NPC_ATLAS_01", frame: "carpenter_idle_south_01", x: 1288, y: 472, scale: 0.9 },
      { atlas: "PAL_TH_CHARACTER_NPC_ATLAS_01", frame: "merchant_idle_south_01", x: 1432, y: 520, scale: 0.88 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "water_jar_01", x: 1388, y: 490, scale: 0.72 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1336, y: 584, scale: 0.68 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "mortar_pestle_01", x: 1462, y: 590, scale: 0.66 },
      { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "sticky_rice_basket_01", x: 1398, y: 628, scale: 0.68 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "drying_rack_01", x: 1234, y: 430, scale: 0.74 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "woven_mat_roll_01", x: 1490, y: 650, scale: 0.68 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "hay_stack_01", x: 1518, y: 554, scale: 0.7 },
      { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "wood_cart_01", x: 1438, y: 720, scale: 0.72 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1360, y: 686, scale: 0.9 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1510, y: 736, scale: 0.68 },
    ]),
  }),
  Object.freeze({
    id: "EASTERN_RIVERBANK",
    purpose: "build a wet bank vignette beside the workshop without blocking its entrance",
    placements: Object.freeze([
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 34, y: 342, scale: 0.76 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left + STREAM.width + 42, y: 418, scale: 0.76 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "driftwood_01", x: STREAM.left + STREAM.width + 44, y: 758, scale: 0.76 },
      { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left + STREAM.width + 46, y: 794, scale: 0.74 },
    ]),
  }),
  Object.freeze({
    id: "EASTERN_FIELD",
    purpose: "create a distant tropical frame and retain a calm open play field",
    placements: Object.freeze([
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: 1460, y: 236, scale: 0.8 },
      { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 1512, y: 330, scale: 0.74 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1408, y: 338, scale: 0.72 },
      { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1536, y: 412, scale: 0.72 },
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
  sprite.setData("palComposition", "PAL-SCENE-001");
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
    productionPhase: "PAL-SCENE-001",
    compositionMode: "AUTHORED_LIVED_IN_ZONE_COMPOSITION",
    zoneCount: ZONES.length,
    placementCount,
    visibleObjectCount: objects.length,
    missing,
    zones: zoneSummaries,
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
