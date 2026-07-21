import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_003A_LAYER_COMPOSITION_RUNTIME_V1";
const WORLD_ID = "BV_WORLD_BUILDERS_VALLEY_01";

const LAYERS = Object.freeze([
  Object.freeze({
    id: "background",
    order: 1,
    label: "Background",
    depthBand: Object.freeze({ min: -40, max: -11 }),
    purpose: "waterfall, upper cliff, distant canopy and sky-driven atmosphere",
    expectedOwners: Object.freeze([
      "BuildersValleyTerrainRiverPatch",
      "BuildersValleyCliffAssetPatch",
      "BuildersValleyWaterAssetPatch",
    ]),
  }),
  Object.freeze({
    id: "midBack",
    order: 2,
    label: "Mid Back",
    depthBand: Object.freeze({ min: -10, max: 39 }),
    purpose: "trees, cliff shelves, workshop mass and secondary environmental structure",
    expectedOwners: Object.freeze([
      "BuildersValleyTerrainRiverPatch",
      "BuildersValleyCompositionPatch",
    ]),
  }),
  Object.freeze({
    id: "gameplay",
    order: 3,
    label: "Gameplay Mid",
    depthBand: Object.freeze({ min: 40, max: 199 }),
    purpose: "bridge, river corridor, playable ground, workshop yard and interaction-readable surfaces",
    expectedOwners: Object.freeze([
      "BuildersValleyGroundAssetPatch",
      "BuildersValleyWaterAssetPatch",
      "BuildersValleyRiverKitRuntimePatch",
      "BuildersValleyPlacementRuntimePatch",
    ]),
  }),
  Object.freeze({
    id: "foreground",
    order: 4,
    label: "Foreground",
    depthBand: Object.freeze({ min: 200, max: 299 }),
    purpose: "rocks, bushes, flowers, props and readable local framing",
    expectedOwners: Object.freeze([
      "BuildersValleyCliffAssetPatch",
      "BuildersValleyCompositionPatch",
      "BuildersValleyProductionVisualPatch",
    ]),
  }),
  Object.freeze({
    id: "frontForeground",
    order: 5,
    label: "Front Foreground",
    depthBand: Object.freeze({ min: 300, max: 399 }),
    purpose: "non-blocking edge framing, canopy silhouettes and cinematic depth",
    expectedOwners: Object.freeze([
      "BuildersValleyTerrainRiverPatch",
      "BuildersValleyCompositionPatch",
    ]),
  }),
]);

const KIT_BINDINGS = Object.freeze([
  Object.freeze({ kitId: "BV_ENVIRONMENT_KIT_RIVER_01", layers: Object.freeze(["background", "gameplay", "foreground"]) }),
  Object.freeze({ kitId: "BV_ENVIRONMENT_KIT_BRIDGE_01", layers: Object.freeze(["gameplay", "foreground"]) }),
  Object.freeze({ kitId: "BV_ENVIRONMENT_KIT_WORKSHOP_01", layers: Object.freeze(["midBack", "gameplay", "foreground"]) }),
  Object.freeze({ kitId: "BV_ENVIRONMENT_KIT_FOREST_01", layers: Object.freeze(["background", "midBack", "foreground", "frontForeground"]) }),
]);

function inspectRuntime(scene) {
  const riverKitAvailable = Boolean(scene.__riverKitRuntime);
  const terrainAvailable = Boolean(scene.__terrainRiverFoundation);
  const assetPipelineAvailable = Boolean(scene.__productionAssetPipeline);

  const layers = LAYERS.map((layer) => {
    const activeSignals = [];

    if (terrainAvailable && ["background", "midBack", "gameplay", "frontForeground"].includes(layer.id)) {
      activeSignals.push("terrain-foundation");
    }
    if (riverKitAvailable && ["background", "gameplay", "foreground"].includes(layer.id)) {
      activeSignals.push("river-kit");
    }
    if (assetPipelineAvailable && ["background", "gameplay", "foreground"].includes(layer.id)) {
      activeSignals.push("production-assets");
    }

    return Object.freeze({
      ...layer,
      status: activeSignals.length > 0 ? "ACTIVE" : "DECLARED",
      activeSignals: Object.freeze(activeSignals),
    });
  });

  return {
    standard: STANDARD,
    worldId: WORLD_ID,
    status: layers.every((layer) => layer.status === "ACTIVE") ? "ACTIVE" : "PARTIAL",
    sourceOfTruth: "PES-001A_PAINTED_TARGET_FRAME_HERO_FRAME",
    compositionModel: "FIVE_LAYER_HERO_FRAME_MODEL",
    layerCount: layers.length,
    layers,
    kitBindings: KIT_BINDINGS,
    renderOrderAuthority: "LAYER_DEPTH_BANDS_WITH_KIT_REGISTRATION",
    gameplayGeometryChanged: false,
  };
}

function snapshot(runtime) {
  return {
    standard: runtime.standard,
    worldId: runtime.worldId,
    packageStatus: runtime.status,
    sourceOfTruth: runtime.sourceOfTruth,
    compositionModel: runtime.compositionModel,
    layerCount: runtime.layerCount,
    layers: runtime.layers.map((layer) => ({
      id: layer.id,
      order: layer.order,
      label: layer.label,
      status: layer.status,
      depthBand: { ...layer.depthBand },
      purpose: layer.purpose,
      expectedOwners: [...layer.expectedOwners],
      activeSignals: [...layer.activeSignals],
    })),
    kitBindings: runtime.kitBindings.map((binding) => ({
      kitId: binding.kitId,
      layers: [...binding.layers],
    })),
    renderOrderAuthority: runtime.renderOrderAuthority,
    gameplayGeometryChanged: false,
  };
}

function installLayerCompositionRuntime(scene) {
  const runtime = inspectRuntime(scene);
  scene.__layerCompositionRuntime = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getLayerCompositionRuntime = () => snapshot(runtime);
  window.__BUILDERS_VALLEY__.debugCompositionLayers = () => {
    const state = snapshot(runtime);
    console.group(`Builders Valley Layers — ${state.packageStatus}`);
    console.table(state.layers.map((layer) => ({
      order: layer.order,
      layer: layer.label,
      status: layer.status,
      depth: `${layer.depthBand.min}..${layer.depthBand.max}`,
      signals: layer.activeSignals.join(", ") || "declared",
    })));
    console.log(state);
    console.groupEnd();
    return state;
  };
  window.__BUILDERS_VALLEY__.debugWorld = () => {
    const layerState = snapshot(runtime);
    const riverState = window.__BUILDERS_VALLEY__.getRiverKitRuntime?.() ?? null;
    const assetState = window.__BUILDERS_VALLEY__.getProductionAssetPipeline?.() ?? null;
    const worldState = {
      worldId: WORLD_ID,
      packageStatus: layerState.packageStatus,
      layers: layerState,
      kits: { river: riverState },
      assets: assetState,
      gameplayGeometryChanged: false,
    };
    console.group("Builders Valley World Runtime");
    console.log(worldState);
    console.groupEnd();
    return worldState;
  };
}

prototype.create = function createWithLayerCompositionRuntime() {
  originalCreate.call(this);
  installLayerCompositionRuntime(this);
};
