import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

// A pickup target may be focused only when the player is genuinely adjacent.
// Keep this below one full tile so standing one tile away never activates pickup.
const ADJACENT_PICKUP_DISTANCE = TILE_SIZE * 0.85;

function distanceFromPlayer(scene, target) {
  if (!scene.player || !target) return Number.POSITIVE_INFINITY;
  return Math.hypot(target.x - scene.player.x, target.y - scene.player.y);
}

function isAdjacent(scene, target) {
  return Boolean(target?.active) && distanceFromPlayer(scene, target) < ADJACENT_PICKUP_DISTANCE;
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
