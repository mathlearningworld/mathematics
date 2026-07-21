# 30I — Progress Policy Runtime

## 1. Purpose

The Progress Policy Runtime owns the versioned rules used to interpret authorized progress inputs, build aggregates, expose projections, derive analytics, and control replay publication.

Policy provides interpretation rules. It does not create evidence, assessment claims, mastery, mission state, or learner identity.

## 2. Policy Boundary

```text
Authorized Source Truth
        +
Versioned Progress Policy
        ↓
Progress Runtime Decision
```

Policy may define:

- accepted source types
- dimension mappings
- contribution weights
- freshness windows
- confidence thresholds
- comparability requirements
- regression and recovery criteria
- completion semantics
- projection visibility
- analytics publication thresholds
- replay compatibility
- retention and privacy controls

Policy may not convert a weaker source meaning into a stronger claim.

## 3. Core Laws

1. Policy must be explicit and versioned.
2. Policy changes never silently rewrite history.
3. Historical interpretation and current interpretation remain distinguishable.
4. Policy cannot grant authority that the source engine does not possess.
5. Policy cannot convert activity into mastery.
6. Policy cannot convert coverage into understanding.
7. Policy cannot convert assisted success into independent success.
8. Policy cannot convert cohort truth into individual truth.
9. Missing policy is a hard failure, not permission to use defaults.
10. Every decision must identify the exact policy version used.

## 4. Policy Families

### 4.1 Source Admission Policy

Defines which upstream records may enter the Progress Timeline.

Required controls:

- source engine
- source contract version
- verification status
- tenant and learner identity rules
- allowed semantic claims
- idempotency key strategy
- late-arrival behavior

### 4.2 Dimension Mapping Policy

Maps authorized source meaning into one or more progress dimensions.

Example:

```text
verified practice evidence
→ practice volume contribution
→ accuracy contribution if scored
→ independence contribution only when assistance metadata permits
```

### 4.3 Aggregation Policy

Defines:

- contribution eligibility
- weights
- decay behavior
- evidence diversity requirements
- conflict handling
- minimum sample thresholds
- partial aggregation rules
- composite score restrictions

### 4.4 Freshness Policy

Defines transition rules among:

```text
CURRENT
AGING
STALE
SUPERSEDED
WITHDRAWN
UNAVAILABLE
REBUILDING
FAILED
```

Freshness must be dimension- and subject-aware. A single stale dimension does not automatically invalidate unrelated dimensions.

### 4.5 Confidence Policy

Defines how verification, evidence volume, diversity, recency, consistency, conflict, and comparability contribute to confidence.

### 4.6 Completion Policy

Completion must always be qualified:

```text
COMPLETE_BY_MISSION_POLICY
COMPLETE_BY_CURRICULUM_COVERAGE_POLICY
COMPLETE_BY_ASSESSMENT_MASTERY_POLICY
COMPLETE_BY_LEARNING_PATH_POLICY
```

An unqualified `COMPLETE` state is forbidden.

### 4.7 Regression and Recovery Policy

Defines comparable windows, minimum decline, persistence requirement, support-context compatibility, and recovery thresholds.

### 4.8 Projection Policy

Defines audience, field visibility, simplification rules, action visibility, privacy masking, and limitation disclosure.

Visible action is not authorization. Consumers must re-authorize commands at the owning runtime.

### 4.9 Analytics Policy

Defines observation windows, minimum data, cohort privacy thresholds, risk candidate thresholds, and publication decisions.

### 4.10 Replay Policy

Defines historical compatibility, migration behavior, checkpoint eligibility, deterministic runtime version, divergence tolerance, and publication mode.

## 5. Policy Identity

Every policy version requires:

```text
policyId
policyFamily
policyVersion
status
effectiveFrom
effectiveTo
supersedesPolicyVersion
schemaVersion
curriculumCompatibility
runtimeCompatibility
createdBy
approvedBy
createdAt
approvedAt
contentHash
```

## 6. Policy Lifecycle

```text
DRAFT
UNDER_REVIEW
APPROVED
ACTIVE
DEPRECATED
RETIRED
REVOKED
```

Rules:

- DRAFT and UNDER_REVIEW cannot affect production state.
- APPROVED is not ACTIVE until activation conditions are met.
- RETIRED policies remain available for historical replay.
- REVOKED policies remain auditable and require incident handling.
- policy content is immutable after approval; changes create a new version.

## 7. Policy Resolution

Resolution inputs:

- tenant
- learner or cohort scope
- subject type
- source engine and contract version
- curriculum and country standard version
- effective time
- runtime version
- requested interpretation mode

Resolution output:

```text
RESOLVED
NO_POLICY
AMBIGUOUS_POLICY
INCOMPATIBLE_POLICY
REVOKED_POLICY
```

Ambiguous matches are failures. Precedence must be explicit, never inferred from record insertion order.

## 8. Policy Precedence

Recommended precedence:

1. legally required override
2. tenant-approved explicit override
3. curriculum-specific policy
4. product-default policy

An override may narrow behavior but may not violate global semantic, privacy, tenant-isolation, or provenance invariants.

## 9. Policy Migration

Policy migration requires:

- source and target policy versions
- affected subject scope
- compatibility classification
- shadow replay
- divergence report
- approval decision
- rollback plan
- publication mode

Compatibility classes:

```text
BACKWARD_COMPATIBLE
REBUILD_REQUIRED
REINTERPRETATION_ONLY
MANUAL_REVIEW_REQUIRED
INCOMPATIBLE
```

Historical records are never mutated during migration.

## 10. Default Behavior

No semantic default is allowed when a required policy is missing.

Safe operational defaults may only:

- hold publication
- mark state unavailable
- quarantine input
- request review

They may not infer progress, mastery, confidence, or completion.

## 11. Policy Evaluation Result

Required fields:

```text
evaluationId
policyId
policyVersion
subjectIdentity
inputVersions
decision
contributions
excludedInputs
limitations
confidenceImpact
freshnessImpact
explanationGraph
evaluatedAt
runtimeVersion
outputHash
```

## 12. Failure Codes

```text
PROGRESS_POLICY_NOT_FOUND
PROGRESS_POLICY_AMBIGUOUS
PROGRESS_POLICY_INACTIVE
PROGRESS_POLICY_REVOKED
PROGRESS_POLICY_INCOMPATIBLE
PROGRESS_POLICY_SCHEMA_INVALID
PROGRESS_POLICY_HASH_MISMATCH
PROGRESS_POLICY_SCOPE_VIOLATION
PROGRESS_POLICY_MEANING_ESCALATION
PROGRESS_POLICY_HISTORICAL_MUTATION_ATTEMPT
PROGRESS_POLICY_OVERRIDE_FORBIDDEN
PROGRESS_POLICY_MIGRATION_UNVERIFIED
PROGRESS_POLICY_EVALUATION_DIVERGENCE
```

## 13. Verification Gates

1. policy identity and immutable hash
2. lifecycle authorization
3. tenant and subject scope
4. source contract compatibility
5. curriculum compatibility
6. runtime compatibility
7. precedence uniqueness
8. semantic non-escalation
9. privacy and fairness constraints
10. deterministic evaluation
11. migration evidence
12. historical replay availability

## 14. Acceptance Criteria

30I is complete when:

- every progress interpretation is bound to an explicit policy version;
- policy families cover admission, dimensions, aggregation, freshness, confidence, completion, regression, projection, analytics, and replay;
- approved policy versions are immutable;
- missing or ambiguous policy fails safely;
- overrides cannot violate global runtime laws;
- migrations require shadow replay and verified divergence;
- historical policy versions remain available for audit and replay;
- no policy can strengthen source meaning or silently rewrite learner history.