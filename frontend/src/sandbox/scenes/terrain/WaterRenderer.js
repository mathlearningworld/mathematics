function segmentPolygon(segment, inset = 0) {
  return [
    { x: segment.topLeft + inset, y: segment.top - 1 },
    { x: segment.topRight - inset, y: segment.top - 1 },
    { x: segment.bottomRight - inset, y: segment.top + segment.height + 1 },
    { x: segment.bottomLeft + inset, y: segment.top + segment.height + 1 },
  ];
}

export function createWaterRenderer(scene, geometry, depth = -16) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const deepWater = scene.add.graphics();
  const midWater = scene.add.graphics();
  const shallows = scene.add.graphics();
  const reflections = scene.add.graphics();
  const currents = scene.add.graphics();
  const foam = scene.add.graphics();

  geometry.segments.forEach((segment, index) => {
    deepWater.fillStyle(index % 4 < 2 ? 0x15536f : 0x195c78, 1);
    deepWater.fillPoints(segmentPolygon(segment), true);

    const width = Math.min(segment.topRight - segment.topLeft, segment.bottomRight - segment.bottomLeft);
    const innerInset = Math.max(18, width * 0.2);
    midWater.fillStyle(index % 3 === 0 ? 0x1f7897 : 0x226f8c, 0.72);
    midWater.fillPoints(segmentPolygon(segment, innerInset), true);

    const leftShallow = [
      { x: segment.topLeft, y: segment.top },
      { x: segment.topLeft + 13, y: segment.top },
      { x: segment.bottomLeft + 16, y: segment.top + segment.height },
      { x: segment.bottomLeft, y: segment.top + segment.height },
    ];
    const rightShallow = [
      { x: segment.topRight - 12, y: segment.top },
      { x: segment.topRight, y: segment.top },
      { x: segment.bottomRight, y: segment.top + segment.height },
      { x: segment.bottomRight - 15, y: segment.top + segment.height },
    ];
    shallows.fillStyle(index % 2 === 0 ? 0x65bac4 : 0x78c5c6, 0.42);
    shallows.fillPoints(leftShallow, true);
    shallows.fillPoints(rightShallow, true);

    if (index % 3 !== 1) {
      const y = segment.centerY + (index % 2 === 0 ? -7 : 8);
      const center = (segment.left + segment.right) / 2;
      const length = Math.min(58, Math.max(26, width * 0.34));
      const drift = index % 2 === 0 ? 4 : -3;
      currents.lineStyle(2, index % 5 === 0 ? 0xd8f6f5 : 0x87cfda, index % 5 === 0 ? 0.58 : 0.34);
      currents.lineBetween(center - length / 2, y, center + length / 2, y + drift);
      if (index % 5 === 0) {
        currents.lineBetween(center - length * 0.22, y + 9, center + length * 0.18, y + 11);
      }
    }

    if (index % 4 === 2) {
      const center = (segment.left + segment.right) / 2;
      reflections.lineStyle(3, 0xa9e2e8, 0.2);
      reflections.lineBetween(center - 22, segment.centerY - 15, center + 10, segment.centerY - 15);
    }
  });

  const first = geometry.segments[0];
  const waterfallCenter = (first.left + first.right) / 2;
  foam.fillStyle(0xe6fbfa, 0.72);
  foam.fillEllipse(waterfallCenter, 78, Math.max(58, first.right - first.left - 10), 22);
  foam.fillStyle(0xa8e1e6, 0.52);
  foam.fillEllipse(waterfallCenter, 103, Math.max(48, first.right - first.left - 24), 30);
  foam.fillStyle(0xffffff, 0.38);
  foam.fillCircle(waterfallCenter - 32, 88, 8);
  foam.fillCircle(waterfallCenter + 25, 92, 10);

  container.add([deepWater, midWater, shallows, reflections, currents, foam]);

  scene.tweens.add({
    targets: currents,
    y: 8,
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
