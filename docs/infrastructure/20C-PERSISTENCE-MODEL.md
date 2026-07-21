# 20C — Persistence Model

## 1. Purpose

This document defines the persistence model for Math Learning World.

It establishes how authoritative product state is represented in PostgreSQL through Prisma while remaining separate from Domain and Application models.

It is the Source of Truth for:

- PostgreSQL ownership;
- Prisma schema boundaries;
- table and relation design;
- aggregate persistence;
- identifiers and versions;
- constraints and indexes;
- temporal data;
- deletion and retention;
- migrations;
- seed data;
- data integrity;
- persistence verification.

---

## 2. Core Principle

> The database protects durable integrity; the Domain protects business meaning; neither replaces the other.

Application and Domain rules remain authoritative for behavior.

PostgreSQL constraints provide durable defense against impossible or conflicting stored state.

The Prisma schema expresses the persistence model, not the complete product model.

---

## 3. Technology Baseline

The initial persistence stack is:

```text
Database: PostgreSQL 18.x
ORM and migration tool: Prisma 6.x
Database access: @prisma/client
Local database port: 5433 for the clean Mathematics environment
Schema: public unless an approved change introduces explicit schemas
```

Technology versions may evolve through controlled upgrades.

---

## 4. Source of Truth

PostgreSQL is the durable Source of Truth for authoritative server-side state, including:

- accounts and identities managed by this system;
- learner profiles;
- curriculum catalogs imported into the platform;
- skills and dependencies;
- learner skill progress;
- mastery pathways;
- learning history;
- mentorship and credit records;
- operational outbox state;
- durable idempotency records where required.

Caches, search indexes, analytics stores, and client state are projections unless explicitly elevated by a future architecture decision.

---

## 5. Persistence Model vs Domain Model

The models serve different purposes.

### Domain model

Optimizes:

- business language;
- invariant protection;
- state transitions;
- behavior;
- aggregate boundaries.

### Persistence model

Optimizes:

- durable representation;
- relational constraints;
- query plans;
- indexes;
- migration safety;
- operational visibility.

Mapping between the models is explicit.

A Domain value object may map to:

- one scalar column;
- multiple columns;
- a child table;
- a JSON value only when relational modeling is not more appropriate.

---

## 6. Schema Ownership

The Prisma schema and migrations are owned by the backend repository.

Authoritative paths are expected to include:

```text
backend/prisma/schema.prisma
backend/prisma/migrations/
```

If the repository structure later relocates these paths, there must remain one clearly documented migration authority.

Production schema changes must originate from committed migrations, not manual database edits.

---

## 7. Naming Conventions

Persistence naming must be deterministic and consistent.

Recommended conventions:

- Prisma models: singular PascalCase.
- Prisma fields: camelCase.
- Database tables: snake_case through `@@map` where used.
- Database columns: snake_case through `@map` where used.
- Primary key: `id`.
- Foreign keys: `<entity>_id` at database level.
- Timestamps: `created_at`, `updated_at`, and domain-specific names.
- Optimistic version: `version`.

Names should express product meaning rather than implementation history.

---

## 8. Identifier Strategy

Identifiers are stable, opaque, and never reused.

Default rules:

1. New authoritative entities use UUID-compatible identifiers unless a specific reason requires another strategy.
2. IDs are generated before persistence when use cases or events require immediate identity.
3. Sequential database IDs are not exposed as public identity by default.
4. External provider IDs are stored separately and constrained in their provider scope.
5. Natural keys may receive unique constraints but do not automatically become primary keys.
6. Composite uniqueness is used where identity is contextual.

Example:

```text
unique(learner_id, skill_id)
unique(curriculum_id, external_code)
unique(account_id, idempotency_key)
```

---

## 9. Aggregate Representation

Each aggregate root has one authoritative root record.

Owned entities and collections may be represented by child tables.

Rules:

- child rows reference the aggregate root;
- child lifecycle follows aggregate ownership unless explicitly shared;
- aggregate writes are atomic;
- aggregate version is stored on the root;
- cross-aggregate references use identities, not embedded mutable objects;
- many-to-many relations are modeled with explicit join entities when the relation has meaning or attributes.

Database relations must not create hidden cross-aggregate write cascades that violate ownership.

---

## 10. Relational Modeling

Prefer normalized relational structures for authoritative state.

Use tables and columns when data requires:

- constraints;
- joins;
- indexing;
- independent lifecycle;
- reporting;
- stable query semantics.

JSON columns are acceptable for:

- immutable provider payload snapshots;
- flexible non-authoritative metadata;
- versioned configuration fragments;
- event payloads;
- data whose internal fields are not used for core relational integrity.

JSON must not become a shortcut around schema design for core learning state.

---

## 11. Required Constraints

PostgreSQL constraints reinforce durable integrity.

Applicable constraints include:

- primary keys;
- foreign keys;
- unique constraints;
- non-null constraints;
- check constraints;
- constrained enums or reference tables;
- version non-negativity;
- quantity and score ranges;
- valid temporal ordering.

Examples of durable conditions:

```text
mastery score is within the accepted numeric range
progress attempt count is non-negative
completed_at cannot precede started_at
credit balance mutations reference a durable transaction record
one authoritative progress row exists per learner and skill
```

A database constraint must have a corresponding stable failure translation where callers can encounter it.

---

## 12. Foreign Keys

Foreign keys are required for authoritative relational references unless an explicit distributed-system boundary prevents them.

Delete behavior must be intentional:

- `RESTRICT` for referenced authoritative records that must not disappear;
- `CASCADE` only for strictly owned child records;
- `SET NULL` only where absence is a valid modeled state;
- no implicit cascade across aggregate boundaries.

Every cascade must be reviewed as a lifecycle decision.

---

## 13. Index Strategy

Indexes are driven by verified access paths.

Every frequently executed query should be reviewed for:

- filtering columns;
- scope columns;
- sort columns;
- join columns;
- uniqueness;
- cursor pagination.

Common index pattern:

```text
(workspace_id, entity_id)
(learner_id, skill_id)
(learner_id, updated_at, id)
(status, available_at)
(correlation_id)
```

Rules:

1. Foreign-key columns used in joins should generally be indexed.
2. Scope columns should lead indexes for scoped queries when appropriate.
3. Cursor indexes include deterministic tie-breakers.
4. Redundant indexes are avoided.
5. Index changes are migration-controlled.
6. Performance claims require query-plan evidence for critical paths.

---

## 14. Optimistic Versioning

Mutable authoritative aggregate roots include an integer `version` when concurrency conflicts are possible.

Rules:

- initial persisted version is deterministic;
- each successful authoritative update increments the version once;
- updates compare the expected version;
- bulk updates do not bypass version checks for aggregate state;
- version is returned to Application where required for subsequent commands;
- version mismatch is reported as a concurrency conflict.

Version is persistence metadata with application-visible concurrency meaning, not a user-editable field.

---

## 15. Temporal Data

All authoritative timestamps are stored in UTC-capable database types.

Rules:

- use timezone-aware timestamps for instants;
- convert to local display time only at presentation boundaries;
- distinguish instants from local calendar dates;
- do not encode an instant as an unzoned string;
- database-generated timestamps and application clock timestamps have explicit ownership;
- test clocks are used for deterministic business timing.

Typical timestamps include:

```text
createdAt
updatedAt
startedAt
completedAt
masteredAt
occurredAt
publishedAt
archivedAt
```

Timestamp precision must be consistent where ordering or idempotency depends on it.

---

## 16. Decimal and Numeric Data

Learning scores, percentages, money, and credits require explicit numeric semantics.

Rules:

- money uses fixed precision, never binary floating point;
- credit quantities use integer minor units or explicit fixed precision;
- percentages define scale and rounding;
- mastery scores define accepted range and precision;
- JavaScript number conversion is performed only when safe;
- Prisma `Decimal` does not leak into Domain or Application contracts.

Rounding policy belongs to Product/Domain rules and is applied before persistence where required.

---

## 17. Enum Strategy

Enums are used only for stable closed sets.

Before using a database enum, evaluate:

- expected frequency of change;
- migration cost;
- compatibility requirements;
- whether the concept is product-configurable;
- whether a reference table is more appropriate.

Persistence enum values map explicitly to Domain values.

Renaming an enum value requires a migration plan and compatibility review.

---

## 18. Soft Delete, Archive, and Retention

Deletion policy is explicit per model.

Possible strategies:

- hard delete for disposable technical records;
- archive timestamp for business records removed from active use;
- immutable retention for audit and financial records;
- scheduled purge after approved retention periods.

Soft-deleted records require:

- consistent query filtering;
- uniqueness strategy that accounts for archived rows;
- index support;
- restoration rules if restoration is supported.

Sensitive learner data retention must follow applicable policy and law before production deployment.

---

## 19. Audit and History

Current aggregate state and historical evidence are separate concerns.

Historical evidence may use:

- append-only learning history;
- event records;
- credit transaction ledgers;
- audit records for privileged administrative changes;
- versioned snapshots where justified.

Audit data must identify, where applicable:

```text
actor
subject
operation
occurredAt
correlationId
source
before/after reference or approved change details
```

Secrets and unnecessary sensitive data must not be copied into audit payloads.

---

## 20. Idempotency Persistence

Durable idempotency records are used for commands where retries can cross process or deployment boundaries.

A record may contain:

```text
scope identity
idempotency key
command type
request fingerprint
status
result reference or serialized stable result
createdAt
completedAt
expiresAt
```

Constraints prevent two authoritative operations from claiming the same key in the same scope.

Request fingerprints prevent accidental key reuse for different commands.

Retention duration is command-specific.

---

## 21. Outbox Persistence

Integration events requiring reliable publication are written to an outbox table in the same transaction as aggregate changes.

Minimum outbox fields:

```text
id
eventType
eventVersion
aggregateType
aggregateId
payload
occurredAt
availableAt
publishedAt
attemptCount
lastFailure
correlationId
```

The outbox requires indexes supporting unpublished-message polling and retry scheduling.

Published records are retained or archived according to operational policy.

---

## 22. Migration Policy

Every production schema change is represented by an immutable committed migration.

Rules:

1. Never edit a migration already applied to a shared environment.
2. Create a new corrective migration instead.
3. Review generated SQL before application.
4. Separate destructive changes from application rollout when compatibility requires it.
5. Prefer expand-and-contract migrations for zero/low-downtime changes.
6. Backfills are explicit, bounded, observable, and restartable.
7. Migration names describe intent.
8. Migration application is an operational gate, not inferred from repository review.

---

## 23. Expand-and-Contract Changes

Breaking schema evolution should use stages.

Example:

```text
1. Add new nullable column or new table.
2. Deploy code capable of reading old and new forms.
3. Backfill existing data.
4. Switch writes to the new form.
5. Verify completeness.
6. Enforce non-null or new constraints.
7. Remove obsolete fields in a later deployment.
```

Application compatibility must be maintained throughout the planned deployment window.

---

## 24. Destructive Changes

Dropping tables, columns, constraints, or data requires explicit evidence that:

- no deployed code depends on them;
- required data has been migrated or intentionally discarded;
- rollback implications are understood;
- backups or recovery strategy are available;
- the change is authorized.

Prisma-generated warnings are treated as blockers until reviewed, not dismissed automatically.

---

## 25. Seed Data

Seed data is divided into categories.

### Reference seed

Stable product reference data required by the system, such as initial curriculum catalogs or skill definitions.

### Development seed

Local sample users, progress, and scenarios used only for development.

### Test fixtures

Deterministic data created and removed by tests.

Rules:

- reference seed is idempotent and version-aware;
- development seed never runs automatically in production;
- test fixtures are isolated;
- seed scripts do not silently overwrite user-owned data;
- curriculum imports preserve source and version metadata.

---

## 26. Curriculum Data

Curriculum and skill catalogs require provenance.

Applicable records should preserve:

```text
country or authority
curriculum name
version or effective period
grade/stage mapping
source reference
importedAt
status
```

Skills require stable internal identity independent of display language.

Localization is stored separately from structural skill identity where possible.

Curriculum updates must not silently rewrite historical learner evidence.

---

## 27. Backup and Recovery Expectations

Before production use, persistence operations require documented:

- backup schedule;
- retention period;
- restore procedure;
- recovery point objective;
- recovery time objective;
- restore verification cadence;
- ownership of recovery decisions.

A backup is not considered reliable until restoration has been tested.

These are operational requirements even when hosting providers supply managed backup features.

---

## 28. Environment Isolation

Development, test, staging, and production databases are isolated.

Rules:

- tests do not target development or production databases;
- credentials are environment-specific;
- migration status is independently observable per environment;
- production data is not copied into lower environments without approved sanitization;
- local Docker volumes are not treated as backups;
- destructive test cleanup is guarded by environment checks.

---

## 29. Prisma Client Lifecycle

The Prisma client is initialized and owned by Infrastructure composition.

Rules:

- one controlled client lifecycle per process unless architecture requires otherwise;
- connection on demand or startup follows verified runtime behavior;
- graceful shutdown disconnects the client;
- transaction-scoped clients remain inside repository/Unit of Work adapters;
- route handlers do not create new Prisma clients;
- tests cleanly release clients.

---

## 30. Raw SQL

Raw SQL is allowed when Prisma cannot express a required safe or performant operation.

Requirements:

- parameterized inputs;
- scope predicates;
- explicit result mapping;
- migration compatibility;
- integration tests;
- documented reason;
- query-plan review for critical operations.

Unsafe string-concatenated SQL is prohibited.

---

## 31. Persistence Failure Translation

Infrastructure translates persistence failures into stable categories.

Examples:

```text
unique violation → Conflict
authoritative record absent → NotFound
foreign-key violation → IntegrityConflict
check violation → PersistenceIntegrityFailure
version mismatch → ConcurrencyConflict
lock timeout/deadlock → TransientPersistenceFailure
connection failure → DependencyUnavailable
query timeout → DependencyTimeout
```

Raw SQL, PostgreSQL, or Prisma errors remain internal diagnostic evidence.

---

## 32. Verification Gates

Persistence completion requires separate evidence.

### Repository Gate

May verify:

- Prisma schema changes;
- migration files;
- adapter design;
- constraints and index definitions;
- tests and verifier wiring;
- architectural conformity.

### Runtime Gate

Requires actual execution of:

- Prisma validation;
- Prisma client generation;
- migration application to an isolated database;
- integration tests;
- rollback behavior;
- query execution.

### Operational Gate

Requires a running flow through:

```text
request → application → repository → Prisma → PostgreSQL → query/projection → response
```

Repository review alone must not be reported as database execution success.

---

## 33. Minimum Persistence Tests

The persistence model requires evidence for:

1. Clean database migration from zero.
2. Upgrade from the previous supported schema.
3. Prisma validation and generation.
4. Referential-integrity enforcement.
5. Unique-constraint enforcement.
6. Check-constraint enforcement where used.
7. Aggregate insert/update/reload.
8. Optimistic-concurrency conflict.
9. Transaction rollback.
10. Scope isolation.
11. Outbox atomicity.
12. Idempotency uniqueness.
13. Seed idempotency.
14. Timestamp and decimal mapping.
15. Graceful client shutdown.

---

## 34. Prohibited Patterns

The following are prohibited:

- manual production schema changes without migrations;
- editing applied migrations;
- ORM records used directly as Domain entities;
- storing authoritative relational state as arbitrary JSON for convenience;
- public sequential IDs without an explicit decision;
- floating-point storage for money;
- timestamps without defined timezone semantics;
- cross-aggregate cascade deletion;
- unindexed unbounded production queries;
- seed scripts that overwrite user data;
- tests pointed at shared or production databases;
- reporting migration success without execution evidence.

---

## 35. Review Checklist

A persistence change is acceptable when reviewers can answer yes to all applicable questions:

- Is the durable ownership clear?
- Does the schema reflect aggregate boundaries?
- Are identifiers and uniqueness explicit?
- Are foreign-key delete actions intentional?
- Are scope and query indexes present?
- Is optimistic versioning preserved?
- Are temporal and numeric semantics safe?
- Is the migration forward-compatible with rollout?
- Are destructive effects identified?
- Is seed behavior idempotent and environment-safe?
- Are Prisma types contained in Infrastructure?
- Is runtime verification still clearly distinguished from repository review?

---

## 36. Completion Criteria

The persistence model is considered defined when:

- PostgreSQL is established as durable Source of Truth;
- Prisma schema ownership and boundaries are explicit;
- aggregate, identity, version, relation, and mapping rules are defined;
- constraints and indexes protect known access and integrity paths;
- migration and seed policies are safe and repeatable;
- temporal, numeric, deletion, idempotency, and outbox semantics are explicit;
- verification gates prevent repository evidence from being mistaken for runtime success.

---

## 37. Architectural Decision

Math Learning World adopts PostgreSQL as its authoritative durable store and Prisma as its Infrastructure persistence tool.

The persistence model is relational, migration-controlled, constraint-backed, explicitly mapped, concurrency-aware, and verified through separate Repository, Runtime, and Operational gates.