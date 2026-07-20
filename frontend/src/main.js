/**
 * Product entry point.
 * Fraction Bridge remains available as an archived learning-mechanic prototype;
 * the default client now boots the Builder's Valley sandbox.
 */
import { createSandboxGame } from "./sandbox/createSandboxGame.js";

try {
  const game = createSandboxGame();
  window.__MATH_LEARNING_WORLD_GAME__ = game;
} catch (error) {
  console.error("Failed to initialize Builder's Valley:", error);
  const fallback = document.getElementById("fallback-message");
  if (fallback) {
    fallback.style.display = "block";
  }
}
