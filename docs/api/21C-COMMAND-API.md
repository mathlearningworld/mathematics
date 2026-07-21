# 21C — Command API

## 1. Purpose

This document defines how Math Learning World exposes state-changing application capabilities through HTTP command endpoints.

It governs:

- command endpoint design;
- request contracts;
- application command mapping;
- identity and actor context;
- idempotency;
- optimistic concurrency;
- synchronous and asynchronous outcomes;
- command result representation;
- retry and uncertain-outcome recovery;
- command failure mapping;
- testing obligations.

---

## 2. Core Principle

> A Command API communicates one explicit application intent and delegates all business decisions to the Application and Domain layers.

A command endpoint is not generic CRUD plumbing.

It represents a client request to create, change, begin, complete, cancel, submit, accept, revoke, archive, or otherwise transition application state.

---

## 3. Command Flow

Every command endpoint follows this flow:

```text
HTTP request
  → protocol and DTO validation
  → authenticated RequestContext
  → command mapping
  → Application command execution
  → transaction and domain processing
  → command result or stable failure
  → HTTP response mapping
```

The API handler must not:

- load aggregates directly;
- call repositories directly;
- mutate persistence records;
- decide domain transitions;
- publish integration events directly;
- implement authorization rules that require business state.

---

## 4. Command Endpoint Shape

A command endpoint should expose one clear intent.

Examples:

```text
POST /api/v1/learners
POST /api/v1/learners/{learnerId}/practice-sessions
POST /api/v1/practice-sessions/{sessionId}/completion
POST /api/v1/assessment-attempts/{attemptId}/submission
POST /api/v1/mentorship-invitations/{invitationId}/acceptance
POST /api/v1/progress-report-exports
```

Avoid generic mutation endpoints:

```text
POST /api/v1/commands
POST /api/v1/update-resource
POST /api/v1/execute
```

A generic internal command bus may exist, but it is not the public HTTP contract.

---

## 5. Request DTO versus Application Command

The request DTO is a public transport contract.

The Application command is an internal use-case contract.

Example request DTO:

```ts
type CompletePracticeSessionRequest = {
  expectedVersion: number;
  completedAt?: string;
};
```

Example application command:

```ts
type CompletePracticeSessionCommand = {
  sessionId: PracticeSessionId;
  expectedVersion: number;
  requestedCompletedAt?: Instant;
};
```

The handler maps between them and supplies trusted execution context separately:

```ts
await completePracticeSession.execute({
  context,
  command,
});
```

Actor, tenant, correlation, and authorization context must not be copied from untrusted body fields.

---

## 6. Command Identity

Commands requiring retry safety should have a stable command identity.

Sources may include:

- an `Idempotency-Key` header;
- a client-generated operation identifier;
- a server-generated operation resource identifier;
- a naturally idempotent resource identity plus expected version.

Recommended command metadata:

```ts
type CommandMetadata = {
  commandId: string;
  idempotencyKey?: string;
  requestId: string;
  correlationId: string;
  causationId?: string;
  actorId: string;
  tenantId?: string;
  receivedAt: string;
};
```

Public command identity and internal event identity are related for traceability but are not automatically the same concept.

---

## 7. Idempotency Contract

Idempotency means that repeating the same logical command with the same idempotency identity does not create a second business effect.

For endpoints requiring idempotency, the client sends:

```http
Idempotency-Key: 7f243d36-...
```

The server must bind the key to:

- authenticated actor or client identity;
- tenant scope where applicable;
- route and command type;
- a canonical request fingerprint;
- the resulting command outcome.

### 7.1 Replay with the same payload

The server returns the recorded outcome or an equivalent representation without re-executing the business effect.

### 7.2 Replay with a different payload

The server rejects the request with a stable idempotency conflict.

Typical response:

```text
409 Conflict
IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_REQUEST
```

### 7.3 Key lifetime

Each endpoint must document the retention window or durable lifetime of its idempotency record.

Financial, credit, entitlement, submission, and externally billed operations may require long-lived or permanent command identity.

---

## 8. Where Idempotency Is Required

Idempotency is required or strongly recommended for:

- credit transactions;
- payment-related operations;
- learner answer submission;
- assessment finalization;
- invitation acceptance;
- operation creation invoked by retrying clients;
- webhook-driven commands;
- commands that call external providers;
- commands whose outcome may become uncertain after client disconnect;
- bulk mutations.

It may be optional for simple commands where duplicate execution is harmless and fully prevented by aggregate invariants, but this must be an explicit decision.

---

## 9. Canonical Request Fingerprint

The fingerprint must derive from validated semantic input, not raw JSON bytes.

Equivalent inputs should produce the same fingerprint despite:

- object field order;
- irrelevant whitespace;
- transport formatting differences;
- omitted optional fields that have the same canonical meaning.

The fingerprint must exclude:

- request ID;
- correlation ID;
- timestamps generated by the server;
- bearer tokens;
- volatile headers.

It must include all client-controlled fields that affect business meaning.

---

## 10. Optimistic Concurrency

Commands that mutate an existing versioned aggregate should support an expected version when conflicting concurrent intent matters.

Example:

```json
{
  "expectedVersion": 7
}
```

The API maps this value to the Application command.

If the durable version differs, the operation fails without overwriting newer state.

Typical response:

```text
409 Conflict
AGGREGATE_VERSION_CONFLICT
```

The response may include safe recovery metadata:

```json
{
  "error": {
    "code": "AGGREGATE_VERSION_CONFLICT",
    "message": "The resource changed before this command was applied.",
    "details": {
      "expectedVersion": 7,
      "actualVersion": 8
    }
  }
}
```

Do not expose sensitive state in conflict details.

---

## 11. HTTP Preconditions

Where resource representations expose an ETag, a command may use:

```http
If-Match: "version-7"
```

Rules:

- the API maps the precondition to application expected-version semantics;
- body and header expected versions must not conflict;
- one canonical mechanism should be documented per endpoint;
- a failed explicit HTTP precondition may map to `412 Precondition Failed`;
- an application concurrency conflict without HTTP precondition semantics may map to `409 Conflict`.

---

## 12. Server-Generated versus Client-Generated IDs

### 12.1 Server-generated identity

Use when the server owns identity creation:

```text
POST /learners/{learnerId}/practice-sessions
```

The response returns the new `sessionId`.

### 12.2 Client-generated identity

May be used when offline creation, deterministic retry, or distributed coordination requires it.

```text
PUT /practice-sessions/{sessionId}
```

This is valid only when repeated requests genuinely have create-or-replace semantics and authorization is safe.

A client-generated command ID does not automatically make a non-idempotent command idempotent; the server must persist and enforce command identity.

---

## 13. Synchronous Command Outcomes

A synchronous command completes its authoritative application transaction before responding.

Typical status codes:

```text
200 OK       command completed and returns a result
201 Created  addressable resource created
204 No Content command completed with no response representation
```

Example creation response:

```http
HTTP/1.1 201 Created
Location: /api/v1/practice-sessions/ps_123
```

```json
{
  "sessionId": "ps_123",
  "version": 1,
  "status": "ACTIVE",
  "createdAt": "2026-07-21T08:30:00.000Z"
}
```

The response represents the command result, not necessarily the full canonical read model.

---

## 14. Asynchronous Command Outcomes

Use asynchronous processing when the operation:

- requires long-running work;
- depends on slow external systems;
- creates files or reports;
- performs AI generation;
- processes large imports;
- is deliberately queued;
- cannot complete reliably within the request deadline.

Typical response:

```http
HTTP/1.1 202 Accepted
Location: /api/v1/report-exports/exp_123
Retry-After: 3
```

```json
{
  "operationId": "exp_123",
  "status": "QUEUED",
  "acceptedAt": "2026-07-21T08:30:00.000Z"
}
```

`202 Accepted` means accepted for processing, not completed successfully.

The operation resource must expose eventual success or failure.

---

## 15. Command Result Contract

A command result should contain stable facts required by the caller.

Common fields:

```text
resource or operation identifier
new version
new lifecycle status
created/updated/completed timestamp
safe next-action information
```

Example:

```ts
type CompletePracticeSessionResult = {
  sessionId: string;
  version: number;
  status: "COMPLETED";
  completedAt: string;
};
```

Do not return:

- aggregate private fields;
- persistence metadata;
- internal event arrays;
- ORM relations;
- secrets;
- full audit records by default.

---

## 16. Location and Operation Links

When creating an addressable resource, return its canonical URI through `Location` when useful.

When accepting asynchronous work, return the operation-status URI.

Optional links may be represented explicitly:

```json
{
  "operationId": "exp_123",
  "status": "QUEUED",
  "links": {
    "self": "/api/v1/report-exports/exp_123"
  }
}
```

Links are contract fields and must obey versioning policy.

---

## 17. Failure Categories

Command failures are classified before HTTP mapping.

### 17.1 Authentication failure

```text
401 Unauthorized
```

### 17.2 Authorization failure

```text
403 Forbidden
```

or `404 Not Found` when non-disclosure policy applies.

### 17.3 Contract-invalid request

```text
400 Bad Request
```

### 17.4 Application validation or rejected intent

```text
422 Unprocessable Entity
```

### 17.5 State conflict

```text
409 Conflict
```

Examples:

- already completed;
- version conflict;
- idempotency mismatch;
- duplicate unique business identity;
- incompatible active operation.

### 17.6 Explicit precondition failure

```text
412 Precondition Failed
```

### 17.7 Dependency unavailable

```text
503 Service Unavailable
```

Only when the failure is safely retryable or service availability is genuinely impaired.

### 17.8 Unexpected failure

```text
500 Internal Server Error
```

The API returns a stable public error contract and does not expose stack traces or vendor exceptions.

---

## 18. Already-Applied Commands

A repeated command can have different meanings.

### 18.1 Idempotent replay

Same key and same semantic payload:

- return the recorded success or failure;
- do not execute again.

### 18.2 Domain state already achieved

Example: complete a session that is already complete without a matching idempotency record.

The Application contract decides whether this is:

- successful no-op;
- conflict;
- already-completed failure;
- unauthorized disclosure.

The API must not invent the policy.

---

## 19. Retry Contract

Clients may retry when:

- the connection failed before a response;
- `408`, `429`, or selected `5xx` outcomes permit retry;
- an asynchronous operation remains pending;
- the endpoint explicitly documents retry behavior.

Safe retry requires one of:

- an idempotency key;
- a naturally idempotent method and resource contract;
- a durable operation identifier;
- an expected-version contract that prevents duplicate effects.

Clients must not blindly retry non-idempotent commands without identity protection.

The server may return `Retry-After` for throttling or temporary unavailability.

---

## 20. Uncertain Outcomes

A client may disconnect after the server committed but before receiving the response.

The system must assume this is possible.

Recovery options:

1. Replay using the same idempotency key.
2. Query the durable operation resource.
3. Query the created resource by client-provided unique identity.
4. Use a command-status endpoint when explicitly supported.

The server must never claim an operation rolled back solely because the HTTP connection ended.

---

## 21. External Side Effects

A database transaction cannot atomically commit a remote API call.

Commands involving external systems must follow Chapter 20E and 20F patterns, including:

- transactional outbox;
- durable operation records;
- provider idempotency keys;
- retry classification;
- reconciliation;
- webhook deduplication;
- compensation only when defined by business policy.

The API response must accurately distinguish:

```text
locally committed
accepted for external processing
externally confirmed
failed permanently
```

Do not return final success before the authoritative completion condition is satisfied.

---

## 22. Timestamps and Client Time

Server time is authoritative for durable lifecycle timestamps.

Client-supplied time may be accepted as an observed or requested time only when the application contract requires it.

Example:

```json
{
  "observedAt": "2026-07-21T08:28:13.000Z"
}
```

The command metadata separately records server `receivedAt` and durable `committedAt` or domain transition time.

The API validates timestamp format and acceptable bounds; the Application decides business relevance.

---

## 23. Partial Updates

A `PATCH` command must define exact field semantics.

Rules:

- omitted means unchanged;
- `null` meaning must be documented;
- immutable fields cannot be patched;
- unknown fields are rejected according to API policy;
- updates map to an explicit Application command;
- the handler must not spread request bodies into persistence updates.

Preferred:

```ts
const command = {
  learnerId,
  displayName: body.displayName,
  preferredLocale: body.preferredLocale,
  expectedVersion: body.expectedVersion,
};
```

Prohibited:

```ts
await prisma.learner.update({ data: req.body });
```

---

## 24. Bulk Command Semantics

Every bulk command must define:

- maximum batch size;
- item identity;
- atomic or independent processing;
- idempotency scope;
- concurrency behavior;
- ordered or unordered execution;
- partial-success representation;
- retry semantics.

Atomic result example:

```json
{
  "batchId": "bat_123",
  "status": "COMPLETED",
  "appliedCount": 25
}
```

Partial result example:

```json
{
  "batchId": "bat_123",
  "status": "PARTIALLY_COMPLETED",
  "items": [
    { "itemId": "1", "status": "APPLIED" },
    {
      "itemId": "2",
      "status": "REJECTED",
      "error": { "code": "SKILL_NOT_ACCESSIBLE" }
    }
  ]
}
```

Partial behavior must never be accidental.

---

## 25. Command Authorization

Route middleware verifies baseline authentication and coarse route requirements.

The Application command handler verifies contextual permission using trusted execution context and current business state.

Authorization must consider, where applicable:

- actor identity;
- tenant identity;
- membership;
- learner relationship;
- teacher/class assignment;
- ownership;
- role and scope;
- resource lifecycle;
- requested transition;
- delegated authority.

The command payload cannot grant itself permission.

---

## 26. Command Observability

Every command execution should record structured telemetry:

```text
requestId
correlationId
commandId
command type
idempotency key hash or safe reference
actor and tenant identifiers when permitted
target resource identifier
expected version
outcome
stable failure code
duration
transaction attempt count
asynchronous operation identifier
```

Do not log sensitive payloads, learner answers, credentials, or personal data without explicit approved policy.

---

## 27. Handler Structure

Illustrative handler:

```ts
async function completePracticeSessionHandler(req, res, next) {
  try {
    const input = parseCompletePracticeSessionRequest(req);

    const result = await completePracticeSession.execute({
      context: req.requestContext,
      command: {
        sessionId: parsePracticeSessionId(req.params.sessionId),
        expectedVersion: input.expectedVersion,
        requestedCompletedAt: input.completedAt,
      },
      metadata: {
        idempotencyKey: req.get("Idempotency-Key") ?? undefined,
      },
    });

    res.status(200).json(mapCompletePracticeSessionResult(result));
  } catch (error) {
    next(error);
  }
}
```

The exact framework style may vary, but translation, invocation, and mapping remain distinct.

---

## 28. Prohibited Patterns

The following are prohibited:

1. Generic public command-bus endpoints.
2. Direct repository or Prisma access from handlers.
3. Business state transitions implemented in controllers.
4. Actor or tenant identity trusted from request bodies.
5. Retrying external effects without durable idempotency.
6. Returning `202` without a way to observe the operation.
7. Returning final success before authoritative completion.
8. Reusing an idempotency key with unverified payload equivalence.
9. Blindly spreading patch bodies into persistence.
10. Treating client disconnect as transaction rollback evidence.
11. Publishing integration events directly from the API handler.
12. Exposing raw domain exceptions or vendor errors.
13. Omitting concurrency protection where lost updates matter.
14. Undocumented partial success in bulk operations.
15. Hidden state mutation in query endpoints.

---

## 29. Testing Obligations

Each command endpoint requires tests for:

- valid request mapping;
- malformed and contract-invalid input;
- missing or invalid authentication;
- trusted context propagation;
- authorization failure mapping;
- successful synchronous result;
- successful creation response and `Location`;
- asynchronous acceptance and operation URI;
- idempotent replay;
- mismatched idempotency payload;
- optimistic concurrency conflict;
- domain/application rejection;
- dependency unavailability;
- unexpected error sanitization;
- client retry behavior where contractually relevant;
- no direct persistence coupling at the API boundary.

Critical command flows also require Runtime and Operational Gate verification.

---

## 30. Decision Checklist

Before publishing a command endpoint, confirm:

```text
[ ] Is one application intent clearly represented?
[ ] Is the method and URI semantically accurate?
[ ] Is the request DTO separate from the Application command?
[ ] Are actor and tenant identities derived from trusted context?
[ ] Is command authorization owned by Application where required?
[ ] Is idempotency required and fully specified?
[ ] Is optimistic concurrency required?
[ ] Is the completion condition synchronous or asynchronous?
[ ] Can uncertain outcomes be recovered safely?
[ ] Are external effects durable and retry-safe?
[ ] Is the result contract minimal and stable?
[ ] Are failures mapped to stable public codes?
[ ] Are logging and telemetry safe?
[ ] Are contract, runtime, and operational tests identified?
```

---

## 31. Decision Summary

The Math Learning World Command API is:

- intent-oriented;
- application-owned;
- thin at the HTTP boundary;
- explicit about identity;
- retry-safe where needed;
- concurrency-aware;
- honest about asynchronous work;
- recoverable after uncertain outcomes;
- tenant- and actor-safe;
- stable in result and failure contracts;
- independently contract-testable.

A command endpoint succeeds only when it preserves the application's business authority while giving clients a precise, secure, and recoverable way to request state change.
