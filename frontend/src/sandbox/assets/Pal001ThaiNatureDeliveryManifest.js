export const PAL_001A_DELIVERY_STANDARD =
  "MATH_LEARNING_WORLD_PAL_001A_THAI_NATURE_DECORATIVE_DELIVERY_V1";

export const PAL_001A_DELIVERY_VERSION = "PAL_001A_DELIVERY_V1";

export const PAL_001A_ATLASES = Object.freeze([
  Object.freeze({
    id: "PAL_TH_NATURE_ATLAS_01",
    textureUrl: "/assets/pal/thai-nature/pal-thai-nature-atlas.svg",
    dataUrl: "/assets/pal/thai-nature/pal-thai-nature-atlas.json",
    frameCount: 6,
  }),
  Object.freeze({
    id: "PAL_TH_WETLAND_ATLAS_01",
    textureUrl: "/assets/pal/thai-nature/pal-thai-wetland-atlas.svg",
    dataUrl: "/assets/pal/thai-nature/pal-thai-wetland-atlas.json",
    frameCount: 3,
  }),
]);

export const PAL_001A_DELIVERED_ASSETS = Object.freeze([
  Object.freeze({
    assetId: "PAL_TH_NATURE_COCONUT_PALM_01",
    atlasId: "PAL_TH_NATURE_ATLAS_01",
    frame: "coconut_palm_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_BANANA_PLANT_01",
    atlasId: "PAL_TH_NATURE_ATLAS_01",
    frame: "banana_plant_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_MANGO_TREE_01",
    atlasId: "PAL_TH_NATURE_ATLAS_01",
    frame: "mango_tree_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_SUGAR_PALM_01",
    atlasId: "PAL_TH_NATURE_ATLAS_01",
    frame: "sugar_palm_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_BAMBOO_CLUSTER_01",
    atlasId: "PAL_TH_NATURE_ATLAS_01",
    frame: "bamboo_cluster_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_LOTUS_FLOWER_01",
    atlasId: "PAL_TH_WETLAND_ATLAS_01",
    frame: "lotus_flower_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_LOTUS_LEAF_CLUSTER_01",
    atlasId: "PAL_TH_WETLAND_ATLAS_01",
    frame: "lotus_leaf_cluster_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
  Object.freeze({
    assetId: "PAL_TH_NATURE_RICE_CLUMP_01",
    atlasId: "PAL_TH_WETLAND_ATLAS_01",
    frame: "rice_clump_01",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
  }),
]);

export function summarizePal001aDelivery() {
  return {
    standard: PAL_001A_DELIVERY_STANDARD,
    version: PAL_001A_DELIVERY_VERSION,
    atlasCount: PAL_001A_ATLASES.length,
    deliveredAssetCount: PAL_001A_DELIVERED_ASSETS.length,
    enabledAssetCount: PAL_001A_DELIVERED_ASSETS.filter(
      (record) => record.activationStatus === "ENABLED",
    ).length,
  };
}
