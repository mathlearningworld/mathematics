# 21G — Versioning and Compatibility

## 1. Purpose

This document defines how Math Learning World evolves public API contracts without breaking supported clients, corrupting meaning, or coupling product delivery to uncontrolled interface changes.

It governs:

- public API version identity;
- backward-compatible and breaking changes;
- request and response evolution;
- command and query compatibility;
- deprecation and removal;
- client capability negotiation;
- event contract evolution;
- migration and rollout safety;
- compatibility verification.

---

## 2. Core Principle

> API compatibility protects the meaning relied on by clients, not merely the continued existence of fields and routes.

A change is compatible only when an existing supported client can continue to perform the same valid intent and interpret the response safely.

---

## 3. Versioning Scope

Versioning applies independently to:

- HTTP resource and command contracts;
- authentication and session contracts;
- error contracts;
- event and realtime messages;
- exported files and reports;
- webhook payloads;
- SDK or generated client surfaces.

An internal Application or Domain refactor does not require a public version change unless externally observable behavior changes.

---

## 4. Primary HTTP Version

The primary public HTTP API uses a major version in the URI:

```text
/api/v1/learners
/api/v1/practice-sessions/{sessionId}
/api/v1/assessment-attempts/{attemptId}/submission
```

The URI major version identifies a coherent compatibility family. Minor compatible changes do not create `/v1.1` routes.

---

## 5. Compatibility Classification

Every externally observable change must be classified before implementation.

### 5.1 Compatible additive change

Examples:

- adding an optional request field with a stable default;
- adding a response field that clients are required to ignore when unknown;
- adding a new endpoint;
- adding a new optional filter;
- adding a new error detail field without changing the stable error code;
- adding a new event type to an explicitly extensible subscription.

### 5.2 Conditionally compatible change

Examples:

- adding an enum value;
- tightening a practical limit that was undocumented;
- changing ordering where no deterministic order was promised;
- increasing projection delay;
- changing a nullable field to omitted or vice versa.

These require evidence that supported clients tolerate the change.

### 5.3 Breaking change

Examples:

- removing or renaming a field;
- making an optional request field required;
- changing field type or semantic unit;
- changing command idempotency behavior;
- changing authorization scope;
- changing a stable error code;
- changing default sorting promised by the contract;
- reusing an enum value with different meaning;
- changing event meaning while retaining its type and version.

Breaking changes require a new major contract or an explicit migration mechanism.

---

## 6. Semantic Compatibility

Shape compatibility alone is insufficient.

The following are semantic breaks even when JSON remains parseable:

- `score` changes from percentage to raw points;
- `completedAt` changes from authoritative completion time to projection time;
- `status: COMPLETE` gains a materially different lifecycle meaning;
- a command previously idempotent begins creating duplicate effects;
- an error previously retryable becomes permanent without a new code.

Units, time basis, lifecycle meaning, authority, and consistency guarantees are part of the contract.

---

## 7. Request Evolution

### 7.1 Additive fields

A new request field must be optional unless the endpoint or major version is new.

The absence behavior must be documented:

```ts
type StartPracticeSessionRequest = {
  skillId: string;
  preferredDifficulty?: 'FOUNDATION' | 'STANDARD' | 'CHALLENGE';
};
```

The server must distinguish:

- omitted;
- explicitly `null` where supported;
- empty value;
- defaulted value.

### 7.2 Unknown fields

The default policy should be explicit per API surface.

Recommended policy:

- reject unknown fields on command requests where silent mistakes are dangerous;
- tolerate unknown fields in metadata extension objects designed for forward compatibility;
- document strictness in generated schemas and tests.

### 7.3 Validation changes

Tightening validation on previously accepted input may be breaking. Such changes require one of:

- evidence that the input was never valid by documented contract;
- a staged warning and migration period;
- a new command or major API version.

---

## 8. Response Evolution

Clients must ignore unknown response fields unless the contract explicitly states otherwise.

Servers must not:

- remove fields during the supported lifetime;
- change field types;
- change units without a new field;
- repurpose reserved or deprecated fields;
- change nullability without compatibility analysis.

When replacing a field, use an additive transition:

```json
{
  "scorePercent": 84,
  "score": 84
}
```

The legacy field remains until the documented removal boundary.

---

## 9. Enum Evolution

Closed enums are dangerous for long-lived clients.

Each enum must be classified as either:

- **closed** — unknown values indicate an incompatible contract;
- **open** — clients must preserve or safely map unknown values.

For UI-facing status enums, clients should have an unknown fallback rather than crashing.

A new enum value is not automatically compatible when clients use exhaustive branching to determine safety or workflow.

---

## 10. Command Compatibility

A command contract includes:

- route and method;
- identity and authorization rules;
- request DTO;
- idempotency semantics;
- expected-version semantics;
- accepted lifecycle states;
- result shape;
- stable failure codes;
- synchronous or asynchronous completion meaning.

Changing any of these may be breaking even if the endpoint path remains unchanged.

A new business intent should normally be exposed as a new command endpoint rather than overloading an existing command with mode flags.

---

## 11. Query Compatibility

A query contract includes:

- filter semantics;
- default and supported sorting;
- pagination model;
- projection and freshness guarantees;
- visibility and authorization scope;
- field meaning;
- absence and empty-result behavior.

Default ordering must never change silently when clients paginate across pages.

---

## 12. Error Compatibility

Stable error codes are public contract identifiers.

Compatible evolution may add:

- optional diagnostic details;
- new error codes for newly introduced conditions;
- richer trace metadata.

Breaking evolution includes:

- changing the meaning of an existing code;
- replacing a specific code with a generic one;
- changing retryability without a new code or documented transition;
- moving a normal domain conflict into an authentication failure.

---

## 13. Deprecation Lifecycle

Deprecation is a managed state, not a comment in code.

Required lifecycle:

```text
ACTIVE
  → DEPRECATED
  → MIGRATION_WINDOW
  → REMOVAL_ELIGIBLE
  → REMOVED_IN_NEW_MAJOR
```

A deprecation record should contain:

- affected route, field, enum, event, or behavior;
- replacement contract;
- announcement date;
- earliest removal date;
- supported client impact;
- migration examples;
- owner and verification evidence.

Deprecated behavior remains operational until the stated support boundary.

---

## 14. Deprecation Signaling

Where useful, HTTP responses may include standards-aligned headers such as:

```http
Deprecation: true
Sunset: Wed, 31 Dec 2028 23:59:59 GMT
Link: </api/v2/...>; rel="successor-version"
```

Headers supplement documentation; they do not replace direct communication with known clients.

---

## 15. Client Capability Negotiation

Capability negotiation may be used when a full major version is unnecessary.

Examples:

```http
Accept: application/json
X-Client-Capabilities: cursor-pagination,open-status-enum
```

Capabilities must be:

- explicitly named;
- independently testable;
- monotonic where possible;
- safe when omitted;
- retired through the same deprecation process.

Do not use hidden user-agent branching as the primary compatibility mechanism.

---

## 16. Consumer Identity and Support Window

Supported clients should identify themselves using trusted or validated metadata:

- application name;
- application version;
- platform;
- deployment channel;
- optional schema capability set.

This metadata supports observability and migration analysis but must not become an authorization credential.

A support policy should define the minimum supported client versions and the emergency upgrade path.

---

## 17. Event Contract Versioning

Events carry explicit contract identity:

```json
{
  "eventType": "practice-session.completed",
  "eventVersion": 2,
  "eventId": "...",
  "occurredAt": "...",
  "data": {}
}
```

Rules:

- additive optional data may remain in the same event version;
- changed meaning, required data, or removed data requires a new event version;
- consumers must not infer event version solely from deployment date;
- replayed historical events retain their original version;
- upcasters may translate old events for internal consumers but do not rewrite history.

---

## 18. Webhook Compatibility

Webhook providers must assume consumers upgrade slowly.

Each webhook contract must define:

- event type and version;
- signature scheme version;
- retry behavior;
- ordering guarantees;
- duplicate-delivery behavior;
- deprecation window;
- replay and testing mechanism.

A signature algorithm migration should support overlap rather than a single cutover instant.

---

## 19. Database Schema Is Not API Version

Persistence migrations and public API versions are separate concerns.

A database column rename may be deployed without changing the API. Conversely, an API semantic break may require a new version even when the database does not change.

The API layer must not expose persistence schema as an accidental public contract.

---

## 20. Safe Rollout Pattern

Recommended compatible rollout:

```text
1. Add new server capability.
2. Serve old and new contract forms.
3. Deploy clients that understand the new form.
4. Measure adoption and failures.
5. Mark legacy contract deprecated.
6. Complete migration window.
7. Remove only in an allowed major-version boundary.
```

For command behavior changes, dual-write or shadow evaluation may be required, but duplicate business effects must never be introduced.

---

## 21. Emergency Changes

Security or data-integrity incidents may require faster compatibility action.

Emergency response must still record:

- affected contract;
- risk requiring the break;
- temporary client behavior;
- communication path;
- restoration or migration plan;
- post-incident compatibility review.

Security urgency permits accelerated change, not undocumented change.

---

## 22. Compatibility Verification

Required checks include:

- schema diff classification;
- previous-client contract tests;
- consumer-driven contract tests where appropriate;
- golden request and response examples;
- enum unknown-value tests;
- idempotency replay tests;
- pagination stability tests;
- event version replay tests;
- deprecation inventory checks.

CI should fail when a detected breaking change is not explicitly authorized as a new major contract.

---

## 23. Governance Checklist

Before merging an API change, confirm:

- [ ] externally observable changes are identified;
- [ ] compatibility classification is recorded;
- [ ] semantic meaning remains stable;
- [ ] old supported clients are tested;
- [ ] new fields have omission behavior;
- [ ] enum evolution is safe;
- [ ] error codes remain stable;
- [ ] deprecations have a migration path;
- [ ] events retain explicit versions;
- [ ] rollout and rollback are defined.

---

## 24. Completion Standard

Versioning and compatibility design is complete when every public contract can evolve through an explicit, testable, observable process without silently breaking supported clients or changing the business meaning they rely on.