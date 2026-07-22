import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const ASSET_ID = "BV_EFFECT_WATER_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_PES_005B2_WATER_EFFECTS_FINAL_CALIBRATION_V1";

function addEffect(
  scene,
  frame,
  x,
  y,
  scale,
  depth,
  alpha = 1,
  flipX = false,
  blendMode = "NORMAL",
  tint = 0xb9edf2,
) {
  return scene.add.image(x, y, ASSET_ID, frame)
    .setScale(scale)
    .setDepth(depth)
    .setAlpha(alpha)
    .setFlipX(flipX)
    .setTint(tint)
    .setBlendMode(blendMode);
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
  const impactY = 318;

  const effects = [
    addEffect(scene, "waterfall_lip_foam", centerX, lipY, 0.92, 181, 0.42, false, "NORMAL", 0xa9e4eb),

    // Break the impact into restrained, uneven clusters instead of one bright solid mass.
    addEffect(scene, "impact_foam", centerX - 16, impactY + 1, 0.42, 182, 0.29, false, "NORMAL", 0xb3e9ee),
    addEffect(scene, "impact_foam", centerX + 10, impactY - 2, 0.36, 182, 0.25, true, "NORMAL", 0xa9e0e8),
    addEffect(scene, "impact_foam", centerX + 25, impactY + 4, 0.24, 182, 0.18, false, "NORMAL", 0x9dd8e1),

    // Mist is broad, soft and subordinate to the waterfall body.
    addEffect(scene, "mist_cloud", centerX - 28, impactY - 12, 0.88, 183, 0.09, false, "NORMAL", 0xa8dfe8),
    addEffect(scene, "mist_cloud", centerX + 35, impactY - 5, 0.68, 183, 0.07, true, "NORMAL", 0x9ed7e2),

    // Side splashes remain asymmetric and low contrast.
    addEffect(scene, "side_splash_left", STREAM.left + 28, impactY + 6, 0.35, 182, 0.22, false, "NORMAL", 0xa9e2e9),
    addEffect(scene, "side_splash_right", STREAM.left + STREAM.width - 20, impactY + 14, 0.27, 182, 0.17, false, "NORMAL", 0x9ed8e2),

    // River accents should be noticed only after the focal waterfall area.
    addEffect(scene, "river_ripple", centerX - 9, 404, 0.46, 179, 0.1, false, "NORMAL", 0x8fd0dd),
    addEffect(scene, "river_ripple", centerX + 17, 490, 0.34, 179, 0.07, true, "NORMAL", 0x86c8d7),
  ];

  effects.forEach((effect, index) => {
    effect.setData("anchorX", effect.x);
    effect.setData("anchorY", effect.y);
    effect.setData("baseAlpha", effect.alpha);
    effect.setData("phase", index * 0.87);
    effect.setData("motionScale", index === 0 ? 0.3 : index < 4 ? 0.42 : index < 8 ? 0.58 : 0.2);
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
      const wave = Math.sin(elapsed * 0.56 + phase);
      const easedWave = wave * (0.68 + 0.32 * Math.abs(wave));
      effect.x = anchorX + easedWave * 0.9 * motionScale;
      effect.y = anchorY + Math.cos(elapsed * 0.44 + phase) * 0.52 * motionScale;
      effect.alpha = Math.max(0.035, baseAlpha + Math.sin(elapsed * 0.66 + phase) * 0.014);
    });
  };

  scene.events.on("update", updateHandler);
  scene.events.once("shutdown", () => scene.events.off("update", updateHandler));

  return {
    standard: STANDARD,
    status: "ASSET_ACTIVE",
    assetId: ASSET_ID,
    deliveredFrames: scene.textures.get(ASSET_ID).getFrameNames(),
    productionPhase: "PES-005B.2",
    compositionMode: "FINAL_RESTRAINED_MULTI_CLUSTER_WATERFALL_EFFECTS",
    animationPolicy: "BOUNDED_SOFT_EASED_ANCHOR_OSCILLATION",
    calibrationPolicy: "SMALLER_CLUSTERED_CYAN_TINTED_SOFT_EDGE_EFFECTS",
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