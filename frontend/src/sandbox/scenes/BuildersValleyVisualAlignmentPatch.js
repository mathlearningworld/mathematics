import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;

const PLAYER_VISUAL_FOOT_Y_OFFSET = 1;
const BLOCK_VISUAL_HALF_HEIGHT = 13;
const FIXED_PLACEMENT_REACH = TILE_SIZE;
const HORIZONTAL_BLOCK_CENTER_Y_OFFSET = -BLOCK_VISUAL_HALF_HEIGHT;

const BUILD_BLOCK_PITCH = TILE_SIZE;
const SOCKET_AXIS_TOLERANCE = 10;
const SOCKET_LANE_TOLERANCE = 6;
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

function resolveDeterministicFacingSocket(scene, rawPoint, direction) {
  // An occupied point remains exactly where the player is aiming. It becomes an
  // invalid placement instead of searching for another socket above, below, or
  // behind the existing block.
  if (isRawPointBlocked(scene, rawPoint)) return rawPoint;

  let bestPoint = null;
  let bestAxisDelta = Number.POSITIVE_INFINITY;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    // A block contributes exactly one socket: the socket in the direction the
    // player is facing. This removes the previous four-way nearest-socket search,
    // which could make the preview jump between neighboring rows or columns.
    const candidate = buildForwardSocket(block, direction);
    if (isSocketOccupied(scene, candidate)) continue;

    const laneDelta =
      direction.x !== 0
        ? Math.abs(candidate.y - rawPoint.y)
        : Math.abs(candidate.x - rawPoint.x);
    if (laneDelta > SOCKET_LANE_TOLERANCE) continue;

    const axisDelta =
      direction.x !== 0
        ? Math.abs(candidate.x - rawPoint.x)
        : Math.abs(candidate.y - rawPoint.y);
    if (axisDelta > SOCKET_AXIS_TOLERANCE || axisDelta >= bestAxisDelta) continue;

    bestPoint = candidate;
    bestAxisDelta = axisDelta;
  }

  return bestPoint ?? rawPoint;
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

  const resolved = resolveDeterministicFacingSocket(this, rawPoint, direction);
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
