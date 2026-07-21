import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../config/worldContract.js";
import { createRiverGeometry } from "./terrain/RiverGeometry.js";
import { createShorelines } from "./terrain/ShorelineGenerator.js";
import { createTerrainMasses } from "./terrain/TerrainMassGenerator.js";
import { createTerrainPaths } from "./terrain/TerrainPathGenerator.js";
import { createWaterRenderer } from "./terrain/WaterRenderer.js";
import { composeGorge } from "./terrain/GorgeComposer.js";
import { composeWorkshopTerrace } from "./terrain/WorkshopTerraceComposer.js";
import { composeBridgeApproach } from "./terrain/BridgeApproachComposer.js";
import { composeForestPocket } from "./terrain/ForestPocketComposer.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_001B_AUTHORED_COMPOSITION_V5";
const MODULES = Object.freeze([
  "RiverGeometry",
  "ShorelineGenerator",
  "TerrainMassGenerator",
  "TerrainPathGenerator",
  "WaterRenderer",
  "GorgeComposer",
  "WorkshopTerraceComposer",
  "BridgeApproachComposer",
  "ForestPocketComposer",
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

  const authoredZones = {
    gorge: composeGorge(scene, geometry),
    workshopTerrace: composeWorkshopTerrace(scene),
    bridgeApproach: composeBridgeApproach(scene),
    forestPocket: composeForestPocket(scene),
  };

  const runtime = {
    standard: STANDARD,
    status: "AUTHORED_ENVIRONMENT_COMPOSITION_STARTED",
    phase: "PES-001B_PHASE_2D",
    owner: "frontend/src/sandbox/scenes/BuildersValleyTerrainRiverPatch.js",
    geometry,
    water: createWaterRenderer(scene, geometry),
    shorelines: createShorelines(scene, geometry),
    terrainMasses: createTerrainMasses(scene, geometry),
    paths: paths.container,
    pathAnchors: paths.anchors,
    authoredZones,
    modules: MODULES,
    visualTargets: Object.freeze([
      "authored waterfall gorge",
      "workshop terrace integration",
      "protected bridge approach clearing",
      "left-side forest pocket rhythm",
      "centerline drift and width rhythm",
      "spawn-to-bridge-to-workshop guidance",
    ]),
    renderModel: Object.freeze({
      riverSilhouette: "DRIFTED_CONTINUOUS_POLYGON",
      waterfallTransition: "AUTHORED_GORGE_COMPOSITION",
      shoreline: "VARIABLE_RECESS_SHELF_BANDS",
      terrainMasses: "SHORELINE_INTEGRATED_ROCK_CLUSTERS",
      environmentComposition: "AUTHORED_ZONE_COMPOSERS",
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
    authoredZones: Object.keys(runtime.authoredZones),
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
