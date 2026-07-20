import { BuildersValleyScene } from "./BuildersValleyScene.js";
import variantsPackUrl from "../../../assets/builders-valley/environment/builders-valley-environment-variants-v1.svg?url";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";

const TEXTURE_KEY = "builders-valley-environment-variants-v1";
const prototype = BuildersValleyScene.prototype;
const originalPreload = prototype.preload;
const originalCreate = prototype.create;

const FRAMES = Object.freeze({
  bridgeDeck: { x: 8, y: 8, width: 112, height: 40 },
  bridgePost: { x: 132, y: 8, width: 40, height: 48 },
  bridgeShadow: { x: 176, y: 12, width: 72, height: 36 },
  woodPile: { x: 10, y: 72, width: 82, height: 44 },
  toolRack: { x: 108, y: 64, width: 60, height: 54 },
  materialSack: { x: 180, y: 72, width: 50, height: 44 },
  foregroundBush: { x: 8, y: 144, width: 90, height: 52 },
  rockDebris: { x: 116, y: 168, width: 62, height: 28 },
  waterSparkle: { x: 194, y: 150, width: 50, height: 42 },
});

function registerFrames(scene) {
  const texture = scene.textures.get(TEXTURE_KEY);
  if (!texture || texture.key === "__MISSING") return false;

  Object.entries(FRAMES).forEach(([name, frame]) => {
    if (!texture.has(name)) {
      texture.add(name, 0, frame.x, frame.y, frame.width, frame.height);
    }
  });
  return true;
}

function addVariant(scene, landmarks, frame, x, y, options = {}) {
  const image = scene.add.image(x, y, TEXTURE_KEY, frame);
  image.setOrigin(options.originX ?? 0.5, options.originY ?? 1);
  image.setDepth(options.depth ?? 80 + Math.floor(y));
  image.setScale(options.scaleX ?? options.scale ?? 1, options.scaleY ?? options.scale ?? 1);
  image.setAlpha(options.alpha ?? 1);
  image.setFlipX(Boolean(options.flipX));
  image.setAngle(options.angle ?? 0);
  image.setData({
    assetId: options.assetId ?? frame,
    decorative: true,
    cluster: options.cluster ?? "unassigned",
    layer: options.layer ?? "MIDGROUND",
    landmarkPack: "BUILDERS_VALLEY_ENVIRONMENT_VARIANTS_V1",
  });
  landmarks.push(image);
  return image;
}

function composeBridgeVariants(scene, landmarks) {
  const bridgeY = 14 * TILE_SIZE;
  const riverCenterX = STREAM.left + STREAM.width / 2;
  const westBankX = STREAM.left;
  const eastBankX = STREAM.left + STREAM.width;

  addVariant(scene, landmarks, "bridgeShadow", riverCenterX, bridgeY + 54, {
    assetId: "BV_BRIDGE_WATER_SHADOW_01",
    cluster: "BRIDGE_GATEWAY",
    layer: "WATER_SHADOW",
    originY: 0.5,
    scaleX: 2.7,
    scaleY: 1.15,
    alpha: 0.32,
    depth: 14,
  });

  [-84, 0, 84].forEach((dx, index) => {
    addVariant(scene, landmarks, "bridgeDeck", riverCenterX + dx, bridgeY + 44, {
      assetId: `BV_BRIDGE_DECK_PLANKS_${String(index + 1).padStart(2, "0")}`,
      cluster: "BRIDGE_GATEWAY",
      layer: "BRIDGE_DECK_VARIANT",
      scaleX: 0.9,
      scaleY: 0.82,
      alpha: 0.96,
      depth: 74 + bridgeY,
    });
  });

  [westBankX - 12, eastBankX + 12].forEach((x, index) => {
    addVariant(scene, landmarks, "bridgePost", x, bridgeY + 42, {
      assetId: `BV_BRIDGE_SUPPORT_POST_${index === 0 ? "WEST" : "EAST"}`,
      cluster: "BRIDGE_GATEWAY",
      layer: "BRIDGE_SUPPORT",
      scale: 0.88,
      flipX: index === 1,
      depth: 94 + bridgeY,
    });
  });

  [-58, 22, 86].forEach((dx, index) => {
    addVariant(scene, landmarks, "waterSparkle", riverCenterX + dx, bridgeY + 118 + (index % 2) * 28, {
      assetId: `BV_WATER_SPARKLE_BRIDGE_${String(index + 1).padStart(2, "0")}`,
      cluster: "RIVER",
      layer: "WATER_EFFECT",
      originY: 0.5,
      scale: 0.46 + index * 0.06,
      alpha: 0.42,
      depth: 15,
      flipX: index % 2 === 1,
    });
  });
}

function composeWorkshopVariants(scene, landmarks) {
  const eastBankX = STREAM.left + STREAM.width;
  const bridgeY = 14 * TILE_SIZE;
  const workshopX = eastBankX + 142;
  const workshopY = bridgeY - 50;

  addVariant(scene, landmarks, "woodPile", workshopX - 88, workshopY + 94, {
    assetId: "BV_WOOD_PILE_01_WORKSHOP",
    cluster: "WORKSHOP_YARD",
    layer: "WORKSHOP_PROP",
    scale: 0.74,
  });
  addVariant(scene, landmarks, "toolRack", workshopX + 12, workshopY + 18, {
    assetId: "BV_TOOL_RACK_01_WORKSHOP",
    cluster: "WORKSHOP_YARD",
    layer: "WORKSHOP_PROP",
    scale: 0.78,
  });
  addVariant(scene, landmarks, "materialSack", workshopX + 98, workshopY + 84, {
    assetId: "BV_MATERIAL_SACK_01_WORKSHOP",
    cluster: "WORKSHOP_YARD",
    layer: "WORKSHOP_PROP",
    scale: 0.72,
    flipX: true,
  });
  addVariant(scene, landmarks, "rockDebris", workshopX - 6, workshopY + 126, {
    assetId: "BV_SMALL_ROCK_DEBRIS_01_WORKSHOP",
    cluster: "WORKSHOP_YARD",
    layer: "GROUND_DETAIL",
    scale: 0.62,
    alpha: 0.78,
    depth: 21,
  });
  addVariant(scene, landmarks, "foregroundBush", workshopX + 136, workshopY + 132, {
    assetId: "BV_BUSH_FOREGROUND_01_WORKSHOP",
    cluster: "WORKSHOP_YARD",
    layer: "FOREGROUND_VEGETATION",
    scale: 0.62,
    alpha: 0.92,
    depth: 120 + workshopY,
  });
}

function composeFieldVariants(scene, landmarks) {
  const pockets = [
    [9 * TILE_SIZE, 18 * TILE_SIZE, false],
    [15 * TILE_SIZE, 27 * TILE_SIZE, true],
    [35 * TILE_SIZE, 10 * TILE_SIZE, true],
    [40 * TILE_SIZE, 24 * TILE_SIZE, false],
  ];

  pockets.forEach(([x, y, flipX], index) => {
    addVariant(scene, landmarks, index % 2 === 0 ? "foregroundBush" : "rockDebris", x, y, {
      assetId: `BV_FIELD_DETAIL_VARIANT_${String(index + 1).padStart(2, "0")}`,
      cluster: "FIELD_VARIANTS",
      layer: index % 2 === 0 ? "FOREGROUND_VEGETATION" : "GROUND_DETAIL",
      scale: index % 2 === 0 ? 0.48 : 0.58,
      alpha: 0.72,
      flipX,
      depth: index % 2 === 0 ? 70 + y : 20,
    });
  });
}

function composeVariants(scene) {
  if (scene.__environmentVariants || !registerFrames(scene)) return;

  const landmarks = [];
  composeBridgeVariants(scene, landmarks);
  composeWorkshopVariants(scene, landmarks);
  composeFieldVariants(scene, landmarks);
  scene.__environmentVariants = landmarks;

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.environmentVariants = "BUILDERS_VALLEY_ENVIRONMENT_VARIANTS_V1";
    window.__BUILDERS_VALLEY__.composition = "BUILDERS_VALLEY_WORLD_COMPOSITION_V1_3";
    window.__BUILDERS_VALLEY__.getEnvironmentVariants = () =>
      landmarks.map((landmark) => ({
        assetId: landmark.getData("assetId"),
        cluster: landmark.getData("cluster"),
        layer: landmark.getData("layer"),
        x: landmark.x,
        y: landmark.y,
      }));
  }
}

prototype.preload = function preloadEnvironmentVariants() {
  originalPreload?.call(this);
  if (!this.textures.exists(TEXTURE_KEY)) {
    this.load.svg(TEXTURE_KEY, variantsPackUrl, { width: 256, height: 256 });
  }
};

prototype.create = function createWithEnvironmentVariants() {
  originalCreate.call(this);
  composeVariants(this);
};
