import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const ASSET_ID = "BV_EFFECT_WATER_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_PES_005B_WATER_EFFECTS_ASSET_V1";

function addEffect(scene, frame, x, y, scale, depth, alpha = 1, flipX = false) {
  return scene.add.image(x, y, ASSET_ID, frame)
    .setScale(scale)
    .setDepth(depth)
    .setAlpha(alpha)
    .setFlipX(flipX)
    .setBlendMode("ADD");
}

function installWaterEffectsAsset(scene) {
  if (!scene.textures.exists(ASSET_ID)) {
    return {
      standard: STANDARD,
      status: "FALLBACK_ACTIVE",
      assetId: ASSET_ID,
      reason: "TEXTURE_UNAVAILABLE",
      fallbackSuppressed: false,
      collisionObjectsAdded: 0,
      gameplayGeometryChanged: false,
    };
  }

  const centerX = STREAM.left + STREAM.width / 2;
  const lipY = 304;
  const impactY = 330;

  const effects = [
    addEffect(scene, "waterfall_lip_foam", centerX, lipY, 1.65, 181, 0.86),
    addEffect(scene, "impact_foam", centerX, impactY, 1.5, 182, 0.8),
    addEffect(scene, "mist_cloud", centerX - 32, impactY - 16, 1.25, 183, 0.38),
    addEffect(scene, "mist_cloud", centerX + 36, impactY - 8, 1.05, 183, 0.3, true),
    addEffect(scene, "side_splash_left", STREAM.left + 18, impactY + 10, 0.8, 182, 0.7),
    addEffect(scene, "side_splash_right", STREAM.left + STREAM.width - 18, impactY + 12, 0.8, 182, 0.7),
    addEffect(scene, "river_ripple", centerX - 14, 430, 1.1, 179, 0.34),
    addEffect(scene, "river_ripple", centerX + 20, 520, 0.86, 179, 0.26, true),
  ];

  effects.forEach((effect, index) => {
    effect.setData("anchorX", effect.x);
    effect.setData("anchorY", effect.y);
    effect.setData("baseAlpha", effect.alpha);
    effect.setData("phase", index * 0.85);
  });

  const fallbackWaterFx = scene.__productionDepthPassRuntime?.objects?.waterFx ?? [];
  fallbackWaterFx.forEach((item) => item.setVisible(false));

  let elapsed = 0;
  const updateHandler = (_time, delta) => {
    elapsed += delta / 1000;
    effects.forEach((effect, index) => {
      const phase = effect.getData("phase");
      const anchorX = effect.getData("anchorX");
      const anchorY = effect.getData("anchorY");
      const baseAlpha = effect.getData("baseAlpha");
      const motionScale = index < 6 ? 1 : 0.45;
      effect.x = anchorX + Math.sin(elapsed * 0.7 + phase) * 1.8 * motionScale;
      effect.y = anchorY + Math.cos(elapsed * 0.55 + phase) * 1.1 * motionScale;
      effect.alpha = Math.max(0.12, baseAlpha + Math.sin(elapsed * 0.9 + phase) * 0.055);
    });
  };

  scene.events.on("update", updateHandler);
  scene.events.once("shutdown", () => scene.events.off("update", updateHandler));

  return {
    standard: STANDARD,
    status: "ASSET_ACTIVE",
    assetId: ASSET_ID,
    deliveredFrames: scene.textures.get(ASSET_ID).getFrameNames(),
    productionPhase: "PES-005B",
    compositionMode: "FOCAL_WATERFALL_EFFECTS_WITH_RESTRAINED_RIVER_ACCENTS",
    animationPolicy: "BOUNDED_ANCHOR_OSCILLATION",
    effectCount: effects.length,
    fallbackSuppressed: fallbackWaterFx.length > 0,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
    objects: effects,
  };
}

prototype.create = function createWithProductionWaterEffects() {
  originalCreate.call(this);
  const runtime = installWaterEffectsAsset(this);
  this.__waterEffectsAssetRuntime = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getWaterEffectsAssetReplacement = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    assetId: runtime.assetId,
    reason: runtime.reason,
    deliveredFrames: runtime.deliveredFrames ? [...runtime.deliveredFrames] : [],
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    animationPolicy: runtime.animationPolicy,
    effectCount: runtime.effectCount ?? 0,
    fallbackSuppressed: Boolean(runtime.fallbackSuppressed),
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
};
