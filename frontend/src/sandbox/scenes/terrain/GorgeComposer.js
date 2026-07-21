function addRock(scene, container, x, y, radius, variant = 0) {
  const shadow = scene.add.ellipse(x + 5, y + 8, radius * 2.1, radius * 1.15, 0x172522, 0.34);
  const base = scene.add.ellipse(x, y, radius * 2, radius * 1.45, variant ? 0x465653 : 0x3c4d4c, 0.98);
  const plane = scene.add.ellipse(x - radius * 0.18, y - radius * 0.18, radius * 1.35, radius * 0.68, variant ? 0x71806b : 0x657663, 0.92);
  const moss = scene.add.ellipse(x - radius * 0.22, y - radius * 0.38, radius * 0.72, radius * 0.22, 0x77945b, 0.82);
  container.add([shadow, base, plane, moss]);
}

function addShelf(graphics, points, faceColor, topColor) {
  graphics.fillStyle(faceColor, 0.96);
  graphics.fillPoints(points, true);
  graphics.fillStyle(topColor, 0.72);
  graphics.lineStyle(7, topColor, 0.72);
  graphics.strokePoints(points.slice(0, 3), false);
}

export function composeGorge(scene, geometry, depth = -8) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const first = geometry.edgeSamples[0];
  const center = (first.left + first.right) / 2;
  const gorge = scene.add.graphics();

  gorge.fillStyle(0x263837, 0.7);
  gorge.fillPoints([
    { x: first.left - 82, y: 0 },
    { x: first.right + 82, y: 0 },
    { x: first.right + 58, y: 86 },
    { x: first.right + 26, y: 162 },
    { x: first.left - 28, y: 162 },
    { x: first.left - 60, y: 88 },
  ], true);

  addShelf(gorge, [
    { x: first.left - 48, y: 118 },
    { x: center - 18, y: 132 },
    { x: center - 48, y: 164 },
    { x: first.left - 70, y: 150 },
  ], 0x455653, 0x718060);
  addShelf(gorge, [
    { x: center + 18, y: 132 },
    { x: first.right + 48, y: 116 },
    { x: first.right + 68, y: 150 },
    { x: center + 46, y: 164 },
  ], 0x3d4e4d, 0x687a61);

  gorge.fillStyle(0x1b2928, 0.46);
  gorge.fillEllipse(center, 153, Math.max(106, first.right - first.left + 34), 30);

  [
    [first.left - 52, 72, 30, 0],
    [first.left - 24, 116, 23, 1],
    [first.left - 58, 158, 18, 0],
    [first.right + 52, 68, 28, 1],
    [first.right + 28, 112, 22, 0],
    [first.right + 58, 156, 17, 1],
    [center - 58, 142, 14, 1],
    [center + 58, 140, 13, 0],
  ].forEach(([x, y, radius, variant]) => addRock(scene, container, x, y, radius, variant));

  container.addAt(gorge, 0);
  return container;
}
