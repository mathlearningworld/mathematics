# 19I — Application Events

## 1. Purpose

This document defines the application-layer contract for application events in Math Learning World.

It is the Source of Truth for:

- application-event meaning;
- event ownership;
- event naming and payload design;
- publication timing;
- transactional publication;
- internal and integration consumers;
- delivery semantics;
- event versioning;
- observability;
- testing requirements.

---

## 2. Core Principle

> An application event communicates an accepted application outcome to interested consumers without transferring ownership of the originating business decision.

The originating use case remains responsible for deciding and committing the business change. Event consumers may react to that accepted outcome, but they must not reinterpret whether the original command should have succeeded.

---

## 3. Application Event Definition

An application event is an immutable message emitted after an application use case reaches a meaningful accepted outcome.

Examples:

- LearnerRegistered
- LearnerJoinedClassroom
- MissionAttemptCompleted
- SkillMasteryChanged
- ParentVerificationRecorded
- LearningSupportRecommended
- MentorCreditGranted
- AccountDiscountApplied

An application event is not:

- an HTTP response;
- a command disguised as an event;
- an ORM model snapshot;
- an unrestricted aggregate dump;
- a replacement for direct in-transaction invariant enforcement;
- proof that every downstream side effect has completed.

---

## 4. Relationship to Domain Events

Domain events express facts discovered or produced by domain behavior.

Application events express facts that the application has accepted and committed for broader consumption.

A use case may translate one or more domain events into an application event, but translation is not always one-to-one.

Example:

```text
Domain event:
SkillEvidenceAccepted

Application event:
SkillMasteryChanged
```

The application event may include use-case context, actor context, tenant context, and stable resource identifiers not owned by the domain event itself.

---

## 5. Relationship to Integration Events

An integration event is an externally published contract intended for another bounded context, service, or third-party integration.

An application event may remain internal or may be transformed into an integration event.

External contracts require stronger controls for:

- schema versioning;
- compatibility;
- privacy;
- retention;
- delivery guarantees;
- consumer ownership;
- deprecation.

Internal event names and payloads must not be exposed externally by accident.

---

## 6. Event Ownership

The module or bounded context that owns the completed use case owns the application event contract.

Ownership includes:

- naming;
- semantic definition;
- payload fields;
- versioning;
- publication policy;
- retention requirements;
- compatibility decisions;
- deprecation.

Consumers do not own or redefine producer event meaning.

---

## 7. Event Naming

Application event names should describe a completed fact in past tense.

Preferred:

```text
MissionAttemptCompleted
LearnerEnrollmentActivated
ParentVerificationRecorded
MentorCreditGranted
```

Avoid:

```text
CompleteMissionAttempt
ProcessLearner
UpdateProgress
SendNotification
```

Names must reflect business meaning rather than implementation detail.

---

## 8. Event Envelope

Every application event should use a stable envelope.

Example:

```ts
interface ApplicationEvent<TPayload> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  publishedAt?: string;
  correlationId: string;
  causationId?: string;
  tenantId?: string;
  actorId?: string;
  aggregateType?: string;
  aggregateId?: string;
  aggregateVersion?: number;
  payload: TPayload;
}
```

The envelope must separate event metadata from business payload.

---

## 9. Event Identity

Every event must have a globally unique, stable event ID.

The event ID must remain unchanged across retries and redelivery.

It enables:

- duplicate detection;
- consumer inbox tracking;
- trace correlation;
- replay diagnostics;
- operational support.

A new publication attempt must not create a new event identity for the same committed event.

---

## 10. Correlation and Causation

### Correlation ID

Groups related operations across a workflow or user interaction.

### Causation ID

Identifies the command, event, or request that directly caused the event.

These identifiers must be propagated across event-driven workflows to support traceability and loop detection.

They must not be used as authorization evidence.

---

## 11. Event Payload Design

Payloads must contain the minimum stable facts required by approved consumers.

Payloads should prefer:

- stable identifiers;
- explicit result state;
- authoritative timestamps;
- resulting version;
- compact business facts;
- safe classification values.

Payloads should avoid:

- complete aggregate snapshots;
- mutable display text as the only semantic field;
- secrets or credentials;
- unnecessary personal information;
- internal ORM shapes;
- short-lived URLs;
- fields consumers could safely query when needed.

---

## 12. Privacy and Data Minimization

Events may be retained, replicated, and observed by multiple systems. Therefore payloads must follow stricter minimization than synchronous responses.

Sensitive learner, child, parent, and family information must be included only when required by an approved consumer contract.

Where practical, events should carry identifiers and classification codes rather than personal details.

Event logging must redact protected data independently from payload serialization.

---

## 13. Publication Timing

An application event describing a committed business outcome must not be externally published before the originating transaction commits.

Publishing before commit can create phantom effects when the transaction later rolls back.

Preferred pattern:

1. Execute the command inside the transaction.
2. Persist aggregate changes.
3. Persist event or outbox record in the same transaction.
4. Commit the transaction.
5. Publish asynchronously from the durable outbox.
6. Mark delivery progress without changing the original business result.

---

## 14. Transactional Outbox

The transactional outbox is the default mechanism for reliable publication of durable application and integration events.

An outbox record should include:

- event ID;
- event type and version;
- serialized payload;
- tenant context;
- correlation and causation IDs;
- aggregate identity and version where relevant;
- creation time;
- publication status;
- attempt count;
- next-attempt time;
- last failure classification.

Business changes and their outbox records must commit atomically.

---

## 15. Delivery Semantics

The default practical guarantee is at-least-once delivery.

Therefore:

- producers may redeliver;
- brokers may redeliver;
- workers may retry;
- consumers must tolerate duplicates;
- event identity must remain stable;
- consumer progress must be durable where effects matter.

Exactly-once business effect must be achieved through idempotent consumers and durable constraints, not assumed from transport marketing guarantees.

---

## 16. Consumer Contract

A consumer must:

- subscribe only to events it is authorized and designed to process;
- validate event type and supported version;
- detect duplicate event IDs where needed;
- preserve tenant isolation;
- execute side effects idempotently;
- classify retryable and final failures;
- avoid changing producer-owned history;
- record enough evidence for operations.

A consumer must not depend on undocumented payload fields.

---

## 17. Consumer Inbox

For durable side effects, consumers should use an inbox or equivalent processed-event record.

Recommended flow:

1. Begin consumer transaction.
2. Claim or insert the event ID.
3. If already completed, acknowledge duplicate delivery.
4. Validate event contract and authorization scope.
5. Apply the consumer-owned effect.
6. Mark the inbox record complete.
7. Commit.

The inbox record and consumer effect should be atomic where infrastructure permits.

---

## 18. Ordering

Global event ordering must not be assumed.

When ordering matters, define the scope explicitly, such as:

- per aggregate;
- per learner;
- per account;
- per mission attempt;
- per credit ledger.

Aggregate version or stream position may be used to detect stale or missing events.

Consumers must define behavior for:

- duplicate events;
- late events;
- out-of-order events;
- missing predecessor events;
- replayed historical events.

---

## 19. Event Versioning

Every externally durable event contract must declare a version.

Compatible evolution may include:

- adding optional fields;
- adding new enum values when consumers are required to tolerate them;
- clarifying documentation without semantic change.

Breaking evolution includes:

- removing fields;
- changing field meaning;
- changing requiredness incompatibly;
- changing identity or ordering semantics;
- changing units or formats without compatibility handling.

Breaking changes require a new event version or event type and an explicit migration plan.

---

## 20. Schema Validation

Serialized events must be validated against their declared contract at publication and consumption boundaries.

Validation should confirm:

- envelope completeness;
- supported event type;
- supported version;
- required identifiers;
- timestamp format;
- payload structure;
- field constraints;
- privacy classification where implemented.

Invalid durable events must not be silently dropped.

---

## 21. Internal Synchronous Events

In-process synchronous application events may be used only for non-critical coordination that does not require durable delivery.

They must not be used when:

- the effect must survive process failure;
- retry is required;
- the consumer changes durable business state independently;
- cross-service delivery is required;
- operational replay is required.

Critical side effects must use durable publication.

---

## 22. Notifications

Notifications are consumer-owned effects, not the originating business event itself.

Example:

```text
MissionAttemptCompleted
  -> Progress projection updates
  -> Parent notification policy evaluates
  -> Achievement animation becomes available
```

The originating command should not directly send email, push notification, or external message inside its business transaction.

---

## 23. Projections

Read-model projections may consume application events when event-driven projection is appropriate.

Projection consumers must:

- be idempotent;
- track version or position;
- handle rebuilds;
- tolerate replay;
- expose freshness expectations;
- avoid becoming hidden write authority for aggregates.

A projection is derived state and must not silently become the Source of Truth for domain invariants.

---

## 24. Failure Handling

Failures should be classified as:

```text
RETRYABLE
FINAL_CONTRACT_FAILURE
FINAL_POLICY_FAILURE
QUARANTINED
```

Retryable failures may include temporary network or dependency outages.

Final contract failures include unsupported versions or malformed payloads.

Poison events must move to a durable quarantine or dead-letter path with operational evidence. Infinite retry without visibility is prohibited.

---

## 25. Replay

Event replay must be deliberate and scoped.

Before replay, operators must know:

- which event range is included;
- which consumers will receive it;
- whether consumers are replay-safe;
- whether external side effects are suppressed or deduplicated;
- how progress and rollback will be observed.

Replay must not generate new event IDs for the original events.

---

## 26. Observability

Operational evidence should include:

- event ID;
- event type and version;
- producer use case;
- tenant-safe context;
- correlation and causation IDs;
- outbox status;
- publication attempts;
- consumer name;
- inbox or duplicate status;
- processing duration;
- final failure classification.

Payload logging must follow privacy and redaction rules.

---

## 27. Testing Requirements

Tests must cover:

- event created only for accepted outcomes;
- no external publication before commit;
- rollback does not expose phantom events;
- outbox record commits with business state;
- stable event identity across retries;
- duplicate consumer delivery;
- unsupported version handling;
- out-of-order delivery where relevant;
- retryable consumer failure;
- poison-event quarantine;
- tenant isolation;
- privacy-safe payloads;
- replay behavior;
- projection rebuild behavior where applicable.

Runtime Gate verification must include real durable outbox and consumer behavior for critical paths.

---

## 28. Anti-patterns

Prohibited patterns include:

- publishing before transaction commit;
- using events to enforce same-transaction invariants;
- sending complete database rows as payloads;
- exposing internal events as public contracts accidentally;
- creating new event IDs on retry;
- assuming exactly-once transport delivery;
- non-idempotent consumers;
- infinite retry without quarantine;
- silently ignoring unsupported event versions;
- embedding secrets or excessive personal data;
- direct network side effects inside aggregate persistence;
- relying on global event ordering.

---

## 29. Completion Criteria

This contract is satisfied when:

- event ownership and semantics are explicit;
- durable events use stable envelopes and identities;
- business state and outbox records commit atomically;
- publication occurs only after commit;
- consumers are duplicate-safe and tenant-safe;
- externally durable contracts are versioned;
- privacy is minimized by design;
- failures, retries, quarantine, and replay are operationally defined;
- critical event flows are verified through durable infrastructure.