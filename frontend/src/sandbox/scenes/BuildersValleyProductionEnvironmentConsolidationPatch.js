import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_004_PRODUCTION_ENVIRONMENT_CONSOLIDATION_V1";

const SYSTEMS = Object.freeze([
  Object.freeze({ id: "terrain-river", sceneKey: "__terrainRiverFoundation", owner: "WORLD_GEOMETRY", required: true }),
  Object.freeze({ id: "asset-pipeline", sceneKey: "__productionAssetPipeline", owner: "ASSET_DELIVERY", required: true }),
  Object.freeze({ id: "ground-asset", sceneKey: "__groundAssetReplacement", owner: "GROUND_PRESENTATION", required: true }),
  Object.freeze({ id: "water-asset", sceneKey: "__waterAssetReplacement", owner: "WATER_PRESENTATION", required: true }),
  Object.freeze({ id: "cliff-asset", sceneKey: "__cliffAssetReplacement", owner: "CLIFF_PRESENTATION", required: true }),
  Object.freeze({ id: "river-kit", sceneKey: "__riverKitRuntime", owner: "RIVER_KIT", required: true }),
  Object.freeze({ id: "layer-composition", sceneKey: "__layerCompositionRuntime", owner: "WORLD_LAYER_AUTHORITY", required: true }),
  Object.freeze({ id: "foreground", sceneKey: "__foregroundCompositionRuntime", owner: "FOREGROUND_COMPOSITION", required: true }),
  Object.freeze({ id: "terrain-detail", sceneKey: "__terrainDetailRuntime", owner: "TERRAIN_MATERIAL", required: true }),
  Object.freeze({ id: "workshop-detail", sceneKey: "__workshopDetailRuntime", owner: "WORKSHOP_STORY", required: true }),
  Object.freeze({ id: "vegetation", sceneKey: "__vegetationCompositionRuntime", owner: "VEGETATION_COMPOSITION", required: true }),
  Object.freeze({ id: "lighting", sceneKey: "__lightingAtmosphereRuntime", owner: "LIGHTING_ATMOSPHERE", required: true }),
]);

const PRODUCTION_GATES = Object.freeze([
  Object.freeze({ id: "runtime-foundation", purpose: "all declared environment runtimes are installed" }),
  Object.freeze({ id: "gameplay-safety", purpose: "no environment runtime changes collision or gameplay geometry" }),
  Object.freeze({ id: "layer-ownership", purpose: "world composition systems have explicit ownership" }),
  Object.freeze({ id: "asset-fallback", purpose: "production asset activation remains independently reversible" }),
  Object.freeze({ id: "visual-consolidation", purpose: "foundation, details, vegetation and lighting read as one environment" }),
]);

function readRuntimeStatus(runtime) {
  if (!runtime) return "MISSING";
  return runtime.status ?? runtime.packageStatus ?? "INSTALLED";
}

function inspectSystem(scene, definition) {
  const runtime = scene[definition.sceneKey];
  return {
    id: definition.id,
    owner: definition.owner,
    required: definition.required,
    installed: Boolean(runtime),
    status: readRuntimeStatus(runtime),
    gameplayGeometryChanged: runtime?.gameplayGeometryChanged === true,
    collisionObjectsAdded: runtime?.collisionObjectsAdded ?? 0,
  };
}

function evaluateGates(systems) {
  const required = systems.filter((system) => system.required);
  const allInstalled = required.every((system) => system.installed);
  const gameplaySafe = systems.every(
    (system) => !system.gameplayGeometryChanged && system.collisionObjectsAdded === 0,
  );
  const ownershipComplete = systems.every((system) => Boolean(system.owner));

  return [
    { id: "runtime-foundation", status: allInstalled ? "PASS" : "BLOCKED" },
    { id: "gameplay-safety", status: gameplaySafe ? "PASS" : "BLOCKED" },
    { id: "layer-ownership", status: ownershipComplete ? "PASS" : "BLOCKED" },
    { id: "asset-fallback", status: sceneHasSafeAssetFallback(systems) ? "PASS" : "REVIEW" },
    { id: "visual-consolidation", status: allInstalled ? "READY_FOR_RUNTIME_REVIEW" : "BLOCKED" },
  ];
}

function sceneHasSafeAssetFallback(systems) {
  const assets = systems.filter((system) => system.id.endsWith("-asset") || system.id === "asset-pipeline");
  return assets.every((system) => system.installed && system.status !== "LOAD_FAILED");
}

function installProductionEnvironmentConsolidation(scene) {
  const systems = SYSTEMS.map((definition) => inspectSystem(scene, definition));
  const gates = evaluateGates(systems);
  const installedCount = systems.filter((system) => system.installed).length;
  const blockedGates = gates.filter((gate) => gate.status === "BLOCKED");

  const runtime = {
    standard: STANDARD,
    status: blockedGates.length === 0 ? "READY_FOR_PRODUCTION_REVIEW" : "CONSOLIDATION_BLOCKED",
    phase: "PES-004",
    policy: "CONSOLIDATE_THEN_REPLACE_INCREMENTALLY",
    systems,
    gates,
    installedCount,
    totalSystemCount: systems.length,
    nextReplacementOrder: Object.freeze([
      "VEGETATION_ATLAS",
      "WORKSHOP_ATLAS",
      "PROP_ATLAS",
      "WATER_EFFECT_ATLAS",
      "BRIDGE_ATLAS",
    ]),
    gameplayGeometryChanged: false,
  };

  scene.__productionEnvironmentConsolidation = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getProductionEnvironmentConsolidation = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    productionPhase: runtime.phase,
    consolidationPolicy: runtime.policy,
    installedCount: runtime.installedCount,
    totalSystemCount: runtime.totalSystemCount,
    systems: runtime.systems.map((system) => ({ ...system })),
    gates: runtime.gates.map((gate) => ({ ...gate })),
    nextReplacementOrder: [...runtime.nextReplacementOrder],
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugProductionEnvironment = () => {
    const snapshot = window.__BUILDERS_VALLEY__.getProductionEnvironmentConsolidation();
    console.group(`Builders Valley Production Environment — ${snapshot.packageStatus}`);
    console.table(snapshot.systems);
    console.table(snapshot.gates);
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithProductionEnvironmentConsolidation() {
  originalCreate.call(this);
  installProductionEnvironmentConsolidation(this);
};
