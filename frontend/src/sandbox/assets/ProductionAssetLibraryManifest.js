export const PRODUCTION_ASSET_LIBRARY_STANDARD =
  "MATH_LEARNING_WORLD_PRODUCTION_ASSET_LIBRARY_V1";

export const PRODUCTION_ASSET_LIBRARY_VERSION = "PAL_MANIFEST_V1";

export const PAL_PACKS = Object.freeze([
  "PAL-001_THAI_NATURE",
  "PAL-002_THAI_BUILDINGS",
  "PAL-003_THAI_PROPS",
  "PAL-004_THAI_FOOD",
  "PAL-005_WORKSHOP",
  "PAL-006_VILLAGE_NPC",
  "PAL-007_ANIMALS",
  "PAL-008_RIVER_BOATS",
  "PAL-009_TEMPLE",
  "PAL-010_MARKETPLACE",
]);

export const PAL_LIFECYCLE_STATES = Object.freeze([
  "PLANNED",
  "DELIVERED",
  "DECORATIVE_READY",
  "GAMEPLAY_CONTRACT_REQUIRED",
  "GAMEPLAY_READY",
  "DEPRECATED",
]);

export const PAL_COLLISION_POLICIES = Object.freeze([
  "NONE",
  "VISUAL_FOOTPRINT_ONLY",
  "RUNTIME_CONTRACT_REQUIRED",
  "RUNTIME_AUTHORED",
]);

function asset(definition) {
  return Object.freeze({
    version: "1.0.0",
    lifecycle: "PLANNED",
    enabled: false,
    sourceType: "ATLAS_FRAME",
    collisionPolicy: "NONE",
    interactionPolicy: "DECORATIVE_ONLY",
    fallbackPolicy: "OMIT_WITHOUT_GAMEPLAY_IMPACT",
    culturalReviewStatus: "PENDING",
    runtimeContract: null,
    textureUrl: null,
    dataUrl: null,
    frame: null,
    ...definition,
  });
}

export const PRODUCTION_ASSET_LIBRARY = Object.freeze([
  asset({
    id: "PAL_TH_NATURE_COCONUT_PALM_01",
    pack: "PAL-001_THAI_NATURE",
    family: "TREE",
    visualRole: "tropical canopy and settlement edge framing",
    placementTags: Object.freeze(["TROPICAL", "SUN", "SETTLEMENT_EDGE"]),
  }),
  asset({
    id: "PAL_TH_NATURE_BANANA_PLANT_01",
    pack: "PAL-001_THAI_NATURE",
    family: "CROP_TREE",
    visualRole: "garden and farm transition vegetation",
    placementTags: Object.freeze(["TROPICAL", "FARM", "MOIST_SOIL"]),
  }),
  asset({
    id: "PAL_TH_NATURE_MANGO_TREE_01",
    pack: "PAL-001_THAI_NATURE",
    family: "TREE",
    visualRole: "orchard and village shade tree",
    placementTags: Object.freeze(["ORCHARD", "VILLAGE", "SHADE"]),
  }),
  asset({
    id: "PAL_TH_NATURE_SUGAR_PALM_01",
    pack: "PAL-001_THAI_NATURE",
    family: "TREE",
    visualRole: "rural skyline landmark",
    placementTags: Object.freeze(["RURAL", "FIELD_EDGE", "LANDMARK"]),
  }),
  asset({
    id: "PAL_TH_NATURE_BAMBOO_CLUSTER_01",
    pack: "PAL-001_THAI_NATURE",
    family: "BAMBOO",
    visualRole: "dense screen and river-bank vegetation",
    placementTags: Object.freeze(["RIVER_BANK", "MOIST_SOIL", "DENSE"]),
  }),
  asset({
    id: "PAL_TH_NATURE_BROADLEAF_TREE_01",
    pack: "PAL-001_THAI_NATURE",
    family: "TREE",
    visualRole: "general tropical forest canopy",
    placementTags: Object.freeze(["FOREST", "TROPICAL", "CANOPY"]),
  }),
  asset({
    id: "PAL_TH_NATURE_LOTUS_FLOWER_01",
    pack: "PAL-001_THAI_NATURE",
    family: "AQUATIC_PLANT",
    visualRole: "pond and calm-water focal accent",
    placementTags: Object.freeze(["POND", "CALM_WATER", "CULTURAL_GARDEN"]),
  }),
  asset({
    id: "PAL_TH_NATURE_LOTUS_LEAF_CLUSTER_01",
    pack: "PAL-001_THAI_NATURE",
    family: "AQUATIC_PLANT",
    visualRole: "aquatic surface coverage",
    placementTags: Object.freeze(["POND", "CALM_WATER", "CLUSTER"]),
  }),
  asset({
    id: "PAL_TH_NATURE_RICE_CLUMP_01",
    pack: "PAL-001_THAI_NATURE",
    family: "CROP",
    visualRole: "rice-field decorative foundation",
    placementTags: Object.freeze(["RICE_FIELD", "WET_SOIL", "FARM"]),
  }),
  asset({
    id: "PAL_TH_NATURE_FLOWERING_SHRUB_01",
    pack: "PAL-001_THAI_NATURE",
    family: "SHRUB",
    visualRole: "garden and path-side color accent",
    placementTags: Object.freeze(["GARDEN", "PATH_EDGE", "COLOR_ACCENT"]),
  }),
  asset({
    id: "PAL_TH_NATURE_TROPICAL_GRASS_01",
    pack: "PAL-001_THAI_NATURE",
    family: "GRASS",
    visualRole: "terrain transition and edge softening",
    placementTags: Object.freeze(["GROUND_EDGE", "FIELD", "RIVER_BANK"]),
  }),
  asset({
    id: "PAL_TH_NATURE_MOSS_ROCK_CLUSTER_01",
    pack: "PAL-001_THAI_NATURE",
    family: "ROCK",
    visualRole: "moist terrain and waterfall support detail",
    placementTags: Object.freeze(["MOIST", "WATERFALL", "FOREST_FLOOR"]),
  }),
  asset({
    id: "PAL_TH_NATURE_BANANA_HARVESTABLE_01",
    pack: "PAL-001_THAI_NATURE",
    family: "RESOURCE_NODE",
    lifecycle: "GAMEPLAY_CONTRACT_REQUIRED",
    visualRole: "future harvestable banana resource node",
    collisionPolicy: "RUNTIME_CONTRACT_REQUIRED",
    interactionPolicy: "HARVEST_CONTRACT_REQUIRED",
    fallbackPolicy: "DISABLED_UNTIL_RUNTIME_READY",
    placementTags: Object.freeze(["FARM", "VILLAGE_GARDEN"]),
  }),
  asset({
    id: "PAL_TH_NATURE_MANGO_HARVESTABLE_01",
    pack: "PAL-001_THAI_NATURE",
    family: "RESOURCE_NODE",
    lifecycle: "GAMEPLAY_CONTRACT_REQUIRED",
    visualRole: "future harvestable mango resource node",
    collisionPolicy: "RUNTIME_CONTRACT_REQUIRED",
    interactionPolicy: "HARVEST_CONTRACT_REQUIRED",
    fallbackPolicy: "DISABLED_UNTIL_RUNTIME_READY",
    placementTags: Object.freeze(["ORCHARD", "VILLAGE"]),
  }),
  asset({
    id: "PAL_TH_NATURE_RICE_GROWTH_STAGES_01",
    pack: "PAL-001_THAI_NATURE",
    family: "RESOURCE_NODE",
    lifecycle: "GAMEPLAY_CONTRACT_REQUIRED",
    visualRole: "future persistent rice growth lifecycle",
    collisionPolicy: "RUNTIME_CONTRACT_REQUIRED",
    interactionPolicy: "GROWTH_AND_HARVEST_CONTRACT_REQUIRED",
    fallbackPolicy: "DISABLED_UNTIL_RUNTIME_READY",
    placementTags: Object.freeze(["RICE_FIELD", "FARM"]),
  }),
]);

export function getPalAssetsByPack(pack) {
  return PRODUCTION_ASSET_LIBRARY.filter((record) => record.pack === pack);
}

export function getEnabledPalAssets() {
  return PRODUCTION_ASSET_LIBRARY.filter((record) => record.enabled);
}

export function summarizeProductionAssetLibrary() {
  const byLifecycle = Object.fromEntries(
    PAL_LIFECYCLE_STATES.map((state) => [
      state,
      PRODUCTION_ASSET_LIBRARY.filter((record) => record.lifecycle === state).length,
    ]),
  );

  const byPack = Object.fromEntries(
    PAL_PACKS.map((pack) => [
      pack,
      PRODUCTION_ASSET_LIBRARY.filter((record) => record.pack === pack).length,
    ]),
  );

  return {
    standard: PRODUCTION_ASSET_LIBRARY_STANDARD,
    manifestVersion: PRODUCTION_ASSET_LIBRARY_VERSION,
    declaredAssetCount: PRODUCTION_ASSET_LIBRARY.length,
    enabledAssetCount: getEnabledPalAssets().length,
    byLifecycle,
    byPack,
  };
}
