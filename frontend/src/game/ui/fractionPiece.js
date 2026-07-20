/**
 * Fraction piece visual component.
 * Renders a draggable unit-fraction piece using Phaser Graphics.
 *
 * A unit piece (e.g. 1/4) is ONE solid piece.
 * It does NOT subdivide itself with internal partition lines.
 * Only fraction models (Round 3) show denominator partitions.
 */

const PIECE_HEIGHT = 50;
const PIECE_BORDER_RADIUS = 8;
const BASE_WIDTH = 200; // width for a whole (1/1)

/**
 * Compute pixel width for a fraction value.
 * @param {{ numerator: number, denominator: number }} fraction
 * @returns {number}
 */
export function fractionToWidth(fraction) {
  return (fraction.numerator / fraction.denominator) * BASE_WIDTH;
}

/**
 * Create a unit-fraction piece as a Phaser Container with Graphics.
 * This is a single solid piece — no internal partition lines.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {{ numerator: number, denominator: number, id: string }} pieceData
 * @param {number} color - hex color
 * @returns {Phaser.GameObjects.Container}
 */
export function createFractionPiece(scene, x, y, pieceData, color) {
  const w = Math.max(fractionToWidth(pieceData), 30);
  const container = scene.add.container(x, y);

  // Background — solid fill, no internal partitions
  const bg = scene.add.graphics();
  bg.fillStyle(color, 1);
  bg.fillRoundedRect(-w / 2, -PIECE_HEIGHT / 2, w, PIECE_HEIGHT, PIECE_BORDER_RADIUS);
  bg.lineStyle(2, 0xffffff, 0.8);
  bg.strokeRoundedRect(-w / 2, -PIECE_HEIGHT / 2, w, PIECE_HEIGHT, PIECE_BORDER_RADIUS);

  // Label
  const label = scene.add.text(0, 0, `${pieceData.numerator}/${pieceData.denominator}`, {
    fontSize: "18px",
    fontFamily: "Arial, sans-serif",
    color: "#ffffff",
    fontStyle: "bold",
    stroke: "#000000",
    strokeThickness: 2,
  });
  label.setOrigin(0.5, 0.5);

  container.add([bg, label]);
  container.setSize(w, PIECE_HEIGHT);
  container.setInteractive({ draggable: true, useHandCursor: true });
  container.setData("pieceId", pieceData.id);
  container.setData("numerator", pieceData.numerator);
  container.setData("denominator", pieceData.denominator);

  return container;
}

/**
 * Create a fraction model bar (for Round 3 visual choice).
 * This represents one Whole frame divided into denominator cells,
 * with numerator cells filled.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {{ numerator: number, denominator: number, id: string }} modelData
 * @param {number} wholeWidth - pixel width of the whole frame
 * @param {number} fillColor
 * @returns {Phaser.GameObjects.Container}
 */
export function createFractionModel(scene, x, y, modelData, wholeWidth, fillColor) {
  const h = 60;
  const cellW = wholeWidth / modelData.denominator;
  const container = scene.add.container(x, y);

  // Whole frame outline
  const frame = scene.add.graphics();
  frame.lineStyle(3, 0xffffff, 0.9);
  frame.strokeRoundedRect(-wholeWidth / 2, -h / 2, wholeWidth, h, 6);

  // Filled cells
  const fill = scene.add.graphics();
  fill.fillStyle(fillColor, 0.8);
  for (let i = 0; i < modelData.numerator; i++) {
    const cx = -wholeWidth / 2 + i * cellW;
    fill.fillRoundedRect(cx + 1, -h / 2 + 1, cellW - 2, h - 2, 4);
  }

  // Partition lines between all denominator cells
  const lines = scene.add.graphics();
  lines.lineStyle(1, 0xffffff, 0.4);
  for (let i = 1; i < modelData.denominator; i++) {
    const lx = -wholeWidth / 2 + i * cellW;
    lines.lineBetween(lx, -h / 2 + 4, lx, h / 2 - 4);
  }

  // Label
  const label = scene.add.text(0, 0, `${modelData.numerator}/${modelData.denominator}`, {
    fontSize: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#ffffff",
    fontStyle: "bold",
    stroke: "#000000",
    strokeThickness: 2,
  });
  label.setOrigin(0.5, 0.5);

  container.add([frame, fill, lines, label]);
  container.setSize(wholeWidth + 20, h + 20);
  container.setInteractive({ useHandCursor: true });

  return container;
}
