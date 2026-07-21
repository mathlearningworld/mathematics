import { STREAM, TILE_SIZE } from "../../config/worldContract.js";

function addEdgeStone(scene, container, x, y, scale = 1) {
  const shadow = scene.add.ellipse(x + 3, y + 5, 24 * scale, 11 * scale, 0x20302c, 0.3);
  const stone = scene.add.ellipse(x, y, 22 * scale, 15 * scale, 0x687572, 0.9);
  const top = scene.add.ellipse(x - 3, y - 3, 14 * scale, 6 * scale, 0x929c91, 0.7);
  container.add([shadow, stone, top]);
}

export function composeBridgeApproach(scene, depth = -2) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const graphics = scene.add.graphics();
  const bridgeY = 14 * TILE_SIZE;
  const leftX = STREAM.left - 4.5 * TILE_SIZE;
  const rightX = STREAM.left + STREAM.width + TILE_SIZE;

  graphics.fillStyle(0xa48d60, 0.42);
  graphics.fillEllipse(leftX + 54, bridgeY, 220, 112);
  graphics.fillEllipse(rightX + 70, bridgeY - 18, 190, 118);
  graphics.fillStyle(0xc0aa78, 0.22);
  graphics.fillEllipse(leftX + 72, bridgeY - 6, 156, 66);
  graphics.fillEllipse(rightX + 54, bridgeY - 20, 132, 72);

  const wear = scene.add.graphics();
  wear.lineStyle(16, 0xd0b77e, 0.2);
  wear.beginPath();
  wear.moveTo(leftX - 80, bridgeY - 46);
  wear.lineTo(leftX + 12, bridgeY - 18);
  wear.lineTo(STREAM.left - 18, bridgeY);
  wear.strokePath();

  [
    [STREAM.left - 44, bridgeY - 44, 1],
    [STREAM.left - 68, bridgeY + 38, 0.8],
    [STREAM.left + STREAM.width + 42, bridgeY - 42, 0.9],
    [STREAM.left + STREAM.width + 72, bridgeY + 30, 0.7],
  ].forEach(([x, y, scale]) => addEdgeStone(scene, container, x, y, scale));

  container.addAt(graphics, 0);
  container.add(wear);
  return container;
}
