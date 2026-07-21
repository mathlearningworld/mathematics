import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;
const originalGetFrontPlacementPoint = prototype._getFrontPlacementPoint;

// Placement intentionally leaves one empty tile between the player and the new block.
const PLACEMENT_TILE_DISTANCE = 2;
// Pickup requires the player to move genuinely close to an existing placed block.
const PLACED_BLOCK_PICKUP_DISTANCE = 38;
const PICKUP_FORWARD_DOT_MIN = 0.25;
const PICKUP_LATERAL_DISTANCE_MAX = TILE_SIZE * 0.65;

function getActiveBuildMaterial(scene) {
  const intent = scene.__gameplayIntent;
  if (
    intent?.kind === "BUILD_WITH_MATERIAL" &&
    intent.resourceType &&
    (scene.inventory?.[intent.resourceType] ?? 0) > 0
  ) {
    return intent.resourceType;
  }

  const intendedMaterial = scene.__placementIntentMaterial;
  if (intendedMaterial && (scene.inventory?.[intendedMaterial] ?? 0) > 0) {
    return intendedMaterial;
  }

  const selectedItem = scene.hotbarSlots?.[scene.selectedSlot]?.item;
  if (
    selectedItem?.kind === "BLOCK" &&
    (scene.inventory?.[selectedItem.resourceType] ?? 0) > 0
  ) {
    return selectedItem.resourceType;
  }

  return null;
}

function isPlacedBlock(scene, target) {
  if (!target) return false;
  if (scene.placedBlocks?.includes(target)) return true;
  const assetId = target.getData?.("assetId") ?? "";
  return assetId.startsWith("BV_BLOCK_");
}

function getInteractionDirection(scene) {
  const direction = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  const length = Math.hypot(direction.x, direction.y) || 1;
  return { x: direction.x / length, y: direction.y / length };
}

function getPickupMetrics(scene, block) {
  if (!scene.player || !block) return null;

  const dx = block.x - scene.player.x;
  const dy = block.y - scene.player.y;
  const distance = Math.hypot(dx, dy);
  const direction = getInteractionDirection(scene);
  const forwardDistance = dx * direction.x + dy * direction.y;
  const lateralDistance = Math.abs(dx * -direction.y + dy * direction.x);
  const forwardDot = distance > 0 ? forwardDistance / distance : 1;

  return { distance, forwardDistance, lateralDistance, forwardDot };
}

function findClosePlacedBlockInFront(scene) {
  let best = null;
  let bestDistance = PLACED_BLOCK_PICKUP_DISTANCE;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    const metrics = getPickupMetrics(scene, block);
    if (!metrics) continue;
    if (metrics.distance > PLACED_BLOCK_PICKUP_DISTANCE) continue;
    if (metrics.forwardDistance <= 0) continue;
    if (metrics.forwardDot < PICKUP_FORWARD_DOT_MIN) continue;
    if (metrics.lateralDistance > PICKUP_LATERAL_DISTANCE_MAX) continue;

    if (metrics.distance < bestDistance) {
      best = block;
      bestDistance = metrics.distance;
    }
  }

  return best;
}

function clearPlacedBlockTarget(scene) {
  if (!isPlacedBlock(scene, scene.targetResource)) return;

  scene.targetResource = null;
  if (scene.__targetDecision) {
    scene.__targetDecision.confirmedTarget = null;
    scene.__targetDecision.candidateTarget = null;
    scene.__targetDecision.candidateSince = 0;
  }
  scene.targetIndicator?.setVisible(false);
}

function autoSelectToolForBlock(scene, block) {
  const material = block.getData?.("resourceType") ?? block.getData?.("material") ?? null;
  const requiredTool =
    block.getData?.("requiredTool") ??
    (material === "wood" ? "axe" : material === "stone" ? "pickaxe" : null);
  if (!requiredTool) return;

  const slotIndex = scene.hotbarSlots?.findIndex(({ item }) => item?.id === requiredTool);
  if (!Number.isInteger(slotIndex) || slotIndex < 0) return;

  scene.__intentAutoSelecting = true;
  try {
    scene._selectHotbarSlot(slotIndex);
  } finally {
    scene.__intentAutoSelecting = false;
  }
}

function confirmClosePlacedBlock(scene, block) {
  const previousTarget = scene.targetResource;
  scene.targetResource = block;

  if (scene.__targetDecision) {
    scene.__targetDecision.confirmedTarget = block;
    scene.__targetDecision.candidateTarget = null;
    scene.__targetDecision.candidateSince = 0;
  }

  scene.targetIndicator?.setVisible(true).setPosition(block.x, block.y - 12);
  autoSelectToolForBlock(scene, block);

  if (previousTarget !== block) {
    scene._recordEvent?.("target_confirmed", {
      previous: previousTarget?.getData?.("assetId") ?? null,
      current: block.getData?.("assetId") ?? null,
      reason: "CLOSE_PLACED_BLOCK_IN_FRONT",
    });
  }
}

function restoreBuildMaterial(scene, resourceType) {
  const slotIndex = scene.hotbarSlots?.findIndex(
    ({ item }) => item?.kind === "BLOCK" && item.resourceType === resourceType,
  );
  if (!Number.isInteger(slotIndex) || slotIndex < 0) return;

  scene.__intentAutoSelecting = true;
  try {
    scene._selectHotbarSlot(slotIndex);
  } finally {
    scene.__intentAutoSelecting = false;
  }
}

prototype._getFrontPlacementPoint = function getSpacedFrontPlacementPoint() {
  if (!this.player) return originalGetFrontPlacementPoint?.call(this) ?? null;

  const direction = getInteractionDirection(this);
  return {
    x: this.player.x + direction.x * TILE_SIZE * PLACEMENT_TILE_DISTANCE,
    y: this.player.y + direction.y * TILE_SIZE * PLACEMENT_TILE_DISTANCE,
  };
};

prototype._updateTargetResource = function updateTargetWithSeparatedInteractionDistances() {
  const buildMaterial = getActiveBuildMaterial(this);
  if (!buildMaterial) {
    originalUpdateTargetResource.call(this);
    return;
  }

  const closePlacedBlock = findClosePlacedBlockInFront(this);
  if (closePlacedBlock) {
    confirmClosePlacedBlock(this, closePlacedBlock);
    return;
  }

  const originalNodes = this.resourceNodes;
  clearPlacedBlockTarget(this);

  // Outside deliberate close-pickup range, placed blocks cannot steal focus.
  // The player keeps Build Intent and the preview remains two tiles ahead,
  // leaving one clear tile between the player and the next placement.
  this.resourceNodes = Array.isArray(originalNodes)
    ? originalNodes.filter((node) => !isPlacedBlock(this, node))
    : originalNodes;

  try {
    originalUpdateTargetResource.call(this);
  } finally {
    this.resourceNodes = originalNodes;
  }

  if (isPlacedBlock(this, this.targetResource)) {
    clearPlacedBlockTarget(this);
  }

  if (!this.targetResource) {
    restoreBuildMaterial(this, buildMaterial);
  }
};
