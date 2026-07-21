# 21H — Pagination, Filtering, and Sorting

## 1. Purpose

This document defines stable collection-query behavior for Math Learning World APIs.

It governs:

- pagination models;
- cursor construction and lifetime;
- filtering syntax and semantics;
- sorting rules;
- deterministic ordering;
- limits and defaults;
- authorization-aware collections;
- projection consistency;
- query cost and abuse protection;
- testing obligations.

---

## 2. Core Principle

> A collection API must return a deterministic, bounded, authorization-safe view whose navigation remains meaningful while data changes.

Pagination, filtering, and sorting are public contract behavior, not transport conveniences.

---

## 3. Collection Contract

Every list endpoint must define:

- resource scope;
- visibility rules;
- default filter state;
- supported filters;
- default sort;
- allowed sort fields;
- pagination model;
- default and maximum page size;
- consistency expectations;
- empty-result behavior;
- invalid-query errors.

Example:

```text
GET /api/v1/learners/{learnerId}/practice-sessions
```

---

## 4. Default Pagination Model

Cursor pagination is the default for changing operational collections.

Example request:

```http
GET /api/v1/practice-sessions?limit=50&after=eyJ...
```

Example response:

```json
{
  "items": [],
  "page": {
    "limit": 50,
    "hasNext": true,
    "nextCursor": "eyJ..."
  }
}
```

Offset pagination may be used only for bounded, stable, administrative, or report-like datasets where its trade-offs are documented.

---

## 5. Why Cursor Pagination Is Preferred

Cursor pagination avoids common offset problems:

- skipped rows after inserts;
- duplicate rows after deletes;
- increasing database cost for deep pages;
- unstable navigation during active writes.

A cursor identifies a position in a deterministic ordering, not a page number.

---

## 6. Deterministic Ordering

Every paginated query must have a total order.

A user-selected sort field that is not unique must include a stable tie-breaker:

```text
ORDER BY completedAt DESC, id DESC
```

The cursor must encode all values needed to continue that exact order.

Never paginate using an ordering that can produce unresolved ties.

---

## 7. Cursor Contract

A cursor should be opaque to clients.

It may encode:

- sort field values;
- stable resource identifier;
- direction;
- normalized filter fingerprint;
- query version;
- optional expiry or snapshot marker.

Conceptual payload:

```ts
type CursorPayload = {
  version: 1;
  sort: Array<{ field: string; value: unknown }>;
  id: string;
  filterHash: string;
  direction: 'after' | 'before';
};
```

The client must not construct or modify cursors.

---

## 8. Cursor Integrity

Cursors must be protected against tampering.

Acceptable approaches include:

- authenticated encryption;
- signed encoded payloads;
- server-side cursor identity.

Invalid, expired, malformed, or mismatched cursors return stable error codes such as:

```text
INVALID_CURSOR
EXPIRED_CURSOR
CURSOR_QUERY_MISMATCH
```

Do not silently restart from the first page.

---

## 9. Cursor and Filter Binding

A cursor belongs to the normalized query that created it.

Changing any of these invalidates the cursor:

- resource scope;
- tenant or learner scope;
- filters;
- sort fields;
- sort direction;
- visibility mode;
- API contract version.

This prevents clients from reusing a cursor under a semantically different query.

---

## 10. Page Size

Each endpoint defines:

- default `limit`;
- minimum accepted value;
- maximum accepted value;
- whether the server may return fewer items.

Example:

```text
default: 25
minimum: 1
maximum: 100
```

Returning fewer than the requested limit does not necessarily mean the collection has ended. Clients use `hasNext` or cursor presence.

---

## 11. Bidirectional Pagination

Bidirectional pagination may expose:

```text
after
before
```

and response metadata:

```json
{
  "hasNext": true,
  "hasPrevious": false,
  "nextCursor": "...",
  "previousCursor": null
}
```

Endpoints should not expose bidirectional navigation unless the product requires it and the ordering semantics are tested in both directions.

---

## 12. Offset Pagination

When offset pagination is explicitly selected:

```http
GET /api/v1/catalog/skills?page=3&pageSize=25
```

The endpoint must document:

- whether total count is available;
- maximum accessible depth;
- behavior under concurrent writes;
- cost limitations;
- stable default ordering.

Offset pagination is not suitable for high-write feeds or unbounded histories.

---

## 13. Total Counts

Exact counts can be expensive and misleading on changing projections.

Counts must be classified as:

- exact;
- estimated;
- omitted;
- asynchronously computed.

Example:

```json
{
  "page": {
    "totalCount": 842,
    "totalCountKind": "EXACT"
  }
}
```

Do not include a total count by default unless the product needs it.

---

## 14. Filtering Principles

Filters must represent explicit supported query dimensions, not arbitrary database access.

Good examples:

```text
status=ACTIVE
skillId=...
startedFrom=2026-01-01T00:00:00Z
startedTo=2026-02-01T00:00:00Z
mentorId=...
```

Avoid generic field-expression APIs that expose internal schema or permit uncontrolled query construction.

---

## 15. Filter Naming

Filter names use public resource language, not persistence column names.

Prefer:

```text
completedFrom
completedTo
learnerId
masteryState
```

Avoid:

```text
completed_at_gte
user_fk
status_code_id
```

The API contract owns names independently from the database.

---

## 16. Repeated and Multi-Value Filters

Multi-value semantics must be explicit.

Recommended form:

```http
GET /api/v1/skills?gradeBand=M1&gradeBand=M2
```

Within one field, repeated values usually mean OR:

```text
gradeBand is M1 OR M2
```

Different fields usually combine with AND:

```text
gradeBand in (M1, M2) AND subject = MATHEMATICS
```

These rules must not vary silently by endpoint.

---

## 17. Range Filters

Range filters use explicit inclusive or exclusive semantics.

Example:

```text
startedFrom — inclusive
startedTo   — exclusive
```

This supports adjacent time windows without overlap:

```text
[2026-01-01, 2026-02-01)
[2026-02-01, 2026-03-01)
```

All timestamps must follow the API time and timezone contract.

---

## 18. Null and Absence Filters

The API must distinguish where relevant:

- field is absent;
- field is null;
- field is empty;
- field has a value.

Example explicit filter:

```text
mentorAssignment=UNASSIGNED
```

Prefer domain-language filters over generic `fieldIsNull=true` syntax.

---

## 19. Text Search

Text search is distinct from exact filtering.

Example:

```http
GET /api/v1/skills?search=linear%20equation
```

The endpoint must document:

- searched fields;
- tokenization or language behavior where relevant;
- case sensitivity;
- ranking and tie-break ordering;
- whether matching is prefix, exact, fuzzy, or full-text;
- minimum query length and limits.

Search ranking must still include a deterministic tie-breaker for pagination.

---

## 20. Sorting Syntax

Recommended syntax:

```text
sort=-completedAt,id
```

Meaning:

- `-completedAt` descending;
- `id` ascending.

Only allowlisted public sort fields are accepted.

An unsupported field returns a validation error rather than being ignored.

---

## 21. Default Sorting

Every collection has one documented default sort.

Examples:

```text
practice sessions: -startedAt,-id
skills catalog: sequence,id
alerts: -severity,-createdAt,-id
```

Changing the default sort is a compatibility change and must follow Chapter 21G.

---

## 22. Sorting by Derived Values

Sorting by derived or projected values is allowed only when:

- the value has clear semantics;
- query performance is bounded;
- projection freshness is documented;
- ties are deterministic;
- authorization does not leak hidden data.

Examples include mastery score, urgency, or recommended sequence.

---

## 23. Authorization and Collection Stability

Authorization is applied before pagination results are finalized.

The system must not:

- page through unauthorized rows and return sparse pages as a side effect;
- expose hidden-resource counts;
- reveal existence through cursor behavior;
- reuse a cursor across actor or tenant scope.

A user losing access between page requests may receive fewer results or an authorization failure according to the endpoint contract.

---

## 24. Mutable Data During Pagination

Cursor pagination provides continuation, not necessarily a database snapshot.

Each endpoint must choose one model:

### 24.1 Live continuation

New and changed items may appear according to the ordering, while already traversed positions are not revisited.

### 24.2 Snapshot continuation

All pages represent a stable snapshot identified by the cursor or query token.

Snapshot continuation is stronger but more expensive. It should be reserved for exports, formal reports, and workflows requiring exact completeness.

---

## 25. Projection Consistency

Collection responses may come from read projections.

The response may expose freshness metadata when useful:

```json
{
  "meta": {
    "projectedAt": "2026-07-21T08:10:00Z",
    "consistency": "EVENTUAL"
  }
}
```

Clients must not infer command completion solely from immediate collection membership when the query is eventually consistent.

---

## 26. Includes and Expansion

Related data expansion must be allowlisted and bounded:

```http
GET /api/v1/practice-sessions?include=skill,learnerSummary
```

Rules:

- expansion never bypasses authorization;
- nested expansion depth is limited;
- pagination applies to the primary collection;
- expanded data has clear freshness semantics;
- unsupported includes are rejected.

Avoid unrestricted graph traversal.

---

## 27. Field Selection

Sparse fieldsets may be supported for large read models:

```text
fields=id,status,startedAt
```

Field selection must not:

- change business meaning;
- omit mandatory identity or paging fields required by the contract;
- expose fields normally hidden by authorization;
- create unbounded query compilation complexity.

---

## 28. Query Cost Controls

The server must bound query cost through:

- maximum page size;
- allowlisted filters and sorts;
- index-aware query design;
- maximum date range where appropriate;
- search length limits;
- expansion limits;
- rate limits;
- execution timeout;
- asynchronous export for expensive requests.

A valid syntax does not guarantee an acceptable query cost.

---

## 29. Invalid Query Contract

Invalid collection parameters return the standard error envelope.

Example details:

```json
{
  "error": {
    "code": "INVALID_QUERY",
    "details": [
      {
        "field": "sort",
        "reason": "UNSUPPORTED_FIELD",
        "value": "internalScore"
      }
    ]
  }
}
```

The server must not silently ignore malformed filters, unknown sort fields, or invalid cursors.

---

## 30. Caching

Cache identity must include all representation-affecting dimensions:

- actor or visibility scope;
- tenant;
- normalized filters;
- sort;
- cursor;
- page size;
- includes;
- field selection;
- API version.

Private collection responses must not be stored in shared caches without correct partitioning and cache-control policy.

---

## 31. Observability

Collection-query telemetry should record safe normalized metadata:

- endpoint;
- page size;
- filter names, not sensitive values;
- sort fields;
- cursor validity outcome;
- query duration;
- rows scanned and returned where available;
- count strategy;
- timeout or cost rejection.

Do not log raw search text or sensitive identifiers unless specifically governed.

---

## 32. Testing Obligations

Tests must cover:

- deterministic ties;
- next-page continuity;
- inserts and deletes between pages;
- filter/cursor mismatch;
- invalid and tampered cursors;
- maximum page size;
- multi-value filter semantics;
- inclusive and exclusive time boundaries;
- unsupported sort fields;
- authorization filtering;
- projection delay behavior;
- backwards and forwards navigation where supported;
- snapshot completeness where promised.

Property-based tests are encouraged for cursor ordering and duplicate/skip prevention.

---

## 33. Endpoint Checklist

Before publishing a list endpoint, confirm:

- [ ] scope and visibility are explicit;
- [ ] pagination model is chosen;
- [ ] ordering is total and deterministic;
- [ ] cursor is opaque and integrity-protected;
- [ ] filters are allowlisted and documented;
- [ ] multi-value semantics are defined;
- [ ] sort fields and default sort are stable;
- [ ] page limits are bounded;
- [ ] count semantics are explicit;
- [ ] concurrency behavior is documented;
- [ ] authorization is applied before result construction;
- [ ] tests prove no avoidable duplicates or gaps.

---

## 34. Completion Standard

Pagination, filtering, and sorting design is complete when every collection endpoint can be queried predictably, navigated deterministically, protected from unauthorized disclosure, and evolved without changing hidden database details into public contract.