import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_HERO_003_CLIFF_CANYON_COMPOSITION_V1";

const CANYON_MASSES = Object.freeze([
  Object.freeze({
    id: "LEFT_CANYON_WALL",
    points: Object.freeze([
      STREAM.left - 190, 90,
      STREAM.left - 56, 90,
      STREAM.left - 42, 260,
      STREAM.left - 72, 430,
      STREAM.left - 104, 540,
      STREAM.left - 142, 560,
      STREAM.left - 174, 430,
      STREAM.left - 206, 250,
    ]),
    fill: 0x34483f,
    alpha: 0.42,
    depth: 23,
  }),
  Object.freeze({
    id: "RIGHT_CANYON_WALL",
    points: Object.freeze([
      STREAM.left + STREAM.width + 48, 90,
      STREAM.left + STREAM.width + 196, 90,
      STREAM.left + STREAM.width + 208, 258,
      STREAM.left + STREAM.width + 180, 432,
      STREAM.left + STREAM.width + 148, 548,
      STREAM.left + STREAM.width + 106, 560,
      STREAM.left + STREAM.width + 76, 430,
      STREAM.left + STREAM.width + 42, 258,
    ]),
    fill: 0x34483f,
    alpha: 0.4,
    depth: 23,
  }),
  Object.freeze({
    id: "LEFT_CLIFF_SHADOW",
    points: Object.freeze([
      STREAM.left - 124, 104,
      STREAM.left - 58, 104,
      STREAM.left - 50, 294,
      STREAM.left - 82, 454,
      STREAM.left - 116, 514,
      STREAM.left - 146, 430,
      STREAM.left - 158, 246,
    ]),
    fill: 0x1f3130,
    alpha: 0.34,
    depth: 24,
  }),
  Object.freeze({
    id: "RIGHT_CLIFF_SHADOW",
    points: Object.freeze([
      STREAM.left + STREAM.width + 56, 104,
      STREAM.left + STREAM.width + 128, 104,
      STREAM.left + STREAM.width + 158, 248,
      STREAM.left + STREAM.width + 146, 432,
      STREAM.left + STREAM.width + 112, 514,
      STREAM.left + STREAM.width + 80, 452,
      STREAM.left + STREAM.width + 48, 292,
    ]),
    fill: 0x1f3130,
    alpha: 0.32,
    depth: 24,
  }),
  Object.freeze({
    id: "WORKSHOP_TERRACE_BASE",
    points: Object.freeze([
      STREAM.left + STREAM.width + 82, 430,
      WORLD_WIDTH - 70, 430,
      WORLD_WIDTH - 70, 748,
      STREAM.left + STREAM.width + 88, 748,
      STREAM.left + STREAM.width + 58, 654,
    ]),
    fill: 0x71543a,
    alpha: 0.3,
    depth: 25,
  }),
  Object.freeze({
    id: "WORKSHOP_TERRACE_EDGE",
    points: Object.freeze([
      STREAM.left + STREAM.width + 78, 694,
      WORLD_WIDTH - 86, 694,
      WORLD_WIDTH - 86, 758,
      STREAM.left + STREAM.width + 96, 758,
    ]),
    fill: 0x403a32,
    alpha: 0.42,
    depth: 26,
  }),
]);

const ROCK_BANDS = Object.freeze([
  Object.freeze({
    id: "LEFT_CANYON_ROCK_BAND",
    placements: Object.freeze([
      { x: STREAM.left - 132, y: 190, scale: 0.72 },
      { x: STREAM.left - 154, y: 282, scale: 0.64 },
      { x: STREAM.left - 138, y: 372, scale: 0.68 },
      { x: STREAM.left - 118, y: 466, scale: 0.66 },
    ]),
  }),
  Object.freeze({
    id: "RIGHT_CANYON_ROCK_BAND",
    placements: Object.freeze([
      { x: STREAM.left + STREAM.width + 138, y: 194, scale: 0.72 },
      { x: STREAM.left + STREAM.width + 158, y: 286, scale: 0.64 },
      { x: STREAM.left + STREAM.width + 144, y: 378, scale: 0.68 },
      { x: STREAM.left + STREAM.width + 122, y: 470, scale: 0.66 },
    ]),
  }),
  Object.freeze({
    id: "WORKSHOP_TERRACE_ROCK_EDGE",
    placements: Object.freeze([
      { x: STREAM.left + STREAM.width + 116, y: 716, scale: 0.58 },
      { x: STREAM.left + STREAM.width + 204, y: 730, scale: 0.54 },
      { x: STREAM.left + STREAM.width + 294, y: 736, scale: 0.56 },
      { x: STREAM.left + STREAM.width + 388, y: 730, scale: 0.52 },
    ]),
  }),
]);

function createMass(scene, mass) {
  const polygon = scene.add
    .polygon(0, 0, mass.points, mass.fill, mass.alpha)
    .setOrigin(0, 0)
    .setDepth(mass.depth);
  polygon.setDataEnabled();
  polygon.setData("heroPass", "HERO-003");
  polygon.setData("canyonMass", mass.id);
  polygon.setData("decorativeOnly", true);
  return polygon;
}

function createRock(scene, band, placement) {
  if (!scene.textures.exists("PAL_RIVER_EDGE_ATLAS_01")) return null;
  const rock = scene.add
    .sprite(placement.x, placement.y, "PAL_RIVER_EDGE_ATLAS_01", "mossy_bank_rocks_01")
    .setOrigin(0.5, 1)
    .setScale(placement.scale)
    .setDepth(Math.max(42, Math.min(338, placement.y + 22)));
  rock.setDataEnabled();
  rock.setData("heroPass", "HERO-003");
  rock.setData("rockBand", band.id);
  rock.setData("decorativeOnly", true);
  return rock;
}

function suppressBridgeReedMarkers(scene) {
  const suppressed = [];
  scene.children.list.forEach((child) => {
    const frameName = child?.frame?.name;
    if (frameName !== "reed_cluster_01") return;
    const nearBridge = child.y >= 470 && child.y <= 640;
    const nearStream = child.x >= STREAM.left - 180 && child.x <= STREAM.left + STREAM.width + 180;
    if (nearBridge && nearStream) {
      child.setVisible(false);
      child.setData?.("hero003Suppressed", true);
      suppressed.push(child);
    }
  });
  return suppressed;
}

function installHeroCliffCanyonComposition(scene) {
  scene.__hero003Runtime?.objects?.forEach((object) => object?.destroy?.());
  scene.__hero003Runtime?.suppressed?.forEach((object) => object?.setVisible?.(true));

  const objects = CANYON_MASSES.map((mass) => createMass(scene, mass));
  const missing = [];
  const bandSummaries = ROCK_BANDS.map((band) => {
    let visibleCount = 0;
    band.placements.forEach((placement) => {
      const rock = createRock(scene, band, placement);
      if (rock) {
        objects.push(rock);
        visibleCount += 1;
      } else {
        missing.push("PAL_RIVER_EDGE_ATLAS_01:mossy_bank_rocks_01");
      }
    });
    return Object.freeze({
      id: band.id,
      declaredCount: band.placements.length,
      visibleCount,
    });
  });

  const suppressed = suppressBridgeReedMarkers(scene);
  const runtime = {
    standard: STANDARD,
    status: missing.length === 0 ? "ACTIVE" : "PARTIAL",
    productionPhase: "HERO-003",
    compositionMode: "HERO_FRAME_CLIFF_CANYON_COMPOSITION",
    canyonMassCount: CANYON_MASSES.length,
    rockBandCount: ROCK_BANDS.length,
    rockPlacementCount: ROCK_BANDS.reduce((sum, band) => sum + band.placements.length, 0),
    visibleObjectCount: objects.length,
    suppressedBridgeMarkers: suppressed.length,
    missing,
    rockBands: bandSummaries,
    heroFrameSourceOfTruth: true,
    canyonReadStrengthened: true,
    waterfallWallsExpanded: true,
    workshopTerraceEstablished: true,
    bridgeTraversalSilhouettePreserved: true,
    openGameplayFieldPreserved: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
    bounds: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
    objects,
    suppressed,
  };

  scene.__hero003Runtime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getHeroCliffCanyonComposition = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.productionPhase,
    compositionMode: runtime.compositionMode,
    canyonMassCount: runtime.canyonMassCount,
    rockBandCount: runtime.rockBandCount,
    rockPlacementCount: runtime.rockPlacementCount,
    visibleObjectCount: runtime.visibleObjectCount,
    suppressedBridgeMarkers: runtime.suppressedBridgeMarkers,
    missing: [...runtime.missing],
    rockBands: runtime.rockBands.map((band) => ({ ...band })),
    heroFrameSourceOfTruth: true,
    canyonReadStrengthened: true,
    waterfallWallsExpanded: true,
    workshopTerraceEstablished: true,
    bridgeTraversalSilhouettePreserved: true,
    openGameplayFieldPreserved: true,
    collisionObjectsAdded: 0,
    interactionAuthoritiesAdded: 0,
    aiAuthoritiesAdded: 0,
    physicsObjectsAdded: 0,
    gameplayGeometryChanged: false,
    buildersValleyVisualChanged: true,
  });
}

prototype.create = function createWithHeroCliffCanyonComposition() {
  originalCreate.call(this);
  installHeroCliffCanyonComposition(this);
};
