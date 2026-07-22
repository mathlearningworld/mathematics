# 35I — Session Evolution Runtime

## 1. Purpose

The Session Evolution Runtime defines how Learning Session Runtime changes safely over time without corrupting active sessions, invalidating historical evidence, breaking replay, or silently changing educational meaning.

Evolution includes code, schemas, plans, reducers, event contracts, projection models, policies, channel capabilities, and cross-runtime integrations.

> Runtime evolution is safe only when old authority remains interpretable and active sessions retain a valid completion or recovery path.

---

## 2. Core Distinctions

- Code deployment ≠ runtime migration
- Backward readable ≠ behaviorally compatible
- Schema compatibility ≠ educational compatibility
- Event upcast ≠ historical rewrite
- Plan version change ≠ active session mutation
- Shadow success ≠ production authorization
- Rollback code ≠ rollback state
- New default ≠ permission to change existing sessions
- Projection migration ≠ ledger migration
- Feature flag off ≠ full rollback

---

## 3. Version Dimensions

The runtime must version independent dimensions explicitly:

```ts
interface SessionRuntimeVersionVector {
  runtimeVersion: string;
  commandSchemaVersion: number;
  eventSchemaVersion: number;
  snapshotSchemaVersion: number;
  planSchemaVersion: number;
  adaptationPolicyVersion: string;
  evidencePolicyVersion: string;
  projectionSchemaVersion: number;
  safetyPolicyVersion: string;
  channelContractVersion: string;
}
```

A single application version is not sufficient to explain session behavior.

---

## 4. Compatibility Classes

Every proposed change must be classified.

### Additive Compatible

Adds optional fields, new event types ignored safely by old consumers, or new projection fields.

### Read-Compatible

New runtime can read old data, but old runtime may not read new data.

### Write-Compatible

Both runtime versions may safely produce data consumed by the other under declared constraints.

### Behavior-Compatible

The same authorized command produces educationally equivalent state transitions.

### Breaking

Requires migration, session pinning, dual runtime, or coordinated release.

Compatibility claims must identify the exact dimensions covered.

---

## 5. Session Version Pinning

An active session must be pinned to the runtime behavior required to interpret its plan and history.

Pinning metadata:

```ts
interface SessionRuntimeBinding {
  sessionId: string;
  runtimeVersion: string;
  planVersion: number;
  reducerVersion: string;
  adaptationPolicyVersion: string;
  evidencePolicyVersion: string;
  boundAt: string;
  migrationStatus: 'PINNED' | 'ELIGIBLE' | 'MIGRATING' | 'MIGRATED' | 'BLOCKED';
}
```

A deployment must not silently move an active session to new behavior.

---

## 6. Evolution Strategies

Supported strategies include:

- finish-on-old-version
- migrate-at-checkpoint
- dual-read / single-write
- dual-read / dual-write under strict reconciliation
- event upcasting
- snapshot rebuild
- projection rebuild
- shadow replay
- canary authorization
- tenant cohort rollout
- learner cohort rollout
- immediate stop for critical safety defects

The selected strategy must be recorded in the release evidence package.

---

## 7. Event Schema Evolution

Historical events remain immutable.

Event evolution uses deterministic upcasters:

```ts
interface EventUpcaster {
  eventType: string;
  fromSchemaVersion: number;
  toSchemaVersion: number;
  upcast(payload: unknown): unknown;
}
```

Rules:

- upcasters are pure
- upcaster chains are deterministic
- original event bytes remain retained according to policy
- unknown event versions fail explicitly
- semantic meaning cannot be invented from missing historical data
- lossy conversion must be declared and may block migration

---

## 8. Snapshot Evolution

Snapshots are disposable derived artifacts.

When snapshot format changes, choose one of:

- read old snapshot through adapter
- migrate snapshot with verified converter
- discard snapshot and replay from events

The runtime must prefer full replay over trusting an unverifiable snapshot migration.

---

## 9. Plan Evolution

A session plan is immutable once authorized, except through an explicit migration or re-planning command permitted by policy.

Plan evolution rules:

- new plan generators affect new sessions by default
- active sessions retain their authorized plan version
- migration must preserve objective authority
- changed completion criteria require explicit reauthorization
- removed activity types need a safe substitution or finish-on-old-version path
- accessibility constraints may never be dropped during migration
- evidence requirements must remain satisfiable

---

## 10. Adaptation and Evidence Policy Evolution

Changing adaptation or evidence qualification rules can change educational meaning.

Therefore:

- active policy version is persisted
- decisions record policy version
- historical decisions are not recomputed silently
- re-evaluation creates a new derived decision with lineage
- stricter safety policy may stop or constrain active sessions
- relaxed policy does not retroactively authorize prior prohibited behavior

---

## 11. Projection Evolution

Projection schemas may evolve independently from the ledger.

Projection migration options:

- online additive migration
- side-by-side projection version
- full rebuild from event ledger
- backfill with verification cursor
- consumer cutover after consistency proof

Projection evolution must preserve:

- source event traceability
- freshness status
- authorization filtering
- deterministic rebuild
- rollback to prior consumer contract when supported

---

## 12. Cross-Runtime Contract Evolution

Changes affecting Mission, Intervention, Diagnostic, Assessment, Progress, Gameplay, Curriculum, Recommendation, or Skill Graph runtimes require an explicit handoff.

The handoff must include:

- endpoint or event change
- schema impact
- affected runtime surface
- compatibility class
- rollout ordering
- deduplication impact
- migration requirement
- rollback expectation

No cross-runtime semantic change may be hidden as an internal refactor.

---

## 13. Shadow Replay

Shadow replay evaluates a candidate runtime against historical or mirrored session streams without changing authority.

```text
Authoritative event stream
        ├── Current reducer → authoritative state
        └── Candidate reducer → shadow state
                                  ↓
                            Difference analysis
```

Compare at least:

- lifecycle state
- session version
- active objective set
- activity cursor
- evidence qualification
- adaptation decisions
- pending effects
- completion outcome
- invariant findings

Shadow differences must be classified as expected, acceptable, suspicious, or blocking.

---

## 14. Canary Rollout

A canary rollout must define:

- eligible cohort
- excluded safety-sensitive cohorts
- start and stop criteria
- observation period
- rollback threshold
- projection comparison
- recovery success rate
- duplicate-effect rate
- learner burden indicators
- human review owner

Canary expansion must be an explicit decision, not an automatic assumption from absence of alerts.

---

## 15. Migration State Machine

```text
PROPOSED
  ↓
ASSESSED
  ↓
VERIFIED
  ↓
AUTHORIZED
  ↓
SHADOWING
  ↓
CANARY
  ↓
EXPANDING
  ↓
COMPLETE
```

Exceptional states:

```text
BLOCKED
PAUSED
ROLLBACK_PENDING
ROLLING_BACK
ROLLED_BACK
FAILED
```

Every transition requires durable evidence and actor authority.

---

## 16. Active Session Migration

An active session may migrate only at a declared safe boundary.

Candidate boundaries:

- before session start
- after completed phase
- durable checkpoint
- learner-confirmed pause
- human-supervised handoff

Migration procedure:

1. acquire exclusive migration lease
2. read and replay authoritative state
3. verify checkpoint eligibility
4. transform binding metadata
5. run candidate invariant checks
6. compare current and candidate state
7. persist migration decision
8. release session to selected runtime

Failure at any stage must leave a recoverable authoritative binding.

---

## 17. Rollback Model

Rollback must address both code and persisted state.

Rollback types:

- traffic rollback
- runtime binding rollback
- projection consumer rollback
- projection rebuild rollback
- policy rollback
- plan generator rollback
- channel adapter rollback

A rollback is safe only if the prior runtime can interpret all data written during the new version’s exposure.

If not, the system must use forward recovery or a compatibility bridge rather than pretend rollback is available.

---

## 18. Critical Safety Evolution

For critical safety defects, normal compatibility preservation may be overridden by a stop policy.

Allowed actions:

- block new session authorization
- pause affected active sessions
- disable unsafe activity type
- require human continuation
- migrate to emergency safe plan
- terminate with explicit safety reason

The runtime must preserve evidence explaining why the intervention occurred.

---

## 19. Data Migration Requirements

Each durable migration requires:

- migration identifier
- source and target versions
- eligibility predicate
- deterministic transformation
- dry-run mode
- progress cursor
- restartability
- idempotency
- verification query
- failure quarantine
- rollback or forward-recovery plan

Bulk migrations must not hold global locks that endanger active learner sessions.

---

## 20. Evolution Verification

Required verification includes:

- old events replay on new runtime
- new events are rejected or interpreted safely by supported old runtime
- snapshot migration or discard path works
- active session checkpoint migration
- rollback compatibility
- shadow replay comparison
- canary stop mechanism
- projection rebuild equivalence
- cross-runtime consumer compatibility
- safety policy precedence
- migration restart after interruption
- no duplicate effects during version handoff

---

## 21. Observability During Evolution

Track at least:

- sessions by runtime version
- sessions by migration state
- replay failures by schema version
- shadow divergence rate
- canary failure rate
- recovery success rate
- duplicate command/effect detection
- projection lag by version
- policy-blocked sessions
- rollback eligibility count

Version labels must avoid uncontrolled cardinality.

---

## 22. Governance and Approval

Evolution authority must be separated by risk.

Examples:

- additive projection field: engineering approval
- event schema change: architecture and consumer approval
- evidence policy change: learning/assessment authority approval
- safety policy change: safety and product authority approval
- active session migration: operational authorization
- critical emergency stop: designated incident authority

The approval record must reference verification evidence.

---

## 23. Evolution Failure Codes

- `SESSION_EVOLUTION_INCOMPATIBLE`
- `SESSION_EVENT_UPCAST_FAILED`
- `SESSION_SNAPSHOT_MIGRATION_FAILED`
- `SESSION_PLAN_MIGRATION_UNSAFE`
- `SESSION_POLICY_VERSION_UNSUPPORTED`
- `SESSION_SHADOW_DIVERGENCE_BLOCKING`
- `SESSION_CANARY_THRESHOLD_EXCEEDED`
- `SESSION_ACTIVE_MIGRATION_BLOCKED`
- `SESSION_ROLLBACK_UNAVAILABLE`
- `SESSION_CROSS_RUNTIME_VERSION_CONFLICT`
- `SESSION_SAFETY_STOP_REQUIRED`

---

## 24. Runtime Invariants Established by 35I

1. Historical events are never rewritten to simulate compatibility.
2. Active sessions remain bound to interpretable runtime behavior.
3. Plan and policy changes do not silently mutate existing authority.
4. Every migration has a durable state and evidence trail.
5. Shadow execution cannot mutate authoritative state.
6. Rollback may be claimed only when persisted data remains backward interpretable.
7. Projection evolution cannot alter ledger truth.
8. Cross-runtime changes require explicit compatibility handoff.
9. Safety-critical policy may stop sessions but must preserve explanation.
10. Evolution is complete only after migration, verification, and rollback evidence are recorded.

---

## 25. Completion Criteria

35I is complete when Learning Session Runtime has explicit version vectors, compatibility classes, session pinning, event and snapshot evolution rules, safe migration boundaries, shadow replay, canary rollout, rollback analysis, cross-runtime handoff requirements, and governance appropriate to educational and safety risk.