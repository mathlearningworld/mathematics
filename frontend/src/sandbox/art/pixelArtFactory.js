import Phaser from "phaser";

export const ART_COLORS = Object.freeze({
  grass: 0x639b52,
  grassLight: 0x79b85d,
  grassDark: 0x477b3c,
  water: 0x397fa7,
  waterLight: 0x65b6cf,
  bank: 0x9a7645,
  bankLight: 0xbc9558,
  outline: 0x202e32,
  shadow: 0x17252c,
  wood: 0x865437,
  woodLight: 0xb87945,
  stone: 0x66727a,
  stoneLight: 0x96a1a5,
  leaf: 0x2f6f3e,
  leafLight: 0x4c934a,
  player: 0xe8a83b,
  playerLight: 0xffd166,
  cloth: 0x35627a,
  highlight: 0xf5d76e,
});

function pixelRect(scene, x, y, width, height, color, alpha = 1) {
  return scene.add.rectangle(x, y, width, height, color, alpha).setOrigin(0.5);
}

export function drawPixelWorld(scene, { worldWidth, worldHeight, tileSize, stream }) {
  const ground = scene.add.graphics().setDepth(-30);
  ground.fillStyle(ART_COLORS.grass, 1);
  ground.fillRect(0, 0, worldWidth, worldHeight);

  // Sparse, deterministic clusters avoid a debug-grid appearance.
  for (let row = 0; row < worldHeight / tileSize; row += 1) {
    for (let column = 0; column < worldWidth / tileSize; column += 1) {
      const seed = (column * 17 + row * 31) % 11;
      if (seed === 0 || seed === 4) {
        const x = column * tileSize + 6 + ((row * 7) % 12);
        const y = row * tileSize + 8 + ((column * 5) % 10);
        ground.fillStyle(seed === 0 ? ART_COLORS.grassLight : ART_COLORS.grassDark, 0.52);
        ground.fillRect(x, y, 7, 3);
        ground.fillRect(x + 3, y - 3, 3, 3);
      }
    }
  }

  const water = scene.add.graphics().setDepth(-20);
  water.fillStyle(ART_COLORS.bank, 1);
  water.fillRect(stream.left - 10, stream.top, stream.width + 20, stream.height);
  water.fillStyle(ART_COLORS.bankLight, 1);
  water.fillRect(stream.left - 6, stream.top, stream.width + 12, stream.height);
  water.fillStyle(ART_COLORS.water, 1);
  water.fillRect(stream.left, stream.top, stream.width, stream.height);

  water.fillStyle(ART_COLORS.waterLight, 0.66);
  for (let y = 22; y < worldHeight; y += 54) {
    const offset = ((y / 54) % 2) * 10;
    water.fillRect(stream.left + 14 + offset, y, 54, 3);
    water.fillRect(stream.left + 82 + offset, y + 5, 38, 3);
  }

  water.fillStyle(0xffffff, 0.12);
  water.fillRect(stream.left + 4, 0, 4, worldHeight);
  return { ground, water };
}

export function createPixelTree(scene, x, y, variant = 0) {
  const tree = scene.add.container(x, y);
  const shadow = scene.add.ellipse(0, -1, 38, 14, ART_COLORS.shadow, 0.24);
  const trunkDark = pixelRect(scene, 0, -15, 14, 31, ART_COLORS.outline);
  const trunk = pixelRect(scene, 0, -17, 10, 29, ART_COLORS.wood);
  const trunkLight = pixelRect(scene, -3, -20, 3, 18, ART_COLORS.woodLight);
  const crownBack = pixelRect(scene, variant ? 3 : -3, -43, 34, 25, ART_COLORS.leaf);
  const crownLeft = pixelRect(scene, -14, -37, 18, 22, ART_COLORS.leaf);
  const crownRight = pixelRect(scene, 13, -38, 18, 23, ART_COLORS.leaf);
  const crownTop = pixelRect(scene, variant ? 5 : -5, -56, 22, 17, ART_COLORS.leafLight);
  const leafGlint = pixelRect(scene, -11, -48, 7, 5, ART_COLORS.grassLight, 0.72);

  tree.add([shadow, trunkDark, trunk, trunkLight, crownBack, crownLeft, crownRight, crownTop, leafGlint]);
  tree.setSize(38, 26);
  tree.setData("artAnchor", "bottom-center");
  return tree;
}

export function createPixelStone(scene, x, y, variant = 0) {
  const stone = scene.add.container(x, y);
  const shadow = scene.add.ellipse(0, 3, 34, 12, ART_COLORS.shadow, 0.22);
  const base = pixelRect(scene, 0, -7, 30, 20, ART_COLORS.outline);
  const body = pixelRect(scene, 0, -9, 26, 17, ART_COLORS.stone);
  const top = pixelRect(scene, variant ? 5 : -5, -14, 14, 6, ART_COLORS.stoneLight);
  const facet = pixelRect(scene, variant ? -7 : 7, -6, 7, 7, 0x536168);
  stone.add([shadow, base, body, top, facet]);
  stone.setSize(32, 24);
  stone.setData("artAnchor", "bottom-center");
  return stone;
}

export function createPixelPlayer(scene, x, y) {
  const player = scene.add.container(x, y);
  const shadow = scene.add.ellipse(0, 1, 25, 9, ART_COLORS.shadow, 0.26);
  const avatar = scene.add.container(0, -4);
  const legs = pixelRect(scene, 0, -7, 17, 10, ART_COLORS.outline);
  const boots = pixelRect(scene, 0, -3, 21, 5, ART_COLORS.shadow);
  const body = pixelRect(scene, 0, -19, 22, 19, ART_COLORS.cloth);
  const belt = pixelRect(scene, 0, -14, 22, 4, ART_COLORS.wood);
  const headOutline = pixelRect(scene, 0, -34, 22, 20, ART_COLORS.outline);
  const head = pixelRect(scene, 0, -35, 18, 17, ART_COLORS.player);
  const light = pixelRect(scene, -5, -39, 5, 5, ART_COLORS.playerLight);
  const hair = pixelRect(scene, 3, -44, 18, 5, ART_COLORS.wood);
  const eye = pixelRect(scene, 5, -34, 3, 3, ART_COLORS.outline);
  const backpack = pixelRect(scene, -13, -20, 6, 15, ART_COLORS.wood);
  const heldItem = scene.add.container(15, -16);

  avatar.add([backpack, legs, boots, body, belt, headOutline, head, light, hair, eye, heldItem]);
  player.add([shadow, avatar]);
  player.setSize(22, 24);
  player.setData({ artAnchor: "bottom-center", avatar, heldItem, eye, backpack });

  player.setFacing = (direction) => {
    const facingLeft = direction === "left";
    avatar.setScale(facingLeft ? -1 : 1, 1);
  };
  player.setWalkingFrame = (time, moving) => {
    avatar.y = -4 + (moving ? Math.round(Math.sin(time * 0.018)) : 0);
  };
  return player;
}

export function setHeldItemVisual(scene, holder, itemId) {
  const heldItem = holder.getData("heldItem");
  heldItem.removeAll(true);
  if (itemId === "hand") return;

  if (itemId === "wood" || itemId === "stone") {
    const color = itemId === "wood" ? ART_COLORS.wood : ART_COLORS.stone;
    heldItem.add(pixelRect(scene, 0, 0, 10, 10, color));
    return;
  }

  const handle = pixelRect(scene, -2, 2, 4, 15, ART_COLORS.woodLight);
  handle.setAngle(-34);
  const head =
    itemId === "axe"
      ? pixelRect(scene, 3, -4, 11, 7, ART_COLORS.stoneLight)
      : pixelRect(scene, 2, -4, 14, 4, ART_COLORS.stoneLight);
  head.setAngle(-34);
  heldItem.add([handle, head]);
}

export function createPlacedBlock(scene, x, y, material) {
  const block = scene.add.container(x, y);
  const main = material === "wood" ? ART_COLORS.wood : ART_COLORS.stone;
  const light = material === "wood" ? ART_COLORS.woodLight : ART_COLORS.stoneLight;
  const shadow = scene.add.ellipse(0, 9, 29, 9, ART_COLORS.shadow, 0.22);
  const front = pixelRect(scene, 0, 1, 28, 22, ART_COLORS.outline);
  const face = pixelRect(scene, 0, -1, 24, 17, main);
  const top = pixelRect(scene, 0, -10, 24, 6, light);
  const seam = pixelRect(scene, material === "wood" ? 6 : -6, -1, 3, 15, ART_COLORS.outline, 0.28);
  block.add([shadow, front, face, top, seam]);
  block.setSize(28, 22);
  block.setData({ material, artAnchor: "bottom-center" });
  return block;
}

export function createHotbarIcon(scene, itemId, x, y) {
  const icon = scene.add.container(x, y);
  if (itemId === "hand") {
    icon.add([
      pixelRect(scene, 0, 4, 15, 14, ART_COLORS.player),
      pixelRect(scene, -5, -5, 4, 13, ART_COLORS.playerLight),
      pixelRect(scene, 1, -7, 4, 15, ART_COLORS.playerLight),
      pixelRect(scene, 7, -4, 4, 12, ART_COLORS.playerLight),
    ]);
  } else if (itemId === "wood" || itemId === "stone") {
    const color = itemId === "wood" ? ART_COLORS.wood : ART_COLORS.stone;
    const light = itemId === "wood" ? ART_COLORS.woodLight : ART_COLORS.stoneLight;
    icon.add([pixelRect(scene, 0, 3, 21, 18, color), pixelRect(scene, 0, -7, 21, 5, light)]);
  } else {
    const handle = pixelRect(scene, -2, 3, 4, 27, ART_COLORS.woodLight);
    handle.setAngle(-38);
    const head =
      itemId === "axe"
        ? pixelRect(scene, 6, -7, 15, 9, ART_COLORS.stoneLight)
        : pixelRect(scene, 4, -8, 20, 5, ART_COLORS.stoneLight);
    head.setAngle(-38);
    icon.add([handle, head]);
  }
  return icon;
}

export function createTargetBrackets(scene) {
  const target = scene.add.graphics();
  target.lineStyle(3, ART_COLORS.highlight, 1);
  const d = 22;
  const arm = 8;
  target.lineBetween(-d, -d, -d + arm, -d);
  target.lineBetween(-d, -d, -d, -d + arm);
  target.lineBetween(d, -d, d - arm, -d);
  target.lineBetween(d, -d, d, -d + arm);
  target.lineBetween(-d, d, -d + arm, d);
  target.lineBetween(-d, d, -d, d - arm);
  target.lineBetween(d, d, d - arm, d);
  target.lineBetween(d, d, d, d - arm);
  return target;
}

export function spawnPixelBurst(scene, x, y, material) {
  const color =
    material === "wood"
      ? ART_COLORS.woodLight
      : material === "stone"
        ? ART_COLORS.stoneLight
        : ART_COLORS.grassLight;
  for (let index = 0; index < 6; index += 1) {
    const particle = scene.add.rectangle(x, y - 8, 4, 4, color).setDepth(y + 500);
    const angle = (Math.PI * 2 * index) / 6;
    scene.tweens.add({
      targets: particle,
      x: x + Math.cos(angle) * (16 + (index % 2) * 7),
      y: y - 8 + Math.sin(angle) * 14,
      alpha: 0,
      duration: 260,
      ease: "Quad.Out",
      onComplete: () => particle.destroy(),
    });
  }
}

export function createAmbientCritter(scene, x, y) {
  const critter = scene.add.container(x, y).setDepth(y);
  const shadow = scene.add.ellipse(0, 5, 17, 6, ART_COLORS.shadow, 0.18);
  const body = pixelRect(scene, 0, 0, 12, 9, 0xb8df7f);
  const eye = pixelRect(scene, 4, -2, 2, 2, ART_COLORS.outline);
  critter.add([shadow, body, eye]);
  scene.tweens.add({
    targets: critter,
    x: x + 42,
    yoyo: true,
    repeat: -1,
    duration: 2200,
    ease: "Sine.InOut",
  });
  return critter;
}
