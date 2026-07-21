# 21B — Resource and URI Design

## 1. Purpose

This document defines how Math Learning World exposes application capabilities as stable HTTP resources and URIs.

It governs:

- resource identification;
- route naming;
- hierarchy and scope;
- HTTP methods;
- lifecycle actions;
- collection routes;
- tenant-aware addressing;
- identifiers;
- canonical representations;
- route evolution;
- prohibited URI patterns.

---

## 2. Core Principle

> URIs identify resources and stable application concepts; they do not reveal database structure, framework structure, or internal implementation details.

A resource is a client-relevant concept with identity, state, representation, or operation lifecycle.

Not every domain entity must be public, and not every public resource must map one-to-one to a domain aggregate.

---

## 3. API Base Path

The initial public API base path is:

```text
/api/v1
```

Examples:

```text
GET  /api/v1/skills
GET  /api/v1/skills/{skillId}
POST /api/v1/learners/{learnerId}/practice-sessions
```

Rules:

- the version appears once at the API boundary;
- internal service or framework names do not appear in public paths;
- route groups remain meaningful without knowledge of implementation modules;
- versioning policy follows Chapter 21G.

---

## 4. Naming Convention

URI path segments use:

- lowercase letters;
- kebab-case for multiword terms;
- plural nouns for collections;
- opaque identifiers for instances.

Preferred:

```text
/learning-paths
/practice-sessions
/mastery-assessments
```

Avoid:

```text
/getSkills
/practice_session
/SkillController
/database/skillRows
```

JSON field names use `camelCase`, independently from URI segment style.

---

## 5. Resource Categories

The API may expose several resource categories.

### 5.1 Reference resources

Stable or slowly changing learning definitions:

```text
subjects
skills
curricula
grade-levels
skill-dependencies
```

### 5.2 Actor-owned resources

Resources scoped to a learner, parent, mentor, teacher, or account:

```text
learner profiles
learning goals
practice sessions
skill progress
mentorship relationships
```

### 5.3 Operational resources

Resources representing an initiated workflow or durable operation:

```text
assessment attempts
content-generation operations
report-export operations
credit transactions
```

### 5.4 Projection resources

Read-oriented views composed for client needs:

```text
learner dashboards
readiness summaries
progress timelines
weakness reports
```

Projection resources are public contracts even when they are not domain aggregates.

---

## 6. Collection and Instance Routes

A collection route identifies a set:

```text
GET /api/v1/skills
```

An instance route identifies one resource:

```text
GET /api/v1/skills/{skillId}
```

Creation normally targets the collection:

```text
POST /api/v1/learners/{learnerId}/practice-sessions
```

The response identifies the created resource through its representation and, where useful, a `Location` header.

---

## 7. Hierarchy and Nesting

Nesting communicates a real ownership, containment, or access context.

Good examples:

```text
/learners/{learnerId}/practice-sessions
/learners/{learnerId}/skill-progress
/classes/{classId}/learners
```

Avoid deep paths such as:

```text
/accounts/{accountId}/families/{familyId}/learners/{learnerId}/subjects/{subjectId}/skills/{skillId}/attempts/{attemptId}
```

Rules:

1. Prefer at most two resource relationships after the API base.
2. Use nesting when the parent context is required to identify or authorize the child collection.
3. Use a top-level instance route when the child has globally unique opaque identity and independent lifecycle.
4. Do not repeat every internal ownership level in the URI.
5. Authorization must not rely on URI nesting alone.

Example:

```text
POST /api/v1/learners/{learnerId}/practice-sessions
GET  /api/v1/practice-sessions/{sessionId}
```

The first route expresses creation context; the second uses the resource's own identity.

---

## 8. Tenant and Account Scope

Tenant or account identity should normally come from authenticated context, not from every URI.

Preferred:

```text
GET /api/v1/learners
```

with tenant scope resolved from the authenticated principal.

Explicit tenant segments may be used when the client legitimately operates across multiple tenant contexts:

```text
GET /api/v1/workspaces/{workspaceId}/learners
```

Rules:

- explicit scope identifiers must be authorized against the principal;
- a body field must not override authenticated scope;
- cross-tenant administrative APIs require separate policy and visibility;
- tenant identifiers remain opaque.

---

## 9. Identifier Policy

Public identifiers are opaque strings.

Clients must not infer:

- creation order;
- database table;
- tenant identity;
- resource type unless explicitly encoded by contract;
- shard or region;
- internal numeric sequence.

Recommended representation:

```json
{
  "skillId": "skl_01JXYZ..."
}
```

Typed prefixes may improve debugging and prevent accidental identifier mixing, but the entire identifier remains opaque.

Database primary keys are not automatically public identifiers.

---

## 10. HTTP Method Mapping

### 10.1 GET

Use for safe reads:

```text
GET /skills/{skillId}
GET /learners/{learnerId}/skill-progress
```

A `GET` request must not perform business-state mutation.

### 10.2 POST

Use for:

- creating subordinate resources;
- initiating commands with server-assigned identity;
- invoking operations that do not fit replacement semantics.

```text
POST /learners/{learnerId}/practice-sessions
POST /assessment-attempts/{attemptId}/submissions
```

### 10.3 PUT

Use only for complete replacement or client-chosen identity where repeated identical requests have replacement semantics.

Do not use `PUT` merely because an update is idempotent.

### 10.4 PATCH

Use for documented partial updates.

A patch document must have explicit semantics. Arbitrary object merge behavior is prohibited for business resources.

### 10.5 DELETE

Use to request resource removal or a lifecycle outcome whose public meaning is deletion.

If the domain meaning is archive, revoke, close, cancel, or withdraw, model that meaning explicitly instead of falsely calling it deletion.

---

## 11. Lifecycle Commands

Some commands represent domain transitions rather than CRUD updates.

Preferred patterns include subordinate command resources or explicit action endpoints:

```text
POST /practice-sessions/{sessionId}/completion
POST /assessment-attempts/{attemptId}/submission
POST /mentorship-invitations/{invitationId}/acceptance
```

The noun form is preferred because the request creates or records a meaningful transition resource.

An explicit verb-style action may be accepted when noun modeling is unnatural and the operation is stable:

```text
POST /report-exports/{exportId}:cancel
```

Colon actions are exceptions, not the default.

Avoid generic routes:

```text
POST /execute
POST /process
POST /doAction
```

---

## 12. Command Resource Identity

A durable or asynchronous command should often create an operation resource.

Example:

```text
POST /api/v1/report-exports
202 Accepted
Location: /api/v1/report-exports/{exportId}
```

The operation resource may expose:

```json
{
  "exportId": "exp_123",
  "status": "PROCESSING",
  "requestedAt": "2026-07-21T08:30:00.000Z",
  "completedAt": null,
  "result": null,
  "failure": null
}
```

This allows clients to recover from disconnects and observe long-running work.

---

## 13. Canonical Resource Representation

Each public resource should have one canonical instance representation per supported version.

Specialized projections may use separate routes rather than adding context-dependent fields to the canonical shape.

Example:

```text
GET /learners/{learnerId}
GET /learners/{learnerId}/dashboard
GET /learners/{learnerId}/readiness-summary
```

A resource representation should not change shape based on hidden server state or caller type without an explicit contract.

Field-level authorization may omit or redact documented fields, but the behavior must be deliberate.

---

## 14. Relationship Representation

Relationships may be represented by identifiers and optional links.

Example:

```json
{
  "skillId": "skl_123",
  "subjectId": "sub_math",
  "prerequisiteSkillIds": ["skl_100", "skl_110"]
}
```

Do not embed unbounded related collections inside an instance response.

Use dedicated collection routes for large or independently paginated relationships.

---

## 15. URI versus Query Parameters

Use path parameters for resource identity and required containment context.

Use query parameters for optional read modifiers:

- filtering;
- sorting;
- pagination;
- field selection when supported;
- expansion when carefully bounded;
- locale or representation preferences when headers are not suitable.

Example:

```text
GET /api/v1/skills?subjectId=sub_math&gradeLevel=7&limit=50
```

Do not place command payloads or sensitive data in query strings.

---

## 16. Filtering Route Design

Filtering stays on the canonical collection when it returns the same resource type.

Preferred:

```text
GET /skills?subjectId=sub_math
```

Avoid route proliferation:

```text
GET /skills/by-subject/{subjectId}
GET /getSkillsForGrade/{grade}
```

Create a dedicated projection route when the result has distinct meaning, shape, or authorization:

```text
GET /learners/{learnerId}/recommended-skills
```

This is not merely filtered `skills`; it is an application projection.

---

## 17. Current Actor Routes

Convenience routes such as `/me` may be used for the authenticated actor's own profile:

```text
GET /api/v1/me
GET /api/v1/me/notifications
```

Rules:

- `/me` resolves from authentication context;
- it must not accept an actor identifier override;
- shared operations should still use canonical resource identifiers when needed;
- `/me` is not a substitute for tenant or learner context when the actor manages multiple learners.

---

## 18. Bulk Operations

Bulk endpoints require explicit contract design.

Example:

```text
POST /api/v1/skill-progress/batch-updates
```

A bulk request must define:

- maximum item count;
- atomic versus partial-success behavior;
- item-level identity;
- idempotency behavior;
- ordering guarantees;
- item-level error shape;
- transaction boundaries;
- retry behavior.

Do not infer all-or-nothing behavior from the word `batch`.

---

## 19. Import and Export Resources

Imports and exports are modeled as operation resources.

```text
POST /curriculum-imports
GET  /curriculum-imports/{importId}
POST /progress-report-exports
GET  /progress-report-exports/{exportId}
```

File transfer details remain behind signed object-storage access or controlled upload/download routes defined by Chapter 20G.

The API must not expose raw storage bucket paths or provider credentials.

---

## 20. Soft Deletion and Archival

Persistence implementation does not dictate public URI behavior.

If a resource is archived:

```text
POST /resources/{resourceId}/archival
```

may be more accurate than:

```text
DELETE /resources/{resourceId}
```

Use `DELETE` only when deletion is the client-visible contract.

Archived resources may remain queryable through explicit filters or administrative projections according to authorization policy.

---

## 21. Route Ownership

Each application module owns its API routes and DTOs.

Illustrative structure:

```text
src/modules/skills/api/
  skill-routes.js
  skill-command-handlers.js
  skill-query-handlers.js
  skill-request-schemas.js
  skill-response-mappers.js
```

Cross-module API primitives may be shared only when they are transport-neutral and genuinely stable, such as:

- error envelope;
- pagination metadata;
- request-context type;
- identifier parsing primitive;
- common security middleware.

Feature workflow handlers must remain module-owned.

---

## 22. Route Conflicts and Specificity

Static routes must not be accidentally captured by identifier routes.

Example:

```text
GET /skills/recommended
GET /skills/{skillId}
```

The router and identifier validation must ensure `recommended` is not interpreted as a skill identifier.

Prefer structurally distinct projection routes when ambiguity is likely:

```text
GET /learners/{learnerId}/recommended-skills
```

---

## 23. URI Stability

Once published, a URI is part of the compatibility contract.

Within a supported version:

- do not rename path segments;
- do not move a resource to a different hierarchy without compatibility support;
- do not change identifier interpretation;
- do not change a safe route into a state-changing route;
- do not repurpose an existing route for a new resource meaning.

Aliases may support migration temporarily, but one canonical URI must be documented.

---

## 24. Prohibited Patterns

The following are prohibited:

1. Routes named after controllers, tables, or ORM models.
2. Verbs such as `/get`, `/create`, `/update`, or `/delete` as routine path prefixes.
3. Deep nesting that mirrors persistence relationships.
4. Client-controlled tenant identity without authorization resolution.
5. Sequential database IDs exposed by default.
6. Hidden business mutation through `GET`.
7. Generic `/action`, `/execute`, or `/process` routes without stable meaning.
8. Unbounded embedded collections.
9. Multiple inconsistent URIs for the same canonical resource.
10. Query strings containing secrets or large command payloads.
11. Route behavior that depends on undocumented headers.
12. CRUD semantics that misrepresent domain lifecycle meaning.

---

## 25. Decision Checklist

Before adding a route, confirm:

```text
[ ] Is the public resource or operation meaning clear?
[ ] Is it owned by an application capability?
[ ] Is the URI independent from database and framework structure?
[ ] Is the method semantically correct?
[ ] Is nesting necessary and shallow?
[ ] Is identity opaque and stable?
[ ] Is tenant scope trusted and authorized?
[ ] Is the response canonical or explicitly a projection?
[ ] Are collection controls bounded?
[ ] Is lifecycle meaning represented accurately?
[ ] Is compatibility impact understood?
[ ] Can the route be contract-tested independently?
```

---

## 26. Decision Summary

Math Learning World resource and URI design is:

- noun-oriented;
- application-driven;
- shallow in hierarchy;
- opaque in identity;
- explicit about lifecycle;
- tenant-safe;
- projection-aware;
- independent from persistence structure;
- stable within an API version;
- governed as a public contract.

The URI surface should make client intent understandable while keeping internal models free to evolve behind the API boundary.
