/**
 * Product entry point.
 * Fraction Bridge remains available as an archived learning-mechanic prototype;
 * the default client now boots the Builder's Valley sandbox.
 */
import { createSandboxGame } from "./sandbox/createSandboxGame.js";
import "./sandbox/scenes/BuildersValleyFeedbackPatch.js";
import "./sandbox/scenes/BuildersValleyDirectionPatch.js";
import "./sandbox/scenes/BuildersValleyMissionPatch.js";
import "./sandbox/scenes/BuildersValleyPlacementPriorityPatch.js";
import "./sandbox/scenes/BuildersValleyInteractionGeometryPatch.js";
import "./sandbox/scenes/BuildersValleyAdjacentPickupPatch.js";
import "./sandbox/scenes/BuildersValleyOccupiedPlacementPickupPatch.js";
import "./sandbox/scenes/BuildersValleyPickupFocusStabilityPatch.js";
import "./sandbox/scenes/BuildersValleyPrecisePlacementPatch.js";
import "./sandbox/scenes/BuildersValleyMaterialFallbackPatch.js";
import "./sandbox/scenes/BuildersValleyChainIntentPatch.js";
import "./sandbox/scenes/BuildersValleyVisualAlignmentPatch.js";
import "./sandbox/scenes/BuildersValleyPlacementRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyProductionVisualPatch.js";
import "./sandbox/scenes/BuildersValleyHeroSlicePatch.js";
import "./sandbox/scenes/BuildersValleyCompositionPatch.js";
import "./sandbox/scenes/BuildersValleyTerrainRiverPatch.js";

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
