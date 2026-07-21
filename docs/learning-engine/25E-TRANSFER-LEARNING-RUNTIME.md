# 25E — Transfer Learning Runtime

## 1. Purpose

The Transfer Learning Runtime determines whether a learner can apply a concept, pattern, or strategy beyond the exact context in which it was first learned.

Transfer is the bridge between successful performance and usable understanding.

The runtime answers:

- Did the learner recognize the same underlying structure in a changed situation?
- How far did the new situation differ from prior evidence?
- Which dimensions changed: representation, goal, values, world context, language, affordance, or strategy demand?
- Was the transfer independent or scaffolded?
- Did the learner preserve the concept while adapting the procedure?
- Was the result a genuine transfer or only a repeated template?

---

## 2. Architectural Position

```text
Discovery Evidence
  → Learning State
    → Learning Progression
      → Transfer Learning Runtime
        → Mastery Evaluation
        → Learning Path
        → Adaptive Recommendation
```

Transfer evidence is produced from authoritative learning episodes and consumed by Mastery Evaluation. The Transfer Learning Runtime does not grant mastery directly.

---

## 3. Core Principle

> Transfer is demonstrated when the learner preserves relevant conceptual structure while adapting action to meaningful change.

A repeated task with cosmetic differences is not necessarily transfer.

A different-looking task that preserves the same deep structure may be strong transfer evidence.

The runtime must therefore compare both surface variation and structural variation.

---

## 4. Transfer Unit

A transfer evaluation compares at least two evidence contexts:

```text
Source Context
  → Transformation Profile
    → Target Context
      → Learner Response
        → Transfer Claim
```

Suggested model:

```text
TransferClaim
- claimId
- learnerId
- conceptId
- sourceEvidenceRefs
- targetEvidenceRefs
- sourceContextFingerprint
- targetContextFingerprint
- transformationProfile
- transferDistance
- transferType
- independence
- strategyAdaptation
- outcome
- confidence
- limitations
- evaluatorVersion
- createdAt
- supersedesClaimId?
```

---

## 5. Context Fingerprint

A context fingerprint describes the learning situation without relying on a single mission or screen identifier.

```text
ContextFingerprint
- conceptScope
- representationType
- worldSetting
- objectTypes
- numericalStructure
- taskGoal
- availableAffordances
- distractorProfile
- languageDemand
- sequenceStructure
- strategyConstraints
- supportProfile
- timeRelation
```

The fingerprint must be derived from authoritative world and task metadata.

UI labels and visual themes may be included as surface descriptors, but they must not define conceptual identity.

---

## 6. Transformation Profile

The transformation profile records what changed between source and target.

```text
TransformationProfile
- valueChange
- scaleChange
- representationChange
- spatialChange
- goalChange
- contextChange
- languageChange
- affordanceChange
- distractorChange
- sequenceChange
- strategyDemandChange
- abstractionChange
- temporalSeparation
```

Each dimension may be classified, for example:

```text
NONE
MINOR
MODERATE
MAJOR
UNKNOWN
```

The profile supports explainability and prevents the engine from calling every new task a transfer task.

---

## 7. Transfer Types

Recommended transfer vocabulary:

```text
REPETITION
VARIATION
NEAR_TRANSFER
CROSS_REPRESENTATION_TRANSFER
CROSS_CONTEXT_TRANSFER
STRATEGY_TRANSFER
FAR_TRANSFER
NEGATIVE_TRANSFER
FAILED_TRANSFER
UNRESOLVED
```

### REPETITION

The target is effectively the same as the source. Useful for stability, not transfer breadth.

### VARIATION

One or more surface dimensions change while the strategy remains highly similar.

### NEAR_TRANSFER

The deep structure remains recognizable and only limited adaptation is required.

### CROSS_REPRESENTATION_TRANSFER

The learner maps the concept across representations, such as objects to symbols or diagram to equation.

### CROSS_CONTEXT_TRANSFER

The learner applies the concept in a different world, narrative, or practical setting.

### STRATEGY_TRANSFER

A strategy learned for one concept scope is appropriately adapted to a related scope.

### FAR_TRANSFER

The target differs substantially in surface form, representation, goal, or strategy demand while preserving relevant conceptual structure.

### NEGATIVE_TRANSFER

A previously useful strategy is applied where it is invalid or misleading.

### FAILED_TRANSFER

The target required transfer, but the learner did not preserve or adapt the relevant structure.

### UNRESOLVED

Available evidence is insufficient to distinguish transfer, repetition, accidental success, or unrelated performance.

---

## 8. Transfer Distance

Transfer distance must not be represented as a universal scalar alone.

A profile may contain multiple dimensions:

```text
TransferDistance
- representationalDistance
- contextualDistance
- proceduralDistance
- abstractionDistance
- linguisticDistance
- temporalDistance
- affordanceDistance
- goalDistance
```

A summary category may be projected for convenience, but the multidimensional profile remains authoritative.

---

## 9. Structural Equivalence

The runtime needs a way to determine whether source and target share relevant deep structure.

Examples of structural features:

- equal groups,
- conservation,
- part-whole relation,
- repeated unit iteration,
- proportional relation,
- inverse operation,
- balance and equivalence,
- variable dependency,
- spatial composition,
- transformation invariance.

Structural equivalence may be supplied by the Knowledge Graph, task metadata, or concept model.

The transfer evaluator must not infer equivalence from matching words or artwork alone.

---

## 10. Source Evidence Eligibility

Source evidence should be eligible when:

- it is authoritative,
- it is conceptually relevant,
- it is not revoked,
- its support level is known,
- its context fingerprint is available,
- its strategy or outcome can be interpreted,
- it occurred before the target evidence.

The nearest prior event is not always the best source. The runtime may identify multiple candidate sources and record the basis for selection.

---

## 11. Target Evidence Eligibility

Target evidence should be eligible when:

- the target context differs meaningfully from at least one source context,
- the learner had a genuine opportunity to act,
- the result was not auto-completed,
- relevant scaffolding is recorded,
- the world outcome was committed authoritatively,
- the evidence includes enough metadata to evaluate adaptation.

---

## 12. Transfer Evaluation Pipeline

```text
Target Learning Evidence
  → Resolve Concept and Structure
  → Find Eligible Source Evidence
  → Build Context Fingerprints
  → Compute Transformation Profile
  → Classify Transfer Opportunity
  → Evaluate Learner Adaptation
  → Detect Support and Accidental Success
  → Detect Negative Transfer
  → Issue Immutable Transfer Claim
  → Update Learning Projection
```

The pipeline must be deterministic for the same evidence and evaluator version.

---

## 13. Strategy Adaptation

Transfer often requires preserving the concept while changing the procedure.

Example outcomes:

```text
SAME_VALID_STRATEGY
ADAPTED_VALID_STRATEGY
ALTERNATIVE_VALID_STRATEGY
OVERGENERALIZED_STRATEGY
INAPPLICABLE_STRATEGY
NO_IDENTIFIABLE_STRATEGY
```

Alternative valid strategies must receive full recognition when they satisfy the mathematical structure.

The runtime must not punish a learner for failing to reproduce a taught procedure when another valid strategy demonstrates understanding.

---

## 14. Cross-Representation Transfer

Cross-representation transfer is central to graphics-first mathematics learning.

Possible mappings include:

```text
World Objects ↔ Diagram
Diagram ↔ Number Line
World Construction ↔ Table
Table ↔ Graph
Graph ↔ Symbolic Expression
Spatial Pattern ↔ Equation
Narrative Situation ↔ Mathematical Model
```

The runtime should distinguish:

- translation between representations,
- recognition of equivalent structure,
- use of one representation to solve another,
- dependence on a preferred representation.

A learner may be strong in one representation and still developing in another. This should produce a bounded profile, not a global weakness label.

---

## 15. Near Transfer

Near transfer evidence requires:

- meaningful but limited change,
- preservation of deep structure,
- successful adaptation,
- sufficient independence,
- no exact-template dependency.

Examples:

- different numbers with the same relation,
- rotated spatial configuration,
- changed object type with the same grouping structure,
- altered order of steps without changing the concept.

Near transfer usually supports progression from SUPPORTED toward TRANSFERABLE.

---

## 16. Far Transfer

Far transfer should be claimed conservatively.

Potential indicators:

- major representation change,
- unfamiliar context,
- different immediate goal,
- substantially changed affordances,
- need to choose or construct a strategy,
- long temporal separation,
- no explicit cue that the prior concept applies.

Far transfer requires stronger provenance and explanation than near transfer.

The runtime must prefer UNRESOLVED over an unsupported far-transfer claim.

---

## 17. Negative Transfer

Negative transfer occurs when prior learning interferes with valid performance.

Examples:

- applying additive reasoning to a multiplicative relation,
- assuming all graphs should be linear,
- treating an equals sign as an instruction to calculate rather than a relation,
- applying whole-number rules directly to fractions,
- using area reasoning where perimeter is required.

Suggested model:

```text
NegativeTransferClaim
- priorStrategyRef
- targetContextRef
- invalidMapping
- misconceptionRef?
- confidence
- recoveryEvidenceRefs
```

Negative transfer is valuable diagnostic evidence and should inform Learning Path and Guidance.

It must not become a punitive score.

---

## 18. Support and Cue Contamination

A target task may accidentally announce the intended transfer.

Examples:

- explicit text naming the concept,
- highlighted matching structures,
- forced tool selection,
- tutorial demonstration immediately before action,
- only one available action,
- mission wording that reveals the strategy.

The runtime should record cue contamination and lower the independence of the transfer claim.

A scaffolded transfer can still be learning evidence, but it is not equivalent to spontaneous transfer.

---

## 19. Accidental Success and Template Matching

The following are insufficient for transfer by themselves:

- selecting the only valid option,
- copying the source layout,
- repeating a memorized action sequence,
- matching colors or shapes without structural reasoning,
- succeeding after system auto-correction,
- using a world affordance that bypasses the target concept.

The evaluator should search for evidence of structural adaptation, repeatability, variation, or later application.

---

## 20. Temporal Transfer

Transfer after delay is stronger than immediate transfer when other conditions are comparable.

Temporal separation should be recorded independently from contextual distance.

```text
Immediate cross-context transfer
Delayed same-context transfer
Delayed cross-representation transfer
```

These describe different capabilities and should not collapse into one score.

---

## 21. Transfer Breadth Profile

A learner concept state may project transfer breadth as:

```text
TransferBreadthProfile
- repeatedContexts
- variedContexts
- nearTransferContexts
- representationPairs
- crossWorldContexts
- farTransferContexts
- failedTransferContexts
- negativeTransferPatterns
- supportDependence
- freshness
```

The profile should preserve both successes and gaps.

---

## 22. Transfer Claim Lifecycle

Recommended statuses:

```text
CANDIDATE
SUPPORTED
CONFIRMED
CONTRADICTED
SUPERSEDED
REVOKED
```

### CANDIDATE

A plausible transfer relationship has been detected but lacks enough evidence.

### SUPPORTED

Evidence supports transfer with stated limitations.

### CONFIRMED

Repeated or high-authority evidence supports the transfer claim.

### CONTRADICTED

Subsequent evidence materially conflicts with the claim.

### SUPERSEDED

A newer claim better describes the transfer scope.

### REVOKED

Source or target evidence is invalidated, or semantic migration makes the claim unusable.

---

## 23. Relationship to Mastery

Transfer contributes to mastery but does not equal mastery.

Examples:

- strong near transfer but no retention,
- far transfer with high support dependence,
- independent transfer in one representation pair but not another,
- broad transfer with unresolved misconception evidence.

Mastery policy decides how much and what kind of transfer is required.

The Transfer Runtime supplies structured evidence, not the final mastery status.

---

## 24. Relationship to Learning Path

Transfer gaps can create path opportunities.

Examples:

```text
Strong symbolic understanding + weak world-model transfer
  → recommend representational bridge mission

Strong same-context success + weak cross-context transfer
  → recommend unfamiliar application mission

Negative transfer from additive to multiplicative reasoning
  → recommend contrastive experience
```

The Learning Path Runtime must use these as reasons, not deterministic commands.

---

## 25. Relationship to Guidance

Guidance should respond to transfer state without revealing the answer prematurely.

Possible progression:

```text
Silence
  → Attention Cue to relevant structure
    → Reflective comparison with prior situation
      → Constraint reduction
        → Experiment suggestion
```

Guidance events must be recorded because they affect independence classification.

---

## 26. Commands and Events

Suggested commands:

```text
EvaluateTransferOpportunity
ReevaluateTransferClaim
RevokeTransferClaim
ProjectTransferBreadth
```

Suggested events:

```text
TransferOpportunityDetected
TransferCandidateCreated
NearTransferSupported
CrossRepresentationTransferSupported
CrossContextTransferSupported
FarTransferSupported
NegativeTransferDetected
TransferClaimContradicted
TransferClaimSuperseded
TransferClaimRevoked
```

Callers request evaluation. They must not command `markFarTransfer` or `setTransferable`.

---

## 27. Idempotency and Concurrency

A transfer evaluation request should include:

```text
learnerId
conceptId
sourceEvidenceSetVersion
targetEvidenceId
evaluatorVersion
expectedLearningStateVersion
correlationId
idempotencyKey
```

The same evidence pair and evaluator version must not create duplicate claims.

If new source evidence arrives during evaluation, the runtime may complete against the declared source set version and schedule reevaluation. It must not silently mix versions.

---

## 28. Replay and Semantic Migration

Transfer replay requires:

- immutable source and target evidence,
- context fingerprint semantics,
- transformation classifier version,
- concept structure version,
- evaluator version.

A semantic migration may change whether two contexts count as near or far transfer. New claims must supersede old ones without rewriting history.

---

## 29. Explainability

Every transfer claim should explain:

- which prior evidence served as source,
- what changed in the target,
- what deep structure remained,
- how the learner adapted,
- what support was present,
- why the claim is near, cross-representation, cross-context, or far transfer,
- what limitations remain.

Example:

```text
Transfer: CROSS_REPRESENTATION_TRANSFER
Supported because:
- Learner used equal-group structure first with blocks and later with a number line
- Values and visual arrangement changed
- No strategic hint was used
Limitation:
- Symbolic equation representation has not yet been demonstrated
```

---

## 30. Privacy and Fairness

Transfer profiles are learner-specific diagnostic data.

Requirements:

- no global adaptability score,
- no permanent labeling as unable to transfer,
- no comparison against demographic groups,
- no hidden language penalty when mathematical structure is understood,
- projection must distinguish representation gap from concept gap,
- inaccessible interface conditions must not become negative transfer evidence.

A failure caused by motor, sensory, language, or interface barriers must not be interpreted automatically as conceptual failure.

---

## 31. Runtime Invariants

1. No transfer claim may exist without authoritative source and target evidence.
2. Repetition must not be represented as transfer.
3. Surface difference alone must not prove transfer.
4. Structural equivalence must be explicit or traceably inferred.
5. Support and cue contamination must remain visible.
6. Alternative valid strategies must be accepted.
7. Negative transfer must be preserved as diagnostic evidence.
8. A failed transfer must not erase demonstrated source learning.
9. Transfer distance must remain multidimensional in authority storage.
10. Far transfer claims require stronger evidence than near transfer claims.
11. Revoked evidence must trigger dependent claim reevaluation.
12. Transfer claims must remain bounded by concept and context.
13. UI state and mission completion must not manufacture transfer.
14. Replay with identical inputs must be deterministic.
15. Transfer confidence must not become a permanent learner trait.

---

## 32. Verification Scenarios

### Scenario A — Exact Repetition

The learner repeats the same construction with identical values and arrangement.

Expected:

- classify as REPETITION,
- no transfer breadth increase.

### Scenario B — Near Variation

The learner solves the same structural relation with different values and rotated layout.

Expected:

- classify as VARIATION or NEAR_TRANSFER based on policy,
- record independence and adaptation.

### Scenario C — Cross Representation

The learner first constructs equal groups with objects and later recognizes the same structure on a number line.

Expected:

- issue cross-representation transfer claim,
- record the representation pair.

### Scenario D — Far Context

The learner applies ratio reasoning learned in construction to an unfamiliar resource-allocation situation.

Expected:

- evaluate structural equivalence,
- require stronger evidence before far-transfer confirmation.

### Scenario E — Guided Transfer

The system explicitly points to the matching structure before success.

Expected:

- preserve transfer-learning evidence,
- classify support dependence,
- do not treat as spontaneous transfer.

### Scenario F — Negative Transfer

The learner applies an additive strategy to a multiplicative target.

Expected:

- create negative-transfer evidence,
- link possible misconception,
- inform contrastive learning path.

### Scenario G — Revoked Gameplay Evidence

A placement bug invalidates the target outcome.

Expected:

- revoke dependent transfer claim,
- preserve audit lineage,
- reevaluate learning projection.

---

## 33. Completion Boundary

This document defines transfer authority, context comparison, transfer classification, negative transfer, lifecycle, explainability, and invariants.

It does not define:

- final mastery thresholds, defined in 25D,
- personalized path construction, defined in 25F,
- recommendation ranking, defined in 25G,
- family and teacher presentation, defined in 25H,
- persistence implementation, defined in 25I,
- complete verification architecture, defined in 25J.

The Transfer Learning Runtime is complete when the system can distinguish repetition from meaningful application, preserve multidimensional context change, recognize valid strategy adaptation, detect negative transfer, and produce replayable evidence for mastery and path planning.