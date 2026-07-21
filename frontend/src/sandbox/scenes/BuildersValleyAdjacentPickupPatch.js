import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

// Pickup is allowed only when collision bounds are genuinely touching or nearly touching.
const ADJACENT_BODY_GAP_MAX = 4;

function getBounds(object) {
  const body = object?.body;
  if (body && Number.isFinite(body.left) && Number.isFinite(body.right)) {
    return { left: body.left, right: body.right, top: body.top, bottom: body.bottom };
  }

  const width = object?.displayWidth ?? object?.width ?? TILE_SIZE;
  const height = object?.displayHeight ?? object?.height ?? TILE_SIZE;
  return {
    left: object.x - width / 2,
    right: object.x + width / 2,
    top: object.y - height / 2,
    bottom: object.y + height / 2,
  };
}

function bodyGap(leftObject, rightObject) {
  if (!leftObject || !rightObject) return Number.POSITIVE_INFINITY;
  const left = getBounds(leftObject);
  const right = getBounds(rightObject);
  const gapX = Math.max(0, left.left - right.right, right.left - left.right);
  const gapY = Math.max(0, left.top - right.bottom, right.top - left.bottom);
  return Math.hypot(gapX, gapY);
}

function isAdjacent(scene, target) {
  return Boolean(target?.active) && bodyGap(scene.player, target) <= ADJACENT_BODY_GAP_MAX;
}

function clearOutOfRangeTarget(scene) {
  if (!scene.targetResource || isAdjacent(scene, scene.targetResource)) return;

  scene.targetResource = null;
  if (scene.__targetDecision) {
    scene.__targetDecision.confirmedTarget = null;
    scene.__targetDecision.candidateTarget = null;
    scene.__targetDecision.candidateSince = 0;
  }
  scene.targetIndicator?.setVisible(false);
}

prototype._updateTargetResource = function updateTargetWithAdjacentPickupOnly() {
  clearOutOfRangeTarget(this);

  const originalNodes = this.resourceNodes;
  this.resourceNodes = Array.isArray(originalNodes)
    ? originalNodes.filter((node) => isAdjacent(this, node))
    : originalNodes;

  try {
    originalUpdateTargetResource.call(this);
  } finally {
    this.resourceNodes = originalNodes;
  }

  clearOutOfRangeTarget(this);
};
