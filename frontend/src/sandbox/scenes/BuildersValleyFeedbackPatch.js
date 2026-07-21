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
const SHADOW = 0x17252c;
const VALID_STROKE = 0xffd65a;
const INVALID_STROKE = 0xe55b55;

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

function createPlacementGhost(scene) {
  // Mirror createPlacedBlock exactly: all child geometry uses the same local
  // coordinates, so the preview silhouette and the final block share one visual
  // anchor as well as one world point.
  const shadow = scene.add.ellipse(0, 9, 29, 9, SHADOW, 0.18);
  const front = scene.add.rectangle(0, 1, 28, 22, OUTLINE, 0.55);
  const face = scene.add.rectangle(0, -1, 24, 17, GHOST_FILL.wood, 0.38);
  const top = scene.add.rectangle(0, -10, 24, 6, GHOST_LIGHT.wood, 0.46);
  const seam = scene.add.rectangle(6, -1, 3, 15, OUTLINE, 0.2);

  const frame = scene.add.rectangle(0, 0, 30, 24, 0xffffff, 0);
  frame.setStrokeStyle(2, VALID_STROKE, 0.95);

  const invalidMarkA = scene.add.rectangle(0, 0, 24, 3, INVALID_STROKE, 0.95).setAngle(45);
  const invalidMarkB = scene.add.rectangle(0, 0, 24, 3, INVALID_STROKE, 0.95).setAngle(-45);

  const container = scene.add.container(0, 0, [
    shadow,
    front,
    face,
    top,
    seam,
    frame,
    invalidMarkA,
    invalidMarkB,
  ]);
  container.setVisible(false);

  return {
    container,
    shadow,
    front,
    face,
    top,
    seam,
    frame,
    invalidMarkA,
    invalidMarkB,
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
  const pulse = 0.34 + Math.sin((time ?? 0) / 180) * 0.06;

  ghost.container
    .setVisible(true)
    .setPosition(Math.round(prediction.worldPoint.x), Math.round(prediction.worldPoint.y))
    .setDepth(150 + Math.floor(prediction.worldPoint.y));

  ghost.front.setFillStyle(OUTLINE, valid ? 0.52 : 0.34);
  ghost.face.setFillStyle(fill, valid ? pulse : 0.2);
  ghost.top.setFillStyle(light, valid ? Math.min(0.62, pulse + 0.12) : 0.22);
  ghost.seam
    .setPosition(resourceType === "wood" ? 6 : -6, -1)
    .setFillStyle(OUTLINE, valid ? 0.2 : 0.12);
  ghost.shadow.setAlpha(valid ? 0.18 : 0.1);
  ghost.frame.setStrokeStyle(2, valid ? VALID_STROKE : INVALID_STROKE, valid ? 0.95 : 1);
  ghost.invalidMarkA.setVisible(!valid);
  ghost.invalidMarkB.setVisible(!valid);

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
