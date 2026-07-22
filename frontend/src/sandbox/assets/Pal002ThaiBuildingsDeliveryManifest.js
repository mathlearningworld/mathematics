export const PAL_002A_DELIVERY_STANDARD =
  "MATH_LEARNING_WORLD_PAL_002A_THAI_BUILDINGS_DECORATIVE_DELIVERY_V1";

export const PAL_002A_DELIVERY_VERSION = "PAL_002A_DELIVERY_V1";

export const PAL_002A_ATLASES = Object.freeze([
  Object.freeze({
    id: "PAL_TH_BUILDINGS_ATLAS_01",
    textureUrl: "/assets/pal/thai-buildings/pal-thai-buildings-atlas.svg",
    dataUrl: "/assets/pal/thai-buildings/pal-thai-buildings-atlas.json",
    frameCount: 4,
  }),
]);

export const PAL_002A_DELIVERED_ASSETS = Object.freeze([
  Object.freeze({
    assetId: "PAL_TH_BUILDING_RAISED_TEAK_HOUSE_01",
    pack: "PAL-002_THAI_BUILDINGS",
    family: "HOUSE",
    atlasId: "PAL_TH_BUILDINGS_ATLAS_01",
    frame: "raised_teak_house_01",
    visualRole: "raised rural Thai house and village residence",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
    collisionPolicy: "NONE",
    interactionPolicy: "DECORATIVE_ONLY",
    culturalReviewStatus: "FOUNDATION_APPROVED",
  }),
  Object.freeze({
    assetId: "PAL_TH_BUILDING_WATERSIDE_SHOP_01",
    pack: "PAL-002_THAI_BUILDINGS",
    family: "SHOP",
    atlasId: "PAL_TH_BUILDINGS_ATLAS_01",
    frame: "waterside_shop_01",
    visualRole: "canal-side shop and river settlement frontage",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
    collisionPolicy: "NONE",
    interactionPolicy: "DECORATIVE_ONLY",
    culturalReviewStatus: "FOUNDATION_APPROVED",
  }),
  Object.freeze({
    assetId: "PAL_TH_BUILDING_MARKET_STALL_01",
    pack: "PAL-002_THAI_BUILDINGS",
    family: "MARKET",
    atlasId: "PAL_TH_BUILDINGS_ATLAS_01",
    frame: "market_stall_01",
    visualRole: "open-air Thai market stall and colorful commerce accent",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
    collisionPolicy: "NONE",
    interactionPolicy: "DECORATIVE_ONLY",
    culturalReviewStatus: "FOUNDATION_APPROVED",
  }),
  Object.freeze({
    assetId: "PAL_TH_BUILDING_RICE_BARN_01",
    pack: "PAL-002_THAI_BUILDINGS",
    family: "AGRICULTURAL_BUILDING",
    atlasId: "PAL_TH_BUILDINGS_ATLAS_01",
    frame: "rice_barn_01",
    visualRole: "raised rice storage barn and farm landmark",
    deliveryStatus: "DELIVERED",
    activationStatus: "DISABLED",
    collisionPolicy: "NONE",
    interactionPolicy: "DECORATIVE_ONLY",
    culturalReviewStatus: "FOUNDATION_APPROVED",
  }),
]);

export function summarizePal002aDelivery() {
  return {
    standard: PAL_002A_DELIVERY_STANDARD,
    version: PAL_002A_DELIVERY_VERSION,
    atlasCount: PAL_002A_ATLASES.length,
    deliveredAssetCount: PAL_002A_DELIVERED_ASSETS.length,
    enabledAssetCount: PAL_002A_DELIVERED_ASSETS.filter(
      (record) => record.activationStatus === "ENABLED",
    ).length,
    collisionObjectsAdded: 0,
    gameplayMutation: false,
  };
}
