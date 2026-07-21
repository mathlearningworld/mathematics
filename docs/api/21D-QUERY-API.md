# 21D — Query API

## 1. Purpose

This document defines how Math Learning World exposes read-only application capabilities through HTTP query endpoints.

It governs:

- query endpoint design;
- query request contracts;
- read-model ownership;
- projection selection;
- consistency expectations;
- filtering, sorting, and pagination boundaries;
- authorization-aware reads;
- cache and conditional-request behavior;
- query failure mapping;
- testing obligations.

---

## 2. Core Principle

> A Query API returns an authorized projection of application state without causing a business state transition.

A query endpoint may assemble, filter, sort, and project information for a client use case.

It must not:

- mutate aggregates;
- write audit or domain state merely because data was read;
- call command handlers;
- hide business transitions behind `GET`;
- expose persistence records as public contracts;
- bypass tenant or actor scope.

Operational telemetry such as access logs, metrics, and traces is not considered a business mutation.

---

## 3. Query Flow

Every query endpoint follows this flow:

```text
HTTP request
  → protocol and query-parameter validation
  → authenticated RequestContext
  → query DTO mapping
  → Application query execution
  → read-model or repository projection
  → authorization-aware result shaping
  → HTTP response mapping
```

The API handler coordinates transport concerns only.

The Application query owns the use-case meaning of the read.

---

## 4. Query Endpoint Shapes

Typical collection endpoints:

```text
GET /api/v1/learners
GET /api/v1/skills
GET /api/v1/practice-sessions
GET /api/v1/assessment-attempts
GET /api/v1/mentorship-events
```

Typical instance endpoints:

```text
GET /api/v1/learners/{learnerId}
GET /api/v1/skills/{skillId}
GET /api/v1/practice-sessions/{sessionId}
GET /api/v1/assessment-attempts/{attemptId}
```

Typical named projections:

```text
GET /api/v1/learners/{learnerId}/mastery-overview
GET /api/v1/learners/{learnerId}/learning-health
GET /api/v1/learners/{learnerId}/recommended-path
GET /api/v1/classes/{classId}/progress-dashboard
```

A named projection is appropriate when the representation has distinct use-case meaning and is not merely a filtered copy of the base resource.

---

## 5. Query DTO versus Application Query

The public query DTO and the internal Application query are separate contracts.

Example public query DTO:

```ts
type ListLearnerSkillsQueryParams = {
  status?: 'not_started' | 'learning' | 'mastered';
  cursor?: string;
  limit?: number;
  sort?: 'updatedAt' | 'masteryLevel';
  order?: 'asc' | 'desc';
};
```

Example Application query:

```ts
type ListLearnerSkillsQuery = {
  learnerId: LearnerId;
  status?: SkillProgressStatus;
  page: CursorPageRequest;
  sort: LearnerSkillSort;
};
```

Trusted actor, tenant, role, correlation, and authorization context is supplied separately through `RequestContext`.

The client must never choose its own trusted scope through request parameters.

---

## 6. Read Models

A Query API may return data from:

- domain-backed repositories;
- purpose-built read repositories;
- denormalized projections;
- materialized views;
- search indexes;
- cache-backed projections;
- analytics stores approved for the use case.

The selected source must satisfy the endpoint's documented consistency, authorization, and freshness contract.

Read models are optimized for client questions.

They do not need to mirror aggregate structure.

Example:

```ts
type LearnerMasteryOverviewResponse = {
  learnerId: string;
  currentLevel: string;
  masteredSkillCount: number;
  learningSkillCount: number;
  blockedSkillCount: number;
  nextRecommendedSkillIds: string[];
  calculatedAt: string;
};
```

This representation may combine several internal sources while remaining one stable public contract.

---

## 7. Representation Ownership

The API layer owns transport representation.

The Application layer owns query semantics.

Infrastructure owns technical retrieval implementations.

Therefore:

```text
HTTP response DTO ≠ Prisma row
HTTP response DTO ≠ Domain aggregate serialization
HTTP response DTO ≠ Internal projection storage schema
```

Every response representation must be intentionally mapped.

Do not return ORM objects directly from route handlers.

---

## 8. Collection versus Instance Semantics

### 8.1 Instance query

An instance endpoint asks for one identifiable resource or projection.

```text
GET /api/v1/learners/{learnerId}
```

Possible outcomes:

- `200 OK` when visible;
- `404 Not Found` when absent or intentionally concealed;
- `403 Forbidden` only when disclosure of existence is acceptable;
- stable authentication failures when no valid identity exists.

### 8.2 Collection query

A collection endpoint returns the authorized subset visible to the caller.

```text
GET /api/v1/learners
```

An empty authorized result returns:

```http
200 OK
```

```json
{
  "items": [],
  "page": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

An empty collection is not `404`.

---

## 9. Authorization-Aware Queries

Authorization is part of query meaning, not a final cosmetic filter.

The query execution must constrain data by:

- authenticated subject;
- tenant or workspace;
- learner ownership or guardianship;
- teacher-to-class relationship;
- mentorship relationship;
- role and permission;
- record-level visibility;
- field-level sensitivity where required.

Unsafe pattern:

```text
load all records → filter unauthorized records in controller
```

Required pattern:

```text
trusted RequestContext → scoped query → authorized projection
```

This reduces accidental disclosure through result bodies, counts, pagination metadata, timing, and cache keys.

---

## 10. Existence Concealment

Some resources must not reveal whether an unauthorized identifier exists.

For those resources, the API returns a uniform not-found response for both:

- absent resource;
- resource outside the caller's visibility scope.

The policy must be consistent per resource family.

Logs may preserve the internal reason, but public error details must not disclose protected existence.

---

## 11. Field-Level Projection

The server defines supported representations.

Clients must not receive arbitrary database-field selection.

Limited field selection may be supported only through a documented allowlist:

```text
GET /api/v1/skills?fields=id,name,gradeLevel
```

Prohibited behavior:

- accepting raw SQL field names;
- exposing internal columns;
- allowing clients to select secret, audit, or authorization fields;
- making response shape impossible to version.

Named sparse fieldsets must remain part of the public contract.

---

## 12. Expansion and Included Relations

Related data may be included through a bounded expansion contract:

```text
GET /api/v1/learners/{learnerId}?include=profile,masterySummary
```

Rules:

- supported expansion names are explicit;
- expansion depth is bounded;
- cyclic expansion is prohibited;
- authorization is checked for every included relation;
- cost limits apply;
- unsupported expansion returns a stable validation error;
- default representation remains predictable.

Do not expose an unrestricted graph traversal API through query parameters.

---

## 13. Filtering

Filtering syntax must be explicit and allowlisted.

Example:

```text
GET /api/v1/practice-sessions?status=active&learnerId=lrn_123
```

Each filter must define:

- accepted type;
- valid values;
- whether repeated values mean `OR` or `AND`;
- case sensitivity;
- null semantics;
- date and time semantics;
- authorization interaction;
- index and performance expectations.

Unknown filters should fail validation rather than being silently ignored.

Detailed cross-endpoint rules are defined further in 21H.

---

## 14. Sorting

Supported sort fields must be allowlisted.

Example:

```text
GET /api/v1/skills?sort=gradeLevel,name&order=asc,asc
```

A deterministic final tie-breaker is required, normally a stable unique identifier.

Example logical ordering:

```text
gradeLevel ASC, name ASC, skillId ASC
```

Never concatenate untrusted sort input into a database query.

---

## 15. Pagination

Large or unbounded collections must be paginated.

Cursor pagination is preferred when:

- data changes frequently;
- stable continuation matters;
- result sets are large;
- chronological or deterministic ordering exists.

Example response:

```json
{
  "items": [],
  "page": {
    "nextCursor": "opaque-token",
    "hasMore": true
  }
}
```

The cursor is opaque to clients and must encode or reference enough information to preserve continuation semantics.

Offset pagination may be used for small, low-volatility administrative datasets when its trade-offs are documented.

Detailed pagination contracts are defined in 21H.

---

## 16. Result Limits

Every collection endpoint defines:

- default page size;
- maximum page size;
- server behavior for out-of-range values;
- total-count support or omission;
- maximum expansion cost.

Recommended validation behavior:

```text
limit omitted      → endpoint default
limit below 1      → 400 validation error
limit above maximum → 400 validation error
```

Silently clamping may be permitted only when documented consistently.

---

## 17. Total Counts

Exact total counts may be expensive, slow, stale, or disclosure-sensitive.

An endpoint must explicitly decide whether to return:

- no count;
- exact count;
- approximate count;
- count available only on request;
- count from a separate projection.

Do not promise an exact total merely because a UI currently displays one.

Counts must be computed within the same authorization scope as items.

---

## 18. Consistency Contract

Each query endpoint must fit one consistency category.

### 18.1 Strongly current

The response reflects the authoritative write store after a committed command, subject to transaction completion.

Use when immediate correctness is required.

### 18.2 Read-your-writes

A caller can observe the result of its accepted command through a defined token, version, direct resource response, or authoritative fallback.

### 18.3 Eventually consistent

The response may lag behind committed state because it uses asynchronous projections, caches, or search indexes.

The endpoint must document:

- expected lag;
- freshness metadata when useful;
- recovery behavior;
- whether an authoritative detail endpoint exists.

---

## 19. Projection Freshness

Eventually consistent responses may include:

```json
{
  "data": {},
  "meta": {
    "projectedAt": "2026-07-21T09:00:00.000Z",
    "sourceVersion": 42
  }
}
```

Freshness metadata must have a defined meaning.

Do not expose timestamps that appear precise but do not describe the actual projection state.

---

## 20. Read-After-Command Behavior

A command response should return sufficient information for the client to continue safely.

Depending on the use case, this may include:

- resource identifier;
- new version;
- canonical resource location;
- operation identifier;
- command result projection;
- retry or polling guidance.

A client must not be forced to race an eventually consistent list endpoint immediately after every successful command.

---

## 21. Conditional Requests

Stable resource representations may support validators:

```http
ETag: "learner-123-v42"
```

Client revalidation:

```http
If-None-Match: "learner-123-v42"
```

Unchanged representation:

```http
304 Not Modified
```

Rules:

- the validator must change when the selected representation changes;
- it must not leak sensitive internal data;
- authorization is evaluated before returning cached or validated content;
- shared-cache behavior must be safe for actor-specific responses.

---

## 22. Cache-Control

Cache policy is endpoint-specific.

Examples:

```http
Cache-Control: no-store
```

for sensitive learner or identity data.

```http
Cache-Control: private, max-age=60
```

for short-lived actor-specific projections.

```http
Cache-Control: public, max-age=300
```

only for truly public, identical representations.

Authentication alone does not make a response safe for shared caching.

Cache keys must vary by every factor affecting the representation, including authorization scope.

---

## 23. Search Queries

Search is distinct from ordinary filtering when it includes:

- text relevance;
- tokenization;
- language analysis;
- typo tolerance;
- ranking;
- external search infrastructure.

Example:

```text
GET /api/v1/skills/search?q=fractions
```

or, when search is naturally part of the collection:

```text
GET /api/v1/skills?q=fractions
```

The chosen pattern must remain consistent for that resource family.

Search ranking is not assumed to be stable across versions unless explicitly contracted.

---

## 24. Time and Date Queries

Public timestamps use ISO 8601 with an explicit offset, normally UTC:

```text
2026-07-21T09:00:00.000Z
```

Query ranges must define inclusive and exclusive boundaries.

Recommended interval convention:

```text
[start, end)
```

Example:

```text
GET /api/v1/practice-sessions?startedAtFrom=2026-07-01T00:00:00Z&startedAtBefore=2026-08-01T00:00:00Z
```

Date-only values must define the relevant timezone and calendar semantics.

---

## 25. Null, Missing, and Empty

Public representations distinguish:

- field omitted because it is not part of the representation;
- field omitted because it is unauthorized;
- `null` because the value is known to be absent;
- empty collection because no related items exist;
- unavailable because a projection is not ready.

These meanings must not be used interchangeably.

Sensitive fields should normally be omitted rather than returned as `null` when omission avoids revealing schema or permission information.

---

## 26. Query Cost Governance

Each query endpoint should have a bounded execution cost.

Controls may include:

- maximum page size;
- expansion limits;
- filter allowlists;
- query timeouts;
- index requirements;
- precomputed projections;
- rate limits;
- complexity budgets;
- asynchronous export for large reports.

An endpoint that can scan an unbounded tenant dataset is not production-ready.

---

## 27. Large Exports

Large reports and exports should not be forced through normal synchronous collection endpoints.

Recommended flow:

```text
POST /api/v1/progress-report-exports
  → 202 Accepted
  → operation or export resource
GET /api/v1/progress-report-exports/{exportId}
  → status and authorized download metadata
```

The export creation is a command.

The export status and download discovery are queries.

---

## 28. Sensitive Data

Query responses must apply data-minimization rules.

Do not expose:

- password hashes;
- authentication secrets;
- refresh-token material;
- internal authorization policy state not intended for clients;
- private notes outside caller scope;
- raw provider payloads;
- infrastructure identifiers without public meaning;
- unnecessary personally identifiable information.

A field being available in persistence is not justification for returning it.

---

## 29. Query Errors

Common query failures include:

```text
INVALID_QUERY_PARAMETER
UNSUPPORTED_FILTER
UNSUPPORTED_SORT
INVALID_CURSOR
RESOURCE_NOT_FOUND
QUERY_SCOPE_FORBIDDEN
PROJECTION_NOT_READY
QUERY_TOO_COMPLEX
RATE_LIMIT_EXCEEDED
```

All failures use the common Error Contract defined in 21F.

Database and provider exceptions must not leak through the API.

---

## 30. HTTP Status Mapping

Typical mappings:

```text
200 OK                    successful instance or collection query
304 Not Modified          conditional request matched
400 Bad Request           malformed or invalid query contract
401 Unauthorized          authentication required or invalid
403 Forbidden             authenticated but operation not permitted
404 Not Found             resource absent or concealed
409 Conflict              rare query-state conflict where explicitly modeled
422 Unprocessable Content semantically invalid query when adopted consistently
429 Too Many Requests     rate limit exceeded
503 Service Unavailable   required projection or dependency unavailable
```

The repository must choose one consistent validation status policy rather than mixing `400` and `422` arbitrarily.

---

## 31. Response Envelope

A successful instance endpoint may return the representation directly:

```json
{
  "id": "lrn_123",
  "displayName": "Example Learner"
}
```

A collection should use a stable envelope:

```json
{
  "items": [],
  "page": {
    "nextCursor": null,
    "hasMore": false
  }
}
```

Cross-cutting metadata belongs in a documented `meta` object only when clients need it.

Do not wrap every response in arbitrary layers without a clear contract benefit.

---

## 32. Observability

Query execution should emit structured telemetry for:

- route template;
- query type;
- request and correlation identifiers;
- actor and tenant identifiers in protected form;
- duration;
- result count;
- pagination size;
- cache hit or miss;
- projection source;
- timeout and failure category.

Logs must not copy sensitive query values or full response bodies by default.

---

## 33. Testing Obligations

Each query endpoint requires tests for:

1. successful authorized retrieval;
2. empty collection behavior;
3. absent resource behavior;
4. cross-tenant isolation;
5. role and relationship restrictions;
6. field-level visibility;
7. filter validation;
8. deterministic sorting;
9. pagination continuation;
10. invalid and tampered cursor handling;
11. maximum page size;
12. eventual-consistency metadata where applicable;
13. conditional request behavior where supported;
14. cache isolation;
15. stable error contract;
16. persistence or projection failure translation.

Contract tests must verify public shape rather than internal storage structure.

---

## 34. Prohibited Patterns

The following are prohibited:

- using `GET` to mutate business state;
- serializing Prisma models directly;
- controller access to database clients;
- client-selected tenant or actor scope;
- authorization applied only after unscoped data retrieval;
- unrestricted field selection;
- unrestricted relation expansion;
- raw SQL fragments from query parameters;
- unstable pagination without a deterministic tie-breaker;
- exposing exact counts outside authorization scope;
- public caching of actor-specific data;
- undocumented eventual consistency;
- returning provider or database errors directly.

---

## 35. Review Checklist

Before approving a Query API endpoint, verify:

- [ ] the endpoint expresses a real client question;
- [ ] the query does not cause a business transition;
- [ ] the request DTO is separated from the Application query;
- [ ] actor and tenant scope come from trusted context;
- [ ] the representation is intentionally mapped;
- [ ] authorization is enforced in retrieval scope;
- [ ] existence-concealment policy is defined;
- [ ] filtering and sorting are allowlisted;
- [ ] pagination is deterministic and bounded;
- [ ] consistency and freshness expectations are documented;
- [ ] cache behavior is safe;
- [ ] sensitive fields are minimized;
- [ ] errors use stable public codes;
- [ ] contract and isolation tests exist.

---

## 36. Completion Rule

A Query API is complete only when:

```text
client question
  → validated query contract
  → trusted RequestContext
  → scoped Application query
  → authorized read model
  → intentional public projection
  → documented consistency and pagination
  → stable response or error
  → contract verification
```

A route that merely returns database rows is not a completed Query API.