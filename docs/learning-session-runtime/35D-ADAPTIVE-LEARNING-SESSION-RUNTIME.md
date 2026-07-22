# 35D — Adaptive Learning Session Runtime

## Status

**Chapter:** 35 — Learning Session Runtime  
**Slice:** 35D  
**Authority:** Architecture specification  
**Purpose:** Define how an active learning session may adapt safely from runtime evidence without corrupting plan authority, diagnostic meaning, learner safety, or historical truth.

---

## 1. Problem

A session plan is created before the learner begins. Runtime reality can differ from that plan:

- the learner may progress faster or slower than expected;
- an activity may be inaccessible or confusing;
- a channel may fail;
- evidence may reveal an unmet prerequisite;
- fatigue or frustration may rise;
- a previously suitable activity may become low value;
- human support may become necessary.

The system must adapt without treating every difficulty as failure, without silently changing the learning objective, and without allowing a personalization mechanism to become an unbounded authority.

---

## 2. Core Distinctions

```text
Observation ≠ Adaptation
Adaptation request ≠ Adaptation decision
Parameter change ≠ Sequence change
Sequence change ≠ Objective change
Objective change ≠ Re-diagnosis
More activity ≠ Better learning
Lower difficulty ≠ Better support
Learner friction ≠ Learner inability
Session recovery ≠ Session adaptation
```

These distinctions are mandatory across APIs, events, storage, projections, and UI language.

---

## 3. Runtime Responsibility

Adaptive Learning Session Runtime owns:

- observing adaptation-relevant session evidence;
- classifying adaptation triggers;
- evaluating whether change is allowed by the active plan;
- selecting an authorized adaptation action;
- applying bounded runtime changes;
- recording decision rationale and evidence references;
- requesting re-plan, intervention review, diagnostic review, or human escalation when local adaptation is insufficient;
- preserving replayable adaptation history.

It does not own:

- changing curriculum truth;
- changing diagnosis without Diagnostic Runtime;
- declaring mastery;
- rewriting prior evidence;
- silently changing intervention intent;
- overriding safety or accessibility policy;
- granting itself broader authority than the approved session plan.

---

## 4. Adaptation Envelope

Every authorized session plan must include a versioned `SessionAdaptationEnvelope`.

```text
SessionAdaptationEnvelope
  envelopeId
  planId
  planVersion
  policyVersion
  allowedTriggerTypes[]
  allowedActionTypes[]
  protectedObjectives[]
  immutableBindings[]
  durationBounds
  activityCountBounds
  difficultyBounds
  hintBounds
  retryBounds
  channelFallbacks[]
  humanApprovalRules[]
  maxAutomaticAdaptations
  maxConsecutiveAdaptations
  minimumEvidenceRequirements
  escalationConditions[]
  stopConditions[]
  createdAt
```

No runtime adaptation may occur outside this envelope.

---

## 5. Trigger Types

Canonical trigger types:

```text
PACE_TOO_FAST
PACE_TOO_SLOW
REPEATED_INCORRECT_PATTERN
LOW_CONFIDENCE_RESPONSE
HIGH_HINT_DEPENDENCE
ACCESSIBILITY_MISMATCH
CHANNEL_UNAVAILABLE
ACTIVITY_UNAVAILABLE
LEARNER_FATIGUE_SIGNAL
LEARNER_FRUSTRATION_SIGNAL
LEARNER_DISENGAGEMENT_SIGNAL
UNEXPECTED_PREREQUISITE_GAP
OBJECTIVE_ALREADY_DEMONSTRATED
EVIDENCE_CONFLICT
HUMAN_SUPPORT_REQUESTED
SAFETY_SIGNAL
TIME_BUDGET_PRESSURE
RECOVERY_DEGRADATION
```

A trigger is an interpreted runtime condition, not raw evidence.

---

## 6. Evidence Threshold

An adaptation decision requires evidence appropriate to its consequence.

Low-impact actions may use a single reliable observation. High-impact actions require stronger support.

```text
Low impact
  pacing adjustment
  optional hint
  equivalent presentation change

Medium impact
  activity substitution
  phase reorder
  channel fallback

High impact
  objective deferment
  prerequisite branch
  session early termination
  human escalation
  re-plan request
  diagnostic review request
```

The higher the impact, the stronger the evidence, authority, and auditability required.

---

## 7. Adaptation Action Types

```text
NO_CHANGE
ADJUST_PACING
ADJUST_TIME_LIMIT
ADD_HINT
CHANGE_HINT_MODE
REDUCE_DISTRACTION
CHANGE_PRESENTATION
SUBSTITUTE_EQUIVALENT_ACTIVITY
REORDER_REMAINING_ACTIVITIES
SKIP_REDUNDANT_ACTIVITY
INSERT_REINFORCEMENT_ACTIVITY
INSERT_PREREQUISITE_CHECK
INSERT_SHORT_BREAK
SWITCH_AUTHORIZED_CHANNEL
PAUSE_FOR_HUMAN
END_SESSION_EARLY
REQUEST_SESSION_REPLAN
REQUEST_INTERVENTION_REVIEW
REQUEST_DIAGNOSTIC_REVIEW
ESCALATE_SAFETY
```

Every action must state whether it changes:

- execution parameters;
- activity sequence;
- evidence plan;
- time budget;
- channel binding;
- objective coverage;
- participant requirement.

---

## 8. Protected Meaning

The following cannot be changed by local automatic adaptation unless explicitly authorized:

- session owner and learner identity;
- tenant and policy context;
- diagnostic hypothesis;
- intervention purpose;
- primary learning objective;
- mastery criteria;
- safety constraints;
- required evidence classes;
- reward authority;
- progress publication authority.

If a desired change crosses a protected boundary, the runtime emits a request to the owning runtime instead of applying the change.

---

## 9. Decision Model

```text
AdaptationDecision
  decisionId
  sessionId
  sessionVersion
  planId
  planVersion
  envelopeId
  triggerType
  triggerEvidenceRefs[]
  actionType
  actionParameters
  impactLevel
  confidence
  rationaleCode
  policyChecks[]
  safetyChecks[]
  authorityChecks[]
  decidedBy
  decidedAt
  effectiveFromSequence
  expiresAt?
  requiresHumanApproval
  approvalState?
```

The rationale must be machine-readable and explainable to an authorized human.

---

## 10. Decision Procedure

```text
1. Receive adaptation-relevant evidence.
2. Validate session identity, version, and execution lease.
3. Confirm evidence integrity and freshness.
4. Derive or update trigger candidates.
5. Suppress duplicate or already-resolved triggers.
6. Load active adaptation envelope.
7. Identify protected boundaries.
8. Generate allowed action candidates.
9. Evaluate safety, accessibility, objective integrity, burden, and evidence value.
10. Select NO_CHANGE, bounded adaptation, or escalation.
11. Persist decision before external dispatch.
12. Apply change idempotently.
13. Observe post-adaptation outcome.
14. Stop, continue, or escalate according to policy.
```

---

## 11. Automatic Adaptation Limits

Automatic adaptation must stop when any configured limit is reached:

- maximum automatic adaptations;
- maximum consecutive adaptations without stable progress;
- minimum remaining session time;
- repeated equivalent substitution failure;
- recurring accessibility mismatch;
- unresolved evidence conflict;
- learner distress or safety signal;
- objective integrity would be compromised;
- human approval is required;
- execution state is stale or uncertain.

When stopped, the runtime must not guess. It transitions to a review, waiting, or escalation state.

---

## 12. Session State Integration

Adaptation may interact with session state as follows:

```text
ACTIVE → ADAPTATION_PENDING
ADAPTATION_PENDING → ACTIVE
ADAPTATION_PENDING → WAITING_FOR_HUMAN
ADAPTATION_PENDING → PAUSED
ADAPTATION_PENDING → COMPLETING
ADAPTATION_PENDING → FAILED
INTERRUPTED → RECOVERY_PENDING
RECOVERY_PENDING → ADAPTATION_PENDING
```

Adaptation does not erase the original session state history.

---

## 13. Adaptation vs Recovery

Recovery restores a valid execution position after interruption.

Adaptation changes future execution because evidence indicates that the planned path is no longer the best allowed path.

```text
Lost connection → recovery
Unavailable activity with approved substitute → adaptation
Duplicate dispatch → idempotent recovery
Repeated misunderstanding → adaptation or review
Stale lease → recovery block
Safety concern → escalation
```

---

## 14. Learner-Centered Safety

The runtime must not:

- punish slower pace;
- continuously increase workload after errors;
- hide repeated failure behind endless retries;
- use emotionally manipulative urgency;
- expose diagnostic labels to the learner;
- infer inability from latency alone;
- reduce challenge solely to maximize completion;
- remove required accessibility support to save time.

Learner-facing explanations should describe the immediate support action, not a negative judgment.

---

## 15. Human Participation

Human approval may be required for:

- changing a primary objective;
- ending a high-stakes session early;
- moving to a materially different intervention path;
- repeated unresolved prerequisite gaps;
- safety or wellbeing concerns;
- overriding a learner or guardian preference;
- switching to a human-delivered channel;
- applying an action outside automatic policy bounds.

Human decisions must be recorded with actor, role, reason, and evidence context.

---

## 16. Cross-Runtime Contracts

Adaptive Session Runtime may emit:

```text
SessionAdaptationApplied
SessionAdaptationRejected
SessionAdaptationDeferred
SessionReplanRequested
InterventionReviewRequested
DiagnosticReviewRequested
HumanSupportRequested
SafetyEscalationRequested
```

It may consume:

- session evidence from Session Evidence Runtime;
- active plan and envelope from Session Planning Runtime;
- execution state from Session Orchestration Runtime;
- intervention constraints from Intervention Runtime;
- diagnostic context from Diagnostic Runtime;
- curriculum and skill graph context from their owning runtimes;
- accessibility and policy context from platform authority.

---

## 17. Idempotency and Concurrency

An adaptation application key should include:

```text
sessionId
sessionVersion
adaptationDecisionId
effectiveFromSequence
```

Only the valid fenced executor may advance execution after adaptation. Duplicate delivery must return the already-applied result without repeating rewards, dispatches, evidence, or progress effects.

---

## 18. Observability

Required metrics include:

- adaptations per session;
- adaptation rate by trigger and action;
- automatic vs human-approved adaptations;
- post-adaptation stabilization rate;
- repeated adaptation without improvement;
- accessibility-related adaptations;
- escalation rate;
- false-trigger and reversal rate;
- average decision latency;
- adaptation application failures;
- protected-boundary rejection count.

Metrics must not be interpreted as learner quality scores.

---

## 19. Failure Handling

Canonical failure codes:

```text
SESSION_NOT_ADAPTABLE
STALE_SESSION_VERSION
INVALID_EXECUTION_LEASE
EVIDENCE_NOT_TRUSTED
EVIDENCE_TOO_WEAK
TRIGGER_NOT_SUPPORTED
ACTION_NOT_AUTHORIZED
ADAPTATION_LIMIT_REACHED
PROTECTED_BOUNDARY_CROSSED
HUMAN_APPROVAL_REQUIRED
SAFETY_POLICY_BLOCKED
ACCESSIBILITY_POLICY_BLOCKED
NO_SAFE_ADAPTATION
ADAPTATION_APPLICATION_FAILED
```

A technical failure applying an adaptation must leave the session recoverable and must not imply learner failure.

---

## 20. Verification Requirements

Verification must prove:

- no action occurs outside the active envelope;
- high-impact actions require sufficient evidence;
- protected objectives cannot be silently changed;
- duplicate decisions do not duplicate effects;
- stale executors cannot apply adaptations;
- adaptation and recovery remain distinct;
- learner safety blocks optimization;
- replay reconstructs the same adaptation sequence;
- cross-runtime requests preserve authority boundaries.

---

## 21. Completion Criteria

35D is complete when the architecture provides:

- explicit trigger and action taxonomies;
- a versioned adaptation envelope;
- bounded automatic adaptation;
- human approval and escalation paths;
- protected meaning boundaries;
- idempotent, replayable decision application;
- learner safety and accessibility rules;
- cross-runtime authority preservation.

---

## Final Doctrine

> Adaptive Learning Session Runtime may change the path through an authorized session, but it may not silently change why the session exists, what counts as learning, or who owns the decision. Adaptation must remain bounded, evidence-based, explainable, safe, and historically replayable.
