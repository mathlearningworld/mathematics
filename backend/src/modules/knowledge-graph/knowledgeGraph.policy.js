/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Knowledge Graph Policy
 * ──────────────────────────────────────────────
 * Policy layer that composes business rules into higher-level
 * validation workflows. Pure functions, no side effects.
 * ──────────────────────────────────────────────
 */

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
