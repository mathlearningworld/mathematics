import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const PROFILE = Object.freeze([
  Object.freeze({ y: 0, leftInset: 34, rightInset: 34 }),
  Object.freeze({ y: 2 * TILE_SIZE, leftInset: 27, rightInset: 39 }),
  Object.freeze({ y: 5 * TILE_SIZE, leftInset: 15, rightInset: 30 }),
  Object.freeze({ y: 8 * TILE_SIZE, leftInset: 7, rightInset: 19 }),
  Object.freeze({ y: 11 * TILE_SIZE, leftInset: 17, rightInset: 9 }),
  Object.freeze({ y: 14 * TILE_SIZE, leftInset: 8, rightInset: 8 }),
  Object.freeze({ y: 17 * TILE_SIZE, leftInset: 15, rightInset: 21 }),
  Object.freeze({ y: 21 * TILE_SIZE, leftInset: 5, rightInset: 14 }),
  Object.freeze({ y: 25 * TILE_SIZE, leftInset: 12, rightInset: 5 }),
  Object.freeze({ y: 29 * TILE_SIZE, leftInset: 23, rightInset: 12 }),
  Object.freeze({ y: WORLD_HEIGHT, leftInset: 18, rightInset: 22 }),
]);

function smoothstep(value) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function interpolate(start, end, ratio) {
  return start + (end - start) * smoothstep(ratio);
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

function buildInsetEdges(leftEdge, rightEdge, inset) {
  return Object.freeze({
    left: Object.freeze(leftEdge.map((point) => Object.freeze({ x: point.x + inset, y: point.y }))),
    right: Object.freeze(rightEdge.map((point) => Object.freeze({ x: point.x - inset, y: point.y }))),
  });
}

export function createRiverGeometry() {
  const sampleStep = TILE_SIZE;
  const leftEdge = [];
  const rightEdge = [];

  for (let y = 0; y <= WORLD_HEIGHT; y += sampleStep) {
    const clampedY = Math.min(y, WORLD_HEIGHT);
    const profile = sampleProfile(clampedY);
    leftEdge.push(Object.freeze({ x: STREAM.left + profile.leftInset, y: clampedY }));
    rightEdge.push(Object.freeze({ x: STREAM.left + STREAM.width - profile.rightInset, y: clampedY }));
  }

  if (leftEdge.at(-1)?.y !== WORLD_HEIGHT) {
    const profile = sampleProfile(WORLD_HEIGHT);
    leftEdge.push(Object.freeze({ x: STREAM.left + profile.leftInset, y: WORLD_HEIGHT }));
    rightEdge.push(Object.freeze({ x: STREAM.left + STREAM.width - profile.rightInset, y: WORLD_HEIGHT }));
  }

  const segments = leftEdge.slice(0, -1).map((leftTop, index) => {
    const leftBottom = leftEdge[index + 1];
    const rightTop = rightEdge[index];
    const rightBottom = rightEdge[index + 1];

    return Object.freeze({
      index,
      top: leftTop.y,
      height: leftBottom.y - leftTop.y,
      centerY: (leftTop.y + leftBottom.y) / 2,
      topLeft: leftTop.x,
      topRight: rightTop.x,
      bottomLeft: leftBottom.x,
      bottomRight: rightBottom.x,
      left: (leftTop.x + leftBottom.x) / 2,
      right: (rightTop.x + rightBottom.x) / 2,
    });
  });

  return Object.freeze({
    corridor: STREAM,
    sampleStep,
    profile: PROFILE,
    segments: Object.freeze(segments),
    leftEdge: Object.freeze(leftEdge),
    rightEdge: Object.freeze(rightEdge),
    midWaterEdges: buildInsetEdges(leftEdge, rightEdge, 18),
    deepWaterEdges: buildInsetEdges(leftEdge, rightEdge, 31),
    crossingProtectionZone: Object.freeze({
      x: STREAM.left - 2 * TILE_SIZE,
      y: 11 * TILE_SIZE,
      width: STREAM.width + 4 * TILE_SIZE,
      height: 7 * TILE_SIZE,
    }),
  });
}
