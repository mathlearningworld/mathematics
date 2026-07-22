# 31J — Curriculum Runtime Invariants

## 1. Purpose

This slice consolidates the non-negotiable runtime laws for Chapter 31 — Curriculum Runtime.

The purpose of these invariants is to prevent implementation details, operational shortcuts, migration pressure, search convenience, projection behavior, or downstream demand from weakening curriculum identity, provenance, version history, or publication authority.

The governing principle is:

> Curriculum Runtime may organize, version, publish, align, project, verify, persist, replay, and migrate declared curriculum truth, but it must never silently strengthen, rewrite, or erase that truth.

---

## 2. Authority Invariants

1. A curriculum identity is long-lived and distinct from any individual curriculum version.
2. A curriculum version is an immutable expression once published.
3. Publication authority is explicit and never inferred from visibility.
4. Approved is not equivalent to published.
5. Published is not equivalent to active.
6. Visible is not equivalent to authoritative.
7. Official, institutional, teacher, and community provenance are never collapsed into one authority level.
8. Lower-authority sources must never be presented as higher-authority sources.
9. Curriculum membership is not learner mastery.
10. Grade placement is not learner capability.
11. Curriculum order is not pedagogical dependency.
12. Coverage is not understanding.
13. Alignment is not equivalence.
14. Approximate equivalence is not interchangeability.

---

## 3. Identity Invariants

1. Every curriculum, version, node, alignment, overlay, publication package, verification run, and migration has a stable identity.
2. Names, labels, and titles are not identities.
3. Search matches never establish identity.
4. Every authority-bearing external reference resolves to an explicit version when the contract requires version binding.
5. Node identity is unique within its declared version scope.
6. Ambiguous identity resolution is blocking.
7. Renaming does not create identity equivalence unless explicitly declared and verified.
8. Moving a node does not silently change its identity or meaning.

---

## 4. Versioning Invariants

1. Published meaning is never rewritten in place.
2. Semantic change requires a new version.
3. Correction records may clarify or repair metadata but cannot hide semantic change.
4. Supersession preserves the complete prior version.
5. Revocation is explicit and does not delete history.
6. Explicit version requests never silently float to another version.
7. Default version resolution is deterministic and policy-bound.
8. Historical references remain bound to their original version.
9. A new version does not inherit verification, alignment, or migration status automatically.
10. Version coexistence must be explicit.

---

## 5. Structure Invariants

1. Authoritative curriculum hierarchy is acyclic.
2. Orphan nodes are not publishable unless a policy explicitly defines a valid orphan category.
3. Parent-child relationships are version-bound.
4. Node ordering is deterministic.
5. Structural node types obey the governing curriculum schema.
6. Grade, subject, domain, strand, standard, indicator, and objective placement must remain explicit.
7. Tree projections do not own structural truth.
8. Reordering for display must not rewrite authoritative ordering.
9. Localization changes presentation, not identity or hierarchy.

---

## 6. Provenance Invariants

1. Every official curriculum version has verifiable publishing-authority provenance.
2. Source classification is immutable for a published record unless corrected through an explicit auditable event.
3. Provenance survives projection, export, migration, and replay.
4. Overlay provenance remains distinct from official curriculum provenance.
5. Imported or community-authored content cannot become official merely through publication in the product.
6. Missing official provenance blocks official publication.
7. Provenance evidence is version-bound.

---

## 7. Catalog and Resolution Invariants

1. Search ranking never establishes curriculum authority.
2. Text similarity never establishes curriculum equivalence.
3. Catalog results expose version and provenance context where authority matters.
4. Revoked versions are excluded from active resolution unless explicitly requested for historical inspection.
5. Localization fallback is visible and deterministic.
6. Pagination and ordering are stable for a fixed catalog state.
7. Institution overlays are visible only within authorized scope.
8. Catalog convenience must not bypass explicit version selection.

---

## 8. Alignment Invariants

1. Every alignment binds source identity, source version, curriculum node identity, curriculum version, relationship type, and evidence basis.
2. An alignment does not prove equivalence unless the declared relationship and policy explicitly do so.
3. Practice alignment is not assessment alignment.
4. Assessment alignment is not assessment validity.
5. Coverage alignment is not learner mastery.
6. Updated source versions require revalidation unless safe inheritance is explicitly proven.
7. Approximate cross-curriculum mappings never authorize silent substitution.
8. Split and merge mappings require explicit cardinality and review.
9. Alignment confidence is explicit and never strengthened by projection.
10. Rejected or expired alignments remain historically auditable.

---

## 9. Publication Invariants

1. Publication is an explicit lifecycle, not a file-upload side effect.
2. Publication readiness requires identity, provenance, structure, time, distribution, persistence, and governance gates.
3. Publication approval and publication execution are distinct operations.
4. Activation cannot occur before publication requirements pass.
5. Partial technical delivery must not create partial curriculum authority.
6. Withdrawal and revocation are explicit and auditable.
7. Failed publication attempts do not alter authoritative active state.
8. Scheduled publication must reference an immutable approved package.
9. Publication outcomes are idempotent.
10. Publication authority cannot be inferred from search availability or projection visibility.

---

## 10. Projection Invariants

1. Projection is derived and never authoritative.
2. Projection never strengthens source meaning.
3. Projection freshness is explicit.
4. Stale blocking projections cannot support authority-bearing decisions.
5. Audience filtering changes visibility, not curriculum meaning.
6. Localization changes rendering, not identity.
7. Projection rebuild must be possible from authoritative records.
8. Projection drift must be detectable.
9. Search indexes are projections and cannot resolve identity without authoritative lookup.
10. Revoked or withdrawn data follows explicit projection policy.

---

## 11. Persistence Invariants

1. The append-only event ledger is the durable authority.
2. Materialized aggregate state is derived.
3. Snapshots are recovery accelerators only.
4. Events are never silently edited, deleted, or reordered.
5. Authoritative writes use optimistic concurrency.
6. Last-write-wins is forbidden for authoritative curriculum state.
7. Command idempotency is enforced.
8. Reusing a command identity with a different payload is a conflict.
9. State mutation and outbox publication are atomic.
10. Projection loss does not imply authority loss.
11. Historical records remain reconstructable.
12. Unknown event schemas are never silently ignored.

---

## 12. Replay Invariants

1. Replay is deterministic for a fixed ledger, runtime version, schema translation set, and policy set.
2. Replay order is based on durable ledger position or aggregate event version.
3. Timestamps do not replace authoritative ordering.
4. Historical replay uses the policy versions recorded with the original events when reconstructing historical authority.
5. Current-runtime reinterpretation is diagnostic unless explicitly approved for authoritative replacement.
6. Shadow and diagnostic replay outputs remain isolated.
7. Unknown semantic divergence blocks authoritative replacement.
8. Stored events are never mutated by upcasters.
9. Replay cannot strengthen source authority.
10. Point-in-time views remain reproducible.

---

## 13. Verification Invariants

1. Every verification result binds to an explicit target version.
2. Every verification result binds to an explicit policy version.
3. Verification is deterministic for fixed inputs.
4. `INCONCLUSIVE` is never treated as success.
5. Verification does not invent authority.
6. Publication cannot bypass blocking verification findings.
7. Migration cannot bypass semantic-preservation verification.
8. Changed versions require new verification.
9. Historical verification results remain immutable.
10. Verification evidence remains auditable.
11. Automated verification does not silently replace required human or governance approval.
12. Unknown replay divergence is blocking.

---

## 14. Migration Invariants

1. Migration changes operational references and never rewrites historical truth.
2. Source and destination versions are always explicit.
3. Supersession does not automatically migrate consumers.
4. Approximate mapping is never exact equivalence.
5. Historical learner, assessment, mission, and progress records remain tied to original versions.
6. Active references migrate only under explicit policy.
7. Alignments require revalidation unless safe inheritance is verified.
8. Every migrated reference has an auditable migration receipt.
9. Migration execution is idempotent.
10. Partial completion remains explicit.
11. Unknown semantic loss blocks completion.
12. Rollback preserves migration history.
13. Coexisting versions never silently float.
14. Mapped progress does not create new mastery evidence.
15. User-facing mission goals cannot materially change silently.

---

## 15. Temporal Invariants

1. Effective periods are explicit.
2. Publication date and activation date are distinct when the lifecycle requires them.
3. Supersession boundaries are deterministic.
4. Revoked versions cannot resolve as active.
5. Historical effective dates are never rewritten to simplify migration.
6. Overlay compatibility periods cannot exceed verified base-version compatibility.
7. Scheduled operations preserve their approved immutable inputs.
8. Clock time supports policy but does not replace ordered event history.

---

## 16. Overlay Invariants

1. Institution and teacher overlays never mutate official curriculum records.
2. Overlay authority remains scoped to its owner and audience.
3. Overlay visibility is tenant-safe.
4. Overlay compatibility is version-bound.
5. Base-version migration requires overlay revalidation.
6. Incompatible overlays cannot activate on a destination version.
7. Official publication does not absorb overlay meaning implicitly.
8. Overlay history remains auditable.

---

## 17. Cross-Engine Boundary Invariants

### Learning Engine

Curriculum Runtime may identify learning objectives and curriculum placement, but does not declare learner mastery.

### Assessment Engine

Curriculum Runtime may hold assessment alignments, but does not validate scores or create assessment evidence.

### Recommendation Engine

Curriculum Runtime supplies versioned targets and constraints, but does not choose personalized recommendations.

### Mission Engine

Curriculum Runtime supplies curriculum targets, but does not declare mission completion.

### Gameplay Runtime

Curriculum Runtime may contextualize gameplay activities, but gameplay activity does not become curriculum mastery.

### Progress Engine

Curriculum Runtime supplies curriculum identity and version context, but Progress Engine owns derived learner-progress representations.

### Skill Graph Runtime

Curriculum order and curriculum hierarchy do not become skill prerequisites automatically. Skill dependency requires independent skill-graph authority.

---

## 18. Failure-Handling Invariants

1. Ambiguity blocks authority-bearing resolution.
2. Unknown schema blocks authoritative replay.
3. Missing provenance blocks official publication.
4. Structural cycles block publication.
5. Unexplained temporal conflicts block activation.
6. Unknown replay divergence blocks replacement.
7. Semantic-loss uncertainty blocks migration completion.
8. Stale blocking projections fail closed.
9. Partial failures remain explicit.
10. Failure evidence is preserved for recovery and audit.
11. Retrying an operation does not duplicate authoritative effects.
12. Recovery does not weaken validation gates.

---

## 19. Security Invariants

1. All authoritative mutations require authorization.
2. Institution data remains tenant-scoped.
3. Diagnostic replay does not bypass access control.
4. Unpublished drafts do not leak through logs, errors, or evidence exports.
5. Publication approval may require separation of duties.
6. Migration approval and execution may require distinct actors.
7. Audit access is read-only by default.
8. Export preserves provenance and version labels.
9. Sensitive overlay data cannot become public through shared projections.

---

## 20. Minimum Automated Gate Set

A conforming implementation must automate at least the following:

### Identity gates

- stable curriculum identity
- explicit version binding
- ambiguous resolution rejection
- duplicate node rejection

### Structure gates

- cycle detection
- orphan detection
- invalid parent-child transition detection
- deterministic ordering

### Version gates

- immutable published version
- explicit supersession
- revoked-version exclusion
- no silent version floating

### Provenance gates

- official-source completeness
- authority-class preservation
- overlay provenance separation

### Alignment gates

- version-bound source and target
- approximate mapping labeling
- revalidation after source-version change

### Publication gates

- approved-package immutability
- readiness gate enforcement
- idempotent publication
- no partial authority

### Persistence gates

- optimistic concurrency
- command idempotency
- atomic state-plus-outbox
- snapshot digest validation

### Replay gates

- deterministic reconstruction
- unknown-event blocking
- divergence classification
- point-in-time reproducibility

### Verification gates

- policy-version binding
- inconclusive rejection
- publication blocking on critical findings
- immutable verification outcome

### Migration gates

- exact versus approximate mapping distinction
- historical-reference preservation
- idempotent batch execution
- rollback audit preservation
- semantic-loss blocking

### Projection gates

- source-version binding
- freshness enforcement
- projection rebuild
- projection drift detection

---

## 21. Chapter Completion Test

Chapter 31 is architecturally complete only when all of the following are true:

1. Curriculum identity and authority are explicit.
2. Versioning preserves historical meaning.
3. Catalog resolution is deterministic.
4. Alignments remain version-bound and evidence-backed.
5. Publication has explicit readiness and authority gates.
6. Projections remain derived and rebuildable.
7. Persistence is append-only and concurrency-safe.
8. Replay can reconstruct historical and current state deterministically.
9. Verification blocks invalid publication and migration.
10. Migration preserves history and prevents silent semantic loss.
11. Cross-engine boundaries prevent curriculum data from becoming learner mastery or skill dependency by implication.
12. The invariant suite is testable at repository, runtime, and operational gates.

---

## 22. Final Runtime Law

> Curriculum Runtime may organize, version, publish, align, project, verify, persist, replay, and migrate authorized curriculum truth.
>
> It must never manufacture stronger authority, erase historical meaning, silently float versions, convert approximation into equivalence, or convert curriculum placement into learner understanding.

---

## 23. Completion Criteria

31J is complete when these invariants are accepted as the governing laws for all Chapter 31 implementations, contracts, persistence adapters, projections, publication flows, verification pipelines, migrations, and downstream integrations.
