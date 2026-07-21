import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../config/worldContract.js";
import { createRiverGeometry } from "./terrain/RiverGeometry.js";
import { createShorelines } from "./terrain/ShorelineGenerator.js";
import { createTerrainMasses } from "./terrain/TerrainMassGenerator.js";
import { createTerrainPaths } from "./terrain/TerrainPathGenerator.js";
import { createWaterRenderer } from "./terrain/WaterRenderer.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_001B_TERRAIN_RIVER_FOUNDATION_V4";
const MODULES = Object.freeze([
  "RiverGeometry",
  "ShorelineGenerator",
  "TerrainMassGenerator",
  "TerrainPathGenerator",
  "WaterRenderer",
]);

function retireSupersededBlockout(scene) {
  const heroSlice = scene.__heroVisualSlice;
  heroSlice?.river?.setVisible(false);
  heroSlice?.cliffBanks?.setVisible(false);
}

function cloneAnchors(anchors) {
  return Object.fromEntries(
    Object.entries(anchors).map(([name, point]) => [name, { ...point }]),
  );
}

function installTerrainRiverFoundation(scene) {
  const geometry = createRiverGeometry();
  const paths = createTerrainPaths(scene);

  retireSupersededBlockout(scene);

  const runtime = {
    standard: STANDARD,
    status: "GORGE_NATURALIZATION_PATCH_STARTED",
    phase: "PES-001B_PHASE_2C",
    owner: "frontend/src/sandbox/scenes/BuildersValleyTerrainRiverPatch.js",
    geometry,
    water: createWaterRenderer(scene, geometry),
    shorelines: createShorelines(scene, geometry),
    terrainMasses: createTerrainMasses(scene, geometry),
    paths: paths.container,
    pathAnchors: paths.anchors,
    modules: MODULES,
    visualTargets: Object.freeze([
      "centerline drift and width rhythm",
      "waterfall gorge pool continuity",
      "recess and shelf shoreline grammar",
      "shoreline-integrated rock clusters",
      "protected bridge clearing",
      "spawn-to-bridge-to-workshop guidance",
    ]),
    renderModel: Object.freeze({
      riverSilhouette: "DRIFTED_CONTINUOUS_POLYGON",
      waterfallTransition: "GORGE_POOL_FUNNEL",
      shoreline: "VARIABLE_RECESS_SHELF_BANDS",
      terrainMasses: "SHORELINE_INTEGRATED_ROCK_CLUSTERS",
      collisionAuthority: "UNCHANGED_STREAM_CONTRACT",
    }),
    gameplayGeometryChanged: false,
  };

  scene.__terrainRiverFoundation = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getTerrainRiverFoundation = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.phase,
    implementationOwner: runtime.owner,
    referenceViewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    },
    riverCorridor: {
      left: geometry.corridor.left,
      top: geometry.corridor.top,
      width: geometry.corridor.width,
      height: geometry.corridor.height,
      sampleCount: geometry.edgeSamples.length,
      profilePointCount: geometry.profile.length,
    },
    crossingProtectionZone: { ...geometry.crossingProtectionZone },
    gorgeTransitionZone: { ...geometry.gorgeTransitionZone },
    pathAnchors: cloneAnchors(runtime.pathAnchors),
    visualTargets: [...runtime.visualTargets],
    renderModel: { ...runtime.renderModel },
    modules: [...runtime.modules],
    supersededBlockoutHidden: true,
    gameplayGeometryChanged: false,
  });
}

prototype.create = function createWithTerrainRiverFoundation() {
  originalCreate.call(this);
  installTerrainRiverFoundation(this);
};