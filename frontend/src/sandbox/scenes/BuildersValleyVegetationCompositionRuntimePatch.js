import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_002F_VEGETATION_COMPOSITION_RUNTIME_V1";
const KIT_ID = "BV_ENVIRONMENT_KIT_FOREST_01";

const ZONES = Object.freeze([
  Object.freeze({ id: "upper-left-canopy", density: "DENSE", purpose: "build the principal natural mass and balance the workshop side" }),
  Object.freeze({ id: "waterfall-rim", density: "DENSE", purpose: "frame the gorge without covering the waterfall mouth" }),
  Object.freeze({ id: "river-bank-growth", density: "MEDIUM", purpose: "connect grass, cliff and water with reeds and moss accents" }),
  Object.freeze({ id: "main-path-corridor", density: "CLEAR", purpose: "preserve spawn-to-bridge navigation and interaction readability" }),
  Object.freeze({ id: "bridge-approach", density: "CONTROLLED", purpose: "guide the eye toward the crossing while retaining clear placement space" }),
  Object.freeze({ id: "workshop-access", density: "CLEAR", purpose: "keep operational access and workshop interaction surfaces unobstructed" }),
  Object.freeze({ id: "lower-corner-framing", density: "FRAMING", purpose: "create front-depth silhouettes at the viewport edges" }),
]);

function addCanopyCluster(scene, container, x, y, scale, variant = 0, alpha = 1) {
  const palette = variant
    ? [0x173a2b, 0x28553a, 0x3f7246, 0x6f9650]
    : [0x18372a, 0x2f5d3c, 0x467a48, 0x789d55];
  const shadow = scene.add.ellipse(x + 8 * scale, y + 24 * scale, 104 * scale, 34 * scale, 0x10241f, 0.2 * alpha);
  const trunk = scene.add.rectangle(x, y + 18 * scale, 12 * scale, 38 * scale, 0x6f472b, 0.9 * alpha);
  const crownA = scene.add.circle(x - 29 * scale, y, 27 * scale, palette[0], 0.98 * alpha);
  const crownB = scene.add.circle(x + 2 * scale, y - 13 * scale, 32 * scale, palette[1], 0.98 * alpha);
  const crownC = scene.add.circle(x + 31 * scale, y + 1 * scale, 25 * scale, palette[2], 0.98 * alpha);
  const crownD = scene.add.circle(x + 1 * scale, y - 31 * scale, 19 * scale, palette[3], 0.92 * alpha);
  container.add([shadow, trunk, crownA, crownB, crownC, crownD]);
  return 6;
}

function addShrubCluster(scene, container, x, y, scale, variant = 0) {
  const dark = variant ? 0x244d35 : 0x2a5638;
  const mid = variant ? 0x3e7344 : 0x467c48;
  const light = variant ? 0x739a52 : 0x7ea357;
  const shadow = scene.add.ellipse(x + 5, y + 10, 54 * scale, 17 * scale, 0x14251f, 0.22);
  const a = scene.add.circle(x - 14 * scale, y, 17 * scale, dark, 0.98);
  const b = scene.add.circle(x + 8 * scale, y - 5 * scale, 19 * scale, mid, 0.98);
  const c = scene.add.circle(x + 21 * scale, y + 3 * scale, 13 * scale, light, 0.95);
  container.add([shadow, a, b, c]);
  return 4;
}

function addReedPatch(scene, container, x, y, flip = false) {
  const stems = scene.add.graphics();
  stems.lineStyle(3, 0x547744, 0.9);
  const direction = flip ? -1 : 1;
  [0, 7, 14, 21].forEach((offset, index) => {
    stems.beginPath();
    stems.moveTo(x + direction * offset, y + 12);
    stems.lineTo(x + direction * (offset + (index % 2 ? 3 : -2)), y - 9 - index * 2);
    stems.strokePath();
  });
  stems.fillStyle(0x76934d, 0.9);
  stems.fillEllipse(x + direction * 3, y - 8, 7, 3);
  stems.fillEllipse(x + direction * 15, y - 13, 8, 3);
  container.add(stems);
  return 1;
}

function addFlowerPatch(scene, container, x, y, variant = 0) {
  const graphics = scene.add.graphics();
  const colors = variant ? [0xf1c76d, 0xe9956d, 0xf2e2a2] : [0xd9809b, 0xf0c96e, 0xe6ecdd];
  [[0, 0], [9, -4], [17, 3], [25, -2]].forEach(([dx, dy], index) => {
    graphics.lineStyle(2, 0x527442, 0.85);
    graphics.lineBetween(x + dx, y + dy + 7, x + dx, y + dy);
    graphics.fillStyle(colors[index % colors.length], 0.96);
    graphics.fillCircle(x + dx, y + dy, 3);
  });
  container.add(graphics);
  return 1;
}

function addCanopyShadow(scene, container, x, y, width, height, alpha = 0.12) {
  const shadow = scene.add.ellipse(x, y, width, height, 0x173326, alpha);
  container.add(shadow);
  return 1;
}

function composeVegetation(scene) {
  const midBack = scene.add.container(0, 0).setDepth(30);
  const foreground = scene.add.container(0, 0).setDepth(236);
  const frontForeground = scene.add.container(0, 0).setDepth(322);
  let elementCount = 0;

  // Upper-left canopy: dense but kept well away from the authored path corridor.
  elementCount += addCanopyShadow(scene, midBack, 260, 170, 310, 180, 0.11);
  elementCount += addCanopyCluster(scene, midBack, 95, 118, 1.08, 0, 0.98);
  elementCount += addCanopyCluster(scene, midBack, 220, 92, 0.82, 1, 0.96);
  elementCount += addCanopyCluster(scene, midBack, 340, 145, 0.7, 0, 0.94);
  elementCount += addShrubCluster(scene, foreground, 145, 240, 1.0, 1);
  elementCount += addShrubCluster(scene, foreground, 315, 270, 0.82, 0);
  elementCount += addFlowerPatch(scene, foreground, 250, 302, 0);

  // Waterfall rim: vegetation mass frames the dark gorge while retaining the water mouth.
  elementCount += addCanopyShadow(scene, midBack, STREAM.left + STREAM.width / 2, 74, 360, 100, 0.1);
  elementCount += addCanopyCluster(scene, midBack, STREAM.left - 82, 72, 0.66, 1, 0.92);
  elementCount += addCanopyCluster(scene, midBack, STREAM.left + STREAM.width + 84, 78, 0.7, 0, 0.92);

  // River-bank growth: sparse alternating reeds and low shrubs, never a continuous fence.
  const bankSamples = [7.5, 10.5, 20.5, 24.5];
  bankSamples.forEach((row, index) => {
    const y = row * TILE_SIZE;
    const leftX = STREAM.left - (index % 2 ? 30 : 48);
    const rightX = STREAM.left + STREAM.width + (index % 2 ? 44 : 28);
    elementCount += addReedPatch(scene, foreground, leftX, y, index % 2 === 0);
    if (index !== 1) elementCount += addReedPatch(scene, foreground, rightX, y + 8, index % 2 !== 0);
  });
  elementCount += addShrubCluster(scene, foreground, STREAM.left - 72, 392, 0.68, 1);
  elementCount += addShrubCluster(scene, foreground, STREAM.left + STREAM.width + 62, 438, 0.62, 0);

  // Bridge approach remains controlled: only low accents outside the protected crossing.
  elementCount += addFlowerPatch(scene, foreground, STREAM.left - 116, 596, 1);
  elementCount += addReedPatch(scene, foreground, STREAM.left + STREAM.width + 70, 600, true);

  // Front foreground framing: edge-weighted silhouettes outside the central gameplay corridor.
  elementCount += addCanopyShadow(scene, frontForeground, 112, WORLD_HEIGHT - 8, 270, 120, 0.16);
  elementCount += addCanopyCluster(scene, frontForeground, 34, WORLD_HEIGHT - 12, 1.18, 1, 0.9);
  elementCount += addShrubCluster(scene, frontForeground, 182, WORLD_HEIGHT - 22, 1.02, 0);
  elementCount += addCanopyCluster(scene, frontForeground, WORLD_WIDTH - 42, WORLD_HEIGHT - 10, 1.12, 0, 0.88);

  return { midBack, foreground, frontForeground, elementCount };
}

function installVegetationCompositionRuntime(scene) {
  const composition = composeVegetation(scene);
  const runtime = {
    standard: STANDARD,
    kitId: KIT_ID,
    status: "ACTIVE",
    compositionModel: "ZONE_WEIGHTED_MULTI_LAYER_VEGETATION",
    zones: ZONES,
    layers: Object.freeze(["midBack", "foreground", "frontForeground"]),
    elementCount: composition.elementCount,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  };

  scene.__vegetationCompositionRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getVegetationCompositionRuntime = () => ({
    standard: runtime.standard,
    kitId: runtime.kitId,
    packageStatus: runtime.status,
    compositionModel: runtime.compositionModel,
    zones: runtime.zones.map((zone) => ({ ...zone })),
    layers: [...runtime.layers],
    elementCount: runtime.elementCount,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugVegetationComposition = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getVegetationCompositionRuntime();
    console.group("Builders Valley Vegetation Composition");
    console.table(snapshot.zones.map((zone) => ({
      zone: zone.id,
      density: zone.density,
      purpose: zone.purpose,
    })));
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithVegetationCompositionRuntime() {
  originalCreate.call(this);
  installVegetationCompositionRuntime(this);
};
