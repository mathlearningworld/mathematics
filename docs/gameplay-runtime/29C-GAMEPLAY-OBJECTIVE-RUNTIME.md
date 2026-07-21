# Chapter 29C — Gameplay Objective Runtime

Status: Architecture Definition
Chapter: 29 — Gameplay Runtime
Slice: 29C

## 1. Purpose

Gameplay Objective Runtime governs how mission or activity objectives are represented, activated, observed, progressed, blocked, satisfied, and reported inside a gameplay session.

It translates authorized objective definitions into executable gameplay contracts without changing the meaning or authority of the originating Mission, Learning, Practice, or Diagnostic system.

## 2. Objective Boundary

Gameplay Objective Runtime owns:

- session-local objective bindings;
- objective activation order;
- objective visibility state;
- accepted gameplay signals;
- objective-local counters and conditions;
- assistance context;
- blocker and hold state;
- satisfaction candidates;
- objective evidence references;
- objective projection for gameplay UI.

It does not own:

- mission objective definition authority;
- curriculum requirements;
- mastery decisions;
- mission completion decisions;
- recommendation priority;
- permanent reward settlement.

## 3. Objective Binding

Every gameplay objective must be bound to an authoritative source.

Required binding fields:

```text
objectiveBindingId
gameplaySessionId
sourceObjectiveId
sourceObjectiveVersion
sourceType
sourceAggregateId
sourceAggregateVersion
objectiveKind
policyVersion
runtimeVersion
boundAt
```

Supported source types:

- MISSION_OBJECTIVE;
- LEARNING_ACTIVITY_OBJECTIVE;
- PRACTICE_OBJECTIVE;
- DIAGNOSTIC_OBJECTIVE;
- DISCOVERY_OBJECTIVE;
- SANDBOX_OBJECTIVE.

Source type must never be inferred from UI placement alone.

## 4. Objective Kinds

Objective kinds may include:

- REACH_LOCATION;
- DISCOVER_ENTITY;
- COLLECT_ENTITY;
- PLACE_ENTITY;
- BUILD_STRUCTURE;
- REPAIR_STRUCTURE;
- TRANSFORM_ENTITY;
- CLASSIFY_ENTITY;
- SEQUENCE_ACTIONS;
- SOLVE_PROBLEM;
- EXPLAIN_REASONING;
- COMPARE_OUTCOMES;
- ESTIMATE_RESULT;
- VERIFY_RESULT;
- COMPLETE_SIMULATION;
- COLLABORATE;
- OBSERVE_PATTERN;
- CUSTOM_CONTRACT.

The objective kind describes gameplay execution shape, not learning meaning.

## 5. Objective State Machine

```text
BOUND
→ AVAILABLE
→ ACTIVE
→ IN_PROGRESS
→ SATISFACTION_PENDING
→ SATISFIED
```

Alternative states:

```text
HIDDEN
LOCKED
PAUSED
BLOCKED
WAIVED
FAILED_OPERATIONALLY
ABANDONED
EXPIRED
SUPERSEDED
INVALIDATED
```

SATISFIED is a gameplay operational fact. It does not mean mastery, readiness, or mission completion.

## 6. Availability

An objective becomes AVAILABLE only when its gameplay prerequisites are met.

Prerequisite categories:

- prior objective state;
- scene availability;
- required entity availability;
- tool availability;
- inventory availability;
- mission state;
- time window;
- human approval;
- group member readiness;
- runtime capability;
- accessibility configuration.

Gameplay prerequisites must not invent stronger curriculum prerequisites.

## 7. Activation

Activation may be:

- automatic by authorized sequence policy;
- learner selected;
- teacher selected;
- mentor selected;
- mission directed;
- scene-triggered under explicit contract.

Activation records:

- actor;
- reason;
- objective version;
- current session version;
- prerequisite snapshot;
- effective time;
- correlation and causation IDs.

A proximity trigger alone may suggest an objective but cannot bypass authorization or prerequisite checks.

## 8. Sequencing Modes

Supported sequencing modes:

- STRICT;
- GUIDED;
- FLEXIBLE;
- PARALLEL;
- BRANCHING;
- OPTIONAL;
- REPEATABLE.

STRICT requires prior objectives to reach the required state.

GUIDED recommends order but permits authorized deviation.

FLEXIBLE allows any available objective.

PARALLEL permits simultaneous progress.

BRANCHING activates one or more paths based on explicit conditions.

OPTIONAL must remain optional in projections and completion policy.

REPEATABLE produces separate attempt facts rather than rewriting prior attempts.

## 9. Signal Intake

Objective Runtime accepts gameplay signals only through typed interaction contracts.

Signal examples:

- entity collected;
- object placed;
- region entered;
- construction completed;
- answer submitted;
- explanation recorded;
- sequence completed;
- measurement captured;
- comparison selected;
- simulation outcome reached;
- peer action confirmed.

Every signal must include provenance, sequence, session identity, source timestamp, and payload hash.

## 10. Signal Acceptance

A signal is accepted only if:

- session is authorized for intake;
- objective binding is current;
- signal type is allowed;
- entity and scene scopes match;
- source sequence is valid;
- duplicate protection passes;
- assistance context is preserved;
- anti-fabrication checks pass;
- policy version is available.

Acceptance outcomes:

- ACCEPTED;
- ACCEPTED_WITH_LIMITATIONS;
- DUPLICATE;
- OUT_OF_ORDER;
- IRRELEVANT;
- HELD_FOR_RECONCILIATION;
- QUARANTINED;
- REJECTED.

## 11. Progress Model

Objective progress may use:

- count;
- ratio;
- ordered steps;
- set membership;
- threshold;
- duration;
- repeated successful attempts;
- independent successful attempts;
- verified outcome;
- human confirmation;
- compound condition.

Progress models must be versioned and deterministic.

## 12. Attempt Model

Every attempt is independently identifiable.

Attempt fields:

- attemptId;
- objectiveBindingId;
- startedAt;
- endedAt;
- outcome;
- assistance profile;
- retry reason;
- evidence references;
- source sequence range;
- attempt policy version.

Retries never erase prior failed, partial, or assisted attempts.

## 13. Assistance Context

Assistance must be recorded per signal and per attempt.

Assistance categories:

- NONE;
- PROMPT;
- HINT_LOW;
- HINT_MEDIUM;
- HINT_HIGH;
- PARTIAL_SOLUTION;
- FULL_SOLUTION;
- AUTOMATED_CORRECTION;
- HUMAN_GUIDANCE;
- PEER_GUIDANCE;
- ACCESSIBILITY_SUPPORT.

Accessibility support remains separately classified and must not automatically weaken evidence.

## 14. Objective Blocking

An objective may be BLOCKED by:

- required entity unavailable;
- scene fault;
- missing tool;
- missing inventory;
- invalid mission binding;
- group dependency;
- human approval hold;
- policy withdrawal;
- safety rule;
- unresolved sequence conflict.

Blockers are explicit durable facts. UI hiding cannot remove a blocker.

## 15. Waiver Boundary

Waiver requires external authority permitted by policy.

A waiver record must include:

- waiverId;
- objectiveBindingId;
- actor authority;
- reason;
- scope;
- effective time;
- expiration where applicable;
- policy version.

Waived does not mean satisfied. The completion consumer decides how a waiver affects completion eligibility.

## 16. Satisfaction Candidate

Gameplay Objective Runtime may emit:

```text
OBJECTIVE_SATISFACTION_CANDIDATE
```

The candidate includes:

- objective binding and source versions;
- progress summary;
- attempt summary;
- assistance summary;
- evidence references;
- unresolved limitations;
- blocker state;
- final source sequence;
- deterministic evaluation hash.

It does not assert mastery or mission completion.

## 17. Satisfaction Confirmation

Objective satisfaction may be confirmed within Gameplay Runtime only when the authorized gameplay contract is fulfilled.

Confirmation requires:

- current binding;
- valid session state;
- complete required conditions;
- no unresolved hard blocker;
- evidence candidate integrity;
- applicable human confirmation;
- version and concurrency checks.

Confirmation produces `GameplayObjectiveSatisfied`.

## 18. Operational Failure

`FAILED_OPERATIONALLY` means the objective execution could not continue or meet its gameplay contract under the current attempt or session.

It does not mean the learner lacks understanding.

Examples:

- scene entity missing;
- time-limited simulation ended;
- required collaboration member disconnected;
- construction state became unrecoverable;
- runtime invariant failed.

## 19. Shared and Collaborative Objectives

Collaborative objectives must distinguish:

- individual contribution;
- group outcome;
- observed participation;
- delegated action;
- assisted action;
- verified independent action.

A group success must not automatically grant identical individual evidence to every participant.

## 20. Offline and Delayed Signals

Delayed signals are evaluated using:

- source sequence;
- source timestamp;
- session lease history;
- objective version effective at source time;
- prior accepted event prefix;
- conflict resolution policy.

Receive order alone is insufficient.

## 21. Supersession

An objective binding may be superseded when:

- source mission version changes;
- objective definition changes;
- scene contract changes;
- policy changes require migration;
- a new branch replaces the prior path.

Supersession preserves historical progress and prevents new signals from applying to the obsolete binding.

## 22. Projection Contract

Gameplay UI projections may show:

- objective label;
- icon and scene marker;
- availability;
- current progress;
- next permitted action;
- optionality;
- blocker summary;
- assistance availability;
- completion candidate status.

Projection must not:

- hide required blockers;
- convert optional to required;
- claim mastery;
- claim Mission completion;
- present stale binding as current;
- execute state transitions by rendering.

## 23. Typed Failures

- GAMEPLAY_OBJECTIVE_NOT_FOUND;
- GAMEPLAY_OBJECTIVE_BINDING_STALE;
- GAMEPLAY_OBJECTIVE_NOT_AVAILABLE;
- GAMEPLAY_OBJECTIVE_NOT_ACTIVE;
- GAMEPLAY_OBJECTIVE_TERMINAL;
- GAMEPLAY_OBJECTIVE_VERSION_CONFLICT;
- GAMEPLAY_OBJECTIVE_PREREQUISITE_UNMET;
- GAMEPLAY_OBJECTIVE_SIGNAL_INVALID;
- GAMEPLAY_OBJECTIVE_SIGNAL_DUPLICATE;
- GAMEPLAY_OBJECTIVE_SIGNAL_OUT_OF_ORDER;
- GAMEPLAY_OBJECTIVE_ENTITY_SCOPE_MISMATCH;
- GAMEPLAY_OBJECTIVE_SCENE_SCOPE_MISMATCH;
- GAMEPLAY_OBJECTIVE_BLOCKED;
- GAMEPLAY_OBJECTIVE_WAIVER_UNAUTHORIZED;
- GAMEPLAY_OBJECTIVE_SATISFACTION_INCOMPLETE;
- GAMEPLAY_OBJECTIVE_EVIDENCE_INVALID.

## 24. Objective Events

- GameplayObjectiveBound;
- GameplayObjectiveAvailable;
- GameplayObjectiveActivated;
- GameplayObjectiveProgressed;
- GameplayObjectiveAttemptStarted;
- GameplayObjectiveAttemptCompleted;
- GameplayObjectiveAssistanceRecorded;
- GameplayObjectiveBlocked;
- GameplayObjectiveUnblocked;
- GameplayObjectiveWaived;
- GameplayObjectiveSatisfactionRequested;
- GameplayObjectiveSatisfied;
- GameplayObjectiveOperationallyFailed;
- GameplayObjectiveAbandoned;
- GameplayObjectiveExpired;
- GameplayObjectiveSuperseded;
- GameplayObjectiveInvalidated.

## 25. Objective Invariants

1. Every objective has an authoritative source binding.
2. Source versions are preserved.
3. Optional objectives remain optional.
4. Hidden does not mean unavailable or completed.
5. Proximity does not bypass authorization.
6. Duplicate signals never duplicate progress.
7. Retries preserve prior attempts.
8. Assistance context is never discarded.
9. Accessibility support is not automatically penalized.
10. Blockers cannot be erased by projection.
11. Waived is distinct from satisfied.
12. Satisfied is distinct from mastered.
13. Group success is distinct from individual evidence.
14. Superseded bindings reject new progress.
15. Objective progress does not directly mutate Mission state.

## 26. Acceptance Gate

29C is architecturally complete when implementation can verify:

- authoritative and versioned objective binding;
- deterministic availability and activation;
- typed signal intake;
- duplicate and ordering protection;
- progress and attempt separation;
- assistance preservation;
- blocker and waiver integrity;
- collaborative evidence separation;
- satisfaction-versus-mastery boundary;
- safe objective supersession;
- projection fidelity;
- durable objective event history.
