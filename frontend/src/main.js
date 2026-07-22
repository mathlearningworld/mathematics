/**
 * Product entry point.
 * Fraction Bridge remains available as an archived learning-mechanic prototype;
 * the default client boots Builder's Valley unless ?palPreview=1 is present.
 */
import { createSandboxGame } from "./sandbox/createSandboxGame.js";
import { createPalPreviewGame } from "./sandbox/createPalPreviewGame.js";
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
import "./sandbox/scenes/BuildersValleyAssetPipelinePatch.js";
import "./sandbox/scenes/BuildersValleyGroundAssetPatch.js";
import "./sandbox/scenes/BuildersValleyWaterAssetPatch.js";
import "./sandbox/scenes/BuildersValleyCliffAssetPatch.js";
import "./sandbox/scenes/BuildersValleyRiverKitRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyLayerCompositionRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyForegroundCompositionRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyTerrainDetailRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyWorkshopDetailRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyVegetationCompositionRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyVegetationAssetPatch.js";
import "./sandbox/scenes/BuildersValleyLightingAtmosphereRuntimePatch.js";
import "./sandbox/scenes/BuildersValleyProductionDepthPassPatch.js";
import "./sandbox/scenes/BuildersValleyWaterEffectsAssetPatch.js";
import "./sandbox/scenes/BuildersValleyEnvironmentProductionPolishPatch.js";
import "./sandbox/scenes/BuildersValleyProductionEnvironmentConsolidationPatch.js";
import "./sandbox/scenes/BuildersValleySpawnSafetyPatch.js";
import "./sandbox/scenes/BuildersValleyVisibleGraphicsIntegrationPatch.js";
import "./sandbox/scenes/BuildersValleySceneCompositionPatch.js";
import "./sandbox/scenes/BuildersValleyEnvironmentReleaseCandidatePatch.js";
import "./sandbox/scenes/BuildersValleyAssetDebugPatch.js";

try {
  const params = new URLSearchParams(window.location.search);
  const previewMode = params.get("palPreview") === "1";
  const game = previewMode ? createPalPreviewGame() : createSandboxGame();
  window.__MATH_LEARNING_WORLD_GAME__ = game;
  window.__MATH_LEARNING_WORLD_RUNTIME_MODE__ = previewMode
    ? "PAL_001B_RUNTIME_PREVIEW"
    : "BUILDERS_VALLEY";
} catch (error) {
  console.error("Failed to initialize Math Learning World:", error);
  const fallback = document.getElementById("fallback-message");
  if (fallback) {
    fallback.style.display = "block";
  }
}
