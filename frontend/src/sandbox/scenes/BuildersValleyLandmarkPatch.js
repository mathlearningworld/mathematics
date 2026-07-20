import { BuildersValleyScene } from "./BuildersValleyScene.js";
import landmarkPackUrl from "../../../assets/builders-valley/environment/builders-valley-environment-landmark-pack-v1.svg?url";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";

const TEXTURE_KEY = "builders-valley-environment-landmark-pack-v1";
const prototype = BuildersValleyScene.prototype;
const originalPreload = prototype.preload;
const originalCreate = prototype.create;

const FRAMES = Object.freeze({
  bridge: { x: 8, y: 8, width: 120, height: 72 },
  workbench: { x: 140, y: 10, width: 104, height: 72 },
  crate: { x: 12, y: 112, width: 60, height: 50 },
  barrel: { x: 76, y: 112, width: 56, height: 52 },
  lantern: { x: 142, y: 108, width: 64, height: 72 },
  dirtPath: { x: 202, y: 112, width: 44, height: 44 },
  cliff: { x: 8, y: 184, width: 112, height: 56 },
  grassDetails: { x: 136, y: 184, width: 112, height: 56 },
});

function registerFrames(scene) {
  const texture = scene.textures.get(TEXTURE_KEY);
  if (!texture || texture.key === "__MISSING") return false;

  Object.entries(FRAMES).forEach(([name, frame]) => {
    if (!texture.has(name)) {
      texture.add(name, 0, frame.x, frame.y, frame.width, frame.height);
    }
  });
  return true;
}

function addLandmark(scene, frame, x, y, options = {}) {
  const image = scene.add.image(x, y, TEXTURE_KEY, frame);
  image.setOrigin(options.originX ?? 0.5, options.originY ?? 1);
  image.setDepth(options.depth ?? 80 + Math.floor(y));
  image.setScale(options.scaleX ?? options.scale ?? 1, options.scaleY ?? options.scale ?? 1);
  image.setAlpha(options.alpha ?? 1);
  image.setData({
    assetId: options.assetId ?? frame,
    decorative: true,
    landmarkPack: "BUILDERS_VALLEY_ENVIRONMENT_LANDMARK_PACK_V1",
  });
  return image;
}

function composeLandmarks(scene) {
  if (scene.__environmentLandmarks || !registerFrames(scene)) return;

  const riverCenterX = STREAM.left + STREAM.width / 2;
  const bridgeY = 14 * TILE_SIZE;

  const landmarks = [];

  // Primary landmark: a bridge spanning the stream. It is decorative in this
  // slice so the existing collision and placement contracts stay unchanged.
  landmarks.push(
    addLandmark(scene, "bridge", riverCenterX, bridgeY + 24, {
      assetId: "BV_BRIDGE_WOOD_MODULE_01",
      scaleX: 1.72,
      scaleY: 1.08,
      depth: 150 + bridgeY,
    }),
  );

  // Builder workshop cluster on the east bank.
  landmarks.push(
    addLandmark(scene, "workbench", STREAM.left + STREAM.width + 96, bridgeY - 40, {
      assetId: "BV_WORKBENCH_01",
      scale: 1.08,
    }),
    addLandmark(scene, "crate", STREAM.left + STREAM.width + 38, bridgeY + 6, {
      assetId: "BV_CRATE_01",
      scale: 0.92,
    }),
    addLandmark(scene, "barrel", STREAM.left + STREAM.width + 142, bridgeY + 12, {
      assetId: "BV_BARREL_01",
      scale: 0.92,
    }),
  );

  // Lanterns visually mark both bridge entrances.
  landmarks.push(
    addLandmark(scene, "lantern", STREAM.left - 34, bridgeY - 16, {
      assetId: "BV_LANTERN_POST_01_WEST",
      scale: 0.82,
    }),
    addLandmark(scene, "lantern", STREAM.left + STREAM.width + 34, bridgeY - 16, {
      assetId: "BV_LANTERN_POST_01_EAST",
      scale: 0.82,
    }),
  );

  // A light dirt approach gives the bridge a readable destination without
  // changing walkability or world rules.
  [-4, -3, -2, -1, 0, 1, 2, 3].forEach((offset) => {
    const x = riverCenterX + offset * 44;
    if (x > STREAM.left - 150 && x < STREAM.left + STREAM.width + 190) {
      landmarks.push(
        addLandmark(scene, "dirtPath", x, bridgeY + 38, {
          assetId: `BV_DIRT_PATH_TILE_01_${offset + 4}`,
          originY: 0.5,
          depth: 18,
          alpha: 0.94,
        }),
      );
    }
  });

  // Background framing assets make the field feel authored while staying
  // outside the core collect/place loop.
  landmarks.push(
    addLandmark(scene, "cliff", 13 * TILE_SIZE, 4 * TILE_SIZE, {
      assetId: "BV_CLIFF_EDGE_01_NORTHWEST",
      originX: 0,
      scale: 1.1,
      depth: 24,
    }),
    addLandmark(scene, "grassDetails", 10 * TILE_SIZE, 20 * TILE_SIZE, {
      assetId: "BV_GRASS_DETAILS_01_WEST",
      originX: 0.5,
      scale: 1.05,
      depth: 20,
      alpha: 0.9,
    }),
    addLandmark(scene, "grassDetails", 34 * TILE_SIZE, 22 * TILE_SIZE, {
      assetId: "BV_GRASS_DETAILS_01_EAST",
      originX: 0.5,
      scale: 0.9,
      depth: 20,
      alpha: 0.86,
    }),
  );

  scene.__environmentLandmarks = landmarks;

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.landmarkPack = "BUILDERS_VALLEY_ENVIRONMENT_LANDMARK_PACK_V1";
    window.__BUILDERS_VALLEY__.getLandmarks = () =>
      landmarks.map((landmark) => ({
        assetId: landmark.getData("assetId"),
        x: landmark.x,
        y: landmark.y,
      }));
  }
}

prototype.preload = function preloadEnvironmentLandmarks() {
  originalPreload?.call(this);
  if (!this.textures.exists(TEXTURE_KEY)) {
    this.load.svg(TEXTURE_KEY, landmarkPackUrl, { width: 256, height: 256 });
  }
};

prototype.create = function createWithEnvironmentLandmarks() {
  originalCreate.call(this);
  composeLandmarks(this);
};
