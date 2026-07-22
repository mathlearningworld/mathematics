import {
  STREAM,
  TILE_SIZE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";

const freezePoint = (x, y) => Object.freeze({ x, y });
const freezeRect = (x, y, width, height) => Object.freeze({ x, y, width, height });

/**
 * WORLD-001 world ownership contract.
 *
 * This object is intentionally presentation-neutral in Slice 1. It establishes
 * one durable authority for world composition before rendering and landmark
 * ownership are migrated away from the historical patch chain.
 */
export class BuildersValleyWorld {
  static STANDARD = "BUILDERS_VALLEY_WORLD_AUTHORITY_V1";

  constructor(scene) {
    this.scene = scene;
    this.layout = BuildersValleyWorld.createLayout();
    this.layers = Object.freeze({
      background: Object.freeze({ id: "BACKGROUND", depthRange: Object.freeze([-100, -41]) }),
      ground: Object.freeze({ id: "GROUND", depthRange: Object.freeze([-40, 29]) }),
      midground: Object.freeze({ id: "MIDGROUND", depthRange: Object.freeze([30, 6999]) }),
      foreground: Object.freeze({ id: "FOREGROUND", depthRange: Object.freeze([7000, 8999]) }),
      gameplay: Object.freeze({ id: "GAMEPLAY", depthRange: Object.freeze([100, 8999]) }),
      hud: Object.freeze({ id: "HUD", depthRange: Object.freeze([10000, 10999]) }),
    });
    this.ownership = Object.freeze({
      terrainSilhouette: "BuildersValleyWorld",
      riverAndWaterfall: "BuildersValleyWorld",
      cliffsAndTerraces: "BuildersValleyWorld",
      bridge: "BuildersValleyWorld",
      workshop: "BuildersValleyWorld",
      forestFraming: "BuildersValleyWorld",
      gameplayCollision: "BuildersValleyScene",
      resourceLoop: "BuildersValleyScene",
      userInterface: "BuildersValleyScene",
    });
    this.status = "AUTHORITY_INSTALLED_RENDERING_NOT_MIGRATED";
  }

  static createLayout() {
    const riverCenterX = STREAM.left + STREAM.width / 2;
    const bridgeY = 14 * TILE_SIZE;
    const eastBankX = STREAM.left + STREAM.width;

    return Object.freeze({
      worldBounds: freezeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT),
      referenceViewport: freezeRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT),
      riverCorridor: freezeRect(STREAM.left, STREAM.top, STREAM.width, STREAM.height),
      waterfall: freezePoint(riverCenterX, 18),
      bridge: Object.freeze({
        anchor: freezePoint(riverCenterX, bridgeY),
        protectedCrossing: freezeRect(STREAM.left - 96, bridgeY - 80, STREAM.width + 192, 192),
      }),
      workshopTerrace: Object.freeze({
        anchor: freezePoint(eastBankX + 142, bridgeY - 50),
        bounds: freezeRect(eastBankX + 32, bridgeY - 176, 300, 300),
      }),
      gorge: freezeRect(STREAM.left - 176, 0, STREAM.width + 352, 11 * TILE_SIZE),
      forestPocket: freezeRect(2 * TILE_SIZE, 3 * TILE_SIZE, 16 * TILE_SIZE, 25 * TILE_SIZE),
      foregroundFrame: Object.freeze({
        southWest: freezeRect(0, 24 * TILE_SIZE, 12 * TILE_SIZE, 8 * TILE_SIZE),
        southEast: freezeRect(36 * TILE_SIZE, 24 * TILE_SIZE, 12 * TILE_SIZE, 8 * TILE_SIZE),
      }),
      eyeFlow: Object.freeze(["WATERFALL", "BRIDGE", "WORKSHOP"]),
    });
  }

  install() {
    if (this.scene.__buildersValleyWorldAuthority) {
      return this.scene.__buildersValleyWorldAuthority;
    }

    const runtime = Object.freeze({
      standard: BuildersValleyWorld.STANDARD,
      status: this.status,
      owner: "frontend/src/sandbox/world/BuildersValleyWorld.js",
      layout: this.layout,
      layers: this.layers,
      ownership: this.ownership,
      renderingAuthorityActive: false,
      legacyRenderersStillActive: true,
      gameplayGeometryChanged: false,
    });

    this.scene.__buildersValleyWorld = this;
    this.scene.__buildersValleyWorldAuthority = runtime;
    return runtime;
  }

  snapshot() {
    return {
      standard: BuildersValleyWorld.STANDARD,
      status: this.status,
      layout: this.layout,
      layers: this.layers,
      ownership: this.ownership,
      renderingAuthorityActive: false,
      legacyRenderersStillActive: true,
      gameplayGeometryChanged: false,
    };
  }
}
