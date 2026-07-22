import {
  PAL_COLLISION_POLICIES,
  PAL_LIFECYCLE_STATES,
  PAL_PACKS,
  PRODUCTION_ASSET_LIBRARY,
  PRODUCTION_ASSET_LIBRARY_STANDARD,
  PRODUCTION_ASSET_LIBRARY_VERSION,
  summarizeProductionAssetLibrary,
} from "../src/sandbox/assets/ProductionAssetLibraryManifest.js";

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(
  PRODUCTION_ASSET_LIBRARY_STANDARD === "MATH_LEARNING_WORLD_PRODUCTION_ASSET_LIBRARY_V1",
  "unexpected production asset library standard",
);
assert(PRODUCTION_ASSET_LIBRARY_VERSION === "PAL_MANIFEST_V1", "unexpected PAL manifest version");

const ids = new Set();
for (const record of PRODUCTION_ASSET_LIBRARY) {
  assert(typeof record.id === "string" && record.id.length > 0, "asset record missing id");
  assert(!ids.has(record.id), `duplicate asset id: ${record.id}`);
  ids.add(record.id);

  assert(PAL_PACKS.includes(record.pack), `${record.id}: unknown pack ${record.pack}`);
  assert(PAL_LIFECYCLE_STATES.includes(record.lifecycle), `${record.id}: invalid lifecycle ${record.lifecycle}`);
  assert(
    PAL_COLLISION_POLICIES.includes(record.collisionPolicy),
    `${record.id}: invalid collision policy ${record.collisionPolicy}`,
  );
  assert(typeof record.visualRole === "string" && record.visualRole.length > 0, `${record.id}: visual role required`);
  assert(Array.isArray(record.placementTags), `${record.id}: placementTags must be an array`);
  assert(record.culturalReviewStatus === "PENDING" || record.culturalReviewStatus === "APPROVED", `${record.id}: cultural review status invalid`);

  if (record.enabled) {
    assert(
      ["DECORATIVE_READY", "GAMEPLAY_READY"].includes(record.lifecycle),
      `${record.id}: enabled asset must be ready`,
    );
    assert(Boolean(record.textureUrl), `${record.id}: enabled asset missing textureUrl`);
    assert(Boolean(record.frame) || Boolean(record.dataUrl), `${record.id}: enabled asset missing frame or atlas data`);
  }

  if (record.lifecycle === "DECORATIVE_READY") {
    assert(record.collisionPolicy === "NONE", `${record.id}: decorative asset must not add collision`);
    assert(record.interactionPolicy === "DECORATIVE_ONLY", `${record.id}: decorative asset interaction must be decorative only`);
  }

  if (record.lifecycle === "GAMEPLAY_READY") {
    assert(Boolean(record.runtimeContract), `${record.id}: gameplay-ready asset missing runtime contract`);
    assert(record.collisionPolicy === "RUNTIME_AUTHORED", `${record.id}: gameplay-ready collision must be runtime authored`);
  }

  if (record.lifecycle === "GAMEPLAY_CONTRACT_REQUIRED") {
    assert(!record.enabled, `${record.id}: gameplay contract required asset must remain disabled`);
    assert(record.runtimeContract === null, `${record.id}: incomplete gameplay asset must not claim runtime contract`);
    assert(
      record.fallbackPolicy === "DISABLED_UNTIL_RUNTIME_READY",
      `${record.id}: incomplete gameplay asset fallback must remain disabled`,
    );
  }
}

const summary = summarizeProductionAssetLibrary();
console.log(`Production Asset Library: ${summary.manifestVersion}`);
console.table(
  PRODUCTION_ASSET_LIBRARY.map((record) => ({
    id: record.id,
    pack: record.pack,
    family: record.family,
    lifecycle: record.lifecycle,
    enabled: record.enabled,
    collision: record.collisionPolicy,
  })),
);
console.log(`Declared: ${summary.declaredAssetCount}`);
console.log(`Enabled: ${summary.enabledAssetCount}`);
console.log("Lifecycle:", summary.byLifecycle);

if (failures.length > 0) {
  console.error("Production Asset Library verification: FAIL");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("PASS: PAL-001 foundation is safe; planned assets remain disabled and gameplay candidates remain contract-gated.");
}
