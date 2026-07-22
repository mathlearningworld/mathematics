# 34D — Adaptive Intervention Runtime

## Status

- Chapter: 34 — Intervention Runtime
- Slice: 34D
- Authority: Architecture specification
- Depends on: 34A, 34B, 34C, Diagnostic Runtime, Recommendation Runtime, Learning Engine, Mission Engine, Assessment Engine

## Purpose

Adaptive Intervention Runtime governs how an active intervention may change when new runtime evidence shows that the current plan is too easy, too difficult, ineffective, unsafe, inaccessible, poorly timed, or based on an increasingly weak diagnostic hypothesis.

Adaptation is a controlled runtime transition. It is not permission for an executor, model, teacher interface, or gameplay surface to rewrite an intervention freely.

## Core Doctrine

> Adaptation changes the intervention while preserving the history, authority, safety constraints, and evidence needed to explain why the change occurred.

The runtime must preserve these distinctions:

```text
Adjustment ≠ Re-plan
Re-plan ≠ New diagnosis
Escalation ≠ Punishment
More dosage ≠ Better support
Learner friction ≠ Learner failure
Automation confidence ≠ Authorization
```

## Responsibilities

Adaptive Intervention Runtime owns:

1. adaptation trigger evaluation,
2. adaptation boundary enforcement,
3. bounded parameter adjustments,
4. phase substitution requests,
5. re-plan requests,
6. diagnostic review requests,
7. escalation and de-escalation decisions,
8. adaptation evidence capture,
9. adaptation audit history,
10. safe fallback when no authorized adaptation exists.

It does not own:

- diagnostic truth,
- recommendation ranking authority,
- curriculum authority,
- skill graph authority,
- execution-channel implementation,
- final effectiveness judgment,
- unrestricted human override.

## Adaptation Triggers

A trigger is a versioned, explainable condition derived from runtime evidence.

```text
PERFORMANCE_STALL
RAPID_SUCCESS
REPEATED_MISCONCEPTION
TRANSFER_FAILURE
EXCESSIVE_HINT_DEPENDENCE
ENGAGEMENT_BREAKDOWN
ACCESSIBILITY_BARRIER
CHANNEL_FAILURE
SCHEDULE_CONFLICT
DOSAGE_LIMIT_REACHED
SAFETY_SIGNAL
NEW_DIAGNOSTIC_EVIDENCE
HYPOTHESIS_CONFIDENCE_DROP
HUMAN_REVIEW_REQUEST
LEARNER_REQUEST
POLICY_CHANGE
```

A trigger does not itself authorize a mutation. It opens an adaptation decision.

## Adaptation Decision Model

```ts
interface AdaptationDecision {
  adaptationId: string;
  interventionId: string;
  executionId: string;
  triggerType: AdaptationTriggerType;
  triggerEvidenceRefs: string[];
  observedAt: string;
  currentPlanVersion: string;
  currentPhaseId: string;
  candidateActions: AdaptationCandidate[];
  selectedAction?: AdaptationAction;
  decisionStatus: AdaptationDecisionStatus;
  authorityRef: string;
  policyVersion: string;
  createdAt: string;
}
```

Decision statuses:

```text
OPEN
EVIDENCE_PENDING
CANDIDATES_READY
REVIEW_REQUIRED
AUTHORIZED
APPLIED
DECLINED
EXPIRED
BLOCKED
INCONCLUSIVE
```

## Adaptation Levels

### Level 0 — Observe Only

No intervention mutation. Continue gathering evidence.

### Level 1 — Parameter Adjustment

May change only parameters explicitly declared adaptable by the authorized plan:

- item count,
- pacing,
- hint timing,
- representation order,
- session duration,
- repetition spacing,
- feedback density.

### Level 2 — Phase Adjustment

May pause, repeat, skip, reorder, or substitute a phase only when the plan defines an authorized alternative.

### Level 3 — Re-plan

Creates a new intervention-plan version. The prior plan remains immutable and linked.

### Level 4 — Diagnostic Review

Returns the case to Diagnostic Runtime because new evidence materially weakens the active hypothesis or reveals a plausible alternative cause.

### Level 5 — Human Escalation

Requires qualified human review because risk, repeated ineffectiveness, accessibility need, learner distress, or policy requires it.

## Adaptable Bounds

Every authorized plan must declare its adaptation envelope.

```ts
interface AdaptationEnvelope {
  allowedParameters: string[];
  minimumDosage: DosageBoundary;
  maximumDosage: DosageBoundary;
  allowedPhaseAlternatives: PhaseAlternative[];
  allowedChannels: ExecutionChannel[];
  maxAutomaticAdaptations: number;
  reviewAfterAdaptations: number;
  forbiddenActions: string[];
  stopConditions: StopCondition[];
  escalationConditions: EscalationCondition[];
}
```

Any requested change outside the envelope becomes a re-plan, diagnostic review, or human review request.

## Adaptation Actions

```text
CONTINUE_UNCHANGED
REDUCE_DIFFICULTY
INCREASE_DIFFICULTY
CHANGE_REPRESENTATION
CHANGE_FEEDBACK_MODE
CHANGE_HINT_POLICY
CHANGE_PACING
CHANGE_DOSAGE
REPEAT_PHASE
SKIP_AUTHORIZED_PHASE
SUBSTITUTE_AUTHORIZED_PHASE
PAUSE_INTERVENTION
RESUME_INTERVENTION
SWITCH_AUTHORIZED_CHANNEL
DE_ESCALATE_SUPPORT
REQUEST_REPLAN
REQUEST_DIAGNOSTIC_REVIEW
ESCALATE_TO_HUMAN
STOP_FOR_SAFETY
```

## Decision Sequence

```text
1. Receive trigger evidence
2. Verify evidence authority and freshness
3. Load active plan and adaptation envelope
4. Check safety and policy blocks
5. Determine whether evidence is sufficient
6. Generate bounded adaptation candidates
7. Estimate benefit, risk, cost, and diagnostic value
8. Check cumulative adaptation count and dosage
9. Select, defer, or escalate
10. Record decision before mutation
11. Apply through Intervention Execution Runtime
12. Capture post-adaptation evidence
```

## Safety Rules

Safety rules override optimization goals.

The runtime must stop, pause, or escalate when:

- learner distress is reported or inferred by an authorized policy,
- accessibility accommodations are unavailable,
- cumulative dosage exceeds the authorized maximum,
- the execution channel is malfunctioning,
- repeated adaptations increase burden without evidence of benefit,
- the active diagnostic hypothesis becomes materially unsupported,
- required human supervision is absent.

## Adaptation and Difficulty

Difficulty adjustment must not be based on score alone.

The runtime should consider:

- error type,
- independence,
- response stability,
- transfer performance,
- hint dependence,
- time pressure,
- representation sensitivity,
- accessibility context,
- recent fatigue or interruption signals.

Rapid correct answers may indicate mastery, guessing, memorized pattern matching, or an intervention that is too easy. Additional evidence may be required before increasing difficulty.

## Adaptation and Understanding Debt

An intervention may target one or more understanding-debt signals, but adaptation must not silently change the target debt.

Changing the target requires:

1. a new plan version,
2. an updated rationale,
3. evidence references,
4. appropriate diagnostic or human authority.

## Repeated Ineffectiveness

Repeated ineffectiveness must not automatically produce more dosage.

Required sequence:

```text
Review execution fidelity
Review evidence quality
Review accessibility and context
Review intervention-strategy fit
Review active diagnostic hypothesis
Compare alternative causes
Then decide whether to adapt, re-plan, pause, or escalate
```

## Human Authority

Human reviewers may:

- authorize adaptations outside automatic bounds,
- decline an adaptation,
- request additional evidence,
- pause or stop an intervention,
- request diagnostic reconsideration.

Human action must still be recorded with actor, role, reason, timestamp, and affected version.

## Failure Codes

```text
ADAPTATION_EVIDENCE_MISSING
ADAPTATION_EVIDENCE_STALE
PLAN_NOT_ACTIVE
ADAPTATION_NOT_ALLOWED
ADAPTATION_BOUND_EXCEEDED
SAFETY_BLOCKED
POLICY_BLOCKED
DOSAGE_LIMIT_EXCEEDED
PHASE_ALTERNATIVE_UNAVAILABLE
CHANNEL_UNAVAILABLE
REPLAN_REQUIRED
DIAGNOSTIC_REVIEW_REQUIRED
HUMAN_REVIEW_REQUIRED
CONCURRENT_ADAPTATION_CONFLICT
ADAPTATION_ALREADY_APPLIED
```

## Events

```text
AdaptationTriggered
AdaptationEvidenceAccepted
AdaptationCandidatesGenerated
AdaptationReviewRequested
AdaptationAuthorized
AdaptationDeclined
AdaptationApplied
AdaptationBlocked
InterventionReplanRequested
DiagnosticReviewRequested
HumanEscalationRequested
InterventionPausedForSafety
```

## Acceptance Criteria

34D is complete when the architecture ensures that:

- adaptation is evidence-driven and bounded,
- every adaptation is explainable and versioned,
- safety overrides optimization,
- repeated failure triggers review rather than blind intensification,
- target changes require new authority,
- automatic and human adaptation remain auditable,
- no adaptation erases prior plan or execution history.

## Runtime Invariants

1. No adaptation without evidence or an explicit human request.
2. No automatic adaptation outside the authorized envelope.
3. No silent mutation of the active plan.
4. No increase in dosage beyond the authorized maximum.
5. No adaptation may hide execution failure.
6. No repeated ineffectiveness may be treated as learner deficiency by default.
7. Every applied adaptation must link to trigger evidence and authority.
8. Safety, accessibility, and policy blocks always take precedence.
