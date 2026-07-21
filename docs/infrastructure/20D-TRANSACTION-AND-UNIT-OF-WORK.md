# 20D — Transaction and Unit of Work

## 1. Purpose

This document defines the transaction and Unit of Work architecture for Math Learning World.

Its purpose is to ensure that every application command has a clear atomic boundary, that aggregate writes are consistent, that concurrency failures are handled predictably, and that side effects are not published before durable state is committed.

## 2. Scope

This document defines:

- transaction ownership;
- Unit of Work responsibilities;
- aggregate loading and persistence rules;
- optimistic concurrency;
- commit and rollback behavior;
- retry policy;
- outbox participation;
- idempotency participation;
- error mapping;
- testing and completion criteria.

## 3. Core Principle

> A business operation either commits all durable state required by the use case, or commits none of it.

Transactions protect application invariants. They are not implementation conveniences and must not be opened casually around unrelated work.

## 4. Ownership

The Application Layer owns the use-case transaction boundary.

The Infrastructure Layer owns the technical implementation of that boundary.

The Domain Layer must remain unaware of Prisma, PostgreSQL transactions, connection objects, isolation levels, or retry mechanisms.

A command handler or application service decides when a transaction is required. Infrastructure provides a Unit of Work port that executes the requested work atomically.

## 5. Unit of Work Port

The application-facing contract should express intent without exposing Prisma types.

```ts
export interface UnitOfWork {
  execute<T>(work: (context: TransactionContext) => Promise<T>): Promise<T>;
}

export interface TransactionContext {
  repositories: TransactionalRepositories;
  outbox: TransactionalOutbox;
  idempotency: TransactionalIdempotencyStore;
}
```

The exact TypeScript shape may evolve, but these rules are mandatory:

- application code does not import Prisma transaction clients;
- repositories participating in one operation share the same transaction context;
- outbox writes use the same transaction;
- durable idempotency completion uses the same transaction where required;
- the transaction context cannot escape its callback lifecycle.

## 6. Transaction Boundary Rules

A transaction should normally map to one application command.

Examples:

- start a learning session;
- submit an answer;
- record mastery evidence;
- grant mentorship credit;
- close a mission;
- consume an inventory item;
- create a learner pathway step.

A transaction must include every write required to preserve the use-case invariant.

A transaction must not include:

- network calls to third-party services;
- email delivery;
- long-running AI inference;
- object uploads;
- user interaction waits;
- unrelated reporting queries;
- arbitrary delays or polling.

External work is requested through durable records or post-commit orchestration.

## 7. Aggregate Rules

Within a transaction:

1. Load the aggregate through its repository.
2. Validate command identity and authorization before mutation where applicable.
3. Execute domain behavior.
4. Persist the aggregate with its expected version.
5. Persist newly raised domain events to the outbox when they cross process boundaries.
6. Commit once.

An aggregate must not be written through multiple repository implementations in the same use case.

The aggregate root is the consistency boundary. Cross-aggregate invariants should be minimized and explicitly documented.

## 8. Optimistic Concurrency

Every mutable aggregate that can receive competing commands must have a version.

The repository write should be conditional on the expected version.

Conceptually:

```sql
UPDATE aggregate_table
SET ..., version = version + 1
WHERE id = $id
  AND version = $expectedVersion;
```

If no row is updated, Infrastructure raises a concurrency conflict rather than silently overwriting newer state.

The application maps that failure to a stable application failure code such as:

```text
CONCURRENCY_CONFLICT
```

The UI may then reload current state and ask the user to retry, or the application may retry automatically only when the operation is proven safe.

## 9. Retry Policy

Automatic retries are permitted only for transient infrastructure failures and only when command semantics remain safe.

Potentially retryable failures include:

- serialization failures;
- deadlocks;
- temporary connection interruption;
- transaction restart requests from PostgreSQL.

Non-retryable failures include:

- domain rule violations;
- authorization failures;
- stale expected version unless explicitly re-evaluated;
- malformed input;
- missing aggregate;
- duplicate command with conflicting payload.

Retry attempts must be bounded, observable, and use backoff.

A default policy should remain conservative, for example:

```text
maximum attempts: 3
backoff: bounded exponential with jitter
```

## 10. Isolation Level

The default isolation level should be selected deliberately based on real invariants.

Recommended baseline:

- use PostgreSQL default behavior for ordinary single-aggregate writes;
- use explicit row locks only when optimistic concurrency is insufficient;
- use serializable transactions only for narrowly defined invariants that require it;
- document every stronger isolation decision.

Higher isolation is not a substitute for clear aggregate boundaries.

## 11. Commit and Rollback

Commit occurs only after all required writes succeed.

Rollback occurs for any uncaught error inside the Unit of Work callback.

Infrastructure must preserve the original cause while mapping database-specific failures into stable infrastructure/application errors.

No success response may be returned before commit succeeds.

No integration event may be treated as published merely because it was created in memory.

## 12. Outbox Participation

When a committed business operation must trigger asynchronous work, the outbox record is written in the same transaction as the aggregate change.

Required fields should include:

- event identifier;
- event type;
- occurred-at timestamp;
- aggregate type and identifier;
- tenant or workspace identifier where applicable;
- correlation and causation identifiers;
- schema version;
- serialized payload;
- publication status and attempt metadata.

The dispatcher publishes only committed outbox rows.

## 13. Idempotency Participation

For commands requiring durable idempotency, the transaction may include:

- reservation of an idempotency key;
- validation of command fingerprint;
- durable result storage;
- completion state update.

A repeated request with the same key and same fingerprint returns the recorded result.

A repeated request with the same key but a different fingerprint fails explicitly.

The system must not equate transport retries with new business intent.

## 14. Nested Transactions

Application code must not create uncontrolled nested transactions.

If work is already inside a Unit of Work, participating repositories use the existing transaction context.

A lower-level repository must never start an independent transaction that can commit before the outer use case.

Savepoints may be used only for a documented technical need. They must not weaken business atomicity.

## 15. Long-Running Workflows

Long-running workflows are not one database transaction.

They must be modeled as:

- explicit state transitions;
- durable workflow or process-manager state;
- idempotent steps;
- compensating actions where required;
- event-driven continuation;
- observable failure and recovery states.

Examples include curriculum import, AI content generation, large report production, and multi-step mentorship settlement.

## 16. Error Taxonomy

Infrastructure should map vendor errors to stable categories:

```text
TRANSACTION_CONFLICT
TRANSACTION_TIMEOUT
DATABASE_UNAVAILABLE
CONSTRAINT_VIOLATION
DUPLICATE_KEY
FOREIGN_KEY_VIOLATION
PERSISTENCE_FAILURE
```

Application code must not branch on raw PostgreSQL codes or Prisma error class names.

Raw details may be logged securely for diagnostics.

## 17. Observability

Each transaction should be traceable through:

- correlation ID;
- command name;
- aggregate identifier where safe;
- duration;
- retry count;
- outcome;
- mapped failure category.

Logs must not expose secrets, credentials, sensitive learner data, or full payloads by default.

Metrics should include transaction latency, rollback rate, concurrency-conflict rate, retry rate, and database-unavailable rate.

## 18. Testing

Required tests include:

- successful multi-write commit;
- rollback when any required write fails;
- optimistic concurrency conflict;
- outbox and aggregate atomicity;
- idempotency result atomicity;
- repository participation in one transaction context;
- transient retry limit;
- non-retry of domain failures;
- error mapping stability;
- tenant/workspace isolation inside transactions.

Tests must use a real PostgreSQL integration environment for behavior that mocks cannot prove.

## 19. Anti-Patterns

The following are prohibited:

- passing Prisma clients into Domain objects;
- starting transactions inside every repository method;
- publishing events before commit;
- holding transactions open during external API calls;
- swallowing concurrency failures;
- retrying all errors indiscriminately;
- mixing unrelated commands in one transaction;
- returning success before commit;
- using transactions to hide poor aggregate design;
- allowing transaction-scoped repositories to escape the callback.

## 20. Completion Criteria

This architecture is satisfied when:

- a technology-neutral Unit of Work port exists;
- one application command has one explicit atomic boundary where needed;
- participating repositories share the same transaction context;
- aggregate writes enforce expected-version concurrency;
- outbox writes can commit atomically with aggregate changes;
- durable idempotency can participate atomically;
- retries are bounded and classified;
- vendor errors are mapped to stable failures;
- transaction behavior is covered by PostgreSQL integration tests;
- no Domain or Application contract depends on Prisma transaction types.

## 21. Decision Summary

Math Learning World will use application-owned transaction boundaries implemented through an Infrastructure Unit of Work. PostgreSQL and Prisma are implementation details. Aggregate persistence, outbox creation, and required idempotency state will commit atomically. Concurrency conflicts will be explicit, retries will be conservative, and long-running workflows will use durable state machines rather than long-lived database transactions.
