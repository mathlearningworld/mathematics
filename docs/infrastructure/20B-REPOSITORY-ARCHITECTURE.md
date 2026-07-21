# 20B — Repository Architecture

## 1. Purpose

This document defines the repository architecture for Math Learning World.

Repositories provide persistence-oriented access to aggregates and application read models while protecting Domain and Application layers from ORM, SQL, and storage-specific details.

It is the Source of Truth for:

- repository responsibilities;
- repository contract ownership;
- aggregate loading and saving;
- read/write separation;
- mapping rules;
- identity and version handling;
- query boundaries;
- tenant and actor isolation;
- failure behavior;
- testing requirements.

---

## 2. Core Principle

> A repository presents durable state as a collection of domain or application concepts, not as a database API.

A repository is not a generic CRUD wrapper.

It exists to support explicit use cases and aggregate lifecycle requirements.

---

## 3. Repository Categories

Math Learning World distinguishes two repository categories.

### 3.1 Aggregate repositories

Aggregate repositories load and persist authoritative write models.

Examples:

```text
LearnerRepository
SkillProgressRepository
MasteryPathwayRepository
MentorshipAccountRepository
```

They support invariant-preserving behavior and optimistic concurrency.

### 3.2 Query repositories

Query repositories retrieve projections or purpose-built read models.

Examples:

```text
LearnerDashboardQueryRepository
SkillCatalogQueryRepository
ProgressHistoryQueryRepository
TeacherClassOverviewQueryRepository
```

They optimize retrieval and may use direct SQL or Prisma projections without rebuilding aggregates.

The two categories must not be confused.

---

## 4. Contract Ownership

Repository interfaces belong to the inner layer that consumes them.

- Domain-owned repository contracts exist only when the Domain model genuinely requires collection semantics.
- Application-owned repository contracts are preferred for use-case orchestration.
- Infrastructure owns concrete adapters and technical helpers.

A Prisma model does not define a repository contract.

The use case defines the capability; Infrastructure implements it.

---

## 5. Aggregate Repository Contract

A write repository contract should be narrow and intention-revealing.

Illustrative shape:

```ts
interface SkillProgressRepository {
  findByLearnerAndSkill(
    learnerId: LearnerId,
    skillId: SkillId,
  ): Promise<SkillProgress | null>;

  save(
    progress: SkillProgress,
    expectedVersion: number,
  ): Promise<void>;
}
```

The exact interface may vary by aggregate, but it must communicate:

- identity;
- absence semantics;
- transaction participation;
- expected version where concurrency matters;
- authoritative save behavior.

---

## 6. No Generic Base Repository

A universal repository abstraction such as the following is prohibited as the primary design:

```text
create(data)
findMany(filter)
update(id, data)
delete(id)
```

Reasons:

- it exposes persistence shape rather than business capability;
- it encourages aggregate bypass;
- it hides authorization and tenancy requirements;
- it cannot express version checks clearly;
- it couples callers to generic filtering semantics;
- it makes invariant ownership ambiguous.

Shared internal helpers are allowed inside Infrastructure when they do not become public application contracts.

---

## 7. Aggregate Loading

An aggregate repository must load sufficient state to reconstruct a valid aggregate.

Loading rules:

1. Identity is explicit.
2. Required child entities and value objects are loaded consistently.
3. Persistence records are mapped through a dedicated mapper or reconstruction function.
4. Domain constructors intended for new entities are not misused for rehydration if that would replay creation rules incorrectly.
5. Stored version is restored.
6. Corrupt or impossible persisted state fails explicitly.
7. Missing records return the contractually defined absence result.

Lazy loading into Domain objects is prohibited unless explicitly designed because it hides I/O and transaction dependencies.

---

## 8. Aggregate Saving

Saving persists the aggregate as one consistency boundary.

A save operation must:

- target the correct aggregate identity;
- preserve tenant/workspace ownership;
- compare the expected version;
- update the aggregate version deterministically;
- persist owned child state atomically;
- remove or archive obsolete owned rows according to the model;
- participate in the active Unit of Work;
- record pending outbox messages when required;
- report conflicts without silently overwriting newer state.

A repository must not partially save an aggregate and still report success.

---

## 9. Insert and Update Semantics

Repository contracts should make insert/update semantics explicit when the distinction matters.

Options include:

```text
add(newAggregate)
save(existingAggregate, expectedVersion)
```

or a unified save operation with clear rules.

A unified save must not silently convert:

- duplicate creation into update;
- missing update into insertion;
- version mismatch into last-write-wins.

Unexpected persistence state is a conflict or integrity failure.

---

## 10. Optimistic Concurrency

Authoritative aggregates use optimistic concurrency where concurrent writes are possible.

Typical mechanism:

```text
UPDATE ...
SET version = version + 1, ...
WHERE id = ? AND version = expectedVersion
```

If no authoritative row is updated, Infrastructure distinguishes:

- aggregate missing;
- expected-version mismatch;
- tenant/workspace mismatch where safely diagnosable.

The public Application result should use a stable concurrency failure contract.

Automatic retry is allowed only under an explicit policy and only when repeating the use case is safe.

---

## 11. Identity

Repository implementations preserve domain identity independently from database implementation details.

Rules:

- Database-generated identifiers are used only when compatible with application identity timing.
- Prefer identifiers created before persistence when events and child objects need stable identity during the use case.
- Composite business identity is enforced by database constraints and application checks where necessary.
- External-provider identifiers are not treated as internal aggregate identifiers.
- Identifier parsing and validation occur before repository execution.

---

## 12. Tenant and Workspace Isolation

Every tenant-scoped or workspace-scoped repository operation includes the authoritative scope in its predicate.

Example:

```text
WHERE workspace_id = :workspaceId
  AND aggregate_id = :aggregateId
```

Loading by aggregate ID alone is prohibited for scoped data.

Isolation requirements apply to:

- reads;
- writes;
- deletes;
- version checks;
- batch operations;
- projection queries;
- uniqueness checks.

Authorization remains an Application concern, but repository scoping supplies defense in depth against cross-scope access.

---

## 13. Mapping Architecture

Mapping is explicit:

```text
Persistence record → Mapper → Domain aggregate
Domain aggregate → Mapper → Persistence write model
```

Mappers may be organized per aggregate.

They are responsible for:

- primitive conversion;
- enum conversion;
- date/time normalization;
- nullable-field interpretation;
- value-object construction;
- child collection reconstruction;
- version transfer;
- schema evolution compatibility where temporarily required.

Mappers must not introduce business decisions.

---

## 14. Prisma Boundary

Prisma is confined to Infrastructure.

Allowed locations include:

```text
src/infrastructure/database/prisma/
src/infrastructure/database/repositories/
src/infrastructure/database/queries/
src/infrastructure/database/transactions/
```

Prohibited leakage includes:

- Prisma-generated types in Application command/query contracts;
- Prisma enums in Domain entities;
- `PrismaClient` in route handlers;
- raw ORM records returned to Presentation;
- ORM exceptions used as public failures.

Infrastructure converts Prisma results into stable inner-layer types.

---

## 15. Read Repository Design

Read repositories are purpose-built for query handlers.

They may:

- select only required fields;
- join multiple tables;
- use database views;
- use materialized projections;
- paginate;
- sort;
- aggregate counts and progress metrics;
- return immutable DTOs.

They must:

- enforce scope isolation;
- provide deterministic ordering;
- use bounded pagination;
- avoid leaking ORM types;
- document consistency expectations;
- return stable query DTOs.

Read repositories do not return mutable aggregates unless they are aggregate repositories.

---

## 16. Pagination

List queries use explicit bounded pagination.

Preferred models:

- cursor pagination for large or frequently changing datasets;
- offset pagination for small administrative datasets where acceptable.

A repository contract defines:

```text
page size maximum
cursor meaning
sort order
tie-breaker
next-page behavior
empty-page behavior
```

Unbounded `findMany` operations are prohibited on production paths.

---

## 17. Deletion and Archival

Deletion semantics come from product and domain policy.

Repositories implement one of:

- hard delete;
- soft delete;
- archival state transition;
- retention-controlled purge.

A generic `delete(id)` method must not decide policy implicitly.

Queries must consistently include or exclude archived/deleted records according to their contract.

---

## 18. Failure Translation

Repository implementations translate database failures into stable categories.

Examples:

```text
P2002 / unique violation → Conflict
P2025 / missing target → NotFound or IntegrityFailure
serialization/deadlock → TransientPersistenceFailure
timeout → DependencyTimeout
connection failure → DependencyUnavailable
version predicate miss → ConcurrencyConflict
```

Exact vendor codes remain internal diagnostic evidence.

Unknown database failures are not mislabeled as validation failures.

---

## 19. Transaction Participation

Write repositories do not independently create hidden transactions when called inside a use-case Unit of Work.

They receive or are bound to a transaction-scoped database client.

Rules:

1. All writes in one use-case transaction share the same transaction context.
2. Reads required for invariant-safe writes use the same context when consistency requires it.
3. Repositories do not commit or roll back independently.
4. The Unit of Work controls completion.
5. External I/O is excluded from the database transaction unless explicitly approved.

---

## 20. Batch Operations

Batch operations are allowed only with explicit semantics.

They must define:

- maximum batch size;
- atomic or partial-success behavior;
- per-item failure reporting;
- scope isolation;
- concurrency behavior;
- idempotency behavior;
- observability.

Batch convenience must not bypass aggregate invariants.

---

## 21. Caching and Repositories

Cache is not embedded invisibly in authoritative write repositories.

Where caching is introduced:

- ownership is explicit;
- cache keys include scope and version dimensions as needed;
- invalidation follows successful commit;
- stale-read tolerance is documented;
- cache failure does not corrupt authoritative state;
- PostgreSQL remains the Source of Truth unless a later approved architecture states otherwise.

---

## 22. Repository Testing

Every repository adapter requires integration tests against a real PostgreSQL-compatible runtime.

Minimum write-repository cases:

1. Insert and reload.
2. Update and reload.
3. Aggregate child persistence.
4. Missing aggregate.
5. Duplicate identity.
6. Expected-version success.
7. Expected-version conflict.
8. Transaction rollback.
9. Scope isolation.
10. Mapping of all supported states.

Minimum read-repository cases:

1. Correct projection shape.
2. Deterministic ordering.
3. Pagination boundaries.
4. Empty result.
5. Scope isolation.
6. Archived/deleted filtering.
7. Aggregate/count correctness.

Mocked Prisma tests do not replace these integration tests.

---

## 23. Review Checklist

A repository change is acceptable when reviewers can answer yes to all applicable questions:

- Is the contract owned by the correct inner layer?
- Does the method express a real use-case capability?
- Is aggregate consistency preserved?
- Is tenant/workspace scope included?
- Is optimistic concurrency enforced?
- Are ORM types contained in Infrastructure?
- Is mapping explicit and tested?
- Are list operations bounded?
- Are failures translated stably?
- Does the repository participate correctly in Unit of Work?
- Is there real database integration evidence?

---

## 24. Prohibited Patterns

The following are prohibited:

- one generic repository for every table;
- direct Prisma access from routes or application handlers;
- persistence records used as Domain entities;
- loading scoped data by unscoped ID;
- last-write-wins for authoritative progress state;
- repository methods that conceal network calls;
- unbounded list queries;
- silent upsert where create/update conflict semantics matter;
- repository-owned business transitions;
- repository methods that commit independently inside a broader use case;
- mocks presented as proof of PostgreSQL behavior.

---

## 25. Completion Criteria

Repository architecture is considered defined when:

- aggregate and query repositories are distinguished;
- contracts are capability-oriented and inner-layer owned;
- Prisma remains behind Infrastructure boundaries;
- mapping, identity, version, and scope rules are explicit;
- transaction participation is deterministic;
- read models are bounded and purpose-built;
- failures are translated consistently;
- integration-test expectations are enforceable.

---

## 26. Architectural Decision

Math Learning World adopts explicit aggregate repositories for authoritative writes and purpose-built query repositories for reads.

Repository adapters preserve aggregate invariants, scope isolation, optimistic concurrency, and ORM independence while PostgreSQL remains the durable Source of Truth.