import Phaser from "phaser";
import {
  PAL_001A_DELIVERY_STANDARD,
  PAL_001A_DELIVERED_ASSETS,
  PAL_001A_ATLASES,
} from "../assets/Pal001ThaiNatureDeliveryManifest.js";

const SCENE_KEY = "ProductionAssetPreviewScene";
const PREVIEW_BACKGROUND = 0xf4efe2;

export class ProductionAssetPreviewScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEY });
    this.previewGridVisible = true;
    this.previewShadowVisible = true;
    this.previewSprites = [];
    this.previewLabels = [];
  }

  preload() {
    for (const atlas of PAL_001A_ATLASES) {
      this.load.atlas(atlas.id, atlas.textureUrl, atlas.dataUrl);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor(PREVIEW_BACKGROUND);
    this.createGrid();
    this.createHeader();
    this.createAssetGrid();
    this.installControls();
    this.publishInspector();
  }

  createGrid() {
    this.gridGraphics = this.add.graphics().setDepth(-10);
    this.gridGraphics.lineStyle(1, 0xc8bda8, 0.35);
    for (let x = 0; x <= this.scale.width; x += 32) {
      this.gridGraphics.lineBetween(x, 0, x, this.scale.height);
    }
    for (let y = 0; y <= this.scale.height; y += 32) {
      this.gridGraphics.lineBetween(0, y, this.scale.width, y);
    }
  }

  createHeader() {
    this.add.text(24, 18, "PAL-001B — Thai Nature Runtime Preview", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#3b2f24",
    });
    this.add.text(24, 48, "F1 Grid  •  F2 Shadow  •  Mouse wheel Zoom  •  Drag Pan", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#6d5b49",
    });
  }

  createAssetGrid() {
    const startX = 110;
    const startY = 155;
    const columns = 4;

    PAL_001A_DELIVERED_ASSETS.forEach((record, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + column * 220;
      const y = startY + row * 230;

      const shadow = this.add.ellipse(x, y + 53, 84, 18, 0x2a2018, 0.18);
      shadow.setData("previewShadow", true);

      const sprite = this.add.image(x, y, record.atlasId, record.frame);
      sprite.setOrigin(0.5, 0.82);
      sprite.setData("assetId", record.assetId);
      sprite.setData("atlasId", record.atlasId);
      this.previewSprites.push(sprite);

      const label = this.add.text(x, y + 77, `${record.assetId}\n${record.frame}`, {
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#3b2f24",
        align: "center",
      }).setOrigin(0.5, 0);
      this.previewLabels.push(label);
    });
  }

  installControls() {
    this.input.keyboard.on("keydown-F1", () => this.toggleGrid());
    this.input.keyboard.on("keydown-F2", () => this.toggleShadow());

    this.input.on("wheel", (_pointer, _objects, _dx, dy) => {
      const nextZoom = Phaser.Math.Clamp(this.cameras.main.zoom - dy * 0.001, 0.6, 2.2);
      this.cameras.main.setZoom(nextZoom);
    });

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;
      this.cameras.main.scrollX -= pointer.velocity.x / this.cameras.main.zoom;
      this.cameras.main.scrollY -= pointer.velocity.y / this.cameras.main.zoom;
    });
  }

  toggleGrid() {
    this.previewGridVisible = !this.previewGridVisible;
    this.gridGraphics.setVisible(this.previewGridVisible);
    return this.previewGridVisible;
  }

  toggleShadow() {
    this.previewShadowVisible = !this.previewShadowVisible;
    for (const child of this.children.list) {
      if (child.getData?.("previewShadow")) child.setVisible(this.previewShadowVisible);
    }
    return this.previewShadowVisible;
  }

  publishInspector() {
    window.__PAL_PREVIEW__ = {
      summary: () => ({
        standard: "PAL_001B_RUNTIME_PREVIEW_V1",
        deliveryStandard: PAL_001A_DELIVERY_STANDARD,
        sceneKey: SCENE_KEY,
        assetCount: PAL_001A_DELIVERED_ASSETS.length,
        atlasCount: PAL_001A_ATLASES.length,
        spriteCount: this.previewSprites.length,
        textureCount: this.textures.getTextureKeys().length,
        zoom: this.cameras.main.zoom,
        gridVisible: this.previewGridVisible,
        shadowVisible: this.previewShadowVisible,
        buildersValleyMutation: false,
      }),
      toggleGrid: () => this.toggleGrid(),
      toggleShadow: () => this.toggleShadow(),
      showPack: (pack) => ({
        pack,
        supported: pack === "PAL-001_THAI_NATURE",
        visibleAssetIds: PAL_001A_DELIVERED_ASSETS.map((record) => record.assetId),
      }),
      returnToBuildersValley: () => {
        window.location.search = "";
      },
    };
  }
}

export const PRODUCTION_ASSET_PREVIEW_SCENE_KEY = SCENE_KEY;
