# 22G — Offline, Cache, and Recovery

## 1. Purpose

This document defines how the Math Learning World frontend remains understandable, recoverable, and safe when connectivity, browser lifecycle, local storage, or remote services are unreliable.

It governs:

- offline capability boundaries;
- cache ownership and freshness;
- persisted client state;
- retry and backoff;
- uncertain command outcomes;
- browser refresh and crash recovery;
- stale-data behavior;
- conflict handling;
- gameplay continuity;
- recovery verification.

---

## 2. Core Principle

> Offline support is a declared product capability, not an accidental consequence of cached screens.

The frontend must always distinguish among:

- confirmed server state;
- locally cached server state;
- optimistic state;
- queued local intent;
- predicted gameplay state;
- uncertain state;
- unrecoverable local state.

The UI must never present one category as another.

---

## 3. Recovery Model

Every recoverable workflow follows:

```text
capture durable intent
  → record recovery metadata
  → attempt execution
  → classify outcome
  → reconcile with authority
  → resume, retry, compensate, or require human input
```

Recovery is transition-driven. Reopening the application must not blindly repeat side effects.

---

## 4. Offline Capability Classes

Each feature declares one capability class.

### 4.1 Online-required

The feature cannot safely proceed without current server authority.

Examples:

- payment or credit settlement;
- entitlement changes;
- account-security changes;
- final assessment submission when durable receipt is required;
- destructive administration.

The UI must disable or defer the action before collecting misleading completion state.

### 4.2 Offline-readable

Previously synchronized data may be viewed, but mutations are blocked.

Examples:

- downloaded lesson content;
- previously loaded progress reports;
- cached curriculum maps.

The UI must expose last-synchronized time and stale status when meaningful.

### 4.3 Offline-capturable

The user may create local work that is not yet authoritative.

Examples:

- draft notes;
- answer composition before submission;
- local practice telemetry;
- gameplay input buffered for a local-only scene.

Captured work must have a durable local identity and explicit synchronization state.

### 4.4 Offline-executable

The feature is intentionally local-first and can produce a valid local result before synchronization.

This class requires a documented merge, replay, or authority-transfer strategy.

---

## 5. Cache Ownership

Caches are owned by the runtime layer that understands their semantics.

```text
HTTP transport cache     → protocol/runtime infrastructure
query cache              → data synchronization runtime
asset cache              → asset runtime/service worker
feature draft cache      → owning feature module
gameplay scene cache     → gameplay runtime
session metadata cache   → security/session runtime
```

UI components must not create hidden durable caches.

---

## 6. Cache Categories

### 6.1 Immutable assets

Versioned bundles, images, audio, and static lesson packages may use long-lived caching when identity changes with content.

### 6.2 Reference data

Curriculum structures, skill metadata, and configuration may use revalidation with bounded staleness.

### 6.3 User-specific query data

Learner progress, account data, and assignments require identity-scoped cache keys and reset on authority changes.

### 6.4 Sensitive data

Sensitive data must not be persisted merely for convenience. The security classification determines whether memory-only, session-only, encrypted, or no client persistence is permitted.

### 6.5 Command results

Command outcomes may be cached only as part of idempotency, recovery, or reconciliation metadata. They are not general query-cache entries.

---

## 7. Cache Identity

A cache key must include every authority dimension that changes meaning.

Typical dimensions:

```ts
type CacheScope = {
  apiVersion: string;
  tenantId?: string;
  actorId?: string;
  learnerId?: string;
  locale?: string;
  resource: string;
  query: Record<string, unknown>;
};
```

Changing user, tenant, learner context, locale, compatibility version, or authorization scope must not reuse incompatible cached data.

---

## 8. Freshness States

Query data is classified as:

```text
fresh
stale-usable
stale-blocked
refreshing
unavailable
```

The owning feature defines the transition thresholds.

`stale-usable` means the UI may render the value while clearly avoiding decisions that require current authority.

`stale-blocked` means the cached value may be shown for context but cannot authorize an action.

---

## 9. Persisted Client State

Only state with a defined recovery purpose may be persisted.

Every persisted record declares:

- owner;
- schema version;
- identity scope;
- creation and update timestamps;
- expiry policy;
- migration policy;
- reset policy;
- sensitivity classification;
- recovery use case.

Example envelope:

```ts
type PersistedEnvelope<T> = {
  schemaVersion: number;
  owner: string;
  scopeKey: string;
  writtenAt: string;
  expiresAt?: string;
  payload: T;
};
```

Unknown or unsupported schema versions are discarded or migrated explicitly; they are never interpreted optimistically.

---

## 10. Durable Intent Ledger

Important resumable actions use a local intent ledger.

```ts
type PendingIntent = {
  intentId: string;
  intentType: string;
  idempotencyKey?: string;
  scopeKey: string;
  createdAt: string;
  lastAttemptAt?: string;
  attemptCount: number;
  state: 'CAPTURED' | 'SENDING' | 'UNCERTAIN' | 'RETRYABLE' | 'CONFIRMED' | 'FAILED';
  payloadFingerprint: string;
  recoveryHint?: string;
};
```

The ledger stores semantic intent and recovery metadata, not arbitrary component state.

---

## 11. Retry Policy

Retries are allowed only when the operation is safe to retry.

Automatic retry requires at least one of:

- an idempotency key;
- a naturally idempotent operation;
- a read-only request;
- an explicit server retry contract.

Backoff must be bounded and jittered. Repeated failures transition to a visible recoverable state rather than an infinite spinner.

Do not retry:

- validation failures;
- authorization failures;
- stable domain conflicts;
- incompatible client versions;
- requests whose duplicate effect cannot be prevented.

---

## 12. Uncertain Command Outcomes

A command becomes uncertain when the client cannot determine whether the server committed the effect.

Examples:

- connection lost after request transmission;
- timeout after the server began work;
- browser closed before response receipt;
- realtime confirmation lost.

The frontend must not assume failure and resubmit blindly.

Recovery order:

```text
lookup by operation/idempotency identity
  → query authoritative resource state
  → replay safely when contract permits
  → require user decision when still ambiguous
```

The UI may use labels such as “กำลังตรวจสอบผล” rather than “ล้มเหลว” until authority is known.

---

## 13. Browser Lifecycle Recovery

The runtime handles:

- refresh;
- tab suspension;
- process termination;
- device sleep;
- route restoration;
- service-worker update;
- reconnect after extended absence.

On startup:

```text
validate persisted schemas
  → resolve current identity/session
  → clear incompatible scopes
  → restore safe navigation intent
  → load pending intent ledger
  → reconcile uncertain operations
  → refresh stale authority data
  → resume eligible workflows
```

A previous route is restored only when authorization and required context still exist.

---

## 14. Conflict Handling

Conflicts are classified before presentation.

### 14.1 Version conflict

The server rejected a mutation because the authoritative version changed.

### 14.2 Identity or scope conflict

The local state belongs to another user, tenant, or learner context.

### 14.3 Semantic conflict

The requested transition is no longer valid.

### 14.4 Mergeable draft conflict

Both local and remote draft forms changed and a documented merge is possible.

The frontend must not silently overwrite authoritative data. Resolution may be automatic only when domain semantics make it deterministic.

---

## 15. Gameplay Continuity

Gameplay state is separated into:

```text
server-authoritative progression
durable local scene checkpoint
transient simulation state
predicted interaction state
input buffer
```

Transient animation, hover, preview, and target scoring are not persisted as authoritative progress.

A durable local checkpoint may include:

- scene identity and version;
- safe player position;
- inventory snapshot with authority marker;
- mission intent;
- placed-object draft state when the mode is intentionally local;
- last confirmed synchronization cursor.

On recovery, the runtime reconstructs simulation from the checkpoint and authoritative data; it does not serialize the entire in-memory engine graph.

---

## 16. Placement and Pickup Recovery

For Builders Valley-style interactions:

```text
confirmed inventory
  + current proximity geometry
  + resumable placement intent
  + explicit player selection
  → recovered active tool
```

Rules:

- an expired pickup target is never restored blindly;
- placement intent may resume when inventory and target geometry remain valid;
- entering valid pickup range may temporarily override placement;
- leaving pickup range returns to the last valid placement intent;
- uncertain placement checks authoritative scene state before repeating.

---

## 17. Service Worker Boundary

A service worker may manage:

- immutable asset precaching;
- runtime asset caching;
- navigation fallback for the application shell;
- background synchronization where supported and safe;
- update availability signaling.

It must not independently implement business rules, authorization, command replay, or domain conflict resolution.

A new service-worker version must avoid mixing incompatible application shell and data-schema versions.

---

## 18. Update Strategy

When a new frontend build is available:

- do not interrupt an active critical command;
- record recoverable drafts and intent;
- notify the user when refresh is required;
- force refresh only for security or compatibility emergencies;
- clear or migrate incompatible caches;
- preserve stable operation identities across reload.

---

## 19. Observability

Recovery telemetry should include:

- offline entry and duration;
- cache hit and stale-render decisions;
- persisted-state migration failure;
- retry count and terminal classification;
- uncertain command creation and resolution;
- recovery duration;
- abandoned pending intents;
- service-worker version transitions.

Telemetry must not include secrets or unnecessary learner content.

---

## 20. Failure UX

The UI distinguishes:

```text
waiting for connection
saved on this device
synchronizing
checking previous result
needs your decision
cannot continue safely
```

Generic “Something went wrong” is insufficient for recoverable operational states.

Every recovery action must describe the effect of retrying, discarding, or reopening.

---

## 21. Verification Obligations

Tests must cover:

- online to offline transition;
- stale cache rendering;
- identity switch cache reset;
- schema migration and discard;
- safe retry and prohibited retry;
- uncertain command reconciliation;
- browser refresh during command execution;
- service-worker upgrade;
- route restoration with expired authorization;
- gameplay checkpoint restore;
- placement/pickup intent recovery;
- duplicate side-effect prevention.

---

## 22. Completion Criteria

Offline, cache, and recovery architecture is complete when:

- every feature has a declared offline capability;
- all durable client state has ownership and versioning;
- retries are contract-safe;
- uncertain outcomes are first-class runtime states;
- identity changes clear incompatible data;
- gameplay continuity does not invent authority;
- failure UX supports informed recovery;
- runtime and operational verification prove the recovery paths.
