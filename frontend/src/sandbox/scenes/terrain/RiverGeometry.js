import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const PROFILE = Object.freeze([
  Object.freeze({ y: 0, centerOffset: 0, leftInset: 38, rightInset: 38 }),
  Object.freeze({ y: 2 * TILE_SIZE, centerOffset: -4, leftInset: 30, rightInset: 34 }),
  Object.freeze({ y: 5 * TILE_SIZE, centerOffset: -10, leftInset: 12, rightInset: 22 }),
  Object.freeze({ y: 8 * TILE_SIZE, centerOffset: -5, leftInset: 4, rightInset: 12 }),
  Object.freeze({ y: 10.5 * TILE_SIZE, centerOffset: 6, leftInset: 12, rightInset: 4 }),
  Object.freeze({ y: 14 * TILE_SIZE, centerOffset: 0, leftInset: 12, rightInset: 12 }),
  Object.freeze({ y: 17 * TILE_SIZE, centerOffset: -7, leftInset: 18, rightInset: 24 }),
  Object.freeze({ y: 20.5 * TILE_SIZE, centerOffset: -2, leftInset: 3, rightInset: 12 }),
  Object.freeze({ y: 24 * TILE_SIZE, centerOffset: 9, leftInset: 10, rightInset: 2 }),
  Object.freeze({ y: 27 * TILE_SIZE, centerOffset: 4, leftInset: 20, rightInset: 10 }),
  Object.freeze({ y: 29.5 * TILE_SIZE, centerOffset: -6, leftInset: 26, rightInset: 14 }),
  Object.freeze({ y: WORLD_HEIGHT, centerOffset: 0, leftInset: 18, rightInset: 22 }),
]);

function interpolate(start, end, ratio) {
  return start + (end - start) * ratio;
}

function smoothstep(ratio) {
  return ratio * ratio * (3 - 2 * ratio);
}

function sampleProfile(y) {
  const upperIndex = PROFILE.findIndex((point) => point.y >= y);
  if (upperIndex <= 0) return PROFILE[0];

  const upper = PROFILE[upperIndex];
  const lower = PROFILE[upperIndex - 1];
  const rawRatio = (y - lower.y) / Math.max(1, upper.y - lower.y);
  const ratio = smoothstep(rawRatio);

  return {
    y,
    centerOffset: interpolate(lower.centerOffset, upper.centerOffset, ratio),
    leftInset: interpolate(lower.leftInset, upper.leftInset, ratio),
    rightInset: interpolate(lower.rightInset, upper.rightInset, ratio),
  };
}

function createEdgeSample(y) {
  const profile = sampleProfile(y);
  const left = STREAM.left + profile.centerOffset + profile.leftInset;
  const right = STREAM.left + STREAM.width + profile.centerOffset - profile.rightInset;

  return Object.freeze({
    y,
    left,
    right,
    center: (left + right) / 2,
    width: right - left,
    centerOffset: profile.centerOffset,
  });
}

export function createRiverGeometry() {
  const sampleStep = TILE_SIZE;
  const edgeSamples = [];

  for (let y = 0; y < WORLD_HEIGHT; y += sampleStep) {
    edgeSamples.push(createEdgeSample(y));
  }
  if (edgeSamples.at(-1)?.y !== WORLD_HEIGHT) edgeSamples.push(createEdgeSample(WORLD_HEIGHT));

  const leftEdge = Object.freeze(edgeSamples.map((sample) => Object.freeze({ x: sample.left, y: sample.y })));
  const rightEdge = Object.freeze(edgeSamples.map((sample) => Object.freeze({ x: sample.right, y: sample.y })));

  return Object.freeze({
    corridor: STREAM,
    sampleStep,
    profile: PROFILE,
    edgeSamples: Object.freeze(edgeSamples),
    leftEdge,
    rightEdge,
    crossingProtectionZone: Object.freeze({
      x: STREAM.left - 2 * TILE_SIZE,
      y: 11 * TILE_SIZE,
      width: STREAM.width + 4 * TILE_SIZE,
      height: 7 * TILE_SIZE,
    }),
    gorgeTransitionZone: Object.freeze({
      x: STREAM.left - TILE_SIZE,
      y: 0,
      width: STREAM.width + 2 * TILE_SIZE,
      height: 6 * TILE_SIZE,
    }),
  });
}