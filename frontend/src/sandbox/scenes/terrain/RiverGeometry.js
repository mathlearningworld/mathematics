import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const LEFT_INSETS = Object.freeze([10, 18, 8, 24, 14, 6, 20, 12, 26, 10, 16]);
const RIGHT_INSETS = Object.freeze([18, 8, 22, 12, 28, 14, 6, 24, 10, 20, 12]);

export function createRiverGeometry() {
  const segmentHeight = 3 * TILE_SIZE;
  const segments = [];

  for (let top = 0, index = 0; top < WORLD_HEIGHT; top += segmentHeight, index += 1) {
    const height = Math.min(segmentHeight, WORLD_HEIGHT - top);
    const leftInset = LEFT_INSETS[index % LEFT_INSETS.length];
    const rightInset = RIGHT_INSETS[index % RIGHT_INSETS.length];

    segments.push({
      index,
      top,
      height,
      left: STREAM.left + leftInset,
      right: STREAM.left + STREAM.width - rightInset,
      centerY: top + height / 2,
    });
  }

  return Object.freeze({
    corridor: STREAM,
    segmentHeight,
    segments: Object.freeze(segments),
    crossingProtectionZone: Object.freeze({
      x: STREAM.left - 2 * TILE_SIZE,
      y: 11 * TILE_SIZE,
      width: STREAM.width + 4 * TILE_SIZE,
      height: 7 * TILE_SIZE,
    }),
  });
}
