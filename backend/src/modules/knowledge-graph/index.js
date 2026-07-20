/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Knowledge Graph Module
 * ──────────────────────────────────────────────
 * Public API for Knowledge Graph integrity contracts.
 *
 * Exports:
 * - KnowledgeGraphContractError
 * - ErrorCodes
 * - All approved public assertion functions
 *
 * Does NOT export internal traversal helpers.
 * ──────────────────────────────────────────────
 */

export {
  KnowledgeGraphContractError,
  ErrorCodes,
} from "./knowledgeGraph.errors.js";

export {
  assertKnowledgeStateTransition,
  assertSemanticCodeImmutable,
  assertExpectedVersion,
  assertDependencyEndpoints,
  assertNoSelfDependency,
  assertNoDuplicateDependency,
  assertNoRequiredCycle,
  assertDependencyCanBeSaved,
  assertSubjectCanPublish,
  assertConceptCanPublish,
  assertSkillCanPublish,
  assertDependencyCanPublish,
  assertSkillCanRetire,
} from "./knowledgeGraph.business.js";
