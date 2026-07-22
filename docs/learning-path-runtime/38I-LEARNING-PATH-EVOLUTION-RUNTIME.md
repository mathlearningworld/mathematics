# Chapter 38I — Learning Path Evolution Runtime

## 1. Purpose

The Learning Path Evolution Runtime defines how learning-path contracts, policies, storage schemas, event schemas, curriculum references, skill-graph references, projections, and operational behavior may change without destroying historical meaning or current learner continuity.

Core rule:

> Evolution may change future interpretation and execution, but it must not silently rewrite historical authority.

## 2. Evolution Surfaces

Learning Path Runtime evolves across multiple independent surfaces:

- API contracts,
- aggregate schema,
- event schema,
- planning policy,
- orchestration policy,
- adaptation policy,
- curriculum version,
- skill graph version,
- content catalog version,
- accessibility capability model,
- persistence schema,
- snapshot schema,
- projection schema,
- verification fixtures,
- operational workflows.

Each surface MUST be versioned explicitly where its change can alter meaning or behavior.

## 3. Master Version Vector

A path decision SHOULD persist a version vector containing, where applicable:

- `learningPathContractVersion`
- `aggregateSchemaVersion`
- `eventSchemaVersion`
- `planningPolicyVersion`
- `orchestrationPolicyVersion`
- `adaptationPolicyVersion`
- `curriculumVersion`
- `skillGraphVersion`
- `contentCatalogVersion`
- `accessibilityModelVersion`
- `projectionSchemaVersion`

The vector explains the semantic environment under which the path was created or changed.

## 4. Compatibility Classes

Every change MUST be classified before rollout.

### 4.1 Backward-Compatible Read Change

New readers can consume historical data without mutation.

Examples:

- optional projection field,
- additive event field with default,
- new non-authoritative metadata.

### 4.2 Forward-Compatible Write Change

Older readers can safely ignore data emitted by newer writers.

This is permitted only when ignored fields cannot change authority semantics.

### 4.3 Behavior-Compatible Change

Implementation changes while externally observable authority remains equivalent.

### 4.4 Behavior-Changing Evolution

Planning, adaptation, sequencing, gating, or authorization behavior changes.

This requires explicit policy versioning and controlled rollout.

### 4.5 Breaking Change

Old readers or writers cannot safely operate.

This requires migration, compatibility bridges, coordinated deployment, or temporary write restrictions.

## 5. Version Pinning

Every active path version MUST retain the policy and reference versions required to explain and continue its execution.

Current code MUST NOT substitute current policy for historical policy during replay.

A runtime may execute an old path under a compatibility adapter, but the adapter behavior must be explicit and testable.

## 6. Event Upcasting

Historical events remain immutable.

When event structure changes, readers MAY use deterministic upcasters:

```text
v1 event → v2 representation → v3 representation
```

Upcasters MUST:

- be pure,
- be deterministic,
- preserve original event identity,
- preserve original timestamps,
- preserve authority meaning,
- avoid external calls,
- be covered by golden fixtures,
- fail explicitly when conversion is unsafe.

Upcasting changes the in-memory representation, not the stored historical event.

## 7. Snapshot Evolution

Snapshots are replaceable acceleration artifacts.

When snapshot schema changes:

- read and transform compatible snapshots, or
- discard incompatible snapshots and replay events,
- record the new snapshot schema version,
- verify source event hash boundaries.

Snapshot compatibility must never block recovery when event history is valid.

## 8. Aggregate Schema Evolution

Aggregate persistence changes SHOULD follow expand-and-contract:

1. add new nullable/defaulted fields,
2. deploy readers supporting old and new forms,
3. deploy writers for the new form,
4. backfill where necessary,
5. verify mixed-version operation,
6. remove legacy fields only after the compatibility window.

## 9. Planning Policy Evolution

A new planning policy may change:

- prerequisite expansion,
- remediation depth,
- retention cadence,
- acceleration thresholds,
- time-budget strategy,
- tie breaking,
- candidate scoring,
- accessibility substitution.

Historical paths MUST retain their original planning policy reference.

A new policy does not automatically replan every active learner. Reconsideration requires an explicit campaign or trigger policy.

## 10. Adaptation Policy Evolution

Adaptation changes are high risk because they can alter active paths.

Rollout SHOULD include:

- shadow evaluation,
- divergence analysis,
- anti-thrashing checks,
- canary tenants or cohorts,
- human-review sampling,
- rollback readiness,
- path-version lineage verification.

## 11. Curriculum Evolution

Curriculum changes may add, remove, rename, split, merge, or reorder learning requirements.

Evolution MUST preserve stable concept identity where possible.

Recommended mappings:

- `UNCHANGED`
- `RENAMED`
- `SPLIT`
- `MERGED`
- `DEPRECATED`
- `REPLACED`
- `NO_EQUIVALENT`

An active path must not silently reinterpret an old curriculum objective as a new one without an explicit mapping.

## 12. Skill Graph Evolution

Skill graph changes may affect reachability and prerequisites.

The runtime MUST detect:

- newly introduced prerequisites,
- removed dependencies,
- cycles,
- changed edge meaning,
- deprecated skill nodes,
- split/merged skills.

Historical replay uses the pinned graph version. Future replanning may use a newer graph only through a new decision lineage.

## 13. Content Catalog Evolution

Content may become:

- updated,
- unavailable,
- unsafe,
- inaccessible,
- replaced,
- regionally restricted.

Content evolution must not mutate completed-node history.

For future nodes, the runtime may block or substitute content according to policy while preserving objective meaning.

## 14. Accessibility Model Evolution

Accessibility support may improve over time.

Changes MUST ensure:

- equivalent objectives remain equivalent,
- accommodations do not reduce mastery interpretation,
- old paths remain readable,
- inaccessible future nodes can be safely substituted,
- learner preference versions are traceable.

## 15. Projection Evolution

Projection schemas may change independently from aggregate authority.

Projection rollout MAY use:

- dual write,
- dual read,
- backfill,
- full rebuild,
- shadow comparison,
- versioned endpoints.

A projection schema migration must not require rewriting authoritative events.

## 16. Contract Evolution

API evolution SHOULD prefer additive changes.

Breaking contract changes require:

- new versioned endpoint or media type,
- deprecation window,
- consumer inventory,
- compatibility tests,
- explicit removal date,
- operational monitoring.

## 17. Shadow Execution

Shadow execution runs a candidate planner, adapter, projection, or policy without changing production authority.

It MUST:

- use copied/frozen inputs,
- emit no authoritative events,
- create no learner-visible next action,
- publish no operational side effects,
- record candidate outputs and version metadata,
- support divergence comparison.

## 18. Divergence Analysis

Divergence reports SHOULD compare:

- selected goals,
- prerequisite closure,
- node order,
- remediation count,
- retention count,
- acceleration decisions,
- time estimate,
- accessibility substitutions,
- blocker classification,
- explanation reasons.

Differences must be classified as expected, acceptable, risky, or defective.

## 19. Canary Rollout

Behavior-changing evolution SHOULD proceed through controlled cohorts.

Canary controls may include:

- tenant allowlist,
- learner cohort,
- curriculum segment,
- grade band,
- feature flag,
- percentage rollout,
- operator approval.

Canary metrics MUST compare safety and operational outcomes against baseline.

## 20. Activation Controls

New policies MUST NOT activate solely because code was deployed.

Activation requires explicit configuration or policy-registry state.

Recommended lifecycle:

```text
DRAFT → VERIFIED → SHADOW → CANARY → ACTIVE → RETIRED
```

## 21. Migration Model

A migration MUST define:

- source version,
- target version,
- scope,
- preconditions,
- deterministic transformation,
- checkpoint strategy,
- idempotency key,
- verification queries,
- failure handling,
- rollback or forward-fix plan.

## 22. Resumable Migration

Large migrations MUST be resumable.

A migration checkpoint SHOULD include:

- migration ID,
- tenant scope,
- last processed key,
- source version,
- target version,
- processed count,
- failure count,
- started-at,
- updated-at,
- status.

Rerunning from a checkpoint must not duplicate authority or corrupt ordering.

## 23. Re-evaluation Campaigns

When a new policy or curriculum requires reconsideration, the runtime MAY run a re-evaluation campaign.

A campaign MUST:

- select learners by explicit criteria,
- freeze inputs per evaluation,
- create candidate results,
- avoid mutating history,
- require policy-defined activation,
- preserve old and new lineage,
- support pause and resume,
- report divergence and risk.

## 24. Historical Preservation

Historical path versions must remain explainable after evolution.

The platform SHOULD retain:

- versioned policy definitions or interpretable artifacts,
- curriculum/graph mappings,
- event schemas and upcasters,
- content identity metadata,
- explanation codes,
- human approval records.

## 25. Rollback Semantics

Code rollback and state rollback are different.

### Code Rollback

Return runtime code to an earlier deployable version.

### Configuration Rollback

Deactivate a policy or feature flag.

### State Restoration

Create a new authoritative transition restoring an earlier valid operational state where permitted.

Historical events MUST NOT be deleted to simulate rollback.

## 26. Forward Fix

When new writers have emitted data that old code cannot safely interpret, forward-fix may be safer than code rollback.

The incident plan MUST identify this possibility before activating breaking writers.

## 27. Mixed-Version Operation

Rolling deployment requires explicit support for periods when old and new instances coexist.

Tests MUST cover:

- old reader/new event,
- new reader/old event,
- old writer/new database schema,
- new writer/old projection consumer,
- policy registry consistency,
- command retry across version boundaries.

Unsupported combinations must fail closed.

## 28. Feature Flags

Feature flags may control rollout but are not durable semantic authority by themselves.

Every behavior-changing decision SHOULD persist the effective policy/version, not merely the flag name.

Flags must have:

- owner,
- purpose,
- default state,
- expiry or review date,
- rollback behavior,
- observability.

## 29. Emergency Safety Evolution

Urgent changes may be required to disable unsafe content, policy, or path behavior.

Emergency controls SHOULD support:

- immediate future-node blocking,
- activation pause,
- forced human review,
- safe content substitution,
- tenant/cohort scope,
- audit record,
- post-incident review.

Emergency action must preserve committed history.

## 30. Data Compatibility Registry

A compatibility registry SHOULD describe:

- readable event versions,
- writable event version,
- snapshot versions,
- supported contract versions,
- policy versions available for replay,
- curriculum/graph mappings,
- minimum compatible service version.

## 31. Evolution Verification

Each evolution package MUST verify:

- old historical replay,
- new historical replay,
- mixed-version operation,
- migration idempotency,
- shadow divergence,
- canary metrics,
- rollback/forward-fix procedure,
- projection rebuild,
- tenant isolation,
- explainability preservation.

## 32. Observability

Evolution metrics SHOULD include:

- version distribution,
- shadow divergence rate,
- canary error rate,
- migration progress,
- migration retry count,
- incompatible-read failures,
- upcaster usage,
- projection rebuild lag,
- rollback activations,
- re-evaluation campaign outcomes.

## 33. Governance

Behavior-changing policies SHOULD require:

- named owner,
- rationale,
- educational review,
- technical review,
- safety review where relevant,
- versioned approval record,
- activation criteria,
- retirement plan.

## 34. Non-Goals

Evolution Runtime does not:

- rewrite historical events,
- prove educational superiority of a new policy,
- automatically migrate every active path,
- use deployment time as semantic version authority,
- treat feature flags as sufficient lineage,
- guarantee rollback is always safer than forward fix.

## 35. Final Doctrine

```text
Deployment is not migration.
Read compatibility is not behavior compatibility.
Re-evaluation creates new lineage.
Historical authority remains immutable.
Code rollback is not state rollback.
```
