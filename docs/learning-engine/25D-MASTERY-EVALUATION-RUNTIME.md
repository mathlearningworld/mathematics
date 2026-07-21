# 25D — Mastery Evaluation Runtime

## 1. Purpose

The Mastery Evaluation Runtime determines whether a learner's current body of evidence is sufficient to support a bounded, explainable mastery claim.

Mastery is not a score, badge, level, mission completion flag, curriculum checkbox, or permanent learner label. It is a time-bounded conclusion derived from authoritative learning evidence.

The runtime answers:

- What has the learner demonstrated?
- Under which contexts and representations?
- With how much independence?
- Across what period of time?
- With what transfer and retention evidence?
- What contradictions or missing evidence remain?
- How strong is the mastery claim and why?

The runtime must be conservative enough to prevent accidental success from becoming mastery, while remaining flexible enough to recognize valid alternative strategies and non-linear learning paths.

---

## 2. Architectural Position

```text
World Runtime
  → Discovery Evidence Runtime
    → Learning State Runtime
      → Learning Progression Runtime
        → Mastery Evaluation Runtime
          → Learning Path / Recommendation / Assessment Projection
```

The Mastery Evaluation Runtime consumes authoritative learning projections. It does not inspect UI state, animation state, mission completion screens, or raw input gestures as proof of mastery.

It does not create learning evidence. It evaluates evidence already admitted through the Discovery and Learning runtimes.

---

## 3. Core Principle

> Mastery is an evidence-backed capability claim that remains bounded by concept, scope, context, time, support level, and uncertainty.

A mastery claim must never mean:

- the learner will never forget,
- the learner can solve every possible problem,
- the learner has no misconceptions,
- the learner is globally strong or weak,
- the learner belongs permanently to a fixed ability group.

A mastery claim means only that the available evidence currently supports a specified capability within declared boundaries.

---

## 4. Mastery Is Separate from Learning State

Learning State describes the evolving condition of understanding.

Mastery Evaluation applies a policy to that state and its evidence.

```text
Learning State = descriptive
Mastery Evaluation = evaluative
```

The separation is required because:

- different goals may require different mastery policies,
- curriculum minimums may differ by jurisdiction,
- game progression may use a lower confidence threshold than formal certification,
- parent-facing summaries may require broader evidence than internal recommendations,
- mastery policy may evolve without rewriting the historical learning ledger.

The Learning State is authoritative for what has been observed. Mastery policy is authoritative only for the decision it produces under a named policy version.

---

## 5. Mastery Claim Model

A mastery claim should include at least:

```text
MasteryClaim
- claimId
- learnerId
- conceptId
- scope
- status
- confidence
- policyId
- policyVersion
- evaluatedAt
- evidenceWindow
- evidenceRefs
- transferCoverage
- representationCoverage
- independenceProfile
- retentionProfile
- contradictionProfile
- limitations
- reasonCodes
- supersedesClaimId?
- revokedAt?
- revocationReason?
```

The claim is immutable after issuance. Later evaluation creates a new claim that supersedes, strengthens, weakens, or revokes the previous claim.

---

## 6. Mastery Status Vocabulary

Recommended statuses:

```text
NOT_EVALUATED
INSUFFICIENT_EVIDENCE
DEVELOPING
PROVISIONALLY_MASTERED
MASTERED
ROBUSTLY_MASTERED
CONTEXT_BOUND
SUPPORT_DEPENDENT
CONTRADICTED
DORMANT
REVOKED
```

### NOT_EVALUATED

No mastery policy has been applied.

### INSUFFICIENT_EVIDENCE

Evidence exists, but quantity, quality, variation, independence, retention, or transfer is insufficient.

### DEVELOPING

The evidence indicates meaningful progress but not enough stability for a mastery claim.

### PROVISIONALLY_MASTERED

The learner has demonstrated the target capability under adequate but still limited evidence coverage.

### MASTERED

The learner has demonstrated stable, independent capability across the required policy dimensions.

### ROBUSTLY_MASTERED

Evidence exceeds the normal mastery policy through broad transfer, varied representations, durable retention, and low support dependence.

### CONTEXT_BOUND

Performance is strong in one familiar context but does not yet generalize sufficiently.

### SUPPORT_DEPENDENT

The learner succeeds primarily with hints, scaffolds, imitation, or constrained choices.

### CONTRADICTED

Recent or high-quality evidence materially conflicts with the mastery claim.

### DORMANT

The claim was previously supported but lacks sufficiently recent retention evidence.

### REVOKED

The claim is no longer valid due to evidence revocation, corruption, semantic migration, policy invalidation, or confirmed contradiction.

---

## 7. Required Evidence Dimensions

Mastery must be evaluated across multiple dimensions. A single scalar score is prohibited as the sole decision authority.

### 7.1 Correctness

Did the learner reach valid outcomes?

Correctness alone is insufficient because success may result from guessing, imitation, accidental placement, or over-constrained interaction.

### 7.2 Strategy Validity

Was the strategy mathematically meaningful and valid for the task?

Alternative strategies are allowed. The runtime must not force one canonical procedure when multiple valid methods exist.

### 7.3 Independence

How much support was required?

Support classification may include:

```text
NONE
ATTENTION_CUE
REFLECTIVE_PROMPT
CONSTRAINT_REDUCTION
EXPERIMENT_SUGGESTION
PARTIAL_STRATEGY
DEMONSTRATION
DIRECT_EXECUTION
```

Evidence after high-support guidance may contribute to learning, but must not be treated as independent mastery proof.

### 7.4 Variation

Has the learner succeeded across materially different examples rather than repeated near-duplicates?

Variation should consider:

- values,
- spatial arrangement,
- representation,
- task goal,
- distractors,
- sequence,
- world affordances,
- time separation.

### 7.5 Representation Coverage

Can the learner operate across relevant representations, such as:

- physical or spatial objects,
- diagrams,
- number lines,
- symbolic expressions,
- tables,
- verbal problems,
- graphs,
- game-world structures?

Representation coverage is concept-specific. Not every concept requires every representation.

### 7.6 Transfer

Can the learner apply the concept when surface features change?

Transfer evidence is evaluated in detail by 25E and consumed here as an input.

### 7.7 Retention

Can the learner still demonstrate the capability after meaningful delay?

Repeated success within one uninterrupted session is not retention evidence.

### 7.8 Error Recovery

Can the learner detect, revise, or recover from an invalid strategy?

Self-correction may be stronger evidence than uninterrupted success because it reveals monitoring and conceptual control.

### 7.9 Contradiction Burden

What high-quality evidence conflicts with the claim?

Contradictions must not be averaged away silently. They require explicit interpretation.

### 7.10 Evidence Authority

Did the evidence originate from an authoritative runtime path?

Evidence derived only from UI projection, animation, client optimism, or an uncommitted world preview must be rejected.

---

## 8. Mastery Policy

A Mastery Policy declares the evidence requirements for a bounded decision.

```text
MasteryPolicy
- policyId
- version
- targetConceptId
- targetScope
- minimumIndependentEvidence
- minimumContextVariation
- requiredRepresentations
- minimumTransferProfile
- retentionWindows
- maximumContradictionBurden
- allowedSupportLevels
- evidenceFreshnessRules
- prerequisiteRules
- exceptionRules
- jurisdiction?
- curriculumMapping?
```

Policies must be versioned and immutable after publication.

Historical claims retain the policy version that produced them.

---

## 9. Policy Profiles

The same concept may use multiple policy profiles.

### Game Progression Policy

Allows the learner to access more advanced experiences without claiming formal curriculum mastery.

### Foundational Readiness Policy

Evaluates whether missing foundations are likely to block a target learning goal.

### Curriculum Minimum Policy

Maps evidence to a jurisdiction or grade-level requirement.

### Parent Verification Policy

Uses a clear, conservative threshold suitable for family-facing reporting.

### Teacher Diagnostic Policy

May expose more nuance, contradictions, and partial dimensions rather than a binary decision.

### Formal Assessment Policy

May require externally controlled tasks and stronger identity, timing, or integrity constraints.

These profiles must never overwrite one another.

---

## 10. Evaluation Pipeline

```text
Evaluation Request
  → Resolve Policy
  → Load Learning State
  → Load Eligible Evidence
  → Verify Evidence Authority
  → Deduplicate and Cluster
  → Measure Dimension Coverage
  → Evaluate Contradictions
  → Apply Policy Rules
  → Produce Mastery Decision
  → Persist Immutable Claim
  → Publish Projection Event
```

Each stage must be deterministic for the same policy version and evidence ledger state.

---

## 11. Evidence Eligibility

Evidence is eligible only when:

- it belongs to the learner and concept scope,
- it passed authoritative evidence admission,
- it is not revoked or quarantined,
- its semantic version is compatible with the policy,
- it falls within relevant time windows,
- it is not a duplicate of the same world outcome,
- it has sufficient provenance,
- its support and context metadata are known.

Unknown metadata should reduce confidence or render evidence ineligible. The runtime must not invent missing context.

---

## 12. Duplicate and Correlated Evidence

Ten repeated actions in the same configuration must not be treated as ten independent proofs.

The evaluator should group correlated evidence by dimensions such as:

```text
session
mission
world configuration
task template
representation
strategy
support episode
time window
source event lineage
```

The policy may count a cluster as one evidence unit or assign diminishing contribution.

This prevents grinding, replay loops, and repeated easy examples from manufacturing mastery.

---

## 13. Accidental Success Protection

Potential accidental success indicators include:

- immediate random action followed by success,
- success rate inconsistent with strategy evidence,
- no repeatability under minor variation,
- success only with one affordance arrangement,
- result produced by auto-correction,
- result committed by system assistance rather than learner action,
- mismatch between outcome and subsequent explanation or transfer.

Accidental success evidence may remain in the ledger but should receive low mastery weight and explicit reason codes.

---

## 14. Support Dependence

The runtime must distinguish learning with support from mastery without support.

A learner may transition through:

```text
Demonstration
  → Partial Strategy
    → Experiment Suggestion
      → Reflective Prompt
        → Attention Cue
          → Independent Action
```

This decreasing-support trajectory is strong learning evidence.

However, mastery should normally require a policy-defined amount of independent or minimally supported evidence.

Support dependence must be scoped to concept and context. It must never become a global learner label.

---

## 15. Retention Windows

Retention should use concept-appropriate time windows.

Example model:

```text
Immediate Stability: same session or same day
Short Retention: several days
Medium Retention: several weeks
Long Retention: several months
```

The exact windows are policy-controlled.

A claim can remain mastered while retention is unevaluated only when the policy explicitly permits it. Otherwise the claim should remain provisional.

Absence of recent evidence does not prove forgetting. It may produce DORMANT, not automatically CONTRADICTED.

---

## 16. Contradiction Evaluation

Contradictions vary in authority and meaning.

Examples:

- a single careless error after many stable demonstrations,
- systematic use of an invalid strategy,
- failure only in a new representation,
- failure after a long delay,
- success only after hidden assistance,
- evidence later revoked because of runtime corruption.

The evaluator must classify contradiction types rather than treating every failure equally.

```text
ContradictionType
- EXECUTION_SLIP
- REPRESENTATION_GAP
- CONTEXT_GAP
- STRATEGY_MISCONCEPTION
- RETENTION_WEAKNESS
- SUPPORT_DEPENDENCE
- EVIDENCE_INVALIDATION
- UNKNOWN
```

A contradiction may:

- reduce confidence,
- narrow scope,
- change MASTERED to CONTEXT_BOUND,
- change MASTERED to DORMANT,
- trigger reevaluation,
- revoke the claim.

---

## 17. Mastery Degradation

Mastery degradation must be evidence-driven, not timer-driven alone.

Possible transitions:

```text
ROBUSTLY_MASTERED → MASTERED
MASTERED → PROVISIONALLY_MASTERED
MASTERED → CONTEXT_BOUND
MASTERED → DORMANT
MASTERED → CONTRADICTED
ANY_ACTIVE_CLAIM → REVOKED
```

A time threshold may trigger reevaluation or retention sampling, but should not by itself assert that understanding disappeared.

---

## 18. Scope and Partial Mastery

A concept may contain meaningful subscopes.

Example:

```text
Linear Equations
- one-step additive equations
- one-step multiplicative equations
- equations with negative values
- equations expressed as word problems
- equations requiring transformation
```

The runtime may issue mastery for one scope without implying mastery of the whole concept family.

Claims must carry explicit scope identifiers and limitations.

---

## 19. Explainability

Every mastery decision must provide human-readable and machine-readable reasons.

Example reason codes:

```text
SUFFICIENT_INDEPENDENT_EVIDENCE
TRANSFER_ACROSS_THREE_CONTEXTS
RETENTION_CONFIRMED_AFTER_DELAY
REPRESENTATION_COVERAGE_INCOMPLETE
HIGH_SUPPORT_DEPENDENCE
CONTRADICTORY_STRATEGY_EVIDENCE
EVIDENCE_TOO_CORRELATED
POLICY_PREREQUISITE_NOT_MET
```

Example projection:

```text
Status: PROVISIONALLY_MASTERED
Why:
- Independent success across four varied tasks
- Two representations demonstrated
- Near transfer confirmed
Still needed:
- Retention evidence after seven days
- One unfamiliar context
```

The system must not present confidence as a school grade or intelligence score.

---

## 20. Mastery and Curriculum

Curriculum mapping is a projection, not the source of mathematical truth.

```text
Concept Mastery Claim
  → Curriculum Requirement Mapping
    → Grade / Standard Readiness Projection
```

One mastery claim may support multiple curriculum requirements. One curriculum requirement may require multiple concept mastery claims.

Country and grade mappings must remain downloadable, versioned, and replaceable without changing the underlying learner evidence.

---

## 21. Mastery and Assessment

Mastery Evaluation and Assessment are related but separate.

Mastery Evaluation:

- continuously interprets accumulated evidence,
- may use natural gameplay evidence,
- is concept and policy scoped,
- can remain provisional.

Assessment:

- intentionally samples capability,
- may control task selection and conditions,
- may produce additional authoritative evidence,
- can validate or challenge a mastery claim.

Assessment does not directly set mastery. It contributes evidence that the Mastery Evaluation Runtime evaluates.

---

## 22. Commands and Events

Suggested commands:

```text
EvaluateMastery
ReevaluateMasteryAfterEvidenceChange
ReevaluateMasteryAfterPolicyMigration
RevokeMasteryClaim
ProjectMasteryStatus
```

Suggested events:

```text
MasteryEvaluationRequested
MasteryClaimIssued
MasteryClaimStrengthened
MasteryClaimNarrowed
MasteryClaimContradicted
MasteryClaimDormant
MasteryClaimRevoked
MasteryPolicyMigrated
```

Commands request evaluation. They must not command a desired status.

Invalid command:

```text
MarkLearnerMastered
```

Valid command:

```text
EvaluateMastery using policy X over evidence ledger version Y
```

---

## 23. Idempotency and Concurrency

An evaluation request should include:

```text
learnerId
conceptId
scope
policyId
policyVersion
evidenceLedgerVersion
expectedLearningStateVersion
correlationId
idempotencyKey
```

Reprocessing the same request against the same inputs must return the same claim or an idempotent reference to it.

If the learning state or evidence ledger advances during evaluation, the runtime must reject, retry, or mark the result stale. It must not silently issue a claim against mixed versions.

---

## 24. Replay and Policy Migration

Replay must reproduce historical claims when using the same:

- evidence ledger,
- evidence semantics,
- learning evaluator version,
- mastery policy version.

A new policy version creates a new evaluation lineage. It must not rewrite old claims.

Migration outcomes may include:

```text
UNCHANGED
STRENGTHENED
WEAKENED
NARROWED
NO_LONGER_SUPPORTED
REQUIRES_NEW_EVIDENCE
```

---

## 25. Privacy and Fairness

Mastery claims are sensitive learning data.

Requirements:

- minimum necessary projection,
- role-based access,
- consent-aware family and mentor views,
- audit trail for claim access and change,
- no advertising use,
- no permanent ability ranking,
- no hidden demographic thresholds,
- no comparison-based mastery policy unless explicitly designed and justified.

The engine evaluates evidence against declared capability criteria, not against other learners.

---

## 26. Runtime Invariants

1. No mastery claim may be created without authoritative evidence references.
2. No caller may directly assign a mastery status.
3. A mastery claim must reference an immutable policy version.
4. A mastery claim must be bounded by concept and scope.
5. Duplicate or correlated evidence must not inflate mastery.
6. Guided performance must not be represented as independent mastery.
7. Contradictory evidence must remain visible to evaluation.
8. Absence of recent evidence must not be interpreted automatically as forgetting.
9. Revoked evidence must trigger claim reevaluation.
10. Replay with identical inputs must be deterministic.
11. Curriculum mappings must not overwrite concept evidence.
12. Mastery confidence must not become a global learner score.
13. Historical claims must remain auditable after supersession.
14. A projection may simplify a claim but must not change its meaning.
15. Mastery must never be manufactured by UI state, mission completion, or rewards.

---

## 27. Verification Scenarios

### Scenario A — Repeated Easy Success

The learner repeats one identical task ten times.

Expected:

- evidence is clustered as highly correlated,
- no broad mastery claim,
- status remains DEVELOPING or INSUFFICIENT_EVIDENCE.

### Scenario B — Independent Variation

The learner succeeds independently across varied values, arrangements, and representations.

Expected:

- breadth and independence increase,
- provisional or full mastery may be issued according to policy.

### Scenario C — Guided Success

The learner succeeds after demonstration.

Expected:

- learning evidence is preserved,
- mastery independence requirement remains unmet.

### Scenario D — Delayed Retention

The learner demonstrates the concept after a meaningful delay without support.

Expected:

- retention profile strengthens,
- provisional mastery may advance to mastery.

### Scenario E — New Contradiction

A stable claim is followed by systematic misuse in a new representation.

Expected:

- contradiction is recorded,
- scope may narrow to CONTEXT_BOUND,
- claim is not silently preserved unchanged.

### Scenario F — Evidence Revocation

A gameplay runtime defect invalidates a set of placement events.

Expected:

- affected evidence is revoked,
- dependent mastery claims are reevaluated,
- audit lineage remains intact.

---

## 28. Completion Boundary

This document defines the authority, model, policy, lifecycle, and invariants for mastery evaluation.

It does not yet define:

- detailed transfer classification, which belongs to 25E,
- individualized learning path construction, which belongs to 25F,
- recommendation ranking, which belongs to 25G,
- parent and teacher projections, which belong to 25H,
- persistence implementation, which belongs to 25I,
- complete verification architecture, which belongs to 25J.

The Mastery Evaluation Runtime is complete when the system can produce bounded, deterministic, explainable mastery claims from authoritative learning evidence without reducing learning to a score or allowing external callers to manufacture mastery.