import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BUILDERS_VALLEY_LAYER_CONTRACT } from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const ASSET_ID = "BV_WATER_RIVER_SHEET_01";
const STANDARD = "BUILDERS_VALLEY_PES_001C1B_WATER_ASSET_V1";
const FRAME_COUNT = 4;

function createRiverSegments(scene, geometry) {
  const container = scene.add.container(0, 0).setDepth(BUILDERS_VALLEY_LAYER_CONTRACT.water + 4);
  const sprites = [];
  const samples = geometry.edgeSamples;

  for (let index = 0; index < samples.length - 1; index += 1) {
    const current = samples[index];
    const next = samples[index + 1];
    const x = (current.center + next.center) / 2;
    const y = (current.y + next.y) / 2;
    const width = Math.max(32, (current.width + next.width) / 2 - 12);
    const height = Math.max(24, Math.hypot(next.center - current.center, next.y - current.y) + 8);
    const angle = Math.atan2(next.y - current.y, next.center - current.center) - Math.PI / 2;

    const sprite = scene.add
      .image(x, y, ASSET_ID, index % FRAME_COUNT)
      .setDisplaySize(width, height)
      .setRotation(angle)
      .setAlpha(index < 2 ? 0.95 : 1);

    sprites.push(sprite);
    container.add(sprite);
  }

  const top = samples[0];
  const pool = samples[Math.min(5, samples.length - 1)];
  const gorgePool = scene.add
    .image(pool.center, pool.y + 15, ASSET_ID, 1)
    .setDisplaySize(Math.max(82, pool.width - 18), 54)
    .setAlpha(0.9);
  const waterfallLip = scene.add
    .image(top.center, 76, ASSET_ID, 2)
    .setDisplaySize(96, 28)
    .setAlpha(0.86);

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
    segmentCount: 0,
    frameCount: FRAME_COUNT,
    animationIntervalMs: 220,
    fallbackHidden: false,
    gameplayGeometryChanged: false,
  };

  if (textureAvailable && foundation) {
    const replacement = createRiverSegments(scene, foundation.geometry);
    foundation.water?.setVisible(false);

    runtime.segmentCount = replacement.sprites.length;
    runtime.fallbackHidden = true;
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
