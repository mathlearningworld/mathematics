import Phaser from "phaser";
import { TILE_SIZE } from "../config/worldContract.js";
import { BuildersValleyScene } from "./BuildersValleyScene.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;

const CONTEXT_REACH = TILE_SIZE * 2.35;

function getActiveMission(scene) {
  const mission = scene.__missionRuntime?.mission;
  return mission?.kind === "BUILD_BRIDGE" && mission.state === "ACTIVE" ? mission : null;
}

function findSlot(scene, predicate) {
  return scene.hotbarSlots?.findIndex(({ item }) => predicate(item)) ?? -1;
}

function selectedItem(scene) {
  return scene.hotbarSlots?.[scene.selectedSlot]?.item ?? null;
}

function selectSlot(scene, slotIndex, source) {
  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex === scene.selectedSlot) return;

  scene.__intentAutoSelecting = true;
  try {
    scene._selectHotbarSlot(slotIndex);
  } finally {
    scene.__intentAutoSelecting = false;
  }

  scene._recordEvent?.("chain_intent_selection", {
    mission: "BUILD_BRIDGE",
    source,
    slotIndex,
  });
}

function isNaturalWoodNode(scene, node) {
  return (
    node?.active &&
    node.getData?.("resourceType") === "wood" &&
    !(scene.placedBlocks ?? []).includes(node)
  );
}

function findNearestNaturalWood(scene) {
  let nearest = null;
  let nearestDistance = CONTEXT_REACH;

  for (const node of scene.resourceNodes ?? []) {
    if (!isNaturalWoodNode(scene, node)) continue;

    const distance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, node.x, node.y);
    if (distance < nearestDistance) {
      nearest = node;
      nearestDistance = distance;
    }
  }

  return nearest;
}

function publishChainIntent(scene, state) {
  const previous = scene.__chainIntentRuntime;
  const changed =
    previous?.phase !== state.phase ||
    previous?.resourceType !== state.resourceType ||
    previous?.target !== state.target;

  scene.__chainIntentRuntime = {
    mission: "BUILD_BRIDGE",
    ...state,
    updatedAt: Date.now(),
  };

  if (changed) {
    scene._recordEvent?.("chain_intent_changed", {
      previous: previous
        ? { phase: previous.phase, resourceType: previous.resourceType }
        : null,
      current: { phase: state.phase, resourceType: state.resourceType },
    });
  }
}

function runBridgeChainIntent(scene) {
  if (!scene.player || !getActiveMission(scene)) {
    scene.__chainIntentRuntime = null;
    return;
  }

  const woodCount = scene.inventory?.wood ?? 0;
  const woodBlockSlot = findSlot(
    scene,
    (item) => item?.kind === "BLOCK" && item.resourceType === "wood",
  );
  const axeSlot = findSlot(scene, (item) => item?.id === "axe");

  if (woodCount > 0) {
    publishChainIntent(scene, {
      phase: "PLACE_REQUIRED_MATERIAL",
      resourceType: "wood",
      target: null,
    });

    if (!scene.targetResource?.active) {
      scene.__placementIntentMaterial = "wood";
      scene.__gameplayIntent = {
        kind: "BUILD_WITH_MATERIAL",
        resourceType: "wood",
        source: "BUILD_BRIDGE_CHAIN_INTENT",
        state: "ACTIVE",
        placedCount:
          scene.__gameplayIntent?.kind === "BUILD_WITH_MATERIAL" &&
          scene.__gameplayIntent.resourceType === "wood"
            ? scene.__gameplayIntent.placedCount ?? 0
            : 0,
        updatedAt: Date.now(),
      };

      const selected = selectedItem(scene);
      if (selected?.kind !== "BLOCK" || selected.resourceType !== "wood") {
        selectSlot(scene, woodBlockSlot, "MISSION_MATERIAL_AVAILABLE");
      }
    }
    return;
  }

  const woodTarget = findNearestNaturalWood(scene);
  publishChainIntent(scene, {
    phase: woodTarget ? "COLLECT_REQUIRED_MATERIAL" : "SEEK_REQUIRED_MATERIAL",
    resourceType: "wood",
    target: woodTarget,
  });

  // A bridge mission must never silently fall back to stone. When wood is empty,
  // the axe represents the next mission action; an in-range tree becomes the
  // contextual target and the existing collection loop handles the actual action.
  if (woodTarget) {
    scene.targetResource = woodTarget;
  }

  const selected = selectedItem(scene);
  if (selected?.id !== "axe") {
    selectSlot(scene, axeSlot, woodTarget ? "REQUIRED_RESOURCE_IN_REACH" : "SEEK_REQUIRED_RESOURCE");
  }
}

prototype.create = function createWithChainIntentRuntime() {
  originalCreate.call(this);
  this.__chainIntentRuntime = null;

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getChainIntentRuntime = () => {
      const runtime = this.__chainIntentRuntime;
      if (!runtime) return null;
      return {
        ...runtime,
        target: runtime.target
          ? {
              resourceType: runtime.target.getData?.("resourceType") ?? null,
              x: Math.round(runtime.target.x),
              y: Math.round(runtime.target.y),
            }
          : null,
      };
    };
  }
};

prototype.update = function updateWithChainIntentRuntime(time, delta) {
  originalUpdate.call(this, time, delta);
  runBridgeChainIntent(this);
};
