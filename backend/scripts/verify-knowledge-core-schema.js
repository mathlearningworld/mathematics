/**
 * ──────────────────────────────────────────────
 * Mathematics Backend — Knowledge Core Schema Verifier
 * ──────────────────────────────────────────────
 * Reads prisma/schema.prisma without connecting to a database.
 * Validates the Knowledge Core v1 schema contract.
 * ──────────────────────────────────────────────
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = resolve(__dirname, "..");
const SCHEMA_PATH = resolve(BACKEND_ROOT, "prisma", "schema.prisma");
const MIGRATIONS_DIR = resolve(BACKEND_ROOT, "prisma", "migrations");

let exitCode = 0;
const results = [];

function pass(label) {
  results.push(`  ✅ ${label}`);
}

function fail(label, detail) {
  results.push(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  exitCode = 1;
}

// Read the schema file
let schema;
try {
  schema = readFileSync(SCHEMA_PATH, "utf-8");
} catch {
  fail("Read schema file", "Cannot read prisma/schema.prisma");
  printResults();
  process.exit(1);
}

// ── 1. KnowledgeState enum ──────────────────
const knowledgeStateMatch = schema.match(/enum\s+KnowledgeState\s*\{([^}]+)\}/);
if (knowledgeStateMatch) {
  const body = knowledgeStateMatch[1];
  const values = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("@@"));
  const expected = ["DRAFT", "REVIEW", "PUBLISHED", "RETIRED"];
  const missing = expected.filter((v) => !values.includes(v));
  const extra = values.filter((v) => !expected.includes(v));
  if (missing.length === 0 && extra.length === 0) {
    pass("KnowledgeState enum has exactly DRAFT, REVIEW, PUBLISHED, RETIRED");
  } else {
    if (missing.length)
      fail("KnowledgeState enum", `Missing values: ${missing.join(", ")}`);
    if (extra.length)
      fail("KnowledgeState enum", `Unexpected values: ${extra.join(", ")}`);
  }
} else {
  fail("KnowledgeState enum", "Not found");
}

// ── 2. SkillDependencyKind enum ─────────────
const depKindMatch = schema.match(/enum\s+SkillDependencyKind\s*\{([^}]+)\}/);
if (depKindMatch) {
  const body = depKindMatch[1];
  const values = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("@@"));
  const expected = ["REQUIRED", "SUPPORTING"];
  const missing = expected.filter((v) => !values.includes(v));
  const extra = values.filter((v) => !expected.includes(v));
  if (missing.length === 0 && extra.length === 0) {
    pass("SkillDependencyKind enum has exactly REQUIRED, SUPPORTING");
  } else {
    if (missing.length)
      fail("SkillDependencyKind enum", `Missing values: ${missing.join(", ")}`);
    if (extra.length)
      fail(
        "SkillDependencyKind enum",
        `Unexpected values: ${extra.join(", ")}`,
      );
  }
} else {
  fail("SkillDependencyKind enum", "Not found");
}

// ── 3. Models exist ─────────────────────────
const modelNames = ["Subject", "Concept", "Skill", "SkillDependency"];
for (const name of modelNames) {
  const re = new RegExp(`model\\s+${name}\\s*\\{`);
  if (re.test(schema)) {
    pass(`Model ${name} exists`);
  } else {
    fail(`Model ${name}`, "Not found");
  }
}

// Helper: extract a model block
function getModelBlock(name) {
  const re = new RegExp(`model\\s+${name}\\s*\\{([\\s\\S]*?)^\\}`, "m");
  const match = schema.match(re);
  return match ? match[1] : null;
}

// ── 4. UUID id ──────────────────────────────
for (const name of modelNames) {
  const block = getModelBlock(name);
  if (block) {
    if (
      /^\s+id\s+String\s+@id\s+@default\(uuid\(\)\)\s+@db\.Uuid/m.test(block)
    ) {
      pass(`${name} uses UUID id`);
    } else {
      fail(`${name} id`, "Must be String @id @default(uuid()) @db.Uuid");
    }
  }
}

// ── 5. Common fields (state, version, createdAt, updatedAt) ──
for (const name of modelNames) {
  const block = getModelBlock(name);
  if (!block) continue;
  const checks = [
    { field: "state", pattern: /state\s+KnowledgeState\s+@default\(DRAFT\)/ },
    { field: "version", pattern: /version\s+Int\s+@default\(1\)/ },
    {
      field: "createdAt",
      pattern: /createdAt\s+DateTime\s+@default\(now\(\)\)/,
    },
    {
      field: "updatedAt",
      pattern: /updatedAt\s+DateTime\s+@updatedAt/,
    },
  ];
  for (const { field, pattern } of checks) {
    if (pattern.test(block)) {
      pass(`${name} has ${field}`);
    } else {
      fail(`${name} ${field}`, "Missing or incorrect definition");
    }
  }
}

// ── 6. Concept requires subjectId ───────────
const conceptBlock = getModelBlock("Concept");
if (conceptBlock) {
  if (
    /subjectId\s+String\s+@map\("subject_id"\)\s+@db\.Uuid/.test(conceptBlock)
  ) {
    pass("Concept requires subjectId");
  } else {
    fail("Concept subjectId", "Missing or incorrect definition");
  }
}

// ── 7. Skill requires conceptId ─────────────
const skillBlock = getModelBlock("Skill");
if (skillBlock) {
  if (
    /conceptId\s+String\s+@map\("concept_id"\)\s+@db\.Uuid/.test(skillBlock)
  ) {
    pass("Skill requires conceptId");
  } else {
    fail("Skill conceptId", "Missing or incorrect definition");
  }
}

// ── 8. SkillDependency requires prerequisiteSkillId and dependentSkillId ──
const depBlock = getModelBlock("SkillDependency");
if (depBlock) {
  if (
    /prerequisiteSkillId\s+String\s+@map\("prerequisite_skill_id"\)\s+@db\.Uuid/.test(
      depBlock,
    )
  ) {
    pass("SkillDependency has prerequisiteSkillId");
  } else {
    fail("SkillDependency prerequisiteSkillId", "Missing or incorrect");
  }
  if (
    /dependentSkillId\s+String\s+@map\("dependent_skill_id"\)\s+@db\.Uuid/.test(
      depBlock,
    )
  ) {
    pass("SkillDependency has dependentSkillId");
  } else {
    fail("SkillDependency dependentSkillId", "Missing or incorrect");
  }
}

// ── 9. Dependency pair unique constraint ────
if (depBlock) {
  if (
    /@@unique\(\[prerequisiteSkillId,\s*dependentSkillId\]\)/.test(depBlock)
  ) {
    pass("SkillDependency has unique constraint on pair");
  } else {
    fail(
      "SkillDependency unique constraint",
      "Missing @@unique([prerequisiteSkillId, dependentSkillId])",
    );
  }
}

// ── 10. Both dependency traversal indexes ────
if (depBlock) {
  const idx1 = /@@index\(\[dependentSkillId,\s*kind,\s*state\]\)/.test(
    depBlock,
  );
  const idx2 = /@@index\(\[prerequisiteSkillId,\s*kind,\s*state\]\)/.test(
    depBlock,
  );
  if (idx1) pass("SkillDependency has dependentSkillId index");
  else fail("SkillDependency index", "Missing dependentSkillId index");
  if (idx2) pass("SkillDependency has prerequisiteSkillId index");
  else fail("SkillDependency index", "Missing prerequisiteSkillId index");
}

// ── 11. Exact relation contracts ────────────

// 11a. Concept: exactly one knowledge relation (subject)
if (conceptBlock) {
  const conceptRelations = conceptBlock.match(/@relation/g);
  const conceptRelationCount = conceptRelations ? conceptRelations.length : 0;
  if (conceptRelationCount === 1) {
    pass("Concept has exactly one knowledge relation");
  } else {
    fail(
      "Concept relations",
      `Expected 1 relation, found ${conceptRelationCount}`,
    );
  }

  // subject relation must contain onDelete: Restrict and onUpdate: Cascade
  const subjectRelationMatch = conceptBlock.match(
    /subject\s+Subject\s+@relation\(([^)]+)\)/,
  );
  if (subjectRelationMatch) {
    const relBody = subjectRelationMatch[1];
    if (/onDelete:\s*Restrict/.test(relBody)) {
      pass("Concept.subject relation has onDelete: Restrict");
    } else {
      fail("Concept.subject relation", "Missing onDelete: Restrict");
    }
    if (/onUpdate:\s*Cascade/.test(relBody)) {
      pass("Concept.subject relation has onUpdate: Cascade");
    } else {
      fail("Concept.subject relation", "Missing onUpdate: Cascade");
    }
  } else {
    fail("Concept.subject relation", "Not found");
  }
}

// 11b. Skill: exactly one owning knowledge relation (concept)
if (skillBlock) {
  const skillRelations = skillBlock.match(/@relation/g);
  const skillRelationCount = skillRelations ? skillRelations.length : 0;
  // Skill has 3 @relation: concept (owning) + dependencies + unlocks (both SkillDependency[])
  // We check that there is exactly 1 owning relation (concept)
  if (skillRelationCount === 3) {
    pass("Skill has expected relation count (1 owning + 2 SkillDependency[])");
  } else {
    fail(
      "Skill relations",
      `Expected 3 @relation occurrences, found ${skillRelationCount}`,
    );
  }

  const conceptRelationMatch = skillBlock.match(
    /concept\s+Concept\s+@relation\(([^)]+)\)/,
  );
  if (conceptRelationMatch) {
    const relBody = conceptRelationMatch[1];
    if (/onDelete:\s*Restrict/.test(relBody)) {
      pass("Skill.concept relation has onDelete: Restrict");
    } else {
      fail("Skill.concept relation", "Missing onDelete: Restrict");
    }
    if (/onUpdate:\s*Cascade/.test(relBody)) {
      pass("Skill.concept relation has onUpdate: Cascade");
    } else {
      fail("Skill.concept relation", "Missing onUpdate: Cascade");
    }
  } else {
    fail("Skill.concept relation", "Not found");
  }
}

// 11c. SkillDependency: both relations verified independently
if (depBlock) {
  // prerequisiteSkill relation
  const prereqRelationMatch = depBlock.match(
    /prerequisiteSkill\s+Skill\s+@relation\("PrerequisiteSkill",\s*([^)]+)\)/,
  );
  if (prereqRelationMatch) {
    const relBody = prereqRelationMatch[1];
    pass(
      "SkillDependency.prerequisiteSkill uses relation name PrerequisiteSkill",
    );
    if (/onDelete:\s*Restrict/.test(relBody)) {
      pass("SkillDependency.prerequisiteSkill has onDelete: Restrict");
    } else {
      fail(
        "SkillDependency.prerequisiteSkill relation",
        "Missing onDelete: Restrict",
      );
    }
    if (/onUpdate:\s*Cascade/.test(relBody)) {
      pass("SkillDependency.prerequisiteSkill has onUpdate: Cascade");
    } else {
      fail(
        "SkillDependency.prerequisiteSkill relation",
        "Missing onUpdate: Cascade",
      );
    }
  } else {
    fail(
      "SkillDependency.prerequisiteSkill relation",
      "Not found or missing relation name PrerequisiteSkill",
    );
  }

  // dependentSkill relation
  const depRelationMatch = depBlock.match(
    /dependentSkill\s+Skill\s+@relation\("DependentSkill",\s*([^)]+)\)/,
  );
  if (depRelationMatch) {
    const relBody = depRelationMatch[1];
    pass("SkillDependency.dependentSkill uses relation name DependentSkill");
    if (/onDelete:\s*Restrict/.test(relBody)) {
      pass("SkillDependency.dependentSkill has onDelete: Restrict");
    } else {
      fail(
        "SkillDependency.dependentSkill relation",
        "Missing onDelete: Restrict",
      );
    }
    if (/onUpdate:\s*Cascade/.test(relBody)) {
      pass("SkillDependency.dependentSkill has onUpdate: Cascade");
    } else {
      fail(
        "SkillDependency.dependentSkill relation",
        "Missing onUpdate: Cascade",
      );
    }
  } else {
    fail(
      "SkillDependency.dependentSkill relation",
      "Not found or missing relation name DependentSkill",
    );
  }
}

// ── 12. Database table names ────────────────
const tableMap = {
  Subject: "subjects",
  Concept: "concepts",
  Skill: "skills",
  SkillDependency: "skill_dependencies",
};
for (const [model, table] of Object.entries(tableMap)) {
  const block = getModelBlock(model);
  if (block) {
    if (block.includes(`@@map("${table}")`)) {
      pass(`${model} maps to table "${table}"`);
    } else {
      fail(`${model} table map`, `Missing @@map("${table}")`);
    }
  }
}

// ── 13. Timestamp fields use Timestamptz(3) ──
for (const name of modelNames) {
  const block = getModelBlock(name);
  if (block) {
    const tsFields = block.match(/@db\.Timestamptz\(3\)/g);
    if (tsFields && tsFields.length >= 2) {
      pass(`${name} uses Timestamptz(3)`);
    } else {
      fail(`${name} Timestamptz(3)`, "Expected at least 2 timestamp fields");
    }
  }
}

// ── 14. Forbidden field names ────────────────
const forbidden = [
  "grade",
  "gradeLevel",
  "country",
  "countryCode",
  "theme",
  "themeId",
  "mastery",
  "masteryScore",
  "score",
  "price",
  "credit",
  "age",
  "recommendedAge",
];
const allModelBlocks = modelNames
  .map((n) => getModelBlock(n))
  .filter(Boolean)
  .join("\n");
const foundForbidden = forbidden.filter((f) => {
  // Match field declarations (word at start of line, not inside a string)
  const re = new RegExp(`^\\s+${f}\\s`, "m");
  return re.test(allModelBlocks);
});
if (foundForbidden.length === 0) {
  pass("No forbidden field names in Knowledge Core models");
} else {
  fail("Forbidden fields", `Found in models: ${foundForbidden.join(", ")}`);
}

// ── 15. (Removed) Migration existence check — now handled by verify-knowledge-persistence.js
// This verifier focuses only on schema.prisma contract validation.

// ── Summary ─────────────────────────────────
function printResults() {
  console.log("\n═══════════════════════════════════════");
  console.log("  Knowledge Core Schema Verification");
  console.log("═══════════════════════════════════════");
  console.log(results.join("\n"));
  console.log("───────────────────────────────────────");
  console.log(
    exitCode === 0
      ? "  ✅ KNOWLEDGE CORE SCHEMA PASSED"
      : "  ❌ KNOWLEDGE CORE SCHEMA FAILED",
  );
  console.log("───────────────────────────────────────\n");
}

printResults();
process.exit(exitCode);
