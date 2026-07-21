import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

const FRONT_TILE_MATCH_DISTANCE = TILE_SIZE * 0.72;
const ADJACENT_BODY_GAP_MAX = 4;

function getBodyBounds(gameObject) {
  const body = gameObject?.body;
  if (body) {
    const left = Number.isFinite(body.left) ? body.left : body.x;
    const top = Number.isFinite(body.top) ? body.top : body.y;
    const right = Number.isFinite(body.right) ? body.right : body.x + body.width;
    const bottom = Number.isFinite(body.bottom) ? body.bottom : body.y + body.height;
    if ([left, top, right, bottom].every(Number.isFinite)) {
      return { left, top, right, bottom };
    }
  }

  const width = gameObject?.displayWidth ?? gameObject?.width ?? 0;
  const height = gameObject?.displayHeight ?? gameObject?.height ?? 0;
  const x = gameObject?.x ?? 0;
  const y = gameObject?.y ?? 0;
  return {
    left: x - width / 2,
    top: y - height / 2,
    right: x + width / 2,
    bottom: y + height / 2,
  };
}

function bodyGap(leftObject, rightObject) {
  const left = getBodyBounds(leftObject);
  const right = getBodyBounds(rightObject);
  const gapX = Math.max(0, left.left - right.right, right.left - left.right);
  const gapY = Math.max(0, left.top - right.bottom, right.top - left.bottom);
  return Math.hypot(gapX, gapY);
}

function snapToTile(point) {
  if (!point) return null;
  return {
    x: Math.floor(point.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
    y: Math.floor(point.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2,
  };
}

function findAdjacentObjectOccupyingPlacement(scene) {
  if (!scene.player) return null;
  const placementTile = snapToTile(scene._getFrontPlacementPoint?.());
  if (!placementTile) return null;

  let best = null;
  let bestTileDistance = FRONT_TILE_MATCH_DISTANCE;
  let bestBodyGap = Number.POSITIVE_INFINITY;

  for (const node of scene.resourceNodes ?? []) {
    if (!node?.active) continue;

    const tileDistance = Math.hypot(node.x - placementTile.x, node.y - placementTile.y);
    if (tileDistance > FRONT_TILE_MATCH_DISTANCE) continue;

    const gap = bodyGap(scene.player, node);
    if (gap > ADJACENT_BODY_GAP_MAX) continue;

    if (tileDistance < bestTileDistance || (tileDistance === bestTileDistance && gap < bestBodyGap)) {
      best = node;
      bestTileDistance = tileDistance;
      bestBodyGap = gap;
    }
  }

  return best;
}

function selectRequiredTool(scene, target) {
  const requiredTool = target?.getData?.("requiredTool");
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

function confirmPickupTarget(scene, target) {
  const previousTarget = scene.targetResource;
  scene.targetResource = target;

  if (scene.__targetDecision) {
    scene.__targetDecision.confirmedTarget = target;
    scene.__targetDecision.candidateTarget = null;
    scene.__targetDecision.candidateSince = 0;
  }

  scene.targetIndicator?.setVisible(true).setPosition(target.x, target.y - 12);
  selectRequiredTool(scene, target);

  if (previousTarget !== target) {
    scene._recordEvent?.("target_confirmed", {
      previous: previousTarget?.getData?.("assetId") ?? null,
      current: target.getData?.("assetId") ?? null,
      reason: "ADJACENT_OBJECT_OCCUPIES_PLACEMENT_TILE",
    });
  }
}

prototype._updateTargetResource = function updateOccupiedPlacementAsPickup() {
  originalUpdateTargetResource.call(this);

  if (this.targetResource?.active) return;

  const occupiedAdjacentTarget = findAdjacentObjectOccupyingPlacement(this);
  if (!occupiedAdjacentTarget) return;

  confirmPickupTarget(this, occupiedAdjacentTarget);
};
