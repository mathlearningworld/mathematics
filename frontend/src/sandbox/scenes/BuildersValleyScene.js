import Phaser from "phaser";
import {
  PLAYER_RUN_MULTIPLIER,
  PLAYER_SPEED,
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";
import { resolveMovement } from "../domain/movement.js";
import { PlayerInput } from "../input/PlayerInput.js";

const COLORS = Object.freeze({
  grass: 0x5f9f55,
  grassAlt: 0x6eae61,
  water: 0x3d8fc4,
  waterLight: 0x72c4e8,
  soil: 0x8b6848,
  tree: 0x2f6f3e,
  trunk: 0x795338,
  stone: 0x707b82,
  player: 0xf5b642,
  outline: 0x253238,
});

export class BuildersValleyScene extends Phaser.Scene {
  constructor() {
    super({ key: "BuildersValleyScene" });
    this.player = null;
    this.playerInput = null;
    this.obstacles = null;
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor("#315f45");

    this._drawGround();
    this._drawStream();
    this.obstacles = this.physics.add.staticGroup();
    this._createResourceLandmarks();
    this._createPlayer();
    this._createHotbar();

    this.playerInput = new PlayerInput(this);
    this.physics.add.collider(this.player, this.obstacles);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);

    window.__BUILDERS_VALLEY__ = {
      scene: this,
      getPlayerPosition: () => ({ x: this.player.x, y: this.player.y }),
    };
  }

  update() {
    const intent = this.playerInput.read();
    const speed = PLAYER_SPEED * (intent.running ? PLAYER_RUN_MULTIPLIER : 1);
    const movement = resolveMovement(intent, speed);

    this.player.body.setVelocity(movement.velocityX, movement.velocityY);
    this.player.setRotation(
      movement.moving
        ? Math.atan2(movement.velocityY, movement.velocityX) + Math.PI / 2
        : this.player.rotation,
    );
  }

  _drawGround() {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.grass, 1);
    graphics.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    graphics.fillStyle(COLORS.grassAlt, 0.35);
    for (let y = 0; y < WORLD_HEIGHT; y += TILE_SIZE * 2) {
      for (let x = (y / TILE_SIZE) % 4 === 0 ? 0 : TILE_SIZE; x < WORLD_WIDTH; x += TILE_SIZE * 2) {
        graphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }

    graphics.lineStyle(1, 0xffffff, 0.035);
    for (let x = 0; x <= WORLD_WIDTH; x += TILE_SIZE) {
      graphics.lineBetween(x, 0, x, WORLD_HEIGHT);
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += TILE_SIZE) {
      graphics.lineBetween(0, y, WORLD_WIDTH, y);
    }
  }

  _drawStream() {
    const stream = this.add.graphics();
    stream.fillStyle(COLORS.soil, 0.55);
    stream.fillRect(STREAM.left - 8, STREAM.top, STREAM.width + 16, STREAM.height);
    stream.fillStyle(COLORS.water, 1);
    stream.fillRect(STREAM.left, STREAM.top, STREAM.width, STREAM.height);

    stream.lineStyle(3, COLORS.waterLight, 0.45);
    for (let y = TILE_SIZE; y < WORLD_HEIGHT; y += TILE_SIZE * 2) {
      stream.lineBetween(STREAM.left + 12, y, STREAM.left + STREAM.width - 12, y + 8);
    }
  }

  _createResourceLandmarks() {
    const trees = [
      [5, 5], [8, 10], [13, 4], [14, 18], [7, 24],
      [34, 6], [39, 12], [43, 22], [31, 25],
    ];
    const stones = [[10, 15], [17, 8], [37, 18], [42, 7]];

    trees.forEach(([column, row]) => this._createTree(column, row));
    stones.forEach(([column, row]) => this._createStone(column, row));
  }

  _createTree(column, row) {
    const x = column * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const tree = this.add.container(x, y);
    const crown = this.add.circle(0, -10, 18, COLORS.tree);
    const trunk = this.add.rectangle(0, 12, 10, 22, COLORS.trunk);
    tree.add([trunk, crown]);
    tree.setSize(36, 46);
    this.physics.add.existing(tree, true);
    this.obstacles.add(tree);
  }

  _createStone(column, row) {
    const x = column * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const stone = this.add.rectangle(x, y, 30, 24, COLORS.stone);
    stone.setStrokeStyle(3, COLORS.outline, 0.45);
    this.physics.add.existing(stone, true);
    this.obstacles.add(stone);
  }

  _createPlayer() {
    const player = this.add.container(6 * TILE_SIZE, 8 * TILE_SIZE);
    const shadow = this.add.ellipse(0, 12, 24, 10, 0x000000, 0.22);
    const body = this.add.rectangle(0, 0, 22, 28, COLORS.player);
    body.setStrokeStyle(3, COLORS.outline);
    const facing = this.add.triangle(0, -18, -6, 5, 6, 5, 0, -7, 0xffffff);
    player.add([shadow, body, facing]);
    player.setSize(24, 30);
    player.setDepth(20);

    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setDrag(900, 900);
    this.player = player;
  }

  _createHotbar() {
    const camera = this.cameras.main;
    const hotbar = this.add.container(camera.width / 2, camera.height - 42);
    hotbar.setScrollFactor(0);
    hotbar.setDepth(100);

    const labels = ["✋", "🪵", "🪨", "📏", "✂"];
    labels.forEach((label, index) => {
      const x = (index - 2) * 58;
      const slot = this.add.rectangle(x, 0, 50, 50, 0x17252c, 0.9);
      slot.setStrokeStyle(index === 0 ? 3 : 1, index === 0 ? 0xf5d76e : 0xffffff, 0.9);
      const icon = this.add.text(x, 0, label, { fontSize: "24px" }).setOrigin(0.5);
      hotbar.add([slot, icon]);
    });

    const hint = this.add
      .text(18, 18, "WASD / ลูกศร   •   Shift วิ่ง", {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "#17252ccc",
        padding: { x: 10, y: 7 },
      })
      .setScrollFactor(0)
      .setDepth(100);
    hotbar.add(hint);
  }
}
