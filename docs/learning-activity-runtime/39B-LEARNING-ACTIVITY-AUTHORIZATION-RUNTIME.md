# Chapter 39B — Learning Activity Authorization Runtime

## 1. Purpose

Learning Activity Authorization Runtime determines whether a concrete activity instance is allowed to become executable for a specific learner, tenant, source path, definition version, and policy context.

Authorization is an explicit runtime decision. It is not inferred from path recommendation, UI visibility, content availability, or a previously valid session.

```text
Path recommendation ≠ activity authorization
Activity authorization ≠ activity start
Activity visibility ≠ execution permission
```

---

## 2. Authority Boundary

Authorization Runtime owns:

- eligibility evaluation
- prerequisite validation
- source-path validation
- actor authority validation
- timing validation
- definition availability validation
- retry authorization
- replacement authorization
- revocation
- rejection
- authorization expiry
- authorization decision evidence

It does not own:

- mastery calculation
- learning-path ordering
- session execution
- evidence interpretation
- content-definition authoring

---

## 3. Authorization Aggregate State

Authorization is represented inside the `LearningActivity` aggregate as a versioned state machine.

```ts
type ActivityAuthorizationStatus =
  | 'NOT_REQUESTED'
  | 'PENDING'
  | 'AUTHORIZED'
  | 'REJECTED'
  | 'REVOKED'
  | 'EXPIRED';
```

```ts
interface ActivityAuthorizationDecision {
  status: ActivityAuthorizationStatus;
  policyVersion?: string;
  decisionId?: string;
  decidedBy?: string;
  decidedAt?: string;
  validFrom?: string;
  validUntil?: string;
  reasonCodes: string[];
  inputFingerprint?: string;
}
```

---

## 4. Authorization Lifecycle

```text
NOT_REQUESTED
      ↓
PENDING
   ┌──┴─────────────┐
   ↓                ↓
AUTHORIZED       REJECTED
   ↓
REVOKED
```

Time-bound authorization may also transition:

```text
AUTHORIZED → EXPIRED
```

A rejected, revoked, or expired decision cannot be silently reopened. A new authorization request must create a new decision ID and preserve the previous decision history.

---

## 5. Authorization Request

```ts
interface RequestActivityAuthorizationCommand {
  commandId: string;
  tenantId: string;
  actorId: string;
  learnerId: string;
  activityId: string;
  expectedActivityVersion: number;
  requestedAt: string;
  correlationId: string;
  causationId?: string;
  context: ActivityAuthorizationContext;
}
```

```ts
interface ActivityAuthorizationContext {
  pathId?: string;
  pathVersion?: number;
  pathStepId?: string;
  masterySnapshotVersion?: string;
  prerequisiteSnapshotVersion?: string;
  curriculumVersion?: string;
  activityDefinitionId: string;
  activityDefinitionVersion: string;
  requestedExecutionWindow?: {
    from?: string;
    until?: string;
  };
  requestedAttemptNumber: number;
}
```

The context must be fingerprinted so the decision can be audited and replayed without re-evaluating historical policy.

---

## 6. Eligibility Domains

Authorization evaluates several independent domains.

### 6.1 Identity eligibility

- tenant matches activity tenant
- learner matches activity learner
- actor has permission to request authorization
- source identity is valid

### 6.2 Path eligibility

- path exists
- path version matches activity lineage
- path step is active or explicitly preserved
- step has not been superseded unless policy permits continuation
- activity type is compatible with path intent

### 6.3 Prerequisite eligibility

- required skill prerequisites are satisfied or waiver exists
- required prior activity dependencies are complete
- required diagnostic state is available
- prerequisite evidence is fresh enough for policy

### 6.4 Definition eligibility

- activity definition exists
- exact definition version is available
- definition is not withdrawn for safety reasons
- runtime capabilities support the definition

### 6.5 Timing eligibility

- current time is within allowed window
- activity has not expired
- due-date policy is respected
- cooldown has elapsed

### 6.6 Attempt eligibility

- attempt count is within limit
- retry policy permits another attempt
- reauthorization requirements are satisfied
- prior activity terminal state is compatible with retry

### 6.7 Safety eligibility

- content is age/role appropriate
- accessibility constraints can be met
- learner restriction flags are respected
- operator safety holds are absent

---

## 7. Decision Outcomes

```ts
type AuthorizationDecisionOutcome =
  | 'ALLOW'
  | 'DENY'
  | 'DEFER'
  | 'REQUIRE_HUMAN_REVIEW';
```

### ALLOW

The activity may transition to `AUTHORIZED`.

### DENY

The activity transitions to `REJECTED` with stable reason codes.

### DEFER

The request remains `PENDING` because required input is unavailable or temporarily stale.

### REQUIRE_HUMAN_REVIEW

A designated actor must approve or reject the activity.

---

## 8. Reason Codes

Reason codes are stable machine contracts.

```text
AUTH_PATH_VERSION_MISMATCH
AUTH_PATH_STEP_INACTIVE
AUTH_PREREQUISITE_NOT_MET
AUTH_PREREQUISITE_EVIDENCE_STALE
AUTH_ACTIVITY_DEFINITION_UNAVAILABLE
AUTH_ACTIVITY_DEFINITION_WITHDRAWN
AUTH_ACTIVITY_EXPIRED
AUTH_OUTSIDE_EXECUTION_WINDOW
AUTH_RETRY_LIMIT_REACHED
AUTH_RETRY_COOLDOWN_ACTIVE
AUTH_REAUTHORIZATION_REQUIRED
AUTH_ACTOR_NOT_PERMITTED
AUTH_LEARNER_MISMATCH
AUTH_TENANT_MISMATCH
AUTH_SAFETY_HOLD
AUTH_ACCESSIBILITY_REQUIREMENT_UNAVAILABLE
AUTH_INPUT_INCOMPLETE
AUTH_HUMAN_REVIEW_REQUIRED
```

Localized messages must be derived from reason codes rather than embedded in domain state.

---

## 9. Policy Evaluation

Authorization policy must be versioned.

```ts
interface ActivityAuthorizationPolicy {
  policyId: string;
  policyVersion: string;
  effectiveFrom: string;
  supportedActivityTypes: string[];
  rules: AuthorizationRule[];
}
```

A historical decision must retain the exact policy version used.

Replaying an event stream must not run the current policy against old inputs.

---

## 10. Deterministic Decision Contract

Given the same:

- policy version
- normalized input
- authoritative snapshots
- evaluation timestamp

The decision result must be deterministic.

External dependencies must be represented as versioned or fingerprinted inputs.

```text
Decision = evaluate(policyVersion, normalizedInput, snapshotVersions, evaluationTime)
```

---

## 11. Human Authorization

Some activity forms may require teacher, parent, operator, or specialist review.

```ts
interface HumanAuthorizationReview {
  reviewId: string;
  reviewerId: string;
  reviewerRole: string;
  decision: 'APPROVE' | 'REJECT';
  reasonCode: string;
  note?: string;
  reviewedAt: string;
}
```

Human approval must not bypass tenant, identity, definition, or safety invariants.

A reviewer may only decide within their granted scope.

---

## 12. Authorization Validity Window

An authorization may be time-bound.

```ts
interface AuthorizationValidityWindow {
  validFrom: string;
  validUntil?: string;
}
```

Starting an activity before `validFrom` or after `validUntil` is forbidden.

An activity already in progress may continue after authorization expiry only when the policy explicitly allows continuation. The decision must be recorded at start time.

---

## 13. Revocation

Revocation removes future execution authority.

Revocation may be triggered by:

- source path supersession
- safety withdrawal
- content-definition withdrawal
- teacher/operator action
- learner reassignment
- tenant access change
- evidence of invalid authorization input

```ts
interface RevokeActivityAuthorizationCommand {
  commandId: string;
  tenantId: string;
  actorId: string;
  activityId: string;
  expectedActivityVersion: number;
  reasonCode: string;
  revokeActiveSession: boolean;
  revokedAt: string;
}
```

Revoking an activity with an active session must follow an explicit policy:

- allow active session to finish
- pause and require review
- abort immediately

The selected policy outcome must be auditable.

---

## 14. Retry Authorization

Retry is never assumed merely because a learner did not succeed.

Authorization must evaluate:

- prior attempt outcome
- retry limit
- cooldown
- activity definition suitability
- whether remediation should replace retry
- whether the same activity instance may be reused
- whether a new activity must be created

```text
Retry ≠ resume
Retry ≠ replay
Retry ≠ automatic remediation
```

---

## 15. Replacement Authorization

An activity may be replaced when:

- content becomes unavailable
- accessibility requirements cannot be met
- adaptation policy selects a better activity
- safety policy withdraws the original
- activity repeatedly fails for non-learning reasons

Replacement creates a new activity instance and records:

- replaced activity ID
- replacement reason
- source path step
- policy version
- authorization decision lineage

The original activity remains historically intact.

---

## 16. Commands

```text
RequestActivityAuthorization
EvaluateActivityAuthorization
AuthorizeLearningActivity
RejectLearningActivity
DeferActivityAuthorization
RequireActivityHumanReview
ApproveActivityAuthorization
RejectActivityAuthorizationReview
RevokeActivityAuthorization
ExpireActivityAuthorization
AuthorizeActivityRetry
AuthorizeActivityReplacement
```

Every command requires optimistic concurrency and idempotency.

---

## 17. Events

```text
ActivityAuthorizationRequested
ActivityAuthorizationEvaluationStarted
ActivityAuthorizationDeferred
ActivityHumanReviewRequired
ActivityHumanReviewApproved
ActivityHumanReviewRejected
LearningActivityAuthorized
LearningActivityRejected
ActivityAuthorizationRevoked
ActivityAuthorizationExpired
ActivityRetryAuthorized
ActivityReplacementAuthorized
```

Events must preserve:

- decision ID
- policy version
- input fingerprint
- reason codes
- actor
- timestamp
- prior activity version

---

## 18. Failure Codes

```text
AUTHORIZATION_ALREADY_PENDING
AUTHORIZATION_ALREADY_GRANTED
AUTHORIZATION_ACTIVITY_TERMINAL
AUTHORIZATION_INPUT_VERSION_CONFLICT
AUTHORIZATION_POLICY_NOT_FOUND
AUTHORIZATION_POLICY_UNSUPPORTED_ACTIVITY
AUTHORIZATION_REVIEWER_NOT_PERMITTED
AUTHORIZATION_REVIEW_ALREADY_DECIDED
AUTHORIZATION_REVOCATION_NOT_ALLOWED
AUTHORIZATION_INVALID_VALIDITY_WINDOW
AUTHORIZATION_NON_DETERMINISTIC_INPUT
```

---

## 19. Projection Requirements

Authorization projection must expose:

- current authorization status
- whether start is currently allowed
- validity window
- blocker reason codes
- human review requirement
- retry eligibility
- latest decision timestamp
- decision freshness

Learner-facing projections should use simple language and must not expose sensitive operator or safety details.

---

## 20. Audit Requirements

Every authorization decision must answer:

1. Which activity was evaluated?
2. For which learner and tenant?
3. Which path and step originated it?
4. Which policy version was used?
5. Which input versions were used?
6. Who requested and who decided?
7. What was the outcome?
8. Why was the outcome produced?
9. When did it become valid?
10. Was it later revoked, expired, or replaced?

---

## 21. Observability

Required metrics:

- authorization request count
- allow/deny/defer/review rates
- decision latency
- stale prerequisite frequency
- retry authorization rate
- replacement rate
- revocation rate
- authorization expiry rate
- human review queue age
- invalid actor attempt count

---

## 22. Security Rules

- only authorized actors may request, review, revoke, or override
- override authority must be narrower than normal administration authority
- sensitive reason codes must be role-redacted
- all authorization decisions are tenant-bound
- cross-tenant policy or snapshot use is forbidden
- human notes must not become executable policy inputs unless normalized and versioned

---

## 23. Authorization Invariants

1. An activity cannot become `READY` without valid authorization.
2. Authorization is bound to one activity instance and version lineage.
3. Authorization does not transfer to replacement activities.
4. Authorization decisions preserve the exact policy version used.
5. A revoked authorization cannot authorize a new session.
6. An expired authorization cannot authorize a new session.
7. Retry requires explicit retry policy approval.
8. Human approval cannot bypass identity or tenant checks.
9. Historical authorization is not re-decided during replay.
10. Authorization inputs must be versioned or fingerprinted.
11. Rejection and revocation require stable reason codes.
12. UI visibility never constitutes authorization.
13. Path recommendation never constitutes authorization.
14. Session creation must validate current authorization.
15. Replacement creates new activity identity and lineage.

---

## 24. Architectural Summary

```text
Learning Path proposes.
Authorization evaluates permission.
Learning Activity becomes executable only after explicit approval.
Learning Session consumes that bounded authority.
```

Authorization Runtime protects the boundary between what is pedagogically suggested and what is operationally allowed to run.
