import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BUILDERS_VALLEY_LAYER_CONTRACT } from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const ASSET_ID = "BV_WATER_RIVER_SHEET_01";
const STANDARD = "BUILDERS_VALLEY_PES_001C1B_WATER_ASSET_V2";
const FRAME_COUNT = 4;

function createRiverDetailOverlays(scene, geometry) {
  const container = scene.add
    .container(0, 0)
    .setDepth(BUILDERS_VALLEY_LAYER_CONTRACT.water + 5);
  const sprites = [];
  const samples = geometry.edgeSamples;

  // Keep the authored Graphics river as the continuous silhouette and use the
  // production sheet only for restrained moving surface detail. This avoids
  // visible seams and pinwheel patterns caused by rotating opaque square tiles.
  for (let index = 1; index < samples.length - 1; index += 2) {
    const sample = samples[index];
    const next = samples[Math.min(index + 1, samples.length - 1)];
    const drift = next.center - sample.center;
    const width = Math.max(54, sample.width - 34);
    const height = index < 4 ? 20 : 14;

    const sprite = scene.add
      .image(sample.center + drift * 0.18, sample.y, ASSET_ID, index % FRAME_COUNT)
      .setDisplaySize(width, height)
      .setAlpha(index < 4 ? 0.28 : 0.2)
      .setBlendMode("ADD");

    sprites.push(sprite);
    container.add(sprite);
  }

  const top = samples[0];
  const pool = samples[Math.min(5, samples.length - 1)];
  const gorgePool = scene.add
    .image(pool.center, pool.y + 15, ASSET_ID, 1)
    .setDisplaySize(Math.max(70, pool.width - 42), 18)
    .setAlpha(0.24)
    .setBlendMode("ADD");
  const waterfallLip = scene.add
    .image(top.center, 78, ASSET_ID, 2)
    .setDisplaySize(82, 12)
    .setAlpha(0.32)
    .setBlendMode("ADD");

  sprites.push(gorgePool, waterfallLip);
  container.add([gorgePool, waterfallLip]);

  return { container, sprites };
}

function installWaterAssetReplacement(scene) {
  const foundation = scene.__terrainRiverFoundation;
  const textureAvailable = scene.textures.exists(ASSET_ID);

  const runtime = {
    standard: STANDARD,
    assetId: ASSET_ID,
    status: textureAvailable && foundation ? "ASSET_ACTIVE" : "FALLBACK_ACTIVE",
    fallbackOwner: "BuildersValleyTerrainRiverPatch",
    compositionMode: "HYBRID_CONTINUOUS_BASE_WITH_ASSET_DETAIL",
    segmentCount: 0,
    frameCount: FRAME_COUNT,
    animationIntervalMs: 260,
    fallbackHidden: false,
    gameplayGeometryChanged: false,
  };

  if (textureAvailable && foundation) {
    const replacement = createRiverDetailOverlays(scene, foundation.geometry);

    runtime.segmentCount = replacement.sprites.length;
    runtime.container = replacement.container;
    runtime.sprites = replacement.sprites;
    runtime.frameIndex = 0;
    runtime.animationEvent = scene.time.addEvent({
      delay: runtime.animationIntervalMs,
      loop: true,
      callback: () => {
        runtime.frameIndex = (runtime.frameIndex + 1) % FRAME_COUNT;
        runtime.sprites.forEach((sprite, index) => {
          sprite.setFrame((runtime.frameIndex + index) % FRAME_COUNT);
          sprite.x += index % 2 === 0 ? 0.5 : -0.5;
        });
      },
    });
  }

  scene.__waterAssetReplacement = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getWaterAssetReplacement = () => ({
    standard: runtime.standard,
    assetId: runtime.assetId,
    packageStatus: runtime.status,
    compositionMode: runtime.compositionMode,
    segmentCount: runtime.segmentCount,
    frameCount: runtime.frameCount,
    animationIntervalMs: runtime.animationIntervalMs,
    fallbackOwner: runtime.fallbackOwner,
    fallbackHidden: runtime.fallbackHidden,
    gameplayGeometryChanged: false,
  });
}

prototype.create = function createWithWaterAssetReplacement() {
  originalCreate.call(this);
  installWaterAssetReplacement(this);
};
