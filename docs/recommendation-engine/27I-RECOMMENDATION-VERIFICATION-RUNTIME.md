# 27I — Recommendation Verification Runtime

Status: VERIFICATION RUNTIME DEFINED  
Depends on: 27A–27H

## 1. Purpose

Recommendation Verification Runtime determines whether a recommendation case, candidate set, prioritized set, recommendation record, projection, or replay result is structurally valid, traceable, bounded, safe, and publishable.

It answers:

> Is this recommendation decision trustworthy enough to publish, and what limitations or review requirements must accompany it?

Verification does not create recommendations and cannot strengthen them.

## 2. Runtime Position

```text
Recommendation Context
        ↓
Candidate Generation
        ↓
Prioritization
        ↓
Learning / Practice / Mission Recommendation
        ↓
Persistence Candidate State
        ↓
Recommendation Verification Runtime
        ↓
Publication Decision
        ↓
Projection / Persistence / Consumer Delivery
```

Verification may run at multiple checkpoints, but final publication requires complete set verification.

## 3. Verification Authority

Verification MAY:

- validate structure,
- reject invalid sources,
- preserve uncertainty,
- detect contradictions,
- require human review,
- quarantine unsafe records,
- limit publication,
- verify replay equivalence.

Verification MUST NOT:

- raise recommendation confidence,
- invent missing evidence,
- resolve assessment contradictions,
- change recommendation target,
- reorder recommendations,
- activate missions,
- mark mastery,
- overwrite original records.

## 4. Verification Subjects

```text
RECOMMENDATION_CASE
CONTEXT_SNAPSHOT
CANDIDATE
CANDIDATE_SET
PRIORITY_DECISION
RECOMMENDATION
RECOMMENDATION_SET
PROJECTION
PUBLICATION
PERSISTENCE_RECORD
REPLAY_RESULT
SUPERSESSION
```

Each subject has a versioned verification profile.

## 5. Verification Pipeline

```text
Subject Load
        ↓
Structural Integrity
        ↓
Identity and Scope Integrity
        ↓
Source Eligibility
        ↓
Provenance Verification
        ↓
Claim Traceability
        ↓
Policy Version Verification
        ↓
Priority and Dependency Verification
        ↓
Confidence Bound Verification
        ↓
Contradiction and Limitation Preservation
        ↓
Projection Fidelity
        ↓
Persistence Integrity
        ↓
Replay Integrity
        ↓
Safety and Human Authority Checks
        ↓
Publication Decision
```

## 6. Verification Result

```text
verificationId
subjectType
subjectId
subjectVersion
verificationPolicyVersion
checks
violations
warnings
limitations
humanReviewRequirement
publicationDecision
verifiedAt
```

## 7. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

### PUBLISH

All required checks pass and no material unresolved limitation blocks the audience.

### PUBLISH_WITH_LIMITATIONS

The recommendation remains useful, but uncertainty or scope limitations must be visible.

### HOLD_FOR_REVIEW

Automated publication is paused pending authorized human judgment.

### QUARANTINE

The record is isolated due to integrity, provenance, security, or semantic risk.

### REJECT

The subject cannot become an authoritative recommendation output.

## 8. Structural Integrity

Structural verification confirms:

- required fields exist,
- identifiers are valid,
- versions are present,
- status transition is legal,
- enum values are supported,
- timestamps are coherent,
- source references have expected shape,
- ordered collections are stable.

Structural validity alone does not imply publication eligibility.

## 9. Identity Integrity

Identity checks enforce:

```text
tenant identity matches
learner identity matches
recommendation case identity matches
recommendation set identity matches
source aggregate identity matches
correlation and causation links are valid
```

Cross-learner or cross-tenant contamination is a critical violation.

## 10. Scope Integrity

A recommendation must not exceed the scope of its evidence or policy.

Examples:

- evidence for one representation cannot support a universal skill claim,
- one curriculum scope cannot silently authorize another,
- parent support recommendation cannot become teacher intervention authority,
- mission proposal cannot become mission activation.

## 11. Source Eligibility

Every source reference is checked for:

```text
existence
version
status
publication eligibility
temporal relevance
learner scope
tenant scope
claim type compatibility
```

Ineligible sources cannot be hidden by combining them with eligible sources.

## 12. Provenance Verification

The full chain must be traceable:

```text
Evidence
  ↓
Assessment Claim
  ↓
Recommendation Candidate
  ↓
Priority Decision
  ↓
Recommendation
  ↓
Projection
```

Missing provenance is never replaced by narrative explanation alone.

## 13. Claim Traceability

Each material recommendation reason must map to one or more source claims.

Verification checks that:

- reason codes are supported by sources,
- blocker claims are not fabricated,
- misconception language matches claim status,
- readiness language matches readiness state,
- goal alignment refers to an accepted or explicitly proposed goal,
- recommendation type is compatible with the source condition.

## 14. Policy Verification

Required policy versions must be resolvable:

```text
candidatePolicyVersion
prioritizationPolicyVersion
learningRecommendationPolicyVersion
practiceRecommendationPolicyVersion
missionRecommendationPolicyVersion
verificationPolicyVersion
projectionPolicyVersion
```

Unknown or mutable policy references block deterministic authority.

## 15. Candidate Verification

Candidate checks include:

- canonical target exists,
- candidate source is recognized,
- eligibility state is justified,
- blockers are explicit,
- limitations are preserved,
- dependency traversal is bounded,
- graph cycles are handled,
- deduplication retains all source references.

## 16. Priority Verification

Priority checks include:

- blocking rules applied before scores,
- prerequisite ordering is respected,
- tie resolution is deterministic,
- priority factors use allowed inputs,
- optional exploration is not converted into required work,
- lower-confidence recommendation is not falsely presented as certain,
- blocking needs cannot be averaged away.

## 17. Recommendation-Type Verification

### Learning Recommendation

Verify that conceptual learning is justified and not merely used to increase activity volume.

### Practice Recommendation

Verify that the concept is sufficiently established for practice, dosage is bounded, and loop protection exists.

### Mission Recommendation

Verify optionality, readiness gate, success evidence contract, and the boundary that mission completion does not imply mastery.

## 18. Confidence Bound Verification

Rules:

```text
recommendation confidence ≤ supporting source confidence bound
projection confidence ≤ recommendation confidence
verification cannot increase confidence
conflicting evidence cannot be rendered as high confidence
missing evidence cannot become low mastery
```

Confidence is not a probability of success.

## 19. Contradiction Preservation

When sources conflict, verification requires:

- contradiction state retained,
- no silent averaging that erases the conflict,
- recommendation scope narrowed where possible,
- ASSESS, OBSERVE, WAIT, or HUMAN REVIEW considered,
- limitations visible in publication.

## 20. Limitation Verification

A limitation may not disappear between stages.

```text
candidate limitation
    ↓ retained
recommendation limitation
    ↓ retained
projection limitation
```

A narrower limitation may be added. A material limitation may not be silently removed.

## 21. Readiness Verification

Readiness checks ensure:

- blocking requirements remain blocking,
- readiness is not derived from recommendation priority,
- recommendation does not declare readiness,
- mission proposals honor readiness gates,
- optional challenge does not bypass mandatory safety or foundation gates.

## 22. Misconception Verification

Rules:

```text
wrong answer once ≠ misconception
pattern signal ≠ confirmed misconception
recommendation must preserve hypothesis status
practice must stop or change when misconception risk appears
human review may be required for persistent ambiguity
```

## 23. Practice Safety Verification

Practice recommendations must include:

- maximum dosage,
- stopping conditions,
- failure threshold,
- fatigue handling where available,
- repetition loop detection,
- redirection to learning or assessment when needed.

Unbounded remediation is not publishable.

## 24. Mission Boundary Verification

Mission recommendations must preserve:

```text
recommendation proposes
mission engine decides
mission runtime activates
assessment interprets resulting evidence
```

Any projection implying automatic activation fails verification.

## 25. Projection Fidelity

Projection checks verify:

- target identity unchanged,
- recommendation type unchanged,
- priority meaning preserved,
- confidence not increased,
- limitations visible,
- optionality preserved,
- stale and superseded state accurate,
- audience redaction authorized,
- localized wording semantically equivalent.

## 26. Persistence Integrity

Persistence verification checks:

- append-only history,
- optimistic concurrency evidence,
- idempotency key correctness,
- transaction completeness,
- immutable recommendation ordering,
- supersession link integrity,
- publication record integrity,
- no Last-write-wins mutation.

## 27. Replay Verification

Historical replay checks:

```text
historical source snapshot used
historical policy versions used
canonical outputs compared
semantic divergence classified
runtime version recorded
original history left unchanged
```

Current-policy replay must be labeled simulation.

## 28. Temporal Integrity

Checks include:

- evidence predates or is valid for decision time,
- decision predates publication,
- expiration is after publication,
- supersession is not retroactive,
- stale source is not published as current,
- late evidence triggers a new case rather than rewriting history.

## 29. Human Authority

Verification enforces human authority where policy requires it.

Examples:

```text
persistent conflicting evidence
high-impact parent or teacher intervention
sensitive learner classification
manual mission requirement
policy exception
quarantined provenance
```

Human review decisions must be recorded with actor, scope, reason, and timestamp.

## 30. Security Verification

Security checks include:

- tenant isolation,
- learner access scope,
- audience authorization,
- restricted evidence redaction,
- operational log hygiene,
- audit access control,
- correlation metadata without sensitive leakage.

## 31. Critical Violations

Critical violations cause QUARANTINE or REJECT:

```text
CROSS_TENANT_SOURCE
CROSS_LEARNER_SOURCE
MISSING_AUTHORITATIVE_PROVENANCE
CONFIDENCE_ESCALATION
LIMITATION_ERASURE
UNAUTHORIZED_MISSION_ACTIVATION
HISTORICAL_MUTATION
REPLAY_REWRITES_HISTORY
SECURITY_SCOPE_BREACH
FABRICATED_ASSESSMENT_CLAIM
```

## 32. Non-Critical Warnings

Warnings may allow PUBLISH_WITH_LIMITATIONS:

```text
AGING_EVIDENCE
LIMITED_REPRESENTATION_COVERAGE
LOW_RECOMMENDATION_CONFIDENCE
PARTIAL_ASSET_AVAILABILITY
NON_BLOCKING_POLICY_DEPRECATION
OPTIONAL_HUMAN_REVIEW
```

## 33. Verification Profiles

Profiles may differ by audience and recommendation type, but critical integrity rules remain global.

Examples:

```text
LEARNER_PUBLICATION_PROFILE
PARENT_PUBLICATION_PROFILE
TEACHER_PUBLICATION_PROFILE
MISSION_ENGINE_PROFILE
AUDIT_PROFILE
HISTORICAL_REPLAY_PROFILE
```

## 34. Deterministic Verification

Equivalent subject, source state, and verification policy must yield equivalent publication decisions and violation sets.

Human judgment is represented as an explicit input, never hidden nondeterminism.

## 35. Idempotency

Repeated verification of an unchanged subject under the same policy returns an equivalent result.

A new policy version creates a new verification record rather than mutating the old one.

## 36. Failure Codes

```text
SUBJECT_NOT_FOUND
SUBJECT_VERSION_CONFLICT
INVALID_STRUCTURE
IDENTITY_SCOPE_MISMATCH
SOURCE_INELIGIBLE
PROVENANCE_INCOMPLETE
CLAIM_NOT_TRACEABLE
POLICY_VERSION_MISSING
PRIORITY_RULE_VIOLATION
CONFIDENCE_BOUND_VIOLATION
CONTRADICTION_ERASED
LIMITATION_DROPPED
PROJECTION_DIVERGENCE
PERSISTENCE_INTEGRITY_FAILURE
REPLAY_INTEGRITY_FAILURE
HUMAN_REVIEW_REQUIRED
SECURITY_VIOLATION
```

## 37. Verification Evidence

A verification result must provide enough evidence for an authorized reviewer to understand:

```text
what was checked
which rules passed
which rules failed
which sources were inspected
what limitations remain
why the publication decision was made
```

## 38. Minimum Verification Scenarios

- recommendation with missing provenance is rejected,
- conflicting assessment evidence cannot publish as high confidence,
- candidate blockers survive prioritization,
- practice without stopping rules is held,
- mission recommendation cannot activate a mission,
- learner projection cannot expose restricted evidence,
- stale recommendation cannot publish as current,
- historical record cannot be overwritten,
- replay divergence is surfaced,
- cross-tenant source is quarantined,
- verification never strengthens confidence.

## 39. Completion Rule

27I is complete when every Recommendation Engine output can be independently checked for structure, identity, provenance, traceability, policy compliance, confidence bounds, contradiction preservation, projection fidelity, persistence integrity, replay integrity, security, and human-authority boundaries before publication.
