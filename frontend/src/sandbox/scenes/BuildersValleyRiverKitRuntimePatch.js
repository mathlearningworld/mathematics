import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { BUILDERS_VALLEY_ASSETS } from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_002_RIVER_KIT_RUNTIME_V1";
const KIT_ID = "BV_ENVIRONMENT_KIT_RIVER_01";

const COMPONENTS = Object.freeze([
  {
    id: "water",
    label: "Water",
    assetId: "BV_WATER_RIVER_SHEET_01",
    foundationKey: "water",
  },
  {
    id: "cliff",
    label: "Cliff",
    assetId: "BV_CLIFF_ATLAS_01",
    foundationKey: "terrainMasses",
  },
  {
    id: "shoreline",
    label: "Shoreline",
    assetId: null,
    foundationKey: "shorelines",
  },
  {
    id: "rock",
    label: "Rock",
    assetId: "BV_CLIFF_ATLAS_01",
    foundationKey: "terrainMasses",
  },
  {
    id: "foam",
    label: "Foam",
    assetId: "BV_EFFECT_WATER_ATLAS_01",
    foundationKey: "water",
  },
  {
    id: "effect",
    label: "Water Effect",
    assetId: "BV_EFFECT_WATER_ATLAS_01",
    foundationKey: null,
  },
]);

function getAssetRecord(assetId) {
  return BUILDERS_VALLEY_ASSETS.find((record) => record.id === assetId) ?? null;
}

function inspectComponent(scene, foundation, definition) {
  const asset = definition.assetId ? getAssetRecord(definition.assetId) : null;
  const enabled = Boolean(asset?.enabled);
  const loaded = Boolean(definition.assetId && scene.textures.exists(definition.assetId));
  const failed = Boolean(
    definition.assetId
      && scene.__productionAssetPipeline?.loadFailures?.includes(definition.assetId),
  );
  const foundationAvailable = Boolean(
    definition.foundationKey && foundation?.[definition.foundationKey],
  );

  let status = "FALLBACK";
  if (failed) status = "LOAD_FAILED";
  else if (enabled && loaded) status = "ACTIVE";
  else if (foundationAvailable) status = "FOUNDATION";

  return Object.freeze({
    id: definition.id,
    label: definition.label,
    assetId: definition.assetId,
    status,
    enabled,
    loaded,
    foundationAvailable,
  });
}

function determineKitStatus(components) {
  if (components.some((component) => component.status === "LOAD_FAILED")) {
    return "LOAD_FAILED";
  }

  const activeCount = components.filter((component) => component.status === "ACTIVE").length;
  const readyCount = components.filter((component) =>
    component.status === "ACTIVE" || component.status === "FOUNDATION").length;

  if (activeCount === components.length) return "ACTIVE";
  if (activeCount > 0 || readyCount > 0) return "PARTIAL";
  return "FALLBACK";
}

function snapshotRuntime(runtime) {
  return {
    standard: runtime.standard,
    kitId: runtime.kitId,
    packageStatus: runtime.status,
    activeComponentCount: runtime.components.filter((item) => item.status === "ACTIVE").length,
    foundationComponentCount: runtime.components.filter((item) => item.status === "FOUNDATION").length,
    failedComponentCount: runtime.components.filter((item) => item.status === "LOAD_FAILED").length,
    componentCount: runtime.components.length,
    components: runtime.components.map((component) => ({ ...component })),
    activationPolicy: "COMPONENT_SAFE_INCREMENTAL_ACTIVATION",
    visualGeometryAuthority: "BuildersValleyTerrainRiverPatch",
    gameplayGeometryChanged: false,
  };
}

function installRiverKitRuntime(scene) {
  const foundation = scene.__terrainRiverFoundation ?? null;
  const components = COMPONENTS.map((definition) =>
    inspectComponent(scene, foundation, definition),
  );

  const runtime = {
    standard: STANDARD,
    kitId: KIT_ID,
    status: determineKitStatus(components),
    components,
    gameplayGeometryChanged: false,
  };

  scene.__riverKitRuntime = runtime;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getRiverKitRuntime = () => snapshotRuntime(runtime);
  window.__BUILDERS_VALLEY__.debugRiverKit = () => {
    const snapshot = snapshotRuntime(runtime);
    console.group(`Builders Valley River Kit — ${snapshot.packageStatus}`);
    console.table(snapshot.components.map((component) => ({
      component: component.label,
      status: component.status,
      assetId: component.assetId ?? "foundation-owned",
      enabled: component.enabled,
      loaded: component.loaded,
      foundation: component.foundationAvailable,
    })));
    console.log(snapshot);
    console.groupEnd();
    return snapshot;
  };
}

prototype.create = function createWithRiverKitRuntime() {
  originalCreate.call(this);
  installRiverKitRuntime(this);
};
