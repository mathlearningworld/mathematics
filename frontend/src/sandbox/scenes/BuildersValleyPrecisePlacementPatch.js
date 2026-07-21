import Phaser from "phaser";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";
import { consumeResource } from "../domain/inventory.js";
import { createPlacedBlock, spawnPixelBurst } from "../art/pixelArtFactory.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalTryPlaceSelectedBlock = prototype._tryPlaceSelectedBlock;
const originalTryUseSelectedItem = prototype._tryUseSelectedItem;
const originalUpdate = prototype.update;

const FRONT_POINT_TOLERANCE = 3;
const OCCUPANCY_DISTANCE = TILE_SIZE * 0.7;
const MAX_PRECISE_PLACEMENT_DISTANCE = TILE_SIZE * 1.5;

function roundPoint(point) {
  if (!point) return null;
  return {
    x: Math.round(point.x),
    y: Math.round(point.y),
  };
}

function resolveCanonicalPlacementPoint(scene) {
  return roundPoint(scene._getFrontPlacementPoint?.());
}

function getDisplayedPlacementPoint(scene) {
  const prediction = scene.__placementPrediction;
  if (prediction?.kind !== "PLACE_BLOCK" || !prediction.worldPoint) return null;
  return roundPoint(prediction.worldPoint);
}

prototype._resolveCanonicalPlacementPoint = function resolvePlacementPoint() {
  return resolveCanonicalPlacementPoint(this);
};

function isFrontPlacementRequest(scene, worldX, worldY) {
  const canonicalPoint = scene._resolveCanonicalPlacementPoint?.();
  const displayedPoint = getDisplayedPlacementPoint(scene);
  return [canonicalPoint, displayedPoint].some(
    (point) => point && Math.hypot(worldX - point.x, worldY - point.y) <= FRONT_POINT_TOLERANCE,
  );
}

function isInsideStream(x, y) {
  return (
    x >= STREAM.left &&
    x <= STREAM.left + STREAM.width &&
    y >= STREAM.top &&
    y <= STREAM.top + STREAM.height
  );
}

function isOccupied(scene, x, y) {
  return [...(scene.resourceNodes ?? []), ...(scene.placedBlocks ?? [])].some(
    (object) =>
      object?.active && Phaser.Math.Distance.Between(x, y, object.x, object.y) < OCCUPANCY_DISTANCE,
  );
}

function placeAtCanonicalPoint(scene, point) {
  const selectedItem = scene.hotbarSlots?.[scene.selectedSlot]?.item;
  if (selectedItem?.kind !== "BLOCK" || !point) return;

  const { x, y } = roundPoint(point);
  const distance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, x, y);

  if (distance > MAX_PRECISE_PLACEMENT_DISTANCE) {
    scene._showStatus?.("วางได้เฉพาะพื้นที่ใกล้ตัว");
    return;
  }

  if (isInsideStream(x, y) || isOccupied(scene, x, y)) {
    scene._showStatus?.("พื้นที่นี้ยังวางไม่ได้");
    return;
  }

  const result = consumeResource(scene.inventory, selectedItem.resourceType);
  if (!result.consumed) {
    scene._showStatus?.("ยังไม่มีวัตถุดิบในช่องนี้");
    return;
  }

  scene.inventory = result.inventory;
  const block = createPlacedBlock(scene, x, y, selectedItem.resourceType);
  block.setData({
    assetId: selectedItem.resourceType === "wood" ? "BV_BLOCK_WOOD_01" : "BV_BLOCK_STONE_01",
    resourceType: selectedItem.resourceType,
    requiredTool: selectedItem.resourceType === "wood" ? "axe" : "pickaxe",
  });
  block.setInteractive({ useHandCursor: true });
  block.on("pointerdown", (pointer, localX, localY, event) => {
    event.stopPropagation();
    scene._tryCollectResource(block);
  });

  scene.physics.add.existing(block, true);
  block.body.setSize(28, 22);
  scene.obstacles.add(block);
  scene.placedBlocks.push(block);
  scene.resourceNodes.push(block);

  spawnPixelBurst(scene, x, y, selectedItem.resourceType);
  scene._recordEvent?.("block_placed", {
    resourceType: selectedItem.resourceType,
    tile: { column: Math.floor(x / TILE_SIZE), row: Math.floor(y / TILE_SIZE) },
    worldPoint: { x, y },
    inventoryCount: scene.inventory[selectedItem.resourceType],
  });
  scene._refreshInventoryHud?.();
  scene._showStatus?.("วางบล็อกแล้ว");
}

prototype._tryUseSelectedItem = function tryUseExactDisplayedPlacement() {
  const selectedItem = this.hotbarSlots?.[this.selectedSlot]?.item;
  if (selectedItem?.kind !== "BLOCK") {
    originalTryUseSelectedItem.call(this);
    return;
  }

  // The corner visible to the player is the placement authority for this action.
  // Reusing this frozen point prevents a moving player or a same-frame intent update
  // from recalculating a different spawn position after the preview was rendered.
  const displayedPoint = getDisplayedPlacementPoint(this);
  const point = displayedPoint ?? this._resolveCanonicalPlacementPoint?.();
  placeAtCanonicalPoint(this, point);
};

prototype._tryPlaceSelectedBlock = function tryPlaceWithCanonicalGeometry(worldX, worldY) {
  if (!isFrontPlacementRequest(this, worldX, worldY)) {
    originalTryPlaceSelectedBlock.call(this, worldX, worldY);
    return;
  }

  const displayedPoint = getDisplayedPlacementPoint(this);
  placeAtCanonicalPoint(this, displayedPoint ?? this._resolveCanonicalPlacementPoint?.());
};

prototype.update = function updateWithCanonicalPlacementFeedback(time, delta) {
  originalUpdate.call(this, time, delta);

  const prediction = this.__placementPrediction;
  if (prediction?.kind !== "PLACE_BLOCK" || !this.player) return;

  const point = this._resolveCanonicalPlacementPoint?.();
  if (!point) return;

  const { x, y } = point;
  const occupied = isOccupied(this, x, y);
  const insideStream = isInsideStream(x, y);
  const outOfRange =
    Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) >
    MAX_PRECISE_PLACEMENT_DISTANCE;

  prediction.worldPoint = point;
  prediction.tile = {
    column: Math.floor(x / TILE_SIZE),
    row: Math.floor(y / TILE_SIZE),
  };
  prediction.valid = !occupied && !insideStream && !outOfRange;
  prediction.reason = occupied
    ? "OCCUPIED"
    : insideStream
      ? "INSIDE_STREAM"
      : outOfRange
        ? "OUT_OF_RANGE"
        : "CANONICAL_PLACEMENT_SOCKET_AVAILABLE";
};