import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const PROFILE = Object.freeze([
  Object.freeze({ y: 0, centerOffset: 0, leftInset: 46, rightInset: 46, zone: "waterfall-throat" }),
  Object.freeze({ y: 2 * TILE_SIZE, centerOffset: -5, leftInset: 38, rightInset: 40, zone: "waterfall-lip" }),
  Object.freeze({ y: 4.5 * TILE_SIZE, centerOffset: -12, leftInset: 12, rightInset: 18, zone: "upper-gorge-pool" }),
  Object.freeze({ y: 7 * TILE_SIZE, centerOffset: -7, leftInset: 18, rightInset: 26, zone: "upper-gorge-release" }),
  Object.freeze({ y: 9.5 * TILE_SIZE, centerOffset: 5, leftInset: 32, rightInset: 24, zone: "mid-channel-neck" }),
  Object.freeze({ y: 12 * TILE_SIZE, centerOffset: 10, leftInset: 12, rightInset: 10, zone: "bridge-approach" }),
  Object.freeze({ y: 15 * TILE_SIZE, centerOffset: 2, leftInset: 8, rightInset: 14, zone: "bridge-crossing" }),
  Object.freeze({ y: 18 * TILE_SIZE, centerOffset: -9, leftInset: 22, rightInset: 30, zone: "lower-channel-neck" }),
  Object.freeze({ y: 21 * TILE_SIZE, centerOffset: -4, leftInset: 10, rightInset: 8, zone: "lower-river-pool" }),
  Object.freeze({ y: 24 * TILE_SIZE, centerOffset: 10, leftInset: 18, rightInset: 6, zone: "lower-river-bend" }),
  Object.freeze({ y: 27 * TILE_SIZE, centerOffset: 5, leftInset: 32, rightInset: 20, zone: "lower-exit-neck" }),
  Object.freeze({ y: 30 * TILE_SIZE, centerOffset: -7, leftInset: 22, rightInset: 30, zone: "foreground-release" }),
  Object.freeze({ y: WORLD_HEIGHT, centerOffset: 0, leftInset: 16, rightInset: 24, zone: "world-exit" }),
]);

const SHAPE_ZONES = Object.freeze([
  Object.freeze({ id: "waterfall-throat", startY: 0, endY: 2 * TILE_SIZE, widthIntent: "NARROW", purpose: "focus the waterfall drop" }),
  Object.freeze({ id: "upper-gorge-pool", startY: 2 * TILE_SIZE, endY: 7 * TILE_SIZE, widthIntent: "WIDE", purpose: "create a readable waterfall basin" }),
  Object.freeze({ id: "mid-channel-neck", startY: 7 * TILE_SIZE, endY: 10.5 * TILE_SIZE, widthIntent: "NARROW", purpose: "separate the gorge pool from the bridge reach" }),
  Object.freeze({ id: "bridge-reach", startY: 10.5 * TILE_SIZE, endY: 17 * TILE_SIZE, widthIntent: "WIDE", purpose: "protect bridge readability and crossing space" }),
  Object.freeze({ id: "lower-channel-neck", startY: 17 * TILE_SIZE, endY: 20 * TILE_SIZE, widthIntent: "NARROW", purpose: "restore visual rhythm below the bridge" }),
  Object.freeze({ id: "lower-river-pool", startY: 20 * TILE_SIZE, endY: 25 * TILE_SIZE, widthIntent: "WIDE", purpose: "support foreground water depth" }),
  Object.freeze({ id: "lower-exit", startY: 25 * TILE_SIZE, endY: WORLD_HEIGHT, widthIntent: "TAPERED", purpose: "lead the river out of frame" }),
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
  const widths = edgeSamples.map((sample) => sample.width);

  return Object.freeze({
    corridor: STREAM,
    sampleStep,
    profile: PROFILE,
    shapeZones: SHAPE_ZONES,
    widthRange: Object.freeze({
      min: Math.min(...widths),
      max: Math.max(...widths),
    }),
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
      height: 7 * TILE_SIZE,
    }),
    visualGeometryPolicy: "ORGANIC_WIDTH_RHYTHM_WITH_PROTECTED_CROSSING",
    collisionAuthority: "UNCHANGED_STREAM_CONTRACT",
  });
}
