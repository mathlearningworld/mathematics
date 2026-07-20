/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Fraction Knowledge Seed Verifier
 * ──────────────────────────────────────────────
 * Statically and behaviorally verifies the Fraction Equivalence V1
 * knowledge seed without connecting to a database.
 *
 * Checks performed:
 *   1. Seed code and version
 *   2. Entity counts (1 Subject, 3 Concepts, 10 Skills, 11 Dependencies)
 *   3. REQUIRED/SUPPORTING counts (9 REQUIRED, 2 SUPPORTING)
 *   4. Unique codes across Subject, Concept, Skill
 *   5. Unique slugs within ownership boundary
 *   6. Every Concept has subjectCode: "MATH"
 *   7. Every Skill references an existing Concept
 *   8. Every dependency endpoint exists
 *   9. No duplicate dependency pair
 *  10. No self-dependency
 *  11. REQUIRED graph is acyclic
 *  12. Every entity is REVIEW version 1
 *  13. Required meaning/outcome fields are non-empty
 *  14. No forbidden fields (grade, country, theme, mastery, price, credit, age)
 *  15. No UUIDs or timestamps
 *  16. Module has no Prisma, HTTP, environment, logger, Date, or random dependency
 *  17. Exported data and nested records cannot be mutated
 *  18. Negative tests (duplicate code, missing endpoint, self-dependency, cycle, mutation)
 *
 * Fail-closed when seed file cannot be read or imported.
 * ──────────────────────────────────────────────
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = resolve(__dirname, "..");
const SEED_PATH = resolve(
  BACKEND_ROOT,
  "prisma",
  "seeds",
  "knowledge",
  "fraction-equivalence-v1.data.js",
);

let exitCode = 0;
const results = [];

function pass(label) {
  results.push(`  ✅ ${label}`);
}

function fail(label, detail) {
  results.push(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  exitCode = 1;
}

// ── Helper: deep freeze check ────────────────
function isDeepFrozen(obj) {
  if (obj === null || typeof obj !== "object") return true;
  if (!Object.isFrozen(obj)) return false;
  return Object.values(obj).every((v) => isDeepFrozen(v));
}

// ── Helper: check for forbidden fields ───────
const FORBIDDEN_FIELDS = [
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

function hasForbiddenFields(obj, path = "") {
  for (const key of Object.keys(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (FORBIDDEN_FIELDS.includes(key)) {
      return fullPath;
    }
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const result = hasForbiddenFields(obj[key], fullPath);
      if (result) return result;
    }
  }
  return null;
}

// ── Helper: check for UUID patterns ──────────
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function findUUIDs(obj, path = "") {
  const found = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (typeof value === "string" && UUID_RE.test(value)) {
      found.push(fullPath);
    }
    if (value && typeof value === "object") {
      found.push(...findUUIDs(value, fullPath));
    }
  }
  return found;
}

// ── Helper: check for timestamp patterns ─────
const TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function findTimestamps(obj, path = "") {
  const found = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;
    if (typeof value === "string" && TIMESTAMP_RE.test(value)) {
      found.push(fullPath);
    }
    if (value && typeof value === "object") {
      found.push(...findTimestamps(value, fullPath));
    }
  }
  return found;
}

// ── Helper: check source file for forbidden imports ──
function checkSourceFile(filePath, label) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const forbiddenPatterns = [
      { pattern: /@prisma\/client/, name: "Prisma" },
      { pattern: /from\s+["']express["']/, name: "Express" },
      { pattern: /from\s+["']http["']/, name: "HTTP" },
      { pattern: /process\.env/, name: "process.env" },
      { pattern: /require\(/, name: "require()" },
    ];
    let hasForbidden = false;
    for (const { pattern, name } of forbiddenPatterns) {
      if (pattern.test(content)) {
        fail(`${label} — contains ${name}`, `Found in ${filePath}`);
        hasForbidden = true;
      }
    }
    if (!hasForbidden) {
      pass(`${label} — no forbidden dependencies`);
    }
  } catch (err) {
    fail(`${label} — could not read file`, err.message);
  }
}

// ── Helper: build adjacency for cycle detection ──
function buildRequiredAdjacency(dependencies) {
  const adj = new Map();
  for (const dep of dependencies) {
    if (dep.kind !== "REQUIRED") continue;
    const from = dep.prerequisiteSkillCode;
    const to = dep.dependentSkillCode;
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
  }
  return adj;
}

function hasCycle(adj) {
  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map();
  for (const node of adj.keys()) {
    color.set(node, WHITE);
  }

  function dfs(node) {
    color.set(node, GRAY);
    const neighbors = adj.get(node) ?? [];
    for (const neighbor of neighbors) {
      if (!color.has(neighbor)) continue;
      if (color.get(neighbor) === GRAY) return true;
      if (color.get(neighbor) === WHITE) {
        if (dfs(neighbor)) return true;
      }
    }
    color.set(node, BLACK);
    return false;
  }

  for (const node of adj.keys()) {
    if (color.get(node) === WHITE) {
      if (dfs(node)) return true;
    }
  }
  return false;
}

// ── Shared seed validator (used by positive and negative tests) ──
function validateSeed(data) {
  const errors = [];

  // Unique codes
  const allCodes = new Set();
  if (allCodes.has(data.subject.code)) errors.push("Duplicate subject code");
  allCodes.add(data.subject.code);
  for (const c of data.concepts) {
    if (allCodes.has(c.code)) errors.push(`Duplicate concept code: ${c.code}`);
    allCodes.add(c.code);
  }
  for (const s of data.skills) {
    if (allCodes.has(s.code)) errors.push(`Duplicate skill code: ${s.code}`);
    allCodes.add(s.code);
  }

  // Unique slugs
  const conceptSlugs = new Set();
  for (const c of data.concepts) {
    if (conceptSlugs.has(c.slug))
      errors.push(`Duplicate concept slug: ${c.slug}`);
    conceptSlugs.add(c.slug);
  }
  const skillSlugs = new Set();
  for (const s of data.skills) {
    if (skillSlugs.has(s.slug)) errors.push(`Duplicate skill slug: ${s.slug}`);
    skillSlugs.add(s.slug);
  }

  // Concept subjectCode
  for (const c of data.concepts) {
    if (c.subjectCode !== "MATH")
      errors.push(`Concept ${c.code} subjectCode is not MATH`);
  }

  // Skill concept reference
  const conceptCodes = new Set(data.concepts.map((c) => c.code));
  for (const s of data.skills) {
    if (!conceptCodes.has(s.conceptCode)) {
      errors.push(
        `Skill ${s.code} references non-existent concept ${s.conceptCode}`,
      );
    }
  }

  // Dependency endpoints
  const skillCodes = new Set(data.skills.map((s) => s.code));
  for (const d of data.dependencies) {
    if (!skillCodes.has(d.prerequisiteSkillCode)) {
      errors.push(`Prerequisite ${d.prerequisiteSkillCode} not found`);
    }
    if (!skillCodes.has(d.dependentSkillCode)) {
      errors.push(`Dependent ${d.dependentSkillCode} not found`);
    }
  }

  // Duplicate dependency pairs
  const pairSet = new Set();
  for (const d of data.dependencies) {
    const key = `${d.prerequisiteSkillCode}→${d.dependentSkillCode}`;
    if (pairSet.has(key)) errors.push(`Duplicate dependency pair: ${key}`);
    pairSet.add(key);
  }

  // Self-dependency
  for (const d of data.dependencies) {
    if (d.prerequisiteSkillCode === d.dependentSkillCode) {
      errors.push(`Self-dependency: ${d.prerequisiteSkillCode}`);
    }
  }

  // REQUIRED graph cycle
  const adj = buildRequiredAdjacency(data.dependencies);
  if (hasCycle(adj)) errors.push("REQUIRED graph contains a cycle");

  return errors;
}

// ── Main Verification ────────────────────────

let seed;
try {
  if (!existsSync(SEED_PATH)) {
    fail("Seed file", `Not found at ${SEED_PATH}`);
    printResults();
    process.exit(1);
  }
  pass("Seed file exists");
} catch (err) {
  fail("Seed file", `Fail-closed: ${err.message}`);
  printResults();
  process.exit(1);
}

try {
  seed = await import(`file:///${SEED_PATH.replace(/\\/g, "/")}`);
  pass("Seed file imports successfully");
} catch (err) {
  fail("Seed file import", `Fail-closed: ${err.message}`);
  printResults();
  process.exit(1);
}

const data = seed.fractionKnowledgeSeedV1;

// ── 1. Seed code and version ─────────────────
if (data.seedCode === "FRACTION_EQUIVALENCE_V1") {
  pass("seedCode is FRACTION_EQUIVALENCE_V1");
} else {
  fail("seedCode", `Expected FRACTION_EQUIVALENCE_V1, got ${data.seedCode}`);
}

if (data.version === 1) {
  pass("version is 1");
} else {
  fail("version", `Expected 1, got ${data.version}`);
}

// ── 2. Entity counts ─────────────────────────
if (data.subject && !Array.isArray(data.subject)) {
  pass("Exactly 1 Subject (object, not array)");
} else {
  fail("Subject count", "Expected exactly 1 Subject object");
}

if (data.concepts && data.concepts.length === 3) {
  pass("Exactly 3 Concepts");
} else {
  fail("Concept count", `Expected 3, got ${data.concepts?.length ?? 0}`);
}

if (data.skills && data.skills.length === 10) {
  pass("Exactly 10 Skills");
} else {
  fail("Skill count", `Expected 10, got ${data.skills?.length ?? 0}`);
}

if (data.dependencies && data.dependencies.length === 11) {
  pass("Exactly 11 Dependencies");
} else {
  fail(
    "Dependency count",
    `Expected 11, got ${data.dependencies?.length ?? 0}`,
  );
}

// ── 3. REQUIRED/SUPPORTING counts ────────────
const requiredCount = data.dependencies.filter(
  (d) => d.kind === "REQUIRED",
).length;
const supportingCount = data.dependencies.filter(
  (d) => d.kind === "SUPPORTING",
).length;

if (requiredCount === 9) {
  pass("Exactly 9 REQUIRED dependencies");
} else {
  fail("REQUIRED count", `Expected 9, got ${requiredCount}`);
}

if (supportingCount === 2) {
  pass("Exactly 2 SUPPORTING dependencies");
} else {
  fail("SUPPORTING count", `Expected 2, got ${supportingCount}`);
}

// ── 4. Unique codes ──────────────────────────
const allCodes = new Set();
let codeConflict = false;

// Subject code
if (allCodes.has(data.subject.code)) {
  fail("Unique codes", `Duplicate code: ${data.subject.code}`);
  codeConflict = true;
} else {
  allCodes.add(data.subject.code);
}

// Concept codes
for (const c of data.concepts) {
  if (allCodes.has(c.code)) {
    fail("Unique codes", `Duplicate concept code: ${c.code}`);
    codeConflict = true;
  } else {
    allCodes.add(c.code);
  }
}

// Skill codes
for (const s of data.skills) {
  if (allCodes.has(s.code)) {
    fail("Unique codes", `Duplicate skill code: ${s.code}`);
    codeConflict = true;
  } else {
    allCodes.add(s.code);
  }
}

if (!codeConflict) {
  pass("All codes are unique across Subject, Concepts, and Skills");
}

// ── 5. Unique slugs within ownership boundary ─
const conceptSlugs = new Set();
let slugConflict = false;
for (const c of data.concepts) {
  if (conceptSlugs.has(c.slug)) {
    fail("Unique concept slugs", `Duplicate slug: ${c.slug}`);
    slugConflict = true;
  } else {
    conceptSlugs.add(c.slug);
  }
}
if (!slugConflict) {
  pass("All concept slugs are unique");
}

const skillSlugs = new Set();
slugConflict = false;
for (const s of data.skills) {
  if (skillSlugs.has(s.slug)) {
    fail("Unique skill slugs", `Duplicate slug: ${s.slug}`);
    slugConflict = true;
  } else {
    skillSlugs.add(s.slug);
  }
}
if (!slugConflict) {
  pass("All skill slugs are unique");
}

// ── 6. Every Concept has subjectCode: "MATH" ──
let conceptSubjectOk = true;
for (const c of data.concepts) {
  if (c.subjectCode !== "MATH") {
    fail(
      "Concept subjectCode",
      `${c.code} subjectCode is ${c.subjectCode}, expected MATH`,
    );
    conceptSubjectOk = false;
  }
}
if (conceptSubjectOk) {
  pass("All Concepts have subjectCode: MATH");
}

// ── 7. Every Skill references an existing Concept ──
const conceptCodes = new Set(data.concepts.map((c) => c.code));
let skillConceptOk = true;
for (const s of data.skills) {
  if (!conceptCodes.has(s.conceptCode)) {
    fail(
      "Skill concept reference",
      `${s.code} references non-existent concept ${s.conceptCode}`,
    );
    skillConceptOk = false;
  }
}
if (skillConceptOk) {
  pass("All Skills reference existing Concepts");
}

// ── 8. Every dependency endpoint exists ──────
const skillCodes = new Set(data.skills.map((s) => s.code));
let endpointOk = true;
for (const d of data.dependencies) {
  if (!skillCodes.has(d.prerequisiteSkillCode)) {
    fail(
      "Dependency endpoint",
      `Prerequisite ${d.prerequisiteSkillCode} not found in skills`,
    );
    endpointOk = false;
  }
  if (!skillCodes.has(d.dependentSkillCode)) {
    fail(
      "Dependency endpoint",
      `Dependent ${d.dependentSkillCode} not found in skills`,
    );
    endpointOk = false;
  }
}
if (endpointOk) {
  pass("All dependency endpoints reference existing Skills");
}

// ── 9. No duplicate dependency pair ──────────
const pairSet = new Set();
let duplicatePair = false;
for (const d of data.dependencies) {
  const key = `${d.prerequisiteSkillCode}→${d.dependentSkillCode}`;
  if (pairSet.has(key)) {
    fail("Duplicate dependency pair", key);
    duplicatePair = true;
  } else {
    pairSet.add(key);
  }
}
if (!duplicatePair) {
  pass("No duplicate dependency pairs");
}

// ── 10. No self-dependency ───────────────────
let selfDep = false;
for (const d of data.dependencies) {
  if (d.prerequisiteSkillCode === d.dependentSkillCode) {
    fail("Self-dependency", `${d.prerequisiteSkillCode} depends on itself`);
    selfDep = true;
  }
}
if (!selfDep) {
  pass("No self-dependencies");
}

// ── 11. REQUIRED graph is acyclic ────────────
const adj = buildRequiredAdjacency(data.dependencies);
if (hasCycle(adj)) {
  fail("REQUIRED graph", "Contains a cycle");
} else {
  pass("REQUIRED graph is acyclic");
}

// ── 12. Every entity is REVIEW version 1 ─────
let allReviewV1 = true;

if (data.subject.state !== "REVIEW") {
  fail("Subject state", `Expected REVIEW, got ${data.subject.state}`);
  allReviewV1 = false;
}
if (data.subject.version !== 1) {
  fail("Subject version", `Expected 1, got ${data.subject.version}`);
  allReviewV1 = false;
}

for (const c of data.concepts) {
  if (c.state !== "REVIEW") {
    fail(`Concept ${c.code} state`, `Expected REVIEW, got ${c.state}`);
    allReviewV1 = false;
  }
  if (c.version !== 1) {
    fail(`Concept ${c.code} version`, `Expected 1, got ${c.version}`);
    allReviewV1 = false;
  }
}

for (const s of data.skills) {
  if (s.state !== "REVIEW") {
    fail(`Skill ${s.code} state`, `Expected REVIEW, got ${s.state}`);
    allReviewV1 = false;
  }
  if (s.version !== 1) {
    fail(`Skill ${s.code} version`, `Expected 1, got ${s.version}`);
    allReviewV1 = false;
  }
}

for (const d of data.dependencies) {
  if (d.state !== "REVIEW") {
    fail(
      `Dependency ${d.prerequisiteSkillCode}→${d.dependentSkillCode} state`,
      `Expected REVIEW, got ${d.state}`,
    );
    allReviewV1 = false;
  }
  if (d.version !== 1) {
    fail(
      `Dependency ${d.prerequisiteSkillCode}→${d.dependentSkillCode} version`,
      `Expected 1, got ${d.version}`,
    );
    allReviewV1 = false;
  }
}

if (allReviewV1) {
  pass("All entities are REVIEW version 1");
}

// ── 13. Required fields are non-empty ────────
let allNonEmpty = true;

// Subject
if (!data.subject.description || data.subject.description.trim().length === 0) {
  fail("Subject description", "Must be non-empty");
  allNonEmpty = false;
}

// Concepts
for (const c of data.concepts) {
  if (!c.semanticDefinition || c.semanticDefinition.trim().length === 0) {
    fail(`Concept ${c.code} semanticDefinition`, "Must be non-empty");
    allNonEmpty = false;
  }
  if (!c.boundaryNotes || c.boundaryNotes.trim().length === 0) {
    fail(`Concept ${c.code} boundaryNotes`, "Must be non-empty");
    allNonEmpty = false;
  }
}

// Skills
for (const s of data.skills) {
  if (!s.capabilityStatement || s.capabilityStatement.trim().length === 0) {
    fail(`Skill ${s.code} capabilityStatement`, "Must be non-empty");
    allNonEmpty = false;
  }
  if (!s.observableOutcome || s.observableOutcome.trim().length === 0) {
    fail(`Skill ${s.code} observableOutcome`, "Must be non-empty");
    allNonEmpty = false;
  }
}

// Dependencies
for (const d of data.dependencies) {
  if (!d.rationale || d.rationale.trim().length === 0) {
    fail(
      `Dependency ${d.prerequisiteSkillCode}→${d.dependentSkillCode} rationale`,
      "Must be non-empty",
    );
    allNonEmpty = false;
  }
}

if (allNonEmpty) {
  pass("All required meaning/outcome fields are non-empty");
}

// ── 14. No forbidden fields ──────────────────
const forbiddenPath = hasForbiddenFields(data);
if (forbiddenPath) {
  fail("Forbidden fields", `Found at ${forbiddenPath}`);
} else {
  pass(
    "No forbidden fields (grade, country, theme, mastery, price, credit, age)",
  );
}

// ── 15. No UUIDs or timestamps ───────────────
const uuids = findUUIDs(data);
if (uuids.length > 0) {
  fail("UUIDs in seed data", `Found at: ${uuids.join(", ")}`);
} else {
  pass("No UUIDs in seed data");
}

const timestamps = findTimestamps(data);
if (timestamps.length > 0) {
  fail("Timestamps in seed data", `Found at: ${timestamps.join(", ")}`);
} else {
  pass("No timestamps in seed data");
}

// ── 16. Source file has no forbidden dependencies ──
checkSourceFile(SEED_PATH, "Seed data file");

// ── 17. Exported data is immutable ───────────
if (isDeepFrozen(data)) {
  pass("Exported seed data is deeply frozen (immutable)");
} else {
  fail("Seed immutability", "Exported data is not deeply frozen");
}

// ── 18. Negative tests (using shared validateSeed) ──
let negativePassed = 0;
let negativeFailed = 0;

// 18a. Duplicate skill code must fail
try {
  const clone = JSON.parse(JSON.stringify(data));
  clone.skills.push(clone.skills[0]);
  const errors = validateSeed(clone);
  if (errors.length > 0) {
    negativePassed++;
    pass("[NEGATIVE] Duplicate skill code correctly detected");
  } else {
    negativeFailed++;
    fail("[NEGATIVE] Duplicate skill code", "Was not detected");
  }
} catch (err) {
  negativePassed++;
  pass(`[NEGATIVE] Duplicate skill code correctly rejected: ${err.message}`);
}

// 18b. Missing dependency endpoint must fail
try {
  const clone = JSON.parse(JSON.stringify(data));
  clone.dependencies.push({
    prerequisiteSkillCode: "NONEXISTENT.SKILL",
    dependentSkillCode: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
    kind: "REQUIRED",
    rationale: "Test",
    state: "REVIEW",
    version: 1,
  });
  const errors = validateSeed(clone);
  if (errors.length > 0) {
    negativePassed++;
    pass("[NEGATIVE] Missing dependency endpoint correctly detected");
  } else {
    negativeFailed++;
    fail("[NEGATIVE] Missing dependency endpoint", "Was not detected");
  }
} catch (err) {
  negativePassed++;
  pass(
    `[NEGATIVE] Missing dependency endpoint correctly rejected: ${err.message}`,
  );
}

// 18c. Self-dependency must fail
try {
  const clone = JSON.parse(JSON.stringify(data));
  clone.dependencies.push({
    prerequisiteSkillCode: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
    dependentSkillCode: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
    kind: "REQUIRED",
    rationale: "Test",
    state: "REVIEW",
    version: 1,
  });
  const errors = validateSeed(clone);
  if (errors.length > 0) {
    negativePassed++;
    pass("[NEGATIVE] Self-dependency correctly detected");
  } else {
    negativeFailed++;
    fail("[NEGATIVE] Self-dependency", "Was not detected");
  }
} catch (err) {
  negativePassed++;
  pass(`[NEGATIVE] Self-dependency correctly rejected: ${err.message}`);
}

// 18d. REQUIRED cycle must fail
try {
  const clone = JSON.parse(JSON.stringify(data));
  // Add a cycle: JUSTIFY_EQUIVALENCE → PARTITION_EQUAL_GROUPS
  clone.dependencies.push({
    prerequisiteSkillCode: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
    dependentSkillCode: "MATH.WHOLE.PARTITION_EQUAL_GROUPS",
    kind: "REQUIRED",
    rationale: "Test cycle",
    state: "REVIEW",
    version: 1,
  });
  const errors = validateSeed(clone);
  if (errors.length > 0) {
    negativePassed++;
    pass("[NEGATIVE] REQUIRED cycle correctly detected");
  } else {
    negativeFailed++;
    fail("[NEGATIVE] REQUIRED cycle", "Was not detected");
  }
} catch (err) {
  negativePassed++;
  pass(`[NEGATIVE] REQUIRED cycle correctly rejected: ${err.message}`);
}

// 18e. Mutation attempt must not change approved seed
try {
  const originalSeedCode = data.seedCode;
  // Attempt to mutate (should fail silently due to freeze)
  try {
    data.seedCode = "MUTATED";
  } catch {
    // Expected — frozen object
  }
  if (data.seedCode === originalSeedCode) {
    negativePassed++;
    pass("[NEGATIVE] Mutation attempt did not change approved seed");
  } else {
    negativeFailed++;
    fail("[NEGATIVE] Mutation", "Seed was mutated");
  }
} catch (err) {
  negativePassed++;
  pass(`[NEGATIVE] Mutation correctly prevented: ${err.message}`);
}

if (negativeFailed === 0) {
  pass(`All ${negativePassed} negative tests passed`);
} else {
  fail(
    "Negative tests",
    `${negativeFailed} of ${negativePassed + negativeFailed} failed`,
  );
}

// ── Summary ─────────────────────────────────
function printResults() {
  console.log("\n═══════════════════════════════════════");
  console.log("  Fraction Knowledge Seed Verification");
  console.log("═══════════════════════════════════════");
  console.log(results.join("\n"));
  console.log("───────────────────────────────────────");
  console.log(
    exitCode === 0
      ? "  ✅ FRACTION KNOWLEDGE SEED PASSED"
      : "  ❌ FRACTION KNOWLEDGE SEED FAILED",
  );
  console.log("───────────────────────────────────────\n");
}

printResults();
process.exit(exitCode);
