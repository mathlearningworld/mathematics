# 37I — Mastery Evolution Runtime

## Purpose

Mastery Evolution Runtime defines how mastery architecture, policies, schemas, algorithms, and integrations may change without silently rewriting educational truth or destabilizing active learners.

The runtime must support long-lived mastery records across product releases, curriculum changes, skill graph changes, policy revisions, and improved evaluation models.

> Deployment changes code. Migration changes interpretation. They are not the same operation.

---

## Evolution Responsibilities

This runtime owns the rules for:

- runtime versioning;
- contract compatibility;
- event schema evolution;
- snapshot evolution;
- evaluation algorithm evolution;
- decision policy evolution;
- curriculum and skill graph compatibility;
- active mastery version pinning;
- projection migration;
- shadow evaluation;
- canary rollout;
- migration orchestration;
- rollback and recovery;
- audit of historical interpretation.

It does not own arbitrary reclassification of learners.

---

## Version Vector

Every authoritative evaluation and decision must carry an explicit version vector:

```text
MasteryVersionVector
├── runtimeVersion
├── aggregateSchemaVersion
├── eventSchemaVersion
├── evaluationAlgorithmVersion
├── decisionPolicyVersion
├── evidenceContractVersion
├── curriculumVersion
├── skillGraphVersion
├── projectionContractVersion
└── accessibilityPolicyVersion
```

A single application version is insufficient because these dimensions may evolve independently.

---

## Compatibility Classes

Every proposed change must be classified as one of:

### Backward Compatible

Old authoritative data can be read and interpreted without migration.

### Forward Tolerant

Older runtimes can safely ignore new optional data without changing authority.

### Read Compatible, Behavior Changed

Historical data is readable, but new evaluations or decisions may differ.

### Migration Required

Existing authoritative state must be transformed before the new runtime can operate safely.

### Re-evaluation Required

Stored state remains historically valid, but current educational policy requires a new evaluation from preserved evidence.

### Breaking and Unsupported

The change cannot be safely introduced without an explicit cutover plan.

Backward readable does not imply behavior compatible.

---

## Active Mastery Version Pinning

An in-flight evaluation or decision must remain pinned to its accepted version vector.

The runtime must not switch algorithm or policy versions halfway through:

```text
Evidence Bundle Freeze
→ Evaluation Start
→ Evaluation Result
→ Decision Command
→ Decision Commit
```

A version change during this chain requires one of:

- finish under the pinned vector;
- cancel explicitly;
- mark stale and restart;
- route to governed review.

Silent mixed-version decisions are forbidden.

---

## Event Schema Evolution

Historical events are immutable.

New runtimes read older events through a deterministic upcaster chain:

```text
v1 Event
→ v1-to-v2 Upcaster
→ v2-to-v3 Upcaster
→ Current In-Memory Event
```

Upcasters must be:

- pure;
- deterministic;
- side-effect free;
- version-specific;
- covered by golden fixtures;
- chained without gaps.

An upcaster may normalize representation but must not invent educational facts absent from the historical event.

---

## Snapshot Evolution

Snapshots may be:

- read directly when compatible;
- upcast when deterministic and safe;
- discarded and rebuilt from events;
- quarantined when integrity cannot be proven.

Snapshot migration must never become the only surviving interpretation path.

Event replay remains the fallback authority.

---

## Evaluation Algorithm Evolution

A new evaluation algorithm may improve:

- evidence normalization;
- dependence detection;
- coverage calculation;
- confidence estimation;
- contradiction handling;
- durability assessment;
- transfer interpretation.

Before activation, it must run in shadow mode against representative frozen evidence bundles.

Comparison dimensions include:

- candidate mastery level;
- confidence band;
- coverage gaps;
- review trigger;
- contradiction severity;
- fairness indicators;
- explanation differences.

A different result is not automatically wrong, but it must be explainable and reviewed.

---

## Decision Policy Evolution

Decision policy changes may alter:

- confirmation thresholds;
- review requirements;
- retention windows;
- revocation criteria;
- prerequisite constraints;
- human override rules;
- appeal routes.

Policy updates apply prospectively unless an explicit migration or re-evaluation campaign is approved.

Historical decisions must retain their original policy version.

The system must be able to answer:

> Why was this learner considered mastered at that time under that policy?

---

## Curriculum Evolution

Curriculum changes may:

- rename skills;
- split a skill;
- merge skills;
- move grade expectations;
- change required mastery level;
- change prerequisite relationships.

The Mastery Runtime does not silently reinterpret old skill identity.

Mappings must be explicit:

```text
Old Skill Identity
→ Mapping Rule
→ New Skill Identity or Identities
→ Carry-Forward Policy
→ Re-evaluation Requirement
```

A split skill usually cannot inherit full mastery into every child skill without supporting evidence coverage.

---

## Skill Graph Evolution

Changes to prerequisite topology may trigger:

- readiness recalculation;
- adaptation proposals;
- reevaluation requests;
- teacher review;
- projection changes.

They do not automatically revoke mastery.

Graph evolution must preserve both:

- historical graph context for old decisions;
- current graph context for new planning.

---

## Evidence Contract Evolution

Evidence sources may add fields, dimensions, trust metadata, or accommodation context.

Compatibility rules must define:

- required versus optional fields;
- default-free handling of missing historical data;
- unsupported source versions;
- bundle hash stability;
- withdrawal and correction compatibility.

Missing historical data must remain unknown, not be fabricated as a default success or failure.

---

## Projection Evolution

Projection contracts may evolve independently from authority.

Safe strategies include:

- dual-write projections;
- rebuildable new read models;
- versioned API responses;
- consumer opt-in;
- compatibility adapters;
- deprecation windows.

Projection migration may be repeated because projections are derived.

Authority migration requires stricter governance.

---

## Shadow Execution

Shadow mode runs a candidate runtime without publishing candidate authority.

It must:

- use frozen authoritative inputs;
- record candidate result hashes;
- compare against current production results;
- suppress external side effects;
- preserve learner privacy;
- support cohort analysis;
- expose unexplained divergence.

Shadow results are evidence for rollout decisions, not mastery decisions themselves.

---

## Equivalence and Divergence

Evolution verification classifies outcomes as:

- exactly equivalent;
- semantically equivalent;
- expected policy divergence;
- unexplained divergence;
- safety regression;
- fairness regression;
- replay incompatibility.

Only approved equivalence and expected divergence classes may proceed.

---

## Canary Rollout

A candidate runtime should progress through controlled cohorts:

```text
Internal Fixtures
→ Shadow Historical Replay
→ Staff/Test Tenants
→ Small Learner Cohort
→ Expanded Cohort
→ General Availability
```

Canary segmentation must avoid unfair treatment and must be governed where decisions affect learner opportunity.

Rollback triggers include:

- unexpected mastery-rate shifts;
- contradiction suppression;
- confidence inflation;
- increased cross-tenant errors;
- replay hash mismatch;
- appeal spikes;
- fairness regression;
- operational instability.

---

## Migration State Machine

```text
DRAFT
→ REVIEWED
→ SHADOW_VALIDATED
→ CANARY_READY
→ CANARY_RUNNING
→ EXPANSION_APPROVED
→ MIGRATING
→ VERIFIED
→ COMPLETE
```

Failure states:

```text
BLOCKED
PAUSED
ROLLBACK_REQUIRED
QUARANTINED
FAILED
```

Every transition requires an attributable actor, evidence package, and timestamp.

---

## Migration Unit

Migration must be resumable using a stable unit such as:

```text
(tenantId, learnerId, skillId, aggregateVersion)
```

Each migration receipt stores:

- source version vector;
- target version vector;
- source hash;
- target hash;
- migration rule version;
- status;
- attempt count;
- failure reason;
- completed at.

Retries must be idempotent.

---

## Re-evaluation Campaigns

Some changes require reevaluation rather than state transformation.

A reevaluation campaign must define:

- affected skills;
- affected policy or algorithm versions;
- learner cohort;
- evidence sufficiency rules;
- whether new evidence is required;
- review requirements;
- communication policy;
- downstream impact;
- rollback or pause conditions.

Reevaluation produces new decisions with lineage. It does not rewrite old decisions.

---

## Rollback Model

Rollback has multiple meanings:

### Code Rollback

Restore a prior deployable runtime.

### Policy Rollback

Reactivate a prior policy for future decisions.

### Projection Rollback

Restore or rebuild a prior read-model contract.

### Migration Rollback

Reverse a reversible state transformation using recorded receipts.

### Authority Correction

Issue explicit corrective decisions or superseding events.

Code rollback does not automatically undo decisions already committed under the new version.

State rollback must never be assumed safe without lineage analysis.

---

## Mixed-Version Operation

During rollout, the system may contain:

- old event schemas;
- new event schemas;
- old snapshots;
- new snapshots;
- pinned in-flight evaluations;
- new evaluations;
- old projections;
- new projections.

Mixed-version support must be explicit and time-bounded.

Every consumer must declare the version ranges it supports.

---

## Emergency Safety Evolution

A critical safety issue may require urgent policy change.

Emergency evolution still requires:

- explicit authority;
- recorded rationale;
- bounded affected scope;
- audit trail;
- compatibility analysis;
- post-event review;
- learner communication where appropriate.

Urgency may shorten rollout stages, but it does not permit silent historical rewriting.

---

## Deprecation

A version may be deprecated only when:

- no active process is pinned to it;
- historical events remain readable;
- snapshots can be rebuilt;
- consumers have migrated;
- operational rollback requirements are satisfied;
- retention and audit obligations are preserved.

Deletion of an old runtime implementation is not allowed while it remains the only valid interpreter for retained authority.

---

## Evolution Evidence Package

Every rollout requires:

```text
EvolutionEvidence
├── changeClassification
├── sourceVersionVector
├── targetVersionVector
├── compatibilityMatrix
├── shadowResults
├── divergenceAnalysis
├── fairnessAnalysis
├── replayResults
├── canaryMetrics
├── migrationReceipts
├── rollbackPlan
├── knownLimitations
└── approvalDecision
```

---

## Acceptance Criteria

37I is complete when:

- all authoritative records carry explicit version context;
- in-flight work is version-pinned;
- old events remain readable through deterministic upcasters;
- snapshots can be discarded and rebuilt;
- algorithm and policy changes support shadow comparison;
- curriculum and graph changes use explicit mappings;
- migrations are resumable and idempotent;
- reevaluation creates new lineage rather than rewriting history;
- canary and rollback strategies are defined;
- mixed-version support is explicit;
- historical explanations remain possible.

---

## Permanent Rules

1. Deployment is not migration.
2. Read compatibility is not behavior compatibility.
3. Historical decisions retain historical policy context.
4. Active evaluations and decisions are version-pinned.
5. Upcasters normalize representation; they do not invent facts.
6. Snapshot evolution cannot replace event replay authority.
7. Re-evaluation creates new decisions, never rewritten history.
8. Code rollback is not state rollback.
9. Active learner continuity takes precedence over rollout speed.
10. Every evolution must remain explainable and auditable.