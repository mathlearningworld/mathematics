import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PES_005A_PRODUCTION_DEPTH_PASS_V1";

const PHASES = Object.freeze([
  Object.freeze({ id: "cliff-depth", status: "ACTIVE", purpose: "add shelves, cracks, overhang shadows and depth pockets" }),
  Object.freeze({ id: "water-fx", status: "ACTIVE", purpose: "add bounded foam, splash and mist accents" }),
  Object.freeze({ id: "bridge-polish", status: "ACTIVE", purpose: "add plank wear, beam depth and rope sag accents" }),
  Object.freeze({ id: "workshop-yard", status: "ACTIVE", purpose: "add chips, footprints, dirt wear and small operational clutter" }),
  Object.freeze({ id: "foreground-framing", status: "ACTIVE", purpose: "strengthen edge depth without covering gameplay" }),
]);

function createCliffDepth(scene) {
  const graphics = scene.add.graphics().setDepth(38);
  const left = STREAM.left;
  const right = STREAM.left + STREAM.width;
  graphics.fillStyle(0x17201f, 0.2);
  [[left - 34, 258, 54, 18], [right + 28, 332, 48, 16], [left - 22, 458, 42, 15]].forEach(([x, y, w, h]) => {
    graphics.fillEllipse(x, y, w, h);
  });
  graphics.lineStyle(3, 0x26302e, 0.72);
  [[left - 18, 228, -8, 28], [right + 16, 286, 10, 34], [left - 12, 404, -10, 30]].forEach(([x, y, dx, dy]) => {
    graphics.beginPath();
    graphics.moveTo(x, y);
    graphics.lineTo(x + dx, y + dy);
    graphics.lineTo(x + dx * 0.35, y + dy + 13);
    graphics.strokePath();
  });
  graphics.fillStyle(0x69736a, 0.8);
  [[left - 25, 278, 44, 13], [right + 21, 374, 36, 12]].forEach(([x, y, w, h]) => graphics.fillEllipse(x, y, w, h));
  return { object: graphics, accentCount: 8 };
}

function createWaterFx(scene) {
  const centerX = STREAM.left + STREAM.width / 2;
  const foam = [
    scene.add.ellipse(centerX, 318, 108, 14, 0xe7fbf5, 0.18),
    scene.add.ellipse(centerX - 18, 344, 62, 10, 0xd1f3ef, 0.12),
    scene.add.ellipse(centerX + 26, 368, 54, 9, 0xc3ece9, 0.1),
  ];
  foam.forEach((item, index) => {
    item.setDepth(178).setBlendMode("ADD");
    item.setData("anchorX", item.x);
    item.setData("phase", index * 1.4);
  });
  return foam;
}

function createBridgePolish(scene) {
  const graphics = scene.add.graphics().setDepth(246);
  const x = STREAM.left - 68;
  const y = 610;
  graphics.fillStyle(0x3d281d, 0.34);
  graphics.fillRect(x, y + 40, STREAM.width + 136, 15);
  graphics.lineStyle(3, 0x6e4328, 0.82);

  const startX = x + 18;
  const startY = y + 5;
  const controlX = x + STREAM.width / 2 + 68;
  const controlY = y + 28;
  const endX = x + STREAM.width + 118;
  const endY = y + 5;
  graphics.beginPath();
  graphics.moveTo(startX, startY);
  for (let step = 1; step <= 16; step += 1) {
    const t = step / 16;
    const inverse = 1 - t;
    const px = inverse * inverse * startX + 2 * inverse * t * controlX + t * t * endX;
    const py = inverse * inverse * startY + 2 * inverse * t * controlY + t * t * endY;
    graphics.lineTo(px, py);
  }
  graphics.strokePath();

  graphics.lineStyle(2, 0x2f211b, 0.58);
  [0, 1, 2, 3, 4, 5].forEach((index) => {
    const px = x + 34 + index * ((STREAM.width + 70) / 5);
    graphics.lineBetween(px, y + 18, px + (index % 2 ? 5 : -4), y + 42);
  });
  graphics.fillStyle(0xd6a15c, 0.18);
  [[x + 96, y + 30, 42, 5], [x + 244, y + 24, 34, 5], [x + 382, y + 34, 44, 5]].forEach(([px, py, w, h]) => graphics.fillRect(px, py, w, h));
  return { object: graphics, accentCount: 10 };
}

function createWorkshopYard(scene) {
  const graphics = scene.add.graphics().setDepth(232);
  const x = STREAM.left + STREAM.width + 82;
  const y = 520;
  graphics.fillStyle(0x6e5537, 0.2);
  [[x + 12, y + 104, 52, 18], [x + 96, y + 82, 42, 14], [x + 152, y + 126, 64, 18]].forEach(([px, py, w, h]) => graphics.fillEllipse(px, py, w, h));
  graphics.fillStyle(0xc39454, 0.72);
  [[x + 28, y + 94], [x + 34, y + 102], [x + 80, y + 116], [x + 132, y + 88], [x + 166, y + 110]].forEach(([px, py]) => graphics.fillRect(px, py, 7, 3));
  graphics.lineStyle(2, 0x6b5b3d, 0.52);
  [[x + 46, y + 122, x + 60, y + 129], [x + 124, y + 134, x + 142, y + 137], [x + 180, y + 96, x + 194, y + 92]].forEach(([x1, y1, x2, y2]) => graphics.lineBetween(x1, y1, x2, y2));
  return { object: graphics, accentCount: 11 };
}

function createForegroundFraming(scene) {
  const graphics = scene.add.graphics().setDepth(388);
  graphics.fillStyle(0x10251d, 0.09);
  graphics.fillEllipse(36, WORLD_HEIGHT - 10, 260, 116);
  graphics.fillEllipse(WORLD_WIDTH - 32, WORLD_HEIGHT - 6, 250, 112);
  graphics.fillStyle(0x183629, 0.08);
  graphics.fillEllipse(26, 54, 160, 94);
  graphics.fillEllipse(WORLD_WIDTH - 28, 62, 150, 88);
  return { object: graphics, accentCount: 4 };
}

function installProductionDepthPass(scene) {
  const cliff = createCliffDepth(scene);
  const waterFx = createWaterFx(scene);
  const bridge = createBridgePolish(scene);
  const workshop = createWorkshopYard(scene);
  const framing = createForegroundFraming(scene);

  let elapsed = 0;
  const updateHandler = (_time, delta) => {
    elapsed += delta / 1000;
    waterFx.forEach((item) => {
      const anchorX = item.getData("anchorX");
      const phase = item.getData("phase");
      item.x = anchorX + Math.sin(elapsed * 0.75 + phase) * 2.5;
      item.alpha = 0.09 + (Math.sin(elapsed * 1.05 + phase) + 1) * 0.035;
    });
  };
  scene.events.on("update", updateHandler);
  scene.events.once("shutdown", () => scene.events.off("update", updateHandler));

  const runtime = {
    standard: STANDARD,
    status: "ACTIVE",
    productionPhase: "PES-005A",
    depthPolicy: "LAYER_SAFE_NON_BLOCKING_POLISH",
    phases: PHASES,
    accentCount: cliff.accentCount + waterFx.length + bridge.accentCount + workshop.accentCount + framing.accentCount,
    animatedElementCount: waterFx.length,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  };

  scene.__productionDepthPassRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getProductionDepthPass = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    depthPolicy: runtime.depthPolicy,
    phases: runtime.phases.map((phase) => ({ ...phase })),
    accentCount: runtime.accentCount,
    animatedElementCount: runtime.animatedElementCount,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugProductionDepthPass = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getProductionDepthPass();
    console.group(`Builders Valley Production Depth Pass — ${snapshot.packageStatus}`);
    console.table(snapshot.phases);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithProductionDepthPass() {
  originalCreate.call(this);
  installProductionDepthPass(this);
};