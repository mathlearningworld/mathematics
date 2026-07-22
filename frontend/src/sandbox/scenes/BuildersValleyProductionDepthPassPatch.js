import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PES_005A1_DEPTH_CALIBRATION_V1";

const PHASES = Object.freeze([
  Object.freeze({ id: "waterfall-fx-emphasis", status: "CALIBRATED", purpose: "concentrate foam, mist and splash at the waterfall lip and impact pool" }),
  Object.freeze({ id: "cliff-shelf-rhythm", status: "CALIBRATED", purpose: "replace evenly distributed accents with a few readable shelf masses and shadow pockets" }),
  Object.freeze({ id: "bridge-material-contrast", status: "CALIBRATED", purpose: "increase beam depth, rope sag and selective plank wear without obscuring traversal" }),
  Object.freeze({ id: "workshop-contact-shadow", status: "CALIBRATED", purpose: "ground work-yard props and operational surfaces with restrained contact shadows" }),
  Object.freeze({ id: "side-edge-framing", status: "CALIBRATED", purpose: "move foreground framing toward middle side edges where it remains visible above the HUD" }),
]);

function createCliffCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(39);
  const left = STREAM.left;
  const right = STREAM.left + STREAM.width;

  // A few larger shelves create readable masses instead of a continuous decorative fence.
  graphics.fillStyle(0x182220, 0.27);
  [
    [left - 35, 270, 76, 22],
    [right + 29, 392, 68, 20],
    [left - 25, 500, 58, 18],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0x778176, 0.82);
  [
    [left - 31, 263, 58, 12],
    [right + 25, 385, 50, 11],
    [left - 22, 493, 42, 10],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.fillStyle(0x101817, 0.18);
  [
    [left - 24, 283, 55, 13],
    [right + 22, 405, 48, 12],
    [left - 17, 510, 38, 10],
  ].forEach(([x, y, width, height]) => graphics.fillEllipse(x, y, width, height));

  graphics.lineStyle(3, 0x25302d, 0.78);
  [
    [left - 12, 340, -9, 31],
    [right + 11, 468, 8, 28],
  ].forEach(([x, y, dx, dy]) => {
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + dx, y + dy);
    graphics.lineTo(x + dx * 0.35, y + dy + 12);
    graphics.strokePath();
  });

  return { object: graphics, accentCount: 11, shelfCount: 3 };
}

function createWaterfallCalibration(scene) {
  const centerX = STREAM.left + STREAM.width / 2;
  const lipFoam = scene.add.ellipse(centerX, 317, 132, 18, 0xf0fff9, 0.25).setDepth(179).setBlendMode("ADD");
  const impactFoam = scene.add.ellipse(centerX, 349, 116, 15, 0xdff8f3, 0.19).setDepth(179).setBlendMode("ADD");
  const contactLeft = scene.add.ellipse(STREAM.left + 17, 339, 38, 11, 0xd0f0ec, 0.14).setDepth(178).setBlendMode("ADD");
  const contactRight = scene.add.ellipse(STREAM.left + STREAM.width - 17, 343, 38, 11, 0xd0f0ec, 0.14).setDepth(178).setBlendMode("ADD");
  const mistA = scene.add.ellipse(centerX - 24, 329, 96, 24, 0xe8fbf5, 0.1).setDepth(181).setBlendMode("ADD");
  const mistB = scene.add.ellipse(centerX + 28, 336, 84, 20, 0xcfeeea, 0.08).setDepth(181).setBlendMode("ADD");

  const animated = [lipFoam, impactFoam, contactLeft, contactRight, mistA, mistB];
  animated.forEach((item, index) => {
    item.setData("anchorX", item.x);
    item.setData("baseAlpha", item.alpha);
    item.setData("phase", index * 1.15);
  });

  return { animated, accentCount: animated.length };
}

function createBridgeCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(247);
  const x = STREAM.left - 68;
  const y = 610;
  const width = STREAM.width + 136;

  // Stronger lower beam/contact shadow while retaining transparent water readability.
  graphics.fillStyle(0x241713, 0.38);
  graphics.fillRect(x + 5, y + 42, width - 10, 18);
  graphics.fillStyle(0x52321f, 0.36);
  graphics.fillRect(x + 14, y + 34, width - 28, 8);

  // A controlled rope sag that reads as a single bridge gesture.
  graphics.lineStyle(4, 0x704326, 0.92);
  graphics.beginPath();
  graphics.moveTo(x + 18, y + 4);
  graphics.quadraticBezierTo(x + width / 2, y + 34, x + width - 18, y + 4);
  graphics.strokePath();

  // Selective plank variation rather than highlighting every board.
  graphics.fillStyle(0x2e1d16, 0.28);
  [0.16, 0.39, 0.68, 0.84].forEach((ratio, index) => {
    const px = x + width * ratio;
    graphics.fillRect(px, y + 23 + (index % 2) * 4, 34 + (index % 3) * 7, 7);
  });
  graphics.fillStyle(0xd6a15c, 0.16);
  [0.27, 0.56, 0.76].forEach((ratio, index) => {
    const px = x + width * ratio;
    graphics.fillRect(px, y + 17 + index * 5, 30 + index * 5, 4);
  });

  return { object: graphics, accentCount: 10 };
}

function createWorkshopCalibration(scene) {
  const graphics = scene.add.graphics().setDepth(231);
  const x = STREAM.left + STREAM.width + 72;
  const y = 506;

  // Contact shadows anchor the existing props rather than adding more clutter.
  graphics.fillStyle(0x231c16, 0.18);
  [
    [x + 42, y + 109, 82, 23],
    [x + 130, y + 94, 72, 20],
    [x + 198, y + 130, 80, 24],
  ].forEach(([px, py, width, height]) => graphics.fillEllipse(px, py, width, height));

  graphics.fillStyle(0x74583a, 0.16);
  [
    [x + 26, y + 123, 70, 18],
    [x + 118, y + 126, 58, 14],
    [x + 186, y + 146, 64, 16],
  ].forEach(([px, py, width, height]) => graphics.fillEllipse(px, py, width, height));

  graphics.fillStyle(0xc08e4f, 0.58);
  [[x + 34, y + 112], [x + 82, y + 132], [x + 148, y + 114], [x + 211, y + 139]].forEach(([px, py]) => {
    graphics.fillRect(px, py, 8, 3);
  });

  return { object: graphics, accentCount: 10 };
}

function createSideEdgeFraming(scene) {
  const graphics = scene.add.graphics().setDepth(389);

  // Mid-side framing remains visible above the HUD and avoids covering the central play corridor.
  graphics.fillStyle(0x0d1f18, 0.085);
  graphics.fillEllipse(18, 278, 150, 250);
  graphics.fillEllipse(WORLD_WIDTH - 18, 304, 148, 246);

  graphics.fillStyle(0x173428, 0.075);
  graphics.fillEllipse(34, 184, 116, 148);
  graphics.fillEllipse(WORLD_WIDTH - 34, 198, 112, 144);

  // Bottom treatment is intentionally lighter because the HUD already provides strong framing.
  graphics.fillStyle(0x10231b, 0.035);
  graphics.fillEllipse(120, WORLD_HEIGHT - 8, 220, 78);
  graphics.fillEllipse(WORLD_WIDTH - 120, WORLD_HEIGHT - 8, 220, 78);

  return { object: graphics, accentCount: 6 };
}

function installDepthCalibration(scene) {
  const cliff = createCliffCalibration(scene);
  const water = createWaterfallCalibration(scene);
  const bridge = createBridgeCalibration(scene);
  const workshop = createWorkshopCalibration(scene);
  const framing = createSideEdgeFraming(scene);

  let elapsed = 0;
  const updateHandler = (_time, delta) => {
    elapsed += delta / 1000;
    water.animated.forEach((item) => {
      const anchorX = item.getData("anchorX");
      const baseAlpha = item.getData("baseAlpha");
      const phase = item.getData("phase");
      item.x = anchorX + Math.sin(elapsed * 0.62 + phase) * 2;
      item.alpha = baseAlpha * (0.82 + (Math.sin(elapsed * 0.9 + phase) + 1) * 0.09);
    });
  };
  scene.events.on("update", updateHandler);
  scene.events.once("shutdown", () => scene.events.off("update", updateHandler));

  const runtime = {
    standard: STANDARD,
    status: "ACTIVE",
    productionPhase: "PES-005A.1",
    calibrationPolicy: "FOCAL_DEPTH_WITH_RESTRAINED_SECONDARY_ACCENTS",
    phases: PHASES,
    shelfCount: cliff.shelfCount,
    animatedElementCount: water.animated.length,
    accentCount: cliff.accentCount + water.accentCount + bridge.accentCount + workshop.accentCount + framing.accentCount,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  };

  scene.__productionDepthPassRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getProductionDepthPass = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    calibrationPolicy: runtime.calibrationPolicy,
    phases: runtime.phases.map((phase) => ({ ...phase })),
    shelfCount: runtime.shelfCount,
    accentCount: runtime.accentCount,
    animatedElementCount: runtime.animatedElementCount,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugProductionDepthPass = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getProductionDepthPass();
    console.group(`Builders Valley Depth Calibration — ${snapshot.packageStatus}`);
    console.table(snapshot.phases);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithDepthCalibration() {
  originalCreate.call(this);
  installDepthCalibration(this);
};
