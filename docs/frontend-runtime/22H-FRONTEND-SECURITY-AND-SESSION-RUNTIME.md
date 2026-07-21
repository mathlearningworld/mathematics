# 22H — Frontend Security and Session Runtime

## 1. Purpose

This document defines the frontend security and session runtime for Math Learning World.

It governs:

- authentication state;
- session bootstrap and renewal;
- authorization projection;
- tenant, account, learner, and workspace scope;
- credential storage;
- logout and identity switching;
- sensitive-data handling;
- cross-site and browser threats;
- security failure UX;
- gameplay session boundaries;
- verification obligations.

---

## 2. Core Principle

> The frontend may project authority, but only the server grants authority.

Client-side route guards, hidden buttons, and role checks improve usability. They are not security enforcement.

Every protected server operation must independently authenticate the caller, resolve scope, and authorize the requested action.

---

## 3. Security Runtime Responsibilities

The frontend security runtime owns:

```text
session discovery
credential transport
session renewal coordination
authentication state projection
authorization-capability projection
identity and scope switching
security-driven cache reset
logout propagation
security error classification
```

Feature components consume a stable session/capability interface. They must not parse tokens or duplicate renewal logic.

---

## 4. Session State Model

Recommended states:

```ts
type SessionState =
  | { status: 'UNKNOWN' }
  | { status: 'ANONYMOUS' }
  | { status: 'AUTHENTICATING' }
  | { status: 'AUTHENTICATED'; session: SessionProjection }
  | { status: 'REFRESHING'; session: SessionProjection }
  | { status: 'EXPIRED'; reason: string }
  | { status: 'BLOCKED'; reason: string };
```

`UNKNOWN` is distinct from `ANONYMOUS`. During bootstrap the application must not briefly render protected content based on stale local assumptions.

---

## 5. Session Projection

The frontend receives a minimal projection such as:

```ts
type SessionProjection = {
  sessionId: string;
  actorId: string;
  accountId: string;
  tenantId?: string;
  activeLearnerId?: string;
  roles: string[];
  capabilities: string[];
  issuedAt: string;
  expiresAt: string;
  securityVersion?: number;
};
```

This projection supports UI decisions and request context. It does not expose internal authorization policy or prove that a later operation remains allowed.

---

## 6. Credential Storage

Preferred browser authentication uses secure, HTTP-only, same-site cookies when deployment topology permits.

Sensitive bearer credentials should not be stored in:

- localStorage;
- ordinary persisted application stores;
- URLs;
- logs;
- analytics payloads;
- error reports;
- DOM attributes.

When a bearer token must exist in JavaScript memory, its lifetime must be short and the refresh mechanism must remain protected.

---

## 7. Session Bootstrap

Application startup follows:

```text
initialize security runtime
  → request current session
  → validate compatibility/security version
  → establish identity scope
  → initialize identity-scoped caches
  → resolve intended route
  → load protected feature runtime
```

Protected modules must not execute authority-dependent queries before bootstrap resolves.

---

## 8. Renewal Coordination

Only one runtime coordinator performs session renewal.

When concurrent requests detect expiry:

```text
first request starts renewal
other requests await the same renewal promise
renewal succeeds → replay eligible requests
renewal fails → transition session once
```

The application must prevent refresh storms and repeated login redirects.

Mutation replay after renewal is allowed only when command idempotency and transport state make replay safe.

---

## 9. Expiration and Revocation

Session invalidation may result from:

- normal expiry;
- explicit logout;
- password or credential change;
- account disablement;
- role or membership removal;
- security-version increment;
- administrator revocation;
- detected compromise.

The frontend must treat server rejection as authoritative even when the locally projected expiration time has not passed.

---

## 10. Logout

Logout is a runtime transition, not merely navigation to a login page.

It must:

- invalidate the server session where possible;
- clear credentials;
- cancel protected in-flight work;
- clear identity-scoped query caches;
- clear sensitive persisted state;
- terminate realtime subscriptions;
- reset feature stores;
- discard incompatible recovery intents;
- broadcast logout to other tabs;
- navigate to an allowed destination.

Non-sensitive downloaded public learning assets may remain cached when policy permits.

---

## 11. Multi-Tab Coordination

Tabs sharing an origin coordinate security events through an appropriate browser mechanism.

Events include:

```text
SESSION_ESTABLISHED
SESSION_REFRESHED
SESSION_REVOKED
LOGOUT
ACTIVE_SCOPE_CHANGED
SECURITY_VERSION_CHANGED
```

A tab receiving logout or revocation must stop protected activity immediately. It must not continue using stale in-memory credentials.

---

## 12. Identity and Scope Switching

Math Learning World may contain several relevant identities:

- authenticated actor;
- account or family owner;
- active learner;
- teacher classroom;
- mentor relationship;
- organization or tenant;
- gameplay profile.

Scope switching must be explicit and atomic.

```text
request scope change
  → validate server authority
  → cancel old-scope work
  → clear incompatible cache/store state
  → establish new scope key
  → load new projection
  → navigate to safe route
```

A learner selector must never be implemented as a cosmetic local variable while requests continue under the previous scope.

---

## 13. Authorization Projection

The server may return stable capabilities such as:

```text
learner.progress.read
learner.practice.start
learner.assessment.submit
classroom.monitor
mentorship.invitation.accept
account.credit.manage
```

The frontend uses capabilities to:

- show or hide available actions;
- explain why an action is unavailable;
- avoid impossible requests;
- select safe navigation destinations.

It must still handle an authorization denial because authority can change after projection.

---

## 14. Relationship-Based Authorization

Some permissions depend on relationships, not roles alone.

Examples:

- parent to child;
- teacher to assigned classroom;
- mentor to accepted learner relationship;
- staff member to organization;
- learner to own progress.

The frontend may receive relationship-scoped capabilities but must not infer access from identifiers or previously viewed pages.

---

## 15. Route Protection

Routes declare requirements:

```ts
type RouteSecurity = {
  authentication: 'public' | 'anonymous-only' | 'authenticated';
  requiredCapabilities?: string[];
  requiredScope?: 'account' | 'learner' | 'classroom' | 'gameplay';
};
```

The router may block rendering and redirect to authentication, scope selection, or an access-denied screen.

Security checks must happen before protected loaders expose data to the route tree.

---

## 16. Command Security

Command request bodies must not supply trusted actor, tenant, role, or ownership fields.

The request runtime attaches trusted context through the authenticated channel.

For sensitive commands, support may include:

- recent-authentication requirement;
- reauthentication challenge;
- CSRF protection;
- idempotency key;
- expected version;
- user confirmation;
- audit correlation.

The frontend must not convert an authorization or security challenge into a generic retry loop.

---

## 17. CSRF

Cookie-authenticated mutations require a CSRF strategy appropriate to the deployment.

Controls may include:

- SameSite cookies;
- anti-CSRF token;
- origin and referer validation;
- custom request headers;
- strict CORS policy.

The frontend request runtime owns token attachment and renewal. Individual components do not manage CSRF tokens.

---

## 18. XSS and Content Safety

Untrusted content must be rendered as text by default.

HTML rendering requires:

- an explicit product need;
- server-side and/or trusted sanitization;
- a reviewed renderer;
- content-security-policy compatibility;
- tests for dangerous payloads.

Avoid dynamic code execution, unsafe HTML insertion, string-built script URLs, and unreviewed third-party widgets.

User names, lesson content, mentor messages, captions, and imported text are all untrusted.

---

## 19. Content Security Policy

The application should support a restrictive Content Security Policy.

The architecture avoids dependencies on:

- inline scripts;
- `eval`-like execution;
- arbitrary remote script origins;
- data URLs for executable content;
- uncontrolled iframe embedding.

Asset and analytics providers must be explicitly allowlisted and reviewed.

---

## 20. URL and Navigation Safety

The frontend must validate redirect and return destinations.

Never navigate directly to an untrusted URL supplied through:

- query parameters;
- API response fields;
- notification payloads;
- imported lesson data.

Internal return paths should be normalized and restricted to application-owned routes. External navigation should use an explicit allowlist or confirmed user action.

---

## 21. Sensitive Data Handling

Sensitive categories may include:

- child identity and profile data;
- educational progress;
- family relationships;
- teacher notes;
- authentication factors;
- payment or credit information;
- private media.

Security rules:

- fetch only what the screen needs;
- avoid broad account objects in global stores;
- redact logs and telemetry;
- clear memory/store state on scope exit;
- prevent sensitive content in URL paths and query strings;
- use private caching headers and identity-scoped caches;
- avoid screenshots/previews where platform controls permit.

---

## 22. Error Classification

Security-related failures are classified distinctly:

```text
AUTHENTICATION_REQUIRED
SESSION_EXPIRED
SESSION_REVOKED
REAUTHENTICATION_REQUIRED
ACCESS_DENIED
SCOPE_NOT_AVAILABLE
CSRF_VALIDATION_FAILED
CLIENT_VERSION_BLOCKED
ACCOUNT_BLOCKED
```

The UI response differs by category. For example, `ACCESS_DENIED` must not trigger repeated session refresh.

---

## 23. Security UX

Security UX should be calm and precise.

The user must understand:

- whether work was saved;
- whether sign-in is required;
- whether authority changed;
- whether they selected the wrong learner/workspace;
- whether reauthentication is needed;
- whether the application version must refresh.

Do not reveal sensitive policy internals or existence of inaccessible resources.

---

## 24. Gameplay Session Boundary

Gameplay runtime receives a bounded session projection, not raw credentials.

It may consume:

- active learner/profile identity;
- allowed mission/scene identifiers;
- entitlement projection;
- capability flags;
- synchronization channel.

It must not:

- parse authentication tokens;
- persist credentials in save data;
- infer entitlement from local inventory;
- grant progress because a local scene was modified;
- retain another learner’s scene state after scope switching.

---

## 25. Child and Family Context

Because the platform may serve children, the frontend should minimize collection and exposure by default.

Design obligations include:

- age-appropriate explanations;
- parent/guardian authority boundaries;
- no accidental cross-child data leakage;
- deliberate account switching;
- protected teacher/mentor notes;
- conservative analytics identifiers;
- clear consent boundaries where required by product policy and law.

Legal requirements are handled by current jurisdiction-specific policy; this document defines the runtime hooks needed to enforce them.

---

## 26. Third-Party Integrations

Third-party SDKs must be isolated behind adapters and reviewed for:

- data collection;
- script execution privileges;
- cookie/storage behavior;
- child-data implications;
- failure behavior;
- content-security-policy requirements;
- removal strategy.

A third-party outage must not silently weaken authentication or authorization.

---

## 27. Observability

Security telemetry may record:

- session bootstrap result;
- renewal success/failure category;
- revocation event;
- authorization denial category;
- scope-switch result;
- CSRF failure;
- blocked redirect;
- security-driven cache reset;
- client-version block.

Never record credentials, tokens, full sensitive payloads, or unnecessary child data.

---

## 28. Verification Obligations

Tests must cover:

- unknown-to-anonymous and unknown-to-authenticated bootstrap;
- single-flight renewal;
- renewal failure;
- logout across tabs;
- identity and learner scope switching;
- cache reset on authority change;
- protected route loaders;
- stale capability denial;
- CSRF attachment/failure;
- safe redirect validation;
- XSS-safe rendering;
- credential absence from persistence/logs;
- gameplay reset on learner switch;
- revoked session during an active command.

---

## 29. Completion Criteria

Frontend security and session runtime is complete when:

- authentication state is explicit;
- credential handling is centralized;
- renewal is coordinated;
- logout clears all protected runtime state;
- scope switching is atomic;
- authorization projection never replaces server enforcement;
- sensitive data is minimized and correctly scoped;
- gameplay cannot manufacture authority;
- security failures have deterministic UX;
- runtime and operational tests prove the boundaries.
