import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

const PLACED_BLOCK_PICKUP_DISTANCE = 46;

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

function distanceFromPlayer(scene, target) {
  if (!scene.player || !target) return Number.POSITIVE_INFINITY;
  return Math.hypot(target.x - scene.player.x, target.y - scene.player.y);
}

function findClosePlacedBlock(scene) {
  let nearest = null;
  let nearestDistance = PLACED_BLOCK_PICKUP_DISTANCE;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;
    const distance = distanceFromPlayer(scene, block);
    if (distance <= nearestDistance) {
      nearest = block;
      nearestDistance = distance;
    }
  }

  return nearest;
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
  const requiredTool = block.getData?.("requiredTool") ??
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

function confirmNearestPlacedBlock(scene, block) {
  const previousTarget = scene.targetResource;
  scene.targetResource = block;

  if (scene.__targetDecision) {
    scene.__targetDecision.confirmedTarget = block;
    scene.__targetDecision.candidateTarget = null;
    scene.__targetDecision.candidateSince = 0;
  }

  scene.targetIndicator
    ?.setVisible(true)
    .setPosition(block.x, block.y - 12);

  autoSelectToolForBlock(scene, block);

  if (previousTarget !== block) {
    scene._recordEvent?.("target_confirmed", {
      previous: previousTarget?.getData?.("assetId") ?? null,
      current: block.getData?.("assetId") ?? null,
      reason: "NEAREST_PLACED_BLOCK_IN_PICKUP_RANGE",
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

prototype._updateTargetResource = function updateTargetWithPlacementPriority() {
  const buildMaterial = getActiveBuildMaterial(this);
  if (!buildMaterial) {
    originalUpdateTargetResource.call(this);
    return;
  }

  const closePlacedBlock = findClosePlacedBlock(this);
  if (closePlacedBlock) {
    // Pickup range is deterministic: the nearest placed block always wins.
    // Do not pass this branch through the general target scoring engine, because
    // facing and intent weights can otherwise select a farther block.
    confirmNearestPlacedBlock(this, closePlacedBlock);
    return;
  }

  const originalNodes = this.resourceNodes;
  clearPlacedBlockTarget(this);

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
