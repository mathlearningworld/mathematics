# 34E — Intervention Effectiveness Runtime

## Status

- Chapter: 34 — Intervention Runtime
- Slice: 34E
- Authority: Architecture specification
- Depends on: 34A–34D, Assessment Engine, Diagnostic Runtime, Progress Engine, Skill Graph Runtime

## Purpose

Intervention Effectiveness Runtime determines what may reasonably be concluded about the outcome of an intervention from observed evidence.

It separates delivery, participation, completion, short-term performance, durable understanding, transfer, and downstream progress so that the system does not declare success merely because an activity ended or a score increased once.

## Core Doctrine

> Effectiveness is an evidence-backed judgment about change relative to an intervention target, not a synonym for completion or learner compliance.

Required distinctions:

```text
Delivered ≠ Engaged
Engaged ≠ Completed
Completed ≠ Improved
Improved ≠ Mastered
Mastered in context ≠ Transferable
Correlation ≠ Causation
No observed benefit ≠ No possible benefit
```

## Responsibilities

This runtime owns:

1. effectiveness evaluation windows,
2. target-outcome comparison,
3. evidence sufficiency checks,
4. execution-fidelity checks,
5. baseline and counterfactual context,
6. immediate, retained, and transfer outcomes,
7. confidence and uncertainty representation,
8. classification of effectiveness,
9. requests for more evidence,
10. feedback to Diagnostic, Recommendation, Mission, Learning, and Progress runtimes.

It does not own:

- intervention execution,
- diagnostic truth,
- curriculum standards,
- final learner identity labels,
- unrestricted causal claims,
- automatic pricing or access decisions.

## Evaluation Dimensions

```text
EXECUTION_FIDELITY
PARTICIPATION
TARGET_PERFORMANCE
INDEPENDENCE
RETENTION
TRANSFER
ERROR_PATTERN_CHANGE
HINT_DEPENDENCE_CHANGE
CONFIDENCE_CALIBRATION
DOWNSTREAM_SKILL_EFFECT
LEARNER_BURDEN
ACCESSIBILITY_FIT
SAFETY_OUTCOME
```

Each dimension must report evidence, time window, method, and uncertainty independently.

## Effectiveness Lifecycle

```text
NOT_READY
BASELINE_PENDING
OBSERVING
EVALUATION_READY
EVALUATING
EFFECTIVE
PARTIALLY_EFFECTIVE
INEFFECTIVE
HARMFUL_OR_UNSAFE
INCONCLUSIVE
STALE
SUPERSEDED
```

`INCONCLUSIVE` is a valid result and must not be coerced into success or failure.

## Evaluation Record

```ts
interface InterventionEffectivenessEvaluation {
  evaluationId: string;
  interventionId: string;
  planVersion: string;
  executionIds: string[];
  targetRefs: string[];
  baselineEvidenceRefs: string[];
  outcomeEvidenceRefs: string[];
  evaluationWindow: EvaluationWindow;
  dimensions: EffectivenessDimensionResult[];
  executionFidelity: ExecutionFidelityResult;
  classification: EffectivenessClassification;
  confidence: ConfidenceProfile;
  limitations: EvaluationLimitation[];
  recommendedNextStep: EffectivenessNextStep;
  modelVersion: string;
  policyVersion: string;
  evaluatedAt: string;
}
```

## Evaluation Windows

An intervention may require several windows:

```text
IMMEDIATE
SESSION_END
SHORT_RETENTION
LONG_RETENTION
NEAR_TRANSFER
FAR_TRANSFER
DOWNSTREAM_PROGRESS
```

A positive immediate result must not automatically satisfy retention or transfer criteria.

## Baseline

Baseline evidence should be:

- relevant to the same target,
- sufficiently recent,
- measured under comparable conditions when possible,
- versioned against the applicable skill and curriculum definitions,
- explicit about missing context.

When no reliable baseline exists, the runtime must lower confidence or return `INCONCLUSIVE` rather than fabricate improvement.

## Execution Fidelity

Before interpreting outcomes, the runtime evaluates whether the intervention was delivered as authorized.

```text
FULL_FIDELITY
ACCEPTABLE_VARIATION
MATERIAL_DEVIATION
INSUFFICIENT_EXECUTION_DATA
NOT_EXECUTED
```

Material deviations include:

- wrong strategy version,
- incomplete dosage,
- incorrect phase order,
- missing accommodation,
- channel failure,
- unauthorized adaptation,
- excessive interruption,
- evidence capture failure.

Poor fidelity may explain weak outcomes, but it does not prove that the intervention strategy would otherwise be effective.

## Effectiveness Classifications

### EFFECTIVE

Evidence supports meaningful improvement on the authorized target with acceptable fidelity and no material safety concern.

### PARTIALLY_EFFECTIVE

Some target dimensions improved, but important gaps remain, retention or transfer is weak, or benefit is limited to a subset of contexts.

### INEFFECTIVE

Sufficient evidence under acceptable fidelity shows no meaningful target improvement within the defined evaluation window.

### HARMFUL_OR_UNSAFE

Evidence shows material harm, distress, increased misconception, inequitable burden, or a safety breach.

### INCONCLUSIVE

Evidence is missing, contradictory, stale, low quality, incomparable, or confounded.

## Confidence Profile

Confidence must be multi-dimensional:

```ts
interface ConfidenceProfile {
  evidenceQuality: number;
  executionFidelityConfidence: number;
  targetAlignment: number;
  temporalCoverage: number;
  transferCoverage: number;
  confoundingRisk: number;
  overallBand: 'LOW' | 'MODERATE' | 'HIGH';
}
```

A single opaque score is insufficient for high-impact decisions.

## Confounding Factors

The runtime must preserve possible confounders such as:

- concurrent tutoring,
- curriculum exposure elsewhere,
- repeated item familiarity,
- changed assessment difficulty,
- language support,
- fatigue or illness,
- device or channel changes,
- adult assistance,
- motivation and reward effects,
- inaccessible content,
- changes in the skill graph or diagnostic model.

Confounders reduce causal confidence; they do not invalidate observed improvement.

## Target Alignment

Outcome evidence must be compared to the intervention target.

Examples:

- A fluency intervention should not be declared effective solely from improved conceptual explanation.
- A misconception intervention should not be declared effective solely from faster procedural completion.
- A transfer intervention requires novel-context evidence.
- An accessibility adaptation may be effective by reducing barriers even before mastery changes.

## Understanding Debt Resolution

An effectiveness result may support a debt-state transition, but it cannot directly erase understanding debt.

Resolution requires the authority defined by Diagnostic Runtime and must consider:

- retained performance,
- independence,
- transfer,
- contradiction evidence,
- downstream stability.

## Comparative Effectiveness

The runtime may compare intervention strategies only when comparison metadata is explicit:

- target equivalence,
- learner/context comparability,
- version compatibility,
- evaluation-window compatibility,
- evidence-quality compatibility.

Ranking strategies without these controls is prohibited.

## Next-Step Decisions

```text
CONTINUE
COMPLETE_AND_MONITOR
EXTEND_OBSERVATION
ADAPT_WITHIN_PLAN
REPLAN
REQUEST_DIAGNOSTIC_REVIEW
REQUEST_ADDITIONAL_ASSESSMENT
ESCALATE_TO_HUMAN
STOP_FOR_SAFETY
NO_ACTION
```

The next step must preserve the reason, evidence, confidence, and authority.

## Feedback Contracts

### To Diagnostic Runtime

- effectiveness classification,
- outcome evidence references,
- contradiction to active hypothesis,
- request for diagnostic review.

### To Recommendation Runtime

- strategy outcome,
- context and target,
- execution fidelity,
- confidence and limitations.

### To Mission and Learning Runtimes

- continue, adapt, complete, pause, or replace guidance,
- target status,
- safe next action.

### To Progress Engine

- verified progress evidence,
- retention and transfer evidence,
- uncertainty and freshness.

## Failure Codes

```text
BASELINE_MISSING
BASELINE_STALE
OUTCOME_EVIDENCE_MISSING
OUTCOME_EVIDENCE_INCOMPARABLE
EVALUATION_WINDOW_INCOMPLETE
EXECUTION_FIDELITY_UNKNOWN
TARGET_MISMATCH
TRANSFER_EVIDENCE_MISSING
RETENTION_EVIDENCE_MISSING
CONFOUNDING_RISK_HIGH
POLICY_BLOCKED
MODEL_VERSION_UNAVAILABLE
EVALUATION_ALREADY_FINALIZED
CONCURRENT_EVALUATION_CONFLICT
```

## Events

```text
EffectivenessEvaluationRequested
EffectivenessBaselineAccepted
EffectivenessOutcomeEvidenceAccepted
ExecutionFidelityEvaluated
EffectivenessEvaluationStarted
InterventionMarkedEffective
InterventionMarkedPartiallyEffective
InterventionMarkedIneffective
InterventionMarkedHarmfulOrUnsafe
EffectivenessMarkedInconclusive
AdditionalEvidenceRequested
DiagnosticReviewRequestedFromOutcome
```

## Acceptance Criteria

34E is complete when:

- completion and effectiveness are structurally separate,
- immediate, retained, and transfer outcomes are distinguishable,
- baseline and fidelity are explicit,
- uncertainty and confounders remain visible,
- `INCONCLUSIVE` is preserved,
- effectiveness can inform but not silently rewrite diagnosis or progress,
- harmful or unsafe outcomes stop optimization behavior.

## Runtime Invariants

1. No effectiveness claim without target-aligned evidence.
2. No durable mastery claim from immediate performance alone.
3. No transfer claim without novel-context evidence.
4. No causal claim from correlation alone.
5. No ineffective classification when execution fidelity is materially unknown unless policy explicitly permits a limited operational judgment.
6. No success declaration may hide learner burden or safety concerns.
7. Every classification must expose limitations and confidence.
8. Completion never implies effectiveness.
