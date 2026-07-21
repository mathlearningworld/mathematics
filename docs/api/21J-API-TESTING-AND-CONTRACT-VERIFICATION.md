# 21J — API Testing and Contract Verification

## 1. Purpose

This document defines the verification system for Math Learning World public APIs.

It governs:

- contract tests;
- schema validation;
- command and query verification;
- authentication and authorization tests;
- error-contract tests;
- compatibility checks;
- event and realtime verification;
- test data and isolation;
- CI gates;
- release evidence.

---

## 2. Core Principle

> An API is complete only when its observable contract is executable, repeatable, and protected against accidental semantic change.

Documentation describes intent. Verification proves that implementation and published behavior still conform to that intent.

---

## 3. Verification Layers

API verification is divided into complementary layers.

### 3.1 Contract definition tests

Validate schemas, examples, stable codes, route inventory, and compatibility rules without requiring a live deployed system.

### 3.2 Handler and mapping tests

Validate protocol parsing, DTO validation, RequestContext construction, application mapping, and response mapping.

### 3.3 Application integration tests

Validate API-to-Application behavior with controlled infrastructure boundaries.

### 3.4 Infrastructure integration tests

Validate database, transaction, outbox, cache, object storage, messaging, and external adapters.

### 3.5 End-to-end operational tests

Validate the deployed flow through HTTP or realtime transport into durable state and back through queries.

No single layer replaces the others.

---

## 4. Contract Source of Truth

Each public endpoint must have one authoritative contract representation, such as:

- OpenAPI document;
- checked-in TypeScript schema with generated OpenAPI;
- JSON Schema;
- explicit event schema registry;
- versioned webhook schema.

Generated artifacts must be reproducible and must not drift from the implementation source.

A schema is not sufficient when semantics such as idempotency, authorization, ordering, consistency, or retryability are not expressible in the schema. These must be verified through behavioral tests.

---

## 5. Route Inventory Verification

CI should verify that:

- every public route is registered intentionally;
- every route has an operation identifier;
- methods and paths are unique;
- deprecated routes are marked;
- internal routes are not accidentally published;
- version prefixes are consistent;
- command and query routes follow Chapters 21B–21D.

Unexpected route growth should fail or require explicit review.

---

## 6. Request Contract Tests

For each endpoint, test:

- minimum valid request;
- fully populated valid request;
- missing required fields;
- unknown fields according to strictness policy;
- wrong primitive types;
- invalid enum values;
- boundary lengths and numeric limits;
- malformed identifiers;
- timestamp format and timezone rules;
- null versus omitted behavior;
- content type and encoding;
- oversized payload rejection.

Validation failures must use the standard error envelope and stable field paths.

---

## 7. Response Contract Tests

Responses must be validated against the published schema for:

- success;
- accepted asynchronous outcome;
- empty result;
- not found;
- validation failure;
- authorization failure;
- domain conflict;
- concurrency conflict;
- rate limit;
- infrastructure failure where externally visible.

Tests should reject undocumented response fields when strict generated snapshots are used deliberately, while compatibility tests should also prove that clients tolerate permitted additive fields.

---

## 8. Golden Examples

Important contracts should have checked-in golden examples.

Examples include:

```text
contracts/examples/commands/complete-practice-session.request.json
contracts/examples/commands/complete-practice-session.response.json
contracts/examples/errors/version-conflict.json
contracts/examples/events/practice-session.completed.v1.json
```

Golden examples must:

- validate against schemas;
- contain no secrets or real personal data;
- use stable deterministic values;
- be reviewed as public contract changes;
- remain synchronized with documentation.

---

## 9. Command API Verification

Every command endpoint must test:

- authenticated RequestContext construction;
- untrusted actor or tenant fields ignored or rejected;
- DTO-to-command mapping;
- successful state transition;
- invalid lifecycle transition;
- expected-version mismatch;
- idempotency replay with same payload;
- idempotency conflict with different payload;
- retry after uncertain client outcome;
- stable command result;
- transaction rollback on failure;
- no event publication before commit.

The same logical command must not create duplicate business effects under retries.

---

## 10. Query API Verification

Every query endpoint must test:

- authorization-scoped visibility;
- empty collection and missing resource behavior;
- projection mapping;
- documented consistency metadata;
- filter semantics;
- deterministic default ordering;
- cursor or offset pagination;
- field omission and null behavior;
- cache partitioning where applicable;
- stale projection behavior after commands.

A successful command followed by an eventually consistent query must be tested according to the promised consistency model rather than assuming immediate visibility.

---

## 11. Pagination Verification

Cursor tests must cover:

- first page;
- middle page;
- final page;
- exact page boundary;
- duplicate sort values;
- deterministic tie-breaker;
- insertion between page requests;
- deletion between page requests;
- tampered cursor;
- expired cursor;
- filter/cursor mismatch;
- actor or tenant mismatch;
- reverse navigation when supported;
- snapshot completeness when promised.

Property-based tests are recommended to prove that traversal does not produce avoidable duplicates or omissions under generated datasets.

---

## 12. Authentication Verification

Authentication tests include:

- valid credentials;
- invalid credentials;
- expired access token;
- revoked session;
- refresh-token rotation;
- reuse of a rotated refresh token;
- logout and session invalidation;
- malformed authentication header;
- token audience and issuer validation;
- signing-key rotation overlap;
- clock skew boundaries;
- account disabled or locked state.

Secrets and raw tokens must never appear in test output or snapshots.

---

## 13. Authorization Verification

Authorization requires matrix-based testing across:

- actor roles;
- tenant memberships;
- learner relationships;
- mentor relationships;
- classroom or organization scope;
- resource lifecycle state;
- ownership and delegation;
- sensitive field visibility.

Minimum negative cases:

- correct role in wrong tenant;
- valid user without resource relationship;
- former member after revocation;
- access through guessed identifiers;
- unauthorized nested include;
- unauthorized count or existence inference;
- realtime subscription outside scope.

Deny behavior must be intentional and consistent with the information-disclosure policy.

---

## 14. Error Contract Verification

For every stable error code, verify:

- HTTP status;
- public code;
- message policy;
- detail shape;
- retryability;
- correlation or request identifier;
- absence of stack traces and secrets;
- localization boundary where relevant.

Tests must ensure that unknown internal exceptions map to a safe generic error rather than leaking implementation details.

Error codes must not be inferred from mutable human-readable messages.

---

## 15. Compatibility Verification

Every contract change must run a compatibility check against the last supported contract baseline.

Checks include:

- removed paths or methods;
- removed or renamed fields;
- required-field additions;
- type and format changes;
- enum changes;
- nullability changes;
- status-code changes;
- stable error-code changes;
- default sorting changes;
- event schema changes;
- webhook signature changes.

Detected breaking changes require explicit authorization and a new major version or managed migration plan.

---

## 16. Previous-Client Tests

Where critical clients exist, CI should execute representative previous-client behavior against the new server contract.

This may include:

- generated SDK from the previous schema;
- mobile client contract fixtures;
- frontend query adapters;
- webhook consumer fixtures;
- teacher-dashboard client fixtures.

The goal is to prove practical compatibility, not only schema compatibility.

---

## 17. Consumer-Driven Contract Tests

Consumer-driven contracts may be used for independently deployed consumers.

Rules:

- provider remains owner of the public contract;
- consumer expectations must not expose private implementation details;
- conflicting consumer expectations require product-level resolution;
- contracts are versioned and attributable;
- obsolete consumers are retired through support policy;
- provider verification runs before release.

Consumer contracts supplement, not replace, the canonical API specification.

---

## 18. Event Contract Verification

Durable event tests include:

- envelope schema;
- event type and version;
- required identity and timestamps;
- publication after commit;
- duplicate delivery;
- out-of-order delivery;
- replay of historical versions;
- upcasting where applicable;
- idempotent consumer handling;
- tenant isolation;
- personal-data minimization;
- dead-letter and replay behavior.

Historical fixtures must remain valid for as long as replay of that event version is supported.

---

## 19. Realtime Verification

Realtime tests include:

- connection authentication;
- subscription authorization;
- token expiry;
- revocation while connected;
- reconnect and resume;
- replay-window expiry;
- gap detection;
- heartbeat timeout;
- slow-client backpressure;
- subscription limit;
- duplicate notification;
- query resynchronization;
- transient signal loss tolerance.

Tests must distinguish durable events from best-effort transient signals.

---

## 20. Webhook Verification

Webhook tests include:

- signature generation and verification;
- timestamp replay window;
- key rotation overlap;
- retryable and permanent status classification;
- exponential backoff;
- duplicate delivery;
- timeout behavior;
- destination disablement;
- manual replay;
- event-version compatibility;
- secret redaction from logs.

A test consumer should acknowledge only after durable acceptance to model realistic semantics.

---

## 21. Rate Limit and Abuse Verification

Tests should prove:

- actor-, tenant-, client-, and IP-scoped policies where applicable;
- limit headers or retry metadata;
- stable `RATE_LIMITED` error contract;
- no bypass through alternate equivalent routes;
- expensive query protection;
- maximum page size;
- upload and payload limits;
- authentication brute-force controls;
- realtime connection and subscription limits.

Rate-limit tests should use deterministic clocks or isolated policy stores.

---

## 22. Test Data Doctrine

Test data must be:

- synthetic;
- deterministic where possible;
- isolated per test or suite;
- minimal but semantically meaningful;
- free of real learner data;
- explicit about tenant and actor relationships;
- cleaned or transactionally rolled back.

Factories should express domain meaning:

```ts
createLearner({ tenantId, guardianId })
createPracticeSession({ learnerId, status: 'ACTIVE' })
```

Avoid anonymous fixture blobs that hide required relationships.

---

## 23. Clock and Identity Control

Tests must control:

- current time;
- generated identifiers;
- token expiry;
- retry backoff;
- projection delay;
- event timestamps;
- idempotency retention windows.

Production code should receive clock and identifier providers through explicit boundaries where deterministic testing requires them.

---

## 24. External Dependency Testing

External providers are verified through layers:

- pure adapter mapping tests;
- provider contract sandbox tests;
- failure and timeout simulations;
- retry and circuit-breaker tests;
- limited scheduled live probes where permitted.

Normal CI must not depend on unstable public networks unless explicitly designed as a separate non-blocking gate.

---

## 25. Security Testing

API security verification includes:

- broken object-level authorization;
- broken function-level authorization;
- mass assignment;
- injection attempts;
- malformed JSON and content types;
- path traversal for file surfaces;
- upload content validation;
- token confusion;
- CORS policy;
- cache leakage;
- sensitive-data logging;
- cross-tenant access;
- replay attacks;
- denial-of-service boundaries.

Security tests should focus on business authorization as strongly as transport-level vulnerabilities.

---

## 26. Performance Contract Tests

Where latency or capacity is part of product readiness, tests should establish budgets for:

- common query p50/p95/p99;
- command acceptance latency;
- maximum collection size;
- deep cursor traversal;
- event publication delay;
- realtime fan-out;
- webhook queue lag;
- concurrent sessions;
- upload size and processing time.

Performance thresholds must run in a controlled environment and should not be confused with developer-machine timing.

---

## 27. Resilience Verification

Failure-injection scenarios include:

- database timeout;
- transaction conflict;
- cache unavailable;
- message broker unavailable;
- object storage failure;
- external provider timeout;
- process restart after commit but before response;
- duplicate message delivery;
- projection worker delay;
- partial network disconnect.

Tests verify stable external outcomes, safe retries, and absence of duplicate business effects.

---

## 28. Snapshot Testing Policy

Snapshots are appropriate for:

- stable schema artifacts;
- route inventories;
- canonical examples;
- normalized error shapes;
- generated documentation.

Snapshots must not replace semantic assertions.

Large snapshots require focused review. Volatile timestamps, IDs, and ordering must be normalized rather than blindly updated.

---

## 29. Test Pyramid and Ownership

Recommended ownership:

- API module owns route, DTO, and mapping tests;
- Application module owns use-case behavior;
- Domain module owns invariants and transitions;
- Infrastructure module owns adapter integration;
- cross-module verification owns end-to-end public flows;
- contract governance owns compatibility baselines.

Tests should live close to the authority they verify while shared public contract fixtures remain centrally discoverable.

---

## 30. CI Gates

A merge-ready API change should pass applicable gates:

```text
1. formatting and lint
2. type checking
3. schema validation
4. route inventory verification
5. unit and mapping tests
6. application integration tests
7. database and adapter integration tests
8. contract compatibility diff
9. security-focused tests
10. generated artifact drift check
```

Operational end-to-end and performance gates may run in a dedicated environment after repository verification.

---

## 31. Repository, Runtime, and Operational Evidence

Verification evidence must state its authority level.

### Repository evidence

- files and exports exist;
- schemas and tests are wired;
- static contract checks pass;
- compatibility diff passes.

### Runtime evidence

- dependencies install;
- server starts;
- migrations and adapters execute;
- integration tests pass.

### Operational evidence

- deployed client-to-API-to-persistence-to-query flow succeeds;
- authorization and tenant isolation work in the running system;
- realtime or webhook delivery succeeds where applicable.

Repository PASS must not be reported as Operational PASS.

---

## 32. Release Evidence Package

A release affecting public APIs should record:

- contract files changed;
- compatibility classification;
- new and deprecated routes;
- new and changed stable error codes;
- migration notes;
- test suites executed;
- CI result identifiers;
- known deferred runtime or operational checks;
- rollback plan;
- support-window impact.

Evidence should be concise, reproducible, and linked to the exact commit.

---

## 33. Flaky Test Policy

A flaky contract or integration test is a product risk.

Required response:

- record the failure;
- identify nondeterministic dependency;
- quarantine only with owner and expiry;
- preserve a blocking replacement check where possible;
- fix rather than normalize repeated reruns;
- never claim complete verification from a lucky pass.

Retries may diagnose instability but must not hide it.

---

## 34. Test Review Checklist

Before accepting an API slice, confirm:

- [ ] canonical contract exists;
- [ ] valid and invalid requests are tested;
- [ ] all documented response families are tested;
- [ ] command retries cannot duplicate effects;
- [ ] query ordering and pagination are deterministic;
- [ ] authentication and authorization matrices include negative cases;
- [ ] stable error codes are asserted;
- [ ] compatibility baseline passes;
- [ ] event duplicates and gaps are tested where applicable;
- [ ] secrets and personal data are absent from fixtures and logs;
- [ ] evidence authority is labeled Repository, Runtime, or Operational;
- [ ] deferred verification is stated explicitly.

---

## 35. Completion Standard

API testing and contract verification is complete when every supported public behavior has executable evidence at the correct authority level, compatibility changes are detected before release, and failures can be reproduced without relying on undocumented manual knowledge.