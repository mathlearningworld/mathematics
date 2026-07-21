import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  BUILDERS_VALLEY_ASSETS,
  BUILDERS_VALLEY_ASSET_FAMILIES,
  BUILDERS_VALLEY_LAYER_CONTRACT,
  summarizeBuildersValleyManifest,
} from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const DEBUG_STANDARD = "BUILDERS_VALLEY_ASSET_DEBUG_RUNTIME_V1";
const OVERLAY_DEPTH = 100000;
const OVERLAY_TOGGLE_KEY = "F8";

function getPipelineSnapshot() {
  return window.__BUILDERS_VALLEY__?.getProductionAssetPipeline?.() ?? null;
}

function getFamilyStatus(scene, family) {
  const records = BUILDERS_VALLEY_ASSETS.filter((record) => record.family === family);
  const enabled = records.filter((record) => record.enabled);
  const available = enabled.filter((record) => scene.textures.exists(record.id));
  const failed = enabled.filter((record) => !scene.textures.exists(record.id));

  let status = "FALLBACK";
  if (failed.length > 0) status = "LOAD_FAILED";
  else if (available.length === enabled.length && enabled.length > 0) status = "ACTIVE";
  else if (available.length > 0) status = "PARTIAL";

  return {
    family,
    status,
    declaredAssetIds: records.map((record) => record.id),
    enabledAssetIds: enabled.map((record) => record.id),
    availableAssetIds: available.map((record) => record.id),
    failedAssetIds: failed.map((record) => record.id),
  };
}

function getTextureKeys(scene) {
  const keys = scene.textures.getTextureKeys?.() ?? [];
  return keys.filter((key) => !["__DEFAULT", "__MISSING", "__WHITE"].includes(key));
}

function getPerformanceSnapshot(scene) {
  const renderer = scene.game.renderer;
  const frame = renderer?.pipelines?.current?.currentShader?.program ?? null;

  return {
    fps: Math.round(scene.game.loop.actualFps || 0),
    targetFps: scene.game.loop.targetFps ?? null,
    deltaMs: Number((scene.game.loop.delta || 0).toFixed(2)),
    displayObjects: scene.children?.length ?? 0,
    textureCount: getTextureKeys(scene).length,
    rendererType: renderer?.type ?? null,
    width: scene.scale?.width ?? null,
    height: scene.scale?.height ?? null,
    drawCalls: renderer?.drawCount ?? null,
    textureMemoryBytes: null,
    shaderProgramAvailable: Boolean(frame),
    note: "Texture memory is not exposed consistently by Phaser/WebGL and remains null by design.",
  };
}

function getLayerSnapshot(scene) {
  const observed = {};

  scene.children?.list?.forEach((child) => {
    const depth = child.depth ?? 0;
    const key = String(depth);
    observed[key] = (observed[key] ?? 0) + 1;
  });

  return {
    contract: { ...BUILDERS_VALLEY_LAYER_CONTRACT },
    observedDisplayObjectsByDepth: observed,
    gameplayGeometryChanged: false,
  };
}

function getAssetDebugSnapshot(scene) {
  const pipeline = getPipelineSnapshot();
  const families = Object.fromEntries(
    BUILDERS_VALLEY_ASSET_FAMILIES.map((family) => [family, getFamilyStatus(scene, family)]),
  );

  return {
    standard: DEBUG_STANDARD,
    ...summarizeBuildersValleyManifest(),
    pipelineStatus: pipeline?.packageStatus ?? "PIPELINE_STATE_UNAVAILABLE",
    families,
    performance: getPerformanceSnapshot(scene),
    overlayVisible: Boolean(scene.__assetDebugOverlay?.visible),
    toggleKey: OVERLAY_TOGGLE_KEY,
    gameplayGeometryChanged: false,
  };
}

function formatOverlay(scene) {
  const snapshot = getAssetDebugSnapshot(scene);
  const familyLines = BUILDERS_VALLEY_ASSET_FAMILIES.map((family) => {
    const state = snapshot.families[family];
    return `${family.padEnd(10)} ${state.status}`;
  });

  return [
    "BUILDERS VALLEY — ASSET DEBUG",
    `Manifest     ${snapshot.manifestVersion}`,
    `Pipeline     ${snapshot.pipelineStatus}`,
    `Loaded       ${snapshot.enabledAssetCount}/${snapshot.declaredAssetCount}`,
    ...familyLines,
    "",
    `FPS          ${snapshot.performance.fps}`,
    `Objects      ${snapshot.performance.displayObjects}`,
    `Textures     ${snapshot.performance.textureCount}`,
    `Draw calls   ${snapshot.performance.drawCalls ?? "n/a"}`,
    `Toggle       ${OVERLAY_TOGGLE_KEY}`,
  ].join("\n");
}

function createOverlay(scene) {
  const background = scene.add.rectangle(12, 12, 300, 330, 0x07131a, 0.9)
    .setOrigin(0, 0)
    .setScrollFactor(0)
    .setDepth(OVERLAY_DEPTH)
    .setVisible(false);

  const text = scene.add.text(24, 22, "", {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#d8f3e6",
    lineSpacing: 3,
  })
    .setScrollFactor(0)
    .setDepth(OVERLAY_DEPTH + 1)
    .setVisible(false);

  const overlay = {
    background,
    text,
    visible: false,
    setVisible(visible) {
      this.visible = Boolean(visible);
      background.setVisible(this.visible);
      text.setVisible(this.visible);
      if (this.visible) text.setText(formatOverlay(scene));
      return this.visible;
    },
    toggle() {
      return this.setVisible(!this.visible);
    },
    refresh() {
      if (this.visible) text.setText(formatOverlay(scene));
    },
  };

  scene.time.addEvent({
    delay: 500,
    loop: true,
    callback: () => overlay.refresh(),
  });

  scene.input.keyboard?.on(`keydown-${OVERLAY_TOGGLE_KEY}`, () => overlay.toggle());
  return overlay;
}

function installConsoleApi(scene) {
  window.__BUILDERS_VALLEY__ ??= {};

  window.__BUILDERS_VALLEY__.debugAssets = () => {
    const snapshot = getAssetDebugSnapshot(scene);
    console.table(
      Object.values(snapshot.families).map((family) => ({
        family: family.family,
        status: family.status,
        enabled: family.enabledAssetIds.length,
        available: family.availableAssetIds.length,
        failed: family.failedAssetIds.length,
      })),
    );
    return snapshot;
  };

  window.__BUILDERS_VALLEY__.debugPerformance = () => getPerformanceSnapshot(scene);
  window.__BUILDERS_VALLEY__.debugLayers = () => getLayerSnapshot(scene);
  window.__BUILDERS_VALLEY__.debugTextures = () => ({
    count: getTextureKeys(scene).length,
    keys: getTextureKeys(scene),
    productionAssets: BUILDERS_VALLEY_ASSETS.map((record) => ({
      id: record.id,
      family: record.family,
      enabled: record.enabled,
      available: scene.textures.exists(record.id),
    })),
  });
  window.__BUILDERS_VALLEY__.toggleAssetDebugOverlay = () => scene.__assetDebugOverlay.toggle();
  window.__BUILDERS_VALLEY__.getAssetDebugRuntime = () => getAssetDebugSnapshot(scene);
}

prototype.create = function createWithAssetDebugRuntime() {
  originalCreate.call(this);
  this.__assetDebugOverlay = createOverlay(this);
  installConsoleApi(this);
};
