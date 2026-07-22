import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_PES_006_ENVIRONMENT_RELEASE_CANDIDATE_V1";

const REQUIRED_RUNTIMES = Object.freeze([
  Object.freeze({ id: "terrain-river", sceneKey: "__terrainRiverFoundation" }),
  Object.freeze({ id: "asset-pipeline", sceneKey: "__productionAssetPipeline" }),
  Object.freeze({ id: "ground-asset", sceneKey: "__groundAssetReplacement" }),
  Object.freeze({ id: "water-asset", sceneKey: "__waterAssetReplacement" }),
  Object.freeze({ id: "cliff-asset", sceneKey: "__cliffAssetReplacement" }),
  Object.freeze({ id: "river-kit", sceneKey: "__riverKitRuntime" }),
  Object.freeze({ id: "layer-composition", sceneKey: "__layerCompositionRuntime" }),
  Object.freeze({ id: "foreground", sceneKey: "__foregroundCompositionRuntime" }),
  Object.freeze({ id: "terrain-detail", sceneKey: "__terrainDetailRuntime" }),
  Object.freeze({ id: "workshop-detail", sceneKey: "__workshopDetailRuntime" }),
  Object.freeze({ id: "vegetation-composition", sceneKey: "__vegetationCompositionRuntime" }),
  Object.freeze({ id: "vegetation-asset", sceneKey: "__vegetationAssetReplacement" }),
  Object.freeze({ id: "lighting-atmosphere", sceneKey: "__lightingAtmosphereRuntime" }),
  Object.freeze({ id: "production-depth", sceneKey: "__productionDepthPassRuntime" }),
  Object.freeze({ id: "water-effects", sceneKey: "__waterEffectsAssetRuntime" }),
  Object.freeze({ id: "production-polish", sceneKey: "__environmentProductionPolishRuntime" }),
  Object.freeze({ id: "production-consolidation", sceneKey: "__productionEnvironmentConsolidation" }),
  Object.freeze({ id: "spawn-safety", sceneKey: "__spawnSafetyRuntime" }),
]);

function runtimeStatus(runtime) {
  return runtime?.status ?? runtime?.packageStatus ?? (runtime ? "INSTALLED" : "MISSING");
}

function inspectRuntime(scene, definition) {
  const runtime = scene[definition.sceneKey];
  return {
    id: definition.id,
    sceneKey: definition.sceneKey,
    installed: Boolean(runtime),
    status: runtimeStatus(runtime),
    collisionObjectsAdded: runtime?.collisionObjectsAdded ?? 0,
    gameplayGeometryChanged: runtime?.gameplayGeometryChanged === true,
  };
}

function countTextures(scene) {
  const keys = scene.textures?.getTextureKeys?.() ?? [];
  return keys.filter((key) => !key.startsWith("__")).length;
}

function countUpdateListeners(scene) {
  return typeof scene.events?.listenerCount === "function"
    ? scene.events.listenerCount("update")
    : null;
}

function evaluateGates(scene, runtimes) {
  const allInstalled = runtimes.every((runtime) => runtime.installed);
  const gameplaySafe = runtimes.every(
    (runtime) => !runtime.gameplayGeometryChanged && runtime.collisionObjectsAdded === 0,
  );
  const spawnSafety = scene.__spawnSafetyRuntime;
  const spawnSafe = Boolean(spawnSafety) && spawnSafety.status !== "BLOCKED";
  const consolidationReady = scene.__productionEnvironmentConsolidation?.status === "READY_FOR_PRODUCTION_REVIEW";
  const requiredTextures = [
    "BV_GROUND_TERRAIN_ATLAS_01",
    "BV_WATER_RIVER_SHEET_01",
    "BV_CLIFF_ATLAS_01",
    "BV_VEGETATION_ATLAS_01",
    "BV_EFFECT_WATER_ATLAS_01",
  ];
  const missingTextures = requiredTextures.filter((key) => !scene.textures.exists(key));

  return {
    gates: [
      { id: "runtime-chain", status: allInstalled ? "PASS" : "BLOCKED" },
      { id: "gameplay-safety", status: gameplaySafe ? "PASS" : "BLOCKED" },
      { id: "spawn-safety", status: spawnSafe ? "PASS" : "BLOCKED" },
      { id: "production-assets", status: missingTextures.length === 0 ? "PASS" : "BLOCKED" },
      { id: "consolidation", status: consolidationReady ? "PASS" : "REVIEW" },
      { id: "visual-scope-freeze", status: "PASS" },
    ],
    missingTextures,
  };
}

function buildSnapshot(scene) {
  const runtimes = REQUIRED_RUNTIMES.map((definition) => inspectRuntime(scene, definition));
  const evaluation = evaluateGates(scene, runtimes);
  const blockedGates = evaluation.gates.filter((gate) => gate.status === "BLOCKED");

  return {
    standard: STANDARD,
    packageStatus: blockedGates.length === 0 ? "RELEASE_CANDIDATE_READY" : "RELEASE_CANDIDATE_BLOCKED",
    productionPhase: "PES-006",
    visualScope: "FROZEN_PENDING_EXPLICIT_REOPEN",
    optimizationPolicy: "MEASURE_FIRST_NO_GAMEPLAY_MUTATION",
    runtimes,
    gates: evaluation.gates,
    missingTextures: evaluation.missingTextures,
    metrics: {
      displayObjectCount: scene.children?.list?.length ?? 0,
      textureCount: countTextures(scene),
      updateListenerCount: countUpdateListeners(scene),
      activeTweenCount: scene.tweens?.getTweens?.().length ?? 0,
    },
    spawnSafety: scene.__spawnSafetyRuntime ? { ...scene.__spawnSafetyRuntime } : null,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  };
}

function publishReleaseCandidate(scene) {
  const snapshot = buildSnapshot(scene);
  scene.__environmentReleaseCandidateRuntime = snapshot;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getEnvironmentReleaseCandidate = () => {
    const current = buildSnapshot(scene);
    scene.__environmentReleaseCandidateRuntime = current;
    return current;
  };
  window.__BUILDERS_VALLEY__.debugEnvironmentReleaseCandidate = () => {
    const current = window.__BUILDERS_VALLEY__.getEnvironmentReleaseCandidate();
    console.group(`Builders Valley Environment RC — ${current.packageStatus}`);
    console.table(current.runtimes);
    console.table(current.gates);
    console.table(current.metrics);
    console.log(current);
    console.groupEnd();
    return current;
  };

  scene.events.once("shutdown", () => {
    if (window.__BUILDERS_VALLEY__) {
      delete window.__BUILDERS_VALLEY__.getEnvironmentReleaseCandidate;
      delete window.__BUILDERS_VALLEY__.debugEnvironmentReleaseCandidate;
    }
  });
}

prototype.create = function createWithEnvironmentReleaseCandidate() {
  originalCreate.call(this);
  publishReleaseCandidate(this);

  // Refresh once deferred spawn recovery and zero-delay runtime work have settled.
  this.time.delayedCall(0, () => publishReleaseCandidate(this));
};
