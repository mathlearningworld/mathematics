import { BuildersValleyScene } from "./BuildersValleyScene.js";
import landmarkPackUrl from "../../../assets/builders-valley/environment/builders-valley-environment-landmark-pack-v1.svg?url";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";

const TEXTURE_KEY = "builders-valley-environment-landmark-pack-v1";
const prototype = BuildersValleyScene.prototype;
const originalPreload = prototype.preload;
const originalCreate = prototype.create;

const FRAMES = Object.freeze({
  bridge: { x: 8, y: 8, width: 120, height: 72 },
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
    landmarkPack: "BUILDERS_VALLEY_ENVIRONMENT_LANDMARK_PACK_V1",
  });
  return image;
}

function addPath(scene, landmarks, points, cluster, alpha = 0.9) {
  points.forEach(([x, y], index) => {
    landmarks.push(
      addLandmark(scene, "dirtPath", x, y, {
        assetId: `${cluster}_PATH_${String(index + 1).padStart(2, "0")}`,
        cluster,
        originY: 0.5,
        depth: 18,
        alpha,
      }),
    );
  });
}

function addGrassCluster(scene, landmarks, x, y, cluster, options = {}) {
  landmarks.push(
    addLandmark(scene, "grassDetails", x, y, {
      assetId: `${cluster}_GRASS_${options.id ?? "01"}`,
      cluster,
      scale: options.scale ?? 0.75,
      alpha: options.alpha ?? 0.82,
      flipX: options.flipX,
      angle: options.angle,
      depth: options.depth ?? 20,
    }),
  );
}

function composeLandmarks(scene) {
  if (scene.__environmentLandmarks || !registerFrames(scene)) return;

  const riverCenterX = STREAM.left + STREAM.width / 2;
  const bridgeY = 14 * TILE_SIZE;
  const eastBankX = STREAM.left + STREAM.width;
  const westBankX = STREAM.left;
  const landmarks = [];

  // PRIMARY CLUSTER — bridge gateway. The bridge, approach paths, lamps, cliff
  // faces and vegetation must read as one authored destination rather than as
  // isolated props.
  landmarks.push(
    addLandmark(scene, "bridge", riverCenterX, bridgeY + 24, {
      assetId: "BV_BRIDGE_WOOD_MODULE_01",
      cluster: "BRIDGE_GATEWAY",
      scaleX: 1.72,
      scaleY: 1.08,
      depth: 150 + bridgeY,
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
    addLandmark(scene, "cliff", westBankX - 136, bridgeY + 65, {
      assetId: "BV_CLIFF_EDGE_01_BRIDGE_WEST",
      cluster: "BRIDGE_GATEWAY",
      originX: 0,
      scaleX: 1.18,
      scaleY: 0.82,
      depth: 23,
    }),
    addLandmark(scene, "cliff", eastBankX + 18, bridgeY + 65, {
      assetId: "BV_CLIFF_EDGE_01_BRIDGE_EAST",
      cluster: "BRIDGE_GATEWAY",
      originX: 0,
      scaleX: 1.18,
      scaleY: 0.82,
      depth: 23,
      flipX: true,
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
    0.94,
  );

  addGrassCluster(scene, landmarks, westBankX - 92, bridgeY - 10, "BRIDGE_GATEWAY", {
    id: "WEST_01",
    scale: 0.72,
  });
  addGrassCluster(scene, landmarks, westBankX - 48, bridgeY + 76, "BRIDGE_GATEWAY", {
    id: "WEST_02",
    scale: 0.62,
    flipX: true,
  });
  addGrassCluster(scene, landmarks, eastBankX + 72, bridgeY - 8, "BRIDGE_GATEWAY", {
    id: "EAST_01",
    scale: 0.72,
    flipX: true,
  });
  addGrassCluster(scene, landmarks, eastBankX + 124, bridgeY + 72, "BRIDGE_GATEWAY", {
    id: "EAST_02",
    scale: 0.62,
  });

  // SECONDARY CLUSTER — workshop yard. Every primary prop receives supporting
  // props, a readable work surface and a path connection to the bridge.
  const workshopX = eastBankX + 118;
  const workshopY = bridgeY - 42;
  landmarks.push(
    addLandmark(scene, "workbench", workshopX, workshopY, {
      assetId: "BV_WORKBENCH_01",
      cluster: "WORKSHOP_YARD",
      scale: 1.08,
    }),
    addLandmark(scene, "crate", workshopX - 70, workshopY + 48, {
      assetId: "BV_CRATE_01_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.9,
    }),
    addLandmark(scene, "barrel", workshopX + 62, workshopY + 54, {
      assetId: "BV_BARREL_01_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.9,
    }),
    addLandmark(scene, "crate", workshopX + 84, workshopY + 74, {
      assetId: "BV_CRATE_02_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.62,
      flipX: true,
      alpha: 0.94,
    }),
    addLandmark(scene, "lantern", workshopX - 114, workshopY + 20, {
      assetId: "BV_LANTERN_POST_02_WORKSHOP",
      cluster: "WORKSHOP_YARD",
      scale: 0.7,
    }),
  );

  addPath(
    scene,
    landmarks,
    [
      [eastBankX + 52, bridgeY + 82],
      [eastBankX + 78, bridgeY + 58],
      [eastBankX + 102, bridgeY + 34],
      [workshopX - 4, workshopY + 82],
    ],
    "WORKSHOP_YARD",
    0.83,
  );

  addGrassCluster(scene, landmarks, workshopX - 112, workshopY + 80, "WORKSHOP_YARD", {
    id: "01",
    scale: 0.58,
  });
  addGrassCluster(scene, landmarks, workshopX + 112, workshopY + 34, "WORKSHOP_YARD", {
    id: "02",
    scale: 0.62,
    flipX: true,
  });
  addGrassCluster(scene, landmarks, workshopX + 20, workshopY + 96, "WORKSHOP_YARD", {
    id: "03",
    scale: 0.5,
    alpha: 0.74,
  });

  // TERTIARY CLUSTERS — authored field pockets. These break up large empty
  // grass areas using scale variation without obstructing resources or adding
  // new world rules.
  const fieldClusters = [
    { id: "NORTHWEST", x: 8 * TILE_SIZE, y: 6 * TILE_SIZE, flipX: false },
    { id: "SOUTHWEST", x: 11 * TILE_SIZE, y: 24 * TILE_SIZE, flipX: true },
    { id: "NORTHEAST", x: 38 * TILE_SIZE, y: 7 * TILE_SIZE, flipX: true },
    { id: "SOUTHEAST", x: 36 * TILE_SIZE, y: 25 * TILE_SIZE, flipX: false },
  ];

  fieldClusters.forEach(({ id, x, y, flipX }, index) => {
    addGrassCluster(scene, landmarks, x, y, `FIELD_${id}`, {
      id: "PRIMARY",
      scale: 0.72 + index * 0.04,
      flipX,
      alpha: 0.78,
    });
    addGrassCluster(scene, landmarks, x + (flipX ? -58 : 58), y + 42, `FIELD_${id}`, {
      id: "SECONDARY",
      scale: 0.42 + index * 0.03,
      flipX: !flipX,
      alpha: 0.68,
    });
  });

  scene.__environmentLandmarks = landmarks;

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.landmarkPack = "BUILDERS_VALLEY_ENVIRONMENT_LANDMARK_PACK_V1";
    window.__BUILDERS_VALLEY__.composition = "BUILDERS_VALLEY_WORLD_COMPOSITION_V1";
    window.__BUILDERS_VALLEY__.getLandmarks = () =>
      landmarks.map((landmark) => ({
        assetId: landmark.getData("assetId"),
        cluster: landmark.getData("cluster"),
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
