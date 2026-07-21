import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;

const VALID_STROKE = 0xffd65a;
const INVALID_STROKE = 0xe55b55;
const CORNER_HALF_WIDTH = 16;
const CORNER_HALF_HEIGHT = 13;
const CORNER_ARM = 7;

function snapshotFeedback(scene) {
  const prediction = scene.__placementPrediction;
  const ghost = scene.__placementGhost;

  return {
    visible: Boolean(ghost?.container?.visible),
    mode: prediction?.kind ?? "NONE",
    resourceType: prediction?.resourceType ?? null,
    valid: prediction?.valid ?? false,
    reason: prediction?.reason ?? null,
    worldPoint: prediction?.worldPoint ? { ...prediction.worldPoint } : null,
  };
}

function drawCornerIndicator(graphics, color, alpha) {
  graphics.clear();
  graphics.lineStyle(2, color, alpha);

  const left = -CORNER_HALF_WIDTH;
  const right = CORNER_HALF_WIDTH;
  const top = -CORNER_HALF_HEIGHT;
  const bottom = CORNER_HALF_HEIGHT;
  const arm = CORNER_ARM;

  graphics.lineBetween(left, top, left + arm, top);
  graphics.lineBetween(left, top, left, top + arm);
  graphics.lineBetween(right, top, right - arm, top);
  graphics.lineBetween(right, top, right, top + arm);
  graphics.lineBetween(left, bottom, left + arm, bottom);
  graphics.lineBetween(left, bottom, left, bottom - arm);
  graphics.lineBetween(right, bottom, right - arm, bottom);
  graphics.lineBetween(right, bottom, right, bottom - arm);
}

function createPlacementGhost(scene) {
  // Placement feedback is deliberately corner-only. The world remains fully
  // visible and the indicator communicates a target position without drawing a
  // second semi-opaque block over the final placement socket.
  const corners = scene.add.graphics();
  const container = scene.add.container(0, 0, [corners]);
  container.setVisible(false);

  return {
    container,
    corners,
    lastResourceType: null,
    lastValid: null,
  };
}

function renderPlacementFeedback(scene) {
  const ghost = scene.__placementGhost;
  const prediction = scene.__placementPrediction;
  if (!ghost) return;

  const shouldShow =
    prediction?.kind === "PLACE_BLOCK" &&
    prediction.worldPoint &&
    prediction.resourceType;

  if (!shouldShow) {
    ghost.container.setVisible(false);
    return;
  }

  const valid = Boolean(prediction.valid);

  ghost.container
    .setVisible(true)
    .setPosition(Math.round(prediction.worldPoint.x), Math.round(prediction.worldPoint.y))
    .setDepth(150 + Math.floor(prediction.worldPoint.y));

  drawCornerIndicator(
    ghost.corners,
    valid ? VALID_STROKE : INVALID_STROKE,
    valid ? 0.95 : 1,
  );

  ghost.lastResourceType = prediction.resourceType;
  ghost.lastValid = valid;
}

prototype.create = function createWithPredictiveFeedback() {
  originalCreate.call(this);
  this.__placementGhost = createPlacementGhost(this);

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getPredictiveFeedback = () => snapshotFeedback(this);
  }
};

prototype.update = function updateWithPredictiveFeedback(time, delta) {
  originalUpdate.call(this, time, delta);
  renderPlacementFeedback(this);
};
