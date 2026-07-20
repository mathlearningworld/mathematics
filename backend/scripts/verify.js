/**
 * ──────────────────────────────────────────────
 * Mathematics Backend — Verification Script
 * ──────────────────────────────────────────────
 * Runs a safe local verification sequence without
 * starting Docker or changing a database.
 *
 * Checks performed:
 *   1. Node.js version
 *   2. Required files exist
 *   3. Prisma schema validation (via npm script)
 *   4. Knowledge Core schema contract (via npm script)
 *   5. Knowledge Persistence contract (via npm script)
 *   6. Fraction Knowledge Seed contract (via npm script)
 *   7. ESLint (via npm script)
 *   8. Prettier check (via npm script)
 *   9. Vitest (via npm script)
 *
 * Cross-platform: uses execSync with shell for npm scripts.
 * ──────────────────────────────────────────────
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = resolve(__dirname, "..");

let exitCode = 0;
const results = [];

function pass(label) {
  results.push(`  ✅ ${label}`);
}

function fail(label, detail) {
  results.push(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  exitCode = 1;
}

function runNpmScript(scriptName, label, extraEnv) {
  try {
    execSync(`npm run ${scriptName}`, {
      cwd: BACKEND_ROOT,
      stdio: "pipe",
      encoding: "utf-8",
      timeout: 60_000,
      shell: true,
      env: { ...process.env, ...extraEnv },
    });
    pass(label);
  } catch (err) {
    const stderr = (err.stderr || "").trim();
    const stdout = (err.stdout || "").trim();
    // Use the last meaningful line from stderr, or stdout, or the error message
    const msg = stderr || stdout || err.message;
    const lines = msg.split("\n").filter((l) => l.trim());
    fail(label, lines[lines.length - 1] || msg);
  }
}

// ── 1. Node.js version ──────────────────────
try {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split(".")[0], 10);
  if (major >= 20) {
    pass(`Node.js version ${nodeVersion}`);
  } else {
    fail(`Node.js version ${nodeVersion} (need >=20)`);
  }
} catch (err) {
  fail("Node.js version check", err.message);
}

// ── 2. Required files exist ─────────────────
const requiredFiles = [
  "package.json",
  "src/app.js",
  "src/server.js",
  "src/config/env.js",
  "src/lib/logger.js",
  "src/lib/prisma.js",
  "src/middlewares/errorHandler.js",
  "src/middlewares/notFoundHandler.js",
  "src/middlewares/notFound.integration.test.js",
  "src/routes/index.js",
  "src/modules/health/health.controller.js",
  "src/modules/health/health.service.js",
  "src/modules/health/health.routes.js",
  "src/modules/health/health.test.js",
  "src/modules/health/health.integration.test.js",
  "src/modules/health/index.js",
  "prisma/schema.prisma",
  "vitest.config.js",
  "vitest.setup.js",
  "eslint.config.js",
  "docs/knowledge-core-v1.md",
  "docs/knowledge-graph-integrity-v1.md",
  "docs/knowledge-persistence-v1.md",
  "scripts/verify-knowledge-core-schema.js",
  "scripts/verify-knowledge-persistence.js",
  "src/modules/knowledge-graph/index.js",
  "src/modules/knowledge-graph/knowledgeGraph.errors.js",
  "src/modules/knowledge-graph/knowledgeGraph.business.js",
  "src/modules/knowledge-graph/knowledgeGraph.policy.js",
  "src/modules/knowledge-graph/knowledgeGraph.test.js",
  "src/modules/knowledge-graph/knowledgeGraph.contract.test.js",
  "prisma/seeds/knowledge/fraction-equivalence-v1.data.js",
  "scripts/verify-fraction-knowledge-seed.js",
  "docs/fraction-knowledge-seed-v1.md",
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const fullPath = resolve(BACKEND_ROOT, file);
  if (!existsSync(fullPath)) {
    fail("Required file exists", `Missing: ${file}`);
    allFilesExist = false;
  }
}
if (allFilesExist) {
  pass("All required files exist");
}

// ── 3. Prisma schema validation ─────────────
// Provide a placeholder DATABASE_URL so Prisma can validate the schema
// without needing a real database or .env file.
runNpmScript("prisma:validate", "Prisma schema validation", {
  DATABASE_URL:
    "postgresql://placeholder:placeholder@127.0.0.1:5433/placeholder",
});

// ── 4. Knowledge Core schema contract ───────
runNpmScript("verify:knowledge-core", "Knowledge Core schema contract");

// ── 5. Knowledge Persistence contract ───────
runNpmScript("verify:knowledge-persistence", "Knowledge Persistence contract");

// ── 6. Fraction Knowledge Seed contract ─────
runNpmScript("verify:fraction-seed", "Fraction Knowledge Seed contract");

// ── 7. ESLint ───────────────────────────────
runNpmScript("lint", "ESLint");

// ── 8. Prettier check ───────────────────────
runNpmScript("format:check", "Prettier check");

// ── 9. Vitest ───────────────────────────────
runNpmScript("test", "Vitest");

// ── Summary ─────────────────────────────────
console.log("\n═══════════════════════════════════════");
console.log("  Verification Results");
console.log("═══════════════════════════════════════");
console.log(results.join("\n"));
console.log("───────────────────────────────────────");
console.log(
  exitCode === 0 ? "  ✅ ALL CHECKS PASSED" : "  ❌ SOME CHECKS FAILED",
);
console.log("───────────────────────────────────────\n");

process.exit(exitCode);
