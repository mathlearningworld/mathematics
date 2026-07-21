# 22I — Performance and Rendering Strategy

## 1. Purpose

This document defines how the Math Learning World frontend achieves responsive interaction, predictable rendering, efficient data use, and sustainable performance across application UI and gameplay surfaces.

It governs:

- performance budgets;
- rendering ownership;
- scheduling and responsiveness;
- code and asset loading;
- state subscription design;
- list and canvas performance;
- network efficiency;
- memory lifecycle;
- gameplay frame-time boundaries;
- measurement and regression control.

---

## 2. Core Principle

> Performance is a product behavior that must be designed, measured, and protected.

The frontend must optimize for meaningful user outcomes:

- input feels immediate;
- navigation does not stall without explanation;
- learning content becomes usable quickly;
- long lists remain stable;
- gameplay preserves interaction quality;
- background work does not block the main thread;
- weaker devices remain supported within declared limits.

---

## 3. Performance Layers

Performance is managed across:

```text
build and delivery
application bootstrap
route transition
data synchronization
component rendering
browser main-thread work
asset decoding
animation and gameplay loop
memory and lifecycle
```

A local optimization must not move cost invisibly into another layer.

---

## 4. Budgets

The product establishes measurable budgets for representative devices and networks.

Budget categories include:

- initial JavaScript and CSS transfer;
- route-level incremental bundle size;
- time to application shell;
- time to usable route;
- input latency;
- long-task frequency;
- query payload size;
- image/audio asset size;
- gameplay frame time;
- peak memory for supported scenes.

Budgets are recorded per product surface rather than relying on one universal number.

---

## 5. Performance Profiles

At minimum, test:

```text
modern desktop / stable broadband
mid-range mobile / variable 4G
low-memory mobile / constrained CPU
warm-cache returning session
offline-readable session
gameplay scene with representative object density
```

Desktop success does not prove mobile readiness.

---

## 6. Rendering Ownership

Each feature module owns its render boundary and subscriptions.

A component should subscribe only to the smallest stable projection it needs.

Avoid:

- subscribing an entire page to a large mutable store;
- passing broad domain objects through many component layers;
- computing expensive projections during every render;
- using global state for transient local interaction;
- remounting feature trees because unrelated shell state changed.

---

## 7. State Subscription Strategy

Selectors must be:

- semantically named;
- narrowly scoped;
- referentially stable where expected;
- inexpensive or memoized;
- testable independently.

Example:

```ts
const activeTool = useGameplayStore(selectActiveTool);
const canPlace = useGameplayStore(selectCanPlaceAtCurrentTarget);
```

Prefer these over selecting the entire gameplay store and deriving values in the component.

---

## 8. Derived State

Derived values should not be duplicated into writable state unless they require an explicit snapshot or transition boundary.

Use:

```text
source state + selector → projection
```

instead of synchronizing multiple copies through effects.

Expensive derived projections may use memoization, indexing, or worker computation when measurement justifies it.

---

## 9. Component Render Policy

Components are split when a boundary improves one or more of:

- ownership;
- readability;
- independent loading;
- subscription isolation;
- error containment;
- testability;
- measurable render cost.

Do not fragment components merely to pursue theoretical memoization.

Memoization is applied after identifying unstable props or expensive work, not as a blanket default.

---

## 10. Scheduling and Responsiveness

Urgent work includes:

- pointer/keyboard response;
- text input;
- focus changes;
- direct gameplay controls;
- visible confirmation of an action.

Deferrable work includes:

- noncritical analytics;
- background prefetch;
- large projection recalculation;
- offscreen rendering;
- low-priority cache cleanup.

The runtime schedules deferrable work so it does not block urgent interaction.

---

## 11. Long Tasks

Main-thread work should be chunked or moved when it can exceed the product budget.

Candidates for workers or incremental processing include:

- large curriculum graph processing;
- report aggregation;
- local search indexing;
- heavy geometry preparation;
- file parsing;
- image transformation;
- replay analysis.

Worker boundaries exchange serializable contracts and must preserve cancellation and version semantics.

---

## 12. Route-Level Loading

Routes load the minimum code and data needed for first meaningful use.

A route may define:

```text
critical module
critical query
secondary module
secondary query
optional enhancement
```

The shell should render stable navigation and recovery surfaces before noncritical features finish loading.

Route prefetch is based on likely user intent and network/device capacity, not indiscriminate downloading.

---

## 13. Code Splitting

Split by stable runtime boundaries such as:

- account administration;
- learner dashboard;
- teacher monitoring;
- reports;
- gameplay scenes;
- media/editor tooling.

Avoid micro-chunks that create excessive request overhead and dependency waterfalls.

Shared code must remain genuinely neutral. Feature-specific workflow code stays with its owning module even if duplication appears superficially cheaper.

---

## 14. Bundle Discipline

New dependencies require review of:

- transferred and parsed size;
- tree-shaking behavior;
- duplicate transitive packages;
- runtime side effects;
- browser compatibility;
- security and maintenance;
- whether a platform primitive already solves the need.

Bundle analysis should be part of release evidence for material changes.

---

## 15. Data Fetching Performance

Query efficiency depends on:

- correct cache identity;
- deduplication;
- request cancellation;
- bounded pagination;
- field-appropriate response contracts;
- freshness policy;
- prefetch based on intent;
- avoiding request waterfalls.

The client should not request large aggregate payloads and then render a small fraction.

Server and client contracts should expose task-oriented read models.

---

## 16. Pagination and Lists

Large collections require:

- deterministic pagination;
- bounded page sizes;
- incremental rendering;
- stable item identity;
- scroll-position recovery when product-relevant;
- virtualization when measurement supports it.

Virtualization must preserve accessibility, keyboard navigation, focus, and testability.

Do not virtualize small lists by default.

---

## 17. Images and Media

Media strategy includes:

- dimensions declared before load;
- responsive sources;
- modern formats where supported;
- lazy loading outside the critical viewport;
- thumbnail/full-size separation;
- decode-aware transitions;
- bounded retries;
- placeholders that avoid layout shift.

Private media URLs must respect authorization and expiry. Performance caching must not weaken privacy.

---

## 18. Fonts and Localization

Font loading must avoid blocking usable UI longer than necessary.

The application should:

- limit font families and weights;
- subset when practical;
- use appropriate fallback metrics;
- support Thai rendering correctly;
- test layout expansion across locales;
- avoid icon fonts when accessible alternatives are better.

---

## 19. Layout Stability

Reserve space for:

- images;
- asynchronous cards;
- validation messages when predictable;
- navigation chrome;
- gameplay HUD regions;
- embedded media.

Avoid layout shifts that move the user’s active control or target.

---

## 20. Animation

Animation must communicate state and remain interruptible.

Rules:

- prefer transform and opacity for frequent visual transitions;
- avoid layout-triggering animation in large trees;
- respect reduced-motion preferences;
- stop offscreen or hidden animation;
- avoid animation as the only confirmation signal;
- measure heavy effects on target mobile devices.

---

## 21. Gameplay Rendering Boundary

Gameplay has a distinct high-frequency runtime.

```text
simulation/update loop
  → gameplay projection
  → renderer
  → low-frequency application bridge
```

React or equivalent application rendering must not be driven by every simulation tick.

The gameplay engine publishes coarse semantic changes to application state, such as:

- mission changed;
- inventory count confirmed;
- active tool changed;
- interaction target changed when UI-relevant;
- scene checkpoint created;
- synchronization state changed.

Frame-local positions, particles, and collision calculations stay inside the gameplay runtime.

---

## 22. Frame-Time Strategy

Gameplay performance tracks:

- update time;
- render time;
- collision/geometry time;
- asset upload/decode time;
- garbage-collection spikes;
- object count;
- draw calls or equivalent renderer workload;
- input-to-visible-response latency.

Adaptive quality may reduce nonessential effects while preserving interaction geometry and game rules.

Never alter domain correctness merely to keep a frame budget.

---

## 23. Interaction Geometry Performance

Placement and pickup target evaluation should use bounded spatial queries rather than scanning the entire scene each frame.

Possible strategies:

- tile/grid indexing;
- spatial hash;
- nearby-object buckets;
- collision broad phase;
- dirty-region recalculation;
- cached candidate sets invalidated by movement or scene mutation.

Priority scoring must remain deterministic for the same scene state and player position.

---

## 24. Memory Lifecycle

Every long-lived runtime resource needs disposal ownership.

Examples:

- event listeners;
- timers;
- subscriptions;
- abort controllers;
- object URLs;
- audio nodes;
- renderer textures;
- workers;
- realtime channels;
- scene graphs.

Route exit, scope change, logout, and scene replacement must release resources deterministically.

---

## 25. Cache and Memory Pressure

Caches require size or age bounds.

The runtime may evict:

- least-recently-used query data;
- decoded media not currently visible;
- inactive gameplay scene assets;
- expired route prefetch;
- obsolete build-version caches.

Never evict pending command recovery records using a generic cache policy.

---

## 26. Error and Loading Rendering

Loading UX should preserve already usable content where safe.

Prefer:

- local skeletons for first load;
- background-refresh indicators for stale content;
- inline retry for isolated failures;
- retained confirmed data during recoverable refresh;
- explicit progress for long operations.

Avoid blanking the entire application for a secondary query.

---

## 27. Observability

Collect performance evidence such as:

- route transition duration;
- input latency;
- long tasks;
- bundle/version identity;
- query timing and payload size;
- cache hit/miss;
- render commit duration for critical surfaces;
- memory growth across navigation;
- gameplay frame distribution;
- scene load and first-interaction time.

Sampling and redaction must protect user and learner privacy.

---

## 28. Regression Gates

A performance regression is evaluated against:

- declared budgets;
- representative scenarios;
- baseline build;
- supported device profile;
- statistical variance.

Material regressions require an explicit trade-off decision, not silent acceptance.

Automated gates may check bundle size, route smoke metrics, long-task thresholds, and gameplay benchmark scenes.

---

## 29. Verification Obligations

Tests and evidence must cover:

- cold and warm bootstrap;
- route-level code loading;
- query deduplication and cancellation;
- large list behavior;
- image layout stability;
- reduced-motion mode;
- repeated navigation without resource leaks;
- scope switching and cache cleanup;
- gameplay scene load;
- representative object-density frame timing;
- deterministic interaction target scoring;
- background application updates without frame-loop coupling.

---

## 30. Completion Criteria

Performance and rendering architecture is complete when:

- measurable budgets exist;
- route and feature boundaries support incremental loading;
- state subscriptions are narrow and stable;
- urgent interaction is protected from background work;
- media and lists have bounded strategies;
- gameplay simulation is isolated from application rendering frequency;
- runtime resources have disposal ownership;
- representative devices are measured;
- regressions are detected through evidence rather than intuition.
