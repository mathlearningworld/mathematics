# 16B — Learner Readiness & Cognitive Diagnosis

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16B — Learner Readiness & Cognitive Diagnosis  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16A.5-RATIO-PROPORTIONAL-REASONING-VALIDATION-SLICE.md`  
**Downstream Consumers:** 16C Mission Definition & Generation, 16D World Activity Binding, 16E Mathematical Evidence & Assessment, 16F Hint & Mentor Support, 16G Mastery & Progression, 16H Remediation, 16I Parent/Teacher Projection

---

## 1. Purpose

This guide defines how Math Learning World forms a bounded, evidence-backed hypothesis about a learner's current mathematical thinking and determines whether the learner is ready for a particular cognitive transformation.

The system must not reduce readiness to grade level, lesson completion, question accuracy, or a single test result. It must interpret evidence of representation, reasoning, strategy, explanation, transfer, assistance, consistency, and retention against the authoritative Cognitive Transformation Graph.

The central doctrine is:

> The game never diagnoses from answers alone. It diagnoses from evidence of thinking.

A correct answer may be evidence, but it is never sufficient authority by itself. An incorrect answer may reveal productive reasoning, partial understanding, a stable misconception, an execution slip, or an unsuitable representation. Phase 16B exists to preserve those distinctions.

---

## 2. Architectural Position

The runtime flow is:

```text
World Action or Learning Interaction
        ↓
Raw Evidence Event
        ↓
Evidence Interpretation
        ↓
Cognitive-State Hypothesis
        ↓
Diagnosis Confidence
        ↓
Readiness Decision
        ↓
Recommended Cognitive Transformation
        ↓
Mission Request for Phase 16C
```

Phase 16B does not generate a complete mission. It produces an authoritative diagnosis and a constrained request describing what kind of transformation experience should happen next.

---

## 3. Authority Boundary

Phase 16B owns:

- learner-specific cognitive-state hypotheses;
- diagnosis confidence and uncertainty;
- misconception hypotheses;
- prerequisite-readiness evaluation;
- readiness decisions for cognitive transformations;
- evidence sufficiency decisions for diagnosis;
- contradiction and ambiguity detection;
- stale-diagnosis detection;
- recommended next transformation candidates;
- diagnosis history and supersession rules;
- safe fallback behavior when evidence is insufficient.

Phase 16B does not own:

- definitions of mathematical targets, states, misconceptions, or transformations;
- concrete mission composition;
- NPC dialogue, world task design, or reward presentation;
- final evidence scoring policy owned by Phase 16E;
- individual mastery transitions owned by Phase 16G;
- remediation mission design owned by Phase 16H;
- parent- or teacher-facing presentation owned by Phase 16I.

Phase 16A defines what understanding means. Phase 16B determines the best current hypothesis about an individual learner.

---

## 4. Learner Cognitive State Engine

Phase 16B establishes the **Learner Cognitive State Engine**.

```text
Learner Cognitive State Engine
│
├── Evidence Intake
├── Evidence Interpreter
├── Cognitive Hypothesis Builder
├── Misconception Detector
├── Confidence Evaluator
├── Readiness Evaluator
├── Contradiction Resolver
├── Staleness Evaluator
├── Transformation Recommender
└── Cognitive Snapshot Repository
```

The engine must remain deterministic for the same authoritative graph version, learner evidence set, and policy version.

It may use probabilistic reasoning internally, but persisted outputs must record the evidence, policy, graph version, and explanation required to reproduce or audit the result.

---

## 5. Core Doctrine

### 5.1 Evidence of Thinking over Answer Outcome

Diagnosis must consider how the learner acted, not only whether the final result matched an expected value.

Relevant signals may include:

- representations selected or created;
- quantities attended to or ignored;
- strategy sequence;
- transformations applied;
- comparisons made;
- explanation or justification;
- corrections after feedback;
- transfer to a changed context;
- dependence on hints, tools, peers, or mentors;
- response consistency across time;
- confidence expressed by the learner;
- action latency when it is educationally meaningful;
- persistence and revision behavior.

Latency, speed, and confidence must never independently define understanding.

### 5.2 Diagnosis is a Hypothesis

A diagnosis is not an identity label and must not be treated as a permanent property of the learner.

The engine records:

> Given this graph version, this evidence set, and this diagnosis policy, the most defensible current hypothesis is that the learner is reasoning from this cognitive state with this degree of confidence.

### 5.3 Uncertainty is Authoritative Information

The engine must be allowed to return:

- insufficient evidence;
- conflicting evidence;
- multiple plausible states;
- stale evidence;
- context-dependent understanding;
- representation-dependent understanding;
- assistance-dependent performance.

It must not force a precise diagnosis merely to simplify mission generation.

### 5.4 Readiness is Transformation-Specific

A learner is not globally `READY` or `NOT_READY`.

Readiness is evaluated for a specific transformation or target under specific prerequisite and evidence requirements.

A learner may be ready to move from a procedural model to a conceptual model in one representation while not yet ready to transfer the same idea into a new world context.

---

## 6. Core Domain Model

### 6.1 Learner Cognitive Snapshot

A Learner Cognitive Snapshot is the current authoritative projection for one learner and one graph scope.

```text
LearnerCognitiveSnapshot
- snapshotId
- learnerId
- graphVersion
- diagnosisPolicyVersion
- domain
- conceptId
- learningTargetId
- currentStateHypotheses
- primaryStateId
- stateConfidence
- misconceptionHypotheses
- prerequisiteReadiness
- evidenceSummary
- evidenceRefs
- contradictionFlags
- contextLimitations
- representationLimitations
- assistanceDependency
- recommendedTransformationCandidates
- freshness
- observedFrom
- observedUntil
- diagnosedAt
- supersedesSnapshotId
- status
- version
```

The snapshot is a projection, not raw evidence. Raw evidence must remain separately traceable.

### 6.2 Cognitive State Hypothesis

```text
CognitiveStateHypothesis
- stateId
- probabilityOrConfidence
- supportingEvidenceRefs
- contradictingEvidenceRefs
- observedIndicators
- missingIndicators
- contextScope
- representationScope
- assistanceCondition
- explanation
```

The runtime may retain more than one plausible hypothesis when evidence is ambiguous.

### 6.3 Misconception Hypothesis

```text
MisconceptionHypothesis
- misconceptionId
- confidence
- supportingPatterns
- counterEvidence
- activationContexts
- persistenceEstimate
- educationalRisk
- recommendedContrastTags
- explanation
```

A misconception hypothesis requires a repeatable reasoning pattern or strong diagnostic contrast. A single wrong answer must not automatically create a stable misconception record.

### 6.4 Prerequisite Readiness

```text
PrerequisiteReadiness
- transformationId
- prerequisiteResults
- overallDecision
- confidence
- missingPrerequisiteIds
- unstablePrerequisiteIds
- blockingMisconceptionIds
- evidenceGaps
- evaluatedAt
```

### 6.5 Diagnosis Report

```text
DiagnosisReport
- reportId
- learnerId
- targetScope
- currentState
- alternativeStates
- confidence
- misconceptionHypotheses
- evidenceBasis
- contradictions
- readinessDecision
- recommendedTransformation
- safeNextAction
- humanReadableExplanation
- generatedAt
```

The Diagnosis Report is the interoperable output consumed by mission generation, mentor support, analytics, and human-facing projections.

### 6.6 Transformation Candidate

```text
TransformationCandidate
- transformationId
- readiness
- readinessConfidence
- educationalPriority
- evidenceNeed
- productiveExperienceTags
- requiredContrastTags
- prohibitedShortcutTags
- suitableContextTags
- rationale
```

A Transformation Candidate is not a mission. It is a constrained educational request to Phase 16C.

---

## 7. Evidence Intake Contract

Phase 16B consumes normalized evidence references rather than directly interpreting every gameplay event shape.

```text
NormalizedEvidence
- evidenceId
- learnerId
- occurredAt
- sourceType
- activityId
- missionInstanceId
- targetIds
- conceptIds
- transformationIds
- representationUsed
- reasoningActions
- strategyTrace
- finalOutcome
- explanationSignals
- transferSignals
- correctionSignals
- hintUsage
- mentorAssistance
- toolAssistance
- confidenceSignal
- contextTags
- integrityFlags
- evidenceVersion
```

Phase 16E will later define authoritative evidence generation and scoring. Until then, Phase 16B defines the minimum semantic information it requires.

Evidence with failed integrity checks may remain stored but must not silently increase diagnosis confidence.

---

## 8. Diagnosis Dimensions

A diagnosis may consider the following dimensions independently:

### 8.1 Representation

Can the learner interpret, create, and connect required representations?

Examples:

- physical quantities;
- diagrams;
- tables;
- number lines;
- symbolic notation;
- verbal explanation;
- world arrangements.

### 8.2 Reasoning

Does the learner use reasoning appropriate to the target model?

Examples:

- additive comparison;
- multiplicative comparison;
- conservation;
- equivalence;
- decomposition;
- generalization;
- inverse reasoning;
- proportional reasoning.

### 8.3 Procedure

Can the learner execute a valid method accurately and recover from execution errors?

Procedural success without conceptual evidence may support a `PROCEDURAL_MODEL` hypothesis but must not automatically imply conceptual or transferable understanding.

### 8.4 Explanation

Can the learner justify why a relationship or operation is valid?

Explanation can be expressed through language, diagrams, arrangement, demonstration, or another accessible representation. Spoken or written language fluency must not be confused with mathematical understanding.

### 8.5 Transfer

Can the learner preserve the mathematical relationship when surface features, numbers, representations, or world contexts change?

### 8.6 Consistency

Does the observed model recur across multiple decisions rather than appearing once by chance?

### 8.7 Retention

Does the understanding remain observable after time has passed and immediate scaffolding is absent?

### 8.8 Independence

What level and type of assistance was required?

The engine must distinguish:

- independent evidence;
- tool-supported evidence;
- hint-supported evidence;
- mentor-guided evidence;
- imitated or copied action;
- fully demonstrated action after explanation.

Assisted success is valuable learning evidence but carries a different diagnostic meaning from independent transfer.

---

## 9. Diagnosis Confidence

Diagnosis confidence expresses how strongly the available evidence supports the current hypothesis.

A conforming implementation must preserve both a machine-readable value and an interpretable band.

```text
DiagnosisConfidence
- value: 0.00–1.00
- band: INSUFFICIENT | LOW | MEDIUM | HIGH
- evidenceBreadth
- evidenceConsistency
- evidenceRecency
- contextDiversity
- representationDiversity
- assistanceIndependence
- contradictionPenalty
- explanation
```

Suggested semantic meaning:

- `INSUFFICIENT`: no defensible cognitive-state conclusion;
- `LOW`: tentative hypothesis requiring diagnostic evidence;
- `MEDIUM`: usable for cautious mission selection but not strong mastery decisions;
- `HIGH`: multiple coherent evidence signals with limited contradiction.

The numerical thresholds are policy-owned and must be versioned. This guide does not prescribe fixed values.

Confidence must not increase solely because many nearly identical tasks were completed. Evidence diversity matters.

---

## 10. Readiness Decision Model

For each candidate transformation, the engine returns one of:

```text
UNKNOWN
NOT_READY
CONDITIONALLY_READY
READY
ALREADY_BEYOND
```

### 10.1 UNKNOWN

Evidence is insufficient or too contradictory to determine readiness safely.

Expected downstream action: request a low-pressure diagnostic experience rather than a progression mission.

### 10.2 NOT_READY

A required prerequisite is absent, unstable, or blocked by a strong misconception.

Expected downstream action: recommend prerequisite strengthening or a contrast experience.

### 10.3 CONDITIONALLY_READY

The learner may attempt the transformation under specified scaffolding, representation, or context conditions.

Expected downstream action: generate a supported mission and collect targeted evidence.

### 10.4 READY

Required prerequisites and current-state evidence are sufficiently strong to justify a mission targeting the transformation.

### 10.5 ALREADY_BEYOND

Evidence indicates the learner already demonstrates the target or a downstream state.

Expected downstream action: avoid redundant practice and consider transfer, extension, or mentorship opportunities.

---

## 11. Diagnosis Lifecycle

```text
NO_SNAPSHOT
    ↓
EVIDENCE_ACCUMULATING
    ↓
HYPOTHESIS_AVAILABLE
    ↓
READINESS_EVALUATED
    ↓
ACTIVE
    ↓
STALE | CONTRADICTED | SUPERSEDED
```

### 11.1 NO_SNAPSHOT

No authoritative learner projection exists for the graph scope.

### 11.2 EVIDENCE_ACCUMULATING

Evidence exists but is insufficient for a defensible state hypothesis.

### 11.3 HYPOTHESIS_AVAILABLE

At least one bounded cognitive-state hypothesis exists.

### 11.4 READINESS_EVALUATED

The hypothesis has been evaluated against one or more transformation prerequisites.

### 11.5 ACTIVE

The snapshot is current enough for downstream use within its declared scope.

### 11.6 STALE

The snapshot's evidence is too old, too narrow, or superseded by graph or policy changes.

### 11.7 CONTRADICTED

New evidence materially conflicts with the current hypothesis and requires reevaluation.

### 11.8 SUPERSEDED

A newer authoritative snapshot replaces it while preserving historical traceability.

No snapshot may be silently mutated to hide a previous diagnosis.

---

## 12. Contradiction and Ambiguity Handling

The engine must recognize cases such as:

- correct symbolic work but incorrect physical interpretation;
- strong performance in one representation and failure in another;
- success with familiar numbers but failure under transfer;
- independent success followed by contradictory reasoning explanation;
- correct result produced through an invalid strategy;
- different misconceptions producing the same wrong answer;
- mentor-assisted success without independent confirmation;
- rapid improvement that makes older evidence less representative.

When contradictions are material, the engine must lower confidence, preserve both sides of the evidence, and recommend a discriminating experience.

It must not select whichever evidence is most convenient for progression.

---

## 13. Diagnostic Experience Request

When evidence is insufficient or ambiguous, Phase 16B may emit a diagnostic request to Phase 16C.

```text
DiagnosticExperienceRequest
- learnerId
- targetScope
- candidateStateIds
- misconceptionIdsToDiscriminate
- evidenceDimensionsNeeded
- requiredContrasts
- suitableRepresentations
- unsuitableRepresentations
- assistanceLimit
- contextConstraints
- urgency
- rationale
```

A diagnostic experience must feel like meaningful play, work, conversation, building, crafting, or decision-making inside the world. It must not default to an exposed test screen unless no suitable world projection exists.

---

## 14. Ratio Validation Continuation

Using the Phase 16A.5 Ratio & Proportional Reasoning slice, Phase 16B must distinguish at least the following hypotheses:

```text
S1 — Separate-Quantity Attention
S2 — Difference-Based Comparison
S3 — Procedural Ratio Use
S4 — Multiplicative Comparison
S5 — Proportional Coordination
S6 — Transferable Proportional Reasoning
```

Example evidence pattern:

```text
Learner selects mixture 8:6 over 6:4 because the first has "two more" of each material.
```

Possible interpretation:

```text
Primary hypothesis: Difference-Based Comparison
Candidate misconception: Equal difference implies equal mixture strength
Confidence: LOW after one event
Required evidence: Contrast equal differences with unequal ratios
Recommended transformation: Additive comparison → multiplicative comparison
Readiness: CONDITIONALLY_READY for a guided contrast experience
```

After coherent evidence across mixture, exchange, and scaling contexts, confidence may increase. Repeating the same mixture numbers must not be treated as equivalent evidence diversity.

---

## 15. Safe Next Action Policy

Every Diagnosis Report must provide a safe next action.

Possible actions include:

```text
COLLECT_MORE_EVIDENCE
RUN_DISCRIMINATING_EXPERIENCE
STRENGTHEN_PREREQUISITE
TARGET_TRANSFORMATION
PRACTICE_WITH_REDUCED_SUPPORT
TEST_TRANSFER
TEST_RETENTION
OFFER_EXTENSION
OFFER_MENTORSHIP
HOLD_CURRENT_PATH
```

The engine must prefer gathering better evidence over assigning a potentially unsuitable remediation path.

A learner must never be trapped in repetitive low-level practice merely because the system lacks confidence.

---

## 16. Human Interpretation Contract

Parent, teacher, mentor, and learner projections must not expose raw probabilistic labels without explanation.

A human-readable projection should communicate:

- what the learner currently appears to understand;
- what evidence supports that interpretation;
- where uncertainty remains;
- what misconception may be active, phrased respectfully;
- what experience is recommended next;
- whether assistance or a particular representation is currently important;
- what progress has changed since the previous snapshot.

Prohibited framing includes:

- `weak learner`;
- `bad at fractions`;
- `failed ratio`;
- fixed intelligence labels;
- certainty unsupported by evidence.

Preferred framing describes observable reasoning and next opportunity.

---

## 17. Privacy and Ethical Constraints

Cognitive diagnosis is sensitive learner data.

A conforming implementation must:

- collect only evidence needed for learning purposes;
- preserve tenant, account, family, class, and learner boundaries;
- restrict diagnosis visibility by role and consent;
- avoid hidden behavioral profiling unrelated to learning;
- provide traceable reasons for consequential recommendations;
- allow correction or review of clearly erroneous records;
- retain historical evidence according to explicit policy;
- never sell or repurpose cognitive profiles for advertising;
- avoid using demographic traits as substitutes for mathematical evidence.

The engine diagnoses demonstrated mathematical thinking, not personality, intelligence, mental health, or human worth.

---

## 18. Determinism, Versioning, and Recovery

Every diagnosis must reference:

- graph version;
- diagnosis-policy version;
- evidence-schema version;
- evidence identifiers;
- transformation definitions used;
- timestamp boundaries;
- previous snapshot when superseding.

When graph or policy versions change, existing snapshots may become stale and require reprojection. They must not be silently reinterpreted as though the old and new definitions were identical.

Save/load recovery must preserve:

- evidence already accepted;
- active diagnosis computation state if persisted;
- last authoritative snapshot;
- pending diagnostic request;
- contradiction flags;
- idempotency identity for repeated evidence delivery.

Duplicate evidence ingestion must not double-increase confidence.

---

## 19. Failure and Refusal Conditions

The engine must refuse to issue a progression-ready diagnosis when:

- learner identity is unresolved;
- graph version is missing or incompatible;
- required evidence references cannot be verified;
- evidence integrity is materially compromised;
- prerequisite definitions are unavailable;
- policy version is unknown;
- evidence is too narrow for the requested decision;
- contradictory evidence exceeds the policy tolerance;
- the requested transformation is inactive or deprecated.

Suggested failure codes:

```text
LEARNER_IDENTITY_UNRESOLVED
GRAPH_VERSION_UNAVAILABLE
DIAGNOSIS_POLICY_UNAVAILABLE
EVIDENCE_INTEGRITY_FAILED
EVIDENCE_INSUFFICIENT
EVIDENCE_CONTRADICTORY
PREREQUISITE_DEFINITION_MISSING
TRANSFORMATION_INACTIVE
SNAPSHOT_STALE
DIAGNOSIS_SCOPE_UNSUPPORTED
```

A refusal must return an actionable safe next step rather than a generic error whenever possible.

---

## 20. Downstream Contract for Phase 16C

Phase 16C may generate a mission only from an authoritative Phase 16B output or an explicitly declared exploratory mode.

The minimum mission-generation input is:

```text
MissionLearningRequest
- learnerId
- graphVersion
- learningTargetId
- currentStateId
- targetTransformationId
- readinessDecision
- readinessConfidence
- misconceptionHypotheses
- evidenceDimensionsNeeded
- productiveExperienceTags
- requiredContrastTags
- suitableContextTags
- assistanceConstraints
- safeNextAction
- diagnosisReportId
```

Phase 16C must not independently override the diagnosed learning target, award mastery, or reinterpret a `NOT_READY` result as `READY` for narrative convenience.

---

## 21. Production Invariants

A conforming implementation must preserve all of the following:

1. No diagnosis from final answers alone.
2. No permanent learner label from a cognitive-state hypothesis.
3. No readiness decision without a specific transformation scope.
4. No high-confidence diagnosis from one undiversified observation.
5. No stable misconception from a single ordinary error.
6. No silent confidence increase from duplicate evidence.
7. No mastery award by Phase 16B.
8. No mission-generation authority inside Phase 16B.
9. No concealment of material contradictory evidence.
10. No grade-level shortcut around prerequisite reasoning.
11. No use of assistance-dependent success as equivalent to independent transfer.
12. No stale snapshot presented as current without a freshness warning.
13. No downstream progression when required graph or policy versions are unresolved.
14. Every consequential recommendation remains traceable to evidence and policy.
15. Every uncertain diagnosis has a safe evidence-gathering path.

---

## 22. Validation Scenarios

Phase 16B implementation must eventually prove at least these scenarios:

### Scenario A — Correct Answer, Wrong Model

The learner obtains the correct result using an additive strategy that only happens to work for the selected values.

Expected result: procedural success evidence without conceptual-readiness promotion.

### Scenario B — Incorrect Answer, Productive Model

The learner uses correct proportional reasoning but makes an arithmetic slip.

Expected result: preserve reasoning evidence and avoid diagnosing an additive misconception from the final answer.

### Scenario C — Assistance Dependency

The learner succeeds after a mentor identifies the relevant quantities.

Expected result: record valuable supported evidence while requiring independent confirmation before transfer readiness.

### Scenario D — Representation Split

The learner reasons proportionally with physical mixtures but fails with tables.

Expected result: context- or representation-limited snapshot rather than a global failure label.

### Scenario E — Contradictory Evidence

Recent actions indicate proportional reasoning while older repeated evidence indicates difference thinking.

Expected result: lower or scoped confidence, preserve recency, and request a discriminating experience.

### Scenario F — Above-Level Learner

The learner independently transfers proportional reasoning into an unfamiliar scaling context.

Expected result: `ALREADY_BEYOND` for lower transformations and recommend extension rather than forced repetition.

### Scenario G — Insufficient Evidence

Only one ordinary answer exists.

Expected result: `UNKNOWN` or low-confidence hypothesis with `COLLECT_MORE_EVIDENCE`.

---

## 23. Exit Criteria

Phase 16B architecture is complete when it defines and preserves:

- the Learner Cognitive State Engine boundary;
- the authoritative snapshot and diagnosis contracts;
- hypothesis, confidence, contradiction, and freshness semantics;
- transformation-specific readiness decisions;
- safe behavior under insufficient evidence;
- misconception-hypothesis safeguards;
- diagnostic experience requests;
- deterministic versioning and recovery requirements;
- ethical and privacy constraints;
- the exact handoff contract to Phase 16C;
- validation scenarios proving that answer outcome and cognitive evidence remain distinct.

---

## 24. Architectural Decision

**Result: ACCEPTED — FOUNDATION COMPLETE**

Phase 16B establishes learner readiness as an evidence-backed, transformation-specific cognitive diagnosis rather than a score, grade placement, or global ability label.

The authoritative runtime sequence is now:

```text
Cognitive Transformation Graph
        ↓
Learner Evidence
        ↓
Cognitive Diagnosis
        ↓
Transformation-Specific Readiness
        ↓
Mission Learning Request
```

This foundation is sufficient to begin Phase 16C — Mission Definition & Generation, while detailed evidence scoring remains reserved for Phase 16E and individual mastery transitions remain reserved for Phase 16G.
