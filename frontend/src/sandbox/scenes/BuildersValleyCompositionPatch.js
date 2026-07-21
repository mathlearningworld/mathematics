import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE, VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const CAMERA = Object.freeze({
  projection: "ORTHOGRAPHIC_2D",
  referenceViewport: Object.freeze({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }),
  zoom: 0.9,
  deadzone: Object.freeze({ width: 288, height: 184 }),
  followLerp: Object.freeze({ x: 0.12, y: 0.12 }),
});

const COMPOSITION = Object.freeze({
  waterfall: Object.freeze({
    x: STREAM.left + STREAM.width / 2,
    y: 18,
  }),
  bridge: Object.freeze({
    x: STREAM.left + STREAM.width / 2,
    y: 14 * TILE_SIZE,
  }),
  workshop: Object.freeze({
    x: STREAM.left + STREAM.width + 130,
    y: 10 * TILE_SIZE,
  }),
});

function applyCameraAuthority(scene) {
  const camera = scene.cameras.main;

  camera.setZoom(CAMERA.zoom);
  camera.setDeadzone(CAMERA.deadzone.width, CAMERA.deadzone.height);
  camera.startFollow(
    scene.player,
    true,
    CAMERA.followLerp.x,
    CAMERA.followLerp.y,
  );
}

function applyCompositionBlockout(scene) {
  const slice = scene.__heroVisualSlice;
  if (!slice) return;

  slice.waterfall?.setPosition(COMPOSITION.waterfall.x, COMPOSITION.waterfall.y);
  slice.bridge?.setPosition(0, COMPOSITION.bridge.y);
  slice.workshop?.setPosition(COMPOSITION.workshop.x, COMPOSITION.workshop.y);
}

prototype.create = function createWithProductionComposition() {
  originalCreate.call(this);

  applyCameraAuthority(this);
  applyCompositionBlockout(this);

  this.__productionComposition = {
    standard: "BUILDERS_VALLEY_PES_001A_COMPOSITION_BLOCKOUT_V1",
    camera: CAMERA,
    landmarks: COMPOSITION,
    gameplayGeometryChanged: false,
  };

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getProductionComposition = () => ({
      standard: this.__productionComposition.standard,
      camera: {
        projection: CAMERA.projection,
        referenceViewport: { ...CAMERA.referenceViewport },
        zoom: CAMERA.zoom,
        deadzone: { ...CAMERA.deadzone },
        followLerp: { ...CAMERA.followLerp },
      },
      landmarks: {
        waterfall: { ...COMPOSITION.waterfall },
        bridge: { ...COMPOSITION.bridge },
        workshop: { ...COMPOSITION.workshop },
      },
      visibleWorldAtReferenceViewport: {
        width: Math.round(VIEWPORT_WIDTH / CAMERA.zoom),
        height: Math.round(VIEWPORT_HEIGHT / CAMERA.zoom),
      },
      gameplayGeometryChanged: false,
    });
  }
};
