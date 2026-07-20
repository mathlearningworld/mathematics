/**
 * Entry point for Fraction Bridge prototype.
 */
import { createGame } from "./game/createGame.js";

try {
  const game = createGame();
  window.__FRACTION_BRIDGE_GAME__ = game;
} catch (err) {
  console.error("Failed to initialize Fraction Bridge:", err);
  const fallback = document.getElementById("fallback-message");
  if (fallback) {
    fallback.style.display = "block";
  }
}
