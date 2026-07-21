import Phaser from "phaser";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalUpdate = prototype.update;
const originalTryUseSelectedItem = prototype._tryUseSelectedItem;
const originalTryPlaceSelectedBlock = prototype._tryPlaceSelectedBlock;

const OCCUPANCY_DISTANCE = TILE_SIZE * 0.7;
const MAX_PLACEMENT_DISTANCE = TILE_SIZE * 1.5;
const VALID_STROKE = 0xffd65a;
const INVALID_STROKE = 0xe55b55;
const CORNER_HALF_WIDTH = 16;
const CORNER_HALF_HEIGHT = 13;
const CORNER_ARM = 7;

function cardinalDirection(scene) {
  const direction = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  if (Math.abs(direction.x) >= Math.abs(direction.y)) {
    return { x: direction.x >= 0 ? 1 : -1, y: 0 };
  }
  return { x: 0, y: direction.y >= 0 ? 1 : -1 };
}

function worldToCell(value) {
  return Math.floor(value / TILE_SIZE);
}

function cellToWorld(cell) {
  return cell * TILE_SIZE + TILE_SIZE / 2;
}

function getPlacementMaterial(scene) {
  const selectedItem = scene.hotbarSlots?.[scene.selectedSlot]?.item;
  if (
    selectedItem?.kind === "BLOCK" &&
    (scene.inventory?.[selectedItem.resourceType] ?? 0) > 0
  ) {
    return selectedItem.resourceType;
  }
  return null;
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
      object?.active &&
      Phaser.Math.Distance.Between(x, y, object.x, object.y) < OCCUPANCY_DISTANCE,
  );
}

function resolvePlacementResult(scene) {
  const resourceType = getPlacementMaterial(scene);
  if (!scene.player || !resourceType || scene.targetResource?.active) {
    return Object.freeze({
      kind: "NONE",
      resourceType: null,
      direction: null,
      cell: null,
      worldPoint: null,
      valid: false,
      reason: scene.targetResource?.active ? "COLLECT_TARGET_ACTIVE" : "NO_PLACEABLE_MATERIAL",
    });
  }

  const direction = cardinalDirection(scene);

  // Grid authority: placement is always the single cardinal cell adjacent to the
  // player's current ground cell. No continuous pixel snap, nearest-socket search,
  // hysteresis, or visual-only offset participates in the placement decision.
  const playerCell = {
    column: worldToCell(scene.player.x),
    row: worldToCell(scene.player.y),
  };
  const targetCell = {
    column: playerCell.column + direction.x,
    row: playerCell.row + direction.y,
  };
  const worldPoint = {
    x: cellToWorld(targetCell.column),
    y: cellToWorld(targetCell.row),
  };

  const occupied = isOccupied(scene, worldPoint.x, worldPoint.y);
  const insideStream = isInsideStream(worldPoint.x, worldPoint.y);
  const outOfRange =
    Phaser.Math.Distance.Between(
      scene.player.x,
      scene.player.y,
      worldPoint.x,
      worldPoint.y,
    ) > MAX_PLACEMENT_DISTANCE;
  const valid = !occupied && !insideStream && !outOfRange;

  return Object.freeze({
    kind: "PLACE_BLOCK",
    resourceType,
    direction: Object.freeze({ ...direction }),
    cell: Object.freeze({ ...targetCell }),
    worldPoint: Object.freeze({ ...worldPoint }),
    valid,
    reason: occupied
      ? "OCCUPIED"
      : insideStream
        ? "INSIDE_STREAM"
        : outOfRange
          ? "OUT_OF_RANGE"
          : "ADJACENT_GRID_CELL_AVAILABLE",
  });
}

function drawCornerIndicator(graphics, valid) {
  if (!graphics) return;
  graphics.clear();
  graphics.lineStyle(2, valid ? VALID_STROKE : INVALID_STROKE, valid ? 0.95 : 1);

  const left = -CORNER_HALF_WIDTH;
  const right = CORNER_HALF_WIDTH;
  const top = -CORNER_HALF_HEIGHT;
  const bottom = CORNER_HALF_HEIGHT;

  graphics.lineBetween(left, top, left + CORNER_ARM, top);
  graphics.lineBetween(left, top, left, top + CORNER_ARM);
  graphics.lineBetween(right, top, right - CORNER_ARM, top);
  graphics.lineBetween(right, top, right, top + CORNER_ARM);
  graphics.lineBetween(left, bottom, left + CORNER_ARM, bottom);
  graphics.lineBetween(left, bottom, left, bottom - CORNER_ARM);
  graphics.lineBetween(right, bottom, right - CORNER_ARM, bottom);
  graphics.lineBetween(right, bottom, right, bottom - CORNER_ARM);
}

function publishPlacementResult(scene, result) {
  scene.__placementResult = result;

  if (result.kind === "PLACE_BLOCK") {
    scene.__placementPrediction = {
      kind: "PLACE_BLOCK",
      confidence: "HIGH",
      resourceType: result.resourceType,
      target: null,
      worldPoint: { ...result.worldPoint },
      tile: {
        column: result.cell.column,
        row: result.cell.row,
      },
      direction: { ...result.direction },
      valid: result.valid,
      reason: result.reason,
      updatedAt: Date.now(),
    };
  }

  const ghost = scene.__placementGhost;
  if (!ghost?.container) return;

  if (result.kind !== "PLACE_BLOCK") {
    ghost.container.setVisible(false);
    return;
  }

  ghost.container
    .setVisible(true)
    .setPosition(result.worldPoint.x, result.worldPoint.y)
    .setDepth(150 + result.worldPoint.y);
  drawCornerIndicator(ghost.corners, result.valid);
}

prototype._resolvePlacementResult = function resolveAuthoritativePlacementResult() {
  return resolvePlacementResult(this);
};

prototype._resolveCanonicalPlacementPoint = function resolveAuthoritativePlacementPoint() {
  return this._resolvePlacementResult()?.worldPoint ?? null;
};

prototype._getFrontPlacementPoint = function getAuthoritativeFrontPlacementPoint() {
  return this._resolvePlacementResult()?.worldPoint ?? null;
};

prototype._tryUseSelectedItem = function useAuthoritativePlacementResult() {
  const selectedItem = this.hotbarSlots?.[this.selectedSlot]?.item;
  if (selectedItem?.kind !== "BLOCK") {
    originalTryUseSelectedItem.call(this);
    return;
  }

  const result = this._resolvePlacementResult();
  publishPlacementResult(this, result);
  if (result.kind !== "PLACE_BLOCK") return;

  originalTryPlaceSelectedBlock.call(
    this,
    result.worldPoint.x,
    result.worldPoint.y,
  );
};

prototype._tryPlaceSelectedBlock = function placeOnlyAtAuthoritativeResult() {
  const selectedItem = this.hotbarSlots?.[this.selectedSlot]?.item;
  if (selectedItem?.kind !== "BLOCK") return;

  const result = this._resolvePlacementResult();
  publishPlacementResult(this, result);
  if (result.kind !== "PLACE_BLOCK") return;

  originalTryPlaceSelectedBlock.call(
    this,
    result.worldPoint.x,
    result.worldPoint.y,
  );
};

prototype.update = function updateWithAuthoritativePlacementRuntime(time, delta) {
  originalUpdate.call(this, time, delta);

  // This patch is loaded last and therefore publishes and renders the final frame
  // authority after every legacy patch has run. Preview and placement both consume
  // the same immutable PlacementResult object.
  publishPlacementResult(this, this._resolvePlacementResult());
};
