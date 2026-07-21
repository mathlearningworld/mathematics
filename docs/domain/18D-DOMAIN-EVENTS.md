# 18D — Domain Events

## Purpose
Define the immutable facts emitted by domain aggregates when meaningful business state changes occur in Math Learning World.

Domain events preserve domain meaning, support reliable downstream reactions, and provide the bridge between aggregate decisions and the runtime event contracts defined in 17C.

## Definition
A domain event is a past-tense statement that a valid domain transition has already occurred.

Examples:
- UserRegistered
- SkillUnlocked
- MissionCompleted
- MasteryAchieved
- CreditAwarded
- LearningSessionStarted
- LearningSessionCompleted

A domain event is not a command, request, database record, API response, or UI notification.

## Core Principles
- Immutable after creation.
- Named in past tense.
- Produced only after aggregate invariants have passed.
- Represents one meaningful domain fact.
- Contains the minimum data required to understand that fact.
- Does not contain infrastructure or transport concerns.
- Does not directly trigger external side effects inside the aggregate.

## Aggregate Publishing
Only an aggregate may publish events describing changes within its own consistency boundary.

The aggregate:
1. Validates the requested transition.
2. Applies the state change.
3. Creates the corresponding domain event.
4. Records the event as pending publication.

Events must not be published when the transition is rejected or when no meaningful domain state changed.

## Event Envelope
Every domain event must carry a stable metadata envelope.

Required metadata:
- `eventId` — globally unique event identity.
- `eventType` — stable event name.
- `eventVersion` — schema version for this event type.
- `aggregateId` — identity of the aggregate that emitted the event.
- `aggregateType` — stable aggregate category.
- `aggregateVersion` — aggregate version after the transition.
- `occurredAt` — authoritative domain occurrence time.
- `correlationId` — identity linking one end-to-end operation.
- `causationId` — identity of the command or event that directly caused this event.
- `tenantId` — tenant or learning-world ownership boundary when applicable.

Example shape:

```ts
interface DomainEvent<TPayload> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  aggregateId: string;
  aggregateType: string;
  aggregateVersion: number;
  occurredAt: string;
  correlationId: string;
  causationId: string | null;
  tenantId: string | null;
  payload: TPayload;
}
```

## Payload Rules
Event payloads must:
- Use domain language.
- Include identifiers rather than embedded aggregate objects.
- Contain facts known at the moment of occurrence.
- Avoid derived projections that can be rebuilt elsewhere.
- Avoid secrets, credentials, raw infrastructure errors, or presentation-only text.
- Remain compatible with the declared `eventVersion`.

## Ordering
Ordering is guaranteed only within one aggregate stream.

`aggregateVersion` provides the authoritative sequence for events emitted by the same aggregate.

Consumers must not assume global ordering across different aggregates, users, missions, sessions, or tenants.

## Versioning
Event names remain stable after publication.

When an event payload changes:
- Add backward-compatible optional fields when possible.
- Increment `eventVersion` for incompatible schema changes.
- Preserve old versions for historical replay and migration.
- Never reinterpret the meaning of an already-published event.

A new business meaning requires a new event type rather than silently changing an existing event.

## Invariants
- One `eventId` identifies exactly one immutable event.
- An aggregate version cannot produce conflicting event histories.
- Event occurrence must follow a successful aggregate transition.
- Duplicate delivery must not create duplicate business effects.
- Event metadata must preserve correlation and causation across boundaries.
- Tenant-scoped events must never cross tenant ownership boundaries.

## Delivery Semantics
Domain event creation and external delivery are separate responsibilities.

The domain records the event. The application and infrastructure layers are responsible for durable persistence, outbox handling, publication, retries, and observability.

Consumers must be idempotent because delivery may occur more than once.

## Integration Boundary
Domain events are internal domain facts.

Before leaving the bounded context, an event may be mapped into an integration event or runtime event contract. This mapping may:
- Remove private domain details.
- Add transport metadata.
- Translate internal names into public contract names.
- Stabilize schemas for external consumers.

External systems must not depend directly on aggregate implementation details.

## Relationship to 17C Runtime Event Contracts
18D defines why and when a domain fact exists.

17C defines how runtime components exchange event-shaped messages safely.

The relationship is:

```text
Aggregate transition
  -> Domain event
  -> Application handling
  -> Runtime or integration event mapping
  -> Durable delivery and consumer processing
```

A domain event may become a runtime event, but the two are not automatically identical.

## Initial Event Catalog

### Identity and Access
- `UserRegistered`
- `LearnerProfileCreated`
- `MentorAssigned`

### Learning Path
- `SkillUnlocked`
- `SkillPracticeStarted`
- `SkillProgressUpdated`
- `MasteryAchieved`
- `RemediationRequired`

### Mission
- `MissionStarted`
- `MissionCompleted`
- `MissionFailed`

### Learning Session
- `LearningSessionStarted`
- `LearningSessionPaused`
- `LearningSessionResumed`
- `LearningSessionCompleted`

### Economy and Rewards
- `CreditAwarded`
- `CreditSpent`
- `DiscountCreditGranted`

This catalog establishes domain vocabulary only. Exact payload contracts belong to later contract and implementation phases.

## Design Rules
- Aggregates emit events; repositories do not invent them.
- Event handlers must not mutate the originating aggregate implicitly.
- Cross-aggregate reactions occur through explicit application workflows.
- Domain events remain free of HTTP, Prisma, queue, database, and UI dependencies.
- Historical events are append-only.
- Event replay must produce deterministic domain state for the same event stream and domain version.

## Completion Criteria
18D is complete when the architecture defines:
- Domain event meaning and ownership.
- Immutable metadata and payload rules.
- Aggregate publication behavior.
- Ordering, versioning, and idempotency expectations.
- Integration boundaries.
- The relationship between domain events and 17C runtime event contracts.
