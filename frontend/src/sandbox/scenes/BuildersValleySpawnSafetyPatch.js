import Phaser from "phaser";
import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { TILE_SIZE } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_SPAWN_SAFETY_V2";

const AUTHORED_SPAWN = Object.freeze({ x: 6 * TILE_SIZE, y: 8 * TILE_SIZE });
const PRODUCTION_SPAWN = Object.freeze({
  x: 18 * TILE_SIZE,
  y: 15 * TILE_SIZE,
  id: "PRODUCTION_PATH_CLEAR",
});

const SAFE_CANDIDATES = Object.freeze([
  PRODUCTION_SPAWN,
  Object.freeze({ x: 16 * TILE_SIZE, y: 14 * TILE_SIZE, id: "PATH_CLEAR_A" }),
  Object.freeze({ x: 19 * TILE_SIZE, y: 13 * TILE_SIZE, id: "PATH_CLEAR_B" }),
  Object.freeze({ x: 15 * TILE_SIZE, y: 16 * TILE_SIZE, id: "PATH_CLEAR_C" }),
]);

function getBodyBounds(gameObject) {
  const body = gameObject?.body;
  if (!body) return null;
  return new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
}

function isBlocked(scene, x, y, padding = 10) {
  const playerBody = scene.player?.body;
  if (!playerBody) return false;

  const width = (playerBody.width || 22) + padding * 2;
  const height = (playerBody.height || 24) + padding * 2;
  const candidate = new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height);

  const children = scene.obstacles?.getChildren?.() ?? [];
  return children.some((obstacle) => {
    if (!obstacle?.active) return false;
    const bounds = getBodyBounds(obstacle);
    return bounds ? Phaser.Geom.Intersects.RectangleToRectangle(candidate, bounds) : false;
  });
}

function isNearAuthoredSpawn(player) {
  return Phaser.Math.Distance.Between(player.x, player.y, AUTHORED_SPAWN.x, AUTHORED_SPAWN.y) <= 24;
}

function movePlayer(scene, destination) {
  const player = scene.player;
  player.body.stop();
  player.setPosition(destination.x, destination.y);
  player.body.reset(destination.x, destination.y);
  player.body.setVelocity(0, 0);
  player.body.updateFromGameObject?.();
}

function recoverSpawn(scene, { forceProductionSpawn = false } = {}) {
  const player = scene.player;
  if (!player?.body) {
    return { status: "SKIPPED", reason: "PLAYER_BODY_UNAVAILABLE", relocated: false };
  }

  const currentBlocked = isBlocked(scene, player.x, player.y, 8);
  const legacySpawnRequiresMigration = isNearAuthoredSpawn(player);
  const shouldRelocate = forceProductionSpawn || currentBlocked || legacySpawnRequiresMigration;

  if (!shouldRelocate) {
    return {
      status: "CLEAR",
      reason: "CURRENT_POSITION_CLEAR",
      relocated: false,
      position: { x: player.x, y: player.y },
    };
  }

  const destination = SAFE_CANDIDATES.find((candidate) => !isBlocked(scene, candidate.x, candidate.y, 18));
  if (!destination) {
    return {
      status: "BLOCKED",
      reason: "NO_SAFE_CANDIDATE",
      relocated: false,
      position: { x: player.x, y: player.y },
    };
  }

  movePlayer(scene, destination);

  return {
    status: "RECOVERED",
    reason: currentBlocked
      ? "PLAYER_OVERLAPPED_STATIC_OBSTACLE"
      : legacySpawnRequiresMigration
        ? "LEGACY_SPAWN_MIGRATED"
        : "FORCED_PRODUCTION_SPAWN",
    relocated: true,
    destination: destination.id,
    position: { x: destination.x, y: destination.y },
  };
}

function publishRuntime(scene, result) {
  scene.__spawnSafetyRuntime = {
    standard: STANDARD,
    ...result,
    collisionGeometryChanged: false,
    gameplayGeometryChanged: false,
  };
  return { ...scene.__spawnSafetyRuntime };
}

prototype.create = function createWithSpawnSafety() {
  originalCreate.call(this);

  // Always migrate the legacy authored spawn once production vegetation is active.
  publishRuntime(this, recoverSpawn(this, { forceProductionSpawn: true }));

  // Run one more pass after Arcade Physics and camera-follow state settle.
  this.time.delayedCall(0, () => {
    publishRuntime(this, recoverSpawn(this));
  });

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getSpawnSafety = () => ({ ...this.__spawnSafetyRuntime });
  window.__BUILDERS_VALLEY__.recoverPlayerSpawn = () => publishRuntime(
    this,
    recoverSpawn(this, { forceProductionSpawn: true }),
  );
};
