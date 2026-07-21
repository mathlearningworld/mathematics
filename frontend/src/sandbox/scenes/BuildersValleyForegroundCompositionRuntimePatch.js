import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_002C_FOREGROUND_COMPOSITION_RUNTIME_V1";
const KIT_ID = "BV_ENVIRONMENT_KIT_FOREGROUND_01";

const ZONES = Object.freeze([
  Object.freeze({
    id: "upper-left-forest-pocket",
    density: "DENSE",
    purpose: "balance the waterfall mass and reinforce the left-side forest pocket",
  }),
  Object.freeze({
    id: "spawn-main-path-clearance",
    density: "CLEAR",
    purpose: "protect player readability and the authored path from spawn to bridge",
  }),
  Object.freeze({
    id: "river-bank-accents",
    density: "MEDIUM",
    purpose: "connect vegetation, shoreline and cliff without creating a continuous wall",
  }),
  Object.freeze({
    id: "bridge-approach-clearance",
    density: "CONTROLLED",
    purpose: "frame the bridge while preserving interaction and crossing visibility",
  }),
  Object.freeze({
    id: "lower-foreground-corners",
    density: "DENSE_FRAMING",
    purpose: "create cinematic depth at the lower screen edge without blocking gameplay",
  }),
  Object.freeze({
    id: "workshop-access-clearance",
    density: "CLEAR",
    purpose: "keep the workshop yard and operational access readable",
  }),
]);

function addBushCluster(scene, container, x, y, scale = 1, variant = 0) {
  const shadow = scene.add.ellipse(x + 6, y + 14, 66 * scale, 21 * scale, 0x14231f, 0.2);
  const dark = scene.add.circle(x - 17 * scale, y + 1, 22 * scale, variant ? 0x24492f : 0x2d5635, 0.98);
  const mid = scene.add.circle(x + 13 * scale, y + 3, 20 * scale, variant ? 0x3c6c3d : 0x427442, 0.98);
  const light = scene.add.circle(x - 1 * scale, y - 14 * scale, 14 * scale, variant ? 0x6b954d : 0x72a153, 0.96);
  container.add([shadow, dark, mid, light]);
  return 4;
}

function addRock(scene, container, x, y, scale = 1) {
  const shadow = scene.add.ellipse(x + 3, y + 8, 34 * scale, 12 * scale, 0x14231f, 0.18);
  const base = scene.add.ellipse(x, y, 31 * scale, 22 * scale, 0x5b6965, 0.96);
  const top = scene.add.ellipse(x - 3 * scale, y - 5 * scale, 19 * scale, 8 * scale, 0x89948a, 0.7);
  container.add([shadow, base, top]);
  return 3;
}

function addGrass(scene, container, x, y, scale = 1, tint = 0x426f3d) {
  const graphics = scene.add.graphics();
  graphics.lineStyle(Math.max(1, Math.round(scale * 2)), tint, 0.92);
  [-7, -3, 2, 7].forEach((offset, index) => {
    graphics.lineBetween(
      x + offset * scale,
      y + 5 * scale,
      x + (offset + (index % 2 === 0 ? -3 : 3)) * scale,
      y - (8 + index * 2) * scale,
    );
  });
  container.add(graphics);
  return 1;
}

function addFlowers(scene, container, x, y, variant = 0) {
  const colors = variant ? [0xf1c45b, 0xf28d9e, 0xd9e7a2] : [0xe98aa5, 0xf4d46a, 0xb8d9f2];
  colors.forEach((color, index) => {
    const stem = scene.add.rectangle(x + index * 8, y + 5, 2, 12, 0x3f713f, 0.9);
    const bloom = scene.add.circle(x + index * 8, y - 1 - (index % 2) * 3, 3, color, 0.96);
    container.add([stem, bloom]);
  });
  return colors.length * 2;
}

function buildForegroundComposition(scene) {
  const local = scene.add.container(0, 0).setDepth(228);
  const front = scene.add.container(0, 0).setDepth(320);
  let displayObjectCount = 0;
  let clusterCount = 0;

  const bushPlacements = [
    [4.2 * TILE_SIZE, 5.1 * TILE_SIZE, 1.05, 0],
    [6.2 * TILE_SIZE, 6.6 * TILE_SIZE, 0.72, 1],
    [10.5 * TILE_SIZE, 3.8 * TILE_SIZE, 0.64, 0],
    [STREAM.left - 2.8 * TILE_SIZE, 7.8 * TILE_SIZE, 0.58, 1],
    [STREAM.left - 2.1 * TILE_SIZE, 22.8 * TILE_SIZE, 0.66, 0],
    [STREAM.left + STREAM.width + 2.2 * TILE_SIZE, 24.4 * TILE_SIZE, 0.61, 1],
  ];

  bushPlacements.forEach(([x, y, scale, variant]) => {
    displayObjectCount += addBushCluster(scene, local, x, y, scale, variant);
    clusterCount += 1;
  });

  const rockPlacements = [
    [3.6 * TILE_SIZE, 10.6 * TILE_SIZE, 0.86],
    [12.8 * TILE_SIZE, 8.2 * TILE_SIZE, 0.72],
    [STREAM.left - 1.8 * TILE_SIZE, 18.7 * TILE_SIZE, 0.64],
    [STREAM.left + STREAM.width + 1.8 * TILE_SIZE, 20.9 * TILE_SIZE, 0.68],
  ];
  rockPlacements.forEach(([x, y, scale]) => {
    displayObjectCount += addRock(scene, local, x, y, scale);
    clusterCount += 1;
  });

  const grassPlacements = [
    [5.4 * TILE_SIZE, 8.8 * TILE_SIZE, 0.8],
    [8.8 * TILE_SIZE, 4.4 * TILE_SIZE, 0.65],
    [STREAM.left - 1.45 * TILE_SIZE, 9.8 * TILE_SIZE, 0.7],
    [STREAM.left - 1.2 * TILE_SIZE, 23.7 * TILE_SIZE, 0.8],
    [STREAM.left + STREAM.width + 1.25 * TILE_SIZE, 25.4 * TILE_SIZE, 0.72],
  ];
  grassPlacements.forEach(([x, y, scale]) => {
    displayObjectCount += addGrass(scene, local, x, y, scale);
    clusterCount += 1;
  });

  displayObjectCount += addFlowers(scene, local, 7.3 * TILE_SIZE, 7.4 * TILE_SIZE, 0);
  displayObjectCount += addFlowers(scene, local, STREAM.left - 2.4 * TILE_SIZE, 21.8 * TILE_SIZE, 1);
  clusterCount += 2;

  // Edge-only front framing. Keep the center, path, bridge and workshop access clear.
  displayObjectCount += addBushCluster(scene, front, 1.8 * TILE_SIZE, WORLD_HEIGHT - 20, 1.2, 1);
  displayObjectCount += addBushCluster(scene, front, WORLD_WIDTH - 1.9 * TILE_SIZE, WORLD_HEIGHT - 18, 1.1, 0);
  displayObjectCount += addGrass(scene, front, 6.2 * TILE_SIZE, WORLD_HEIGHT - 10, 1.25, 0x2f5d35);
  displayObjectCount += addGrass(scene, front, WORLD_WIDTH - 6.3 * TILE_SIZE, WORLD_HEIGHT - 8, 1.2, 0x315f37);
  clusterCount += 4;

  return { local, front, displayObjectCount, clusterCount };
}

function installForegroundCompositionRuntime(scene) {
  const composition = buildForegroundComposition(scene);
  const runtime = {
    standard: STANDARD,
    kitId: KIT_ID,
    status: "ACTIVE",
    compositionModel: "ZONE_WEIGHTED_NON_BLOCKING_FOREGROUND_FRAMING",
    zones: ZONES,
    clusterCount: composition.clusterCount,
    displayObjectCount: composition.displayObjectCount,
    depthBands: Object.freeze({ foreground: 228, frontForeground: 320 }),
    protectedClearances: Object.freeze([
      "spawn-main-path",
      "bridge-crossing",
      "bridge-approach",
      "workshop-access",
      "player-projection",
    ]),
    gameplayGeometryChanged: false,
  };

  scene.__foregroundCompositionRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getForegroundCompositionRuntime = () => ({
    standard: runtime.standard,
    kitId: runtime.kitId,
    packageStatus: runtime.status,
    compositionModel: runtime.compositionModel,
    zones: runtime.zones.map((zone) => ({ ...zone })),
    clusterCount: runtime.clusterCount,
    displayObjectCount: runtime.displayObjectCount,
    depthBands: { ...runtime.depthBands },
    protectedClearances: [...runtime.protectedClearances],
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugForegroundComposition = () => {
    const state = window.__BUILDERS_VALLEY__.getForegroundCompositionRuntime();
    console.group(`Builders Valley Foreground Composition — ${state.packageStatus}`);
    console.table(state.zones.map((zone) => ({
      zone: zone.id,
      density: zone.density,
      purpose: zone.purpose,
    })));
    console.log(state);
    console.groupEnd();
    return state;
  };
}

prototype.create = function createWithForegroundCompositionRuntime() {
  originalCreate.call(this);
  installForegroundCompositionRuntime(this);
};
