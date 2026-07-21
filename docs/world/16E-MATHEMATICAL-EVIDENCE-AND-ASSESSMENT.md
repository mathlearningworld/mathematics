# 16E — Mathematical Evidence & Assessment

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16E — Mathematical Evidence & Assessment  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16A.5-RATIO-PROPORTIONAL-REASONING-VALIDATION-SLICE.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`  
**Downstream Consumers:** 16F Hint & Mentor Support, 16G Mastery & Progression, 16H Remediation, 16I Parent/Teacher Projection, 16J Analytics & Governance, diagnosis runtime, mission runtime, evidence store, assessment runtime

---

## 1. Purpose

This guide defines how observable events from Builder's Valley become trustworthy mathematical evidence, how that evidence is assessed, and how assessment outcomes are returned to the learner diagnosis system without confusing operational success with learning.

The central doctrine is:

> The system does not assess whether the learner finished the task. It assesses what the learner's actions reveal about mathematical understanding.

A conforming evidence pipeline must answer:

> What happened, what mathematical meaning can legitimately be inferred, how certain is that inference, and what should change in the learner model?

---

## 2. Architectural Position

```text
Playable World Activity
        ↓
Runtime Events
        ↓
Evidence Candidate Extraction
        ↓
Evidence Validation
        ↓
Mathematical Evidence
        ↓
Assessment Interpretation
        ↓
Assessment Result
        ↓
Diagnosis Update Request
        ↓
Learner Cognitive Snapshot
```

Phase 16E closes the core learning loop established by Phases 16A–16D.

It is the authority for converting observed behavior into assessment meaning. It is not the authority for curriculum structure, mission generation, world binding, mastery policy, remediation policy, or parent-facing presentation.

---

## 3. Authority Boundary

### 3.1 Phase 16E owns

- mathematical evidence contracts;
- evidence candidate validation;
- evidence provenance and integrity;
- observation windows;
- assessment interpretation;
- confidence and sufficiency;
- contradictory evidence handling;
- evidence aggregation;
- assessment lifecycle;
- diagnosis update requests;
- replay and audit semantics;
- assessment failure taxonomy.

### 3.2 Phase 16E does not own

- learning-target definition;
- cognitive transformation graph definition;
- learner diagnosis policy itself;
- mission planning;
- world activity binding;
- hint generation;
- mastery thresholds;
- remediation scheduling;
- teacher or parent UI.

### 3.3 Non-negotiable separation

```text
Operational completion ≠ Mathematical evidence
Mathematical evidence ≠ Assessment conclusion
Assessment conclusion ≠ Mastery decision
```

Each boundary must remain explicit in data models, runtime ownership, and public APIs.

---

## 4. Core Doctrine

### 4.1 Evidence before judgment

The system must preserve the observed action before deriving an interpretation.

### 4.2 Meaning before score

The primary output is a statement about learner thinking, not a numeric score.

### 4.3 Confidence before progression

No downstream progression decision may treat low-confidence evidence as definitive.

### 4.4 Multiple observations before durable claims

A single correct outcome may be accidental, copied, hinted, or procedurally produced without conceptual understanding.

### 4.5 Contradiction is information

Conflicting evidence is not silently averaged away. It must remain visible and may indicate instability, context dependence, guessing, or a changing cognitive state.

### 4.6 The world is an evidence-generating environment

World interactions must produce events rich enough to preserve mathematical meaning, sequence, revision, assistance, and consequence.

---

## 5. Evidence Layers

The evidence system contains five distinct layers.

```text
Raw Runtime Event
        ↓
Evidence Candidate
        ↓
Validated Mathematical Evidence
        ↓
Assessment Observation
        ↓
Assessment Conclusion
```

### 5.1 Raw Runtime Event

An immutable operational fact emitted by the world runtime.

Examples:

- quantity placed;
- tool selected;
- object compared;
- mixture adjusted;
- structure tested;
- trade accepted;
- action reversed;
- hint opened;
- mentor intervened;
- explanation recorded.

### 5.2 Evidence Candidate

A runtime event or event sequence that may carry mathematical meaning but has not yet passed validation.

### 5.3 Validated Mathematical Evidence

A normalized, provenance-preserving evidence record whose mathematical meaning is supported by the activity contract.

### 5.4 Assessment Observation

An interpretation of one or more evidence records against a declared evidence requirement.

### 5.5 Assessment Conclusion

A bounded claim about learner understanding, misconception, readiness, stability, or uncertainty.

---

## 6. Core Data Models

## 6.1 MathematicalEvidence

```ts
interface MathematicalEvidence {
  evidenceId: string;
  learnerId: string;
  missionInstanceId: string;
  activityBindingId: string;
  evidenceRequirementId: string;
  targetNodeId: string;
  transformationEdgeId?: string;
  evidenceType: EvidenceType;
  semanticClaim: string;
  observedValue?: unknown;
  expectedRelationship?: unknown;
  actionTraceRef: string;
  assistanceContext: AssistanceContext;
  provenance: EvidenceProvenance;
  integrityStatus: EvidenceIntegrityStatus;
  collectedAt: string;
  version: number;
}
```

## 6.2 EvidenceProvenance

```ts
interface EvidenceProvenance {
  worldId: string;
  placeId: string;
  activityType: string;
  objectIds: string[];
  actorIds: string[];
  eventIds: string[];
  runtimeVersion: string;
  bindingVersion: string;
  missionDefinitionVersion: string;
}
```

## 6.3 AssistanceContext

```ts
interface AssistanceContext {
  hintLevel: number;
  hintsUsed: string[];
  mentorPresent: boolean;
  mentorActions: string[];
  systemCorrections: number;
  peerContribution?: number;
  independenceLevel: IndependenceLevel;
}
```

## 6.4 AssessmentObservation

```ts
interface AssessmentObservation {
  observationId: string;
  learnerId: string;
  targetNodeId: string;
  evidenceIds: string[];
  dimension: AssessmentDimension;
  interpretation: ObservationInterpretation;
  confidence: AssessmentConfidence;
  contradictionRefs: string[];
  observedAt: string;
}
```

## 6.5 AssessmentResult

```ts
interface AssessmentResult {
  assessmentId: string;
  learnerId: string;
  targetNodeId: string;
  transformationEdgeId?: string;
  missionInstanceId: string;
  status: AssessmentStatus;
  conclusions: AssessmentConclusion[];
  confidence: AssessmentConfidence;
  evidenceSufficiency: EvidenceSufficiency;
  contradictionStatus: ContradictionStatus;
  diagnosisUpdateRequest?: DiagnosisUpdateRequest;
  createdAt: string;
  assessmentVersion: number;
}
```

---

## 7. Evidence Types

```ts
type EvidenceType =
  | 'SELECTION'
  | 'CONSTRUCTION'
  | 'MEASUREMENT'
  | 'COMPARISON'
  | 'CLASSIFICATION'
  | 'SEQUENCING'
  | 'ESTIMATION'
  | 'CALCULATION'
  | 'REPRESENTATION'
  | 'REVISION'
  | 'EXPLANATION'
  | 'TRANSFER'
  | 'RETENTION'
  | 'COLLABORATION';
```

Evidence type alone does not determine strength. Strength depends on context, independence, required contrast, error opportunities, and whether the action could have been completed through a shortcut.

---

## 8. Assessment Dimensions

Assessment must support at least the following dimensions:

- representation;
- conceptual relationship;
- procedural execution;
- strategy selection;
- quantitative reasoning;
- explanation;
- transfer;
- consistency;
- retention;
- error detection;
- revision quality;
- independence.

These dimensions align with the learner diagnosis model in Phase 16B but remain evidence interpretations rather than diagnosis state.

---

## 9. Evidence Requirement Contract

Every mission definition must declare evidence requirements before runtime execution.

```ts
interface MissionEvidenceRequirement {
  evidenceRequirementId: string;
  targetNodeId: string;
  transformationEdgeId?: string;
  requiredDimension: AssessmentDimension;
  acceptableEvidenceTypes: EvidenceType[];
  minimumIndependentObservations: number;
  requiredContrasts: string[];
  prohibitedShortcuts: string[];
  acceptableAssistanceLevel: number;
  observationWindowPolicy: ObservationWindowPolicy;
  sufficiencyRule: EvidenceSufficiencyRule;
}
```

No assessment may invent an undeclared requirement after observing the learner merely to force a conclusion.

---

## 10. Evidence Candidate Extraction

Candidate extraction converts runtime events into possible evidence records.

The extractor must:

1. preserve source event IDs;
2. maintain event order;
3. preserve quantities, units, and object state;
4. include assistance and collaboration context;
5. reject events outside the active mission scope;
6. reject events generated after mission invalidation;
7. distinguish learner action from system action;
8. distinguish learner action from mentor or peer action;
9. preserve revisions rather than retaining only the final answer.

### 10.1 Sequence-sensitive evidence

Many mathematical claims require a sequence rather than a single event.

Example:

```text
Learner creates 2:3 mixture
        ↓
Tests result
        ↓
Changes both quantities proportionally
        ↓
Retests successfully
```

The revision sequence may reveal proportional reasoning more strongly than the final successful mixture alone.

---

## 11. Evidence Validation

A candidate becomes validated evidence only when all required checks pass.

### 11.1 Validation gates

- schema validity;
- mission scope validity;
- activity-binding validity;
- event integrity;
- actor attribution;
- time-window validity;
- required contrast preservation;
- shortcut exclusion;
- assistance compliance;
- semantic mapping validity;
- duplicate detection;
- version compatibility.

### 11.2 Integrity statuses

```ts
type EvidenceIntegrityStatus =
  | 'VALID'
  | 'PARTIAL'
  | 'DUPLICATE'
  | 'OUT_OF_SCOPE'
  | 'ATTRIBUTION_UNCERTAIN'
  | 'ASSISTANCE_EXCEEDED'
  | 'SHORTCUT_DETECTED'
  | 'VERSION_MISMATCH'
  | 'CORRUPTED'
  | 'INVALID';
```

Only `VALID` evidence may independently support a high-confidence conclusion.

`PARTIAL` evidence may contribute to hypothesis formation but must not be treated as decisive.

---

## 12. Observation Windows

Evidence must be interpreted within explicit observation windows.

```ts
type ObservationWindowPolicy =
  | 'SINGLE_ACTION'
  | 'ACTION_SEQUENCE'
  | 'MISSION_INSTANCE'
  | 'MULTI_MISSION'
  | 'DELAYED_RETENTION'
  | 'CROSS_CONTEXT_TRANSFER';
```

### 12.1 Single action

Useful for direct object selection or measurement, but generally weak for durable conceptual claims.

### 12.2 Action sequence

Required when strategy, revision, or causal reasoning matters.

### 12.3 Mission instance

Combines all relevant evidence from one mission.

### 12.4 Multi-mission

Required for stability and consistency claims.

### 12.5 Delayed retention

Evidence collected after time has passed, without immediate rehearsal.

### 12.6 Cross-context transfer

Evidence collected in a materially different world context from the original learning experience.

---

## 13. Evidence Sufficiency

```ts
type EvidenceSufficiency =
  | 'INSUFFICIENT'
  | 'EMERGING'
  | 'SUFFICIENT_FOR_HYPOTHESIS'
  | 'SUFFICIENT_FOR_DIAGNOSIS_UPDATE'
  | 'SUFFICIENT_FOR_MASTERY_REVIEW';
```

Evidence sufficiency is not a score threshold alone. It must consider:

- number of independent observations;
- diversity of contexts;
- consistency;
- assistance level;
- required contrast exposure;
- opportunity for error;
- delayed retention;
- transfer;
- evidence integrity.

---

## 14. Assessment Confidence

```ts
type AssessmentConfidence =
  | 'INSUFFICIENT'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';
```

Confidence must be derived from explicit factors and stored with an explanation trace.

### 14.1 Confidence factors

- evidence count;
- evidence integrity;
- independence;
- contextual diversity;
- contradiction frequency;
- temporal stability;
- transfer success;
- shortcut exposure;
- assistance intensity;
- model agreement.

### 14.2 Confidence rule

High confidence is prohibited when:

- all successful evidence occurred with strong hints;
- only one narrow context was observed;
- contradictory valid evidence remains unresolved;
- attribution is uncertain;
- required contrasts were not experienced;
- the world activity allowed a non-mathematical shortcut.

---

## 15. Assessment Status

```ts
type AssessmentStatus =
  | 'PENDING'
  | 'COLLECTING'
  | 'READY_FOR_INTERPRETATION'
  | 'INTERPRETING'
  | 'CONCLUDED'
  | 'INCONCLUSIVE'
  | 'CONTRADICTED'
  | 'INVALIDATED'
  | 'SUPERSEDED';
```

Lifecycle:

```text
PENDING
  ↓
COLLECTING
  ↓
READY_FOR_INTERPRETATION
  ↓
INTERPRETING
  ↓
CONCLUDED | INCONCLUSIVE | CONTRADICTED | INVALIDATED
  ↓
SUPERSEDED
```

Assessment records are immutable after conclusion. Corrections create a superseding assessment.

---

## 16. Observation Interpretations

```ts
type ObservationInterpretation =
  | 'SUPPORTS_TARGET_STATE'
  | 'SUPPORTS_INTERMEDIATE_STATE'
  | 'SUPPORTS_MISCONCEPTION'
  | 'SUPPORTS_PROCEDURAL_ONLY'
  | 'SUPPORTS_TRANSFER'
  | 'SUPPORTS_RETENTION'
  | 'REVEALS_INSTABILITY'
  | 'REVEALS_DEPENDENCE'
  | 'AMBIGUOUS'
  | 'NON_DIAGNOSTIC';
```

Interpretations must remain bounded by the declared evidence requirement and cognitive transformation graph.

---

## 17. Contradictory Evidence

Contradiction is a first-class runtime condition.

```ts
type ContradictionStatus =
  | 'NONE'
  | 'MINOR'
  | 'MATERIAL'
  | 'UNRESOLVED'
  | 'RESOLVED_BY_CONTEXT'
  | 'RESOLVED_BY_NEWER_EVIDENCE';
```

### 17.1 Possible causes

- guessing;
- unstable understanding;
- context dependence;
- unit confusion;
- language burden;
- tool-use difficulty;
- excessive assistance;
- collaboration attribution;
- regression;
- invalid evidence;
- genuine cognitive transition.

### 17.2 Required behavior

The system must not:

- hide contradictory evidence;
- average contradictions into a misleading score;
- mark mastery from a majority vote alone;
- discard older evidence without trace;
- assume the newest evidence is always correct.

The system may request a discriminating follow-up mission through Phase 16C.

---

## 18. Embedded and Explicit Assessment

### 18.1 Embedded assessment

Assessment occurs through normal world activity without breaking the game experience.

Examples:

- scaling a recipe;
- repairing a bridge;
- comparing trade offers;
- measuring building components;
- arranging spatial structures.

### 18.2 Explicit assessment

A deliberately focused activity used when embedded evidence is insufficient or ambiguous.

Explicit assessment must still use world-native interaction where possible and must not default to worksheet imitation.

### 18.3 Diagnostic probes

Short, discriminating tasks designed to distinguish between competing cognitive-state hypotheses.

---

## 19. Independence and Assistance

Independence materially affects evidence strength.

```ts
type IndependenceLevel =
  | 'INDEPENDENT'
  | 'MINIMAL_PROMPT'
  | 'STRATEGIC_HINT'
  | 'STEP_GUIDANCE'
  | 'MODELED_SOLUTION'
  | 'CO_COMPLETED'
  | 'NOT_ATTRIBUTABLE';
```

Evidence from assisted work remains valuable, but its meaning differs.

Example:

- successful independent proportional adjustment supports current capability;
- successful adjustment after strategic hint supports emerging capability;
- successful adjustment after modeled solution supports exposure, not ownership.

Phase 16F may consume these distinctions when choosing future hints.

---

## 20. Collaboration Attribution

Multiplayer and mentor-supported missions require explicit contribution attribution.

The runtime must preserve:

- who selected the strategy;
- who manipulated quantities;
- who explained the relationship;
- who detected the error;
- who proposed the revision;
- whether the learner merely confirmed another person's answer.

Unattributable group success cannot independently prove individual understanding.

---

## 21. Error and Revision Evidence

Incorrect actions are valuable evidence when interpreted responsibly.

The system must capture:

- original action;
- consequence observed;
- learner response to consequence;
- revision attempt;
- reason for revision when available;
- whether revision preserved the target relationship;
- number and type of repeated errors.

A learner who identifies and repairs an error may provide stronger conceptual evidence than a learner who succeeds immediately by chance.

---

## 22. Diagnosis Update Request

Phase 16E does not directly mutate the learner cognitive snapshot. It creates a bounded request for Phase 16B's diagnosis authority.

```ts
interface DiagnosisUpdateRequest {
  requestId: string;
  learnerId: string;
  targetNodeId: string;
  transformationEdgeId?: string;
  assessmentId: string;
  supportedHypotheses: SupportedHypothesis[];
  challengedHypotheses: ChallengedHypothesis[];
  misconceptionSignals: MisconceptionSignal[];
  readinessSignals: ReadinessSignal[];
  confidence: AssessmentConfidence;
  evidenceSufficiency: EvidenceSufficiency;
  requestedAt: string;
}
```

The diagnosis engine may accept, partially accept, defer, or reject the request based on wider evidence.

---

## 23. Assessment Conclusion Contract

```ts
interface AssessmentConclusion {
  conclusionId: string;
  dimension: AssessmentDimension;
  claim: string;
  interpretation: ObservationInterpretation;
  supportingEvidenceIds: string[];
  opposingEvidenceIds: string[];
  confidence: AssessmentConfidence;
  limitations: string[];
}
```

Every conclusion must be traceable to evidence and must state limitations.

---

## 24. Evidence Aggregation

Aggregation must preserve provenance and must not collapse all evidence into one opaque number.

Permitted aggregation views include:

- by learning target;
- by transformation edge;
- by assessment dimension;
- by context;
- by assistance level;
- by time window;
- by misconception hypothesis;
- by mission family.

A numeric summary may be derived for projection, but it must never replace the underlying evidence graph.

---

## 25. Evidence Graph

The preferred internal representation is a graph:

```text
Runtime Event
   │
   ├── supports → Mathematical Evidence
   │                  │
   │                  ├── supports → Assessment Observation
   │                  ├── contradicts → Assessment Observation
   │                  └── limited-by → Assistance Context
   │
   └── belongs-to → Mission Instance

Assessment Observation
   ├── supports → Cognitive-State Hypothesis
   ├── challenges → Cognitive-State Hypothesis
   └── informs → Readiness Signal
```

This graph enables replay, audit, contradiction analysis, and future model improvement.

---

## 26. Replay and Determinism

Assessment must be replayable from immutable inputs.

A replay requires:

- runtime events;
- mission definition version;
- activity binding version;
- evidence requirement version;
- assessment-rule version;
- cognitive graph version;
- interpretation model version.

Given the same immutable inputs and deterministic rules, replay should produce the same assessment result.

Where probabilistic models are used, the model version, prompt contract, parameters, and confidence trace must be preserved.

---

## 27. Idempotency

Repeated processing of the same event set must not create duplicate evidence or duplicate diagnosis updates.

Recommended idempotency keys:

```text
evidence:{missionInstanceId}:{evidenceRequirementId}:{eventFingerprint}
assessment:{missionInstanceId}:{targetNodeId}:{assessmentRuleVersion}
diagnosis-update:{assessmentId}:{learnerId}
```

---

## 28. Versioning

Every evidence and assessment record must identify relevant versions.

Minimum version fields:

- event schema version;
- mission definition version;
- world activity binding version;
- evidence requirement version;
- cognitive graph version;
- assessment rule version;
- diagnosis contract version.

Historical evidence must remain interpretable after rules evolve.

New rules must create new assessment results rather than silently rewriting history.

---

## 29. Privacy and Data Minimization

The evidence system should collect the minimum information necessary to support learning interpretation.

It must avoid unnecessary capture of:

- unrelated chat;
- continuous audio;
- continuous video;
- precise personal location;
- sensitive family information;
- behavioral data unrelated to learning.

Learner-facing and parent-facing projections must distinguish observed facts from system inference.

---

## 30. Auditability

For every assessment conclusion, the system must be able to answer:

- Which mission generated the evidence?
- Which actions were observed?
- Which learner performed them?
- What assistance was present?
- Which rule interpreted the evidence?
- Which evidence supported the conclusion?
- Which evidence contradicted it?
- What confidence was assigned and why?
- Which diagnosis update was requested?
- Which later result superseded it?

---

## 31. Failure Codes

```ts
type EvidenceAssessmentFailureCode =
  | 'EVIDENCE_REQUIREMENT_NOT_FOUND'
  | 'MISSION_INSTANCE_NOT_FOUND'
  | 'ACTIVITY_BINDING_NOT_FOUND'
  | 'EVENT_SCHEMA_INVALID'
  | 'EVENT_OUT_OF_SCOPE'
  | 'EVENT_INTEGRITY_FAILED'
  | 'ACTOR_ATTRIBUTION_UNCERTAIN'
  | 'ASSISTANCE_CONTEXT_MISSING'
  | 'ASSISTANCE_LIMIT_EXCEEDED'
  | 'SHORTCUT_DETECTED'
  | 'REQUIRED_CONTRAST_MISSING'
  | 'EVIDENCE_DUPLICATE'
  | 'EVIDENCE_INSUFFICIENT'
  | 'EVIDENCE_CONTRADICTORY'
  | 'ASSESSMENT_RULE_VERSION_MISMATCH'
  | 'COGNITIVE_GRAPH_VERSION_MISMATCH'
  | 'ASSESSMENT_ALREADY_CONCLUDED'
  | 'ASSESSMENT_INVALIDATED'
  | 'DIAGNOSIS_UPDATE_REJECTED'
  | 'REPLAY_INPUT_INCOMPLETE';
```

Failures must preserve enough context for recovery without leaking sensitive learner data.

---

## 32. Runtime Services

Recommended service boundaries:

### 32.1 EvidenceIngestionService

Receives immutable runtime events and verifies schema and scope.

### 32.2 EvidenceCandidateExtractor

Maps event sequences to declared evidence requirements.

### 32.3 EvidenceValidationService

Applies integrity, attribution, assistance, shortcut, and version checks.

### 32.4 AssessmentInterpretationService

Builds observations and conclusions from validated evidence.

### 32.5 ContradictionResolutionService

Detects material contradiction and requests discriminating evidence when needed.

### 32.6 DiagnosisHandoffService

Creates idempotent diagnosis update requests.

### 32.7 EvidenceReplayService

Reproduces assessment outcomes from immutable inputs.

---

## 33. API-Oriented Contracts

Illustrative endpoints:

```text
POST /api/v1/evidence/events
POST /api/v1/evidence/extract
POST /api/v1/evidence/validate
POST /api/v1/assessments
GET  /api/v1/assessments/:assessmentId
GET  /api/v1/learners/:learnerId/evidence
POST /api/v1/assessments/:assessmentId/replay
POST /api/v1/assessments/:assessmentId/diagnosis-update
```

These routes are illustrative. The authoritative requirement is the boundary, not the exact transport shape.

### 33.1 Ingestion response

```ts
interface EvidenceIngestionResult {
  acceptedEventIds: string[];
  rejectedEvents: Array<{
    eventId: string;
    failureCode: EvidenceAssessmentFailureCode;
  }>;
  ingestionId: string;
}
```

### 33.2 Assessment creation request

```ts
interface CreateAssessmentCommand {
  learnerId: string;
  missionInstanceId: string;
  targetNodeId: string;
  evidenceRequirementIds: string[];
  expectedAssessmentRuleVersion: string;
  correlationId: string;
}
```

---

## 34. Ratio and Proportional Reasoning Validation Slice

### 34.1 Upstream cognitive progression

```text
S1 Separate Quantity Attention
        ↓
S2 Difference-Based Comparison
        ↓
S3 Procedural Ratio Use
        ↓
S4 Multiplicative Comparison
        ↓
S5 Proportional Coordination
        ↓
S6 Transferable Proportional Reasoning
```

### 34.2 Mission context

The learner repairs a bridge support by preparing material mixtures at a required ratio.

The world offers multiple recipes:

- 2 units binder : 3 units aggregate;
- 4 units binder : 5 units aggregate;
- 4 units binder : 6 units aggregate;
- 6 units binder : 9 units aggregate.

The bridge test exposes whether the selected mixture preserves the required relationship.

### 34.3 Required evidence

The learner must:

1. identify that 2:3 and 4:6 are equivalent;
2. reject 4:5 despite both quantities increasing;
3. scale 2:3 to a new required total;
4. revise an invalid mixture after observing structural failure;
5. explain or represent why both quantities must change multiplicatively;
6. complete at least one independent transfer in a different context.

### 34.4 Event sequence

```text
MATERIAL_SELECTED
        ↓
QUANTITY_SET
        ↓
MIXTURE_CREATED
        ↓
STRUCTURE_TESTED
        ↓
RESULT_OBSERVED
        ↓
QUANTITY_REVISED
        ↓
STRUCTURE_RETESTED
```

### 34.5 Possible interpretations

#### Difference-based misconception

The learner chooses 4:5 because each quantity increased by 2.

Interpretation:

```text
SUPPORTS_MISCONCEPTION
hypothesis: additive comparison is controlling strategy
```

#### Procedural ratio use

The learner correctly chooses 4:6 after seeing a familiar table but cannot reproduce the relationship with different totals.

Interpretation:

```text
SUPPORTS_PROCEDURAL_ONLY
hypothesis: rule execution without stable proportional coordination
```

#### Multiplicative comparison

The learner explains that both quantities doubled and independently constructs 6:9.

Interpretation:

```text
SUPPORTS_TARGET_STATE
hypothesis: multiplicative comparison available
```

#### Transferable proportional reasoning

The learner later applies the same relationship to trading bundles or recipe scaling without direct prompting.

Interpretation:

```text
SUPPORTS_TRANSFER
hypothesis: proportional reasoning is available across contexts
```

### 34.6 Contradiction example

The learner succeeds with 4:6 but later selects 6:8.

The system must not immediately classify mastery or failure.

It should mark:

```text
contradictionStatus: MATERIAL
confidence: LOW or MEDIUM
recommendedAction: discriminating follow-up mission
```

### 34.7 Validation conclusion

This slice demonstrates that the architecture can distinguish:

- answer correctness;
- additive misconception;
- procedural success;
- multiplicative reasoning;
- transfer;
- instability;
- assistance dependence.

Therefore the evidence architecture is expressive enough to support the ratio reasoning transformation graph without reducing assessment to final-answer scoring.

---

## 35. Operational Invariants

1. No assessment conclusion without evidence provenance.
2. No high-confidence conclusion from invalid or unattributable evidence.
3. No mastery decision inside Phase 16E.
4. No direct mutation of the learner cognitive snapshot.
5. No silent removal of contradictory evidence.
6. No evidence aggregation that destroys traceability.
7. No interpretation outside declared evidence requirements.
8. No historical rewrite when rules change.
9. No group success treated as individual proof without attribution.
10. No operational success treated as learning proof.

---

## 36. Verification Requirements

A conforming implementation must verify:

- runtime events remain immutable;
- duplicate ingestion is idempotent;
- evidence candidates retain event ordering;
- invalid shortcuts reduce or invalidate evidence;
- hint and mentor context affects independence;
- contradiction remains visible;
- assessment results are replayable;
- rule versions are persisted;
- diagnosis updates are bounded and traceable;
- operational completion cannot directly produce mastery.

Recommended contract tests:

- valid independent evidence path;
- assisted evidence path;
- duplicate event path;
- shortcut detection path;
- contradictory evidence path;
- insufficient evidence path;
- replay determinism path;
- version mismatch path;
- collaboration attribution path;
- superseded assessment path.

---

## 37. Downstream Handoff

### 37.1 To Phase 16F — Hint & Mentor Support

Provide:

- assistance context;
- dependence signals;
- repeated error patterns;
- evidence gaps;
- current uncertainty;
- prohibited hint leakage.

### 37.2 To Phase 16G — Mastery & Progression

Provide:

- assessment conclusions;
- evidence sufficiency;
- confidence;
- transfer evidence;
- retention evidence;
- contradiction status;
- independence profile.

Phase 16G decides mastery and progression policy.

### 37.3 To Phase 16H — Remediation

Provide:

- misconception signals;
- unstable dimensions;
- repeated failure patterns;
- missing prerequisite evidence;
- recommended discriminating experience.

### 37.4 To Phase 16I — Parent/Teacher Projection

Provide projection-safe facts:

- what was observed;
- what the system inferred;
- confidence;
- limitations;
- suggested support.

### 37.5 To Phase 16J — Analytics & Governance

Provide anonymized and policy-compliant measures for:

- evidence coverage;
- assessment reliability;
- contradiction rates;
- mission diagnostic quality;
- bias detection;
- rule-version comparison.

---

## 38. Completion Criteria

Phase 16E is architecturally complete when:

- runtime events can be transformed into validated evidence;
- evidence remains traceable to world actions;
- assistance and attribution are preserved;
- assessment interpretations are bounded by declared requirements;
- confidence and sufficiency are explicit;
- contradiction is first-class;
- results can request diagnosis updates without owning diagnosis;
- replay and versioning are defined;
- mastery remains downstream;
- the ratio reasoning slice is expressible without answer-only scoring.

---

## 39. Final Architectural Statement

Math Learning World must not infer understanding merely because the player reached the end of a mission.

The world creates experiences. Runtime events record what occurred. Evidence preserves the mathematically meaningful parts of those events. Assessment interprets that evidence with explicit confidence and limitations. Diagnosis decides what those interpretations mean for the learner's current cognitive state.

The closed learning loop is therefore:

```text
Learning Target
        ↓
Cognitive Transformation
        ↓
Learner Diagnosis
        ↓
Mission Planning
        ↓
World Activity Binding
        ↓
Runtime Events
        ↓
Mathematical Evidence
        ↓
Assessment Interpretation
        ↓
Diagnosis Update
```

This separation makes the system explainable, replayable, evidence-based, and capable of supporting real mathematical learning rather than rewarding task completion alone.
