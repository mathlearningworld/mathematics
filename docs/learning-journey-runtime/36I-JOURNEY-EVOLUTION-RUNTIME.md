# 36I — Journey Evolution Runtime

## Status

- Chapter: 36 — Learning Journey Runtime
- Slice: 36I
- Authority: Architecture Source of Truth
- Scope: Versioning, compatibility, migration, rollout, rollback, and active-journey continuity

---

## 1. Purpose

Journey Evolution Runtime defines how Learning Journey Runtime changes over time without corrupting history, invalidating active journeys, or silently changing educational intent.

A journey can remain active across multiple deployments. Therefore runtime evolution must preserve:

- historical readability,
- active-plan meaning,
- session-intent compatibility,
- evidence lineage,
- projection rebuildability,
- and rollback safety.

Deployment alone is not migration, and code rollback alone is not state rollback.

---

## 2. Evolution Doctrine

```text
Deployment ≠ Migration
Backward readable ≠ Behavior compatible
Code rollback ≠ State rollback
Schema compatibility ≠ Policy compatibility
Active journey continuity > rollout speed
```

Every evolution must state what changes, which authority owns the change, and how active journeys are protected.

---

## 3. Version Vector

A journey runtime instance should expose a version vector rather than one ambiguous version number.

```ts
interface JourneyRuntimeVersionVector {
  aggregateSchemaVersion: number;
  eventSchemaVersionSet: string;
  commandContractVersion: string;
  plannerVersion: string;
  orchestratorVersion: string;
  adaptationPolicyVersion: string;
  evidencePolicyVersion: string;
  projectionVersion: string;
  persistenceVersion: string;
  safetyPolicyVersion: string;
}
```

The version vector allows compatibility to be evaluated by concern.

---

## 4. Compatibility Classes

### 4.1 Fully Compatible

New runtime can read and continue all active journeys without state or behavior migration.

### 4.2 Read Compatible

New runtime can read old history but cannot safely continue execution without migration or version pinning.

### 4.3 Write Compatible

New and old runtimes can write through the same contracts during staged rollout.

### 4.4 Projection Compatible

Existing event history can rebuild the new projection model.

### 4.5 Behavior Compatible

For protected scenarios, orchestration and adaptation decisions remain within accepted equivalence bounds.

### 4.6 Incompatible

The rollout must be blocked, isolated, or preceded by explicit migration.

---

## 5. Active-Journey Pinning

Every active journey should retain the versions required to interpret its accepted plan and historical decisions.

```ts
interface JourneyExecutionVersionBinding {
  journeyId: string;
  planId: string;
  plannerVersion: string;
  orchestratorVersion: string;
  adaptationPolicyVersion: string;
  safetyPolicyVersion: string;
  boundAt: string;
  migrationId?: string;
}
```

Pinning prevents a deployment from silently changing the meaning of an already accepted journey plan.

---

## 6. Event Evolution

Historical events are immutable. Evolution occurs through readers, not mutation of committed records.

Supported strategies:

- event upcasting,
- tolerant readers,
- canonical normalization,
- explicit replacement events,
- and bounded backfill for derived data.

An upcaster must be:

- deterministic,
- version-specific,
- side-effect free,
- testable against historical fixtures,
- and traceable.

---

## 7. Event Upcaster Chain

```ts
interface JourneyEventUpcaster {
  eventType: string;
  fromVersion: number;
  toVersion: number;
  upcast(input: unknown): unknown;
}
```

Rules:

1. No gaps in supported historical chains.
2. No upcaster may query mutable external state.
3. No upcaster may alter event identity, sequence, correlation, or occurrence time.
4. Semantic loss must block automatic migration.
5. Upcaster output must be stable across repeated execution.

---

## 8. Snapshot Evolution

Snapshots are disposable acceleration artifacts.

When snapshot schema changes, the runtime may:

- read through a snapshot upgrader,
- invalidate and rebuild from events,
- or maintain multiple snapshot readers during transition.

Historical events must not be rewritten merely to preserve old snapshots.

```text
Unreadable snapshot → discard and replay
Unreadable event → compatibility incident
```

---

## 9. Aggregate Schema Migration

Aggregate storage migration must distinguish:

- additive fields,
- defaultable fields,
- derived fields,
- renamed fields,
- split/merged structures,
- and semantic changes.

Migration must be:

- tenant-safe,
- resumable,
- idempotent,
- observable,
- version-recorded,
- and reversible where feasible.

Large migrations should use expand-and-contract rather than a single destructive deployment.

---

## 10. Contract Evolution

Commands and results must follow explicit compatibility rules.

Safe changes usually include:

- additive optional fields,
- additive failure metadata,
- new event types ignored by tolerant consumers,
- and new projection fields.

High-risk changes include:

- changing field meaning,
- changing required identity,
- changing idempotency semantics,
- removing lifecycle states,
- reusing event type names for new meaning,
- or changing a previously advisory input into mandatory authority.

---

## 11. Plan Evolution

Accepted plans are versioned artifacts and must not be edited in place.

A new planning model may create a successor plan with lineage:

```ts
interface JourneyPlanLineage {
  planId: string;
  predecessorPlanId?: string;
  replacementReason?: string;
  plannerVersion: string;
  acceptedAt?: string;
  supersededAt?: string;
}
```

Migration options:

- continue existing plan under pinned runtime,
- migrate at a safe phase boundary,
- propose explicit replan,
- or pause and request human review.

---

## 12. Active Session Protection

No journey migration may silently alter the contract of an active session.

During migration:

- active session intent remains bound to its original versioned contract,
- returned outcomes are interpreted with that contract,
- non-critical plan migration waits for session completion,
- emergency safety changes may pause or terminate through explicit policy authority.

---

## 13. Policy Evolution

Policy versions include:

- adaptation policy,
- workload policy,
- evidence trust policy,
- completion policy,
- privacy policy,
- and safety policy.

A policy update must declare whether it applies to:

- new journeys only,
- future phases of active journeys,
- all active journeys immediately,
- or historical interpretation only.

Immediate retroactive application requires explicit authority and impact analysis.

---

## 14. Projection Evolution

Projection schemas may evolve independently of aggregate state.

Supported process:

1. deploy new projection consumer in shadow mode,
2. replay historical events into new read model,
3. compare canonical fields,
4. validate role-based redaction,
5. monitor lag and errors,
6. switch readers,
7. retain rollback path,
8. retire old projection after confidence window.

Projection migration must not modify journey write authority.

---

## 15. Shadow Execution

Candidate runtime versions should process copied production event streams without committing authority.

Shadow comparison may evaluate:

- reconstructed aggregate state,
- next-session decisions,
- adaptation eligibility,
- milestone status,
- evidence coverage,
- projection output,
- and safety decisions.

Shadow output must be isolated from external effects.

---

## 16. Equivalence Model

Not every valid evolution produces byte-identical output. Comparison must classify fields:

- exact identity fields,
- exact authority fields,
- order-insensitive collections,
- tolerance-bounded estimates,
- explainable policy differences,
- and prohibited differences.

Examples of prohibited differences:

- different learner binding,
- different mission objective,
- duplicate active session,
- lost evidence reference,
- skipped mandatory prerequisite,
- or weaker safety constraint without authorization.

---

## 17. Canary Rollout

Canary selection may use:

- new journeys only,
- selected tenants,
- internal test learners,
- low-risk objective types,
- or explicit feature flags.

Canary rollout must define:

- entry criteria,
- metrics,
- comparison baseline,
- stop conditions,
- rollback procedure,
- and maximum exposure.

Active journeys must never move between runtime versions merely because load balancing changed.

---

## 18. Migration State Machine

```text
PROPOSED
  → VALIDATED
  → SHADOW_RUNNING
  → APPROVED
  → SCHEDULED
  → MIGRATING
  → VERIFIED
  → COMPLETED
```

Failure branches:

```text
VALIDATION_FAILED
SHADOW_DIVERGED
PAUSED
ROLLING_BACK
ROLLED_BACK
MANUAL_REVIEW_REQUIRED
```

Every migration has stable identity, scope, version source/target, and evidence references.

---

## 19. Journey Migration Command

```ts
interface MigrateJourneyCommand {
  migrationId: string;
  tenantId: string;
  journeyId: string;
  expectedJourneyVersion: number;
  fromVersionBinding: JourneyExecutionVersionBinding;
  toVersionBinding: JourneyExecutionVersionBinding;
  migrationStrategy: string;
  requestedBy: ActorReference;
  requestedAt: string;
  correlationId: string;
}
```

The command must be idempotent and rejected when journey state has changed beyond the validated migration boundary.

---

## 20. Safe Migration Boundaries

Preferred boundaries:

- before journey activation,
- between phases,
- after milestone resolution,
- after active session terminal state,
- during explicit pause,
- or before archived read-only access.

Unsafe default boundaries:

- mid-command,
- while session dispatch is ambiguous,
- while evidence intake is partially committed,
- during unresolved blocker reconciliation,
- or when projection and aggregate integrity differ.

---

## 21. Rollback Model

Rollback dimensions:

### 21.1 Code Rollback

Restore previous executable runtime.

### 21.2 Contract Rollback

Restore prior public contract compatibility where consumers depend on it.

### 21.3 Traffic Rollback

Route new commands back to prior runtime.

### 21.4 Journey Binding Rollback

Return eligible journeys to prior version binding.

### 21.5 Projection Rollback

Switch readers to prior projection.

### 21.6 State Compensation

Append explicit compensating events when irreversible new-version decisions already committed.

Committed event history is never deleted as a rollback mechanism.

---

## 22. Rollback Eligibility

Automatic rollback is allowed only when:

- prior runtime can read all committed event versions,
- no irreversible external effect violates prior assumptions,
- no active session contract becomes unreadable,
- no safety policy would be weakened,
- and state equivalence is verified.

Otherwise the journey must pause for explicit recovery or compensation.

---

## 23. Cross-Runtime Evolution

Journey evolution must coordinate contracts with:

- Mission Runtime,
- Recommendation Runtime,
- Session Runtime,
- Assessment/Progress Runtime,
- Diagnostic Runtime,
- Intervention Runtime,
- Curriculum Runtime,
- and notification/identity services.

Every handoff must declare:

- producer version,
- consumer compatibility range,
- deprecation window,
- fallback behavior,
- and unsupported-version failure code.

---

## 24. Deprecation Policy

A contract or event version may be deprecated only after:

- usage is measured,
- dependent consumers are identified,
- migration path exists,
- active journeys using it are counted,
- rollback window is defined,
- and removal criteria are met.

Deprecation notice is not removal authority.

---

## 25. Emergency Safety Evolution

Critical safety changes may require accelerated application.

The emergency path must still preserve:

- explicit policy authority,
- affected-journey identification,
- pause/stop semantics,
- audit evidence,
- communication path,
- and post-incident reconciliation.

Emergency evolution may override optimization continuity but not tenant isolation, historical integrity, or learner identity.

---

## 26. Observability

Evolution signals should include:

- journeys by version binding,
- oldest active version,
- migration backlog,
- migration failure rate,
- shadow divergence rate,
- rollback count,
- incompatible event count,
- old contract usage,
- projection comparison mismatch,
- and active-session migration deferrals.

Metrics must be segmented by tenant and version without exposing sensitive learner content.

---

## 27. Verification Requirements

Before rollout:

- repository compatibility review,
- historical event fixture replay,
- snapshot fallback verification,
- contract consumer matrix review,
- shadow execution,
- safety policy comparison,
- rollback rehearsal,
- and active-session protection tests.

During rollout:

- canary monitoring,
- divergence monitoring,
- migration checkpoints,
- effect duplication monitoring,
- and manual stop capability.

After rollout:

- replay integrity confirmation,
- old-version population review,
- projection consistency,
- and evidence package retention.

---

## 28. Failure Codes

```text
JOURNEY_EVOLUTION_INCOMPATIBLE
JOURNEY_EVENT_UPCAST_UNAVAILABLE
JOURNEY_EVENT_UPCAST_DIVERGED
JOURNEY_SNAPSHOT_VERSION_UNREADABLE
JOURNEY_PLAN_MIGRATION_UNSAFE
JOURNEY_ACTIVE_SESSION_PROTECTED
JOURNEY_MIGRATION_VERSION_CONFLICT
JOURNEY_SHADOW_DIVERGENCE
JOURNEY_ROLLBACK_UNSAFE
JOURNEY_CONTRACT_VERSION_UNSUPPORTED
JOURNEY_POLICY_MIGRATION_REQUIRES_APPROVAL
JOURNEY_EVOLUTION_MANUAL_REVIEW_REQUIRED
```

---

## 29. Non-Negotiable Rules

1. No deployment may silently migrate active journey meaning.
2. No historical event may be rewritten to simplify evolution.
3. No active session contract may change mid-session without explicit safety authority.
4. No migration may erase plan lineage.
5. No rollback may delete committed history.
6. No candidate runtime may deliver effects during shadow execution.
7. No incompatible consumer may receive an unsupported contract silently.
8. No destructive schema change may precede verified reader migration.
9. No safety policy downgrade may be hidden as compatibility work.
10. No migration completion may be declared without evidence and version reconciliation.

---

## 30. Completion Statement

36I is complete when Learning Journey Runtime can evolve through versioned contracts, deterministic event interpretation, safe migration, shadow comparison, canary rollout, and evidence-backed rollback while preserving active-journey continuity and historical authority.