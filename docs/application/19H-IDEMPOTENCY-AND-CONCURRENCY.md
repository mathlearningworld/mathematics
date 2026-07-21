# 19H — Idempotency and Concurrency

## 1. Purpose

This document defines the application-layer contract for idempotency and concurrency control in Math Learning World.

It is the Source of Truth for:

- retry safety;
- duplicate request handling;
- idempotency-key ownership;
- optimistic concurrency;
- conflict detection;
- conflict reporting;
- retry policy;
- consistency boundaries;
- testing requirements.

---

## 2. Core Principle

> A retried request must not create an unintended second business effect, and a stale request must not silently overwrite newer state.

Idempotency protects the system from duplicate execution. Concurrency control protects the system from conflicting execution. They solve different problems and must not be treated as interchangeable.

---

## 3. Definitions

### 3.1 Idempotency

An operation is idempotent when repeating the same logical request produces the same accepted business outcome without creating an additional effect.

Examples:

- submitting the same completed mission result twice must not create two completions;
- retrying a credit transfer must not deduct credits twice;
- retrying learner enrollment must not create duplicate membership;
- retrying a parent verification action must not create duplicate verification records.

### 3.2 Concurrency

Concurrency exists when two or more executions operate on state that may change before either execution completes.

Examples:

- two devices submit progress for the same learner and skill;
- two mentors attempt to claim the same reward;
- a parent changes a learning goal while the learner is actively progressing;
- two workers update the same aggregate version.

### 3.3 Duplicate Request

A duplicate request is a repeated delivery of the same logical command, usually caused by:

- network retry;
- client timeout;
- queue redelivery;
- browser resubmission;
- worker restart;
- mobile reconnection.

### 3.4 Concurrent Conflict

A concurrent conflict occurs when an execution attempts to write based on stale state or violates a uniqueness or ownership constraint already changed by another execution.

---

## 4. Idempotency Boundary

Idempotency is owned by the application use case that produces the business effect.

The transport layer may carry an idempotency key, but it must not define the business meaning of duplication.

The application layer must determine:

- which operations require idempotency;
- the scope of the idempotency key;
- how command identity is compared;
- which result is returned for a replay;
- how long the idempotency record remains valid;
- whether a failed attempt may be retried.

---

## 5. Operations That Require Idempotency

Idempotency is required for operations that may be retried and that create externally visible effects, including:

- learner registration and enrollment;
- mission-attempt completion;
- mastery evidence submission;
- parent verification;
- credit grants, transfers, deductions, and redemptions;
- mentorship reward claims;
- purchase or subscription activation;
- event-triggered notifications with durable delivery requirements;
- external-provider callbacks;
- batch imports where a source record has stable identity.

Pure queries do not normally require idempotency because they do not change business state.

---

## 6. Idempotency Key Contract

An idempotency key must be:

- provided by the caller or generated at a trusted boundary;
- stable across retries of the same logical request;
- unique within its defined scope;
- treated as opaque by transport clients;
- persisted durably before the request is acknowledged as complete.

Recommended logical scope:

```text
actor or integration
+ use case
+ tenant or account boundary
+ idempotency key
```

A globally unique key may simplify storage, but global uniqueness must not replace authorization and tenant scoping.

---

## 7. Command Fingerprint

The system must prevent the same idempotency key from being reused for a materially different command.

A command fingerprint should be derived from canonical business-relevant inputs, such as:

- use-case name;
- actor or integration identity;
- target identity;
- normalized command payload;
- tenant or account identity.

Volatile transport fields such as request timestamp, trace ID, or header ordering must not change the fingerprint.

If an existing key is presented with a different fingerprint, the request must fail with an explicit idempotency-key reuse error.

---

## 8. Idempotency Record States

A durable idempotency record should support at least:

```text
IN_PROGRESS
SUCCEEDED
FAILED_RETRYABLE
FAILED_FINAL
```

### IN_PROGRESS

The request has claimed the key and execution is active or its final status is not yet known.

### SUCCEEDED

The business transaction committed successfully. A replay returns the recorded application result or an equivalent stable representation.

### FAILED_RETRYABLE

The execution failed before a business effect was committed and may be attempted again according to policy.

### FAILED_FINAL

The request reached a deterministic final failure. A replay returns the same failure semantics unless policy explicitly permits a new command with a new key.

---

## 9. Idempotent Execution Flow

Recommended flow:

1. Validate the request envelope and idempotency-key format.
2. Establish actor and tenant context.
3. Begin the application transaction.
4. Attempt to claim the idempotency key.
5. If the key already exists, compare command fingerprints.
6. Return the stored result for a completed matching request.
7. Reject a mismatched command using the same key.
8. Reject or safely wait when the matching request remains in progress.
9. Execute authorization, loading, domain behavior, and persistence.
10. Store the final idempotency result in the same transaction as the business effect where possible.
11. Commit once.

The system must not acknowledge success before both the business effect and the replay record are durably recoverable.

---

## 10. Replay Result

A replay should return an application-level result equivalent to the original accepted outcome.

The stored replay result may include:

- result code;
- stable resource identifiers;
- resulting aggregate version;
- accepted timestamp;
- domain outcome summary;
- safe response payload;
- final failure code when deterministic.

Sensitive data and short-lived signed URLs must not be stored blindly in replay records.

---

## 11. Idempotency Retention

Retention must follow business risk rather than an arbitrary HTTP timeout.

Examples:

- financial or credit operations may require long retention;
- external callbacks may require retention aligned with provider retry windows;
- mission submissions may retain keys for the lifetime of the attempt;
- ephemeral low-risk operations may use shorter retention.

Deletion or expiration of idempotency records must not make an operation unsafe to replay.

---

## 12. Optimistic Concurrency

Aggregate writes should use optimistic concurrency by comparing an expected version with the current durable version.

Typical contract:

```ts
interface SaveAggregateOptions {
  expectedVersion: number;
}
```

A successful write increments the aggregate version. A stale expected version must not overwrite current state.

---

## 13. Expected Version Ownership

The expected version may originate from:

- the aggregate version loaded inside the transaction;
- an explicit client precondition when the use case requires user-visible conflict detection;
- a prior application result used by an offline client;
- an event-stream revision.

The application layer owns deciding whether a client-provided version is trusted, required, or ignored.

---

## 14. Concurrency Conflict Handling

A concurrency conflict must be translated into an explicit application failure.

Example failure codes:

```text
CONCURRENCY_CONFLICT
STALE_VERSION
RESOURCE_ALREADY_CHANGED
CLAIM_ALREADY_TAKEN
DUPLICATE_MEMBERSHIP
BALANCE_CHANGED
ATTEMPT_ALREADY_COMPLETED
```

The failure should provide only the information required for safe recovery. It must not leak hidden state or another tenant's data.

---

## 15. Retry Policy

Retries are allowed only when the operation remains semantically safe.

### Automatic retry may be appropriate when:

- the conflict is transient;
- the command can be re-evaluated against fresh state;
- no user decision is required;
- the retry count is bounded;
- the same idempotency identity is preserved.

### Automatic retry must not be used when:

- user intent may have changed;
- the operation depends on a stale displayed value;
- a limited resource was claimed by another actor;
- replaying could create a different business decision;
- authorization context may have changed materially.

Blind retry loops are prohibited.

---

## 16. Pessimistic Locking

Pessimistic locking is permitted only when optimistic concurrency cannot protect the invariant efficiently or safely.

Possible cases:

- allocating a scarce sequential resource;
- claiming a single reward or entitlement;
- updating a balance under strict contention;
- coordinating a short critical section inside one database transaction.

Locks must be:

- narrowly scoped;
- held for the shortest practical duration;
- acquired in a consistent order;
- released by transaction completion;
- covered by timeout and deadlock handling.

Application handlers must not hold database locks while waiting for network calls or user input.

---

## 17. Unique Constraints as Concurrency Guards

Durable unique constraints should enforce invariants that can be represented structurally, such as:

- one membership per learner and classroom;
- one completion per mission attempt;
- one reward claim per entitlement;
- one idempotency record per scope and key;
- one active relationship of a defined type.

The application layer must translate database uniqueness failures into meaningful application outcomes rather than exposing infrastructure errors.

---

## 18. Offline and Multi-device Clients

Offline-capable clients must send stable command identity and any required expected version.

The server remains authoritative.

On reconnection:

- duplicate commands are replayed safely;
- stale commands are rejected explicitly;
- commutative operations may be merged only by an approved business rule;
- conflicting intent must be surfaced for user or policy resolution;
- local timestamps must not determine authoritative ordering by themselves.

---

## 19. Idempotency and Events

Publishing an event more than once can duplicate downstream effects even when the command itself is idempotent.

Therefore:

- durable event publication should use a transactional outbox;
- each published event must have stable identity;
- consumers should be idempotent where duplicate delivery is possible;
- consumer checkpoints or inbox records should be persisted durably;
- event replay must not recreate completed business effects without policy.

---

## 20. Observability

The runtime should record safe operational signals including:

- use-case name;
- idempotency-key hash or safe reference;
- whether execution was original or replayed;
- aggregate identity;
- expected and actual version where safe;
- retry count;
- conflict type;
- final result code;
- correlation and trace identifiers.

Raw secrets and sensitive request payloads must not be logged.

---

## 21. Testing Requirements

Tests must cover:

- first execution success;
- identical replay returns the original outcome;
- same key with different payload is rejected;
- concurrent claims of the same key;
- crash or timeout during in-progress execution;
- deterministic final failure replay;
- optimistic version success;
- stale version rejection;
- bounded safe retry;
- unique-constraint race translation;
- outbox or consumer duplicate delivery;
- tenant isolation of idempotency records.

Concurrency tests must exercise real repository behavior at the Runtime Gate, not only mocked sequential calls.

---

## 22. Anti-patterns

Prohibited patterns include:

- treating every retry as a new command;
- storing idempotency state only in process memory;
- using request IDs as idempotency keys without stable retry semantics;
- accepting the same key with different payloads;
- acknowledging success before durable replay state exists;
- swallowing concurrency conflicts;
- last-write-wins for protected aggregate state;
- unbounded automatic retries;
- holding locks across external calls;
- relying only on pre-checks without durable constraints;
- exposing raw database conflict errors.

---

## 23. Completion Criteria

This contract is satisfied when:

- retry-sensitive commands declare an idempotency policy;
- duplicate requests cannot create repeated effects;
- key reuse with different intent is rejected;
- aggregate writes enforce expected-version semantics where required;
- conflicts are translated into explicit application failures;
- retries are bounded and policy-driven;
- event delivery is duplicate-safe;
- tenant isolation is preserved;
- runtime concurrency behavior is verified with durable infrastructure.