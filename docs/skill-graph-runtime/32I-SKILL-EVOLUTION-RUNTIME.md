# 32I — Skill Evolution Runtime

## 1. Purpose

This runtime defines how skills and graph relationships evolve without erasing history, breaking downstream references, or converting uncertain mappings into stronger semantic claims.

Skill evolution includes:

- semantic revision,
- split,
- merge,
- replacement,
- deprecation,
- retirement,
- alias change,
- namespace transition,
- relationship evolution,
- graph version migration.

---

## 2. Core Evolution Law

> Skill evolution changes future authority; it does not rewrite historical truth.

Historical evidence, assessments, curriculum mappings, recommendations, and learner progress remain bound to the skill versions that existed when those records were created.

---

## 3. Evolution Plan

Every authoritative evolution must be represented by an explicit plan:

```text
evolutionPlanId
evolutionType
authorityNamespace
sourceSkillIds
sourceSkillVersionIds
targetSkillIds
targetSkillVersionIds
sourceGraphVersionId
targetGraphVersionId
mappingSemantics
reason
provenance
createdBy
reviewedBy
approvedAt
effectiveAt
rollbackStrategy
status
```

Statuses:

```text
DRAFT
UNDER_REVIEW
APPROVED
SCHEDULED
EXECUTING
COMPLETED
PARTIALLY_COMPLETED
FAILED
ROLLED_BACK
SUPERSEDED
```

---

## 4. Evolution Types

Canonical types:

```text
SEMANTIC_REVISION
SKILL_SPLIT
SKILL_MERGE
SKILL_REPLACEMENT
SKILL_DEPRECATION
SKILL_RETIREMENT
CANONICAL_KEY_CHANGE
ALIAS_CHANGE
NAMESPACE_TRANSFER
RELATIONSHIP_REVISION
GRAPH_RESTRUCTURE
```

Each type has distinct verification and migration requirements.

---

## 5. Mapping Semantics

Mappings must declare one of:

```text
SAME_MEANING
MEANING_PRESERVED_WITH_REFINEMENT
APPROXIMATELY_EQUIVALENT
SOURCE_BROADER
SOURCE_NARROWER
SPLIT_INTO_MULTIPLE
MERGED_FROM_MULTIPLE
REPLACED_WITH_SEMANTIC_CHANGE
DISPLAY_ONLY_CHANGE
NO_SAFE_MAPPING
```

Runtime laws:

- approximate mapping is not equivalence,
- split and merge do not imply automatic mastery transfer,
- semantic change requires a new SkillVersionId,
- no-safe-mapping must remain explicit,
- historical references must never silently float to the target.

---

## 6. Semantic Revision

A semantic revision is required when any of these change:

- mathematical scope,
- required reasoning,
- allowed representations,
- success criteria,
- prerequisite meaning,
- domain applicability,
- transfer expectations.

A semantic revision must create a new `SkillVersionId`.

A label-only or translation-only change may remain within the same version only when verification proves meaning is unchanged.

---

## 7. Skill Split

A split occurs when one historical skill becomes two or more future skills.

Required declarations:

```text
sourceSkillVersionId
targetSkillVersionIds
partitionRationale
coverageMap
overlapMap
unmappedMeaning
historicalResolutionPolicy
learnerEvidencePolicy
curriculumImpact
assessmentImpact
```

Rules:

- source history remains resolvable,
- targets receive new identities,
- prior evidence may be inherited only as contextual evidence,
- prior mastery must not be duplicated into all targets,
- ambiguous coverage must remain explicit.

---

## 8. Skill Merge

A merge occurs when multiple historical skills become one future skill.

Required declarations:

```text
sourceSkillVersionIds
targetSkillVersionId
mergeRationale
semanticUnion
semanticLoss
conflictResolution
learnerEvidencePolicy
```

Rules:

- source identities remain historical authorities,
- target identity is new unless one source meaning is strictly preserved,
- mastery of one source does not prove mastery of the merged target,
- combined evidence may support inference but not manufacture proof.

---

## 9. Skill Replacement

Replacement indicates that a future skill supersedes a prior one.

Replacement types:

```text
DIRECT_SUCCESSOR
REFINED_SUCCESSOR
BROADER_SUCCESSOR
NARROWER_SUCCESSOR
CONCEPTUAL_REDESIGN
NO_DIRECT_SUCCESSOR
```

A replacement pointer improves navigation. It does not alter historical bindings.

---

## 10. Deprecation and Retirement

Deprecation means:

- the skill remains valid for history,
- new authoritative use is discouraged,
- a replacement may exist.

Retirement means:

- the skill is no longer valid for new graph publication,
- historical resolution remains available,
- downstream systems must not delete old references.

States:

```text
ACTIVE
DEPRECATED
RETIRED
REVOKED
```

`REVOKED` is reserved for invalid authority and must include a durable explanation.

---

## 11. Canonical Key and Alias Evolution

Canonical keys may change for naming governance, but:

- `SkillId` remains stable when meaning remains stable,
- old keys become historical aliases or redirects,
- redirect loops are prohibited,
- aliases must be scoped,
- display labels never become identity authority.

---

## 12. Relationship Evolution

Relationship changes include:

- strength change,
- type change,
- context restriction,
- provenance update,
- withdrawal,
- replacement,
- endpoint version change.

A changed relationship meaning requires a new relationship version or identity.

A withdrawn prerequisite remains inspectable in historical graph versions.

---

## 13. Graph Version Transition

A graph evolution produces a new immutable graph version.

The transition must include:

```text
sourceGraphVersionId
targetGraphVersionId
changedNodeIds
changedEdgeIds
addedNodeIds
removedNodeIds
mappingIds
verificationRunId
publicationPlanId
```

The target graph version must pass publication verification before activation.

---

## 14. Learner Evidence Policy

Evolution may classify existing learner evidence as:

```text
DIRECTLY_APPLICABLE
PARTIALLY_APPLICABLE
CONTEXT_ONLY
REQUIRES_REASSESSMENT
NOT_APPLICABLE
INCONCLUSIVE
```

Runtime laws:

- mapped progress does not create new mastery evidence,
- old evidence remains attached to its original SkillVersionId,
- reassessment requirements must be explicit,
- uncertainty must remain visible,
- progression decisions belong to the Progress Engine and Assessment Engine.

---

## 15. Curriculum Mapping Impact

Skill evolution must identify curriculum references that are:

```text
UNAFFECTED
REQUIRES_REBINDING
REQUIRES_REVIEW
TEMPORARILY_COMPATIBLE
INCOMPATIBLE
```

Curriculum Runtime retains authority over curriculum placement. Skill Evolution may propose mappings but cannot rewrite curriculum authority independently.

---

## 16. Assessment Impact

Evolution must identify:

- affected item mappings,
- obsolete scoring assumptions,
- changed prerequisite interpretation,
- reassessment needs,
- version compatibility.

Historical assessment results remain bound to original skill versions and scoring policies.

---

## 17. Recommendation Impact

Recommendation Engine may consume evolution mappings to avoid obsolete suggestions, but:

- it must expose mapping uncertainty,
- it must not treat approximate mappings as equivalent,
- it must not rewrite historical recommendations,
- it must bind new recommendations to target graph version.

---

## 18. Mission and Gameplay Impact

Evolution plans must identify missions and gameplay surfaces that reference changed skills.

Mission completion and gameplay completion remain historical facts. They are not retroactively invalidated merely because graph structure evolves.

---

## 19. Execution Workflow

Recommended workflow:

```text
Propose evolution
Resolve identities
Classify mapping semantics
Analyze downstream impact
Verify plan
Create target graph version
Run shadow migration
Compare projections
Publish target graph
Activate target graph
Monitor downstream adoption
Close evolution plan
```

---

## 20. Shadow Evolution

Before activation, the runtime should support shadow evaluation of:

- graph topology,
- prerequisite paths,
- curriculum mappings,
- learner projections,
- recommendation outputs,
- assessment compatibility,
- progress interpretations.

Shadow results must not become authority until approved.

---

## 21. Rollback

Rollback may:

- restore a prior graph version as active,
- withdraw the target publication,
- suspend downstream adoption,
- record corrective mappings.

Rollback must not:

- delete evolution events,
- erase target graph history,
- rewrite learner evidence,
- pretend the evolution never occurred.

---

## 22. Partial Failure

Evolution execution may fail after some downstream systems have adopted the target.

The runtime must record:

```text
adoptionStatusByEngine
completedMappings
failedMappings
pendingMappings
rollbackStatus
incidentId
```

Partial completion must remain visible and must block claims of full migration success.

---

## 23. Concurrency and Idempotency

Evolution commands must use:

- expected graph version,
- expected evolution plan version,
- command idempotency key,
- immutable execution step identifiers.

Duplicate execution must not create duplicate identities, mappings, publications, or migration effects.

---

## 24. Evolution Events

Examples:

```text
SkillEvolutionProposed
SkillEvolutionApproved
SkillSplitPlanned
SkillSplitExecuted
SkillMergePlanned
SkillMergeExecuted
SkillReplacementDeclared
SkillDeprecated
SkillRetired
RelationshipEvolutionApplied
TargetGraphVersionCreated
EvolutionShadowRunCompleted
EvolutionActivated
EvolutionFailed
EvolutionRolledBack
EvolutionCompleted
```

---

## 25. Verification Gates

An evolution plan must pass:

```text
Identity gate
Semantic gate
Mapping gate
Topology gate
Historical preservation gate
Curriculum impact gate
Assessment impact gate
Progress impact gate
Recommendation impact gate
Replay gate
Rollback gate
Publication gate
```

Any mandatory `INCONCLUSIVE` result blocks activation.

---

## 26. Failure Codes

```text
SKILL_EVOLUTION_IDENTITY_CONFLICT
SKILL_EVOLUTION_MAPPING_INVALID
SKILL_EVOLUTION_SEMANTIC_AMBIGUITY
SKILL_EVOLUTION_HISTORY_BREAK
SKILL_EVOLUTION_GRAPH_INVALID
SKILL_EVOLUTION_DOWNSTREAM_BLOCKED
SKILL_EVOLUTION_REPLAY_DIVERGENCE
SKILL_EVOLUTION_ROLLBACK_UNAVAILABLE
SKILL_EVOLUTION_VERSION_CONFLICT
SKILL_EVOLUTION_PARTIAL_FAILURE
SKILL_EVOLUTION_INCONCLUSIVE
```

---

## 27. Runtime Invariants

1. Evolution never rewrites historical skill truth.
2. Semantic change creates a new SkillVersionId.
3. Historical references never silently float.
4. Approximate mapping is never equivalence.
5. Split does not duplicate mastery.
6. Merge does not manufacture combined mastery.
7. Old evidence remains bound to its original version.
8. Target graph activation requires verification.
9. Rollback preserves evolution history.
10. Partial failure remains visible.
11. Cross-engine authority boundaries remain intact.
12. No-safe-mapping remains an acceptable explicit outcome.

---

## 28. Completion Criteria

32I is complete when the implementation can demonstrate:

- explicit evolution plans,
- semantic version creation,
- split and merge handling,
- replacement and retirement,
- relationship evolution,
- graph version transition,
- learner evidence classification,
- downstream impact analysis,
- shadow evolution,
- rollback,
- partial failure reporting,
- deterministic replay,
- durable historical resolution.
