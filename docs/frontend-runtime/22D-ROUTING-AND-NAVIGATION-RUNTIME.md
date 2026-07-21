# 22D — Routing and Navigation Runtime

## 1. Purpose

This document defines the routing and navigation runtime for Math Learning World frontends.

It governs:

- route ownership;
- URL and screen-state boundaries;
- application-shell navigation;
- authenticated and tenant-scoped routes;
- learner, parent, teacher, mentor, and operator workspaces;
- gameplay entry and return paths;
- deep links;
- guarded transitions;
- navigation recovery;
- browser history semantics;
- route-level loading and failure handling;
- route testing obligations.

---

## 2. Core Principle

> A route represents durable user location and application meaning, not an arbitrary component tree.

Routing must make the current product context observable, restorable, and shareable where appropriate.

A route must not become a hidden business workflow engine.

Business transitions remain owned by Application and Domain layers. The navigation runtime projects those outcomes into user location.

---

## 3. Navigation Runtime Responsibilities

The navigation runtime owns:

- parsing the current location;
- matching the location to an owned route;
- constructing typed route parameters;
- resolving shell and workspace context;
- enforcing coarse access gates;
- coordinating route loaders;
- preserving intended destinations across authentication;
- recording recoverable navigation authority;
- deciding push, replace, back, and redirect behavior;
- restoring a safe route after refresh, crash, or stale deep link.

It does not own:

- domain authorization decisions;
- aggregate transitions;
- persistence writes;
- cross-module business orchestration;
- gameplay simulation state;
- server truth.

---

## 4. Route Ownership

Every feature module owns its route definitions, loaders, route-level error projection, and route-local navigation helpers.

Example structure:

```text
src/
  app/
    routing/
      router.tsx
      route-registry.ts
      navigation-runtime.ts
  modules/
    learners/
      routes/
      screens/
    practice/
      routes/
      screens/
    assessments/
      routes/
      screens/
    mentorship/
      routes/
      screens/
    gameplay/
      routes/
      screens/
```

The application shell composes module route registrations. It must not absorb module-specific workflow logic.

Shared routing primitives are allowed only when they are neutral infrastructure, such as:

- typed route builders;
- parameter decoders;
- access-gate wrappers;
- route loader adapters;
- navigation telemetry hooks;
- safe redirect utilities.

---

## 5. Canonical Route Families

Illustrative route families:

```text
/
/login
/register
/select-profile

/learners/:learnerId
/learners/:learnerId/path
/learners/:learnerId/skills/:skillId
/learners/:learnerId/practice/:sessionId
/learners/:learnerId/assessments/:attemptId

/parents/:accountId/dashboard
/teachers/:teacherId/classes/:classId
/mentors/:mentorId/learners/:learnerId

/play/:worldId
/play/:worldId/session/:sessionId

/settings
/help
```

Routes should expose stable product concepts. Avoid route names coupled to temporary component names or implementation details.

Bad:

```text
/learner-screen-v2
/open-modal-7
/component/practice-panel
```

---

## 6. Typed Route Contracts

Route parameters are untrusted transport input and must be decoded before use.

```ts
type LearnerRoute = {
  learnerId: LearnerId;
};

type PracticeSessionRoute = {
  learnerId: LearnerId;
  sessionId: PracticeSessionId;
};
```

A route decoder must:

1. read raw path and query values;
2. validate syntax;
3. normalize supported forms;
4. produce branded identifiers or a stable route error;
5. never silently substitute unrelated defaults.

Invalid route identifiers should produce an explicit not-found or invalid-link experience rather than leaking low-level exceptions.

---

## 7. Path State versus Runtime State

State belongs in the URL when it is:

- meaningful to the current location;
- safe to expose;
- useful for refresh or deep link;
- stable enough to bookmark;
- needed for browser back/forward behavior.

Examples:

- selected learner;
- selected class;
- selected skill;
- report filters;
- pagination cursor when shareable;
- active tab when it represents a meaningful sub-location.

State should remain in runtime memory when it is:

- transient interaction state;
- sensitive;
- high-frequency;
- too large for the URL;
- predicted or uncertain;
- tied to a specific mounted view.

Examples:

- drag state;
- open tooltip;
- animation progress;
- unsent answer draft;
- local gameplay target scoring;
- command-in-flight metadata.

---

## 8. Query Parameters

Query parameters must have explicit ownership and schema.

Example:

```ts
type LearnerHistoryQuery = {
  cursor?: string;
  skillId?: SkillId;
  from?: IsoDate;
  to?: IsoDate;
  outcome?: 'mastered' | 'developing' | 'needs-support';
};
```

Rules:

- unknown parameters may be ignored or rejected according to route contract;
- repeated parameters must have defined semantics;
- defaults must be explicit;
- serialization must be deterministic;
- sensitive data must never be placed in the URL;
- server query semantics must remain aligned with Chapter 21H.

---

## 9. Application Shell and Workspace Resolution

Navigation occurs inside a resolved shell context.

A typical resolution flow:

```text
location
  → public/private route classification
  → session restoration
  → active account/profile resolution
  → tenant or workspace resolution
  → coarse route access gate
  → module route loader
  → screen projection
```

The shell may decide that a user must first:

- authenticate;
- choose an account role;
- select a learner profile;
- select a class or workspace;
- accept an invitation;
- recover an interrupted session.

These are navigation prerequisites, not substitutes for server-side authorization.

---

## 10. Route Guards

Route guards are divided into two categories.

### 10.1 Coarse client guards

Examples:

- session exists;
- required profile selected;
- expected workspace context present;
- device capability available;
- route feature enabled.

These improve UX but are not security authority.

### 10.2 Server-authoritative access checks

Examples:

- actor can view learner;
- teacher belongs to class;
- mentor relationship is active;
- assessment attempt belongs to learner;
- subscription permits a premium remediation flow.

The client must render server denial safely and must not infer authorization solely from hidden buttons or route availability.

---

## 11. Intended Destination Recovery

When authentication or context selection interrupts navigation, the runtime may preserve an intended destination.

```ts
type IntendedDestination = {
  pathname: string;
  search?: string;
  createdAt: string;
  reason: 'authentication' | 'profile-selection' | 'workspace-selection';
};
```

Rules:

- preserve only internal trusted routes;
- reject open redirects;
- expire stale destinations;
- revalidate access after restoration;
- replace history when returning from an authentication detour;
- fall back to the safest workspace landing route.

---

## 12. Navigation Commands

Navigation should be expressed through semantic helpers where feature meaning matters.

```ts
openLearnerPath(learnerId);
resumePracticeSession(learnerId, sessionId);
openAssessmentResult(learnerId, attemptId);
returnToWorld(worldId);
```

These helpers may construct routes and choose push or replace semantics, but must not execute domain commands.

Generic primitives remain available for neutral movement:

```ts
navigate.push(location);
navigate.replace(location);
navigate.back();
```

---

## 13. Push versus Replace

Use `push` when the user entered a meaningful new location and should be able to return with Back.

Use `replace` when:

- correcting an invalid canonical URL;
- completing an authentication redirect;
- replacing a temporary loading route;
- preventing return to a consumed one-time flow;
- restoring a recovered canonical route;
- normalizing query parameters.

The choice must be deliberate. Accidental history pollution creates confusing mobile and browser behavior.

---

## 14. Back Navigation

Back behavior should respect platform history first.

Do not implement custom Back buttons that always navigate to a fixed route when a meaningful previous location exists.

A feature may provide a fallback:

```ts
navigate.backOr({
  fallback: learnerPathRoute(learnerId),
});
```

Gameplay and immersive routes may need explicit exit confirmation when leaving would discard meaningful local progress. Such confirmation must distinguish:

- durable server progress;
- recoverable local draft;
- disposable visual state.

---

## 15. Route Loaders

A route loader coordinates the minimum data required to establish route meaning.

It may:

- validate route identity;
- restore session context;
- prefetch critical query data;
- verify resource existence;
- resolve canonical redirects;
- prepare module runtime dependencies.

It must not:

- duplicate feature query orchestration;
- block on noncritical decorative data;
- mutate business state merely because a route opened;
- bypass query and command runtimes.

Opening a page must not accidentally create or complete a business operation unless the route contract explicitly represents that command flow.

---

## 16. Loading Projection

Route-level loading should distinguish:

- application bootstrap;
- session restoration;
- workspace resolution;
- critical route data;
- secondary screen content;
- gameplay asset loading.

The user should receive a stable shell as early as possible.

Avoid replacing the whole application with a global spinner for every nested query.

Recommended hierarchy:

```text
App bootstrap fallback
  → Shell fallback
    → Route fallback
      → Section fallback
        → Component-local pending state
```

---

## 17. Route Failure Projection

Route failures must map to meaningful experiences:

- invalid link;
- not found;
- access denied;
- session expired;
- context unavailable;
- temporary network failure;
- unsupported client version;
- corrupted local navigation state.

Each failure screen should expose the safest recovery action, such as:

- retry;
- sign in again;
- choose another learner;
- return to dashboard;
- refresh application;
- discard stale recovery state.

Raw stack traces and transport payloads must never be shown to end users.

---

## 18. Canonicalization

A route may have one canonical representation.

Examples:

- normalized lowercase slug;
- one selected tenant identifier;
- sorted query parameters;
- removed default values;
- replaced legacy path.

Canonicalization should use `replace`, preserve meaningful context, and avoid redirect loops.

Legacy routes may remain as compatibility adapters during a documented migration window.

---

## 19. Deep Links

Deep links must survive:

- cold start;
- expired session;
- missing profile context;
- application update;
- mobile browser resume;
- installed-app launch where supported.

Deep-link resolution flow:

```text
external or internal link
  → validate origin and route
  → bootstrap runtime
  → restore authentication
  → resolve context
  → authorize resource access
  → open canonical destination
```

A deep link must never bypass normal authentication, authorization, or tenant resolution.

---

## 20. Gameplay Navigation Boundary

Gameplay routes host an immersive runtime but do not place simulation state in the URL.

The URL may identify:

- world;
- durable gameplay session;
- learner profile;
- mission or learning objective when shareable.

The gameplay runtime owns:

- player position;
- selected tool;
- placement intent;
- pickup target;
- animation state;
- local prediction;
- frame-level interaction state.

On exit, the gameplay module must project a durable result or recoverable continuation token before navigation when required.

---

## 21. Interrupted Flow Recovery

The navigation runtime may persist a small recovery record:

```ts
type NavigationRecoveryRecord = {
  routeKey: string;
  location: string;
  contextId?: string;
  recoverableEntityId?: string;
  savedAt: string;
  expiresAt: string;
  confidence: 'high' | 'medium' | 'low';
};
```

Recovery must be conservative.

A stale or low-confidence record should lead to a safe landing page rather than forcing the user into an invalid workflow.

Recovery records are hints. Server state remains authoritative.

---

## 22. Multi-Tab Behavior

Navigation is tab-local by default.

Cross-tab coordination may be required for:

- logout;
- account switch;
- session revocation;
- tenant switch;
- critical client update;
- ownership of one exclusive gameplay session.

A tab must not unexpectedly redirect merely because another tab navigated elsewhere.

---

## 23. Accessibility

Every successful route transition must manage:

- document title;
- primary heading semantics;
- focus restoration;
- screen-reader route announcement;
- skip-navigation behavior;
- reduced-motion preferences.

Focus should move to a meaningful route root after navigation, except where preserving focus is explicitly safer for an in-place transition.

---

## 24. Telemetry

Navigation telemetry may record:

- route key;
- transition source;
- load duration;
- redirect reason;
- recovery path;
- failure category;
- client version;
- correlation identifier.

It must not record sensitive route parameters, answer content, access tokens, or unnecessary child data.

---

## 25. Testing Obligations

Routing tests must cover:

- route parsing and parameter validation;
- canonical URL generation;
- authentication detours;
- intended-destination recovery;
- profile and workspace selection;
- access denial;
- not-found behavior;
- push versus replace semantics;
- back fallback;
- stale recovery records;
- legacy redirects;
- deep links;
- gameplay entry and exit;
- session expiration during navigation;
- cross-tab logout behavior;
- accessibility focus behavior.

---

## 26. Non-Negotiable Rules

1. Feature modules own their routes.
2. URL state and runtime state must not be conflated.
3. Client guards are not security authority.
4. Route opening must not silently execute unrelated business commands.
5. Deep links must pass through normal authentication and authorization.
6. Navigation recovery must be conservative and expiring.
7. Push and replace semantics must be intentional.
8. Gameplay simulation state stays inside the gameplay runtime.
9. Invalid locations must fail safely.
10. Navigation behavior must be testable without rendering the entire application.

---

## 27. Completion Standard

Routing and Navigation Runtime is architecturally complete when:

- every route has clear module ownership;
- public, authenticated, workspace, and gameplay route families are defined;
- route parameters and query strings have typed contracts;
- authentication and context detours preserve safe intended destinations;
- loading, error, and recovery behavior are explicit;
- navigation history semantics are deliberate;
- deep links and refresh restoration are supported;
- client guards do not replace server authorization;
- gameplay entry and exit boundaries are defined;
- route behavior is covered by contract and runtime tests.
