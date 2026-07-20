/**
 * ──────────────────────────────────────────────
 * Mathematics Backend — Knowledge Persistence Verifier
 * ──────────────────────────────────────────────
 * Statically verifies the migration SQL without connecting to a database.
 * Reads prisma/migrations/ to validate the create-only migration contract.
 * ──────────────────────────────────────────────
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BACKEND_ROOT = resolve(__dirname, "..");
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

// Escape special regex characters in a string
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ── 1. Migrations directory exists and is readable ──
let migrationDirEntries;
try {
  if (!existsSync(MIGRATIONS_DIR)) {
    fail("Migrations directory", "prisma/migrations does not exist");
    printResults();
    process.exit(1);
  }
  migrationDirEntries = readdirSync(MIGRATIONS_DIR, { withFileTypes: true });
  pass("Migrations directory exists and is readable");
} catch (err) {
  fail("Migrations directory", `Fail-closed: ${err.message}`);
  printResults();
  process.exit(1);
}

// ── 2. migration_lock.toml exists ──
let lockContent;
try {
  const lockPath = join(MIGRATIONS_DIR, "migration_lock.toml");
  if (!existsSync(lockPath)) {
    fail("migration_lock.toml", "File not found");
    printResults();
    process.exit(1);
  }
  lockContent = readFileSync(lockPath, "utf-8");
  pass("migration_lock.toml exists");
} catch (err) {
  fail("migration_lock.toml", `Fail-closed: ${err.message}`);
  printResults();
  process.exit(1);
}

// ── 3. Provider is postgresql ──
if (/provider\s*=\s*"postgresql"/.test(lockContent)) {
  pass("migration_lock.toml provider is postgresql");
} else {
  fail("migration_lock.toml provider", 'Must be "postgresql"');
}

// ── 4. Exactly one timestamped migration directory ──
const migrationDirs = migrationDirEntries.filter(
  (e) => e.isDirectory() && /^\d{14}_/.test(e.name),
);
if (migrationDirs.length === 1) {
  pass(`Exactly one migration directory: ${migrationDirs[0].name}`);
} else {
  fail(
    "Migration directories",
    `Expected exactly 1 timestamped directory, found ${migrationDirs.length}`,
  );
  printResults();
  process.exit(1);
}

const migrationDirName = migrationDirs[0].name;
const migrationDirPath = join(MIGRATIONS_DIR, migrationDirName);

// ── 5. Directory name ends with _init_knowledge_core_v1 ──
if (migrationDirName.endsWith("_init_knowledge_core_v1")) {
  pass("Migration directory name ends with _init_knowledge_core_v1");
} else {
  fail(
    "Migration directory name",
    `Expected suffix _init_knowledge_core_v1, got: ${migrationDirName}`,
  );
}

// ── 6. migration.sql exists and is readable ──
let migrationSql;
const sqlPath = join(migrationDirPath, "migration.sql");
try {
  if (!existsSync(sqlPath)) {
    fail("migration.sql", "File not found in migration directory");
    printResults();
    process.exit(1);
  }
  migrationSql = readFileSync(sqlPath, "utf-8");
  pass("migration.sql exists and is readable");
} catch (err) {
  fail("migration.sql", `Fail-closed: ${err.message}`);
  printResults();
  process.exit(1);
}

// ── 7. Exactly these enums are created: knowledge_state, skill_dependency_kind ──
const enumMatches = migrationSql.match(
  /CREATE\s+TYPE\s+"([^"]+)"\s+AS\s+ENUM/g,
);
const enumNames = [];
if (enumMatches) {
  for (const m of enumMatches) {
    const nameMatch = m.match(/CREATE\s+TYPE\s+"([^"]+)"/);
    if (nameMatch) enumNames.push(nameMatch[1]);
  }
}
const expectedEnums = ["knowledge_state", "skill_dependency_kind"];
const missingEnums = expectedEnums.filter((e) => !enumNames.includes(e));
const extraEnums = enumNames.filter((e) => !expectedEnums.includes(e));
if (missingEnums.length === 0 && extraEnums.length === 0) {
  pass(
    "Exactly expected enums created: knowledge_state, skill_dependency_kind",
  );
} else {
  if (missingEnums.length)
    fail("Enum creation", `Missing enums: ${missingEnums.join(", ")}`);
  if (extraEnums.length)
    fail("Enum creation", `Unexpected enums: ${extraEnums.join(", ")}`);
}

// ── 8. Exactly these product tables are created: subjects, concepts, skills, skill_dependencies ──
const tableMatches = migrationSql.match(/CREATE\s+TABLE\s+"([^"]+)"/g);
const tableNames = [];
if (tableMatches) {
  for (const m of tableMatches) {
    const nameMatch = m.match(/CREATE\s+TABLE\s+"([^"]+)"/);
    if (nameMatch) tableNames.push(nameMatch[1]);
  }
}
const expectedTables = ["subjects", "concepts", "skills", "skill_dependencies"];
const missingTables = expectedTables.filter((t) => !tableNames.includes(t));
const extraTables = tableNames.filter((t) => !expectedTables.includes(t));
if (missingTables.length === 0 && extraTables.length === 0) {
  pass(
    "Exactly expected tables created: subjects, concepts, skills, skill_dependencies",
  );
} else {
  if (missingTables.length)
    fail("Table creation", `Missing tables: ${missingTables.join(", ")}`);
  if (extraTables.length)
    fail("Table creation", `Unexpected tables: ${extraTables.join(", ")}`);
}

// Helper: extract a CREATE TABLE block
function getCreateTableBlock(tableName) {
  const re = new RegExp(
    `CREATE\\s+TABLE\\s+"${tableName}"\\s*\\(([\\s\\S]*?)\\n\\)`,
    "i",
  );
  const match = migrationSql.match(re);
  return match ? match[1] : null;
}

// ── 9. All four primary keys use UUID ──
const pkTables = ["subjects", "concepts", "skills", "skill_dependencies"];
for (const table of pkTables) {
  const block = getCreateTableBlock(table);
  if (block) {
    if (/^\s*"id"\s+UUID\s+NOT\s+NULL/im.test(block)) {
      pass(`${table} primary key uses UUID`);
    } else {
      fail(`${table} primary key`, "id column must be UUID NOT NULL");
    }
  } else {
    fail(`${table} primary key`, "Could not extract table block");
  }
}

// ── 10. state/version/created_at/updated_at contracts present ──
const contractTables = ["subjects", "concepts", "skills", "skill_dependencies"];
for (const table of contractTables) {
  const block = getCreateTableBlock(table);
  if (!block) {
    fail(`${table} contract fields`, "Could not extract table block");
    continue;
  }
  const checks = [
    {
      name: "state",
      pattern: new RegExp(
        `"state"\\s+"knowledge_state"\\s+NOT\\s+NULL\\s+DEFAULT\\s+'DRAFT'`,
        "i",
      ),
    },
    {
      name: "version",
      pattern: /"version"\s+INTEGER\s+NOT\s+NULL\s+DEFAULT\s+1/i,
    },
    {
      name: "created_at",
      pattern:
        /"created_at"\s+TIMESTAMPTZ\(3\)\s+NOT\s+NULL\s+DEFAULT\s+CURRENT_TIMESTAMP/i,
    },
    {
      name: "updated_at",
      pattern: /"updated_at"\s+TIMESTAMPTZ\(3\)\s+NOT\s+NULL/i,
    },
  ];
  for (const { name, pattern } of checks) {
    if (pattern.test(block)) {
      pass(`${table} has ${name}`);
    } else {
      fail(`${table} ${name}`, "Missing or incorrect definition");
    }
  }
}

// ── 11. created_at and updated_at use TIMESTAMPTZ(3) ──
for (const table of contractTables) {
  const block = getCreateTableBlock(table);
  if (block) {
    const timestamptzMatches = block.match(/TIMESTAMPTZ\(3\)/g);
    if (timestamptzMatches && timestamptzMatches.length >= 2) {
      pass(`${table} uses TIMESTAMPTZ(3) for timestamps`);
    } else {
      fail(
        `${table} TIMESTAMPTZ(3)`,
        "Expected at least 2 TIMESTAMPTZ(3) fields",
      );
    }
  }
}

// ── 12. Expected unique indexes exist ──
const expectedUniqueIndexes = [
  { table: "subjects", columns: '"code"' },
  { table: "subjects", columns: '"slug"' },
  { table: "concepts", columns: '"code"' },
  { table: "concepts", columns: '"subject_id", "slug"' },
  { table: "skills", columns: '"code"' },
  { table: "skills", columns: '"concept_id", "slug"' },
  {
    table: "skill_dependencies",
    columns: '"prerequisite_skill_id", "dependent_skill_id"',
  },
];
for (const { table, columns } of expectedUniqueIndexes) {
  // Build the index name: Prisma uses table_col1_col2_key
  const colParts = columns
    .replace(/"/g, "")
    .split(",")
    .map((s) => s.trim());
  const indexName = `${table}_${colParts.join("_")}_key`;
  const pattern = new RegExp(
    `CREATE\\s+UNIQUE\\s+INDEX\\s+"${indexName}"\\s+ON\\s+"${table}"\\s*\\(\\s*${columns}\\s*\\)`,
    "i",
  );
  if (pattern.test(migrationSql)) {
    pass(`Unique index on ${table}(${columns.replace(/"/g, "")})`);
  } else {
    fail(
      "Unique index",
      `Missing unique index on ${table}(${columns.replace(/"/g, "")})`,
    );
  }
}

// ── 13. Expected traversal indexes exist ──
const expectedTraversalIndexes = [
  { table: "subjects", columns: '"state"', nameSuffix: "state_idx" },
  {
    table: "concepts",
    columns: '"subject_id", "state"',
    nameSuffix: "subject_id_state_idx",
  },
  {
    table: "skills",
    columns: '"concept_id", "state"',
    nameSuffix: "concept_id_state_idx",
  },
  {
    table: "skill_dependencies",
    columns: '"dependent_skill_id", "kind", "state"',
    nameSuffix: "dependent_skill_id_kind_state_idx",
  },
  {
    table: "skill_dependencies",
    columns: '"prerequisite_skill_id", "kind", "state"',
    nameSuffix: "prerequisite_skill_id_kind_state_idx",
  },
];
for (const { table, columns, nameSuffix } of expectedTraversalIndexes) {
  const indexName = `${table}_${nameSuffix}`;
  const pattern = new RegExp(
    `CREATE\\s+INDEX\\s+"${indexName}"\\s+ON\\s+"${table}"\\s*\\(\\s*${columns}\\s*\\)`,
    "i",
  );
  if (pattern.test(migrationSql)) {
    pass(`Traversal index on ${table}(${columns.replace(/"/g, "")})`);
  } else {
    fail(
      "Traversal index",
      `Missing index on ${table}(${columns.replace(/"/g, "")})`,
    );
  }
}

// ── 14. Exactly four expected foreign keys exist ──
const expectedForeignKeys = [
  {
    constraint: "concepts_subject_id_fkey",
    from: "concepts",
    column: "subject_id",
    references: '"subjects"("id")',
  },
  {
    constraint: "skills_concept_id_fkey",
    from: "skills",
    column: "concept_id",
    references: '"concepts"("id")',
  },
  {
    constraint: "skill_dependencies_prerequisite_skill_id_fkey",
    from: "skill_dependencies",
    column: "prerequisite_skill_id",
    references: '"skills"("id")',
  },
  {
    constraint: "skill_dependencies_dependent_skill_id_fkey",
    from: "skill_dependencies",
    column: "dependent_skill_id",
    references: '"skills"("id")',
  },
];
const fkMatches = migrationSql.match(
  /ALTER\s+TABLE\s+"[^"]+"\s+ADD\s+CONSTRAINT\s+"[^"]+"\s+FOREIGN\s+KEY/g,
);
const fkCount = fkMatches ? fkMatches.length : 0;
if (fkCount === 4) {
  pass("Exactly 4 foreign keys exist");
} else {
  fail("Foreign key count", `Expected 4, found ${fkCount}`);
}

// ── 15. All foreign keys use ON DELETE RESTRICT ON UPDATE CASCADE ──
for (const fk of expectedForeignKeys) {
  // Build the expected SQL string literally, then escape it for regex
  const expectedSql = `ALTER TABLE "${fk.from}" ADD CONSTRAINT "${fk.constraint}" FOREIGN KEY ("${fk.column}") REFERENCES ${fk.references} ON DELETE RESTRICT ON UPDATE CASCADE`;
  const escapedSql = escapeRegex(expectedSql);
  const pattern = new RegExp(escapedSql, "i");
  if (pattern.test(migrationSql)) {
    pass(`FK ${fk.constraint}: ON DELETE RESTRICT ON UPDATE CASCADE`);
  } else {
    fail(
      "Foreign key constraint",
      `${fk.constraint} must use ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }
}

// ── 16. Migration contains no INSERT, UPDATE, DELETE, DROP, or TRUNCATE ──
const forbiddenStatements = [
  { pattern: /\bINSERT\s+INTO\b/i, label: "INSERT" },
  { pattern: /\bUPDATE\s+"[^"]+"\s+SET\b/i, label: "UPDATE" },
  { pattern: /\bDELETE\s+FROM\b/i, label: "DELETE" },
  {
    pattern: /\bDROP\s+(TABLE|INDEX|VIEW|SCHEMA|TYPE|COLUMN|CONSTRAINT)\b/i,
    label: "DROP",
  },
  { pattern: /\bTRUNCATE\b/i, label: "TRUNCATE" },
];
let hasForbiddenStatement = false;
for (const { pattern, label } of forbiddenStatements) {
  if (pattern.test(migrationSql)) {
    fail("Forbidden SQL statement", `Migration contains ${label}`);
    hasForbiddenStatement = true;
  }
}
if (!hasForbiddenStatement) {
  pass("Migration contains no INSERT, UPDATE, DELETE, DROP, or TRUNCATE");
}

// ── 17. Migration contains no unrelated product tables ──
// Already checked in step 8 — extraTables check ensures no unexpected tables

// ── 18. File size and hash ──
try {
  const sqlStat = statSync(sqlPath);
  const fileSize = sqlStat.size;
  const hash = createHash("sha256").update(migrationSql).digest("hex");
  pass(`migration.sql size: ${fileSize} bytes, SHA-256: ${hash}`);
} catch (err) {
  fail("migration.sql stats", `Fail-closed: ${err.message}`);
}

// ── Summary ─────────────────────────────────
function printResults() {
  console.log("\n═══════════════════════════════════════");
  console.log("  Knowledge Persistence Verification");
  console.log("═══════════════════════════════════════");
  console.log(results.join("\n"));
  console.log("───────────────────────────────────────");
  console.log(
    exitCode === 0
      ? "  ✅ KNOWLEDGE PERSISTENCE PASSED"
      : "  ❌ KNOWLEDGE PERSISTENCE FAILED",
  );
  console.log("───────────────────────────────────────\n");
}

printResults();
process.exit(exitCode);
