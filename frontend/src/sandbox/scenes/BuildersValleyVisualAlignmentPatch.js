import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalGetFrontPlacementPoint = prototype._getFrontPlacementPoint;
const originalUpdate = prototype.update;

const AXIS_SNAP_MAX = 12;
const NEIGHBOR_FORWARD_MAX = TILE_SIZE * 1.35;
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

function alignPlacementAxis(scene, point) {
  if (!point || !scene.player) return point;

  const direction = getCardinalDirection(scene);
  let best = null;
  let bestAxisDelta = Number.POSITIVE_INFINITY;
  let bestForwardDelta = Number.POSITIVE_INFINITY;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    const forwardDelta =
      direction.x !== 0
        ? Math.abs(block.x - point.x)
        : Math.abs(block.y - point.y);
    const axisDelta =
      direction.x !== 0
        ? Math.abs(block.y - point.y)
        : Math.abs(block.x - point.x);

    if (forwardDelta > NEIGHBOR_FORWARD_MAX || axisDelta > AXIS_SNAP_MAX) continue;

    if (
      axisDelta < bestAxisDelta ||
      (axisDelta === bestAxisDelta && forwardDelta < bestForwardDelta)
    ) {
      best = block;
      bestAxisDelta = axisDelta;
      bestForwardDelta = forwardDelta;
    }
  }

  if (!best) return point;

  return direction.x !== 0
    ? { x: point.x, y: best.y }
    : { x: best.x, y: point.y };
}

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

prototype._getFrontPlacementPoint = function getVisuallyAlignedFrontPlacementPoint() {
  const point = originalGetFrontPlacementPoint?.call(this) ?? null;
  return alignPlacementAxis(this, point);
};

prototype.update = function updateWithVisualInteractionAlignment(time, delta) {
  originalUpdate.call(this, time, delta);
  calibrateTargetIndicator(this);
};
