import { BuildersValleyScene } from "./BuildersValleyScene.js";
import {
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";
import { BUILDERS_VALLEY_LAYER_CONTRACT } from "../assets/BuildersValleyAssetManifest.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;

const STANDARD = "BUILDERS_VALLEY_PES_002D_TERRAIN_DETAIL_RUNTIME_V1";

const ZONES = Object.freeze([
  Object.freeze({
    id: "upper-left-meadow",
    density: "MEDIUM",
    purpose: "break the large grass field into soft meadow masses without closing the spawn route",
  }),
  Object.freeze({
    id: "main-path-wear",
    density: "CONTROLLED",
    purpose: "show repeated travel from spawn toward the bridge while preserving path readability",
  }),
  Object.freeze({
    id: "river-bank-soil",
    density: "MEDIUM",
    purpose: "blend grass into shoreline and cliff foundation with damp soil, moss and pebbles",
  }),
  Object.freeze({
    id: "bridge-approach-wear",
    density: "CONTROLLED",
    purpose: "support the crossing focal point without competing with lamps, player or bridge silhouette",
  }),
  Object.freeze({
    id: "workshop-yard-wear",
    density: "MEDIUM",
    purpose: "suggest repeated work traffic and material handling around the workshop terrace",
  }),
  Object.freeze({
    id: "lower-foreground-grounding",
    density: "SPARSE",
    purpose: "ground foreground framing with restrained soil, stone and weed accents",
  }),
]);

function addPatch(scene, container, x, y, width, height, color, alpha, rotation = 0) {
  const patch = scene.add
    .ellipse(Math.round(x), Math.round(y), Math.round(width), Math.round(height), color, alpha)
    .setRotation(rotation);
  container.add(patch);
  return patch;
}

function addPebble(scene, container, x, y, scale = 1, tone = 0x6f7a70) {
  const shadow = scene.add.ellipse(x + 2, y + 3, 13 * scale, 6 * scale, 0x25352f, 0.18);
  const stone = scene.add.ellipse(x, y, 11 * scale, 7 * scale, tone, 0.72);
  const top = scene.add.ellipse(x - 1, y - 2, 6 * scale, 2 * scale, 0xa0aa96, 0.42);
  container.add([shadow, stone, top]);
  return 3;
}

function addWeed(scene, container, x, y, scale = 1, tone = 0x477849) {
  const graphics = scene.add.graphics();
  graphics.lineStyle(Math.max(1, Math.round(scale)), tone, 0.72);
  graphics.lineBetween(x, y + 5 * scale, x - 4 * scale, y - 4 * scale);
  graphics.lineBetween(x, y + 5 * scale, x + 1 * scale, y - 6 * scale);
  graphics.lineBetween(x, y + 5 * scale, x + 5 * scale, y - 2 * scale);
  container.add(graphics);
  return 1;
}

function createTerrainDetail(scene, foundation) {
  const container = scene.add
    .container(0, 0)
    .setDepth(BUILDERS_VALLEY_LAYER_CONTRACT.ground + 7);

  let markCount = 0;

  // Large, low-contrast grass and soil masses: these create landscape rhythm
  // without reading as individual placed props.
  [
    [8.5, 6.5, 9.5, 5.4, 0x4f8d49, 0.15, -0.08],
    [13.8, 9.0, 7.2, 3.6, 0x3f7f43, 0.11, 0.05],
    [7.2, 17.6, 8.0, 4.0, 0x628f4c, 0.10, -0.04],
    [15.3, 20.0, 7.5, 3.2, 0x8e874f, 0.10, 0.02],
    [34.5, 18.2, 6.0, 4.2, 0x8e7042, 0.12, -0.03],
    [37.6, 23.0, 7.0, 3.3, 0x7c623d, 0.13, 0.04],
  ].forEach(([gx, gy, gw, gh, color, alpha, rotation]) => {
    addPatch(scene, container, gx * TILE_SIZE, gy * TILE_SIZE, gw * TILE_SIZE, gh * TILE_SIZE, color, alpha, rotation);
    markCount += 1;
  });

  // Path wear is layered and offset instead of simply tracing the path with a
  // uniform stroke. This keeps the authored path readable while suggesting use.
  [
    [10.7, 15.3, 4.8, 0.75, -0.18],
    [14.5, 17.0, 5.0, 0.65, -0.13],
    [18.0, 18.5, 4.0, 0.58, -0.08],
    [20.3, 19.4, 2.6, 0.48, -0.03],
  ].forEach(([gx, gy, gw, gh, rotation], index) => {
    addPatch(
      scene,
      container,
      gx * TILE_SIZE,
      gy * TILE_SIZE,
      gw * TILE_SIZE,
      gh * TILE_SIZE,
      index % 2 === 0 ? 0xb99b61 : 0x9d8352,
      index % 2 === 0 ? 0.16 : 0.12,
      rotation,
    );
    markCount += 1;
  });

  const geometry = foundation?.geometry;
  if (geometry?.edgeSamples) {
    const sampleIndices = [4, 7, 10, 15, 19, 23, 27];
    sampleIndices.forEach((sampleIndex, index) => {
      const sample = geometry.edgeSamples[Math.min(sampleIndex, geometry.edgeSamples.length - 1)];
      const side = index % 2 === 0 ? -1 : 1;
      const bankX = side < 0 ? sample.left - 22 : sample.right + 22;
      const color = index < 2 ? 0x526343 : index % 3 === 0 ? 0x6e6841 : 0x61704a;
      addPatch(scene, container, bankX, sample.y + 5, 58 + (index % 3) * 12, 24, color, 0.18, side * 0.05);
      markCount += 1;

      if (![10, 19].includes(sampleIndex)) {
        markCount += addPebble(
          scene,
          container,
          bankX + side * (12 + (index % 2) * 6),
          sample.y + 9,
          0.72 + (index % 3) * 0.12,
          index % 2 === 0 ? 0x66736a : 0x777a67,
        );
      }
      markCount += addWeed(scene, container, bankX - side * 9, sample.y + 2, 0.8 + (index % 2) * 0.25);
    });
  }

  // Controlled bridge and workshop wear. Keep interaction surfaces visually
  // open by using broad, translucent material variation rather than props.
  [
    [STREAM.left - 78, 20.6 * TILE_SIZE, 110, 52, 0x9a8150, 0.15, -0.04],
    [STREAM.left + STREAM.width + 92, 20.8 * TILE_SIZE, 126, 58, 0x887044, 0.16, 0.03],
    [WORLD_WIDTH - 132, 22.1 * TILE_SIZE, 188, 118, 0x745637, 0.13, -0.02],
    [WORLD_WIDTH - 170, 24.1 * TILE_SIZE, 126, 48, 0x9d7845, 0.12, 0.05],
  ].forEach(([x, y, width, height, color, alpha, rotation]) => {
    addPatch(scene, container, x, y, width, height, color, alpha, rotation);
    markCount += 1;
  });

  [
    [5.2, 26.4, 0.75],
    [10.0, 28.0, 0.58],
    [17.1, 27.2, 0.68],
    [29.5, 28.1, 0.62],
    [43.0, 27.4, 0.72],
  ].forEach(([gx, gy, scale], index) => {
    markCount += addPebble(scene, container, gx * TILE_SIZE, gy * TILE_SIZE, scale, index % 2 ? 0x6d756c : 0x7d7665);
    markCount += addWeed(scene, container, gx * TILE_SIZE + 13, gy * TILE_SIZE - 2, 0.7 + index * 0.04);
  });

  return { container, markCount };
}

function installTerrainDetailRuntime(scene) {
  const foundation = scene.__terrainRiverFoundation ?? null;
  const detail = createTerrainDetail(scene, foundation);

  const runtime = {
    standard: STANDARD,
    status: "ACTIVE",
    compositionModel: "ZONE_WEIGHTED_LAYERED_TERRAIN_MATERIAL",
    zones: ZONES,
    markCount: detail.markCount,
    layerDepth: BUILDERS_VALLEY_LAYER_CONTRACT.ground + 7,
    pathAuthority: "BuildersValleyTerrainRiverPatch",
    riverGeometryAuthority: "RiverGeometry",
    gameplayGeometryChanged: false,
    container: detail.container,
  };

  scene.__terrainDetailRuntime = runtime;
  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getTerrainDetailRuntime = () => ({
    standard: runtime.standard,
    packageStatus: runtime.status,
    compositionModel: runtime.compositionModel,
    markCount: runtime.markCount,
    layerDepth: runtime.layerDepth,
    zones: runtime.zones.map((zone) => ({ ...zone })),
    pathAuthority: runtime.pathAuthority,
    riverGeometryAuthority: runtime.riverGeometryAuthority,
    gameplayGeometryChanged: false,
  });
  window.__BUILDERS_VALLEY__.debugTerrainDetail = () => {
    const state = window.__BUILDERS_VALLEY__.getTerrainDetailRuntime();
    console.group(`Builders Valley Terrain Detail — ${state.packageStatus}`);
    console.table(state.zones.map((zone) => ({
      zone: zone.id,
      density: zone.density,
      purpose: zone.purpose,
    })));
    console.log(state);
    console.groupEnd();
    return state;
  };
}

prototype.create = function createWithTerrainDetailRuntime() {
  originalCreate.call(this);
  installTerrainDetailRuntime(this);
};
