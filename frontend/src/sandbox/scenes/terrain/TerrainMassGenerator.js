import { STREAM, TILE_SIZE, WORLD_HEIGHT } from "../../config/worldContract.js";

const LEFT_CLUSTERS = Object.freeze([
  { x: -82, y: 42, scale: 1.08, variant: 0 },
  { x: -60, y: 210, scale: 0.92, variant: 1 },
  { x: -88, y: 690, scale: 1.02, variant: 2 },
  { x: -58, y: 874, scale: 0.88, variant: 0 },
]);

const RIGHT_CLUSTERS = Object.freeze([
  { x: 50, y: 92, scale: 1.02, variant: 1 },
  { x: 74, y: 260, scale: 1.12, variant: 2 },
  { x: 58, y: 710, scale: 0.98, variant: 0 },
  { x: 82, y: 892, scale: 0.86, variant: 1 },
]);

function addRock(scene, container, x, y, width, height, color, capColor, rotation = 0) {
  const rock = scene.add.container(x, y).setRotation(rotation);
  const shadow = scene.add.ellipse(6, height * 0.3, width * 1.08, height * 0.52, 0x22302f, 0.34);
  const body = scene.add.ellipse(0, 0, width, height, color, 0.98);
  const upper = scene.add.ellipse(-width * 0.08, -height * 0.18, width * 0.82, height * 0.46, capColor, 0.96);
  const moss = scene.add.ellipse(-width * 0.14, -height * 0.32, width * 0.48, Math.max(5, height * 0.12), 0x78925f, 0.88);
  rock.add([shadow, body, upper, moss]);
  container.add(rock);
}

function addCluster(scene, container, anchorX, anchorY, scale, variant, side) {
  const direction = side === "left" ? -1 : 1;
  const palettes = [
    [0x425150, 0x63716a],
    [0x485653, 0x6a776d],
    [0x3d4c4d, 0x5d6b67],
  ];
  const [bodyColor, capColor] = palettes[variant % palettes.length];

  addRock(scene, container, anchorX, anchorY, 60 * scale, 76 * scale, bodyColor, capColor, direction * -0.04);
  addRock(scene, container, anchorX + direction * 35 * scale, anchorY + 25 * scale, 43 * scale, 55 * scale, bodyColor, capColor, direction * 0.08);
  addRock(scene, container, anchorX - direction * 23 * scale, anchorY + 38 * scale, 31 * scale, 39 * scale, bodyColor, capColor, direction * -0.1);

  const pebbles = scene.add.graphics();
  pebbles.fillStyle(variant % 2 === 0 ? 0x75817b : 0x697671, 0.92);
  pebbles.fillEllipse(anchorX + direction * 48 * scale, anchorY + 57 * scale, 15 * scale, 10 * scale);
  pebbles.fillEllipse(anchorX - direction * 35 * scale, anchorY + 66 * scale, 11 * scale, 8 * scale);
  container.add(pebbles);
}

export function createTerrainMasses(scene, crossingProtectionZone, depth = -10) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const terraces = scene.add.graphics();

  LEFT_CLUSTERS.forEach((cluster) => {
    const y = Math.min(cluster.y, WORLD_HEIGHT - 92);
    if (y >= crossingProtectionZone.y && y <= crossingProtectionZone.y + crossingProtectionZone.height) return;
    addCluster(scene, container, STREAM.left + cluster.x, y, cluster.scale, cluster.variant, "left");
  });

  RIGHT_CLUSTERS.forEach((cluster) => {
    const y = Math.min(cluster.y, WORLD_HEIGHT - 92);
    if (y >= crossingProtectionZone.y && y <= crossingProtectionZone.y + crossingProtectionZone.height) return;
    addCluster(scene, container, STREAM.left + STREAM.width + cluster.x, y, cluster.scale, cluster.variant, "right");
  });

  terraces.fillStyle(0x8c805b, 0.31);
  terraces.fillEllipse(STREAM.left - 3.2 * TILE_SIZE, 13.4 * TILE_SIZE, 4.9 * TILE_SIZE, 2.35 * TILE_SIZE);
  terraces.fillEllipse(STREAM.left + STREAM.width + 3.4 * TILE_SIZE, 11.4 * TILE_SIZE, 5.4 * TILE_SIZE, 3.25 * TILE_SIZE);
  terraces.fillStyle(0xb4a06e, 0.23);
  terraces.fillEllipse(STREAM.left - 3 * TILE_SIZE, 13.1 * TILE_SIZE, 3.8 * TILE_SIZE, 1.7 * TILE_SIZE);
  terraces.fillEllipse(STREAM.left + STREAM.width + 3.2 * TILE_SIZE, 11.1 * TILE_SIZE, 4.3 * TILE_SIZE, 2.45 * TILE_SIZE);

  container.add(terraces);
  return container;
}
