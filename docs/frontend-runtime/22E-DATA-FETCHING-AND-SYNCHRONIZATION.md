# 22E — Data Fetching and Synchronization

## 1. Purpose

This document defines how Math Learning World frontends load, cache, synchronize, invalidate, and recover server-backed data.

It governs:

- query ownership;
- command/query separation;
- cache identity;
- freshness and staleness;
- background refetch;
- invalidation;
- optimistic updates;
- uncertain outcomes;
- realtime reconciliation;
- offline-aware behavior;
- request cancellation;
- retry policy;
- pagination synchronization;
- testing obligations.

---

## 2. Core Principle

> The frontend may cache and predict server state, but it must never confuse a local projection with durable authority.

Server-backed data is represented in the client as a synchronized projection with explicit freshness, ownership, and recovery semantics.

---

## 3. Runtime Layers

Recommended flow:

```text
UI
  → feature query or command hook
  → query/command runtime
  → API client
  → HTTP contract
  → application service
  → server authority
```

Responses flow back through normalization, cache update, feature projection, and UI selectors.

The UI must not call `fetch` directly for product workflows.

---

## 4. Query Ownership

Each feature module owns:

- query keys;
- request DTO mapping;
- response decoding;
- cache policy;
- invalidation rules;
- feature selectors;
- loading and failure projection.

Example:

```text
modules/practice/
  data/
    practice-query-keys.ts
    practice-queries.ts
    practice-commands.ts
    practice-decoders.ts
```

Neutral transport infrastructure may be shared, but feature-specific cache semantics stay with the feature.

---

## 5. Query Keys

A query key must uniquely identify the semantic server projection.

```ts
const learnerPathKey = (learnerId: LearnerId) =>
  ['learner-path', learnerId] as const;

const skillHistoryKey = (input: SkillHistoryQuery) =>
  ['skill-history', canonicalize(input)] as const;
```

Rules:

- include tenant/account scope where needed;
- include every filter that changes the result;
- use canonical normalized inputs;
- never include access tokens;
- avoid unstable object identity;
- version the key when response meaning changes incompatibly.

---

## 6. Response Decoding

Every external response is untrusted until decoded.

The frontend should validate:

- envelope shape;
- required identifiers;
- enum values;
- timestamps;
- pagination metadata;
- nullable versus absent fields;
- version or discriminator fields where required.

A transport success with an invalid body is a client-visible contract failure, not valid data.

---

## 7. Cache Scope

Cache scope must align with authorization scope.

Data scoped to one learner, tenant, account, class, or actor must not be reused after context change unless the cache key proves that scope.

On logout or identity switch, the runtime must clear or isolate protected cache entries.

Public reference data may have broader lifetime when explicitly safe.

---

## 8. Freshness Model

Each query declares a freshness policy.

```ts
type FreshnessPolicy = {
  staleAfterMs: number;
  expireAfterMs: number;
  refetchOnFocus: boolean;
  refetchOnReconnect: boolean;
};
```

Typical categories:

- nearly static reference data;
- account/session context;
- learner progress summary;
- active practice session;
- live classroom or mentor view;
- gameplay session state.

High-change operational data requires shorter stale windows than curriculum metadata.

---

## 9. Stale-While-Revalidate

Where safe, the runtime may show cached data immediately while fetching a fresher projection.

The UI should distinguish:

- initial loading with no usable data;
- usable but stale data;
- background refresh;
- refresh failure while old data remains usable.

A background refresh failure should not erase a valid prior projection.

---

## 10. Commands

Commands represent explicit state-changing intent and follow Chapter 21C.

A feature command runtime owns:

- request validation;
- idempotency identity;
- expected version where required;
- pending state;
- retry classification;
- result decoding;
- cache reconciliation;
- failure projection;
- uncertain-outcome handling.

Command completion must not be inferred only from a button click or optimistic UI change.

---

## 11. Optimistic Updates

Optimistic updates are allowed only when rollback or reconciliation is well-defined.

Suitable cases:

- low-risk preference changes;
- local ordering changes;
- reversible labels;
- actions with strong idempotency and deterministic server outcome.

High-risk operations should generally await server confirmation:

- credit transactions;
- assessment submission;
- mastery certification;
- entitlement changes;
- irreversible deletion;
- operations involving external billing.

---

## 12. Optimistic State Contract

```ts
type OptimisticMutation<TBefore, TPredicted> = {
  mutationId: string;
  before: TBefore;
  predicted: TPredicted;
  startedAt: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'uncertain';
};
```

The UI must be able to distinguish predicted state from confirmed state when that distinction matters to the user.

---

## 13. Rollback and Reconciliation

On command rejection:

1. retain failure context;
2. roll back only the state changed by that mutation;
3. avoid overwriting unrelated newer updates;
4. refetch authoritative projections when local rollback is ambiguous;
5. present a meaningful recovery action.

Rollback must use captured pre-mutation state or patch metadata, not assumptions about current cache contents.

---

## 14. Uncertain Outcomes

A network timeout after request transmission does not prove command failure.

For idempotent or operation-backed commands, the runtime should:

- preserve command identity;
- mark outcome uncertain;
- query operation status or retry with the same idempotency key;
- avoid issuing a logically new command;
- reconcile the final authoritative result.

The UI should communicate that confirmation is pending rather than falsely claiming success or failure.

---

## 15. Invalidation

Invalidation must be semantic.

Example:

```text
complete practice session
  → invalidate active session
  → refresh learner path summary
  → refresh skill progress
  → refresh parent dashboard summary
```

Avoid invalidating the entire cache after every command. Broad invalidation hides missing dependency knowledge and wastes network and rendering work.

---

## 16. Direct Cache Updates

A command result may directly update cache when the response contains sufficient authoritative data.

Use direct update when:

- the result contract is complete;
- affected query identity is known;
- no hidden server-side effects alter related projections.

Use invalidation/refetch when:

- multiple projections may change;
- server computation is complex;
- authorization affects resulting shape;
- event-driven side effects may still be pending.

---

## 17. Mutation Serialization

Commands affecting the same aggregate may require serialization.

Examples:

- answer changes for one assessment item;
- practice session completion;
- reorder operations;
- repeated tool-selection persistence.

The runtime may queue, collapse, or reject concurrent commands according to feature policy.

It must not silently reorder noncommutative commands.

---

## 18. Request Cancellation

Cancelable queries should be aborted when:

- route identity changes;
- filter changes supersede prior input;
- component scope is disposed;
- a newer request replaces an older request;
- account or tenant context changes.

Command requests must not be treated as safely canceled merely because the client stopped waiting. Their outcome may be uncertain.

---

## 19. Retry Policy

Retries depend on operation type and failure class.

Safe automatic retries:

- idempotent GET queries;
- transient network failures;
- selected 502/503/504 responses;
- command retries using the same idempotency identity when contract permits.

Do not automatically retry:

- validation failures;
- access denial;
- version conflicts without reconciliation;
- idempotency-key payload conflicts;
- non-idempotent commands without operation identity.

Use bounded exponential backoff with jitter.

---

## 20. Deduplication

Concurrent equivalent queries should share one in-flight request where possible.

Deduplication identity must include semantic query scope.

Commands must not be deduplicated solely by endpoint and body unless the command contract explicitly defines shared identity.

---

## 21. Pagination

Paginated data follows Chapter 21H.

The frontend must preserve:

- cursor ordering;
- page boundaries;
- applied filter identity;
- duplicate suppression;
- stable item identity;
- end-of-list state.

When filters or sorting change, the previous pagination chain must be discarded or isolated under a different key.

---

## 22. Infinite Collections

Infinite lists should merge pages by stable resource identity while retaining server order.

The runtime must handle:

- repeated boundary items;
- deleted items;
- changed sort keys;
- stale cursors;
- refresh from first page;
- partial page failure.

A stale cursor should trigger a safe restart of the collection rather than corrupting order.

---

## 23. Realtime Synchronization

Realtime events are hints or durable update signals according to Chapter 21I.

Upon receiving an event, the client may:

- patch a known projection;
- invalidate relevant queries;
- fetch a changed resource;
- update presence or transient state;
- ignore an event already represented locally.

Events must be deduplicated by stable event identity where provided.

---

## 24. Event Ordering

The runtime must not assume network arrival order equals business order.

Where version information exists:

- ignore older versions;
- apply the next valid version;
- refetch when a version gap appears;
- reconcile after reconnect.

For projections without versioning, prefer invalidation and refetch over unsafe local patching.

---

## 25. Reconnect Recovery

After reconnect:

1. restore session validity;
2. resume or recreate realtime subscription;
3. replay from a supported cursor when possible;
4. refetch critical active queries;
5. reconcile pending and uncertain commands;
6. surface only unresolved failures.

The runtime must assume events may have been missed while disconnected.

---

## 26. Offline-Aware Reads

Cached reads may remain available offline when:

- data is safe to retain locally;
- the user can understand its freshness;
- authorization context remains valid enough for the product policy;
- expiration rules are enforced.

The UI must not label stale offline data as current.

---

## 27. Offline Commands

Offline command queuing requires explicit feature support.

A queued command needs:

```ts
type QueuedCommand = {
  commandId: string;
  idempotencyKey: string;
  type: string;
  payload: unknown;
  actorScope: string;
  createdAt: string;
  expiresAt?: string;
  expectedVersion?: number;
};
```

Commands involving stale business context may require user review before replay.

Do not queue sensitive or irreversible commands by default.

---

## 28. Session and Context Changes

On logout, account switch, learner switch, or tenant switch:

- cancel scoped queries;
- stop realtime subscriptions;
- isolate or clear protected cache;
- clear pending optimistic state;
- preserve only explicitly public data;
- restart synchronization under the new context.

No protected projection may bleed across identities.

---

## 29. Error Projection

Data errors should be classified into:

- validation;
- unauthenticated;
- unauthorized;
- not found;
- conflict;
- rate limited;
- transient unavailable;
- offline;
- contract decode failure;
- unknown.

The UI maps categories to feature-appropriate actions rather than exposing transport internals.

---

## 30. Loading State Model

Avoid a single boolean such as `isLoading` for all situations.

Prefer explicit state:

```ts
type QueryState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; freshness: 'fresh' | 'stale' }
  | { status: 'refreshing'; data: T }
  | { status: 'failure'; error: QueryError; previousData?: T };
```

This allows the UI to preserve useful data during refresh and failure.

---

## 31. Gameplay Synchronization

Gameplay contains both high-frequency local state and durable learning state.

Keep local:

- frame position;
- target scoring;
- hover/selection;
- local prediction;
- animation;
- placement preview.

Synchronize durably:

- mission start/completion;
- learning objective progress;
- answer or action evidence;
- inventory changes when authoritative;
- checkpoint state;
- rewards and credits.

Do not send frame-level state through ordinary API commands.

---

## 32. Prefetching

Prefetch only when there is a strong probability of near-term use and cost is controlled.

Good candidates:

- next route summary;
- selected learner path;
- next practice item metadata;
- small world manifest;
- adjacent pagination page.

Avoid prefetching sensitive, expensive, or large content without user intent.

---

## 33. Cache Persistence

Persistent cache is optional and must be allowlisted.

Persisted entries require:

- schema version;
- identity scope;
- creation and expiry timestamps;
- migration or discard policy;
- encryption where product risk requires it;
- logout clearing behavior.

Never persist access tokens inside the query cache.

---

## 34. Observability

Record operational signals such as:

- query latency;
- cache hit ratio;
- retry count;
- decode failures;
- stale-data duration;
- command uncertainty;
- reconciliation failures;
- reconnect recovery time.

Telemetry must avoid answer content, tokens, and unnecessary learner-sensitive payloads.

---

## 35. Testing Obligations

Tests must cover:

- query-key stability;
- response decoding;
- cache scoping;
- freshness transitions;
- background refresh;
- invalidation dependencies;
- optimistic commit and rollback;
- uncertain command outcome;
- retry classification;
- request cancellation;
- pagination merge;
- realtime deduplication;
- version-gap recovery;
- reconnect reconciliation;
- logout and account switch clearing;
- offline read and queued-command policy;
- gameplay durable/local boundary.

---

## 36. Non-Negotiable Rules

1. UI components do not call product APIs directly.
2. Every query has feature ownership and a stable semantic key.
3. Server responses are decoded before entering trusted state.
4. Protected cache is scoped by identity and tenant context.
5. Optimistic state never masquerades as confirmed authority.
6. Command timeout does not prove failure.
7. Invalidation is semantic, not indiscriminately global.
8. Realtime events require deduplication and reconciliation.
9. Offline command replay is explicit, bounded, and idempotent.
10. Gameplay frame state and durable learning state remain separate.

---

## 37. Completion Standard

Data Fetching and Synchronization is architecturally complete when:

- query and command runtimes are separated;
- feature modules own cache contracts;
- query keys and response decoders are defined;
- freshness, retry, cancellation, and invalidation policies are explicit;
- optimistic and uncertain states are modeled;
- pagination and realtime reconciliation are safe;
- identity changes clear or isolate protected state;
- offline behavior is intentionally bounded;
- gameplay synchronization boundaries are defined;
- contract, runtime, and operational tests can verify the full flow.
