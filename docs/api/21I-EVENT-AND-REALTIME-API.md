# 21I — Event and Realtime API

## 1. Purpose

This document defines how Math Learning World exposes asynchronous events, subscriptions, notifications, and realtime updates to external and frontend consumers.

It governs:

- event contract design;
- event identity and versioning;
- delivery semantics;
- ordering and deduplication;
- realtime subscriptions;
- reconnect and replay;
- authorization;
- presence and transient signals;
- webhook delivery;
- failure handling;
- testing and observability.

---

## 2. Core Principle

> Realtime delivery accelerates awareness; it does not replace the authoritative command and query contracts.

Events communicate that something occurred. Queries remain the source for reconstructing current readable state unless a contract explicitly defines otherwise.

---

## 3. Event Categories

Math Learning World distinguishes:

### 3.1 Domain event

An internal fact emitted by a domain model, such as:

```text
PracticeSessionCompleted
MasteryThresholdReached
MentorshipInvitationAccepted
```

### 3.2 Integration event

A durable externally consumable fact derived from committed application state.

### 3.3 Realtime projection notification

A message informing clients that a readable view changed or should be refreshed.

### 3.4 Transient signal

An ephemeral message such as presence, cursor position, typing state, or short-lived interaction feedback.

These categories must not be treated as interchangeable.

---

## 4. Event Envelope

Durable external events use a stable envelope:

```json
{
  "eventId": "01J...",
  "eventType": "practice-session.completed",
  "eventVersion": 1,
  "occurredAt": "2026-07-21T08:30:00Z",
  "publishedAt": "2026-07-21T08:30:01Z",
  "aggregate": {
    "type": "practice-session",
    "id": "ps_...",
    "version": 12
  },
  "tenantId": "tenant_...",
  "correlationId": "corr_...",
  "causationId": "cmd_...",
  "data": {}
}
```

Fields not applicable to a public consumer may be omitted, but meaning must remain consistent.

---

## 5. Event Identity

`eventId` uniquely identifies one published event occurrence.

Rules:

- retries preserve the same `eventId`;
- replay preserves the original `eventId` unless the replay contract explicitly wraps it in a new delivery identity;
- consumers deduplicate by `eventId` within their retention window;
- event identity is not reused for a semantically different fact.

A delivery attempt may have its own separate identifier.

---

## 6. Event Type Naming

Public event types use stable, domain-oriented names:

```text
practice-session.started
practice-session.completed
assessment-attempt.submitted
learner-mastery.updated
mentorship-invitation.accepted
```

Avoid infrastructure-oriented names such as:

```text
row.updated
db.change
handler.finished
```

Event types describe meaningful facts already completed.

---

## 7. Event Versioning

Each event carries an explicit integer contract version.

A new version is required when:

- required data changes;
- field meaning changes;
- a field is removed;
- event scope changes;
- authorization visibility changes materially;
- ordering assumptions change.

Additive optional fields may remain in the same version when consumers are required to ignore unknown fields.

Historical events retain their original version.

---

## 8. Publication Authority

External events are published only after the authoritative state transition is durably committed.

Recommended flow:

```text
Application command
  → domain transition
  → persistence commit
  → outbox record
  → event publication
  → consumer delivery
```

The API handler must not publish integration events directly before transaction success.

---

## 9. Delivery Semantics

The default durable delivery model is **at least once**.

This means:

- duplicates are possible;
- consumers must be idempotent;
- events may be delayed;
- delivery attempts may be retried;
- exactly-once business effects require consumer-side transactional design, not transport assumptions.

Transient realtime signals may use best-effort delivery when loss is acceptable.

---

## 10. Ordering

Global ordering is not promised unless explicitly implemented.

The preferred guarantee is ordering per aggregate or stream key:

```text
aggregate.type + aggregate.id
```

Consumers must not infer ordering across unrelated learners, sessions, or tenants.

When aggregate versions are present, a consumer can detect:

- duplicate version;
- missing version;
- stale delivery;
- out-of-order delivery.

---

## 11. Event Payload Design

An event payload should contain enough information to understand the fact, but not become an uncontrolled copy of the entire aggregate.

Include:

- identifiers needed for routing;
- changed semantic values required by consumers;
- authoritative timestamps;
- contract version;
- trace metadata.

Avoid:

- secrets;
- access tokens;
- unnecessary personal data;
- persistence-specific fields;
- mutable snapshots presented as immutable fact;
- large binary content.

Consumers may query the current resource when richer state is needed.

---

## 12. Notification versus State Transfer

Two patterns are allowed:

### 12.1 Invalidation notification

```json
{
  "eventType": "learner-dashboard.changed",
  "data": {
    "learnerId": "learner_..."
  }
}
```

The client refetches the query resource.

### 12.2 State-bearing event

```json
{
  "eventType": "practice-session.completed",
  "data": {
    "sessionId": "ps_...",
    "completedAt": "...",
    "scorePercent": 84
  }
}
```

The contract must clearly state whether payload data is sufficient to update local state safely.

---

## 13. Realtime Transport

Frontend realtime delivery may use:

- WebSocket;
- Server-Sent Events;
- managed pub/sub transport;
- platform push notifications for background awareness.

Transport choice does not change event semantics.

SSE is suitable for server-to-client streams. WebSocket is suitable when bidirectional transient communication is genuinely required.

---

## 14. Connection Authentication

Realtime connections must authenticate using short-lived, scoped credentials.

Rules:

- do not place long-lived access tokens in URLs;
- revalidate authorization when subscribing;
- define token-expiry behavior;
- close or downgrade subscriptions after access revocation;
- bind the connection to actor and tenant context;
- never trust client-provided tenant identity without server validation.

Connection authentication and subscription authorization are separate checks.

---

## 15. Subscription Model

Subscriptions use explicit authorized channels or topics.

Examples:

```text
learner:{learnerId}:progress
practice-session:{sessionId}
mentor:{mentorId}:assignments
classroom:{classroomId}:readiness
```

The server resolves public subscription requests into internal topics after authorization.

Clients must not subscribe directly to raw broker topic names.

---

## 16. Subscription Authorization

Authorization is evaluated using:

- authenticated actor;
- tenant scope;
- role and permissions;
- relationship to the target learner, classroom, or mentorship;
- current resource state where required.

Authorization must be re-evaluated when:

- membership changes;
- learner relationship changes;
- role changes;
- tenant context changes;
- subscription is resumed after a long disconnect.

A subscription never grants broader query access than the actor already possesses.

---

## 17. Reconnect and Resume

Durable realtime streams should support resume where product value justifies it.

Client request may include:

```text
Last-Event-ID: 01J...
```

or an equivalent resume token.

The server defines:

- replay retention window;
- whether resume is per channel or connection;
- behavior when the token is expired;
- maximum replay size;
- fallback to full query refresh.

When replay cannot be guaranteed, the client must refetch authoritative query state.

---

## 18. Gap Detection

A client or consumer should detect missing data using one or more of:

- aggregate version gaps;
- stream sequence gaps;
- expired resume token;
- explicit `resync-required` control message;
- connection epoch change.

Example control message:

```json
{
  "type": "resync-required",
  "reason": "REPLAY_WINDOW_EXPIRED",
  "resources": ["learner-dashboard"]
}
```

The safe response is to query current state, not guess missing events.

---

## 19. Heartbeats and Liveness

Long-lived connections should define:

- heartbeat interval;
- idle timeout;
- reconnect backoff;
- maximum reconnect rate;
- server restart behavior.

Heartbeat messages carry no business meaning and must not be persisted as domain events.

---

## 20. Backpressure

The server must protect itself and clients from unbounded queues.

Possible controls:

- bounded per-connection buffer;
- coalescing invalidation notifications;
- dropping superseded transient signals;
- disconnecting persistently slow clients;
- requiring resynchronization;
- limiting subscription count.

Durable events must not be silently discarded merely because a realtime client is slow. They remain recoverable through replay or query refresh according to contract.

---

## 21. Presence and Transient Signals

Presence, typing, pointer, and movement feedback are ephemeral.

They may be:

- best effort;
- short-lived;
- coalesced;
- dropped under load;
- scoped to active participants.

They must not become authoritative evidence of learning completion, attendance, mastery, assessment submission, or credit transfer.

---

## 22. Webhook Delivery

External system integrations may receive signed webhooks.

Each webhook request includes:

```http
X-Webhook-Id: ...
X-Webhook-Timestamp: ...
X-Webhook-Signature: ...
```

Webhook contracts define:

- signature algorithm and key rotation;
- replay-attack window;
- retry schedule;
- timeout;
- accepted success status range;
- duplicate delivery;
- disablement after repeated failure;
- manual replay support;
- event version.

---

## 23. Webhook Retry Policy

Retries use exponential backoff with bounded duration.

A consumer must acknowledge only after it has durably accepted the event.

Typical classification:

- `2xx`: accepted;
- `408`, `429`, `5xx`: retryable;
- most other `4xx`: permanent until configuration changes.

The provider records attempt history without exposing secrets.

---

## 24. Dead-Letter and Recovery

Events that cannot be delivered after the retry policy enter a recoverable failure state.

Recovery data should include:

- event identity;
- destination identity;
- attempt count;
- last status;
- next action;
- failure classification;
- safe diagnostic information.

Dead-letter handling must support review and replay without creating a new business event.

---

## 25. Push Notifications

Mobile or platform push notifications are awareness channels, not authoritative state.

Payloads should minimize sensitive information and may contain only:

- notification category;
- safe display summary;
- deep-link target;
- resource identifier where appropriate.

Opening the app triggers normal authenticated queries.

---

## 26. Privacy and Data Minimization

Event delivery must respect the same privacy boundaries as queries.

The system must prevent:

- cross-tenant subscriptions;
- disclosure through topic names;
- personal data in logs or broker metadata;
- sensitive educational results in unauthenticated push previews;
- indefinite retention without purpose.

Retention differs by category: durable integration events, delivery logs, and transient signals require separate policies.

---

## 27. Idempotent Consumer Pattern

A durable consumer should process an event using a transactionally protected inbox or equivalent deduplication record.

Conceptual flow:

```text
receive event
  → verify contract and authorization context
  → check eventId
  → apply consumer state change
  → record processed eventId
  → acknowledge delivery
```

The state change and deduplication record should commit atomically where possible.

---

## 28. Eventual Consistency and UI

The UI must account for delayed projections.

After a successful command:

- command result may update immediate local intent state;
- realtime notification may arrive before or after query projection;
- query refresh may temporarily return the prior projection;
- UI should use correlation or operation state when available;
- the system must not show contradictory permanent success/failure messages.

Realtime does not guarantee read-your-writes unless explicitly designed.

---

## 29. Error and Control Messages

Realtime protocol errors use stable codes distinct from domain events:

```json
{
  "type": "error",
  "code": "SUBSCRIPTION_FORBIDDEN",
  "requestId": "subreq_..."
}
```

Examples:

```text
AUTHENTICATION_REQUIRED
TOKEN_EXPIRED
SUBSCRIPTION_FORBIDDEN
UNKNOWN_CHANNEL
SUBSCRIPTION_LIMIT_EXCEEDED
RESUME_TOKEN_EXPIRED
RATE_LIMITED
```

Protocol errors must not be disguised as business events.

---

## 30. Observability

Required telemetry includes:

- active connections;
- subscriptions by safe channel category;
- authentication failures;
- reconnect rate;
- replay count and replay gaps;
- publish-to-delivery latency;
- duplicate deliveries;
- consumer lag;
- buffer pressure;
- webhook attempts and failures;
- dead-letter count;
- authorization denials.

Metrics must avoid high-cardinality sensitive identifiers.

---

## 31. Testing Obligations

Tests must cover:

- event envelope validation;
- event version compatibility;
- publication only after commit;
- duplicate delivery;
- out-of-order delivery;
- aggregate version gap;
- subscription authorization;
- access revocation during a connection;
- reconnect and resume;
- expired replay window;
- slow consumer behavior;
- heartbeat timeout;
- webhook signature verification;
- webhook retry classification;
- dead-letter replay;
- transient signal loss tolerance;
- cross-tenant isolation.

Integration tests should prove the complete outbox-to-delivery path where infrastructure is available.

---

## 32. Governance Checklist

Before exposing an event or realtime channel, confirm:

- [ ] category is identified as durable event, notification, or transient signal;
- [ ] event type and version are explicit;
- [ ] publication follows durable commit;
- [ ] delivery semantics are documented;
- [ ] ordering scope is documented;
- [ ] consumers can deduplicate;
- [ ] subscription authorization is enforced;
- [ ] reconnect and gap behavior are defined;
- [ ] payload minimizes sensitive data;
- [ ] backpressure is bounded;
- [ ] failure recovery exists;
- [ ] tests cover duplicates, gaps, and revocation.

---

## 33. Completion Standard

Event and realtime API design is complete when consumers can receive timely updates without mistaking transport delivery for authoritative state, while duplicates, gaps, reconnects, authorization changes, and infrastructure failure remain explicit and recoverable.