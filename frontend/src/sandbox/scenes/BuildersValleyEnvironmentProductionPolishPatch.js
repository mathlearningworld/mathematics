import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PES_005C1_PRODUCTION_POLISH_CALIBRATION_V1";

const PASSES = Object.freeze([
  Object.freeze({ id: "ground-noise-reduction", status: "ACTIVE", purpose: "retain broad terrain variation while removing scattered micro-noise" }),
  Object.freeze({ id: "hud-safe-foreground-cleanup", status: "ACTIVE", purpose: "keep the lower HUD corridor visually quiet and readable" }),
  Object.freeze({ id: "workshop-clutter-balance", status: "ACTIVE", purpose: "concentrate operational traces around authored work zones" }),
  Object.freeze({ id: "lower-river-edge-cleanup", status: "ACTIVE", purpose: "simplify lower-bank accents into a restrained edge rhythm" }),
  Object.freeze({ id: "global-value-calibration", status: "ACTIVE", purpose: "reduce empty-field brightness and preserve waterfall bridge workshop focus" }),
]);

function drawGroundCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(-21);

  graphics.fillStyle(0x4a8144, 0.13);
  [
    [9 * TILE_SIZE, 5 * TILE_SIZE, 126, 46],
    [16 * TILE_SIZE, 11 * TILE_SIZE, 102, 36],
    [7 * TILE_SIZE, 20 * TILE_SIZE, 118, 40],
    [40 * TILE_SIZE, 8 * TILE_SIZE, 104, 36],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0x776d47, 0.13);
  [
    [12 * TILE_SIZE, 14 * TILE_SIZE, 78, 18],
    [18 * TILE_SIZE, 16 * TILE_SIZE, 88, 20],
    [29 * TILE_SIZE, 19 * TILE_SIZE, 82, 18],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0xb39a63, 0.3);
  [
    [278, 270], [470, 184], [1268, 224], [1376, 354],
  ].forEach(([x, y]) => graphics.fillRect(x, y, 4, 2));

  return { object: graphics, accentCount: 11 };
}

function drawRiverEdgeCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(37);
  const left = STREAM.left;
  const right = STREAM.left + STREAM.width;

  graphics.fillStyle(0x1f3430, 0.17);
  [
    [left - 18, 348, 34, 12],
    [right + 16, 404, 32, 11],
    [left - 12, 528, 28, 10],
    [right + 14, 566, 30, 10],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0x61734d, 0.58);
  [
    [left - 25, 392, 20, 7],
    [right + 22, 468, 18, 7],
    [left - 20, 642, 22, 7],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.lineStyle(2, 0x30453a, 0.44);
  [
    [left - 28, 438, left - 22, 424],
    [right + 24, 610, right + 18, 594],
  ].forEach(([x1, y1, x2, y2]) => graphics.lineBetween(x1, y1, x2, y2));

  return { object: graphics, accentCount: 9 };
}

function drawWorkshopCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(233);
  const originX = STREAM.left + STREAM.width + 74;
  const originY = 528;

  graphics.fillStyle(0x3f2d20, 0.17);
  [
    [originX + 46, originY + 112, 44, 12],
    [originX + 126, originY + 138, 54, 14],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0xc69a55, 0.5);
  [
    [originX + 28, originY + 104, 8, 3],
    [originX + 92, originY + 134, 9, 3],
    [originX + 146, originY + 118, 7, 3],
  ].forEach(([x, y, width, height]) => graphics.fillRect(x, y, width, height));

  graphics.lineStyle(2, 0x675238, 0.42);
  [
    [originX + 66, originY + 150, originX + 82, originY + 154],
    [originX + 156, originY + 154, originX + 174, originY + 151],
  ].forEach(([x1, y1, x2, y2]) => graphics.lineBetween(x1, y1, x2, y2));

  return { object: graphics, accentCount: 7 };
}

function drawHudSafeCleanup(scene) {
  const graphics = scene.add.graphics().setDepth(388);

  graphics.fillStyle(0x10251d, 0.035);
  graphics.fillRect(0, WORLD_HEIGHT - 150, WORLD_WIDTH, 150);

  graphics.fillStyle(0x173226, 0.045);
  graphics.fillEllipse(42, WORLD_HEIGHT - 126, 170, 86);
  graphics.fillEllipse(WORLD_WIDTH - 42, WORLD_HEIGHT - 124, 164, 82);

  return { object: graphics, accentCount: 3 };
}

function drawGlobalValueCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(389);

  graphics.fillStyle(0x10231c, 0.03);
  graphics.fillRect(0, 0, 132, WORLD_HEIGHT);
  graphics.fillRect(WORLD_WIDTH - 132, 0, 132, WORLD_HEIGHT);

  graphics.fillStyle(0x173126, 0.018);
  graphics.fillRect(0, 0, WORLD_WIDTH, 86);

  graphics.fillStyle(0x203d2e, 0.018);
  graphics.fillRect(0, 86, WORLD_WIDTH, WORLD_HEIGHT - 236);

  graphics.fillStyle(0xf1b85a, 0.02);
  graphics.fillEllipse(STREAM.left + STREAM.width + 190, 610, 310, 210);

  return { object: graphics, accentCount: 5 };
}

function installEnvironmentProductionPolish(scene) {
  const previousRuntime = scene.__environmentProductionPolishRuntime;
  if (previousRuntime?.objects) {
    Object.values(previousRuntime.objects).forEach((object) => object?.destroy?.());
  }

  const ground = drawGroundCalibration(scene);
  const river = drawRiverEdgeCalibration(scene);
  const workshop = drawWorkshopCalibration(scene);
  const hudSafe = drawHudSafeCleanup(scene);
  const value = drawGlobalValueCalibration(scene);

  const runtime = {
    standard: STANDARD,
    status: "ACTIVE",
    productionPhase: "PES-005C.1",
    polishModel: "RESTRAINED_NOISE_REDUCTION_AND_VALUE_CALIBRATION",
    passes: PASSES,
    accentCount:
      ground.accentCount +
      river.accentCount +
      workshop.accentCount +
      hudSafe.accentCount +
      value.accentCount,
    previousAccentCount: previousRuntime?.accentCount ?? 0,
    hudSafeLowerBand: WORLD_HEIGHT - 150,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
    objects: {
      ground: ground.object,
      river: river.object,
      workshop: workshop.object,
      hudSafe: hudSafe.object,
      value: value.object,
    },
  };

  scene.__environmentProductionPolishRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getEnvironmentProductionPolish = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    polishModel: runtime.polishModel,
    passes: runtime.passes.map((pass) => ({ ...pass })),
    accentCount: runtime.accentCount,
    previousAccentCount: runtime.previousAccentCount,
    hudSafeLowerBand: runtime.hudSafeLowerBand,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugEnvironmentProductionPolish = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getEnvironmentProductionPolish();
    console.group(`Builders Valley Environment Production Polish — ${snapshot.packageStatus}`);
    console.table(snapshot.passes);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithEnvironmentProductionPolish() {
  originalCreate.call(this);
  installEnvironmentProductionPolish(this);
};
