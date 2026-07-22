# 32B — Skill Identity Runtime

## 1. Purpose

Skill Identity Runtime defines how a mathematical capability is named, distinguished, versioned, resolved, and preserved across curriculum changes, localization, content redesign, and long-term learner history.

Its purpose is to prevent unstable labels from becoming unstable meaning.

## 2. Identity Layers

The runtime separates four identity layers:

```text
SkillId
  Stable conceptual identity across versions

SkillVersionId
  Immutable meaning at a specific version

CanonicalKey
  Human-manageable stable key within an authority namespace

Display Label
  Localized, audience-specific presentation text
```

Display labels are never authoritative identifiers.

## 3. Canonical Identity Contract

```ts
type SkillIdentity = {
  skillId: string;
  namespace: string;
  canonicalKey: string;
  domain: string;
  ownerAuthorityId: string;
  lifecycleState: 'ACTIVE' | 'RETIRED' | 'REVOKED';
  createdAt: string;
  retiredAt?: string;
};
```

Uniqueness law:

```text
(namespace, canonicalKey) must identify at most one SkillId.
```

A canonical key may be renamed only through an explicit alias or redirect record. It must not be silently reused for a different skill.

## 4. Skill Version Contract

```ts
type SkillMeaningVersion = {
  skillVersionId: string;
  skillId: string;
  versionNumber: number;
  capabilityStatement: string;
  inclusionBoundary: string[];
  exclusionBoundary: string[];
  representationForms: string[];
  expectedAbstractionLevel: string;
  lifecycleState:
    | 'DRAFT'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'PUBLISHED'
    | 'SUPERSEDED'
    | 'RETIRED'
    | 'REVOKED';
  meaningHash: string;
  provenance: ProvenanceReference[];
  createdAt: string;
};
```

The meaning hash covers semantically authoritative fields. Presentation-only changes must be excluded or separately versioned.

## 5. Capability Boundary

Every published skill version must state:

- what the learner can do or understand;
- valid representations;
- included cases;
- excluded cases;
- abstraction level;
- whether fluency, recognition, explanation, construction, or transfer is expected;
- known nearby capabilities that must not be conflated.

Example distinction:

```text
Solve one-step additive equations
≠
Interpret equality as relational balance
≠
Translate a word situation into an equation
```

These may relate closely but remain independently identifiable capabilities.

## 6. Semantic Change Classification

Every revision request must be classified as one of:

```text
PRESENTATION_ONLY
CLARIFICATION_NO_MEANING_CHANGE
BOUNDARY_REFINEMENT_COMPATIBLE
SEMANTIC_EXPANSION
SEMANTIC_NARROWING
SEMANTIC_REPLACEMENT
ERROR_CORRECTION
```

Rules:

- Presentation-only changes may update a presentation projection.
- Clarifications require an audit record and unchanged meaning hash.
- Compatible boundary refinement requires verification.
- Expansion, narrowing, and replacement require a new SkillVersionId.
- Error correction never erases the published prior record.

## 7. Alias and Redirect Model

Aliases improve discovery but do not change authority.

```ts
type SkillAlias = {
  aliasId: string;
  namespace: string;
  aliasText: string;
  targetSkillId: string;
  locale?: string;
  aliasType: 'SYNONYM' | 'LEGACY_KEY' | 'SEARCH_TERM' | 'REDIRECT';
  status: 'ACTIVE' | 'RETIRED';
};
```

A redirect must preserve the original identifier in audit trails.
Alias resolution must never silently convert one historical SkillVersionId into another.

## 8. Localization

Localization may change:

- title;
- short description;
- explanatory wording;
- examples chosen for culture or language;
- notation rendering where mathematically equivalent.

Localization must not change:

- SkillId;
- SkillVersionId;
- capability boundary;
- dependency meaning;
- abstraction level;
- authoritative provenance.

A localization that changes mathematical meaning is a new semantic version, not a translation.

## 9. Duplicate Detection

Duplicate detection is advisory until verified by authority.

Signals may include:

- similar canonical keys;
- overlapping capability statements;
- identical examples;
- equivalent graph neighborhoods;
- same curriculum mappings;
- embedding similarity.

Possible outcomes:

```text
DISTINCT
OVERLAPPING_BUT_DISTINCT
DUPLICATE_CANDIDATE
SAME_SKILL_DIFFERENT_VERSION
INSUFFICIENT_EVIDENCE
```

Automated similarity must never merge skills automatically.

## 10. Resolution Contract

```ts
type ResolveSkillRequest = {
  skillId?: string;
  skillVersionId?: string;
  canonicalKey?: string;
  namespace?: string;
  asOf?: string;
  versionPolicy: 'EXACT' | 'ACTIVE_AT_TIME' | 'LATEST_PUBLISHED';
};
```

Resolution laws:

1. EXACT must return the requested version or fail.
2. ACTIVE_AT_TIME must use temporal authority and return evidence of the selected version.
3. LATEST_PUBLISHED must be explicit and must return the resolved version identity.
4. Historical reads never default to current meaning when a historical version is known.
5. Ambiguous aliases fail rather than guess.

## 11. Ownership and Namespace

Namespaces prevent accidental collision between national, institutional, research, and platform-defined skill authorities.

Examples:

```text
th.core.math
platform.math.foundation
institution.school-123.math
research.project-x.math
```

Cross-namespace equivalence requires explicit alignment records. Shared wording alone does not create shared identity.

## 12. Merge and Split Evolution

Skill identity may evolve through explicit operations:

```text
MERGE
SPLIT
REPLACE
DEPRECATE
RENAME_KEY
TRANSFER_AUTHORITY
```

A merge creates a new or selected surviving identity plus mappings from prior skills.
A split creates multiple target identities and preserves the source identity historically.
Neither operation rewrites old learner evidence.

## 13. Historical Evidence Binding

Assessment, progress, recommendation, and mission records must bind to the SkillVersionId used at the time.

Later evolution may add interpretation mappings, but must not mutate the original evidence reference.

```text
Historical evidence + old SkillVersionId
        │
        └── optional evolution interpretation
                │
                └── never replaces original reference
```

## 14. Commands

```text
CreateSkillIdentity
CreateSkillMeaningVersion
ClassifySkillRevision
ApproveSkillMeaningVersion
PublishSkillMeaningVersion
AddSkillAlias
RetireSkillAlias
RenameCanonicalKey
MergeSkillIdentities
SplitSkillIdentity
ReplaceSkillIdentity
RetireSkillIdentity
RevokeSkillIdentity
ResolveSkillIdentity
```

## 15. Events

```text
SkillIdentityCreated
SkillMeaningVersionCreated
SkillRevisionClassified
SkillMeaningVersionApproved
SkillMeaningVersionPublished
SkillAliasAdded
SkillAliasRetired
CanonicalKeyRenamed
SkillIdentitiesMerged
SkillIdentitySplit
SkillIdentityReplaced
SkillIdentityRetired
SkillIdentityRevoked
```

## 16. Failure Codes

```text
SKILL_IDENTITY_NOT_FOUND
SKILL_VERSION_NOT_FOUND
CANONICAL_KEY_ALREADY_USED
CANONICAL_KEY_REUSE_FORBIDDEN
AMBIGUOUS_ALIAS
ALIAS_TARGET_NOT_FOUND
SEMANTIC_CHANGE_REQUIRES_NEW_VERSION
MEANING_HASH_MISMATCH
INVALID_CAPABILITY_BOUNDARY
INVALID_NAMESPACE
HISTORICAL_VERSION_REQUIRED
EXACT_VERSION_UNAVAILABLE
IDENTITY_EVOLUTION_CONFLICT
CONCURRENT_MODIFICATION
```

## 17. Runtime Invariants

1. SkillId is stable across compatible meaning versions.
2. SkillVersionId identifies one immutable published meaning.
3. Canonical keys are unique inside their namespace.
4. Retired keys are not silently recycled.
5. Display labels do not establish identity.
6. Localization does not change mathematical meaning.
7. Semantic change creates a new version.
8. Merge and split operations preserve historical references.
9. Automated duplicate detection cannot mutate identity.
10. Every resolver response exposes the selected SkillId and SkillVersionId.

## 18. Completion Gate

32B is complete when skill identity, semantic versioning, aliases, localization, duplicate handling, resolution, namespace ownership, evolution, historical binding, commands, events, failures, and invariants are explicitly defined.
