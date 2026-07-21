import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;

const PLAYER_VISUAL_FOOT_Y_OFFSET = 1;
const BLOCK_VISUAL_HALF_HEIGHT = 13;
const FIXED_PLACEMENT_REACH = TILE_SIZE;
const HORIZONTAL_BLOCK_CENTER_Y_OFFSET = -BLOCK_VISUAL_HALF_HEIGHT;

const BUILD_BLOCK_PITCH = TILE_SIZE;
const BUILD_SOCKET_SNAP_MAX = 6;
const OCCUPIED_SOCKET_EPSILON = 4;
const RAW_POINT_BLOCK_RADIUS = TILE_SIZE * 0.7;
const BUILD_SOCKET_OFFSETS = Object.freeze([
  { x: BUILD_BLOCK_PITCH, y: 0 },
  { x: -BUILD_BLOCK_PITCH, y: 0 },
  { x: 0, y: BUILD_BLOCK_PITCH },
  { x: 0, y: -BUILD_BLOCK_PITCH },
]);

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

function isOffsetOnFacingAxis(offset, direction) {
  return direction.x !== 0 ? offset.y === 0 : offset.x === 0;
}

function isCandidateInFacingDirection(scene, candidate, direction) {
  const dx = candidate.x - scene.player.x;
  const dy = candidate.y - scene.player.y;
  return direction.x !== 0 ? dx * direction.x > 0 : dy * direction.y > 0;
}

function snapToNearestUniformSocket(scene, rawPoint, direction) {
  if (isRawPointBlocked(scene, rawPoint)) return rawPoint;

  let bestPoint = null;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    for (const offset of BUILD_SOCKET_OFFSETS) {
      if (!isOffsetOnFacingAxis(offset, direction)) continue;

      const candidate = {
        x: block.x + offset.x,
        y: block.y + offset.y,
      };
      if (isSocketOccupied(scene, candidate)) continue;
      if (!isCandidateInFacingDirection(scene, candidate, direction)) continue;

      const delta = Math.hypot(candidate.x - rawPoint.x, candidate.y - rawPoint.y);
      if (delta <= BUILD_SOCKET_SNAP_MAX && delta < bestDelta) {
        bestPoint = candidate;
        bestDelta = delta;
      }
    }
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

  return snapToNearestUniformSocket(this, rawPoint, direction);
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
