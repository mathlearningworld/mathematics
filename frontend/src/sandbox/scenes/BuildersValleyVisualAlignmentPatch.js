import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;

// The player container is anchored at the ground/foot point. Placement in front
// and behind uses that ground point directly, while left/right placement must
// align the block's bottom edge with the same ground line rather than placing
// the block centre on it.
const PLAYER_VISUAL_FOOT_Y_OFFSET = 1;
const PLAYER_FOOTPRINT_HALF_WIDTH = 13;
const PLAYER_FOOTPRINT_HALF_HEIGHT = 5;
const BLOCK_VISUAL_HALF_WIDTH = 14;
const BLOCK_VISUAL_HALF_HEIGHT = 13;
const PLACEMENT_GAP = 1;
const HORIZONTAL_BLOCK_CENTER_Y_OFFSET = -BLOCK_VISUAL_HALF_HEIGHT;

// Once a build line exists, every following block uses one canonical centre-to-
// centre pitch. This prevents small player-position differences from producing
// visibly uneven gaps between otherwise adjacent blocks.
const BUILD_BLOCK_PITCH = TILE_SIZE;
const BUILD_LINE_SNAP_MAX = TILE_SIZE * 0.65;

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

function snapToUniformBuildLine(scene, rawPoint, direction) {
  let bestPoint = null;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    const candidate = {
      x: block.x + direction.x * BUILD_BLOCK_PITCH,
      y: block.y + direction.y * BUILD_BLOCK_PITCH,
    };
    const delta = Math.hypot(candidate.x - rawPoint.x, candidate.y - rawPoint.y);

    if (delta <= BUILD_LINE_SNAP_MAX && delta < bestDelta) {
      bestPoint = candidate;
      bestDelta = delta;
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
          x:
            foot.x +
            direction.x *
              (PLAYER_FOOTPRINT_HALF_WIDTH + BLOCK_VISUAL_HALF_WIDTH + PLACEMENT_GAP),
          y: foot.y + HORIZONTAL_BLOCK_CENTER_Y_OFFSET,
        }
      : {
          x: foot.x,
          y:
            foot.y +
            direction.y *
              (PLAYER_FOOTPRINT_HALF_HEIGHT + BLOCK_VISUAL_HALF_HEIGHT + PLACEMENT_GAP),
        };

  return snapToUniformBuildLine(this, rawPoint, direction);
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