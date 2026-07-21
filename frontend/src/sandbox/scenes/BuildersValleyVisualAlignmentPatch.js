import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;

// The player container's world point is close to the ground anchor, but it is
// not itself a complete interaction footprint. Keep one authoritative visual
// foot reference and derive every front placement direction from it.
const PLAYER_VISUAL_FOOT_Y_OFFSET = 1;
const PLAYER_FOOTPRINT_HALF_WIDTH = 13;
const PLAYER_FOOTPRINT_HALF_HEIGHT = 5;
const BLOCK_VISUAL_HALF_WIDTH = 14;
const BLOCK_VISUAL_HALF_HEIGHT = 13;
const PLACEMENT_GAP = 1;

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
  if (direction.x !== 0) {
    return {
      x:
        foot.x +
        direction.x *
          (PLAYER_FOOTPRINT_HALF_WIDTH + BLOCK_VISUAL_HALF_WIDTH + PLACEMENT_GAP),
      y: foot.y,
    };
  }

  return {
    x: foot.x,
    y:
      foot.y +
      direction.y *
        (PLAYER_FOOTPRINT_HALF_HEIGHT + BLOCK_VISUAL_HALF_HEIGHT + PLACEMENT_GAP),
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
