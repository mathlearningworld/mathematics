# Chapter 28G — Mission Projection Runtime

## Status

Architecture specification for the Mission Engine projection boundary.

This document defines how durable Mission truth is transformed into audience-specific views without changing mission authority, lifecycle meaning, progress meaning, completion meaning, evidence meaning, or human authority.

---

## 1. Purpose

Mission Projection Runtime answers:

> How should one authoritative Mission be presented to each consumer, at this moment, without inventing stronger meaning than the source Mission actually contains?

Projection is a read-model concern. It is not a second Mission Engine and is not allowed to become hidden business authority.

```text
Mission Aggregate + Durable Mission Records
                    ↓
          Mission Projection Runtime
                    ↓
Learner / Parent / Teacher / Mentor / Gameplay / Operations / Audit
```

---

## 2. Core Doctrine

```text
One Mission Truth
        ↓
Many Audience Views
```

A projection may simplify, translate, group, redact, order, summarize, or decorate.

A projection may not strengthen, reinterpret, activate, complete, reopen, cancel, supersede, or assess a Mission.

```text
Projection may contain less information.
Projection must never contain stronger meaning.
```

---

## 3. Authority Boundary

Mission Projection Runtime MAY:

- select fields according to audience and permission;
- translate labels and descriptions;
- simplify operational language;
- group objectives and milestones;
- derive display-only percentages from authoritative progress records;
- expose permitted actions as affordances;
- attach freshness, limitation, and source indicators;
- produce stable read models;
- cache rebuildable projections;
- publish projection-updated events after durable writes.

Mission Projection Runtime MUST NOT:

- change Mission lifecycle state;
- infer mastery from completion;
- infer readiness from activation;
- infer understanding from activity;
- increase progress beyond authoritative progress records;
- remove blockers, holds, limitations, waivers, or required approvals;
- convert optional Missions into required Missions;
- convert proposals into active Missions;
- execute commands on behalf of the viewer;
- become Source of Truth.

---

## 4. Projection Inputs

A projection request may consume:

- Mission aggregate identity and version;
- Mission lifecycle state;
- candidate and proposal provenance;
- activation decision and policy version;
- objective definitions;
- objective progress records;
- milestone records;
- blocker and hold records;
- completion decision;
- supersession records;
- expiration data;
- evidence envelope references;
- reward eligibility state;
- audience identity and permissions;
- locale and accessibility preferences;
- projection policy version;
- current projection time.

Every input must remain traceable to a durable source or an explicitly non-authoritative presentation policy.

---

## 5. Projection Identity

Every projection record must contain at least:

```text
projectionId
projectionType
projectionVersion
missionId
missionVersion
tenantId
learnerId
audienceType
audienceId?
projectionPolicyVersion
sourceWatermark
projectedAt
freshnessState
```

Projection identity must never be confused with Mission identity.

A new projection version does not create a new Mission version.

---

## 6. Audience Types

Supported audience contracts include:

```text
LEARNER
PARENT
TEACHER
MENTOR
MISSION_ENGINE_INTERNAL
GAMEPLAY_RUNTIME
LEARNING_ENGINE
PRACTICE_ENGINE
ASSESSMENT_ENGINE
RECOMMENDATION_ENGINE
OPERATIONS
AUDIT
SUPPORT
```

Each audience receives a distinct schema and permission policy.

A universal projection object with nullable fields for every audience is discouraged because it leaks authority, raises coupling, and makes permission mistakes difficult to detect.

---

## 7. Learner Projection

The learner view should answer:

- What is this Mission?
- Why is it available?
- What can I do now?
- What has been completed operationally?
- What remains?
- Is anything blocking me?
- Can I pause, resume, abandon, or ask for help?

Recommended learner fields:

```text
missionId
title
shortPurpose
missionType
optionality
lifecycleState
primaryAction
allowedActions
objectiveCards
milestones
progressSummary
blockerSummary
supportSummary
expirationSummary
completionSummary
limitations
freshnessState
```

The learner projection must not display internal confidence or assessment terminology as a motivational score unless an explicit product policy safely translates it.

---

## 8. Parent Projection

The parent view may include:

- learner-visible Mission summary;
- why the Mission was proposed;
- whether parental approval is required;
- support actions permitted to the parent;
- operational progress;
- time-window and scheduling information;
- holds and blockers appropriate for disclosure;
- completion status;
- explicit reminder that Mission completion is not mastery confirmation.

A parent projection must not expose another learner's data or teacher-only notes.

---

## 9. Teacher Projection

The teacher view may include:

- class, cohort, or learner-scoped Mission status;
- objective-level operational progress;
- assignment and approval context;
- required intervention indicators;
- blockers and completion holds;
- evidence handoff status;
- Mission provenance;
- projection freshness;
- permitted teacher actions.

Teacher projection must preserve uncertainty and must not convert Assessment claims into definitive labels such as “weak student.”

---

## 10. Mentor Projection

Mentor projection may expose:

- support-required objectives;
- scheduled support window;
- permitted hints or guidance boundaries;
- current operational state;
- learner consent state;
- completion requirements involving mentor confirmation.

Mentor access must be explicitly scoped and revocable.

---

## 11. Gameplay Runtime Projection

Gameplay requires a machine-readable delivery contract, not a human dashboard.

Example fields:

```text
missionId
missionVersion
deliveryContractVersion
missionType
objectiveContracts
sequencingPolicy
allowedGameplayModes
requiredCapabilities
reservedResources
progressWriteContract
completionSignalContract
pausePolicy
expirationAt
supersessionState
```

Gameplay projection MUST NOT contain authority to declare mastery or bypass Mission transition rules.

Gameplay may report activity; Mission Engine decides operational progress; Assessment interprets learning evidence.

---

## 12. Internal Engine Projections

### Learning Engine

Receives only the learning-delivery requirements needed to fulfill the Mission.

### Practice Engine

Receives practice purpose, dosage, difficulty boundary, stopping rules, and progress reporting contract.

### Assessment Engine

Receives evidence envelope references and Mission context, not a pre-decided mastery outcome.

### Recommendation Engine

Receives Mission consumption, lifecycle, completion, abandonment, expiration, and supersession facts for recalculation.

---

## 13. Operations Projection

Operations views may expose:

- queue health;
- activation failures;
- stuck Missions;
- projection lag;
- delivery reservation failures;
- repeated idempotency conflicts;
- completion holds;
- replay divergence;
- quarantined Mission records.

Operations projection should use pseudonymous identifiers where full learner identity is unnecessary.

---

## 14. Audit Projection

Audit projection must preserve:

- complete identity chain;
- source provenance;
- policy versions;
- actor identity;
- transition history;
- objective and progress history;
- approval history;
- completion decision history;
- supersession history;
- projection policy and source watermark;
- redaction reason where applicable.

Audit projection is not editable operational data.

---

## 15. Derived Display Fields

Projection may calculate display-only values such as:

```text
completedObjectives / totalObjectives
elapsedTimeDisplay
remainingTimeDisplay
nextRecommendedActionLabel
objectiveGroupSummary
```

Every derived field must declare:

- source fields;
- deterministic formula;
- null behavior;
- rounding behavior;
- freshness behavior;
- whether it is authoritative or display-only.

A percentage is display-only unless the Mission contract explicitly defines it as authoritative progress.

---

## 16. Action Affordances

Projection may expose actions such as:

```text
ACCEPT
DECLINE
ACTIVATE
START
PAUSE
RESUME
REQUEST_HELP
SUBMIT_COMPLETION
ABANDON
ACKNOWLEDGE_BLOCKER
```

Affordances are permission-aware invitations to issue commands.

They are not executed transitions.

```text
Visible action ≠ successful command
```

Every command must still pass authoritative validation against the latest Mission version.

---

## 17. Freshness Model

Mission projections use:

```text
CURRENT
AGING
STALE
SUPERSEDED
WITHDRAWN
UNAVAILABLE
```

Rules:

- `CURRENT`: source watermark matches durable Mission state.
- `AGING`: within permitted lag but nearing freshness threshold.
- `STALE`: source Mission changed beyond permitted lag.
- `SUPERSEDED`: Mission was superseded.
- `WITHDRAWN`: Mission is no longer publishable.
- `UNAVAILABLE`: projection cannot be safely built.

A stale projection must not offer mutation actions that could be misleading.

---

## 18. Limitation Preservation

The following information must never be silently removed:

- Mission is optional;
- Mission is blocked;
- Mission is paused;
- Mission is expired;
- completion is pending or held;
- completion is operational, not mastery;
- human approval is required;
- recommendation source was superseded;
- evidence is incomplete;
- projection is stale.

Simplification may shorten wording but must preserve semantic force.

---

## 19. Redaction and Permission

Projection policy must enforce:

```text
Tenant isolation
Learner isolation
Role permission
Relationship permission
Purpose limitation
Field-level redaction
Time-bound access
Consent where required
```

Redaction must be explicit in audit records.

A missing field due to redaction must not be interpreted as an absent blocker or absent limitation by downstream systems.

Machine consumers should receive typed redaction metadata where omission affects interpretation.

---

## 20. Projection Build Modes

Supported modes:

```text
ON_WRITE
EVENT_DRIVEN
ON_DEMAND
SCHEDULED_REBUILD
FULL_REBUILD
TARGETED_REPAIR
```

The system may use multiple modes, but all must produce equivalent semantic output for the same source watermark and policy version.

---

## 21. Determinism

Given identical:

- Mission durable records;
- projection policy version;
- audience identity and permissions;
- locale bundle version;
- projection timestamp bucket where time-dependent;

the semantic projection must be deterministic.

Presentation ordering must use stable tie-break rules.

---

## 22. Projection Events

Recommended events:

```text
MissionProjectionBuilt
MissionProjectionUpdated
MissionProjectionMarkedStale
MissionProjectionWithdrawn
MissionProjectionRebuildRequested
MissionProjectionRepairFailed
```

Events must reference Mission and projection versions.

---

## 23. Failure Model

Typed failures include:

```text
MISSION_NOT_FOUND
PROJECTION_SOURCE_INCOMPLETE
AUDIENCE_NOT_AUTHORIZED
CROSS_TENANT_SCOPE
CROSS_LEARNER_SCOPE
UNSUPPORTED_AUDIENCE
PROJECTION_POLICY_NOT_FOUND
SOURCE_VERSION_CONFLICT
PROJECTION_BUILD_FAILED
PROJECTION_TOO_STALE
REDACTION_POLICY_FAILED
```

Failure must not produce a partially trusted projection.

---

## 24. Caching

Projection caches are rebuildable and non-authoritative.

Rules:

- cache keys include tenant, Mission, Mission version, audience type, audience scope, locale, and policy version;
- stale cache must be detectable;
- cache loss must not lose Mission truth;
- cache write failure must not roll back a durable Mission command;
- cached actions must be revalidated at command time.

```text
Cache is not Source of Truth.
```

---

## 25. Concurrency

Projection workers may observe events out of order.

Required controls:

- source watermark comparison;
- monotonic Mission version application;
- idempotent projection writes;
- stale event rejection;
- repair queue for gaps;
- no last-write-wins based only on arrival time.

---

## 26. Minimum Projection Invariants

1. Projection never changes Mission truth.
2. Projection confidence or certainty never exceeds source meaning.
3. Optionality is preserved.
4. Blockers and holds are preserved.
5. Mission completion is never labeled mastery.
6. Stale projections cannot silently appear current.
7. Cross-tenant and cross-learner data never mix.
8. Visible actions remain command proposals, not transitions.
9. Cache is never authoritative.
10. Every projection is traceable to a source watermark and policy version.

---

## 27. Verification Scenarios

Automated tests must cover at least:

- learner projection of active Mission;
- parent projection with approval requirement;
- teacher projection with blocker;
- gameplay machine contract;
- optionality preservation;
- completion-versus-mastery wording;
- stale source watermark;
- out-of-order event rejection;
- cross-tenant denial;
- field-level redaction;
- deterministic rebuild;
- cache loss and rebuild;
- superseded Mission withdrawal;
- action affordance revalidation.

---

## 28. Exit Criteria

28G is complete when:

- audience-specific contracts are explicit;
- projection authority is strictly read-only;
- freshness and limitation semantics are defined;
- machine and human projections are separated;
- permission and redaction rules are explicit;
- deterministic rebuild is possible;
- tests can prove projection fidelity.

---

## 29. Final Principle

```text
Mission truth belongs to the Mission Engine.
Projection makes that truth usable.
Projection never makes that truth stronger.
```
