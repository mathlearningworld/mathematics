/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Knowledge Graph Contract Test
 * ──────────────────────────────────────────────
 * Verifies the public API contract of the knowledge-graph module.
 * ──────────────────────────────────────────────
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODULE_DIR = resolve(__dirname);

// ── 1. Public exports ────────────────────────

describe("knowledge-graph public API", () => {
  let mod;
  beforeAll(async () => {
    mod = await import("./index.js");
  });

  it("exports KnowledgeGraphContractError", () => {
    expect(mod.KnowledgeGraphContractError).toBeDefined();
    expect(mod.KnowledgeGraphContractError.name).toBe(
      "KnowledgeGraphContractError",
    );
  });

  it("exports ErrorCodes with all required codes", () => {
    expect(mod.ErrorCodes).toBeDefined();
    const requiredCodes = [
      "KNOWLEDGE_INVALID_STATE_TRANSITION",
      "KNOWLEDGE_CODE_IMMUTABLE",
      "KNOWLEDGE_VERSION_CONFLICT",
      "KNOWLEDGE_ENDPOINT_NOT_FOUND",
      "KNOWLEDGE_ENDPOINT_RETIRED",
      "KNOWLEDGE_DUPLICATE_DEPENDENCY",
      "KNOWLEDGE_SELF_DEPENDENCY",
      "KNOWLEDGE_REQUIRED_CYCLE",
      "KNOWLEDGE_PUBLICATION_BLOCKED",
      "KNOWLEDGE_RETIREMENT_BLOCKED",
    ];
    for (const code of requiredCodes) {
      expect(mod.ErrorCodes[code]).toBe(code);
    }
  });

  it("exports assertKnowledgeStateTransition", () => {
    expect(typeof mod.assertKnowledgeStateTransition).toBe("function");
  });

  it("exports assertSemanticCodeImmutable", () => {
    expect(typeof mod.assertSemanticCodeImmutable).toBe("function");
  });

  it("exports assertExpectedVersion", () => {
    expect(typeof mod.assertExpectedVersion).toBe("function");
  });

  it("exports assertDependencyEndpoints", () => {
    expect(typeof mod.assertDependencyEndpoints).toBe("function");
  });

  it("exports assertNoSelfDependency", () => {
    expect(typeof mod.assertNoSelfDependency).toBe("function");
  });

  it("exports assertNoDuplicateDependency", () => {
    expect(typeof mod.assertNoDuplicateDependency).toBe("function");
  });

  it("exports assertNoRequiredCycle", () => {
    expect(typeof mod.assertNoRequiredCycle).toBe("function");
  });

  it("exports assertDependencyCanBeSaved", () => {
    expect(typeof mod.assertDependencyCanBeSaved).toBe("function");
  });

  it("exports assertSubjectCanPublish", () => {
    expect(typeof mod.assertSubjectCanPublish).toBe("function");
  });

  it("exports assertConceptCanPublish", () => {
    expect(typeof mod.assertConceptCanPublish).toBe("function");
  });

  it("exports assertSkillCanPublish", () => {
    expect(typeof mod.assertSkillCanPublish).toBe("function");
  });

  it("exports assertDependencyCanPublish", () => {
    expect(typeof mod.assertDependencyCanPublish).toBe("function");
  });

  it("exports assertSkillCanRetire", () => {
    expect(typeof mod.assertSkillCanRetire).toBe("function");
  });

  it("does NOT export internal traversal helpers", () => {
    const internalNames = [
      "buildRequiredAdjacency",
      "findPath",
      "ALLOWED_TRANSITIONS",
    ];
    for (const name of internalNames) {
      expect(mod[name]).toBeUndefined();
    }
  });
});

// ── 2. No Prisma import ──────────────────────

describe("no Prisma dependency", () => {
  const sourceFiles = [
    "knowledgeGraph.errors.js",
    "knowledgeGraph.business.js",
    "knowledgeGraph.policy.js",
    "index.js",
  ];

  for (const file of sourceFiles) {
    it(`${file} does not import Prisma`, () => {
      const content = readFileSync(resolve(MODULE_DIR, file), "utf-8");
      const lines = content.split("\n");
      const prismaImports = lines.filter(
        (l) =>
          l.includes('from "@prisma/client"') ||
          l.includes('from "prisma"') ||
          l.includes('require("@prisma/client")') ||
          l.includes('require("prisma")'),
      );
      expect(prismaImports).toEqual([]);
    });
  }
});

// ── 3. No HTTP/Express import ────────────────

describe("no HTTP/Express dependency", () => {
  const sourceFiles = [
    "knowledgeGraph.errors.js",
    "knowledgeGraph.business.js",
    "knowledgeGraph.policy.js",
    "index.js",
  ];

  for (const file of sourceFiles) {
    it(`${file} does not import HTTP/Express`, () => {
      const content = readFileSync(resolve(MODULE_DIR, file), "utf-8");
      const lines = content.split("\n");
      const httpImports = lines.filter(
        (l) =>
          l.includes('from "express"') ||
          l.includes('from "http"') ||
          l.includes('require("express")') ||
          l.includes('require("http")'),
      );
      expect(httpImports).toEqual([]);
    });
  }
});

// ── 4. No environment dependency ─────────────

describe("no environment dependency", () => {
  const sourceFiles = [
    "knowledgeGraph.errors.js",
    "knowledgeGraph.business.js",
    "knowledgeGraph.policy.js",
    "index.js",
  ];

  for (const file of sourceFiles) {
    it(`${file} does not reference process.env`, () => {
      const content = readFileSync(resolve(MODULE_DIR, file), "utf-8");
      expect(content.includes("process.env")).toBe(false);
    });
  }
});
