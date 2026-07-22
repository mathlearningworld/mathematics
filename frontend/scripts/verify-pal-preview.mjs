import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAL_001A_ATLASES,
  PAL_001A_DELIVERED_ASSETS,
} from "../src/sandbox/assets/Pal001ThaiNatureDeliveryManifest.js";
import { PRODUCTION_ASSET_LIBRARY } from "../src/sandbox/assets/ProductionAssetLibraryManifest.js";

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

const atlasIds = new Set();
for (const atlas of PAL_001A_ATLASES) {
  assert(!atlasIds.has(atlas.id), `duplicate atlas id: ${atlas.id}`);
  atlasIds.add(atlas.id);
  assert(fs.existsSync(path.join(frontendRoot, "public", atlas.textureUrl.replace(/^\//, ""))), `${atlas.id}: texture missing`);
  assert(fs.existsSync(path.join(frontendRoot, "public", atlas.dataUrl.replace(/^\//, ""))), `${atlas.id}: atlas data missing`);
}

const sourceById = new Map(PRODUCTION_ASSET_LIBRARY.map((record) => [record.id, record]));
const frameKeys = new Set();
for (const delivery of PAL_001A_DELIVERED_ASSETS) {
  const key = `${delivery.atlasId}:${delivery.frame}`;
  const source = sourceById.get(delivery.assetId);
  assert(!frameKeys.has(key), `duplicate preview frame mapping: ${key}`);
  frameKeys.add(key);
  assert(atlasIds.has(delivery.atlasId), `${delivery.assetId}: unknown atlas id ${delivery.atlasId}`);
  assert(delivery.deliveryStatus === "DELIVERED", `${delivery.assetId}: delivery status must be DELIVERED`);
  assert(delivery.activationStatus === "DISABLED", `${delivery.assetId}: Builders Valley activation must remain disabled`);
  assert(Boolean(source), `${delivery.assetId}: production asset library source missing`);
  assert(source?.collisionPolicy === "NONE", `${delivery.assetId}: preview asset must remain collision-free`);
  assert(source?.interactionPolicy === "DECORATIVE_ONLY", `${delivery.assetId}: preview asset must remain decorative-only`);
}

console.log("PAL-001B Runtime Preview verification");
console.log(`Atlases: ${PAL_001A_ATLASES.length}`);
console.log(`Preview assets: ${PAL_001A_DELIVERED_ASSETS.length}`);
console.log("Route: ?palPreview=1");

if (failures.length > 0) {
  console.error("PAL-001B preview verification: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS: PAL-001B preview is isolated, inspectable, collision-free, and leaves Builders Valley as the default runtime.");
}
