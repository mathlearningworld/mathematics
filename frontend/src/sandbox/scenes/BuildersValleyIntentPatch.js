import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
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

function autoSelect(scene, index) {
  if (!Number.isInteger(index) || index < 0) return;
  scene.__intentAutoSelecting = true;
  try {
    originalSelectHotbarSlot.call(scene, index);
  } finally {
    scene.__intentAutoSelecting = false;
  }
}

prototype._selectHotbarSlot = function selectHotbarSlotWithIntent(index) {
  originalSelectHotbarSlot.call(this, index);

  if (!this.__intentAutoSelecting && !this.__intentCollecting) {
    this.__placementIntentMaterial = null;
    this.__lastPlacedIntentTarget = null;
  }
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

  this.__placementIntentMaterial = resourceType;
  this.__lastPlacedIntentTarget = null;

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

  const materialSlot = findMaterialSlot(this, resourceType);
  if (materialSlot >= 0) {
    const nextMaterial = this.hotbarSlots[materialSlot].item.resourceType;
    this.__placementIntentMaterial = nextMaterial;
    autoSelect(this, materialSlot);
    return;
  }

  this.__placementIntentMaterial = null;
};

prototype._updateTargetResource = function updateTargetWithIntent() {
  const previousTarget = this.targetResource;
  originalUpdateTargetResource.call(this);

  const currentTarget = this.targetResource;
  const targetChanged = currentTarget !== previousTarget;
  if (!targetChanged || !currentTarget) return;

  const materialSlot = findMaterialSlot(this, this.__placementIntentMaterial);
  const isJustPlacedIntentTarget = currentTarget === this.__lastPlacedIntentTarget;

  if (isJustPlacedIntentTarget && materialSlot >= 0) {
    const nextMaterial = this.hotbarSlots[materialSlot].item.resourceType;
    this.__placementIntentMaterial = nextMaterial;
    autoSelect(this, materialSlot);
    return;
  }

  this.__placementIntentMaterial = null;
  this.__lastPlacedIntentTarget = null;
};
