import { STREAM, TILE_SIZE } from "../../config/worldContract.js";

export function createTerrainPaths(scene, depth = -3) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const paths = scene.add.graphics();

  const bridgeY = 14 * TILE_SIZE;
  const leftStart = { x: 5 * TILE_SIZE, y: 9 * TILE_SIZE };
  const leftEnd = { x: STREAM.left - TILE_SIZE, y: bridgeY };
  const rightStart = { x: STREAM.left + STREAM.width + TILE_SIZE, y: bridgeY };
  const rightEnd = { x: STREAM.left + STREAM.width + 5 * TILE_SIZE, y: 10 * TILE_SIZE };

  paths.lineStyle(26, 0xb69a67, 0.34);
  paths.beginPath();
  paths.moveTo(leftStart.x, leftStart.y);
  paths.lineTo(11 * TILE_SIZE, 11 * TILE_SIZE);
  paths.lineTo(leftEnd.x, leftEnd.y);
  paths.strokePath();

  paths.beginPath();
  paths.moveTo(rightStart.x, rightStart.y);
  paths.lineTo(STREAM.left + STREAM.width + 3 * TILE_SIZE, 12 * TILE_SIZE);
  paths.lineTo(rightEnd.x, rightEnd.y);
  paths.strokePath();

  paths.lineStyle(4, 0xd2bb88, 0.28);
  paths.lineBetween(leftStart.x, leftStart.y, leftEnd.x, leftEnd.y);
  paths.lineBetween(rightStart.x, rightStart.y, rightEnd.x, rightEnd.y);

  container.add(paths);

  return {
    container,
    anchors: Object.freeze({ leftStart, leftEnd, rightStart, rightEnd }),
  };
}
