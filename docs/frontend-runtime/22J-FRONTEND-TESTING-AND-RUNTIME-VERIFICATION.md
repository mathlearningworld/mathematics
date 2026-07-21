# 22J — Frontend Testing and Runtime Verification

## 1. Purpose

This document defines the testing and verification model for the Math Learning World frontend runtime.

It governs:

- unit, integration, contract, and operational testing;
- runtime-state verification;
- UI and accessibility testing;
- API boundary verification;
- offline and recovery tests;
- session and security tests;
- performance evidence;
- gameplay interaction verification;
- release gates and evidence.

---

## 2. Core Principle

> A frontend is not verified because components render; it is verified when user intent produces the correct observable outcome through the real runtime boundaries.

Testing must prove both:

- local correctness of owned units;
- end-to-end correctness of critical user flows.

No single test layer can replace the others.

---

## 3. Verification Gates

Frontend delivery uses three distinct gates.

### Gate A — Repository Gate

Verifies what can be proven from repository evidence:

- architecture and module ownership;
- public contracts;
- static dependency boundaries;
- route definitions;
- test coverage intent;
- verifier wiring;
- changed-path scope;
- snapshots and documented invariants.

Repository PASS does not prove executable runtime behavior.

### Gate B — Runtime Gate

Verifies executable client behavior in a controlled environment:

- dependency installation;
- lint and type checking;
- unit and integration tests;
- production build;
- runtime bootstrap;
- mock/real adapter wiring;
- browser automation;
- performance checks.

### Gate C — Operational Gate

Verifies the running system through actual boundaries:

```text
Browser / Device
  → Frontend Runtime
  → API
  → Application
  → Persistence / Events
  → Projection
  → Query
  → UI
```

Operational PASS requires evidence from representative workflows, not only isolated endpoints.

---

## 4. Test Portfolio

The frontend test portfolio contains:

```text
pure unit tests
store and state-machine tests
component interaction tests
route/runtime integration tests
API contract tests
browser flow tests
visual and accessibility checks
performance tests
gameplay deterministic tests
operational acceptance evidence
```

Test distribution follows risk and runtime meaning, not a fixed pyramid quota.

---

## 5. Unit Tests

Unit tests are appropriate for:

- selectors;
- reducers and semantic transitions;
- formatters and parsers;
- route builders;
- cache-key construction;
- capability decisions;
- error classification;
- retry policy;
- recovery state transitions;
- deterministic target scoring;
- geometry helpers.

Unit tests must avoid reproducing implementation details without asserting meaningful behavior.

---

## 6. Store and State-Machine Tests

Every important store transition should be testable without rendering a full page.

Example:

```text
given confirmed placement inventory
and an active placement intent
when a valid pickup target enters adjacent range
then active interaction becomes pickup
and placement intent remains resumable
when the target leaves range
then active interaction returns to placement
```

Tests should assert:

- previous state;
- event or command;
- resulting state;
- emitted effects;
- preserved invariants;
- prohibited transitions.

---

## 7. Component Interaction Tests

Component tests focus on user-observable behavior:

- accessible labels and roles;
- enabled/disabled actions;
- validation feedback;
- focus movement;
- keyboard and pointer interaction;
- loading, empty, stale, and error states;
- confirmation and cancellation;
- semantic intent dispatch.

Prefer interaction through the same controls users operate rather than calling component internals.

---

## 8. Runtime Integration Tests

Runtime integration tests combine real frontend runtime services where practical:

- router;
- session runtime;
- query/command client;
- feature store;
- recovery coordinator;
- error boundary;
- mocked transport or controlled test server.

They verify orchestration such as:

```text
route entry
  → session resolution
  → query loading
  → projection rendering
  → command submission
  → invalidation/reconciliation
  → resulting navigation or UI state
```

---

## 9. API Contract Tests

The frontend must verify that its DTO assumptions remain compatible with the API contract.

Coverage includes:

- request shape;
- response shape;
- stable error envelope;
- enum handling;
- pagination cursors;
- version headers;
- authentication failure mapping;
- idempotency and expected-version headers;
- event/realtime envelopes.

Contract fixtures must originate from the authoritative contract or generated schema where possible. Hand-maintained mocks require drift detection.

---

## 10. Mocking Policy

Mocks are used at explicit boundaries.

Good mock boundaries:

- HTTP transport;
- clock;
- random/ID generation;
- browser storage;
- service worker;
- realtime channel;
- third-party adapter.

Avoid mocking the store, router, and feature runtime simultaneously in a test intended to prove their integration.

A mock must preserve relevant failure and timing behavior, not only successful responses.

---

## 11. Browser Flow Tests

Browser automation covers critical journeys such as:

- anonymous entry and sign-in;
- learner/profile selection;
- dashboard load;
- start and resume practice;
- submit answer or assessment;
- recover from expired session;
- switch learner context;
- enter and exit gameplay;
- recover after refresh;
- complete a critical command once despite retry.

Selectors should rely on accessible roles, labels, or stable test IDs when no accessible selector exists.

---

## 12. Route Verification

Each route class requires tests for:

- direct deep link;
- navigation from the application;
- refresh on the route;
- unauthorized access;
- missing scope;
- loader failure;
- not-found resource;
- intended-destination recovery after authentication;
- browser back/forward behavior;
- cleanup on route exit.

---

## 13. Data Synchronization Tests

Verify:

- cache identity includes authority scope;
- query deduplication;
- cancellation on route/scope exit;
- stale-while-refresh behavior;
- invalidation after commands;
- optimistic update and rollback;
- uncertain outcome reconciliation;
- realtime event deduplication;
- pagination stability;
- identity switch cache reset.

Tests should include delayed, reordered, duplicated, and failed responses.

---

## 14. Offline and Recovery Tests

Required scenarios include:

- application starts offline with no cache;
- application starts offline with usable cache;
- network drops during a read;
- network drops before command transmission;
- network drops after possible command commit;
- browser refresh during an uncertain command;
- pending intent survives restart;
- incompatible persisted schema is migrated or discarded;
- service-worker update occurs with pending work;
- reconnect reconciles local and authoritative state.

Tests must prove that duplicate business effects do not occur.

---

## 15. Security and Session Tests

Verify:

- unknown session does not flash protected content;
- concurrent expiry triggers one renewal;
- failed renewal resets protected runtime;
- logout clears caches and subscriptions;
- logout propagates across tabs;
- capability projection controls UX without replacing server denial handling;
- scope switching is atomic;
- return URLs are validated;
- credentials are absent from persistent stores and logs;
- learner data does not leak across context changes;
- revoked sessions interrupt active workflows safely.

---

## 16. Accessibility Verification

Accessibility is tested at component and flow levels.

Coverage includes:

- keyboard-only navigation;
- focus visibility and order;
- modal focus trap and restoration;
- accessible names;
- form error association;
- semantic headings and landmarks;
- screen-reader status announcements;
- contrast;
- reduced-motion behavior;
- touch target size;
- zoom and text reflow;
- Thai text rendering.

Automated checks supplement but do not replace human assistive-technology review of critical flows.

---

## 17. Visual Verification

Visual regression may protect stable surfaces such as:

- application shell;
- dashboard states;
- forms and validation;
- modal/dialog layouts;
- responsive breakpoints;
- gameplay HUD;
- empty/error/offline states.

Snapshots must be deterministic and reviewed. Broad screenshot approval without understanding the change is not verification.

---

## 18. Responsive and Device Verification

Critical workflows are tested on representative viewport and input profiles:

- narrow phone portrait;
- phone landscape where supported;
- tablet;
- desktop;
- touch;
- keyboard/mouse;
- safe-area devices.

Verification includes overflow, fixed controls, virtual keyboard interaction, scroll containment, and orientation behavior.

---

## 19. Performance Tests

Performance evidence may include:

- production bundle analysis;
- cold/warm route measurements;
- long-task detection;
- query payload and waterfall inspection;
- large-list benchmark;
- repeated-navigation memory checks;
- gameplay frame-time benchmark;
- asset loading/decode timing;
- interaction latency.

Performance tests run against production-like builds. Development-mode measurements are not release evidence.

---

## 20. Gameplay Verification Model

Gameplay tests are divided into:

```text
deterministic simulation tests
interaction geometry tests
scene integration tests
render/performance tests
human feel/play tests
```

Deterministic tests control:

- time step;
- random seed;
- player position and direction;
- scene object positions;
- inventory;
- input sequence;
- runtime configuration.

---

## 21. Placement and Pickup Test Matrix

The interaction matrix includes:

- material available / unavailable;
- pickup target absent / present;
- target adjacent / outside range;
- target in front / side / behind;
- one target / multiple targets;
- placed block / natural resource;
- explicit tool selection / inferred selection;
- placement target valid / blocked;
- enter pickup range / leave pickup range;
- collect item / place item / repeat;
- refresh or scene restore during intent;
- collision bounds with different object sizes.

Expected priority must be explicit and deterministic.

---

## 22. Gameplay Invariants

Tests protect invariants such as:

- one input produces at most one business interaction;
- inventory never becomes negative;
- pickup requires valid geometry and target state;
- placement requires valid inventory and placement geometry;
- a collected object cannot be collected twice;
- an occupied placement tile rejects placement;
- temporary pickup intent does not erase resumable placement intent;
- leaving pickup range restores the correct prior tool when still valid;
- scene reload does not duplicate placed or collected objects;
- predicted feedback never becomes confirmed progress by itself.

---

## 23. Test Data

Test data should be:

- minimal;
- readable;
- purpose-built;
- identity-scoped;
- deterministic;
- isolated per test;
- easy to reset.

Avoid large opaque fixtures that hide which condition matters.

Operational environments require safe seeded accounts and learners that contain no real personal data.

---

## 24. Time and Concurrency

Tests involving timers, retries, animation, session expiry, and realtime events must control time deliberately.

Concurrency tests include:

- duplicate clicks;
- multiple tabs;
- overlapping commands;
- response reordering;
- delayed invalidation;
- route exit during request;
- scope switch during refresh;
- gameplay input while target state changes.

A passing sequential happy path does not prove concurrency safety.

---

## 25. Error Injection

The test harness should inject failures at boundaries:

- DNS/network unavailable;
- timeout;
- malformed response;
- 401/403;
- 409 conflict;
- 412 expected-version failure;
- 429 rate limit;
- 5xx;
- websocket disconnect;
- storage quota failure;
- corrupted persisted record;
- asset load failure;
- worker crash.

Each failure must map to a defined runtime state and user recovery path.

---

## 26. Test Isolation and Cleanup

Tests must dispose:

- stores;
- query clients;
- event listeners;
- timers;
- workers;
- service-worker mocks;
- browser storage;
- realtime channels;
- gameplay loops and renderer resources.

Leaked state between tests is a runtime defect signal, not merely test inconvenience.

---

## 27. CI Verification

A typical CI sequence may include:

```text
format/static policy
  → lint
  → typecheck
  → unit tests
  → integration tests
  → production build
  → contract verification
  → browser smoke tests
  → selected accessibility checks
  → bundle/performance budget checks
```

Longer browser, device, visual, and gameplay benchmark suites may run in dedicated pipelines while remaining release-gating for affected surfaces.

---

## 28. Evidence Package

Every material frontend delivery should report:

- mission/scope;
- base and head commit;
- changed paths;
- architecture boundary impact;
- API contract impact;
- tests added or changed;
- commands executed;
- pass/fail results;
- deferred human tests;
- screenshots or recordings when useful;
- known risks;
- rollback/recovery note.

Evidence is more valuable than a narrative claim that the change “works.”

---

## 29. Human Verification

Human review remains required for qualities automation cannot fully establish:

- interaction feel;
- clarity of Thai language;
- learning comprehension;
- gameplay intuitiveness;
- visual hierarchy;
- touch comfort;
- perceived latency;
- accessibility with real assistive technology;
- product correctness of the complete workflow.

Human testing should follow a concise scenario and record the observed result.

---

## 30. Release Decision

A release decision distinguishes:

```text
Repository PASS
Runtime PASS
Operational PASS
Human Validation PASS or explicitly deferred
```

A lower gate must not be mislabeled as a higher gate.

Known failures are classified by severity, affected workflow, recovery availability, and user impact before release.

---

## 31. Completion Criteria

Frontend testing and runtime verification is complete when:

- critical state transitions have deterministic tests;
- feature integration is proven through real runtime services;
- API assumptions are contract-verified;
- offline, recovery, session, and security failures are injected;
- accessibility and responsive behavior are checked;
- gameplay interaction invariants are protected;
- production performance has evidence;
- delivery reports separate repository, runtime, operational, and human gates;
- the running user workflow—not only implementation units—has been verified.
