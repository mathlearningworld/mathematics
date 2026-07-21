import { STREAM, TILE_SIZE } from "../../config/worldContract.js";

function strokePath(graphics, points, width, color, alpha) {
  graphics.lineStyle(width, color, alpha);
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => graphics.lineTo(point.x, point.y));
  graphics.strokePath();
}

export function createTerrainPaths(scene, depth = -3) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const paths = scene.add.graphics();
  const wear = scene.add.graphics();

  const bridgeY = 14 * TILE_SIZE;
  const leftStart = { x: 5 * TILE_SIZE, y: 9 * TILE_SIZE };
  const leftTurn = { x: 11 * TILE_SIZE, y: 11 * TILE_SIZE };
  const leftApproach = { x: 16 * TILE_SIZE, y: 13 * TILE_SIZE };
  const leftEnd = { x: STREAM.left - TILE_SIZE, y: bridgeY };
  const rightStart = { x: STREAM.left + STREAM.width + TILE_SIZE, y: bridgeY };
  const rightTurn = { x: STREAM.left + STREAM.width + 3 * TILE_SIZE, y: 12 * TILE_SIZE };
  const rightEnd = { x: STREAM.left + STREAM.width + 5 * TILE_SIZE, y: 10 * TILE_SIZE };

  const leftRoute = [leftStart, leftTurn, leftApproach, leftEnd];
  const rightRoute = [rightStart, rightTurn, rightEnd];

  strokePath(paths, leftRoute, 34, 0x7b6948, 0.26);
  strokePath(paths, leftRoute, 22, 0xb79a64, 0.42);
  strokePath(paths, leftRoute, 5, 0xd4bd86, 0.25);

  strokePath(paths, rightRoute, 38, 0x736044, 0.3);
  strokePath(paths, rightRoute, 25, 0xb29560, 0.46);
  strokePath(paths, rightRoute, 5, 0xd7bf88, 0.26);

  const wearMarks = [
    [leftTurn.x - 18, leftTurn.y + 8, 24, 5],
    [leftApproach.x - 6, leftApproach.y - 9, 30, 5],
    [rightTurn.x - 14, rightTurn.y + 12, 28, 5],
    [rightEnd.x - 24, rightEnd.y + 18, 34, 5],
  ];

  wear.fillStyle(0xe1ca94, 0.2);
  wearMarks.forEach(([x, y, width, height]) => wear.fillRoundedRect(x, y, width, height, 2));

  container.add([paths, wear]);

  return {
    container,
    anchors: Object.freeze({
      leftStart,
      leftTurn,
      leftApproach,
      leftEnd,
      rightStart,
      rightTurn,
      rightEnd,
    }),
  };
}
