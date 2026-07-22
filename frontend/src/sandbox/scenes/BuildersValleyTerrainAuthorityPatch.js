import Phaser from "phaser";
import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_WORLD_002_TERRAIN_AUTHORITY_V1";

const COLORS = Object.freeze({
  lowland: 0x5f9850,
  lowlandLight: 0x72aa59,
  upland: 0x527f46,
  uplandDark: 0x3f653b,
  soil: 0x9b7748,
  soilLight: 0xb48d57,
  cliff: 0x5d6660,
  cliffDark: 0x394943,
  cliffLight: 0x7b8175,
  waterDeep: 0x175d7b,
  water: 0x237da0,
  waterLight: 0x62bed1,
  foam: 0xb6e7e5,
  shadow: 0x17352f,
});

function point(x, y) {
  return new Phaser.Geom.Point(x, y);
}

function fillPolygon(graphics, color, alpha, coordinates) {
  graphics.fillStyle(color, alpha);
  graphics.fillPoints(coordinates.map(([x, y]) => point(x, y)), true);
}

function hideDisplayObject(value) {
  if (!value) return;
  if (typeof value.setVisible === "function") {
    value.setVisible(false);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(hideDisplayObject);
    return;
  }
  if (typeof value === "object") {
    Object.values(value).forEach(hideDisplayObject);
  }
}

function retireLegacyTerrainPresentation(scene) {
  const runtimes = [
    scene.__terrainRiverFoundation,
    scene.__groundAssetReplacement,
    scene.__waterAssetReplacement,
    scene.__cliffAssetReplacement,
    scene.__riverKitRuntime,
    scene.__terrainDetailRuntime,
  ];

  runtimes.forEach((runtime) => {
    if (!runtime || runtime === scene.__buildersValleyWorldAuthority) return;
    hideDisplayObject(runtime.water);
    hideDisplayObject(runtime.shorelines);
    hideDisplayObject(runtime.terrainMasses);
    hideDisplayObject(runtime.paths);
    hideDisplayObject(runtime.container);
    hideDisplayObject(runtime.displayObjects);
    hideDisplayObject(runtime.objects);
    hideDisplayObject(runtime.layers);
  });
}

function drawTerrainBase(scene) {
  const base = scene.add.graphics().setDepth(-12);
  base.fillStyle(COLORS.lowland, 1);
  base.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // Broad authored land masses replace the full-screen debug-grass reading.
  fillPolygon(base, COLORS.upland, 1, [
    [0, 0], [620, 0], [690, 120], [650, 250], [540, 330], [360, 310], [180, 220], [0, 250],
  ]);
  fillPolygon(base, COLORS.uplandDark, 0.72, [
    [0, 0], [500, 0], [570, 90], [510, 170], [330, 150], [180, 95], [0, 130],
  ]);
  fillPolygon(base, COLORS.lowlandLight, 0.72, [
    [0, 430], [270, 370], [520, 420], [650, 620], [560, 800], [300, 860], [0, 760],
  ]);
  fillPolygon(base, COLORS.upland, 0.9, [
    [970, 0], [WORLD_WIDTH, 0], [WORLD_WIDTH, 420], [1360, 350], [1190, 260], [1060, 190],
  ]);
  fillPolygon(base, COLORS.lowlandLight, 0.54, [
    [1040, 520], [WORLD_WIDTH, 430], [WORLD_WIDTH, WORLD_HEIGHT], [1010, WORLD_HEIGHT], [930, 820],
  ]);

  // Ground variation is sparse and grouped by terrain mass, not tile noise.
  base.fillStyle(COLORS.lowlandLight, 0.28);
  for (let i = 0; i < 42; i += 1) {
    const x = 36 + ((i * 137) % (WORLD_WIDTH - 72));
    const y = 42 + ((i * 83) % (WORLD_HEIGHT - 84));
    base.fillEllipse(x, y, 26 + (i % 4) * 12, 8 + (i % 3) * 4);
  }

  return base;
}

function drawCanyonAndRiver(scene, world) {
  const riverCenter = world.layout.bridge.anchor.x;
  const bridgeY = world.layout.bridge.anchor.y;

  const canyon = scene.add.graphics().setDepth(-3);
  const leftOuter = [
    [riverCenter - 250, 0], [riverCenter - 225, 90], [riverCenter - 205, 180],
    [riverCenter - 185, 275], [riverCenter - 155, 360], [riverCenter - 140, bridgeY - 90],
    [riverCenter - 138, bridgeY + 110], [riverCenter - 175, 650], [riverCenter - 155, 790],
    [riverCenter - 185, WORLD_HEIGHT], [riverCenter - 360, WORLD_HEIGHT], [riverCenter - 330, 780],
    [riverCenter - 315, 620], [riverCenter - 320, 430], [riverCenter - 305, 250], [riverCenter - 300, 0],
  ];
  const rightOuter = leftOuter.map(([x, y]) => [riverCenter * 2 - x, y]);
  fillPolygon(canyon, COLORS.cliffDark, 1, leftOuter);
  fillPolygon(canyon, COLORS.cliffDark, 1, rightOuter);

  const leftShelf = [
    [riverCenter - 200, 0], [riverCenter - 185, 110], [riverCenter - 160, 220],
    [riverCenter - 135, 330], [riverCenter - 118, bridgeY - 86], [riverCenter - 116, bridgeY + 105],
    [riverCenter - 145, 650], [riverCenter - 125, 790], [riverCenter - 150, WORLD_HEIGHT],
    [riverCenter - 235, WORLD_HEIGHT], [riverCenter - 220, 800], [riverCenter - 235, 640],
    [riverCenter - 230, 430], [riverCenter - 245, 230], [riverCenter - 245, 0],
  ];
  const rightShelf = leftShelf.map(([x, y]) => [riverCenter * 2 - x, y]);
  fillPolygon(canyon, COLORS.cliff, 1, leftShelf);
  fillPolygon(canyon, COLORS.cliff, 1, rightShelf);

  canyon.lineStyle(8, COLORS.cliffLight, 0.62);
  canyon.strokePoints(leftShelf.map(([x, y]) => point(x, y)), false);
  canyon.strokePoints(rightShelf.map(([x, y]) => point(x, y)), false);

  const water = scene.add.graphics().setDepth(4);
  const river = [
    [riverCenter - 86, 0], [riverCenter - 92, 90], [riverCenter - 118, 170],
    [riverCenter - 110, 260], [riverCenter - 92, 345], [riverCenter - 104, bridgeY - 80],
    [riverCenter - 104, bridgeY + 88], [riverCenter - 84, 650], [riverCenter - 98, 770],
    [riverCenter - 78, WORLD_HEIGHT], [riverCenter + 78, WORLD_HEIGHT], [riverCenter + 98, 770],
    [riverCenter + 84, 650], [riverCenter + 104, bridgeY + 88], [riverCenter + 104, bridgeY - 80],
    [riverCenter + 92, 345], [riverCenter + 110, 260], [riverCenter + 118, 170],
    [riverCenter + 92, 90], [riverCenter + 86, 0],
  ];
  fillPolygon(water, COLORS.waterDeep, 1, river);

  const innerRiver = river.map(([x, y]) => [riverCenter + (x - riverCenter) * 0.72, y]);
  fillPolygon(water, COLORS.water, 0.94, innerRiver);

  water.fillStyle(COLORS.waterLight, 0.58);
  [118, 238, 348, 650, 790, 930].forEach((y, index) => {
    const width = 86 + (index % 3) * 20;
    water.fillRoundedRect(riverCenter - width / 2 + (index % 2 ? 14 : -10), y, width, 5, 2);
  });

  // Waterfall throat and plunge pool visually connect the mountain to the river.
  water.fillStyle(COLORS.foam, 0.8);
  water.fillEllipse(riverCenter, 74, 150, 34);
  water.fillRoundedRect(riverCenter - 58, 56, 116, 120, 28);
  water.fillStyle(COLORS.waterLight, 0.7);
  water.fillRoundedRect(riverCenter - 46, 66, 92, 118, 22);
  water.fillStyle(COLORS.foam, 0.72);
  water.fillEllipse(riverCenter, 178, 128, 25);

  return { canyon, water };
}

function drawTerrainPaths(scene, world) {
  const bridge = world.layout.bridge.anchor;
  const workshop = world.layout.workshopTerrace.anchor;
  const paths = scene.add.graphics().setDepth(12);

  paths.lineStyle(34, COLORS.soil, 0.96);
  paths.beginPath();
  paths.moveTo(0, bridge.y - 110);
  paths.lineTo(250, bridge.y - 40);
  paths.lineTo(470, bridge.y + 58);
  paths.lineTo(bridge.x - 145, bridge.y + 62);
  paths.strokePath();

  paths.beginPath();
  paths.moveTo(bridge.x + 145, bridge.y + 62);
  paths.lineTo(workshop.x - 120, workshop.y + 115);
  paths.lineTo(workshop.x + 90, workshop.y + 125);
  paths.strokePath();

  paths.lineStyle(8, COLORS.soilLight, 0.55);
  paths.beginPath();
  paths.moveTo(0, bridge.y - 110);
  paths.lineTo(250, bridge.y - 40);
  paths.lineTo(470, bridge.y + 58);
  paths.lineTo(bridge.x - 145, bridge.y + 62);
  paths.strokePath();

  return paths;
}

function drawWorkshopTerrace(scene, world) {
  const { anchor, bounds } = world.layout.workshopTerrace;
  const terrace = scene.add.graphics().setDepth(16);

  fillPolygon(terrace, COLORS.cliffDark, 0.92, [
    [bounds.x - 35, bounds.y + 82], [bounds.x + bounds.width + 30, bounds.y + 55],
    [bounds.x + bounds.width + 48, bounds.y + bounds.height - 20],
    [bounds.x - 18, bounds.y + bounds.height + 12],
  ]);
  fillPolygon(terrace, COLORS.soil, 1, [
    [bounds.x, bounds.y + 48], [bounds.x + bounds.width, bounds.y + 32],
    [bounds.x + bounds.width + 8, bounds.y + bounds.height - 55],
    [bounds.x + 20, bounds.y + bounds.height - 30],
  ]);
  terrace.lineStyle(7, COLORS.soilLight, 0.55);
  terrace.strokeRoundedRect(anchor.x - 135, anchor.y - 70, 270, 205, 28);

  return terrace;
}

function installTerrainAuthority(scene) {
  const world = scene.__buildersValleyWorld;
  if (!world || scene.__terrainAuthorityRuntime) return;

  retireLegacyTerrainPresentation(scene);

  const display = {
    base: drawTerrainBase(scene),
    ...drawCanyonAndRiver(scene, world),
    paths: drawTerrainPaths(scene, world),
    workshopTerrace: drawWorkshopTerrace(scene, world),
  };

  const runtime = Object.freeze({
    standard: STANDARD,
    status: "TERRAIN_AUTHORITY_ACTIVE",
    owner: "frontend/src/sandbox/scenes/BuildersValleyTerrainAuthorityPatch.js",
    worldOwner: world.constructor.STANDARD,
    pipeline: Object.freeze([
      "TERRAIN_MASS",
      "RIVER_CUT",
      "CLIFF_SHELVES",
      "GROUND_MATERIALS",
      "PATHS",
      "STRUCTURE_TERRACES",
    ]),
    display,
    renderingAuthorityActive: true,
    legacyTerrainPresentationRetired: true,
    gameplayGeometryChanged: false,
    collisionObjectsAdded: 0,
  });

  scene.__terrainAuthorityRuntime = runtime;
  world.status = "TERRAIN_AUTHORITY_ACTIVE";

  if (scene.__buildersValleyWorldAuthority) {
    scene.__buildersValleyWorldAuthority = Object.freeze({
      ...scene.__buildersValleyWorldAuthority,
      status: "TERRAIN_AUTHORITY_ACTIVE",
      renderingAuthorityActive: true,
      legacyRenderersStillActive: true,
      activeTerrainStandard: STANDARD,
    });
  }

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getTerrainAuthority = () => ({
    standard: runtime.standard,
    status: runtime.status,
    worldOwner: runtime.worldOwner,
    pipeline: [...runtime.pipeline],
    renderingAuthorityActive: runtime.renderingAuthorityActive,
    legacyTerrainPresentationRetired: runtime.legacyTerrainPresentationRetired,
    gameplayGeometryChanged: false,
    collisionObjectsAdded: 0,
  });
  window.__BUILDERS_VALLEY__.debugTerrainAuthority = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getTerrainAuthority();
    console.group(`Builders Valley Terrain Authority — ${snapshot.status}`);
    console.table(snapshot.pipeline.map((stage, index) => ({ order: index + 1, stage })));
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithTerrainAuthority() {
  originalCreate.call(this);
  installTerrainAuthority(this);
};
