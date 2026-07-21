# 20E — External Services

## 1. Purpose

This document defines how Math Learning World integrates with services outside the application boundary.

External services include authentication providers, email and notification systems, payment systems, AI providers, analytics, curriculum sources, media processing, and other third-party APIs.

The goal is to preserve domain and application independence while making external integrations replaceable, observable, secure, and failure-tolerant.

## 2. Scope

This document defines:

- external-service boundaries;
- application ports and infrastructure adapters;
- request and response mapping;
- authentication and secret handling;
- timeout, retry, and circuit-breaker rules;
- idempotency;
- synchronous and asynchronous integration;
- fallback and degradation behavior;
- observability;
- testing and completion criteria.

## 3. Core Principle

> External systems are unreliable implementation dependencies, never authorities over core business meaning.

The Domain Layer must not know provider names, SDKs, HTTP clients, credentials, webhook formats, or vendor-specific status codes.

## 4. Dependency Rule

Application code defines the capability it needs as a port.

Infrastructure implements that port using one or more providers.

Example:

```ts
export interface NotificationSender {
  send(request: NotificationRequest): Promise<NotificationDeliveryResult>;
}
```

The port describes business-relevant intent, not vendor operations such as `sendGridClient.send()` or provider-specific request bodies.

## 5. Integration Categories

External integrations should be classified before implementation.

### 5.1 Identity and Authentication

Examples:

- OAuth or social login;
- identity verification;
- token validation;
- passwordless login.

Infrastructure may verify provider tokens, but the application maps verified identity into internal account and authorization concepts.

### 5.2 Communication

Examples:

- email;
- push notification;
- SMS;
- chat or messaging channels.

Communication delivery should normally occur asynchronously after the business transaction commits.

### 5.3 Payment and Billing

Examples:

- subscription checkout;
- payment confirmation;
- refunds;
- invoice retrieval.

Internal entitlement state must be derived from verified payment events and internal policies, not directly from an unverified browser response.

### 5.4 Artificial Intelligence

Examples:

- content generation;
- explanation generation;
- answer feedback;
- classification;
- moderation.

AI output is untrusted input. It must be validated, bounded, versioned where needed, and must not directly mutate authoritative learning records without application-controlled rules.

### 5.5 Data and Curriculum Sources

Examples:

- national curriculum imports;
- standards catalogs;
- external assessment data.

Imported data requires source attribution, versioning, validation, and repeatable import behavior.

### 5.6 Media and File Processing

Examples:

- image resizing;
- virus scanning;
- document conversion;
- speech generation.

The application requests a capability; Infrastructure owns provider details and result normalization.

## 6. Port Design

A good external-service port:

- expresses application intent;
- uses internal value objects and stable DTOs;
- avoids provider terminology;
- defines explicit success and failure results;
- supports correlation and idempotency where required;
- is narrow enough to substitute or fake in tests.

A poor port mirrors a vendor SDK and spreads provider coupling throughout the application.

## 7. Adapter Responsibilities

Each adapter is responsible for:

- provider authentication;
- request serialization;
- response parsing;
- provider error interpretation;
- timeout enforcement;
- retry classification;
- rate-limit handling;
- observability;
- redaction of sensitive information;
- mapping into stable application results.

Adapters must not implement domain policy.

## 8. Mapping Boundary

External payloads must be translated at the adapter boundary.

The application must not consume raw webhook objects or provider response schemas.

Mapping should convert:

```text
provider payload
→ validated adapter model
→ internal application contract
```

Unknown fields may be ignored safely, but required fields, versions, signatures, identifiers, timestamps, and amount/currency values must be validated explicitly.

## 9. Timeouts

Every network call must have an explicit timeout.

No adapter may depend on an unlimited client default.

Timeout values should reflect the operation type:

- interactive request: short and bounded;
- background job: longer but still bounded;
- large upload or conversion: dedicated workflow with progress and cancellation where appropriate.

A timeout is an unknown outcome, not proof that the provider did nothing.

Operations with side effects therefore require idempotency or reconciliation.

## 10. Retry Policy

Retries are permitted only for classified transient failures.

Potentially retryable failures:

- connection reset;
- temporary DNS failure;
- HTTP 429 with retry guidance;
- HTTP 502, 503, or 504;
- provider-declared temporary unavailability.

Normally non-retryable failures:

- invalid credentials;
- invalid request;
- rejected content;
- authorization denial;
- missing required resource;
- signature failure;
- business rejection.

Retries must be bounded and use backoff with jitter.

The adapter must consider whether the provider operation is idempotent before retrying.

## 11. Circuit Breaker

Repeated provider failure must not consume unlimited resources or cascade through the system.

A circuit breaker may move through:

```text
CLOSED → OPEN → HALF_OPEN → CLOSED
```

Circuit state is an operational concern. It must not be confused with the business state of a learning mission, payment, notification, or account.

When open, the system should fail fast, queue work, or degrade gracefully according to the capability.

## 12. Idempotency

Side-effecting external operations must use idempotency where supported.

Examples:

- payment creation;
- refund request;
- notification job;
- AI generation job;
- curriculum import batch.

The internal operation ID or command ID should normally become the provider idempotency key.

Provider response identifiers must be stored for reconciliation.

## 13. Synchronous Versus Asynchronous Calls

A synchronous external call is acceptable only when the user cannot proceed without its immediate result and the latency/failure profile is acceptable.

Prefer asynchronous execution when:

- the provider is slow;
- the operation has side effects;
- retry is likely;
- the result can arrive later;
- the work requires reconciliation;
- the application transaction must not remain open.

Business state should expose meaningful statuses such as:

```text
REQUESTED
PROCESSING
SUCCEEDED
FAILED
REQUIRES_REVIEW
```

Do not expose raw provider statuses directly as product states.

## 14. Webhooks

Webhook handlers must:

1. capture the request safely;
2. verify provider signature and timestamp;
3. reject invalid or replayed requests;
4. persist receipt identity for idempotency;
5. acknowledge within the provider deadline;
6. process business effects through an application command;
7. preserve the raw event only when legally and operationally appropriate;
8. record correlation and provider identifiers.

Webhook delivery order must not be assumed unless the provider guarantees it.

Duplicate delivery is normal and must be safe.

## 15. Authentication and Secrets

Credentials belong in secure runtime configuration, never in source control.

Rules:

- use separate credentials per environment;
- use least privilege;
- rotate credentials;
- never log access tokens, API keys, signatures, or full authorization headers;
- restrict secret access to the adapter that needs it;
- fail startup for missing mandatory secrets;
- permit optional integrations to be disabled explicitly.

## 16. Data Protection

Only the minimum required data may be sent externally.

Learner information, parent information, assessment history, and generated content may have privacy implications.

Before adding a provider, document:

- data sent;
- purpose;
- retention behavior;
- region where relevant;
- deletion capability;
- provider subprocessors where relevant;
- whether data may be used for provider training;
- fallback or migration plan.

Sensitive payloads must be redacted from logs and traces.

## 17. AI Provider Rules

AI integrations require additional controls:

- prompts are versioned when they affect product behavior;
- model/provider identity is recorded for reproducibility where necessary;
- token and cost budgets are enforced;
- output schemas are validated;
- unsafe or malformed output is rejected;
- generated learning content passes deterministic structural checks;
- authoritative mastery decisions remain under application/domain rules;
- provider fallback must not silently change educational policy.

AI failure must not corrupt durable learner progress.

## 18. Payment Provider Rules

Payment integrations require:

- server-side amount and currency authority;
- signed webhook verification;
- durable provider event idempotency;
- reconciliation jobs;
- explicit refund and dispute states;
- separation of payment status from entitlement policy;
- audit records for state-changing actions.

The browser is never the authority that payment succeeded.

## 19. Failure Mapping

Provider-specific failures should be normalized into stable categories:

```text
EXTERNAL_SERVICE_UNAVAILABLE
EXTERNAL_SERVICE_TIMEOUT
EXTERNAL_RATE_LIMITED
EXTERNAL_AUTHENTICATION_FAILED
EXTERNAL_REQUEST_REJECTED
EXTERNAL_RESPONSE_INVALID
EXTERNAL_OPERATION_UNKNOWN
EXTERNAL_OPERATION_FAILED
```

The application decides what those categories mean for the use case.

## 20. Graceful Degradation

Each integration must declare its failure posture.

Examples:

- email unavailable: queue and retry;
- analytics unavailable: do not block learning flow;
- AI explanation unavailable: show deterministic fallback;
- payment provider unavailable: prevent duplicate checkout and communicate retry safely;
- curriculum source unavailable: continue using last validated internal version;
- media processing unavailable: retain upload as pending.

Core learning progress should not depend unnecessarily on optional providers.

## 21. Observability

Record:

- provider and capability name;
- operation name;
- correlation ID;
- duration;
- attempt count;
- normalized outcome;
- provider request identifier where safe;
- circuit state;
- rate-limit signals;
- cost or token usage where relevant.

Metrics should support provider comparison and migration decisions.

Payloads and secrets must not be logged by default.

## 22. Provider Selection and Replacement

Provider choice is an infrastructure decision constrained by product, legal, cost, and operational requirements.

The architecture must support replacement through:

- stable application ports;
- adapter-local mappings;
- provider-neutral stored business state;
- migration and reconciliation tooling;
- contract tests shared across adapters.

Multi-provider abstraction should not be added speculatively. Introduce it when replacement, fallback, regional requirements, or material vendor risk justify the complexity.

## 23. Testing

Required tests include:

- request mapping;
- response mapping;
- timeout behavior;
- transient retry behavior;
- permanent failure behavior;
- rate-limit mapping;
- circuit-breaker behavior;
- idempotency-key propagation;
- webhook signature validation;
- duplicate webhook handling;
- malformed response rejection;
- secret redaction;
- contract tests against provider sandbox or recorded fixtures where appropriate.

Application tests should use port fakes. Adapter integration tests should verify the actual boundary behavior.

## 24. Anti-Patterns

The following are prohibited:

- importing vendor SDKs into Domain or Application modules;
- storing raw provider state as the product state;
- unlimited network timeouts;
- indiscriminate retries;
- external calls inside database transactions;
- trusting browser payment confirmation;
- processing unsigned webhooks;
- logging secrets or sensitive payloads;
- allowing AI output to write authoritative progress directly;
- coupling multiple modules to one provider-specific DTO;
- treating a timeout as definite failure.

## 25. Completion Criteria

This architecture is satisfied when:

- every external capability is represented by an application-owned port;
- provider SDKs are isolated in Infrastructure adapters;
- requests and responses are mapped to stable internal contracts;
- timeouts and classified retries are explicit;
- side effects use idempotency and reconciliation where needed;
- webhooks are verified and duplicate-safe;
- secrets are externalized and redacted;
- integration failure posture is documented;
- optional services degrade without corrupting core learning state;
- adapter behavior is covered by contract and integration tests.

## 26. Decision Summary

Math Learning World will treat every external provider as an unreliable, replaceable adapter. Application ports define needed capabilities; Infrastructure owns SDKs, authentication, transport, retries, and mapping. External work will remain outside database transactions, side effects will be idempotent and reconcilable, and provider failure will be translated into stable system behavior without leaking vendor semantics into the Domain.
