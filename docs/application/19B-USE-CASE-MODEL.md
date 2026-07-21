# 19B — Use Case Model

## 1. Purpose

This document defines the Application Use Case Model for Math Learning World.

A use case is the executable expression of one user or system intent. It coordinates application concerns, invokes domain behavior, and returns an explicit outcome without owning domain rules.

This document is the Source of Truth for:

- use-case boundaries;
- input and output contracts;
- orchestration responsibilities;
- command/query separation;
- dependency direction;
- failure semantics;
- transaction expectations;
- observability and testing requirements.

---

## 2. Core Principle

> One use case represents one meaningful application intent and one explicit execution contract.

A use case must not be a general-purpose service with unrelated methods. It must be named after an action or question meaningful to the product.

Examples:

- StartLearningMission
- SubmitLearningAttempt
- CompleteLearningMission
- EvaluateMasteryProgress
- AssignMentorSupport
- GetLearnerDashboard
- GetSkillProgress

---

## 3. Scope

The Use Case Model covers:

- actor and tenant context;
- use-case input;
- authorization preconditions;
- application validation;
- repository access;
- domain invocation;
- transaction coordination;
- idempotency and concurrency participation;
- event collection and publication handoff;
- output mapping;
- explicit application failures.

It does not define:

- HTTP routing;
- UI navigation;
- database schemas;
- ORM queries;
- domain invariants;
- message-broker implementation;
- external provider implementation.

---

## 4. Use Case Anatomy

Every use case must have an explicit contract containing:

1. Name
2. Intent
3. Actor context
4. Tenant or workspace context where applicable
5. Input type
6. Output type
7. Failure contract
8. Dependencies
9. Transaction expectation
10. Idempotency expectation
11. Authorization requirement
12. Observability metadata

Recommended shape:

```ts
export interface UseCase<I, O> {
  execute(input: I, context: ExecutionContext): Promise<O>;
}
```

The exact programming form may differ, but the architectural contract must remain explicit.

---

## 5. Execution Context

Execution context carries application-level facts that must not be hidden in global state.

Typical fields:

```ts
interface ExecutionContext {
  actorId: string;
  tenantId?: string;
  correlationId: string;
  causationId?: string;
  idempotencyKey?: string;
  requestedAt: string;
}
```

Rules:

- context must be supplied explicitly;
- actor identity must not be inferred from a repository;
- correlation identity must remain stable across one execution;
- domain objects must not depend on transport-specific request objects;
- time-sensitive domain behavior must receive an approved clock or timestamp.

---

## 6. Use Case Categories

### 6.1 Command Use Cases

Command use cases request a state change.

They may:

- load aggregates;
- invoke domain behavior;
- persist changes;
- emit domain or integration events;
- return identifiers, versions, status, or confirmation data.

They must not return arbitrary read-model projections as their primary purpose.

### 6.2 Query Use Cases

Query use cases answer a question without changing business state.

They may:

- read projections;
- compose data from approved read ports;
- apply visibility and authorization constraints;
- return presentation-ready application DTOs.

They must not mutate aggregates, create domain events, or write through repositories.

### 6.3 Process Use Cases

Long-running or multi-step workflows may be represented as process use cases when one synchronous transaction is not appropriate.

They must expose:

- current process state;
- accepted next transitions;
- retry behavior;
- compensation or recovery behavior;
- durable correlation identity.

---

## 7. Orchestration Rules

A use case may orchestrate:

1. application validation;
2. authorization;
3. idempotency lookup;
4. repository loading;
5. domain method invocation;
6. persistence;
7. transaction commit;
8. event handoff;
9. result mapping.

A use case must not:

- calculate mastery rules directly;
- decide domain state transitions outside aggregates or domain services;
- duplicate value-object validation;
- manipulate ORM models as domain objects;
- call controllers or UI components;
- hide cross-aggregate writes without a transaction or process boundary.

---

## 8. Input Contracts

Use-case inputs must be transport-neutral and immutable in intent.

Good:

```ts
interface SubmitLearningAttemptInput {
  learnerId: string;
  missionId: string;
  answerPayload: unknown;
  attemptId: string;
  expectedMissionVersion?: number;
}
```

Forbidden:

```ts
execute(req: Express.Request)
```

Rules:

- no HTTP request or response types;
- no ORM entities;
- no UI component state;
- primitive values must be converted to domain value objects at the appropriate boundary;
- optional fields must have explicit semantics.

---

## 9. Output Contracts

Outputs must communicate the result of the intent clearly.

Command outputs should prefer:

- aggregate or operation identifier;
- resulting lifecycle state;
- version;
- effective timestamp;
- accepted duplicate indicator where idempotency applies.

Query outputs may contain application DTOs designed for the requesting surface.

Outputs must not expose:

- ORM records;
- internal event envelopes;
- repository implementation types;
- secret authorization data;
- mutable domain object references.

---

## 10. Failure Model

Every use case must define stable, machine-readable failures.

Failure categories include:

- INVALID_INPUT
- UNAUTHENTICATED
- UNAUTHORIZED
- NOT_FOUND
- CONFLICT
- PRECONDITION_FAILED
- IDEMPOTENCY_CONFLICT
- CONCURRENCY_CONFLICT
- DEPENDENCY_UNAVAILABLE
- INTERNAL_FAILURE

Domain failures must be translated without losing their meaning.

A use case must not expose raw database, framework, or provider exceptions as its public contract.

---

## 11. Transaction Model

A command use case defines the expected atomic boundary.

Default rule:

> One command use case executes within one application transaction unless the workflow is explicitly modeled as a durable process.

The transaction should include:

- required aggregate reads;
- domain execution;
- durable writes;
- outbox or equivalent event persistence where required.

External network calls should normally occur outside the database transaction unless a documented consistency requirement justifies otherwise.

---

## 12. Idempotency and Concurrency

Use cases that may be retried must declare idempotency behavior.

Use cases that update existing state must declare concurrency behavior.

Possible strategies:

- client-generated operation ID;
- idempotency key;
- expected aggregate version;
- unique business key;
- process-state transition guard.

A duplicate request must never create duplicate learning attempts, rewards, credits, mentorship events, or mission completions.

---

## 13. Authorization

Authorization belongs before protected domain state is disclosed or changed.

The use case must verify:

- who the actor is;
- which tenant, family, classroom, or learning context is targeted;
- whether the actor may execute the requested intent;
- whether the actor may access the resulting data.

Authorization must not be implemented only in the controller or UI.

---

## 14. Dependency Rules

Use cases may depend on application ports such as:

- repositories;
- unit of work;
- clock;
- identity generator;
- authorization service;
- idempotency store;
- event publisher or outbox;
- read-model gateway;
- external-service ports.

Use cases must depend on abstractions owned by the application or domain layer, never directly on frameworks or concrete infrastructure.

---

## 15. Naming Rules

Use command-oriented verbs for state-changing use cases:

- Start
- Submit
- Complete
- Assign
- Revoke
- Record
- Evaluate
- Confirm

Use question-oriented names for queries:

- Get
- List
- Find
- Search
- Resolve

Avoid vague names such as:

- ProcessData
- HandleRequest
- ManageLearning
- LearningService
- ExecuteAction

---

## 16. Reference Execution Flow

```text
Transport Adapter
  -> map request to use-case input
  -> execute use case with context
      -> validate application preconditions
      -> authorize actor
      -> check idempotency
      -> begin transaction
      -> load aggregate(s)
      -> invoke domain behavior
      -> persist changes
      -> persist events/outbox
      -> commit transaction
      -> map result
  -> map application result to transport response
```

---

## 17. Testing Strategy

Each use case must have tests for:

- successful execution;
- invalid application input;
- authorization rejection;
- missing aggregate or projection;
- relevant domain rejection;
- concurrency conflict;
- duplicate retry behavior;
- dependency failure mapping;
- transaction rollback;
- output contract stability.

Tests should use fake or in-memory ports where possible and must not require HTTP to verify application behavior.

---

## 18. Anti-Patterns

Forbidden patterns include:

- one application service containing dozens of unrelated actions;
- domain rules embedded in handlers;
- command handlers returning unrestricted database models;
- query handlers changing state;
- controllers coordinating repositories directly;
- hidden global actor or tenant context;
- silent exception swallowing;
- retries without idempotency protection;
- multiple aggregate writes without an explicit consistency model;
- use cases named after screens instead of user intent.

---

## 19. Completion Criteria

A use case is architecturally complete when:

- its intent is singular and explicit;
- input, output, and failure contracts are defined;
- actor and context requirements are explicit;
- authorization ownership is clear;
- transaction, idempotency, and concurrency expectations are declared;
- dependencies are represented as ports;
- domain rules remain in the domain layer;
- tests cover success and meaningful failures;
- no transport or infrastructure implementation leaks into the contract.
