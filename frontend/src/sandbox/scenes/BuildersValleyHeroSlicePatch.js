import Phaser from "phaser";
import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const HERO = Object.freeze({
  bridgeY: 20 * TILE_SIZE,
  workshopX: STREAM.left + STREAM.width + 150,
  workshopY: 16 * TILE_SIZE,
});

const DEPTH = Object.freeze({
  riverBase: -17,
  cliffs: -8,
  terrain: -4,
  heroArchitecture: 48,
  ambient: 52,
});

function rect(scene, x, y, width, height, color, alpha = 1) {
  return scene.add.rectangle(x, y, width, height, color, alpha).setOrigin(0.5);
}

function addRockFace(scene, container, x, y, width, height, variant = 0) {
  const rock = scene.add.container(x, y);
  const shadow = rect(scene, 4, 7, width + 8, height + 8, 0x18242a, 0.42);
  const base = rect(scene, 0, 0, width, height, variant ? 0x566268 : 0x606d70);
  const top = rect(scene, -2, -height * 0.32, width - 6, Math.max(6, height * 0.2), 0x82908c);
  const moss = rect(scene, -width * 0.22, -height * 0.45, width * 0.34, 5, 0x557b3d, 0.9);
  const crack = scene.add.graphics();
  crack.lineStyle(2, 0x344047, 0.8);
  crack.lineBetween(width * 0.12, -height * 0.3, width * 0.02, -2);
  crack.lineBetween(width * 0.02, -2, width * 0.18, height * 0.25);
  rock.add([shadow, base, top, moss, crack]);
  container.add(rock);
}

function createRiverProduction(scene) {
  const river = scene.add.container(0, 0).setDepth(DEPTH.riverBase);
  const depth = scene.add.graphics();
  depth.fillStyle(0x1e607c, 0.38);
  depth.fillRect(STREAM.left + 10, 0, STREAM.width - 20, WORLD_HEIGHT);
  depth.fillStyle(0x164e68, 0.3);
  depth.fillRect(STREAM.left + STREAM.width * 0.38, 0, STREAM.width * 0.24, WORLD_HEIGHT);

  const currents = scene.add.graphics();
  for (let y = 34; y < WORLD_HEIGHT; y += 58) {
    const row = Math.floor(y / 58);
    const x = STREAM.left + 18 + ((row * 23) % 68);
    currents.lineStyle(2, row % 3 === 0 ? 0xbcecf3 : 0x7fc4d9, row % 3 === 0 ? 0.55 : 0.34);
    currents.lineBetween(x, y, Math.min(x + 44, STREAM.left + STREAM.width - 14), y);
    currents.lineBetween(x + 12, y + 7, Math.min(x + 30, STREAM.left + STREAM.width - 12), y + 7);
  }

  const foam = scene.add.graphics();
  foam.fillStyle(0xd9f4f4, 0.72);
  for (let x = STREAM.left + 12; x < STREAM.left + STREAM.width - 8; x += 22) {
    foam.fillRect(x, 118 + ((x / 22) % 3) * 5, 12, 3);
  }
  foam.fillStyle(0xffffff, 0.38);
  foam.fillRect(STREAM.left + 14, 128, STREAM.width - 28, 5);

  river.add([depth, currents, foam]);
  scene.tweens.add({
    targets: currents,
    y: 9,
    alpha: { from: 0.7, to: 1 },
    duration: 2200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });
  return river;
}

function createWaterfall(scene) {
  const waterfall = scene.add.container(STREAM.left + STREAM.width / 2, 18).setDepth(DEPTH.cliffs);
  const gorge = rect(scene, 0, 28, STREAM.width + 92, 128, 0x26383a, 0.96);
  const water = rect(scene, 0, 12, STREAM.width - 34, 110, 0x5eb6cd, 0.9);
  const deep = rect(scene, 10, 17, STREAM.width - 62, 112, 0x2e86a7, 0.65);
  const spray = scene.add.graphics();
  spray.fillStyle(0xe8fbfb, 0.78);
  spray.fillRect(-STREAM.width / 2 + 24, 58, STREAM.width - 48, 8);
  spray.fillStyle(0xbfe9ed, 0.7);
  spray.fillCircle(-38, 64, 13);
  spray.fillCircle(2, 67, 16);
  spray.fillCircle(42, 63, 12);
  const ribbons = scene.add.graphics();
  ribbons.fillStyle(0xe9ffff, 0.46);
  ribbons.fillRect(-54, -38, 7, 91);
  ribbons.fillRect(-20, -40, 5, 95);
  ribbons.fillRect(22, -35, 8, 88);
  ribbons.fillRect(52, -42, 4, 96);
  waterfall.add([gorge, water, deep, ribbons, spray]);
  scene.tweens.add({
    targets: ribbons,
    y: 8,
    alpha: { from: 0.55, to: 0.9 },
    duration: 1100,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });
  return waterfall;
}

function createCliffBanks(scene) {
  const banks = scene.add.container(0, 0).setDepth(DEPTH.cliffs);
  const leftX = STREAM.left - 38;
  const rightX = STREAM.left + STREAM.width + 38;

  for (let y = 24; y < WORLD_HEIGHT; y += 52) {
    if (Math.abs(y - HERO.bridgeY) < 72) continue;
    addRockFace(scene, banks, leftX - ((y / 52) % 2) * 9, y, 58, 44, Math.floor(y / 52) % 2);
    addRockFace(scene, banks, rightX + ((y / 52) % 2) * 9, y, 58, 44, (Math.floor(y / 52) + 1) % 2);
  }

  return banks;
}

function addBridgePost(scene, container, x, y) {
  const post = scene.add.container(x, y);
  const shadow = rect(scene, 4, 8, 18, 39, 0x172027, 0.48);
  const dark = rect(scene, 0, 0, 15, 42, 0x38261e);
  const wood = rect(scene, -1, -2, 10, 38, 0x8f5d36);
  const cap = rect(scene, 0, -23, 22, 8, 0x32241d);
  const light = rect(scene, -3, -9, 3, 22, 0xc38a4d, 0.68);
  post.add([shadow, dark, wood, cap, light]);
  container.add(post);
}

function createHeroBridge(scene) {
  const bridge = scene.add.container(0, HERO.bridgeY).setDepth(DEPTH.heroArchitecture);
  const deckWidth = STREAM.width + 112;
  const deck = rect(scene, STREAM.left + STREAM.width / 2, 0, deckWidth, 58, 0x3a281f);
  const deckFace = rect(scene, STREAM.left + STREAM.width / 2, -3, deckWidth - 8, 46, 0x7e5030);
  const highlight = rect(scene, STREAM.left + STREAM.width / 2, -20, deckWidth - 12, 7, 0xb87945);
  bridge.add([deck, deckFace, highlight]);

  for (let x = STREAM.left - 42; x <= STREAM.left + STREAM.width + 42; x += 28) {
    bridge.add(rect(scene, x, -2, 22, 42, 0x9d6338));
    bridge.add(rect(scene, x, -18, 19, 5, 0xc18a4e, 0.72));
  }

  for (const x of [STREAM.left - 52, STREAM.left + 2, STREAM.left + STREAM.width - 2, STREAM.left + STREAM.width + 52]) {
    addBridgePost(scene, bridge, x, -34);
    const lamp = scene.add.circle(x, -61, 8, 0xffcb5b, 0.95);
    const glow = scene.add.circle(x, -61, 21, 0xffba42, 0.18);
    bridge.add([glow, lamp]);
    scene.tweens.add({ targets: glow, scale: 1.18, alpha: 0.1, duration: 1300, yoyo: true, repeat: -1 });
  }

  const ropes = scene.add.graphics();
  ropes.lineStyle(4, 0x5a3a25, 0.95);
  ropes.lineBetween(STREAM.left - 52, -54, STREAM.left + 2, -50);
  ropes.lineBetween(STREAM.left + 2, -50, STREAM.left + STREAM.width - 2, -50);
  ropes.lineBetween(STREAM.left + STREAM.width - 2, -50, STREAM.left + STREAM.width + 52, -54);
  bridge.add(ropes);
  return bridge;
}

function createWorkshop(scene) {
  const workshop = scene.add.container(HERO.workshopX, HERO.workshopY).setDepth(DEPTH.heroArchitecture);
  const pad = rect(scene, 0, 22, 176, 116, 0x7f6845, 0.92);
  const padTop = rect(scene, 0, 8, 164, 92, 0xa08655, 0.78);
  const canopyShadow = rect(scene, 0, -17, 128, 22, 0x1a2428, 0.48);
  const canopy = rect(scene, 0, -28, 136, 20, 0x72502f);
  const canopyLight = rect(scene, -5, -34, 126, 7, 0xb78047);
  const bench = rect(scene, 0, 10, 104, 24, 0x493225);
  const benchTop = rect(scene, 0, 3, 112, 12, 0x9f6a3b);
  const leftLeg = rect(scene, -42, 31, 12, 43, 0x3c291f);
  const rightLeg = rect(scene, 42, 31, 12, 43, 0x3c291f);
  const chest = rect(scene, 58, 52, 46, 36, 0x805132);
  const chestBand = rect(scene, 58, 52, 7, 36, 0xc18a4e);
  workshop.add([pad, padTop, canopyShadow, canopy, canopyLight, bench, benchTop, leftLeg, rightLeg, chest, chestBand]);
  return workshop;
}

function createFramingVegetation(scene) {
  const vegetation = scene.add.container(0, 0).setDepth(DEPTH.ambient);
  const positions = [
    [STREAM.left - 150, HERO.bridgeY - 150],
    [STREAM.left - 190, HERO.bridgeY + 125],
    [STREAM.left + STREAM.width + 170, HERO.bridgeY - 135],
    [STREAM.left + STREAM.width + 205, HERO.bridgeY + 118],
  ];

  positions.forEach(([x, y], index) => {
    const cluster = scene.add.container(x, y);
    const shadow = scene.add.ellipse(8, 18, 82, 25, 0x142026, 0.24);
    const back = scene.add.circle(-12, -4, 31, index % 2 ? 0x315f38 : 0x2a5635);
    const mid = scene.add.circle(19, 0, 27, 0x3f7541);
    const light = scene.add.circle(2, -18, 22, 0x5f934b);
    const glint = scene.add.circle(-8, -25, 8, 0x84ad5b, 0.72);
    cluster.add([shadow, back, mid, light, glint]);
    vegetation.add(cluster);
  });
  return vegetation;
}

prototype.create = function createWithHeroVerticalSlice() {
  originalCreate.call(this);

  this.__heroVisualSlice = {
    river: createRiverProduction(this),
    waterfall: createWaterfall(this),
    cliffBanks: createCliffBanks(this),
    bridge: createHeroBridge(this),
    workshop: createWorkshop(this),
    vegetation: createFramingVegetation(this),
    standard: "BUILDERS_VALLEY_HERO_VERTICAL_SLICE_V1",
  };

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getHeroVisualSlice = () => ({
      standard: this.__heroVisualSlice.standard,
      bridgeY: HERO.bridgeY,
      workshop: { x: HERO.workshopX, y: HERO.workshopY },
      gameplayGeometryChanged: false,
    });
  }
};