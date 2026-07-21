import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  BUILDERS_VALLEY_LAYER_CONTRACT,
} from "../assets/BuildersValleyAssetManifest.js";
import {
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const ASSET_ID = "BV_GROUND_TERRAIN_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_GROUND_ASSET_REPLACEMENT_V1";

function addPathRun(scene, container, start, end, count) {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  for (let index = 0; index < count; index += 1) {
    const ratio = count === 1 ? 0 : index / (count - 1);
    const x = start.x + (end.x - start.x) * ratio;
    const y = start.y + (end.y - start.y) * ratio;
    const frame = index === 0
      ? "path_edge_left"
      : index === count - 1
        ? "path_edge_right"
        : "path_center_01";
    const tile = scene.add.image(x, y, ASSET_ID, frame)
      .setRotation(angle - Math.PI / 2)
      .setAlpha(0.92);
    container.add(tile);
  }
}

function installGroundAssets(scene) {
  if (!scene.textures.exists(ASSET_ID)) {
    return {
      standard: STANDARD,
      status: "FALLBACK_ACTIVE",
      assetId: ASSET_ID,
      reason: "TEXTURE_UNAVAILABLE",
      gameplayGeometryChanged: false,
    };
  }

  const container = scene.add.container(0, 0).setDepth(BUILDERS_VALLEY_LAYER_CONTRACT.ground + 1);
  const base = scene.add.tileSprite(
    WORLD_WIDTH / 2,
    WORLD_HEIGHT / 2,
    WORLD_WIDTH,
    WORLD_HEIGHT,
    ASSET_ID,
    "grass_base_01",
  );
  container.add(base);

  const variation = scene.add.container(0, 0);
  const variationTiles = [
    [4, 4], [7, 7], [12, 3], [15, 20], [5, 25],
    [31, 5], [38, 9], [42, 23], [34, 27], [18, 7],
  ];
  variationTiles.forEach(([column, row], index) => {
    variation.add(scene.add.image(
      column * TILE_SIZE + TILE_SIZE / 2,
      row * TILE_SIZE + TILE_SIZE / 2,
      ASSET_ID,
      index % 2 === 0 ? "grass_base_02" : "wet_ground_01",
    ).setAlpha(index % 2 === 0 ? 0.72 : 0.42));
  });
  container.add(variation);

  const pathLayer = scene.add.container(0, 0).setDepth(-2);
  addPathRun(
    scene,
    pathLayer,
    { x: 6 * TILE_SIZE, y: 9 * TILE_SIZE },
    { x: STREAM.left - 18, y: 14 * TILE_SIZE },
    17,
  );
  addPathRun(
    scene,
    pathLayer,
    { x: STREAM.left + STREAM.width + 18, y: 14 * TILE_SIZE },
    { x: STREAM.left + STREAM.width + 5 * TILE_SIZE, y: 10 * TILE_SIZE },
    10,
  );

  const terrace = scene.add.container(0, 0).setDepth(-4);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      terrace.add(scene.add.image(
        STREAM.left + STREAM.width + 58 + column * TILE_SIZE,
        9 * TILE_SIZE + row * TILE_SIZE,
        ASSET_ID,
        "stone_terrace_01",
      ).setAlpha(0.88));
    }
  }

  scene.__terrainRiverFoundation?.paths?.setVisible(false);

  return {
    standard: STANDARD,
    status: "ASSET_ACTIVE",
    assetId: ASSET_ID,
    deliveredFrames: scene.textures.get(ASSET_ID).getFrameNames(),
    replacementScope: [
      "base grass material",
      "spawn-to-bridge path",
      "bridge-to-workshop path",
      "workshop stone terrace",
    ],
    fallbackSuppressed: ["terrain path graphics"],
    gameplayGeometryChanged: false,
    container,
    pathLayer,
    terrace,
  };
}

prototype.create = function createWithGroundProductionAssets() {
  originalCreate.call(this);

  const runtime = installGroundAssets(this);
  this.__groundAssetReplacement = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getGroundAssetReplacement = () => ({
    standard: runtime.standard,
    status: runtime.status,
    assetId: runtime.assetId,
    reason: runtime.reason,
    deliveredFrames: runtime.deliveredFrames ? [...runtime.deliveredFrames] : [],
    replacementScope: runtime.replacementScope ? [...runtime.replacementScope] : [],
    fallbackSuppressed: runtime.fallbackSuppressed ? [...runtime.fallbackSuppressed] : [],
    gameplayGeometryChanged: false,
  });
};
