# 19G — Authorization

## 1. Purpose

This document defines the application-layer authorization model for Math Learning World.

Authorization determines whether an authenticated or system actor may perform one explicit use case or observe one protected result within the applicable learner, family, classroom, school, tenant, or platform boundary.

This document is the Source of Truth for:

- authorization ownership;
- actor and scope context;
- permission and policy evaluation;
- tenant and learner isolation;
- command authorization;
- query visibility;
- denial behavior;
- auditability;
- authorization testing.

---

## 2. Core Principle

> Authentication establishes who the actor is; authorization establishes what that actor may do here, now, to this resource.

A valid login never implies unrestricted access.

Authorization must be explicit, deny by default, and use authoritative server-side facts.

---

## 3. Layer Ownership

Authorization is coordinated by the application layer because it depends on:

- the requested use case;
- authenticated actor identity;
- tenant or workspace context;
- resource ownership or relationship;
- domain-relevant permission facts;
- the requested operation.

The domain layer may enforce actor-independent invariants and may model domain policies involving roles or relationships. It must not depend on HTTP middleware, JWT payloads, sessions, or framework request objects.

Infrastructure supplies identity, membership, and policy data through approved ports.

Presentation may reject obviously unauthenticated requests early, but it is not the final authorization authority.

---

## 4. Authorization Context

Every protected use case must receive an explicit authorization context.

```ts
interface AuthorizationContext {
  actorId: string;
  actorType: ActorType;
  tenantId?: string;
  workspaceId?: string;
  sessionId?: string;
  authenticationMethod?: string;
  correlationId: string;
}
```

The context must be created from trusted authentication infrastructure.

Client-provided fields such as `role`, `ownerId`, `tenantId`, or `isAdmin` are requests or selectors, never proof of authority.

---

## 5. Actor Types

The platform may recognize actors such as:

- learner;
- parent or guardian;
- mentor;
- teacher;
- school administrator;
- tenant administrator;
- platform operator;
- trusted system process.

Actor type alone does not grant access. Authorization also evaluates scope, relationship, resource, operation, and current status.

For example, a parent may view only learners for whom an authoritative guardian relationship exists.

---

## 6. Authorization Decision Model

An authorization decision should evaluate:

```text
Actor
+ Operation
+ Resource or resource scope
+ Tenant/workspace boundary
+ Authoritative relationships
+ Current policy facts
= ALLOW or DENY
```

An optional structured reason may be recorded internally for auditing and diagnostics.

Public responses must not disclose sensitive existence or policy details unnecessarily.

---

## 7. Permission Naming

Permissions should describe business capabilities rather than screens or HTTP routes.

Good examples:

- `learner.progress.read.self`;
- `learner.progress.read.guardian`;
- `mission.attempt.start`;
- `mission.attempt.complete`;
- `classroom.learners.read`;
- `curriculum.manage`;
- `mentorship.credit.award`;
- `tenant.membership.manage`.

Weak examples:

- `page.dashboard.open`;
- `api.post.allowed`;
- `button.edit.visible`;
- `admin.all`.

UI visibility may project permissions, but UI naming must not define the underlying authority model.

---

## 8. RBAC and Policy-Based Authorization

Role-based access control may provide a coarse permission set, but roles are not sufficient for resource-level decisions.

The system should combine:

- role or membership capability;
- tenant/workspace scope;
- ownership or relationship;
- resource status;
- operation-specific policy;
- exceptional restrictions.

Example:

```text
Teacher role
AND active classroom membership
AND learner enrolled in that classroom
AND permission to view learning progress
=> may view approved classroom learner progress
```

This is policy-based authorization using authoritative facts, not a role string comparison.

---

## 9. Command Authorization

A command handler or application service must authorize before performing protected mutation.

Standard flow:

1. validate trusted execution context;
2. identify the requested operation and resource scope;
3. load the minimum authoritative facts required for the decision;
4. evaluate the authorization policy;
5. deny immediately when not allowed;
6. load additional mutable state only after authorization where possible;
7. execute the domain behavior.

Some decisions require loading the aggregate because authority depends on its current state. In that case, only the minimum state needed for the decision may be loaded before authorization.

---

## 10. Query Authorization and Visibility

Queries require both permission and result visibility controls.

A query handler must not fetch an unrestricted dataset and rely on presentation code to hide unauthorized rows.

Authorization must be expressed in the read boundary through:

- tenant-scoped repository methods;
- actor-scoped projections;
- permitted learner or classroom identifiers;
- policy-derived filters;
- field redaction.

Example:

```text
GetParentLearningOverview
-> resolve authoritative guardian relationships
-> query only related learner IDs
-> redact teacher-only diagnostic fields
-> return approved read model
```

---

## 11. Tenant and Workspace Isolation

Every tenant-scoped operation must preserve tenant isolation.

Rules:

- tenant scope comes from trusted context or authoritative membership resolution;
- repositories require tenant/workspace scope where applicable;
- resource identifiers alone must not bypass scope checks;
- cross-tenant access is denied by default;
- platform-operator access requires explicit elevated policy and audit;
- background jobs carry explicit tenant context.

A globally unique identifier is not an authorization mechanism.

---

## 12. Learner and Family Privacy Boundary

Learner information is protected by relationship and purpose.

The authorization model must distinguish among:

- learner self-access;
- guardian access;
- mentor access;
- teacher/classroom access;
- school administration access;
- support/operator access.

Each relationship grants only the minimum required visibility.

For example, a mentor may access assigned learning tasks without receiving unrelated family, billing, or school information.

---

## 13. Field-Level Visibility

Permission to access a resource does not automatically grant access to every field.

Read models may need field-level policies for:

- personal identifiers;
- contact details;
- diagnostic notes;
- raw learner responses;
- family billing information;
- teacher-only observations;
- internal risk or support flags;
- audit metadata.

Field redaction belongs in an application read-model boundary or dedicated visibility policy, not ad hoc in UI components.

---

## 14. Relationship Resolution

Relationships used for authorization must come from authoritative sources, such as:

- active guardian-to-learner relationship;
- classroom enrollment;
- teacher assignment;
- mentorship assignment;
- tenant membership;
- ownership of a private learning profile;
- delegated administrative authority.

Cached relationship data may be used only when its freshness and revocation semantics are acceptable for the operation.

---

## 15. Resource Status and Contextual Rules

Authorization may depend on current resource status.

Examples:

- a learner may modify an attempt only while it is active;
- a teacher may review evidence only after submission;
- a guardian may approve a mentorship relationship while pending;
- a tenant administrator may manage only active membership within the tenant;
- an archived curriculum version may be readable but not editable.

When the rule is a true business invariant, it belongs in the domain as well. Authorization does not replace valid state-transition enforcement.

---

## 16. Authorization Service Contract

The application layer may use an authorization service or policy registry.

```ts
interface AuthorizationRequest {
  operation: Permission;
  actor: AuthorizationActor;
  scope: AuthorizationScope;
  resource?: AuthorizationResource;
}

interface AuthorizationDecision {
  allowed: boolean;
  reasonCode?: string;
}

interface AuthorizationService {
  decide(request: AuthorizationRequest): Promise<AuthorizationDecision>;
}
```

The service contract must remain presentation-neutral and infrastructure-independent.

---

## 17. Policy Specifications

Complex authorization may be represented by named policies or specifications, for example:

- `CanViewLearnerProgressPolicy`;
- `CanManageClassroomPolicy`;
- `CanCompleteMissionAttemptPolicy`;
- `CanAwardMentorshipCreditPolicy`;
- `CanManageCurriculumPolicy`.

A named policy should explain the decision in domain and application language rather than hiding it in generic middleware expressions.

---

## 18. Deny by Default

When any of the following is missing or ambiguous, the result is denial:

- actor identity;
- required tenant/workspace scope;
- authoritative membership;
- required relationship;
- known permission mapping;
- resource scope;
- policy registration.

The system must never infer permission from missing data, frontend behavior, or a fallback role.

---

## 19. Failure Semantics

Authorization denial must map to a stable application failure such as `AUTHORIZATION_DENIED`.

The external transport may choose between forbidden and not-found semantics based on information-disclosure policy.

For sensitive resources, returning a generic not-found response may prevent confirming resource existence.

Internally, telemetry should preserve the real denial category without exposing confidential policy details to the caller.

---

## 20. Authentication Failure vs Authorization Failure

The system must distinguish:

- unauthenticated: no valid trusted actor identity;
- unauthorized: valid actor identity but insufficient authority;
- invalid scope: actor is authenticated but the requested tenant/workspace context is not valid;
- relationship missing or revoked;
- resource not found within authorized scope.

These categories support correct security behavior, diagnostics, and audit.

---

## 21. Elevated and Support Access

Platform support or operator access must not use an unrestricted implicit superuser path.

Elevated access requires:

- a named permission;
- a defined operational purpose;
- explicit scope;
- strong authentication where appropriate;
- audit logging;
- time limitation or revocation capability where feasible;
- protection against access to unnecessary learner data.

Impersonation, when introduced, must be explicit, visible, and fully audited.

---

## 22. System Actors and Background Jobs

Background jobs and integration consumers are actors.

They must carry:

- a stable system identity;
- declared capability;
- tenant/workspace scope where applicable;
- correlation and causation identifiers;
- least-privilege credentials.

A background process must not receive authority merely because it runs inside the backend.

---

## 23. Caching Authorization Decisions

Authorization decisions may be cached only when:

- the cache key includes actor, operation, scope, and relevant resource facts;
- membership and revocation freshness is acceptable;
- sensitive operations use appropriately short lifetimes or no cache;
- tenant boundaries are preserved;
- cache invalidation behavior is understood.

Do not cache a broad role decision and reuse it across unrelated resources.

---

## 24. Auditability

Security-relevant authorization activity should record privacy-safe structured facts:

- actor identifier;
- operation;
- tenant/workspace scope;
- resource type and identifier where appropriate;
- allow or deny outcome;
- policy or reason code;
- correlation identifier;
- timestamp;
- elevated-access indicator.

Audit records must avoid storing secrets, raw credentials, or unnecessary learner content.

---

## 25. Presentation Responsibilities

Presentation may:

- hide unavailable actions for usability;
- request authentication;
- pass trusted session context supplied by the backend platform;
- map authorization failures into user-friendly responses.

Presentation must not:

- be the only enforcement point;
- invent roles or permissions;
- trust hidden buttons as security;
- send an `isAdmin` flag as authority;
- decide tenant membership from local storage;
- filter an unrestricted server result as the primary privacy control.

---

## 26. Infrastructure Responsibilities

Infrastructure provides adapters for:

- authentication identity verification;
- membership and relationship lookup;
- permission storage where required;
- policy data retrieval;
- audit persistence;
- secure token and session handling.

Infrastructure does not define business permission semantics independently of the application and domain contracts.

---

## 27. Testing Strategy

Authorization tests must prove:

1. each protected command denies missing identity;
2. each protected command denies insufficient permission;
3. valid actors are allowed only within correct scope;
4. tenant identifiers cannot be used to cross boundaries;
5. guardians see only related learners;
6. teachers see only authorized classroom learners;
7. field-level redaction is correct;
8. revoked relationships deny access;
9. elevated access is explicit and audited;
10. query repositories receive authorization-derived scope;
11. client-supplied role fields do not grant authority;
12. denial behavior does not leak sensitive existence.

Tests should include policy unit tests, application-service tests, repository-scope integration tests, and end-to-end security cases.

---

## 28. Anti-Patterns

The following are prohibited:

- checking authorization only in frontend components;
- trusting role names from request bodies;
- global `isAdmin` bypasses;
- unrestricted queries followed by UI filtering;
- authorization based solely on resource ID secrecy;
- tenant scope inferred from mutable client storage;
- duplicated permission logic across controllers;
- silent allow when a policy is missing;
- mixing authentication middleware with all business authorization rules;
- logging sensitive learner data in denial records;
- system jobs with unlimited implicit access.

---

## 29. Completion Criteria

The authorization architecture is complete when:

- every protected use case names its required operation;
- trusted actor and scope context is explicit;
- policies deny by default;
- tenant and learner boundaries are enforced in application and repository access;
- command and query authorization are both covered;
- field-level visibility is modeled where required;
- elevated and system access are explicit;
- failure semantics are stable;
- audit records are privacy-safe;
- automated tests prove isolation and denial behavior.

---

## 30. Final Rule

> Authority is granted by an explicit policy over trusted identity, scope, relationship, and resource facts—never by client claims, UI state, or technical convenience.
