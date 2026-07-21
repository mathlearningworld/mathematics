function addRock(scene, container, x, y, radius, variant = 0) {
  const shadow = scene.add.ellipse(x + 5, y + 8, radius * 2.1, radius * 1.15, 0x172522, 0.34);
  const base = scene.add.ellipse(x, y, radius * 2, radius * 1.45, variant ? 0x465653 : 0x3c4d4c, 0.98);
  const plane = scene.add.ellipse(x - radius * 0.18, y - radius * 0.18, radius * 1.35, radius * 0.68, variant ? 0x71806b : 0x657663, 0.92);
  const moss = scene.add.ellipse(x - radius * 0.22, y - radius * 0.38, radius * 0.72, radius * 0.22, 0x77945b, 0.82);
  container.add([shadow, base, plane, moss]);
}

export function composeGorge(scene, geometry, depth = -8) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const first = geometry.edgeSamples[0];
  const center = (first.left + first.right) / 2;
  const gorge = scene.add.graphics();

  gorge.fillStyle(0x263837, 0.72);
  gorge.fillPoints([
    { x: first.left - 74, y: 0 },
    { x: first.right + 74, y: 0 },
    { x: first.right + 42, y: 126 },
    { x: first.right + 20, y: 178 },
    { x: first.left - 24, y: 178 },
    { x: first.left - 46, y: 126 },
  ], true);

  gorge.fillStyle(0x718060, 0.54);
  gorge.fillEllipse(center, 150, Math.max(150, first.right - first.left + 96), 54);

  [
    [first.left - 48, 76, 30, 0],
    [first.left - 22, 126, 24, 1],
    [first.left - 54, 160, 19, 0],
    [first.right + 48, 70, 28, 1],
    [first.right + 28, 120, 23, 0],
    [first.right + 54, 158, 18, 1],
  ].forEach(([x, y, radius, variant]) => addRock(scene, container, x, y, radius, variant));

  container.addAt(gorge, 0);
  return container;
}
