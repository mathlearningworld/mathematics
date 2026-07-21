# 22C — State Management and Store Design

## 1. Purpose

This document defines how Math Learning World models, owns, updates, persists, derives, and verifies frontend state.

It governs:

- state classification;
- store ownership;
- server-state integration;
- local runtime authority;
- selectors and projections;
- persistence;
- synchronization;
- optimistic and uncertain state;
- gameplay state;
- reset and teardown;
- testing.

---

## 2. Core Principle

> Every state value must have one clear owner, one declared authority level, and one defined lifecycle.

State management is not the act of putting values into a global store.

It is the discipline of deciding:

- what the value means;
- who may change it;
- whether it is durable;
- how it becomes stale;
- how it is restored;
- how conflicts are resolved;
- how the UI consumes it.

---

## 3. State Classification

All frontend state should be classified before implementation.

### 3.1 Server state

Remote, durable, versioned, and potentially shared.

Examples:

- learner records;
- progress summaries;
- practice session state;
- assessment results;
- credits;
- mentorship relationships.

Preferred owner: query and command runtime.

### 3.2 Runtime authority state

Client-owned state that coordinates application behavior.

Examples:

- authenticated session projection;
- selected workspace;
- active recovery target;
- pending command registry;
- connectivity state;
- current gameplay intent.

Preferred owner: narrowly scoped runtime store.

### 3.3 Workflow state

State used to coordinate one module workflow.

Examples:

- multi-step setup progress;
- current assessment step;
- answer draft registry;
- mentorship invitation wizard;
- report export setup.

Preferred owner: module store or route-scoped controller.

### 3.4 View state

Purely visual and local.

Examples:

- dialog open state;
- focused tab;
- expanded section;
- hover target;
- animation phase.

Preferred owner: component or local hook.

### 3.5 Gameplay simulation state

High-frequency local world state.

Examples:

- position;
- velocity;
- collision candidates;
- placement preview;
- animation frame;
- nearby interaction candidates.

Preferred owner: gameplay runtime, not React state.

### 3.6 Persisted continuity state

Minimal state required to resume safely.

Examples:

- last safe route;
- interrupted draft identity;
- active session identity;
- current mission intent;
- pending upload reference.

Preferred owner: continuity store plus persistence adapter.

---

## 4. Store Ownership

A store must represent one coherent runtime authority.

Good:

```text
sessionStore
workspaceStore
continuityStore
connectivityStore
practiceSessionDraftStore
buildersValleyIntentStore
```

Weak:

```text
appStore
allStateStore
globalStore
```

A large store may be justified only if all contained values share:

- the same lifecycle;
- the same reset boundary;
- the same persistence policy;
- the same authority;
- the same synchronization rules.

---

## 5. Store Contract

Every store should define:

```ts
type StoreContract<State, Actions> = {
  state: State;
  actions: Actions;
  selectors: Record<string, unknown>;
  persistence: PersistencePolicy;
  reset: ResetPolicy;
  transitions: readonly string[];
};
```

The actual library may differ, but these concepts must remain explicit.

---

## 6. State Transitions

Store mutation should occur through named semantic actions.

Good:

```ts
sessionExpired();
recoveryStarted(target);
placementIntentSelected(materialId);
commandOutcomeBecameUncertain(commandId);
```

Weak:

```ts
setState({ status: 'x' });
update({ ...anything });
```

Semantic actions improve:

- diagnostics;
- transition testing;
- invariants;
- replay understanding;
- code review.

---

## 7. Store Transition Policy

Important stores should document allowed transitions.

Example:

```text
IDLE
  → RESTORING
  → READY
  → RECOVERING
  → READY
  → RESET
```

Invalid transitions should be rejected or ignored deliberately.

For consequential state, accidental transition acceptance is a runtime defect.

---

## 8. Server State Must Not Be Duplicated Casually

Do not copy query results into a global store merely for convenience.

Duplication creates:

- stale mirrors;
- conflicting invalidation;
- unclear authority;
- unnecessary synchronization;
- difficult tests.

Keep server state in the query runtime unless the module requires a separately owned local model.

When transformation is needed, prefer selectors or adapters.

---

## 9. Normalization

Normalize shared or relational server data when it improves consistency.

Example:

```ts
type EntityState<T> = {
  byId: Record<string, T>;
  allIds: string[];
};
```

Normalization is useful for:

- repeated entities;
- partial updates;
- event-driven reconciliation;
- large collections;
- stable selectors.

Do not normalize tiny isolated payloads solely to follow a pattern.

---

## 10. Selectors

Selectors are the official projection boundary from store state to UI meaning.

A selector should:

- expose stable meaning;
- hide internal representation;
- minimize subscriptions;
- remain pure where possible;
- compose safely.

Example:

```ts
const selectCanPlaceSelectedMaterial = (state: BuildersValleyState) =>
  state.intent.kind === 'PLACE' &&
  state.intent.remainingCount > 0 &&
  state.target.valid;
```

Components should not repeatedly reconstruct business-like conditions from raw fields.

---

## 11. View Models

Complex screens should consume view models built from selectors and query state.

Example:

```ts
type PracticeSessionViewModel = {
  title: string;
  progressPercent: number;
  answerState: 'EMPTY' | 'DRAFTED' | 'SUBMITTING' | 'CONFIRMED';
  canSubmit: boolean;
  warning?: string;
};
```

A view model may combine:

- server state;
- local draft state;
- capability state;
- request state;
- route state.

It must not become a second mutable source of truth.

---

## 12. Command Lifecycle State

Commands should have explicit lifecycle state.

```ts
type CommandLifecycle =
  | { status: 'IDLE' }
  | { status: 'PENDING'; commandId: string }
  | { status: 'SUCCEEDED'; commandId: string }
  | { status: 'FAILED'; commandId: string; code: string }
  | { status: 'UNCERTAIN'; commandId: string; recoveryKey: string };
```

A timeout does not necessarily mean failure.

Uncertain commands must remain recoverable through stable identity.

---

## 13. Optimistic State

Optimistic state must be represented separately from confirmed state.

Recommended model:

```ts
type OptimisticPatch<T> = {
  commandId: string;
  baseVersion?: number;
  apply: (current: T) => T;
  rollback: (current: T) => T;
};
```

Optimistic updates require:

- deterministic rollback;
- clear conflict policy;
- bounded lifetime;
- command correlation;
- reconciliation after success.

Do not use optimistic confirmation for high-consequence outcomes such as final assessment submission or credit transfer unless the product explicitly distinguishes pending from confirmed.

---

## 14. Draft State

Drafts should remain separate from authoritative resources.

Example:

```ts
type AnswerDraft = {
  attemptId: string;
  questionId: string;
  value: unknown;
  changedAt: string;
  syncState: 'LOCAL' | 'SAVING' | 'SAVED' | 'FAILED';
};
```

Draft persistence must define:

- scope;
- expiration;
- ownership;
- encryption needs;
- conflict behavior;
- cleanup after submission.

---

## 15. Persistence Policy

Every persisted store must declare:

```ts
type PersistencePolicy = {
  enabled: boolean;
  storage: 'SESSION' | 'LOCAL' | 'INDEXED_DB';
  schemaVersion: number;
  expiresAfterMs?: number;
  sensitive: boolean;
  migrate?: (value: unknown) => unknown;
};
```

Persist only the minimum needed.

Do not persist:

- access tokens in broadly readable storage when avoidable;
- complete query caches without a clear offline requirement;
- derived values that can be recomputed;
- high-frequency simulation frames;
- stale authorization assumptions.

---

## 16. Restoration

Restoration is not blind deserialization.

Recommended process:

```text
Read persisted record
  → validate schema
  → validate owner scope
  → check expiration
  → migrate or discard
  → restore into RESTORING state
  → revalidate against server/session
  → promote to READY
```

Corrupted or incompatible state should be discarded safely.

---

## 17. Reset Boundaries

Stores need explicit reset policies.

Reset triggers may include:

- logout;
- tenant switch;
- learner switch;
- module completion;
- route disposal;
- incompatible schema;
- privacy timeout;
- fatal recovery failure.

Example:

```ts
type ResetPolicy = {
  onLogout: boolean;
  onWorkspaceChange: boolean;
  onRouteLeave: boolean;
};
```

Sensitive state should default toward stronger reset behavior.

---

## 18. Cross-Store Coordination

Avoid direct circular subscriptions between stores.

Preferred mechanisms:

- application runtime coordinator;
- explicit event dispatcher;
- command result handler;
- selector composition;
- route lifecycle orchestration.

Example:

```text
SESSION_EXPIRED event
  → Session runtime resets identity
  → Command runtime pauses protected work
  → Query runtime clears protected cache
  → Router enters recovery route
```

No single store should secretly mutate all others.

---

## 19. Cross-Tab Synchronization

State that must remain consistent across tabs may use:

- BroadcastChannel;
- storage events;
- service worker messaging.

Candidates:

- logout;
- session refresh completion;
- workspace change;
- client update requirement.

Cross-tab messages must be:

- schema-versioned;
- origin-aware;
- free of secrets;
- idempotent;
- safely ignorable by older clients.

---

## 20. Connectivity State

Connectivity should not rely only on `navigator.onLine`.

Recommended state:

```ts
type ConnectivityState = {
  browserOnline: boolean;
  apiReachable: boolean | 'UNKNOWN';
  lastSuccessfulRequestAt?: string;
  lastFailureAt?: string;
  mode: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
};
```

The runtime should derive connectivity from actual request evidence.

---

## 21. Gameplay Intent Store

Gameplay intent is a strong example of a runtime authority store.

It may own:

```ts
type GameplayIntent =
  | { kind: 'NONE' }
  | { kind: 'PICKUP'; targetId?: string; source: 'AUTO' | 'MANUAL' }
  | { kind: 'PLACE'; materialId: string; source: 'AUTO' | 'MANUAL' };
```

Transition policy may prioritize:

1. immediate valid close-range interaction;
2. explicit manual player choice;
3. remaining placement intent;
4. inferred next action;
5. neutral fallback.

The store must distinguish:

- automatic selection;
- manual override;
- temporary proximity override;
- restoration after leaving proximity;
- depletion of remaining material.

This avoids brittle tool-switch behavior spread across scene objects.

---

## 22. Gameplay Simulation State

Frame-level simulation state should live outside general UI stores.

Use a bridge to publish coarse state at controlled frequency.

Example:

```ts
type GameplayUiProjection = {
  selectedIntent: GameplayIntent;
  nearbyTarget?: TargetSummary;
  placementValidity: 'VALID' | 'INVALID' | 'NONE';
  inventorySummary: Record<string, number>;
};
```

This protects React from frame-rate subscriptions.

---

## 23. Store Performance

Store design should minimize unnecessary updates.

Use:

- narrow selectors;
- stable object identities;
- shallow comparison where appropriate;
- normalized entities;
- batched actions;
- throttled gameplay projection;
- derived memoization only where measured.

Avoid premature complexity. Measure render and interaction latency first.

---

## 24. Error State

Errors should be stored only where their lifecycle requires it.

Examples:

- field error → form state;
- query error → query runtime;
- command conflict → command lifecycle;
- fatal runtime error → shell state;
- gameplay interaction refusal → transient gameplay projection.

Do not create one global `error` field.

Each error should have:

- scope;
- code;
- visibility policy;
- recovery action;
- dismissal/reset rule.

---

## 25. Time and Expiration

Time-dependent state should use an injected clock in logic and tests.

Examples:

- cache freshness;
- draft expiration;
- session refresh scheduling;
- command timeout;
- continuity confidence decay.

Do not scatter direct `Date.now()` calls through stores when deterministic behavior matters.

---

## 26. State Versioning

Persisted or cross-runtime state requires a schema version.

Example:

```ts
type PersistedEnvelope<T> = {
  schemaVersion: number;
  savedAt: string;
  ownerScope: string;
  payload: T;
};
```

Migration policy must choose one of:

- migrate;
- partially recover;
- discard and restart.

Silent incompatible restoration is prohibited.

---

## 27. Store Security

Stores must not expose sensitive values broadly.

Rules:

- keep token material inside session infrastructure;
- avoid storing secrets in devtools-visible state;
- clear protected state on logout;
- scope persisted records by user and tenant;
- never trust restored permissions without revalidation;
- redact telemetry snapshots.

---

## 28. Testing

Each important store should have tests for:

- initial state;
- valid transitions;
- invalid transitions;
- selector outputs;
- persistence restoration;
- expiration;
- reset policy;
- duplicate event handling;
- conflict reconciliation;
- uncertain command recovery.

Gameplay intent stores additionally require scenario tests such as:

```text
remaining placeable material
  → auto-select placement
  → enter close pickup range
  → temporary pickup override
  → leave close range
  → restore placement intent
```

---

## 29. Architecture Verification

Automated checks should detect:

- imports of module-internal stores from other modules;
- raw HTTP calls inside UI components;
- unrestricted mutation exports;
- persisted stores without version metadata;
- shared components importing workflow modules;
- gameplay frame state connected directly to broad React subscriptions.

---

## 30. Prohibited Patterns

Do not:

- mirror every API response in a global store;
- expose a generic `set` action to arbitrary callers;
- persist state without ownership scope;
- mix draft and confirmed data in one field;
- treat timeout as failure without recovery;
- let components derive authorization from role strings repeatedly;
- use one global error state;
- synchronize stores through hidden circular subscriptions;
- publish every gameplay frame to React;
- restore stale state without validation.

---

## 31. Required Invariants

1. Every state value has one owner.
2. Server state is not duplicated without explicit reason.
3. Store transitions are semantic.
4. Selectors define public projection.
5. Persisted state is versioned and scoped.
6. Reset behavior is explicit.
7. Pending, optimistic, confirmed, failed, and uncertain states remain distinguishable.
8. Gameplay simulation and UI projection are separated.
9. Cross-store coordination is explicit.
10. Sensitive state is encapsulated and cleared safely.

---

## 32. Completion Criteria

State architecture is complete when:

- all major state has a declared class;
- runtime authority stores are documented;
- server-state lifecycle uses the query/command runtime;
- module stores expose semantic actions and selectors;
- persistence policies are explicit;
- continuity restoration is validated;
- gameplay intent transitions are testable;
- reset and teardown behavior is verified;
- prohibited dependencies are checked automatically.

---

## 33. Final Rule

> A good frontend store does not merely remember values; it preserves the authority, lifecycle, and meaning of those values.
