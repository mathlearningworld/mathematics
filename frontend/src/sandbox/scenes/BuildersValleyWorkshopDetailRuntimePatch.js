import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_002E_WORKSHOP_DETAIL_RUNTIME_V1";
const KIT_ID = "BV_ENVIRONMENT_KIT_WORKSHOP_01";

const ZONES = Object.freeze([
  Object.freeze({ id: "workbench-core", density: "DENSE", purpose: "primary making surface and tool story" }),
  Object.freeze({ id: "material-storage", density: "MEDIUM", purpose: "wood, crate and barrel storage" }),
  Object.freeze({ id: "bridge-supply", density: "CONTROLLED", purpose: "bridge repair materials without blocking crossing" }),
  Object.freeze({ id: "workshop-entrance", density: "CLEAR", purpose: "preserve readable access into the workshop" }),
  Object.freeze({ id: "outer-yard", density: "SPARSE", purpose: "light operational clutter and contact shadows" }),
]);

function addShadow(scene, container, x, y, width, height, alpha = 0.24) {
  const shadow = scene.add.ellipse(x, y, width, height, 0x1b2522, alpha);
  container.add(shadow);
  return shadow;
}

function addCrate(scene, container, x, y, scale = 1) {
  addShadow(scene, container, x + 2, y + 12 * scale, 34 * scale, 12 * scale, 0.25);
  const crate = scene.add.rectangle(x, y, 28 * scale, 25 * scale, 0x765031, 1).setStrokeStyle(3, 0x3e2a1e, 1);
  const slatA = scene.add.rectangle(x, y - 5 * scale, 22 * scale, 3 * scale, 0xb27a43, 0.9);
  const slatB = scene.add.rectangle(x, y + 5 * scale, 22 * scale, 3 * scale, 0x5b3a25, 0.9);
  const braceA = scene.add.line(0, 0, x - 10 * scale, y - 9 * scale, x + 10 * scale, y + 9 * scale, 0xd09755, 0.72).setLineWidth(2 * scale);
  const braceB = scene.add.line(0, 0, x + 10 * scale, y - 9 * scale, x - 10 * scale, y + 9 * scale, 0x4a2f20, 0.68).setLineWidth(2 * scale);
  container.add([crate, slatA, slatB, braceA, braceB]);
}

function addBarrel(scene, container, x, y, scale = 1) {
  addShadow(scene, container, x + 2, y + 14 * scale, 30 * scale, 10 * scale, 0.24);
  const body = scene.add.ellipse(x, y, 24 * scale, 32 * scale, 0x815833, 1).setStrokeStyle(3, 0x38291f, 1);
  const top = scene.add.ellipse(x, y - 12 * scale, 21 * scale, 8 * scale, 0xb27b46, 1);
  const bandA = scene.add.rectangle(x, y - 5 * scale, 25 * scale, 3 * scale, 0x596066, 0.9);
  const bandB = scene.add.rectangle(x, y + 7 * scale, 25 * scale, 3 * scale, 0x596066, 0.9);
  container.add([body, top, bandA, bandB]);
}

function addTimberStack(scene, container, x, y) {
  addShadow(scene, container, x + 8, y + 13, 70, 15, 0.22);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const timber = scene.add.rectangle(x + column * 19 + row * 4, y + row * 7, 28, 8, row % 2 ? 0x8e6035 : 0xa9723c, 1)
        .setStrokeStyle(2, 0x49301f, 0.9);
      container.add(timber);
    }
  }
}

function addToolRack(scene, container, x, y) {
  const postA = scene.add.rectangle(x - 23, y + 7, 5, 42, 0x4a3020, 1);
  const postB = scene.add.rectangle(x + 23, y + 7, 5, 42, 0x4a3020, 1);
  const beam = scene.add.rectangle(x, y - 12, 54, 6, 0x765034, 1);
  const hammer = scene.add.rectangle(x - 12, y + 2, 4, 27, 0x82898c, 1);
  const hammerHead = scene.add.rectangle(x - 12, y - 5, 15, 6, 0xa8adae, 1);
  const saw = scene.add.triangle(x + 10, y + 4, 0, 0, 22, 5, 2, 10, 0xaab0af, 1);
  const sawHandle = scene.add.rectangle(x + 18, y + 1, 8, 10, 0x9a6035, 1);
  container.add([postA, postB, beam, hammer, hammerHead, saw, sawHandle]);
}

function addFence(scene, container, x, y, width) {
  const railA = scene.add.rectangle(x, y, width, 5, 0x765035, 1);
  const railB = scene.add.rectangle(x, y + 16, width, 5, 0x5e3c28, 1);
  container.add([railA, railB]);
  const count = Math.max(2, Math.floor(width / 34));
  for (let index = 0; index <= count; index += 1) {
    const post = scene.add.rectangle(x - width / 2 + index * (width / count), y + 8, 7, 32, 0x493021, 1);
    container.add(post);
  }
}

function addWear(scene, container, x, y, width, height, rotation = 0) {
  const wear = scene.add.ellipse(x, y, width, height, 0xc5a66d, 0.18).setRotation(rotation);
  container.add(wear);
}

function createWorkshopDetails(scene) {
  const container = scene.add.container(0, 0).setDepth(72);
  const x = STREAM.left + STREAM.width + 42;
  const y = 8.5 * TILE_SIZE;

  // Ground-use story: worn work triangle, material drag line and compact contact stains.
  addWear(scene, container, x + 123, y + 72, 150, 52, -0.08);
  addWear(scene, container, x + 70, y + 121, 98, 24, -0.22);
  addWear(scene, container, x + 182, y + 118, 74, 28, 0.12);

  // Workbench core remains readable while nearby details make the area feel operated.
  addToolRack(scene, container, x + 144, y + 38);
  addCrate(scene, container, x + 191, y + 74, 0.92);
  addBarrel(scene, container, x + 211, y + 116, 0.92);

  // Material storage anchors the rear-right yard without closing the entrance.
  addTimberStack(scene, container, x + 34, y + 112);
  addCrate(scene, container, x + 55, y + 66, 0.82);
  addBarrel(scene, container, x + 90, y + 48, 0.78);

  // Bridge supply is controlled and remains outside the protected crossing corridor.
  addTimberStack(scene, container, x - 9, y + 151);
  addCrate(scene, container, x + 25, y + 151, 0.68);

  // Sparse boundary cues define the yard without forming a gameplay barrier.
  addFence(scene, container, x + 143, y + 146, 112);

  return {
    container,
    zones: ZONES,
    propCount: 9,
    preservedClearances: Object.freeze(["workshop-entrance", "player-interaction", "bridge-crossing"]),
  };
}

function snapshot(runtime) {
  return {
    standard: runtime.standard,
    kitId: runtime.kitId,
    packageStatus: runtime.status,
    compositionModel: runtime.compositionModel,
    propCount: runtime.propCount,
    zones: runtime.zones.map((zone) => ({ ...zone })),
    preservedClearances: [...runtime.preservedClearances],
    collisionObjectsAdded: 0,
    gameplayGeometryChanged: false,
  };
}

function installWorkshopDetailRuntime(scene) {
  const details = createWorkshopDetails(scene);
  const runtime = {
    standard: STANDARD,
    kitId: KIT_ID,
    status: "ACTIVE",
    compositionModel: "ZONE_WEIGHTED_OPERATIONAL_WORKSHOP_STORY",
    propCount: details.propCount,
    zones: details.zones,
    preservedClearances: details.preservedClearances,
    container: details.container,
    gameplayGeometryChanged: false,
  };

  scene.__workshopDetailRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getWorkshopDetailRuntime = () => snapshot(runtime);
  window.__BUILDERS_VALLEY__.debugWorkshopDetail = () => {
    const state = snapshot(runtime);
    console.group(`Builders Valley Workshop Detail — ${state.packageStatus}`);
    console.table(state.zones.map((zone) => ({ zone: zone.id, density: zone.density, purpose: zone.purpose })));
    console.log(state);
    console.groupEnd();
    return state;
  };
}

prototype.create = function createWithWorkshopDetailRuntime() {
  originalCreate.call(this);
  installWorkshopDetailRuntime(this);
};
