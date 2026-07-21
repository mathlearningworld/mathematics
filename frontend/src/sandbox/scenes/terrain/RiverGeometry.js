import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const PROFILE = Object.freeze([
  Object.freeze({ y: 0, leftInset: 34, rightInset: 34 }),
  Object.freeze({ y: 2 * TILE_SIZE, leftInset: 26, rightInset: 40 }),
  Object.freeze({ y: 5 * TILE_SIZE, leftInset: 14, rightInset: 30 }),
  Object.freeze({ y: 8 * TILE_SIZE, leftInset: 6, rightInset: 18 }),
  Object.freeze({ y: 11 * TILE_SIZE, leftInset: 18, rightInset: 8 }),
  Object.freeze({ y: 14 * TILE_SIZE, leftInset: 8, rightInset: 8 }),
  Object.freeze({ y: 17 * TILE_SIZE, leftInset: 16, rightInset: 22 }),
  Object.freeze({ y: 21 * TILE_SIZE, leftInset: 4, rightInset: 14 }),
  Object.freeze({ y: 25 * TILE_SIZE, leftInset: 12, rightInset: 4 }),
  Object.freeze({ y: 29 * TILE_SIZE, leftInset: 24, rightInset: 12 }),
  Object.freeze({ y: WORLD_HEIGHT, leftInset: 18, rightInset: 22 }),
]);

function interpolate(start, end, ratio) {
  return start + (end - start) * ratio;
}

function sampleProfile(y) {
  const upperIndex = PROFILE.findIndex((point) => point.y >= y);
  if (upperIndex <= 0) return PROFILE[0];

  const upper = PROFILE[upperIndex];
  const lower = PROFILE[upperIndex - 1];
  const ratio = (y - lower.y) / Math.max(1, upper.y - lower.y);

  return {
    y,
    leftInset: interpolate(lower.leftInset, upper.leftInset, ratio),
    rightInset: interpolate(lower.rightInset, upper.rightInset, ratio),
  };
}

export function createRiverGeometry() {
  const segmentHeight = 2 * TILE_SIZE;
  const segments = [];
  const leftEdge = [];
  const rightEdge = [];

  for (let top = 0, index = 0; top < WORLD_HEIGHT; top += segmentHeight, index += 1) {
    const height = Math.min(segmentHeight, WORLD_HEIGHT - top);
    const topProfile = sampleProfile(top);
    const bottomProfile = sampleProfile(top + height);
    const topLeft = STREAM.left + topProfile.leftInset;
    const topRight = STREAM.left + STREAM.width - topProfile.rightInset;
    const bottomLeft = STREAM.left + bottomProfile.leftInset;
    const bottomRight = STREAM.left + STREAM.width - bottomProfile.rightInset;

    segments.push(Object.freeze({
      index,
      top,
      height,
      centerY: top + height / 2,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
      left: (topLeft + bottomLeft) / 2,
      right: (topRight + bottomRight) / 2,
    }));

    if (index === 0) {
      leftEdge.push(Object.freeze({ x: topLeft, y: top }));
      rightEdge.push(Object.freeze({ x: topRight, y: top }));
    }
    leftEdge.push(Object.freeze({ x: bottomLeft, y: top + height }));
    rightEdge.push(Object.freeze({ x: bottomRight, y: top + height }));
  }

  return Object.freeze({
    corridor: STREAM,
    segmentHeight,
    profile: PROFILE,
    segments: Object.freeze(segments),
    leftEdge: Object.freeze(leftEdge),
    rightEdge: Object.freeze(rightEdge),
    crossingProtectionZone: Object.freeze({
      x: STREAM.left - 2 * TILE_SIZE,
      y: 11 * TILE_SIZE,
      width: STREAM.width + 4 * TILE_SIZE,
      height: 7 * TILE_SIZE,
    }),
  });
}
