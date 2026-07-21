import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

export function createTerrainMasses(scene, crossingProtectionZone, depth = -10) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const masses = scene.add.graphics();

  const rows = [1, 4, 8, 13, 20, 25, 29];
  rows.forEach((row, index) => {
    const y = row * TILE_SIZE;
    const inCrossing = y >= crossingProtectionZone.y && y <= crossingProtectionZone.y + crossingProtectionZone.height;
    if (inCrossing) return;

    const leftWidth = 34 + (index % 3) * 12;
    const rightWidth = 30 + ((index + 1) % 3) * 14;

    masses.fillStyle(index % 2 === 0 ? 0x48584f : 0x526258, 0.92);
    masses.fillRoundedRect(STREAM.left - leftWidth - 20, y, leftWidth, 54 + (index % 2) * 18, 12);
    masses.fillRoundedRect(STREAM.left + STREAM.width + 20, Math.min(y + 18, WORLD_HEIGHT - 72), rightWidth, 48 + ((index + 1) % 2) * 20, 12);

    masses.fillStyle(0x6f8469, 0.58);
    masses.fillRect(STREAM.left - 24, y + 8, 18, 7);
    masses.fillRect(STREAM.left + STREAM.width + 6, Math.min(y + 30, WORLD_HEIGHT - 18), 18, 7);
  });

  container.add(masses);
  return container;
}
