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
import { composeForegroundFraming } from "./terrain/ForegroundFramingComposer.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_002B_ORGANIC_RIVER_GEOMETRY_V1";
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
  "ForegroundFramingComposer",
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
    foregroundFraming: composeForegroundFraming(scene),
  };

  const runtime = {
    standard: STANDARD,
    status: "ORGANIC_RIVER_GEOMETRY_ACTIVE",
    phase: "PES-002B",
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
      "narrow waterfall throat",
      "wide upper gorge pool",
      "compressed mid-channel neck",
      "protected wide bridge reach",
      "rhythmic lower river pool and exit",
      "organic forest ground patches",
      "rock-shelf gorge mouth",
      "workshop yard and retaining terrace",
      "restrained foreground depth framing",
      "spawn-to-bridge-to-workshop guidance",
    ]),
    renderModel: Object.freeze({
      riverSilhouette: "ORGANIC_WIDTH_RHYTHM_CONTINUOUS_POLYGON",
      waterfallTransition: "NARROW_THROAT_TO_WIDE_AUTHORED_GORGE_POOL",
      bridgeReach: "PROTECTED_WIDE_CROSSING_BAND",
      lowerRiver: "NECK_POOL_BEND_TAPER_SEQUENCE",
      shoreline: "VARIABLE_RECESS_SHELF_BANDS",
      terrainMasses: "SHORELINE_INTEGRATED_ROCK_CLUSTERS",
      environmentComposition: "FIVE_LAYER_HERO_FRAME_ALIGNED",
      materialPass: "GROUND_ROCK_WOOD_DEPTH_VARIATION",
      foregroundDepth: "CONTROLLED_NON_BLOCKING_FRAMING",
      collisionAuthority: geometry.collisionAuthority,
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
      widthRange: { ...geometry.widthRange },
      visualGeometryPolicy: geometry.visualGeometryPolicy,
    },
    shapeZones: geometry.shapeZones.map((zone) => ({ ...zone })),
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
  window.__BUILDERS_VALLEY__.debugRiverGeometry = () => {
    const state = window.__BUILDERS_VALLEY__.getTerrainRiverFoundation();
    console.group(`Builders Valley River Geometry — ${state.packageStatus}`);
    console.table(state.shapeZones.map((zone) => ({
      zone: zone.id,
      startY: zone.startY,
      endY: zone.endY,
      widthIntent: zone.widthIntent,
      purpose: zone.purpose,
    })));
    console.log(state);
    console.groupEnd();
    return state;
  };
}

prototype.create = function createWithTerrainRiverFoundation() {
  originalCreate.call(this);
  installTerrainRiverFoundation(this);
};
