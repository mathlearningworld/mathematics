# Chapter 39I — Learning Activity Evolution Runtime

## 1. Purpose

The Learning Activity Evolution Runtime defines how Learning Activity behavior, schemas, definitions, policies, events, projections, and operational procedures may change without corrupting historical meaning or destabilizing active learning work.

Its governing rule is:

> Evolution may change future behavior, but it must preserve the meaning of accepted history.

## 2. Evolution Boundary

This runtime governs change to:

- activity aggregate schemas
- event schemas
- activity definitions
- authorization policies
- retry and adaptation policies
- evidence linkage contracts
- projection schemas
- persistence formats
- cross-runtime contracts
- operational rollout procedures

It does not reinterpret mastery or curriculum semantics by itself.

## 3. Version Vector

Every LearningActivity instance should retain an explicit version vector where relevant:

```text
aggregateSchemaVersion
eventSchemaVersion
activityDefinitionVersion
authorizationPolicyVersion
retryPolicyVersion
adaptationPolicyVersion
evidenceContractVersion
projectionSchemaVersion
persistenceSchemaVersion
```

Version fields must be durable and observable.

## 4. Compatibility Classes

Every evolution change must be classified as one of:

- backward compatible
- forward compatible
- mixed-version compatible
- migration required
- replay breaking
- operationally breaking
- behaviorally breaking

The classification determines required verification and rollout controls.

## 5. Historical Meaning Preservation

A completed or terminal LearningActivity must retain the meaning of:

- the definition used
- authorization conditions
- attempt policy
- adaptation lineage
- completion criteria
- evidence contract

New code must not silently reinterpret old history using current policy.

## 6. Activity Definition Evolution

Activity definitions are immutable by version.

A changed definition creates a new version rather than replacing the old version in place.

Active activities may:

- continue on the original definition
- migrate at an explicit safe boundary
- be superseded by a newly authorized activity

Completed activities never migrate in place.

## 7. Aggregate Schema Evolution

Aggregate schema changes must support one of:

- read-old/write-new
- dual-read
- dual-write during transition
- explicit migration
- lazy migration on load

Any lazy migration must be deterministic and auditable.

## 8. Event Schema Evolution

Historical events remain immutable.

New code reads old events through deterministic upcasters.

An upcaster must:

- be pure
- be version-specific
- preserve semantic meaning
- avoid external calls
- avoid current-time dependency
- be covered by replay tests

## 9. Snapshot Evolution

Snapshots may be:

- read directly when compatible
- transformed through deterministic migration
- invalidated and rebuilt from events

Snapshot incompatibility must never block recovery when the event stream remains valid.

## 10. Authorization Policy Evolution

Authorization policy changes apply only according to explicit activation rules.

Possible scopes:

- new activities only
- not-yet-started activities
- active activities after human review
- tenant cohort
- feature-flag cohort

Policy deployment alone must not retroactively revoke or authorize activities unless an explicit governed command is executed.

## 11. Retry Policy Evolution

Retry policy changes must preserve already consumed attempts and recorded decisions.

A new retry policy may affect:

- future attempts
- newly created activities
- explicitly migrated active activities

It must not erase prior attempt counts.

## 12. Adaptation Policy Evolution

Adaptive policy evolution requires lineage preservation.

Re-evaluating an activity under a newer policy creates a new adaptation decision with:

```text
priorPolicyVersion
newPolicyVersion
reason
trigger evidence
resulting activity lineage
```

## 13. Evidence Contract Evolution

Evidence contract changes must specify:

- accepted historical versions
- conversion rules
- rejection rules
- quarantine behavior
- mastery consumer compatibility

Historical evidence must not be silently upgraded in meaning.

## 14. Projection Evolution

Projection schemas may evolve independently from aggregate authority.

A projection migration may use:

- incremental update
- shadow projection
- full rebuild
- dual-read
- cutover by version

Projection rollback must not mutate aggregate state.

## 15. Cross-Runtime Contract Evolution

Changes between Learning Path, Activity, Session, Evidence, and Mastery runtimes require explicit compatibility matrices.

Each contract change must define:

- producer versions
- consumer versions
- required fields
- optional fields
- deprecation window
- failure behavior

## 16. Mixed-Version Operation

During rollout, the system may run multiple versions simultaneously.

Mixed-version safety requires:

- stable identifiers
- explicit schema versions
- compatible command handling
- compatible event reading
- version-aware projections
- version-aware observability

## 17. Shadow Execution

New policies or transition implementations should be evaluated in shadow mode before authority cutover when risk warrants it.

Shadow execution:

- consumes the same inputs
- produces non-authoritative results
- records divergence
- does not mutate activity state
- does not publish authoritative events

## 18. Divergence Analysis

Divergence reports should identify:

- state differences
- authorization differences
- retry differences
- adaptation differences
- completion differences
- evidence linkage differences
- projection differences

A divergence threshold must be defined before rollout.

## 19. Canary Rollout

Canary rollout scopes may include:

- internal tenants
- test learners
- selected activity types
- percentage cohort
- geography or school cohort

Canary selection must preserve privacy and fairness constraints.

## 20. Migration Lifecycle

A governed migration follows:

```text
PLANNED
→ VERIFIED
→ SHADOWING
→ CANARY
→ ACTIVE
→ COMPLETED
```

Failure states include:

```text
PAUSED
ROLLED_BACK
FORWARD_FIX_REQUIRED
QUARANTINED
```

## 21. Resumable Migration

Long migrations require checkpoints.

A migration checkpoint records:

```text
migrationId
tenantId
lastAggregateId
lastEventPosition
processedCount
failedCount
startedAt
updatedAt
status
```

Retries resume from durable progress.

## 22. Re-evaluation Campaigns

When policy evolution warrants re-evaluation, the system creates a governed campaign rather than silently mutating activities.

A campaign defines:

- target population
- source version
- target version
- eligibility rules
- human review threshold
- expected impact
- rollback plan

## 23. Active Activity Migration

Active activities require stronger controls than unstarted activities.

Migration may occur only at a safe boundary such as:

- before start
- while paused with verified checkpoint
- after attempt completion but before retry authorization

Mid-step mutation is forbidden unless the activity type explicitly supports it.

## 24. Terminal Activity Preservation

Terminal activities are immutable historical records.

Corrections use:

- correction events
- superseding projections
- governed evidence updates
- explicit audit annotations

They do not rewrite lifecycle history.

## 25. Rollback

Code rollback and state rollback are different.

A code rollback may restore prior runtime behavior only when prior code can read all newly written data.

State rollback is generally forbidden for accepted activity history. Recovery should prefer forward-fix, supersession, or correction events.

## 26. Forward-Fix

A forward-fix creates new authoritative transitions that repair future behavior while preserving accepted history.

Forward-fix is preferred when:

- new events have already been committed
- external consumers have observed new versions
- rollback would lose meaning

## 27. Feature Flags

Feature flags must be:

- tenant-aware
- version-aware
- observable
- reversible
- free of hidden state mutation

Disabling a flag must not invalidate already accepted activity events.

## 28. Deprecation

Deprecation requires:

- announced version
- replacement contract
- consumer inventory
- migration deadline
- telemetry
- removal gate

Deprecated event readers must remain until retained history no longer requires them.

## 29. Data Repair During Evolution

Evolution-related repair must distinguish:

- schema transformation
- semantic correction
- projection rebuild
- aggregate repair

Schema transformation may be automated. Semantic correction requires explicit authority and audit.

## 30. Observability

Evolution metrics include:

- version distribution
- migration throughput
- migration failures
- shadow divergence
- canary error rate
- upcaster usage
- old-version read rate
- rollback readiness
- projection rebuild lag

## 31. Evolution Failure Codes

Representative failures:

- VERSION_UNSUPPORTED
- EVENT_UPCAST_FAILED
- SNAPSHOT_MIGRATION_FAILED
- ACTIVITY_DEFINITION_INCOMPATIBLE
- ACTIVE_ACTIVITY_MIGRATION_UNSAFE
- POLICY_VERSION_CONFLICT
- SHADOW_DIVERGENCE_EXCEEDED
- CANARY_ABORTED
- MIXED_VERSION_INCOMPATIBLE
- ROLLBACK_UNSAFE
- FORWARD_FIX_REQUIRED
- MIGRATION_CHECKPOINT_INVALID

## 32. Verification Scenarios

Minimum scenarios:

1. new code replays old events identically
2. incompatible snapshot falls back to event replay
3. old and new definition versions coexist
4. active activity migration occurs only at safe boundary
5. terminal activity remains unchanged
6. shadow execution records divergence without mutation
7. canary rollout can be paused
8. mixed-version nodes process compatible commands
9. rollback safety check rejects unreadable new data
10. forward-fix preserves history
11. re-evaluation campaign creates new lineage
12. projection schema rebuild produces equivalent meaning

## 33. Core Evolution Invariants

1. Accepted history is never reinterpreted silently.
2. Definitions are immutable by version.
3. Historical events are never edited.
4. Upcasters are deterministic and pure.
5. Deployment is not migration.
6. Read compatibility is not behavior compatibility.
7. Active migration requires a safe boundary.
8. Terminal activities do not migrate in place.
9. Re-evaluation creates new lineage.
10. Shadow execution is non-authoritative.
11. Code rollback is not state rollback.
12. Forward-fix is preferred when new history is already durable.
13. Mixed-version operation must be explicitly verified.
14. Evolution must preserve tenant, privacy, and fairness boundaries.

## 34. Final Boundary

```text
Evolution changes implementation and future behavior.
Versioning preserves context.
Migration moves compatible state deliberately.
Shadowing measures divergence without authority.
Rollback restores code only when data remains readable.
Forward-fix repairs the future without erasing the past.
```
