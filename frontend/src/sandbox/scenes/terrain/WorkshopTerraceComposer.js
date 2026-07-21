import { STREAM, TILE_SIZE } from "../../config/worldContract.js";

export function composeWorkshopTerrace(scene, depth = -5) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const graphics = scene.add.graphics();
  const x = STREAM.left + STREAM.width + 42;
  const y = 8.5 * TILE_SIZE;

  graphics.fillStyle(0x4b5547, 0.32);
  graphics.fillEllipse(x + 96, y + 88, 274, 188);
  graphics.fillStyle(0x8b7753, 0.74);
  graphics.fillRoundedRect(x, y, 222, 154, 24);
  graphics.fillStyle(0xb09a69, 0.42);
  graphics.fillRoundedRect(x + 18, y + 18, 184, 116, 18);
  graphics.fillStyle(0x655b43, 0.58);
  graphics.fillRect(x + 10, y + 132, 202, 18);

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
  wear.lineStyle(20, 0xc1a873, 0.25);
  wear.beginPath();
  wear.moveTo(x - 30, y + 130);
  wear.lineTo(x + 36, y + 112);
  wear.lineTo(x + 104, y + 86);
  wear.strokePath();

  container.add([graphics, retaining, wear]);
  return container;
}
