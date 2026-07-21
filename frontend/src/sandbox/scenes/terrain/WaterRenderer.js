function polygonFromEdges(leftEdge, rightEdge, leftInset = 0, rightInset = 0) {
  return [
    ...leftEdge.map((point) => ({ x: point.x + leftInset, y: point.y })),
    ...[...rightEdge].reverse().map((point) => ({ x: point.x - rightInset, y: point.y })),
  ];
}

function pointAtProgress(points, progress) {
  const index = Math.min(points.length - 1, Math.max(0, Math.round(progress * (points.length - 1))));
  return points[index];
}

export function createWaterRenderer(scene, geometry, depth = -16) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const baseWater = scene.add.graphics();
  const shallowWater = scene.add.graphics();
  const midWater = scene.add.graphics();
  const deepWater = scene.add.graphics();
  const gorgePool = scene.add.graphics();
  const reflections = scene.add.graphics();
  const currents = scene.add.graphics();
  const foam = scene.add.graphics();

  const fullPolygon = polygonFromEdges(geometry.leftEdge, geometry.rightEdge);
  const shallowPolygon = polygonFromEdges(geometry.leftEdge, geometry.rightEdge, 8, 8);
  const midPolygon = polygonFromEdges(geometry.leftEdge, geometry.rightEdge, 20, 20);
  const deepPolygon = polygonFromEdges(geometry.leftEdge, geometry.rightEdge, 38, 38);

  baseWater.fillStyle(0x1b6682, 1);
  baseWater.fillPoints(fullPolygon, true);

  shallowWater.fillStyle(0x61b6c2, 0.55);
  shallowWater.fillPoints(shallowPolygon, true);

  midWater.fillStyle(0x237e9b, 0.72);
  midWater.fillPoints(midPolygon, true);

  deepWater.fillStyle(0x124e6b, 0.88);
  deepWater.fillPoints(deepPolygon, true);

  const top = geometry.edgeSamples[0];
  const pool = geometry.edgeSamples[Math.min(5, geometry.edgeSamples.length - 1)];
  gorgePool.fillStyle(0x0f526f, 0.9);
  gorgePool.fillPoints([
    { x: top.center - 42, y: 0 },
    { x: top.center + 42, y: 0 },
    { x: pool.right - 8, y: pool.y + 34 },
    { x: pool.left + 8, y: pool.y + 34 },
  ], true);
  gorgePool.fillStyle(0x2c8daa, 0.42);
  gorgePool.fillEllipse(pool.center, pool.y + 18, Math.max(86, pool.width - 18), 52);

  geometry.edgeSamples.forEach((sample, index) => {
    if (index % 2 !== 0 || index < 3) return;

    const halfLength = Math.min(38, Math.max(18, sample.width * 0.18));
    const drift = sample.centerOffset * 0.25;
    const y = sample.y + (index % 4 === 0 ? 8 : -5);
    currents.lineStyle(2, index % 6 === 0 ? 0xd9f5f3 : 0x83cbd6, index % 6 === 0 ? 0.58 : 0.32);
    currents.lineBetween(sample.center - halfLength, y, sample.center + halfLength + drift, y + Math.sign(drift || 1) * 3);

    if (index % 6 === 0) {
      currents.lineBetween(sample.center - 13, y + 9, sample.center + 17, y + 11);
    }
  });

  [0.18, 0.43, 0.68, 0.86].forEach((progress, index) => {
    const left = pointAtProgress(geometry.leftEdge, progress);
    const right = pointAtProgress(geometry.rightEdge, progress);
    const center = (left.x + right.x) / 2;
    reflections.lineStyle(index % 2 === 0 ? 3 : 2, 0xb8e9ec, index % 2 === 0 ? 0.2 : 0.14);
    reflections.lineBetween(center - 24 - index * 3, left.y, center + 9 + index * 5, left.y + 1);
  });

  foam.fillStyle(0xe9fbfa, 0.78);
  foam.fillEllipse(top.center, 74, 92, 22);
  foam.fillStyle(0xb1e6e9, 0.58);
  foam.fillEllipse(pool.center, pool.y + 14, Math.max(66, pool.width - 38), 30);
  foam.fillStyle(0xffffff, 0.42);
  foam.fillCircle(top.center - 34, 82, 8);
  foam.fillCircle(top.center - 4, 90, 11);
  foam.fillCircle(top.center + 30, 83, 7);

  container.add([
    baseWater,
    shallowWater,
    midWater,
    deepWater,
    gorgePool,
    reflections,
    currents,
    foam,
  ]);

  scene.tweens.add({
    targets: currents,
    y: 7,
    alpha: { from: 0.68, to: 1 },
    duration: 2100,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });

  scene.tweens.add({
    targets: reflections,
    alpha: { from: 0.5, to: 0.95 },
    duration: 3100,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });

  return container;
}