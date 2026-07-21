import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const LEFT_MASSES = Object.freeze([
  { x: -104, y: 34, width: 92, height: 112 },
  { x: -82, y: 214, width: 72, height: 132 },
  { x: -112, y: 650, width: 108, height: 126 },
  { x: -76, y: 842, width: 74, height: 118 },
]);

const RIGHT_MASSES = Object.freeze([
  { x: 18, y: 86, width: 84, height: 126 },
  { x: 34, y: 258, width: 106, height: 112 },
  { x: 20, y: 686, width: 88, height: 138 },
  { x: 48, y: 876, width: 74, height: 104 },
]);

function addMass(scene, container, x, y, width, height, variant) {
  const mass = scene.add.container(x, y);
  const shadow = scene.add.rectangle(7, 9, width + 12, height + 12, 0x263331, 0.38).setOrigin(0, 0);
  const face = scene.add.rectangle(0, 0, width, height, variant ? 0x485754 : 0x3f4f4e, 0.98).setOrigin(0, 0);
  const upper = scene.add.rectangle(4, 4, width - 8, Math.max(18, height * 0.28), variant ? 0x65745f : 0x596a58, 0.95).setOrigin(0, 0);
  const grass = scene.add.rectangle(7, 3, width - 14, 7, variant ? 0x78945e : 0x6d8957, 0.92).setOrigin(0, 0);
  mass.add([shadow, face, upper, grass]);
  container.add(mass);
}

export function createTerrainMasses(scene, crossingProtectionZone, depth = -10) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const terraces = scene.add.graphics();

  LEFT_MASSES.forEach((mass, index) => {
    const y = Math.min(mass.y, WORLD_HEIGHT - mass.height - 8);
    const centerY = y + mass.height / 2;
    if (centerY >= crossingProtectionZone.y && centerY <= crossingProtectionZone.y + crossingProtectionZone.height) return;
    addMass(scene, container, STREAM.left + mass.x, y, mass.width, mass.height, index % 2);
  });

  RIGHT_MASSES.forEach((mass, index) => {
    const y = Math.min(mass.y, WORLD_HEIGHT - mass.height - 8);
    const centerY = y + mass.height / 2;
    if (centerY >= crossingProtectionZone.y && centerY <= crossingProtectionZone.y + crossingProtectionZone.height) return;
    addMass(scene, container, STREAM.left + STREAM.width + mass.x, y, mass.width, mass.height, (index + 1) % 2);
  });

  terraces.fillStyle(0x8c805b, 0.34);
  terraces.fillRoundedRect(STREAM.left - 5 * TILE_SIZE, 12 * TILE_SIZE, 4 * TILE_SIZE, 3 * TILE_SIZE, 16);
  terraces.fillRoundedRect(STREAM.left + STREAM.width + TILE_SIZE, 9 * TILE_SIZE, 5 * TILE_SIZE, 5 * TILE_SIZE, 18);
  terraces.fillStyle(0xb19a68, 0.25);
  terraces.fillRoundedRect(STREAM.left - 4 * TILE_SIZE, 12.5 * TILE_SIZE, 3 * TILE_SIZE, 2 * TILE_SIZE, 12);
  terraces.fillRoundedRect(STREAM.left + STREAM.width + 1.5 * TILE_SIZE, 9.5 * TILE_SIZE, 4 * TILE_SIZE, 4 * TILE_SIZE, 14);

  container.add(terraces);
  return container;
}
