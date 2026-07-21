# 19F — Application Services

## 1. Purpose

This document defines the role, boundaries, and design rules of application services in Math Learning World.

Application services coordinate use-case execution. They translate an approved application request into domain operations, repository interactions, transaction participation, and an explicit application result.

This document is the Source of Truth for:

- application-service responsibilities;
- orchestration boundaries;
- dependency rules;
- command and query coordination;
- interaction with domain services;
- transaction participation;
- failure mapping;
- observability;
- service testing.

---

## 2. Core Principle

> An application service coordinates business work but does not own the business truth.

Business rules belong in aggregates, entities, value objects, domain services, policies, and specifications. Application services decide when and in what order those domain capabilities are invoked for one use case.

---

## 3. Definition

An application service is an application-layer component that exposes one or more cohesive use-case operations.

It may:

- accept a command or query;
- validate application-level prerequisites;
- resolve actor and tenant context;
- invoke authorization policies;
- load aggregates or read models;
- call domain behavior;
- coordinate repositories;
- participate in a unit of work;
- persist changes;
- return a stable result;
- map known failures into application failure contracts.

It must not become a generic container for all business logic.

---

## 4. Application Service vs Command Handler

A command handler may itself be the application service when the use case is small and isolated.

For larger features, a thin handler may delegate to a named application service.

Both designs are valid when they preserve the same boundary:

```text
Command
  -> Command Handler
      -> Application Service
          -> Domain + Repositories + Unit of Work
```

or:

```text
Command
  -> Command Handler as Application Service
      -> Domain + Repositories + Unit of Work
```

The architecture must avoid duplicate orchestration split arbitrarily across both handler and service.

---

## 5. Service Scope

An application service should be organized around a cohesive capability or workflow, not around a database table.

Good examples:

- `MissionAttemptApplicationService`;
- `LearnerProgressApplicationService`;
- `MentorshipApplicationService`;
- `CreditApplicationService`;
- `CurriculumPlanningApplicationService`.

Weak examples:

- `DatabaseService`;
- `CommonService`;
- `HelperService`;
- `CrudService`;
- one global `ApplicationService`.

A service name should communicate which application capability it coordinates.

---

## 6. Service Contract

Application-service methods must expose explicit input and output contracts.

```ts
interface CompleteMissionAttemptInput {
  attemptId: string;
  learnerId: string;
  submittedAnswers: SubmittedAnswerInput[];
  expectedVersion: number;
}

interface CompleteMissionAttemptResult {
  attemptId: string;
  status: "COMPLETED";
  score: number;
  masteryChanges: MasteryChangeView[];
}

interface MissionAttemptApplicationService {
  completeAttempt(
    input: CompleteMissionAttemptInput,
    context: ApplicationExecutionContext,
  ): Promise<CompleteMissionAttemptResult>;
}
```

Contracts must not expose ORM models, Prisma types, HTTP request objects, or mutable domain internals.

---

## 7. Execution Context

Cross-cutting request facts should be carried in an explicit execution context.

```ts
interface ApplicationExecutionContext {
  actorId: string;
  actorType: ActorType;
  tenantId?: string;
  correlationId: string;
  causationId?: string;
  idempotencyKey?: string;
  requestedAt: Date;
}
```

The context contains execution facts, not hidden service dependencies.

Application services must not read actor identity from global state or framework-specific request singletons.

---

## 8. Standard Command Flow

A state-changing application service should normally follow this order:

1. validate command shape and required context;
2. resolve authorization scope;
3. begin or join the unit of work;
4. load authoritative state;
5. verify existence and expected version;
6. invoke domain behavior;
7. persist changed aggregates and durable application records;
8. commit;
9. return an explicit result;
10. arrange post-commit effects through durable events.

This order may vary only when the use case documents a stronger reason.

---

## 9. Standard Query Flow

A query-oriented application service should normally:

1. validate query shape;
2. resolve visibility and authorization scope;
3. call an approved read repository or projection;
4. apply application-level redaction or presentation-neutral visibility rules;
5. return an explicit read model.

Queries must not invoke hidden state-changing workflows.

---

## 10. Domain Interaction

Application services may invoke:

- aggregate methods;
- entity behavior through aggregate roots;
- value-object factories;
- domain services;
- policies;
- specifications;
- domain factories.

They must not reproduce domain decisions with imperative condition chains.

Bad:

```ts
if (progress.score >= 80 && progress.attempts >= 3) {
  progress.status = "MASTERED";
}
```

Preferred:

```ts
progress.recordEvidence(evidence, masteryPolicy);
```

The application service supplies collaborators and coordinates execution; the domain decides the valid state transition.

---

## 11. Repository Interaction

Application services depend on repository contracts, never concrete persistence implementations.

Repositories are used for:

- loading aggregate roots;
- persisting aggregate state;
- loading application read models through dedicated query interfaces;
- checking application prerequisites that do not belong inside one aggregate;
- writing durable process or idempotency records.

A service must not embed SQL, Prisma queries, or storage-specific filters.

---

## 12. Transaction Participation

State-changing application services must execute within the transaction model defined in 19E.

A service must either:

- own the transaction because it is the top-level use case; or
- receive and use an existing transaction context because it is an internal collaborator.

It must not silently open an independent nested transaction.

---

## 13. Coordination Across Aggregates

When a use case touches multiple aggregates, the application service coordinates them while respecting aggregate independence.

It should:

- load only the aggregates required by the invariant;
- invoke behavior on each aggregate through its public API;
- avoid direct cross-aggregate mutation;
- use identifiers rather than object references across aggregate boundaries;
- prefer events and eventual consistency when atomicity is not required.

Cross-aggregate orchestration belongs here only when it represents one approved application use case.

---

## 14. Domain Service vs Application Service

A domain service expresses domain logic that does not naturally belong to one entity or aggregate.

An application service coordinates execution around infrastructure and use-case boundaries.

| Concern | Domain Service | Application Service |
|---|---|---|
| Owns business decision | Yes | No |
| Loads repositories | No | Yes |
| Opens transaction | No | Yes or joins one |
| Knows actor context | Usually no | Yes |
| Maps application failures | No | Yes |
| Calls external gateways | Through abstract domain need only when modeled | Coordinates through ports |

A service must not be labeled “domain” merely because it contains business-sounding code.

---

## 15. External Gateway Interaction

Application services may coordinate external capabilities through ports such as:

- clock;
- identifier generator;
- notification request publisher;
- file metadata gateway;
- curriculum import gateway;
- payment or billing port;
- analytics event port.

Concrete SDKs and network clients remain in infrastructure.

External effects that cannot join the database transaction must follow post-commit or durable-process rules.

---

## 16. Time and Identity

Application services must not call system time or random UUID generation directly when those values affect business behavior or testing.

Use explicit ports:

```ts
interface Clock {
  now(): Date;
}

interface IdGenerator {
  next(): string;
}
```

Generated values should be passed into domain factories or aggregate methods when they form part of domain state.

---

## 17. Application Validation

Application services enforce application-level validation, including:

- required execution context;
- command/query contract shape;
- route identity matching command identity;
- expected-version presence where required;
- idempotency-key requirements;
- existence of referenced application resources;
- approved request limits.

Domain invariants remain in the domain layer. Detailed validation policy is defined in 19J.

---

## 18. Authorization

Authorization is evaluated before protected information or mutable state is exposed beyond what is needed for the decision.

Application services must:

- pass explicit actor context;
- invoke the approved authorization policy;
- preserve tenant/workspace boundaries;
- deny by default;
- avoid trusting client-supplied role labels;
- distinguish authentication from authorization.

Detailed authorization policy is defined in 19G.

---

## 19. Idempotency and Concurrency

Where a use case can be retried or submitted more than once, the application service coordinates idempotency state and expected-version checks.

The service must not rely on controller memory, process-local locks, or accidental database uniqueness alone as the complete idempotency strategy.

Detailed rules are defined in 19H.

---

## 20. Result Design

Application services return stable application results.

A result should contain:

- identifiers;
- resulting status;
- committed version where relevant;
- timestamps that are part of the contract;
- small presentation-neutral summaries required by the caller.

A result must not expose:

- aggregate instances;
- mutable entities;
- repository objects;
- Prisma records;
- database transaction handles;
- internal event queues.

---

## 21. Failure Mapping

Application services convert known failures into explicit application failure categories.

Typical categories include:

- validation failure;
- authorization denied;
- resource not found;
- invalid state transition;
- concurrency conflict;
- duplicate/idempotency conflict;
- dependency unavailable;
- persistence failure.

Unexpected errors must retain internal diagnostic context while returning a safe external failure contract.

The same domain rejection must map consistently across HTTP, jobs, CLI tools, and tests.

---

## 22. Application Events

After successful execution, an application service may produce application events describing use-case outcomes.

Application events are not a substitute for returning the direct command result. They support downstream workflows, projections, integrations, and notifications.

Reliable events must follow the transactional outbox policy. Detailed rules are defined in 19I.

---

## 23. Observability

Each application-service invocation should produce structured telemetry with:

- service and operation name;
- correlation and causation identifiers;
- actor and tenant identifiers in privacy-safe form;
- duration;
- success or failure category;
- transaction outcome;
- retry count;
- downstream dependency timing where applicable.

Logs must describe execution without exposing learner answers, credentials, or unnecessary personal data.

---

## 24. Dependency Injection

Dependencies must be supplied explicitly through constructors or module factories.

```ts
class MissionAttemptApplicationServiceImpl {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly authorization: AuthorizationService,
    private readonly clock: Clock,
    private readonly idGenerator: IdGenerator,
  ) {}
}
```

Application services must not import a global container, global Prisma client, or mutable singleton registry.

---

## 25. Module Ownership

Each product module owns its application services and contracts.

A module may expose public application contracts through its module boundary. Internal services remain private.

Shared application abstractions are allowed only when they are genuinely neutral primitives, such as:

- execution context;
- command bus contract;
- unit-of-work contract;
- clock;
- id generator;
- pagination primitives.

Workflow-specific services must not be moved into a generic shared module merely to reduce file count.

---

## 26. Testing Strategy

Application-service tests must prove:

1. correct orchestration order;
2. authorization is evaluated with authoritative context;
3. required aggregates are loaded and invoked correctly;
4. domain failures are mapped without being swallowed;
5. successful writes occur in one transaction;
6. rollback occurs on failure;
7. committed results are stable and presentation-neutral;
8. external effects are deferred correctly;
9. correlation and idempotency context are preserved;
10. infrastructure details do not leak into contracts.

Use unit tests for orchestration and integration tests for repository, transaction, and external-adapter behavior.

---

## 27. Anti-Patterns

The following are prohibited:

- fat controllers containing use-case orchestration;
- application services containing duplicated domain rules;
- generic CRUD services for domain workflows;
- returning ORM entities;
- global service locators;
- direct imports of infrastructure SDKs;
- hidden transaction creation;
- service-to-service call chains with unclear ownership;
- catching every error and returning success-like defaults;
- one shared service owning unrelated modules;
- mutable request context stored globally.

---

## 28. Completion Criteria

The application-service architecture is complete when:

- each use case has one clear orchestration owner;
- service contracts are explicit and stable;
- domain rules remain in the domain layer;
- repositories and gateways are accessed through ports;
- transaction participation is explicit;
- authorization and validation are consistently invoked;
- results and failures are presentation-neutral;
- module ownership is preserved;
- tests prove orchestration and boundary behavior.

---

## 29. Final Rule

> Application services organize the journey through a use case; domain objects determine whether the journey is valid.
