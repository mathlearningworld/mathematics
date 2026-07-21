# 22A — Runtime Philosophy and UI Boundary

## 1. Purpose

This document defines the governing philosophy and architectural boundary of the Math Learning World frontend runtime.

It establishes:

- what the frontend runtime owns;
- what it must never own;
- how UI intent becomes application work;
- how server truth, client state, and visual projection relate;
- how gameplay runtime and product UI coexist;
- how modules own their workflow-specific UI;
- how recovery, uncertainty, and partial connectivity are represented;
- how the frontend remains replaceable without weakening domain authority.

---

## 2. Core Principle

> The frontend runtime is an intent-capturing, state-projecting, interaction-coordinating client. It is not the authority for durable business truth.

The frontend may:

- collect user intent;
- validate transport-ready input;
- maintain ephemeral interaction state;
- cache query results;
- predict harmless visual outcomes;
- coordinate navigation;
- recover interrupted work;
- present optimistic feedback when the contract allows it.

The frontend must not:

- invent domain decisions;
- bypass application commands;
- treat cached state as durable authority;
- infer authorization from visibility alone;
- duplicate critical domain invariants as an independent source of truth;
- conceal uncertain outcomes as confirmed success;
- couple unrelated modules through shared workflow components.

---

## 3. Frontend Runtime Position

```text
Human intent
  → Input and interaction layer
  → Module runtime
  → Client command/query boundary
  → API contract
  → Application layer
  → Domain and infrastructure authority
  → API result/event
  → Client synchronization
  → Store projection
  → UI rendering
```

The frontend is positioned between human intent and external system authority.

Its responsibility is to preserve meaning across that boundary.

---

## 4. UI Is a Projection, Not the Domain

A screen is a projection of runtime meaning.

The visible interface may combine:

- server-owned resource state;
- client-owned interaction state;
- navigation context;
- permissions supplied by trusted contracts;
- pending command state;
- recovery state;
- visual prediction;
- local device capability.

The screen must not imply that all visible state has equal authority.

Recommended categories:

```ts
type RuntimeStateClass =
  | 'SERVER_CONFIRMED'
  | 'CLIENT_PENDING'
  | 'CLIENT_EPHEMERAL'
  | 'PREDICTED'
  | 'STALE'
  | 'UNCERTAIN'
  | 'FAILED';
```

The UI should make consequential differences perceptible when needed.

---

## 5. Ownership Boundary

### 5.1 Frontend-owned concerns

The frontend owns:

- rendering and composition;
- input collection;
- focus and selection;
- local interaction sequencing;
- animation and visual feedback;
- route state;
- view-local state;
- request lifecycle presentation;
- cache lifecycle;
- reconnect behavior;
- client-side accessibility;
- device-specific adaptation;
- safe local persistence;
- client observability.

### 5.2 Backend-owned concerns

The backend owns:

- durable business state;
- domain invariants;
- authoritative transitions;
- authorization decisions requiring trusted state;
- transaction boundaries;
- idempotency enforcement;
- durable event publication;
- persistence and consistency guarantees;
- canonical timestamps and versions;
- final command acceptance or rejection.

### 5.3 Shared contract concerns

The following are coordinated through explicit contracts:

- request DTOs;
- response DTOs;
- error codes;
- version fields;
- pagination cursors;
- capability representation;
- command identity;
- correlation identity;
- event envelopes;
- compatibility guarantees.

---

## 6. Intent Before Mechanism

The frontend should model user intent before transport mechanism.

Good:

```ts
completePracticeSession({ sessionId, expectedVersion });
```

Weak:

```ts
post('/api/v1/practice-sessions/123/completion', body);
```

The API client may perform the HTTP request, but module code should depend on meaningful capabilities rather than scattered protocol details.

---

## 7. Module Ownership Doctrine

Each product or gameplay module owns its workflow-specific UI and runtime behavior.

Examples:

```text
modules/
  learner-profile/
  practice-session/
  assessment/
  mastery-map/
  mentorship/
  parent-insight/
  builders-valley/
```

A module may own:

- screens;
- route loaders;
- command hooks;
- query hooks;
- stores;
- workflow components;
- validation adapters;
- runtime policies;
- recovery behavior;
- tests.

Do not extract workflow-specific components into `shared` merely because two screens currently look similar.

Shared code is appropriate only when it is:

- semantically neutral;
- stable across modules;
- free of workflow policy;
- independently testable;
- proven to reduce duplication without increasing coupling.

Examples of legitimate shared primitives:

- button;
- dialog shell;
- field label;
- focus trap;
- loading indicator;
- typography token;
- HTTP client foundation;
- generic query cache adapter.

---

## 8. Runtime Meaning Architecture

Frontend meaning should flow through explicit stages:

```text
External data or user action
  → Runtime authority
  → Normalized state
  → Derived projection
  → UI
```

A component should not repeatedly reinterpret raw transport data.

Recommended flow:

```text
API DTO
  → adapter
  → module model
  → store/query cache
  → selector
  → view model
  → component
```

This creates one place to resolve:

- field naming;
- nullable values;
- version semantics;
- status labels;
- permission capabilities;
- stale and pending state;
- compatibility defaults.

---

## 9. Server State versus Client State

### 9.1 Server state

Server state is remote, durable, versioned, and potentially shared with other actors.

Examples:

- learner profile;
- skill progress;
- practice session lifecycle;
- assessment result;
- mentorship invitation;
- credit balance.

### 9.2 Client state

Client state is local to the current runtime.

Examples:

- open panel;
- selected tool;
- pointer hover;
- active tab;
- draft input;
- animation phase;
- placement preview;
- keyboard focus.

### 9.3 Persisted client continuity state

Some client state may survive reload or restart:

- last safe route;
- interrupted draft identity;
- pending upload metadata;
- active gameplay intent;
- recovery checkpoint;
- selected workspace.

Persisted client state remains client-owned and must be validated against current server authority when restored.

---

## 10. Confirmed, Optimistic, Predicted, and Uncertain State

### 10.1 Confirmed

The server has accepted the command and returned authoritative state or identity.

### 10.2 Optimistic

The client temporarily projects an expected result before confirmation.

Optimistic updates are allowed only when:

- rollback is understandable;
- duplicate effects are prevented;
- the command has a stable identity where needed;
- conflict behavior is defined;
- the user is not misled about irreversible completion.

### 10.3 Predicted

Gameplay or interaction code may predict a harmless next action or visual target.

Prediction must remain subordinate to actual interaction rules.

Examples:

- highlight the likely pickup target;
- preselect a build material;
- show placement preview;
- infer the likely next tool.

Prediction must not silently perform durable actions without an explicit input or approved automation rule.

### 10.4 Uncertain

A command may have reached the server even though the client lost the response.

The frontend must represent this state explicitly and recover through:

- idempotency key replay;
- operation lookup;
- resource refresh;
- event reconciliation;
- user-visible retry guidance.

Never convert uncertainty directly into failure or success without evidence.

---

## 11. UI Boundary Rules

A component may:

- render a view model;
- emit semantic user events;
- hold purely local visual state;
- call a module hook;
- invoke an accessibility behavior.

A component should not:

- call repositories;
- construct authorization policy;
- issue raw HTTP requests;
- mutate global stores directly without an owned action;
- parse transport errors ad hoc;
- coordinate unrelated workflows;
- own durable retry policy.

Recommended component contract:

```ts
type PracticeSessionPanelProps = {
  model: PracticeSessionViewModel;
  onComplete: () => void;
  onAnswer: (answer: AnswerDraft) => void;
};
```

The component expresses UI meaning without knowing transport details.

---

## 12. Gameplay Runtime Boundary

Gameplay has high-frequency local interaction needs, but the same authority rules apply.

Gameplay runtime may own:

- frame updates;
- collision previews;
- selection scoring;
- placement prediction;
- input buffering;
- camera behavior;
- animation state;
- temporary world projection.

Gameplay runtime must delegate durable learning or economy effects such as:

- mastered skill confirmation;
- reward granting;
- credit transfer;
- inventory persistence;
- assessment completion;
- mentor benefit allocation.

The local world may react immediately, but durable outcomes must reconcile with authoritative results.

---

## 13. Capability-Driven UI

The frontend should prefer server-provided capabilities over duplicated role-name logic.

Example:

```ts
type LearnerCapabilities = {
  canStartPractice: boolean;
  canViewDetailedProgress: boolean;
  canManageMentors: boolean;
};
```

Capabilities do not replace server authorization.

They improve projection accuracy and reduce accidental exposure of impossible actions.

The server still validates every command.

---

## 14. Failure as Runtime State

Failures are not exceptional visual accidents; they are defined runtime states.

A module should distinguish:

- field validation failure;
- authentication expiration;
- authorization refusal;
- domain conflict;
- optimistic concurrency conflict;
- rate limiting;
- temporary dependency failure;
- offline state;
- uncertain command outcome;
- incompatible client version.

The frontend should map stable API error codes to module-level recovery behavior.

It should not rely only on human-readable server messages.

---

## 15. Accessibility Boundary

Accessibility belongs to the runtime architecture, not final visual polish.

The frontend must preserve:

- keyboard reachability;
- focus visibility;
- semantic control roles;
- readable status updates;
- reduced-motion compatibility;
- touch target safety;
- screen-reader labels;
- non-color-only meaning;
- predictable navigation order.

Gameplay interfaces should offer alternate or simplified input paths where feasible.

---

## 16. Observability Boundary

The frontend may emit diagnostic signals such as:

- route transitions;
- request duration;
- command identity;
- correlation identity;
- recovery attempts;
- cache freshness;
- render errors;
- interaction latency;
- gameplay loop anomalies.

It must not log:

- passwords;
- refresh tokens;
- secret credentials;
- raw sensitive educational records;
- unnecessary personal data;
- complete request bodies by default.

Observability must preserve privacy and tenant isolation.

---

## 17. Technology Neutrality

This chapter permits React, Vite, Zustand, query libraries, service workers, and browser storage, but does not make business meaning depend on them.

Framework-specific adapters should remain replaceable.

The durable architecture is defined by:

- ownership;
- contracts;
- state classes;
- authority;
- transitions;
- recovery;
- verification.

---

## 18. Decision Rules

When deciding where logic belongs, ask:

1. Is this a durable business decision? Put it behind the Application and Domain layers.
2. Is this transport mapping? Put it in the API adapter.
3. Is this remote state lifecycle? Put it in the query/command runtime.
4. Is this module workflow coordination? Put it in the owning module runtime.
5. Is this purely visual or interaction-local? Keep it near the component.
6. Is it truly neutral across modules? Only then consider shared infrastructure.

---

## 19. Required Invariants

The frontend runtime must preserve these invariants:

1. Durable business truth remains server-authoritative.
2. UI state classification is not silently collapsed.
3. Workflow modules own workflow UI.
4. Raw API details do not spread through components.
5. Authorization is enforced on the server even when capabilities drive visibility.
6. Uncertain command outcomes remain recoverable.
7. Restored local state is revalidated.
8. Prediction never silently becomes durable authority.
9. Accessibility is part of runtime correctness.
10. Errors map through stable contracts.

---

## 20. Completion Criteria

This boundary is implemented when:

- modules have explicit ownership;
- components consume view models or owned hooks;
- server and client state are separated;
- command and query paths use typed adapters;
- pending, confirmed, stale, failed, and uncertain states are representable;
- gameplay prediction is isolated from durable effects;
- recovery can resume interrupted work;
- stable capabilities and errors drive UI behavior;
- architecture tests can detect prohibited dependencies.

---

## 21. Final Rule

> The frontend should feel immediate to the learner while remaining honest about authority, uncertainty, and durable completion.
