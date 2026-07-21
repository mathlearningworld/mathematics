# 21E — Authentication and Authorization

## 1. Purpose

This document defines the API security boundary for identity, session trust, actor context, tenant isolation, and authorization in Math Learning World.

It governs:

- authentication mechanisms;
- access and refresh token responsibilities;
- RequestContext construction;
- actor and subject identity;
- tenant and workspace scope;
- authorization placement;
- role, relationship, and resource policies;
- service and machine identities;
- impersonation and delegated access;
- security failures;
- audit and testing obligations.

---

## 2. Core Principle

> Authentication establishes who or what is calling; authorization determines whether that authenticated actor may perform a specific action on a specific resource in the current scope.

Authentication and authorization are related but separate decisions.

A valid identity does not imply permission.

A role name alone does not prove access to a particular learner, class, account, or operation.

---

## 3. Security Boundary

The API boundary is responsible for:

```text
credentials or token
  → authentication validation
  → trusted subject identity
  → active actor and tenant scope
  → RequestContext
  → Application authorization
  → command or query execution
```

The API must never treat body fields, query parameters, or client-controlled headers as trusted actor identity without cryptographic or server-side validation.

---

## 4. Identity Concepts

The system distinguishes these concepts:

### 4.1 Subject

The identity represented by the authenticated credential.

Examples:

- a human account;
- a service account;
- an integration client;
- a device identity where explicitly supported.

### 4.2 Actor

The identity performing the current application action.

Usually the actor and subject are the same.

They differ during approved delegation or impersonation.

### 4.3 Principal

The trusted security representation used by the runtime after authentication.

### 4.4 Tenant or workspace

The current organizational boundary in which an action executes.

### 4.5 Resource owner or relationship

The domain relationship that may grant or restrict access, such as guardian-to-learner or teacher-to-class.

These identities must not be collapsed into one unstructured user object.

---

## 5. RequestContext

Every protected command and query receives a trusted RequestContext.

Recommended shape:

```ts
type RequestContext = {
  requestId: string;
  correlationId: string;
  subject: {
    subjectId: string;
    subjectType: 'user' | 'service' | 'integration';
    authenticationMethod: string;
    sessionId?: string;
  };
  actor: {
    actorId: string;
    actorType: 'user' | 'service';
    delegatedByActorId?: string;
  };
  tenant?: {
    tenantId: string;
    membershipId?: string;
  };
  roles: string[];
  permissions: string[];
  authenticatedAt: string;
  receivedAt: string;
};
```

This is an architectural example, not permission to put all policy decisions into token claims.

RequestContext is created once at the API boundary and passed inward explicitly.

---

## 6. Authentication Inputs

Supported authentication inputs must be explicit.

Typical HTTP bearer authentication:

```http
Authorization: Bearer <access-token>
```

Other mechanisms may be added for specific boundaries:

- secure HTTP-only session cookie;
- service-to-service signed token;
- webhook signature;
- API key for a constrained integration;
- one-time exchange token;
- device credential.

Each mechanism requires its own threat model, expiry, revocation, scope, rotation, and audit policy.

Do not accept several ambiguous credential mechanisms on the same endpoint without a documented precedence rule.

---

## 7. Access Token Contract

An access token proves a bounded authentication assertion.

It should contain or reference only the minimum claims required to validate the session and build trusted context.

Typical claims:

```text
issuer
subject
audience
issued-at
expiry
session identifier
token identifier
authentication method
```

Tenant, role, or permission claims may be included only when their staleness and revocation behavior are acceptable.

The server must validate:

- signature or equivalent authenticity;
- expected issuer;
- expected audience;
- expiry;
- not-before constraint when present;
- token type;
- session or subject status where required;
- revocation state where supported.

A decoded token is not necessarily a validated token.

---

## 8. Refresh Token Contract

Refresh tokens are credentials for obtaining new access tokens.

They are not access tokens and must not be accepted by normal business endpoints.

Refresh-token requirements:

- long random or cryptographically protected value;
- secure storage;
- narrow endpoint use;
- rotation on successful exchange where adopted;
- replay detection;
- revocation on logout, compromise, or account security change;
- association with a session or device record;
- protected transport;
- no exposure in logs or client-readable browser storage when secure cookies are used.

A reused rotated refresh token should trigger the configured session-compromise response.

---

## 9. Session Model

A session may track:

```ts
type SessionSecurityRecord = {
  sessionId: string;
  subjectId: string;
  createdAt: string;
  lastAuthenticatedAt: string;
  expiresAt: string;
  revokedAt?: string;
  refreshFamilyId?: string;
  authenticationMethod: string;
  securityVersion: number;
};
```

Session records allow server-side revocation and security-state changes that cannot safely wait for token expiry.

The exact persistence model remains an Infrastructure concern.

---

## 10. Password Authentication

Where password login exists:

- passwords are never stored in plaintext;
- passwords are hashed with an approved adaptive password hashing algorithm;
- verification is timing-safe through the approved library;
- login responses do not reveal whether an account exists more than product requirements permit;
- rate limits and abuse controls apply;
- credential stuffing and brute-force signals are monitored;
- password reset tokens are single-use, scoped, expiring credentials;
- password changes may revoke existing sessions according to policy.

The API never returns password hashes or password-reset secrets.

---

## 11. Authentication Failure Semantics

Typical public failures:

```text
AUTHENTICATION_REQUIRED
INVALID_ACCESS_TOKEN
ACCESS_TOKEN_EXPIRED
SESSION_REVOKED
INVALID_REFRESH_TOKEN
REFRESH_TOKEN_REUSED
AUTHENTICATION_METHOD_NOT_ALLOWED
```

Responses must avoid exposing cryptographic validation details.

Typical status:

```text
401 Unauthorized
```

A `WWW-Authenticate` header should be used where appropriate to the authentication scheme.

---

## 12. Tenant Scope

Tenant scope is established from trusted membership and request routing context.

It must not be accepted merely because the client submits:

```json
{
  "tenantId": "some-other-tenant"
}
```

A route may identify a tenant or workspace in the URI:

```text
/api/v1/workspaces/{workspaceId}/classes
```

but the server must verify that the authenticated actor has an active relationship to that workspace.

URI identity selects a requested scope; it does not grant access.

---

## 13. Tenant Isolation

Tenant isolation must exist across:

- commands;
- queries;
- repository methods;
- cache keys;
- event subscriptions;
- object storage paths;
- exports;
- background jobs;
- observability access;
- idempotency records.

A tenant-safe query includes tenant scope before data retrieval.

Unsafe:

```text
find by globally supplied record ID → check tenant afterward
```

Preferred:

```text
find by tenant ID and record ID together
```

Where global identifiers are used internally, authorization checks remain mandatory.

---

## 14. Authorization Layers

Authorization may occur at several layers for different reasons.

### 14.1 API boundary

Appropriate for coarse transport policy:

- endpoint requires authentication;
- endpoint allows only service credentials;
- required authentication strength;
- required tenant header or route scope;
- basic static permission prerequisite.

### 14.2 Application layer

Owns use-case authorization:

- actor may start this practice session;
- guardian may view this learner;
- teacher may manage this class;
- mentor may submit guidance for this relationship;
- operator may approve this workflow transition.

### 14.3 Domain layer

Owns business invariants independent of caller identity, and may participate when actor-related rules are true domain rules.

Authorization must not be implemented solely in frontend visibility logic.

---

## 15. Role-Based Access

Roles are coarse capability groupings.

Examples may include:

```text
LEARNER
GUARDIAN
TEACHER
MENTOR
WORKSPACE_ADMIN
SYSTEM_OPERATOR
```

Role names are not universal permission grants.

A teacher role does not automatically authorize access to every class.

A guardian role does not automatically authorize access to every learner.

A workspace admin role applies only inside an authorized workspace unless explicitly global.

---

## 16. Permission-Based Access

Permissions express stable action capabilities.

Example forms:

```text
learner.read
learner.progress.read
practice-session.start
practice-session.complete
class.manage
mentorship.invitation.accept
```

Permissions are inputs to policy, not always the complete policy.

Resource ownership, membership status, domain state, and relationship checks may still be required.

---

## 17. Relationship-Based Access

Many education workflows require relationship checks.

Examples:

- account is the learner;
- account is an active guardian of learner;
- teacher is assigned to class;
- learner belongs to class;
- mentor relationship is active and approved;
- organization owns the curriculum configuration;
- parent has access to a family account.

These relationships must be loaded through stable application or domain contracts.

Do not infer a sensitive relationship from client-provided identifiers.

---

## 18. Resource-State Authorization

Permission may depend on current resource state.

Examples:

- only an invited guardian may accept a pending invitation;
- only an active teacher assignment may update a class plan;
- a submitted assessment cannot be modified;
- a revoked mentorship relation grants no further access;
- a closed account cannot create new learner sessions.

This logic belongs in Application and Domain processing, not static route middleware alone.

---

## 19. Authorization Decision Contract

Authorization should produce a clear decision.

Example:

```ts
type AuthorizationDecision =
  | { allowed: true }
  | {
      allowed: false;
      reasonCode: string;
      concealExistence?: boolean;
    };
```

Public mapping uses stable API error codes.

Internal reason codes may be more detailed but must not leak sensitive policy information.

---

## 20. Denial Semantics

Typical distinctions:

```text
401 Unauthorized
```

The request lacks valid authentication.

```text
403 Forbidden
```

The actor is authenticated but lacks permission and existence disclosure is acceptable.

```text
404 Not Found
```

The resource is absent or policy intentionally conceals its existence.

The choice must be consistent per resource family and threat model.

---

## 21. Step-Up Authentication

Sensitive actions may require stronger or more recent authentication.

Examples:

- changing password or recovery factors;
- transferring ownership;
- exporting sensitive learner records;
- changing billing or credit settings;
- impersonating another user;
- revoking all sessions.

The RequestContext may include authentication time and assurance method.

A stale but otherwise valid session may receive:

```text
STEP_UP_AUTHENTICATION_REQUIRED
```

The response should direct the client to an approved reauthentication flow without revealing secrets.

---

## 22. Service Identities

Service-to-service calls use explicit machine identity.

Requirements:

- distinct identity from human accounts;
- narrow audience;
- narrow permissions;
- credential rotation;
- revocation;
- no reuse of personal access tokens;
- traceable caller identity;
- tenant scope where applicable;
- replay protection where needed.

A service identity must not silently inherit global access.

---

## 23. Integration and API Keys

API keys may be used only for constrained integration scenarios.

An API key must have:

- identifiable owner;
- scope;
- environment;
- creation and expiry metadata;
- revocation;
- rotation path;
- usage audit;
- secure hashed or encrypted storage as appropriate;
- rate limits.

Keys must never be accepted through URL query parameters.

Public key prefixes may aid identification, but the secret value is returned only at creation time.

---

## 24. Webhook Authentication

Inbound webhooks require provider-specific verification.

Typical controls:

- signature verification over raw request bytes;
- timestamp tolerance;
- replay prevention;
- delivery identifier idempotency;
- expected provider or endpoint identity;
- secret rotation;
- bounded body size.

A webhook payload is untrusted until signature validation succeeds.

Signature verification must occur before JSON normalization changes the signed bytes when the provider signs raw content.

---

## 25. Delegation

Delegation allows one actor to perform bounded actions on behalf of another identity or account.

Delegation requires:

- explicit grant;
- defined scope;
- expiry or revocation;
- auditable grantor and delegate;
- clear actor versus represented subject;
- policy enforcement on every request.

Do not overwrite the real actor identity with the represented identity.

---

## 26. Impersonation

Administrative impersonation is high-risk and must be exceptional.

Requirements:

- explicit privileged permission;
- reason or support case reference;
- short-lived impersonation session;
- visible indication in administrative UI;
- immutable audit record;
- original subject identity preserved;
- restricted actions during impersonation;
- no access to authentication secrets;
- immediate termination capability.

Recommended context:

```ts
actor: {
  actorId: 'support-admin-id',
  delegatedByActorId: undefined
},
representedSubject: {
  subjectId: 'learner-account-id'
}
```

The exact naming may vary, but both identities must remain available.

---

## 27. Browser Security

For browser clients:

- secure cookies use `Secure`, `HttpOnly`, and an appropriate `SameSite` policy;
- CSRF protection is required when ambient cookies authenticate state-changing requests;
- CORS is allowlisted rather than reflected broadly;
- tokens are not placed in URLs;
- sensitive responses use appropriate cache controls;
- authentication pages resist clickjacking according to deployment policy;
- logout clears or revokes relevant credentials.

CORS is not authorization.

CSRF and XSS are different threats and require different controls.

---

## 28. Mobile and Native Clients

Native clients must use platform-appropriate secure credential storage.

Public clients cannot safely keep a permanent embedded client secret.

Authentication flows should use approved authorization-code and proof-of-possession patterns where applicable.

Deep-link and redirect URI validation must be strict.

---

## 29. Token Storage and Logging

Never log:

- bearer tokens;
- refresh tokens;
- passwords;
- password reset tokens;
- API key secrets;
- session cookies;
- webhook secrets;
- authorization headers.

Structured logs may include protected identifiers such as token ID, session ID, actor ID, and authentication method when permitted.

Sensitive values must be redacted at the earliest logging boundary.

---

## 30. Revocation

Revocation events may include:

- logout;
- password change;
- credential compromise;
- refresh-token replay;
- account suspension;
- role or membership removal;
- tenant access removal;
- administrator security action;
- service key rotation.

The system must define which events revoke:

- one access token;
- one session;
- one refresh-token family;
- all sessions for a subject;
- all credentials for an integration.

Short token expiry reduces risk but does not replace revocation for critical events.

---

## 31. Authorization and Caching

Cached responses must remain authorization-safe.

Cache keys must include every relevant scope:

```text
tenant
actor or visibility class
resource
representation
permission-sensitive variant
version or freshness identity
```

Never serve a cached learner response created under one actor's visibility to another actor without proving the representation is identical and authorized.

Authorization decisions themselves may be cached only with careful invalidation tied to membership, role, relationship, and security-version changes.

---

## 32. Authorization and Events

Event and realtime subscriptions require authorization at:

- subscription creation;
- topic or channel binding;
- each event delivery when policy may have changed;
- reconnection;
- replay or history retrieval.

A previously authorized socket must not retain access indefinitely after membership revocation.

Event payloads must apply the same data-minimization rules as HTTP responses.

---

## 33. Authorization and Object Storage

File access must not rely on guess-resistant object keys alone.

Downloads require:

- authenticated and authorized resource lookup;
- tenant-safe storage identity;
- short-lived signed URL or streamed response;
- content-disposition policy;
- audit where appropriate.

Signed URLs must be short-lived and scoped to one object and operation.

---

## 34. Audit Contract

Security-relevant actions should produce immutable or protected audit evidence.

Examples:

- login success and security-relevant failure;
- logout and session revocation;
- password or recovery-factor change;
- role or membership change;
- delegation grant or revocation;
- impersonation start and stop;
- sensitive export;
- ownership transfer;
- API key creation and revocation;
- repeated authorization denial suggesting abuse.

Audit records should capture:

```text
occurredAt
requestId
correlationId
subjectId
actorId
tenantId
action
resource type and public-safe identifier
outcome
reason category
source metadata as permitted
```

Audit logs must not contain secrets.

---

## 35. Rate Limiting and Abuse Protection

Authentication endpoints require dedicated abuse controls.

Rate limits may be scoped by:

- IP or network signal;
- account identifier;
- device or session;
- API key;
- tenant;
- endpoint class.

Responses should use stable rate-limit errors and may include retry guidance.

Rate limiting must not create a reliable account-enumeration side channel.

---

## 36. Account Enumeration

Registration, login, password reset, and invitation flows must decide how much account existence information may be revealed.

Where concealment is required, use uniform public messages and comparable response behavior.

Internal telemetry may preserve exact causes.

Product usability exceptions must be explicit and reviewed as security trade-offs.

---

## 37. Failure Codes

Representative security error codes:

```text
AUTHENTICATION_REQUIRED
INVALID_ACCESS_TOKEN
ACCESS_TOKEN_EXPIRED
SESSION_REVOKED
AUTHENTICATION_STRENGTH_INSUFFICIENT
STEP_UP_AUTHENTICATION_REQUIRED
TENANT_CONTEXT_REQUIRED
TENANT_ACCESS_FORBIDDEN
RESOURCE_ACCESS_FORBIDDEN
RELATIONSHIP_REQUIRED
DELEGATION_INVALID
SERVICE_IDENTITY_REQUIRED
RATE_LIMIT_EXCEEDED
```

All errors use the common Error Contract in 21F.

Do not expose policy internals such as exact missing database rows or token-signature diagnostics.

---

## 38. Testing Obligations

Authentication tests must cover:

1. missing credential;
2. malformed credential;
3. invalid signature;
4. wrong issuer or audience;
5. expired token;
6. revoked session;
7. refresh rotation;
8. refresh replay;
9. logout and revocation;
10. secret redaction.

Authorization tests must cover:

1. permitted actor;
2. wrong role;
3. wrong permission;
4. wrong tenant;
5. inactive membership;
6. absent required relationship;
7. resource-state denial;
8. existence concealment;
9. delegated access bounds;
10. impersonation restrictions;
11. cache isolation;
12. event subscription revocation;
13. file access isolation.

Negative-path tests are mandatory for security boundaries.

---

## 39. Prohibited Patterns

The following are prohibited:

- trusting actor, role, or tenant from request body;
- decoding a token without validating it;
- using refresh tokens as access tokens;
- storing plaintext passwords or reusable secret tokens;
- authorization only in frontend code;
- treating a global role as universal resource access;
- loading cross-tenant data before scoping;
- returning raw authorization reasons to clients;
- logging credentials;
- placing tokens in URLs;
- broad wildcard CORS with credentials;
- long-lived signed file URLs without justification;
- untracked impersonation;
- shared caching without authorization-safe variation;
- service accounts using human credentials.

---

## 40. Review Checklist

Before approving a protected endpoint, verify:

- [ ] accepted authentication mechanism is explicit;
- [ ] credential validation is complete;
- [ ] RequestContext is built from trusted data;
- [ ] actor, subject, and tenant are distinct where needed;
- [ ] authorization occurs in the correct layer;
- [ ] role is not mistaken for resource relationship;
- [ ] tenant isolation is enforced in retrieval and mutation;
- [ ] denial and existence-concealment semantics are defined;
- [ ] sensitive actions require appropriate authentication strength;
- [ ] cache and event paths preserve authorization;
- [ ] secrets are redacted;
- [ ] revocation behavior is defined;
- [ ] security audit evidence exists;
- [ ] negative authorization tests exist.

---

## 41. Completion Rule

Authentication and authorization are complete only when:

```text
credential
  → verified subject
  → trusted actor and tenant context
  → explicit use-case policy
  → relationship and resource-state checks
  → authorized command or query
  → minimized response
  → stable denial behavior
  → audit and negative-path verification
```

A valid token alone is not proof of authorized application behavior.