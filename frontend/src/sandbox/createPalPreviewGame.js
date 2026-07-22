import Phaser from "phaser";
import { ProductionAssetPreviewScene } from "./scenes/ProductionAssetPreviewScene.js";
import {
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./config/worldContract.js";

export function createPalPreviewGame() {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    parent: "game-container",
    backgroundColor: "#f4efe2",
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      activePointers: 2,
    },
    scene: [ProductionAssetPreviewScene],
  });
}
