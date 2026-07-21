import { BuildersValleyScene } from "./BuildersValleyScene.js";
import { STREAM, TILE_SIZE } from "../config/worldContract.js";

const prototype = BuildersValleyScene.prototype;
const originalCreate = prototype.create;
const originalUpdate = prototype.update;
const originalTryCollectResource = prototype._tryCollectResource;
const originalTryPlaceSelectedBlock = prototype._tryPlaceSelectedBlock;

const EVIDENCE_WINDOW_MS = 20000;
const CANDIDATE_EXPIRY_MS = 30000;
const BANK_PROXIMITY = TILE_SIZE * 2.5;

function isNearStreamBank(x) {
  const leftBankDistance = Math.abs(x - STREAM.left);
  const rightBankDistance = Math.abs(x - (STREAM.left + STREAM.width));
  return Math.min(leftBankDistance, rightBankDistance) <= BANK_PROXIMITY;
}

function describeMission(mission) {
  if (!mission) return null;
  return {
    ...mission,
    evidence: mission.evidence.map((entry) => ({
      ...entry,
      tile: entry.tile ? { ...entry.tile } : null,
    })),
  };
}

function createEmptyMissionState() {
  return {
    mission: null,
    evidence: [],
    lastEvaluationAt: 0,
  };
}

function trimEvidence(scene, now) {
  scene.__missionRuntime.evidence = scene.__missionRuntime.evidence.filter(
    (entry) => now - entry.occurredAt <= EVIDENCE_WINDOW_MS,
  );
}

function recordMissionEvidence(scene, evidence) {
  const now = scene.time?.now ?? performance.now();
  scene.__missionRuntime.evidence.push({ ...evidence, occurredAt: now });
  trimEvidence(scene, now);
}

function getBridgeEvidence(scene) {
  const evidence = scene.__missionRuntime.evidence;
  const woodPlacements = evidence.filter(
    (entry) => entry.type === "WOOD_PLACED_NEAR_BANK",
  );
  const woodCollections = evidence.filter(
    (entry) => entry.type === "WOOD_COLLECTED_NEAR_BANK",
  );

  let adjacentPlacementPairs = 0;
  for (let index = 1; index < woodPlacements.length; index += 1) {
    const previous = woodPlacements[index - 1];
    const current = woodPlacements[index];
    if (!previous.tile || !current.tile) continue;
    const tileDistance = Math.hypot(
      current.tile.column - previous.tile.column,
      current.tile.row - previous.tile.row,
    );
    if (tileDistance <= 1.6) adjacentPlacementPairs += 1;
  }

  return {
    woodPlacementCount: woodPlacements.length,
    woodCollectionCount: woodCollections.length,
    adjacentPlacementPairs,
  };
}

function missionConfidence(metrics) {
  return Math.min(
    1,
    metrics.woodPlacementCount * 0.28 +
      metrics.adjacentPlacementPairs * 0.24 +
      Math.min(metrics.woodCollectionCount, 2) * 0.08,
  );
}

function setMission(scene, nextMission) {
  const previous = scene.__missionRuntime.mission;
  const changed =
    previous?.kind !== nextMission?.kind ||
    previous?.state !== nextMission?.state ||
    previous?.confidence !== nextMission?.confidence;

  scene.__missionRuntime.mission = nextMission;
  if (!changed) return;

  scene._recordEvent?.("mission_inferred", {
    previous: previous
      ? { kind: previous.kind, state: previous.state, confidence: previous.confidence }
      : null,
    current: nextMission
      ? { kind: nextMission.kind, state: nextMission.state, confidence: nextMission.confidence }
      : null,
  });
}

function evaluateMission(scene) {
  if (!scene.__missionRuntime) return;

  const now = scene.time?.now ?? performance.now();
  trimEvidence(scene, now);
  scene.__missionRuntime.lastEvaluationAt = now;

  const metrics = getBridgeEvidence(scene);
  const confidence = missionConfidence(metrics);
  const existing = scene.__missionRuntime.mission;

  const qualifiesAsActive =
    metrics.woodPlacementCount >= 3 && metrics.adjacentPlacementPairs >= 1;
  const qualifiesAsCandidate = metrics.woodPlacementCount >= 2;

  if (qualifiesAsActive || existing?.state === "ACTIVE") {
    setMission(scene, {
      kind: "BUILD_BRIDGE",
      state: "ACTIVE",
      confidence: Math.max(existing?.confidence ?? 0, confidence),
      inferredFrom: "REPEATED_WOOD_PLACEMENT_NEAR_STREAM",
      evidence: scene.__missionRuntime.evidence.slice(),
      startedAt: existing?.startedAt ?? now,
      updatedAt: now,
    });
    return;
  }

  if (qualifiesAsCandidate) {
    setMission(scene, {
      kind: "BUILD_BRIDGE",
      state: "CANDIDATE",
      confidence,
      inferredFrom: "WOOD_PLACEMENT_PATTERN_NEAR_STREAM",
      evidence: scene.__missionRuntime.evidence.slice(),
      startedAt: existing?.startedAt ?? now,
      updatedAt: now,
    });
    return;
  }

  if (
    existing?.state === "CANDIDATE" &&
    now - (existing.updatedAt ?? existing.startedAt ?? now) > CANDIDATE_EXPIRY_MS
  ) {
    setMission(scene, null);
  }
}

prototype.create = function createWithMissionRuntime() {
  originalCreate.call(this);
  this.__missionRuntime = createEmptyMissionState();

  if (window.__BUILDERS_VALLEY__) {
    window.__BUILDERS_VALLEY__.getMissionRuntime = () => ({
      mission: describeMission(this.__missionRuntime.mission),
      evidence: this.__missionRuntime.evidence.map((entry) => ({ ...entry })),
      lastEvaluationAt: this.__missionRuntime.lastEvaluationAt,
    });
    window.__BUILDERS_VALLEY__.resetMissionRuntime = () => {
      this.__missionRuntime = createEmptyMissionState();
      this._recordEvent?.("mission_reset", { source: "DEBUG_RESET" });
    };
  }
};

prototype.update = function updateWithMissionRuntime(time, delta) {
  originalUpdate.call(this, time, delta);
  evaluateMission(this);
};

prototype._tryCollectResource = function collectWithMissionEvidence(
  resource = this.targetResource,
) {
  const resourceType = resource?.getData?.("resourceType") ?? null;
  const resourceX = resource?.x ?? null;
  const beforeCount = resourceType ? this.inventory?.[resourceType] ?? 0 : 0;

  originalTryCollectResource.call(this, resource);

  const afterCount = resourceType ? this.inventory?.[resourceType] ?? 0 : 0;
  if (
    resourceType === "wood" &&
    afterCount > beforeCount &&
    Number.isFinite(resourceX) &&
    isNearStreamBank(resourceX)
  ) {
    recordMissionEvidence(this, {
      type: "WOOD_COLLECTED_NEAR_BANK",
      resourceType: "wood",
      worldX: Math.round(resourceX),
    });
    evaluateMission(this);
  }
};

prototype._tryPlaceSelectedBlock = function placeWithMissionEvidence(worldX, worldY) {
  const selectedItem = this.hotbarSlots?.[this.selectedSlot]?.item;
  const resourceType = selectedItem?.kind === "BLOCK" ? selectedItem.resourceType : null;
  const beforeCount = this.placedBlocks?.length ?? 0;

  originalTryPlaceSelectedBlock.call(this, worldX, worldY);

  const afterCount = this.placedBlocks?.length ?? 0;
  if (resourceType !== "wood" || afterCount <= beforeCount) return;

  const placedBlock = this.placedBlocks[afterCount - 1];
  if (!placedBlock || !isNearStreamBank(placedBlock.x)) return;

  recordMissionEvidence(this, {
    type: "WOOD_PLACED_NEAR_BANK",
    resourceType: "wood",
    tile: {
      column: Math.floor(placedBlock.x / TILE_SIZE),
      row: Math.floor(placedBlock.y / TILE_SIZE),
    },
    worldX: Math.round(placedBlock.x),
    worldY: Math.round(placedBlock.y),
  });
  evaluateMission(this);
};
