import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAL_003_TO_006_ATLASES,
  PAL_003_TO_006_DELIVERIES,
  PAL_003_TO_006_GRAPHICS_STANDARD,
  summarizePal003To006GraphicsDelivery,
} from "../src/sandbox/assets/Pal003To006GraphicsDeliveryManifest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(
  PAL_003_TO_006_GRAPHICS_STANDARD ===
    "MATH_LEARNING_WORLD_PAL_003_TO_006_GRAPHICS_DELIVERY_V1",
  "unexpected PAL graphics delivery standard",
);

const atlasIds = new Set();
const frameKeys = new Set();
for (const atlas of PAL_003_TO_006_ATLASES) {
  assert(!atlasIds.has(atlas.id), `duplicate atlas id: ${atlas.id}`);
  atlasIds.add(atlas.id);
  const texturePath = path.join(frontendRoot, "public", atlas.textureUrl.replace(/^\//, ""));
  const dataPath = path.join(frontendRoot, "public", atlas.dataUrl.replace(/^\//, ""));
  assert(fs.existsSync(texturePath), `${atlas.id}: texture missing`);
  assert(fs.existsSync(dataPath), `${atlas.id}: atlas data missing`);
  const atlasData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  for (const frame of atlas.frames) {
    const key = `${atlas.id}:${frame}`;
    assert(!frameKeys.has(key), `duplicate frame mapping: ${key}`);
    frameKeys.add(key);
    assert(Boolean(atlasData.frames?.[frame]), `${key}: frame missing from atlas JSON`);
  }
}

for (const delivery of PAL_003_TO_006_DELIVERIES) {
  assert(atlasIds.has(delivery.atlasId), `${delivery.assetId}: unknown atlas`);
  assert(delivery.deliveryStatus === "DELIVERED", `${delivery.assetId}: not delivered`);
  assert(delivery.activationStatus === "DISABLED", `${delivery.assetId}: runtime must remain disabled`);
  assert(delivery.collisionPolicy === "NONE", `${delivery.assetId}: decorative collision forbidden`);
  assert(delivery.interactionPolicy === "DECORATIVE_ONLY", `${delivery.assetId}: interaction authority forbidden`);
  assert(delivery.culturalReviewStatus === "FOUNDATION_APPROVED", `${delivery.assetId}: cultural foundation review missing`);
}

const summary = summarizePal003To006GraphicsDelivery();
console.log("PAL-003A through PAL-006A graphics verification");
console.log(`Atlases: ${summary.atlasCount}`);
console.log(`Delivered decorative assets: ${summary.deliveredAssetCount}`);
console.log(`Activated decorative assets: ${summary.enabledAssetCount}`);
console.log("Packs:", summary.packs.join(", "));

if (failures.length) {
  console.error("PAL graphics verification: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS: PAL-003A through PAL-006A graphics are delivered, frame-complete, collision-free, and safely disabled pending composition approval.");
}
