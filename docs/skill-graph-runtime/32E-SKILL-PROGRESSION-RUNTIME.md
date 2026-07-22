# 32E — Skill Progression Runtime

## Purpose

Skill Progression Runtime defines how the system represents movement through a skill landscape without reducing progression to grade level, lesson completion, or a single mastery score.

It connects graph structure with learner evidence while preserving clear ownership boundaries:

- Skill Graph owns skill and relationship meaning.
- Assessment owns evidence production.
- Progress Engine owns durable learner progress state.
- Recommendation Engine owns ranked next-step suggestions.
- Skill Progression Runtime owns progression semantics, route eligibility, transition policy, and explainable progression state.

---

## Core Distinctions

```text
Progression ≠ curriculum promotion
Progression ≠ content completion
Progression ≠ accumulated points
Progression ≠ permanent mastery
Progression path ≠ mandatory linear sequence
Potential next skill ≠ recommendation decision
```

A learner may advance unevenly across different branches, revisit earlier skills, maintain multiple active routes, and demonstrate transfer outside the expected curriculum order.

---

## Runtime Boundary

Skill Progression Runtime owns:

- progression state vocabulary;
- route and milestone definitions;
- progression transition rules;
- readiness-to-attempt policy;
- branch and convergence semantics;
- regression and reactivation semantics;
- transfer-aware advancement;
- progression explanations;
- version-bound progression evaluation.

It does not own:

- raw evidence scoring;
- final mastery determination;
- lesson assignment;
- curriculum authority;
- mission completion;
- reward allocation;
- learner identity.

---

## Progression State Model

```ts
type SkillProgressionState =
  | 'UNSEEN'
  | 'DISCOVERABLE'
  | 'READY_TO_ATTEMPT'
  | 'IN_PROGRESS'
  | 'EVIDENCE_EMERGING'
  | 'STABLE'
  | 'TRANSFER_READY'
  | 'ADVANCED'
  | 'NEEDS_REINFORCEMENT'
  | 'REACTIVATING'
  | 'BLOCKED'
  | 'INCONCLUSIVE';
```

These states describe progression semantics, not psychological labels.

### UNSEEN

The skill has not yet entered the learner's authorized visible graph context.

### DISCOVERABLE

The skill can be shown as a future possibility, but attempt readiness has not been established.

### READY_TO_ATTEMPT

Prerequisite and policy checks permit an attempt. This does not imply likely success.

### IN_PROGRESS

The learner has active evidence generation against the skill.

### EVIDENCE_EMERGING

Evidence suggests developing capability but is not yet sufficiently stable.

### STABLE

Current evidence supports reliable performance under the declared context.

### TRANSFER_READY

The learner has enough stable evidence to attempt materially different contexts or applications.

### ADVANCED

Evidence supports broader, deeper, or more flexible use than the base skill contract requires.

### NEEDS_REINFORCEMENT

Previously stable evidence has weakened, become stale, or been contradicted.

### REACTIVATING

The learner is rebuilding recently weakened capability.

### BLOCKED

A verified policy, prerequisite, compatibility, or graph integrity condition prevents the transition.

### INCONCLUSIVE

Available information cannot support a safe progression decision.

---

## Progression Record

```ts
type SkillProgressionRecord = {
  learnerId: string;
  skillVersionId: string;
  graphVersionId: string;
  progressionPolicyId: string;
  currentState: SkillProgressionState;
  previousState?: SkillProgressionState;
  stateVersion: number;
  evidenceSnapshotId: string;
  prerequisiteReadinessResultId?: string;
  routeContextIds: string[];
  enteredAt: string;
  lastEvaluatedAt: string;
  confidence: number;
  reasonCodes: string[];
};
```

Every progression record is versioned and evidence-bound.

---

## Transition Contract

```ts
type SkillProgressionTransition = {
  transitionId: string;
  learnerId: string;
  skillVersionId: string;
  fromState: SkillProgressionState;
  toState: SkillProgressionState;
  expectedStateVersion: number;
  graphVersionId: string;
  progressionPolicyId: string;
  evidenceSnapshotId: string;
  prerequisiteReadinessResultId?: string;
  occurredAt: string;
  reasonCodes: string[];
  correlationId: string;
};
```

Transitions must use optimistic concurrency. Last-write-wins is forbidden for authoritative progression state.

---

## Transition Rules

### Entry transitions

```text
UNSEEN → DISCOVERABLE
DISCOVERABLE → READY_TO_ATTEMPT
READY_TO_ATTEMPT → IN_PROGRESS
```

### Development transitions

```text
IN_PROGRESS → EVIDENCE_EMERGING
EVIDENCE_EMERGING → STABLE
STABLE → TRANSFER_READY
TRANSFER_READY → ADVANCED
```

### Recovery transitions

```text
STABLE → NEEDS_REINFORCEMENT
TRANSFER_READY → NEEDS_REINFORCEMENT
ADVANCED → NEEDS_REINFORCEMENT
NEEDS_REINFORCEMENT → REACTIVATING
REACTIVATING → EVIDENCE_EMERGING
```

### Safety transitions

Any active state may transition to `BLOCKED` or `INCONCLUSIVE` when the graph, policy, evidence, or version contract becomes invalid.

Forbidden shortcuts include:

```text
UNSEEN → STABLE
DISCOVERABLE → ADVANCED
READY_TO_ATTEMPT → TRANSFER_READY
BLOCKED → STABLE without re-evaluation
INCONCLUSIVE → READY_TO_ATTEMPT by default
```

Exceptional transitions require an explicit migration, imported evidence, or expert-validated policy path.

---

## Progression Routes

A progression route is a versioned, non-authoritative navigation structure over authoritative graph elements.

```ts
type SkillProgressionRoute = {
  routeId: string;
  routeVersionId: string;
  graphVersionId: string;
  titleKey: string;
  purpose:
    | 'FOUNDATION'
    | 'CURRICULUM'
    | 'MISSION'
    | 'REMEDIATION'
    | 'TRANSFER'
    | 'EXPLORATION';
  skillVersionIds: string[];
  requiredMilestoneIds: string[];
  optionalBranchIds: string[];
  contextPolicyId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'RETIRED';
};
```

Routes may order skill encounters, but they do not create prerequisite authority.

---

## Branching and Convergence

Skill development is not required to be linear.

A route may contain:

- optional branches;
- equivalent entry routes;
- specialization branches;
- remediation detours;
- transfer bridges;
- convergence milestones.

```ts
type ProgressionBranchPolicy = {
  branchPolicyId: string;
  mode:
    | 'ALL_BRANCHES'
    | 'ANY_BRANCH'
    | 'MINIMUM_BRANCH_COUNT'
    | 'WEIGHTED_BRANCH_SET';
  branchIds: string[];
  minimumCount?: number;
  minimumWeight?: number;
};
```

The runtime must preserve branch identity so that different learning journeys are not flattened into one synthetic path.

---

## Milestone Runtime

```ts
type SkillMilestone = {
  milestoneId: string;
  graphVersionId: string;
  titleKey: string;
  requiredSkillStates: Array<{
    skillVersionId: string;
    minimumState: SkillProgressionState;
  }>;
  evidencePolicyId: string;
  contextPolicyId?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'RETIRED';
};
```

Milestone completion is derived. It must be recomputable from skill progression records and policy versions.

---

## Readiness to Attempt

A skill becomes `READY_TO_ATTEMPT` only when:

1. the skill version is active and compatible;
2. the graph version is available;
3. prerequisite evaluation is `READY` or an explicitly allowed `READY_WITH_RISK`;
4. required context policies match;
5. no blocking safety or migration condition exists;
6. the evidence snapshot is current enough for the policy;
7. the transition is allowed from the current state.

No grade-level assumption may bypass these checks.

---

## Transfer Progression

Transfer describes demonstrated use beyond the original evidence context.

```ts
type TransferEvidenceContext = {
  sourceContextId: string;
  targetContextId: string;
  representationShift: boolean;
  problemStructureShift: boolean;
  languageShift: boolean;
  domainShift: boolean;
  assistanceShift: boolean;
};
```

`TRANSFER_READY` is permission to test transfer, not proof that transfer has occurred. Actual transfer evidence must be generated and evaluated separately.

---

## Progression Regression

Regression is modeled as evidence change, not moral failure.

A transition to `NEEDS_REINFORCEMENT` may occur because:

- evidence aged beyond policy limits;
- recent evidence contradicted prior stability;
- context widened materially;
- assistance was removed;
- a skill version changed incompatibly;
- historical evidence was invalidated;
- prerequisite instability increased downstream risk.

Regression must preserve historical state transitions and their evidence references.

---

## Cross-Curriculum Progression

The same canonical skill may appear in multiple curriculum versions. Progression remains bound to the skill version, while curriculum projections provide contextual placement.

Rules:

1. curriculum change must not erase learner progress;
2. curriculum placement does not automatically advance progression state;
3. compatible skill mappings may carry evidence references, not manufacture evidence;
4. incompatible semantic versions require explicit evolution handling;
5. cross-curriculum routes must expose their alignment assumptions.

---

## Progression Evaluation Result

```ts
type ProgressionEvaluationResult = {
  learnerId: string;
  skillVersionId: string;
  currentState: SkillProgressionState;
  proposedState?: SkillProgressionState;
  decision:
    | 'TRANSITION_ALLOWED'
    | 'NO_CHANGE'
    | 'TRANSITION_BLOCKED'
    | 'INCONCLUSIVE';
  graphVersionId: string;
  progressionPolicyId: string;
  evidenceSnapshotId: string;
  prerequisiteReadinessResultId?: string;
  routeImpacts: RouteImpact[];
  milestoneImpacts: MilestoneImpact[];
  reasonCodes: string[];
  evaluatedAt: string;
};
```

---

## Explanation Model

Every progression change must explain:

- what changed;
- which evidence supported the change;
- which prerequisite result was used;
- which policy and graph version applied;
- whether confidence increased or decreased;
- what remains uncertain;
- what possible next states exist.

Learner-facing language must emphasize growth and next actions rather than rank or deficiency.

---

## Failure Codes

```text
SKILL_PROGRESSION_RECORD_NOT_FOUND
SKILL_VERSION_NOT_ACTIVE
GRAPH_VERSION_NOT_AVAILABLE
PROGRESSION_POLICY_NOT_FOUND
ILLEGAL_PROGRESSION_TRANSITION
PROGRESSION_STATE_VERSION_CONFLICT
EVIDENCE_SNAPSHOT_NOT_FOUND
PREREQUISITE_RESULT_NOT_FOUND
PREREQUISITE_NOT_READY
ROUTE_VERSION_NOT_FOUND
MILESTONE_NOT_FOUND
INCOMPATIBLE_ROUTE_GRAPH_VERSION
TRANSFER_CONTEXT_NOT_SUPPORTED
PROGRESSION_EVALUATION_INCONCLUSIVE
```

---

## Cross-Engine Contracts

### Progress Engine

Persists authoritative learner progression records and transition history.

### Assessment Engine

Produces evidence snapshots and evaluation outputs.

### Prerequisite Runtime

Supplies version-bound readiness results.

### Recommendation Engine

Consumes current and possible next states to rank actions. It may not mutate progression state.

### Mission Engine

Maps mission objectives to progression milestones without redefining skill semantics.

### Curriculum Runtime

Provides placement and jurisdiction context without becoming progression authority.

---

## Runtime Invariants

1. Every progression state is bound to a SkillVersionId.
2. Every evaluation is bound to a GraphVersionId and evidence snapshot.
3. Lesson completion cannot directly create stable progression state.
4. Grade placement cannot directly create readiness.
5. Routes cannot create prerequisite authority.
6. Transfer readiness cannot be reported as transfer proof.
7. Regression preserves prior history.
8. Inconclusive evaluation cannot produce an authoritative transition.
9. Alternate routes remain separately traceable.
10. Cross-curriculum mapping cannot manufacture learner evidence.
11. Progression state changes require optimistic concurrency.
12. Learner-facing state labels must remain non-stigmatizing.

---

## Completion Condition

32E is complete when the system can represent nonlinear, evidence-bound, version-aware skill progression; enforce safe transitions; preserve regression and recovery history; support multiple routes; and expose progression possibilities to other engines without confusing navigation, curriculum order, or content completion with demonstrated understanding.
