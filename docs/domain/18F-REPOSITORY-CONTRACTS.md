# 18F — Repository Contracts

## Purpose

Define the technology-independent contracts through which the application layer loads and persists domain aggregates in Math Learning World.

This document establishes repository responsibilities, load and save semantics, optimistic concurrency, transaction participation, event durability, snapshot integration, failure contracts, and architectural boundaries without coupling the domain model to Prisma, PostgreSQL, HTTP, queues, or framework-specific APIs.

## Repository Definition

A repository provides collection-like access to aggregate roots while preserving aggregate lifecycle and consistency rules.

A repository is not a generic data-access object, table wrapper, query builder, or persistence utility.

Its primary responsibilities are:

- Resolve one aggregate root by stable identity and ownership boundary.
- Rehydrate the aggregate through its dedicated rehydration path.
- Persist one authoritative aggregate change with expected-version protection.
- Durably capture the aggregate's pending domain events according to the selected persistence strategy.
- Participate in an application-owned transaction or unit of work.
- Return stable outcomes that do not expose infrastructure-specific errors.

## Contract Ownership

Repository interfaces belong to the domain-facing application boundary.

The contract may be declared near the aggregate or in an application port package, but it must use domain concepts rather than database concepts.

Infrastructure provides implementations of those contracts.

```text
Domain / Application contract
  <- implemented by Infrastructure adapter
  <- backed by PostgreSQL, event store, memory, or another durable mechanism
```

The domain model must not import an infrastructure repository implementation.

## Aggregate-Specific Contracts

Repositories should normally be aggregate-specific.

Examples:

- `LearnerProfileRepository`
- `LearningSessionRepository`
- `MissionRepository`
- `SkillProgressRepository`
- `CreditAccountRepository`

A universal repository such as `Repository<T>` is allowed only for truly neutral mechanics that do not erase aggregate-specific semantics.

Aggregate-specific contracts may expose domain-relevant lookup operations, but they must not become unrestricted query APIs.

## Minimal Repository Shape

A repository contract should remain small and intentional.

Example:

```ts
interface LearningSessionRepository {
  findById(input: FindLearningSessionInput): Promise<LearningSession | null>;
  save(input: SaveLearningSessionInput): Promise<SaveLearningSessionResult>;
}
```

Supporting types:

```ts
interface FindLearningSessionInput {
  sessionId: LearningSessionId;
  tenantId: TenantId | null;
}

interface SaveLearningSessionInput {
  aggregate: LearningSession;
  expectedVersion: AggregateVersion;
}

type SaveLearningSessionResult =
  | {
      status: 'SAVED';
      persistedVersion: AggregateVersion;
    }
  | {
      status: 'VERSION_CONFLICT';
      expectedVersion: AggregateVersion;
      actualVersion: AggregateVersion;
    };
```

Exact TypeScript shapes belong to later contract and implementation phases. The architectural meaning defined here is authoritative.

## Identity and Ownership Boundary

Every load and save operation must preserve aggregate identity and ownership scope.

Rules:

- Aggregate identity is mandatory.
- Aggregate type is implicit in the repository contract or explicit in infrastructure metadata.
- Tenant or learning-world ownership is included whenever the aggregate is scoped.
- A repository must not resolve an aggregate across tenant boundaries.
- A missing aggregate and a forbidden cross-boundary aggregate must not leak sensitive existence information unless policy explicitly allows it.
- Identity must not be replaced, regenerated, or inferred from mutable state during save.

## Load Contract

Loading an aggregate consists of durable retrieval followed by domain rehydration.

The repository must:

1. Resolve the durable record, snapshot, or event stream using identity and ownership scope.
2. Verify aggregate type and storage integrity.
3. Reconstruct value objects and internal entities.
4. Invoke the aggregate's rehydration path.
5. Restore the persisted aggregate version.
6. Return the aggregate with no pending domain events.

Loading must not:

- Execute a creation factory.
- Emit creation or historical domain events.
- Increment aggregate version.
- Apply business transitions.
- Repair invalid state silently.
- Return a partially rehydrated aggregate.

## Missing Aggregate Semantics

A load contract must define missing-result behavior explicitly.

Preferred options:

- Return `null` when absence is an expected branch.
- Return a stable `NOT_FOUND` result when the application requires explicit outcome handling.
- Throw or return a domain-facing repository failure only when absence represents an exceptional contract violation.

Infrastructure-specific exceptions such as ORM “record not found” errors must not cross the repository boundary.

## Rehydration Integrity

The repository is responsible for validating persistence representation before the aggregate is considered loaded.

Integrity checks include:

- Aggregate identity matches the requested identity.
- Ownership boundary matches the request.
- Persisted version is valid and monotonic.
- Required fields exist.
- Stored enum or state values are recognized.
- Snapshot or event-stream version is compatible.
- Value objects can be reconstructed.
- Aggregate invariants hold after rehydration.

Corrupt durable state must produce an explicit integrity or recovery failure. It must never be normalized silently into a different business meaning.

## Save Contract

Saving persists the result of a successful aggregate transition.

The save operation receives:

- The aggregate root.
- The version that was originally loaded or expected before the transition.
- The aggregate's resulting version.
- Pending domain events recorded by the aggregate.
- Transaction context when the application has opened one.

The repository must persist only aggregate state that has passed domain rules.

## Expected Version

Every update save must include `expectedVersion`.

Example:

```text
persisted version before load = 12
aggregate transition          = version 13
save expectedVersion          = 12
save resultingVersion         = 13
```

The durable update succeeds only when the current stored version still equals `expectedVersion`.

Creation uses an explicit non-existence expectation rather than pretending an existing version is present.

Possible creation policies:

- `expectedVersion = 0`
- `expectedVersion = NONE`
- A distinct `insert()` contract

One policy must be selected consistently during implementation.

## Version Invariants

Repository implementations must enforce:

- Persisted versions never decrease.
- Rehydration does not increment version.
- A successful state-changing transition increments version according to 18E.
- A no-op does not create an accidental write or version increment.
- The saved resulting version matches the aggregate version.
- Conflicting histories cannot be written for the same aggregate version.
- A creation write fails when the identity already exists.

## Optimistic Concurrency

Optimistic concurrency is the default write strategy.

A version conflict means another successful write changed the aggregate after it was loaded.

On conflict, the repository must:

- Reject the write atomically.
- Preserve the newer durable state.
- Avoid committing pending domain events from the rejected write.
- Return a stable conflict result.
- Expose actual version when safe and useful.

The repository must not:

- Apply last-write-wins silently.
- Mutate the aggregate to match durable state.
- retry automatically without application authority.
- merge competing aggregate state inside persistence code.

The application layer decides whether to reload, re-evaluate the command, report conflict, or begin a compensating workflow.

## Atomic State and Event Durability

Aggregate state and pending domain events represent one successful domain decision.

They must be captured atomically.

Preferred sequence:

```text
BEGIN TRANSACTION
  -> verify expected version
  -> write aggregate state or append aggregate events
  -> write domain events to durable event/outbox storage
  -> verify resulting version
COMMIT
```

If any step fails, all steps roll back.

A repository must never report `SAVED` when aggregate state committed but required event durability did not, or when events committed without the corresponding aggregate state.

## Pending Event Handling

The aggregate owns creation of pending domain events. The repository owns durable capture of those events.

Rules:

- Repositories do not invent domain events.
- Event order is preserved.
- Event metadata must match aggregate identity, type, and resulting version.
- Pending events remain pending until durable capture succeeds.
- Pending events may be cleared or acknowledged only after successful transaction completion.
- A failed or conflicted save leaves no published external event.
- Repeated save attempts must not create duplicate durable events.

Outbox publication is an infrastructure process after commit, not repository-domain behavior.

## Persistence Strategies

Repository contracts must remain valid across supported persistence models.

### State-Based Persistence

The repository stores the current authoritative aggregate state and version.

Pending events are stored in an outbox or event table in the same transaction.

### Event-Sourced Persistence

The repository appends new domain events to the aggregate stream using expected stream version.

The aggregate is rehydrated by replaying events, optionally beginning from a compatible snapshot.

### Hybrid Persistence

The repository stores current state, durable event history, and snapshots according to explicit policies.

The contract must not expose storage-model details unless the application genuinely requires them.

## Snapshot Contract

Snapshot support is optional and policy-driven.

A repository that supports snapshots must:

- Load only snapshots matching aggregate identity and type.
- Verify snapshot schema and aggregate version compatibility.
- Treat snapshots as reconstruction accelerators, not authoritative replacements for required history.
- Apply later events or state changes in deterministic order.
- Ignore or route incompatible snapshots through explicit recovery.
- Create snapshots only from successfully persisted aggregate state.
- Never emit domain events solely because a snapshot was created.

Snapshot rules align with 17D Runtime Recovery & Snapshot Architecture and 18E Aggregate Lifecycle.

## Transaction Ownership

The application service owns the business transaction scope.

The repository participates in that scope but does not decide the full workflow.

Default rule:

- One aggregate write is one transactional consistency boundary.

When an application operation coordinates multiple repositories, the application layer or unit of work controls the transaction.

Repositories must not independently commit early when they are participating in a larger authorized transaction.

## Unit of Work Relationship

A unit of work may coordinate:

- Transaction begin, commit, and rollback.
- Multiple repository implementations sharing one database transaction.
- Outbox durability.
- Post-commit callbacks or publication scheduling.

Conceptual contract:

```ts
interface UnitOfWork {
  execute<T>(work: (context: TransactionContext) => Promise<T>): Promise<T>;
}
```

Repository contracts should accept or resolve transaction context through a consistent implementation policy.

The domain aggregate remains unaware of the unit of work.

## Cross-Aggregate Operations

A repository must not expand one aggregate's consistency boundary by loading and mutating unrelated aggregates internally.

Cross-aggregate workflows belong to application services, process managers, or sagas.

When multiple aggregates are changed:

- Each aggregate validates its own invariants.
- The application defines ordering and compensation.
- A shared transaction is exceptional and documented.
- Domain events communicate completed facts across boundaries.

## Query Separation

Repositories load aggregate roots for behavior and consistency.

Read models, search screens, dashboards, leaderboards, reports, analytics, and projections should use dedicated query contracts.

A repository must not be forced to return:

- Arbitrary joins.
- UI-shaped DTOs.
- Pagination across unrelated aggregates.
- Reporting projections.
- Aggregated analytics.
- Partial mutable aggregate fragments.

This separation prevents write-model rules from being weakened for read convenience.

## Repository Result Semantics

Repository outcomes must be stable and technology-independent.

Recommended outcome categories:

- `FOUND`
- `NOT_FOUND`
- `SAVED`
- `ALREADY_EXISTS`
- `VERSION_CONFLICT`
- `OWNERSHIP_MISMATCH`
- `INTEGRITY_FAILURE`
- `TRANSACTION_FAILURE`
- `STORAGE_UNAVAILABLE`

Not every repository needs all categories. Each contract should expose only outcomes meaningful to its callers.

## Failure Contract

Repository failures are classified into three groups.

### Expected Outcomes

Expected branches such as not found or version conflict.

They should be represented as explicit results when the application is expected to handle them routinely.

### Recoverable Infrastructure Failures

Examples:

- Temporary storage unavailability.
- Transaction serialization failure.
- Connection interruption.
- Lock timeout.

These are mapped into stable repository failures carrying retry classification and correlation context where appropriate.

### Integrity Failures

Examples:

- Corrupt persisted aggregate state.
- Impossible version sequence.
- Aggregate type mismatch.
- Event history gap.
- Snapshot incompatibility without a fallback path.

Integrity failures require recovery, quarantine, migration, or operator intervention. They must not be hidden behind a generic empty result.

## Error Translation

Infrastructure implementations translate low-level errors at the repository boundary.

The following must not escape directly:

- Prisma error codes.
- SQLSTATE values.
- Driver exceptions.
- Database table or column names.
- Connection-library objects.
- Raw stack traces.

Low-level details may be retained in logs and telemetry using correlation identifiers, but application behavior depends on stable repository contracts.

## Retry Policy

Repositories do not automatically retry business commands.

Infrastructure-level retry may be permitted for operations proven safe, such as reconnecting before any transaction began.

A write retry after ambiguity requires verification of durable state and idempotency.

Retrying after a version conflict requires the application to reload and re-evaluate the domain intent.

## Idempotency

Repository save behavior must support idempotent application workflows without weakening concurrency.

Possible mechanisms include:

- Unique command or operation identifiers.
- Unique event identifiers.
- Aggregate version constraints.
- Transactional operation records.
- Outbox uniqueness constraints.

A repeated request may return the previously committed result when the same operation identity is proven to represent the same domain intent.

A different intent must never be accepted merely because it reused an identifier.

## Repository Invariants

All repository implementations must preserve these invariants:

1. One aggregate identity resolves to at most one authoritative aggregate stream or state within its ownership boundary.
2. A loaded aggregate has the exact durable version represented by storage.
3. A successful save preserves identity and aggregate type.
4. A successful update verifies expected version.
5. State and required pending-event durability are atomic.
6. A failed save creates no partial authoritative business result.
7. Rehydration creates no new pending events.
8. A repository never performs a business transition.
9. A repository never silently repairs corrupt domain state.
10. Tenant-scoped data never crosses ownership boundaries.
11. A saved event cannot conflict with the aggregate version it describes.
12. Infrastructure errors are translated before crossing the contract boundary.

## Repository Non-Responsibilities

Repositories must not:

- Authorize users or roles.
- Interpret HTTP requests.
- Validate presentation forms.
- Choose business transitions.
- Calculate unrelated analytics.
- Publish UI notifications.
- Coordinate external services.
- Send email, rewards, or messages directly.
- Hide cross-aggregate workflows.
- Expose ORM entities as domain aggregates.
- Return mutable persistence records for callers to edit.

## Security and Privacy

Repository implementations must apply ownership and data-minimization policies.

Rules:

- Tenant filters are mandatory for tenant-scoped aggregates.
- Sensitive data is loaded only when required by the aggregate contract.
- Logs must avoid secrets and unnecessary learner personal data.
- Personal-data erasure uses an explicit authorized workflow.
- Encryption and access controls are infrastructure responsibilities but must preserve repository semantics.
- Cross-tenant lookup failures must avoid unintended existence disclosure.

## Observability

Repository operations should produce infrastructure telemetry without contaminating domain contracts.

Useful telemetry includes:

- Repository operation name.
- Aggregate type.
- Correlation identifier.
- Outcome category.
- Expected and resulting version when safe.
- Transaction duration.
- Retry count.
- Conflict count.
- Integrity-failure classification.

Raw aggregate payloads and sensitive learner data should not be logged by default.

## Testing Contract

Every repository implementation must be tested against a shared behavioral contract.

Required scenarios include:

- Create and load an aggregate.
- Preserve identity and value objects.
- Restore version exactly.
- Rehydrate with no pending events.
- Save a valid transition.
- Persist aggregate state and events atomically.
- Reject stale expected version.
- Reject duplicate creation identity.
- Preserve tenant isolation.
- Roll back on event-durability failure.
- Translate infrastructure errors.
- Detect corrupt persisted state.
- Support deterministic snapshot recovery when implemented.

An in-memory repository may support fast domain and application tests, but it must obey the same externally visible contract as durable implementations.

## Example Application Flow

```text
Application receives CompleteMission command
  -> authorize actor and ownership
  -> repository.findById(missionId, tenantId)
  -> aggregate.completeMission(...)
  -> aggregate validates invariants
  -> aggregate advances version and records MissionCompleted
  -> repository.save(aggregate, expectedVersion)
  -> state + outbox event commit atomically
  -> repository returns SAVED with persistedVersion
  -> application returns command result
  -> publisher later delivers durable event
```

A version conflict changes the flow:

```text
repository.save(...)
  -> VERSION_CONFLICT
  -> no state or event from this attempt committed
  -> application reloads, re-evaluates, or reports conflict
```

## Relationship to Previous Architecture

### 18A — Domain Core

Defines the domain model, invariants, and separation from infrastructure.

18F provides persistence ports that protect that separation.

### 18B — Aggregate Boundaries

Defines which objects change consistently together.

18F persists and loads aggregate roots according to those boundaries.

### 18C — Value Objects

Defines validated domain values.

18F reconstructs value objects during rehydration rather than returning raw persistence primitives as domain state.

### 18D — Domain Events

Defines immutable facts recorded after successful transitions.

18F ensures pending events are durably captured atomically with aggregate persistence.

### 18E — Aggregate Lifecycle

Defines creation, loading, transition, versioning, persistence, recovery, and archival lifecycle.

18F defines the repository contract that supports those lifecycle stages.

### 17C — Runtime Event Contracts

Defines safe event-shaped communication between runtime components.

18F stops at durable domain-event capture; later application and infrastructure mappings may produce runtime or integration events.

### 17D — Runtime Recovery & Snapshot Architecture

Defines durable-evidence recovery and snapshot behavior.

18F provides authoritative aggregate loading, version verification, and snapshot-compatible reconstruction required by recovery.

## Design Decisions

The architecture adopts these decisions:

- Repositories are aggregate-oriented, not table-oriented.
- Repository interfaces remain independent from ORM and database technology.
- Aggregate-specific contracts are preferred over one universal repository abstraction.
- Optimistic concurrency is mandatory by default.
- State and pending-event durability are atomic.
- Application services own transaction workflow.
- Repositories participate in, but do not invent, units of work.
- Queries and reporting use separate read contracts.
- Infrastructure errors are translated into stable outcomes.
- Recovery trusts durable repository evidence rather than memory, UI, or process acknowledgements.

## Completion Criteria

18F is complete when the architecture defines:

- Repository purpose and ownership.
- Aggregate-specific load and save contracts.
- Identity and ownership-boundary rules.
- Rehydration behavior.
- Expected-version and optimistic-concurrency semantics.
- Atomic aggregate-state and domain-event durability.
- Transaction and unit-of-work responsibilities.
- Snapshot and recovery integration.
- Stable result and failure contracts.
- Query separation.
- Repository invariants and non-responsibilities.
- Security, observability, and behavioral testing expectations.
