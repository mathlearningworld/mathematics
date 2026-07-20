/**
 * Phaser game configuration for Fraction Bridge.
 */
import Phaser from "phaser";

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export function createGameConfig() {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: "game-container",
    backgroundColor: "#87CEEB",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [],
    input: {
      activePointers: 1,
    },
  };
}


