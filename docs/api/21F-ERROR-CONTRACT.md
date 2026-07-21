# 21F — Error Contract

## 1. Purpose

This document defines the stable public error contract for Math Learning World APIs.

It governs:

- error envelope shape;
- machine-readable error codes;
- HTTP status mapping;
- validation errors;
- authentication and authorization failures;
- domain and application conflicts;
- infrastructure failure translation;
- retryability and uncertain outcomes;
- correlation and observability;
- localization boundaries;
- security and privacy;
- contract verification.

---

## 2. Core Principle

> Public API errors communicate stable client-relevant meaning without exposing internal implementation details.

An API error is a contract.

It is not a serialized exception, stack trace, ORM error, provider response, or database message.

---

## 3. Error Flow

All failures follow this translation path:

```text
protocol failure
or
Application/Domain failure
or
Infrastructure failure
  → stable internal failure classification
  → public API error mapping
  → HTTP status and headers
  → ErrorResponse body
  → structured telemetry
```

Each layer preserves meaning while hiding implementation detail.

---

## 4. Canonical Error Envelope

The canonical response shape is:

```ts
type ErrorResponse = {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: ErrorDetail[];
    retryable?: boolean;
    retryAfterSeconds?: number;
    operationId?: string;
  };
};
```

Example:

```json
{
  "error": {
    "code": "PRACTICE_SESSION_ALREADY_COMPLETED",
    "message": "The practice session has already been completed.",
    "requestId": "req_01J...",
    "retryable": false
  }
}
```

The envelope is consistent across all API endpoints.

---

## 5. Required Fields

### 5.1 `code`

A stable machine-readable identifier.

Requirements:

- uppercase snake case;
- stable across message wording changes;
- specific enough for client behavior;
- independent of HTTP reason phrase;
- never derived dynamically from raw exception text.

### 5.2 `message`

A safe human-readable summary.

Requirements:

- understandable without stack traces;
- no secrets or internal topology;
- not the primary key for client logic;
- localizable at presentation boundaries when needed.

### 5.3 `requestId`

A server-recognized identifier used for support and tracing.

It must also be available in structured logs.

Clients may display or report it, but must not infer business meaning from it.

---

## 6. Optional Fields

### 6.1 `details`

Structured information needed to correct or interpret the request.

### 6.2 `retryable`

Indicates whether the same logical operation may succeed later without semantic correction.

It is guidance, not a guarantee.

### 6.3 `retryAfterSeconds`

A lower-bound retry delay when the server can provide meaningful guidance.

The HTTP `Retry-After` header remains authoritative where applicable.

### 6.4 `operationId`

Identifies an accepted or uncertain asynchronous operation that can be queried safely.

It must not be used to expose internal job identifiers without a public operation contract.

---

## 7. Error Detail Contract

Recommended detail shape:

```ts
type ErrorDetail = {
  code: string;
  field?: string;
  path?: string;
  message?: string;
  rejectedValue?: unknown;
  meta?: Record<string, string | number | boolean | null>;
};
```

Public detail fields must be allowlisted.

Do not include arbitrary exception objects in `meta`.

---

## 8. Validation Errors

Validation errors use one top-level code with structured field details.

Example:

```json
{
  "error": {
    "code": "REQUEST_VALIDATION_FAILED",
    "message": "The request contains invalid values.",
    "requestId": "req_01J...",
    "retryable": false,
    "details": [
      {
        "code": "REQUIRED",
        "path": "body.skillId",
        "message": "skillId is required."
      },
      {
        "code": "OUT_OF_RANGE",
        "path": "body.durationSeconds",
        "message": "durationSeconds must be between 1 and 7200."
      }
    ]
  }
}
```

Validation detail paths may use a stable notation such as:

```text
body.fieldName
query.limit
path.learnerId
header.Idempotency-Key
```

The notation must be consistent.

---

## 9. Rejected Values

Rejected values are omitted by default.

They may be returned only when safe and useful.

Never echo:

- passwords;
- tokens;
- secrets;
- full authorization headers;
- private learner data;
- large request bodies;
- malicious markup without safe encoding;
- binary payloads.

For sensitive fields, include only the field path and reason.

---

## 10. Error Taxonomy

Public errors fall into these categories:

```text
PROTOCOL
VALIDATION
AUTHENTICATION
AUTHORIZATION
NOT_FOUND
CONFLICT
DOMAIN_RULE
RATE_LIMIT
DEPENDENCY
AVAILABILITY
INTERNAL
ASYNC_OPERATION
```

The taxonomy guides mapping and observability.

It does not need to appear as a public field when the stable `code` already communicates enough meaning.

---

## 11. Protocol Errors

Protocol errors occur before use-case execution.

Examples:

```text
MALFORMED_JSON
UNSUPPORTED_MEDIA_TYPE
REQUEST_BODY_TOO_LARGE
METHOD_NOT_ALLOWED
NOT_ACCEPTABLE
MISSING_REQUIRED_HEADER
INVALID_HEADER_VALUE
INVALID_PATH_PARAMETER
```

Typical status mapping:

```text
400 Bad Request
405 Method Not Allowed
406 Not Acceptable
413 Content Too Large
415 Unsupported Media Type
```

Use required standard headers such as `Allow` when applicable.

---

## 12. Validation Status Policy

The API must adopt one clear validation status policy.

Recommended baseline:

```text
400 Bad Request
```

for malformed syntax, invalid query parameters, and request DTO validation failures.

`422 Unprocessable Content` may be used only if the repository explicitly distinguishes syntactically valid but semantically invalid transport input across all endpoints.

Do not mix `400` and `422` based on individual handler preference.

---

## 13. Authentication Errors

Representative codes:

```text
AUTHENTICATION_REQUIRED
INVALID_ACCESS_TOKEN
ACCESS_TOKEN_EXPIRED
SESSION_REVOKED
INVALID_REFRESH_TOKEN
REFRESH_TOKEN_REUSED
STEP_UP_AUTHENTICATION_REQUIRED
```

Typical status:

```text
401 Unauthorized
```

Some step-up or policy failures may use `403 Forbidden` when the identity is valid but authentication assurance is insufficient. The choice must be consistent.

Do not reveal token signature algorithms, key identifiers, or validation internals in public messages.

---

## 14. Authorization Errors

Representative codes:

```text
RESOURCE_ACCESS_FORBIDDEN
TENANT_ACCESS_FORBIDDEN
RELATIONSHIP_REQUIRED
ACTION_NOT_PERMITTED
SERVICE_IDENTITY_REQUIRED
```

Typical status:

```text
403 Forbidden
```

Use `404 Not Found` instead when the resource family intentionally conceals existence.

The public response should not reveal the exact missing role, internal permission graph, or protected relationship unless product policy explicitly permits it.

---

## 15. Not-Found Errors

Representative codes:

```text
RESOURCE_NOT_FOUND
LEARNER_NOT_FOUND
SKILL_NOT_FOUND
PRACTICE_SESSION_NOT_FOUND
OPERATION_NOT_FOUND
ROUTE_NOT_FOUND
```

Typical status:

```text
404 Not Found
```

A public-specific code is useful when clients have legitimate resource-specific behavior.

A generic code is preferable when specificity would disclose protected information.

---

## 16. Conflict Errors

Conflict means the request is understood but cannot be applied because current state or identity conflicts with it.

Examples:

```text
VERSION_CONFLICT
IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST
RESOURCE_ALREADY_EXISTS
PRACTICE_SESSION_ALREADY_COMPLETED
INVITATION_ALREADY_ACCEPTED
OPERATION_STATE_CONFLICT
```

Typical status:

```text
409 Conflict
```

The error may include safe conflict metadata:

```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "The resource has changed since it was loaded.",
    "requestId": "req_01J...",
    "retryable": false,
    "details": [
      {
        "code": "EXPECTED_VERSION_MISMATCH",
        "meta": {
          "expectedVersion": 4,
          "currentVersion": 5
        }
      }
    ]
  }
}
```

Current version may be omitted when disclosure is unsafe.

---

## 17. Domain Rule Failures

A domain rule failure communicates that the requested business transition is not allowed.

Examples:

```text
SKILL_PREREQUISITES_NOT_MET
ASSESSMENT_ALREADY_SUBMITTED
MENTORSHIP_RELATIONSHIP_INACTIVE
INSUFFICIENT_CREDIT_BALANCE
LEARNER_NOT_ELIGIBLE_FOR_PATHWAY
```

Status mapping depends on established policy:

- `409 Conflict` when current resource state blocks the transition;
- `400 Bad Request` when the request violates a stable business precondition;
- `403 Forbidden` when the failure is fundamentally permission-related.

The mapping must be consistent by failure family.

Do not map every domain failure to `500`.

---

## 18. Optimistic Concurrency

Version mismatches return a stable conflict error.

Example:

```text
409 Conflict
VERSION_CONFLICT
```

Clients should normally:

1. retrieve current state;
2. reconcile user intent;
3. submit a new command with the current expected version.

Blind automatic retry with a new version is prohibited unless the command semantics explicitly permit it.

---

## 19. Idempotency Errors

Representative codes:

```text
IDEMPOTENCY_KEY_REQUIRED
INVALID_IDEMPOTENCY_KEY
IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST
IDEMPOTENCY_RECORD_UNAVAILABLE
```

Mappings:

```text
400 Bad Request   missing or malformed required key
409 Conflict      same key with different semantic request
503 Service Unavailable idempotency authority unavailable when safe execution cannot be guaranteed
```

If the server cannot confirm whether a non-idempotent operation executed, it must not encourage blind retry.

---

## 20. Rate-Limit Errors

Canonical code:

```text
RATE_LIMIT_EXCEEDED
```

Typical response:

```http
429 Too Many Requests
Retry-After: 30
```

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again later.",
    "requestId": "req_01J...",
    "retryable": true,
    "retryAfterSeconds": 30
  }
}
```

Rate-limit metadata must not expose sensitive abuse-detection rules.

---

## 21. Dependency Failures

External provider, database, cache, queue, object storage, and network failures are translated into stable public categories.

Examples:

```text
DEPENDENCY_UNAVAILABLE
DEPENDENCY_TIMEOUT
PROJECTION_UNAVAILABLE
FILE_STORAGE_UNAVAILABLE
MESSAGE_DELIVERY_UNAVAILABLE
```

Typical mappings:

```text
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

The public response must not expose:

- provider hostnames;
- database names;
- SQL statements;
- SDK stack traces;
- cloud account identifiers;
- raw provider payloads.

---

## 22. Internal Errors

Unexpected failures return:

```text
500 Internal Server Error
INTERNAL_SERVER_ERROR
```

Example:

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred.",
    "requestId": "req_01J...",
    "retryable": false
  }
}
```

The full internal error is recorded in protected telemetry with correlation identifiers.

Stack traces are never returned in production responses.

---

## 23. Retryability

Retryability describes whether repeating the same logical request may succeed later.

### Usually retryable

```text
RATE_LIMIT_EXCEEDED
DEPENDENCY_TIMEOUT
DEPENDENCY_UNAVAILABLE
SERVICE_TEMPORARILY_UNAVAILABLE
```

### Usually not retryable without changing input or state

```text
REQUEST_VALIDATION_FAILED
AUTHENTICATION_REQUIRED
RESOURCE_ACCESS_FORBIDDEN
VERSION_CONFLICT
SKILL_PREREQUISITES_NOT_MET
IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST
```

A retryable transport failure does not guarantee that an earlier command had no effect.

Command APIs must combine retry guidance with idempotency and uncertain-outcome semantics.

---

## 24. Uncertain Command Outcomes

A client may lose the response after the server has accepted or committed a command.

The error contract must distinguish:

- command definitely not executed;
- command outcome safely replayable through idempotency;
- command accepted asynchronously;
- command outcome uncertain and recoverable through operation lookup.

Where an operation resource exists:

```json
{
  "error": {
    "code": "COMMAND_OUTCOME_UNCERTAIN",
    "message": "The command outcome could not be confirmed through this request.",
    "requestId": "req_01J...",
    "retryable": false,
    "operationId": "op_123"
  }
}
```

Clients query the operation rather than issuing a blind duplicate command.

---

## 25. Asynchronous Operation Errors

Operation resources may report terminal failures:

```json
{
  "id": "op_123",
  "status": "failed",
  "failure": {
    "code": "EXPORT_GENERATION_FAILED",
    "message": "The export could not be generated.",
    "retryable": true
  }
}
```

The nested failure uses the same stable code discipline.

Internal worker exceptions remain hidden.

---

## 26. Bulk Operation Errors

Bulk APIs must define atomicity.

### Atomic bulk command

One failure rejects the entire command using the normal error envelope.

### Partial-result bulk command

The success response contains per-item outcomes in a documented contract.

Example:

```json
{
  "results": [
    {
      "clientReference": "row-1",
      "status": "succeeded",
      "resourceId": "lrn_1"
    },
    {
      "clientReference": "row-2",
      "status": "failed",
      "error": {
        "code": "REQUEST_VALIDATION_FAILED",
        "message": "The item is invalid."
      }
    }
  ]
}
```

Do not use `207 Multi-Status` unless the repository intentionally adopts and documents it.

---

## 27. Error Code Naming

Codes should describe stable meaning.

Good:

```text
PRACTICE_SESSION_ALREADY_COMPLETED
VERSION_CONFLICT
TENANT_ACCESS_FORBIDDEN
INVALID_CURSOR
```

Avoid:

```text
BAD_REQUEST_1
PRISMA_P2002
POSTGRES_23505
AWS_S3_ERROR
TYPE_ERROR
UNKNOWN_EXCEPTION
```

Vendor and framework codes may be logged internally but must be translated.

---

## 28. Error Code Ownership

Code ownership follows semantic responsibility:

- API owns protocol and DTO validation codes;
- Authentication boundary owns credential failure codes;
- Application owns use-case failure classification;
- Domain owns domain rule meaning;
- Infrastructure maps technical failures to stable internal categories;
- API maps those categories to public status and envelope.

No outer layer may invent a misleading business error for an unknown internal exception.

---

## 29. Message Localization

Clients must branch on `code`, never on `message`.

The server may return a default human-readable message.

Localization options include:

- client-side mapping from stable code;
- server-side locale negotiation for approved messages;
- shared translation catalog.

Validation details may require parameterized localization.

Do not place untranslated internal exception messages into localized responses.

---

## 30. Correlation Identifiers

The API accepts or creates correlation metadata according to the RequestContext policy.

Public response includes the server request ID.

Recommended headers:

```http
X-Request-Id: req_01J...
```

A client-supplied correlation ID must be validated for length and safe character set before logging.

The server remains authoritative for the request ID.

---

## 31. Security and Privacy

Error responses must not leak:

- stack traces;
- source paths;
- SQL;
- schema names;
- internal service topology;
- secrets;
- tokens;
- password policy internals useful to attackers beyond documented requirements;
- existence of concealed resources;
- private learner or family information;
- authorization graph details;
- object storage keys;
- raw third-party responses.

Detailed information belongs in protected telemetry.

---

## 32. Account Enumeration

Authentication-related errors must follow the account-enumeration policy.

Where concealment is required, multiple internal causes may map to one public code and message.

Example:

```text
INVALID_CREDENTIALS
```

may represent unknown account or incorrect password publicly, while logs preserve exact internal classification.

---

## 33. Error Headers

Headers may communicate standardized transport metadata:

```text
WWW-Authenticate
Retry-After
Allow
Content-Type
X-Request-Id
```

Header values and body metadata must not contradict each other.

When `Retry-After` is present, `retryAfterSeconds` may mirror it for convenience but must use the same effective delay.

---

## 34. Content Type

Error responses use the API's documented JSON media type.

Baseline:

```http
Content-Type: application/json
```

If the repository later adopts a vendor media type or `application/problem+json`, that is a versioned contract decision and must be applied consistently.

This document's envelope remains authoritative until intentionally superseded.

---

## 35. Problem Details Compatibility

RFC-style Problem Details may be adopted later, but it must not be mixed casually with the current envelope.

A migration must define mappings for:

```text
type
status
title
detail
instance
stable application code
request ID
validation details
```

Clients should not be required to support two unrelated error formats on adjacent endpoints.

---

## 36. Logging Contract

Every server error log should include, where applicable:

```text
requestId
correlationId
route template
HTTP method
status
public error code
internal failure category
actor ID in protected form
tenant ID in protected form
resource type and safe identifier
duration
retryability
root exception with protected stack
```

Client errors may be sampled or aggregated to control noise.

Secrets and full sensitive bodies remain excluded.

---

## 37. Metrics

Recommended metrics:

- error count by route and public code;
- status-family rate;
- authentication failure rate;
- authorization denial rate;
- validation failure rate;
- conflict rate;
- dependency timeout rate;
- internal error rate;
- retryable failure rate;
- uncertain command outcome count.

Avoid high-cardinality labels such as raw request ID, user ID, or resource ID.

---

## 38. Mapping Table

Each endpoint or failure family should have an explicit mapping table.

Example:

| Internal failure | Public code | HTTP status | Retryable |
|---|---|---:|---:|
| Practice session missing | `PRACTICE_SESSION_NOT_FOUND` | 404 | false |
| Session already completed | `PRACTICE_SESSION_ALREADY_COMPLETED` | 409 | false |
| Expected version mismatch | `VERSION_CONFLICT` | 409 | false |
| Database temporarily unavailable | `DEPENDENCY_UNAVAILABLE` | 503 | true |
| Unexpected exception | `INTERNAL_SERVER_ERROR` | 500 | false |

Mapping tables are contract evidence and should be covered by tests.

---

## 39. Unknown Errors

Unknown errors fail closed into:

```text
500 INTERNAL_SERVER_ERROR
```

Do not guess a client error based on message text.

Do not turn an unknown persistence exception into `404` or `409` without a verified mapping.

Unexpected-error telemetry must preserve the root cause for diagnosis.

---

## 40. Error Middleware

Central API error middleware is responsible for:

- recognizing approved failure types;
- mapping status and public code;
- generating safe message and details;
- adding request ID;
- setting standard headers;
- redacting internals;
- recording telemetry;
- returning the canonical envelope.

Handlers should throw or return stable failures rather than handcrafting inconsistent response objects.

Central middleware does not own business classification; it consumes classifications from inner layers.

---

## 41. Testing Obligations

The error contract requires tests for:

1. canonical envelope shape;
2. required fields;
3. validation detail paths;
4. secret redaction;
5. stable HTTP mapping;
6. authentication failures;
7. authorization and concealment behavior;
8. not-found mapping;
9. domain conflict mapping;
10. optimistic concurrency;
11. idempotency conflict;
12. rate-limit headers and body consistency;
13. dependency failure translation;
14. unknown exception fallback;
15. no production stack trace;
16. request ID propagation;
17. retryability semantics;
18. uncertain command outcome recovery;
19. localization independence of client behavior;
20. contract snapshots or schema verification.

---

## 42. Contract Schema

The public error response should be represented in the API contract source, such as OpenAPI or equivalent schema authority.

The schema must include:

- required and optional fields;
- allowed detail shape;
- examples;
- maximum reasonable lengths;
- per-endpoint status responses;
- reusable error components.

A generic `default` error response alone is insufficient.

---

## 43. Prohibited Patterns

The following are prohibited:

- returning raw exceptions;
- exposing stack traces in production;
- leaking ORM or database codes publicly;
- using HTTP status alone as the error contract;
- requiring clients to parse message text;
- inconsistent envelope shapes;
- arbitrary status selection per controller;
- echoing secrets or full rejected payloads;
- returning `200 OK` with a hidden failure field for normal HTTP APIs;
- retry guidance without considering duplicate command effects;
- mapping unknown errors by string matching;
- including sensitive authorization reasons;
- returning provider payloads directly;
- changing code meaning without versioning or compatibility review.

---

## 44. Review Checklist

Before approving an endpoint's error behavior, verify:

- [ ] every failure has a stable public code;
- [ ] HTTP status matches the failure category;
- [ ] the canonical envelope is used;
- [ ] clients need not parse message text;
- [ ] validation details are structured;
- [ ] sensitive values are not echoed;
- [ ] authorization denial does not leak protected existence;
- [ ] domain and conflict failures are distinguished from internal errors;
- [ ] infrastructure exceptions are translated;
- [ ] retryability is accurate;
- [ ] uncertain command outcomes have safe recovery;
- [ ] request ID is returned and logged;
- [ ] unknown errors fail safely;
- [ ] contract tests cover the mappings.

---

## 45. Completion Rule

An API error contract is complete only when:

```text
failure
  → stable semantic classification
  → explicit HTTP mapping
  → canonical safe envelope
  → machine-readable code
  → accurate retry or recovery guidance
  → correlated protected telemetry
  → contract verification
```

A caught exception with a custom message is not a completed error contract.