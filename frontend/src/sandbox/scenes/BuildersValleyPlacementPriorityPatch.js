import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;
const originalGetFrontPlacementPoint = prototype._getFrontPlacementPoint;

// Place in the immediately adjacent tile measured from the player's collision edge.
const PLACEMENT_TILE_DISTANCE = 1;
// Pickup begins only when player and block collision bounds are genuinely adjacent.
const PICKUP_BODY_GAP_MAX = 4;
const PICKUP_FORWARD_DOT_MIN = 0.25;
const PICKUP_LATERAL_DISTANCE_MAX = TILE_SIZE * 0.75;

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
  const left = getBounds(leftObject);
  const right = getBounds(rightObject);
  const gapX = Math.max(0, left.left - right.right, right.left - left.right);
  const gapY = Math.max(0, left.top - right.bottom, right.top - left.bottom);
  return Math.hypot(gapX, gapY);
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

  return {
    distance,
    bodyGap: bodyGap(scene.player, block),
    forwardDistance,
    lateralDistance,
    forwardDot,
  };
}

function findAdjacentPlacedBlockInFront(scene) {
  let best = null;
  let bestGap = Number.POSITIVE_INFINITY;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const block of scene.placedBlocks ?? []) {
    if (!block?.active) continue;

    const metrics = getPickupMetrics(scene, block);
    if (!metrics) continue;
    if (metrics.bodyGap > PICKUP_BODY_GAP_MAX) continue;
    if (metrics.forwardDistance <= 0) continue;
    if (metrics.forwardDot < PICKUP_FORWARD_DOT_MIN) continue;
    if (metrics.lateralDistance > PICKUP_LATERAL_DISTANCE_MAX) continue;

    if (
      metrics.bodyGap < bestGap ||
      (metrics.bodyGap === bestGap && metrics.distance < bestDistance)
    ) {
      best = block;
      bestGap = metrics.bodyGap;
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

function confirmAdjacentPlacedBlock(scene, block) {
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
      reason: "ADJACENT_PLACED_BLOCK_IN_FRONT",
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

prototype._getFrontPlacementPoint = function getAdjacentFrontPlacementPoint() {
  if (!this.player) return originalGetFrontPlacementPoint?.call(this) ?? null;

  const direction = getInteractionDirection(this);
  const bounds = getBounds(this.player);
  const blockHalfWidth = 14;
  const blockHalfHeight = 11;

  if (Math.abs(direction.x) >= Math.abs(direction.y)) {
    return {
      x:
        direction.x < 0
          ? bounds.left - blockHalfWidth * PLACEMENT_TILE_DISTANCE
          : bounds.right + blockHalfWidth * PLACEMENT_TILE_DISTANCE,
      y: (bounds.top + bounds.bottom) / 2,
    };
  }

  return {
    x: (bounds.left + bounds.right) / 2,
    y:
      direction.y < 0
        ? bounds.top - blockHalfHeight * PLACEMENT_TILE_DISTANCE
        : bounds.bottom + blockHalfHeight * PLACEMENT_TILE_DISTANCE,
  };
};

prototype._updateTargetResource = function updateTargetWithAdjacentPlacementPriority() {
  const buildMaterial = getActiveBuildMaterial(this);
  if (!buildMaterial) {
    originalUpdateTargetResource.call(this);
    return;
  }

  const adjacentPlacedBlock = findAdjacentPlacedBlockInFront(this);
  if (adjacentPlacedBlock) {
    confirmAdjacentPlacedBlock(this, adjacentPlacedBlock);
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