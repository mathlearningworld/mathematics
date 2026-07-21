# 19C — Commands and Command Handlers

## 1. Purpose

This document defines the architectural contract for commands and command handlers in Math Learning World.

A command expresses a request to change application state. A command handler coordinates the execution of that request through the application and domain layers.

This document is the Source of Truth for:

- command semantics;
- command contract design;
- handler responsibilities;
- command naming;
- command validation;
- transaction and persistence behavior;
- idempotency and concurrency expectations;
- command results and failures;
- command testing.

---

## 2. Core Principle

> A command states an intent. A handler coordinates the intent. The domain decides whether the change is valid.

Commands must not contain executable business logic. Handlers must not duplicate domain invariants.

---

## 3. Command Definition

A command is an immutable application message describing one requested state transition.

Examples:

- StartLearningMissionCommand
- SubmitLearningAttemptCommand
- CompleteLearningMissionCommand
- RecordMasteryEvidenceCommand
- AssignMentorCommand
- AwardLearningCreditCommand

A command is not:

- a database update object;
- an HTTP request;
- a UI form model;
- a generic dictionary of fields;
- a domain entity;
- a query disguised as a command.

---

## 4. Command Shape

A command should include only facts required to express the intent.

Example:

```ts
interface SubmitLearningAttemptCommand {
  attemptId: string;
  learnerId: string;
  missionId: string;
  response: unknown;
  expectedMissionVersion?: number;
}
```

Execution metadata belongs in the execution context unless it is part of the business intent.

Examples of metadata that usually remain outside the command:

- actorId;
- tenantId;
- correlationId;
- idempotencyKey;
- request timestamp;
- trace metadata.

---

## 5. Command Naming

Commands must use imperative, domain-meaningful names.

Preferred verbs:

- Start
- Submit
- Complete
- Record
- Assign
- Unassign
- Approve
- Reject
- Confirm
- Revoke
- Award
- Consume
- Reset

Avoid:

- UpdateData
- SaveRecord
- ProcessRequest
- HandleAction
- ModifyEntity

The name should reveal the intended domain outcome, not the persistence operation.

---

## 6. Command Handler Contract

A command handler executes exactly one command type.

Recommended shape:

```ts
interface CommandHandler<C, R> {
  execute(command: C, context: ExecutionContext): Promise<R>;
}
```

A handler may:

1. validate application-level input;
2. authorize the actor;
3. check idempotency;
4. begin or join a transaction;
5. load required aggregate roots;
6. invoke domain behavior;
7. persist aggregate changes;
8. persist domain events through an outbox or equivalent mechanism;
9. commit the transaction;
10. return an explicit command result.

A handler must not:

- contain core business rules;
- directly manipulate database rows;
- accept framework request objects;
- call UI code;
- publish events before durable commit when atomicity is required;
- return mutable aggregate instances.

---

## 7. Validation Layers

Command execution may involve multiple validation layers.

### 7.1 Shape Validation

Ensures required fields and primitive formats are present.

Examples:

- non-empty IDs;
- supported enum values;
- valid timestamp format;
- payload size constraints.

### 7.2 Application Validation

Checks execution preconditions requiring application context.

Examples:

- referenced learner exists;
- mission is accessible in the current tenant;
- required external configuration is present;
- actor context is complete.

### 7.3 Domain Validation

Occurs inside value objects, entities, aggregates, specifications, policies, or domain services.

Examples:

- mission can accept another attempt;
- mastery transition is legal;
- credit cannot become negative;
- mentor assignment satisfies domain policy.

Handlers must not reimplement domain validation.

---

## 8. Loading Aggregates

Handlers must load aggregate roots through repository contracts.

Rules:

- load only aggregates required by the command;
- respect tenant and actor boundaries;
- fail explicitly when required state is missing;
- do not expose ORM models to the domain;
- use expected-version information where optimistic concurrency applies;
- avoid loading large unrelated graphs.

Child entities must be changed through their aggregate root unless the domain model explicitly defines another boundary.

---

## 9. Invoking Domain Behavior

Handlers should invoke behavior-rich domain methods.

Preferred:

```ts
mission.submitAttempt(attempt, submittedAt);
```

Forbidden:

```ts
mission.status = "COMPLETED";
mission.attemptCount += 1;
```

The domain method must own lifecycle transitions and invariant enforcement.

---

## 10. Command Results

Command results should be small, explicit, and stable.

Example:

```ts
interface SubmitLearningAttemptResult {
  attemptId: string;
  missionId: string;
  missionVersion: number;
  missionStatus: string;
  acceptedAt: string;
  duplicate: boolean;
}
```

Command results may include:

- identifiers;
- resulting status;
- resulting version;
- effective timestamp;
- idempotency status;
- next-action hint when it is part of the application contract.

Command results must not include:

- unrestricted aggregate internals;
- ORM entities;
- database connection state;
- framework response objects;
- unpublished event envelopes.

---

## 11. Failure Contracts

Handlers must return or raise stable application failures.

Common failures:

- COMMAND_INVALID
- ACTOR_UNAUTHENTICATED
- COMMAND_FORBIDDEN
- TARGET_NOT_FOUND
- DOMAIN_PRECONDITION_FAILED
- IDEMPOTENCY_CONFLICT
- CONCURRENCY_CONFLICT
- DEPENDENCY_UNAVAILABLE
- TRANSACTION_FAILED

Failures must include enough context for safe diagnosis without exposing secrets or infrastructure internals.

Recommended fields:

```ts
interface ApplicationFailure {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}
```

---

## 12. Transactions

Each command handler must declare its transaction boundary.

Default execution:

```text
begin transaction
  load aggregate
  execute domain behavior
  save aggregate
  save outbox events
commit transaction
```

On failure:

```text
rollback transaction
return explicit failure
```

Handlers must not leave partial durable state.

Cross-aggregate changes must use one of:

- one transaction when boundaries and scale permit;
- a domain service plus one transaction;
- a durable process manager or saga when atomicity cannot span the workflow.

---

## 13. Idempotency

Commands likely to be retried must have an idempotency strategy.

Examples:

- submit attempt;
- complete mission;
- award credit;
- create mentorship event;
- confirm parent verification;
- process payment-linked remediation access.

A handler must distinguish:

- exact retry of an already accepted command;
- conflicting reuse of an idempotency key;
- new command with a new key.

Exact retries should return the prior accepted result where possible.

---

## 14. Optimistic Concurrency

Commands updating existing aggregates should use expected versions when concurrent change matters.

On version mismatch, the handler must return `CONCURRENCY_CONFLICT` rather than silently overwriting newer state.

Automatic retries are allowed only when:

- the command is idempotent;
- the domain operation remains semantically safe;
- retry count is bounded;
- observability captures the retry.

---

## 15. Domain Events

Handlers collect domain events produced during execution.

Rules:

- the domain creates domain events;
- the handler does not invent events that represent domain facts it did not execute;
- events requiring reliable publication must be persisted atomically with state changes;
- event publication must not make the transaction appear successful before durable commit;
- duplicate publication must be safe for consumers.

---

## 16. External Dependencies

Handlers may call external-service ports when necessary, but must preserve consistency.

Preferred sequence:

1. perform required external read before transaction if safe;
2. begin transaction;
3. execute domain change;
4. persist state and outbox;
5. commit;
6. trigger external side effect asynchronously.

Direct external side effects inside a database transaction require explicit architectural justification.

---

## 17. Command Routing

Command dispatch may be direct or mediated by a command bus.

A command bus is optional.

It is justified when the system needs consistent cross-cutting behavior such as:

- logging;
- tracing;
- authorization middleware;
- transaction middleware;
- validation middleware;
- metrics;
- idempotency middleware.

A command bus must not hide command ownership or make handler discovery difficult.

---

## 18. Observability

Every command execution should record:

- command type;
- correlation ID;
- actor ID or safe actor reference;
- tenant ID where applicable;
- result status;
- duration;
- retry count;
- conflict or failure code;
- resulting aggregate ID and version where safe.

Sensitive learning responses, credentials, and personal data must not be logged by default.

---

## 19. Testing Strategy

Each command handler must test:

- successful state transition;
- malformed command;
- unauthorized actor;
- missing target;
- domain rejection;
- idempotent retry;
- conflicting idempotency key reuse;
- optimistic concurrency conflict;
- persistence failure;
- rollback behavior;
- outbox persistence;
- stable result mapping.

Tests should assert observable outcomes rather than private implementation order unless ordering is part of the contract.

---

## 20. Anti-Patterns

Forbidden patterns include:

- one handler processing multiple unrelated command types;
- command fields mirroring database columns;
- generic UpdateEntityCommand;
- handlers changing aggregate properties directly;
- handlers that both mutate and return large dashboards;
- event publication before durable state commit;
- silent overwrite on version mismatch;
- retry without idempotency;
- controller-managed transactions;
- framework decorators leaking into domain contracts.

---

## 21. Completion Criteria

A command and handler are complete when:

- the command expresses one meaningful intent;
- command fields are transport-neutral;
- handler ownership is singular;
- application and domain validation are correctly separated;
- authorization is enforced;
- transaction behavior is explicit;
- persistence occurs through ports;
- idempotency and concurrency behavior are declared;
- result and failure contracts are stable;
- domain events are handled consistently;
- tests cover success, rejection, retry, conflict, and rollback paths.
