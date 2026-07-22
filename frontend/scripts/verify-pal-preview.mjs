import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAL_001A_ATLASES,
  PAL_001A_DELIVERIES,
} from "../src/sandbox/assets/Pal001ThaiNatureDeliveryManifest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(frontendRoot, relativePath), "utf8");
}

const sceneSource = read("src/sandbox/scenes/ProductionAssetPreviewScene.js");
const bootstrapSource = read("src/sandbox/createPalPreviewGame.js");
const mainSource = read("src/main.js");

assert(sceneSource.includes("PAL_001B_RUNTIME_PREVIEW_V1"), "preview scene standard missing");
assert(sceneSource.includes("window.__PAL_PREVIEW__"), "preview inspector missing");
assert(sceneSource.includes("toggleGrid"), "grid toggle missing");
assert(sceneSource.includes("toggleShadow"), "shadow toggle missing");
assert(bootstrapSource.includes("ProductionAssetPreviewScene"), "preview bootstrap scene wiring missing");
assert(mainSource.includes('params.get("palPreview") === "1"'), "PAL preview query route missing");
assert(mainSource.includes("createSandboxGame()"), "Builders Valley default boot missing");

const atlasKeys = new Set();
for (const atlas of PAL_001A_ATLASES) {
  assert(!atlasKeys.has(atlas.textureKey), `duplicate atlas texture key: ${atlas.textureKey}`);
  atlasKeys.add(atlas.textureKey);
  assert(fs.existsSync(path.join(frontendRoot, "public", atlas.textureUrl.replace(/^\//, ""))), `${atlas.textureKey}: texture missing`);
  assert(fs.existsSync(path.join(frontendRoot, "public", atlas.dataUrl.replace(/^\//, ""))), `${atlas.textureKey}: atlas data missing`);
}

const frameKeys = new Set();
for (const delivery of PAL_001A_DELIVERIES) {
  const key = `${delivery.textureKey}:${delivery.frame}`;
  assert(!frameKeys.has(key), `duplicate preview frame mapping: ${key}`);
  frameKeys.add(key);
  assert(atlasKeys.has(delivery.textureKey), `${delivery.deliveryId}: unknown texture key ${delivery.textureKey}`);
  assert(delivery.activationStatus === "DISABLED", `${delivery.deliveryId}: Builders Valley activation must remain disabled`);
  assert(delivery.collisionPolicy === "NONE", `${delivery.deliveryId}: preview asset must remain collision-free`);
}

console.log("PAL-001B Runtime Preview verification");
console.log(`Atlases: ${PAL_001A_ATLASES.length}`);
console.log(`Preview assets: ${PAL_001A_DELIVERIES.length}`);
console.log("Route: ?palPreview=1");

if (failures.length > 0) {
  console.error("PAL-001B preview verification: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS: PAL-001B preview is isolated, inspectable, collision-free, and leaves Builders Valley as the default runtime.");
}
