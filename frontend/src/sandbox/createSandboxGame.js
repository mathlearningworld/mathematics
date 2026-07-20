import Phaser from "phaser";
import { BuildersValleyScene } from "./scenes/BuildersValleyScene.js";
import "./scenes/BuildersValleyIntentPatch.js";
import "./scenes/BuildersValleyVisualPatch.js";
import "./scenes/BuildersValleyLandmarkPatch.js";
import "./scenes/BuildersValleyEnvironmentVariantsPatch.js";
import {
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./config/worldContract.js";

export function createSandboxGame() {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    parent: "game-container",
    backgroundColor: "#315f45",
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
      activePointers: 2,
    },
    scene: [BuildersValleyScene],
  });
}
