import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalSelectHotbarSlot = prototype._selectHotbarSlot;
const originalTryCollectResource = prototype._tryCollectResource;
const originalTryPlaceSelectedBlock = prototype._tryPlaceSelectedBlock;

const TARGET_MAX_DISTANCE = 90;
const TARGET_CONFIRM_DELAY_MS = 180;
const TARGET_RELEASE_DELAY_MS = 120;

function findMaterialSlot(scene, preferredResourceType = null) {
  if (!Array.isArray(scene.hotbarSlots)) return -1;

  if (preferredResourceType && scene.inventory?.[preferredResourceType] > 0) {
    const preferredIndex = scene.hotbarSlots.findIndex(
      ({ item }) => item?.kind === "BLOCK" && item.resourceType === preferredResourceType,
    );
    if (preferredIndex >= 0) return preferredIndex;
  }

  return scene.hotbarSlots.findIndex(
    ({ item }) => item?.kind === "BLOCK" && scene.inventory?.[item.resourceType] > 0,
  );
}

function findToolSlot(scene, toolId) {
  if (!toolId || !Array.isArray(scene.hotbarSlots)) return -1;
  return scene.hotbarSlots.findIndex(({ item }) => item?.id === toolId);
}

function snapshotIntent(scene) {
  const intent = scene.__gameplayIntent;
  return intent ? { ...intent } : null;
}

function snapshotTargetDecision(scene) {
  const decision = scene.__targetDecision;
  if (!decision) return null;

  return {
    confirmedTarget: describeTarget(decision.confirmedTarget),
    candidateTarget: describeTarget(decision.candidateTarget),
    candidateSince: decision.candidateSince,
    lastScores: decision.lastScores.map((entry) => ({ ...entry })),
  };
}

function describeTarget(target) {
  if (!target?.active) return null;
  return {
    resourceType: target.getData?.("resourceType") ?? null,
    assetId: target.getData?.("assetId") ?? null,
    x: Math.round(target.x),
    y: Math.round(target.y),
  };
}

function setBuildIntent(scene, resourceType, source) {
  if (!resourceType) return;

  const previous = scene.__gameplayIntent;
  scene.__gameplayIntent = {
    kind: "BUILD_WITH_MATERIAL",
    resourceType,
    source,
    state: "ACTIVE",
    placedCount:
      previous?.kind === "BUILD_WITH_MATERIAL" && previous.resourceType === resourceType
        ? previous.placedCount
        : 0,
    updatedAt: Date.now(),
  };
  scene.__placementIntentMaterial = resourceType;
  scene.__lastPlacedIntentTarget = null;
}

function cancelGameplayIntent(scene, reason) {
  if (!scene.__gameplayIntent && !scene.__placementIntentMaterial) return;

  scene.__gameplayIntent = null;
  scene.__placementIntentMaterial = null;
  scene.__lastPlacedIntentTarget = null;
  scene._recordEvent?.("gameplay_intent_cancelled", { reason });
}

function autoSelect(scene, index) {
  if (!Number.isInteger(index) || index < 0) return;
  scene.__intentAutoSelecting = true;
  try {
    originalSelectHotbarSlot.call(scene, index);
  } finally {
    scene.__intentAutoSelecting = false;
  }
}

function getIntendedMaterial(scene) {
  return scene.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL"
    ? scene.__gameplayIntent.resourceType
    : scene.__placementIntentMaterial;
}

function scoreTarget(scene, target) {
  const dx = target.x - scene.player.x;
  const dy = target.y - scene.player.y;
  const distance = Math.hypot(dx, dy);
  if (distance > TARGET_MAX_DISTANCE) return null;

  const directionLength = Math.hypot(dx, dy) || 1;
  const targetDirectionX = dx / directionLength;
  const targetDirectionY = dy / directionLength;
  const interactionDirection = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  const facingDot =
    targetDirectionX * interactionDirection.x + targetDirectionY * interactionDirection.y;

  const resourceType = target.getData?.("resourceType") ?? null;
  const assetId = target.getData?.("assetId") ?? "";
  const intendedMaterial = getIntendedMaterial(scene);

  const distanceScore = (1 - distance / TARGET_MAX_DISTANCE) * 60;
  const facingScore = Math.max(-1, Math.min(1, facingDot)) * 20;
  const intentScore = intendedMaterial && resourceType === intendedMaterial ? 28 : 0;
  const continuityScore = target === scene.targetResource ? 8 : 0;
  const placedObjectPenalty = assetId.startsWith("BV_BLOCK_") ? -8 : 0;
  const justPlacedPenalty = target === scene.__lastPlacedIntentTarget ? -120 : 0;

  return {
    target,
    score:
      distanceScore +
      facingScore +
      intentScore +
      continuityScore +
      placedObjectPenalty +
      justPlacedPenalty,
    distance,
    resourceType,
    components: {
      distance: distanceScore,
      facing: facingScore,
      intent: intentScore,
      continuity: continuityScore,
      objectPriority: placedObjectPenalty,
      justPlaced: justPlacedPenalty,
    },
  };
}

function chooseBestTarget(scene) {
  const scored = scene.resourceNodes
    .filter((node) => node?.active)
    .map((node) => scoreTarget(scene, node))
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.distance - b.distance);

  scene.__targetDecision.lastScores = scored.map(({ target, ...entry }) => ({
    ...entry,
    target: describeTarget(target),
  }));

  return scored[0]?.target ?? null;
}

function restoreIntentSelection(scene) {
  scene.__lastPlacedIntentTarget = null;
  autoSelect(scene, findMaterialSlot(scene, getIntendedMaterial(scene)));
}

function confirmTarget(scene, target) {
  const previousTarget = scene.targetResource;
  scene.targetResource = target;
  scene.__targetDecision.confirmedTarget = target;
  scene.__targetDecision.candidateTarget = null;
  scene.__targetDecision.candidateSince = 0;

  scene.targetIndicator
    .setVisible(Boolean(target))
    .setPosition(target?.x ?? 0, (target?.y ?? 0) - 12);

  if (target) {
    const toolSlot = findToolSlot(scene, target.getData?.("requiredTool"));
    autoSelect(scene, toolSlot);
  } else {
    restoreIntentSelection(scene);
  }

  if (previousTarget !== target) {
    scene._recordEvent?.("target_confirmed", {
      previous: describeTarget(previousTarget),
      current: describeTarget(target),
    });
  }
}

prototype.create = function createWithIntentRuntime() {
  originalCreate.call(this);

  this.__gameplayIntent = null;
  this.__placementIntentMaterial = null;
  this.__lastPlacedIntentTarget = null;
  this.__targetDecision = {
    confirmedTarget: null,
    candidateTarget: null,
    candidateSince: 0,
    lastScores: [],
  };

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getGameplayIntent = () => snapshotIntent(this);
    window.__BUILDERS_VALLEY__.cancelGameplayIntent = () =>
      cancelGameplayIntent(this, "DEBUG_CANCEL");
    window.__BUILDERS_VALLEY__.getTargetDecision = () => snapshotTargetDecision(this);
  }
};

prototype._selectHotbarSlot = function selectHotbarSlotWithIntent(index) {
  originalSelectHotbarSlot.call(this, index);

  if (
    this.__intentAutoSelecting ||
    this.__intentCollecting ||
    this.__intentContextUpdating
  ) {
    return;
  }

  const selectedItem = this.hotbarSlots?.[index]?.item;
  if (selectedItem?.kind === "BLOCK" && this.inventory?.[selectedItem.resourceType] > 0) {
    setBuildIntent(this, selectedItem.resourceType, "MANUAL_BLOCK_SELECTION");
    this._recordEvent?.("gameplay_intent_started", {
      kind: "BUILD_WITH_MATERIAL",
      resourceType: selectedItem.resourceType,
      source: "MANUAL_BLOCK_SELECTION",
    });
    return;
  }

  cancelGameplayIntent(this, "MANUAL_NON_BLOCK_SELECTION");
};

prototype._tryCollectResource = function collectResourceWithIntent(resource = this.targetResource) {
  const resourceType = resource?.getData?.("resourceType") ?? null;
  const beforeCount = resourceType ? this.inventory?.[resourceType] ?? 0 : 0;

  this.__intentCollecting = true;
  try {
    originalTryCollectResource.call(this, resource);
  } finally {
    this.__intentCollecting = false;
  }

  const afterCount = resourceType ? this.inventory?.[resourceType] ?? 0 : 0;
  if (!resourceType || afterCount <= beforeCount) return;

  setBuildIntent(this, resourceType, "RESOURCE_COLLECTED");
  this._recordEvent?.("gameplay_intent_started", {
    kind: "BUILD_WITH_MATERIAL",
    resourceType,
    source: "RESOURCE_COLLECTED",
  });

  const materialSlot = findMaterialSlot(this, resourceType);
  autoSelect(this, materialSlot);
};

prototype._tryPlaceSelectedBlock = function placeBlockWithIntent(worldX, worldY) {
  const selectedItem = this.hotbarSlots?.[this.selectedSlot]?.item;
  const resourceType = selectedItem?.kind === "BLOCK" ? selectedItem.resourceType : null;
  const beforePlacedCount = this.placedBlocks?.length ?? 0;

  originalTryPlaceSelectedBlock.call(this, worldX, worldY);

  const afterPlacedCount = this.placedBlocks?.length ?? 0;
  if (!resourceType || afterPlacedCount <= beforePlacedCount) return;

  this.__lastPlacedIntentTarget = this.placedBlocks[afterPlacedCount - 1] ?? null;

  if (
    this.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL" &&
    this.__gameplayIntent.resourceType === resourceType
  ) {
    this.__gameplayIntent = {
      ...this.__gameplayIntent,
      placedCount: this.__gameplayIntent.placedCount + 1,
      updatedAt: Date.now(),
    };
  } else {
    setBuildIntent(this, resourceType, "BLOCK_PLACED");
    this.__gameplayIntent.placedCount = 1;
  }

  const materialSlot = findMaterialSlot(this, resourceType);
  if (materialSlot >= 0) {
    const nextMaterial = this.hotbarSlots[materialSlot].item.resourceType;
    this.__placementIntentMaterial = nextMaterial;
    autoSelect(this, materialSlot);
    return;
  }

  this.__placementIntentMaterial = resourceType;
};

prototype._updateTargetResource = function updateTargetWithScoringAndQueue() {
  if (!this.__targetDecision || !this.player || !this.targetIndicator) return;

  const now = this.time?.now ?? performance.now();
  const desiredTarget = chooseBestTarget(this);
  const currentTarget = this.targetResource?.active ? this.targetResource : null;

  if (desiredTarget === currentTarget) {
    this.__targetDecision.confirmedTarget = currentTarget;
    this.__targetDecision.candidateTarget = null;
    this.__targetDecision.candidateSince = 0;
    this.targetIndicator
      .setVisible(Boolean(currentTarget))
      .setPosition(currentTarget?.x ?? 0, (currentTarget?.y ?? 0) - 12);
    return;
  }

  if (this.__targetDecision.candidateTarget !== desiredTarget) {
    this.__targetDecision.candidateTarget = desiredTarget;
    this.__targetDecision.candidateSince = now;
    return;
  }

  const delay = desiredTarget ? TARGET_CONFIRM_DELAY_MS : TARGET_RELEASE_DELAY_MS;
  if (now - this.__targetDecision.candidateSince < delay) return;

  this.__intentContextUpdating = true;
  try {
    confirmTarget(this, desiredTarget);
  } finally {
    this.__intentContextUpdating = false;
  }
};

const predictionOriginalCreate = prototype.create;
const predictionOriginalUpdate = prototype.update;
const predictionOriginalTryPlaceSelectedBlock = prototype._tryPlaceSelectedBlock;

function snapshotPlacementPrediction(scene) {
  const prediction = scene.__placementPrediction;
  if (!prediction) return null;
  return {
    ...prediction,
    tile: prediction.tile ? { ...prediction.tile } : null,
    worldPoint: prediction.worldPoint ? { ...prediction.worldPoint } : null,
  };
}

function getPlacementMaterial(scene) {
  const selectedItem = scene.hotbarSlots?.[scene.selectedSlot]?.item;
  if (selectedItem?.kind === "BLOCK" && scene.inventory?.[selectedItem.resourceType] > 0) {
    return selectedItem.resourceType;
  }

  const intendedMaterial = getIntendedMaterial(scene);
  return intendedMaterial && scene.inventory?.[intendedMaterial] > 0 ? intendedMaterial : null;
}

function predictNextAction(scene) {
  const confirmedTarget = scene.targetResource?.active ? scene.targetResource : null;
  if (confirmedTarget) {
    return {
      kind: "COLLECT_TARGET",
      confidence: "HIGH",
      resourceType: confirmedTarget.getData?.("resourceType") ?? null,
      target: describeTarget(confirmedTarget),
      worldPoint: { x: Math.round(confirmedTarget.x), y: Math.round(confirmedTarget.y) },
      tile: null,
      valid: true,
      reason: "CONFIRMED_CONTEXT_TARGET",
      updatedAt: Date.now(),
    };
  }

  const resourceType = getPlacementMaterial(scene);
  if (!resourceType || !scene.player) {
    return {
      kind: "NONE",
      confidence: "NONE",
      resourceType: null,
      target: null,
      worldPoint: null,
      tile: null,
      valid: false,
      reason: resourceType ? "PLAYER_NOT_READY" : "NO_PLACEABLE_MATERIAL",
      updatedAt: Date.now(),
    };
  }

  const rawPoint = scene._getFrontPlacementPoint?.();
  if (!rawPoint) {
    return {
      kind: "NONE",
      confidence: "NONE",
      resourceType,
      target: null,
      worldPoint: null,
      tile: null,
      valid: false,
      reason: "NO_FRONT_PLACEMENT_POINT",
      updatedAt: Date.now(),
    };
  }

  const direction = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  const inferredTileSize =
    Math.max(
      Math.abs(rawPoint.x - scene.player.x),
      Math.abs(rawPoint.y - scene.player.y),
    ) || 32;
  const tileX = Math.floor(rawPoint.x / inferredTileSize) * inferredTileSize + inferredTileSize / 2;
  const tileY = Math.floor(rawPoint.y / inferredTileSize) * inferredTileSize + inferredTileSize / 2;
  const occupied = [...(scene.resourceNodes ?? []), ...(scene.placedBlocks ?? [])].some(
    (object) =>
      object?.active &&
      Math.hypot(tileX - object.x, tileY - object.y) < inferredTileSize * 0.7,
  );
  const distance = Math.hypot(tileX - scene.player.x, tileY - scene.player.y);
  const valid = !occupied && distance <= 100;

  return {
    kind: "PLACE_BLOCK",
    confidence: scene.__gameplayIntent ? "HIGH" : "MEDIUM",
    resourceType,
    target: null,
    worldPoint: { x: Math.round(tileX), y: Math.round(tileY) },
    tile: {
      column: Math.floor(tileX / inferredTileSize),
      row: Math.floor(tileY / inferredTileSize),
    },
    direction: { ...direction },
    valid,
    reason: occupied ? "OCCUPIED" : distance > 100 ? "OUT_OF_RANGE" : "FRONT_TILE_AVAILABLE",
    updatedAt: Date.now(),
  };
}

function predictionKey(prediction) {
  return JSON.stringify({
    kind: prediction?.kind ?? "NONE",
    resourceType: prediction?.resourceType ?? null,
    target: prediction?.target?.assetId ?? null,
    x: prediction?.worldPoint?.x ?? null,
    y: prediction?.worldPoint?.y ?? null,
    valid: prediction?.valid ?? false,
    reason: prediction?.reason ?? null,
  });
}

prototype.create = function createWithPredictionRuntime() {
  predictionOriginalCreate.call(this);
  this.__placementPrediction = predictNextAction(this);
  this.__placementPredictionKey = predictionKey(this.__placementPrediction);

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getPlacementPrediction = () =>
      snapshotPlacementPrediction(this);
  }
};

prototype.update = function updateWithPredictionRuntime(time, delta) {
  predictionOriginalUpdate.call(this, time, delta);

  const nextPrediction = predictNextAction(this);
  const nextKey = predictionKey(nextPrediction);
  if (nextKey !== this.__placementPredictionKey) {
    this.__placementPrediction = nextPrediction;
    this.__placementPredictionKey = nextKey;
  }
};

prototype._tryPlaceSelectedBlock = function placeBlockWithPrediction(worldX, worldY) {
  predictionOriginalTryPlaceSelectedBlock.call(this, worldX, worldY);
  this.__placementPrediction = predictNextAction(this);
  this.__placementPredictionKey = predictionKey(this.__placementPrediction);
};
