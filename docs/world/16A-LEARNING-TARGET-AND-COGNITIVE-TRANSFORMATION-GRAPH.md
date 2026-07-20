# 16A — Learning Target & Cognitive Transformation Graph

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16A — Learning Target & Cognitive Transformation Graph  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Downstream Consumers:** 16B–16J, Learning Engine, Mission Engine, Evidence Engine, Mastery Engine, World Projection, Parent/Teacher Projection

---

## 1. Purpose

This guide defines the authoritative structure used to represent mathematical understanding, its prerequisites, its observable evidence, and the transformations required to move a learner from one mental model to another.

The system does not treat mathematics as a sequence of textbook chapters. It treats mathematical learning as a connected graph of cognitive transformations.

The central principle is:

> A learning target is not merely content to be covered. It is an observable change in how a learner represents, reasons about, applies, and explains a mathematical idea.

This graph becomes the shared source of truth for diagnostics, mission generation, world activities, evidence collection, mastery decisions, remediation, progression, mentoring, and reporting.

---

## 2. Architectural Shift

Traditional content systems commonly model learning as:

```text
Grade → Chapter → Lesson → Exercise → Score
```

Math Learning World must model learning as:

```text
Current Mental Model
        ↓
Required Cognitive Transformation
        ↓
Target Understanding
        ↓
Observable Evidence
        ↓
Transfer and Retention
```

A curriculum standard may reference the graph, but it must not define the learner's actual path through it.

Grade level is a reporting and expectation boundary. It is not the authority for prerequisite readiness.

---

## 3. Cognitive Transformation Engine

Phase 16A establishes the foundational graph consumed by the broader Cognitive Transformation Engine.

```text
Cognitive Transformation Engine
│
├── Knowledge and Concept Graph
├── Cognitive Transformation Graph
├── Readiness Engine
├── Evidence Engine
├── Mastery Engine
├── Mission Generator
├── Recommendation Engine
└── World Projection Engine
```

The Learning Mission System remains the authoritative runtime for playable learning progression. The Cognitive Transformation Engine defines what understanding must change and how that change can be recognized.

---

## 4. Authority Boundary

Phase 16A owns:

- learning-target identity and meaning;
- skill and concept-node identity;
- cognitive-state definitions;
- prerequisite and dependency relationships;
- transformation relationships;
- misconception references;
- required evidence dimensions;
- mastery expectations attached to targets;
- curriculum mappings;
- game-projection affordances;
- graph integrity rules.

Phase 16A does not own:

- learner-specific readiness decisions;
- mission selection or generation;
- live mission state;
- concrete world task composition;
- evidence scoring algorithms;
- mastery state transitions for an individual learner;
- rewards, economy outcomes, or narrative progression.

Those responsibilities belong to downstream Phase 16 guides and runtimes.

---

## 5. Core Domain Model

### 5.1 Learning Target

A Learning Target defines an observable mathematical capability that a learner can demonstrate.

A conforming Learning Target must include:

```text
LearningTarget
- targetId
- canonicalName
- learnerFacingMeaning
- domain
- strand
- targetKind
- observableOutcome
- requiredRepresentations
- requiredReasoningActions
- evidenceRequirements
- masteryExpectation
- curriculumMappings
- gameProjectionTags
- status
- version
```

A target must not be only a topic label such as `Fractions`, `Equations`, or `Area`.

Valid target examples:

- compare fractional quantities using more than one representation;
- represent an unknown quantity with a symbol and preserve its meaning across operations;
- interpret area as measurable coverage rather than a memorized formula;
- construct and validate a proportional relationship from a world situation.

### 5.2 Concept Node

A Concept Node represents a durable mathematical idea that may support multiple Learning Targets.

```text
ConceptNode
- conceptId
- canonicalName
- meaning
- representations
- examples
- counterExamples
- misconceptions
- realWorldContexts
- gameAffordances
- status
- version
```

Concept Nodes are reusable knowledge structures. Learning Targets describe what the learner must be able to do with them.

### 5.3 Cognitive State

A Cognitive State describes a meaningful learner mental model before or after a transformation.

```text
CognitiveState
- stateId
- conceptId
- stateKind
- description
- observableIndicators
- likelyErrors
- compatibleRepresentations
- limitations
```

State kinds may include:

- `NAIVE_MODEL`
- `PARTIAL_MODEL`
- `PROCEDURAL_MODEL`
- `CONCEPTUAL_MODEL`
- `CONNECTED_MODEL`
- `TRANSFERABLE_MODEL`

The state model must describe reasoning, not label the learner.

### 5.4 Cognitive Transformation

A Cognitive Transformation defines a meaningful change from one cognitive state to another.

```text
CognitiveTransformation
- transformationId
- fromStateId
- toStateId
- transformationKind
- transformationIntent
- productiveExperiences
- requiredContrasts
- evidenceSignals
- failureSignals
- remediationTags
- status
- version
```

Examples:

- counting visible objects → reasoning about number as an abstract quantity;
- treating a fraction as two whole numbers → reasoning about a fraction as one quantity;
- applying a memorized area formula → reasoning about area through decomposition and coverage;
- manipulating symbols procedurally → preserving the meaning of an unknown through equivalent transformations.

### 5.5 Misconception

A Misconception represents a stable but mathematically limited model that may produce predictable errors.

```text
Misconception
- misconceptionId
- conceptId
- description
- observablePatterns
- triggerContexts
- distinguishingEvidence
- likelyOrigins
- remediationPrinciples
```

Misconceptions must be treated as diagnostic hypotheses, not permanent learner attributes.

---

## 6. Target Kinds

Every Learning Target must declare one primary `targetKind`:

- `REPRESENTATION` — express a mathematical idea in a meaningful form;
- `INTERPRETATION` — explain the meaning of a representation or result;
- `RELATIONSHIP` — identify and reason about mathematical relationships;
- `PROCEDURE` — execute a valid process with preserved meaning;
- `MODELING` — translate between a world situation and a mathematical model;
- `REASONING` — justify, compare, infer, generalize, or prove;
- `TRANSFER` — apply understanding in an unfamiliar context;
- `COMMUNICATION` — explain mathematical thinking to another person;
- `MENTORING` — diagnose and support another learner without replacing their reasoning.

A target may contain secondary kinds, but its primary kind must remain explicit.

---

## 7. Dependency and Relationship Types

The graph must not reduce every relationship to a single prerequisite edge.

Supported relationship kinds are:

- `REQUIRED_PREREQUISITE` — absence blocks reliable progression;
- `SUPPORTING_PREREQUISITE` — improves success but does not always block progression;
- `REPRESENTATION_BRIDGE` — connects equivalent forms or models;
- `APPLICATION_OF` — applies an existing idea in a new context;
- `EXTENSION_OF` — broadens or deepens an existing idea;
- `GENERALIZATION_OF` — moves from cases to a wider mathematical structure;
- `SPECIALIZATION_OF` — applies a general structure to a narrower case;
- `INVERSE_RELATIONSHIP` — concepts or operations that undo or reverse one another;
- `COMMON_CONFUSION_WITH` — nodes that require contrast to avoid conflation;
- `STRENGTHENS` — repeated use improves robustness of another target;
- `ALTERNATIVE_PATH` — a different valid route toward the same target;
- `TRANSFER_BRIDGE` — links understanding to a distinct context or domain.

Each relationship must include:

```text
GraphRelationship
- relationshipId
- sourceNodeId
- targetNodeId
- relationshipKind
- strength
- rationale
- blockingPolicy
- evidencePolicy
- status
- version
```

---

## 8. Mastery Expectation

Phase 16A defines mastery expectations attached to a target. Learner-specific mastery state is owned by Phase 16G.

The canonical progression vocabulary is:

```text
UNKNOWN
INTRODUCED
PRACTICING
CONSISTENT
MASTERED
TRANSFERABLE
MENTOR
```

Meaning:

- `UNKNOWN` — no trustworthy evidence exists;
- `INTRODUCED` — the learner has encountered the idea;
- `PRACTICING` — partial success exists but remains unstable or assisted;
- `CONSISTENT` — repeated success exists in familiar contexts;
- `MASTERED` — the target is reliable, meaningful, and sufficiently independent;
- `TRANSFERABLE` — understanding survives unfamiliar representations or contexts;
- `MENTOR` — the learner can support another learner while preserving that learner's agency.

A target must declare the minimum level needed for:

- downstream prerequisite satisfaction;
- curriculum expectation;
- mission completion;
- independent progression;
- mentor eligibility.

---

## 9. Evidence Dimensions

A Learning Target must define what dimensions of evidence are relevant. No single score may independently establish mastery.

Supported evidence dimensions include:

- `ACCURACY`
- `CONSISTENCY`
- `REPRESENTATION`
- `REASONING`
- `EXPLANATION`
- `TRANSFER`
- `RETENTION`
- `EFFICIENCY`
- `CONFIDENCE`
- `HINT_DEPENDENCE`
- `ERROR_RECOVERY`
- `MENTORING_QUALITY`

Evidence requirements must distinguish:

- successful completion;
- conceptual understanding;
- guessing;
- copied action;
- excessive assistance;
- fragile procedure;
- durable transfer.

Phase 16E will define evidence capture and interpretation contracts.

---

## 10. Curriculum Mapping

Curriculum mappings must attach external standards to the authoritative graph without replacing it.

```text
CurriculumMapping
- mappingId
- jurisdiction
- curriculumVersion
- gradeBand
- standardCode
- standardText
- targetId
- expectationLevel
- mappingStrength
- effectiveFrom
- effectiveTo
```

Rules:

1. One target may map to multiple curricula and grade bands.
2. One curriculum standard may map to multiple targets.
3. Grade level must not bypass prerequisites.
4. Above-grade progression is allowed when graph readiness is sufficient.
5. Below-grade remediation must target missing understanding, not merely repeat the learner's enrolled grade.
6. Reporting may use grade language, but runtime decisions must use target and readiness authority.

---

## 11. Game Projection Contract

Every production-ready Learning Target must identify meaningful ways it can appear in the world.

```text
GameProjection
- projectionTag
- suitableWorldSystems
- suitableActionPatterns
- unsuitablePatterns
- evidenceOpportunities
- representationAffordances
- narrativeAffordances
- economyAffordances
- constructionAffordances
- collaborationAffordances
```

Possible world systems include:

- construction;
- crafting;
- farming;
- trade and economy;
- navigation and measurement;
- resource allocation;
- repair and optimization;
- NPC assistance;
- planning and scheduling;
- environmental observation;
- mentoring and collaboration.

A Game Projection must not attach an unrelated worksheet after gameplay. The mathematical structure must affect the world action, decision, prediction, construction, or explanation itself.

---

## 12. Transformation-Centered Mission Principle

A Learning Mission must eventually bind to at least one Cognitive Transformation or reinforcement target.

```text
Current Cognitive State
        ↓
Selected Transformation
        ↓
World Experience
        ↓
Observable Player Decisions
        ↓
Evidence
        ↓
Readiness or Mastery Update
```

Mission completion and learning completion are separate facts.

A player may finish a world task without producing sufficient evidence of transformation. A learner may also demonstrate the target before every optional world task is complete.

Downstream systems must preserve this distinction.

---

## 13. Graph Integrity Rules

A conforming graph must satisfy all of the following:

1. Every active Learning Target has a stable identifier and version.
2. Every active target has an observable outcome.
3. Every prerequisite relationship has a documented rationale.
4. Required prerequisite cycles are forbidden.
5. Non-blocking cyclic relationships must be explicitly typed and justified.
6. Every target declares relevant evidence dimensions.
7. Every mastery expectation is explicit.
8. Curriculum mappings cannot silently redefine target meaning.
9. Game projections cannot award mastery directly.
10. Misconceptions are hypotheses supported by patterns, not labels assigned from one failure.
11. Graph changes must be versioned and migration-aware.
12. Deprecated nodes remain traceable for historical learner evidence.
13. A target cannot be marked production-ready without at least one valid assessment path and one valid world-projection path.

---

## 14. Versioning and Evolution

The graph is a durable authority and must evolve without corrupting historical evidence.

Supported lifecycle states are:

- `DRAFT`
- `REVIEW`
- `ACTIVE`
- `DEPRECATED`
- `RETIRED`

Breaking semantic changes require a new target or node version.

Historical learner evidence must retain references to the version active when the evidence was produced.

Migration rules must define whether previous evidence remains:

- fully valid;
- partially valid;
- diagnostic only;
- invalid for current mastery decisions.

---

## 15. Minimum Example Slice

The first implementation slice should not attempt to encode the complete Thai curriculum.

It should prove the model with one connected mathematical pathway.

Recommended initial pathway:

```text
Quantity Comparison
        ↓
Equivalent Quantities
        ↓
Ratio as Comparison
        ↓
Proportional Reasoning
        ↓
Unknown Quantity Representation
        ↓
Linear Relationship
```

This pathway is suitable because it connects arithmetic, ratio, modeling, algebra, construction, trade, recipes, resource allocation, and NPC requests.

The slice must include:

- at least 6 Learning Targets;
- at least 4 Concept Nodes;
- at least 2 Cognitive Transformations;
- at least 2 documented misconceptions;
- multiple relationship kinds;
- curriculum mappings;
- evidence requirements;
- at least one game projection per target.

---

## 16. Downstream Contracts

### 16B — Learner Readiness & Diagnostic State

Consumes targets, prerequisites, states, transformations, and misconceptions to determine learner-specific readiness and uncertainty.

### 16C — Mission Definition & Generation

Consumes the selected target or transformation and generates a suitable mission intent.

### 16D — World Activity Binding

Projects mission intent into meaningful Builder's Valley activities.

### 16E — Mathematical Evidence & Assessment

Captures and interprets evidence against target requirements.

### 16F — Hint, Assistance & Mentor Support

Uses cognitive states and misconceptions to provide bounded support.

### 16G — Mastery, Progression & Unlocking

Owns learner-specific mastery transitions and prerequisite satisfaction.

### 16H — Remediation & Recovery Loops

Uses failure patterns and diagnostic hypotheses to select corrective transformations.

### 16I — Parent, Teacher & Analytics Projection

Explains progress through targets, evidence, readiness, and transformations rather than opaque scores alone.

### 16J — Learning Mission Validation

Validates graph integrity, mission alignment, evidence quality, and production readiness.

---

## 17. Production Exit Criteria

Phase 16A is complete only when:

- the Learning Target contract is stable;
- the Concept Node contract is stable;
- Cognitive States and Transformations are defined;
- relationship kinds and blocking policies are defined;
- mastery expectation vocabulary is defined;
- evidence dimensions are defined;
- curriculum mapping rules are defined;
- game-projection rules are defined;
- graph integrity and versioning rules are defined;
- the minimum example slice is specified;
- downstream ownership boundaries are explicit;
- no downstream system may redefine learning authority independently.

---

## 18. Current State

This document establishes the Phase 16A foundation and reserves authority for the Learning Target and Cognitive Transformation Graph.

The next planned artifact is:

**16B — Learner Readiness & Diagnostic State**

Before 16B is finalized, the minimum example pathway in Section 15 should be modeled and reviewed as a concrete validation slice.