import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;

const PLAYER_VISUAL_FOOT_Y_OFFSET = 1;
const BLOCK_VISUAL_HALF_HEIGHT = 13;
const FIXED_PLACEMENT_REACH = TILE_SIZE;
const HORIZONTAL_BLOCK_CENTER_Y_OFFSET = -BLOCK_VISUAL_HALF_HEIGHT;

const BUILD_BLOCK_PITCH = TILE_SIZE;
const SOCKET_ACQUIRE_AXIS_TOLERANCE = 8;
const SOCKET_ACQUIRE_LANE_TOLERANCE = 5;
const SOCKET_RELEASE_DISTANCE = 18;
const OCCUPIED_SOCKET_EPSILON = 4;
const RAW_POINT_BLOCK_RADIUS = TILE_SIZE * 0.7;

const PLACED_BLOCK_FOCUS_SCALE = 0.68;
const NATURAL_RESOURCE_FOCUS_SCALE = 1;
const NATURAL_RESOURCE_FOCUS_Y_OFFSET = -12;

function isPlacedBlock(scene, target) {
  if (!target) return false;
  if (scene.placedBlocks?.includes(target)) return true;
  return (target.getData?.("assetId") ?? "").startsWith("BV_BLOCK_");
}

function getCardinalDirection(scene) {
  const direction = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  if (Math.abs(direction.x) >= Math.abs(direction.y)) {
    return { x: direction.x >= 0 ? 1 : -1, y: 0 };
  }
  return { x: 0, y: direction.y >= 0 ? 1 : -1 };
}

function directionKey(direction) {
  if (direction.x > 0) return "RIGHT";
  if (direction.x < 0) return "LEFT";
  if (direction.y > 0) return "DOWN";
  return "UP";
}

function isSocketOccupied(scene, candidate) {
  return (scene.placedBlocks ?? []).some(
    (block) =>
      block?.active &&
      Math.abs(block.x - candidate.x) <= OCCUPIED_SOCKET_EPSILON &&
      Math.abs(block.y - candidate.y) <= OCCUPIED_SOCKET_EPSILON,
  );
}

function isRawPointBlocked(scene, rawPoint) {
  return (scene.placedBlocks ?? []).some(
    (block) =>
      block?.active &&
      Math.hypot(block.x - rawPoint.x, block.y - rawPoint.y) < RAW_POINT_BLOCK_RADIUS,
  );
}

function buildForwardSocket(block, direction) {
  return {
    x: block.x + direction.x * BUILD_BLOCK_PITCH,
    y: block.y + direction.y * BUILD_BLOCK_PITCH,
  };
}

function clearPlacementSocketLock(scene) {
  scene.__stablePlacementSocket = null;
}

function canRetainLockedSocket(scene, rawPoint, direction) {
  const lock = scene.__stablePlacementSocket;
  if (!lock || lock.direction !== directionKey(direction)) return false;
  if (isSocketOccupied(scene, lock.point)) return false;
  return Math.hypot(lock.point.x - rawPoint.x, lock.point.y - rawPoint.y) <= SOCKET_RELEASE_DISTANCE;
}

function findFacingSocket(scene, rawPoint, direction) {
  let bestPoint = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    const candidate = buildForwardSocket(block, direction);
    if (isSocketOccupied(scene, candidate)) continue;

    const laneDelta =
      direction.x !== 0
        ? Math.abs(candidate.y - rawPoint.y)
        : Math.abs(candidate.x - rawPoint.x);
    if (laneDelta > SOCKET_ACQUIRE_LANE_TOLERANCE) continue;

    const axisDelta =
      direction.x !== 0
        ? Math.abs(candidate.x - rawPoint.x)
        : Math.abs(candidate.y - rawPoint.y);
    if (axisDelta > SOCKET_ACQUIRE_AXIS_TOLERANCE) continue;

    const distance = Math.hypot(candidate.x - rawPoint.x, candidate.y - rawPoint.y);
    if (distance >= bestDistance) continue;

    bestPoint = candidate;
    bestDistance = distance;
  }

  return bestPoint;
}

function resolveStableFacingSocket(scene, rawPoint, direction) {
  // When the exact point in front is blocked, keep the preview there and mark it
  // invalid. Never search around the obstacle or retain an older side socket.
  if (isRawPointBlocked(scene, rawPoint)) {
    clearPlacementSocketLock(scene);
    return rawPoint;
  }

  // Hysteresis: once a socket has been acquired, retain that exact socket through
  // normal player movement. A wider release radius prevents frame-by-frame
  // switching between the free-moving point and the snapped socket.
  if (canRetainLockedSocket(scene, rawPoint, direction)) {
    return scene.__stablePlacementSocket.point;
  }

  clearPlacementSocketLock(scene);
  const candidate = findFacingSocket(scene, rawPoint, direction);
  if (!candidate) return rawPoint;

  const point = {
    x: Math.round(candidate.x),
    y: Math.round(candidate.y),
  };
  scene.__stablePlacementSocket = {
    direction: directionKey(direction),
    point,
  };
  return point;
}

prototype._getPlayerFootPoint = function getPlayerVisualFootPoint() {
  if (!this.player) return null;
  return {
    x: this.player.x,
    y: this.player.y + PLAYER_VISUAL_FOOT_Y_OFFSET,
  };
};

prototype._getFrontPlacementPoint = function getFrontPointFromVisualFoot() {
  const foot = this._getPlayerFootPoint?.();
  if (!foot) return null;

  const direction = getCardinalDirection(this);
  const rawPoint =
    direction.x !== 0
      ? {
          x: foot.x + direction.x * FIXED_PLACEMENT_REACH,
          y: foot.y + HORIZONTAL_BLOCK_CENTER_Y_OFFSET,
        }
      : {
          x: foot.x,
          y: foot.y + direction.y * FIXED_PLACEMENT_REACH,
        };

  const resolved = resolveStableFacingSocket(this, rawPoint, direction);
  return {
    x: Math.round(resolved.x),
    y: Math.round(resolved.y),
  };
};

function calibrateTargetIndicator(scene) {
  const target = scene.targetResource?.active ? scene.targetResource : null;
  const indicator = scene.targetIndicator;
  if (!indicator || !target || !indicator.visible) return;

  if (isPlacedBlock(scene, target)) {
    indicator
      .setScale(PLACED_BLOCK_FOCUS_SCALE)
      .setPosition(Math.round(target.x), Math.round(target.y));
    return;
  }

  indicator
    .setScale(NATURAL_RESOURCE_FOCUS_SCALE)
    .setPosition(Math.round(target.x), Math.round(target.y + NATURAL_RESOURCE_FOCUS_Y_OFFSET));
}

prototype.update = function updateWithVisualInteractionAlignment(time, delta) {
  originalUpdate.call(this, time, delta);
  calibrateTargetIndicator(this);
};
