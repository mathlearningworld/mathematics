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

function addPath(scene, landmarks, points, cluster, alpha = 0.9, options = {}) {
  points.forEach(([x, y], index) => {
    landmarks.push(
      addLandmark(scene, "dirtPath", x, y, {
        assetId: `${cluster}_PATH_${String(index + 1).padStart(2, "0")}`,
        cluster,
        layer: options.layer ?? "GROUND",
        originY: 0.5,
        depth: options.depth ?? 18,
        alpha,
        scaleX: options.scaleX,
        scaleY: options.scaleY,
      }),
    );
  });
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
  const bridgeScaleY = 1.08;
  const bridgeBottomY = bridgeY + 24;

  // Split bridge presentation into a low body and a narrow foreground rail.
  // The player can visually pass across the deck while only the near rail may
  // overlap their feet, avoiding the previous solid-gate appearance.
  landmarks.push(
    addLandmark(scene, "bridgeBody", riverCenterX, bridgeBottomY, {
      assetId: "BV_BRIDGE_WOOD_MODULE_01_BODY",
      cluster: "BRIDGE_GATEWAY",
      layer: "BRIDGE_BODY",
      scaleX: bridgeScaleX,
      scaleY: bridgeScaleY,
      depth: 90 + bridgeY,
    }),
    addLandmark(scene, "bridgeFrontRail", riverCenterX, bridgeBottomY + 1, {
      assetId: "BV_BRIDGE_WOOD_MODULE_01_FRONT_RAIL",
      cluster: "BRIDGE_GATEWAY",
      layer: "FOREGROUND_RAIL",
      scaleX: bridgeScaleX,
      scaleY: bridgeScaleY,
      depth: 900 + bridgeY,
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

  // River-bank transitions sit beside the approach instead of blocking it.
  landmarks.push(
    addLandmark(scene, "cliff", westBankX - 150, bridgeY + 66, {
      assetId: "BV_RIVER_BANK_01_BRIDGE_WEST",
      cluster: "BRIDGE_GATEWAY",
      layer: "RIVER_BANK",
      originX: 0,
      scaleX: 0.9,
      scaleY: 0.48,
      depth: 22,
      alpha: 0.92,
    }),
    addLandmark(scene, "cliff", eastBankX + 48, bridgeY + 66, {
      assetId: "BV_RIVER_BANK_01_BRIDGE_EAST",
      cluster: "BRIDGE_GATEWAY",
      layer: "RIVER_BANK",
      originX: 0,
      scaleX: 0.9,
      scaleY: 0.48,
      depth: 22,
      flipX: true,
      alpha: 0.92,
    }),
  );

  addPath(
    scene,
    landmarks,
    [
      [riverCenterX - 176, bridgeY + 38],
      [riverCenterX - 132, bridgeY + 38],
      [riverCenterX - 88, bridgeY + 38],
      [riverCenterX - 44, bridgeY + 38],
      [riverCenterX, bridgeY + 38],
      [riverCenterX + 44, bridgeY + 38],
      [riverCenterX + 88, bridgeY + 38],
      [riverCenterX + 132, bridgeY + 38],
      [riverCenterX + 176, bridgeY + 38],
    ],
    "BRIDGE_GATEWAY",
    0.92,
  );

  addGrassCluster(scene, landmarks, westBankX - 108, bridgeY - 8, "BRIDGE_GATEWAY", {
    id: "WEST_01",
    scale: 0.66,
  });
  addGrassCluster(scene, landmarks, westBankX - 72, bridgeY + 82, "BRIDGE_GATEWAY", {
    id: "WEST_02",
    scale: 0.54,
    flipX: true,
  });
  addGrassCluster(scene, landmarks, eastBankX + 92, bridgeY - 6, "BRIDGE_GATEWAY", {
    id: "EAST_01",
    scale: 0.66,
    flipX: true,
  });
  addGrassCluster(scene, landmarks, eastBankX + 140, bridgeY + 80, "BRIDGE_GATEWAY", {
    id: "EAST_02",
    scale: 0.54,
  });
}

function composeWorkshopYard(scene, landmarks, bridgeY, eastBankX) {
  const workshopX = eastBankX + 150;
  const workshopY = bridgeY - 56;

  // A compact ground pad makes the workshop read as a used place rather than
  // loose props on grass. Existing path tiles are reused as authored ground.
  const groundPoints = [];
  [-44, 0, 44].forEach((dx) => {
    [-8, 36].forEach((dy) => groundPoints.push([workshopX + dx, workshopY + 66 + dy]));
  });
  addPath(scene, landmarks, groundPoints, "WORKSHOP_GROUND", 0.76, {
    depth: 17,
    scaleX: 1.04,
    scaleY: 0.92,
  });

  landmarks.push(
    addLandmark(scene, "workbench", workshopX, workshopY, {
      assetId: "BV_WORKBENCH_01",
      cluster: "WORKSHOP_YARD",
      scale: 1.08,
    }),
    addLandmark(scene, "crate", workshopX - 72, workshopY + 54, {
      assetId: "BV_CRATE_01_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.84,
    }),
    addLandmark(scene, "barrel", workshopX + 66, workshopY + 58, {
      assetId: "BV_BARREL_01_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.86,
    }),
    addLandmark(scene, "crate", workshopX + 96, workshopY + 82, {
      assetId: "BV_CRATE_02_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.56,
      flipX: true,
      alpha: 0.94,
    }),
    // Move the workshop lamp deeper into the yard so it no longer duplicates
    // the east bridge entrance lamp.
    addLandmark(scene, "lantern", workshopX + 126, workshopY + 10, {
      assetId: "BV_LANTERN_POST_02_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.68,
      flipX: true,
    }),
  );

  addPath(
    scene,
    landmarks,
    [
      [eastBankX + 62, bridgeY + 80],
      [eastBankX + 92, bridgeY + 58],
      [eastBankX + 120, bridgeY + 34],
      [workshopX - 26, workshopY + 102],
    ],
    "WORKSHOP_APPROACH",
    0.78,
  );

  addGrassCluster(scene, landmarks, workshopX - 122, workshopY + 90, "WORKSHOP_YARD", {
    id: "01",
    scale: 0.5,
  });
  addGrassCluster(scene, landmarks, workshopX + 126, workshopY + 58, "WORKSHOP_YARD", {
    id: "02",
    scale: 0.54,
    flipX: true,
  });
  addGrassCluster(scene, landmarks, workshopX + 18, workshopY + 110, "WORKSHOP_YARD", {
    id: "03",
    scale: 0.44,
    alpha: 0.7,
  });
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
    window.__BUILDERS_VALLEY__.composition = "BUILDERS_VALLEY_WORLD_COMPOSITION_V1_1";
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
