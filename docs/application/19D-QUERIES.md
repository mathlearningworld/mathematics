# 19D — Queries and Query Handlers

## 1. Purpose

This document defines the architectural contract for queries and query handlers in Math Learning World.

A query asks for information without requesting a business-state change. A query handler reads from approved read sources, applies application visibility rules, and returns an explicit read model.

This document is the Source of Truth for:

- query semantics;
- query contract design;
- query-handler responsibilities;
- read-model ownership;
- authorization and visibility;
- filtering, sorting, and pagination;
- consistency expectations;
- caching;
- query failures;
- query testing.

---

## 2. Core Principle

> A query answers one explicit question and must not change business state.

Query execution must be observational. It must not mutate aggregates, persist domain changes, emit domain events, or trigger hidden business workflows.

---

## 3. Query Definition

A query is an immutable application message describing one information request.

Examples:

- GetLearnerDashboardQuery
- GetSkillProgressQuery
- ListAvailableMissionsQuery
- GetMissionAttemptHistoryQuery
- GetParentLearningOverviewQuery
- ListLearnersNeedingSupportQuery
- GetMentorCreditBalanceQuery

A query is not:

- an ORM query builder exposed outside infrastructure;
- an HTTP request;
- a mutable filter object shared across requests;
- a command that happens to return data;
- an unrestricted database search.

---

## 4. Query Shape

A query should contain only the facts needed to define the question.

Example:

```ts
interface GetSkillProgressQuery {
  learnerId: string;
  skillId: string;
  includeEvidence?: boolean;
}
```

List query example:

```ts
interface ListAvailableMissionsQuery {
  learnerId: string;
  cursor?: string;
  limit: number;
  skillId?: string;
  difficulty?: string;
}
```

Actor, tenant, correlation, locale, and request metadata should normally be carried in execution context rather than embedded in every query.

---

## 5. Query Naming

Queries must reveal the exact question being asked.

Preferred prefixes:

- Get — one identified result or composed view;
- List — a bounded collection;
- Find — an optional result based on criteria;
- Search — ranked or broader retrieval;
- Resolve — derive one application answer from several sources.

Avoid vague names such as:

- LoadData
- FetchEverything
- GetInfo
- QueryRecords
- DashboardQuery without a clear actor or surface.

---

## 6. Query Handler Contract

A query handler handles exactly one query type.

Recommended shape:

```ts
interface QueryHandler<Q, R> {
  execute(query: Q, context: ExecutionContext): Promise<R>;
}
```

A query handler may:

1. validate query shape;
2. authorize access;
3. apply tenant and ownership boundaries;
4. read one or more projections;
5. compose an application read model;
6. apply localization or presentation-neutral formatting rules;
7. return explicit pagination and freshness metadata.

A query handler must not:

- call aggregate mutation methods;
- save through repositories;
- emit domain events;
- create hidden audit or analytics writes in the same path;
- expose database records directly;
- depend on UI components or HTTP response types.

---

## 7. Read Model Ownership

Read models belong to the application boundary of the query they serve.

A read model should be designed around the consumer's question, not around normalized database structure.

Example:

```ts
interface LearnerDashboardView {
  learnerId: string;
  currentMission?: MissionSummaryView;
  masterySummary: MasterySummaryView;
  recommendedNextActions: NextActionView[];
  recentProgress: ProgressPointView[];
  generatedAt: string;
  freshness: "LIVE" | "NEAR_REAL_TIME" | "EVENTUALLY_CONSISTENT";
}
```

Read models must not expose:

- ORM entities;
- internal aggregate state not authorized for the caller;
- secret identity or security fields;
- mutable domain object references;
- infrastructure-specific pagination tokens without an application contract.

---

## 8. Read Sources

Query handlers may read from:

- dedicated projection stores;
- read repositories;
- search indexes;
- analytics stores;
- cached views;
- external read-only service ports;
- domain repositories only when no dedicated read model is justified.

For high-traffic dashboards and lists, dedicated projections are preferred over reconstructing full aggregates.

The use of a domain repository for a query must not lead to aggregate mutation or accidental persistence.

---

## 9. Authorization and Visibility

Every query must enforce both execution permission and data visibility.

The handler must determine:

- whether the actor may ask the question;
- which learner, family, classroom, school, or tenant scope is visible;
- which fields are appropriate for the actor role;
- whether sensitive learning evidence may be disclosed;
- whether child privacy constraints apply.

Examples:

- a learner may view their own progress;
- a parent may view linked children according to verified relationship;
- a mentor may view only assigned support context;
- a teacher may view authorized classroom learners;
- administrative analytics must not leak identifiable learner data unnecessarily.

Visibility must not rely only on frontend filtering.

---

## 10. Filtering

Filters must be explicit, bounded, and validated.

Rules:

- use allow-listed fields;
- reject unsupported operators;
- validate date ranges;
- enforce tenant scope independently of caller-provided filters;
- prevent unrestricted wildcard scans;
- avoid passing raw SQL or ORM fragments through query contracts.

Application filters should express product meaning, such as:

- mastery state;
- grade band;
- mission availability;
- support urgency;
- completion period;
- mentorship status.

---

## 11. Sorting

Every collection query must define deterministic ordering.

Rules:

- default sort must be documented;
- tie-breakers must be stable;
- user-selectable sort fields must be allow-listed;
- sorting must not expose unauthorized fields;
- cursor pagination must use the same stable ordering for all pages.

Example:

```text
recommendedPriority DESC,
updatedAt DESC,
missionId ASC
```

---

## 12. Pagination

Unbounded collection results are forbidden.

Supported approaches:

### 12.1 Cursor Pagination

Preferred for changing timelines, histories, and large collections.

Result shape:

```ts
interface CursorPage<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}
```

### 12.2 Offset Pagination

Allowed for small, stable administrative datasets where its limitations are acceptable.

Every paginated query must define:

- default limit;
- maximum limit;
- stable ordering;
- cursor or offset semantics;
- behavior when the underlying dataset changes.

---

## 13. Consistency and Freshness

Each query must declare its consistency expectation.

Possible levels:

- LIVE — reads authoritative current state;
- READ_YOUR_WRITES — caller should observe a just-committed command;
- NEAR_REAL_TIME — projection lag is expected but small;
- EVENTUALLY_CONSISTENT — delayed convergence is acceptable;
- SNAPSHOT — result represents a named reporting period or generation time.

The result should expose `generatedAt`, projection version, or freshness metadata when the distinction matters to the product.

The UI must not represent eventually consistent information as guaranteed live truth.

---

## 14. Read-Your-Writes

After a command, the product may require immediate visibility of the new state.

Approved strategies include:

- return sufficient state in the command result;
- synchronously update the required projection within the transaction;
- read from the authoritative write store for a bounded follow-up query;
- wait for projection checkpoint with a strict timeout;
- expose pending synchronization state to the client.

Blind polling without a defined freshness contract is discouraged.

---

## 15. Caching

Caching is an infrastructure optimization, not query semantics.

A query may be cached only when:

- the cache key includes all authorization and tenant dimensions;
- freshness requirements are explicit;
- invalidation or expiry behavior is defined;
- sensitive data is protected;
- stale responses are acceptable for the use case.

Never share personalized learner, parent, mentor, or classroom results across actors through an incomplete cache key.

---

## 16. Query Results

Query results should be explicit application DTOs.

A result may include:

- requested data;
- pagination metadata;
- generated timestamp;
- freshness indicator;
- projection checkpoint;
- permitted actions when derived from authorization and application policy;
- empty-state reason when useful.

A result must not include hidden implementation details such as table names, SQL errors, internal queue offsets, or unrestricted provider payloads.

---

## 17. Empty, Missing, and Forbidden Results

These outcomes must be distinguished.

- `NOT_FOUND`: the requested identified resource does not exist or is intentionally indistinguishable for security.
- `FORBIDDEN`: the actor is known not to have access and disclosure is safe.
- Empty collection: the question is valid but there are no matching items.
- `INVALID_QUERY`: filters, cursor, or requested shape are invalid.

The choice between `NOT_FOUND` and `FORBIDDEN` must follow the security disclosure policy.

---

## 18. Query Failure Model

Common stable failure codes include:

- QUERY_INVALID
- ACTOR_UNAUTHENTICATED
- QUERY_FORBIDDEN
- READ_MODEL_NOT_FOUND
- CURSOR_INVALID
- PROJECTION_UNAVAILABLE
- READ_DEPENDENCY_UNAVAILABLE
- QUERY_TIMEOUT
- INTERNAL_FAILURE

Infrastructure errors must be translated into application failures without leaking credentials, SQL, indexes, or provider internals.

---

## 19. Performance Budgets

Important queries should declare performance expectations.

Examples:

- learner active-mission view: interactive latency budget;
- parent dashboard: bounded multi-projection composition;
- teacher classroom overview: paginated and projection-backed;
- historical analytics: asynchronous report when interactive execution is too expensive.

Handlers must avoid:

- N+1 reads;
- loading full aggregates for list screens;
- unrestricted joins across tenants;
- unbounded history retrieval;
- synchronous generation of expensive reports on interactive paths.

---

## 20. Search Queries

Search is distinct from deterministic lookup.

Search contracts must define:

- searchable fields;
- ranking behavior;
- tenant and authorization filters;
- typo tolerance where applicable;
- pagination;
- maximum query length;
- safe highlighting;
- index freshness.

Search results must not bypass authoritative visibility checks.

---

## 21. Query Composition

A handler may compose several read sources when one application question requires it.

Composition rules:

- preserve one clear query responsibility;
- define partial-failure behavior;
- use bounded parallel reads where safe;
- avoid cross-source inconsistency claims;
- expose freshness differences when material;
- do not convert a query handler into a general integration service.

For critical data, failure should be explicit rather than silently omitted. Optional supplementary sections may degrade gracefully if the result contract says so.

---

## 22. Observability

Each query execution should record:

- query type;
- correlation ID;
- safe actor and tenant references;
- duration;
- result count;
- cache status where relevant;
- projection freshness;
- failure code;
- timeout or dependency degradation.

Sensitive responses and raw learner evidence must not be logged by default.

---

## 23. Testing Strategy

Each query handler should test:

- successful single-result retrieval;
- successful collection retrieval;
- empty collection;
- missing resource;
- unauthorized actor;
- tenant isolation;
- field-level visibility;
- filter validation;
- stable ordering;
- cursor behavior;
- maximum page size;
- projection unavailability;
- freshness metadata;
- cache-key isolation where caching applies;
- absence of writes and domain events.

Contract tests should protect read-model shape used by external clients.

---

## 24. Anti-Patterns

Forbidden patterns include:

- query handlers saving entities;
- hidden state changes during reads;
- returning ORM records directly;
- unrestricted generic repository search;
- frontend-only authorization filtering;
- unbounded list endpoints;
- unstable pagination order;
- personalized caching without actor scope;
- reconstructing many aggregates for dashboard lists;
- pretending stale projections are live;
- one universal dashboard DTO for all roles and surfaces.

---

## 25. Completion Criteria

A query and handler are complete when:

- the query asks one explicit question;
- input is transport-neutral;
- authorization and visibility rules are enforced;
- read source ownership is clear;
- output is an explicit read model;
- filtering, sorting, and pagination are bounded;
- consistency and freshness are declared;
- caching behavior is safe where used;
- failures are stable and infrastructure-neutral;
- performance expectations are reasonable;
- tests cover access, isolation, ordering, pagination, freshness, and failure;
- execution performs no business-state mutation.
