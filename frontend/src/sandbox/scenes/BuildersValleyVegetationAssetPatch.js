import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const ASSET_ID = "BV_VEGETATION_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_PES_004A_VEGETATION_ASSET_REPLACEMENT_V1";

function addSprite(scene, container, frame, x, y, scale = 1, flipX = false, alpha = 1) {
  const sprite = scene.add.image(x, y, ASSET_ID, frame)
    .setScale(scale)
    .setFlipX(flipX)
    .setAlpha(alpha);
  container.add(sprite);
  return sprite;
}

function installVegetationAssetReplacement(scene) {
  const fallback = scene.__vegetationCompositionRuntime;
  if (!scene.textures.exists(ASSET_ID)) {
    return {
      standard: STANDARD,
      status: "FALLBACK_ACTIVE",
      assetId: ASSET_ID,
      reason: "TEXTURE_UNAVAILABLE",
      fallbackSuppressed: false,
      gameplayGeometryChanged: false,
    };
  }

  const midBack = scene.add.container(0, 0).setDepth(31);
  const foreground = scene.add.container(0, 0).setDepth(237);
  const frontForeground = scene.add.container(0, 0).setDepth(323);

  // Upper-left canopy: authored asymmetry with clear path corridor.
  addSprite(scene, midBack, "tree_broadleaf_01", 98, 116, 1.55);
  addSprite(scene, midBack, "tree_broadleaf_02", 218, 91, 1.26, true);
  addSprite(scene, midBack, "tree_broadleaf_01", 344, 145, 1.05);
  addSprite(scene, foreground, "shrub_01", 150, 242, 1.05);
  addSprite(scene, foreground, "shrub_02", 316, 270, 0.9, true);
  addSprite(scene, foreground, "flower_patch_01", 250, 303, 0.72);
  addSprite(scene, foreground, "moss_rock_01", 364, 224, 0.72);

  // Waterfall rim: retain a readable mouth and frame it with production silhouettes.
  addSprite(scene, midBack, "tree_broadleaf_02", STREAM.left - 84, 76, 1.02, true, 0.96);
  addSprite(scene, midBack, "tree_broadleaf_01", STREAM.left + STREAM.width + 86, 80, 1.08, false, 0.96);
  addSprite(scene, foreground, "moss_rock_01", STREAM.left - 48, 328, 0.82);
  addSprite(scene, foreground, "moss_rock_01", STREAM.left + STREAM.width + 48, 430, 0.76, true);

  // River-bank growth: alternating accents, never a continuous fence.
  [
    [STREAM.left - 42, 7.5 * TILE_SIZE, false],
    [STREAM.left + STREAM.width + 38, 10.5 * TILE_SIZE, true],
    [STREAM.left - 34, 20.5 * TILE_SIZE, true],
    [STREAM.left + STREAM.width + 44, 24.5 * TILE_SIZE, false],
  ].forEach(([x, y, flipX]) => addSprite(scene, foreground, "reeds_01", x, y, 0.62, flipX, 0.92));

  addSprite(scene, foreground, "shrub_01", STREAM.left - 74, 392, 0.72, true);
  addSprite(scene, foreground, "shrub_02", STREAM.left + STREAM.width + 64, 438, 0.68);
  addSprite(scene, foreground, "flower_patch_01", STREAM.left - 118, 596, 0.6, false, 0.94);

  // Front framing remains edge weighted and outside the central gameplay corridor.
  addSprite(scene, frontForeground, "foreground_cluster_01", 38, WORLD_HEIGHT - 18, 1.65, true, 0.94);
  addSprite(scene, frontForeground, "foreground_cluster_01", 184, WORLD_HEIGHT - 24, 1.18, false, 0.92);
  addSprite(scene, frontForeground, "foreground_cluster_01", WORLD_WIDTH - 42, WORLD_HEIGHT - 16, 1.58, false, 0.92);

  if (fallback?.objects) {
    fallback.objects.midBack.setVisible(false);
    fallback.objects.foreground.setVisible(false);
    fallback.objects.frontForeground.setVisible(false);
    fallback.status = "PRODUCTION_ASSET_ACTIVE";
  }

  return {
    standard: STANDARD,
    status: "ASSET_ACTIVE",
    assetId: ASSET_ID,
    deliveredFrames: scene.textures.get(ASSET_ID).getFrameNames(),
    compositionMode: "PRODUCTION_ATLAS_WITH_FOUNDATION_ZONE_AUTHORITY",
    replacementScope: [
      "upper-left canopy",
      "waterfall rim",
      "river-bank growth",
      "bridge approach accents",
      "front foreground framing",
    ],
    fallbackSuppressed: Boolean(fallback?.objects),
    productionObjectCount: midBack.length + foreground.length + frontForeground.length,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
    objects: { midBack, foreground, frontForeground },
  };
}

prototype.create = function createWithVegetationProductionAssets() {
  originalCreate.call(this);
  const runtime = installVegetationAssetReplacement(this);
  this.__vegetationAssetReplacement = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getVegetationAssetReplacement = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    assetId: runtime.assetId,
    reason: runtime.reason,
    deliveredFrames: runtime.deliveredFrames ? [...runtime.deliveredFrames] : [],
    compositionMode: runtime.compositionMode,
    replacementScope: runtime.replacementScope ? [...runtime.replacementScope] : [],
    fallbackSuppressed: Boolean(runtime.fallbackSuppressed),
    productionObjectCount: runtime.productionObjectCount ?? 0,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
};