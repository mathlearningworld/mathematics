import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

const PLACED_BLOCK_PICKUP_DISTANCE = 46;

function getSelectedBuildMaterial(scene) {
  const selectedItem = scene.hotbarSlots?.[scene.selectedSlot]?.item;
  if (selectedItem?.kind !== "BLOCK") return null;
  if ((scene.inventory?.[selectedItem.resourceType] ?? 0) <= 0) return null;

  const intent = scene.__gameplayIntent;
  if (
    intent?.kind === "BUILD_WITH_MATERIAL" &&
    intent.resourceType !== selectedItem.resourceType
  ) {
    return null;
  }

  return selectedItem.resourceType;
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
  return (scene.placedBlocks ?? [])
    .filter(
      (block) =>
        block?.active && distanceFromPlayer(scene, block) <= PLACED_BLOCK_PICKUP_DISTANCE,
    )
    .sort((left, right) => distanceFromPlayer(scene, left) - distanceFromPlayer(scene, right))[0] ?? null;
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

function restoreSelectedBuildMaterial(scene, resourceType) {
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

function updateForClosePickup(scene, closeBlock, originalNodes) {
  const previousLastPlacedTarget = scene.__lastPlacedIntentTarget;

  // At deliberate pickup range, the placed block becomes a real context target.
  // Temporarily remove the just-placed penalty so the existing scoring and
  // interaction queue can confirm it and select its required tool normally.
  scene.__lastPlacedIntentTarget = null;
  scene.resourceNodes = [
    closeBlock,
    ...(originalNodes ?? []).filter((node) => !isPlacedBlock(scene, node)),
  ];

  try {
    originalUpdateTargetResource.call(scene);
  } finally {
    scene.resourceNodes = originalNodes;
    scene.__lastPlacedIntentTarget = previousLastPlacedTarget;
  }
}

prototype._updateTargetResource = function updateTargetWithPlacementPriority() {
  const buildMaterial = getSelectedBuildMaterial(this);
  if (!buildMaterial) {
    originalUpdateTargetResource.call(this);
    return;
  }

  const originalNodes = this.resourceNodes;
  const closePlacedBlock = findClosePlacedBlock(this);

  if (closePlacedBlock) {
    updateForClosePickup(this, closePlacedBlock, originalNodes);
    return;
  }

  clearPlacedBlockTarget(this);

  // While the player is building, placed blocks outside deliberate pickup range
  // must not steal focus from the next placement tile.
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
    restoreSelectedBuildMaterial(this, buildMaterial);
  }
};
