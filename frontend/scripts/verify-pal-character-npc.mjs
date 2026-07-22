import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAL_007A_CHARACTER_NPC_ATLASES,
  PAL_007A_CHARACTER_NPC_ASSETS,
  PAL_007A_CHARACTER_NPC_DELIVERY_STANDARD,
} from "../src/sandbox/assets/Pal007ThaiCharacterNpcDeliveryManifest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(
  PAL_007A_CHARACTER_NPC_DELIVERY_STANDARD ===
    "MATH_LEARNING_WORLD_PAL_007A_THAI_CHARACTER_NPC_VISUAL_FOUNDATION_V1",
  "unexpected PAL-007A standard",
);

const atlasIds = new Set();
for (const atlas of PAL_007A_CHARACTER_NPC_ATLASES) {
  assert(!atlasIds.has(atlas.id), `duplicate atlas id: ${atlas.id}`);
  atlasIds.add(atlas.id);
  assert(fs.existsSync(path.join(frontendRoot, "public", atlas.textureUrl.replace(/^\//, ""))), `${atlas.id}: texture missing`);
  assert(fs.existsSync(path.join(frontendRoot, "public", atlas.dataUrl.replace(/^\//, ""))), `${atlas.id}: atlas data missing`);
}

const assetIds = new Set();
const frameKeys = new Set();
for (const asset of PAL_007A_CHARACTER_NPC_ASSETS) {
  assert(!assetIds.has(asset.assetId), `duplicate asset id: ${asset.assetId}`);
  assetIds.add(asset.assetId);
  const frameKey = `${asset.atlasId}:${asset.frame}`;
  assert(!frameKeys.has(frameKey), `duplicate frame mapping: ${frameKey}`);
  frameKeys.add(frameKey);
  assert(atlasIds.has(asset.atlasId), `${asset.assetId}: unknown atlas ${asset.atlasId}`);
  assert(asset.deliveryStatus === "DELIVERED", `${asset.assetId}: not delivered`);
  assert(asset.activationStatus === "DISABLED", `${asset.assetId}: runtime activation must remain disabled`);
  assert(asset.collisionPolicy === "NONE", `${asset.assetId}: visual foundation must remain collision-free`);
  assert(asset.interactionPolicy === "VISUAL_ONLY", `${asset.assetId}: interaction authority must remain disabled`);
  assert(asset.aiPolicy === "DISABLED_UNTIL_NPC_RUNTIME_CONTRACT", `${asset.assetId}: AI must remain contract-gated`);
  assert(asset.dialoguePolicy === "DISABLED_UNTIL_DIALOGUE_CONTRACT", `${asset.assetId}: dialogue must remain contract-gated`);
  assert(asset.culturalReviewStatus === "FOUNDATION_APPROVED", `${asset.assetId}: cultural foundation review missing`);
}

console.log("PAL-007A Character & NPC Visual Foundation verification");
console.log(`Atlases: ${PAL_007A_CHARACTER_NPC_ATLASES.length}`);
console.log(`Delivered character visuals: ${PAL_007A_CHARACTER_NPC_ASSETS.length}`);
console.log(`Activated characters: ${PAL_007A_CHARACTER_NPC_ASSETS.filter((asset) => asset.activationStatus === "ENABLED").length}`);

if (failures.length) {
  console.error("PAL-007A verification: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS: PAL-007A character visuals are frame-complete, culturally scoped, collision-free, and safely gated from AI, dialogue, and gameplay runtime.");
}