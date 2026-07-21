function isInsideZone(y, zone) {
  return y >= zone.y && y <= zone.y + zone.height;
}

function createOffsetEdge(edge, side, widthAt) {
  const direction = side === "left" ? -1 : 1;
  return edge.map((point, index) => ({
    x: point.x + direction * widthAt(point, index),
    y: point.y,
  }));
}

function bandPolygon(innerEdge, outerEdge) {
  return [...innerEdge, ...[...outerEdge].reverse()];
}

function bankWidth(point, index, side, zone) {
  if (isInsideZone(point.y, zone)) return 8;

  const rhythm = side === "left"
    ? [20, 28, 16, 36, 12, 25, 18, 32]
    : [28, 14, 34, 18, 24, 38, 16, 26];
  const base = rhythm[index % rhythm.length];

  if (point.y < 6 * 32) return base + 12;
  if (point.y > 23 * 32) return base + 5;
  return base;
}

function addShelf(graphics, x, y, side, variant) {
  const direction = side === "left" ? -1 : 1;
  graphics.fillStyle(variant ? 0x59665d : 0x4b5b57, 0.98);
  graphics.fillEllipse(x + direction * 10, y, 30 + variant * 8, 18 + variant * 5);
  graphics.fillStyle(0x768768, 0.9);
  graphics.fillEllipse(x + direction * 13, y - 5, 21 + variant * 5, 8);
  graphics.fillStyle(0x8e9a86, 0.72);
  graphics.fillCircle(x + direction * 2, y + 7, 4 + variant);
}

export function createShorelines(scene, geometry, depth = -9) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const cliffFaces = scene.add.graphics();
  const wetEdges = scene.add.graphics();
  const grassCaps = scene.add.graphics();
  const shelves = scene.add.graphics();

  const leftOuter = createOffsetEdge(
    geometry.leftEdge,
    "left",
    (point, index) => bankWidth(point, index, "left", geometry.crossingProtectionZone),
  );
  const rightOuter = createOffsetEdge(
    geometry.rightEdge,
    "right",
    (point, index) => bankWidth(point, index, "right", geometry.crossingProtectionZone),
  );

  cliffFaces.fillStyle(0x43524f, 0.98);
  cliffFaces.fillPoints(bandPolygon(geometry.leftEdge, leftOuter), true);
  cliffFaces.fillStyle(0x4a5955, 0.98);
  cliffFaces.fillPoints(bandPolygon(geometry.rightEdge, rightOuter), true);

  wetEdges.lineStyle(5, 0x7c9e92, 0.72);
  wetEdges.strokePoints(geometry.leftEdge, false);
  wetEdges.strokePoints(geometry.rightEdge, false);

  grassCaps.lineStyle(6, 0x70855f, 0.84);
  grassCaps.strokePoints(leftOuter, false);
  grassCaps.strokePoints(rightOuter, false);

  const shelfSpecs = [
    { index: 4, side: "left", variant: 1 },
    { index: 7, side: "right", variant: 0 },
    { index: 10, side: "left", variant: 0 },
    { index: 19, side: "right", variant: 1 },
    { index: 23, side: "left", variant: 1 },
    { index: 27, side: "right", variant: 0 },
  ];

  shelfSpecs.forEach(({ index, side, variant }) => {
    const edge = side === "left" ? geometry.leftEdge : geometry.rightEdge;
    const point = edge[Math.min(index, edge.length - 1)];
    if (!point || isInsideZone(point.y, geometry.crossingProtectionZone)) return;
    addShelf(shelves, point.x, point.y, side, variant);
  });

  container.add([cliffFaces, wetEdges, grassCaps, shelves]);
  return container;
}