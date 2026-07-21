# 16C — Cognitive Mission Planning & Generation

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16C — Cognitive Mission Planning & Generation  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16A.5-RATIO-PROPORTIONAL-REASONING-VALIDATION-SLICE.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`  
**Downstream Consumers:** 16D World Activity Binding, 16E Mathematical Evidence & Assessment, 16F Hint & Mentor Support, 16G Mastery & Progression, 16H Remediation, 16I Parent/Teacher Projection, world runtime, NPC runtime, activity runtime

---

## 1. Purpose

This guide defines how Math Learning World converts an evidence-backed cognitive diagnosis into a playable, bounded, educationally intentional mission plan.

The system must not begin from a generic quest template and attach mathematics afterward. It must begin from the learner's current cognitive-state hypothesis, the required transformation, the evidence still needed, and the world affordances capable of creating a productive experience.

The central doctrine is:

> A mission is a designed opportunity for cognitive transformation, not a task with educational decoration.

A conforming mission must answer:

> What understanding should change, what experience may cause that change, and what evidence will reveal whether it happened?

---

## 2. Architectural Position

The authoritative flow is:

```text
Learner Cognitive Snapshot
        ↓
Readiness Decision
        ↓
Transformation Candidate
        ↓
Cognitive Mission Plan
        ↓
World Activity Requirements
        ↓
Playable Mission Definition
        ↓
Mission Instance
        ↓
Evidence Contract
```

Phase 16C plans and generates missions. It does not own the final world implementation of every activity, raw evidence scoring, learner mastery transitions, or rewards.

---

## 3. Mission Meaning

A Learning Mission is a bounded playable experience whose primary purpose is one or more of the following:

- reveal the learner's current mental model;
- create a productive contrast;
- support a specific cognitive transformation;
- strengthen an unstable prerequisite;
- test transfer into a changed representation or context;
- collect evidence needed to reduce diagnostic uncertainty;
- consolidate retention;
- extend a mastered idea;
- create a mentorship opportunity.

A mission must not be defined only by completion actions such as collecting ten objects, talking to an NPC, crafting an item, or reaching a location.

Those actions may be part of a mission, but the mission's authoritative identity comes from its cognitive intent.

---

## 4. Authority Boundary

Phase 16C owns:

- mission-learning intent;
- transformation-target selection from Phase 16B candidates;
- mission kind selection;
- mission planning constraints;
- required mathematical contrasts;
- required evidence dimensions;
- allowable scaffolding and assistance envelope;
- representation and context requirements;
- mission success interpretation contract;
- mission failure and inconclusive outcomes;
- mission-definition versioning;
- generation traceability;
- selection among eligible mission patterns;
- mission request and mission plan contracts;
- safe fallback when no suitable playable mission exists.

Phase 16C does not own:

- authoritative definitions of concepts, states, misconceptions, or transformations;
- learner diagnosis;
- concrete world object implementation;
- NPC animation, pathfinding, dialogue rendering, or scene scripting;
- evidence scoring algorithms;
- mastery-state mutation;
- reward economy;
- remediation policy after repeated failure;
- parent- or teacher-facing presentation.

Phase 16A defines what must change. Phase 16B identifies the learner's current state and readiness. Phase 16C plans the experience that should happen next.

---

## 5. Cognitive Mission Planner

Phase 16C establishes the **Cognitive Mission Planner**.

```text
Cognitive Mission Planner
│
├── Mission Request Intake
├── Transformation Selector
├── Mission-Kind Selector
├── Experience Pattern Matcher
├── Context and Representation Selector
├── Contrast Planner
├── Evidence Requirement Planner
├── Scaffolding Envelope Planner
├── Difficulty and Load Regulator
├── Mission Definition Generator
├── Mission Validity Checker
└── Mission Plan Repository
```

For the same graph version, diagnosis snapshot, policy version, available world affordances, and randomization seed, generation must be reproducible.

Randomization may vary surface details, but it must never alter the educational contract silently.

---

## 6. Mission Planning Input

Phase 16C consumes a bounded request from Phase 16B.

```text
CognitiveMissionRequest
- requestId
- learnerId
- snapshotId
- graphVersion
- diagnosisPolicyVersion
- targetScope
- primaryStateId
- alternativeStateIds
- misconceptionHypotheses
- readinessDecision
- transformationCandidates
- evidenceGaps
- contradictionFlags
- contextLimitations
- representationLimitations
- assistanceDependency
- preferredWorldContextTags
- unsuitableContextTags
- urgency
- requestedAt
- version
```

A request must preserve uncertainty. Phase 16C must not rewrite a low-confidence diagnosis into a high-confidence mission assumption.

---

## 7. Mission Kinds

A mission must declare one primary mission kind.

```text
DIAGNOSTIC
TRANSFORMATION
PREREQUISITE_STRENGTHENING
MISCONCEPTION_CONTRAST
GUIDED_PRACTICE
INDEPENDENT_APPLICATION
TRANSFER
RETENTION
EXTENSION
MENTORSHIP
```

### 7.1 DIAGNOSTIC

Used when the engine requires discriminating evidence between multiple plausible cognitive states or misconceptions.

The mission should minimize teaching interference until the required diagnostic signal has been collected.

### 7.2 TRANSFORMATION

Designed to move the learner from a current model toward a target model through productive experience, comparison, representation, or reasoning.

### 7.3 PREREQUISITE_STRENGTHENING

Used when a target transformation is blocked by an absent or unstable prerequisite.

### 7.4 MISCONCEPTION_CONTRAST

Creates a situation where the learner's current limited model produces a visible conflict and a stronger model explains the result.

The mission must not shame the learner or frame the misconception as carelessness.

### 7.5 GUIDED_PRACTICE

Allows structured support while the learner coordinates a newly introduced model.

### 7.6 INDEPENDENT_APPLICATION

Tests whether the learner can use the model without immediate scaffolding in a familiar context.

### 7.7 TRANSFER

Changes representation, values, surface context, or action pattern while preserving the same mathematical relationship.

### 7.8 RETENTION

Revisits understanding after time or intervening activity.

### 7.9 EXTENSION

Targets a downstream relationship, richer representation, generalized pattern, or more complex condition.

### 7.10 MENTORSHIP

Allows a learner with strong understanding to support another learner or NPC while producing explanation and transfer evidence.

---

## 8. Cognitive Mission Plan

```text
CognitiveMissionPlan
- planId
- requestId
- learnerId
- missionKind
- graphVersion
- missionPolicyVersion
- transformationId
- sourceStateId
- targetStateId
- learningTargetIds
- conceptIds
- misconceptionIdsAddressed
- cognitiveIntent
- productiveExperienceRequirements
- requiredContrasts
- representationRequirements
- contextRequirements
- worldAffordanceRequirements
- evidenceRequirements
- assistanceEnvelope
- cognitiveLoadEnvelope
- prohibitedShortcuts
- missionPatternId
- completionInterpretation
- inconclusiveConditions
- abortConditions
- fallbackPlan
- generationTrace
- status
- version
```

The plan is an educational contract. It is not yet a concrete world mission instance.

---

## 9. Mission Definition

A Mission Definition is the reusable, world-resolvable specification produced from a valid mission plan.

```text
MissionDefinition
- missionDefinitionId
- planId
- canonicalName
- learnerFacingPurpose
- missionKind
- worldZoneTags
- npcRoleTags
- activityTypeTags
- requiredObjectRoles
- requiredResourceRoles
- setupRules
- stageDefinitions
- choicePoints
- mathematicalDecisionPoints
- evidenceHooks
- hintPolicyRef
- mentorPolicyRef
- failureRecoveryRules
- operationalCompletionRules
- learningCompletionContract
- rewardEligibilityTags
- accessibilityRequirements
- localizationRequirements
- status
- version
```

A Mission Definition must not bind permanently to one NPC, one map coordinate, or one object instance unless the educational meaning requires it.

---

## 10. Mission Instance

A Mission Instance binds a Mission Definition to the current world and learner runtime.

```text
MissionInstance
- missionInstanceId
- missionDefinitionId
- learnerId
- worldInstanceId
- selectedZoneId
- selectedNpcIds
- boundObjectIds
- boundResourceIds
- generatedValues
- randomizationSeed
- activeStageId
- assistanceState
- evidenceSessionId
- startedAt
- pausedAt
- completedAt
- operationalStatus
- learningOutcomeStatus
- invalidationReason
- version
```

Operational status and learning outcome status must remain separate.

A learner may operationally finish the task while evidence remains inconclusive or indicates that the intended transformation did not occur.

---

## 11. Mission Lifecycle

```text
REQUESTED
    ↓
PLANNING
    ↓
PLANNED
    ↓
WORLD_RESOLUTION_PENDING
    ↓
READY_TO_INSTANTIATE
    ↓
ACTIVE
    ↓
PAUSED | BLOCKED
    ↓
OPERATIONALLY_COMPLETED
    ↓
EVIDENCE_PENDING
    ↓
LEARNING_OUTCOME_RECORDED
    ↓
CLOSED
```

Alternative terminal states:

```text
INCONCLUSIVE
INVALIDATED
ABORTED
EXPIRED
SUPERSEDED
```

No mission may be reported as educationally successful solely because the player completed its operational actions.

---

## 12. Experience Pattern Library

Phase 16C may select from reusable Experience Patterns.

```text
ExperiencePattern
- patternId
- canonicalName
- supportedMissionKinds
- supportedTransformationKinds
- productiveMechanism
- requiredContrastForms
- suitableRepresentations
- suitableWorldAffordances
- commonFailureModes
- evidenceOpportunities
- prohibitedUses
- accessibilityNotes
- version
```

Example patterns include:

- compare two outcomes produced by different strategies;
- predict, act, and reconcile;
- build two representations of the same quantity;
- repair a system whose visible failure reveals a misconception;
- allocate resources under a preserved relationship;
- transform an arrangement while conserving a mathematical property;
- explain or demonstrate a method to an NPC;
- choose between superficially similar but structurally different options;
- create an example and counterexample;
- reverse an operation to recover an unknown quantity.

Patterns are educational mechanisms, not quest skins.

---

## 13. Required Contrast

Many cognitive transformations require comparison between two cases.

```text
RequiredContrast
- contrastId
- contrastPurpose
- caseARequirements
- caseBRequirements
- invariantFeatures
- changingFeatures
- predictedLimitedModelResponse
- predictedTargetModelResponse
- observableDiscriminator
- revealTiming
- assistanceRestrictions
```

A valid contrast must change only the features necessary to expose the difference between competing mental models whenever practical.

Poorly controlled contrasts create ambiguous evidence and must be rejected by mission validation.

---

## 14. Representation Planning

Mission planning must declare which representations are required, optional, unsuitable, or intentionally changed.

Possible representations include:

- physical arrangement;
- resource groups;
- spatial layout;
- diagram;
- table;
- number line;
- symbolic expression;
- equation;
- graph;
- spoken explanation;
- written explanation;
- gesture or demonstration;
- repeated world action.

The planner must distinguish:

```text
REPRESENTATION_REQUIRED
REPRESENTATION_OPTIONAL
REPRESENTATION_TO_BE_CONNECTED
REPRESENTATION_TO_BE_WITHHELD
REPRESENTATION_UNSUITABLE_FOR_DIAGNOSIS
```

A learner's language fluency must not become an unintended barrier to mathematical evidence.

---

## 15. World Context Selection

A world context is eligible only when it preserves the intended mathematical structure.

Possible Builder's Valley contexts include:

- construction;
- repair;
- crafting;
- cooking and mixing;
- farming;
- irrigation;
- storage and packing;
- trading;
- transport;
- mapping and measurement;
- energy or machine control;
- scheduling;
- sharing resources;
- town planning;
- helping an NPC solve an operational problem.

Context selection must consider:

- mathematical fidelity;
- learner familiarity;
- cognitive load;
- accessibility;
- available world assets;
- narrative continuity;
- novelty;
- evidence observability;
- risk of irrelevant complexity;
- suitability for the mission kind.

The world context must serve the transformation. The transformation must not be distorted to fit an attractive scene.

---

## 16. World Affordance Requirements

Phase 16C expresses semantic requirements to Phase 16D.

```text
WorldAffordanceRequirement
- affordanceRole
- requiredCapabilities
- observableActions
- mutableProperties
- quantityConstraints
- relationConstraints
- feedbackCapabilities
- evidenceHookRequirements
- accessibilityConstraints
- substitutionRules
```

Examples:

- a container whose ingredient quantities can be independently changed;
- two structures with comparable dimensions;
- tradable bundles preserving or violating an exchange ratio;
- a machine showing output changes as inputs vary;
- an NPC able to request justification or demonstrate a conflicting strategy.

Phase 16C must not depend on a specific asset identifier where a semantic role is sufficient.

---

## 17. Evidence Requirement Contract

Each mission must declare the evidence it is designed to produce.

```text
MissionEvidenceRequirement
- evidenceDimension
- targetSignal
- minimumOccurrences
- diversityRequirement
- independenceRequirement
- representationRequirement
- contextRequirement
- acceptableAssistance
- contradictionSignal
- integrityRequirement
- requiredForOperationalCompletion
- requiredForLearningInterpretation
```

Evidence dimensions may include:

- representation;
- reasoning;
- procedure;
- explanation;
- correction;
- transfer;
- consistency;
- retention;
- independence;
- confidence;
- strategy selection.

A mission must not collect every dimension by default. It should collect the minimum evidence necessary for its declared cognitive purpose.

---

## 18. Assistance Envelope

```text
AssistanceEnvelope
- initialAssistanceLevel
- maximumAssistanceLevel
- allowedHintKinds
- prohibitedHintKinds
- mentorAllowed
- toolAssistanceAllowed
- escalationConditions
- evidenceImpactRules
- assistanceResetRules
```

Mission planning must protect the evidence signal.

For example, a diagnostic mission may prohibit a procedural hint before the discriminating decision, while a guided transformation mission may intentionally provide a visual scaffold.

Assistance is part of the learning design, not merely a difficulty setting.

---

## 19. Cognitive Load Envelope

```text
CognitiveLoadEnvelope
- mathematicalElementCount
- operationalStepLimit
- representationCount
- languageLoadLimit
- memoryLoadLimit
- distractionLimit
- timePressurePolicy
- motorPrecisionRequirement
- worldNavigationRequirement
```

The planner must prevent non-mathematical difficulty from overwhelming the intended transformation.

A learner must not appear mathematically unready merely because the mission requires excessive reading, navigation, fine motor control, memory, or unfamiliar game mechanics.

---

## 20. Prohibited Shortcuts

Each plan may specify shortcuts that would invalidate or weaken the intended evidence.

```text
ProhibitedShortcut
- shortcutKind
- reason
- detectionSignal
- preventionStrategy
- evidenceImpact
```

Examples:

- copying an NPC demonstration before making a diagnostic choice;
- using trial-and-error until the game accepts an answer;
- reading a displayed formula during a conceptual diagnostic;
- receiving the complete solution from a mentor;
- exploiting repeated identical values;
- completing the operational task without engaging the mathematical decision point.

The game may permit playful experimentation, but mission interpretation must distinguish exploration from evidence of understanding.

---

## 21. Mission Planning Rules

A conforming planner must obey these rules:

1. Begin from a Phase 16B diagnosis or explicit diagnostic request.
2. Select one primary cognitive intent.
3. Preserve uncertainty from the diagnosis.
4. Declare the exact transformation or evidence gap being targeted.
5. Use only graph-authorized concepts, states, transformations, and misconceptions.
6. Select a mission kind appropriate to readiness.
7. Require world contexts that preserve mathematical structure.
8. Define evidence before selecting decorative mission details.
9. Keep operational completion separate from learning interpretation.
10. Declare assistance limits before mission instantiation.
11. Reject missions whose non-mathematical load obscures the intended evidence.
12. Preserve generation traceability.
13. Provide a safe fallback when the world cannot resolve the requested affordances.
14. Never force progression when evidence remains insufficient.
15. Never repeat a mission solely because the previous mission was not operationally completed.

---

## 22. Mission Validity Checks

Before a Mission Definition becomes eligible for instantiation, validation must confirm:

- all referenced graph entities exist in the declared version;
- the source and target cognitive states match the transformation;
- readiness permits the selected mission kind;
- required contrasts are mathematically valid;
- selected representations can expose the intended reasoning;
- world affordances can support required decisions and evidence hooks;
- assistance policy does not destroy the diagnostic signal;
- operational completion cannot bypass all mathematical decision points;
- generated quantities satisfy the mathematical constraints;
- evidence requirements are observable;
- failure and inconclusive outcomes are defined;
- accessibility constraints are respected;
- no reward condition encourages a prohibited shortcut;
- the mission does not overclaim mastery authority.

Invalid plans must fail closed rather than degrade silently into generic gameplay.

---

## 23. Mission Selection and Diversity

When multiple valid plans exist, selection may consider:

- educational priority;
- diagnosis confidence;
- evidence urgency;
- learner context history;
- recent mission repetition;
- preferred activity style;
- world availability;
- narrative continuity;
- representation diversity;
- context diversity;
- assistance history;
- fatigue and session length;
- accessibility needs.

Personal preference may influence context and presentation, but it must not remove required mathematical contrasts or evidence.

The planner should avoid repeated surface-identical missions that create memorization without transfer.

---

## 24. Generated Quantity Contract

Generated values must be constrained by the educational intent.

```text
GeneratedQuantitySet
- quantitySetId
- variableRoles
- values
- units
- invariants
- contrastRelations
- solutionSpace
- distractorProperties
- difficultyProperties
- seed
- validationResult
```

Difficulty must not be approximated only by larger numbers.

Relevant difficulty properties may include:

- number structure;
- divisibility;
- representation change;
- irrelevant information;
- required reasoning depth;
- number of coordinated quantities;
- familiarity of units;
- closeness of competing options;
- need for generalization;
- assistance availability.

---

## 25. Operational Completion vs Learning Outcome

```text
OperationalCompletionStatus
- NOT_STARTED
- IN_PROGRESS
- COMPLETED
- FAILED
- ABORTED
```

```text
LearningOutcomeStatus
- NOT_EVALUATED
- EVIDENCE_INSUFFICIENT
- TARGET_SIGNAL_OBSERVED
- PARTIAL_SIGNAL_OBSERVED
- CONTRADICTORY_SIGNAL_OBSERVED
- MISCONCEPTION_SIGNAL_OBSERVED
- TRANSFER_SIGNAL_OBSERVED
- INVALID_EVIDENCE
```

Operational completion may unlock ordinary world continuity where appropriate, but it must not directly mutate mastery.

Phase 16E interprets mission evidence. Phase 16G owns mastery transitions.

---

## 26. Failure, Inconclusive, and Recovery Behavior

A mission may become inconclusive when:

- the learner exits before the discriminating decision;
- world state prevents the required contrast;
- assistance exceeds the declared envelope;
- another player performs the decisive action;
- evidence hooks fail;
- generated values are invalid;
- a prohibited shortcut is used;
- the learner succeeds operationally through an unintended route;
- connectivity or runtime interruption corrupts the evidence sequence.

Recovery options include:

- resume from a safe stage;
- regenerate only surface details while preserving the plan;
- request an alternative world binding;
- issue a smaller diagnostic experience;
- mark evidence invalid and preserve the operational history;
- return to Phase 16B for revised diagnosis.

The system must never invent missing evidence after recovery.

---

## 27. Ratio & Proportional Reasoning Continuation

Using the Phase 16A.5 validation domain and Phase 16B diagnosis, consider this request:

```text
Primary state: Difference-Based Comparison
Candidate misconception: Equal difference implies equal mixture strength
Confidence: LOW
Readiness: CONDITIONALLY_READY
Recommended transformation: Additive comparison → multiplicative comparison
Evidence needed: discriminating contrast across equal differences and unequal ratios
```

A valid 16C mission plan may be:

```text
Mission kind: MISCONCEPTION_CONTRAST
World context: Repair mortar mixing station
Cognitive intent: reveal that equal additive differences do not preserve mixture strength
Required contrast:
- Mix A = 6 stone dust : 4 binder
- Mix B = 8 stone dust : 6 binder
Both have a difference of 2, but they do not have the same ratio.
Learner action:
- predict whether the mixes behave the same;
- prepare or choose both mixtures;
- observe structural performance;
- revise or justify the comparison.
Evidence:
- attended quantities;
- comparison strategy;
- prediction;
- revision after outcome;
- explanation or demonstrative arrangement.
Assistance:
- world-operation help allowed;
- no ratio formula before initial prediction;
Operational completion:
- repair attempt completed.
Learning interpretation:
- handled later from evidence; not implied by successful repair.
```

An alternative diagnostic plan may compare two pairs where one preserves a ratio and another preserves only a difference, requiring the learner to identify which mixture remains equivalent.

---

## 28. Mission Generation Trace

Every generated mission must preserve an auditable trace.

```text
MissionGenerationTrace
- traceId
- requestId
- snapshotId
- graphVersion
- diagnosisPolicyVersion
- missionPolicyVersion
- selectedTransformationId
- consideredMissionKinds
- rejectedMissionKinds
- consideredPatterns
- selectedPatternId
- contextSelectionRationale
- representationSelectionRationale
- evidenceSelectionRationale
- assistanceSelectionRationale
- generatedQuantityValidation
- worldCapabilitySnapshot
- randomizationSeed
- generatedAt
```

The trace supports debugging, educational review, governance, and future model evaluation.

It must not expose sensitive learner information beyond authorized boundaries.

---

## 29. Versioning and Supersession

Mission plans and definitions must be versioned when changes affect:

- cognitive intent;
- transformation target;
- required contrast;
- evidence requirement;
- assistance envelope;
- generated quantity policy;
- operational completion;
- learning interpretation;
- world affordance requirements;
- accessibility behavior.

Historical mission instances must continue referencing the exact definition and policy versions under which they were generated.

A new definition may supersede an old one but must not rewrite historical evidence meaning.

---

## 30. Privacy, Safety, and Learner Dignity

Mission generation must not:

- expose diagnosis labels directly as judgments about the learner;
- publicly identify a learner as weak or behind;
- repeatedly assign humiliating remediation narratives;
- manipulate frustration to increase engagement;
- use speed pressure where it is not mathematically meaningful;
- present misconceptions as laziness;
- make paid access a condition for ordinary evidence collection;
- select contexts that reveal sensitive learner information to peers;
- produce missions that are inaccessible because of avoidable language, motor, or sensory demands.

Learner-facing mission language should express meaningful world purpose, not diagnostic classification.

---

## 31. Determinism and Idempotency

Mission creation must support idempotent generation.

The same accepted request and idempotency key must not create duplicate active mission instances.

```text
MissionGenerationCommand
- commandId
- idempotencyKey
- requestId
- expectedSnapshotVersion
- expectedWorldCapabilityVersion
- requestedAt
```

If the learner snapshot changes materially before instantiation, the plan must be revalidated rather than used blindly.

---

## 32. Observability

The runtime should record:

- request acceptance and rejection;
- selected transformation;
- selected mission kind;
- rejected pattern reasons;
- world resolution failures;
- quantity validation failures;
- mission instantiation latency;
- assistance-envelope changes;
- operational completion;
- evidence sufficiency result;
- inconclusive and invalidation reasons;
- regeneration frequency;
- repeated-context frequency;
- learner abandonment without punitive interpretation.

Operational metrics must not be treated as educational truth without evidence analysis.

---

## 33. API-Oriented Contract Boundary

Illustrative application contracts:

```text
planCognitiveMission(input)
→ CognitiveMissionPlan
```

```text
generateMissionDefinition(planId, worldCapabilitySnapshot)
→ MissionDefinition | MissionGenerationFailure
```

```text
instantiateMission(definitionId, learnerId, worldInstanceId, idempotencyKey)
→ MissionInstance
```

```text
revalidateMissionPlan(planId, snapshotVersion, worldCapabilityVersion)
→ VALID | REPLAN_REQUIRED | INVALID
```

Possible failure codes:

```text
DIAGNOSIS_NOT_FOUND
DIAGNOSIS_STALE
TRANSFORMATION_NOT_FOUND
READINESS_INCOMPATIBLE
INSUFFICIENT_EDUCATIONAL_CONSTRAINTS
NO_VALID_EXPERIENCE_PATTERN
NO_SUITABLE_WORLD_AFFORDANCE
INVALID_REQUIRED_CONTRAST
INVALID_GENERATED_QUANTITIES
EVIDENCE_NOT_OBSERVABLE
ASSISTANCE_POLICY_CONFLICT
COGNITIVE_LOAD_EXCEEDED
ACCESSIBILITY_REQUIREMENT_UNSATISFIED
MISSION_ALREADY_ACTIVE
SNAPSHOT_VERSION_CONFLICT
WORLD_CAPABILITY_VERSION_CONFLICT
```

---

## 34. Downstream Contract for Phase 16D

Phase 16D must receive:

- semantic world affordance requirements;
- eligible context and zone tags;
- NPC role requirements;
- object and resource roles;
- required mathematical decision points;
- required contrasts;
- evidence hook locations;
- setup and stage constraints;
- allowable substitutions;
- accessibility requirements;
- operational completion rules.

Phase 16D must resolve these requirements into concrete world actors, objects, locations, interactions, and runtime bindings without changing the educational contract.

If the world cannot satisfy the contract, it must return a resolution failure rather than silently simplifying the mission.

---

## 35. Downstream Contract for Phase 16E

Phase 16E must receive:

- mission cognitive intent;
- target transformation;
- required evidence dimensions;
- expected target signals;
- expected misconception signals;
- contradiction signals;
- acceptable assistance;
- evidence integrity requirements;
- generated quantity semantics;
- operational action trace references;
- mission-definition and policy versions.

Phase 16E must return evidence interpretation without treating operational completion as mastery.

---

## 36. Acceptance Criteria

Phase 16C architecture is complete when it can:

1. consume a bounded diagnosis from Phase 16B;
2. preserve diagnosis confidence and ambiguity;
3. select a transformation-specific mission kind;
4. define a productive experience rather than a generic quest;
5. specify controlled mathematical contrasts;
6. specify representation and world-context requirements;
7. define the minimum required evidence;
8. declare assistance and cognitive-load envelopes;
9. prevent operational completion from implying learning success;
10. generate a versioned and auditable mission plan;
11. bind through semantic world affordances rather than hard-coded assets;
12. reject educationally invalid mission candidates;
13. support recovery without inventing evidence;
14. support idempotent mission creation;
15. hand an explicit contract to Phases 16D and 16E.

---

## 37. Validation Decision

**Result: PASS — FOUNDATION ARCHITECTURE DEFINED**

Phase 16C now defines the bridge from cognitive diagnosis to playable mission planning without reducing learning to quest completion.

The resulting chain is:

```text
Evidence-backed Diagnosis
        ↓
Transformation-Specific Readiness
        ↓
Cognitive Mission Request
        ↓
Cognitive Mission Plan
        ↓
World Affordance Contract
        ↓
Playable Mission Definition
        ↓
Mission Evidence Contract
```

The next architectural step is **Phase 16D — World Activity Binding**, which must prove that these semantic mission requirements can be resolved into concrete Builder's Valley runtime interactions without corrupting their mathematical meaning.
