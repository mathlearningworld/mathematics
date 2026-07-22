# Chapter 37B — Mastery Evaluation Runtime

## 1. Purpose

Mastery Evaluation Runtime turns a bounded, versioned set of admissible evidence into a deterministic evaluation result that can be consumed by Mastery Decision Runtime.

It does not write authoritative mastery status. It computes an evaluation outcome under an explicit curriculum definition, mastery policy, evaluation model, and evidence cutoff.

```text
Evaluation computes.
Decision authorizes.
Projection explains.
```

## 2. Evaluation Boundary

The evaluator owns:

- evaluation request validation,
- evidence qualification input consumption,
- feature extraction,
- coverage calculation,
- confidence calculation,
- durability interpretation,
- contradiction detection,
- candidate outcome calculation,
- deterministic explanation generation,
- evaluation result versioning.

It does not own:

- source evidence creation,
- evidence mutation,
- mastery state transition,
- curriculum definition,
- skill graph mutation,
- intervention selection,
- UI presentation.

## 3. Evaluation Request

```ts
interface MasteryEvaluationRequest {
  evaluationId: string;
  tenantId: string;
  learnerId: string;
  masteryRecordId: string;
  skillId: string;
  curriculumVersion: string;
  skillDefinitionVersion: string;
  masteryPolicyVersion: string;
  evaluationModelVersion: string;
  evidenceCutoffAt: string;
  requestedAt: string;
  requestedBy: string;
  correlationId: string;
  idempotencyKey: string;
}
```

The same request context and evidence set must produce the same evaluation result.

## 4. Input Snapshot

The evaluator consumes an immutable input snapshot.

```ts
interface EvaluationInputSnapshot {
  request: MasteryEvaluationRequest;
  skillDefinition: SkillDefinitionSnapshot;
  policy: MasteryPolicySnapshot;
  qualifiedEvidence: QualifiedMasteryEvidence[];
  previousDecision: PreviousMasteryDecisionSnapshot | null;
  prerequisiteContext: PrerequisiteContextSnapshot;
  accommodationContext: AccommodationContextSnapshot | null;
  generatedAt: string;
  inputHash: string;
}
```

The snapshot must be persisted or reconstructible. Runtime clock access, network lookups, random values, or mutable external state are forbidden during deterministic evaluation.

## 5. Skill Definition Snapshot

```ts
interface SkillDefinitionSnapshot {
  skillId: string;
  version: string;
  conceptualDimensions: string[];
  proceduralDimensions: string[];
  applicationDimensions: string[];
  transferDimensions: string[];
  requiredContexts: string[];
  knownMisconceptions: string[];
  prerequisiteSkillIds: string[];
}
```

Evaluation judges the learner against this versioned meaning, not against a mutable current label.

## 6. Mastery Policy Snapshot

```ts
interface MasteryPolicySnapshot {
  policyVersion: string;
  minimumCoverage: EvidenceCoverageThreshold;
  minimumConfidence: number;
  minimumIndependentSources: number;
  retentionRequirement: RetentionRequirement;
  contradictionPolicy: ContradictionPolicy;
  scoreAggregationPolicy: ScoreAggregationPolicy;
  trustWeights: Record<string, number>;
  levelThresholds: Record<string, MasteryLevelThreshold>;
  humanReviewRules: HumanReviewRule[];
  staleEvidenceRules: StaleEvidenceRule[];
}
```

Policy versions are immutable after activation. Corrections require a new version.

## 7. Qualified Evidence

```ts
interface QualifiedMasteryEvidence {
  evidenceId: string;
  evidenceVersion: number;
  evidenceType: string;
  observedAt: string;
  trustClass: string;
  independenceGroup: string;
  dimensions: EvidenceDimensionMeasurement[];
  contextTags: string[];
  correctness: number | null;
  assistanceLevel: number;
  responseLatencyMs: number | null;
  contradictionTags: string[];
  freshnessState: 'CURRENT' | 'AGING' | 'STALE';
  admissibility: 'ADMITTED' | 'LIMITED';
  contributionLimit: number | null;
}
```

Only evidence already qualified under 37E may enter the evaluator.

## 8. Evaluation Pipeline

The deterministic pipeline is:

```text
Validate Request
  -> Freeze Inputs
  -> Normalize Evidence
  -> Deduplicate Dependence
  -> Calculate Dimension Coverage
  -> Calculate Independence
  -> Calculate Confidence
  -> Evaluate Durability
  -> Detect Contradictions
  -> Calculate Candidate Level
  -> Apply Policy Gates
  -> Determine Review Requirement
  -> Produce Evaluation Result
```

No stage may silently skip a failed gate.

## 9. Evidence Normalization

Normalization converts heterogeneous evidence into policy-defined measurements while preserving provenance.

Rules:

- source values are never overwritten,
- transformed values include transformer version,
- assistance is separated from correctness,
- response speed is separated from conceptual accuracy,
- missing dimensions remain missing rather than being treated as zero,
- inaccessible modality results are not interpreted as conceptual failure when accommodation policy says otherwise.

## 10. Dependence and Deduplication

Repeated observations derived from the same underlying attempt must not masquerade as independent evidence.

Evidence shares an independence group when it originates from:

- the same assessment attempt,
- the same generated response,
- the same teacher observation session,
- duplicated imports,
- transformed copies of one source event.

The evaluator may aggregate dependent evidence, but it counts as one independent source unless policy explicitly defines another rule.

## 11. Coverage Calculation

Coverage is calculated separately for:

```text
Conceptual understanding
Procedural execution
Application
Transfer
Retention
Independence
Context diversity
Misconception exposure
```

Representative model:

```ts
interface DimensionCoverageResult {
  dimension: string;
  requiredWeight: number;
  observedWeight: number;
  coverageRatio: number;
  independentSourceCount: number;
  contextCount: number;
  unmetRequirements: string[];
}
```

An overall percentage may be projected, but policy gates operate on individual required dimensions.

## 12. Confidence Calculation

Confidence measures how strongly the admitted evidence supports the calculated candidate outcome.

Confidence may consider:

- evidence trust,
- source independence,
- consistency,
- recency,
- context diversity,
- sample sufficiency,
- measurement reliability,
- assistance level,
- contradiction severity.

Confidence is not learner ability. It is confidence in the decision basis.

## 13. Durability Evaluation

Durability evaluates whether demonstrated understanding persists.

```ts
type EvaluatedDurability =
  | 'INSUFFICIENT_TIME_SPAN'
  | 'SINGLE_OCCURRENCE'
  | 'REPEATED_SHORT_TERM'
  | 'RETAINED_ACROSS_INTERVAL'
  | 'DECAY_DETECTED'
  | 'CONTRADICTED';
```

Retention windows are policy-defined and skill-sensitive. Immediate repeated success cannot be relabeled as long-term retention.

## 14. Contradiction Detection

Contradiction exists when valid evidence materially conflicts with the candidate outcome.

Examples:

- high procedural accuracy but persistent conceptual misconception,
- mastered result followed by repeated independent failure,
- transfer success inconsistent with foundational task failure,
- teacher-verified understanding conflicting with multiple system-verified attempts,
- evidence mapped to incompatible skill-definition versions.

Contradictions must be classified:

```ts
type ContradictionSeverity =
  | 'NONE'
  | 'MINOR'
  | 'MATERIAL'
  | 'BLOCKING';
```

Policy determines whether the evaluator lowers confidence, requires review, marks at risk, or blocks mastery.

## 15. Candidate Outcome

```ts
interface CandidateMasteryOutcome {
  candidateStatus:
    | 'EVIDENCE_INSUFFICIENT'
    | 'NOT_MASTERED'
    | 'EMERGING'
    | 'MASTERED'
    | 'MASTERED_WITH_REVIEW'
    | 'AT_RISK';
  candidateLevel: 'NONE' | 'FOUNDATIONAL' | 'FUNCTIONAL' | 'FLUENT' | 'TRANSFERABLE';
  confidence: number;
  durability: EvaluatedDurability;
  coverage: EvidenceCoverage;
  reviewRequired: boolean;
}
```

This is a recommendation to Decision Runtime, not an authoritative state mutation.

## 16. Level Calculation

A higher mastery level requires all lower-level mandatory gates unless policy explicitly defines an equivalent path.

```text
FOUNDATIONAL
  -> FUNCTIONAL
  -> FLUENT
  -> TRANSFERABLE
```

Transferable performance cannot hide missing foundational understanding. Exceptional advanced evidence may trigger review but may not silently bypass required conceptual gates.

## 17. Prerequisite Context

Prerequisite mastery can affect interpretation and recommended next evidence, but it cannot directly determine the target skill outcome.

Allowed uses:

- explain likely blockers,
- classify errors,
- recommend diagnostic follow-up,
- detect graph inconsistency,
- inform review priority.

Forbidden use:

```text
Prerequisite mastered => target mastered
Prerequisite missing => target automatically not mastered
```

Direct target evidence remains required.

## 18. Accommodation Context

Accessibility accommodations alter evidence collection or interpretation rules without silently changing skill meaning.

Examples:

- extended response time,
- non-text representation,
- audio delivery,
- alternative input device,
- reduced visual clutter,
- language support where language is not the target skill.

The evaluator records applicable accommodations in its explanation. It must not penalize an accommodated pathway merely for differing from the default modality.

## 19. Human Review Trigger

Evaluation may require human review when:

- contradiction is material,
- evidence comes primarily from lower-trust sources,
- policy version requires teacher confirmation,
- accessibility context falls outside automated model coverage,
- potential bias or anomaly is detected,
- curriculum equivalence is unresolved,
- the result would revoke a high-impact mastery decision.

The evaluator emits review reasons and required reviewer authority.

## 20. Evaluation Result

```ts
interface MasteryEvaluationResult {
  evaluationId: string;
  masteryRecordId: string;
  inputHash: string;
  resultVersion: number;
  candidate: CandidateMasteryOutcome;
  admittedEvidenceIds: string[];
  limitedEvidenceIds: string[];
  rejectedEvidenceIds: string[];
  dimensionResults: DimensionCoverageResult[];
  contradictions: EvaluationContradiction[];
  unmetCriteria: string[];
  reviewReasons: string[];
  recommendedNextEvidence: NextEvidenceRecommendation[];
  explanation: EvaluationExplanation;
  evaluatedAt: string;
}
```

`evaluatedAt` is supplied by orchestration and excluded from deterministic scoring.

## 21. Explanation Contract

The explanation must answer:

1. What was evaluated?
2. Which evidence contributed?
3. Which evidence was limited or rejected and why?
4. Which dimensions passed?
5. Which dimensions remain incomplete?
6. What contradictions were found?
7. Why was the candidate status and level selected?
8. Is human review required?
9. What evidence would most efficiently reduce uncertainty?

Explanations must be suitable for both machine audit and simplified learner/parent/teacher projections.

## 22. Recommended Next Evidence

The evaluator may recommend evidence needs, not learning activities.

Examples:

```text
Need an independent conceptual explanation
Need a delayed retention check after 14 days
Need application evidence in a novel context
Need unassisted procedural attempt
Need targeted evidence for misconception M-17
Need teacher review of conflicting observations
```

Recommendation Engine or Learning Journey Runtime decides how to obtain that evidence.

## 23. Determinism

Evaluation is deterministic when:

- input snapshot is identical,
- evaluator version is identical,
- ordering rules are canonical,
- arithmetic precision is fixed,
- timestamps are treated only as provided inputs,
- no network or mutable database reads occur during calculation,
- no randomness influences the outcome.

The runtime stores an `inputHash` and `resultHash` for replay comparison.

## 24. Idempotency

Duplicate evaluation requests with the same idempotency key and identical payload return the existing result.

The same key with a different payload fails with `IDEMPOTENCY_CONFLICT`.

Concurrent evaluations for the same mastery record may complete, but Decision Runtime must apply only a result whose context and expected decision version remain valid.

## 25. Staleness

An evaluation result becomes stale when:

- new relevant evidence exists beyond the cutoff,
- policy version is no longer accepted for new decisions,
- skill definition changed incompatibly,
- source evidence was invalidated or superseded,
- previous decision version changed before application.

Stale results remain historical artifacts but cannot authorize a new transition.

## 26. Failure Outcomes

```text
EVALUATION_REQUEST_INVALID
INPUT_SNAPSHOT_INCOMPLETE
INPUT_HASH_MISMATCH
POLICY_NOT_FOUND
SKILL_DEFINITION_NOT_FOUND
EVALUATOR_VERSION_UNSUPPORTED
QUALIFIED_EVIDENCE_REQUIRED
EVIDENCE_SKILL_MISMATCH
EVIDENCE_AFTER_CUTOFF
DEPENDENCE_GROUP_INVALID
NUMERIC_PRECISION_VIOLATION
EVALUATION_NON_DETERMINISTIC
HUMAN_REVIEW_REQUIRED
EVALUATION_RESULT_STALE
IDEMPOTENCY_CONFLICT
```

## 27. Verification Scenarios

Minimum verification includes:

- same inputs produce identical result and hashes,
- reordered evidence produces identical result,
- duplicate dependent evidence does not increase independence,
- missing required dimension blocks mastery,
- high score with low conceptual coverage does not pass conceptual gate,
- stale evidence follows policy,
- contradictory evidence triggers declared behavior,
- accommodations do not lower conceptual requirements,
- new evidence beyond cutoff does not leak into the evaluation,
- prerequisite state does not directly determine target mastery,
- replay produces the original result,
- unsupported policy or model versions fail explicitly.

## 28. Runtime Invariants

1. Evaluation output is not authoritative mastery state.
2. Every evaluation uses an immutable, versioned input snapshot.
3. Evidence ordering cannot change the result.
4. Dependent evidence cannot inflate independent-source counts.
5. Missing evidence is not equivalent to failure evidence.
6. Confidence describes decision support, not learner worth.
7. Correctness, assistance, latency, and modality remain separate features.
8. Prerequisite mastery cannot substitute for direct target evidence.
9. Accessibility accommodation cannot silently weaken skill meaning.
10. A stale evaluation cannot authorize a new decision.
11. Rejected evidence must include a reason.
12. Deterministic replay must reproduce the result hash.
13. Higher mastery levels cannot bypass mandatory lower-level gates.
14. Human review requirement must be explicit and attributable.
15. Recommended next evidence is not an intervention command.

## 29. Handoff to 37C

37B produces a candidate outcome and a complete explanation package. 37C decides whether that candidate may become the next authoritative mastery state under aggregate lifecycle, expected version, policy authority, review authority, and transition safety rules.
