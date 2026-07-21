import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BUILDERS_VALLEY_ASSETS,
  BUILDERS_VALLEY_ASSET_MANIFEST_VERSION,
} from "../src/sandbox/assets/BuildersValleyAssetManifest.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDirectory, "..");
const publicRoot = path.join(frontendRoot, "public");

function publicUrlToPath(url) {
  if (!url?.startsWith("/")) {
    throw new Error(`Asset URL must be public-root absolute: ${url}`);
  }
  return path.join(publicRoot, url.slice(1));
}

async function exists(filePath) {
  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

async function inspectAtlas(record) {
  const texturePath = publicUrlToPath(record.textureUrl);
  const dataPath = publicUrlToPath(record.dataUrl);
  const textureExists = await exists(texturePath);
  const dataExists = await exists(dataPath);
  let frameCount = 0;
  let jsonValid = false;

  if (dataExists) {
    try {
      const parsed = JSON.parse(await readFile(dataPath, "utf8"));
      frameCount = Array.isArray(parsed.frames)
        ? parsed.frames.length
        : Object.keys(parsed.frames ?? {}).length;
      jsonValid = frameCount > 0;
    } catch {
      jsonValid = false;
    }
  }

  return {
    textureExists,
    dataExists,
    metadataValid: jsonValid,
    frameCount,
  };
}

async function inspectSpriteSheet(record) {
  return {
    textureExists: await exists(publicUrlToPath(record.url)),
    dataExists: true,
    metadataValid:
      Number.isInteger(record.frameConfig?.frameWidth) &&
      Number.isInteger(record.frameConfig?.frameHeight) &&
      record.frameConfig.frameWidth > 0 &&
      record.frameConfig.frameHeight > 0,
    frameCount: null,
  };
}

async function inspectAsset(record) {
  const inspection = record.sourceType === "ATLAS"
    ? await inspectAtlas(record)
    : await inspectSpriteSheet(record);

  const delivered = inspection.textureExists && inspection.dataExists && inspection.metadataValid;
  const activationSafe = !record.enabled || delivered;

  return {
    id: record.id,
    family: record.family,
    enabled: record.enabled,
    required: record.required,
    sourceType: record.sourceType,
    delivered,
    activationSafe,
    ...inspection,
  };
}

const inspections = await Promise.all(BUILDERS_VALLEY_ASSETS.map(inspectAsset));
const unsafe = inspections.filter((entry) => !entry.activationSafe);
const enabled = inspections.filter((entry) => entry.enabled);
const delivered = inspections.filter((entry) => entry.delivered);

console.log(`Builders Valley asset manifest: ${BUILDERS_VALLEY_ASSET_MANIFEST_VERSION}`);
console.table(inspections.map((entry) => ({
  id: entry.id,
  family: entry.family,
  enabled: entry.enabled,
  delivered: entry.delivered,
  safe: entry.activationSafe,
  frames: entry.frameCount ?? "sheet",
})));
console.log(`Delivered: ${delivered.length}/${inspections.length}`);
console.log(`Enabled: ${enabled.length}/${inspections.length}`);

if (unsafe.length > 0) {
  console.error("Unsafe asset activation detected:");
  unsafe.forEach((entry) => console.error(`- ${entry.id}: enabled without a valid delivered source`));
  process.exitCode = 1;
} else {
  console.log("PASS: manifest activation is safe; unavailable assets remain on fallback.");
}
