# 18E — Aggregate Lifecycle

## Purpose
Define the authoritative lifecycle of domain aggregates in Math Learning World from creation through loading, transition, event recording, persistence, recovery, and archival.

This document establishes how aggregate roots preserve invariants and consistency while remaining independent from HTTP, database, queue, UI, and framework concerns.

## Lifecycle Overview

An aggregate follows this conceptual lifecycle:

```text
Create or Load
  -> Rehydrate state
  -> Receive domain intent
  -> Validate invariants
  -> Apply one valid transition
  -> Increment aggregate version
  -> Record domain events
  -> Persist state and pending events atomically
  -> Publish through application/infrastructure boundaries
  -> Snapshot when policy requires
  -> Continue, close, or archive
```

The lifecycle is controlled through aggregate behavior. External layers may request operations, load state, or persist outcomes, but they must not bypass aggregate rules.

## Aggregate Root Authority

The aggregate root is the only entry point for changing state inside an aggregate boundary.

The aggregate root is responsible for:
- Protecting aggregate invariants.
- Authorizing valid state transitions.
- Coordinating entities and value objects inside its boundary.
- Maintaining aggregate identity and version.
- Recording domain events after successful transitions.
- Rejecting invalid, stale, or duplicate operations when detectable.
- Exposing state only through intentional domain-safe interfaces.

Internal entities must not be modified directly by repositories, controllers, handlers, projections, or UI code.

## Lifecycle States

Every aggregate has a lifecycle state even when the specific domain vocabulary differs.

Common lifecycle categories are:
- `NEW` — created in memory but not yet durably persisted.
- `ACTIVE` — available for normal domain transitions.
- `SUSPENDED` — temporarily blocked from selected transitions.
- `COMPLETED` — business objective finished; only explicitly allowed follow-up transitions remain.
- `ARCHIVED` — retained for history but no longer active.
- `CLOSED` — terminal state when reopening is not allowed.

These names are architectural categories, not mandatory shared enums. Each aggregate must define its own explicit domain states and transition graph.

## Creation Rules

Aggregate creation must occur through a named factory or creation behavior rather than unrestricted constructor mutation.

Creation must:
1. Receive validated primitive inputs or value objects.
2. Assign or accept a stable aggregate identity.
3. Establish the initial valid state.
4. Set the initial version according to persistence policy.
5. Enforce all creation invariants.
6. Record a creation event when creation is a meaningful domain fact.

Example:

```ts
const session = LearningSession.start({
  sessionId,
  learnerId,
  missionId,
  startedAt,
});
```

A failed creation invariant produces no aggregate and no domain event.

## Identity

Aggregate identity is stable for the full lifetime of the aggregate.

Rules:
- Identity must never change after creation.
- Equality between aggregates is based on identity, not full state equality.
- Identity must be unique inside the aggregate type and ownership boundary.
- Tenant-scoped identities must never resolve across tenant boundaries.
- External references use aggregate identifiers rather than embedded mutable objects.

## Loading and Rehydration

Loading is the responsibility of a repository or persistence adapter. Rehydration is the responsibility of the aggregate model.

The repository retrieves durable data and reconstructs the aggregate through a dedicated rehydration path.

Rehydration must:
- Restore aggregate identity.
- Restore valid persisted state.
- Restore the persisted aggregate version.
- Restore internal entities and value objects through validated domain forms.
- Avoid recording new domain events for historical state.
- Avoid executing creation-only side effects.
- Reject corrupt or structurally invalid persisted state.

Example:

```ts
const session = LearningSession.rehydrate({
  id,
  version,
  status,
  progress,
  startedAt,
  completedAt,
});
```

Public creation factories and rehydration factories must remain separate because they have different semantic responsibilities.

## Command and Intent Handling

Aggregates receive domain intent through named methods.

Examples:
- `startMission()`
- `recordAttempt()`
- `unlockSkill()`
- `achieveMastery()`
- `awardCredit()`
- `completeSession()`

Aggregate methods must express domain meaning. Generic mutation methods such as `setStatus`, `updateData`, or `patch` are not valid domain behavior unless the domain itself explicitly defines that operation.

Application commands may contain actor, authorization, correlation, idempotency, and transport information. Only domain-relevant values should enter the aggregate method.

## State Transition Rules

Every state transition must follow this order:

1. Confirm the aggregate is in a state that allows the operation.
2. Validate input value objects and operation-specific rules.
3. Validate aggregate invariants.
4. Apply all state changes inside the consistency boundary.
5. Advance the aggregate version.
6. Record one or more domain events describing what occurred.
7. Return a domain result or complete without exposing mutable internals.

A rejected transition must not:
- Partially mutate state.
- Increment the aggregate version.
- Record a success event.
- Persist partial business effects.

## Transition Graphs

Each aggregate must define an explicit transition graph.

Example:

```text
PLANNED -> ACTIVE -> COMPLETED
              |          |
              v          v
           PAUSED     ARCHIVED
              |
              v
            ACTIVE
```

Rules:
- Transitions not present in the graph are rejected.
- Terminal states must be explicit.
- Reopening a completed or closed aggregate requires an explicit domain transition.
- A repository must not force a state that the aggregate cannot legally reach.
- Migration tooling may transform stored representations, but it must preserve domain meaning and auditability.

## Invariant Enforcement

An invariant is a rule that must remain true for the aggregate after every successful transition.

Invariants must be enforced:
- At creation.
- During rehydration integrity checks.
- Before and after relevant transitions.
- Before persistence when defensive validation is useful.

Examples:
- A completed mission cannot have incomplete required objectives.
- Mastery cannot be achieved below the declared mastery threshold.
- Credits cannot be spent below an allowed balance.
- A learning session cannot complete before it starts.
- A skill cannot unlock before its dependency requirements are satisfied.

Invariants belong inside the aggregate or domain policies explicitly invoked by the aggregate. They must not exist only in UI validation or database constraints.

## Aggregate Version

Every persisted aggregate carries a monotonically increasing version.

Version rules:
- A newly persisted aggregate begins at the version defined by the repository contract, normally `1` after its creation transition.
- Each successful domain transition that changes persisted state increments the version exactly once.
- Multiple domain events emitted by one atomic transition share the same resulting aggregate version unless a more granular event-stream policy is explicitly adopted.
- Rejected or no-op operations do not increment the version.
- Rehydration restores the persisted version without incrementing it.
- The version is not a timestamp and must not be derived from wall-clock time.

The aggregate version provides:
- Optimistic concurrency control.
- Per-aggregate event ordering.
- Stale-write detection.
- Snapshot compatibility checks.
- Recovery verification.

## No-Op and Duplicate Intent

An operation that requests a state already achieved must follow an explicit policy.

Allowed policies are:
- Return an idempotent success without mutation or a new event.
- Reject with a stable domain failure.
- Record a distinct repeated-action event only when repetition has domain meaning.

The policy must be consistent for each operation. Silent mutation, accidental version increments, and duplicate success events are not allowed.

## Domain Event Recording

After a valid transition, the aggregate records immutable domain events as defined in 18D.

The aggregate maintains an in-memory collection of pending events.

Required behavior:
- Events are recorded only after state has changed successfully.
- Event order matches transition order inside the aggregate.
- Event metadata includes the resulting aggregate version.
- Pending events are exposed as a read-only collection.
- Pending events are cleared only after the persistence boundary confirms durable capture according to repository policy.
- Rehydrating historical state does not recreate pending events.

Example lifecycle:

```text
aggregate.complete()
  -> state becomes COMPLETED
  -> version becomes 8
  -> MissionCompleted(version=8) recorded
  -> repository saves state and event atomically
  -> pending events marked committed
```

## Persistence Boundary

The repository is the persistence boundary for an aggregate.

Repository responsibilities:
- Load one aggregate by identity and ownership boundary.
- Rehydrate the aggregate.
- Persist the complete authoritative aggregate state or append its event stream according to the chosen storage model.
- Enforce expected-version concurrency.
- Durably capture pending domain events with the aggregate write.
- Return the persisted version or a stable concurrency failure.

Repository non-responsibilities:
- Inventing domain events.
- Bypassing aggregate methods.
- Repairing invalid domain state silently.
- Applying business transitions.
- Publishing external messages before durable persistence succeeds.

## Transaction Boundary

One aggregate is the default transactional consistency boundary.

Within one aggregate operation:
- State changes and durable event capture must commit atomically.
- Failure must roll back the entire aggregate write.
- External side effects must not occur inside the database transaction unless explicitly designed as durable transactional resources.

Changes across multiple aggregates must be coordinated by the application layer using explicit workflows, process managers, sagas, or compensating actions.

A transaction spanning multiple aggregates is exceptional and requires documented justification because it increases coupling and reduces independent evolution.

## Optimistic Concurrency

All aggregate writes must use optimistic concurrency unless a stronger documented mechanism is required.

The application supplies the expected persisted version when saving.

```text
loaded version = 7
aggregate transition -> local version = 8
save expectedVersion = 7
```

The write succeeds only when durable storage still contains version `7`.

If storage has another version:
- The write is rejected.
- No pending event is published.
- The application decides whether to reload, retry, merge, or report conflict.
- The repository must not overwrite the newer state silently.

Automatic retry is allowed only when the full command is safe to re-evaluate against newly loaded state.

## Snapshot Integration

Snapshots reduce reconstruction cost but never replace aggregate authority.

A snapshot must contain:
- Aggregate identity and type.
- Aggregate version represented by the snapshot.
- Snapshot schema version.
- Domain state required for deterministic rehydration.
- Creation timestamp and integrity metadata when required.

Snapshot rules:
- A snapshot is created only from a valid aggregate state.
- Loading verifies aggregate type, identity, and version compatibility.
- Events or state changes after the snapshot version must be applied in deterministic order.
- An incompatible snapshot must be ignored or migrated through an explicit recovery path.
- Snapshot creation must not generate domain events.
- Deleting a snapshot must not delete authoritative aggregate history.

Snapshot and recovery mechanics must align with 17D Runtime Recovery & Snapshot Architecture.

## Recovery Lifecycle

Recovery reconstructs the last verified aggregate state after interruption, stale runtime state, or partial infrastructure failure.

Recovery must distinguish:
- Durable aggregate state.
- Pending but uncommitted in-memory changes.
- Durably recorded but not yet published events.
- Published events awaiting consumer completion.
- Runtime projections or caches that can be rebuilt.

The durable aggregate repository and event/outbox records are authoritative. UI state, memory caches, wake signals, and conversation acknowledgements are not proof that a transition committed.

Recovery sequence:

```text
Read durable version
  -> Load compatible snapshot or state
  -> Rehydrate aggregate
  -> Apply remaining authoritative history when applicable
  -> Validate identity, version, and invariants
  -> Resume application workflow from durable evidence
```

A recovery process must never manufacture a successful domain transition to compensate for missing durable evidence.

## Event Publication Lifecycle

Persistence and publication are separate lifecycle stages.

Recommended sequence:

```text
Aggregate transition
  -> Aggregate state + event/outbox committed
  -> Transaction completes
  -> Publisher reads durable event/outbox
  -> Runtime or integration event emitted
  -> Consumer processes idempotently
  -> Delivery status recorded
```

This sequence prevents external publication of events for aggregate writes that later fail.

## Completion and Closure

Completion is a domain state, not automatic deletion.

A completed aggregate may:
- Remain queryable.
- Permit explicitly defined post-completion operations.
- Produce final projections or rewards.
- Transition to archived after a retention or operational policy.

A closed aggregate rejects all mutations except explicitly declared administrative or recovery operations.

Closing must be represented by a valid aggregate transition and corresponding domain event when it carries business meaning.

## Archive Policy

Archival removes an aggregate from active operational workflows while preserving required history.

Rules:
- Archival must be explicit and auditable.
- Archived aggregates remain addressable when history, compliance, learning analysis, or recovery requires them.
- Archival must not reuse the aggregate identity for another aggregate.
- Restoring an archived aggregate requires an explicit transition if allowed.
- Physical deletion is an infrastructure retention action and must not be confused with domain archival.

## Deletion Policy

Hard deletion is not part of the normal aggregate lifecycle.

Hard deletion may be allowed only for documented cases such as:
- Legally required personal-data erasure.
- Invalid test or development data.
- Expired transient aggregates with no audit requirement.

Deletion workflows must define:
- Authorization.
- Referential impact.
- Event and audit retention.
- Projection cleanup.
- Recovery consequences.
- Whether anonymization is preferable to deletion.

The domain must never silently delete an aggregate as a substitute for a valid terminal transition.

## Time Authority

Aggregate methods must not read the system clock implicitly when the time affects domain meaning.

Authoritative times such as `startedAt`, `completedAt`, or `awardedAt` should be supplied by the application layer through a clock abstraction or command context.

This supports:
- Deterministic testing.
- Replay and recovery.
- Consistent event timestamps.
- Protection from hidden infrastructure dependencies.

## Cross-Aggregate Coordination

An aggregate must reference other aggregates by identity, not by holding mutable aggregate instances.

Cross-aggregate rules may be coordinated through:
- Application services.
- Domain services for pure domain decisions.
- Process managers or sagas.
- Domain events and explicit follow-up commands.
- Read models used as non-authoritative decision inputs where consistency tolerance is documented.

A transition that requires strongly consistent state from another aggregate may require boundary redesign or an explicit application-level transaction policy.

## Error and Failure Semantics

Aggregate failures must use stable domain meanings.

Examples:
- `INVALID_STATE_TRANSITION`
- `MISSION_ALREADY_COMPLETED`
- `MASTERY_THRESHOLD_NOT_REACHED`
- `SKILL_DEPENDENCY_NOT_SATISFIED`
- `INSUFFICIENT_CREDIT_BALANCE`

Domain failures must not expose Prisma errors, SQL details, HTTP status codes, queue errors, or UI messages.

Application and presentation layers map domain failures into their own contracts.

## Determinism

For the same valid starting state and the same domain inputs, aggregate behavior must produce the same resulting domain state and event meaning.

Nondeterministic values such as identifiers, random outcomes, and timestamps must be supplied explicitly or generated through injected domain-safe abstractions.

Determinism is required for:
- Reliable testing.
- Event replay.
- Runtime recovery.
- Conflict diagnosis.
- Auditability.

## Example: Learning Session Lifecycle

```text
NOT_STARTED
  -> start()
  -> ACTIVE
  -> pause()
  -> PAUSED
  -> resume()
  -> ACTIVE
  -> complete()
  -> COMPLETED
  -> archive()
  -> ARCHIVED
```

Example rules:
- `start()` records `LearningSessionStarted`.
- `pause()` is allowed only from `ACTIVE`.
- `resume()` is allowed only from `PAUSED`.
- `complete()` requires all completion invariants to pass.
- `complete()` records `LearningSessionCompleted`.
- No normal learning attempt can be added after `COMPLETED`.
- Rehydration restores state and version without recording historical events again.

## Example: Skill Mastery Lifecycle

```text
LOCKED
  -> unlock()
  -> AVAILABLE
  -> beginPractice()
  -> IN_PROGRESS
  -> updateProgress()
  -> IN_PROGRESS
  -> achieveMastery()
  -> MASTERED
```

Example rules:
- Unlocking requires dependency satisfaction.
- Progress updates cannot reduce authoritative mastery below allowed policy without an explicit remediation transition.
- Mastery requires the declared threshold and evidence policy.
- `MasteryAchieved` is recorded only on the first successful transition into `MASTERED` unless re-mastery is separately defined.

## Relationship to Previous Architecture

### 18A — Domain Core
Defines the domain model, ownership of business rules, and dependency direction.

### 18B — Aggregate Boundaries
Defines which state and invariants belong inside each consistency boundary.

### 18C — Value Objects
Defines immutable validated values used throughout aggregate state and behavior.

### 18D — Domain Events
Defines immutable facts recorded after successful aggregate transitions.

### 17C — Runtime Event Contracts
Defines safe runtime message exchange after domain events are mapped beyond the aggregate boundary.

### 17D — Runtime Recovery & Snapshot Architecture
Defines runtime restoration and snapshot behavior that must use durable aggregate evidence and compatible versions.

## Design Rules

- Aggregate state changes only through aggregate-root behavior.
- Every successful transition leaves the aggregate valid.
- One aggregate is the default atomic consistency boundary.
- Rehydration restores history without creating new business facts.
- Version increments follow successful persisted-state transitions only.
- Domain events are recorded by aggregates and durably captured with state.
- Repositories persist aggregates but do not decide business transitions.
- Expected-version checks prevent silent lost updates.
- Snapshots optimize reconstruction but are never the sole authority.
- Completed and archived states are explicit domain concepts.
- Hard deletion requires a separate documented policy.
- Runtime recovery advances only from durable verified evidence.
- Domain code remains independent from HTTP, Prisma, SQL, queues, UI, and framework lifecycles.

## Completion Criteria

18E is complete when the architecture defines:
- Aggregate authority and lifecycle stages.
- Creation, loading, and deterministic rehydration.
- State-transition and invariant rules.
- Version increment and optimistic concurrency behavior.
- Domain-event recording and persistence sequencing.
- Transaction and cross-aggregate boundaries.
- Snapshot and recovery integration.
- Completion, archival, and deletion policies.
- The relationship between aggregate lifecycle, 18A–18D, and runtime architecture 17C–17D.
