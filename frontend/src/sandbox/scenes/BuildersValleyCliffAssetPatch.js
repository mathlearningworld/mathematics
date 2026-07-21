import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BUILDERS_VALLEY_LAYER_CONTRACT } from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const ASSET_ID = "BV_CLIFF_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_PES_002A_RIVER_KIT_CLIFF_ASSET_V1";
const FACE_FRAMES = Object.freeze(["cliff_face_01", "cliff_face_02"]);
const CAP_FRAMES = Object.freeze(["cliff_cap_01", "cliff_cap_02"]);
const ROCK_FRAMES = Object.freeze(["gorge_rock_01", "gorge_rock_02"]);
const SHELF_FRAMES = Object.freeze(["shore_shelf_01", "shore_shelf_02"]);

function addImage(scene, container, x, y, frame, width, height, alpha = 1) {
  const image = scene.add
    .image(Math.round(x), Math.round(y), ASSET_ID, frame)
    .setDisplaySize(Math.round(width), Math.round(height))
    .setAlpha(alpha);
  container.add(image);
  return image;
}

function createCliffDetails(scene, geometry) {
  const container = scene.add.container(0, 0).setDepth(BUILDERS_VALLEY_LAYER_CONTRACT.cliff + 3);
  const sprites = [];

  geometry.edgeSamples.forEach((sample, index) => {
    if (index < 2 || index % 3 !== 0) return;

    const frameIndex = Math.floor(index / 3) % 2;
    const faceWidth = Math.max(20, Math.min(34, sample.width * 0.16));
    const faceHeight = index < 7 ? 29 : 22;
    const inset = index < 7 ? 5 : 2;

    sprites.push(
      addImage(
        scene,
        container,
        sample.left - inset,
        sample.y + 3,
        FACE_FRAMES[frameIndex],
        faceWidth,
        faceHeight,
        0.78,
      ),
      addImage(
        scene,
        container,
        sample.right + inset,
        sample.y + 3,
        FACE_FRAMES[(frameIndex + 1) % 2],
        faceWidth,
        faceHeight,
        0.78,
      ).setFlipX(true),
    );

    if (index % 6 === 0) {
      sprites.push(
        addImage(
          scene,
          container,
          sample.left - 3,
          sample.y - 8,
          CAP_FRAMES[frameIndex],
          27,
          18,
          0.88,
        ),
        addImage(
          scene,
          container,
          sample.right + 3,
          sample.y - 8,
          CAP_FRAMES[(frameIndex + 1) % 2],
          27,
          18,
          0.88,
        ).setFlipX(true),
      );
    }
  });

  const top = geometry.edgeSamples[0];
  const pool = geometry.edgeSamples[Math.min(5, geometry.edgeSamples.length - 1)];
  const gorgeRocks = [
    [top.center - 68, 87, ROCK_FRAMES[0], 40, 34],
    [top.center + 69, 91, ROCK_FRAMES[1], 42, 35],
    [pool.left - 12, pool.y + 25, ROCK_FRAMES[1], 32, 28],
    [pool.right + 12, pool.y + 22, ROCK_FRAMES[0], 34, 29],
  ];

  gorgeRocks.forEach(([x, y, frame, width, height]) => {
    sprites.push(addImage(scene, container, x, y, frame, width, height, 0.92));
  });

  [0.28, 0.55, 0.82].forEach((progress, index) => {
    const sampleIndex = Math.min(
      geometry.edgeSamples.length - 1,
      Math.round(progress * (geometry.edgeSamples.length - 1)),
    );
    const sample = geometry.edgeSamples[sampleIndex];
    sprites.push(
      addImage(scene, container, sample.left + 2, sample.y + 10, SHELF_FRAMES[index % 2], 24, 16, 0.68),
      addImage(scene, container, sample.right - 2, sample.y + 10, SHELF_FRAMES[(index + 1) % 2], 24, 16, 0.68)
        .setFlipX(true),
    );
  });

  return { container, sprites };
}

function installCliffAssetReplacement(scene) {
  const foundation = scene.__terrainRiverFoundation;
  const textureAvailable = scene.textures.exists(ASSET_ID);
  const runtime = {
    standard: STANDARD,
    assetId: ASSET_ID,
    status: textureAvailable && foundation ? "ASSET_ACTIVE" : "FALLBACK_ACTIVE",
    compositionMode: "HYBRID_FOUNDATION_WITH_PRODUCTION_CLIFF_DETAIL",
    spriteCount: 0,
    foundationRetained: true,
    gameplayGeometryChanged: false,
  };

  if (textureAvailable && foundation?.geometry) {
    const replacement = createCliffDetails(scene, foundation.geometry);
    runtime.container = replacement.container;
    runtime.sprites = replacement.sprites;
    runtime.spriteCount = replacement.sprites.length;
  }

  scene.__cliffAssetReplacement = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getCliffAssetReplacement = () => ({
    standard: runtime.standard,
    assetId: runtime.assetId,
    packageStatus: runtime.status,
    compositionMode: runtime.compositionMode,
    spriteCount: runtime.spriteCount,
    foundationRetained: runtime.foundationRetained,
    gameplayGeometryChanged: false,
  });
}

prototype.create = function createWithCliffAssetReplacement() {
  originalCreate.call(this);
  installCliffAssetReplacement(this);
};
