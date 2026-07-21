# 22B — Frontend Runtime Architecture

## 1. Purpose

This document defines the structural architecture of the Math Learning World frontend runtime.

It describes:

- runtime layers;
- module boundaries;
- application shell responsibilities;
- dependency direction;
- boot and hydration;
- runtime authority stores;
- command/query integration;
- gameplay integration;
- error and recovery boundaries;
- observability and verification.

---

## 2. Architectural Goal

> The frontend runtime must remain modular, deterministic, recoverable, and honest about the difference between local interaction and durable system truth.

The architecture should support:

- product screens;
- learning workflows;
- gameplay scenes;
- mobile and desktop surfaces;
- intermittent connectivity;
- gradual feature evolution;
- independent module ownership;
- typed API contracts;
- runtime diagnostics.

---

## 3. High-Level Runtime

```text
Browser / Device
  → Bootstrap
  → Runtime Kernel
  → Application Shell
  → Route Runtime
  → Feature Module Runtime
  → Query / Command Runtime
  → API Boundary
  → Backend
```

Parallel client concerns:

```text
Persistence Adapter
Recovery Controller
Session Controller
Telemetry Adapter
Gameplay Engine Adapter
Accessibility Runtime
```

---

## 4. Runtime Layers

### 4.1 Bootstrap layer

Responsible for:

- loading environment configuration;
- creating runtime dependencies;
- installing global error capture;
- restoring safe continuity state;
- initializing session state;
- mounting the application once.

Bootstrap must not contain product workflow logic.

### 4.2 Runtime kernel

Provides stable client-wide capabilities:

- clock;
- identity generator;
- API transport;
- query client;
- command coordinator;
- local persistence adapter;
- telemetry;
- feature configuration;
- recovery coordinator.

### 4.3 Application shell

Owns:

- top-level layout;
- route outlet;
- global session projection;
- offline and update banners;
- fatal error boundary;
- global dialogs that are truly cross-product;
- safe-area behavior;
- runtime readiness state.

### 4.4 Feature modules

Own workflow-specific runtime and UI.

### 4.5 Shared primitives

Own neutral presentation and technical primitives only.

---

## 5. Recommended Repository Shape

```text
frontend/src/
  app/
    bootstrap/
    runtime/
    shell/
    routing/
    providers/
  modules/
    learner-profile/
    practice-session/
    assessment/
    mastery-map/
    mentorship/
    parent-insight/
    builders-valley/
  shared/
    ui/
    accessibility/
    transport/
    query/
    persistence/
    telemetry/
    types/
  assets/
  main.tsx
```

A module may contain:

```text
modules/practice-session/
  api/
  model/
  runtime/
  routes/
  screens/
  components/
  stores/
  selectors/
  tests/
  index.ts
```

---

## 6. Dependency Direction

Allowed direction:

```text
app → modules → shared primitives
app → shared runtime infrastructure
modules → shared primitives
modules → shared runtime infrastructure
```

Disallowed direction:

```text
shared → module
module A → internals of module B
component → raw global singleton
transport → feature UI
```

Cross-module collaboration should use:

- public module APIs;
- route contracts;
- shared identifiers;
- explicit events;
- application-level orchestration.

---

## 7. Public Module Surface

Each module should expose a deliberate public surface.

Example:

```ts
export {
  practiceSessionRoutes,
  usePracticeSessionSummary,
  startPracticeSession,
  PracticeSessionStatusBadge,
} from './public';
```

Internal stores, transport DTOs, and workflow components should not be imported directly from another module.

---

## 8. Runtime Dependency Container

Runtime dependencies should be constructed once and supplied through explicit providers or injection.

Example:

```ts
type FrontendRuntime = {
  api: ApiClient;
  queries: QueryRuntime;
  commands: CommandRuntime;
  session: SessionRuntime;
  continuity: ContinuityRuntime;
  telemetry: TelemetryClient;
  clock: Clock;
  ids: IdGenerator;
};
```

Benefits:

- deterministic tests;
- controlled environment differences;
- replaceable adapters;
- fewer hidden singletons;
- easier recovery instrumentation.

---

## 9. Boot Sequence

Recommended sequence:

```text
1. Read build-time environment
2. Install fatal diagnostics
3. Construct runtime dependencies
4. Restore safe local continuity record
5. Inspect authentication/session material
6. Start query and command runtimes
7. Resolve initial route
8. Mount application shell
9. Revalidate restored state
10. Mark runtime ready
```

The UI may show a lightweight boot projection before full readiness.

Boot must have a timeout and recoverable failure path.

---

## 10. Single Mount Invariant

The frontend entry point must mount the application exactly once.

```ts
const root = createRoot(rootElement);
root.render(<App runtime={runtime} />);
```

Patches, adapters, or gameplay modules must load before the relevant runtime starts, but must not create additional application roots.

This prevents:

- duplicate event listeners;
- duplicated stores;
- conflicting routers;
- repeated network requests;
- inconsistent gameplay state.

---

## 11. Application Shell States

The shell should model explicit phases:

```ts
type ShellPhase =
  | 'BOOTING'
  | 'READY'
  | 'OFFLINE_READY'
  | 'SESSION_RECOVERY'
  | 'UPDATE_REQUIRED'
  | 'FATAL';
```

The shell should not treat every initialization failure as fatal.

Examples:

- API temporarily unavailable → offline/retry state;
- access token expired but refresh possible → session recovery;
- incompatible frontend version → update required;
- corrupted runtime dependency graph → fatal.

---

## 12. Query Runtime

The query runtime owns remote read lifecycle:

- cache identity;
- deduplication;
- freshness;
- background refresh;
- pagination state;
- retry policy;
- cancellation;
- invalidation;
- stale projection;
- offline restoration where safe.

Module code should define query meaning, not transport mechanics.

Example:

```ts
const learnerProgressQuery = defineQuery({
  key: ({ learnerId }) => ['learner-progress', learnerId],
  fetch: ({ api, learnerId }) => api.progress.getLearnerProgress(learnerId),
  staleTimeMs: 30_000,
});
```

---

## 13. Command Runtime

The command runtime owns state-changing request lifecycle:

- command identity;
- idempotency key;
- correlation identity;
- pending state;
- optimistic policy;
- conflict handling;
- uncertain outcome recovery;
- result reconciliation;
- query invalidation;
- telemetry.

Example:

```ts
await commands.execute({
  type: 'COMPLETE_PRACTICE_SESSION',
  idempotencyKey,
  payload,
  optimistic: false,
});
```

Command logic remains module-owned, while generic lifecycle mechanics are runtime infrastructure.

---

## 14. Runtime Authority Stores

A runtime authority store is a client source of truth for a specific local concern.

Examples:

- authenticated session projection;
- active workspace;
- current route continuity;
- gameplay interaction intent;
- pending command registry;
- offline queue status.

Each authority store must define:

- owned state;
- allowed transitions;
- persistence policy;
- reset policy;
- selectors;
- external synchronization rules.

Do not create a single unrestricted global store for all concerns.

---

## 15. Store-to-Projection Flow

```text
Runtime event
  → owned store action
  → normalized state
  → selector
  → view model
  → component
```

Components should subscribe to the smallest stable projection required.

This reduces:

- unnecessary rerenders;
- accidental coupling;
- transport leakage;
- duplicated interpretation.

---

## 16. Routing Integration

Routes belong to modules but are assembled by the application router.

A route definition may provide:

- path;
- loader/query prerequisites;
- session requirement;
- capability requirement;
- layout;
- error projection;
- continuity classification.

Example:

```ts
const route = defineRoute({
  path: '/learners/:learnerId/practice/:sessionId',
  requiresSession: true,
  load: loadPracticeSessionRoute,
  component: PracticeSessionScreen,
});
```

Detailed routing policy is defined in Chapter 22D.

---

## 17. Error Boundaries

Use multiple error boundaries with different authority:

### 17.1 Component boundary

Handles isolated rendering faults.

### 17.2 Module boundary

Handles a feature failure without collapsing the full application.

### 17.3 Route boundary

Handles load, navigation, and route contract failure.

### 17.4 Shell boundary

Handles unrecoverable runtime faults.

Error boundaries must emit diagnostics and offer an appropriate recovery action.

---

## 18. Recovery Controller

The recovery controller coordinates runtime restoration after:

- reload;
- crash;
- browser suspension;
- network loss;
- token expiration;
- command uncertainty;
- stale local continuity state.

It should use explicit recovery records such as:

```ts
type ContinuityRecord = {
  targetType: string;
  lastPath: string;
  entityType?: string;
  entityId?: string;
  lastActiveAt: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
};
```

Recovery must validate current access and resource existence before resuming.

---

## 19. Gameplay Runtime Integration

The gameplay engine may run a high-frequency loop independent from React rendering.

Recommended boundary:

```text
Input adapters
  → Gameplay runtime
  → Local world state
  → Coarse UI projection bridge
  → React UI
```

React should not rerender on every simulation frame.

The gameplay bridge should publish only meaningful projections such as:

- selected tool;
- target candidate;
- inventory count;
- mission hint;
- interaction availability;
- placement validity;
- durable sync status.

Durable effects pass through the command runtime.

---

## 20. Event Integration

Frontend modules may consume:

- API responses;
- server-sent events;
- websocket messages;
- browser events;
- service worker messages;
- gameplay runtime events.

All external events should enter through adapters and be normalized before modifying owned state.

Event handlers must be:

- idempotent where duplicate delivery is possible;
- version-aware;
- tenant-safe;
- removable during teardown;
- observable.

---

## 21. Session Runtime

The session runtime coordinates:

- authenticated identity projection;
- token refresh;
- session expiration;
- logout;
- tenant/workspace switching;
- cross-tab changes;
- protected route readiness.

It must not expose secret token material to arbitrary components.

Components should consume identity and capability projections instead.

---

## 22. Local Persistence

Local persistence adapters may use:

- memory;
- session storage;
- local storage;
- IndexedDB;
- Cache Storage.

Selection depends on:

- sensitivity;
- size;
- lifetime;
- transaction needs;
- offline requirements.

Every persisted record should have:

- schema version;
- owner scope;
- expiration policy;
- migration or discard strategy;
- corruption handling.

---

## 23. Feature Configuration

Feature flags and runtime configuration should be read through a typed adapter.

They may control:

- staged rollout;
- experimental gameplay behavior;
- alternate UI projection;
- compatibility fallback;
- diagnostics.

Feature flags must not bypass authorization or domain invariants.

---

## 24. Observability

The runtime should provide structured events for:

- boot duration;
- route readiness;
- query failure;
- command result;
- uncertain outcome;
- recovery attempt;
- session refresh;
- offline transition;
- fatal render error;
- gameplay interaction latency.

Use correlation identifiers when linking client activity to backend traces.

---

## 25. Teardown and Lifecycle

Every long-lived runtime capability must define teardown:

- event listener removal;
- subscription cancellation;
- request cancellation;
- timer cleanup;
- gameplay loop stop;
- store reset;
- sensitive memory clearing.

This matters for:

- logout;
- tenant switch;
- hot reload;
- tests;
- route disposal;
- application shutdown.

---

## 26. Testing Architecture

The architecture should support:

- isolated module tests;
- runtime adapter tests;
- store transition tests;
- route loader tests;
- query and command contract tests;
- recovery tests;
- gameplay bridge tests;
- full operational flows.

Tests should inject deterministic clocks, IDs, transport, and persistence.

---

## 27. Architectural Prohibitions

Do not:

- place all state in one store;
- use route components as service locators;
- make components call raw fetch directly;
- persist every state value automatically;
- let shared components encode module workflow;
- use role labels as the only authorization model;
- make React own frame-by-frame gameplay state;
- hide boot failure behind an endless spinner;
- interpret network timeout as confirmed command failure;
- mount multiple application roots.

---

## 28. Required Invariants

1. One application bootstrap and one root mount.
2. Module internals remain private.
3. Dependencies point toward neutral infrastructure.
4. Remote state lifecycle is centralized in query/command runtimes.
5. Runtime authority stores have explicit ownership.
6. Recovery state is durable only where justified.
7. Gameplay high-frequency state is isolated from UI rendering frequency.
8. Session secrets remain encapsulated.
9. External events are normalized before state mutation.
10. Every long-lived runtime capability has teardown.

---

## 29. Completion Criteria

The architecture is established when:

- the bootstrap sequence is deterministic;
- the shell exposes explicit readiness states;
- modules publish public surfaces;
- transport is isolated behind adapters;
- query and command runtimes are available;
- local authority stores have transition policies;
- gameplay integrates through a projection bridge;
- recovery and teardown are testable;
- dependency rules can be verified automatically.

---

## 30. Final Rule

> The frontend runtime is a coordinated system of owned authorities, not a collection of components connected by convenience.
