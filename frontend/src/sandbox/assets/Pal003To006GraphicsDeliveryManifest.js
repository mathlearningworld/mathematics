export const PAL_003_TO_006_GRAPHICS_STANDARD =
  "MATH_LEARNING_WORLD_PAL_003_TO_006_GRAPHICS_DELIVERY_V1";

export const PAL_003_TO_006_ATLASES = Object.freeze([
  Object.freeze({
    pack: "PAL-003A_THAI_PROPS",
    id: "PAL_TH_PROPS_ATLAS_01",
    textureUrl: "/assets/pal/thai-props/pal-thai-props-atlas.svg",
    dataUrl: "/assets/pal/thai-props/pal-thai-props-atlas.json",
    frames: Object.freeze(["water_jar_01", "woven_basket_01", "mortar_pestle_01", "sticky_rice_basket_01"]),
  }),
  Object.freeze({
    pack: "PAL-004A_GROUND_DECORATION",
    id: "PAL_GROUND_DECORATION_ATLAS_01",
    textureUrl: "/assets/pal/ground-decoration/pal-ground-decoration-atlas.svg",
    dataUrl: "/assets/pal/ground-decoration/pal-ground-decoration-atlas.json",
    frames: Object.freeze(["grass_clump_01", "wildflower_cluster_01", "pebble_scatter_01", "cart_track_01"]),
  }),
  Object.freeze({
    pack: "PAL-005A_RIVER_EDGE",
    id: "PAL_RIVER_EDGE_ATLAS_01",
    textureUrl: "/assets/pal/river-edge/pal-river-edge-atlas.svg",
    dataUrl: "/assets/pal/river-edge/pal-river-edge-atlas.json",
    frames: Object.freeze(["reed_cluster_01", "lotus_bank_cluster_01", "driftwood_01", "mossy_bank_rocks_01"]),
  }),
  Object.freeze({
    pack: "PAL-006A_VILLAGE_LIFE",
    id: "PAL_VILLAGE_LIFE_ATLAS_01",
    textureUrl: "/assets/pal/village-life/pal-village-life-atlas.svg",
    dataUrl: "/assets/pal/village-life/pal-village-life-atlas.json",
    frames: Object.freeze(["wood_cart_01", "woven_mat_roll_01", "drying_rack_01", "hay_stack_01"]),
  }),
]);

export const PAL_003_TO_006_DELIVERIES = Object.freeze(
  PAL_003_TO_006_ATLASES.flatMap((atlas) =>
    atlas.frames.map((frame) =>
      Object.freeze({
        assetId: `${atlas.id}:${frame}`,
        pack: atlas.pack,
        atlasId: atlas.id,
        frame,
        deliveryStatus: "DELIVERED",
        activationStatus: "DISABLED",
        collisionPolicy: "NONE",
        interactionPolicy: "DECORATIVE_ONLY",
        culturalReviewStatus: "FOUNDATION_APPROVED",
      }),
    ),
  ),
);

export function summarizePal003To006GraphicsDelivery() {
  return {
    standard: PAL_003_TO_006_GRAPHICS_STANDARD,
    atlasCount: PAL_003_TO_006_ATLASES.length,
    deliveredAssetCount: PAL_003_TO_006_DELIVERIES.length,
    enabledAssetCount: PAL_003_TO_006_DELIVERIES.filter(
      (record) => record.activationStatus === "ENABLED",
    ).length,
    packs: Object.freeze(PAL_003_TO_006_ATLASES.map((atlas) => atlas.pack)),
  };
}
