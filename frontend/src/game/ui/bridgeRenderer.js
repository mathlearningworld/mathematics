/**
 * Bridge renderer.
 * Draws the full bridge frame (the Whole), the left half (pre-built),
 * the right half (missing target), placed pieces, and ghost overlays.
 *
 * Design:
 * - WHOLE_BRIDGE_WIDTH is the pixel width of the complete bridge.
 * - The left half (WHOLE_BRIDGE_WIDTH/2) is pre-built and filled.
 * - The right half (WHOLE_BRIDGE_WIDTH/2) is the missing target.
 * - The learner repairs the missing half.
 * - Both halves sit inside one continuous full-bridge frame.
 * - The midpoint of the Whole is visible.
 */

const LAND_COLOR = 0x5d8a3c;
const LAND_HEIGHT = 80;
const BRIDGE_Y = 400;
const GAP_Y_OFFSET = -20;
const BRIDGE_FRAME_COLOR = 0x8b5e3c;
const BRIDGE_DECK_COLOR = 0xa0724b;
const PREBUILT_COLOR = 0x6a4e9c;

/** Width of the complete bridge (the Whole) in pixels */
export const WHOLE_BRIDGE_WIDTH = 500;

/** Width of the missing half (target) in pixels */
export const HALF_WIDTH = WHOLE_BRIDGE_WIDTH / 2;

/**
 * Draw the full bridge scene.
 * @param {Phaser.Scene} scene
 * @param {number} gameWidth
 */
export function drawBridge(scene, gameWidth) {
  const centerX = gameWidth / 2;
  const halfW = HALF_WIDTH;
  const wholeW = WHOLE_BRIDGE_WIDTH;

  // --- Land platforms ---
  const leftLandW = centerX - wholeW / 2;
  const rightLandX = centerX + wholeW / 2;
  const rightLandW = gameWidth - rightLandX;

  // Left land
  const leftLand = scene.add.graphics();
  leftLand.fillStyle(LAND_COLOR, 1);
  leftLand.fillRoundedRect(0, BRIDGE_Y + GAP_Y_OFFSET, leftLandW, LAND_HEIGHT, { tl: 8, bl: 8, tr: 0, br: 0 });

  // Right land
  const rightLand = scene.add.graphics();
  rightLand.fillStyle(LAND_COLOR, 1);
  rightLand.fillRoundedRect(rightLandX, BRIDGE_Y + GAP_Y_OFFSET, rightLandW, LAND_HEIGHT, { tl: 0, bl: 0, tr: 8, br: 8 });

  // --- Full bridge frame (the Whole) ---
  const frame = scene.add.graphics();
  // Outer frame
  frame.lineStyle(4, BRIDGE_FRAME_COLOR, 1);
  frame.strokeRoundedRect(
    centerX - wholeW / 2,
    BRIDGE_Y + GAP_Y_OFFSET,
    wholeW,
    LAND_HEIGHT,
    4,
  );
  // Deck planks
  frame.fillStyle(BRIDGE_DECK_COLOR, 0.3);
  frame.fillRect(centerX - wholeW / 2 + 2, BRIDGE_Y + GAP_Y_OFFSET + 2, wholeW - 4, LAND_HEIGHT - 4);

  // --- Midpoint line (visible partition of the Whole) ---
  frame.lineStyle(2, 0xffffff, 0.5);
  frame.lineBetween(centerX, BRIDGE_Y + GAP_Y_OFFSET + 4, centerX, BRIDGE_Y + GAP_Y_OFFSET + LAND_HEIGHT - 4);

  // --- Pre-built left half ---
  const prebuilt = scene.add.graphics();
  prebuilt.fillStyle(PREBUILT_COLOR, 0.7);
  prebuilt.fillRoundedRect(
    centerX - halfW + 2,
    BRIDGE_Y + GAP_Y_OFFSET + 4,
    halfW - 4,
    LAND_HEIGHT - 8,
    4,
  );
  // Midpoint partition in prebuilt
  prebuilt.lineStyle(1, 0xffffff, 0.3);
  prebuilt.lineBetween(centerX, BRIDGE_Y + GAP_Y_OFFSET + 8, centerX, BRIDGE_Y + GAP_Y_OFFSET + LAND_HEIGHT - 8);

  // --- Missing half outline (target zone) ---
  const targetOutline = scene.add.graphics();
  targetOutline.lineStyle(3, 0xffffff, 0.6);
  targetOutline.strokeRoundedRect(
    centerX + 2,
    BRIDGE_Y + GAP_Y_OFFSET + 4,
    halfW - 4,
    LAND_HEIGHT - 8,
    4,
  );
  // Dashed midpoint hint
  targetOutline.lineStyle(1, 0xffffff, 0.2);
  targetOutline.lineBetween(
    centerX + halfW / 2,
    BRIDGE_Y + GAP_Y_OFFSET + 8,
    centerX + halfW / 2,
    BRIDGE_Y + GAP_Y_OFFSET + LAND_HEIGHT - 8,
  );

  // --- Bridge posts ---
  const posts = scene.add.graphics();
  posts.fillStyle(BRIDGE_FRAME_COLOR, 1);
  // Left post
  posts.fillRect(centerX - wholeW / 2 - 6, BRIDGE_Y + GAP_Y_OFFSET - 10, 8, LAND_HEIGHT + 20);
  // Right post
  posts.fillRect(centerX + wholeW / 2 - 2, BRIDGE_Y + GAP_Y_OFFSET - 10, 8, LAND_HEIGHT + 20);
  // Mid post
  posts.fillRect(centerX - 4, BRIDGE_Y + GAP_Y_OFFSET - 6, 8, LAND_HEIGHT + 12);

  // --- Ropes ---
  const ropes = scene.add.graphics();
  ropes.lineStyle(2, 0x8b5e3c, 0.6);
  // Left rope
  ropes.beginPath();
  ropes.moveTo(centerX - wholeW / 2 - 2, BRIDGE_Y + GAP_Y_OFFSET - 10);
  ropes.lineTo(centerX - 4, BRIDGE_Y + GAP_Y_OFFSET - 6);
  ropes.strokePath();
  // Right rope
  ropes.beginPath();
  ropes.moveTo(centerX + wholeW / 2 + 6, BRIDGE_Y + GAP_Y_OFFSET - 10);
  ropes.lineTo(centerX + 4, BRIDGE_Y + GAP_Y_OFFSET - 6);
  ropes.strokePath();

  // Return a container holding all bridge Graphics objects
  const container = scene.add.container(0, 0);
  container.add([
    leftLand,
    rightLand,
    frame,
    prebuilt,
    targetOutline,
    posts,
    ropes,
  ]);
  return container;
}


/**
 * Draw placed pieces in the missing half of the bridge.
 * @param {Phaser.Scene} scene
 * @param {Array<{ numerator: number, denominator: number }>} placedPieces
 * @param {number} gameWidth
 * @param {number} color
 * @returns {Phaser.GameObjects.Graphics}
 */
export function drawPlacedPieces(scene, placedPieces, gameWidth, color) {
  const centerX = gameWidth / 2;
  const halfW = HALF_WIDTH;

  const totalValue = placedPieces.reduce(
    (acc, p) => acc + p.numerator / p.denominator,
    0,
  );
  // target is 1/2 of the Whole = halfW pixels
  const fillRatio = Math.min(totalValue / 0.5, 1);
  const fillWidth = halfW * fillRatio;

  if (fillWidth <= 0) return null;

  const g = scene.add.graphics();
  g.fillStyle(color, 0.8);
  g.fillRoundedRect(
    centerX + 4,
    BRIDGE_Y + GAP_Y_OFFSET + 6,
    fillWidth - 4,
    LAND_HEIGHT - 12,
    4,
  );

  // Boundary between placed pieces (not internal partitions of a single piece)
  let xOffset = 0;
  for (const p of placedPieces) {
    const pieceWidth = (p.numerator / p.denominator / 0.5) * halfW;
    // Only draw boundary if there's a next piece
    xOffset += pieceWidth;
  }

  return g;
}

/**
 * Draw a translucent ghost overlay showing the previous 1/2 piece
 * for comparison after Round 2 completion.
 * @param {Phaser.Scene} scene
 * @param {number} gameWidth
 * @returns {Phaser.GameObjects.Graphics}
 */
export function drawGhostOverlay(scene, gameWidth) {
  const centerX = gameWidth / 2;
  const halfW = HALF_WIDTH;

  const g = scene.add.graphics();
  g.fillStyle(0xffffff, 0.15);
  g.fillRoundedRect(
    centerX + 4,
    BRIDGE_Y + GAP_Y_OFFSET + 6,
    halfW - 4,
    LAND_HEIGHT - 12,
    4,
  );
  g.lineStyle(2, 0xffffff, 0.4);
  g.strokeRoundedRect(
    centerX + 4,
    BRIDGE_Y + GAP_Y_OFFSET + 6,
    halfW - 4,
    LAND_HEIGHT - 12,
    4,
  );
  // Midpoint of the ghost
  g.lineStyle(1, 0xffffff, 0.2);
  g.lineBetween(
    centerX + halfW / 2,
    BRIDGE_Y + GAP_Y_OFFSET + 10,
    centerX + halfW / 2,
    BRIDGE_Y + GAP_Y_OFFSET + LAND_HEIGHT - 10,
  );

  return g;
}

export { BRIDGE_Y, LAND_HEIGHT, GAP_Y_OFFSET };
