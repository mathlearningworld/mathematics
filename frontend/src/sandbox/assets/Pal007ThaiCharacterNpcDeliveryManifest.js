export const PAL_007A_CHARACTER_NPC_DELIVERY_STANDARD =
  "MATH_LEARNING_WORLD_PAL_007A_THAI_CHARACTER_NPC_VISUAL_FOUNDATION_V1";

export const PAL_007A_CHARACTER_NPC_DELIVERY_VERSION = "PAL_007A_DELIVERY_V1";

export const PAL_007A_CHARACTER_NPC_ATLASES = Object.freeze([
  Object.freeze({
    id: "PAL_TH_CHARACTER_NPC_ATLAS_01",
    textureUrl: "/assets/pal/characters/pal-thai-character-npc-atlas.svg",
    dataUrl: "/assets/pal/characters/pal-thai-character-npc-atlas.json",
    frameCount: 5,
  }),
]);

export const PAL_007A_CHARACTER_NPC_ASSETS = Object.freeze([
  ["PAL_TH_NPC_CARPENTER_01", "carpenter_idle_south_01", "CARPENTER"],
  ["PAL_TH_NPC_FARMER_01", "farmer_idle_south_01", "FARMER"],
  ["PAL_TH_NPC_MERCHANT_01", "merchant_idle_south_01", "MERCHANT"],
  ["PAL_TH_NPC_ELDER_01", "elder_idle_south_01", "ELDER"],
  ["PAL_TH_NPC_CHILD_01", "child_idle_south_01", "CHILD"],
].map(([assetId, frame, visualRole]) => Object.freeze({
  assetId,
  pack: "PAL-007_CHARACTER_NPC",
  family: "CHARACTER_NPC",
  atlasId: "PAL_TH_CHARACTER_NPC_ATLAS_01",
  frame,
  visualRole,
  deliveryStatus: "DELIVERED",
  activationStatus: "DISABLED",
  animationStatus: "STATIC_IDLE_FOUNDATION",
  collisionPolicy: "NONE",
  interactionPolicy: "VISUAL_ONLY",
  aiPolicy: "DISABLED_UNTIL_NPC_RUNTIME_CONTRACT",
  dialoguePolicy: "DISABLED_UNTIL_DIALOGUE_CONTRACT",
  culturalReviewStatus: "FOUNDATION_APPROVED",
}));

export function summarizePal007aCharacterNpcDelivery() {
  return {
    standard: PAL_007A_CHARACTER_NPC_DELIVERY_STANDARD,
    version: PAL_007A_CHARACTER_NPC_DELIVERY_VERSION,
    atlasCount: PAL_007A_CHARACTER_NPC_ATLASES.length,
    deliveredAssetCount: PAL_007A_CHARACTER_NPC_ASSETS.length,
    enabledAssetCount: PAL_007A_CHARACTER_NPC_ASSETS.filter(
      (record) => record.activationStatus === "ENABLED",
    ).length,
    aiEnabledCount: PAL_007A_CHARACTER_NPC_ASSETS.filter(
      (record) => record.aiPolicy !== "DISABLED_UNTIL_NPC_RUNTIME_CONTRACT",
    ).length,
  };
}