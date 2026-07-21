export function createWaterRenderer(scene, geometry, depth = -16) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const base = scene.add.graphics();
  const currents = scene.add.graphics();
  const shallows = scene.add.graphics();

  geometry.segments.forEach((segment, index) => {
    const width = Math.max(24, segment.right - segment.left);

    base.fillStyle(index % 3 === 0 ? 0x1c607d : 0x216a86, 0.96);
    base.fillRect(segment.left, segment.top - 1, width, segment.height + 2);

    shallows.fillStyle(0x68b6bd, 0.35);
    shallows.fillRect(segment.left, segment.top, 8 + (index % 3) * 3, segment.height);
    shallows.fillRect(segment.right - 7 - (index % 2) * 4, segment.top, 7 + (index % 2) * 4, segment.height);

    if (index % 3 !== 1) {
      const y = segment.centerY + ((index % 2) * 10 - 5);
      const startX = segment.left + 18 + ((index * 13) % 24);
      const endX = Math.min(segment.right - 14, startX + 34 + (index % 4) * 8);
      currents.lineStyle(2, index % 4 === 0 ? 0xc9eff2 : 0x82cad8, index % 4 === 0 ? 0.52 : 0.34);
      currents.lineBetween(startX, y, endX, y);
      if (index % 4 === 0) currents.lineBetween(startX + 9, y + 8, Math.min(endX - 4, startX + 30), y + 8);
    }
  });

  const waterfallRunout = scene.add.graphics();
  const first = geometry.segments[0];
  waterfallRunout.fillStyle(0xdaf4f4, 0.62);
  waterfallRunout.fillEllipse((first.left + first.right) / 2, 92, Math.max(54, first.right - first.left - 24), 18);
  waterfallRunout.fillStyle(0x92d5df, 0.4);
  waterfallRunout.fillEllipse((first.left + first.right) / 2, 116, Math.max(44, first.right - first.left - 38), 24);

  container.add([base, shallows, currents, waterfallRunout]);

  scene.tweens.add({
    targets: currents,
    y: 7,
    alpha: { from: 0.72, to: 1 },
    duration: 2400,
    yoyo: true,
    repeat: -1,
    ease: "Sine.InOut",
  });

  return container;
}
