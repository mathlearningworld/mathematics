# 21A — API Philosophy and Boundary

## 1. Purpose

This document defines the architectural contract for the HTTP API boundary in Math Learning World.

The API exposes application capabilities to trusted and untrusted clients without transferring business authority to transport code.

It is the Source of Truth for:

- API responsibilities;
- dependency direction;
- transport-to-application mapping;
- request and response boundaries;
- protocol semantics;
- security context propagation;
- failure translation;
- observability expectations;
- compatibility obligations;
- prohibited coupling.

---

## 2. Core Principle

> The API translates protocol-level input into application intent and translates application outcomes into protocol-level responses; it does not own business meaning.

The API may know about HTTP, headers, cookies, status codes, media types, serialization, routing, authentication credentials, rate limits, and request metadata.

The Domain and Application layers must not depend on Express request or response objects, HTTP status codes, route paths, cookies, or transport-specific middleware.

---

## 3. Position in the Architecture

```text
Client
  ↓
API / Presentation Boundary
  ↓
Application
  ↓
Domain

Infrastructure ──implements──> application and domain ports
Composition Root ──wires──> routes, handlers, use cases, and adapters
```

Dependency arrows point inward:

- API may import Application contracts and stable shared primitives.
- API may map Domain-derived identifiers and values through Application contracts.
- Application must not import API handlers, request DTOs, response DTOs, or Express types.
- Domain must not know that an HTTP API exists.
- Infrastructure must not call route handlers to execute use cases.

---

## 4. API Responsibilities

The API owns:

1. Route registration.
2. Protocol parsing.
3. Request size and media-type enforcement.
4. Authentication credential extraction.
5. Security-context construction.
6. Transport-level validation.
7. Mapping request DTOs to commands or queries.
8. Invoking exactly one primary application entry point per operation.
9. Mapping application results to response DTOs.
10. Mapping stable failures to HTTP responses.
11. Correlation and request metadata propagation.
12. Rate-limit and abuse-control integration.
13. Response serialization.
14. API-level observability.
15. Compatibility and deprecation signaling.

The API does not own:

- mastery rules;
- curriculum semantics;
- progression decisions;
- aggregate invariants;
- transaction policy meaning;
- repository access;
- direct Prisma queries;
- durable event publication;
- provider SDK workflows;
- feature-specific state machines;
- authorization policy decisions beyond credential and context preparation.

---

## 5. Boundary Shape

Each operation follows this pipeline:

```text
HTTP request
  → route match
  → protocol guards
  → authentication
  → request context
  → DTO parsing
  → transport validation
  → command/query mapping
  → Application execution
  → result/failure mapping
  → HTTP response
```

The pipeline must remain explicit enough that each stage can be tested independently.

A route handler should be thin. It coordinates translation and invocation; it must not become an alternative Application Service.

---

## 6. Public Contract versus Internal Contract

The public API contract includes:

- method;
- path;
- request headers;
- path and query parameters;
- request body schema;
- response status;
- response body schema;
- error schema;
- idempotency behavior;
- pagination behavior;
- authorization requirement;
- compatibility guarantees.

Internal application contracts include:

- command and query types;
- execution context;
- use-case result types;
- application failures;
- ports required by use cases.

Public DTOs and internal application types may resemble one another but are not assumed to be identical.

The API owns explicit mapping between them.

---

## 7. Request Context

Every authenticated or traceable request should produce a stable request context before application execution.

Recommended shape:

```ts
type RequestContext = {
  requestId: string;
  correlationId: string;
  causationId?: string;
  actorId?: string;
  accountId?: string;
  tenantId?: string;
  roles: string[];
  scopes: string[];
  locale?: string;
  clientVersion?: string;
  receivedAt: string;
};
```

Rules:

- The server generates `requestId` when absent or invalid.
- A trusted incoming `correlationId` may be preserved; otherwise the server creates one.
- Tenant identity must come from trusted authentication or resolved membership context, not from an unverified body field.
- Actor identity must not be accepted from client-controlled command payloads.
- Application execution receives identity through execution context, not duplicated mutable DTO fields.

---

## 8. Authentication and Authorization Boundary

Authentication answers:

```text
Who or what presented this request?
```

Authorization answers:

```text
May this actor perform this application intent in this context?
```

The API may:

- parse bearer tokens or session cookies;
- verify credential format and cryptographic validity through an authentication adapter;
- reject missing, expired, malformed, or unsupported credentials;
- construct an authenticated principal;
- resolve route-level requirements.

The Application layer owns use-case authorization decisions that depend on business state, ownership, role, membership, learner relationship, or workflow status.

A route being authenticated does not prove that the operation is authorized.

---

## 9. Validation Boundary

Validation is layered.

### 9.1 Protocol validation

Owned by API:

- malformed JSON;
- unsupported media type;
- missing required header;
- invalid path parameter shape;
- invalid query syntax;
- body too large;
- unsupported encoding.

### 9.2 DTO validation

Owned by API contract:

- required fields;
- string, number, boolean, array, or object shape;
- allowed enum representation;
- length and basic range constraints;
- unknown-field policy;
- mutually exclusive transport fields.

### 9.3 Application validation

Owned by Application:

- command consistency;
- referenced resource accessibility;
- expected version requirements;
- workflow preconditions;
- actor and tenant consistency.

### 9.4 Domain validation

Owned by Domain:

- invariants;
- valid state transitions;
- value-object construction;
- business policy.

The API must not duplicate domain rules merely to produce an earlier error.

---

## 10. DTO Policy

Public request and response DTOs are transport contracts.

They must:

- use stable, explicit field names;
- avoid exposing persistence rows;
- avoid exposing ORM-generated types;
- avoid leaking internal class structures;
- serialize dates as ISO 8601 strings in UTC;
- represent identifiers as opaque strings;
- document nullable versus omitted fields;
- define unknown-field behavior;
- avoid polymorphism without a discriminator;
- remain backward compatible within the supported version.

Response DTOs should describe client-relevant facts, not mirror aggregate internals by default.

---

## 11. Command and Query Separation

The API preserves the Application layer distinction:

```text
Command endpoint → changes state or initiates an operation
Query endpoint   → returns a read model without changing business state
```

A query must not perform hidden business writes.

Operational telemetry, access logs, cache population, and read-model maintenance are not considered business-state mutation.

A command response may return the accepted or completed operation result, but it must not become an unbounded read-model endpoint.

---

## 12. HTTP Semantics

HTTP semantics must be intentional.

General expectations:

- `GET` is safe and must not change business state.
- `HEAD` follows `GET` metadata semantics where supported.
- `POST` creates a subordinate resource or invokes a non-idempotent-by-default command.
- `PUT` replaces a client-addressable resource only when full replacement semantics are real.
- `PATCH` applies a documented partial modification.
- `DELETE` requests removal or lifecycle termination according to the domain contract.

The method must communicate protocol semantics, not merely route implementation convenience.

---

## 13. Response Envelope Policy

Successful responses should prefer direct, typed resource or result payloads.

Example:

```json
{
  "operationId": "op_123",
  "status": "COMPLETED",
  "completedAt": "2026-07-21T08:30:00.000Z"
}
```

A universal success envelope is not required unless it adds stable metadata used by all clients.

Errors use the standard API error contract defined in Chapter 21F.

Collection responses use an explicit collection contract with pagination metadata defined in Chapter 21H.

---

## 14. Status Code Philosophy

Status codes describe protocol-level outcomes; error codes describe stable application meaning.

Typical mapping:

```text
200 OK                  successful synchronous result
201 Created             new addressable resource created
202 Accepted            asynchronous operation accepted
204 No Content          successful result with no representation
400 Bad Request         malformed or contract-invalid request
401 Unauthorized        authentication absent or invalid
403 Forbidden           authenticated but not permitted
404 Not Found           resource intentionally not exposed or absent
409 Conflict            state, version, or idempotency conflict
412 Precondition Failed explicit precondition did not hold
422 Unprocessable Entity valid transport, rejected application intent
429 Too Many Requests   rate limit or abuse protection
500 Internal Server Error unexpected server failure
503 Service Unavailable temporary dependency or service unavailability
```

The same stable application failure should map consistently across routes.

---

## 15. Security Principles

The API must:

- deny by default;
- validate all untrusted input;
- apply strict body-size limits;
- avoid reflecting secrets or raw tokens;
- avoid logging credentials and sensitive learning data;
- normalize and constrain identifiers before use;
- enforce tenant isolation before data exposure;
- use secure cookie attributes when cookie sessions exist;
- define CORS deliberately rather than permissively;
- constrain redirect targets;
- protect state-changing browser flows against CSRF when relevant;
- rate-limit sensitive operations;
- prevent mass-assignment through explicit DTO mapping.

Security-sensitive defaults must be production-safe.

---

## 16. Observability

Every request should produce structured telemetry containing only approved data.

Minimum fields:

```text
requestId
correlationId
method
route template
status code
duration
actor/tenant identifiers when permitted
application operation name
stable failure code when present
```

Do not log:

- passwords;
- access or refresh tokens;
- full authorization headers;
- secret keys;
- payment credentials;
- sensitive learner answers unless explicitly approved and protected;
- raw provider payloads containing personal data.

Route templates must be logged instead of raw high-cardinality paths where possible.

---

## 17. Timeouts and Cancellation

The API boundary must define a request deadline.

Where supported, cancellation propagates inward through an application execution signal or deadline abstraction.

Cancellation must not falsely imply that a committed transaction was rolled back.

Once durable state has committed, the operation result remains authoritative even if the client disconnected before receiving the response.

Clients use idempotency keys, operation resources, or subsequent queries to recover uncertain outcomes.

---

## 18. Compatibility

The API is a product contract.

Within a supported API version:

- existing fields are not renamed or removed;
- field meaning is not silently changed;
- enum expansion is handled according to the published compatibility policy;
- new optional fields may be added;
- new endpoints may be added;
- stricter validation is treated as potentially breaking;
- status-code changes are treated as contract changes;
- error-code changes are treated as contract changes.

Versioning and deprecation rules are defined in Chapter 21G.

---

## 19. Composition Root

Route registration and dependency wiring occur at the outer composition boundary.

Example:

```text
createHttpServer
  → createAuthenticationMiddleware
  → createRequestContextMiddleware
  → createSkillRoutes
      → createSkillCommandHandlers
      → createSkillQueryHandlers
      → inject Application use cases
```

Handlers receive application entry points through dependency injection.

Handlers must not instantiate repositories, Prisma clients, message brokers, or vendor SDKs.

---

## 20. Prohibited Patterns

The following are prohibited:

1. Business decisions inside Express handlers.
2. Direct Prisma access from routes or controllers.
3. Returning persistence records as public DTOs.
4. Passing `req` or `res` into Application or Domain code.
5. Trusting actor or tenant identifiers from request bodies.
6. Using HTTP status codes as the only stable failure contract.
7. Catching every error and returning `200` with an error flag.
8. Hidden state changes in `GET` routes.
9. Provider SDK types in public API contracts.
10. Route-specific copies of the same authorization policy.
11. Silent coercion that changes client intent.
12. Logging secrets or sensitive payloads.
13. Unbounded collection responses.
14. Breaking contract changes without version or migration policy.
15. Framework decorators or middleware metadata becoming domain authority.

---

## 21. Testing Obligations

The API boundary requires:

- route contract tests;
- request parsing tests;
- authentication tests;
- authorization-context propagation tests;
- DTO validation tests;
- application invocation tests;
- success mapping tests;
- failure mapping tests;
- security-header tests;
- body-size and malformed-input tests;
- compatibility snapshot or schema tests;
- end-to-end tests for critical operations.

Chapter 21J defines the complete API verification model.

---

## 22. Decision Summary

The Math Learning World API is:

- a transport boundary;
- an explicit translator;
- application-driven;
- domain-neutral;
- secure by default;
- tenant-aware;
- observable;
- compatibility-governed;
- thin in business logic;
- independently testable.

The API exists to expose stable application capabilities without allowing HTTP, Express, persistence, or vendor concerns to redefine the system's business architecture.
