import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

function addForegroundCluster(scene, container, x, y, scale, variant = 0) {
  const shadow = scene.add.ellipse(x + 8, y + 12, 78 * scale, 25 * scale, 0x14231f, 0.26);
  const back = scene.add.circle(x - 18 * scale, y, 28 * scale, variant ? 0x294f34 : 0x315a38, 0.98);
  const mid = scene.add.circle(x + 16 * scale, y + 3, 24 * scale, variant ? 0x3f7142 : 0x467b46, 0.98);
  const light = scene.add.circle(x, y - 18 * scale, 18 * scale, variant ? 0x65924e : 0x6e9b52, 0.96);
  const stone = scene.add.ellipse(x + 31 * scale, y + 15 * scale, 22 * scale, 14 * scale, 0x66736f, 0.9);
  const stoneTop = scene.add.ellipse(x + 27 * scale, y + 11 * scale, 13 * scale, 5 * scale, 0x909b91, 0.68);
  container.add([shadow, back, mid, light, stone, stoneTop]);
}

export function composeForegroundFraming(scene, depth = 118) {
  const container = scene.add.container(0, 0).setDepth(depth);

  [
    [3.2 * TILE_SIZE, WORLD_HEIGHT - 34, 1.15, 0],
    [12.5 * TILE_SIZE, WORLD_HEIGHT - 24, 0.82, 1],
    [STREAM.left + STREAM.width + 6.5 * TILE_SIZE, WORLD_HEIGHT - 28, 0.92, 0],
  ].forEach(([x, y, scale, variant]) => addForegroundCluster(scene, container, x, y, scale, variant));

  return container;
}
