import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  BUILDERS_VALLEY_ASSETS,
  BUILDERS_VALLEY_ASSET_MANIFEST_VERSION,
  BUILDERS_VALLEY_ASSET_PIPELINE_STANDARD,
  BUILDERS_VALLEY_LAYER_CONTRACT,
  getEnabledBuildersValleyAssets,
  summarizeBuildersValleyManifest,
} from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalPreload = prototype.preload;
const originalCreate = prototype.create;

function registerAsset(scene, record) {
  switch (record.sourceType) {
    case "IMAGE":
      scene.load.image(record.id, record.url);
      break;
    case "SPRITESHEET":
      scene.load.spritesheet(record.id, record.url, record.frameConfig);
      break;
    case "ATLAS":
      scene.load.atlas(record.id, record.textureUrl, record.dataUrl);
      break;
    case "TILEMAP":
      scene.load.tilemapTiledJSON(record.id, record.url);
      break;
    case "TILESET":
      scene.load.image(record.id, record.url);
      break;
    default:
      throw new Error(`Unsupported Builders Valley asset source type: ${record.sourceType}`);
  }
}

function createPipelineState() {
  return {
    standard: BUILDERS_VALLEY_ASSET_PIPELINE_STANDARD,
    manifestVersion: BUILDERS_VALLEY_ASSET_MANIFEST_VERSION,
    packageStatus: "PIPELINE_IMPLEMENTATION_STARTED",
    fallbackOwner: "BuildersValleyTerrainRiverPatch",
    enabledAssetIds: getEnabledBuildersValleyAssets().map((record) => record.id),
    loadFailures: [],
    gameplayGeometryChanged: false,
  };
}

prototype.preload = function preloadWithProductionAssetPipeline() {
  originalPreload?.call(this);

  const state = createPipelineState();
  this.__productionAssetPipeline = state;

  this.load.on("loaderror", (file) => {
    if (!state.enabledAssetIds.includes(file.key)) return;
    if (!state.loadFailures.includes(file.key)) state.loadFailures.push(file.key);
  });

  getEnabledBuildersValleyAssets().forEach((record) => registerAsset(this, record));
};

prototype.create = function createWithProductionAssetPipeline() {
  originalCreate.call(this);

  const state = this.__productionAssetPipeline ?? createPipelineState();
  const available = BUILDERS_VALLEY_ASSETS
    .filter((record) => this.textures.exists(record.id))
    .map((record) => record.id);
  const failed = [...state.loadFailures];
  const fallback = BUILDERS_VALLEY_ASSETS
    .filter((record) => !available.includes(record.id))
    .map((record) => record.id);

  state.packageStatus = available.length > 0
    ? "PIPELINE_ACTIVE_WITH_PRODUCTION_ASSETS"
    : "PIPELINE_ACTIVE_FALLBACK_ONLY";
  state.availableAssetIds = available;
  state.fallbackAssetIds = fallback;

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getProductionAssetPipeline = () => ({
    ...summarizeBuildersValleyManifest(),
    packageStatus: state.packageStatus,
    enabledAssetIds: [...state.enabledAssetIds],
    availableAssetIds: [...state.availableAssetIds],
    failedAssetIds: [...failed],
    fallbackAssetIds: [...state.fallbackAssetIds],
    layerContract: { ...BUILDERS_VALLEY_LAYER_CONTRACT },
    fallbackOwner: state.fallbackOwner,
    replacementPolicy: "EXPLICIT_COMPOSER_ACTIVATION_REQUIRED",
    gameplayGeometryChanged: false,
  });
};
