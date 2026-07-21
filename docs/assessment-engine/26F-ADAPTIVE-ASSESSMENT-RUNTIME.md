# 26F — Adaptive Assessment Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26F
- State: ADAPTIVE ASSESSMENT RUNTIME DEFINED
- Depends on: 26A Assessment Engine Foundation, 26B Assessment Evidence Runtime, 26C Assessment Model Runtime, 26D Readiness Evaluation Runtime, 26E Misconception Assessment Runtime

---

## 1. Purpose

The Adaptive Assessment Runtime selects the next evidence-generating opportunity needed to reduce uncertainty about a bounded assessment question.

It does not continuously test the learner for its own sake. It adapts only when additional evidence has meaningful decision value.

---

## 2. Runtime Position

```text
Assessment Question
+ Current Evidence Set
+ Assessment Claims
+ Readiness Risks
+ Misconception Hypotheses
+ Available Opportunities
+ Learner Context
+ Adaptive Policy
        ↓
Adaptive Assessment Runtime
        ↓
Next Evidence Opportunity
or
Assessment Stop Decision
```

---

## 3. Core Principle

The runtime asks:

> What is the smallest, safest, most informative next opportunity that could materially improve the current assessment decision?

It must not ask:

> What is the next harder question we can give?

---

## 4. Authority Boundary

The runtime owns:

- assessment uncertainty resolution,
- candidate evidence-opportunity eligibility,
- information-value estimation,
- representation and context rotation,
- challenge calibration,
- support-condition calibration,
- burden and fatigue constraints,
- stop, defer, and escalate decisions.

It does not own:

- learning-state mutation,
- mastery creation,
- final assessment interpretation,
- mission execution,
- world-state mutation,
- recommendation ranking outside the assessment purpose,
- punitive gating.

---

## 5. Assessment Question

```ts
export interface AdaptiveAssessmentQuestion {
  questionId: string;
  purpose:
    | 'EVIDENCE_SUFFICIENCY'
    | 'READINESS_DISAMBIGUATION'
    | 'MISCONCEPTION_DISCRIMINATION'
    | 'TRANSFER_CONFIRMATION'
    | 'RETENTION_CHECK'
    | 'INDEPENDENCE_CHECK'
    | 'REPRESENTATION_COVERAGE'
    | 'SUPPORT_DEPENDENCE_CHECK';
  learnerId: string;
  conceptScope: string[];
  targetRef?: string;
  claimRefs: string[];
  uncertaintyCodes: string[];
  policyRef: string;
}
```

Every adaptive sequence begins with an explicit question and ends when that question is sufficiently resolved or should be deferred.

---

## 6. Candidate Opportunity

```ts
export interface AssessmentOpportunity {
  opportunityId: string;
  opportunityVersion: string;
  conceptScope: string[];
  representation: string;
  context: string;
  difficultyBand: string;
  expectedStrategies: string[];
  supportOptions: string[];
  estimatedDurationSeconds: number;
  evidenceKindsProduced: string[];
  worldOrMissionRef?: string;
  availabilityWindow?: string;
}
```

An opportunity may be embedded in normal gameplay, a short diagnostic interaction, a mission variation, or a deliberate assessment moment.

---

## 7. Candidate Eligibility

A candidate is eligible only when:

- its concept scope matches the assessment question,
- it can produce one or more required evidence kinds,
- its version and provenance are known,
- it does not violate safety or accessibility constraints,
- it is available in the current learner context,
- it does not duplicate recently collected low-value evidence,
- it stays within burden policy.

Eligibility and ranking remain separate.

---

## 8. Information Value

Information value estimates how much an opportunity could reduce uncertainty.

```ts
export interface InformationValueEstimate {
  opportunityId: string;
  uncertaintyTargets: string[];
  expectedDiscriminationPower: number;
  expectedCoverageGain: number;
  expectedContradictionResolution: number;
  noveltyValue: number;
  burdenCost: number;
  fatigueRisk: number;
  accessibilityRisk: number;
  totalUtility: number;
  explanationCodes: string[];
}
```

The runtime must not use difficulty as a proxy for information value.

---

## 9. Adaptation Dimensions

The runtime may adapt:

```text
DIFFICULTY
REPRESENTATION
CONTEXT
LANGUAGE_DENSITY
NUMBER_COMPLEXITY
STEP_COUNT
TIME_PRESSURE
SUPPORT_AVAILABILITY
HINT_TIMING
STRATEGY_CONSTRAINT
TRANSFER_DISTANCE
DISTRACTOR_STRUCTURE
RESPONSE_MODE
```

Adaptation decisions must preserve the assessment question.

---

## 10. Representation Rotation

Repeated success in one representation cannot establish broad understanding.

Example rotation:

```text
Concrete Objects
    ↓
Diagram
    ↓
Number Line
    ↓
Words
    ↓
Symbols
```

The runtime selects only the representations necessary to resolve the current uncertainty. It does not force every representation in every sequence.

---

## 11. Context Rotation

Context rotation tests whether knowledge remains available beyond a familiar surface.

```text
Same Concept + Familiar Context
        ↓
Same Concept + New Surface Context
        ↓
Near Transfer Context
        ↓
Cross-Representation Context
```

Context novelty must be calibrated so that language or world knowledge does not accidentally dominate the mathematical construct being assessed.

---

## 12. Difficulty Calibration

Difficulty is calibrated around evidence value, not reward escalation.

```text
TOO_EASY
INFORMATIVE_LOW
TARGET_BAND
INFORMATIVE_HIGH
TOO_DIFFICULT
CONSTRUCT_CONTAMINATED
```

An overly difficult opportunity may reveal frustration or language burden rather than mathematical understanding.

---

## 13. Support Calibration

The runtime may compare performance under support conditions:

```text
INDEPENDENT
PROMPT_ONLY
VISUAL_SUPPORT
STRATEGY_REMINDER
WORKED_EXAMPLE_ACCESS
STEPWISE_HINTS
FULL_GUIDANCE
```

Support use must remain evidence, not be treated as invisible assistance.

A sequence may intentionally reduce support to test independence, but only under explicit policy and learner burden constraints.

---

## 14. Hint-Aware Evidence

Hint evidence records:

- whether a hint was offered,
- whether it was requested,
- hint level,
- timing,
- learner action after the hint,
- whether strategy changed,
- whether success generalized afterward.

Correct performance after a full solution reveal cannot be classified as independent evidence.

---

## 15. Misconception Discrimination

When competing misconception hypotheses exist, the runtime selects opportunities that produce different expected outcomes for each hypothesis.

```text
Hypothesis A predicts denominator-only comparison
Hypothesis B predicts visual-model confusion
        ↓
Select one symbolic comparison
+ one visual comparison
        ↓
Observe discriminating pattern
```

The runtime must preserve uncertainty when no safe opportunity can discriminate adequately.

---

## 16. Readiness Disambiguation

For uncertain readiness, adaptive assessment targets the smallest unresolved blocking requirement.

```text
Readiness Claim: READINESS_UNCERTAIN
Blocking uncertainty: word-to-equation translation
        ↓
Select two independent opportunities
across different contexts
        ↓
Rebuild Evidence Set
        ↓
Reevaluate Readiness
```

It must not repeat already-established requirements merely to increase a total score.

---

## 17. Continuous Assessment

Assessment opportunities may be embedded in ordinary play when:

- the opportunity naturally fits the learner's current activity,
- evidence provenance remains clear,
- the learner is not deceived about high-stakes consequences,
- gameplay goals do not contaminate the construct,
- repeated measurement burden remains bounded.

Continuous assessment does not mean constant judgment.

---

## 18. Explicit Assessment Mode

An explicit assessment interaction may be used when:

- a formal target requires controlled conditions,
- embedded evidence is insufficient,
- transfer needs deliberate comparison,
- retention requires delayed checking,
- support dependence must be isolated,
- human review requests a bounded diagnostic.

Explicit mode must still preserve accessibility and explainability.

---

## 19. Learner Burden Model

```ts
export interface AssessmentBurdenState {
  activeDurationSeconds: number;
  opportunitiesCompleted: number;
  recentErrorDensity: number;
  repeatedRepresentationCount: number;
  hintEscalationCount: number;
  pauseSignals: string[];
  frustrationSignals: string[];
  disengagementSignals: string[];
  burdenClassification:
    | 'LOW'
    | 'MODERATE'
    | 'HIGH'
    | 'STOP_REQUIRED';
}
```

Burden state influences eligibility, ranking, and termination.

---

## 20. Fatigue and Frustration

The runtime must distinguish uncertainty caused by insufficient evidence from evidence collected under degraded conditions.

Signals may include:

- sharply increased response latency,
- repeated random actions,
- abandonment,
- rapidly escalating hint requests,
- performance collapse across unrelated concepts,
- explicit pause request.

These signals may cause deferment rather than a negative learner claim.

---

## 21. Accessibility

Adaptive assessment respects:

- reading accessibility,
- motor accessibility,
- sensory presentation needs,
- language preference,
- input modality,
- timing accommodations,
- support policies.

Accessibility support is not automatically evidence of mathematical dependence.

The runtime must distinguish construct support from access support.

---

## 22. Opportunity Ranking

```text
Eligible Candidates
        ↓
Information Value
+ Coverage Gain
+ Discrimination Power
- Burden Cost
- Fatigue Risk
- Accessibility Risk
- Redundancy
        ↓
Ranked Candidate Set
```

The selected opportunity must include an explanation of why it is preferred.

---

## 23. Adaptive Decision

```ts
export interface AdaptiveAssessmentDecision {
  decisionId: string;
  questionId: string;
  decisionType:
    | 'PRESENT_OPPORTUNITY'
    | 'STOP_SUFFICIENT'
    | 'STOP_BURDEN'
    | 'DEFER'
    | 'ESCALATE_HUMAN_REVIEW'
    | 'NO_ELIGIBLE_OPPORTUNITY';
  selectedOpportunityId?: string;
  rankedAlternatives?: string[];
  explanationCodes: string[];
  expectedEvidenceKinds: string[];
  policyVersion: string;
  modelVersion: string;
  createdAt: string;
}
```

---

## 24. Termination Policy

A sequence stops when any of the following applies:

```text
UNCERTAINTY_RESOLVED
EVIDENCE_SUFFICIENT
DECISION_WOULD_NOT_CHANGE
BURDEN_LIMIT_REACHED
FATIGUE_OR_FRUSTRATION
NO_ELIGIBLE_OPPORTUNITY
ACCESSIBILITY_CONFLICT
TIME_WINDOW_ENDED
HUMAN_REVIEW_REQUIRED
LEARNER_REQUESTED_STOP
```

The runtime must not continue solely to complete a fixed question count.

---

## 25. Deferred Assessment

Deferral is valid when:

- the learner is fatigued,
- the required context is unavailable,
- delayed retention evidence is needed,
- current evidence is contaminated,
- a human review is pending,
- no safe discriminating opportunity exists.

A deferred decision records:

- unresolved question,
- reason,
- earliest reevaluation time,
- required context,
- required evidence kinds.

---

## 26. Evidence Publication

After opportunity execution, the runtime receives evidence from authoritative world, mission, or interaction runtimes.

```text
Adaptive Decision
        ↓
Mission / World Execution
        ↓
Authoritative Evidence Event
        ↓
Assessment Evidence Runtime
        ↓
New Frozen Evidence Set
        ↓
Assessment Model Reevaluation
```

The Adaptive Runtime never fabricates success or outcome evidence.

---

## 27. Replay and Determinism

Given the same:

- assessment question,
- claim state,
- evidence set,
- available opportunity catalog,
- learner context snapshot,
- burden state,
- model and policy versions,

the runtime must produce the same eligibility set and equivalent ranked decision.

When randomized presentation is allowed, the random seed must be recorded.

---

## 28. Privacy and Transparency

The runtime records only signals necessary for assessment operation.

It must not infer emotional or psychological diagnoses from interaction telemetry.

Human-facing systems should be able to explain:

- why another opportunity was selected,
- what uncertainty it addresses,
- why assessment stopped or was deferred,
- how support affected interpretation.

---

## 29. Failure Codes

```text
ADAPTIVE_QUESTION_NOT_FOUND
ADAPTIVE_QUESTION_INVALID
ADAPTIVE_POLICY_NOT_FOUND
ADAPTIVE_OPPORTUNITY_CATALOG_UNAVAILABLE
ADAPTIVE_NO_COMPATIBLE_EVIDENCE_KIND
ADAPTIVE_ACCESSIBILITY_CONFLICT
ADAPTIVE_BURDEN_STATE_INVALID
ADAPTIVE_DECISION_NON_DETERMINISTIC
ADAPTIVE_MODEL_FAILURE
ADAPTIVE_EXECUTION_EVIDENCE_MISSING
```

Runtime failures must not be translated into learner weakness.

---

## 30. Invariants

1. Every adaptive sequence has an explicit bounded assessment question.
2. Eligibility is evaluated before ranking.
3. Difficulty is not a proxy for information value.
4. Support and hint conditions remain visible in evidence.
5. Accessibility support is separated from construct support.
6. The runtime cannot fabricate evidence.
7. The runtime cannot mutate learning state or mastery.
8. Burden and learner stop signals can terminate a sequence.
9. No fixed item count overrides evidence sufficiency or burden policy.
10. Continuous assessment does not imply constant testing.
11. Identical versioned inputs produce equivalent decisions.
12. Assessment uncertainty may remain unresolved when safe evidence is unavailable.

---

## 31. Verification Scenarios

Required scenarios include:

- select representation needed for coverage,
- reject redundant low-value opportunity,
- discriminate two misconception hypotheses,
- resolve one readiness blocking uncertainty,
- calibrate support dependence,
- stop when evidence is sufficient,
- stop on burden limit,
- defer for delayed retention evidence,
- preserve accessibility support,
- no eligible opportunity,
- explicit learner stop request,
- deterministic ranking with identical inputs,
- recorded seed for randomized equivalent candidates,
- embedded gameplay evidence publication.

---

## 32. Completion Criteria

26F is complete when:

- adaptive assessment begins from an explicit question,
- candidate eligibility and ranking are separate,
- information value is multidimensional,
- representation, context, difficulty, and support adaptation are defined,
- misconception and readiness uncertainty can be targeted,
- burden, fatigue, accessibility, and stop policies are explicit,
- authoritative evidence publication is preserved,
- deterministic replay inputs are defined.

---

## 33. Architectural Outcome

The Adaptive Assessment Runtime turns assessment from a fixed test into a bounded evidence-seeking process.

It gathers only the evidence needed to reduce meaningful uncertainty, while protecting learner agency, accessibility, instructional flow, and the distinction between assessment and learning authority.
