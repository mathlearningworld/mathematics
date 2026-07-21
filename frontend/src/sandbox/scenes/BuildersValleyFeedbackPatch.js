import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;

const GHOST_FILL = Object.freeze({
  wood: 0x865437,
  stone: 0x66727a,
});

const GHOST_LIGHT = Object.freeze({
  wood: 0xb87945,
  stone: 0x96a1a5,
});

const OUTLINE = 0x202e32;
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
  // The preview mirrors createPlacedBlock's local anchor, but remains visually
  // lightweight: a translucent silhouette plus the same four-corner language
  // used by pickup focus. No filled panel or full rectangular border is drawn.
  const front = scene.add.rectangle(0, 1, 28, 22, OUTLINE, 0.16);
  const face = scene.add.rectangle(0, -1, 24, 17, GHOST_FILL.wood, 0.2);
  const top = scene.add.rectangle(0, -10, 24, 6, GHOST_LIGHT.wood, 0.26);
  const seam = scene.add.rectangle(6, -1, 3, 15, OUTLINE, 0.1);
  const corners = scene.add.graphics();

  const container = scene.add.container(0, 0, [front, face, top, seam, corners]);
  container.setVisible(false);

  return {
    container,
    front,
    face,
    top,
    seam,
    corners,
    lastResourceType: null,
    lastValid: null,
  };
}

function renderPlacementFeedback(scene, time) {
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
  const resourceType = prediction.resourceType;
  const fill = GHOST_FILL[resourceType] ?? GHOST_FILL.wood;
  const light = GHOST_LIGHT[resourceType] ?? GHOST_LIGHT.wood;
  const pulse = 0.18 + Math.sin((time ?? 0) / 220) * 0.025;

  ghost.container
    .setVisible(true)
    .setPosition(Math.round(prediction.worldPoint.x), Math.round(prediction.worldPoint.y))
    .setDepth(150 + Math.floor(prediction.worldPoint.y));

  ghost.front.setFillStyle(OUTLINE, valid ? 0.14 : 0.08);
  ghost.face.setFillStyle(fill, valid ? pulse : 0.1);
  ghost.top.setFillStyle(light, valid ? Math.min(0.28, pulse + 0.08) : 0.12);
  ghost.seam
    .setPosition(resourceType === "wood" ? 6 : -6, -1)
    .setFillStyle(OUTLINE, valid ? 0.1 : 0.06);

  drawCornerIndicator(
    ghost.corners,
    valid ? VALID_STROKE : INVALID_STROKE,
    valid ? 0.95 : 1,
  );

  ghost.lastResourceType = resourceType;
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
  renderPlacementFeedback(this, time);
};
