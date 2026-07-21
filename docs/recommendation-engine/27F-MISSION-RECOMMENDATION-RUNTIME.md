# 27F — Mission Recommendation Runtime

Status: MISSION RECOMMENDATION RUNTIME DEFINED  
Depends on: 27A–27E, Learning Engine, Assessment Engine, Mission Engine boundary  
Chapter: 27 — Recommendation Engine Architecture

---

## 1. Purpose

Mission Recommendation Runtime determines which goal-shaped learning mission may be proposed to the learner, parent, teacher, or mentor after learning and practice needs have been interpreted.

It answers:

> Which mission is appropriate to propose now, why is it appropriate, what does it prepare or repair, and what must remain optional or gated?

A mission recommendation is not a mission activation. It is a reviewable proposal to a separate Mission Engine authority.

---

## 2. Runtime Position

```text
Assessment Claims
+ Learning Recommendations
+ Practice Recommendations
+ Readiness State
+ Goal Context
+ Curriculum Context
+ Available Mission Templates
        ↓
Mission Recommendation Runtime
        ↓
Mission Proposals
        ↓
Mission Engine Acceptance / Rejection / Deferral
        ↓
Gameplay or Learning Runtime
```

Recommendation proposes. Mission Engine decides whether and how a mission becomes an active goal runtime.

---

## 3. Authority Boundary

Mission Recommendation Runtime owns:

- identifying eligible mission candidates;
- aligning mission purpose with evidence and learner goals;
- checking readiness and prerequisite gates;
- proposing mission scope, sequence, and expected evidence;
- explaining why a mission should be considered;
- distinguishing guided, optional, exploratory, and support missions;
- attaching limitations, risks, and reevaluation triggers.

It does not own:

- activating a mission;
- forcing learner participation;
- changing accepted goals;
- declaring mission completion;
- assigning rewards;
- mutating assessment or mastery;
- bypassing readiness gates;
- selecting gameplay implementation details;
- assigning people to mentoring or teaching roles without authorization.

```text
Recommendation owns proposal.
Mission Engine owns mission lifecycle.
Gameplay owns experience execution.
Assessment owns interpretation of evidence.
```

---

## 4. Mission Recommendation Definition

```ts
interface MissionRecommendation {
  recommendationId: string
  recommendationSetId: string
  missionProposalId: string
  learnerId: string
  scopeId: string

  missionTemplateId: string
  missionType: MissionRecommendationType
  missionPurpose: MissionPurpose
  targetRefs: MissionTargetRef[]

  readinessGate: MissionReadinessGate
  prerequisiteRefs: PrerequisiteRef[]
  expectedEvidence: ExpectedEvidenceSpec[]
  estimatedScope: MissionScopeEstimate

  priorityBand: PriorityBand
  sequencePosition: number
  optionality: MissionOptionality

  reasonCodes: MissionRecommendationReasonCode[]
  sourceClaimRefs: SourceClaimRef[]
  sourceRecommendationRefs: SourceRecommendationRef[]
  goalRefs: GoalRef[]

  confidence: RecommendationConfidence
  limitations: RecommendationLimitation[]
  risks: MissionRecommendationRisk[]
  reevaluationTriggers: ReevaluationTrigger[]

  generatedAt: string
  contextVersion: string
  policyVersion: string
}
```

---

## 5. Mission Recommendation Types

```text
FOUNDATION
LEARNING
PRACTICE
ASSESSMENT
TRANSFER
PREPARATION
REMEDIATION
EXPLORATION
CHALLENGE
RETENTION
MENTOR_SUPPORTED
PARENT_SUPPORTED
TEACHER_GUIDED
```

### FOUNDATION

A mission that repairs or establishes a prerequisite required by later goals.

### LEARNING

A mission centered on constructing or connecting understanding.

### PRACTICE

A bounded mission centered on fluency, stabilization, or variation.

### ASSESSMENT

A mission intended to gather evidence, not to teach or reward score performance.

### TRANSFER

A mission applying existing knowledge in a new context or representation.

### PREPARATION

A mission aligned to a future goal such as an entrance exam, project, or curriculum transition.

### REMEDIATION

A targeted mission responding to an evidenced learning gap. It must not become an endless punishment loop.

### EXPLORATION

An optional mission that broadens knowledge without blocking required progression.

### CHALLENGE

An optional mission beyond current requirements when readiness is sufficient.

### RETENTION

A mission that revisits previously learned material after an evidence-based interval.

### Supported Types

Mentor-, parent-, and teacher-supported missions indicate delivery support. They do not transfer assessment authority to the supporter.

---

## 6. Mission Purpose

```text
CLOSE_BLOCKING_GAP
BUILD_FOUNDATION
ADVANCE_CURRICULUM
PREPARE_GOAL
COLLECT_EVIDENCE
STABILIZE_SKILL
DEVELOP_TRANSFER
CONNECT_CONCEPTS
RESTORE_RETENTION
EXPLORE_INTEREST
EXTEND_CHALLENGE
REQUEST_HUMAN_SUPPORT
```

Mission purpose must be explicit and traceable to evidence or accepted goal context.

---

## 7. Input Contract

```ts
interface MissionRecommendationInput {
  recommendationCaseId: string
  learnerId: string
  scope: RecommendationScope
  frozenAt: string

  assessmentClaims: AssessmentClaimSnapshot[]
  readinessClaims: ReadinessClaimSnapshot[]
  misconceptionClaims: MisconceptionClaimSnapshot[]

  learningRecommendations: LearningRecommendationSnapshot[]
  practiceRecommendations: PracticeRecommendationSnapshot[]
  assessmentRecommendations: AssessmentRecommendationSnapshot[]

  acceptedGoals: GoalContextSnapshot[]
  curriculumGraph: CurriculumGraphSnapshot
  missionHistory: MissionHistorySnapshot
  availableTemplates: MissionTemplateCatalogSnapshot
  learnerContext: LearnerContextSnapshot

  candidateSet: RecommendationCandidateSet
  prioritizationPolicy: PrioritizationPolicySnapshot
  missionPolicy: MissionRecommendationPolicySnapshot
}
```

Input snapshots must be frozen. Mission recommendations must not be assembled from mixed-time live state.

---

## 8. Output Contract

```ts
interface MissionRecommendationResult {
  recommendationCaseId: string
  recommendationSetId: string
  status:
    | 'MISSION_RECOMMENDATIONS_CREATED'
    | 'NO_MISSION_REQUIRED'
    | 'NO_ELIGIBLE_TEMPLATE'
    | 'READINESS_BLOCKED'
    | 'GOAL_CLARIFICATION_REQUIRED'
    | 'HUMAN_REVIEW_REQUIRED'
    | 'QUARANTINED'

  recommendations: MissionRecommendation[]
  excludedCandidates: ExcludedMissionCandidate[]
  blockedCandidates: BlockedMissionCandidate[]
  limitations: RecommendationLimitation[]
  generatedAt: string
  inputDigest: string
}
```

No mission should be proposed merely to avoid an empty recommendation set.

---

## 9. Proposal-versus-Activation Boundary

```text
Mission Recommendation
        ↓
PROPOSED
        ↓
Mission Engine Decision
   ├── ACCEPTED
   ├── MODIFIED
   ├── DEFERRED
   └── REJECTED
```

Recommendation Runtime may publish `PROPOSED` only.

Mission Engine must create a new mission identity when a proposal is accepted. The proposal identity remains available for traceability but is not the active mission aggregate.

---

## 10. Eligibility Rules

A mission candidate is eligible only when:

1. its purpose is supported by evidence or an accepted goal;
2. its targets are canonical and in scope;
3. blocking prerequisites are resolved or explicitly included in the mission sequence;
4. the mission template can produce the intended learning experience and evidence;
5. scope, duration, and difficulty stay within policy bounds;
6. the mission does not duplicate an active equivalent mission;
7. the mission does not contradict a stronger verified recommendation;
8. optionality and consent requirements are explicit;
9. support roles, when required, are authorized and available;
10. completion criteria do not falsely claim mastery.

---

## 11. Readiness Gating

Mission readiness is evaluated independently from mission attractiveness or goal urgency.

```ts
interface MissionReadinessGate {
  status:
    | 'READY'
    | 'READY_WITH_SUPPORT'
    | 'READY_WITH_LIMITATIONS'
    | 'NOT_READY'
    | 'INSUFFICIENT_EVIDENCE'
    | 'HUMAN_REVIEW_REQUIRED'
  blockingRefs: string[]
  supportRequirements: string[]
  limitations: string[]
}
```

Rules:

- a blocking prerequisite cannot be averaged away;
- goal urgency cannot override `NOT_READY`;
- `INSUFFICIENT_EVIDENCE` should trigger assessment or observation where appropriate;
- support can change delivery eligibility but cannot fabricate readiness;
- challenge and exploration missions must not displace critical foundation missions when policy forbids it.

---

## 12. Mission Optionality

```text
REQUIRED_BY_ACCEPTED_PLAN
RECOMMENDED
OPTIONAL
EXPLORATORY
HUMAN_DECISION_REQUIRED
```

The runtime must preserve the product philosophy that learners can explore without every recommendation becoming a compulsory task.

A recommendation may be high priority and still remain optional when the learner has not accepted the associated goal.

---

## 13. Goal Alignment

Accepted goals influence mission relevance, scope, and sequence.

Goal types may include:

```text
FOUNDATION_RECOVERY
GRADE_READINESS
ENTRANCE_EXAM_PREPARATION
CURRICULUM_COMPLETION
PROJECT_PREPARATION
PERSONAL_INTEREST
TEACHER_ASSIGNED_FOCUS
FAMILY_SUPPORTED_GOAL
```

Rules:

- goals must be versioned and attributable;
- recommendation must distinguish learner-accepted goals from externally suggested goals;
- conflicting goals must remain visible;
- goal priority cannot overwrite evidence;
- an old or withdrawn goal must not continue driving new mission proposals;
- mission proposals should state which accepted goal they serve.

---

## 14. Foundation Path and Goal Path

Mission recommendation must support both:

```text
Foundation Path
        ensures required understanding

Goal Path
        organizes progress toward a chosen objective
```

These paths interact but are not identical.

Example:

```text
Goal: Prepare for Grade 7 entrance examination
Current blocker: Fraction relationships

Foundation mission:
Rebuild fraction equivalence and ratio relationships

Goal mission:
Model one-step word equations
```

The foundation mission may be sequenced first even though the goal mission is more visible to the learner.

---

## 15. Mission Sequence Construction

A sequence may contain multiple proposed missions:

```text
Foundation Mission
        ↓
Learning Mission
        ↓
Practice Mission
        ↓
Assessment Mission
        ↓
Transfer Mission
        ↓
Goal Challenge Mission
```

Sequence rules:

- preserve prerequisite order;
- keep the visible horizon limited to what current evidence supports;
- insert reevaluation between materially different stages;
- do not lock future missions before evidence exists;
- allow optional exploration branches;
- avoid duplicate missions serving the same semantic purpose;
- terminate or replan when goal or readiness state changes.

---

## 16. Mission Template Contract

```ts
interface MissionTemplate {
  missionTemplateId: string
  version: string
  supportedTypes: MissionRecommendationType[]
  supportedPurposes: MissionPurpose[]
  targetCompatibility: TargetCompatibilityRule[]
  prerequisitePolicy: TemplatePrerequisitePolicy
  difficultyBounds: DifficultyBounds
  durationBounds: DurationBounds
  evidenceCapabilities: EvidenceCapability[]
  supportCapabilities: SupportCapability[]
  accessibilityMetadata: AccessibilityMetadata
  policyTags: string[]
}
```

A template is eligible only when it can deliver the proposed purpose and collect appropriate evidence.

A gameplay shell alone is not sufficient if the mission cannot exercise the target meaningfully.

---

## 17. Mission Scope Estimate

```ts
interface MissionScopeEstimate {
  expectedSteps: number | null
  expectedDurationMinutes: number | null
  minimumSessions: number | null
  maximumSessions: number | null
  targetCount: number
  dependencyDepth: number
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
}
```

Scope estimates are planning aids, not promises.

Large missions should be decomposed when:

- they combine unrelated purposes;
- evidence would become difficult to interpret;
- duration exceeds policy;
- prerequisite uncertainty is high;
- the learner needs visible short-term progress;
- completion would incorrectly imply broad mastery.

---

## 18. Expected Evidence

Every mission recommendation must state what evidence the mission is expected to create.

```text
EXPLANATION
PROCEDURAL_EXECUTION
REPRESENTATION_TRANSLATION
STRATEGY_SELECTION
INDEPENDENT_RETRIEVAL
ERROR_CORRECTION
TRANSFER_APPLICATION
REFLECTION
OBSERVATION
HUMAN_VERIFICATION
```

Expected evidence is not guaranteed evidence. The actual Assessment Evidence Runtime determines whether produced events are eligible.

---

## 19. Completion Semantics

Mission completion means the mission workflow reached its completion condition.

It does not necessarily mean:

- mastery achieved;
- misconception resolved;
- readiness confirmed;
- goal completed;
- curriculum requirement satisfied.

```text
Mission completed
        → evidence available
        → assessment interprets evidence
        → recommendation reevaluates next action
```

Mission templates must avoid completion labels that imply unverified learning claims.

---

## 20. Exploration and Challenge

Exploration and challenge missions are valuable when they support curiosity, autonomy, and above-grade learning.

Eligibility rules:

- they must be optional unless part of an accepted plan;
- they must not silently become remediation gates;
- insufficient evidence may limit difficulty but not necessarily prohibit low-risk exploration;
- failure must not reduce verified mastery without assessment interpretation;
- exploration can create discovery evidence for later recommendation;
- challenge missions should clearly state prerequisites and limitations.

---

## 21. Support Missions

Support missions may involve a parent, teacher, mentor, or family member.

```ts
interface MissionSupportRequirement {
  supportType: 'PARENT' | 'TEACHER' | 'MENTOR' | 'FAMILY' | 'SPECIALIST'
  purpose: string
  requiredCapabilities: string[]
  evidenceRole: 'OBSERVE' | 'GUIDE' | 'VERIFY_EVENT' | 'NONE'
  consentRequired: boolean
}
```

Supporters may contribute observations or verify events according to policy. They do not directly create authoritative mastery claims.

---

## 22. Recommendation Explanation Contract

Every published mission recommendation must explain:

```text
WHAT mission is proposed
WHY it is appropriate now
WHICH learner need or accepted goal it serves
WHICH evidence and recommendations support it
WHICH prerequisites and readiness gates apply
WHY it is required, recommended, optional, or exploratory
WHAT evidence the mission is expected to create
WHAT limitations and risks remain
WHEN the proposal should be reevaluated
```

Example:

```text
Propose: Foundation mission — Fraction Relationships for Word Equations.
Purpose: Close a blocking prerequisite for the accepted Grade 7 entrance-exam goal.
Evidence: Fraction procedures are often correct, but equivalence explanations and verbal relationships remain unstable.
Readiness: Ready with guided visual support.
Expected evidence: Pictorial-to-symbolic translation, explanation, and independent comparison.
Optionality: Recommended within the accepted preparation plan.
Limitation: Equation transfer is not yet included.
Reevaluate: After mission evidence is assessed.
```

---

## 23. Confidence

Mission recommendation confidence expresses confidence that proposing the mission is appropriate under the frozen context.

It is not:

- mission completion probability;
- learner success probability;
- mastery confidence;
- assessment confidence;
- guaranteed engagement;
- guaranteed evidence quality.

Confidence is bounded by:

- source claims;
- source recommendations;
- goal validity;
- readiness certainty;
- template fit;
- historical mission outcomes;
- unresolved limitations.

---

## 24. Duplicate and Loop Protection

The runtime must detect:

```text
same learner
+ same semantic target
+ same mission purpose
+ equivalent active or recently completed mission
+ no meaningful new evidence
```

Possible responses:

```text
DO_NOT_RECOMMEND_DUPLICATE
REQUEST_REASSESSMENT
CHANGE_MISSION_PURPOSE
CHANGE_REPRESENTATION
CHANGE_SUPPORT_MODEL
DEFER
REQUEST_HUMAN_REVIEW
```

Repeated remediation missions without new evidence must never become the default loop.

---

## 25. Reevaluation Triggers

```text
MISSION_PROPOSAL_ACCEPTED
MISSION_PROPOSAL_REJECTED
MISSION_ACTIVATED
MISSION_COMPLETED
MISSION_ABANDONED
NEW_ASSESSMENT_CLAIM
READINESS_CHANGED
PREREQUISITE_CHANGED
GOAL_CHANGED
TEMPLATE_VERSION_CHANGED
POLICY_CHANGED
SUPPORT_AVAILABILITY_CHANGED
HUMAN_REVIEW_COMPLETED
RECOMMENDATION_EXPIRED
```

---

## 26. Human Review

Human review is required when:

- accepted goals conflict materially;
- mission scope is unusually large or high impact;
- readiness evidence is contradictory;
- support roles or consent are unresolved;
- no eligible template exists for a critical need;
- repeated mission cycles fail to improve evidence;
- an external stakeholder requests a mission inconsistent with learner need;
- the mission would change a major learning path;
- accessibility or wellbeing concerns are present.

Human review may approve, modify, defer, or reject the proposal. It must not rewrite historical recommendation or assessment records.

---

## 27. Failure Codes

```text
MISSION_REC_INPUT_SCOPE_MISMATCH
MISSION_REC_CLAIM_PROVENANCE_INVALID
MISSION_REC_SOURCE_RECOMMENDATION_INVALID
MISSION_REC_GOAL_UNRESOLVED
MISSION_REC_GOAL_NOT_ACCEPTED
MISSION_REC_TARGET_UNRESOLVED
MISSION_REC_PREREQUISITE_BLOCKED
MISSION_REC_READINESS_BLOCKED
MISSION_REC_TEMPLATE_UNRESOLVED
MISSION_REC_NO_ELIGIBLE_TEMPLATE
MISSION_REC_SCOPE_EXCEEDS_POLICY
MISSION_REC_DUPLICATE_ACTIVE_MISSION
MISSION_REC_LOOP_DETECTED
MISSION_REC_SUPPORT_UNAVAILABLE
MISSION_REC_CONSENT_REQUIRED
MISSION_REC_CONFIDENCE_EXCEEDS_EVIDENCE
MISSION_REC_EXPLANATION_INCOMPLETE
MISSION_REC_STALE_CONTEXT
MISSION_REC_HUMAN_REVIEW_REQUIRED
MISSION_REC_QUARANTINED
```

---

## 28. Determinism

For identical frozen input snapshots and policy versions, the runtime must produce the same semantic output:

- same eligible mission template identities;
- same mission type and purpose;
- same target set;
- same readiness gate result;
- same prerequisite ordering;
- same optionality;
- same expected evidence;
- same exclusions, limitations, and risks;
- same priority order.

Generated IDs and timestamps may differ only when replay policy explicitly excludes them.

---

## 29. Observability

Recommended telemetry:

```text
mission candidates evaluated
eligible mission proposals
readiness-blocked candidates
prerequisite-blocked candidates
no-template results
proposal types and purposes
optionality distribution
duplicate and loop detections
support-required proposals
human-review escalations
proposal acceptance rate
proposal rejection and deferral reasons
mission completion followed by reassessment rate
```

Telemetry must respect learner privacy, tenant boundaries, and role permissions.

---

## 30. Example — Grade 5 Preparing for Grade 7 Entrance

Context:

```text
Accepted goal: Grade 7 entrance preparation
Observed weakness: word-equation modeling
Blocking foundation: fraction relationships and verbal-to-symbolic translation
Learner preference: visual, low-text activities
```

Recommended mission sequence:

```text
1. FOUNDATION
   Fraction Relationships Workshop
   Expected evidence: comparison, equivalence explanation, visual-symbolic translation

2. LEARNING
   Balance and Unknowns Lab
   Expected evidence: explanation of equality and unknown relationships

3. PRACTICE
   Translate Short Statements
   Expected evidence: stable verbal-to-symbolic mapping

4. ASSESSMENT
   Independent One-Step Word Equation Check
   Expected evidence: unsupported modeling and explanation

5. TRANSFER
   Builders Valley Resource Equation Mission
   Expected evidence: application in a new gameplay context
```

Only the first reliably supported horizon should be proposed at once. Later missions remain provisional until new evidence is interpreted.

---

## 31. Acceptance Criteria

27F is satisfied when:

- mission recommendation is separate from mission activation;
- every mission proposal is traceable to evidence or accepted goals;
- readiness and prerequisites cannot be bypassed by urgency;
- foundation and goal paths can coexist;
- optional exploration remains genuinely optional;
- mission completion does not imply mastery;
- templates must support both experience and evidence needs;
- duplicate and remediation loops are prevented;
- support roles and consent are explicit;
- identical frozen inputs yield the same semantic proposal set.

---

## 32. Completion Statement

Mission Recommendation Runtime is defined as the authority for converting evidence-backed next actions into bounded, explainable, goal-shaped proposals without taking ownership of the mission lifecycle.

```text
Recommendation proposes the mission.
Mission Engine governs the mission.
Gameplay or Learning Runtime delivers the experience.
Assessment interprets the evidence.
Recommendation decides what should follow.
```
