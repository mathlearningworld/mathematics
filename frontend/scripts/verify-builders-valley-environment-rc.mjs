import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDirectory, "..");
const mainPath = path.join(frontendRoot, "src", "main.js");
const scenesDirectory = path.join(frontendRoot, "src", "sandbox", "scenes");

const requiredOrderedImports = [
  "BuildersValleyTerrainRiverPatch.js",
  "BuildersValleyAssetPipelinePatch.js",
  "BuildersValleyGroundAssetPatch.js",
  "BuildersValleyWaterAssetPatch.js",
  "BuildersValleyCliffAssetPatch.js",
  "BuildersValleyRiverKitRuntimePatch.js",
  "BuildersValleyLayerCompositionRuntimePatch.js",
  "BuildersValleyForegroundCompositionRuntimePatch.js",
  "BuildersValleyTerrainDetailRuntimePatch.js",
  "BuildersValleyWorkshopDetailRuntimePatch.js",
  "BuildersValleyVegetationCompositionRuntimePatch.js",
  "BuildersValleyVegetationAssetPatch.js",
  "BuildersValleyLightingAtmosphereRuntimePatch.js",
  "BuildersValleyProductionDepthPassPatch.js",
  "BuildersValleyWaterEffectsAssetPatch.js",
  "BuildersValleyEnvironmentProductionPolishPatch.js",
  "BuildersValleyProductionEnvironmentConsolidationPatch.js",
  "BuildersValleySpawnSafetyPatch.js",
  "BuildersValleyEnvironmentReleaseCandidatePatch.js",
  "BuildersValleyAssetDebugPatch.js",
];

const forbiddenPatterns = [
  { pattern: ".quadraticBezierTo(", reason: "Phaser Graphics does not expose quadraticBezierTo" },
  { pattern: ".bezierCurveTo(", reason: "Phaser Graphics does not expose Canvas bezierCurveTo" },
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

if (!fs.existsSync(mainPath)) {
  fail(`missing entry point: ${mainPath}`);
  process.exit();
}

const mainSource = fs.readFileSync(mainPath, "utf8");
let previousIndex = -1;
for (const fileName of requiredOrderedImports) {
  const currentIndex = mainSource.indexOf(fileName);
  if (currentIndex < 0) {
    fail(`entry point does not import ${fileName}`);
    continue;
  }
  if (currentIndex <= previousIndex) {
    fail(`runtime import order is invalid at ${fileName}`);
  }
  previousIndex = currentIndex;
}

if (!process.exitCode) {
  pass("environment runtime patch chain is complete and ordered");
}

const patchFiles = fs.readdirSync(scenesDirectory)
  .filter((fileName) => fileName.startsWith("BuildersValley") && fileName.endsWith("Patch.js"));

for (const fileName of patchFiles) {
  const filePath = path.join(scenesDirectory, fileName);
  const source = fs.readFileSync(filePath, "utf8");
  for (const forbidden of forbiddenPatterns) {
    if (source.includes(forbidden.pattern)) {
      fail(`${fileName} uses forbidden API ${forbidden.pattern}: ${forbidden.reason}`);
    }
  }
}

if (!process.exitCode) {
  pass(`no unsupported Canvas-style Graphics APIs found across ${patchFiles.length} patches`);
}

const animatedRuntimeFiles = [
  "BuildersValleyProductionDepthPassPatch.js",
  "BuildersValleyWaterEffectsAssetPatch.js",
  "BuildersValleyLightingAtmosphereRuntimePatch.js",
];

for (const fileName of animatedRuntimeFiles) {
  const source = fs.readFileSync(path.join(scenesDirectory, fileName), "utf8");
  const hasUpdateListener = source.includes("events.on(\"update\"") || source.includes("events.on('update'");
  const hasShutdownCleanup = source.includes("events.once(\"shutdown\"") || source.includes("events.once('shutdown'");
  const removesUpdateListener = source.includes("events.off(\"update\"") || source.includes("events.off('update'");
  if (hasUpdateListener && (!hasShutdownCleanup || !removesUpdateListener)) {
    fail(`${fileName} registers an update listener without explicit shutdown cleanup`);
  }
}

if (!process.exitCode) {
  pass("animated environment runtimes declare shutdown cleanup");
}

const releaseCandidatePath = path.join(scenesDirectory, "BuildersValleyEnvironmentReleaseCandidatePatch.js");
const releaseCandidateSource = fs.readFileSync(releaseCandidatePath, "utf8");
for (const requiredToken of [
  "RELEASE_CANDIDATE_READY",
  "visualScope: \"FROZEN_PENDING_EXPLICIT_REOPEN\"",
  "gameplayGeometryChanged: false",
  "getEnvironmentReleaseCandidate",
]) {
  if (!releaseCandidateSource.includes(requiredToken)) {
    fail(`release candidate inspector is missing contract token: ${requiredToken}`);
  }
}

if (!process.exitCode) {
  pass("PES-006 release candidate inspector contract is present");
  console.log("Builders Valley Environment RC verification: PASS");
} else {
  console.error("Builders Valley Environment RC verification: FAILED");
}
