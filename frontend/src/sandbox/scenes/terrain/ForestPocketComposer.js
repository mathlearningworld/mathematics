import { TILE_SIZE } from "../../config/worldContract.js";

function addShrub(scene, container, x, y, scale, variant = 0) {
  const shadow = scene.add.ellipse(x + 5, y + 10, 50 * scale, 18 * scale, 0x183027, 0.24);
  const back = scene.add.circle(x - 12 * scale, y, 20 * scale, variant ? 0x355f38 : 0x2c5634, 0.96);
  const mid = scene.add.circle(x + 10 * scale, y + 2, 18 * scale, variant ? 0x497746 : 0x3e7041, 0.98);
  const light = scene.add.circle(x, y - 11 * scale, 14 * scale, variant ? 0x6f9652 : 0x5f8d4c, 0.96);
  container.add([shadow, back, mid, light]);
}

export function composeForestPocket(scene, depth = 44) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const ground = scene.add.graphics();

  ground.fillStyle(0x315c38, 0.16);
  ground.fillEllipse(6 * TILE_SIZE, 5.5 * TILE_SIZE, 310, 210);
  ground.fillEllipse(9 * TILE_SIZE, 22 * TILE_SIZE, 250, 170);
  ground.fillStyle(0x7e714d, 0.2);
  ground.fillEllipse(8 * TILE_SIZE, 11 * TILE_SIZE, 120, 54);

  [
    [3.8 * TILE_SIZE, 4.4 * TILE_SIZE, 1.15, 0],
    [5.4 * TILE_SIZE, 5.1 * TILE_SIZE, 0.95, 1],
    [7.1 * TILE_SIZE, 4.1 * TILE_SIZE, 0.8, 0],
    [4.5 * TILE_SIZE, 7.2 * TILE_SIZE, 0.72, 1],
    [7.8 * TILE_SIZE, 21.5 * TILE_SIZE, 0.9, 0],
    [9.5 * TILE_SIZE, 22.4 * TILE_SIZE, 0.75, 1],
  ].forEach(([x, y, scale, variant]) => addShrub(scene, container, x, y, scale, variant));

  const flowers = scene.add.graphics();
  const points = [
    [5.8, 6.7, 0xe1b552],
    [7.4, 7.6, 0xd66b78],
    [8.8, 20.8, 0x8db5e8],
    [10.2, 22.8, 0xf0d06e],
  ];
  points.forEach(([x, y, color]) => {
    flowers.fillStyle(color, 0.82);
    flowers.fillCircle(x * TILE_SIZE, y * TILE_SIZE, 3);
  });

  container.addAt(ground, 0);
  container.add(flowers);
  return container;
}
