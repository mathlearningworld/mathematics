# 34A — Intervention Runtime Foundation

## 1. Purpose

The Intervention Runtime converts diagnostic understanding into bounded, reviewable, measurable learner support.

It is responsible for deciding what form of support should be attempted, under what authority, for which learner context, against which skill or understanding debt signal, for how long, and with what evidence of effectiveness.

The runtime must never treat a diagnostic hypothesis as unquestionable truth. Every intervention is an experiment under uncertainty and must preserve the ability to stop, revise, replace, or escalate.

---

## 2. Runtime Position

```text
Assessment Runtime
        │
        ▼
Diagnostic Runtime
        │
        ▼
Recommendation Runtime
        │
        ▼
Intervention Runtime
        │
        ├── Mission Runtime
        ├── Learning Runtime
        ├── Gameplay Runtime
        └── Progress Runtime
```

The Recommendation Runtime may propose candidate actions. The Intervention Runtime owns the operational contract that turns an approved candidate into a governed learner-support attempt.

---

## 3. Core Distinctions

The following concepts must remain separate:

```text
Recommendation ≠ Intervention
Plan ≠ Execution
Execution ≠ Effectiveness
Completion ≠ Resolution
Adaptation ≠ Failure
Escalation ≠ Punishment
```

A recommendation is advisory. An intervention is an authorized operational unit with explicit scope, lifecycle, safeguards, and evidence requirements.

---

## 4. Intervention Definition

An intervention is a bounded support contract containing:

- learner identity and tenant context,
- initiating diagnostic case or approved rationale,
- target skill, skill cluster, misconception, strategy, or contextual barrier,
- intervention objective,
- selected intervention strategy,
- execution channel,
- expected duration and dosage,
- success, adaptation, and stop criteria,
- evidence collection requirements,
- authority and consent metadata,
- responsible runtime or human actor,
- version pins for policy, curriculum, skill graph, diagnostic model, and intervention strategy.

---

## 5. Intervention Classes

```text
FOUNDATIONAL_RETEACH
MISCONCEPTION_RESTRUCTURING
PROCEDURAL_FLUENCY
REPRESENTATION_BRIDGING
LANGUAGE_SUPPORT
STRATEGY_COACHING
TRANSFER_PRACTICE
WORKED_EXAMPLE
GUIDED_PRACTICE
DELIBERATE_PRACTICE
SPACED_REVIEW
ERROR_REFLECTION
METACOGNITIVE_PROMPT
ACCESSIBILITY_ADAPTATION
HUMAN_TUTOR_ESCALATION
TEACHER_REVIEW
PARENT_SUPPORTED_PRACTICE
DIAGNOSTIC_PROBE
OBSERVATION_ONLY
```

The class describes operational intent. It does not imply guaranteed effectiveness.

---

## 6. Intervention Aggregate

```ts
interface Intervention {
  interventionId: string
  tenantId: string
  learnerId: string
  diagnosticCaseId?: string
  recommendationId?: string
  targetRefs: InterventionTargetRef[]
  objective: InterventionObjective
  strategy: InterventionStrategyRef
  executionPolicy: InterventionExecutionPolicy
  evidencePolicy: InterventionEvidencePolicy
  safetyPolicy: InterventionSafetyPolicy
  status: InterventionStatus
  version: number
  createdAt: string
  activatedAt?: string
  completedAt?: string
  cancelledAt?: string
}
```

---

## 7. Target Model

```ts
interface InterventionTargetRef {
  targetType:
    | 'SKILL'
    | 'SKILL_CLUSTER'
    | 'MISCONCEPTION'
    | 'UNDERSTANDING_DEBT'
    | 'LEARNING_STRATEGY'
    | 'REPRESENTATION'
    | 'CONTEXTUAL_BARRIER'
  targetId: string
  targetVersion?: string
  role: 'PRIMARY' | 'SUPPORTING' | 'MONITOR_ONLY'
}
```

An intervention must not silently broaden beyond its declared targets.

---

## 8. Lifecycle

```text
DRAFT
PENDING_REVIEW
AUTHORIZED
SCHEDULED
ACTIVE
PAUSED
ADAPTING
AWAITING_EVIDENCE
COMPLETED
EFFECTIVE
PARTIALLY_EFFECTIVE
INEFFECTIVE
ESCALATED
CANCELLED
EXPIRED
INCONCLUSIVE
```

### Lifecycle meaning

- `DRAFT`: proposal exists but carries no execution authority.
- `PENDING_REVIEW`: awaiting required human or policy review.
- `AUTHORIZED`: approved but not yet scheduled.
- `SCHEDULED`: execution window has been established.
- `ACTIVE`: intervention is currently being delivered.
- `PAUSED`: execution is intentionally suspended.
- `ADAPTING`: strategy or dosage is under controlled revision.
- `AWAITING_EVIDENCE`: execution finished but effectiveness cannot yet be determined.
- `COMPLETED`: planned activities are complete; effectiveness remains separate.
- `EFFECTIVE`: evidence supports the declared success criteria.
- `PARTIALLY_EFFECTIVE`: meaningful benefit exists but objectives were not fully met.
- `INEFFECTIVE`: sufficient evidence does not support the intended effect.
- `ESCALATED`: support moved to a higher-authority or human-led path.
- `CANCELLED`: intervention was intentionally terminated.
- `EXPIRED`: intervention lost authority because its time window or assumptions expired.
- `INCONCLUSIVE`: available evidence cannot determine effectiveness.

---

## 9. Authority Boundaries

The Intervention Runtime owns:

- intervention identity,
- lifecycle transitions,
- execution authorization,
- strategy and version binding,
- dosage and scheduling bounds,
- evidence requirements,
- adaptation and stop authority,
- effectiveness handoff,
- audit history.

It does not own:

- curriculum truth,
- skill graph truth,
- diagnostic truth,
- recommendation ranking truth,
- learning content authorship,
- gameplay rendering,
- final human educational judgment.

---

## 10. Safety Principles

1. No intervention may label the learner as incapable, lazy, weak, or defective.
2. Diagnostic uncertainty must remain visible in intervention rationale.
3. High-impact intervention classes require stronger review and evidence.
4. Accessibility support must not be treated as lowering mathematical expectations by default.
5. Repeated failure must trigger reconsideration of the hypothesis, strategy, environment, or evidence—not merely increased pressure.
6. Escalation must be framed as additional support, never punishment.
7. Learner dignity and psychological safety override optimization goals.
8. The system must support cancellation, pause, and human override.

---

## 11. Intervention Objective

```ts
interface InterventionObjective {
  objectiveType:
    | 'UNDERSTANDING_GAIN'
    | 'MISCONCEPTION_REDUCTION'
    | 'FLUENCY_GAIN'
    | 'TRANSFER_GAIN'
    | 'STRATEGY_ADOPTION'
    | 'CONFIDENCE_STABILIZATION'
    | 'BARRIER_REDUCTION'
    | 'DIAGNOSTIC_CLARIFICATION'
  description: string
  baselineRef?: string
  successCriteria: SuccessCriterion[]
  minimumEvidenceWindow?: string
}
```

Success criteria must be observable and must not rely only on activity completion.

---

## 12. Execution Policy

```ts
interface InterventionExecutionPolicy {
  channel:
    | 'LEARNING_ENGINE'
    | 'MISSION_ENGINE'
    | 'GAMEPLAY_RUNTIME'
    | 'TEACHER_LED'
    | 'PARENT_SUPPORTED'
    | 'HUMAN_TUTOR'
    | 'HYBRID'
  dosage: {
    sessions: number
    targetMinutesPerSession?: number
    spacingPolicy?: string
  }
  startWindow?: string
  endWindow?: string
  pauseConditions: string[]
  stopConditions: string[]
  adaptationPolicyId?: string
}
```

---

## 13. Evidence Policy

```ts
interface InterventionEvidencePolicy {
  requiredEvidenceTypes: string[]
  optionalEvidenceTypes: string[]
  baselineRequired: boolean
  transferEvidenceRequired: boolean
  delayedEvidenceRequired: boolean
  minimumIndependentSignals?: number
  effectivenessEvaluatorVersion: string
}
```

The runtime must preserve distinction among:

- participation evidence,
- performance evidence,
- understanding evidence,
- transfer evidence,
- retention evidence,
- human observation.

---

## 14. Command Surface

```text
DraftIntervention
SubmitInterventionForReview
AuthorizeIntervention
ScheduleIntervention
ActivateIntervention
PauseIntervention
ResumeIntervention
RecordInterventionExecution
RequestInterventionAdaptation
ApproveInterventionAdaptation
CompleteIntervention
EvaluateInterventionEffectiveness
EscalateIntervention
CancelIntervention
ExpireIntervention
```

Every command requires tenant, actor, correlation, expected version, and timestamp authority.

---

## 15. Event Surface

```text
InterventionDrafted
InterventionSubmittedForReview
InterventionAuthorized
InterventionScheduled
InterventionActivated
InterventionPaused
InterventionResumed
InterventionExecutionRecorded
InterventionAdaptationRequested
InterventionAdapted
InterventionCompleted
InterventionEffectivenessEvaluated
InterventionEscalated
InterventionCancelled
InterventionExpired
```

Events must preserve the rationale, policy versions, actor authority, and relevant evidence references at the time of decision.

---

## 16. Failure Codes

```text
INTERVENTION_NOT_FOUND
INTERVENTION_VERSION_CONFLICT
INTERVENTION_NOT_AUTHORIZED
INTERVENTION_ALREADY_ACTIVE
INTERVENTION_ALREADY_TERMINAL
INTERVENTION_TARGET_INVALID
INTERVENTION_STRATEGY_UNAVAILABLE
INTERVENTION_POLICY_BLOCKED
INTERVENTION_EVIDENCE_INSUFFICIENT
INTERVENTION_SCHEDULE_INVALID
INTERVENTION_ADAPTATION_NOT_ALLOWED
INTERVENTION_EFFECTIVENESS_INCONCLUSIVE
INTERVENTION_HUMAN_REVIEW_REQUIRED
INTERVENTION_VERSION_UNAVAILABLE
```

Failures must be explicit and machine-readable. Silent fallback is prohibited for authority-sensitive operations.

---

## 17. Cross-Runtime Contracts

### Inputs

- Diagnostic Runtime: hypotheses, uncertainty, debt signals, root-cause candidates.
- Recommendation Runtime: ranked candidate strategies and rationale.
- Skill Graph Runtime: prerequisite and dependency context.
- Curriculum Runtime: grade, standard, and progression context.
- Progress Runtime: current learner progress state.

### Outputs

- Mission Runtime: approved intervention missions.
- Learning Runtime: bounded instructional activities.
- Gameplay Runtime: intervention-compatible game activities.
- Assessment Runtime: evidence collection requests.
- Progress Runtime: intervention participation and outcome events.
- Diagnostic Runtime: new evidence and post-intervention observations.

---

## 18. Foundational Invariants

1. Recommendation does not authorize execution.
2. Completion does not establish effectiveness.
3. Effectiveness does not prove the original diagnosis.
4. Intervention scope may not expand silently.
5. Every active intervention has an authorized strategy version.
6. Every intervention has explicit stop and review conditions.
7. Adaptation preserves prior history and rationale.
8. Repeated ineffectiveness triggers hypothesis review, not automatic intensification.
9. Missing outcome evidence yields `INCONCLUSIVE`, not success.
10. Human override and learner safety remain available throughout the lifecycle.

---

## 19. Completion Condition

34A is complete when the system has a stable intervention vocabulary, aggregate boundary, lifecycle, authority model, command and event surfaces, cross-runtime position, failure model, and foundational safety invariants suitable for the planning and execution runtimes that follow.
