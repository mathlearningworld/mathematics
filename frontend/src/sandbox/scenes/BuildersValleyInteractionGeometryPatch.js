import { STREAM, TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;

const PLACEMENT_TILE_DISTANCE = 1;
const MAX_PLACEMENT_DISTANCE = TILE_SIZE * 1.5;
const OCCUPANCY_DISTANCE = TILE_SIZE * 0.7;

function normalizeDirection(scene) {
  const direction = scene.lastInteractionDirection ?? { x: 1, y: 0 };
  const length = Math.hypot(direction.x, direction.y) || 1;
  return {
    x: direction.x / length,
    y: direction.y / length,
  };
}

function cardinalDirection(scene) {
  const direction = normalizeDirection(scene);
  if (Math.abs(direction.x) >= Math.abs(direction.y)) {
    return { x: direction.x >= 0 ? 1 : -1, y: 0 };
  }
  return { x: 0, y: direction.y >= 0 ? 1 : -1 };
}

function snapToTile(value) {
  return Math.floor(value / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
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

function getPlacementMaterial(scene) {
  const selectedItem = scene.hotbarSlots?.[scene.selectedSlot]?.item;
  if (selectedItem?.kind === "BLOCK" && (scene.inventory?.[selectedItem.resourceType] ?? 0) > 0) {
    return selectedItem.resourceType;
  }

  const intentMaterial =
    scene.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL"
      ? scene.__gameplayIntent.resourceType
      : scene.__placementIntentMaterial;

  return intentMaterial && (scene.inventory?.[intentMaterial] ?? 0) > 0
    ? intentMaterial
    : null;
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

function buildUnifiedPrediction(scene) {
  const confirmedTarget = scene.targetResource?.active ? scene.targetResource : null;
  if (confirmedTarget) {
    return {
      kind: "COLLECT_TARGET",
      confidence: "HIGH",
      resourceType: confirmedTarget.getData?.("resourceType") ?? null,
      target: describeTarget(confirmedTarget),
      worldPoint: {
        x: Math.round(confirmedTarget.x),
        y: Math.round(confirmedTarget.y),
      },
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

  // Anchor placement to the player's current tile, then move exactly one tile
  // in the facing direction. This prevents downward placement from jumping
  // between one and two tiles as the player moves inside the same tile.
  const direction = cardinalDirection(scene);
  const playerTileX = snapToTile(scene.player.x);
  const playerTileY = snapToTile(scene.player.y);
  const tileX = playerTileX + direction.x * TILE_SIZE * PLACEMENT_TILE_DISTANCE;
  const tileY = playerTileY + direction.y * TILE_SIZE * PLACEMENT_TILE_DISTANCE;

  const occupied = [...(scene.resourceNodes ?? []), ...(scene.placedBlocks ?? [])].some(
    (object) =>
      object?.active && Math.hypot(tileX - object.x, tileY - object.y) < OCCUPANCY_DISTANCE,
  );
  const insideStream =
    tileX >= STREAM.left &&
    tileX <= STREAM.left + STREAM.width &&
    tileY >= STREAM.top &&
    tileY <= STREAM.top + STREAM.height;
  const distance = Math.hypot(tileX - playerTileX, tileY - playerTileY);
  const outOfRange = distance > MAX_PLACEMENT_DISTANCE;
  const valid = !occupied && !insideStream && !outOfRange;

  return {
    kind: "PLACE_BLOCK",
    confidence: scene.__gameplayIntent ? "HIGH" : "MEDIUM",
    resourceType,
    target: null,
    worldPoint: { x: Math.round(tileX), y: Math.round(tileY) },
    tile: {
      column: Math.floor(tileX / TILE_SIZE),
      row: Math.floor(tileY / TILE_SIZE),
    },
    direction: { ...direction },
    valid,
    reason: occupied
      ? "OCCUPIED"
      : insideStream
        ? "INSIDE_STREAM"
        : outOfRange
          ? "OUT_OF_RANGE"
          : "FRONT_TILE_AVAILABLE",
    updatedAt: Date.now(),
  };
}

function synchronizePrediction(scene) {
  const prediction = buildUnifiedPrediction(scene);
  scene.__placementPrediction = prediction;
  scene.__placementPredictionKey = predictionKey(prediction);
}

prototype.create = function createWithUnifiedInteractionGeometry() {
  originalCreate.call(this);
  synchronizePrediction(this);
};

prototype.update = function updateWithUnifiedInteractionGeometry(time, delta) {
  originalUpdate.call(this, time, delta);
  synchronizePrediction(this);
};
