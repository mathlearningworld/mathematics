# 19J — Application Validation

## 1. Purpose

This document defines the application-layer validation contract for Math Learning World.

It is the Source of Truth for:

- validation stages;
- responsibility boundaries;
- request-shape validation;
- application preconditions;
- domain validation coordination;
- authorization-related validation;
- conflict validation;
- failure representation;
- error aggregation;
- observability;
- testing requirements.

---

## 2. Core Principle

> Validate each rule at the layer that owns its meaning, as early as safely possible, without duplicating domain authority or leaking infrastructure details.

Application validation protects use-case execution. It does not replace domain invariants, authorization policy, or durable database constraints.

---

## 3. Validation Layers

Validation is divided into five responsibility levels.

### 3.1 Transport Validation

Owned by the presentation or interface layer.

Examples:

- parse JSON;
- enforce body-size limits;
- validate route and query parameter syntax;
- normalize transport-specific formats;
- reject unsupported media types.

### 3.2 Application Contract Validation

Owned by the application layer.

Examples:

- required command fields;
- supported enum values;
- identifier format;
- bounded list sizes;
- mutually exclusive inputs;
- use-case-specific request combinations.

### 3.3 Authorization and Scope Validation

Owned by the authorization policy and application orchestration boundary.

Examples:

- actor may execute the use case;
- actor may access the target learner;
- tenant and classroom scope match;
- parent or mentor relationship is active;
- field-level visibility is permitted.

### 3.4 Domain Validation

Owned by domain entities, value objects, aggregates, specifications, services, and policies.

Examples:

- mastery transition is legal;
- mission attempt may be completed;
- credit balance cannot become invalid;
- prerequisite rules are satisfied;
- invariant-preserving state transitions.

### 3.5 Persistence Validation

Owned by durable infrastructure constraints.

Examples:

- unique membership;
- foreign-key integrity;
- expected aggregate version;
- not-null storage constraint;
- durable idempotency-key uniqueness.

Infrastructure failures must be translated into application or domain-aligned failures at the boundary.

---

## 4. Validation Order

Recommended command validation order:

1. Parse and normalize transport input.
2. Validate application request shape.
3. Establish actor and tenant context.
4. Validate idempotency envelope where required.
5. Evaluate coarse-grained authorization.
6. Load required state.
7. Evaluate resource-scoped authorization.
8. Validate application preconditions.
9. Execute domain behavior and domain validation.
10. Persist using durable constraints and expected version.
11. Translate conflicts and constraint failures.
12. Return an explicit application result.

The order may change when security requires hiding resource existence. Authorization and not-found behavior must follow the approved disclosure policy.

---

## 5. Application Contract Validation

Application inputs must be explicit, immutable, and validated before orchestration continues.

Validation may include:

- required fields;
- string length;
- numeric bounds;
- date and time format;
- identifier syntax;
- enum membership;
- list cardinality;
- duplicate entries;
- allowed field combinations;
- conditional requirements;
- supported command or query version.

Application validation must not depend on HTTP concepts such as headers or status codes.

---

## 6. Normalization

Normalization must be deliberate and documented.

Permitted examples:

- trimming surrounding whitespace from human-entered labels;
- canonicalizing case-insensitive codes;
- converting accepted date input into a standard representation;
- removing duplicate identifiers when semantics explicitly allow set behavior.

Prohibited examples:

- silently changing business meaning;
- guessing missing required values;
- converting invalid values into defaults;
- accepting ambiguous dates;
- discarding conflicting entries without reporting them.

Validation should operate on normalized input, while audit evidence may retain a safe representation of the original request when required.

---

## 7. Required and Optional Fields

A field must be required when the use case cannot determine valid intent without it.

Optional fields must have explicit semantics for absence.

The following distinctions must not be collapsed accidentally:

```text
missing
null
empty string
empty list
zero
false
```

Default values belong to the layer that owns the defaulting policy and must be deterministic.

---

## 8. Identifier Validation

Application validation should verify identifier shape before repository access.

It must not infer that a syntactically valid identifier exists or is accessible.

Examples:

- learnerId has an accepted opaque ID format;
- missionAttemptId is non-empty and bounded;
- external reference uses its declared provider format;
- tenantId cannot be taken from an untrusted body when established by authenticated context.

Identifiers must remain opaque unless the contract explicitly defines structure.

---

## 9. Collection Validation

Collections must declare:

- maximum and minimum size;
- whether order matters;
- whether duplicates are allowed;
- item-level validation;
- partial-success policy;
- failure aggregation policy.

Unbounded arrays are prohibited at public application boundaries.

Batch commands must define whether execution is:

```text
ATOMIC
BEST_EFFORT
PARTITIONED_ATOMIC
```

The default for state-changing batch operations is atomic unless the contract states otherwise.

---

## 10. Cross-field Validation

Rules involving multiple input fields are application-contract rules when they define valid use-case intent rather than domain state.

Examples:

- exactly one of `missionId` or `customMissionDefinition` is provided;
- `cursor` cannot be combined with an incompatible page offset;
- `startDate` must not be after `endDate`;
- a reason is required when an administrative override is requested;
- expected version is required for an offline conflict-sensitive command.

Cross-field validation must produce stable, actionable failures.

---

## 11. Application Preconditions

Application preconditions are facts required to orchestrate a use case but not necessarily aggregate invariants.

Examples:

- referenced learner exists in the authorized scope;
- required feature is enabled;
- target curriculum version is available;
- external provider configuration exists;
- a projection is fresh enough for the requested operation;
- the command is supported in the current runtime mode.

Preconditions must not be hidden inside controllers or infrastructure adapters.

---

## 12. Domain Validation Boundary

The application layer may invoke domain factories, value objects, specifications, policies, services, and aggregate methods.

It must not duplicate their rules with independent conditionals merely to produce earlier errors.

Permitted:

- validating input shape before creating a value object;
- invoking a domain specification before an expensive orchestration step;
- translating a domain failure into an application failure contract.

Prohibited:

- reimplementing aggregate transition rules in a handler;
- bypassing domain factories after pre-validation;
- treating application validation as authority over domain invariants.

---

## 13. Authorization Is Not Ordinary Validation

Authorization failures must remain distinguishable from malformed input and business-rule failure.

The application layer must not report an inaccessible resource as valid merely because its identifier is well formed.

Depending on disclosure policy, an inaccessible resource may result in:

```text
FORBIDDEN
NOT_FOUND
RESOURCE_NOT_AVAILABLE
```

The policy must be consistent and tenant-safe.

---

## 14. Query Validation

Queries require validation even though they do not mutate business state.

Query validation includes:

- filter syntax;
- allowed filter combinations;
- sort-field allowlist;
- sort direction;
- cursor integrity;
- page-size bounds;
- date-range bounds;
- projection availability;
- visibility scope;
- requested expansion limits.

Client-provided field names must never be passed directly into ORM ordering, filtering, or selection without an allowlisted mapping.

---

## 15. Command Validation

Command validation must establish that the request expresses one supported action.

It should validate:

- command version;
- required identity and context;
- payload structure;
- idempotency requirements;
- expected-version requirements;
- mutually exclusive actions;
- batch semantics;
- override evidence where applicable.

A syntactically valid command may still fail authorization, preconditions, domain rules, or concurrency control.

---

## 16. Failure Categories

Application validation failures should use stable categories.

Recommended categories:

```text
INVALID_INPUT
UNSUPPORTED_VALUE
MISSING_REQUIRED_FIELD
INVALID_FIELD_COMBINATION
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
PRECONDITION_FAILED
DOMAIN_RULE_VIOLATION
CONCURRENCY_CONFLICT
IDEMPOTENCY_CONFLICT
DEPENDENCY_UNAVAILABLE
INTERNAL_FAILURE
```

These categories are application semantics, not transport status codes.

---

## 17. Field Violations

A validation failure may contain structured field violations.

Example:

```ts
interface FieldViolation {
  field: string;
  code: string;
  message: string;
  metadata?: Record<string, string | number | boolean>;
}
```

Rules:

- field paths must use application-contract names;
- codes must be stable and machine-readable;
- messages must be safe for the intended audience;
- metadata must not leak protected values;
- domain failures need not pretend to belong to one field when they concern the whole operation.

---

## 18. Error Aggregation

Application contract validation may aggregate multiple independent input violations in one result when doing so is safe and useful.

It should stop early when:

- continuing would require unauthorized access;
- later checks are expensive or unsafe;
- one failure invalidates the meaning of remaining checks;
- a security policy requires non-disclosure;
- the operation could trigger side effects.

Domain commands normally fail atomically rather than partially applying valid portions.

---

## 19. Localization

Stable error codes are authoritative. Human-readable messages may be localized at the presentation boundary.

Application and domain layers should not depend on a specific display language.

The application result may include:

- stable error code;
- safe parameters for message rendering;
- field path;
- severity or classification;
- remediation hint code.

It should not embed presentation-specific HTML or UI instructions.

---

## 20. Security Validation

Security-related validation includes:

- rejecting oversized collections and strings;
- allowlisting sort and filter fields;
- preventing tenant identity override;
- validating external callback signatures at the trusted integration boundary;
- rejecting unsupported serialized types;
- protecting against path or query injection;
- limiting expensive query ranges;
- redacting secrets from failures and logs.

Validation is defense in depth and does not replace parameterized queries, secure serialization, or authorization.

---

## 21. External Dependency Validation

Data received from external systems must be treated as untrusted.

Integration adapters should validate provider-specific envelopes and translate them into application contracts.

The application layer should validate:

- provider identity;
- supported event or API version;
- stable external reference;
- idempotency identity;
- accepted semantic values;
- required mapping to internal scope.

Provider-specific error objects must not leak into application results.

---

## 22. Durable Constraint Translation

Some races can only be decided by durable infrastructure.

Examples:

- unique membership created concurrently;
- duplicate reward claim;
- stale aggregate version;
- duplicate idempotency key;
- missing referenced record at commit time.

The repository or infrastructure adapter must classify the constraint failure. The application layer then translates it into a stable outcome such as:

```text
MEMBERSHIP_ALREADY_EXISTS
REWARD_ALREADY_CLAIMED
CONCURRENCY_CONFLICT
IDEMPOTENCY_KEY_REUSED
REFERENCE_NO_LONGER_AVAILABLE
```

Raw SQL, Prisma, or database error details must not cross the application boundary.

---

## 23. Validation and Transactions

Validation that depends on mutable state may need to occur inside the transaction.

Pre-checks outside the transaction can improve usability but cannot guarantee correctness under concurrency.

The final authoritative check must be protected by:

- aggregate invariants;
- expected-version checks;
- unique constraints;
- foreign keys;
- locks where explicitly approved;
- transaction isolation appropriate to the invariant.

---

## 24. Validation and Idempotency

Validation behavior for retries must be deterministic.

For a matching completed idempotent request, the stored result should be returned without re-running mutable validations that could now produce a different outcome.

For a new request:

- validate key shape;
- compare command fingerprint;
- reject key reuse with different intent;
- persist final deterministic validation failure when policy requires replay consistency.

---

## 25. Validation and Observability

Operational evidence should include:

- use-case name;
- validation stage;
- stable failure code;
- number of violations;
- safe field names;
- actor and tenant-safe identifiers;
- correlation ID;
- dependency or constraint classification;
- execution duration.

Logs must not contain passwords, tokens, raw child data, secret answers, or unnecessary request payloads.

High-volume invalid input should be observable without turning user mistakes into noisy system alerts.

---

## 26. Testing Requirements

Tests must cover:

- missing required fields;
- invalid formats and bounds;
- cross-field combinations;
- collection limits and duplicates;
- normalization behavior;
- authorization versus validation distinction;
- not-found disclosure policy;
- application preconditions;
- domain failure translation;
- concurrency conflict translation;
- idempotency-key mismatch;
- query filter and sort allowlists;
- external provider payload validation;
- localization-independent error codes;
- privacy-safe failures;
- durable constraint races at the Runtime Gate.

Contract tests should verify that the same failure semantics are preserved across HTTP, job, event-consumer, and other presentation adapters.

---

## 27. Anti-patterns

Prohibited patterns include:

- placing all validation in controllers;
- duplicating domain invariants in command handlers;
- trusting client-provided tenant or actor identity;
- accepting unbounded lists or query ranges;
- passing client sort fields directly to the ORM;
- silently defaulting invalid values;
- returning raw database or provider errors;
- converting every failure into `INVALID_INPUT`;
- checking mutable state only before the transaction;
- leaking resource existence through inconsistent validation order;
- embedding localized UI text as the only error contract;
- partial command application without an explicit batch policy.

---

## 28. Completion Criteria

This contract is satisfied when:

- every validation rule has a clear owning layer;
- application inputs are explicit and bounded;
- normalization does not change intent silently;
- authorization, domain rules, and persistence constraints remain distinct;
- mutable preconditions are protected transactionally;
- failures use stable application codes;
- field violations are safe and machine-readable;
- infrastructure errors are translated;
- validation behavior is consistent across presentation adapters;
- concurrency, idempotency, tenant isolation, and privacy are covered by tests.

---

## 29. Chapter 19 Completion Statement

With this document, Chapter 19 defines the complete Application Layer contract for Math Learning World:

```text
19A  Application Layer Overview
19B  Use Case Model
19C  Commands and Command Handlers
19D  Queries and Query Handlers
19E  Transactions
19F  Application Services
19G  Authorization
19H  Idempotency and Concurrency
19I  Application Events
19J  Application Validation
```

Together these documents establish how user and system intent enters the application, how use cases are authorized and orchestrated, how domain behavior is executed, how durable state and events are committed, and how failures remain explicit, safe, and testable.