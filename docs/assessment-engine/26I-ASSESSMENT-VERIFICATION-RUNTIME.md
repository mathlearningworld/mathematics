# 26I — Assessment Verification Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26I
- State: VERIFICATION RUNTIME DEFINED
- Depends on: 26A–26H

---

## 1. Purpose

The Assessment Verification Runtime determines whether an assessment result is structurally valid, evidentially justified, policy-compatible, reproducible, and safe to publish or consume.

It does not create stronger claims, repair missing evidence by assumption, or replace human review where the configured policy requires it.

Its central question is:

> Can this exact assessment result be trusted for this exact scope, purpose, evidence set, model version, and policy version?

---

## 2. Runtime Position

```text
Assessment Case
+ Frozen Evidence Set
+ Model Result
+ Readiness / Misconception Results
+ Projection Result
+ Persistence Record
        ↓
Assessment Verification Runtime
        ↓
Verification Report
+ Findings
+ Severity
+ Publication Decision
+ Required Remediation
```

Verification is downstream of assessment execution but upstream of authoritative publication, progression consumption, and high-impact decision use.

---

## 3. Verification Authority

The runtime owns:

- verification-plan resolution,
- structural checks,
- evidence-integrity checks,
- provenance checks,
- policy and model compatibility checks,
- claim-to-evidence traceability checks,
- confidence-bound checks,
- contradiction-preservation checks,
- projection-fidelity checks,
- persistence-integrity checks,
- deterministic replay checks,
- verification finding classification,
- publication eligibility decisions,
- verification report generation.

It does not own:

- raw world-event truth,
- evidence generation,
- learning-state mutation,
- assessment claim creation,
- recommendation ranking,
- mission progression,
- audience wording beyond verification reporting.

---

## 4. Verification Principles

### 4.1 Evidence before conclusion

A claim is valid only when its supporting evidence is eligible, in scope, versioned, and traceable.

### 4.2 Reproduction before trust

A persisted assessment result is not fully verified until replay can reproduce the relevant historical state or an explicit, explainable divergence is recorded.

### 4.3 Limitations are part of the result

A result that hides material limitations is invalid even when its headline classification appears correct.

### 4.4 Verification cannot upgrade authority

Verification may confirm, restrict, quarantine, or reject a result. It may never raise claim confidence, readiness, mastery, or misconception certainty.

### 4.5 Failure is explicit

Missing data, incompatible versions, untraceable claims, and replay divergence must produce explicit findings. They must not silently fall back to a passing status.

---

## 5. Verification Aggregate

```ts
export interface AssessmentVerificationRun {
  verificationRunId: string;
  assessmentCaseId: string;
  assessmentResultVersion: number;
  verificationPlanId: string;
  verificationPlanVersion: string;
  verifierVersion: string;
  startedAt: string;
  completedAt?: string;
  status: AssessmentVerificationStatus;
  findings: AssessmentVerificationFinding[];
  publicationDecision?: AssessmentPublicationDecision;
  replayResultRef?: string;
  inputFingerprint: string;
  outputFingerprint?: string;
}
```

Statuses:

```text
PENDING
RUNNING
PASSED
PASSED_WITH_LIMITATIONS
FAILED
BLOCKED
QUARANTINED
INCONCLUSIVE
```

---

## 6. Verification Plan

```ts
export interface AssessmentVerificationPlan {
  verificationPlanId: string;
  verificationPlanVersion: string;
  assessmentPurpose: AssessmentPurpose;
  requiredChecks: AssessmentVerificationCheckType[];
  severityPolicyVersion: string;
  publicationPolicyVersion: string;
  replayRequirement: ReplayRequirement;
  humanReviewRequirement: HumanReviewRequirement;
  status: 'ACTIVE' | 'DEPRECATED' | 'RETIRED';
}
```

A verification plan is resolved from:

- assessment purpose,
- claim type,
- learner age or policy group,
- decision impact,
- evidence sensitivity,
- destination consumer,
- jurisdiction or curriculum policy,
- whether the result can block progression.

High-impact uses require stricter checks than low-risk formative feedback.

---

## 7. Verification Check Families

```text
STRUCTURAL_INTEGRITY
IDENTITY_AND_SCOPE
EVIDENCE_ELIGIBILITY
EVIDENCE_PROVENANCE
EVIDENCE_VERSIONING
EVIDENCE_DIVERSITY
CLAIM_TRACEABILITY
CLAIM_CLASSIFICATION
CONFIDENCE_BOUND
CONTRADICTION_PRESERVATION
LIMITATION_COMPLETENESS
MODEL_COMPATIBILITY
POLICY_COMPATIBILITY
READINESS_REQUIREMENT_COVERAGE
MISCONCEPTION_HYPOTHESIS_DISCIPLINE
ADAPTIVE_SELECTION_INTEGRITY
PROJECTION_FIDELITY
PERMISSION_AND_REDACTION
PERSISTENCE_INTEGRITY
EVENT_SEQUENCE_INTEGRITY
SNAPSHOT_INTEGRITY
DETERMINISTIC_REPLAY
SUPERSESSION_CHAIN
AUDIT_COMPLETENESS
```

---

## 8. Structural Verification

Structural verification confirms that required objects exist and reference one another correctly.

Required checks include:

- assessment case identity is present,
- learner, tenant, and scope identities are consistent,
- evidence-set version exists,
- model and policy versions are recorded,
- claim identifiers are unique,
- aggregate versions are monotonic,
- timestamps are valid and ordered,
- supersession references resolve,
- projection source references resolve,
- persistence events match aggregate identity.

Example finding:

```ts
{
  code: 'CLAIM_SOURCE_EVIDENCE_SET_MISSING',
  severity: 'BLOCKING',
  path: 'claims[2].evidenceSetVersion',
  expected: 'existing frozen evidence set',
  actual: 'not found'
}
```

---

## 9. Evidence Verification

The runtime verifies that every material claim is supported by eligible evidence.

Checks include:

- evidence belongs to the assessed learner,
- evidence belongs to the declared concept and scope,
- provenance is verified,
- evidence was not rejected as invalid or out of scope,
- duplicate evidence was not double-counted,
- stale evidence is treated according to policy,
- support conditions are preserved,
- representation and context coverage are not overstated,
- contradictory evidence remains visible,
- evidence corrections are versioned rather than overwritten.

Evidence insufficiency must produce an insufficiency outcome, not a negative learner judgment.

---

## 10. Claim Traceability Verification

Every claim must have a complete trace:

```text
Claim
  → Dimension Results
  → Supporting Evidence Refs
  → Contradicting Evidence Refs
  → Frozen Evidence Set Version
  → Model Version
  → Policy Version
```

A claim fails traceability when:

- supporting references cannot be resolved,
- the evidence is outside the claim scope,
- the claim classification is unsupported by dimension results,
- a contradicting item was omitted,
- a material limitation was dropped,
- a later projection materially changes the claim meaning.

---

## 11. Confidence Verification

Confidence is verified as a bounded output, not a decorative score.

Required rules:

```text
Projection Confidence ≤ Source Claim Confidence
Readiness Confidence ≤ Required Dimension Confidence
Misconception Confidence ≤ Hypothesis Evidence Confidence
Composite Confidence ≤ Weakest Blocking Requirement Confidence
```

The verifier must reject:

- confidence created without evidence,
- confidence increased by projection formatting,
- confidence calculated by averaging away blocking gaps,
- confidence that ignores contradiction burden,
- confidence that exceeds policy maximum for limited evidence diversity.

---

## 12. Readiness Verification

Readiness verification confirms:

- the target goal and requirement graph are versioned,
- every blocking requirement was evaluated,
- missing blocking evidence did not become a pass,
- support-dependent readiness is labeled explicitly,
- exploration access was not confused with formal readiness,
- foundation gaps remain visible,
- readiness expiration and review conditions are recorded,
- progression consumers receive only verified readiness claims.

A learner may be allowed to explore while a formal readiness claim remains uncertain. Verification must preserve that distinction.

---

## 13. Misconception Verification

Misconception verification confirms:

- repeated pattern evidence exists where required,
- accidental slips were considered,
- competing hypotheses were retained,
- disconfirming evidence was recorded,
- context-bound and representation-bound patterns were not generalized,
- a misconception was not declared from one incorrect response,
- resolution requires positive corrective evidence,
- historical misconception claims are superseded rather than erased.

Forbidden verification outcome:

```text
Incorrect once
→ Systematic misconception confirmed
```

---

## 14. Adaptive Assessment Verification

Adaptive verification checks:

- the selected opportunity was eligible,
- selection inputs were versioned,
- the opportunity targeted a known uncertainty,
- burden and fatigue limits were respected,
- accessibility support was not misclassified as mathematical support,
- no protected attribute was used as an unauthorized selection signal,
- termination reason was explicit,
- repeated items did not create artificial confidence,
- the adaptive path can be reconstructed from recorded decisions.

---

## 15. Projection Verification

Projection verification confirms that audience-specific views preserve source meaning.

Checks include:

- role and permission are valid,
- sensitive evidence is redacted according to policy,
- no claim is strengthened,
- no limitation is materially hidden,
- no uncertainty is rewritten as certainty,
- no misconception hypothesis is presented as a diagnosis,
- parent and learner language remains actionable without becoming misleading,
- reviewer projection preserves full lineage.

---

## 16. Persistence Verification

Persistence verification confirms:

- events are append-only,
- expected versions were enforced,
- event sequence is contiguous,
- aggregate identity is stable,
- snapshots correspond to event positions,
- idempotent writes do not create duplicates,
- corrections create new versions,
- supersession chains are acyclic,
- audit metadata is complete,
- deletion or mutation of historical claims is detectable.

Last-write-wins is invalid for assessment authority.

---

## 17. Deterministic Replay Verification

Replay verification uses the recorded historical inputs:

```text
Frozen Evidence Set
+ Model Version
+ Policy Version
+ Reducer Version
+ Explanation Schema Version
+ Recorded Clock
+ Recorded Random Seed
        ↓
Replay
        ↓
Historical Result Comparison
```

Replay outcomes:

```text
REPRODUCED_EXACTLY
REPRODUCED_EQUIVALENTLY
DIVERGED_EXPLAINED
DIVERGED_UNEXPLAINED
REPLAY_BLOCKED
REPLAY_NOT_REQUIRED
```

Exact reproduction is required for state and classification where policy declares determinism mandatory. Explanation text may use semantic equivalence only when the explanation schema permits it.

---

## 18. Verification Findings

```ts
export interface AssessmentVerificationFinding {
  findingId: string;
  checkType: AssessmentVerificationCheckType;
  code: string;
  severity: AssessmentVerificationSeverity;
  scope: AssessmentScope;
  sourceRefs: string[];
  messageCode: string;
  remediationCode?: string;
  blocksPublication: boolean;
  requiresHumanReview: boolean;
}
```

Severity levels:

```text
INFO
WARNING
MATERIAL
BLOCKING
CRITICAL
```

Severity is policy-controlled and versioned.

---

## 19. Publication Decision

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
PUBLISH_TO_RESTRICTED_AUDIENCE
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

Publication is evaluated independently for each consumer class:

```text
LEARNER
PARENT
TEACHER
MENTOR
REVIEWER
PROGRESSION_RUNTIME
RECOMMENDATION_RUNTIME
RESEARCH_EXPORT
```

A result may be safe for teacher review while blocked from automated progression use.

---

## 20. Human Review Boundary

Human review is required when configured conditions occur, including:

- high-impact progression block,
- unresolved evidence contradiction,
- suspected data corruption,
- replay divergence,
- model-policy incompatibility,
- sensitive misconception interpretation,
- insufficient evidence with material consequences,
- repeated verifier failure,
- appeal or dispute.

Human review creates an auditable review event. It does not silently modify historical evidence or claims.

---

## 21. Verification Events

```text
ASSESSMENT_VERIFICATION_REQUESTED
ASSESSMENT_VERIFICATION_STARTED
ASSESSMENT_CHECK_COMPLETED
ASSESSMENT_FINDING_RECORDED
ASSESSMENT_VERIFICATION_PASSED
ASSESSMENT_VERIFICATION_FAILED
ASSESSMENT_RESULT_QUARANTINED
ASSESSMENT_PUBLICATION_AUTHORIZED
ASSESSMENT_PUBLICATION_RESTRICTED
ASSESSMENT_HUMAN_REVIEW_REQUIRED
ASSESSMENT_HUMAN_REVIEW_COMPLETED
ASSESSMENT_REPLAY_VERIFIED
ASSESSMENT_REPLAY_DIVERGENCE_DETECTED
```

All events include tenant, learner, assessment case, result version, verifier version, correlation identity, causation identity, and timestamp.

---

## 22. Verification Report

```ts
export interface AssessmentVerificationReport {
  verificationRunId: string;
  assessmentCaseId: string;
  resultVersion: number;
  verificationStatus: AssessmentVerificationStatus;
  publicationDecisions: Record<AssessmentConsumer, AssessmentPublicationDecision>;
  findings: AssessmentVerificationFinding[];
  replayOutcome?: AssessmentReplayVerificationOutcome;
  verifiedModelVersion: string;
  verifiedPolicyVersion: string;
  verifierVersion: string;
  inputFingerprint: string;
  outputFingerprint: string;
  completedAt: string;
}
```

The report is immutable. A later verification run creates a new report version.

---

## 23. Failure Handling

Failure codes include:

```text
VERIFICATION_PLAN_NOT_FOUND
ASSESSMENT_RESULT_NOT_FOUND
EVIDENCE_SET_NOT_FOUND
EVIDENCE_PROVENANCE_INVALID
CLAIM_TRACEABILITY_BROKEN
MODEL_POLICY_INCOMPATIBLE
CONFIDENCE_BOUND_VIOLATED
CONTRADICTION_HIDDEN
LIMITATION_MISSING
READINESS_REQUIREMENT_UNEVALUATED
MISCONCEPTION_OVERCLAIMED
ADAPTIVE_SELECTION_UNREPRODUCIBLE
PROJECTION_MEANING_CHANGED
PERSISTENCE_SEQUENCE_BROKEN
SNAPSHOT_HASH_MISMATCH
REPLAY_DIVERGED
AUDIT_METADATA_INCOMPLETE
HUMAN_REVIEW_REQUIRED
```

Failures are explicit runtime results and must not be collapsed into generic internal errors when the domain cause is known.

---

## 24. Observability

Operational metrics include:

- verification runs by purpose,
- pass and failure rates,
- findings by code and severity,
- replay divergence rate,
- quarantined result count,
- average verification latency,
- human-review escalation rate,
- confidence-bound violation rate,
- projection-fidelity failure rate,
- stale evidence detection rate.

Metrics must not expose learner-sensitive content.

---

## 25. Security and Privacy

Verification access follows least privilege.

The runtime must:

- avoid copying raw sensitive evidence into logs,
- use stable references and fingerprints,
- enforce tenant isolation,
- record reviewer identity,
- redact audience-ineligible evidence,
- protect replay artifacts,
- distinguish operational telemetry from learner records,
- preserve retention and deletion policy boundaries.

---

## 26. Acceptance Conditions

26I is complete when the architecture guarantees that:

1. every publishable assessment result has a versioned verification report,
2. every material claim is traceable to eligible evidence,
3. confidence and limitations remain bounded by source authority,
4. readiness, misconception, adaptive, projection, and persistence semantics are checked explicitly,
5. deterministic replay is verified where required,
6. failures and divergences are visible and auditable,
7. verification cannot strengthen assessment claims,
8. high-impact ambiguous results can be held for human review,
9. consumer-specific publication decisions are explicit,
10. historical verification reports remain immutable.

---

## 27. Outcome

The Assessment Verification Runtime turns assessment from a plausible interpretation into a governed, reproducible, and publishable decision artifact.

It establishes the final verification gate before Assessment Engine outputs influence learners, families, teachers, recommendations, missions, or progression.