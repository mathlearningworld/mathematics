# 19E — Transactions

## 1. Purpose

This document defines the transaction model for the Math Learning World application layer.

A transaction protects one application use case from partial persistence. It establishes the atomic boundary within which authoritative state is loaded, changed, validated, and committed.

This document is the Source of Truth for:

- transaction ownership;
- unit-of-work boundaries;
- commit and rollback rules;
- repository participation;
- aggregate consistency;
- concurrency failures;
- external side effects;
- retries;
- observability;
- transaction testing.

---

## 2. Core Principle

> One command execution owns one explicit transaction boundary unless the use case is deliberately modeled as a long-running process.

A transaction must be large enough to preserve the business invariant and small enough to avoid unnecessary lock duration, contention, and hidden coupling.

---

## 3. Transaction Ownership

The application layer owns transaction orchestration.

The domain layer defines invariants but does not open, commit, or roll back database transactions.

Infrastructure provides the transaction mechanism, repository implementations, and unit-of-work adapter.

Presentation starts a use case but must not control persistence transactions.

```text
Presentation
  -> Application command handler
      -> Unit of Work begins
          -> Repositories load state
          -> Domain executes behavior
          -> Repositories stage changes
      -> Unit of Work commits or rolls back
  <- Application result
```

---

## 4. Default Boundary

For a normal state-changing command, the transaction begins after request-shape validation and authorization context resolution, but before authoritative mutable state is loaded.

The transaction ends only after:

1. required aggregates are loaded;
2. domain behavior succeeds;
3. changed aggregates are persisted;
4. application-owned durable records are written;
5. the transaction commit succeeds.

The command must not report success before commit.

---

## 5. What Belongs Inside the Transaction

The following normally belong inside one transaction:

- loading aggregates whose state participates in the invariant;
- verifying expected versions;
- executing domain methods;
- persisting aggregate changes;
- writing idempotency completion state;
- storing outbox messages;
- recording durable audit facts required by the use case;
- allocating unique business identifiers when database coordination is required.

Only operations required for atomic correctness should be included.

---

## 6. What Must Remain Outside

The following must not normally occur while the database transaction is open:

- sending email;
- delivering push notifications;
- calling payment or third-party APIs;
- uploading large files;
- running long calculations;
- waiting for human input;
- executing unrelated queries;
- invoking another service over the network.

These operations increase transaction duration and cannot reliably participate in the same atomic commit.

External effects must be coordinated through durable messages, an outbox, or an explicit process manager.

---

## 7. Unit of Work Contract

The application layer depends on an abstract unit-of-work contract.

```ts
interface UnitOfWork {
  execute<T>(work: (context: TransactionContext) => Promise<T>): Promise<T>;
}

interface TransactionContext {
  learners: LearnerRepository;
  skillProgress: SkillProgressRepository;
  missionAttempts: MissionAttemptRepository;
  credits: CreditRepository;
  outbox: OutboxRepository;
}
```

The exact interface may evolve, but application code must not depend directly on Prisma transaction objects or database-client details.

---

## 8. Repository Participation

Repositories used within a transaction must share the same transaction context.

A handler must not:

- load through a transaction-bound repository and save through a global repository;
- mix transactional and non-transactional writes for the same use case;
- construct repository implementations directly;
- leak the transaction client into domain objects;
- perform hidden auto-commits.

Repository contracts remain domain-facing. Transaction binding is an infrastructure concern supplied through the unit of work.

---

## 9. Aggregate Boundary Rule

An aggregate is the primary consistency boundary.

A command should normally modify one aggregate. Multiple aggregate writes are permitted only when the use-case invariant truly requires atomic coordination.

Before introducing a multi-aggregate transaction, evaluate whether the behavior should instead use:

- a domain event;
- an application event;
- an outbox message;
- a saga or process manager;
- eventual consistency;
- a separate compensating command.

Convenience is not sufficient justification for a multi-aggregate transaction.

---

## 10. Commit Rules

Commit occurs only after all required work succeeds.

A successful commit means:

- all authoritative writes are durable;
- optimistic version checks passed;
- required outbox records are durable;
- idempotency state is consistent with the result;
- the handler may return success.

Commit failure is a command failure. The application must not fabricate a successful result from in-memory state.

---

## 11. Rollback Rules

Any unhandled failure inside the unit of work must roll back the complete transaction.

Rollback is required for:

- domain rule rejection after partial staging;
- repository write failure;
- optimistic concurrency conflict;
- required audit write failure;
- outbox persistence failure;
- unexpected infrastructure exception.

Rollback removes database effects from that attempt. It does not reverse external effects that were incorrectly executed before commit; therefore such effects must remain outside the transaction.

---

## 12. Nested Transactions

Application handlers must not create implicit nested transactions.

An application service called from an active command must participate in the existing transaction context rather than opening a new independent transaction.

If a nested use case requires an independent commit, it is a separate use case and must be invoked through an explicit asynchronous or process boundary.

Savepoints may be used by infrastructure only when an approved use case explicitly requires them. They must not become a general mechanism for hiding poor boundaries.

---

## 13. Optimistic Concurrency

Mutable aggregate persistence should use optimistic concurrency where concurrent updates are possible.

The repository compares the expected aggregate version with the stored version. A mismatch produces an explicit concurrency failure.

```text
load version 7
execute behavior
save expected version 7
stored version is 8
=> reject with concurrency conflict
```

The application must distinguish concurrency conflict from validation, authorization, and not-found failures.

---

## 14. Retry Policy

Retries are allowed only for failures proven to be transient and only when command semantics are safe to repeat.

Safe retry requires:

- an idempotency strategy where duplication is possible;
- bounded attempt count;
- backoff or jitter where appropriate;
- no external side effect before durable commit;
- preserved correlation and causation identifiers.

Domain rejection, authorization denial, and deterministic validation failure must not be retried automatically.

Concurrency conflicts are not blindly retried. The use case must define whether to reload and re-evaluate or return a conflict to the caller.

---

## 15. Isolation Expectations

The infrastructure adapter selects the database isolation level required by the invariant.

The default should be the least restrictive level that still preserves correctness.

Stronger isolation may be required for:

- unique allocation;
- balance-like updates;
- ordering guarantees;
- competing claims;
- eligibility checks coupled to writes.

Isolation choice must be documented when correctness depends on behavior stronger than the platform default.

---

## 16. Long-Running Workflows

A workflow involving multiple commits, external systems, or human delay is not one database transaction.

It must be represented as durable state transitions such as:

```text
REQUESTED
-> ACCEPTED
-> PROCESSING
-> COMPLETED
```

or explicit failure and recovery states.

Each transition is its own transaction. Process continuity is maintained through durable state, events, and idempotent handlers.

---

## 17. Transaction and Events

Domain events may be collected during aggregate execution.

Events required for reliable downstream processing must be written to an outbox in the same transaction as the aggregate state change.

Publishing to an external broker occurs after commit.

```text
Transaction:
  persist aggregate
  persist outbox record
  commit

After commit:
  publisher reads outbox
  publishes event
  marks delivery state
```

An event must not be externally published before the state it describes is durable.

---

## 18. Idempotency Interaction

When a command uses an idempotency key, the durable idempotency record must be transactionally consistent with the authoritative state change.

The system must not produce either of these states:

- business change committed but idempotency result missing;
- idempotency success recorded but business change rolled back.

Detailed idempotency policy is defined in 19H.

---

## 19. Failure Mapping

Infrastructure transaction failures must be translated into stable application failures.

Expected categories include:

- `CONCURRENCY_CONFLICT`;
- `TRANSIENT_TRANSACTION_FAILURE`;
- `TRANSACTION_TIMEOUT`;
- `PERSISTENCE_FAILURE`;
- `DUPLICATE_CONSTRAINT` when meaningful to the use case.

Raw database messages, SQL fragments, and Prisma errors must not cross the application boundary.

---

## 20. Observability

Each transaction execution should record structured telemetry containing:

- use-case name;
- command identifier;
- correlation identifier;
- tenant or workspace identifier where applicable;
- transaction duration;
- commit or rollback outcome;
- retry count;
- failure category;
- aggregate types involved.

Sensitive payloads and learner data must not be placed in logs without an explicit privacy-safe policy.

---

## 21. Testing Strategy

Transaction tests must prove:

1. successful commands commit all required writes;
2. failure after staging causes complete rollback;
3. repositories share one transaction context;
4. outbox and aggregate state commit atomically;
5. optimistic conflicts are surfaced correctly;
6. external effects do not occur before commit;
7. retry policies are bounded and classification-aware;
8. nested application calls do not open independent hidden transactions.

Integration tests are required for database-specific transaction behavior. Unit tests alone cannot certify transaction correctness.

---

## 22. Anti-Patterns

The following are prohibited:

- transactions controlled by HTTP controllers;
- database clients passed into domain entities;
- one transaction spanning user interaction;
- network calls inside an open database transaction;
- handlers returning success before commit;
- catch-and-ignore commit failures;
- hidden repository auto-commit behavior;
- global transaction state;
- automatic retry of every exception;
- using one large transaction to compensate for unclear aggregate boundaries.

---

## 23. Completion Criteria

The transaction architecture is complete when:

- every state-changing use case has an explicit boundary;
- application code depends on a unit-of-work abstraction;
- participating repositories share one context;
- commit and rollback behavior is deterministic;
- concurrency failures are explicit;
- reliable events use transactional outbox persistence;
- external side effects occur after commit;
- long-running workflows use durable transitions;
- integration tests prove atomic behavior.

---

## 24. Final Rule

> Transaction boundaries follow business consistency boundaries, not controller methods, repository calls, or technical convenience.
