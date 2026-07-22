import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";
import {
  PAL_001A_ATLASES,
  PAL_001A_DELIVERED_ASSETS,
} from "../assets/Pal001ThaiNatureDeliveryManifest.js";
import {
  PAL_003_TO_006_ATLASES,
} from "../assets/Pal003To006GraphicsDeliveryManifest.js";
import {
  PAL_007A_CHARACTER_NPC_ATLASES,
} from "../assets/Pal007ThaiCharacterNpcDeliveryManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalPreload = prototype.preload;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PAL_COMP_001_VISIBLE_GRAPHICS_INTEGRATION_V1";

const ALL_ATLASES = Object.freeze([
  ...PAL_001A_ATLASES,
  ...PAL_003_TO_006_ATLASES,
  ...PAL_007A_CHARACTER_NPC_ATLASES,
]);

const PLACEMENTS = Object.freeze([
  // Thai nature — frame the field without touching the player route.
  { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "banana_plant_01", x: 270, y: 220, scale: 0.82, zone: "WEST_GROVE" },
  { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "bamboo_cluster_01", x: 438, y: 196, scale: 0.78, zone: "WEST_GROVE" },
  { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "coconut_palm_01", x: 1410, y: 214, scale: 0.82, zone: "EAST_FIELD" },
  { atlas: "PAL_TH_NATURE_ATLAS_01", frame: "mango_tree_01", x: 1510, y: 698, scale: 0.76, zone: "EAST_FIELD" },

  // Ground decoration — visible density away from the main walking corridor.
  { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 344, y: 424, scale: 0.9, zone: "FIELD_DETAIL" },
  { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 518, y: 318, scale: 0.88, zone: "FIELD_DETAIL" },
  { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "pebble_scatter_01", x: 622, y: 530, scale: 0.9, zone: "FIELD_DETAIL" },
  { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "grass_clump_01", x: 1328, y: 346, scale: 0.86, zone: "FIELD_DETAIL" },
  { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "wildflower_cluster_01", x: 1440, y: 770, scale: 0.9, zone: "FIELD_DETAIL" },
  { atlas: "PAL_GROUND_DECORATION_ATLAS_01", frame: "cart_track_01", x: 1192, y: 676, scale: 1, zone: "WORKSHOP_YARD" },

  // River edge — bank-only accents, never inside the bridge traversal lane.
  { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "reed_cluster_01", x: STREAM.left - 34, y: 386, scale: 0.82, zone: "RIVER_EDGE" },
  { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "mossy_bank_rocks_01", x: STREAM.left - 44, y: 690, scale: 0.86, zone: "RIVER_EDGE" },
  { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "lotus_bank_cluster_01", x: STREAM.left + STREAM.width + 34, y: 330, scale: 0.78, zone: "RIVER_EDGE" },
  { atlas: "PAL_RIVER_EDGE_ATLAS_01", frame: "driftwood_01", x: STREAM.left + STREAM.width + 40, y: 760, scale: 0.82, zone: "RIVER_EDGE" },

  // Workshop props — decorative-only life around the authored work area.
  { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "water_jar_01", x: 1392, y: 486, scale: 0.78, zone: "WORKSHOP" },
  { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "woven_basket_01", x: 1284, y: 602, scale: 0.76, zone: "WORKSHOP" },
  { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "mortar_pestle_01", x: 1458, y: 586, scale: 0.72, zone: "WORKSHOP" },
  { atlas: "PAL_TH_PROPS_ATLAS_01", frame: "sticky_rice_basket_01", x: 1340, y: 726, scale: 0.74, zone: "WORKSHOP" },
  { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "woven_mat_roll_01", x: 1460, y: 650, scale: 0.72, zone: "WORKSHOP" },
  { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "hay_stack_01", x: 1510, y: 548, scale: 0.74, zone: "WORKSHOP" },
  { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "drying_rack_01", x: 1238, y: 432, scale: 0.78, zone: "WORKSHOP" },
  { atlas: "PAL_VILLAGE_LIFE_ATLAS_01", frame: "wood_cart_01", x: 1450, y: 820, scale: 0.76, zone: "WORKSHOP" },

  // Static NPC visuals — presence only, no AI, collision, dialogue, or interaction.
  { atlas: "PAL_TH_CHARACTER_NPC_ATLAS_01", frame: "carpenter_idle_south_01", x: 1292, y: 470, scale: 0.9, zone: "NPC_VISUAL" },
  { atlas: "PAL_TH_CHARACTER_NPC_ATLAS_01", frame: "merchant_idle_south_01", x: 1432, y: 438, scale: 0.9, zone: "NPC_VISUAL" },
]);

function preloadVisibleGraphics() {
  const queued = new Set();
  ALL_ATLASES.forEach((atlas) => {
    if (queued.has(atlas.id) || this.textures.exists(atlas.id)) return;
    this.load.atlas(atlas.id, atlas.textureUrl, atlas.dataUrl);
    queued.add(atlas.id);
  });
}

function createSprite(scene, placement) {
  if (!scene.textures.exists(placement.atlas)) return null;
  const sprite = scene.add
    .sprite(placement.x, placement.y, placement.atlas, placement.frame)
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(42, Math.min(318, placement.y + 20)));
  sprite.setDataEnabled();
  sprite.setData("palComposition", "PAL-COMP-001");
  sprite.setData("zone", placement.zone);
  sprite.setData("decorativeOnly", true);
  return sprite;
}

function installVisibleGraphics(scene) {
  scene.__palComp001Runtime?.objects?.forEach((object) => object?.destroy?.());

  const objects = PLACEMENTS.map((placement) => createSprite(scene, placement)).filter(Boolean);
  const missing = PLACEMENTS.filter(
    (placement) => !scene.textures.exists(placement.atlas),
  ).map((placement) => `${placement.atlas}:${placement.frame}`);

  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "PAL-COMP-001",
    compositionMode: "VISIBLE_DECORATIVE_INTEGRATION",
    atlasCount: ALL_ATLASES.length,
    placementCount: PLACEMENTS.length,
    visibleObjectCount: objects.length,
    missing,
    zones: [...new Set(PLACEMENTS.map((placement) => placement.zone))],
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    visualScope: "SCOPED_REOPEN_FOR_APPROVED_PAL_COMPOSITION",
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
  };

  scene.__palComp001Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getVisibleGraphicsIntegration = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    atlasCount: runtime.atlasCount,
    placementCount: runtime.placementCount,
    visibleObjectCount: runtime.visibleObjectCount,
    missing: [...runtime.missing],
    zones: [...runtime.zones],
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    visualScope: runtime.visualScope,
  });
  window.__BUILDERS_VALLEY__.debugVisibleGraphicsIntegration = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getVisibleGraphicsIntegration();
    console.group(`Builders Valley Visible Graphics — ${snapshot.packageStatus}`);
    console.table(PLACEMENTS);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.preload = function preloadWithVisibleGraphics() {
  originalPreload?.call(this);
  preloadVisibleGraphics.call(this);
};

prototype.create = function createWithVisibleGraphics() {
  originalCreate.call(this);
  installVisibleGraphics(this);
};
