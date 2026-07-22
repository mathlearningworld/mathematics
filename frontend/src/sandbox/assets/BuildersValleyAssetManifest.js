export const BUILDERS_VALLEY_ASSET_PIPELINE_STANDARD =
  "BUILDERS_VALLEY_PRODUCTION_ASSET_PIPELINE_V1";

export const BUILDERS_VALLEY_ASSET_MANIFEST_VERSION = "PES-001C_MANIFEST_V6";

export const BUILDERS_VALLEY_ASSET_FAMILIES = Object.freeze([
  "GROUND",
  "WATER",
  "CLIFF",
  "BRIDGE",
  "WORKSHOP",
  "VEGETATION",
  "PROP",
  "EFFECT",
]);

export const BUILDERS_VALLEY_LAYER_CONTRACT = Object.freeze({
  ground: -30,
  water: -20,
  cliff: -10,
  architecture: 40,
  environment: 50,
  gameplayMinimum: 100,
  playerProjectionMinimum: 200,
});

function asset(definition) {
  return Object.freeze({
    required: false,
    enabled: false,
    version: "1.0.0",
    fallbackOwner: "BuildersValleyTerrainRiverPatch",
    ...definition,
  });
}

export const BUILDERS_VALLEY_ASSETS = Object.freeze([
  asset({
    id: "BV_GROUND_TERRAIN_ATLAS_01",
    family: "GROUND",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/ground/terrain-atlas.svg",
    dataUrl: "/assets/builders-valley/ground/terrain-atlas.json",
    layer: "ground",
    enabled: true,
    required: true,
    replacementTarget: "terrain material and path surfaces",
  }),
  asset({
    id: "BV_WATER_RIVER_SHEET_01",
    family: "WATER",
    sourceType: "SPRITESHEET",
    url: "/assets/builders-valley/water/river-sheet.svg",
    frameConfig: Object.freeze({ frameWidth: 32, frameHeight: 32 }),
    layer: "water",
    enabled: true,
    required: true,
    replacementTarget: "river detail, foam and ripple rendering",
  }),
  asset({
    id: "BV_CLIFF_ATLAS_01",
    family: "CLIFF",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/cliff/cliff-atlas.svg",
    dataUrl: "/assets/builders-valley/cliff/cliff-atlas.json",
    layer: "cliff",
    enabled: true,
    required: true,
    replacementTarget: "shoreline faces, shelves, caps and gorge rocks",
  }),
  asset({
    id: "BV_BRIDGE_ATLAS_01",
    family: "BRIDGE",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/bridge/bridge-atlas.png",
    dataUrl: "/assets/builders-valley/bridge/bridge-atlas.json",
    layer: "architecture",
    replacementTarget: "hero bridge modular kit",
  }),
  asset({
    id: "BV_WORKSHOP_ATLAS_01",
    family: "WORKSHOP",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/workshop/workshop-atlas.png",
    dataUrl: "/assets/builders-valley/workshop/workshop-atlas.json",
    layer: "architecture",
    replacementTarget: "workshop building, yard and retaining terrace",
  }),
  asset({
    id: "BV_VEGETATION_ATLAS_01",
    family: "VEGETATION",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/vegetation/vegetation-atlas.svg",
    dataUrl: "/assets/builders-valley/vegetation/vegetation-atlas.json",
    layer: "environment",
    enabled: true,
    required: true,
    fallbackOwner: "BuildersValleyVegetationCompositionRuntimePatch",
    replacementTarget: "forest pockets, river-bank growth and foreground framing",
  }),
  asset({
    id: "BV_PROP_ATLAS_01",
    family: "PROP",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/props/prop-atlas.png",
    dataUrl: "/assets/builders-valley/props/prop-atlas.json",
    layer: "environment",
    replacementTarget: "work-yard and path-support props",
  }),
  asset({
    id: "BV_EFFECT_WATER_ATLAS_01",
    family: "EFFECT",
    sourceType: "ATLAS",
    textureUrl: "/assets/builders-valley/effects/water-effects-atlas.svg",
    dataUrl: "/assets/builders-valley/effects/water-effects-atlas.json",
    layer: "environment",
    enabled: true,
    required: true,
    fallbackOwner: "BuildersValleyProductionDepthPassPatch",
    replacementTarget: "waterfall spray, foam and environmental effects",
  }),
]);

export function getEnabledBuildersValleyAssets() {
  return BUILDERS_VALLEY_ASSETS.filter((record) => record.enabled);
}

export function summarizeBuildersValleyManifest() {
  const byFamily = Object.fromEntries(
    BUILDERS_VALLEY_ASSET_FAMILIES.map((family) => [
      family,
      BUILDERS_VALLEY_ASSETS.filter((record) => record.family === family).length,
    ]),
  );

  const bySourceType = BUILDERS_VALLEY_ASSETS.reduce((summary, record) => {
    summary[record.sourceType] = (summary[record.sourceType] ?? 0) + 1;
    return summary;
  }, {});

  return {
    standard: BUILDERS_VALLEY_ASSET_PIPELINE_STANDARD,
    manifestVersion: BUILDERS_VALLEY_ASSET_MANIFEST_VERSION,
    declaredAssetCount: BUILDERS_VALLEY_ASSETS.length,
    enabledAssetCount: getEnabledBuildersValleyAssets().length,
    byFamily,
    bySourceType,
  };
}
