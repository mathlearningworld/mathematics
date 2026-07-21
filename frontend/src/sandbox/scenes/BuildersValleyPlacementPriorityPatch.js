import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

const PLACED_BLOCK_PICKUP_DISTANCE = 74;
const FRONT_TILE_MATCH_DISTANCE = TILE_SIZE * 0.7;

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

function distanceBetween(left, right) {
  if (!left || !right) return Number.POSITIVE_INFINITY;
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function getFrontInteractionTile(scene) {
  const rawPoint = scene._getFrontPlacementPoint?.();
  if (!rawPoint) return null;

  return {
    x: Math.floor(rawPoint.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
    y: Math.floor(rawPoint.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
  };
}

function findPlacedBlockOnFrontTile(scene) {
  const frontTile = getFrontInteractionTile(scene);
  if (!frontTile || !scene.player) return null;

  let best = null;
  let bestTileDistance = FRONT_TILE_MATCH_DISTANCE;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;
    if (distanceBetween(scene.player, block) > PLACED_BLOCK_PICKUP_DISTANCE) continue;

    const tileDistance = distanceBetween(frontTile, block);
    if (tileDistance < bestTileDistance) {
      best = block;
      bestTileDistance = tileDistance;
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

function confirmFrontPlacedBlock(scene, block) {
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
      reason: "PLACED_BLOCK_ON_FRONT_INTERACTION_TILE",
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

  const frontPlacedBlock = findPlacedBlockOnFrontTile(this);
  if (frontPlacedBlock) {
    // Placement and pickup now share the same interaction tile. A built block is
    // collectible only when it occupies the exact tile currently in front of the
    // player; nearby side or rear blocks cannot steal focus.
    confirmFrontPlacedBlock(this, frontPlacedBlock);
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
