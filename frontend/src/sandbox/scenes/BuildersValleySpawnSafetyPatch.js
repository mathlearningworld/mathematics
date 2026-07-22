import Phaser from "phaser";
import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const STANDARD = "BUILDERS_VALLEY_SPAWN_SAFETY_V1";

const SAFE_CANDIDATES = Object.freeze([
  Object.freeze({ x: 6 * TILE_SIZE, y: 8 * TILE_SIZE, id: "AUTHORED_SPAWN" }),
  Object.freeze({ x: 10 * TILE_SIZE, y: 11 * TILE_SIZE, id: "PATH_CLEAR_A" }),
  Object.freeze({ x: 12 * TILE_SIZE, y: 12 * TILE_SIZE, id: "PATH_CLEAR_B" }),
  Object.freeze({ x: 9 * TILE_SIZE, y: 14 * TILE_SIZE, id: "PATH_CLEAR_C" }),
]);

function getBodyBounds(gameObject) {
  const body = gameObject?.body;
  if (!body) return null;
  return new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
}

function isBlocked(scene, x, y) {
  const playerBody = scene.player?.body;
  if (!playerBody) return false;

  const width = playerBody.width || 22;
  const height = playerBody.height || 24;
  const candidate = new Phaser.Geom.Rectangle(x - width / 2, y - height / 2, width, height);

  const children = scene.obstacles?.getChildren?.() ?? [];
  return children.some((obstacle) => {
    if (!obstacle?.active) return false;
    const bounds = getBodyBounds(obstacle);
    return bounds ? Phaser.Geom.Intersects.RectangleToRectangle(candidate, bounds) : false;
  });
}

function recoverSpawn(scene) {
  const player = scene.player;
  if (!player?.body) {
    return { status: "SKIPPED", reason: "PLAYER_BODY_UNAVAILABLE", relocated: false };
  }

  const currentBlocked = isBlocked(scene, player.x, player.y);
  if (!currentBlocked) {
    return {
      status: "CLEAR",
      reason: "CURRENT_POSITION_CLEAR",
      relocated: false,
      position: { x: player.x, y: player.y },
    };
  }

  const destination = SAFE_CANDIDATES.find((candidate) => !isBlocked(scene, candidate.x, candidate.y));
  if (!destination) {
    return {
      status: "BLOCKED",
      reason: "NO_SAFE_CANDIDATE",
      relocated: false,
      position: { x: player.x, y: player.y },
    };
  }

  player.body.stop();
  player.setPosition(destination.x, destination.y);
  player.body.reset(destination.x, destination.y);

  return {
    status: "RECOVERED",
    reason: "PLAYER_OVERLAPPED_STATIC_OBSTACLE",
    relocated: true,
    destination: destination.id,
    position: { x: destination.x, y: destination.y },
  };
}

prototype.create = function createWithSpawnSafety() {
  originalCreate.call(this);

  const result = recoverSpawn(this);
  this.__spawnSafetyRuntime = {
    standard: STANDARD,
    ...result,
    collisionGeometryChanged: false,
    gameplayGeometryChanged: false,
  };

  window.__BUILDERS_VALLEY__ ??= {};
  window.__BUILDERS_VALLEY__.getSpawnSafety = () => ({ ...this.__spawnSafetyRuntime });
  window.__BUILDERS_VALLEY__.recoverPlayerSpawn = () => {
    const recovery = recoverSpawn(this);
    this.__spawnSafetyRuntime = {
      standard: STANDARD,
      ...recovery,
      collisionGeometryChanged: false,
      gameplayGeometryChanged: false,
    };
    return { ...this.__spawnSafetyRuntime };
  };
};
