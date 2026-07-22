# Chapter 34I — Intervention Evolution Runtime

## 1. Purpose

Intervention Evolution Runtime defines how strategies, plans, execution channels, adaptation rules, effectiveness evaluators, projections, schemas, and policies change without corrupting historical truth or exposing learners to uncontrolled behavioral drift.

Evolution must improve future behavior while preserving the ability to explain past behavior.

## 2. Governing Doctrine

```text
Evolution is versioned change, not silent replacement.
Migration is not re-diagnosis.
Projection upgrade is not authority upgrade.
New strategy quality does not rewrite old execution truth.
Every activation requires rollback.
Historical replay requires historical compatibility.
```

## 3. Evolution Domains

The runtime manages evolution across:

1. Strategy Definitions
2. Plan Schema
3. Dosage Rules
4. Adaptation Envelopes
5. Execution Channels
6. Evidence Contracts
7. Effectiveness Models
8. Projection Schemas
9. Persistence Schemas
10. Policy and Safety Rules

## 4. Version Registry

Every evolvable artifact must be registered.

```ts
interface InterventionRuntimeVersion {
  componentType: string;
  componentId: string;
  version: string;
  status: 'DRAFT' | 'SHADOW' | 'LIMITED' | 'ACTIVE' | 'DEPRECATED' | 'RETIRED' | 'BLOCKED';
  compatibleFrom?: string[];
  compatibleTo?: string[];
  activatedAt?: string;
  retiredAt?: string;
  rollbackVersion?: string;
  releaseEvidenceIds: string[];
}
```

Unregistered versions must not become authoritative.

## 5. Strategy Evolution

A strategy version changes when any material behavior changes, including:

- pedagogical mechanism
- target population
- eligibility constraints
- dosage recommendation
- content sequencing
- adaptation behavior
- safety constraints
- evidence expectations

Strategy evolution must preserve:

- prior version identity
- prior rationale
- prior eligibility rules
- prior safety profile
- prior outcome evidence
- compatibility boundaries

A new strategy version does not migrate an active intervention automatically.

## 6. Plan Evolution

Plan schemas may evolve through additive or breaking changes.

### Additive Changes

Examples:

- optional metadata
- new non-authoritative display labels
- optional audit fields

### Breaking Changes

Examples:

- changed target semantics
- changed dosage interpretation
- changed phase ordering rules
- changed evidence requirement
- changed safety behavior

Breaking changes require explicit migration or continued support for the old schema.

## 7. Active Case Policy

When a new runtime version activates, active cases follow one of:

```text
PIN_EXISTING
MIGRATE_COMPATIBLE
REPLAN_REQUIRED
HUMAN_REVIEW_REQUIRED
STOP_AND_REPLACE
```

The chosen policy must be explicit per release.

## 8. Migration Contract

```ts
interface InterventionMigrationPlan {
  migrationId: string;
  componentType: string;
  fromVersion: string;
  toVersion: string;
  strategy: 'IN_PLACE' | 'COPY_FORWARD' | 'REBUILD' | 'REPLAN' | 'NO_MIGRATION';
  preconditions: string[];
  transformations: string[];
  invariants: string[];
  rollbackProcedure: string[];
  verificationSuiteId: string;
}
```

Migration must not invent facts or alter historical timestamps.

## 9. Event Evolution

Event evolution uses versioned event types and upcasters.

Rules:

- original event payload remains preserved
- upcaster output is deterministic
- upcaster version is recorded
- semantic uncertainty remains uncertainty
- actor identity and authorization remain unchanged
- new required facts cannot be fabricated

If an old event cannot be safely interpreted, replay becomes `BLOCKED`.

## 10. Snapshot and Projection Evolution

Snapshots may be invalidated and rebuilt.

Projection changes may use:

- in-place rebuild
- parallel generation
- dual-read validation
- generation switch

The runtime must publish projection generations atomically.

A projection schema change never alters underlying event authority.

## 11. Effectiveness Model Evolution

Changing an effectiveness model may change current interpretation.

The runtime must distinguish:

```text
Historical conclusion under historical model
Comparative conclusion under new model
Current authoritative conclusion
```

A comparative re-evaluation must not silently replace the historical record.

## 12. Re-evaluation and Re-diagnosis Boundary

Intervention evolution may trigger:

- projection rebuild
- effectiveness re-evaluation
- plan compatibility review
- diagnostic review request

It must not silently perform a new diagnosis.

Re-diagnosis remains owned by Diagnostic Runtime.

## 13. Comparative Evaluation

Before activation, candidate versions should be compared against the current version.

Evaluation dimensions:

- learner outcome
- retention
- transfer
- execution fidelity
- adaptation frequency
- learner burden
- accessibility
- safety signals
- human review demand
- operational reliability
- fairness across learner groups

## 14. Shadow Evaluation

Shadow mode computes candidate decisions without affecting live execution.

Shadow outputs must be labeled non-authoritative.

Shadow evaluation may compare:

- selected strategy
- dosage
- adaptation decision
- stop condition
- effectiveness conclusion
- projection wording

No learner-facing side effect may occur from shadow output.

## 15. Limited Activation

Limited activation constrains exposure by:

- tenant
- learner cohort
- age range
- curriculum
- skill domain
- strategy family
- execution channel
- geographic policy region
- maximum case count
- time window

Exposure selection must be auditable and policy-compliant.

## 16. Gradual Rollout

Recommended progression:

```text
DRAFT
-> OFFLINE_VERIFIED
-> SHADOW
-> LIMITED
-> EXPANDED
-> ACTIVE
```

Promotion requires evidence from the prior stage.

## 17. Rollback

Every active version must define rollback.

Rollback planning includes:

- target prior version
- active-case handling
- event compatibility
- snapshot invalidation
- projection rebuild
- outbox handling
- learner communication impact
- human review impact
- safety containment

Rollback must preserve events already emitted by the new version.

## 18. Kill Switch

Safety-critical components require a kill switch.

The kill switch may:

- stop new plan authorization
- pause automatic adaptation
- stop selected strategy families
- disable one execution channel
- force human review
- freeze effectiveness publication

It must not delete history.

## 19. Policy Evolution

Policy changes require temporal boundaries.

```ts
interface PolicyActivation {
  policyId: string;
  version: string;
  effectiveFrom: string;
  applicableRegions: string[];
  activeCasePolicy: string;
}
```

Historical actions remain judged under the policy active at the time, while current continuation may require the new policy.

## 20. Skill Graph and Curriculum Evolution

Intervention targets depend on versioned curriculum and skill graph identities.

When these evolve, the runtime must assess:

- target identity continuity
- prerequisite changes
- curriculum remapping
- plan compatibility
- evidence comparability
- projection wording

A remapped skill must not be assumed equivalent without an explicit mapping contract.

## 21. Channel Evolution

Execution adapter changes require compatibility verification for:

- activity identity
- dispatch acknowledgement
- delivery evidence
- retry semantics
- interruption semantics
- accessibility support
- telemetry schema
- idempotency behavior

A channel update that changes evidence meaning requires a new channel version.

## 22. Data Migration Safety

Data migration requires:

- backup or recoverable source
- dry run
- record counts
- hash or reconciliation checks
- quarantine path
- rollback procedure
- post-migration replay
- projection verification

Partial migration must never be reported as complete.

## 23. Fairness and Cohort Analysis

Evolution evaluation must test whether outcome or burden changes differ materially across relevant cohorts.

Cohort dimensions may include:

- age band
- accessibility need
- language context
- baseline mastery
- device or connectivity constraints
- teacher-supported vs independent use

Cohort findings must not create stigmatizing learner labels.

## 24. Release Evidence Package

Every release requires an evidence package containing:

- change summary
- affected contracts
- compatibility matrix
- migration plan
- test results
- shadow or limited rollout results
- safety review
- fairness review
- rollback plan
- release owner
- approval record

## 25. Evolution Verification Gates

### Repository Gate

- version contracts
- migrations
- compatibility declarations
- verifier wiring
- rollback documentation

### Runtime Gate

- executable migrations
- replay compatibility
- adapter compatibility
- projection rebuild
- automated verification

### Operational Gate

- controlled live behavior
- evidence capture
- safety monitoring
- rollback readiness
- human workflow validation

## 26. Evolution Failure States

```text
VERSION_UNREGISTERED
COMPATIBILITY_UNKNOWN
MIGRATION_PRECONDITION_FAILED
MIGRATION_RECONCILIATION_FAILED
REPLAY_COMPATIBILITY_FAILED
SHADOW_DIVERGENCE_UNEXPLAINED
LIMITED_ROLLOUT_SAFETY_BLOCK
FAIRNESS_REGRESSION_DETECTED
ROLLBACK_NOT_READY
ACTIVE_CASE_POLICY_MISSING
```

## 27. Deprecation and Retirement

A version may be deprecated while still replayable.

Retirement requires:

- no new authoritative use
- active-case policy completed
- replay support retained or archival strategy approved
- dependent projections migrated
- audit documentation complete

Retirement must not make historical cases inexplicable.

## 28. Evolution Audit Queries

The system must answer:

```text
Which version authorized this plan?
Why was the new strategy activated?
What evidence supported rollout?
Which learners were exposed?
What changed for active cases?
Was rollback available?
Can old cases still be replayed?
Did effectiveness conclusions change under a new model?
```

## 29. Test Matrix

Required tests include:

- additive schema compatibility
- breaking schema block
- event upcast determinism
- snapshot invalidation
- dual projection generation
- active-case pinning
- compatible migration
- re-plan-required migration
- shadow no-side-effect guarantee
- limited rollout targeting
- kill switch
- rollback
- fairness regression block
- old-case replay after retirement

## 30. Final Invariants

```text
I-EVOLVE-01  Every authoritative behavior is versioned.
I-EVOLVE-02  Historical events are never rewritten by evolution.
I-EVOLVE-03  Active cases follow an explicit version policy.
I-EVOLVE-04  Migration never fabricates unavailable facts.
I-EVOLVE-05  Shadow output never creates learner-facing side effects.
I-EVOLVE-06  Activation requires evidence and rollback readiness.
I-EVOLVE-07  Comparative evaluation never silently replaces history.
I-EVOLVE-08  Policy evolution preserves temporal truth.
I-EVOLVE-09  Retirement preserves historical explainability.
I-EVOLVE-10  Safety and fairness regressions block rollout.
```

## 31. Completion Criterion

34I is complete when intervention behavior can evolve through explicit versions, controlled activation, compatibility checks, migration, replay, evaluation, and rollback while preserving historical truth and learner safety.