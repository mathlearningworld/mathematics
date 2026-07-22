# 32H — Skill Verification Runtime

## 1. Purpose

This runtime defines how skill graph authority is verified before publication, activation, migration, projection, recommendation use, and learner-facing interpretation.

Verification must prove that graph identity, topology, semantics, provenance, versioning, persistence, replay, and cross-engine boundaries remain valid.

Verification is not a cosmetic quality check. It is a runtime authority gate.

---

## 2. Verification Outcomes

Canonical outcomes:

```text
VERIFIED
VERIFIED_WITH_WARNINGS
NOT_VERIFIED
BLOCKED
INCONCLUSIVE
```

Meaning:

- `VERIFIED`: all mandatory gates passed.
- `VERIFIED_WITH_WARNINGS`: mandatory gates passed; non-blocking findings remain.
- `NOT_VERIFIED`: one or more mandatory rules failed.
- `BLOCKED`: verification cannot proceed because required authority or evidence is unavailable.
- `INCONCLUSIVE`: available evidence is insufficient to establish validity.

Runtime law:

> INCONCLUSIVE is never success.

---

## 3. Verification Scope

Verification may target:

```text
SKILL
SKILL_VERSION
RELATIONSHIP
PREREQUISITE_POLICY
GRAPH_VERSION
PUBLICATION
PROJECTION
PERSISTENCE_STATE
REPLAY_RUN
EVOLUTION_PLAN
CROSS_ENGINE_CONTRACT
```

Every verification run must state its exact scope and target version.

---

## 4. Verification Envelope

```text
verificationRunId
verificationType
targetType
targetId
targetVersion
graphVersionId
authorityNamespace
startedAt
completedAt
verifierVersion
policyVersion
schemaVersion
outcome
findings
inputChecksums
outputChecksum
actorId
correlationId
```

A verification result must be reproducible from its recorded inputs.

---

## 5. Gate Families

The runtime must support these gate families:

```text
IDENTITY
SCHEMA
PROVENANCE
TOPOLOGY
SEMANTIC
PREREQUISITE
TEMPORAL
VERSIONING
PUBLICATION
PROJECTION
PERSISTENCE
REPLAY
EVOLUTION
SECURITY
CROSS_ENGINE
```

---

## 6. Identity Verification

Identity checks must prove:

- `SkillId` uniqueness within authority namespace,
- `SkillVersionId` uniqueness,
- canonical key uniqueness within declared scope,
- alias non-collision,
- redirect termination,
- no redirect loop,
- historical identity resolvability,
- immutable identity continuity.

Blocking failures:

```text
DUPLICATE_SKILL_ID
DUPLICATE_SKILL_VERSION_ID
CANONICAL_KEY_COLLISION
ALIAS_COLLISION
IDENTITY_REDIRECT_LOOP
HISTORICAL_IDENTITY_UNRESOLVABLE
```

---

## 7. Schema Verification

Schema checks must validate:

- required fields,
- enum values,
- identifier formats,
- relationship payload shape,
- version compatibility,
- event envelope validity,
- projection contract shape,
- migration plan schema.

Unknown schema versions must block unless an approved compatibility reader or upcaster exists.

---

## 8. Provenance Verification

Every authoritative skill meaning and relationship must expose provenance.

Provenance checks include:

- source authority present,
- source reference resolvable,
- author or reviewer traceability,
- verification date,
- scope declaration,
- evidence classification,
- confidence classification,
- policy basis.

A relationship inferred only from usage data must not be promoted to authoritative prerequisite without explicit review and provenance.

---

## 9. Topology Verification

Topology checks include:

- node existence,
- endpoint existence,
- edge identity uniqueness,
- no orphan edge,
- no duplicate authoritative edge,
- no prohibited self-loop,
- cycle analysis,
- disconnected graph analysis,
- unreachable required node analysis,
- relationship type compatibility.

Hard prerequisite cycles are blocking.

Soft or contextual cycles may be permitted only when their semantics explicitly allow them and they do not create mandatory progression loops.

---

## 10. Semantic Verification

Semantic checks must prove:

- skill description is mathematically coherent,
- skill boundary is sufficiently precise,
- version change classification matches semantic change,
- localization preserves meaning,
- alias does not alter scope,
- merge and split mappings preserve declared meaning,
- approximate relationships are not represented as equivalence,
- curriculum placement is not misclassified as cognitive dependency.

Runtime law:

> Verification must not strengthen a claim beyond its evidence.

---

## 11. Prerequisite Verification

Prerequisite verification must inspect:

- prerequisite type,
- source and target versions,
- context scope,
- strength classification,
- evidence basis,
- alternative paths,
- recursion safety,
- cycle safety,
- learner-state independence.

It must reject:

- universal prerequisites derived only from one curriculum order,
- hard prerequisites inferred only from correlation,
- prerequisites attached to unresolved identities,
- prerequisite satisfaction rules that treat grade level as proof,
- policies that convert one correct response into stable readiness.

---

## 12. Temporal Verification

Temporal checks include:

- activation window validity,
- no invalid overlap,
- publication before activation,
- supersession ordering,
- retirement ordering,
- historical version availability,
- policy-effective interval validity.

Historical requests must resolve against explicit time or version boundaries.

---

## 13. Versioning Verification

Versioning checks must prove:

- semantic change creates a new SkillVersionId,
- label-only change does not falsely imply semantic change,
- published versions are immutable,
- superseded versions remain resolvable,
- current pointers do not rewrite historical references,
- graph version contains explicit node and edge versions,
- publication references one immutable graph version.

---

## 14. Publication Verification

Publication gates must prove:

```text
Identity readiness
Schema readiness
Provenance readiness
Topology readiness
Semantic readiness
Temporal readiness
Persistence readiness
Projection readiness
Security readiness
```

Publication must be blocked when any mandatory gate is:

```text
NOT_VERIFIED
BLOCKED
INCONCLUSIVE
```

Partial publication must not create partial authority unless the publication contract explicitly defines a safe bounded scope.

---

## 15. Projection Verification

Projection checks include:

- source graph version recorded,
- freshness state visible,
- node count parity,
- edge count parity,
- identity parity,
- audience filtering correctness,
- localization isolation,
- inference labeling,
- no hidden authority strengthening,
- deterministic rebuild checksum.

Projection ranking, filtering, or visual emphasis must not change graph truth.

---

## 16. Persistence Verification

Persistence checks include:

- monotonic aggregate version,
- event order,
- checksum validity,
- command idempotency,
- outbox atomicity,
- snapshot parity,
- archive accessibility,
- namespace isolation,
- immutable audit metadata.

A missing event in an authoritative stream is blocking.

---

## 17. Replay Verification

Replay checks must prove:

- deterministic reconstruction,
- recorded policy availability,
- schema compatibility,
- snapshot equivalence,
- graph topology parity,
- historical point-in-time parity,
- unknown event safety,
- divergence classification.

A replay result with unexplained divergence must not replace current authority.

---

## 18. Evolution Verification

Evolution plans include merge, split, replacement, deprecation, retirement, and semantic revision.

Verification must inspect:

- source identities,
- target identities,
- mapping semantics,
- historical preservation,
- curriculum impact,
- assessment impact,
- progress impact,
- recommendation impact,
- rollback plan,
- migration evidence.

Mapped learner evidence must not be silently upgraded into new mastery evidence.

---

## 19. Cross-Engine Verification

The runtime must verify boundaries with:

- Curriculum Runtime
- Learning Engine
- Assessment Engine
- Recommendation Engine
- Mission Engine
- Gameplay Runtime
- Progress Engine

Boundary laws:

- Curriculum placement does not create cognitive dependency.
- Assessment evidence does not rewrite graph meaning.
- Recommendation does not create graph authority.
- Progress state does not alter skill identity.
- Gameplay completion does not prove mastery.
- Skill Graph does not rewrite learner evidence.

---

## 20. Severity Levels

```text
INFO
WARNING
ERROR
BLOCKING
CRITICAL
```

Guidance:

- `INFO`: explanatory evidence.
- `WARNING`: non-blocking risk.
- `ERROR`: invalid but potentially isolated state.
- `BLOCKING`: prevents publication or activation.
- `CRITICAL`: threatens authority integrity or historical truth.

---

## 21. Finding Model

```text
findingId
verificationRunId
gateFamily
ruleId
severity
targetType
targetId
path
message
evidence
expected
actual
remediationHint
createdAt
```

Findings must be durable when they affect authority decisions.

---

## 22. Verification Profiles

Suggested profiles:

```text
DRAFT_FAST
REVIEW_STANDARD
PUBLICATION_STRICT
ACTIVATION_STRICT
MIGRATION_STRICT
REPLAY_FORENSIC
PROJECTION_PARITY
INCIDENT_RECOVERY
```

A weaker profile may not substitute for a stronger required gate.

---

## 23. Incremental Verification

Incremental verification may optimize changed graph regions, but must include all affected transitive constraints.

For a changed edge, verification may need to inspect:

- source node,
- target node,
- related prerequisite paths,
- cycle impact,
- publication scope,
- projection impact,
- downstream contract impact.

Incremental verification must never hide global topology violations.

---

## 24. Reverification Triggers

Reverification is required when:

- a skill meaning changes,
- an edge changes,
- a policy changes,
- a graph version changes,
- publication scope changes,
- schema interpretation changes,
- an upcaster changes,
- an evolution plan changes,
- replay divergence is detected,
- a critical provenance source is withdrawn.

---

## 25. Verification Caching

Verification results may be cached only when bound to:

```text
target checksum
verifier version
policy version
schema version
graph version
verification profile
```

Any mismatch invalidates the cache.

---

## 26. Failure Codes

```text
SKILL_VERIFY_IDENTITY_FAILED
SKILL_VERIFY_SCHEMA_FAILED
SKILL_VERIFY_PROVENANCE_FAILED
SKILL_VERIFY_TOPOLOGY_FAILED
SKILL_VERIFY_SEMANTIC_FAILED
SKILL_VERIFY_PREREQUISITE_FAILED
SKILL_VERIFY_TEMPORAL_FAILED
SKILL_VERIFY_VERSIONING_FAILED
SKILL_VERIFY_PUBLICATION_FAILED
SKILL_VERIFY_PROJECTION_FAILED
SKILL_VERIFY_PERSISTENCE_FAILED
SKILL_VERIFY_REPLAY_FAILED
SKILL_VERIFY_EVOLUTION_FAILED
SKILL_VERIFY_CROSS_ENGINE_FAILED
SKILL_VERIFY_INCONCLUSIVE
SKILL_VERIFY_BLOCKED
```

---

## 27. Runtime Invariants

1. Verification never invents authority.
2. Inconclusive results never count as success.
3. Published graph state must pass all mandatory gates.
4. Hard prerequisite cycles are blocked.
5. Historical identities must remain resolvable.
6. Approximation is never promoted to equivalence.
7. Correlation is never promoted to causation without authority.
8. Projection parity must be verifiable.
9. Replay divergence must remain visible.
10. Cross-engine data cannot rewrite graph authority.
11. Cached verification is valid only for identical inputs and policies.
12. Verification evidence is durable when it governs authority.

---

## 28. Completion Criteria

32H is complete when the implementation can demonstrate:

- identity verification,
- schema verification,
- provenance verification,
- topology and cycle verification,
- semantic verification,
- prerequisite verification,
- publication gating,
- projection parity verification,
- persistence verification,
- replay verification,
- evolution verification,
- cross-engine boundary verification,
- durable findings,
- reproducible outcomes.
