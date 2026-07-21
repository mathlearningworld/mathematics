# 20A — Infrastructure Layer Overview

## 1. Purpose

This document defines the architectural contract for the Infrastructure Layer in Math Learning World.

The Infrastructure Layer supplies technical capabilities required by the Application and Domain layers while preserving the dependency direction toward stable business abstractions.

It is the Source of Truth for:

- infrastructure responsibilities;
- ports and adapters;
- dependency direction;
- persistence and external-system boundaries;
- runtime composition;
- failure translation;
- observability;
- security expectations;
- testing obligations;
- prohibited coupling.

---

## 2. Core Principle

> Infrastructure implements technical details behind application-owned or domain-owned contracts; it does not define business meaning.

The Infrastructure Layer may know about frameworks, databases, queues, object storage, network protocols, cloud services, and operating-system concerns.

The Domain Layer must not know about those technologies.

The Application Layer may depend only on abstractions that express capabilities required by use cases.

---

## 3. Position in the Architecture

```text
Presentation
    ↓
Application
    ↓
Domain

Infrastructure ──implements──> Application/Domain ports
Composition Root ──wires──> concrete implementations
```

Infrastructure is an outer layer.

Dependency arrows point inward:

- Infrastructure may import Application contracts.
- Infrastructure may import Domain types where mapping requires them.
- Application must not import Prisma, PostgreSQL, Redis, SDK clients, HTTP libraries, or cloud-provider packages.
- Domain must not import Infrastructure.

---

## 4. Responsibilities

The Infrastructure Layer owns technical implementation for capabilities such as:

1. PostgreSQL persistence.
2. Prisma client integration.
3. Repository implementations.
4. Transaction and Unit of Work implementations.
5. Outbox persistence and message publication.
6. Cache adapters.
7. Object and file storage adapters.
8. External service clients.
9. Runtime configuration loading.
10. Secret retrieval.
11. Logging, tracing, and metrics adapters.
12. Clock, identifier, and cryptography implementations when represented as ports.
13. Dependency wiring at the composition boundary.

Infrastructure does not own:

- business invariants;
- use-case sequencing;
- authorization policy meaning;
- domain transitions;
- learner mastery rules;
- curriculum semantics;
- progression decisions;
- product workflow.

---

## 5. Ports and Adapters

A port is an inward-facing contract that describes a required capability.

Examples:

```text
SkillRepository
LearnerProgressRepository
UnitOfWork
EventPublisher
ObjectStorage
Clock
IdGenerator
EmailGateway
CacheStore
```

An adapter is a concrete Infrastructure implementation.

Examples:

```text
PrismaSkillRepository
PrismaLearnerProgressRepository
PrismaUnitOfWork
OutboxEventPublisher
S3ObjectStorage
SystemClock
UuidGenerator
SmtpEmailGateway
RedisCacheStore
```

Port names describe capability and business relevance.

Adapter names may describe technology because they live in the Infrastructure Layer.

---

## 6. Contract Ownership

Contract ownership follows the consumer:

- A repository required by an application use case is owned by Application or Domain according to its semantic role.
- Infrastructure implements that repository contract.
- A vendor SDK interface is not promoted inward as a business contract.
- Infrastructure-specific helper abstractions remain inside Infrastructure.

The inner layer must never reshape itself around a vendor API.

---

## 7. Technology Boundary

The initial technology baseline is:

```text
Runtime: Node.js
Application framework: Express
ORM: Prisma
Primary database: PostgreSQL
Test runner: Vitest
Module system: ESM
```

These technologies are implementation choices, not domain concepts.

Replacing a technology may require Infrastructure changes and migration work, but should not require rewriting business rules or use-case contracts.

---

## 8. Persistence Boundary

Persistence converts between two models:

```text
Domain/Application model ↔ Persistence model
```

The persistence model optimizes durable storage, constraints, indexing, and query execution.

The domain model optimizes business meaning and invariant protection.

They may be structurally similar but are not assumed to be identical.

Infrastructure owns explicit mapping between them.

---

## 9. Transaction Boundary

Application use cases declare transactional intent.

Infrastructure provides the mechanism.

A transaction implementation must:

- begin a database transaction;
- provide transaction-scoped repositories;
- commit all durable changes atomically;
- roll back on failure;
- preserve optimistic-concurrency checks;
- write outbox records in the same transaction when required;
- avoid leaking ORM transaction objects into Application or Domain code.

---

## 10. External Systems

Every external dependency is treated as unreliable.

Infrastructure adapters must account for:

- latency;
- timeout;
- transient failure;
- permanent failure;
- rate limiting;
- malformed responses;
- authentication failure;
- version drift;
- duplicate delivery;
- partial availability.

Application-facing failures must use stable error contracts rather than raw vendor exceptions.

---

## 11. Failure Translation

Infrastructure catches technology-specific failures at the boundary and translates them into stable failure categories.

Examples:

```text
Unique constraint violation → Conflict
Missing row → NotFound
Optimistic version mismatch → ConcurrencyConflict
Database unavailable → DependencyUnavailable
External timeout → DependencyTimeout
Invalid vendor response → DependencyProtocolFailure
```

Translation must preserve diagnostic evidence in logs without exposing secrets or vendor internals to callers.

---

## 12. Runtime Composition

Concrete adapters are selected and wired at the composition root.

The composition root may know all layers because its purpose is assembly.

It must:

- construct configuration;
- initialize shared clients;
- create adapters;
- inject ports into application services or handlers;
- register routes and middleware;
- install shutdown hooks;
- release resources cleanly.

Business behavior must not be placed in the composition root.

---

## 13. Configuration

Configuration is loaded once at startup and converted into a validated runtime configuration object.

Rules:

1. Environment variables are transport, not application state.
2. Missing required values fail startup.
3. Invalid values fail startup with clear diagnostics.
4. Secrets are never committed to the repository.
5. Application code does not read `process.env` directly.
6. Configuration objects are immutable after initialization.
7. Test configuration is explicit and isolated.

---

## 14. Security

Infrastructure is responsible for enforcing technical security controls, including:

- encrypted network connections where supported;
- secure credential handling;
- least-privilege database access;
- safe query parameterization;
- secret redaction;
- upload validation;
- storage access controls;
- cryptographically secure identifier or token generation where required;
- dependency timeout and payload-size limits.

Infrastructure controls support authorization but do not replace business authorization policy.

---

## 15. Observability

Infrastructure emits operational evidence for technical behavior.

Minimum structured context should include, where applicable:

```text
correlationId
requestId
actorId
tenant or workspace identity
useCase
adapter
operation
duration
outcome
failureCode
retryCount
```

Logs must not contain passwords, access tokens, private keys, or sensitive learner data beyond approved policy.

Metrics and traces must reflect technical boundaries without changing business outcomes.

---

## 16. Performance

Infrastructure must make performance characteristics explicit.

Examples:

- database query count;
- index requirements;
- pagination limits;
- batch size;
- cache TTL;
- connection pool size;
- request timeout;
- message retry schedule;
- object upload limit.

Performance optimization must not bypass invariants, authorization, or transaction guarantees.

---

## 17. Testing Strategy

Infrastructure verification includes:

1. Adapter contract tests.
2. Repository integration tests against PostgreSQL.
3. Migration verification.
4. Transaction commit and rollback tests.
5. Optimistic-concurrency tests.
6. Outbox atomicity tests.
7. External-client protocol tests with controlled fakes or local test servers.
8. Configuration validation tests.
9. Resource lifecycle and shutdown tests.

Mocks alone are insufficient evidence for persistence correctness.

---

## 18. Package Organization

A target organization may follow:

```text
src/infrastructure/
  config/
  database/
    prisma/
    repositories/
    mappers/
    transactions/
  messaging/
  cache/
  storage/
  external-services/
  observability/
  security/
  composition/
```

Folders may evolve, but ownership boundaries must remain explicit.

---

## 19. Prohibited Patterns

The following are prohibited:

- importing Prisma types into Domain entities;
- returning ORM records directly from application handlers;
- placing business rules in repository implementations;
- reading environment variables throughout the codebase;
- allowing vendor exceptions to escape as public application failures;
- using global mutable infrastructure state without lifecycle ownership;
- performing external network calls inside a database transaction unless explicitly designed and justified;
- publishing integration events before the durable transaction commits;
- bypassing repository or transaction contracts from presentation code;
- treating cache as the Source of Truth for authoritative learning state.

---

## 20. Completion Criteria

The Infrastructure Layer architecture is considered defined when:

- responsibilities and dependency rules are explicit;
- ports are owned by inner layers;
- adapters implement those ports without leaking technology;
- persistence mapping and transaction rules are defined;
- external failures are translated consistently;
- configuration and secrets are validated safely;
- observability and lifecycle behavior are testable;
- prohibited coupling is detectable in review;
- subsequent Infrastructure documents refine this overview without contradicting it.

---

## 21. Architectural Decision

Math Learning World adopts an adapter-based Infrastructure Layer with explicit mapping, transaction ownership, stable failure translation, and composition-root wiring.

Infrastructure remains replaceable technical machinery around the stable Product, Application, and Domain architecture.