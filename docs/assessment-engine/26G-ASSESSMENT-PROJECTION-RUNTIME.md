# 26G — Assessment Projection Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26G
- State: PROJECTION RUNTIME DEFINED
- Depends on: 26A–26F

---

## 1. Purpose

The Assessment Projection Runtime converts authoritative assessment claims into audience-specific, permission-safe, explainable views.

It does not create assessment truth. It reads versioned assessment outputs and produces projections for learners, parents, teachers, mentors, and operational reviewers.

The runtime exists to prevent one generic dashboard from flattening distinct needs, hiding uncertainty, or exposing sensitive evidence beyond the intended audience.

---

## 2. Runtime Position

```text
Assessment Claims
+ Readiness Claims
+ Misconception Claims
+ Evidence Summaries
+ Projection Policy
+ Viewer Context
        ↓
Assessment Projection Runtime
        ↓
Learner Projection
Parent Projection
Teacher Projection
Mentor Projection
Operational Review Projection
```

---

## 3. Core Principle

> Projection explains authoritative claims; projection never manufactures them.

A projection may simplify language, group related findings, suppress restricted detail, or reorder information for usability.

A projection must not:

- upgrade confidence,
- remove material limitations,
- convert uncertainty into certainty,
- mark readiness,
- mark mastery,
- resolve a misconception,
- alter evidence provenance,
- replace a claim with a score-only summary.

---

## 4. Projection Authority

The runtime owns:

- viewer-role resolution,
- consent and permission checks,
- audience-specific information selection,
- wording and explanation mapping,
- visible limitation selection,
- safe evidence summarization,
- timeline construction,
- trend presentation,
- action-oriented presentation,
- projection versioning.

It does not own:

- source evidence truth,
- learning-state mutation,
- assessment interpretation,
- claim classification,
- recommendation ranking,
- mission assignment,
- curriculum policy.

---

## 5. Projection Request

```ts
export interface AssessmentProjectionRequest {
  requestId: string;
  learnerId: string;
  viewerId: string;
  viewerRole: AssessmentViewerRole;
  purpose: AssessmentProjectionPurpose;
  claimRefs: string[];
  requestedScope: AssessmentScope;
  locale: string;
  projectionPolicyVersion: string;
  consentContextRef?: string;
  requestedAt: string;
}
```

Supported roles:

```text
LEARNER
PARENT_OR_GUARDIAN
TEACHER
MENTOR
ASSESSMENT_REVIEWER
SYSTEM_OPERATOR
```

Supported purposes:

```text
CURRENT_UNDERSTANDING
MISSION_READINESS
FOUNDATION_RISK
MISCONCEPTION_SUPPORT
PROGRESS_REVIEW
PARENT_CONVERSATION
TEACHER_PLANNING
HUMAN_REVIEW
AUDIT
```

---

## 6. Projection Aggregate

```ts
export interface AssessmentProjection {
  projectionId: string;
  learnerId: string;
  viewerRole: AssessmentViewerRole;
  purpose: AssessmentProjectionPurpose;
  scope: AssessmentScope;
  sourceClaimRefs: string[];
  sourceClaimVersions: string[];
  policyVersion: string;
  schemaVersion: string;
  generatedAt: string;
  headline: ProjectionHeadline;
  findings: ProjectionFinding[];
  limitations: ProjectionLimitation[];
  actions: ProjectionAction[];
  timeline?: ProjectionTimelineEntry[];
  accessDecision: ProjectionAccessDecision;
}
```

The projection is immutable. New source claims or a new policy produce a new projection version.

---

## 7. Audience Models

### 7.1 Learner Projection

The learner view emphasizes:

- what is currently working,
- what remains uncertain,
- what to try next,
- available exploration,
- support that may help,
- evidence of growth.

The learner view must avoid permanent labels such as “weak student” or “bad at fractions.”

Preferred framing:

```text
You can solve this reliably with visual models.
Symbol-only problems are still less stable.
Try one short activity that connects the two forms.
```

### 7.2 Parent Projection

The parent view emphasizes:

- practical meaning,
- foundation risks,
- current support dependence,
- progress over time,
- useful ways to help,
- when professional support may be appropriate.

It must not expose unnecessary raw interaction data or convert a bounded claim into a diagnostic label.

### 7.3 Teacher Projection

The teacher view emphasizes:

- concept and prerequisite scope,
- representation-specific performance,
- misconception hypotheses,
- contradictory evidence,
- classroom planning implications,
- suggested evidence opportunities.

The teacher view may include more technical detail than the parent view, subject to consent and organizational policy.

### 7.4 Mentor Projection

The mentor view emphasizes:

- a narrow support target,
- safe prompts,
- support limits,
- what not to reveal,
- observations that may be recorded,
- escalation conditions.

Mentor observations remain non-authoritative until accepted through the appropriate evidence boundary.

### 7.5 Assessment Reviewer Projection

The reviewer view emphasizes:

- source claim lineage,
- evidence set versions,
- policy and model versions,
- contradictions,
- limitations,
- supersession history,
- reason codes.

---

## 8. Projection Finding

```ts
export interface ProjectionFinding {
  findingId: string;
  category: ProjectionFindingCategory;
  titleCode: string;
  explanationCode: string;
  classification: string;
  confidenceBand: ConfidenceBand;
  scope: AssessmentScope;
  supportingClaimRefs: string[];
  visibleLimitations: string[];
  trend?: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'MIXED' | 'UNKNOWN';
  priority: 'PRIMARY' | 'SECONDARY' | 'CONTEXT';
}
```

Finding categories:

```text
STRENGTH
EMERGING_UNDERSTANDING
READINESS
READINESS_RISK
FOUNDATION_GAP
MISCONCEPTION_RISK
TRANSFER
RETENTION
INDEPENDENCE
SUPPORT_DEPENDENCE
EVIDENCE_GAP
CONTRADICTION
```

---

## 9. Confidence and Uncertainty

Confidence must be shown as a bounded interpretation, not false precision.

Recommended bands:

```text
LOW
MODERATE
HIGH
VERY_HIGH
NOT_CLASSIFIED
```

Rules:

- confidence never exceeds the source claim confidence,
- uncertainty must remain visible when it can affect a decision,
- contradictory evidence cannot be hidden from teacher or reviewer projections,
- parent and learner wording may simplify contradiction language but must preserve its practical meaning,
- numerical probabilities are optional and should not be the default public presentation.

---

## 10. Limitation Projection

Material limitations include:

```text
LIMITED_REPRESENTATION_COVERAGE
LIMITED_CONTEXT_COVERAGE
STALE_EVIDENCE
SUPPORT_DEPENDENT_EVIDENCE
CONTRADICTORY_EVIDENCE
INSUFFICIENT_TRANSFER_EVIDENCE
INSUFFICIENT_RETENTION_EVIDENCE
LANGUAGE_ACCESS_CONFOUND
INTERFACE_ACCESS_CONFOUND
SMALL_EVIDENCE_SET
POLICY_SCOPE_LIMIT
```

A limitation may be reworded for each role, but it may not be omitted if omission would change the meaning of the claim.

---

## 11. Evidence Timeline

The runtime may construct a timeline from immutable claim history.

```ts
export interface ProjectionTimelineEntry {
  occurredAt: string;
  eventType:
    | 'CLAIM_CREATED'
    | 'CLAIM_SUPERSEDED'
    | 'READINESS_CHANGED'
    | 'MISCONCEPTION_UPDATED'
    | 'EVIDENCE_ADDED'
    | 'HUMAN_REVIEWED';
  summaryCode: string;
  claimRefs: string[];
  scope: AssessmentScope;
}
```

Timeline rules:

- history is never rewritten,
- superseded claims remain discoverable to authorized reviewers,
- public views should explain change without implying that earlier claims were fraudulent,
- improvements and regressions must remain scoped to the assessed concept and context.

---

## 12. Action Projection

Projection actions are invitations or planning suggestions, not authoritative state changes.

```text
TRY_NEXT_EVIDENCE_OPPORTUNITY
CONTINUE_CURRENT_PATH
REVIEW_FOUNDATION
USE_ACCESSIBILITY_SUPPORT
PRACTICE_ALTERNATE_REPRESENTATION
SEEK_TEACHER_REVIEW
SEEK_PARENT_SUPPORT
DEFER_AND_REASSESS
NO_ACTION_REQUIRED
```

The projection runtime may consume recommendation outputs, but it may not create recommendation ranking itself.

---

## 13. Permission Boundary

Access decisions:

```text
ALLOWED
ALLOWED_WITH_REDACTION
DENIED
CONSENT_REQUIRED
ROLE_NOT_ELIGIBLE
SCOPE_NOT_ELIGIBLE
```

Permission checks must consider:

- relationship to the learner,
- age and consent policy,
- organization membership,
- requested purpose,
- requested scope,
- sensitivity of evidence,
- data-retention policy,
- legal or regional constraints.

Raw evidence is not included by default. Projections should prefer claim summaries and evidence references.

---

## 14. Projection Pipeline

```text
Receive Projection Request
        ↓
Resolve Viewer Identity and Role
        ↓
Resolve Consent and Permission
        ↓
Load Authoritative Claims
        ↓
Validate Scope and Version Lineage
        ↓
Select Audience-Eligible Findings
        ↓
Preserve Material Limitations
        ↓
Map Explanation Codes to Locale
        ↓
Construct Actions and Timeline
        ↓
Redact Restricted Detail
        ↓
Freeze Projection Version
```

---

## 15. Failure Codes

```text
PROJECTION_VIEWER_NOT_AUTHORIZED
PROJECTION_CONSENT_REQUIRED
PROJECTION_SCOPE_NOT_ALLOWED
PROJECTION_SOURCE_CLAIM_NOT_FOUND
PROJECTION_SOURCE_CLAIM_INVALID
PROJECTION_SOURCE_VERSION_MISMATCH
PROJECTION_POLICY_NOT_FOUND
PROJECTION_POLICY_INCOMPATIBLE
PROJECTION_LOCALE_NOT_SUPPORTED
PROJECTION_MATERIAL_LIMITATION_LOST
PROJECTION_REDACTION_FAILED
PROJECTION_GENERATION_FAILED
```

---

## 16. Invariants

1. Every projection references authoritative source claims.
2. Projection confidence never exceeds source confidence.
3. Projection cannot create, modify, resolve, or supersede a claim.
4. Material limitations remain visible in meaning.
5. Unauthorized raw evidence is never exposed.
6. Viewer role and purpose are recorded on every projection.
7. A projection is immutable after publication.
8. New evidence produces a new claim and projection version.
9. A single score cannot replace multidimensional findings.
10. Learner-facing language must avoid permanent deficit labels.
11. Human observations remain distinct from authoritative evidence.
12. Projection actions do not mutate learning, assessment, mission, or recommendation state.

---

## 17. Verification Expectations

Repository verification should confirm:

- role-specific contracts exist,
- permission decisions are explicit,
- source claim lineage is retained,
- material limitations cannot be dropped,
- projection versions are immutable,
- redaction paths are testable,
- confidence monotonicity is enforced,
- locale mapping does not change classification,
- learner, parent, teacher, mentor, and reviewer views remain distinct.

Operational verification should demonstrate:

```text
Assessment Claim
→ Authorized Viewer Request
→ Projection Generation
→ Correct Redaction
→ Correct Explanation
→ No Source-State Mutation
```

---

## 18. Completion Statement

26G is complete when Assessment Engine outputs can be communicated safely and usefully to each audience without allowing presentation logic to become assessment authority.
