import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PES_005C_ENVIRONMENT_PRODUCTION_POLISH_V1";

const PASSES = Object.freeze([
  Object.freeze({ id: "ground-micro-variation", status: "ACTIVE", purpose: "break uniform grass with restrained soil, leaf and pebble accents" }),
  Object.freeze({ id: "river-edge-polish", status: "ACTIVE", purpose: "strengthen bank depth with moss, contact shade and irregular edge accents" }),
  Object.freeze({ id: "workshop-living-detail", status: "ACTIVE", purpose: "add subtle operational traces without crowding interaction space" }),
  Object.freeze({ id: "forest-density-calibration", status: "ACTIVE", purpose: "connect vegetation pockets while preserving the path corridor" }),
  Object.freeze({ id: "color-and-noise-calibration", status: "ACTIVE", purpose: "guide focus toward waterfall, bridge and workshop" }),
]);

function drawGroundMicroVariation(scene) {
  const graphics = scene.add.graphics().setDepth(-21);

  graphics.fillStyle(0x4f8b47, 0.17);
  [
    [9 * TILE_SIZE, 5 * TILE_SIZE, 118, 44],
    [16 * TILE_SIZE, 11 * TILE_SIZE, 92, 34],
    [7 * TILE_SIZE, 20 * TILE_SIZE, 110, 38],
    [24 * TILE_SIZE, 24 * TILE_SIZE, 104, 36],
    [41 * TILE_SIZE, 8 * TILE_SIZE, 96, 34],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0x7f7448, 0.18);
  [
    [12 * TILE_SIZE, 14 * TILE_SIZE, 72, 18],
    [18 * TILE_SIZE, 16 * TILE_SIZE, 84, 20],
    [29 * TILE_SIZE, 19 * TILE_SIZE, 78, 18],
    [38 * TILE_SIZE, 22 * TILE_SIZE, 92, 20],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0xb39a63, 0.42);
  [
    [206, 338], [278, 270], [356, 434], [470, 184], [532, 514],
    [1268, 224], [1376, 354], [1452, 520], [310, 690], [1260, 728],
  ].forEach(([x, y]) => graphics.fillRect(x, y, 4, 2));

  graphics.fillStyle(0x8b6440, 0.34);
  [
    [238, 384], [420, 238], [556, 444], [1328, 286], [1436, 648], [268, 752],
  ].forEach(([x, y]) => graphics.fillRect(x, y, 5, 3));

  return { object: graphics, accentCount: 25 };
}

function drawRiverEdgePolish(scene) {
  const graphics = scene.add.graphics().setDepth(37);
  const left = STREAM.left;
  const right = STREAM.left + STREAM.width;

  graphics.fillStyle(0x1f3430, 0.2);
  [
    [left - 18, 348, 34, 12],
    [right + 16, 404, 32, 11],
    [left - 12, 528, 28, 10],
    [right + 14, 566, 30, 10],
    [left - 16, 724, 36, 12],
    [right + 18, 778, 34, 11],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0x61734d, 0.72);
  [
    [left - 25, 392, 20, 7],
    [right + 22, 468, 18, 7],
    [left - 20, 642, 22, 7],
    [right + 24, 700, 19, 7],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.lineStyle(2, 0x30453a, 0.56);
  [
    [left - 28, 438, left - 22, 424],
    [left - 21, 438, left - 16, 421],
    [right + 24, 610, right + 18, 594],
    [right + 31, 610, right + 27, 592],
  ].forEach(([x1, y1, x2, y2]) => graphics.lineBetween(x1, y1, x2, y2));

  return { object: graphics, accentCount: 14 };
}

function drawWorkshopLivingDetail(scene) {
  const graphics = scene.add.graphics().setDepth(233);
  const originX = STREAM.left + STREAM.width + 74;
  const originY = 528;

  graphics.fillStyle(0x3f2d20, 0.2);
  [
    [originX + 46, originY + 112, 44, 12],
    [originX + 126, originY + 138, 54, 14],
    [originX + 210, originY + 100, 38, 11],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0xc69a55, 0.62);
  [
    [originX + 28, originY + 104, 8, 3],
    [originX + 38, originY + 109, 6, 3],
    [originX + 92, originY + 134, 9, 3],
    [originX + 146, originY + 118, 7, 3],
    [originX + 192, originY + 142, 8, 3],
  ].forEach(([x, y, width, height]) => graphics.fillRect(x, y, width, height));

  graphics.lineStyle(2, 0x675238, 0.55);
  [
    [originX + 66, originY + 150, originX + 82, originY + 154],
    [originX + 156, originY + 154, originX + 174, originY + 151],
    [originX + 218, originY + 128, originX + 231, originY + 135],
  ].forEach(([x1, y1, x2, y2]) => graphics.lineBetween(x1, y1, x2, y2));

  return { object: graphics, accentCount: 11 };
}

function drawForestCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(29);

  graphics.fillStyle(0x244a35, 0.075);
  graphics.fillEllipse(192, 190, 420, 230);
  graphics.fillEllipse(436, 122, 270, 150);
  graphics.fillEllipse(WORLD_WIDTH - 168, 156, 300, 170);

  graphics.fillStyle(0x173b2b, 0.06);
  graphics.fillEllipse(94, 92, 220, 140);
  graphics.fillEllipse(WORLD_WIDTH - 88, 94, 210, 136);

  return { object: graphics, accentCount: 5 };
}

function drawColorAndNoiseCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(389);

  graphics.fillStyle(0x0d211b, 0.035);
  graphics.fillRect(0, 0, 110, WORLD_HEIGHT);
  graphics.fillRect(WORLD_WIDTH - 110, 0, 110, WORLD_HEIGHT);

  graphics.fillStyle(0x153126, 0.025);
  graphics.fillRect(0, 0, WORLD_WIDTH, 72);

  graphics.fillStyle(0xf1b85a, 0.025);
  graphics.fillEllipse(STREAM.left + STREAM.width + 190, 610, 330, 230);

  return { object: graphics, accentCount: 4 };
}

function installEnvironmentProductionPolish(scene) {
  const ground = drawGroundMicroVariation(scene);
  const river = drawRiverEdgePolish(scene);
  const workshop = drawWorkshopLivingDetail(scene);
  const forest = drawForestCalibration(scene);
  const calibration = drawColorAndNoiseCalibration(scene);

  const runtime = {
    standard: STANDARD,
    status: "ACTIVE",
    productionPhase: "PES-005C",
    polishModel: "RESTRAINED_MULTI_ZONE_PRODUCTION_CALIBRATION",
    passes: PASSES,
    accentCount:
      ground.accentCount +
      river.accentCount +
      workshop.accentCount +
      forest.accentCount +
      calibration.accentCount,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
    objects: {
      ground: ground.object,
      river: river.object,
      workshop: workshop.object,
      forest: forest.object,
      calibration: calibration.object,
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
