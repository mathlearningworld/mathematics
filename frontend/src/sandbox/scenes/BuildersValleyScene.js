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
import {
  ART_COLORS,
  createAmbientCritter,
  createHotbarIcon,
  createPixelPlayer,
  createPixelStone,
  createPixelTree,
  createPlacedBlock,
  createTargetBrackets,
  drawPixelWorld,
  setHeldItemVisual,
  spawnPixelBurst,
} from "../art/pixelArtFactory.js";

const HOTBAR_ITEMS = Object.freeze([
  { id: "hand", kind: "HAND" },
  { id: "wood", kind: "BLOCK", resourceType: "wood" },
  { id: "stone", kind: "BLOCK", resourceType: "stone" },
  { id: "pickaxe", kind: "TOOL", toolFor: "stone" },
  { id: "axe", kind: "TOOL", toolFor: "wood" },
]);

export class BuildersValleyScene extends Phaser.Scene {
  constructor() {
    super({ key: "BuildersValleyScene" });
    this.player = null;
    this.playerInput = null;
    this.obstacles = null;
    this.hotbarSlots = [];
    this.hotbarKeys = [];
    this.selectedSlot = 0;
    this.inventory = createInventory();
    this.resourceNodes = [];
    this.placedBlocks = [];
    this.targetResource = null;
    this.targetIndicator = null;
    this.actionKeys = [];
    this.eventLog = [];
    this.statusLabel = null;
    this.lastFacing = "right";
    this.lastInteractionDirection = { x: 1, y: 0 };
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBackgroundColor("#315f45");

    drawPixelWorld(this, {
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
      tileSize: TILE_SIZE,
      stream: STREAM,
    });

    this.obstacles = this.physics.add.staticGroup();
    this._createResourceLandmarks();
    this._createAmbientLife();
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
      artSlice: "BUILDERS_VALLEY_ART_VERTICAL_SLICE_V1",
      getPlayerPosition: () => ({ x: this.player.x, y: this.player.y }),
      getSelectedSlot: () => ({
        index: this.selectedSlot,
        ...HOTBAR_ITEMS[this.selectedSlot],
      }),
      getInventory: () => ({ ...this.inventory }),
      getEvents: () => this.eventLog.map((event) => ({ ...event })),
    };
  }

  update(time) {
    const intent = this.playerInput.read();
    const speed = PLAYER_SPEED * (intent.running ? PLAYER_RUN_MULTIPLIER : 1);
    const movement = resolveMovement(intent, speed);

    this.player.body.setVelocity(movement.velocityX, movement.velocityY);
    this._updatePlayerVisual(time, movement);
    this._updateDepths();
    this._updateTargetResource();
    this._readHotbarInput();

    if (this.actionKeys.some((key) => Phaser.Input.Keyboard.JustDown(key))) {
      this._tryUseSelectedItem();
    }
  }

  _readHotbarInput() {
    this.hotbarKeys.forEach((key, index) => {
      if (Phaser.Input.Keyboard.JustDown(key)) {
        this._selectHotbarSlot(index);
      }
    });
  }

  _updatePlayerVisual(time, movement) {
    if (movement.moving) {
      if (Math.abs(movement.velocityX) >= Math.abs(movement.velocityY)) {
        this.lastInteractionDirection = {
          x: movement.velocityX < 0 ? -1 : 1,
          y: 0,
        };
        this.lastFacing = movement.velocityX < 0 ? "left" : "right";
        this.player.setFacing(this.lastFacing);
      } else {
        this.lastInteractionDirection = {
          x: 0,
          y: movement.velocityY < 0 ? -1 : 1,
        };
      }
    }
    this.player.setWalkingFrame(time, movement.moving);
  }

  _updateDepths() {
    this.player.setDepth(200 + Math.floor(this.player.y));
    this.resourceNodes.forEach((node) => {
      if (node.active) node.setDepth(100 + Math.floor(node.y));
    });
    this.placedBlocks.forEach((block) => {
      if (block.active) block.setDepth(100 + Math.floor(block.y));
    });
  }

  _createResourceLandmarks() {
    const trees = [
      [5, 5], [8, 10], [13, 4], [14, 18], [7, 24],
      [34, 6], [39, 12], [43, 22], [31, 25],
    ];
    const stones = [[10, 15], [17, 8], [37, 18], [42, 7]];

    trees.forEach(([column, row], index) => this._createTree(column, row, index % 2));
    stones.forEach(([column, row], index) => this._createStone(column, row, index % 2));
  }

  _createTree(column, row, variant) {
    const x = column * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const tree = createPixelTree(this, x, y, variant);
    tree.setData({ resourceType: "wood", requiredTool: "axe", assetId: "BV_TREE_OAK_01" });
    tree.setInteractive({ useHandCursor: true });
    tree.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation();
      this._tryCollectResource(tree);
    });
    this.physics.add.existing(tree, true);
    tree.body.setSize(26, 20);
    this.obstacles.add(tree);
    this.resourceNodes.push(tree);
  }

  _createStone(column, row, variant) {
    const x = column * TILE_SIZE + TILE_SIZE / 2;
    const y = row * TILE_SIZE + TILE_SIZE / 2;
    const stone = createPixelStone(this, x, y, variant);
    stone.setData({ resourceType: "stone", requiredTool: "pickaxe", assetId: "BV_ROCK_FIELD_01" });
    stone.setInteractive({ useHandCursor: true });
    stone.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation();
      this._tryCollectResource(stone);
    });
    this.physics.add.existing(stone, true);
    stone.body.setSize(28, 20);
    this.obstacles.add(stone);
    this.resourceNodes.push(stone);
  }

  _createAmbientLife() {
    createAmbientCritter(this, 11 * TILE_SIZE, 12 * TILE_SIZE);
    createAmbientCritter(this, 35 * TILE_SIZE, 21 * TILE_SIZE);
  }

  _createPlayer() {
    const player = createPixelPlayer(this, 6 * TILE_SIZE, 8 * TILE_SIZE);
    player.setData("assetId", "BV_PLAYER_BUILDER_01");
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    player.body.setDrag(900, 900);
    player.body.setSize(22, 24);
    this.player = player;
  }

  _createHotbar() {
    const camera = this.cameras.main;
    const hotbar = this.add.container(camera.width / 2, camera.height - 72);
    hotbar.setScrollFactor(0);
    hotbar.setDepth(10000);
    this.hotbarSlots = [];

    HOTBAR_ITEMS.forEach((item, index) => {
      const x = (index - 2) * 62;
      const slot = this.add
        .rectangle(x, 0, 54, 54, 0x17252c, 0.96)
        .setInteractive({ useHandCursor: true });
      const icon = createHotbarIcon(this, item.id, x, -1);
      const keyLabel = this.add
        .text(x - 21, -22, String(index + 1), {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#d7e5e1",
        })
        .setOrigin(0.5);
      const countLabel = this.add
        .text(x + 19, 18, "", {
          fontFamily: "monospace",
          fontSize: "13px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(1, 1);

      // Keep the visual objects inside the camera-fixed Container, but use one
      // scene-level screen-space Zone for input. Interactive children inside a
      // scrolling Container can produce hit areas that drift away from the
      // rendered slots as the camera follows the player.
      const hitZone = this.add
        .zone(camera.width / 2 + x, camera.height - 72, 58, 58)
        .setScrollFactor(0)
        .setDepth(10002)
        .setInteractive({ useHandCursor: true });
      hitZone.on("pointerdown", (pointer, localX, localY, event) => {
        event?.stopPropagation();
        this._selectHotbarSlot(index);
      });

      this.hotbarSlots.push({ slot, icon, keyLabel, countLabel, hitZone, item });
      hotbar.add([slot, icon, keyLabel, countLabel]);
    });

    const keyCodes = [
      Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO,
      Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR,
      Phaser.Input.Keyboard.KeyCodes.FIVE,
    ];
    this.hotbarKeys = keyCodes.map((keyCode) =>
      this.input.keyboard.addKey(keyCode, false, true),
    );

    this.add
      .text(18, camera.height - 42, "WASD / ลูกศร • Shift วิ่ง • 1–5 เลือก • Space ใช้", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#ffffff",
        backgroundColor: "#17252ccc",
        padding: { x: 9, y: 6 },
      })
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(10000);

    this._selectHotbarSlot(0);
    this._refreshInventoryHud();
  }

  _createInteractionHud() {
    this.targetIndicator = createTargetBrackets(this)
      .setDepth(9999)
      .setVisible(false);

    this.statusLabel = this.add
      .text(this.cameras.main.width / 2, 22, "", {
        fontFamily: "monospace",
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "#17252cdd",
        padding: { x: 10, y: 7 },
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(10001)
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
    if (!Number.isInteger(index) || index < 0 || index >= this.hotbarSlots.length) return;

    this.selectedSlot = index;
    this.hotbarSlots.forEach(({ slot, icon }, slotIndex) => {
      const selected = slotIndex === index;
      slot.setStrokeStyle(
        selected ? 4 : 1,
        selected ? ART_COLORS.highlight : 0xffffff,
        selected ? 1 : 0.65,
      );
      slot.setFillStyle(selected ? 0x243c42 : 0x17252c, selected ? 1 : 0.96);
      icon.setScale(selected ? 1.12 : 1);
      icon.setAlpha(selected ? 1 : 0.82);
    });

    setHeldItemVisual(this, this.player, HOTBAR_ITEMS[index].id);
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

    const targetChanged = nearest !== this.targetResource;
    this.targetResource = nearest;

    if (targetChanged && nearest) {
      const requiredTool = nearest.getData("requiredTool");
      const toolSlotIndex = HOTBAR_ITEMS.findIndex((item) => item.id === requiredTool);
      if (toolSlotIndex >= 0) {
        this._selectHotbarSlot(toolSlotIndex);
      }
    }

    this.targetIndicator
      .setVisible(Boolean(nearest))
      .setPosition(nearest?.x ?? 0, (nearest?.y ?? 0) - 12);
  }

  _tryUseSelectedItem() {
    const selectedItem = HOTBAR_ITEMS[this.selectedSlot];

    if (selectedItem.kind === "BLOCK") {
      const placementPoint = this._getFrontPlacementPoint();
      this._tryPlaceSelectedBlock(placementPoint.x, placementPoint.y);
      return;
    }

    this._tryCollectResource();
  }

  _getFrontPlacementPoint() {
    const direction = this.lastInteractionDirection ?? { x: 1, y: 0 };
    return {
      x: this.player.x + direction.x * TILE_SIZE,
      y: this.player.y + direction.y * TILE_SIZE,
    };
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

    const resourceX = resource.x;
    const resourceY = resource.y;
    this.inventory = addResource(this.inventory, resourceType);
    this._recordEvent("resource_collected", {
      resourceType,
      amount: 1,
      inventoryCount: this.inventory[resourceType],
    });
    this.resourceNodes = this.resourceNodes.filter((node) => node !== resource);
    this.placedBlocks = this.placedBlocks.filter((block) => block !== resource);
    resource.disableInteractive();
    if (resource.body) resource.body.enable = false;
    this.obstacles.remove(resource, false, false);
    this.time.delayedCall(0, () => {
      if (resource.active) resource.destroy();
    });
    spawnPixelBurst(this, resourceX, resourceY, resourceType);
    this.targetResource = null;
    this.targetIndicator.setVisible(false);
    this._refreshInventoryHud();

    const blockSlotIndex = HOTBAR_ITEMS.findIndex(
      (item) => item.kind === "BLOCK" && item.resourceType === resourceType,
    );
    if (blockSlotIndex >= 0) {
      this._selectHotbarSlot(blockSlotIndex);
    }

    this._showStatus(resourceType === "wood" ? "เก็บไม้แล้ว พร้อมวาง" : "เก็บหินแล้ว พร้อมวาง");
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
      (object) =>
        object.active &&
        Phaser.Math.Distance.Between(tileX, tileY, object.x, object.y) < TILE_SIZE * 0.7,
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
    const block = createPlacedBlock(this, tileX, tileY, selectedItem.resourceType);
    block.setData({
      assetId: selectedItem.resourceType === "wood" ? "BV_BLOCK_WOOD_01" : "BV_BLOCK_STONE_01",
      resourceType: selectedItem.resourceType,
      requiredTool: selectedItem.resourceType === "wood" ? "axe" : "pickaxe",
    });
    block.setInteractive({ useHandCursor: true });
    block.on("pointerdown", (pointer, localX, localY, event) => {
      event.stopPropagation();
      this._tryCollectResource(block);
    });
    this.physics.add.existing(block, true);
    block.body.setSize(28, 22);
    this.obstacles.add(block);
    this.placedBlocks.push(block);
    this.resourceNodes.push(block);
    spawnPixelBurst(this, tileX, tileY, selectedItem.resourceType);
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
