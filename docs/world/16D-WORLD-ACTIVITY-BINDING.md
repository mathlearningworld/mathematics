# 16D — World Activity Binding

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16D — World Activity Binding  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16A.5-RATIO-PROPORTIONAL-REASONING-VALIDATION-SLICE.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`  
**Downstream Consumers:** 16E Mathematical Evidence & Assessment, 16F Hint & Mentor Support, 16G Mastery & Progression, world runtime, NPC runtime, building runtime, crafting runtime, trading runtime, construction runtime

---

## 1. Purpose

This guide defines how an educationally valid Cognitive Mission Plan is bound to concrete, playable affordances inside Builder's Valley without losing the intended cognitive transformation or evidence contract.

Phase 16C decides what experience is educationally required. Phase 16D decides how the existing world can faithfully realize that experience through places, actors, objects, systems, actions, constraints, and consequences.

The central doctrine is:

> The world must carry the mathematics through its behavior, not merely display mathematics in its dialogue or interface.

A conforming activity must answer:

> Which world actions make the target relationship visible, consequential, revisable, and observable?

---

## 2. Architectural Position

```text
Cognitive Mission Plan
        ↓
World Affordance Requirements
        ↓
Activity Binding Resolution
        ↓
Bound World Activity
        ↓
Playable Interaction Graph
        ↓
Runtime Events
        ↓
Evidence Candidates for Phase 16E
```

Phase 16D is the translation boundary between educational intent and world runtime capability.

It must preserve both sides:

- the cognitive meaning defined by Phases 16A–16C;
- the operational truth of the actual game world.

It must not invent educational meaning that the world interaction does not genuinely express, and it must not force the world to imitate a worksheet when a native interaction can carry the mathematics.

---

## 3. Authority Boundary

Phase 16D owns:

- world-affordance identity and capability contracts;
- binding a mission plan to places, NPCs, objects, tools, resources, and world systems;
- playable interaction graphs;
- activity preconditions and runtime constraints;
- world-state setup and reset requirements;
- semantic mapping between player actions and mathematical meaning;
- preserving required contrasts inside the world;
- preventing world shortcuts that invalidate evidence;
- fallback binding when preferred content is unavailable;
- capability discovery and compatibility checks;
- operational completion conditions for bound activities;
- event emission requirements for Phase 16E;
- binding versioning, traceability, and invalidation.

Phase 16D does not own:

- definitions of learning targets or cognitive transformations;
- learner diagnosis or readiness;
- educational mission selection;
- authoritative evidence interpretation or scoring;
- mastery state transitions;
- hint pedagogy or mentor policy;
- economy balance, narrative progression, or reward policy except where required to preserve activity integrity.

---

## 4. Core Doctrine

### 4.1 Mathematics Must Be Native to the Activity

The mathematical relationship must affect what happens in the world.

Weak binding:

```text
NPC asks a ratio question in dialogue.
Player selects one of four answers.
World outcome is unchanged except for a reward.
```

Strong binding:

```text
Player mixes two materials.
The chosen relationship changes strength, color, flow, cost, or structural behavior.
The player can inspect, compare, revise, and test the result.
```

The second interaction exposes the mathematical structure through the world system itself.

### 4.2 Educational Intent Has Priority over Decorative Fit

A visually attractive activity is not valid if it fails to produce the required contrast or evidence.

The binder must reject a candidate when:

- the world action can be completed without engaging the target relationship;
- the correct outcome is obvious from decoration alone;
- a shortcut bypasses the intended reasoning;
- the player cannot observe meaningful consequences;
- the activity captures only final answers when process evidence is required;
- the world context introduces irrelevant complexity that obscures the target.

### 4.3 World Integrity Has Priority over Forced Curriculum

The binder must not assign an activity to an NPC, location, or system whose role makes no coherent sense in the world.

Educational experiences should arise from believable needs such as:

- repairing structures;
- measuring land;
- planning materials;
- trading goods;
- organizing storage;
- navigating routes;
- balancing machines;
- preparing mixtures;
- designing patterns;
- distributing resources;
- coordinating time and labor.

### 4.4 One Activity May Carry Multiple Meanings, but One Binding Must Declare Its Primary Intent

A construction task may involve ratio, area, estimation, and optimization. The binding must declare which transformation is primary, which signals are supporting, and which outcomes must not be interpreted as evidence for unrelated mastery.

---

## 5. World Affordance Model

A World Affordance describes a stable capability of the game world that can support one or more learning experiences.

```text
WorldAffordance
- affordanceId
- canonicalName
- affordanceKind
- worldSystemId
- supportedActionTypes
- semanticCapabilities
- observableStateChanges
- controllableVariables
- fixedVariables
- comparisonCapabilities
- revisionCapabilities
- consequenceCapabilities
- evidenceEventTypes
- accessibilityCapabilities
- multiplayerCapabilities
- requiredAssets
- requiredRuntimeFeatures
- availabilityPolicy
- status
- version
```

Affordance kinds may include:

```text
CONSTRUCTION
CRAFTING
MIXING
TRADING
MEASUREMENT
SORTING
DISTRIBUTION
NAVIGATION
MACHINE_CONTROL
RESOURCE_PLANNING
PATTERN_DESIGN
FARMING
STORAGE
CONVERSATION
INSPECTION
SIMULATION
COLLABORATION
```

An affordance is not a mission and not a specific scene. It is a reusable declaration of what a world system can make possible.

---

## 6. World Entity Roles

### 6.1 Place

```text
WorldPlace
- placeId
- placeKind
- regionId
- availableAffordanceIds
- environmentalConstraints
- accessibilityProfile
- narrativeRole
- crowdingRisk
- resetCapabilities
- status
- version
```

Examples:

- workshop;
- market;
- bridge site;
- quarry;
- farm;
- storage yard;
- water station;
- town square;
- classroom-like civic space only when naturally justified.

### 6.2 NPC Role

```text
WorldActorRole
- actorRoleId
- roleKind
- domainResponsibilities
- supportedMissionFunctions
- supportedDialogueFunctions
- authorityLimits
- mentorCapabilities
- relationshipConstraints
- availabilityPolicy
- status
- version
```

NPC mission functions may include:

```text
REQUESTER
CONTEXT_PROVIDER
COLLABORATOR
OBSERVER
CUSTOMER
SUPPLIER
INSPECTOR
MENTOR
RECIPIENT
WITNESS
```

The same NPC must not automatically become the authority for every mathematical domain merely because the character is available.

### 6.3 World Object

```text
WorldObjectCapability
- objectTypeId
- interactionModes
- measurableProperties
- transformableProperties
- compositionalRules
- comparisonRules
- failureBehaviors
- resetBehavior
- evidenceEventTypes
- accessibilityModes
- version
```

### 6.4 Tool

```text
WorldToolCapability
- toolTypeId
- supportedOperations
- precisionProfile
- representationProduced
- assistanceLevel
- shortcutRisk
- evidenceImpact
- availabilityPolicy
- version
```

Tools may support learning, but a tool that computes the entire relationship can invalidate evidence when independent reasoning is required.

---

## 7. Activity Binding Request

Phase 16D consumes a binding request derived from the Cognitive Mission Plan.

```text
WorldActivityBindingRequest
- requestId
- missionPlanId
- missionPlanVersion
- learnerContextRef
- primaryTransformationId
- secondaryTargetIds
- requiredExperiencePatternIds
- requiredContrastIds
- requiredEvidenceDimensions
- prohibitedShortcutTags
- assistanceEnvelope
- cognitiveLoadEnvelope
- suitableContextTags
- unsuitableContextTags
- accessibilityRequirements
- multiplayerPolicy
- preferredWorldRegionIds
- preferredActorRoleIds
- worldStateConstraints
- generationPolicyVersion
- requestedAt
```

The binder must not reinterpret the requested cognitive transformation. It may report that no valid binding exists.

---

## 8. Bound World Activity

```text
BoundWorldActivity
- bindingId
- bindingVersion
- missionPlanId
- primaryTransformationId
- placeId
- actorBindings
- objectBindings
- toolBindings
- worldSystemBindings
- interactionGraph
- semanticActionMap
- setupPlan
- resetPlan
- operationalCompletionContract
- evidenceEmissionContract
- prohibitedRuntimePaths
- accessibilityAdaptations
- multiplayerConfiguration
- fallbackBindingIds
- validityWindow
- worldContentVersion
- bindingPolicyVersion
- generationTrace
- status
```

A binding is valid only when every required educational capability is matched to an actual world capability.

---

## 9. Semantic Action Map

The Semantic Action Map declares what mathematical meaning may be inferred from each world action.

```text
SemanticActionMapEntry
- worldActionType
- targetConceptIds
- candidateReasoningActions
- representationMeaning
- requiredContext
- observableInputs
- observableOutputs
- ambiguityRisks
- evidenceCandidateType
- evidenceLimitations
```

Example:

```text
World action: combine 6 stone units with 4 binder units
Possible meaning: instantiate ratio 6:4
Not sufficient for: proportional reasoning mastery
Additional required evidence: comparison, prediction, or transfer
```

The map must state limitations explicitly. A world action must never be treated as stronger evidence than it actually provides.

---

## 10. Playable Interaction Graph

A bound activity is represented as a graph rather than a fixed list of clicks.

```text
InteractionNode
- nodeId
- nodeKind
- worldStateRequirement
- availablePlayerActions
- emittedEventTypes
- educationalFunction
- completionContribution
- failureBehavior
- recoveryNodeId
```

```text
InteractionEdge
- fromNodeId
- toNodeId
- trigger
- guardConditions
- worldMutation
- evidenceCandidateEffects
- assistanceEffects
```

Node kinds may include:

```text
ORIENT
INSPECT
PLAN
SELECT
MEASURE
COMBINE
BUILD
TEST
COMPARE
EXPLAIN
REVISE
TRANSFER
CONFIRM
RECOVER
COMPLETE
```

The graph must allow productive variation while protecting required contrasts and evidence opportunities.

---

## 11. Activity Binding Resolution

The binder evaluates candidate affordances in stages.

```text
Mission Requirements
        ↓
Capability Filtering
        ↓
Semantic Compatibility
        ↓
Evidence Compatibility
        ↓
Shortcut Risk Evaluation
        ↓
World Coherence Evaluation
        ↓
Accessibility Evaluation
        ↓
Runtime Availability
        ↓
Binding Selection
```

A candidate binding receives a traceable result:

```text
BindingCandidateEvaluation
- candidateId
- affordanceIds
- capabilityMatch
- semanticMatch
- evidenceMatch
- shortcutRisk
- cognitiveLoadFit
- worldCoherenceFit
- accessibilityFit
- availabilityFit
- rejectionReasons
- scoreOrRank
```

Ranking may be policy-driven, but hard educational constraints must not be traded away for convenience.

---

## 12. Required Contrast Preservation

A required contrast from Phase 16C must be instantiated in observable world terms.

Example for ratio reasoning:

```text
Pair A: 6 stone + 4 binder
Pair B: 8 stone + 6 binder
```

Both quantities increase by 2, but the ratios differ.

The world binding must ensure that:

- both mixtures can be produced or inspected;
- consequences differ in a perceivable way;
- the difference is not revealed solely by a textual label;
- the learner can compare or test the outcomes;
- the activity records what quantities and strategies were used;
- the player can revise the choice;
- unrelated resource scarcity does not force one answer.

A contrast is invalid when world state accidentally makes one option impossible or obviously superior for non-mathematical reasons.

---

## 13. Operational Completion Contract

Operational completion records whether the world task reached its runtime goal.

```text
OperationalCompletionContract
- requiredWorldStatePredicates
- requiredInteractionNodes
- optionalInteractionNodes
- allowedRecoveryPaths
- terminalSuccessStates
- terminalFailureStates
- abandonmentPolicy
- timeoutPolicy
```

Operational completion must remain separate from learning interpretation.

Examples:

- the bridge was repaired;
- the order was delivered;
- the machine started;
- the storage layout passed inspection.

These outcomes do not independently prove the intended cognitive transformation.

---

## 14. Evidence Emission Contract

Phase 16D must emit semantically meaningful runtime events for Phase 16E.

```text
WorldLearningEvent
- eventId
- bindingId
- missionInstanceId
- learnerId
- occurredAt
- interactionNodeId
- worldActionType
- objectRefs
- inputState
- selectedQuantities
- representationState
- actionSequenceRef
- resultingWorldState
- comparisonContext
- revisionContext
- assistanceContext
- multiplayerContext
- integrityFlags
- clientEventVersion
- serverObservedAt
```

Required properties:

- event identity is unique and idempotent;
- ordering information is preserved;
- raw actions are not silently collapsed into only a final result;
- assistance and collaboration remain attributable;
- invalid or incomplete events are flagged rather than discarded;
- world content and binding versions are traceable.

Phase 16D emits evidence candidates. Phase 16E decides their educational meaning and strength.

---

## 15. Shortcut Protection

A prohibited shortcut is any runtime path that allows completion while bypassing the intended reasoning or evidence.

Examples:

- copying a displayed formula when construction reasoning is required;
- repeatedly trying combinations without the sequence being observable;
- buying the completed object instead of planning it;
- asking an NPC for the exact answer when only strategic hints are allowed;
- using a calculator when quantity relationships must be constructed mentally or visually;
- receiving another player's final configuration without participating;
- exploiting inventory duplication or reset behavior;
- reading outcome labels that disclose the correct option before testing.

```text
ProhibitedRuntimePath
- pathId
- triggerPattern
- educationalRisk
- preventionStrategy
- detectionEvent
- evidenceImpact
- recoveryPolicy
```

Shortcut protection must not punish exploration. The system should distinguish productive experimentation from bypass behavior.

---

## 16. Accessibility and Representation Adaptation

A binding may adapt presentation without changing the mathematical relationship.

Supported adaptations may include:

- visual scaling and contrast;
- audio cues;
- reduced motor precision requirements;
- alternate input methods;
- symbol, diagram, object, or spoken representation;
- slower world timing;
- reduced decorative clutter;
- chunked interaction sequences;
- accessible comparison tools.

The binder must record when an adaptation changes the evidence meaning.

For example, a measuring guide may be a neutral accessibility support in one mission but an educational scaffold in another.

Language proficiency must not become an unnecessary barrier to demonstrating mathematical understanding.

---

## 17. Cognitive Load Envelope

The world activity must respect the Cognitive Load Envelope declared by Phase 16C.

```text
CognitiveLoadEvaluation
- relevantVariableCount
- requiredMemorySpan
- actionSequenceLength
- interfaceComplexity
- narrativeComplexity
- spatialNavigationDemand
- readingDemand
- timePressure
- distractorLoad
- fitDecision
```

The binder must reject or simplify contexts where unrelated demands overwhelm the target transformation.

It must also avoid removing all meaningful complexity when transfer evidence requires the learner to preserve a relationship across changing contexts.

---

## 18. Multiplayer and Mentor Binding

A mission may involve peers, family mentors, teachers, or other players.

```text
MultiplayerActivityBinding
- participantRoles
- actionOwnership
- sharedWorldState
- privateDecisionPoints
- communicationPolicy
- assistanceLimits
- evidenceAttributionPolicy
- conflictResolution
- disconnectRecovery
```

The system must distinguish:

- learner-owned decisions;
- jointly constructed solutions;
- mentor prompts;
- direct instruction;
- copied actions;
- observation without participation.

Collaborative success is valuable, but it must not be misreported as independent evidence.

---

## 19. Binding Lifecycle

```text
REQUESTED
    ↓
CAPABILITY_MATCHING
    ↓
VALIDATING
    ↓
BOUND
    ↓
READY
    ↓
ACTIVE
    ↓
COMPLETED | ABANDONED | INVALIDATED
```

### 19.1 REQUESTED

A valid Cognitive Mission Plan requests a world realization.

### 19.2 CAPABILITY_MATCHING

The binder discovers available world affordances.

### 19.3 VALIDATING

Educational, operational, accessibility, and evidence constraints are checked.

### 19.4 BOUND

A complete binding exists but runtime setup has not yet been confirmed.

### 19.5 READY

Required world content and state are available.

### 19.6 ACTIVE

A mission instance is executing against the binding.

### 19.7 COMPLETED

The world activity reached a terminal operational state and emitted its event package.

### 19.8 ABANDONED

The learner exited without a terminal world result. Partial events remain available to Phase 16E when valid.

### 19.9 INVALIDATED

World content, runtime faults, exploits, missing assets, or semantic contract violations make the binding unsafe for educational interpretation.

---

## 20. World-State Setup and Reset

```text
WorldStateSetupPlan
- requiredEntityStates
- requiredInventoryStates
- requiredResourceRanges
- spawnedObjects
- reservedObjects
- NPCAssignments
- environmentalConditions
- isolationPolicy
- rollbackPlan
```

A setup must prevent accidental bias.

Examples:

- resource counts must not reveal the intended answer;
- previously altered objects must not contaminate the contrast;
- another player's actions must not silently change the learner's task;
- reset must not erase already persisted evidence;
- rare runtime failures must lead to a recoverable or invalidated state rather than fabricated completion.

---

## 21. Fallback Binding

When a preferred location, NPC, or world system is unavailable, Phase 16D may select a fallback only when semantic equivalence is preserved.

```text
FallbackBindingDecision
- preferredBindingId
- fallbackBindingId
- preservedRequirements
- changedContextFeatures
- evidenceImpact
- assistanceImpact
- approvalPolicy
```

Changing from a workshop mixture task to a market exchange task is not automatically equivalent merely because both contain ratios.

The binder must compare the required experience pattern, contrast, evidence dimensions, and prohibited shortcuts.

If no valid fallback exists, the correct result is `NO_VALID_BINDING`.

---

## 22. Failure Model

```text
WorldBindingFailureCode
- NO_COMPATIBLE_AFFORDANCE
- REQUIRED_CONTRAST_UNAVAILABLE
- EVIDENCE_EVENTS_UNSUPPORTED
- PROHIBITED_SHORTCUT_UNCONTROLLED
- WORLD_STATE_UNAVAILABLE
- REQUIRED_ASSET_MISSING
- NPC_ROLE_UNAVAILABLE
- ACCESSIBILITY_REQUIREMENT_UNSATISFIED
- COGNITIVE_LOAD_EXCEEDED
- MULTIPLAYER_POLICY_UNSATISFIED
- CONTENT_VERSION_CONFLICT
- BINDING_POLICY_CONFLICT
- RUNTIME_CAPABILITY_MISMATCH
```

Failure must be explicit and traceable. The system must not silently downgrade required educational constraints.

---

## 23. Determinism and Versioning

For the same:

- mission plan version;
- world content version;
- binding policy version;
- runtime capability snapshot;
- availability snapshot;
- learner accessibility requirements;

the binder should produce the same selected binding or the same explainable candidate ordering.

Persisted bindings must record:

```text
- missionPlanVersion
- worldContentVersion
- affordanceCatalogVersion
- bindingPolicyVersion
- runtimeCapabilityVersion
- evidenceEventSchemaVersion
```

A binding must be reevaluated when a relevant authority changes.

---

## 24. Security and Integrity

Phase 16D must protect against:

- client-forged world actions;
- duplicated events;
- reordered event sequences;
- unauthorized inventory changes;
- impossible object transformations;
- cross-learner evidence attribution;
- hidden developer tools affecting activity outcomes;
- stale mission instances executing against new content;
- multiplayer impersonation;
- replay attacks on completion events.

Authoritative server validation should be used for consequential world state and evidence integrity whenever feasible.

---

## 25. Ratio Validation Continuation

### 25.1 Cognitive Intent

Target transformation:

```text
Difference-Based Comparison
        ↓
Multiplicative Comparison
```

Required contrast:

```text
6 stone : 4 binder
8 stone : 6 binder
```

The pairs share equal additive differences but do not represent equal ratios.

### 25.2 Preferred World Binding

```text
Place: bridge repair mixing station
NPC: site engineer as requester and observer
Objects: stone aggregate bins, binder bins, two test molds
Tools: quantity scoop, balance indicator, strength tester
World system: material mixing and structural testing
```

### 25.3 Interaction Graph

```text
Inspect damaged support
        ↓
Inspect two candidate recipes
        ↓
Predict whether both mixtures are equivalent
        ↓
Prepare or select mixtures
        ↓
Test both samples
        ↓
Compare behavior
        ↓
Revise explanation or recipe
        ↓
Apply chosen mixture to repair
        ↓
Observe structural result
```

### 25.4 Evidence Candidates

The binding must emit enough information to observe:

- quantities attended to;
- whether comparison was additive or multiplicative;
- prediction before testing;
- selected representation;
- sequence of mixture changes;
- response to contradictory outcome;
- independent or assisted revision;
- transfer from test sample to bridge application.

### 25.5 Invalid Binding Examples

- NPC simply asks which ratio is equal;
- strength labels expose the answer before action;
- only one recipe can be afforded;
- player can skip testing and auto-complete the repair;
- random material quality overwhelms the ratio effect;
- another player prepares the final mixture while the learner only delivers it.

---

## 26. API-Oriented Contracts

Illustrative command:

```text
BindWorldActivityCommand
- tenantId
- learnerId
- missionPlanId
- expectedMissionPlanVersion
- worldContextId
- runtimeCapabilitySnapshotId
- accessibilityProfileId
- idempotencyKey
- correlationId
- requestedAt
```

Illustrative result:

```text
BindWorldActivityResult
- bindingId
- bindingVersion
- status
- selectedPlaceId
- selectedActorBindings
- selectedAffordanceIds
- setupPlanRef
- interactionGraphRef
- evidenceEmissionContractRef
- fallbackBindingIds
- createdAt
```

Illustrative refusal:

```text
BindWorldActivityFailure
- code
- message
- missionPlanId
- candidateSummary
- unsatisfiedRequirements
- safeNextAction
- correlationId
```

---

## 27. Repository and Runtime Boundaries

Recommended module boundaries:

```text
world-activity-binding/
├── domain/
│   ├── world-affordance
│   ├── bound-world-activity
│   ├── semantic-action-map
│   ├── interaction-graph
│   └── binding-failure
├── application/
│   ├── bind-world-activity
│   ├── validate-binding
│   ├── resolve-fallback-binding
│   └── invalidate-binding
├── ports/
│   ├── affordance-catalog
│   ├── world-state-reader
│   ├── runtime-capability-reader
│   ├── binding-repository
│   └── event-contract-registry
└── infrastructure/
    ├── builder-valley-affordance-catalog
    ├── world-runtime-adapter
    └── persistence
```

World systems remain owners of their runtime behavior. Phase 16D owns the binding contract, not the internal implementation of every world system.

---

## 28. Conformance Rules

A Phase 16D implementation conforms only when:

1. every bound activity references an authoritative mission plan;
2. every required experience and contrast maps to actual world behavior;
3. mathematical meaning is represented in the activity, not only in text;
4. semantic action limitations are explicit;
5. operational completion is separated from learning evidence;
6. required event sequences are observable and traceable;
7. prohibited shortcuts are prevented, detected, or reflected in evidence integrity;
8. accessibility adaptation is supported without silently changing evidence meaning;
9. collaboration and assistance are attributable;
10. world-state setup and reset are deterministic enough for valid interpretation;
11. unavailable requirements result in explicit binding failure;
12. binding, content, capability, and event schema versions are recorded;
13. partial and abandoned play may retain valid evidence candidates;
14. Phase 16E receives semantically rich events rather than only pass/fail outcomes.

---

## 29. Downstream Contract for Phase 16E

Phase 16D guarantees that Phase 16E can receive:

- the authoritative binding identity and version;
- the mission and transformation references;
- ordered world-action events;
- semantic action mappings;
- world-state before and after relevant actions;
- representations and quantities used;
- assistance and collaboration context;
- revision and comparison context;
- operational completion state;
- integrity and shortcut flags;
- known evidence limitations.

Phase 16E must not infer evidence strength from raw world events without consulting the binding's semantic contract.

---

## 30. Validation Decision

**Result: PASS — WORLD BINDING ARCHITECTURE DEFINED**

The architecture can translate a Cognitive Mission Plan into a playable world activity while preserving:

- the intended cognitive transformation;
- required contrasts;
- observable player reasoning;
- world coherence;
- operational integrity;
- accessibility;
- evidence traceability;
- separation between game completion and learning interpretation.

The learning pipeline is now connected through:

```text
Cognitive Transformation Graph
        ↓
Learner Cognitive Diagnosis
        ↓
Cognitive Mission Planning
        ↓
World Activity Binding
        ↓
Playable World Events
        ↓
Mathematical Evidence & Assessment
```

---

## 31. Next Phase

Phase 16E must define how emitted world events become normalized mathematical evidence, how evidence quality and integrity are evaluated, and how multiple observations are combined without reducing learning to correctness or score alone.

**Next:** `16E — Mathematical Evidence & Assessment`
