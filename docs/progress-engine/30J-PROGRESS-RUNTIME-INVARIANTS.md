# 30J — Progress Runtime Invariants

## 1. Purpose

This document defines the non-negotiable runtime laws for Chapter 30. These invariants apply across timeline, aggregation, projection, persistence, verification, analytics, replay, and policy execution.

A runtime implementation is conformant only when these laws are enforced by contracts, persistence constraints, verification gates, and automated tests.

## 2. Authority Invariants

1. Progress Timeline Ledger is the durable historical authority.
2. Aggregates are derived state, not source of truth.
3. Projections are read models, not source of truth.
4. Analytics outputs are derived observations, not learner truth.
5. Snapshots and checkpoints are recovery optimizations only.
6. Progress Engine cannot create assessment mastery claims.
7. Progress Engine cannot change mission authority state.
8. Progress Engine cannot issue recommendations as Recommendation Engine authority.
9. Progress Engine cannot convert gameplay completion into learning completion.
10. Progress Engine cannot fabricate source provenance.

## 3. Semantic Invariants

```text
Activity ≠ Progress
Progress ≠ Mastery
Completion ≠ Mastery
Coverage ≠ Understanding
Time Spent ≠ Learning Gain
Velocity ≠ Quality
Accuracy ≠ Reasoning
Supported Success ≠ Independent Success
Recent Success ≠ Retention
Cohort Result ≠ Individual Truth
Prediction ≠ Confirmed Outcome
Projection ≠ Authorization
```

Any transformation that collapses these distinctions is invalid.

## 4. Identity and Isolation Invariants

1. Every record must carry tenant scope.
2. Learner-scoped records must carry learner identity.
3. Cohort records must carry an explicit cohort definition.
4. Cross-tenant joins are forbidden.
5. Cross-learner contribution is forbidden unless the output is explicitly cohort-scoped.
6. Cohort outputs must not be projected as individual results.
7. Source actor, subject, tenant, and correlation identities must be validated.
8. Missing identity is a hard failure.
9. Identity mismatch cannot be repaired by policy fallback.
10. Privacy scope must be preserved through replay and projection.

## 5. Timeline Invariants

1. Timeline records are append-only.
2. Correction appends a new record with lineage.
3. Supersession appends a new record with lineage.
4. Historical records are never overwritten.
5. Last-write-wins is forbidden.
6. Exact duplicates are idempotent.
7. Conflicting duplicates are quarantined.
8. Late arrival is not automatically invalid.
9. Received order is not semantic order.
10. Ledger sequence is stable and monotonic within its authority scope.
11. Every accepted record has source version and provenance.
12. Broken correction or supersession lineage blocks publication.

## 6. Time Invariants

The runtime must distinguish:

- source occurred time
- source recorded time
- received time
- effective time
- committed time
- ledger sequence

Rules:

1. No timestamp may silently substitute for another.
2. Analytics windows must declare their time basis.
3. Point-in-time replay must declare effective time or ledger boundary.
4. Future-dated effective events require explicit policy handling.
5. Clock skew must be recorded as a limitation, not hidden.

## 7. Aggregation Invariants

1. Every aggregate version is reproducible from timeline inputs.
2. Every contribution is traceable to source records.
3. Excluded contributions record a reason.
4. Weighting policy is versioned.
5. Aggregate dimensions remain independently inspectable.
6. A composite score cannot replace dimensional state.
7. Conflicting evidence must remain visible.
8. Freshness is dimension-aware.
9. Regression cannot be inferred from incomparable conditions.
10. Recovery cannot be declared without policy-defined evidence.
11. Completion must always be qualified by policy family.
12. Aggregate rebuild divergence blocks promotion.

## 8. Projection Invariants

1. Projection may simplify representation but never strengthen meaning.
2. Projection must expose freshness and limitations.
3. Projection is bound to aggregate and policy versions.
4. Missing projection does not mean no progress.
5. Stale projection cannot be presented as current.
6. Visible action is not authorized action.
7. Audience privacy rules are mandatory.
8. Teacher, parent, learner, and operations projections may differ only within authorized representation rules.
9. Projection withdrawal must be explicit.
10. Projection rebuild must not mutate timeline authority.

## 9. Persistence Invariants

1. Timeline append, idempotency, aggregate work request, and outbox write must be atomic where defined by the runtime contract.
2. State without outbox is forbidden.
3. Outbox without state is forbidden.
4. Optimistic concurrency is required for mutable derived state.
5. Durable records carry schema and contract versions.
6. Checksums or hashes protect replay-critical records.
7. Backup restore must be verifiable.
8. Quarantine records are durable and auditable.
9. Snapshot corruption cannot corrupt ledger authority.
10. Persistence retries must preserve idempotency.

## 10. Verification Invariants

1. Verification never strengthens truth.
2. Unable to verify is not verified.
3. Verification result is bound to exact subject version and hash.
4. Old verification results do not automatically apply to new versions.
5. Cross-tenant scope is a critical violation.
6. Fabricated provenance is a critical violation.
7. Historical mutation attempt is a critical violation.
8. Semantic escalation is a critical violation.
9. Outbox-state divergence is a critical violation.
10. Rebuild divergence is a critical violation.
11. Privacy violation blocks publication.
12. Critical violations cannot be downgraded by presentation policy.

## 11. Analytics Invariants

1. Correlation is not causation.
2. Trend is not diagnosis.
3. Risk candidate is not confirmed failure.
4. Absence of data is not absence of progress.
5. Confidence is explicit.
6. Analytical windows and comparison conditions are explicit.
7. Incomparable periods cannot produce an unrestricted trend claim.
8. Cohort minimum-size and suppression policies are mandatory.
9. Analytics cannot mutate progress state.
10. Every published observation is reproducible.
11. Low-confidence observations cannot drive punitive automation.
12. Unexplained analytical divergence blocks publication.

## 12. Replay Invariants

1. Historical replay is not reassessment.
2. Current-policy reinterpretation is labeled separately from historical reconstruction.
3. Replay input ranges are frozen.
4. Replay ordering is deterministic.
5. Missing historical dependencies are reported, not guessed.
6. Checkpoint use requires compatibility and integrity verification.
7. Identical replay inputs produce identical output hashes.
8. Replay cannot overwrite original ledger records.
9. Unexplained replay divergence blocks promotion.
10. Rebuilt state is published only after verification.
11. Concurrent writes outside the frozen range require a later pass.
12. Replay success requires durable verified state, not merely process completion.

## 13. Policy Invariants

1. Every interpretation uses an explicit policy version.
2. Approved policy content is immutable.
3. Policy changes create new versions.
4. Missing policy fails safely.
5. Ambiguous policy fails safely.
6. Policy cannot grant authority absent from source truth.
7. Policy cannot violate global semantic or privacy laws.
8. Tenant overrides may narrow behavior but cannot weaken global invariants.
9. Historical policy versions remain replayable.
10. Migration requires compatibility classification and shadow verification.
11. Policy resolution never depends on insertion order.
12. Revoked policy remains auditable.

## 14. Completion Invariants

Unqualified completion is forbidden.

Allowed examples:

```text
COMPLETE_BY_MISSION_POLICY
COMPLETE_BY_CURRICULUM_COVERAGE_POLICY
COMPLETE_BY_ASSESSMENT_MASTERY_POLICY
COMPLETE_BY_LEARNING_PATH_POLICY
```

Rules:

1. Each completion carries authority source.
2. Each completion carries policy version.
3. Completion in one family does not imply completion in another.
4. Gameplay completion does not imply mission completion.
5. Mission completion does not imply mastery.
6. Curriculum coverage completion does not imply understanding.

## 15. Failure and Recovery Invariants

1. Failure state is explicit and durable where operationally relevant.
2. Retry does not erase prior failure evidence.
3. Recovery uses recorded evidence rather than reproducing known failures unnecessarily.
4. Recovery publication requires version and commit verification.
5. Partial recovery is not complete recovery.
6. Quarantine is not rejection and not acceptance.
7. Held state cannot appear published.
8. Failed projection does not invalidate ledger truth.
9. Failed analytics does not invalidate aggregates.
10. Failed aggregate rebuild blocks promotion but preserves historical state.

## 16. Minimum Automated Runtime Gates

The implementation must include automated gates for:

### Identity

- tenant mismatch rejection
- learner mismatch rejection
- cohort-to-individual leakage rejection

### Timeline

- append-only enforcement
- exact duplicate idempotency
- conflicting duplicate quarantine
- correction lineage validation
- supersession lineage validation

### Semantics

- activity-as-progress rejection
- completion-as-mastery rejection
- coverage-as-understanding rejection
- assisted-as-independent rejection
- cohort-as-individual rejection

### Aggregation

- deterministic aggregate rebuild
- contribution traceability
- policy-version binding
- conflict visibility
- qualified completion

### Projection

- no meaning escalation
- freshness exposure
- audience privacy
- visible-action reauthorization

### Persistence

- atomic state and outbox
- optimistic concurrency
- retry idempotency
- snapshot non-authority

### Verification

- subject hash binding
- stale verification rejection
- critical violation publication block

### Analytics

- confidence required
- privacy threshold enforcement
- incomparable-window limitation
- deterministic reproduction

### Replay

- historical/current-policy mode distinction
- frozen input range
- output hash determinism
- divergence publication block

### Policy

- missing policy failure
- ambiguous policy failure
- immutable approved version
- migration shadow replay

## 17. Chapter 30 Closure Criteria

Chapter 30 is architecturally complete only when:

- 30A–30J are present and mutually consistent;
- progress authority and cross-engine boundaries are explicit;
- all derived state is reproducible from durable authority;
- semantic distinctions are enforced, not merely documented;
- policy, verification, analytics, and replay are version-bound;
- tenant isolation and privacy are preserved end to end;
- failure, quarantine, recovery, and publication states are explicit;
- automated gates cover the critical invariants above.

## 18. Final Runtime Law

> Progress Engine may organize, interpret, aggregate, project, verify, analyze, and replay authorized progress truth. It must never manufacture stronger learning truth than its sources provide.