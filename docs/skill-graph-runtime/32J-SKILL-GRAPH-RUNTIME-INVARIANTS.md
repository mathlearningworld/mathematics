# 32J — Skill Graph Runtime Invariants

## 1. Purpose

This document consolidates the non-negotiable runtime laws of Chapter 32 — Skill Graph Runtime.

These invariants govern identity, versioning, dependency semantics, prerequisite interpretation, progression, projection, persistence, replay, verification, evolution, and cross-engine boundaries.

They are not implementation suggestions. They are architecture constraints.

---

## 2. Authority Invariants

1. Skill Graph Runtime owns skill identity, skill version identity, typed graph relationships, and graph publication authority.
2. No projection, recommendation, curriculum placement, assessment result, mission outcome, or gameplay result may independently create skill graph authority.
3. Graph authority must always resolve to an explicit immutable graph version.
4. Historical authority must remain inspectable after supersession, retirement, or evolution.
5. Authority must never be inferred from display order, popularity, or usage frequency.

---

## 3. Identity Invariants

1. `SkillId` identifies the long-lived skill lineage.
2. `SkillVersionId` identifies one immutable semantic expression.
3. Canonical keys are resolvable names, not substitutes for immutable identifiers.
4. Display labels are never identity authority.
5. Aliases must be scoped and collision-safe.
6. Redirect chains must terminate.
7. Historical identity resolution must never silently float to latest.
8. Semantic change requires a new `SkillVersionId`.
9. Localization must not alter mathematical meaning.
10. Identity continuity must remain auditable.

---

## 4. Meaning Invariants

1. Skill meaning must be explicit enough to distinguish it from lessons, questions, curriculum nodes, scores, and learner states.
2. Skill meaning is versioned.
3. Published meaning is immutable.
4. Label change does not necessarily imply semantic change.
5. Semantic refinement must be classified explicitly.
6. Approximate similarity must not be represented as sameness.
7. A mathematical representation is not automatically a separate skill unless the boundary is intentional and governed.
8. Skill meaning must not be rewritten to fit downstream data.

---

## 5. Dependency Invariants

1. Every relationship has an explicit type.
2. Every relationship binds explicit source and target skill versions.
3. Every authoritative relationship has provenance.
4. Curriculum order does not automatically create a cognitive dependency.
5. Statistical correlation does not automatically create prerequisite authority.
6. A graph edge is not proof of learner causation.
7. Contextual dependencies must not be projected as universal.
8. Duplicate authoritative edges are prohibited unless scopes differ explicitly.
9. Prohibited self-loops are blocked.
10. Edge history remains inspectable after withdrawal.

---

## 6. Prerequisite Invariants

1. Prerequisite type must be explicit.
2. Hard prerequisite claims require stronger authority than soft prerequisite claims.
3. Hard prerequisite cycles are blocked.
4. Grade level is not proof of prerequisite satisfaction.
5. Lesson completion is not proof of prerequisite satisfaction.
6. One correct response is not proof of stable readiness.
7. Prerequisite satisfaction is time-bound and evidence-bound.
8. Alternate prerequisite routes must remain explicit.
9. Readiness is not a guarantee of future success.
10. Understanding debt is an inference, not a permanent label.
11. Dependency structure and learner state remain separate authorities.
12. Uncertainty must remain visible.

---

## 7. Progression Invariants

1. Skill progression is not curriculum promotion.
2. Skill progression is not content completion.
3. Skill progression is not accumulated points.
4. Progression state must remain bound to evidence and policy versions.
5. Progression may be non-linear.
6. Remediation routes must not erase prior evidence.
7. Regression and reactivation are valid states.
8. Transfer readiness requires evidence beyond one familiar context.
9. Graph evolution must not silently upgrade progression state.
10. Progression authority remains with the Progress Engine and related learner-state authorities.

---

## 8. Projection Invariants

1. Projection is not authority.
2. Visualization is not proof.
3. Filtering changes visibility, not meaning.
4. Ranking changes order, not truth.
5. Localization changes presentation, not identity.
6. Every projection exposes its graph version.
7. Every projection exposes freshness state.
8. Inferences must be distinguishable from observed evidence.
9. Audience simplification must not strengthen claims.
10. Stale blocking projections must not support authoritative decisions.
11. Projection rebuild must be deterministic for identical authority inputs.
12. A projection may be discarded and rebuilt without loss of authority.

---

## 9. Persistence Invariants

1. The append-only event ledger is durable authority.
2. Aggregate state is derived from the ledger.
3. Snapshots are replay accelerators, not authority replacements.
4. Authoritative writes use optimistic concurrency.
5. Last-write-wins is prohibited for semantic graph mutation.
6. Duplicate commands are idempotent.
7. Event order is monotonic per aggregate.
8. State mutation and outbox intent are atomic.
9. Event checksums must be verifiable.
10. Historical semantic events are not deleted merely because they are old.
11. Archival must preserve replay accessibility.
12. Namespace and tenant isolation must be enforced.

---

## 10. Replay Invariants

1. Replay must be deterministic for identical ordered inputs and recorded policies.
2. Unknown semantic events are never silently ignored.
3. Historical replay uses historical policy context where recorded.
4. Point-in-time replay never silently resolves to current meaning.
5. Snapshot replay must match full-event replay.
6. Unexplained divergence blocks authoritative replacement.
7. Replay evidence remains durable when used in recovery.
8. Replay cannot manufacture learner mastery evidence.
9. Projection replay cannot create graph authority.
10. Event upcasting must preserve original semantics.

---

## 11. Verification Invariants

1. Verification never invents authority.
2. `INCONCLUSIVE` is never success.
3. Mandatory publication gates cannot be bypassed.
4. Identity collisions are blocking.
5. Hard prerequisite cycles are blocking.
6. Historical identity unresolvability is blocking.
7. Approximation is never promoted to equivalence.
8. Correlation is never promoted to causation without explicit authority.
9. Replay divergence must remain visible.
10. Cached verification is valid only for identical inputs, policies, schemas, and verifier versions.
11. Durable authority decisions require durable verification evidence.
12. Incremental verification must include all affected transitive constraints.

---

## 12. Evolution Invariants

1. Evolution changes future authority; it does not rewrite historical truth.
2. Semantic change creates a new `SkillVersionId`.
3. Historical references remain bound to their original versions.
4. Approximate mapping is not equivalence.
5. Split does not duplicate mastery into every target.
6. Merge does not manufacture mastery of the merged target.
7. Existing evidence remains attached to its original skill version.
8. No-safe-mapping is a valid explicit outcome.
9. Target graph activation requires verification.
10. Rollback preserves evolution history.
11. Partial adoption and partial failure remain visible.
12. Evolution cannot independently rewrite curriculum, assessment, recommendation, mission, gameplay, or progress authority.

---

## 13. Temporal Invariants

1. Activation windows are explicit.
2. Publication precedes activation.
3. Supersession does not erase prior availability.
4. Retirement does not destroy historical resolution.
5. Policy-effective intervals are explicit.
6. Historical queries resolve by explicit version or time boundary.
7. Current pointers are convenience references, not historical authority.
8. Time-dependent inference must expose evaluation time.

---

## 14. Provenance Invariants

1. Authoritative skill meaning has provenance.
2. Authoritative relationships have provenance.
3. Provenance exposes source, reviewer, scope, and verification context.
4. Usage data alone does not establish cognitive authority.
5. Withdrawn provenance must trigger reverification where relevant.
6. Provenance updates do not silently rewrite historical claims.
7. Confidence and evidence classification remain explicit.

---

## 15. Publication Invariants

1. A published graph version is immutable.
2. Publication references explicit node and relationship versions.
3. Publication readiness requires mandatory verification gates.
4. Partial publication must not create accidental partial authority.
5. Activation must be explicit.
6. Withdrawal and revocation remain durable events.
7. Published authority cannot be rewritten in place.
8. A later publication may supersede, but never erase, an earlier publication.

---

## 16. Security Invariants

1. Authority-changing actions require traceable actors.
2. Replay and repair privileges are restricted.
3. Audit metadata is immutable.
4. Redaction may remove private metadata but not mathematical meaning or provenance required for authority.
5. Cross-namespace reads and writes require explicit authorization.
6. Security filtering must not silently alter graph semantics.
7. Publication actions require protected authorization boundaries.

---

## 17. Cross-Engine Boundary Invariants

### Curriculum Runtime

1. Curriculum Runtime owns curriculum placement and standard alignment.
2. Skill Graph Runtime owns cognitive graph relationships.
3. Curriculum order does not create prerequisite authority automatically.
4. Skill Graph evolution cannot rewrite curriculum authority independently.

### Learning Engine

1. Learning activities may reference skills but do not define skill identity.
2. Activity completion does not prove mastery.
3. Learning content may suggest graph refinements but cannot publish them independently.

### Assessment Engine

1. Assessment evidence may update learner understanding state.
2. Assessment results do not rewrite skill meaning.
3. Assessment mappings remain bound to explicit skill versions.
4. Historical results remain bound to historical scoring and graph context.

### Recommendation Engine

1. Recommendations consume graph authority.
2. Recommendations do not create graph authority.
3. Ranking does not strengthen dependency claims.
4. Recommendation output must expose graph version and relevant uncertainty.

### Mission Engine

1. Missions may reference skills and progression goals.
2. Mission completion does not prove mastery.
3. Historical mission outcomes remain stable across graph evolution.

### Gameplay Runtime

1. Gameplay may provide evidence opportunities.
2. Gameplay completion does not independently prove understanding.
3. Game rewards and points do not define skill progression authority.

### Progress Engine

1. Progress Engine owns learner progression state.
2. Skill Graph owns graph structure, not learner state.
3. Graph evolution does not silently upgrade or erase learner evidence.
4. Progress projections must bind explicit graph versions.

---

## 18. Understanding Debt Invariants

1. Understanding debt is a time-bound inference.
2. It must be supported by observable evidence and graph paths.
3. It is not a diagnosis of ability or intelligence.
4. It must expose uncertainty.
5. It must distinguish direct evidence from inferred upstream gaps.
6. It must be revisable when new evidence arrives.
7. It must not become a permanent learner label.
8. It must not be inferred solely from curriculum grade mismatch.
9. It must not convert correlation into causation.
10. It must support remediation planning without overstating certainty.

---

## 19. Failure Handling Invariants

1. Authority failures fail closed.
2. Unknown semantic events block authoritative replay.
3. Missing provenance blocks authority where provenance is mandatory.
4. Version conflicts do not silently overwrite.
5. Partial failure remains visible.
6. Recovery uses explicit events rather than historical mutation.
7. Divergence evidence is preserved.
8. Inconclusive verification blocks required authority gates.
9. Stale blocking projections cannot be treated as current.
10. Failed evolution cannot be reported as complete.

---

## 20. Automated Gate Invariants

Automated verification must be capable of proving at least:

- unique identities,
- immutable published versions,
- alias and redirect safety,
- endpoint existence,
- edge type validity,
- hard prerequisite acyclicity,
- deterministic replay,
- snapshot parity,
- projection parity,
- event ordering,
- optimistic concurrency,
- outbox atomicity,
- historical resolvability,
- evolution mapping validity,
- cross-engine contract integrity.

A passing document review alone is not runtime proof.

---

## 21. Final Runtime Law

> Skill Graph Runtime may define, version, relate, publish, project, persist, replay, verify, and evolve authorized skill meaning.
>
> It must never manufacture learner mastery, convert curriculum order into cognitive truth, convert correlation into causation, strengthen approximation into equivalence, silently float historical references, or erase prior meaning.

---

## 22. Chapter Completion Criteria

Chapter 32 is complete when the architecture defines and constrains:

- skill graph foundation,
- skill identity,
- dependency relationships,
- prerequisite evaluation,
- skill progression integration,
- graph projections,
- persistence and replay,
- verification,
- evolution,
- consolidated runtime invariants.

The implementation may advance only while preserving every invariant in this document.
