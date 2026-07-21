import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;

const GHOST_FILL = Object.freeze({
  wood: 0x9a5f3a,
  stone: 0x71808a,
});

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
  const shadow = scene.add.ellipse(0, 8, 30, 12, 0x111820, 0.28);
  const block = scene.add.rectangle(0, 0, 28, 22, GHOST_FILL.wood, 0.42);
  block.setStrokeStyle(2, 0xffd65a, 0.95);

  const highlight = scene.add.rectangle(-5, -5, 12, 5, 0xffffff, 0.24);
  const invalidMarkA = scene.add.rectangle(0, 0, 24, 3, 0xe55b55, 0.95).setAngle(45);
  const invalidMarkB = scene.add.rectangle(0, 0, 24, 3, 0xe55b55, 0.95).setAngle(-45);

  const container = scene.add.container(0, 0, [shadow, block, highlight, invalidMarkA, invalidMarkB]);
  container.setVisible(false);

  return {
    container,
    shadow,
    block,
    highlight,
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
  const fill = GHOST_FILL[prediction.resourceType] ?? GHOST_FILL.wood;
  const pulse = 0.36 + Math.sin((time ?? 0) / 180) * 0.07;

  ghost.container
    .setVisible(true)
    .setPosition(prediction.worldPoint.x, prediction.worldPoint.y)
    .setDepth(150 + Math.floor(prediction.worldPoint.y));

  ghost.block
    .setFillStyle(fill, valid ? pulse : 0.24)
    .setStrokeStyle(2, valid ? 0xffd65a : 0xe55b55, valid ? 0.95 : 1);
  ghost.shadow.setAlpha(valid ? 0.28 : 0.16);
  ghost.highlight.setVisible(valid).setAlpha(valid ? 0.24 : 0);
  ghost.invalidMarkA.setVisible(!valid);
  ghost.invalidMarkB.setVisible(!valid);

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
  renderPlacementFeedback(this, time);
};
