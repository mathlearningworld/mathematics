# 20F — Messaging and Event Bus

## 1. Purpose

This document defines the messaging and event-bus architecture for Math Learning World.

Its purpose is to allow modules and external processes to react to committed business changes without coupling domain logic to transport technology or assuming unreliable message delivery is exactly once.

## 2. Scope

This document defines:

- domain events and integration events;
- in-process and out-of-process dispatch;
- transactional outbox;
- consumers and handlers;
- delivery guarantees;
- idempotency and deduplication;
- ordering;
- retry and dead-letter behavior;
- event schema evolution;
- observability;
- testing and completion criteria.

## 3. Core Principle

> State changes are authoritative in the owning module; messages communicate committed facts and requests for follow-up work.

Messaging must improve decoupling and resilience without hiding business workflows or weakening consistency rules.

## 4. Event Categories

### 4.1 Domain Events

Domain events represent facts raised by an aggregate during domain behavior.

Examples:

```text
AnswerSubmitted
MasteryEvidenceRecorded
LearningSessionCompleted
MentorshipCreditGranted
MissionClosed
```

Domain events:

- use domain language;
- are created by Domain behavior;
- describe something that already happened;
- are technology-neutral;
- may be handled inside the same process;
- are not automatically public integration contracts.

### 4.2 Application Events

Application events represent use-case-level outcomes or operational signals not owned by a single aggregate.

Examples:

```text
LearnerPathwayRecalculationRequested
ProgressProjectionRefreshRequested
ContentGenerationRequested
```

They are created by application orchestration and remain technology-neutral.

### 4.3 Integration Events

Integration events are durable, versioned contracts intended for another module, process, or external system.

An integration event is derived from a committed domain/application outcome and contains only the data required by consumers.

It must not expose internal aggregate structure by default.

## 5. Commands Versus Events

A command asks a specific capability to perform work.

An event announces that something has already happened.

```text
Command: GeneratePracticeSet
Event: PracticeSetGenerated
```

Commands may fail or be rejected. Events are historical facts and must not be phrased as instructions.

Do not disguise commands as events merely to avoid declaring ownership.

## 6. In-Process Dispatch

In-process handlers may be used for work that:

- must occur within the current application execution;
- does not require durable asynchronous delivery;
- is fast and deterministic;
- respects the same transaction decision.

Handlers must not create invisible dependency chains. Critical behavior should be explicit in the application flow or documented as a required event handler.

An in-process event bus is not a substitute for the transactional outbox when another process must receive the event reliably.

## 7. Transactional Outbox

The outbox is the required bridge between database commit and external message publication.

Within the same database transaction:

1. persist aggregate/application state;
2. create the integration-event outbox record;
3. commit both atomically.

After commit, a dispatcher reads unpublished outbox rows and publishes them.

This avoids the dual-write failure where database state commits but message publication is lost, or a message publishes before state commits.

## 8. Outbox Record

A durable outbox record should contain:

```text
id
eventType
schemaVersion
occurredAt
recordedAt
aggregateType
aggregateId
tenantId/workspaceId where applicable
correlationId
causationId
payload
status
attemptCount
nextAttemptAt
publishedAt
lastErrorCategory
```

The payload must be serialized in a stable format and validated before publication.

Outbox rows are immutable as business event records except for delivery metadata.

## 9. Dispatcher

The dispatcher is responsible for:

- claiming eligible rows safely;
- publishing to the configured transport;
- recording success;
- recording classified failure;
- scheduling bounded retries;
- preventing uncontrolled concurrent publication;
- exposing operational metrics.

Multiple dispatcher instances must coordinate through database locking, lease ownership, or broker-safe semantics.

A dispatcher crash after publishing but before marking success may cause duplicate delivery. Consumers must therefore be idempotent.

## 10. Delivery Guarantee

The baseline guarantee is:

```text
at-least-once delivery
```

The system must not claim exactly-once delivery across database and broker boundaries.

Exactly-once business effect is approached through:

- stable message identifiers;
- consumer deduplication;
- idempotent handlers;
- transactional consumer state updates;
- reconciliation.

## 11. Consumer Contract

A consumer must:

1. validate envelope and schema version;
2. check message identity/deduplication state;
3. validate tenant/workspace context;
4. execute one bounded application operation;
5. persist business effect and consumption record atomically where needed;
6. acknowledge only after successful durable completion;
7. classify failures for retry or dead-letter handling.

Consumer code must not mutate another module's database tables directly.

It calls the owning module through an application contract or consumes the event into its own model.

## 12. Idempotent Consumption

Each message has a globally unique event ID.

Consumers requiring durable protection store a consumption record keyed by:

```text
consumerName + eventId
```

If the same message is received again, the consumer returns the previously completed outcome or acknowledges without repeating the effect.

Deduplication records must be written in the same transaction as the consumer's durable effect.

Payload equality must not be used as message identity.

## 13. Ordering

Global event ordering is not assumed.

Where ordering matters, it must be scoped explicitly, such as:

- per aggregate;
- per learner;
- per learning session;
- per workflow.

Possible mechanisms include:

- aggregate version;
- sequence number;
- partition key;
- expected predecessor state;
- consumer-side gap detection.

Consumers must tolerate unrelated events arriving in any order.

A stale event must not overwrite a newer projection or workflow state.

## 14. Event Envelope

A standard envelope should include:

```ts
interface IntegrationEventEnvelope<T> {
  eventId: string;
  eventType: string;
  schemaVersion: number;
  occurredAt: string;
  producer: string;
  correlationId: string;
  causationId?: string;
  tenantId?: string;
  aggregate?: {
    type: string;
    id: string;
    version?: number;
  };
  payload: T;
}
```

Transport metadata must remain separate from business payload where possible.

## 15. Correlation and Causation

Correlation identifies one end-to-end operation or workflow.

Causation identifies the command or event that directly caused the new message.

These identifiers must propagate through:

```text
HTTP request
→ application command
→ database transaction
→ outbox event
→ broker message
→ consumer command
```

They support tracing, debugging, and cycle detection.

## 16. Schema Evolution

Integration events are public contracts once consumers depend on them.

Rules:

- include an explicit schema version;
- prefer additive changes;
- do not rename or remove fields silently;
- define defaults for optional fields;
- keep consumers tolerant of unknown additive fields;
- publish a new event version for breaking changes;
- support migration windows where producers and consumers deploy independently;
- document deprecation and removal criteria.

Internal Domain event classes may evolve more freely, but mapping to integration events must remain explicit.

## 17. Payload Design

Events should contain enough data for the intended consumers without becoming database snapshots.

Prefer:

- identifiers;
- relevant changed values;
- authoritative timestamp;
- version/sequence;
- minimal context needed to avoid unstable synchronous callbacks.

Avoid:

- secrets;
- access tokens;
- unnecessary personal data;
- full aggregate serialization;
- provider-specific DTOs;
- derived data consumers can compute safely;
- mutable URLs with private credentials.

## 18. Transport Abstraction

Application and Domain code must not import broker SDKs.

Infrastructure defines adapters for transports such as:

- PostgreSQL-backed queue during early stages;
- Redis-supported worker queues;
- managed message brokers;
- cloud pub/sub systems.

The event envelope and consumer semantics remain stable even if the transport changes.

Transport abstraction should not pretend all brokers have identical capabilities. Infrastructure configuration must state the selected delivery, ordering, retention, and size limits.

## 19. Retry Policy

Retry only failures likely to succeed later.

Retryable examples:

- temporary database unavailability;
- broker interruption;
- provider rate limiting;
- downstream temporary unavailability;
- lock timeout.

Non-retryable examples:

- unsupported schema version;
- invalid payload;
- missing mandatory identity;
- authorization/policy rejection that will not change;
- invariant violation caused by incompatible data.

Retries must be bounded, use backoff with jitter, and preserve attempt history.

## 20. Dead-Letter Handling

Messages that exceed retry limits or fail permanently move to a dead-letter state or queue.

Dead-letter records must preserve:

- original message identity and envelope;
- consumer name;
- failure category;
- attempt count;
- first and last failure time;
- safe diagnostic information;
- replay status.

Dead-lettering is not completion. It creates an operational obligation for review, repair, replay, or explicit discard.

Replay must retain the original event ID unless a new business command is intentionally created.

## 21. Poison Messages

A poison message repeatedly crashes or blocks a consumer.

Consumers must isolate poison messages so one invalid event cannot stop an entire partition or queue indefinitely.

Validation should occur before business mutation, and permanent schema/payload failures should be dead-lettered promptly.

## 22. Backpressure

Consumers and dispatchers must respect downstream capacity.

Controls may include:

- bounded concurrency;
- batch size limits;
- lease duration;
- rate limits;
- queue-depth thresholds;
- delayed retry;
- circuit breakers;
- autoscaling where available.

The system must degrade predictably under backlog rather than exhausting database connections or memory.

## 23. Event-Driven Workflows

Long-running processes may use events to advance explicit workflow state.

A workflow must store:

- current state;
- expected event/command;
- completed steps;
- idempotency identities;
- deadlines;
- retry/recovery state;
- terminal success/failure state.

The event stream alone must not be treated as a hidden workflow engine unless event sourcing is explicitly adopted for that boundary.

## 24. Projections

Projection consumers create read models from committed events.

Projection rules:

- each event application is idempotent;
- aggregate version or sequence prevents stale overwrite;
- projection checkpoint is durable;
- rebuild is possible from an authoritative source where required;
- projection lag is observable;
- projection failure does not corrupt write-side authority.

The UI must distinguish authoritative command completion from potentially delayed projection visibility where this matters.

## 25. Security and Tenant Isolation

Messages carrying tenant/workspace context must be validated at both producer and consumer boundaries.

Consumers must not trust a tenant identifier merely because it is present in the payload.

Authorization for a new command is evaluated by the consuming application where required.

Sensitive learner data must be minimized, encrypted in transit, and protected according to transport and retention policies.

## 26. Observability

Required telemetry includes:

- outbox backlog size and age;
- publication success/failure rate;
- consumer lag;
- processing duration;
- retry count;
- duplicate count;
- dead-letter count;
- oldest unprocessed message;
- event type and schema version;
- correlation and causation IDs;
- projection checkpoint lag.

Logs must avoid full sensitive payloads by default.

Alerts should focus on sustained backlog, oldest-message age, repeated permanent failures, and dead-letter growth.

## 27. Testing

Required tests include:

- aggregate state and outbox atomic commit;
- no outbox record after rollback;
- dispatcher claim concurrency;
- duplicate publication tolerance;
- consumer idempotency;
- consumer effect and deduplication atomicity;
- retry classification;
- dead-letter transition;
- unsupported schema handling;
- event version compatibility;
- out-of-order event protection;
- tenant isolation;
- correlation and causation propagation;
- projection replay and checkpoint behavior where applicable.

Real PostgreSQL and the selected broker/queue integration environment are required for infrastructure behavior that mocks cannot prove.

## 28. Anti-Patterns

The following are prohibited:

- publishing before database commit;
- dual-writing database and broker without an outbox or equivalent guarantee;
- claiming exactly-once delivery;
- non-idempotent consumers;
- using events as hidden commands;
- direct cross-module table mutation;
- treating broker order as global truth;
- exposing full aggregates as event payloads;
- silent breaking schema changes;
- infinite retries;
- discarding dead-letter messages without evidence;
- allowing one poison message to block all processing;
- placing broker SDK types in Domain or Application contracts.

## 29. Completion Criteria

This architecture is satisfied when:

- Domain, Application, and integration events are distinguished clearly;
- integration events are generated only from committed outcomes;
- aggregate changes and outbox records commit atomically;
- dispatch provides at-least-once delivery;
- every durable consumer is idempotent;
- ordering assumptions are scoped explicitly;
- envelopes carry version, correlation, and causation metadata;
- retry and dead-letter policies are bounded and observable;
- schema evolution rules support independent deployment;
- transport SDKs remain isolated in Infrastructure;
- queue, consumer, and projection behavior is covered by integration tests.

## 30. Decision Summary

Math Learning World will use a transactional outbox and at-least-once messaging model. Domain events remain internal facts; integration events are explicit, minimal, versioned public contracts. Consumers will be idempotent, ordering assumptions will be scoped, retries will be bounded, and dead-letter states will be operationally visible. Messaging transports remain replaceable Infrastructure adapters and will never become the authority for core business state.
