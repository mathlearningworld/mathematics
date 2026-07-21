export function createShorelines(scene, geometry, depth = -9) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const banks = scene.add.graphics();

  geometry.segments.forEach((segment, index) => {
    const crossing = segment.centerY >= geometry.crossingProtectionZone.y && segment.centerY <= geometry.crossingProtectionZone.y + geometry.crossingProtectionZone.height;
    const mass = crossing ? 10 : 18 + (index % 3) * 6;

    banks.fillStyle(index % 2 === 0 ? 0x53665a : 0x5d6d60, 0.96);
    banks.fillRect(segment.left - mass, segment.top - 1, mass, segment.height + 2);
    banks.fillRect(segment.right, segment.top - 1, mass - (index % 2) * 4, segment.height + 2);

    banks.fillStyle(0x78906d, 0.72);
    banks.fillRect(segment.left - 5, segment.top, 5, segment.height);
    banks.fillRect(segment.right, segment.top, 5, segment.height);
  });

  container.add(banks);
  return container;
}
