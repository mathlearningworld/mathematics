import { STREAM, TILE_SIZE } from "../../config/worldContract.js";

function addPaver(graphics, x, y, width, height, variant = 0) {
  graphics.fillStyle(variant ? 0x71664d : 0x7d7052, 0.74);
  graphics.fillRoundedRect(x, y, width, height, 4);
  graphics.fillStyle(0xb2a175, 0.38);
  graphics.fillRect(x + 3, y + 3, width - 6, 3);
}

export function composeWorkshopTerrace(scene, depth = -5) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const graphics = scene.add.graphics();
  const x = STREAM.left + STREAM.width + 42;
  const y = 8.5 * TILE_SIZE;

  graphics.fillStyle(0x4b5547, 0.22);
  graphics.fillPoints([
    { x: x - 18, y: y + 26 },
    { x: x + 36, y: y - 14 },
    { x: x + 198, y: y - 4 },
    { x: x + 248, y: y + 54 },
    { x: x + 224, y: y + 168 },
    { x: x + 42, y: y + 180 },
    { x: x - 20, y: y + 132 },
  ], true);

  graphics.fillStyle(0x8b7753, 0.78);
  graphics.fillPoints([
    { x, y: y + 18 },
    { x: x + 34, y },
    { x: x + 202, y: y + 10 },
    { x: x + 224, y: y + 50 },
    { x: x + 208, y: y + 148 },
    { x: x + 22, y: y + 154 },
    { x: x - 6, y: y + 118 },
  ], true);

  graphics.fillStyle(0xb09a69, 0.36);
  graphics.fillPoints([
    { x: x + 22, y: y + 30 },
    { x: x + 58, y: y + 18 },
    { x: x + 184, y: y + 24 },
    { x: x + 198, y: y + 64 },
    { x: x + 184, y: y + 124 },
    { x: x + 48, y: y + 132 },
    { x: x + 18, y: y + 104 },
  ], true);

  const pavers = scene.add.graphics();
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 5; column += 1) {
      addPaver(pavers, x + 38 + column * 31 + (row % 2) * 8, y + 78 + row * 22, 25, 15, (row + column) % 2);
    }
  }

  const retaining = scene.add.graphics();
  retaining.fillStyle(0x3d4846, 0.96);
  for (let offset = 0; offset < 210; offset += 28) {
    const height = 15 + ((offset / 28) % 3) * 4;
    retaining.fillRoundedRect(x + offset, y + 145, 24, height, 5);
    retaining.fillStyle(0x778177, 0.72);
    retaining.fillRect(x + offset + 3, y + 148, 18, 4);
    retaining.fillStyle(0x3d4846, 0.96);
  }

  const wear = scene.add.graphics();
  wear.lineStyle(24, 0xc1a873, 0.22);
  wear.beginPath();
  wear.moveTo(x - 38, y + 138);
  wear.lineTo(x + 34, y + 116);
  wear.lineTo(x + 98, y + 88);
  wear.strokePath();

  const contact = scene.add.graphics();
  contact.fillStyle(0x27322e, 0.24);
  contact.fillEllipse(x + 126, y + 56, 152, 42);

  container.add([graphics, pavers, retaining, wear, contact]);
  return container;
}
