/**
 * Create and return a Phaser game instance.
 */
import Phaser from "phaser";
import { createGameConfig } from "./gameConfig.js";
import { FractionBridgeScene } from "./scenes/FractionBridgeScene.js";

/**
 * Initialize the Phaser game.
 * @returns {Phaser.Game}
 */
export function createGame() {
  const config = createGameConfig();
  config.scene = [FractionBridgeScene];
  return new Phaser.Game(config);
}


