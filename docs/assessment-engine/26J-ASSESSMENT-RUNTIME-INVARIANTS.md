# 26J — Assessment Runtime Invariants

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26J
- State: RUNTIME INVARIANTS DEFINED
- Depends on: 26A–26I

---

## 1. Purpose

Assessment Runtime Invariants define the conditions that must remain true across evidence intake, modeling, readiness evaluation, misconception analysis, adaptive assessment, projection, persistence, replay, and verification.

These invariants are not implementation suggestions. They are non-negotiable system truths that protect learners from unsupported conclusions and protect the platform from hidden authority drift.

---

## 2. Runtime Position

```text
World / Discovery / Learning Evidence
        ↓
Assessment Evidence Runtime
        ↓
Assessment Model Runtime
        ↓
Readiness / Misconception / Adaptive Runtime
        ↓
Projection / Persistence / Replay
        ↓
Verification Runtime
        ↓
Assessment Runtime Invariants
```

The invariant layer constrains every stage. No module may bypass it by writing directly to a later-stage projection or consumer.

---

## 3. Invariant Categories

```text
IDENTITY
TENANCY
SCOPE
EVIDENCE
CLAIM
CONFIDENCE
READINESS
MISCONCEPTION
ADAPTIVE_ASSESSMENT
PROJECTION
PERSISTENCE
REPLAY
VERIFICATION
SECURITY_AND_PRIVACY
HUMAN_REVIEW
TEMPORAL_INTEGRITY
```

---

## 4. Identity Invariants

1. Every assessment case has one stable `assessmentCaseId`.
2. Every persisted event references exactly one assessment case.
3. Learner identity cannot change within an assessment case.
4. Tenant identity cannot change within an assessment case.
5. Aggregate identity and event-stream identity must match.
6. Correlation and causation identifiers must be preserved across runtime boundaries.
7. A projection must reference the exact source claim set it represents.
8. A verification report must reference the exact result version it verifies.

Forbidden state:

```text
Assessment Case A
→ evidence from Learner B
→ claim published for Learner A
```

---

## 5. Tenancy Invariants

1. Evidence from one tenant must never contribute to another tenant's assessment claim.
2. Tenant-safe repository filters are mandatory for every read and write.
3. Replay must run within the original tenant boundary.
4. Projection permissions are evaluated within tenant context.
5. Cross-tenant analytics may use only policy-approved de-identified exports.
6. Tenant identity is part of every durable assessment event.
7. A missing tenant filter is a critical integrity failure, not a recoverable warning.

---

## 6. Scope Invariants

1. Every claim has an explicit learner, concept, purpose, and time scope.
2. Evidence outside the declared scope cannot silently support the claim.
3. A narrow claim cannot be projected as a broad learner label.
4. Context-bound evidence cannot justify context-general conclusions without transfer evidence.
5. Representation-bound evidence cannot justify representation-general conclusions without representation coverage.
6. Mission-specific readiness cannot be reinterpreted as universal readiness.
7. Scope expansion requires a new assessment evaluation.

```text
Evidence for fractions in one visual representation
≠
Proof of robust fraction understanding across representations
```

---

## 7. Evidence Invariants

1. Every material claim has at least one eligible supporting evidence reference.
2. Every evidence item has provenance, timestamp, source type, and version.
3. Duplicate evidence cannot be counted more than once.
4. Invalid evidence cannot contribute to confidence.
5. Out-of-scope evidence cannot contribute to classification.
6. Stale evidence is handled by explicit policy.
7. Contradictory evidence remains preserved.
8. Support conditions remain attached to evidence.
9. Accessibility support is not automatically classified as mathematical dependence.
10. Evidence correction creates a new version; it never overwrites history.
11. Absence of evidence is not evidence of weakness.
12. Evidence sufficiency is evaluated separately from learner performance.
13. Evidence-set freezing is required before model evaluation.
14. A frozen evidence set is immutable.
15. Evidence lineage must resolve to durable source records where policy requires it.

---

## 8. Claim Invariants

1. Claims are derived from evidence, model, and policy versions.
2. Claims cannot be created by UI mutation or direct score-setting APIs.
3. Every claim records supporting and contradicting evidence references.
4. Every claim records limitations.
5. Every claim records model and policy versions.
6. Every claim has an explicit confidence classification or bounded confidence value.
7. Claims are immutable after publication.
8. A changed conclusion creates a new claim version.
9. Superseded claims remain in history.
10. Supersession chains must be acyclic.
11. A claim cannot supersede itself.
12. A later claim cannot erase the existence of an earlier claim.
13. Claim type and assessment purpose must be compatible.
14. A claim cannot be stronger than its dimension results justify.
15. A claim with insufficient evidence cannot be represented as a negative learner judgment.

Forbidden APIs:

```text
ForcePass
SetAssessmentScore
ForceReadiness
ForceMastery
ConfirmMisconceptionWithoutEvidence
```

---

## 9. Confidence Invariants

1. Confidence is bounded by evidence quality and diversity.
2. Projection confidence cannot exceed source claim confidence.
3. Composite confidence cannot exceed the weakest blocking requirement where blocking semantics apply.
4. Contradiction burden cannot increase confidence.
5. Missing evidence cannot increase confidence.
6. Duplicate evidence cannot increase confidence.
7. Repetition of the same item cannot simulate evidence diversity.
8. Confidence cannot be upgraded by wording, UI emphasis, or audience simplification.
9. Policy-defined maximum confidence applies when representation or context coverage is limited.
10. Confidence calculations are versioned and reproducible.

---

## 10. Readiness Invariants

1. Readiness is always readiness for a named target.
2. Every target uses a versioned requirement graph.
3. Blocking requirements cannot be averaged away.
4. Missing blocking evidence cannot produce `READY`.
5. Support-dependent readiness is labeled explicitly.
6. Exploration permission and formal readiness are separate authorities.
7. Readiness may expire or require reevaluation.
8. Foundation gaps remain visible even when overall progress is strong.
9. Readiness is not a permanent learner trait.
10. Readiness claims cannot directly mutate learning state.
11. Progression runtimes may consume only verified readiness claims.
12. A readiness result must preserve risk and limitation details.

---

## 11. Misconception Invariants

1. One incorrect response cannot confirm a systematic misconception.
2. Competing hypotheses must be retained until sufficiently disconfirmed.
3. Accidental slips, language errors, interface errors, and retrieval failures must be considered.
4. Disconfirming evidence must remain visible.
5. Context-bound patterns cannot be generalized without cross-context evidence.
6. Representation-bound patterns cannot be generalized without cross-representation evidence.
7. Misconception claims are hypotheses, not diagnoses.
8. Resolution requires positive corrective evidence.
9. A resolved misconception remains historically visible.
10. Misconception confidence cannot exceed hypothesis evidence confidence.
11. Misconception projections must not shame or label the learner.
12. Sensitive interpretations may require human review.

---

## 12. Adaptive Assessment Invariants

1. Every selected opportunity targets a declared uncertainty or evidence gap.
2. Opportunity selection uses versioned policy and model inputs.
3. The adaptive path must be reconstructable.
4. Burden, fatigue, and frustration limits are enforced.
5. The runtime may stop when additional evidence would not change the decision.
6. No eligible opportunity means the runtime stops explicitly; it does not invent evidence.
7. Accessibility support and mathematical support are classified separately.
8. Protected attributes cannot be unauthorized selection signals.
9. Adaptive selection cannot manipulate difficulty solely to force a desired classification.
10. Termination reason is always recorded.
11. Repeated identical evidence opportunities cannot create false certainty.
12. Learner-requested stop is respected and recorded.
13. Adaptive assessment cannot directly unlock progression.

---

## 13. Projection Invariants

1. Projection never creates assessment truth.
2. Projection never upgrades a claim.
3. Projection never hides material limitations.
4. Projection never converts uncertainty into certainty.
5. Projection never converts a misconception hypothesis into a diagnosis.
6. Projection confidence is bounded by source confidence.
7. Audience-specific wording preserves source meaning.
8. Redaction follows explicit permission policy.
9. Restricted evidence is not leaked through explanation text.
10. Learner, parent, teacher, mentor, and reviewer projections have distinct contracts.
11. A projection records its source claim version.
12. Regenerating a projection does not mutate its source claim.
13. Reviewer projections preserve full lineage.
14. A denied audience receives no partial sensitive content.

---

## 14. Persistence Invariants

1. Assessment history is append-only.
2. Historical events cannot be silently edited.
3. Expected-version checks are mandatory for writes.
4. Last-write-wins is forbidden for assessment authority.
5. Event sequence numbers are contiguous per aggregate.
6. Idempotent retries do not create duplicate events.
7. Snapshots reference exact event positions.
8. Snapshot hashes must match serialized state.
9. Corrections create correction events and new versions.
10. Deletion policy cannot corrupt event-sequence integrity.
11. Audit metadata is required for authoritative writes.
12. Aggregate version increases monotonically.
13. Persistence failure cannot be reported as assessment success.
14. A write is authoritative only after durable commit confirmation.

---

## 15. Replay Invariants

1. Replay uses the original frozen evidence-set version.
2. Replay uses the recorded model version.
3. Replay uses the recorded policy version.
4. Replay uses the recorded reducer version.
5. Replay uses the recorded clock and random seed when relevant.
6. Replay cannot silently substitute the latest model or policy.
7. Replay divergence is recorded explicitly.
8. Unexplained divergence blocks authoritative reproduction claims.
9. Replay cannot mutate the original event stream.
10. Comparison replay creates a separate replay result.
11. Reproduced state must preserve claim lineage and limitations.
12. Historical replay is distinct from current-policy reevaluation.

```text
Historical Replay
≠
Reassessment under today's policy
```

---

## 16. Verification Invariants

1. Every publishable authoritative result has a verification report.
2. Verification is versioned.
3. Verification cannot strengthen a claim.
4. Verification findings are immutable after report completion.
5. A later verification creates a new report version.
6. Blocking findings prevent publication to affected consumers.
7. Consumer-specific publication decisions are explicit.
8. Replay verification is required where policy declares it mandatory.
9. Hidden contradiction is a verification failure.
10. Missing material limitation is a verification failure.
11. Broken claim traceability is a blocking failure.
12. Verification status cannot be inferred from successful execution alone.
13. `PASSED_WITH_LIMITATIONS` must expose those limitations.
14. Human-review requirements cannot be bypassed by automated retry.
15. Quarantined results cannot influence progression or recommendation authority.

---

## 17. Temporal Invariants

1. Evidence timestamps must not occur after the frozen evidence-set timestamp.
2. Claim creation must not precede evidence-set freezing.
3. Projection creation must not precede source claim creation.
4. Verification completion must not precede verification start.
5. Superseding claims must be created after the claims they supersede.
6. Readiness review dates must not precede evaluation dates.
7. Staleness is determined by explicit policy, not wall-clock assumption alone.
8. Clock source is recorded for deterministic operations.
9. Temporal corrections create new events rather than rewriting timestamps.

---

## 18. Security and Privacy Invariants

1. Tenant isolation is mandatory.
2. Least-privilege access applies to evidence, claims, projections, and replay artifacts.
3. Sensitive evidence is never copied into operational logs.
4. Audit logs use references and fingerprints where possible.
5. Reviewer identity is recorded for human actions.
6. Consent requirements are evaluated before projection or export.
7. Research exports are de-identified according to policy.
8. Retention rules are applied without destroying required audit integrity.
9. A learner-facing projection cannot expose another learner's data.
10. Security failures block publication and replay access.
11. Protected attributes cannot be used outside explicit lawful policy.
12. Secrets, tokens, and raw credentials never enter assessment events.

---

## 19. Human Review Invariants

1. Human review is auditable.
2. Review identity, reason, evidence scope, and outcome are recorded.
3. Human review cannot silently alter historical evidence.
4. Human override creates a separate reviewed decision artifact.
5. Override authority is role- and policy-controlled.
6. A human reviewer must see material contradictions and limitations.
7. Review outcomes may confirm, restrict, reject, or request new evidence.
8. Review cannot fabricate missing evidence.
9. Appeals create new review records.
10. Automated systems cannot mark a required human review as completed.

---

## 20. Cross-Engine Boundary Invariants

### Discovery Engine

- Assessment consumes discovered evidence references; it does not rewrite discovery truth.

### Learning Engine

- Assessment reads learning state and mastery/transfer claims; it does not mutate them directly.

### Recommendation Runtime

- Recommendation may consume verified assessment claims; it does not redefine them.

### Mission Runtime

- Mission progression may consume verified readiness results; it does not force readiness.

### Gameplay Runtime

- Gameplay generates evidence opportunities; it does not directly set assessment outcomes.

### Parent and Teacher Projection

- Audience projections explain verified claims; they do not create assessment authority.

---

## 21. Invariant Enforcement Levels

```text
COMPILE_TIME_CONTRACT
COMMAND_VALIDATION
DOMAIN_POLICY
AGGREGATE_TRANSITION
REPOSITORY_CONSTRAINT
DATABASE_CONSTRAINT
REPLAY_CHECK
VERIFICATION_CHECK
OBSERVABILITY_ALERT
HUMAN_REVIEW_GATE
```

Critical invariants require more than one enforcement layer.

Example:

```text
Tenant Isolation
→ Repository filter
→ Database key/constraint
→ Verification check
→ Security alert
```

---

## 22. Invariant Violation Result

```ts
export interface AssessmentInvariantViolation {
  violationId: string;
  invariantCode: string;
  category: AssessmentInvariantCategory;
  severity: 'WARNING' | 'MATERIAL' | 'BLOCKING' | 'CRITICAL';
  assessmentCaseId?: string;
  aggregateId?: string;
  aggregateVersion?: number;
  sourceRefs: string[];
  detectedAt: string;
  detectorVersion: string;
  remediationCode?: string;
}
```

Violation handling:

```text
WARNING
→ continue with explicit limitation

MATERIAL
→ restrict publication or require review

BLOCKING
→ reject transition or publication

CRITICAL
→ quarantine result and raise operational incident
```

---

## 23. Mandatory Invariant Codes

```text
ASSESSMENT_TENANT_MISMATCH
ASSESSMENT_LEARNER_IDENTITY_MISMATCH
ASSESSMENT_SCOPE_EXPANSION_UNJUSTIFIED
EVIDENCE_SET_NOT_FROZEN
EVIDENCE_PROVENANCE_MISSING
EVIDENCE_DUPLICATE_COUNTED
EVIDENCE_CONTRADICTION_DROPPED
CLAIM_WITHOUT_ELIGIBLE_EVIDENCE
CLAIM_MODEL_VERSION_MISSING
CLAIM_POLICY_VERSION_MISSING
CLAIM_SUPERSESSION_CYCLE
CONFIDENCE_EXCEEDS_SOURCE_AUTHORITY
READINESS_BLOCKER_AVERAGED_AWAY
READINESS_TARGET_MISSING
MISCONCEPTION_SINGLE_ERROR_OVERCLAIM
MISCONCEPTION_COMPETING_HYPOTHESIS_DROPPED
ADAPTIVE_SELECTION_UNTRACEABLE
ADAPTIVE_BURDEN_LIMIT_EXCEEDED
PROJECTION_STRENGTHENS_CLAIM
PROJECTION_HIDES_MATERIAL_LIMITATION
PERSISTENCE_EXPECTED_VERSION_BYPASSED
PERSISTENCE_HISTORY_MUTATED
REPLAY_VERSION_SUBSTITUTED
REPLAY_DIVERGENCE_UNRECORDED
VERIFICATION_REPORT_MISSING
VERIFICATION_BLOCKING_FINDING_IGNORED
HUMAN_REVIEW_BYPASSED
```

---

## 24. Operational Monitoring

Monitor at minimum:

- invariant violations by category,
- critical tenant and identity violations,
- evidence provenance failure rate,
- confidence-bound violation rate,
- readiness blocker violations,
- misconception overclaim detections,
- adaptive burden violations,
- projection fidelity violations,
- optimistic-concurrency conflicts,
- replay divergence rate,
- missing verification reports,
- quarantined assessment results,
- human-review bypass attempts.

Monitoring must use safe metadata and must not expose learner-sensitive evidence.

---

## 25. Acceptance Conditions

26J is complete when the architecture guarantees that:

1. assessment authority remains evidence-derived,
2. tenant, learner, and scope identity cannot drift silently,
3. claims cannot be strengthened by projection or verification,
4. contradiction, uncertainty, and limitations remain visible,
5. readiness blockers cannot be averaged away,
6. misconception claims cannot be inferred from isolated mistakes,
7. adaptive assessment remains reconstructable and burden-aware,
8. history remains append-only and version-safe,
9. historical replay uses historical dependencies,
10. verification gates authoritative publication,
11. human review is auditable and cannot fabricate evidence,
12. cross-engine consumers cannot overwrite assessment truth,
13. invariant violations produce explicit domain results,
14. critical violations quarantine affected outputs,
15. the complete Assessment Engine can be implemented without hidden authority paths.

---

## 26. Chapter 26 Closure

With 26J, the Assessment Engine architecture is complete:

```text
26A Assessment Engine Foundation
26B Assessment Evidence Runtime
26C Assessment Model Runtime
26D Readiness Evaluation Runtime
26E Misconception Assessment Runtime
26F Adaptive Assessment Runtime
26G Assessment Projection Runtime
26H Assessment Persistence & Replay
26I Assessment Verification Runtime
26J Assessment Runtime Invariants
```

The completed engine establishes a governed path from learner activity to explainable, reproducible, audience-safe, and operationally verifiable assessment claims.

Assessment is therefore not a score-producing subsystem. It is an evidence interpretation authority constrained by durable history, explicit policy, verification, and invariant protection.