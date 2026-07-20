/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Knowledge Graph Tests
 * ──────────────────────────────────────────────
 * Comprehensive Vitest tests for Knowledge Graph integrity contracts.
 * ──────────────────────────────────────────────
 */

import { describe, it, expect } from "vitest";
import {
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
  KnowledgeGraphContractError,
  ErrorCodes,
} from "./index.js";

// ── Helpers ──────────────────────────────────

/**
 * Assert that a function throws KnowledgeGraphContractError with the given code.
 */
function assertThrowsCode(fn, code) {
  expect(fn).toThrow(KnowledgeGraphContractError);
  try {
    fn();
  } catch (err) {
    expect(err.code).toBe(code);
  }
}

// ── State Transition Tests ───────────────────

describe("assertKnowledgeStateTransition", () => {
  // Positive
  it("allows DRAFT → REVIEW", () => {
    expect(() =>
      assertKnowledgeStateTransition({
        currentState: "DRAFT",
        nextState: "REVIEW",
      }),
    ).not.toThrow();
  });

  it("allows REVIEW → DRAFT", () => {
    expect(() =>
      assertKnowledgeStateTransition({
        currentState: "REVIEW",
        nextState: "DRAFT",
      }),
    ).not.toThrow();
  });

  it("allows REVIEW → PUBLISHED", () => {
    expect(() =>
      assertKnowledgeStateTransition({
        currentState: "REVIEW",
        nextState: "PUBLISHED",
      }),
    ).not.toThrow();
  });

  it("allows PUBLISHED → RETIRED", () => {
    expect(() =>
      assertKnowledgeStateTransition({
        currentState: "PUBLISHED",
        nextState: "RETIRED",
      }),
    ).not.toThrow();
  });

  // Negative
  it("rejects DRAFT → PUBLISHED", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "DRAFT",
          nextState: "PUBLISHED",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });

  it("rejects RETIRED → DRAFT", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "RETIRED",
          nextState: "DRAFT",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });

  it("rejects same-state transition (DRAFT → DRAFT)", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "DRAFT",
          nextState: "DRAFT",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });

  it("rejects same-state transition (PUBLISHED → PUBLISHED)", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "PUBLISHED",
          nextState: "PUBLISHED",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });

  it("rejects RETIRED → PUBLISHED", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "RETIRED",
          nextState: "PUBLISHED",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });

  it("rejects PUBLISHED → DRAFT", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "PUBLISHED",
          nextState: "DRAFT",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });

  it("rejects PUBLISHED → REVIEW", () => {
    assertThrowsCode(
      () =>
        assertKnowledgeStateTransition({
          currentState: "PUBLISHED",
          nextState: "REVIEW",
        }),
      ErrorCodes.KNOWLEDGE_INVALID_STATE_TRANSITION,
    );
  });
});

// ── Code Immutability Tests ──────────────────

describe("assertSemanticCodeImmutable", () => {
  it("passes when code is unchanged", () => {
    expect(() =>
      assertSemanticCodeImmutable({
        currentCode: "MATH.FRACTION",
        nextCode: "MATH.FRACTION",
      }),
    ).not.toThrow();
  });

  it("fails when code changes", () => {
    assertThrowsCode(
      () =>
        assertSemanticCodeImmutable({
          currentCode: "MATH.FRACTION",
          nextCode: "MATH.ALGEBRA",
        }),
      ErrorCodes.KNOWLEDGE_CODE_IMMUTABLE,
    );
  });

  it("is case-sensitive", () => {
    assertThrowsCode(
      () =>
        assertSemanticCodeImmutable({
          currentCode: "MATH.FRACTION",
          nextCode: "math.fraction",
        }),
      ErrorCodes.KNOWLEDGE_CODE_IMMUTABLE,
    );
  });
});

// ── Version Contract Tests ───────────────────

describe("assertExpectedVersion", () => {
  it("passes when versions match", () => {
    expect(() =>
      assertExpectedVersion({ actualVersion: 1, expectedVersion: 1 }),
    ).not.toThrow();
  });

  it("passes with larger matching versions", () => {
    expect(() =>
      assertExpectedVersion({ actualVersion: 5, expectedVersion: 5 }),
    ).not.toThrow();
  });

  it("fails on version mismatch", () => {
    assertThrowsCode(
      () => assertExpectedVersion({ actualVersion: 1, expectedVersion: 2 }),
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
    );
  });

  it("fails on zero actual version", () => {
    assertThrowsCode(
      () => assertExpectedVersion({ actualVersion: 0, expectedVersion: 1 }),
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
    );
  });

  it("fails on negative actual version", () => {
    assertThrowsCode(
      () => assertExpectedVersion({ actualVersion: -1, expectedVersion: 1 }),
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
    );
  });

  it("fails on non-integer actual version", () => {
    assertThrowsCode(
      () => assertExpectedVersion({ actualVersion: 1.5, expectedVersion: 1 }),
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
    );
  });

  it("fails on zero expected version", () => {
    assertThrowsCode(
      () => assertExpectedVersion({ actualVersion: 1, expectedVersion: 0 }),
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
    );
  });

  it("fails on negative expected version", () => {
    assertThrowsCode(
      () => assertExpectedVersion({ actualVersion: 1, expectedVersion: -1 }),
      ErrorCodes.KNOWLEDGE_VERSION_CONFLICT,
    );
  });
});

// ── Dependency Endpoint Tests ────────────────

describe("assertDependencyEndpoints", () => {
  const activeSkill = { id: "skill-a", state: "PUBLISHED" };

  it("passes when both endpoints exist and are not RETIRED", () => {
    expect(() =>
      assertDependencyEndpoints({
        prerequisiteSkill: activeSkill,
        dependentSkill: { id: "skill-b", state: "DRAFT" },
      }),
    ).not.toThrow();
  });

  it("fails when prerequisite is missing", () => {
    assertThrowsCode(
      () =>
        assertDependencyEndpoints({
          prerequisiteSkill: null,
          dependentSkill: activeSkill,
        }),
      ErrorCodes.KNOWLEDGE_ENDPOINT_NOT_FOUND,
    );
  });

  it("fails when dependent is missing", () => {
    assertThrowsCode(
      () =>
        assertDependencyEndpoints({
          prerequisiteSkill: activeSkill,
          dependentSkill: null,
        }),
      ErrorCodes.KNOWLEDGE_ENDPOINT_NOT_FOUND,
    );
  });

  it("fails when prerequisite is RETIRED", () => {
    assertThrowsCode(
      () =>
        assertDependencyEndpoints({
          prerequisiteSkill: { id: "skill-a", state: "RETIRED" },
          dependentSkill: activeSkill,
        }),
      ErrorCodes.KNOWLEDGE_ENDPOINT_RETIRED,
    );
  });

  it("fails when dependent is RETIRED", () => {
    assertThrowsCode(
      () =>
        assertDependencyEndpoints({
          prerequisiteSkill: activeSkill,
          dependentSkill: { id: "skill-b", state: "RETIRED" },
        }),
      ErrorCodes.KNOWLEDGE_ENDPOINT_RETIRED,
    );
  });
});

// ── Self-Dependency Tests ────────────────────

describe("assertNoSelfDependency", () => {
  it("passes when skills are different", () => {
    expect(() =>
      assertNoSelfDependency({
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
      }),
    ).not.toThrow();
  });

  it("fails for REQUIRED self-dependency", () => {
    assertThrowsCode(
      () =>
        assertNoSelfDependency({
          prerequisiteSkillId: "skill-a",
          dependentSkillId: "skill-a",
        }),
      ErrorCodes.KNOWLEDGE_SELF_DEPENDENCY,
    );
  });

  it("fails for SUPPORTING self-dependency", () => {
    assertThrowsCode(
      () =>
        assertNoSelfDependency({
          prerequisiteSkillId: "skill-b",
          dependentSkillId: "skill-b",
        }),
      ErrorCodes.KNOWLEDGE_SELF_DEPENDENCY,
    );
  });
});

// ── Duplicate Dependency Tests ───────────────

describe("assertNoDuplicateDependency", () => {
  const existingEdges = [
    {
      id: "dep-1",
      prerequisiteSkillId: "skill-a",
      dependentSkillId: "skill-b",
      kind: "REQUIRED",
    },
    {
      id: "dep-2",
      prerequisiteSkillId: "skill-c",
      dependentSkillId: "skill-d",
      kind: "SUPPORTING",
    },
  ];

  it("passes when pair does not exist", () => {
    expect(() =>
      assertNoDuplicateDependency({
        prerequisiteSkillId: "skill-x",
        dependentSkillId: "skill-y",
        existingEdges,
      }),
    ).not.toThrow();
  });

  it("fails when exact pair exists (same kind)", () => {
    assertThrowsCode(
      () =>
        assertNoDuplicateDependency({
          prerequisiteSkillId: "skill-a",
          dependentSkillId: "skill-b",
          existingEdges,
        }),
      ErrorCodes.KNOWLEDGE_DUPLICATE_DEPENDENCY,
    );
  });

  it("fails when pair exists even with different kind", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
      },
    ];
    assertThrowsCode(
      () =>
        assertNoDuplicateDependency({
          prerequisiteSkillId: "skill-a",
          dependentSkillId: "skill-b",
          existingEdges: edges,
        }),
      ErrorCodes.KNOWLEDGE_DUPLICATE_DEPENDENCY,
    );
  });

  it("excludes itself during update", () => {
    expect(() =>
      assertNoDuplicateDependency({
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        existingEdges,
        excludeDependencyId: "dep-1",
      }),
    ).not.toThrow();
  });
});

// ── REQUIRED Cycle Detection Tests ───────────

describe("assertNoRequiredCycle", () => {
  it("passes for valid A → B → C chain", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
      {
        id: "dep-2",
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-c",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-c",
        dependentSkillId: "skill-d",
        existingEdges: edges,
      }),
    ).not.toThrow();
  });

  it("fails for A → B → C → A cycle", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
      {
        id: "dep-2",
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-c",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    assertThrowsCode(
      () =>
        assertNoRequiredCycle({
          prerequisiteSkillId: "skill-c",
          dependentSkillId: "skill-a",
          existingEdges: edges,
        }),
      ErrorCodes.KNOWLEDGE_REQUIRED_CYCLE,
    );
  });

  it("includes cycle path in error details", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
      {
        id: "dep-2",
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-c",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    try {
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-c",
        dependentSkillId: "skill-a",
        existingEdges: edges,
      });
    } catch (err) {
      expect(err.details.cyclePath).toBeDefined();
      expect(err.details.cyclePath.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("terminates safely when existing graph already has cycles", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
      {
        id: "dep-2",
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-a",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    // Adding A → C does not create a new cycle (C is a new node).
    // The function should not crash despite pre-existing cycles in the graph.
    expect(() =>
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-c",
        existingEdges: edges,
      }),
    ).not.toThrow();
  });

  it("ignores SUPPORTING edges in cycle detection", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "SUPPORTING",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-a",
        existingEdges: edges,
      }),
    ).not.toThrow();
  });

  it("ignores RETIRED edges in cycle detection", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "RETIRED",
      },
    ];
    expect(() =>
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-a",
        existingEdges: edges,
      }),
    ).not.toThrow();
  });

  it("excludes edge during update", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-a",
        existingEdges: edges,
        excludeDependencyId: "dep-1",
      }),
    ).not.toThrow();
  });
});

// ── Coordinating Dependency Validation ───────

describe("assertDependencyCanBeSaved", () => {
  it("passes for valid REQUIRED chain A → B → C", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertDependencyCanBeSaved({
        prerequisiteSkill: { id: "skill-b", state: "PUBLISHED" },
        dependentSkill: { id: "skill-c", state: "DRAFT" },
        kind: "REQUIRED",
        state: "DRAFT",
        existingEdges: edges,
      }),
    ).not.toThrow();
  });

  it("passes for valid SUPPORTING relationship", () => {
    expect(() =>
      assertDependencyCanBeSaved({
        prerequisiteSkill: { id: "skill-a", state: "PUBLISHED" },
        dependentSkill: { id: "skill-b", state: "DRAFT" },
        kind: "SUPPORTING",
        state: "DRAFT",
        existingEdges: [],
      }),
    ).not.toThrow();
  });

  it("excludes itself from duplicate detection during update", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertDependencyCanBeSaved({
        dependencyId: "dep-1",
        prerequisiteSkill: { id: "skill-a", state: "PUBLISHED" },
        dependentSkill: { id: "skill-b", state: "PUBLISHED" },
        kind: "REQUIRED",
        state: "PUBLISHED",
        existingEdges: edges,
      }),
    ).not.toThrow();
  });
});

// ── Publication Contract Tests ───────────────

describe("assertSubjectCanPublish", () => {
  it("passes with complete REVIEW data", () => {
    expect(() =>
      assertSubjectCanPublish({
        state: "REVIEW",
        code: "MATH",
        slug: "mathematics",
        internalName: "Mathematics",
        version: 1,
      }),
    ).not.toThrow();
  });

  it("fails when state is not REVIEW", () => {
    assertThrowsCode(
      () =>
        assertSubjectCanPublish({
          state: "DRAFT",
          code: "MATH",
          slug: "mathematics",
          internalName: "Mathematics",
          version: 1,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on empty code", () => {
    assertThrowsCode(
      () =>
        assertSubjectCanPublish({
          state: "REVIEW",
          code: "",
          slug: "mathematics",
          internalName: "Mathematics",
          version: 1,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on empty slug", () => {
    assertThrowsCode(
      () =>
        assertSubjectCanPublish({
          state: "REVIEW",
          code: "MATH",
          slug: "",
          internalName: "Mathematics",
          version: 1,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on empty internalName", () => {
    assertThrowsCode(
      () =>
        assertSubjectCanPublish({
          state: "REVIEW",
          code: "MATH",
          slug: "mathematics",
          internalName: "",
          version: 1,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on non-positive version", () => {
    assertThrowsCode(
      () =>
        assertSubjectCanPublish({
          state: "REVIEW",
          code: "MATH",
          slug: "mathematics",
          internalName: "Mathematics",
          version: 0,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });
});

describe("assertConceptCanPublish", () => {
  const publishedSubject = { state: "PUBLISHED" };

  it("passes with PUBLISHED Subject and complete data", () => {
    expect(() =>
      assertConceptCanPublish({
        concept: {
          state: "REVIEW",
          code: "MATH.FRACTION",
          slug: "fraction",
          internalName: "Fraction",
          semanticDefinition: "A part of a whole",
          version: 1,
        },
        subject: publishedSubject,
      }),
    ).not.toThrow();
  });

  it("fails when Subject is not PUBLISHED", () => {
    assertThrowsCode(
      () =>
        assertConceptCanPublish({
          concept: {
            state: "REVIEW",
            code: "MATH.FRACTION",
            slug: "fraction",
            internalName: "Fraction",
            semanticDefinition: "A part of a whole",
            version: 1,
          },
          subject: { state: "DRAFT" },
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails when Subject is missing", () => {
    assertThrowsCode(
      () =>
        assertConceptCanPublish({
          concept: {
            state: "REVIEW",
            code: "MATH.FRACTION",
            slug: "fraction",
            internalName: "Fraction",
            semanticDefinition: "A part of a whole",
            version: 1,
          },
          subject: null,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on blank semanticDefinition", () => {
    assertThrowsCode(
      () =>
        assertConceptCanPublish({
          concept: {
            state: "REVIEW",
            code: "MATH.FRACTION",
            slug: "fraction",
            internalName: "Fraction",
            semanticDefinition: "",
            version: 1,
          },
          subject: publishedSubject,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });
});

describe("assertSkillCanPublish", () => {
  const publishedConcept = { state: "PUBLISHED" };

  it("passes with PUBLISHED Concept and complete data", () => {
    expect(() =>
      assertSkillCanPublish({
        skill: {
          state: "REVIEW",
          code: "MATH.FRACTION.EQUAL_PARTS",
          slug: "equal-parts",
          internalName: "Equal Parts",
          capabilityStatement: "Can identify equal parts of a whole",
          observableOutcome: "Correctly identifies equal parts in a diagram",
          version: 1,
        },
        concept: publishedConcept,
      }),
    ).not.toThrow();
  });

  it("fails when Concept is not PUBLISHED", () => {
    assertThrowsCode(
      () =>
        assertSkillCanPublish({
          skill: {
            state: "REVIEW",
            code: "MATH.FRACTION.EQUAL_PARTS",
            slug: "equal-parts",
            internalName: "Equal Parts",
            capabilityStatement: "Can identify equal parts",
            observableOutcome: "Identifies equal parts",
            version: 1,
          },
          concept: { state: "DRAFT" },
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on blank capabilityStatement", () => {
    assertThrowsCode(
      () =>
        assertSkillCanPublish({
          skill: {
            state: "REVIEW",
            code: "MATH.FRACTION.EQUAL_PARTS",
            slug: "equal-parts",
            internalName: "Equal Parts",
            capabilityStatement: "",
            observableOutcome: "Identifies equal parts",
            version: 1,
          },
          concept: publishedConcept,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on blank observableOutcome", () => {
    assertThrowsCode(
      () =>
        assertSkillCanPublish({
          skill: {
            state: "REVIEW",
            code: "MATH.FRACTION.EQUAL_PARTS",
            slug: "equal-parts",
            internalName: "Equal Parts",
            capabilityStatement: "Can identify equal parts",
            observableOutcome: "",
            version: 1,
          },
          concept: publishedConcept,
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });
});

describe("assertDependencyCanPublish", () => {
  const publishedSkillA = { id: "skill-a", state: "PUBLISHED" };
  const publishedSkillB = { id: "skill-b", state: "PUBLISHED" };

  it("passes for acyclic graph with PUBLISHED endpoints", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertDependencyCanPublish({
        dependency: {
          id: "dep-2",
          state: "REVIEW",
          kind: "REQUIRED",
          rationale: "B builds on A",
          version: 1,
        },
        prerequisiteSkill: publishedSkillA,
        dependentSkill: { id: "skill-c", state: "PUBLISHED" },
        existingEdges: edges,
      }),
    ).not.toThrow();
  });

  it("fails when endpoint Skill is not PUBLISHED", () => {
    assertThrowsCode(
      () =>
        assertDependencyCanPublish({
          dependency: {
            id: "dep-2",
            state: "REVIEW",
            kind: "REQUIRED",
            rationale: "B builds on A",
            version: 1,
          },
          prerequisiteSkill: { id: "skill-a", state: "DRAFT" },
          dependentSkill: publishedSkillB,
          existingEdges: [],
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });

  it("fails on blank rationale", () => {
    assertThrowsCode(
      () =>
        assertDependencyCanPublish({
          dependency: {
            id: "dep-2",
            state: "REVIEW",
            kind: "REQUIRED",
            rationale: "",
            version: 1,
          },
          prerequisiteSkill: publishedSkillA,
          dependentSkill: publishedSkillB,
          existingEdges: [],
        }),
      ErrorCodes.KNOWLEDGE_PUBLICATION_BLOCKED,
    );
  });
});

// ── Retirement Contract Tests ────────────────

describe("assertSkillCanRetire", () => {
  it("passes when no PUBLISHED REQUIRED edge references the skill", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertSkillCanRetire({ skillId: "skill-c", existingEdges: edges }),
    ).not.toThrow();
  });

  it("fails when skill is referenced as prerequisite by PUBLISHED REQUIRED edge", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    assertThrowsCode(
      () => assertSkillCanRetire({ skillId: "skill-a", existingEdges: edges }),
      ErrorCodes.KNOWLEDGE_RETIREMENT_BLOCKED,
    );
  });

  it("fails when skill is referenced as dependent by PUBLISHED REQUIRED edge", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    assertThrowsCode(
      () => assertSkillCanRetire({ skillId: "skill-b", existingEdges: edges }),
      ErrorCodes.KNOWLEDGE_RETIREMENT_BLOCKED,
    );
  });

  it("SUPPORTING edge does not block retirement", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "SUPPORTING",
        state: "PUBLISHED",
      },
    ];
    expect(() =>
      assertSkillCanRetire({ skillId: "skill-a", existingEdges: edges }),
    ).not.toThrow();
  });

  it("DRAFT REQUIRED edge does not block retirement", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "DRAFT",
      },
    ];
    expect(() =>
      assertSkillCanRetire({ skillId: "skill-a", existingEdges: edges }),
    ).not.toThrow();
  });

  it("REVIEW REQUIRED edge does not block retirement", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "REVIEW",
      },
    ];
    expect(() =>
      assertSkillCanRetire({ skillId: "skill-a", existingEdges: edges }),
    ).not.toThrow();
  });

  it("RETIRED REQUIRED edge does not block retirement", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "RETIRED",
      },
    ];
    expect(() =>
      assertSkillCanRetire({ skillId: "skill-a", existingEdges: edges }),
    ).not.toThrow();
  });

  it("includes blocking dependency IDs in error details", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    try {
      assertSkillCanRetire({ skillId: "skill-a", existingEdges: edges });
    } catch (err) {
      expect(err.details.blockingDependencyIds).toEqual(["dep-1"]);
    }
  });
});

// ── Input Immutability Tests ─────────────────

describe("input immutability", () => {
  it("existingEdges array is not mutated by cycle detection", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    const original = JSON.stringify(edges);
    try {
      assertNoRequiredCycle({
        prerequisiteSkillId: "skill-b",
        dependentSkillId: "skill-a",
        existingEdges: edges,
      });
    } catch {
      // expected
    }
    expect(JSON.stringify(edges)).toBe(original);
  });

  it("existingEdges array is not mutated by duplicate check", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
      },
    ];
    const original = JSON.stringify(edges);
    try {
      assertNoDuplicateDependency({
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        existingEdges: edges,
      });
    } catch {
      // expected
    }
    expect(JSON.stringify(edges)).toBe(original);
  });

  it("existingEdges array is not mutated by assertDependencyCanBeSaved", () => {
    const edges = [
      {
        id: "dep-1",
        prerequisiteSkillId: "skill-a",
        dependentSkillId: "skill-b",
        kind: "REQUIRED",
        state: "PUBLISHED",
      },
    ];
    const original = JSON.stringify(edges);
    try {
      assertDependencyCanBeSaved({
        prerequisiteSkill: { id: "skill-b", state: "PUBLISHED" },
        dependentSkill: { id: "skill-a", state: "PUBLISHED" },
        kind: "REQUIRED",
        state: "PUBLISHED",
        existingEdges: edges,
      });
    } catch {
      // expected
    }
    expect(JSON.stringify(edges)).toBe(original);
  });
});
