# 26A — Assessment Engine Foundation

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26A
- State: FOUNDATION DEFINED
- Authority: Architecture contract

---

## 1. Purpose

The Assessment Engine interprets accumulated evidence to produce bounded, explainable assessment claims about learner readiness, understanding, transfer, stability, support dependence, and risk.

It is not a test runner, score calculator, grading system, or replacement for the Learning Engine.

Its central question is:

> What can responsibly be claimed from the available evidence, within which scope, under which policy, and with what uncertainty?

---

## 2. Position in the Runtime

```text
World Runtime
    ↓
Discovery Engine
    ↓
Learning Engine
    ↓
Assessment Engine
    ↓
Assessment Claims
    ↓
Recommendation / Projection / Human Review
```

The Assessment Engine reads evidence and learning claims. It does not rewrite the historical evidence that produced them.

---

## 3. Core Distinctions

The architecture separates the following concepts:

### 3.1 Performance

What happened during one attempt or bounded interaction.

Examples:

- a correct construction,
- an incorrect answer,
- a strategy switch,
- use of a hint,
- completion time,
- abandonment.

Performance is local and temporary.

### 3.2 Learning

The evolving inferred state of understanding across evidence.

Learning is owned by the Learning Engine.

### 3.3 Mastery

A scoped claim that evidence satisfies a versioned mastery policy.

Mastery is not a permanent learner label.

### 3.4 Assessment

A policy-bound interpretation of evidence for a declared purpose.

Examples:

- readiness for a mission,
- transfer readiness,
- misconception risk,
- support need,
- retention confidence.

### 3.5 Grade or score

A presentation convention that may be derived for external compatibility, but is never the primary source of truth.

---

## 4. Assessment Principles

### 4.1 Evidence before conclusion

No assessment claim exists without traceable evidence references.

### 4.2 Scope before label

A claim must identify the concept, representation, context, time horizon, and purpose to which it applies.

### 4.3 Policy before threshold

Thresholds belong to explicit, versioned policies. They must not be hidden in UI logic.

### 4.4 Uncertainty is first-class

Insufficient, stale, contradictory, or context-bound evidence must remain visible.

### 4.5 Assessment is revocable

New evidence may strengthen, narrow, suspend, contradict, or revoke a prior claim.

### 4.6 No single-event mastery

One successful event may contribute evidence, but cannot independently establish robust understanding.

### 4.7 No silent punishment

Failure, hesitation, hint use, and negative transfer are diagnostic evidence, not moral judgments.

### 4.8 Human decisions remain human

The engine may support parent, teacher, mentor, or institutional decisions. It does not silently make high-impact decisions on their behalf.

---

## 5. Assessment Purposes

Every assessment request declares one purpose:

```text
LEARNING_DIAGNOSIS
MISSION_READINESS
CONCEPT_READINESS
TRANSFER_READINESS
RETENTION_CHECK
SUPPORT_PLANNING
MISCONCEPTION_REVIEW
CURRICULUM_ALIGNMENT
PARENT_EXPLANATION
TEACHER_REVIEW
SYSTEM_VERIFICATION
```

A claim produced for one purpose must not automatically be reused for another without compatibility checks.

---

## 6. Assessment Scope

```ts
export interface AssessmentScope {
  learnerId: string;
  conceptIds: string[];
  representationIds?: string[];
  contextIds?: string[];
  missionId?: string;
  curriculumReference?: string;
  evidenceWindow: {
    from?: string;
    to: string;
  };
  purpose: AssessmentPurpose;
}
```

The same learner may simultaneously have:

- strong concrete-model evidence,
- weak symbolic evidence,
- near-transfer confidence,
- unresolved far-transfer readiness.

The engine must preserve these distinctions.

---

## 7. Core Aggregate

The authoritative aggregate is:

```text
AssessmentCase
```

An Assessment Case represents one bounded evaluation request and its resulting claims.

```ts
export interface AssessmentCase {
  assessmentCaseId: string;
  learnerId: string;
  scope: AssessmentScope;
  policyRef: AssessmentPolicyRef;
  evidenceSetRef: EvidenceSetRef;
  learningStateRefs: string[];
  status: AssessmentCaseStatus;
  claims: AssessmentClaim[];
  openedAt: string;
  evaluatedAt?: string;
  supersedesAssessmentCaseId?: string;
  version: number;
}
```

Supported statuses:

```text
OPEN
EVIDENCE_PENDING
READY_TO_EVALUATE
EVALUATED
CONTESTED
SUPERSEDED
REVOKED
```

---

## 8. Assessment Claims

A claim is the engine's principal output.

```ts
export interface AssessmentClaim {
  claimId: string;
  claimType: AssessmentClaimType;
  subject: AssessmentSubject;
  outcome: string;
  confidence: number;
  evidenceStrength: EvidenceStrength;
  limitations: AssessmentLimitation[];
  supportingEvidenceRefs: string[];
  contradictingEvidenceRefs: string[];
  policyRef: AssessmentPolicyRef;
  validFrom: string;
  reviewAfter?: string;
  status: AssessmentClaimStatus;
  explanation: AssessmentExplanation;
}
```

Primary claim types:

```text
READINESS
UNDERSTANDING
TRANSFER
RETENTION
INDEPENDENCE
SUPPORT_DEPENDENCE
MISCONCEPTION_RISK
FOUNDATION_GAP
REPRESENTATION_COVERAGE
EVIDENCE_SUFFICIENCY
```

Claim statuses:

```text
PROVISIONAL
SUPPORTED
STRONG
CONTEXT_BOUND
UNCERTAIN
CONTRADICTED
STALE
REVOKED
SUPERSEDED
```

---

## 9. Claim Outcomes

Common readiness outcomes:

```text
READY
READY_WITH_SUPPORT
PARTIALLY_READY
NOT_YET_READY
READINESS_UNCERTAIN
EVIDENCE_INSUFFICIENT
```

Common risk outcomes:

```text
NO_MATERIAL_RISK_OBSERVED
RISK_SIGNAL_PRESENT
MISCONCEPTION_PATTERN_LIKELY
MISCONCEPTION_PATTERN_CONFIRMED
CONTRADICTORY_EVIDENCE
```

These outcomes must always be paired with scope and explanation.

---

## 10. Input Authorities

The Assessment Engine may read from:

- World evidence,
- Discovery evidence,
- Learner concept state,
- Mastery claims,
- Transfer claims,
- Learning progression state,
- support and hint history,
- retention evidence,
- mission requirements,
- curriculum references,
- adult observations marked as non-authoritative evidence.

It must not treat UI state, display labels, or manual dashboard edits as authoritative learning evidence.

---

## 11. Output Consumers

Assessment Claims may be consumed by:

- Adaptive Recommendation Runtime,
- Mission planning,
- Parent projection,
- Teacher projection,
- Mentor support planning,
- curriculum reporting,
- human review workflows,
- verification and audit tooling.

Consumers may not mutate an Assessment Claim in place.

They may request reevaluation, contest interpretation, or attach additional evidence.

---

## 12. Authority Boundaries

```text
World Runtime
  owns what happened

Discovery Engine
  owns discovered patterns and concept evidence

Learning Engine
  owns evolving learner concept state

Mastery Runtime
  owns mastery claims

Assessment Engine
  owns purpose-bound assessment claims

Recommendation Runtime
  owns ranked next opportunities

Projection Runtime
  owns audience-specific presentation
```

No layer may silently absorb another layer's authority.

---

## 13. Command Surface

Allowed commands:

```text
OpenAssessmentCase
AttachEvidenceSet
EvaluateAssessmentCase
ReevaluateAssessmentCase
ContestAssessmentClaim
SupersedeAssessmentCase
RevokeAssessmentClaim
```

Forbidden commands:

```text
MarkLearnerReady
SetAssessmentScore
ForcePass
ForceMastery
DeleteContradictingEvidence
```

Readiness and assessment outcomes must be computed, not assigned.

---

## 14. Assessment Evaluation Pipeline

```text
Assessment Request
    ↓
Scope Validation
    ↓
Policy Resolution
    ↓
Evidence Assembly
    ↓
Evidence Quality Evaluation
    ↓
Learning-State Compatibility Check
    ↓
Claim Evaluation
    ↓
Contradiction and Limitation Analysis
    ↓
Explanation Construction
    ↓
Claim Publication
```

A failure at any step must result in an explicit non-success outcome rather than a guessed conclusion.

---

## 15. Policy Model

```ts
export interface AssessmentPolicyRef {
  policyId: string;
  policyVersion: string;
  purpose: AssessmentPurpose;
}
```

Policies define:

- required dimensions,
- minimum evidence diversity,
- recency requirements,
- independence requirements,
- transfer requirements,
- contradiction tolerance,
- support-dependence rules,
- stale-evidence rules,
- explanation requirements.

Policy changes never rewrite old claims. They produce new evaluations.

---

## 16. Explainability Contract

Every supported claim must explain:

1. what is being claimed,
2. the exact scope,
3. which evidence supports it,
4. which evidence weakens or contradicts it,
5. which policy produced it,
6. the degree of uncertainty,
7. what evidence would change the conclusion,
8. when reevaluation is appropriate.

---

## 17. Safety and Fairness

The engine must not infer protected traits, clinical diagnoses, intelligence labels, personality judgments, or permanent ability categories.

Assessment language must remain specific and actionable.

Prefer:

> Symbolic fraction comparison remains uncertain because current evidence is limited to visual models.

Avoid:

> The learner is weak at fractions.

---

## 18. Determinism and Reproducibility

Given identical:

- evidence set,
- learning-state references,
- policy version,
- scope,
- evaluation engine version,

an evaluation must produce semantically equivalent claims.

Any non-deterministic component must be recorded and bounded.

---

## 19. Chapter 26 Roadmap

```text
26A Assessment Engine Foundation                 ✅
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

---

## 20. Foundation Invariants

1. No assessment claim without evidence references.
2. No claim without explicit scope.
3. No evaluation without a versioned policy.
4. No hidden score as source of truth.
5. No direct mutation of Learning State.
6. No direct mutation of Mastery Claims.
7. No suppression of contradictory evidence.
8. No permanent learner labels.
9. No purpose reuse without compatibility validation.
10. No claim publication without explanation.

---

## 21. Completion Definition

26A is complete when the repository establishes:

- Assessment Engine purpose,
- aggregate authority,
- claim model,
- scope and policy boundaries,
- command surface,
- evaluation pipeline,
- explainability expectations,
- safety constraints,
- chapter roadmap.

This document is the architectural authority for subsequent Chapter 26 slices.