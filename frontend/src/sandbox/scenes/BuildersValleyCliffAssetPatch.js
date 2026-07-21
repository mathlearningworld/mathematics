import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BUILDERS_VALLEY_LAYER_CONTRACT } from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const ASSET_ID = "BV_CLIFF_ATLAS_01";
const STANDARD = "BUILDERS_VALLEY_PES_002A1_ORGANIC_CLIFF_COMPOSITION_V1";
const FACE_FRAMES = Object.freeze(["cliff_face_01", "cliff_face_02"]);
const CAP_FRAMES = Object.freeze(["cliff_cap_01", "cliff_cap_02"]);
const ROCK_FRAMES = Object.freeze(["gorge_rock_01", "gorge_rock_02"]);
const SHELF_FRAMES = Object.freeze(["shore_shelf_01", "shore_shelf_02"]);

const COMPOSITION_ZONES = Object.freeze([
  Object.freeze({ id: "upper-gorge", progress: 0.08, density: "DENSE", side: "BOTH", scale: 1.12 }),
  Object.freeze({ id: "waterfall-lip", progress: 0.18, density: "ACCENT", side: "LEFT", scale: 1.0 }),
  Object.freeze({ id: "mid-channel-left", progress: 0.42, density: "SPARSE", side: "LEFT", scale: 0.82 }),
  Object.freeze({ id: "bridge-approach", progress: 0.64, density: "CONTROLLED", side: "RIGHT", scale: 0.92 }),
  Object.freeze({ id: "lower-exit", progress: 0.88, density: "SPARSE", side: "LEFT", scale: 0.76 }),
]);

function addImage(scene, container, x, y, frame, width, height, alpha = 1) {
  const image = scene.add
    .image(Math.round(x), Math.round(y), ASSET_ID, frame)
    .setDisplaySize(Math.round(width), Math.round(height))
    .setAlpha(alpha);
  container.add(image);
  return image;
}

function sampleAtProgress(geometry, progress) {
  const index = Math.min(
    geometry.edgeSamples.length - 1,
    Math.max(0, Math.round(progress * (geometry.edgeSamples.length - 1))),
  );
  return { sample: geometry.edgeSamples[index], index };
}

function createCluster(scene, container, sample, zone, zoneIndex) {
  const sprites = [];
  const sideDefinitions = zone.side === "BOTH" ? ["LEFT", "RIGHT"] : [zone.side];

  sideDefinitions.forEach((side, sideIndex) => {
    const direction = side === "LEFT" ? -1 : 1;
    const edgeX = side === "LEFT" ? sample.left : sample.right;
    const frameOffset = (zoneIndex + sideIndex) % 2;
    const baseScale = zone.scale;
    const isDense = zone.density === "DENSE";
    const isAccent = zone.density === "ACCENT";

    const face = addImage(
      scene,
      container,
      edgeX + direction * (isDense ? 10 : 6),
      sample.y + (isAccent ? 1 : 4),
      FACE_FRAMES[frameOffset],
      28 * baseScale,
      24 * baseScale,
      isDense ? 0.9 : 0.76,
    );
    if (side === "RIGHT") face.setFlipX(true);
    sprites.push(face);

    if (isDense || isAccent || zone.density === "CONTROLLED") {
      const cap = addImage(
        scene,
        container,
        edgeX + direction * (isDense ? 17 : 12),
        sample.y - (isDense ? 11 : 8),
        CAP_FRAMES[(frameOffset + 1) % 2],
        25 * baseScale,
        17 * baseScale,
        isDense ? 0.94 : 0.84,
      );
      if (side === "RIGHT") cap.setFlipX(true);
      sprites.push(cap);
    }

    if (isDense || isAccent) {
      const secondaryRock = addImage(
        scene,
        container,
        edgeX + direction * (isDense ? 29 : 24),
        sample.y + (isDense ? 12 : 9),
        ROCK_FRAMES[(frameOffset + 1) % 2],
        24 * baseScale,
        21 * baseScale,
        isDense ? 0.92 : 0.82,
      );
      if (side === "RIGHT") secondaryRock.setFlipX(true);
      sprites.push(secondaryRock);
    }
  });

  return sprites;
}

function createGorgeAnchor(scene, container, geometry) {
  const sprites = [];
  const top = geometry.edgeSamples[0];
  const pool = geometry.edgeSamples[Math.min(5, geometry.edgeSamples.length - 1)];
  const anchors = [
    [top.center - 70, 87, ROCK_FRAMES[0], 42, 35, false],
    [top.center + 72, 92, ROCK_FRAMES[1], 46, 37, true],
    [pool.left - 15, pool.y + 24, ROCK_FRAMES[1], 31, 27, false],
  ];

  anchors.forEach(([x, y, frame, width, height, flipX]) => {
    const image = addImage(scene, container, x, y, frame, width, height, 0.94);
    image.setFlipX(flipX);
    sprites.push(image);
  });

  return sprites;
}

function createShoreAccents(scene, container, geometry) {
  const sprites = [];
  const accents = [
    { progress: 0.31, side: "RIGHT", frame: SHELF_FRAMES[0], scale: 0.92 },
    { progress: 0.73, side: "LEFT", frame: SHELF_FRAMES[1], scale: 0.78 },
  ];

  accents.forEach((accent) => {
    const { sample } = sampleAtProgress(geometry, accent.progress);
    const right = accent.side === "RIGHT";
    const image = addImage(
      scene,
      container,
      right ? sample.right - 1 : sample.left + 1,
      sample.y + 10,
      accent.frame,
      23 * accent.scale,
      15 * accent.scale,
      0.64,
    );
    image.setFlipX(right);
    sprites.push(image);
  });

  return sprites;
}

function createCliffDetails(scene, geometry) {
  const container = scene.add.container(0, 0).setDepth(BUILDERS_VALLEY_LAYER_CONTRACT.cliff + 3);
  const sprites = [];
  const clusters = [];

  sprites.push(...createGorgeAnchor(scene, container, geometry));

  COMPOSITION_ZONES.forEach((zone, zoneIndex) => {
    const { sample, index } = sampleAtProgress(geometry, zone.progress);
    const clusterSprites = createCluster(scene, container, sample, zone, zoneIndex);
    sprites.push(...clusterSprites);
    clusters.push({
      id: zone.id,
      sampleIndex: index,
      density: zone.density,
      side: zone.side,
      spriteCount: clusterSprites.length,
    });
  });

  sprites.push(...createShoreAccents(scene, container, geometry));

  return { container, sprites, clusters };
}

function installCliffAssetReplacement(scene) {
  const foundation = scene.__terrainRiverFoundation;
  const textureAvailable = scene.textures.exists(ASSET_ID);
  const runtime = {
    standard: STANDARD,
    assetId: ASSET_ID,
    status: textureAvailable && foundation ? "ASSET_ACTIVE" : "FALLBACK_ACTIVE",
    compositionMode: "HYBRID_FOUNDATION_WITH_ORGANIC_PRODUCTION_CLUSTERS",
    compositionPolicy: "ASYMMETRIC_ZONE_WEIGHTED_CLUSTERING",
    spriteCount: 0,
    clusterCount: 0,
    clusters: [],
    foundationRetained: true,
    gameplayGeometryChanged: false,
  };

  if (textureAvailable && foundation?.geometry) {
    const replacement = createCliffDetails(scene, foundation.geometry);
    runtime.container = replacement.container;
    runtime.sprites = replacement.sprites;
    runtime.spriteCount = replacement.sprites.length;
    runtime.clusterCount = replacement.clusters.length;
    runtime.clusters = replacement.clusters;
  }

  scene.__cliffAssetReplacement = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getCliffAssetReplacement = () => ({
    standard: runtime.standard,
    assetId: runtime.assetId,
    packageStatus: runtime.status,
    compositionMode: runtime.compositionMode,
    compositionPolicy: runtime.compositionPolicy,
    spriteCount: runtime.spriteCount,
    clusterCount: runtime.clusterCount,
    clusters: runtime.clusters.map((cluster) => ({ ...cluster })),
    foundationRetained: runtime.foundationRetained,
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugRiverComposition = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getCliffAssetReplacement();
    console.group(`Builders Valley River Composition — ${snapshot.packageStatus}`);
    console.table(snapshot.clusters);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithCliffAssetReplacement() {
  originalCreate.call(this);
  installCliffAssetReplacement(this);
};
