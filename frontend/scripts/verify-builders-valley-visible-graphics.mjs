import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PAL_001A_ATLASES,
} from "../src/sandbox/assets/Pal001ThaiNatureDeliveryManifest.js";
import {
  PAL_003_TO_006_ATLASES,
} from "../src/sandbox/assets/Pal003To006GraphicsDeliveryManifest.js";
import {
  PAL_007A_CHARACTER_NPC_ATLASES,
} from "../src/sandbox/assets/Pal007ThaiCharacterNpcDeliveryManifest.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(dirname, "..");
const patchPath = path.join(frontendRoot, "src/sandbox/scenes/BuildersValleyVisibleGraphicsIntegrationPatch.js");
const mainPath = path.join(frontendRoot, "src/main.js");
const patch = fs.readFileSync(patchPath, "utf8");
const main = fs.readFileSync(mainPath, "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

const atlases = [
  ...PAL_001A_ATLASES,
  ...PAL_003_TO_006_ATLASES,
  ...PAL_007A_CHARACTER_NPC_ATLASES,
];

for (const atlas of atlases) {
  const texturePath = path.join(frontendRoot, "public", atlas.textureUrl.replace(/^\//, ""));
  const dataPath = path.join(frontendRoot, "public", atlas.dataUrl.replace(/^\//, ""));
  assert(fs.existsSync(texturePath), `${atlas.id} texture exists`);
  assert(fs.existsSync(dataPath), `${atlas.id} atlas data exists`);
}

assert(
  main.includes('import "./sandbox/scenes/BuildersValleyVisibleGraphicsIntegrationPatch.js";'),
  "visible graphics patch is wired into the default Builders Valley runtime",
);
assert(
  main.indexOf("BuildersValleySpawnSafetyPatch.js") <
    main.indexOf("BuildersValleyVisibleGraphicsIntegrationPatch.js"),
  "visible composition runs after spawn safety",
);
assert(
  main.indexOf("BuildersValleyVisibleGraphicsIntegrationPatch.js") <
    main.indexOf("BuildersValleyEnvironmentReleaseCandidatePatch.js"),
  "release candidate inspector observes the visible composition",
);
assert(patch.includes('productionPhase: "PAL-COMP-001"'), "PAL-COMP-001 runtime contract is present");
assert(patch.includes("buildersValleyVisualChanged: true"), "runtime explicitly declares visible change");
assert(patch.includes("collisionObjectsAdded: 0"), "composition adds no collision objects");
assert(patch.includes("interactionAuthoritiesAdded: 0"), "composition adds no interaction authority");
assert(patch.includes("aiAuthoritiesAdded: 0"), "static NPC visuals add no AI authority");
assert(patch.includes("gameplayGeometryChanged: false"), "gameplay geometry remains unchanged");
assert(!patch.includes("physics.add"), "composition does not create physics objects");
assert(!patch.includes("setInteractive("), "composition does not create interactive objects");

const placementMatches = patch.match(/zone: "[A-Z_]+"/g) ?? [];
assert(placementMatches.length >= 20, "at least 20 visible decorative placements are declared");

console.log("Builders Valley PAL-COMP-001 visible graphics verification: PASS");
console.log(`Atlases: ${atlases.length}`);
console.log(`Declared visible placements: ${placementMatches.length}`);
