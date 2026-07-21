import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdateTargetResource = prototype._updateTargetResource;

const ACQUIRE_BODY_GAP_MAX = 4;
const RELEASE_BODY_GAP_MAX = 9;
const SWITCH_CONFIRM_MS = 120;
const RELEASE_GRACE_MS = 140;
const FACING_WEIGHT = TILE_SIZE * 0.2;

function getBounds(gameObject) {
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
  return {
    left: (gameObject?.x ?? 0) - width / 2,
    top: (gameObject?.y ?? 0) - height / 2,
    right: (gameObject?.x ?? 0) + width / 2,
    bottom: (gameObject?.y ?? 0) + height / 2,
  };
}

function bodyGap(leftObject, rightObject) {
  const left = getBounds(leftObject);
  const right = getBounds(rightObject);
  const gapX = Math.max(0, left.left - right.right, right.left - left.right);
  const gapY = Math.max(0, left.top - right.bottom, right.top - left.bottom);
  return Math.hypot(gapX, gapY);
}

function facingAlignment(scene, target) {
  if (!scene.player || !target) return -1;
  const dx = target.x - scene.player.x;
  const dy = target.y - scene.player.y;
  const length = Math.hypot(dx, dy) || 1;
  const direction = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  const directionLength = Math.hypot(direction.x, direction.y) || 1;
  return (dx / length) * (direction.x / directionLength) +
    (dy / length) * (direction.y / directionLength);
}

function allCollectibleNodes(scene) {
  const nodes = [...(scene.resourceNodes ?? []), ...(scene.placedBlocks ?? [])];
  return [...new Set(nodes)].filter((node) => node?.active && node.getData?.("requiredTool"));
}

function chooseAdjacentTarget(scene) {
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const node of allCollectibleNodes(scene)) {
    const gap = bodyGap(scene.player, node);
    if (gap > ACQUIRE_BODY_GAP_MAX) continue;

    // Body gap is authoritative. Facing only resolves ties between truly adjacent objects.
    const score = gap - Math.max(-1, facingAlignment(scene, node)) * FACING_WEIGHT;
    if (score < bestScore) {
      best = node;
      bestScore = score;
    }
  }

  return best;
}

function isPlacedBlock(scene, target) {
  if (!target) return false;
  if (scene.placedBlocks?.includes(target)) return true;
  return (target.getData?.("assetId") ?? "").startsWith("BV_BLOCK_");
}

function targetIndicatorPoint(scene, target) {
  // Placed blocks are centered on their world point. Natural resource artwork uses
  // a bottom-center anchor, so it keeps the historical upward visual correction.
  return {
    x: target.x,
    y: isPlacedBlock(scene, target) ? target.y : target.y - 12,
  };
}

function selectRequiredTool(scene, target) {
  const requiredTool = target?.getData?.("requiredTool");
  const slotIndex = scene.hotbarSlots?.findIndex(({ item }) => item?.id === requiredTool);
  if (!Number.isInteger(slotIndex) || slotIndex < 0) return;

  scene.__intentAutoSelecting = true;
  try {
    scene._selectHotbarSlot(slotIndex);
  } finally {
    scene.__intentAutoSelecting = false;
  }
}

function applyTarget(scene, target, reason) {
  const previous = scene.targetResource;
  scene.targetResource = target;
  if (scene.__targetDecision) {
    scene.__targetDecision.confirmedTarget = target;
    scene.__targetDecision.candidateTarget = null;
    scene.__targetDecision.candidateSince = 0;
  }
  const indicatorPoint = targetIndicatorPoint(scene, target);
  scene.targetIndicator?.setVisible(true).setPosition(indicatorPoint.x, indicatorPoint.y);
  selectRequiredTool(scene, target);

  if (previous !== target) {
    scene._recordEvent?.("target_confirmed", {
      previous: previous?.getData?.("assetId") ?? null,
      current: target.getData?.("assetId") ?? null,
      reason,
    });
  }
}

prototype._updateTargetResource = function updateWithStablePickupFocus() {
  const now = this.time?.now ?? performance.now();
  const previous = this.__stablePickupFocus?.target?.active
    ? this.__stablePickupFocus.target
    : null;

  originalUpdateTargetResource.call(this);

  const desired = chooseAdjacentTarget(this);
  const state = this.__stablePickupFocus ?? {
    target: null,
    candidate: null,
    candidateSince: 0,
    outOfRangeSince: 0,
  };

  if (desired) {
    state.outOfRangeSince = 0;

    if (desired === state.target) {
      state.candidate = null;
      state.candidateSince = 0;
      applyTarget(this, desired, "STABLE_ADJACENT_PICKUP_FOCUS");
    } else if (!state.target) {
      state.target = desired;
      state.candidate = null;
      state.candidateSince = 0;
      applyTarget(this, desired, "ADJACENT_PICKUP_FOCUS_ACQUIRED");
    } else {
      if (state.candidate !== desired) {
        state.candidate = desired;
        state.candidateSince = now;
      }

      if (now - state.candidateSince >= SWITCH_CONFIRM_MS) {
        state.target = desired;
        state.candidate = null;
        state.candidateSince = 0;
        applyTarget(this, desired, "ADJACENT_PICKUP_FOCUS_SWITCHED");
      } else if (state.target?.active && bodyGap(this.player, state.target) <= RELEASE_BODY_GAP_MAX) {
        applyTarget(this, state.target, "ADJACENT_PICKUP_FOCUS_HELD");
      }
    }
  } else if (previous && bodyGap(this.player, previous) <= RELEASE_BODY_GAP_MAX) {
    if (!state.outOfRangeSince) state.outOfRangeSince = now;
    if (now - state.outOfRangeSince < RELEASE_GRACE_MS) {
      state.target = previous;
      applyTarget(this, previous, "ADJACENT_PICKUP_RELEASE_GRACE");
    } else {
      state.target = null;
      state.candidate = null;
      state.candidateSince = 0;
    }
  } else {
    state.target = null;
    state.candidate = null;
    state.candidateSince = 0;
    state.outOfRangeSince = 0;
  }

  this.__stablePickupFocus = state;
};