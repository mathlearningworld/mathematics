/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Knowledge Graph Business Rules
 * ──────────────────────────────────────────────
 * Pure functions enforcing Knowledge Graph integrity contracts.
 * No Prisma, HTTP, logger, or environment dependencies.
 * All functions are deterministic and side-effect-free.
 * ──────────────────────────────────────────────
 */

import {
  KnowledgeGraphContractError,
  ErrorCodes,
} from "./knowledgeGraph.errors.js";

// ── State Transition Contract ────────────────

/**
 * Allowed state transitions.
 * RETIRED has no outgoing transition.
 */
const ALLOWED_TRANSITIONS = Object.freeze({
  DRAFT: ["REVIEW"],
  REVIEW: ["DRAFT", "PUBLISHED"],
  PUBLISHED: ["RETIRED"],
  RETIRED: [],
});

/**
 * Assert that a state transition is allowed.
 *
 * @param {{ currentState: string, nextState: string }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertKnowledgeStateTransition({ currentState, nextState }) {
  if (currentState === nextState) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
      `State transition from ${currentState} to ${nextState} is not allowed (same state)`,
      { currentState, nextState },
    );
  }

  const allowed = ALLOWED_TRANSITIONS[currentState];
  if (!allowed) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
      `State transition from ${currentState} to ${nextState} is not allowed (unknown current state)`,
      { currentState, nextState },
    );
  }

  if (!allowed.includes(nextState)) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
      `State transition from ${currentState} to ${nextState} is not allowed`,
      { currentState, nextState },
    );
  }
}

// ── Code Immutability Contract ───────────────

/**
 * Assert that a semantic code has not changed.
 * Comparison is case-sensitive.
 *
 * @param {{ currentCode: string, nextCode: string }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertSemanticCodeImmutable({ currentCode, nextCode }) {
  if (currentCode !== nextCode) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_CODE_IMMUTABLE,
      `Semantic code cannot be changed from "${currentCode}" to "${nextCode}"`,
      { currentCode, nextCode },
    );
  }
}

// ── Version Contract ─────────────────────────

/**
 * Assert that the actual version matches the expected version.
 * Both must be positive integers.
 *
 * @param {{ actualVersion: number, expectedVersion: number }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertExpectedVersion({ actualVersion, expectedVersion }) {
  if (!Number.isInteger(actualVersion) || actualVersion < 1) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
      `Actual version must be a positive integer, got ${actualVersion}`,
      { actualVersion, expectedVersion },
    );
  }

  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
      `Expected version must be a positive integer, got ${expectedVersion}`,
      { actualVersion, expectedVersion },
    );
  }

  if (actualVersion !== expectedVersion) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
      `Version mismatch: actual ${actualVersion} !== expected ${expectedVersion}`,
      { actualVersion, expectedVersion },
    );
  }
}

// ── Dependency Endpoint Validation ───────────

/**
 * Assert that both dependency endpoints exist and are not RETIRED.
 *
 * @param {{ prerequisiteSkill: { id: string, state: string }|null, dependentSkill: { id: string, state: string }|null }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertDependencyEndpoints({
  prerequisiteSkill,
  dependentSkill,
}) {
  if (!prerequisiteSkill) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_ENDPOINT_NOT_FOUND,
      "Prerequisite skill not found",
      { prerequisiteSkillId: null },
    );
  }

  if (!dependentSkill) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_ENDPOINT_NOT_FOUND,
      "Dependent skill not found",
      { dependentSkillId: null },
    );
  }

  if (prerequisiteSkill.state === "RETIRED") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_ENDPOINT_RETIRED,
      `Prerequisite skill ${prerequisiteSkill.id} is RETIRED`,
      { skillId: prerequisiteSkill.id, state: "RETIRED" },
    );
  }

  if (dependentSkill.state === "RETIRED") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_ENDPOINT_RETIRED,
      `Dependent skill ${dependentSkill.id} is RETIRED`,
      { skillId: dependentSkill.id, state: "RETIRED" },
    );
  }
}

// ── Self-Dependency Prevention ───────────────

/**
 * Assert that a dependency does not reference the same skill on both ends.
 *
 * @param {{ prerequisiteSkillId: string, dependentSkillId: string }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertNoSelfDependency({
  prerequisiteSkillId,
  dependentSkillId,
}) {
  if (prerequisiteSkillId === dependentSkillId) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_SELF_DEPENDENCY,
      `Skill ${prerequisiteSkillId} cannot depend on itself`,
      { prerequisiteSkillId, dependentSkillId },
    );
  }
}

// ── Duplicate Dependency Prevention ──────────

/**
 * Assert that a prerequisite/dependent pair does not already exist.
 * Supports updating an existing edge via excludeDependencyId.
 *
 * @param {{ prerequisiteSkillId: string, dependentSkillId: string, existingEdges: Array, excludeDependencyId?: string }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertNoDuplicateDependency({
  prerequisiteSkillId,
  dependentSkillId,
  existingEdges,
  excludeDependencyId,
}) {
  const duplicate = existingEdges.find(
    (e) =>
      e.prerequisiteSkillId === prerequisiteSkillId &&
      e.dependentSkillId === dependentSkillId &&
      e.id !== excludeDependencyId,
  );

  if (duplicate) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_DUPLICATE_DEPENDENCY,
      `Dependency already exists between ${prerequisiteSkillId} and ${dependentSkillId}`,
      {
        prerequisiteSkillId,
        dependentSkillId,
        existingDependencyId: duplicate.id,
      },
    );
  }
}

// ── REQUIRED Cycle Detection ─────────────────

/**
 * Build an adjacency list from existing REQUIRED, non-RETIRED edges.
 * Does not mutate inputs.
 *
 * @param {Array} existingEdges
 * @param {string} [excludeDependencyId]
 * @returns {Map<string, string[]>}
 */
function buildRequiredAdjacency(existingEdges, excludeDependencyId) {
  const adj = new Map();

  for (const edge of existingEdges) {
    if (edge.id === excludeDependencyId) continue;
    if (edge.kind !== "REQUIRED") continue;
    if (edge.state === "RETIRED") continue;

    const from = edge.prerequisiteSkillId;
    const to = edge.dependentSkillId;

    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
  }

  return adj;
}

/**
 * DFS-based cycle detection.
 * Returns the first cycle path found, or null.
 * Terminates safely even if existing graph data already contains cycles.
 *
 * @param {Map<string, string[]>} adj
 * @param {string} start
 * @param {string} target
 * @returns {string[]|null}
 */
function findPath(adj, start, target) {
  const visited = new Set();
  const stack = [[start, [start]]];

  while (stack.length > 0) {
    const [current, path] = stack.pop();

    if (current === target && path.length > 1) {
      return path;
    }

    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = adj.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null;
}

/**
 * Assert that adding a REQUIRED edge does not create a cycle.
 * Only checks REQUIRED, non-RETIRED edges.
 *
 * @param {{ prerequisiteSkillId: string, dependentSkillId: string, existingEdges: Array, excludeDependencyId?: string }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertNoRequiredCycle({
  prerequisiteSkillId,
  dependentSkillId,
  existingEdges,
  excludeDependencyId,
}) {
  const adj = buildRequiredAdjacency(existingEdges, excludeDependencyId);

  // Add the proposed edge to check for cycles
  if (!adj.has(prerequisiteSkillId)) {
    adj.set(prerequisiteSkillId, []);
  }
  adj.get(prerequisiteSkillId).push(dependentSkillId);

  // Check if dependentSkillId can reach prerequisiteSkillId
  const cyclePath = findPath(adj, dependentSkillId, prerequisiteSkillId);

  if (cyclePath) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_REQUIRED_CYCLE,
      `Adding REQUIRED dependency from ${prerequisiteSkillId} to ${dependentSkillId} would create a cycle`,
      {
        prerequisiteSkillId,
        dependentSkillId,
        cyclePath,
      },
    );
  }
}

// ── Coordinating Dependency Validation ───────

/**
 * Run all dependency integrity checks for a proposed edge.
 *
 * @param {{ dependencyId?: string, prerequisiteSkill: { id: string, state: string }|null, dependentSkill: { id: string, state: string }|null, kind: string, state: string, existingEdges: Array }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertDependencyCanBeSaved({
  dependencyId,
  prerequisiteSkill,
  dependentSkill,
  kind,
  state,
  existingEdges,
}) {
  assertDependencyEndpoints({ prerequisiteSkill, dependentSkill });

  assertNoSelfDependency({
    prerequisiteSkillId: prerequisiteSkill.id,
    dependentSkillId: dependentSkill.id,
  });

  assertNoDuplicateDependency({
    prerequisiteSkillId: prerequisiteSkill.id,
    dependentSkillId: dependentSkill.id,
    existingEdges,
    excludeDependencyId: dependencyId,
  });

  if (kind === "REQUIRED") {
    assertNoRequiredCycle({
      prerequisiteSkillId: prerequisiteSkill.id,
      dependentSkillId: dependentSkill.id,
      existingEdges,
      excludeDependencyId: dependencyId,
    });
  }
}

// ── Publication Contract ─────────────────────

/**
 * Assert that a Subject can be published.
 *
 * @param {{ state: string, code: string, slug: string, internalName: string, version: number }} subject
 * @throws {KnowledgeGraphContractError}
 */
export function assertSubjectCanPublish(subject) {
  if (subject.state !== "REVIEW") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Subject cannot be published from state ${subject.state}; must be REVIEW`,
      { entityType: "Subject", currentState: subject.state },
    );
  }

  if (!subject.code || subject.code.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Subject code must be non-empty",
      { entityType: "Subject", field: "code" },
    );
  }

  if (!subject.slug || subject.slug.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Subject slug must be non-empty",
      { entityType: "Subject", field: "slug" },
    );
  }

  if (!subject.internalName || subject.internalName.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Subject internalName must be non-empty",
      { entityType: "Subject", field: "internalName" },
    );
  }

  if (!Number.isInteger(subject.version) || subject.version < 1) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Subject version must be a positive integer, got ${subject.version}`,
      { entityType: "Subject", field: "version", value: subject.version },
    );
  }
}

/**
 * Assert that a Concept can be published.
 *
 * @param {{ concept: { state: string, code: string, slug: string, internalName: string, semanticDefinition: string, version: number }, subject: { state: string }|null }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertConceptCanPublish({ concept, subject }) {
  if (concept.state !== "REVIEW") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Concept cannot be published from state ${concept.state}; must be REVIEW`,
      { entityType: "Concept", currentState: concept.state },
    );
  }

  if (!subject) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Parent Subject not found",
      { entityType: "Concept", field: "subject" },
    );
  }

  if (subject.state !== "PUBLISHED") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Parent Subject must be PUBLISHED, got ${subject.state}`,
      { entityType: "Concept", subjectState: subject.state },
    );
  }

  if (!concept.code || concept.code.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Concept code must be non-empty",
      { entityType: "Concept", field: "code" },
    );
  }

  if (!concept.slug || concept.slug.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Concept slug must be non-empty",
      { entityType: "Concept", field: "slug" },
    );
  }

  if (!concept.internalName || concept.internalName.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Concept internalName must be non-empty",
      { entityType: "Concept", field: "internalName" },
    );
  }

  if (
    !concept.semanticDefinition ||
    concept.semanticDefinition.trim().length === 0
  ) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Concept semanticDefinition must be non-empty",
      { entityType: "Concept", field: "semanticDefinition" },
    );
  }

  if (!Number.isInteger(concept.version) || concept.version < 1) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Concept version must be a positive integer, got ${concept.version}`,
      { entityType: "Concept", field: "version", value: concept.version },
    );
  }
}

/**
 * Assert that a Skill can be published.
 *
 * @param {{ skill: { state: string, code: string, slug: string, internalName: string, capabilityStatement: string, observableOutcome: string, version: number }, concept: { state: string }|null }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertSkillCanPublish({ skill, concept }) {
  if (skill.state !== "REVIEW") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Skill cannot be published from state ${skill.state}; must be REVIEW`,
      { entityType: "Skill", currentState: skill.state },
    );
  }

  if (!concept) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Parent Concept not found",
      { entityType: "Skill", field: "concept" },
    );
  }

  if (concept.state !== "PUBLISHED") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Parent Concept must be PUBLISHED, got ${concept.state}`,
      { entityType: "Skill", conceptState: concept.state },
    );
  }

  if (!skill.code || skill.code.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Skill code must be non-empty",
      { entityType: "Skill", field: "code" },
    );
  }

  if (!skill.slug || skill.slug.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Skill slug must be non-empty",
      { entityType: "Skill", field: "slug" },
    );
  }

  if (!skill.internalName || skill.internalName.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Skill internalName must be non-empty",
      { entityType: "Skill", field: "internalName" },
    );
  }

  if (
    !skill.capabilityStatement ||
    skill.capabilityStatement.trim().length === 0
  ) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Skill capabilityStatement must be non-empty",
      { entityType: "Skill", field: "capabilityStatement" },
    );
  }

  if (!skill.observableOutcome || skill.observableOutcome.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Skill observableOutcome must be non-empty",
      { entityType: "Skill", field: "observableOutcome" },
    );
  }

  if (!Number.isInteger(skill.version) || skill.version < 1) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Skill version must be a positive integer, got ${skill.version}`,
      { entityType: "Skill", field: "version", value: skill.version },
    );
  }
}

/**
 * Assert that a Dependency can be published.
 *
 * @param {{ dependency: { state: string, rationale: string, version: number }, prerequisiteSkill: { id: string, state: string }|null, dependentSkill: { id: string, state: string }|null, existingEdges: Array }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertDependencyCanPublish({
  dependency,
  prerequisiteSkill,
  dependentSkill,
  existingEdges,
}) {
  if (dependency.state !== "REVIEW") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Dependency cannot be published from state ${dependency.state}; must be REVIEW`,
      { entityType: "SkillDependency", currentState: dependency.state },
    );
  }

  if (!dependency.rationale || dependency.rationale.trim().length === 0) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      "Dependency rationale must be non-empty",
      { entityType: "SkillDependency", field: "rationale" },
    );
  }

  if (!Number.isInteger(dependency.version) || dependency.version < 1) {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Dependency version must be a positive integer, got ${dependency.version}`,
      {
        entityType: "SkillDependency",
        field: "version",
        value: dependency.version,
      },
    );
  }

  // Endpoint validation — uses more specific error codes when applicable
  assertDependencyEndpoints({ prerequisiteSkill, dependentSkill });

  // Both endpoints must be PUBLISHED
  if (prerequisiteSkill.state !== "PUBLISHED") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Prerequisite skill ${prerequisiteSkill.id} must be PUBLISHED, got ${prerequisiteSkill.state}`,
      {
        entityType: "SkillDependency",
        skillId: prerequisiteSkill.id,
        skillState: prerequisiteSkill.state,
      },
    );
  }

  if (dependentSkill.state !== "PUBLISHED") {
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
      `Dependent skill ${dependentSkill.id} must be PUBLISHED, got ${dependentSkill.state}`,
      {
        entityType: "SkillDependency",
        skillId: dependentSkill.id,
        skillState: dependentSkill.state,
      },
    );
  }

  assertNoSelfDependency({
    prerequisiteSkillId: prerequisiteSkill.id,
    dependentSkillId: dependentSkill.id,
  });

  assertNoDuplicateDependency({
    prerequisiteSkillId: prerequisiteSkill.id,
    dependentSkillId: dependentSkill.id,
    existingEdges,
    excludeDependencyId: dependency.id,
  });

  if (dependency.kind === "REQUIRED") {
    assertNoRequiredCycle({
      prerequisiteSkillId: prerequisiteSkill.id,
      dependentSkillId: dependentSkill.id,
      existingEdges,
      excludeDependencyId: dependency.id,
    });
  }
}

// ── Retirement Contract ──────────────────────

/**
 * Assert that a Skill can be retired.
 * Blocks retirement when any PUBLISHED REQUIRED edge (non-RETIRED)
 * references the Skill as prerequisite or dependent.
 *
 * @param {{ skillId: string, existingEdges: Array }} params
 * @throws {KnowledgeGraphContractError}
 */
export function assertSkillCanRetire({ skillId, existingEdges }) {
  const blockingEdges = existingEdges.filter(
    (e) =>
      e.state === "PUBLISHED" &&
      e.kind === "REQUIRED" &&
      (e.prerequisiteSkillId === skillId || e.dependentSkillId === skillId),
  );

  if (blockingEdges.length > 0) {
    const blockingIds = blockingEdges.map((e) => e.id);
    throw new KnowledgeGraphContractError(
      ErrorCodes.KNOWLEDGE_RETIREMENT_BLOCKED,
      `Skill ${skillId} cannot be retired; ${blockingIds.length} PUBLISHED REQUIRED edge(s) reference it`,
      {
        skillId,
        blockingDependencyIds: blockingIds,
        blockingEdgeCount: blockingIds.length,
      },
    );
  }
}
