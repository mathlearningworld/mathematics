# 20J — Infrastructure Testing

## 1. Purpose

This document defines the testing strategy for the Infrastructure Layer in Math Learning World.

Infrastructure tests prove that adapters, persistence, transactions, messaging, storage, cache, configuration, and external-service boundaries satisfy their contracts against realistic runtime dependencies.

## 2. Core Principle

> Infrastructure behavior must be verified at the boundary where assumptions meet real systems.

Mocks can support fast tests, but they cannot certify SQL semantics, transaction behavior, provider protocols, broker delivery, or object-storage compatibility.

## 3. Test Classification

Infrastructure verification is divided into:

```text
Unit Tests
Port Contract Tests
Adapter Integration Tests
Persistence Integration Tests
Migration Tests
Resilience Tests
Security and Isolation Tests
Operational Flow Tests
```

Each class answers a different question and must not be represented as another.

## 4. Unit Tests

Unit tests verify pure infrastructure logic without external processes.

Examples:

- error mapping;
- configuration parsing;
- cache-key construction;
- storage-key generation;
- retry classification;
- message envelope validation;
- persistence mapper transformations.

Unit tests should be deterministic and fast.

## 5. Port Contract Tests

Every adapter implementing an application port should run against a shared contract suite.

A contract suite verifies behavior such as:

- successful operation;
- not-found behavior;
- duplicate or conflict behavior;
- expected error mapping;
- tenant isolation;
- idempotency where required;
- timeout semantics;
- resource cleanup.

The same suite may be run against in-memory, local, and production-compatible adapters.

## 6. Persistence Integration Tests

Persistence tests must use a real PostgreSQL-compatible database for behaviors dependent on SQL or transaction semantics.

Required coverage includes:

- repository reads and writes;
- aggregate reconstruction;
- explicit persistence mapping;
- unique and foreign-key constraints;
- optimistic concurrency;
- transaction commit and rollback;
- tenant-safe queries;
- pagination and ordering;
- idempotency records;
- outbox writes;
- query projection correctness.

Mocking Prisma does not certify persistence behavior.

## 7. Transaction Tests

Transaction tests must prove:

```text
all required writes commit together
or
all required writes roll back together
```

Scenarios include:

- aggregate write plus outbox record;
- failure after an intermediate write;
- concurrency conflict;
- nested application operation refusal or participation;
- retryable versus non-retryable failure;
- connection loss where reproducible.

## 8. Migration Tests

Migration verification must prove that:

- a clean database migrates to the current schema;
- migrations run in deterministic order;
- required constraints and indexes exist;
- supported upgrade paths preserve data;
- destructive changes are intentional and documented;
- Prisma client generation remains compatible;
- seed data is repeatable where idempotency is required.

Migration success on an already-developed local database is insufficient evidence.

## 9. External-Service Adapter Tests

External adapters require tests for:

- request construction;
- authentication headers;
- response mapping;
- provider error mapping;
- timeouts;
- bounded retries;
- rate limiting;
- idempotency keys;
- circuit-breaker behavior;
- webhook signature verification;
- schema drift handling.

Use provider sandboxes or protocol-compatible test servers when practical.

## 10. Messaging Tests

Messaging and event-bus tests must verify:

- envelope schema;
- publication after authoritative commit;
- outbox claiming and dispatch;
- duplicate delivery handling;
- consumer idempotency;
- retry behavior;
- poison-message handling;
- dead-letter routing;
- ordering guarantees where declared;
- schema-version compatibility;
- projection recovery.

Tests must assume at-least-once delivery unless a stronger guarantee is truly provided.

## 11. Object-Storage Tests

Storage tests must cover:

- upload-session generation;
- signed-access scope and expiry;
- upload completion;
- metadata verification;
- checksum or integrity failure;
- private-access authorization;
- deletion lifecycle;
- missing objects;
- orphan reconciliation;
- provider failure mapping.

A local S3-compatible test service may be used when it preserves the relevant provider semantics.

## 12. Cache Tests

Cache tests must verify:

- deterministic key construction;
- tenant and actor scoping;
- hit and miss behavior;
- TTL expiration;
- invalidation after commit;
- corrupted-value handling;
- outage fallback;
- negative caching;
- stampede protection;
- bounded payload behavior.

Tests must ensure cache unavailability is not interpreted as authoritative absence.

## 13. Configuration Tests

Configuration tests must cover:

- required values;
- parsing and normalization;
- numeric boundaries;
- source precedence;
- safe defaults;
- production guardrails;
- secret redaction;
- deprecated keys;
- adapter construction.

Process environment mutations must be isolated between tests.

## 14. Tenant and Authorization Isolation

Every tenant-aware adapter must prove that one tenant cannot read, update, delete, enumerate, or infer another tenant's data.

Tests should include:

- valid tenant access;
- wrong tenant identifier;
- missing tenant scope;
- shared natural identifiers across tenants;
- pagination boundary isolation;
- cache-key isolation;
- object-key and metadata isolation;
- event-consumer isolation.

These are security tests, not optional repository tests.

## 15. Failure Injection

Infrastructure testing should deliberately inject failures at meaningful boundaries:

- database unavailable;
- transaction conflict;
- provider timeout;
- partial external response;
- broker unavailable;
- duplicate event;
- cache unavailable;
- object upload incomplete;
- malformed configuration;
- shutdown during in-flight work.

The expected outcome must be explicit: retry, rollback, reject, degrade, quarantine, or alert.

## 16. Test Data

Test data must be:

- minimal;
- deterministic;
- isolated per test or suite;
- safe to delete;
- free from production personal data;
- explicit about tenant ownership;
- reproducible from code.

Random data may be used only with recorded seeds or sufficient failure diagnostics.

## 17. Database Isolation Strategy

Acceptable strategies include:

- transaction rollback per test;
- isolated schema per worker;
- isolated database per suite;
- deterministic truncate and reseed.

The chosen strategy must support parallel execution safely and must not hide transaction behavior under test.

## 18. Test Containers and Local Services

Where available, ephemeral containers should provide production-compatible dependencies such as:

- PostgreSQL;
- Redis-compatible cache;
- S3-compatible object storage;
- message broker.

Versions should be pinned and aligned with supported production versions.

## 19. Determinism

Tests must control:

- time;
- generated identifiers where assertions require stability;
- retry delay;
- network responses;
- environment variables;
- concurrency orchestration;
- background worker completion.

Arbitrary sleeps are discouraged. Prefer observable conditions and bounded polling.

## 20. Performance and Capacity Tests

Targeted tests should validate critical infrastructure assumptions such as:

- repository query plans;
- index effectiveness;
- pool saturation behavior;
- message throughput;
- object-size limits;
- cache cardinality;
- batch processing limits;
- external-service concurrency controls.

Performance tests require explicit datasets and acceptance thresholds.

## 21. Observability Assertions

Infrastructure tests should verify that important failures produce usable operational evidence:

- structured error classification;
- correlation identifiers;
- relevant metrics;
- retry counts;
- dead-letter records;
- no leaked secrets;
- no sensitive payloads in logs.

## 22. Verification Gates

Infrastructure evidence must respect the three-gate model.

### Gate A — Repository Gate

Verifies from repository evidence:

- architecture and contracts;
- adapter boundaries;
- test presence and wiring;
- migration files;
- configuration schema;
- static review.

Repository PASS does not prove external dependencies execute.

### Gate B — Runtime Gate

Requires a capable local or CI runtime to execute:

- dependency installation;
- lint and typecheck;
- Prisma validation and generation;
- migrations;
- integration tests;
- container-backed adapters;
- build and executable verifiers.

### Gate C — Operational Gate

Requires the running system and proves real flows across:

```text
Client -> API -> Application -> Infrastructure -> Dependency -> Projection -> Query -> UI
```

Operational PASS requires runtime evidence, not documentation alone.

## 23. CI Strategy

CI should separate fast and dependency-backed suites while preserving clear status:

```text
lint / static checks
unit tests
contract tests
persistence and migration tests
adapter integration tests
build
optional operational smoke tests
```

Failures must identify the owning suite and dependency.

## 24. Flaky Test Policy

Flaky infrastructure tests are defects.

When flakiness occurs:

- record the failure evidence;
- identify the nondeterministic boundary;
- quarantine only with an owner and expiry;
- do not silently retry until green as the sole remedy;
- repair timing, isolation, or dependency assumptions.

## 25. Cleanup and Shutdown

Tests must close:

- Prisma clients;
- database pools;
- cache clients;
- broker connections;
- HTTP servers;
- temporary files;
- containers and upload sessions.

Leaked handles must fail verification rather than be ignored.

## 26. Anti-Patterns

Do not:

- claim database coverage from mocked ORM calls;
- treat repository review as runtime certification;
- use production services for routine tests;
- share mutable test state across suites;
- rely on test execution order;
- hide failures with unlimited retries;
- use arbitrary delays as synchronization;
- omit tenant-isolation cases;
- certify operational completion without an operational flow.

## 27. Minimum Completion Matrix

Before Infrastructure is considered implementation-ready, evidence should exist for:

| Capability | Unit | Contract | Integration | Operational |
|---|---:|---:|---:|---:|
| Repository/Persistence | Yes | Yes | Yes | Selected flows |
| Transaction/UoW | Yes | Yes | Yes | Selected flows |
| External Services | Yes | Yes | Sandbox/Test server | Selected flows |
| Messaging/Event Bus | Yes | Yes | Yes | Worker flow |
| File/Object Storage | Yes | Yes | Yes | Upload/download flow |
| Cache | Yes | Yes | Yes | Degradation flow |
| Configuration | Yes | N/A | Startup | Deployment smoke |

## 28. Completion Criteria

Infrastructure testing is complete when:

- ports have reusable contract suites;
- persistence uses a real compatible database;
- migrations are tested from clean state and supported upgrades;
- transaction atomicity and concurrency are proven;
- external dependencies have realistic adapter tests;
- tenant isolation and security boundaries are covered;
- failure injection verifies resilience behavior;
- tests are deterministic and clean up resources;
- Repository, Runtime, and Operational evidence are reported separately;
- no gate is claimed without its required execution evidence.
