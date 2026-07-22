import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAL_002A_ATLASES,
  PAL_002A_DELIVERED_ASSETS,
  PAL_002A_DELIVERY_STANDARD,
} from "../src/sandbox/assets/Pal002ThaiBuildingsDeliveryManifest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(
  PAL_002A_DELIVERY_STANDARD ===
    "MATH_LEARNING_WORLD_PAL_002A_THAI_BUILDINGS_DECORATIVE_DELIVERY_V1",
  "unexpected PAL-002A delivery standard",
);

const atlasIds = new Set();
for (const atlas of PAL_002A_ATLASES) {
  assert(!atlasIds.has(atlas.id), `duplicate atlas id: ${atlas.id}`);
  atlasIds.add(atlas.id);
  assert(
    fs.existsSync(path.join(frontendRoot, "public", atlas.textureUrl.replace(/^\//, ""))),
    `${atlas.id}: texture missing`,
  );
  assert(
    fs.existsSync(path.join(frontendRoot, "public", atlas.dataUrl.replace(/^\//, ""))),
    `${atlas.id}: atlas data missing`,
  );
}

const assetIds = new Set();
const frames = new Set();
for (const record of PAL_002A_DELIVERED_ASSETS) {
  assert(!assetIds.has(record.assetId), `duplicate asset id: ${record.assetId}`);
  assetIds.add(record.assetId);
  assert(record.pack === "PAL-002_THAI_BUILDINGS", `${record.assetId}: wrong pack`);
  assert(atlasIds.has(record.atlasId), `${record.assetId}: unknown atlas ${record.atlasId}`);
  const frameKey = `${record.atlasId}:${record.frame}`;
  assert(!frames.has(frameKey), `duplicate frame mapping: ${frameKey}`);
  frames.add(frameKey);
  assert(record.deliveryStatus === "DELIVERED", `${record.assetId}: not delivered`);
  assert(record.activationStatus === "DISABLED", `${record.assetId}: runtime must remain disabled`);
  assert(record.collisionPolicy === "NONE", `${record.assetId}: decorative collision must be NONE`);
  assert(record.interactionPolicy === "DECORATIVE_ONLY", `${record.assetId}: interaction must remain decorative only`);
  assert(record.culturalReviewStatus === "FOUNDATION_APPROVED", `${record.assetId}: cultural foundation review missing`);
}

console.log("PAL-002A Thai Buildings verification");
console.log(`Atlases: ${PAL_002A_ATLASES.length}`);
console.log(`Delivered decorative buildings: ${PAL_002A_DELIVERED_ASSETS.length}`);
console.log("Activated decorative buildings: 0");

if (failures.length > 0) {
  console.error("PAL-002A verification: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS: PAL-002A Thai buildings are delivered, culturally scoped, collision-free, and safely disabled pending composition approval.");
}
