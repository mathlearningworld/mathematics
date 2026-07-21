import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;

function findAvailableMaterialSlot(scene) {
  if (!Array.isArray(scene.hotbarSlots)) return -1;
  return scene.hotbarSlots.findIndex(
    ({ item }) =>
      item?.kind === "BLOCK" &&
      item.resourceType &&
      (scene.inventory?.[item.resourceType] ?? 0) > 0,
  );
}

function selectedItem(scene) {
  return scene.hotbarSlots?.[scene.selectedSlot]?.item ?? null;
}

function currentIntentMaterial(scene) {
  if (scene.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL") {
    return scene.__gameplayIntent.resourceType ?? null;
  }
  return scene.__placementIntentMaterial ?? null;
}

function selectMaterial(scene, slotIndex) {
  if (!Number.isInteger(slotIndex) || slotIndex < 0) return;

  const material = scene.hotbarSlots?.[slotIndex]?.item?.resourceType;
  if (!material) return;

  scene.__placementIntentMaterial = material;
  scene.__gameplayIntent = {
    kind: "BUILD_WITH_MATERIAL",
    resourceType: material,
    source: "AVAILABLE_MATERIAL_FALLBACK",
    state: "ACTIVE",
    placedCount:
      scene.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL" &&
      scene.__gameplayIntent.resourceType === material
        ? scene.__gameplayIntent.placedCount ?? 0
        : 0,
    updatedAt: Date.now(),
  };

  scene.__intentAutoSelecting = true;
  try {
    scene._selectHotbarSlot(slotIndex);
  } finally {
    scene.__intentAutoSelecting = false;
  }
}

prototype.update = function updateWithAvailableMaterialFallback(time, delta) {
  originalUpdate.call(this, time, delta);

  if (this.targetResource?.active) return;

  const selected = selectedItem(this);
  if (
    selected?.kind === "BLOCK" &&
    (this.inventory?.[selected.resourceType] ?? 0) > 0
  ) {
    return;
  }

  const intendedMaterial = currentIntentMaterial(this);
  if (intendedMaterial && (this.inventory?.[intendedMaterial] ?? 0) > 0) {
    const intendedSlot = this.hotbarSlots?.findIndex(
      ({ item }) => item?.kind === "BLOCK" && item.resourceType === intendedMaterial,
    );
    selectMaterial(this, intendedSlot);
    return;
  }

  const fallbackSlot = findAvailableMaterialSlot(this);
  if (fallbackSlot >= 0) {
    selectMaterial(this, fallbackSlot);
  }
};
