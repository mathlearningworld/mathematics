import { BuildersValleyScene } from "./BuildersValleyScene.js";
import landmarkPackUrl from "../../../assets/builders-valley/environment/builders-valley-environment-landmark-pack-v1.svg?url";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";

const TEXTURE_KEY = "builders-valley-environment-landmark-pack-v1";
const prototype = BuildersValleyScene.prototype;
const originalPreload = prototype.preload;
const originalCreate = prototype.create;

const FRAMES = Object.freeze({
  bridgeBody: { x: 8, y: 8, width: 120, height: 66 },
  bridgeFrontRail: { x: 8, y: 72, width: 120, height: 8 },
  workbench: { x: 140, y: 10, width: 104, height: 72 },
  crate: { x: 12, y: 112, width: 60, height: 50 },
  barrel: { x: 76, y: 112, width: 56, height: 52 },
  lantern: { x: 142, y: 108, width: 64, height: 72 },
  dirtPath: { x: 202, y: 112, width: 44, height: 44 },
  cliff: { x: 8, y: 184, width: 112, height: 56 },
  grassDetails: { x: 136, y: 184, width: 112, height: 56 },
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

function addLandmark(scene, frame, x, y, options = {}) {
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
    landmarkPack: "BUILDERS_VALLEY_ENVIRONMENT_LANDMARK_PACK_V1",
  });
  return image;
}

function addPathTile(scene, landmarks, x, y, assetId, cluster, options = {}) {
  landmarks.push(
    addLandmark(scene, "dirtPath", x, y, {
      assetId,
      cluster,
      layer: options.layer ?? "GROUND",
      originY: 0.5,
      depth: options.depth ?? 18,
      alpha: options.alpha ?? 0.88,
      scaleX: options.scaleX ?? 1,
      scaleY: options.scaleY ?? 1,
      angle: options.angle ?? 0,
    }),
  );
}

function addGrassCluster(scene, landmarks, x, y, cluster, options = {}) {
  landmarks.push(
    addLandmark(scene, "grassDetails", x, y, {
      assetId: `${cluster}_GRASS_${options.id ?? "01"}`,
      cluster,
      layer: "GROUND_DETAIL",
      scale: options.scale ?? 0.75,
      alpha: options.alpha ?? 0.82,
      flipX: options.flipX,
      angle: options.angle,
      depth: options.depth ?? 20,
    }),
  );
}

function composeBridgeGateway(scene, landmarks, bridgeY, westBankX, eastBankX, riverCenterX) {
  const bridgeScaleX = 1.72;
  const bridgeBottomY = bridgeY + 24;

  // A continuous low deck is established first. The bridge body now acts as
  // material and edge detail instead of reading as a solid barrier.
  [-88, -44, 0, 44, 88].forEach((dx, index) => {
    addPathTile(
      scene,
      landmarks,
      riverCenterX + dx,
      bridgeY + 40,
      `BV_BRIDGE_DECK_TILE_${String(index + 1).padStart(2, "0")}`,
      "BRIDGE_GATEWAY",
      { layer: "BRIDGE_DECK", depth: 72 + bridgeY, alpha: 0.96, scaleX: 1.08, scaleY: 0.78 },
    );
  });

  landmarks.push(
    addLandmark(scene, "bridgeBody", riverCenterX, bridgeBottomY, {
      assetId: "BV_BRIDGE_WOOD_MODULE_01_BODY",
      cluster: "BRIDGE_GATEWAY",
      layer: "BRIDGE_BODY",
      scaleX: bridgeScaleX,
      scaleY: 0.72,
      depth: 82 + bridgeY,
    }),
    addLandmark(scene, "bridgeFrontRail", riverCenterX, bridgeBottomY + 16, {
      assetId: "BV_BRIDGE_WOOD_MODULE_01_FRONT_RAIL",
      cluster: "BRIDGE_GATEWAY",
      layer: "FOREGROUND_RAIL",
      scaleX: bridgeScaleX,
      scaleY: 0.58,
      depth: 720 + bridgeY,
      alpha: 0.9,
    }),
    addLandmark(scene, "lantern", westBankX - 34, bridgeY - 16, {
      assetId: "BV_LANTERN_POST_01_WEST",
      cluster: "BRIDGE_GATEWAY",
      scale: 0.82,
    }),
    addLandmark(scene, "lantern", eastBankX + 34, bridgeY - 16, {
      assetId: "BV_LANTERN_POST_01_EAST",
      cluster: "BRIDGE_GATEWAY",
      scale: 0.82,
      flipX: true,
    }),
  );

  // River-bank details sit outside the walking line.
  landmarks.push(
    addLandmark(scene, "cliff", westBankX - 150, bridgeY + 70, {
      assetId: "BV_RIVER_BANK_01_BRIDGE_WEST",
      cluster: "BRIDGE_GATEWAY",
      layer: "RIVER_BANK",
      originX: 0,
      scaleX: 0.84,
      scaleY: 0.38,
      depth: 22,
      alpha: 0.86,
    }),
    addLandmark(scene, "cliff", eastBankX + 56, bridgeY + 70, {
      assetId: "BV_RIVER_BANK_01_BRIDGE_EAST",
      cluster: "BRIDGE_GATEWAY",
      layer: "RIVER_BANK",
      originX: 0,
      scaleX: 0.84,
      scaleY: 0.38,
      depth: 22,
      flipX: true,
      alpha: 0.86,
    }),
  );

  [-176, -132, -88, -44, 132, 176].forEach((dx, index) => {
    addPathTile(
      scene,
      landmarks,
      riverCenterX + dx,
      bridgeY + 40,
      `BRIDGE_GATEWAY_APPROACH_${String(index + 1).padStart(2, "0")}`,
      "BRIDGE_GATEWAY",
      { alpha: 0.88 },
    );
  });

  addGrassCluster(scene, landmarks, westBankX - 108, bridgeY - 8, "BRIDGE_GATEWAY", { id: "WEST_01", scale: 0.66 });
  addGrassCluster(scene, landmarks, westBankX - 72, bridgeY + 82, "BRIDGE_GATEWAY", { id: "WEST_02", scale: 0.54, flipX: true });
  addGrassCluster(scene, landmarks, eastBankX + 92, bridgeY - 6, "BRIDGE_GATEWAY", { id: "EAST_01", scale: 0.66, flipX: true });
  addGrassCluster(scene, landmarks, eastBankX + 140, bridgeY + 80, "BRIDGE_GATEWAY", { id: "EAST_02", scale: 0.54 });
}

function composeWorkshopYard(scene, landmarks, bridgeY, eastBankX) {
  const workshopX = eastBankX + 142;
  const workshopY = bridgeY - 50;

  // Irregular authored footprint. Missing corners, varied scale and small angle
  // changes prevent the ground from reading as a rectangular tile pad.
  const groundLayout = [
    [-54, 48, 1.04, 0.82, -2],
    [-10, 44, 1.08, 0.86, 1],
    [34, 48, 1.0, 0.82, 0],
    [70, 58, 0.82, 0.74, 2],
    [-40, 84, 0.88, 0.72, 1],
    [4, 88, 1.02, 0.78, -1],
    [48, 88, 0.92, 0.74, 1],
    [82, 98, 0.68, 0.62, -2],
    [-4, 122, 0.72, 0.58, 2],
  ];
  groundLayout.forEach(([dx, dy, scaleX, scaleY, angle], index) => {
    addPathTile(
      scene,
      landmarks,
      workshopX + dx,
      workshopY + dy,
      `WORKSHOP_GROUND_TILE_${String(index + 1).padStart(2, "0")}`,
      "WORKSHOP_GROUND",
      { depth: 17, alpha: 0.72 + (index % 3) * 0.04, scaleX, scaleY, angle },
    );
  });

  landmarks.push(
    addLandmark(scene, "workbench", workshopX, workshopY, {
      assetId: "BV_WORKBENCH_01",
      cluster: "WORKSHOP_YARD",
      scale: 1.08,
    }),
    addLandmark(scene, "crate", workshopX - 60, workshopY + 56, {
      assetId: "BV_CRATE_01_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.82,
    }),
    addLandmark(scene, "barrel", workshopX + 54, workshopY + 62, {
      assetId: "BV_BARREL_01_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.84,
    }),
    addLandmark(scene, "crate", workshopX + 78, workshopY + 88, {
      assetId: "BV_CRATE_02_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.54,
      flipX: true,
      alpha: 0.94,
    }),
    addLandmark(scene, "lantern", workshopX + 122, workshopY + 16, {
      assetId: "BV_LANTERN_POST_02_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.68,
      flipX: true,
    }),
  );

  [[eastBankX + 64, bridgeY + 78], [eastBankX + 92, bridgeY + 58], [eastBankX + 118, bridgeY + 38]].forEach(
    ([x, y], index) => {
      addPathTile(scene, landmarks, x, y, `WORKSHOP_APPROACH_${String(index + 1).padStart(2, "0")}`, "WORKSHOP_APPROACH", {
        alpha: 0.74,
        scaleX: 0.9,
        scaleY: 0.72,
        angle: index - 1,
      });
    },
  );

  // Grass pushes into the edge to soften the authored footprint.
  addGrassCluster(scene, landmarks, workshopX - 112, workshopY + 82, "WORKSHOP_YARD", { id: "EDGE_01", scale: 0.48 });
  addGrassCluster(scene, landmarks, workshopX + 106, workshopY + 66, "WORKSHOP_YARD", { id: "EDGE_02", scale: 0.5, flipX: true });
  addGrassCluster(scene, landmarks, workshopX + 24, workshopY + 118, "WORKSHOP_YARD", { id: "EDGE_03", scale: 0.42, alpha: 0.68 });
  addGrassCluster(scene, landmarks, workshopX - 30, workshopY + 94, "WORKSHOP_YARD", { id: "CONTACT_01", scale: 0.32, alpha: 0.62, flipX: true });
}

function composeFieldPockets(scene, landmarks) {
  const fieldClusters = [
    { id: "NORTHWEST", x: 8 * TILE_SIZE, y: 6 * TILE_SIZE, flipX: false },
    { id: "SOUTHWEST", x: 11 * TILE_SIZE, y: 24 * TILE_SIZE, flipX: true },
    { id: "NORTHEAST", x: 38 * TILE_SIZE, y: 7 * TILE_SIZE, flipX: true },
    { id: "SOUTHEAST", x: 36 * TILE_SIZE, y: 25 * TILE_SIZE, flipX: false },
  ];

  fieldClusters.forEach(({ id, x, y, flipX }, index) => {
    addGrassCluster(scene, landmarks, x, y, `FIELD_${id}`, {
      id: "PRIMARY",
      scale: 0.68 + index * 0.04,
      flipX,
      alpha: 0.76,
    });
    addGrassCluster(scene, landmarks, x + (flipX ? -58 : 58), y + 42, `FIELD_${id}`, {
      id: "SECONDARY",
      scale: 0.4 + index * 0.03,
      flipX: !flipX,
      alpha: 0.66,
    });
  });
}

function composeLandmarks(scene) {
  if (scene.__environmentLandmarks || !registerFrames(scene)) return;

  const riverCenterX = STREAM.left + STREAM.width / 2;
  const bridgeY = 14 * TILE_SIZE;
  const eastBankX = STREAM.left + STREAM.width;
  const westBankX = STREAM.left;
  const landmarks = [];

  composeBridgeGateway(scene, landmarks, bridgeY, westBankX, eastBankX, riverCenterX);
  composeWorkshopYard(scene, landmarks, bridgeY, eastBankX);
  composeFieldPockets(scene, landmarks);

  scene.__environmentLandmarks = landmarks;

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.landmarkPack = "BUILDERS_VALLEY_ENVIRONMENT_LANDMARK_PACK_V1";
    window.__BUILDERS_VALLEY__.composition = "BUILDERS_VALLEY_WORLD_COMPOSITION_V1_2";
    window.__BUILDERS_VALLEY__.getLandmarks = () =>
      landmarks.map((landmark) => ({
        assetId: landmark.getData("assetId"),
        cluster: landmark.getData("cluster"),
        layer: landmark.getData("layer"),
        x: landmark.x,
        y: landmark.y,
      }));
  }
}

prototype.preload = function preloadEnvironmentLandmarks() {
  originalPreload?.call(this);
  if (!this.textures.exists(TEXTURE_KEY)) {
    this.load.svg(TEXTURE_KEY, landmarkPackUrl, { width: 256, height: 256 });
  }
};

prototype.create = function createWithEnvironmentLandmarks() {
  originalCreate.call(this);
  composeLandmarks(this);
};
