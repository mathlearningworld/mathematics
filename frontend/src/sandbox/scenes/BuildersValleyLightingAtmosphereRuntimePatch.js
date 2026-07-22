import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  STREAM,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_003_LIGHTING_ATMOSPHERE_RUNTIME_V1";

const LIGHTING_ZONES = Object.freeze([
  Object.freeze({ id: "world-fill", treatment: "COOL_AMBIENT_FILL", gameplayPolicy: "READABILITY_PRESERVED" }),
  Object.freeze({ id: "upper-canopy", treatment: "SOFT_CANOPY_SHADOW", gameplayPolicy: "PATH_CLEAR" }),
  Object.freeze({ id: "waterfall", treatment: "COOL_MIST_AND_REFLECTION", gameplayPolicy: "NON_BLOCKING" }),
  Object.freeze({ id: "bridge", treatment: "CONTACT_SHADOW_AND_LAMP_GUIDANCE", gameplayPolicy: "CROSSING_CLEAR" }),
  Object.freeze({ id: "workshop", treatment: "WARM_OPERATIONAL_GLOW", gameplayPolicy: "ENTRANCE_CLEAR" }),
  Object.freeze({ id: "foreground", treatment: "SUBTLE_EDGE_FRAMING", gameplayPolicy: "HUD_AND_PLAYER_CLEAR" }),
]);

function createAmbientFill(scene) {
  const graphics = scene.add.graphics().setDepth(392);
  graphics.fillStyle(0x173344, 0.055);
  graphics.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  return graphics;
}

function createCanopyShadows(scene) {
  const graphics = scene.add.graphics().setDepth(34);
  const shadows = [
    [5.2 * TILE_SIZE, 4.8 * TILE_SIZE, 300, 116, -0.08],
    [13.8 * TILE_SIZE, 5.3 * TILE_SIZE, 235, 90, 0.1],
    [31.8 * TILE_SIZE, 4.2 * TILE_SIZE, 180, 72, -0.04],
  ];

  shadows.forEach(([x, y, width, height, rotation]) => {
    const shadow = scene.add
      .ellipse(x, y, width, height, 0x10271f, 0.1)
      .setRotation(rotation)
      .setDepth(34);
    graphics.add?.(shadow);
  });

  return shadows.length;
}

function createBridgeContactShadow(scene) {
  const x = STREAM.left + STREAM.width / 2;
  const y = 20.2 * TILE_SIZE;
  return scene.add
    .ellipse(x, y, STREAM.width + 122, 48, 0x101b1b, 0.25)
    .setDepth(44);
}

function createWarmGlow(scene, x, y, radius, alpha) {
  const glow = scene.add.circle(x, y, radius, 0xf6bd55, alpha).setDepth(238);
  glow.setBlendMode("ADD");
  return glow;
}

function createWarmGuidance(scene) {
  const bridgeY = 19.1 * TILE_SIZE;
  const workshopX = STREAM.left + STREAM.width + 174;
  const workshopY = 16.7 * TILE_SIZE;

  return [
    createWarmGlow(scene, STREAM.left - 18, bridgeY, 34, 0.1),
    createWarmGlow(scene, STREAM.left + STREAM.width + 18, bridgeY, 34, 0.1),
    createWarmGlow(scene, workshopX, workshopY, 58, 0.085),
  ];
}

function createWaterfallAtmosphere(scene) {
  const centerX = STREAM.left + STREAM.width / 2;
  const mist = [
    scene.add.ellipse(centerX - 18, 9.8 * TILE_SIZE, 92, 22, 0xd9f3ee, 0.12),
    scene.add.ellipse(centerX + 24, 10.25 * TILE_SIZE, 78, 18, 0xbfe8e5, 0.1),
    scene.add.ellipse(centerX, 10.65 * TILE_SIZE, 116, 16, 0xe4f7f2, 0.08),
  ];

  mist.forEach((item, index) => {
    item.setDepth(176).setBlendMode("ADD");
    item.setData("anchorX", item.x);
    item.setData("phase", index * 1.7);
  });

  const reflection = scene.add
    .ellipse(centerX, 11.4 * TILE_SIZE, 118, 16, 0x90dce5, 0.09)
    .setDepth(177)
    .setBlendMode("ADD");

  return { mist, reflection };
}

function createForegroundVignette(scene) {
  const graphics = scene.add.graphics().setDepth(391);
  graphics.fillStyle(0x0d1818, 0.08);
  graphics.fillRect(0, WORLD_HEIGHT - 88, WORLD_WIDTH, 88);
  graphics.fillStyle(0x0d1818, 0.045);
  graphics.fillRect(0, 0, 56, WORLD_HEIGHT);
  graphics.fillRect(WORLD_WIDTH - 56, 0, 56, WORLD_HEIGHT);
  return graphics;
}

function installLightingAtmosphereRuntime(scene) {
  const ambientFill = createAmbientFill(scene);
  const canopyShadowCount = createCanopyShadows(scene);
  const bridgeContactShadow = createBridgeContactShadow(scene);
  const warmGlows = createWarmGuidance(scene);
  const waterfall = createWaterfallAtmosphere(scene);
  const vignette = createForegroundVignette(scene);

  let elapsed = 0;
  const updateHandler = (_time, delta) => {
    elapsed += delta / 1000;
    waterfall.mist.forEach((item) => {
      const anchorX = item.getData("anchorX");
      const phase = item.getData("phase");
      item.x = anchorX + Math.sin(elapsed * 0.7 + phase) * 3;
      item.alpha = 0.085 + (Math.sin(elapsed * 0.85 + phase) + 1) * 0.018;
    });
    waterfall.reflection.alpha = 0.075 + (Math.sin(elapsed * 1.1) + 1) * 0.012;
  };
  scene.events.on("update", updateHandler);
  scene.events.once("shutdown", () => scene.events.off("update", updateHandler));

  const runtime = {
    standard: STANDARD,
    status: "ACTIVE",
    timeOfDay: "LATE_MORNING",
    keyLightDirection: "TOP_LEFT",
    ambientModel: "COOL_SKY_FILL_WITH_WARM_OPERATIONAL_ACCENTS",
    atmosphereModel: "BOUNDED_MIST_REFLECTION_AND_EDGE_FRAMING",
    zones: LIGHTING_ZONES,
    canopyShadowCount,
    warmGlowCount: warmGlows.length,
    mistElementCount: waterfall.mist.length,
    reflectionEnabled: true,
    foregroundVignetteEnabled: true,
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
    objects: { ambientFill, bridgeContactShadow, warmGlows, waterfall, vignette },
  };

  scene.__lightingAtmosphereRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getLightingAtmosphereRuntime = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    timeOfDay: runtime.timeOfDay,
    keyLightDirection: runtime.keyLightDirection,
    ambientModel: runtime.ambientModel,
    atmosphereModel: runtime.atmosphereModel,
    zones: runtime.zones.map((zone) => ({ ...zone })),
    canopyShadowCount: runtime.canopyShadowCount,
    warmGlowCount: runtime.warmGlowCount,
    mistElementCount: runtime.mistElementCount,
    reflectionEnabled: runtime.reflectionEnabled,
    foregroundVignetteEnabled: runtime.foregroundVignetteEnabled,
    collisionObjectsAdded: 0,
    referenceViewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugLightingAtmosphere = () => {
    const state = window.__BUILDERS_VALLEY__.getLightingAtmosphereRuntime();
    console.group(`Builders Valley Lighting & Atmosphere — ${state.packageStatus}`);
    console.table(state.zones);
    console.log(state);
    console.groupEnd();
    return state;
  };
}

prototype.create = function createWithLightingAtmosphereRuntime() {
  originalCreate.call(this);
  installLightingAtmosphereRuntime(this);
};
