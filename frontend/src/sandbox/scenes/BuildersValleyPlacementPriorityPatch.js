import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

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

prototype._updateTargetResource = function updateTargetWithPlacementPriority() {
  const buildMaterial = getSelectedBuildMaterial(this);
  if (!buildMaterial) {
    originalUpdateTargetResource.call(this);
    return;
  }

  clearPlacedBlockTarget(this);

  const originalNodes = this.resourceNodes;
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
