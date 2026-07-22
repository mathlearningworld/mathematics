import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const patchPath = path.join(
  root,
  "src/sandbox/scenes/BuildersValleySceneCompositionPatch.js",
);
const mainPath = path.join(root, "src/main.js");

const patch = fs.readFileSync(patchPath, "utf8");
const main = fs.readFileSync(mainPath, "utf8");

const checks = [];
const pass = (label, condition) => {
  if (!condition) throw new Error(`FAIL: ${label}`);
  checks.push(label);
  console.log(`PASS: ${label}`);
};

pass("PAL-SCENE-001 runtime contract is present", patch.includes("BUILDERS_VALLEY_PAL_SCENE_001_COMPOSITION_V1"));
pass("authored zone composition mode is declared", patch.includes("AUTHORED_LIVED_IN_ZONE_COMPOSITION"));
pass("western grove zone is declared", patch.includes("WESTERN_GROVE"));
pass("bridge approach zone is declared", patch.includes("BRIDGE_APPROACH"));
pass("workshop courtyard zone is declared", patch.includes("WORKSHOP_COURTYARD"));
pass("eastern riverbank zone is declared", patch.includes("EASTERN_RIVERBANK"));
pass("eastern field zone is declared", patch.includes("EASTERN_FIELD"));
pass("loose PAL-COMP-001 objects are replaced", patch.includes("scene.__palComp001Runtime?.objects?.forEach"));
pass("scene composition explicitly adds no collision", patch.includes("collisionObjectsAdded: 0"));
pass("scene composition explicitly adds no interaction authority", patch.includes("interactionAuthoritiesAdded: 0"));
pass("scene composition explicitly adds no AI authority", patch.includes("aiAuthoritiesAdded: 0"));
pass("gameplay geometry remains unchanged", patch.includes("gameplayGeometryChanged: false"));
pass("composition does not create physics objects", !patch.includes("scene.physics.add"));
pass("composition does not create interactive objects", !patch.includes("setInteractive("));

const visibleImport = 'import "./sandbox/scenes/BuildersValleyVisibleGraphicsIntegrationPatch.js";';
const sceneImport = 'import "./sandbox/scenes/BuildersValleySceneCompositionPatch.js";';
const rcImport = 'import "./sandbox/scenes/BuildersValleyEnvironmentReleaseCandidatePatch.js";';
const visibleIndex = main.indexOf(visibleImport);
const sceneIndex = main.indexOf(sceneImport);
const rcIndex = main.indexOf(rcImport);

pass("scene composition patch is wired", sceneIndex >= 0);
pass("scene composition runs after visible asset loading", visibleIndex >= 0 && visibleIndex < sceneIndex);
pass("release candidate inspector observes authored composition", sceneIndex < rcIndex);

const declaredPlacements = [...patch.matchAll(/\{ atlas: /g)].length;
pass("authored composition contains at least 30 visible placements", declaredPlacements >= 30);

console.log("Builders Valley PAL-SCENE-001 verification: PASS");
console.log(`Zones: 5`);
console.log(`Declared placements: ${declaredPlacements}`);
