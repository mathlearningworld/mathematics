import Phaser from "phaser";
import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";
import { ART_COLORS } from "../art/pixelArtFactory.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;

const LAYERS = Object.freeze({
  terrainDetail: -26,
  waterDetail: -18,
  bankAtmosphere: -10,
  worldLight: 9200,
  uiFrame: 9990,
});

function seeded(column, row, salt = 0) {
  const value = Math.sin(column * 12.9898 + row * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function addGrassCluster(graphics, column, row, seed) {
  const x = column * TILE_SIZE + 5 + Math.floor(seed * 20);
  const y = row * TILE_SIZE + 7 + Math.floor(seeded(column, row, 2) * 18);
  const tone = seed > 0.66 ? ART_COLORS.grassLight : ART_COLORS.grassDark;
  const alpha = seed > 0.82 ? 0.34 : 0.2;

  graphics.fillStyle(tone, alpha);
  graphics.fillRect(x, y, 5, 2);
  graphics.fillRect(x + 2, y - 3, 2, 3);
  if (seed > 0.74) graphics.fillRect(x + 7, y + 1, 3, 2);
}

function addFlowerCluster(graphics, x, y, color) {
  graphics.fillStyle(ART_COLORS.grassDark, 0.45);
  graphics.fillRect(x, y + 2, 2, 4);
  graphics.fillStyle(color, 0.68);
  graphics.fillRect(x - 2, y, 2, 2);
  graphics.fillRect(x + 2, y - 1, 2, 2);
}

function createTerrainDetail(scene) {
  const graphics = scene.add.graphics().setDepth(LAYERS.terrainDetail);
  const columns = Math.ceil(WORLD_WIDTH / TILE_SIZE);
  const rows = Math.ceil(WORLD_HEIGHT / TILE_SIZE);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const centerX = column * TILE_SIZE + TILE_SIZE / 2;
      if (centerX >= STREAM.left - TILE_SIZE && centerX <= STREAM.left + STREAM.width + TILE_SIZE) continue;

      const seed = seeded(column, row, 1);
      if (seed > 0.64) addGrassCluster(graphics, column, row, seed);
      if (seed > 0.94) {
        const x = column * TILE_SIZE + 10 + Math.floor(seeded(column, row, 4) * 12);
        const y = row * TILE_SIZE + 9 + Math.floor(seeded(column, row, 5) * 12);
        addFlowerCluster(graphics, x, y, seed > 0.97 ? 0xf2a0a8 : 0xf2d46f);
      }
    }
  }

  return graphics;
}

function createWaterDetail(scene) {
  const container = scene.add.container(0, 0).setDepth(LAYERS.waterDetail);
  const bankShade = scene.add.graphics();
  bankShade.fillStyle(0x142b31, 0.18);
  bankShade.fillRect(STREAM.left, STREAM.top, 7, STREAM.height);
  bankShade.fillRect(STREAM.left + STREAM.width - 7, STREAM.top, 7, STREAM.height);

  const shimmer = scene.add.graphics();
  shimmer.fillStyle(0xbcecf5, 0.24);
  for (let y = STREAM.top + 26; y < STREAM.top + STREAM.height; y += 72) {
    const offset = Math.floor(((y - STREAM.top) / 72) % 3) * 11;
    shimmer.fillRect(STREAM.left + 18 + offset, y, 42, 2);
    shimmer.fillRect(STREAM.left + 82 - offset, y + 13, 27, 2);
  }

  container.add([bankShade, shimmer]);
  scene.tweens.add({
    targets: shimmer,
    x: 7,
    alpha: { from: 0.5, to: 0.82 },
    duration: 2800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });
  return container;
}

function createAtmosphere(scene) {
  const graphics = scene.add.graphics().setDepth(LAYERS.bankAtmosphere);
  graphics.lineStyle(2, 0xe3ba62, 0.08);
  graphics.strokeRect(STREAM.left - 12, STREAM.top, STREAM.width + 24, STREAM.height);
  return graphics;
}

function createScreenLighting(scene) {
  const camera = scene.cameras.main;
  const overlay = scene.add.container(0, 0).setScrollFactor(0).setDepth(LAYERS.worldLight);
  const vignette = scene.add.graphics();
  vignette.fillStyle(0x07131a, 0.035);
  vignette.fillRect(0, 0, camera.width, 8);
  vignette.fillRect(0, camera.height - 10, camera.width, 10);
  vignette.fillRect(0, 0, 8, camera.height);
  vignette.fillRect(camera.width - 8, 0, 8, camera.height);
  overlay.add(vignette);
  return overlay;
}

function createHotbarProductionFrame(scene) {
  const camera = scene.cameras.main;
  const frame = scene.add.container(camera.width / 2, camera.height - 72)
    .setScrollFactor(0)
    .setDepth(LAYERS.uiFrame);

  const shadow = scene.add.rectangle(0, 5, 334, 74, 0x07131a, 0.55);
  const outer = scene.add.rectangle(0, 0, 330, 70, 0x101b22, 0.98)
    .setStrokeStyle(3, 0x8a6036, 0.95);
  const inner = scene.add.rectangle(0, 0, 318, 58, 0x14232b, 0)
    .setStrokeStyle(1, 0xe4b95f, 0.55);

  frame.add([shadow, outer, inner]);
  return frame;
}

function refreshProductionDepths(scene) {
  scene.resourceNodes?.forEach((node) => {
    if (node?.active) node.setDepth(110 + Math.floor(node.y));
  });
  scene.placedBlocks?.forEach((block) => {
    if (block?.active) block.setDepth(120 + Math.floor(block.y));
  });
  if (scene.player) scene.player.setDepth(230 + Math.floor(scene.player.y));
  if (scene.targetIndicator?.visible) scene.targetIndicator.setDepth(360 + Math.floor(scene.targetIndicator.y));
  if (scene.__placementGhost?.container?.visible) {
    scene.__placementGhost.container.setDepth(350 + Math.floor(scene.__placementGhost.container.y));
  }
}

prototype.create = function createWithProductionVisualFoundation() {
  originalCreate.call(this);

  this.__productionVisual = {
    terrainDetail: createTerrainDetail(this),
    waterDetail: createWaterDetail(this),
    atmosphere: createAtmosphere(this),
    screenLighting: createScreenLighting(this),
    hotbarFrame: createHotbarProductionFrame(this),
    standard: "BUILDERS_VALLEY_PRODUCTION_VISUAL_V1",
  };

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getProductionVisualRuntime = () => ({
      standard: this.__productionVisual.standard,
      layers: { ...LAYERS },
      enabled: true,
    });
  }
};

prototype.update = function updateWithProductionVisualFoundation(time, delta) {
  originalUpdate.call(this, time, delta);
  refreshProductionDepths(this);
};