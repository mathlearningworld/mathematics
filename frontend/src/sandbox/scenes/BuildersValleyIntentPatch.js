import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalSelectHotbarSlot = prototype._selectHotbarSlot;
const originalTryCollectResource = prototype._tryCollectResource;
const originalTryPlaceSelectedBlock = prototype._tryPlaceSelectedBlock;
const originalUpdateTargetResource = prototype._updateTargetResource;

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

function snapshotIntent(scene) {
  const intent = scene.__gameplayIntent;
  return intent ? { ...intent } : null;
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

prototype.create = function createWithIntentRuntime() {
  originalCreate.call(this);

  this.__gameplayIntent = null;
  this.__placementIntentMaterial = null;
  this.__lastPlacedIntentTarget = null;

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getGameplayIntent = () => snapshotIntent(this);
    window.__BUILDERS_VALLEY__.cancelGameplayIntent = () =>
      cancelGameplayIntent(this, "DEBUG_CANCEL");
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

prototype._updateTargetResource = function updateTargetWithIntent() {
  const previousTarget = this.targetResource;

  this.__intentContextUpdating = true;
  try {
    originalUpdateTargetResource.call(this);
  } finally {
    this.__intentContextUpdating = false;
  }

  const currentTarget = this.targetResource;
  const targetChanged = currentTarget !== previousTarget;
  if (!targetChanged) return;

  const intendedMaterial =
    this.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL"
      ? this.__gameplayIntent.resourceType
      : this.__placementIntentMaterial;
  const materialSlot = findMaterialSlot(this, intendedMaterial);

  if (!currentTarget) {
    this.__lastPlacedIntentTarget = null;
    autoSelect(this, materialSlot);
    return;
  }

  const isJustPlacedIntentTarget = currentTarget === this.__lastPlacedIntentTarget;
  if (isJustPlacedIntentTarget && materialSlot >= 0) {
    const nextMaterial = this.hotbarSlots[materialSlot].item.resourceType;
    this.__placementIntentMaterial = nextMaterial;
    autoSelect(this, materialSlot);
  }
};
