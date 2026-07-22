# Chapter 38H — Learning Path Verification Runtime

## 1. Purpose

The Learning Path Verification Runtime defines how the platform proves that learning-path behavior is structurally correct, operationally safe, reproducible, explainable, and compatible with the wider learning architecture.

Verification is not a single test suite and not a synonym for successful deployment. It is a layered evidence system that distinguishes repository correctness, executable runtime behavior, cross-runtime integration, real operational flow, and safe evolution.

Core rule:

> A learning path is not verified because its documents exist, its code compiles, or one happy-path scenario passes.

## 2. Verification Domains

The runtime MUST be verified across ten domains:

1. Contract
2. Authority
3. Planning
4. Orchestration
5. Adaptation
6. Evidence
7. Persistence & Replay
8. Projection
9. Safety, Fairness, Privacy & Accessibility
10. Cross-Runtime Integration

A complete verification report MUST identify which domains were tested and which remain unverified.

## 3. Gate Model

### Gate A — Repository Gate

Verifies static and architectural correctness:

- required files exist,
- public contracts are coherent,
- lifecycle states are defined,
- invariants are represented,
- version refs are explicit,
- forbidden authority leaks are absent,
- verifier scripts are wired,
- snapshots and fixtures are reviewed,
- diff scope is controlled.

Repository PASS does not prove runtime behavior.

### Gate B — Runtime Gate

Verifies executable behavior in a local or CI runtime:

- build,
- typecheck,
- unit tests,
- contract tests,
- deterministic planner tests,
- transition tests,
- replay tests,
- storage adapter tests,
- failure mapping.

Runtime PASS does not prove system integration.

### Gate C — Integration Gate

Verifies boundaries with other runtimes:

- Mastery Runtime,
- Learning Journey Runtime,
- Session Runtime,
- Assessment Runtime,
- Curriculum Runtime,
- Skill Graph Runtime,
- Content Runtime,
- Projection Runtime,
- notification and analytics boundaries.

Integration PASS does not prove the real user workflow.

### Gate D — Operational Gate

Verifies the running system end to end:

```text
Learner/Teacher UI
→ API
→ Learning Path Application Runtime
→ Persistence
→ Event/Outbox
→ Projection
→ Next Action UI
```

Operational PASS requires runtime evidence from the deployed or representative environment.

### Gate E — Evolution Gate

Verifies safe change:

- backward-readable history,
- upcaster correctness,
- mixed-version operation,
- shadow comparison,
- migration resume,
- rollback procedure,
- policy divergence analysis.

## 4. Verification Evidence Package

Every verification run SHOULD produce:

- verification ID,
- commit SHA,
- branch/ref,
- environment identity,
- dependency versions,
- database schema version,
- curriculum and skill-graph versions,
- policy versions,
- test command list,
- machine-readable results,
- human-readable summary,
- failure artifacts,
- runtime logs,
- screenshots where operational UI is involved,
- unresolved risks,
- gate outcome.

Evidence MUST be attributable to a specific code and configuration state.

## 5. Contract Verification

Contract tests MUST verify:

- input identity requirements,
- tenant scope,
- expected-version fields,
- command IDs,
- lifecycle transition inputs,
- planning result shape,
- orchestration authorization shape,
- adaptation proposal shape,
- projection response shape,
- explicit failure codes,
- version metadata.

Unknown or missing required fields MUST fail deterministically according to contract policy.

## 6. Authority Verification

Authority tests MUST prove that:

- planning proposes but does not activate,
- orchestration authorizes execution but does not infer mastery,
- adaptation requests or approves a new path version rather than silently mutating history,
- projections cannot mutate path authority,
- evidence linkage does not itself complete a path,
- external callbacks cannot bypass local commit,
- stale clients cannot overwrite newer path versions,
- only authorized actors can approve, pause, resume, cancel, or override.

## 7. Planning Verification

Planning verification MUST cover:

- deterministic output for identical frozen inputs,
- prerequisite closure,
- cycle detection,
- unreachable-goal detection,
- remediation insertion,
- retention insertion,
- acceleration eligibility,
- time-budget handling,
- accessibility constraints,
- content availability,
- policy-version pinning,
- tie-breaking determinism,
- candidate quality metrics,
- explanation completeness.

Planner tests MUST not rely on unordered collection traversal or ambient current time.

## 8. Orchestration Verification

Orchestration tests MUST cover:

- eligible-node selection,
- active-node exclusivity where required,
- node authorization,
- session handoff,
- completion acknowledgement,
- block handling,
- pause/resume,
- cancellation,
- safe checkpointing,
- stale-result rejection,
- duplicate result handling,
- replan trigger emission,
- concurrency conflicts,
- crash recovery.

## 9. Adaptation Verification

Adaptation tests MUST prove:

- trigger qualification,
- no replan for noisy or insufficient signals,
- cooldown and anti-thrashing,
- safe boundary enforcement,
- active-session protection,
- remediation escalation,
- acceleration de-escalation when evidence weakens,
- evidence-withdrawal response,
- content-unavailability substitution,
- human-review routing,
- immutable supersession lineage,
- rollback to last valid approved path version where policy permits.

## 10. Evidence Verification

Evidence verification MUST cover:

- structural path evidence,
- execution evidence,
- learning evidence references,
- deviation evidence,
- adaptation evidence,
- outcome evidence,
- immutable records,
- supersession,
- withdrawal,
- provenance,
- integrity hashes,
- tenant isolation,
- role-based access.

Critical distinction:

```text
Path completion evidence ≠ mastery evidence
```

Tests MUST reject any implementation that converts operational completion directly into mastery authority.

## 11. Persistence & Replay Verification

Persistence tests MUST include:

- atomic commit,
- rollback on failure,
- expected-version conflict,
- repeated command idempotency,
- idempotency payload mismatch,
- event ordering,
- stream gap detection,
- snapshot reconstruction,
- corrupted snapshot fallback,
- replay from zero,
- replay from historical version,
- outbox retry,
- inbox deduplication,
- crash after commit before response,
- ambiguous outcome recovery,
- backup restore reconciliation.

Replay output MUST match the authoritative aggregate state for the same version.

## 12. Projection Verification

Projection tests MUST verify:

- learner roadmap correctness,
- parent view redaction,
- teacher view scope,
- operator diagnostics,
- next-action visibility,
- blockers,
- path-version freshness,
- stale projection marking,
- rebuild from event history,
- idempotent event consumption,
- out-of-order handling policy,
- role-based privacy,
- no authority mutation from read models.

## 13. Cross-Runtime Verification

### 13.1 Mastery Runtime

Verify that:

- mastery input is version-pinned,
- stale mastery cannot silently activate a path,
- mastery updates trigger explicit reconsideration,
- path completion does not create mastery.

### 13.2 Learning Journey Runtime

Verify that:

- path belongs to the correct journey context,
- journey state gates path activation where required,
- path supersession remains explainable in journey history.

### 13.3 Session Runtime

Verify that:

- only authorized path nodes create sessions,
- session outcomes are deduplicated,
- incomplete sessions do not become completed nodes,
- session retry does not duplicate path progress.

### 13.4 Curriculum and Skill Graph

Verify that:

- version mismatches are detected,
- removed or changed prerequisites trigger policy-defined handling,
- historical paths remain explainable under old graph versions.

### 13.5 Content Runtime

Verify that:

- unavailable content does not leave an executable phantom node,
- substitutions preserve objective meaning and accessibility constraints,
- content identity/version is recorded.

## 14. Golden Scenarios

The following golden scenarios SHOULD be maintained as durable fixtures.

### Scenario 1 — High Score, Narrow Evidence

A learner has a high recent score but evidence coverage is narrow.

Expected:

- no unjustified acceleration,
- retention or transfer evidence may be scheduled,
- explanation identifies evidence limitation.

### Scenario 2 — Repeated Same-Form Success

A learner succeeds repeatedly on near-identical items.

Expected:

- planner does not treat repetition as broad transfer,
- path includes varied representation or transfer activity.

### Scenario 3 — Prerequisite Gap

Target skill depends on an unmastered prerequisite.

Expected:

- prerequisite closure inserts remediation,
- target is not authorized prematurely.

### Scenario 4 — Retention Decay

Previously supported mastery has weakened over time.

Expected:

- retention reinforcement is added,
- path version lineage explains the change.

### Scenario 5 — Evidence Withdrawal

A key evidence record is withdrawn due to integrity or grading error.

Expected:

- active path is reconsidered,
- no historical event is deleted,
- new path decision references withdrawal.

### Scenario 6 — Concurrent Decisions

Two actors attempt conflicting path changes at the same version.

Expected:

- one commits,
- the other receives `VERSION_CONFLICT`,
- no silent merge.

### Scenario 7 — Crash After Commit

The database commits, but the API response is lost.

Expected:

- retry by command ID returns prior result,
- no duplicate transition.

### Scenario 8 — Curriculum Evolution

A curriculum version changes while a path is active.

Expected:

- current execution follows compatibility policy,
- historical meaning remains pinned,
- replan occurs only under explicit policy.

### Scenario 9 — Accessibility Equivalent

The default activity is inaccessible, but an equivalent activity exists.

Expected:

- equivalent substitution is selected,
- objective meaning is preserved,
- no penalty or lower mastery ceiling is inferred from accommodation.

### Scenario 10 — Content Removal During Execution

An upcoming node references unavailable content.

Expected:

- node is blocked before execution,
- adaptation proposes a safe substitute,
- current committed progress remains intact.

## 15. Property-Based Verification

Property-based tests SHOULD assert general truths such as:

- aggregate version increases monotonically,
- replay is deterministic,
- completed node count never exceeds total node count,
- a superseded path version cannot become active again without explicit restoration policy,
- a node cannot be both completed and active,
- tenant identity never changes within a path stream,
- retrying a committed command does not add events,
- projection rebuild converges to the same read model.

## 16. State-Machine Verification

The lifecycle state machine MUST be tested for:

- allowed transitions,
- forbidden transitions,
- terminal-state behavior,
- pause/resume semantics,
- supersession semantics,
- cancellation semantics,
- recovery states,
- human-review states.

Every forbidden transition MUST produce an explicit stable failure code.

## 17. Mutation Testing

High-risk rules SHOULD be protected by mutation testing, especially:

- expected-version checks,
- tenant filters,
- idempotency comparisons,
- prerequisite gating,
- safe-boundary checks,
- mastery/path completion separation,
- role authorization,
- event ordering.

A test suite that survives removal of these checks is insufficient.

## 18. Fault Injection

Fault-injection verification SHOULD include:

- database unavailable,
- timeout before commit,
- timeout after commit,
- duplicate external event,
- delayed outbox delivery,
- projection consumer restart,
- corrupted snapshot,
- stale cache,
- missing content dependency,
- partial migration,
- invalid policy version.

## 19. Performance Verification

Performance tests SHOULD measure:

- planning latency by graph size,
- replay latency by event count,
- projection rebuild throughput,
- concurrent command conflict behavior,
- outbox backlog recovery,
- path retrieval latency,
- adaptation evaluation latency.

Performance optimizations MUST not weaken correctness or tenant isolation.

## 20. Security Verification

Security tests MUST verify:

- tenant isolation,
- actor authorization,
- object-level access control,
- command replay protection,
- sensitive evidence redaction,
- projection role filtering,
- audit-log integrity,
- injection resistance,
- safe error messages,
- protected migration and replay tools.

## 21. Privacy Verification

Privacy verification MUST check:

- data minimization,
- no unnecessary learner details in events,
- protected access to evidence references,
- appropriate retention,
- export and deletion policy behavior,
- pseudonymization where required,
- logs without sensitive payload leakage.

## 22. Fairness Verification

Fairness verification SHOULD analyze whether planning or adaptation outcomes differ unjustifiably across relevant groups or accommodations.

The runtime MUST distinguish legitimate educational constraints from proxy discrimination.

No learner may receive a reduced mastery interpretation merely because they used an accessible or alternative interaction format.

## 23. Accessibility Verification

Accessibility verification MUST include:

- keyboard and assistive navigation where UI is involved,
- accessible alternatives for path activities,
- equivalent objective coverage,
- readable explanation of blockers and next actions,
- no inaccessible activity becoming the only route to required progress,
- safe handling of learner accessibility preferences.

## 24. Explainability Verification

For every planned or adapted path, verification SHOULD confirm that the system can explain:

- why this goal was selected,
- why each prerequisite appears,
- why a node is next,
- why acceleration was or was not allowed,
- why remediation was inserted,
- why a path changed,
- which policy and evidence versions were used,
- whether human approval affected the result.

## 25. Determinism Verification

Identical frozen inputs and identical versioned policies MUST produce identical planning and adaptation outputs, excluding explicitly non-authoritative metadata such as generated trace IDs.

Where randomized exploration is permitted, the random seed MUST be recorded and replayable.

## 26. Mixed-Version Verification

During rolling deployment, tests MUST cover:

- old writer/new reader,
- new writer/old reader where supported,
- old snapshot/new replay engine,
- mixed projection consumers,
- policy version pinning,
- unknown-event refusal behavior.

## 27. Migration Verification

Migration verification MUST include:

- dry run,
- resumable cursor,
- idempotent rerun,
- row/event counts,
- before/after integrity checks,
- sample replay,
- rollback or forward-fix procedure,
- operational monitoring.

## 28. Human Test Protocol

Operational user testing SHOULD capture:

- actor role,
- scenario,
- starting path state,
- actions taken,
- observed next action,
- blocker behavior,
- explanation quality,
- screenshots,
- console/network evidence where useful,
- final durable state,
- unexpected behavior.

Human observation is evidence, but it does not replace automated invariant verification.

## 29. Failure Classification

Failures SHOULD be classified as:

- contract defect,
- authority defect,
- planner defect,
- orchestration defect,
- adaptation defect,
- persistence defect,
- projection defect,
- integration defect,
- data/version defect,
- operational/environment defect,
- test defect.

This prevents treating all failures as generic implementation errors.

## 30. Exit Criteria

Chapter 38 verification is complete only when:

- repository contracts are reviewed,
- runtime tests pass,
- integration boundaries are exercised,
- operational flow is demonstrated,
- replay and recovery are proven,
- security/privacy/accessibility checks are complete,
- evolution procedures are tested,
- unresolved risks are documented.

## 31. Final Doctrine

```text
Repository PASS proves repository evidence.
Runtime PASS proves executable behavior.
Integration PASS proves boundary cooperation.
Operational PASS proves the real flow.
Evolution PASS proves safe change.
None of these alone proves educational outcomes.
```
