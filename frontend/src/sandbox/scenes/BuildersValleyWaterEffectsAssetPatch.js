import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const ASSET_ID = "BV_EFFECT_WATER_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_PES_005B1_WATER_EFFECTS_VISUAL_CALIBRATION_V1";

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
  const lipY = 306;
  const impactY = 322;

  const effects = [
    addEffect(scene, "waterfall_lip_foam", centerX, lipY, 1.08, 181, 0.55),
    addEffect(scene, "impact_foam", centerX + 2, impactY, 0.78, 182, 0.46),
    addEffect(scene, "mist_cloud", centerX - 24, impactY - 10, 0.94, 183, 0.16),
    addEffect(scene, "mist_cloud", centerX + 30, impactY - 3, 0.76, 183, 0.12, true),
    addEffect(scene, "side_splash_left", STREAM.left + 26, impactY + 4, 0.46, 182, 0.34),
    addEffect(scene, "side_splash_right", STREAM.left + STREAM.width - 22, impactY + 13, 0.38, 182, 0.28),
    addEffect(scene, "river_ripple", centerX - 10, 408, 0.58, 179, 0.16),
    addEffect(scene, "river_ripple", centerX + 18, 498, 0.44, 179, 0.11, true),
  ];

  effects.forEach((effect, index) => {
    effect.setData("anchorX", effect.x);
    effect.setData("anchorY", effect.y);
    effect.setData("baseAlpha", effect.alpha);
    effect.setData("phase", index * 0.93);
    effect.setData("motionScale", index < 2 ? 0.52 : index < 6 ? 0.72 : 0.25);
  });

  const fallbackWaterFx = scene.__productionDepthPassRuntime?.objects?.waterFx ?? [];
  fallbackWaterFx.forEach((item) => item.setVisible(false));

  let elapsed = 0;
  const updateHandler = (_time, delta) => {
    elapsed += delta / 1000;
    effects.forEach((effect) => {
      const phase = effect.getData("phase");
      const anchorX = effect.getData("anchorX");
      const anchorY = effect.getData("anchorY");
      const baseAlpha = effect.getData("baseAlpha");
      const motionScale = effect.getData("motionScale");
      const wave = Math.sin(elapsed * 0.62 + phase);
      const easedWave = wave * (0.72 + 0.28 * Math.abs(wave));
      effect.x = anchorX + easedWave * 1.2 * motionScale;
      effect.y = anchorY + Math.cos(elapsed * 0.48 + phase) * 0.72 * motionScale;
      effect.alpha = Math.max(0.06, baseAlpha + Math.sin(elapsed * 0.74 + phase) * 0.024);
    });
  };

  scene.events.on("update", updateHandler);
  scene.events.once("shutdown", () => scene.events.off("update", updateHandler));

  return {
    standard: STANDARD,
    status: "ASSET_ACTIVE",
    assetId: ASSET_ID,
    deliveredFrames: scene.textures.get(ASSET_ID).getFrameNames(),
    productionPhase: "PES-005B.1",
    compositionMode: "RESTRAINED_FOCAL_WATERFALL_EFFECTS",
    animationPolicy: "BOUNDED_EASED_ANCHOR_OSCILLATION",
    calibrationPolicy: "REDUCED_SCALE_ALPHA_BRIGHTNESS_AND_SYMMETRY",
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
    calibrationPolicy: runtime.calibrationPolicy,
    effectCount: runtime.effectCount ?? 0,
    fallbackSuppressed: Boolean(runtime.fallbackSuppressed),
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
};