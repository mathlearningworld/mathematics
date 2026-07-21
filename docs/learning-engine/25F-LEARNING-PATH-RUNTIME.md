# 25F — Learning Path Runtime

## 1. Purpose

The Learning Path Runtime constructs and maintains individualized learning routes from authoritative learning evidence, concept dependencies, learner goals, mastery state, transfer gaps, and available world experiences.

A learning path is not a fixed grade sequence, a playlist, or a list of lessons chosen only from age or school level. It is a dynamic plan that explains why a next experience is useful, what foundation it relies on, what evidence it seeks, and how it may change when new evidence arrives.

The runtime answers:

- What is the learner trying to achieve?
- Which concepts and capabilities support that goal?
- Which foundations are stable, missing, dormant, contradicted, or context-bound?
- Which route is shortest without creating hidden understanding debt?
- Which alternative route may better fit the learner’s demonstrated strategies and representations?
- When should the system allow above-level exploration?
- When should it recommend recovery, contrast, transfer, retention, or challenge?
- Why was each path step selected?

---

## 2. Architectural Position

```text
World Runtime
  → Discovery Engine
    → Learning State Runtime
      → Learning Progression Runtime
        → Mastery Evaluation Runtime
        → Transfer Learning Runtime
          → Learning Path Runtime
            → Adaptive Recommendation Runtime
            → Mission Runtime
            → Parent / Teacher Projection
```

The Learning Path Runtime plans learning intent. It does not directly control player movement, force mission selection, manufacture mastery, or overwrite the learner’s authoritative state.

---

## 3. Core Principle

> A learning path is a versioned, explainable hypothesis about which experiences are most likely to advance a learner toward a declared goal while protecting essential foundations and preserving meaningful choice.

The path is not truth. It is a plan derived from current evidence.

New evidence may:

- confirm the path,
- shorten it,
- expand it,
- switch to an alternative route,
- reveal hidden prerequisites,
- remove unnecessary remediation,
- introduce transfer or retention checks,
- suspend the path when the goal changes.

---

## 4. Separation of Authorities

The system must preserve these boundaries:

```text
Knowledge Graph
  owns concept relationships

Learning State
  owns current evidence-backed learner understanding

Mastery Evaluation
  owns bounded mastery claims under policy

Transfer Runtime
  owns transfer claims and gaps

Learning Path Runtime
  owns planned route and rationale

Recommendation Runtime
  ranks concrete next opportunities

Mission Runtime
  owns active mission execution
```

A path step may recommend a mission class, but the mission itself remains authoritative only after Mission Runtime creates and activates it.

---

## 5. Learning Path Model

Suggested aggregate:

```text
LearningPath
- pathId
- learnerId
- goalId
- status
- pathVersion
- policyId
- policyVersion
- createdAt
- updatedAt
- evidenceSnapshotVersion
- knowledgeGraphVersion
- activeStepIds
- completedStepIds
- deferredStepIds
- alternativeRouteIds
- rationale
- constraints
- supersedesPathId?
```

Suggested step model:

```text
LearningPathStep
- stepId
- pathId
- stepType
- targetConceptId
- targetScope
- objective
- evidenceNeed
- prerequisiteExpression
- candidateExperienceTypes
- priorityBand
- optionality
- estimatedDifficulty
- supportPolicy
- completionPolicy
- rationaleCodes
- status
- createdAt
- activatedAt?
- completedAt?
- supersededAt?
```

---

## 6. Path Status Vocabulary

Recommended statuses:

```text
DRAFT
ACTIVE
PAUSED
BLOCKED
ADAPTING
COMPLETED
SUPERSEDED
ABANDONED
REVOKED
```

### DRAFT

A route has been constructed but not yet activated.

### ACTIVE

The path is eligible to guide recommendations and missions.

### PAUSED

The learner or guardian has temporarily suspended the goal.

### BLOCKED

No valid route can proceed because required evidence, content, consent, or runtime capability is missing.

### ADAPTING

New evidence requires recalculation before further authoritative recommendations.

### COMPLETED

The declared goal completion policy is satisfied.

### SUPERSEDED

A newer path better represents the same goal.

### ABANDONED

The goal is intentionally no longer pursued.

### REVOKED

The path is invalid due to evidence corruption, policy invalidation, or incompatible semantic migration.

---

## 7. Goal Model

A path must begin with an explicit goal.

```text
LearningGoal
- goalId
- learnerId
- goalType
- targetConceptIds
- targetScope
- targetMasteryPolicy?
- targetCurriculumRequirementIds?
- targetMissionCapability?
- targetDate?
- priority
- source
- consentProfile
- status
```

Possible goal types:

```text
FOUNDATION_BUILDING
MISSION_READINESS
CURRICULUM_READINESS
EXAM_PREPARATION
CONCEPT_MASTERY
TRANSFER_EXPANSION
RETENTION_RECOVERY
OPEN_EXPLORATION
LEARNER_CHOSEN_CHALLENGE
```

The path must not assume that every learner has an exam or grade-level goal. Younger learners may begin through open exploration or foundational world capabilities.

---

## 8. Goal Sources

Goals may originate from:

- learner choice,
- parent choice,
- teacher recommendation,
- curriculum requirement,
- mission requirement,
- system-detected foundation risk,
- recovery from dormant learning,
- exploration of an above-level concept.

The source must be recorded because it affects priority, consent, explanation, and whether the path may be automatically changed.

System-detected goals should normally be proposed, not silently imposed.

---

## 9. Path Step Types

Recommended step types:

```text
DISCOVER
STABILIZE
PRACTICE_VARIATION
REPRESENTATION_BRIDGE
TRANSFER_NEAR
TRANSFER_FAR
RETENTION_CHECK
MISCONCEPTION_CONTRAST
FOUNDATION_RECOVERY
STRATEGY_EXPANSION
INDEPENDENCE_REDUCTION
INTEGRATION
CHALLENGE
ASSESSMENT_SAMPLE
OPEN_EXPLORATION
```

### DISCOVER

Create an opportunity to form an initial concept or pattern.

### STABILIZE

Strengthen emerging understanding through independent, varied evidence.

### PRACTICE_VARIATION

Expose the learner to non-duplicate examples with controlled variation.

### REPRESENTATION_BRIDGE

Connect two representations of the same underlying structure.

### TRANSFER_NEAR / TRANSFER_FAR

Seek evidence that learning applies beyond the source context.

### RETENTION_CHECK

Sample capability after meaningful delay.

### MISCONCEPTION_CONTRAST

Present carefully chosen contrasts that reveal invalid overgeneralization.

### FOUNDATION_RECOVERY

Repair a prerequisite gap that materially blocks the active goal.

### STRATEGY_EXPANSION

Expose an alternative valid method or increase strategic flexibility.

### INDEPENDENCE_REDUCTION

Reduce support gradually until the learner acts independently.

### INTEGRATION

Combine multiple concepts in one meaningful task.

### CHALLENGE

Offer above-current-level exploration without claiming unsupported mastery.

### ASSESSMENT_SAMPLE

Intentionally collect evidence under controlled conditions.

### OPEN_EXPLORATION

Preserve learner agency and discovery outside a tightly prescribed route.

---

## 10. Prerequisite Expressions

Prerequisites must support more than a fixed linear chain.

Suggested expression forms:

```text
ALL_OF(A, B, C)
ANY_OF(A, B)
AT_LEAST(2, [A, B, C])
CONCEPT_STATE(A, minimum=SUPPORTED)
MASTERY_CLAIM(A, policy=X)
TRANSFER_PROFILE(A, minimum=NEAR_TRANSFER)
REPRESENTATION_COVERAGE(A, includes=[OBJECT, DIAGRAM])
NOT_CONTRADICTED(A)
```

This enables:

- alternative valid routes,
- parallel development,
- optional prerequisites,
- multiple strategies toward the same concept,
- curriculum-specific readiness without hardcoding one global sequence.

---

## 11. Knowledge Graph Use

The path planner consumes a versioned Knowledge Graph.

Relevant relations may include:

```text
PREREQUISITE
SUPPORTS
GENERALIZES
SPECIALIZES
REPRESENTED_BY
TRANSFER_BRIDGE
COMMON_MISCONCEPTION
ALTERNATIVE_STRATEGY
INTEGRATES_WITH
```

Graph edges must carry meaning and strength. A weak pedagogical support relation must not be treated as a hard prerequisite.

The planner should distinguish:

```text
HARD_PREREQUISITE
SOFT_PREREQUISITE
HELPFUL_FOUNDATION
ALTERNATIVE_FOUNDATION
ENRICHMENT_RELATION
```

---

## 12. Foundation Debt

Foundation debt is a goal-relative gap, not a global deficit label.

Suggested model:

```text
FoundationDebt
- debtId
- learnerId
- goalId
- conceptId
- scope
- severity
- blockingStrength
- evidenceRefs
- detectedAt
- status
- recoveryOptions
```

Severity may depend on:

- how strongly the concept blocks the current goal,
- how unstable or contradicted the learner state is,
- whether an alternative route exists,
- whether support can temporarily bridge the gap,
- whether the learner has previously demonstrated the foundation.

The system must never interpret every below-grade concept as urgent debt.

---

## 13. Above-Level Exploration

Above-level learning must remain available when safe and meaningful.

Principle:

```text
Exploration may proceed beyond current grade level.
Formal mastery claims remain evidence-bound.
Foundational risks remain visible.
```

The planner may create a dual-track route:

```text
Primary Exploration Track
  → advanced learner-chosen concept

Foundation Support Track
  → small targeted recovery steps
```

This avoids blocking a curious learner while also preventing hidden gaps from accumulating unnoticed.

---

## 14. Path Construction Pipeline

```text
Goal Declared
  → Resolve Goal Policy
  → Load Learning State Snapshot
  → Load Mastery and Transfer Claims
  → Load Knowledge Graph Version
  → Expand Goal Requirements
  → Detect Blocking and Non-blocking Gaps
  → Generate Candidate Routes
  → Score Route Trade-offs
  → Apply Safety and Agency Constraints
  → Produce Versioned Learning Path
  → Publish Path Projection
```

The same authoritative inputs and planner version should produce deterministic route candidates and ordering.

---

## 15. Candidate Route Generation

Candidate routes may differ by:

- prerequisite strategy,
- representation preference,
- degree of remediation,
- use of direct discovery versus guided bridge,
- world or mission context,
- speed versus robustness,
- breadth versus target-specific readiness.

The planner should retain alternative routes when they are pedagogically valid.

Example:

```text
Goal: Solve linear word problems

Route A:
Equality → inverse operations → symbolic equations → word modeling

Route B:
Balance-world model → diagram equations → symbolic transformation → word modeling

Route C:
Table relationships → unknown-value reasoning → equation representation → word modeling
```

No single route should be treated as universally correct.

---

## 16. Route Evaluation Dimensions

A route should be evaluated across multiple dimensions:

```text
Goal Relevance
Foundation Safety
Evidence Quality Opportunity
Learner Agency
Representation Fit
Strategy Diversity
Transfer Opportunity
Retention Coverage
Expected Support Dependence
World Availability
Time Sensitivity
Cognitive Load
Accessibility
```

A route score may be used internally, but no scalar score should erase the underlying trade-offs.

---

## 17. Learner Agency

The planner should preserve meaningful choice.

Possible path step optionality:

```text
REQUIRED_FOR_GOAL
STRONGLY_RECOMMENDED
RECOMMENDED
OPTIONAL_ENRICHMENT
LEARNER_CHOICE
```

The system should explain why a required step is blocking and provide an alternative route when one exists.

It should not repeatedly force remediation when the learner chooses exploration, unless safety, consent, or a declared formal goal requires it.

---

## 18. Path Adaptation Triggers

A path may require adaptation when:

- a concept advances faster than expected,
- a presumed prerequisite is demonstrated through new evidence,
- a mastery claim becomes dormant or contradicted,
- transfer succeeds or fails,
- a misconception emerges,
- support dependence remains high,
- the learner changes goal,
- a teacher or parent changes constraints,
- content becomes unavailable,
- new world capabilities are introduced,
- evidence is revoked.

Path adaptation must create a new version or superseding path. It must not silently rewrite history.

---

## 19. Step Completion

A path step is completed only by its declared completion policy.

Examples:

```text
DISCOVER step
  complete when concept reaches OBSERVED with eligible evidence

STABILIZE step
  complete when independent varied evidence threshold is met

TRANSFER_NEAR step
  complete when supported near-transfer claim exists

RETENTION_CHECK step
  complete when eligible delayed evidence is evaluated

FOUNDATION_RECOVERY step
  complete when blocking strength falls below policy threshold
```

Mission completion alone must not complete a learning path step unless the mission generated the required authoritative evidence.

---

## 20. Path Progress

Path progress must not be a simple percentage unless projected with clear limitations.

Authoritative progress should include:

```text
PathProgress
- completedRequiredSteps
- activeRequiredSteps
- unresolvedBlockingSteps
- optionalStepsCompleted
- evidenceNeedsSatisfied
- masteryRequirementsSatisfied
- transferRequirementsSatisfied
- retentionRequirementsSatisfied
- currentRisks
```

A UI may display a simplified summary, but it must not imply certainty that the path model does not contain.

---

## 21. Dynamic Difficulty

Difficulty is contextual and should be derived from:

- concept complexity,
- learner evidence,
- representation familiarity,
- support dependence,
- transfer distance,
- world interaction demands,
- language demands,
- task novelty.

The planner should avoid both:

- boredom from repeated low-information tasks,
- overload from simultaneous concept, interface, language, and representation novelty.

Difficulty adaptation must not lower the mathematical goal invisibly. It should distinguish reducing interface burden from reducing conceptual demand.

---

## 22. Misconception-Aware Paths

When misconception evidence exists, the planner may choose contrastive experiences rather than more repetition.

Example:

```text
Observed issue:
Equals sign interpreted as “write the answer next”

Poor route:
Repeat more standard equations

Better route:
Compare valid and invalid balance states
→ construct multiple equivalent expressions
→ transfer to symbolic equations
```

The path must cite the misconception or contradiction evidence that motivated the contrastive step.

---

## 23. Retention-Aware Scheduling

Retention steps require time-aware planning.

The planner may schedule future eligibility windows:

```text
eligibleAfter
preferredWindowStart
preferredWindowEnd
expiresAt?
```

A retention check should not appear immediately after the learning episode merely because the recommendation queue needs another task.

The runtime should preserve open exploration or unrelated learning during the delay.

---

## 24. Transfer-Aware Paths

Transfer gaps should create targeted bridges.

Examples:

```text
Objects strong, symbols weak
  → representation bridge

Same world strong, unfamiliar context weak
  → cross-context transfer

Procedure remembered, strategy selection weak
  → mixed strategy discrimination

Near transfer strong, far transfer untested
  → optional far-transfer challenge
```

The planner must not assume that a transfer failure means the source concept was never learned.

---

## 25. Parent and Teacher Constraints

Parent or teacher input may constrain a path through:

- target date,
- curriculum objective,
- maximum daily duration,
- preferred or prohibited content,
- language setting,
- accessibility needs,
- support availability,
- verification requirement.

These constraints must be visible and auditable.

A guardian or teacher should not be able to directly overwrite learner evidence or mastery state through path configuration.

---

## 26. Recommendation Boundary

The path identifies what kind of next evidence or experience is useful.

The Recommendation Runtime chooses among concrete available opportunities.

```text
Path Need:
Cross-representation transfer for fractions

Recommendation Candidates:
- bridge-building world mission
- number-line puzzle
- visual recipe allocation
- teacher-created classroom task
```

This separation allows content inventory and ranking logic to evolve without changing path authority.

---

## 27. Mission Boundary

A recommendation becomes an active mission only after Mission Runtime accepts it.

Mission Runtime owns:

- mission lifecycle,
- world setup,
- active objectives,
- completion events,
- interruption and recovery.

Learning Path owns:

- why the mission class was useful,
- what evidence was sought,
- how the outcome affects the route.

---

## 28. Commands and Events

Suggested commands:

```text
CreateLearningPath
ActivateLearningPath
PauseLearningPath
ResumeLearningPath
AdaptLearningPath
CompleteLearningPath
AbandonLearningPath
RevokeLearningPath
EvaluatePathStepCompletion
```

Suggested events:

```text
LearningGoalDeclared
LearningPathCreated
LearningPathActivated
LearningPathPaused
LearningPathAdaptationRequired
LearningPathAdapted
PathStepActivated
PathStepCompleted
PathStepDeferred
PathStepBlocked
AlternativeRouteSelected
LearningPathCompleted
LearningPathSuperseded
LearningPathAbandoned
LearningPathRevoked
```

Commands must request valid transitions. Callers must not directly mutate completed steps or path progress.

---

## 29. Idempotency and Concurrency

Path creation or adaptation requests should include:

```text
learnerId
goalId
learningStateSnapshotVersion
masteryProjectionVersion
transferProjectionVersion
knowledgeGraphVersion
plannerVersion
policyVersion
expectedPathVersion
correlationId
idempotencyKey
```

If authoritative inputs change during planning, the runtime must reject, retry, or mark the resulting draft stale.

It must not publish a path assembled from inconsistent snapshots.

---

## 30. Replay and Planner Migration

Replay requires:

- goal version,
- learning state snapshot,
- mastery and transfer claim versions,
- knowledge graph version,
- planner version,
- path policy version,
- content capability snapshot when concrete availability influenced the route.

A new planner may generate a different route. That result must supersede rather than rewrite the historical path.

Migration outcomes may include:

```text
UNCHANGED
REORDERED
SHORTENED
EXPANDED
ALTERNATIVE_ROUTE_SELECTED
BLOCKING_GAP_ADDED
BLOCKING_GAP_REMOVED
REQUIRES_HUMAN_REVIEW
```

---

## 31. Explainability

Every active step must answer:

- Why this step now?
- Which goal does it support?
- Which evidence gap does it address?
- Is it required, recommended, or optional?
- What would count as completion?
- What alternatives exist?
- What happens if the learner skips it?

Example:

```text
Recommended next:
Representation Bridge — Equal Groups to Number Line

Why:
- Equal-group understanding is stable with objects
- Number-line representation is not yet demonstrated
- This bridge supports the learner’s multiplication goal

Completion evidence:
- Independent success in two varied number-line contexts

Alternative:
- Array-to-symbol bridge
```

---

## 32. Privacy, Fairness, and Safety

Requirements:

- no permanent ability track,
- no hidden ranking against other learners,
- no forced paid remediation as the only route to a required foundation,
- no use of family income or commercial value to lower educational opportunity,
- no path decisions based on protected traits,
- accessibility barriers must not become concept debt,
- language load must be separated from mathematical difficulty,
- learner and guardian should be able to inspect major path rationale,
- system-detected risks must be framed as current evidence gaps, not identity labels.

A path should remain revisable and humane.

---

## 33. Runtime Invariants

1. Every learning path must reference an explicit goal.
2. Every active step must have an evidence-backed rationale.
3. A path must not overwrite learner evidence, mastery, or transfer claims.
4. Mission completion alone must not complete a path step.
5. Grade level alone must not define the path.
6. Above-level exploration must not be blocked solely by unresolved lower-grade content.
7. Material foundation risks must remain visible.
8. Alternative valid routes must be representable.
9. Prerequisite relationships must distinguish hard from soft dependencies.
10. Path adaptation must be versioned and auditable.
11. Revoked evidence must trigger affected-path reevaluation.
12. A path must not manufacture mastery through planning state.
13. Support, accessibility, and language constraints must remain explicit.
14. Replay with identical inputs must be deterministic.
15. A simplified progress projection must not change authoritative path meaning.
16. Commercial policy must not become learning-state authority.
17. The learner must not be permanently labeled by a temporary path.
18. Recommendation and Mission runtimes must remain separate authorities.

---

## 34. Verification Scenarios

### Scenario A — Clear Goal, Stable Foundations

The learner selects a goal whose prerequisites are already stable.

Expected:

- path skips unnecessary remediation,
- route begins with target discovery, integration, or transfer evidence.

### Scenario B — Blocking Foundation Gap

A prerequisite is contradicted and materially blocks the target.

Expected:

- foundation recovery step is created,
- rationale explains the blocking relation,
- alternative route is considered.

### Scenario C — Above-Level Exploration

A learner with uneven foundations chooses an advanced concept.

Expected:

- exploration remains available,
- targeted foundation support is added without replacing the chosen goal,
- unsupported mastery is not claimed.

### Scenario D — Rapid Evidence Gain

The learner demonstrates a presumed prerequisite independently during open play.

Expected:

- path adapts,
- redundant recovery step is removed or marked satisfied,
- history remains auditable.

### Scenario E — Misconception Emerges

Repeated errors reveal a systematic misconception.

Expected:

- repetition is not simply increased,
- contrastive step is generated,
- misconception evidence is cited.

### Scenario F — Transfer Gap

The learner succeeds with objects but fails in symbolic representation.

Expected:

- representation bridge step is preferred over full concept restart.

### Scenario G — Evidence Revocation

Gameplay evidence supporting a completed step is revoked after a runtime defect.

Expected:

- affected step and downstream path are reevaluated,
- path enters ADAPTING when necessary,
- historical completion event remains in audit lineage but loses current authority.

### Scenario H — Goal Change

The learner changes from exam preparation to open exploration.

Expected:

- old path is paused, abandoned, or superseded according to intent,
- new path uses the new goal policy,
- prior learning evidence remains intact.

---

## 35. Completion Boundary

This document defines learning goal authority, path aggregates, prerequisite expressions, route generation, foundation debt, above-level exploration, adaptation, explainability, and runtime invariants.

It does not define:

- concrete recommendation ranking, which belongs to 25G,
- parent and teacher projection details, which belong to 25H,
- durable persistence and replay implementation, which belong to 25I,
- complete verification architecture, which belongs to 25J,
- Mission Runtime internals, defined by Chapter 23.

The Learning Path Runtime is complete when the system can create a versioned, explainable, evidence-backed route toward a declared goal; preserve alternative paths and learner agency; protect essential foundations without enforcing rigid grade sequencing; and adapt deterministically when authoritative learning evidence changes.