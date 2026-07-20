/**
 * Builder's Valley world contract.
 * Rendering assets may change; world coordinates and rules may not.
 */
export const TILE_SIZE = 32;
export const WORLD_COLUMNS = 48;
export const WORLD_ROWS = 32;
export const WORLD_WIDTH = WORLD_COLUMNS * TILE_SIZE;
export const WORLD_HEIGHT = WORLD_ROWS * TILE_SIZE;

export const VIEWPORT_WIDTH = 960;
export const VIEWPORT_HEIGHT = 540;

export const PLAYER_SPEED = 180;
export const PLAYER_RUN_MULTIPLIER = 1.65;

export const STREAM = Object.freeze({
  left: 21 * TILE_SIZE,
  top: 0,
  width: 6 * TILE_SIZE,
  height: WORLD_HEIGHT,
});

export function worldToGrid(value) {
  return Math.floor(value / TILE_SIZE);
}

export function gridToWorld(cell) {
  return cell * TILE_SIZE;
}

export function isInsideWorld(x, y) {
  return x >= 0 && y >= 0 && x < WORLD_WIDTH && y < WORLD_HEIGHT;
}
