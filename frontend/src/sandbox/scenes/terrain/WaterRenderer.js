function buildRiverPolygon(leftEdge, rightEdge) {
  return [...leftEdge, ...rightEdge.slice().reverse()];
}

function drawEdgeStrip(graphics, outerEdge, innerEdge, color, alpha) {
  graphics.fillStyle(color, alpha);
  graphics.fillPoints([...outerEdge, ...innerEdge.slice().reverse()], true);
}

function edgePointAtY(edge, y) {
  const upperIndex = edge.findIndex((point) => point.y >= y);
  if (upperIndex <= 0) return edge[0];

  const upper = edge[upperIndex];
  const lower = edge[upperIndex - 1];
  const ratio = (y - lower.y) / Math.max(1, upper.y - lower.y);
  return {
    x: lower.x + (upper.x - lower.x) * ratio,
    y,
  };
}

export function createWaterRenderer(scene, geometry, depth = -16) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const baseWater = scene.add.graphics();
  const deepWater = scene.add.graphics();
  const midWater = scene.add.graphics();
  const shallows = scene.add.graphics();
  const reflections = scene.add.graphics();
  const currents = scene.add.graphics();
  const foam = scene.add.graphics();

  baseWater.fillStyle(0x1b6682, 1);
  baseWater.fillPoints(buildRiverPolygon(geometry.leftEdge, geometry.rightEdge), true);

  drawEdgeStrip(shallows, geometry.leftEdge, geometry.midWaterEdges.left, 0x72c3c8, 0.46);
  drawEdgeStrip(shallows, geometry.rightEdge, geometry.midWaterEdges.right, 0x65b6c2, 0.42);

  midWater.fillStyle(0x217b98, 0.7);
  midWater.fillPoints(buildRiverPolygon(geometry.midWaterEdges.left, geometry.midWaterEdges.right), true);

  deepWater.fillStyle(0x124d6a, 0.86);
  deepWater.fillPoints(buildRiverPolygon(geometry.deepWaterEdges.left, geometry.deepWaterEdges.right), true);

  const currentRows = [126, 208, 304, 386, 548, 676, 804, 932];
  currentRows.forEach((y, index) => {
    const left = edgePointAtY(geometry.deepWaterEdges.left, y);
    const right = edgePointAtY(geometry.deepWaterEdges.right, y);
    const width = right.x - left.x;
    const center = (left.x + right.x) / 2;
    const length = Math.max(24, Math.min(66, width * (index % 3 === 0 ? 0.72 : 0.48)));
    const drift = index % 2 === 0 ? 4 : -3;

    currents.lineStyle(2, index % 3 === 0 ? 0xd8f6f5 : 0x8bd4df, index % 3 === 0 ? 0.58 : 0.36);
    currents.lineBetween(center - length / 2, y, center + length / 2, y + drift);
    if (index % 3 === 0) {
      currents.lineBetween(center - length * 0.2, y + 9, center + length * 0.18, y + 11);
    }
  });

  [170, 470, 740].forEach((y, index) => {
    const left = edgePointAtY(geometry.midWaterEdges.left, y);
    const right = edgePointAtY(geometry.midWaterEdges.right, y);
    const center = (left.x + right.x) / 2;
    reflections.lineStyle(3, 0xb8e8eb, index === 1 ? 0.24 : 0.18);
    reflections.lineBetween(center - 27, y, center + 8, y + 1);
  });

  const waterfallLeft = edgePointAtY(geometry.leftEdge, 76);
  const waterfallRight = edgePointAtY(geometry.rightEdge, 76);
  const waterfallCenter = (waterfallLeft.x + waterfallRight.x) / 2;
  const runoutWidth = Math.max(62, waterfallRight.x - waterfallLeft.x - 8);

  foam.fillStyle(0xe9fbfa, 0.76);
  foam.fillEllipse(waterfallCenter, 78, runoutWidth, 24);
  foam.fillStyle(0xa8e3e8, 0.54);
  foam.fillEllipse(waterfallCenter, 105, runoutWidth * 0.78, 30);
  foam.fillStyle(0xffffff, 0.42);
  foam.fillCircle(waterfallCenter - runoutWidth * 0.24, 89, 8);
  foam.fillCircle(waterfallCenter + runoutWidth * 0.19, 93, 10);
  foam.fillCircle(waterfallCenter + 2, 111, 6);

  container.add([baseWater, shallows, midWater, deepWater, reflections, currents, foam]);

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
