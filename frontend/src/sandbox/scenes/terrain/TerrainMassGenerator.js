import { STREAM, TILE_SIZE } from "../../config/worldContract.js";

const CLUSTERS = Object.freeze([
  { side: "left", sample: 2, offset: 58, scale: 1.05, variant: 0 },
  { side: "right", sample: 4, offset: 52, scale: 0.9, variant: 1 },
  { side: "left", sample: 8, offset: 66, scale: 0.82, variant: 1 },
  { side: "right", sample: 10, offset: 72, scale: 1.08, variant: 0 },
  { side: "left", sample: 21, offset: 62, scale: 0.96, variant: 0 },
  { side: "right", sample: 24, offset: 58, scale: 0.88, variant: 1 },
  { side: "left", sample: 28, offset: 70, scale: 0.9, variant: 1 },
]);

function isInsideZone(y, zone) {
  return y >= zone.y && y <= zone.y + zone.height;
}

function addRock(scene, container, x, y, radius, variant = 0) {
  const shadow = scene.add.ellipse(x + 5, y + radius * 0.45, radius * 2.15, radius * 0.78, 0x23302e, 0.34);
  const base = scene.add.circle(x, y, radius, variant ? 0x4b5956 : 0x445451, 1);
  const upper = scene.add.ellipse(x - radius * 0.16, y - radius * 0.25, radius * 1.45, radius * 0.74, variant ? 0x69766b : 0x606f64, 0.98);
  const moss = scene.add.ellipse(x - radius * 0.2, y - radius * 0.42, radius * 0.72, radius * 0.2, variant ? 0x748b5e : 0x6c8358, 0.88);
  container.add([shadow, base, upper, moss]);
}

function addGroundConnection(scene, container, edgeX, y, side, scale) {
  const direction = side === "left" ? -1 : 1;
  const stain = scene.add.ellipse(edgeX + direction * 34 * scale, y + 12, 84 * scale, 32 * scale, 0x566653, 0.26);
  const contact = scene.add.ellipse(edgeX + direction * 15 * scale, y + 10, 44 * scale, 18 * scale, 0x27332f, 0.28);
  container.add([stain, contact]);

  for (let index = 0; index < 3; index += 1) {
    const pebble = scene.add.circle(
      edgeX + direction * (10 + index * 12) * scale,
      y + 7 + (index % 2) * 8,
      (4 + (index % 2) * 2) * scale,
      index % 2 ? 0x748078 : 0x65716c,
      0.92,
    );
    container.add(pebble);
  }
}

function addCluster(scene, container, geometry, spec) {
  const samples = spec.side === "left" ? geometry.leftEdge : geometry.rightEdge;
  const point = samples[Math.min(spec.sample, samples.length - 1)];
  if (!point || isInsideZone(point.y, geometry.crossingProtectionZone)) return;

  const direction = spec.side === "left" ? -1 : 1;
  const anchorX = point.x + direction * spec.offset;
  const anchorY = point.y;
  const scale = spec.scale;

  addGroundConnection(scene, container, point.x, anchorY, spec.side, scale);
  addRock(scene, container, anchorX, anchorY, 29 * scale, spec.variant);
  addRock(scene, container, anchorX + direction * 28 * scale, anchorY + 18 * scale, 20 * scale, (spec.variant + 1) % 2);
  addRock(scene, container, anchorX - direction * 18 * scale, anchorY + 28 * scale, 15 * scale, spec.variant);
}

function addGorgeShoulders(scene, container, geometry) {
  const left = geometry.leftEdge[2];
  const right = geometry.rightEdge[2];
  if (!left || !right) return;

  const gorgeShadow = scene.add.ellipse((left.x + right.x) / 2, 112, right.x - left.x + 92, 76, 0x1f2b2a, 0.34);
  container.add(gorgeShadow);

  [
    { x: left.x - 38, side: "left", variant: 0 },
    { x: right.x + 38, side: "right", variant: 1 },
  ].forEach((shoulder) => {
    const direction = shoulder.side === "left" ? -1 : 1;
    addRock(scene, container, shoulder.x, 88, 34, shoulder.variant);
    addRock(scene, container, shoulder.x + direction * 28, 118, 24, (shoulder.variant + 1) % 2);
    addRock(scene, container, shoulder.x - direction * 10, 142, 17, shoulder.variant);
  });
}

export function createTerrainMasses(scene, geometry, depth = -10) {
  const container = scene.add.container(0, 0).setDepth(depth);
  const terraces = scene.add.graphics();

  addGorgeShoulders(scene, container, geometry);
  CLUSTERS.forEach((spec) => addCluster(scene, container, geometry, spec));

  terraces.fillStyle(0x887b59, 0.28);
  terraces.fillEllipse(STREAM.left - 3.2 * TILE_SIZE, 14 * TILE_SIZE, 5.4 * TILE_SIZE, 2.6 * TILE_SIZE);
  terraces.fillEllipse(STREAM.left + STREAM.width + 3.2 * TILE_SIZE, 11.5 * TILE_SIZE, 6 * TILE_SIZE, 3.6 * TILE_SIZE);
  terraces.fillStyle(0xb09a68, 0.2);
  terraces.fillEllipse(STREAM.left - 2.7 * TILE_SIZE, 14 * TILE_SIZE, 3.8 * TILE_SIZE, 1.7 * TILE_SIZE);
  terraces.fillEllipse(STREAM.left + STREAM.width + 3.1 * TILE_SIZE, 11.5 * TILE_SIZE, 4.5 * TILE_SIZE, 2.5 * TILE_SIZE);

  container.add(terraces);
  return container;
}