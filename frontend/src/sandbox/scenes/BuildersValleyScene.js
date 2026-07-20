import Phaser from "phaser";
import {
  PLAYER_RUN_MULTIPLIER,
  PLAYER_SPEED,
  STREAM,
  TILE_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../config/worldContract.js";
import { addResource, consumeResource, createInventory } from "../domain/inventory.js";
import { resolveMovement } from "../domain/movement.js";
import { PlayerInput } from "../input/PlayerInput.js";

const HOTBAR_ITEMS = Object.freeze([
  { id: "hand", kind: "HAND", icon: "✋", held: "" },
  { id: "wood", kind: "BLOCK", resourceType: "wood", icon: "▤", held: "▤" },
  { id: "stone", kind: "BLOCK", resourceType: "stone", icon: "◆", held: "◆" },
  { id: "pickaxe", kind: "TOOL", toolFor: "stone", icon: "╱", held: "╱" },
  { id: "axe", kind: "TOOL", toolFor: "wood", icon: "✂", held: "✂" },
]);

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
    this.hotbarSlots = [];
    this.hotbarKeys = [];
    this.selectedSlot = 0;
    this.heldItemLabel = null;
    this.inventory = createInventory();
    this.resourceNodes = [];
    this.placedBlocks = [];
    this.targetResource = null;
    this.targetIndicator = null;
    this.actionKeys = [];
    this.eventLog = [];
    this.statusLabel = null;
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
    this._createInteractionHud();
    this._createInteractionInput();

    this.playerInput = new PlayerInput(this);
    this.physics.add.collider(this.player, this.obstacles);
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1);

    window.__BUILDERS_VALLEY__ = {
      scene: this,
      getPlayerPosition: () => ({ x: this.player.x, y: this.player.y }),
      getSelectedSlot: () => ({
        index: this.selectedSlot,
        ...HOTBAR_ITEMS[this.selectedSlot],
      }),
      getInventory: () => ({ ...this.inventory }),
      getEvents: () => this.eventLog.map((event) => ({ ...event })),
    };
  }

  update() {
    const intent = this.playerInput.read();
    const speed = PLAYER_SPEED * (intent.running ? PLAYER_RUN_MULTIPLIER : 1);
    const movement = resolveMovement(intent, speed);

    this.player.body.setVelocity(movement.velocityX, movement.velocityY);
    this._updateTargetResource();
    if (this.actionKeys.some((key) => Phaser.Input.Keyboard.JustDown(key))) {
      this._tryCollectResource();
    }
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
    tree.setData({ resourceType: "wood", requiredTool: "axe" });
    tree.setInteractive({ useHandCursor: true });
    tree.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation();
      this._tryCollectResource(tree);
    });
    this.physics.add.existing(tree, true);
    this.obstacles.add(tree);
    this.resourceNodes.push(tree);
  }

  _createStone(column, row) {
    const x = column * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const stone = this.add.rectangle(x, y, 30, 24, COLORS.stone);
    stone.setStrokeStyle(3, COLORS.outline, 0.45);
    stone.setData({ resourceType: "stone", requiredTool: "pickaxe" });
    stone.setInteractive({ useHandCursor: true });
    stone.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation();
      this._tryCollectResource(stone);
    });
    this.physics.add.existing(stone, true);
    this.obstacles.add(stone);
    this.resourceNodes.push(stone);
  }

  _createPlayer() {
    const player = this.add.container(6 * TILE_SIZE, 8 * TILE_SIZE);
    const shadow = this.add.ellipse(0, 12, 24, 10, 0x000000, 0.22);
    const body = this.add.rectangle(0, 0, 22, 28, COLORS.player);
    body.setStrokeStyle(3, COLORS.outline);
    const facing = this.add.triangle(0, -18, -6, 5, 6, 5, 0, -7, 0xffffff);
    this.heldItemLabel = this.add
      .text(15, 0, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "17px",
        color: "#ffffff",
        stroke: "#253238",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    player.add([shadow, body, facing, this.heldItemLabel]);
    player.setSize(24, 30);
    player.setDepth(20);

    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setDrag(900, 900);
    this.player = player;
  }

  _createHotbar() {
    const camera = this.cameras.main;
    const hotbar = this.add.container(camera.width / 2, camera.height - 72);
    hotbar.setScrollFactor(0);
    hotbar.setDepth(100);
    this.hotbarSlots = [];

    HOTBAR_ITEMS.forEach((item, index) => {
      const x = (index - 2) * 62;
      const slot = this.add
        .rectangle(x, 0, 54, 54, 0x17252c, 0.94)
        .setInteractive({ useHandCursor: true });
      const icon = this.add
        .text(x, -2, item.icon, {
          fontFamily: "Arial, sans-serif",
          fontSize: "25px",
          color: "#ffffff",
        })
        .setOrigin(0.5);
      const keyLabel = this.add
        .text(x - 21, -22, String(index + 1), {
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          color: "#d7e5e1",
        })
        .setOrigin(0.5);

      const countLabel = this.add
        .text(x + 19, 18, "", {
          fontFamily: "Arial, sans-serif",
          fontSize: "13px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(1, 1);

      slot.on("pointerdown", () => this._selectHotbarSlot(index));
      this.hotbarSlots.push({ slot, icon, keyLabel, countLabel, item });
      hotbar.add([slot, icon, keyLabel, countLabel]);
    });

    const keyCodes = [
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
    ];
    this.hotbarKeys = keyCodes.map((keyCode, index) => {
      const key = this.input.keyboard.addKey(keyCode);
      key.on("down", () => this._selectHotbarSlot(index));
      return key;
    });

    this.add
      .text(18, camera.height - 42, "WASD / ลูกศร • Shift วิ่ง • 1–5 เลือก", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#17252ccc",
        padding: { x: 9, y: 6 },
      })
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(100);

    this._selectHotbarSlot(0);
    this._refreshInventoryHud();
  }

  _createInteractionHud() {
    this.targetIndicator = this.add
      .circle(0, 0, 27)
      .setStrokeStyle(3, 0xf5d76e, 1)
      .setFillStyle(0xf5d76e, 0.08)
      .setDepth(19)
      .setVisible(false);

    this.statusLabel = this.add
      .text(this.cameras.main.width / 2, 22, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "#17252ccc",
        padding: { x: 10, y: 7 },
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(101)
      .setVisible(false);
  }

  _createInteractionInput() {
    this.actionKeys = [
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    ];

    this.input.on("pointerdown", (pointer, gameObjects) => {
      if (gameObjects.length === 0) {
        this._tryPlaceSelectedBlock(pointer.worldX, pointer.worldY);
      }
    });
  }

  _selectHotbarSlot(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.hotbarSlots.length) {
      return;
    }

    this.selectedSlot = index;
    this.hotbarSlots.forEach(({ slot, icon }, slotIndex) => {
      const selected = slotIndex === index;
      slot.setStrokeStyle(selected ? 4 : 1, selected ? 0xf5d76e : 0xffffff, selected ? 1 : 0.65);
      slot.setFillStyle(selected ? 0x243c42 : 0x17252c, selected ? 1 : 0.94);
      icon.setScale(selected ? 1.12 : 1);
      icon.setAlpha(selected ? 1 : 0.82);
    });

    if (this.heldItemLabel) {
      this.heldItemLabel.setText(HOTBAR_ITEMS[index].held);
    }
  }

  _updateTargetResource() {
    const maxDistance = 74;
    let nearest = null;
    let nearestDistance = maxDistance;

    this.resourceNodes.forEach((node) => {
      if (!node.active) return;
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, node.x, node.y);
      if (distance < nearestDistance) {
        nearest = node;
        nearestDistance = distance;
      }
    });

    this.targetResource = nearest;
    this.targetIndicator
      .setVisible(Boolean(nearest))
      .setPosition(nearest?.x ?? 0, nearest?.y ?? 0);
  }

  _tryCollectResource(resource = this.targetResource) {
    if (!resource?.active) return;

    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, resource.x, resource.y);
    if (distance > 74) {
      this._showStatus("เข้าใกล้อีกนิด");
      return;
    }

    const selectedItem = HOTBAR_ITEMS[this.selectedSlot];
    const resourceType = resource.getData("resourceType");
    if (selectedItem.id !== resource.getData("requiredTool")) {
      this._showStatus(resourceType === "wood" ? "เลือกเครื่องมือตัดไม้" : "เลือกเครื่องมือขุดหิน");
      this.cameras.main.shake(70, 0.0015);
      return;
    }

    this.inventory = addResource(this.inventory, resourceType);
    this._recordEvent("resource_collected", {
      resourceType,
      amount: 1,
      inventoryCount: this.inventory[resourceType],
    });
    this.resourceNodes = this.resourceNodes.filter((node) => node !== resource);
    resource.destroy();
    this.targetResource = null;
    this.targetIndicator.setVisible(false);
    this._refreshInventoryHud();
    this._showStatus(resourceType === "wood" ? "เก็บไม้แล้ว" : "เก็บหินแล้ว");
  }

  _tryPlaceSelectedBlock(worldX, worldY) {
    const selectedItem = HOTBAR_ITEMS[this.selectedSlot];
    if (selectedItem.kind !== "BLOCK") return;

    const tileX = Math.floor(worldX / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
    const tileY = Math.floor(worldY / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, tileX, tileY);
    if (distance > 100) {
      this._showStatus("วางได้เฉพาะพื้นที่ใกล้ตัว");
      return;
    }

    const insideStream =
      tileX >= STREAM.left &&
      tileX <= STREAM.left + STREAM.width &&
      tileY >= STREAM.top &&
      tileY <= STREAM.top + STREAM.height;
    const occupied = [...this.resourceNodes, ...this.placedBlocks].some(
      (object) => object.active && Phaser.Math.Distance.Between(tileX, tileY, object.x, object.y) < TILE_SIZE * 0.7,
    );
    if (insideStream || occupied) {
      this._showStatus("พื้นที่นี้ยังวางไม่ได้");
      return;
    }

    const result = consumeResource(this.inventory, selectedItem.resourceType);
    if (!result.consumed) {
      this._showStatus("ยังไม่มีวัตถุดิบในช่องนี้");
      return;
    }

    this.inventory = result.inventory;
    const color = selectedItem.resourceType === "wood" ? COLORS.trunk : COLORS.stone;
    const block = this.add.rectangle(tileX, tileY, TILE_SIZE - 4, TILE_SIZE - 4, color);
    block.setStrokeStyle(3, COLORS.outline, 0.7);
    this.physics.add.existing(block, true);
    this.obstacles.add(block);
    this.placedBlocks.push(block);
    this._recordEvent("block_placed", {
      resourceType: selectedItem.resourceType,
      tile: { column: Math.floor(tileX / TILE_SIZE), row: Math.floor(tileY / TILE_SIZE) },
      inventoryCount: this.inventory[selectedItem.resourceType],
    });
    this._refreshInventoryHud();
    this._showStatus("วางบล็อกแล้ว");
  }

  _refreshInventoryHud() {
    this.hotbarSlots.forEach(({ countLabel, item }) => {
      if (item.kind !== "BLOCK") {
        countLabel.setText("");
        return;
      }
      const count = this.inventory[item.resourceType];
      countLabel.setText(count > 0 ? String(count) : "");
    });
  }

  _recordEvent(type, payload) {
    this.eventLog.push(
      Object.freeze({
        type,
        payload: Object.freeze({ ...payload }),
        occurredAt: new Date().toISOString(),
      }),
    );
  }

  _showStatus(message) {
    this.statusLabel.setText(message).setVisible(true).setAlpha(1);
    this.tweens.killTweensOf(this.statusLabel);
    this.tweens.add({
      targets: this.statusLabel,
      alpha: 0,
      delay: 900,
      duration: 350,
      onComplete: () => this.statusLabel.setVisible(false),
    });
  }
}
