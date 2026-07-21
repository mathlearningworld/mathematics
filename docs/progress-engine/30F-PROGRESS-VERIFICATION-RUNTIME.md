# 30F — Progress Verification Runtime

## 1. Purpose

The Progress Verification Runtime determines whether progress timeline entries, aggregate versions, projection outputs, and persistence operations are structurally and semantically safe to publish.

Verification protects meaning. It does not create learning truth.

```text
Progress Inputs / Timeline / Aggregates / Projections
                       ↓
           Progress Verification Runtime
                       ↓
 Publish / Publish with Limitations / Hold / Quarantine / Reject
```

## 2. Authority Boundary

Verification may:

- validate identity, lineage, policy, version, ordering, and integrity;
- detect semantic escalation;
- detect stale or incomplete data;
- attach limitations;
- hold, quarantine, or reject unsafe records;
- permit publication of verified records.

Verification must not:

- infer mastery;
- create progress events;
- repair history silently;
- change mission or assessment state;
- transform uncertainty into confidence;
- strengthen a source claim.

```text
Verification ≠ Assessment.
Verification ≠ Progress Creation.
Verification never strengthens truth.
```

## 3. Verification Subjects

The runtime verifies:

- incoming progress source records;
- timeline append commands;
- correction and supersession records;
- aggregate versions;
- contribution sets;
- projection envelopes;
- persistence transactions;
- outbox publications;
- rebuild and replay outputs;
- access and redaction decisions.

## 4. Verification Pipeline

```text
1. Structural Integrity
2. Tenant and Learner Identity
3. Source Provenance
4. Correlation and Causation Lineage
5. Schema and Policy Compatibility
6. Timeline Ordering and Version Integrity
7. Idempotency and Duplicate Integrity
8. Semantic Boundary Validation
9. Aggregate Contribution Integrity
10. Confidence and Freshness Integrity
11. Projection Fidelity
12. Persistence and Outbox Atomicity
13. Privacy and Audience Isolation
14. Rebuild Determinism
15. Publication Decision
```

## 5. Structural Integrity

Validate:

- required fields;
- type and enum validity;
- identifiers;
- timestamps;
- hashes;
- version formats;
- supported record family;
- payload size and safety limits.

Malformed records fail before semantic processing.

## 6. Identity Verification

Every learner-scoped record must prove:

- tenant identity;
- learner identity;
- authorized source engine;
- actor or system authority;
- permitted relationship scope.

Critical identity failures are quarantined or rejected.

## 7. Provenance Verification

The verifier checks that source references point to real, authorized, versioned records.

Examples:

- assessment-derived progress references an assessment claim;
- mission-derived progress references a mission transition;
- gameplay-derived progress references authorized gameplay evidence or completion output;
- learning-derived progress references a learning session or activity result.

A fabricated or unverifiable source must not contribute to progress.

## 8. Semantic Boundary Verification

The verifier must reject or quarantine transformations such as:

```text
Activity → Mastery
Time Spent → Understanding
Gameplay Completion → Skill Mastery
Mission Completion → Curriculum Competence
Coverage → Retention
Group Success → Individual Progress
Assisted Success → Independent Success
Projection Label → Source Claim
```

Every derived statement must be no stronger than its inputs and governing policy.

## 9. Timeline Verification

Validate:

- monotonic authoritative sequence;
- explicit late-arrival handling;
- correction and supersession lineage;
- no in-place historical mutation;
- source occurrence time preserved separately from recorded time;
- expected-version consistency;
- no silent last-write-wins.

## 10. Duplicate and Idempotency Verification

Outcomes:

- exact duplicate → return prior accepted outcome;
- duplicate with different content → conflict;
- same source version with different hash → quarantine;
- repeated correction with identical identity → idempotent;
- reordered delivery → evaluate by lineage and sequence policy.

## 11. Aggregate Verification

For each aggregate version, verify:

- prior version linkage;
- contribution set existence;
- contribution hash;
- included timeline range;
- exclusions and reasons;
- weighting policy version;
- dimension compatibility;
- confidence calculation inputs;
- freshness calculation;
- conflict and limitation preservation;
- deterministic rebuild result.

An aggregate cannot be verified from its final number alone.

## 12. Projection Verification

Projection verification ensures:

- audience authorization;
- correct redaction policy;
- no semantic strengthening;
- freshness visible;
- limitations preserved;
- aggregate and timeline versions identified;
- stale output cannot overwrite newer output;
- actions are labeled as affordances, not authorization.

## 13. Persistence Verification

Validate:

- append-only ledger behavior;
- optimistic concurrency;
- state/outbox atomicity;
- durable idempotency;
- restore lineage;
- snapshot compatibility;
- tenant-safe queries and writes;
- no orphaned contribution records.

## 14. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

### PUBLISH

All required integrity and semantic checks pass.

### PUBLISH_WITH_LIMITATIONS

Safe to expose, but uncertainty, staleness, assistance, conflict, or incompleteness must remain visible.

### HOLD_FOR_REVIEW

Human or higher-authority review is required before publication.

### QUARANTINE

Record is preserved but isolated because identity, provenance, integrity, or semantic safety is suspect.

### REJECT

Record is invalid and cannot enter progress state.

## 15. Critical Violation Codes

Recommended critical codes include:

```text
CROSS_TENANT_SCOPE
CROSS_LEARNER_SCOPE
UNAUTHORIZED_SOURCE
FABRICATED_PROVENANCE
SOURCE_HASH_MISMATCH
HISTORICAL_MUTATION
INVALID_SUPERSESSION
LAST_WRITE_WINS_ATTEMPT
ACTIVITY_AS_PROGRESS
COMPLETION_AS_MASTERY
COVERAGE_AS_UNDERSTANDING
ASSISTED_AS_INDEPENDENT
GROUP_AS_INDIVIDUAL
PROJECTION_MEANING_ESCALATION
AGGREGATE_CONTRIBUTION_MISMATCH
CONFIDENCE_ESCALATION
FRESHNESS_ERASURE
OUTBOX_STATE_DIVERGENCE
STALE_OVERWRITE
REBUILD_DIVERGENCE
PRIVACY_SCOPE_VIOLATION
```

## 16. Verification Result Contract

```ts
interface ProgressVerificationResult {
  verificationId: string;
  subjectType: string;
  subjectId: string;
  subjectVersion: number;
  subjectHash: string;
  verifierVersion: string;
  policyVersion: string;
  decision: string;
  violations: ProgressVerificationViolation[];
  limitations: ProgressVerificationLimitation[];
  verifiedAt: string;
}
```

A verification result applies only to the exact subject version and hash it verified.

## 17. Determinism and Re-verification

For identical subject data, verifier version, and policy version, the result must be deterministic.

Re-verification is required when:

- subject version changes;
- source lineage changes;
- verification policy changes materially;
- a quarantine record is released;
- a correction or supersession changes effective history;
- a rebuild produces a new aggregate version.

## 18. Failure Mode

The verifier fails closed for critical checks.

Verifier outage must not be interpreted as verification success. Records may remain pending, held, or quarantined according to policy.

```text
Unable to verify ≠ Verified.
```

## 19. Minimum Automated Gate

Automated verification should cover at least:

1. tenant isolation;
2. learner isolation;
3. source authorization;
4. provenance hash validation;
5. timeline sequence conflicts;
6. late-arrival handling;
7. correction lineage;
8. supersession lineage;
9. exact duplicate idempotency;
10. conflicting duplicate quarantine;
11. no historical mutation;
12. no last-write-wins;
13. activity versus progress boundary;
14. completion versus mastery boundary;
15. coverage versus understanding boundary;
16. assisted versus independent boundary;
17. group versus individual boundary;
18. aggregate contribution hash;
19. confidence and freshness preservation;
20. projection semantic fidelity;
21. audience redaction isolation;
22. state/outbox atomicity;
23. stale overwrite prevention;
24. deterministic rebuild;
25. verifier fail-closed behavior.

## 20. Core Invariants

```text
Verification does not create progress.
Verification does not assess mastery.
Verification never strengthens source meaning.
Every result is bound to an exact subject version and hash.
Critical identity or provenance failure fails closed.
Unverified records are not silently published.
Limitations remain visible after verification.
Historical mutation is forbidden.
Aggregate verification requires contribution lineage.
Projection verification requires audience and semantic fidelity.
Verifier failure is not success.
```