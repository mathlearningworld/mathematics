# 32A — Skill Graph Runtime Foundation

## 1. Purpose

Skill Graph Runtime is the authoritative runtime for representing mathematical capabilities as stable skill identities connected through explicit, typed relationships.

It exists to answer questions that grade labels, lesson order, and test scores cannot answer reliably:

- What exact capability does a learner need?
- Which prior capabilities does it depend on?
- Which missing foundation most plausibly explains a failure?
- Which skills are conceptually related but not valid prerequisites?
- Which path advances understanding without skipping hidden dependencies?

The runtime is the structural foundation for detecting and repairing understanding debt.

## 2. Runtime Position

Skill Graph Runtime sits between Curriculum Runtime and the learner-facing engines.

```text
Curriculum Runtime
        │
        ▼
Skill Graph Runtime
        │
        ├── Learning Engine
        ├── Assessment Engine
        ├── Recommendation Engine
        ├── Mission Engine
        ├── Progress Engine
        └── Gameplay Runtime
```

Curriculum Runtime says what an authorized curriculum expects.
Skill Graph Runtime says what capabilities exist and how those capabilities depend on one another.
Learner engines may consume this structure, but they must not rewrite it implicitly.

## 3. Core Authority Boundary

Skill Graph Runtime owns:

- stable skill identity;
- skill version identity;
- canonical skill meaning;
- typed graph relationships;
- prerequisite semantics;
- dependency confidence and provenance;
- graph publication state;
- graph projections;
- graph verification;
- persistence and replay;
- controlled skill evolution.

It does not own:

- learner mastery truth;
- assessment evidence truth;
- recommendation decisions;
- curriculum authority;
- lesson content ownership;
- gameplay reward meaning;
- institutional grading policy.

## 4. Fundamental Distinctions

The following meanings must never be collapsed:

```text
Skill ≠ Lesson
Skill ≠ Curriculum Node
Skill ≠ Question
Skill ≠ Score
Skill ≠ Mastery State
Skill Relationship ≠ Learner Diagnosis
Prerequisite ≠ Mere Correlation
Curriculum Placement ≠ Cognitive Dependency
```

A skill may be taught in many lessons.
A curriculum node may reference many skills.
A question may exercise several skills.
A learner may fail a question for reasons not represented by a direct prerequisite edge.

## 5. Canonical Skill Model

A skill identity represents one stable mathematical capability across time.

```ts
type SkillId = string;
type SkillVersionId = string;

type Skill = {
  skillId: SkillId;
  canonicalKey: string;
  domain: string;
  status: SkillStatus;
  createdAt: string;
};

type SkillVersion = {
  skillVersionId: SkillVersionId;
  skillId: SkillId;
  version: number;
  title: string;
  definition: string;
  capabilityStatement: string;
  boundaryNotes: string[];
  examples: string[];
  nonExamples: string[];
  provenance: ProvenanceReference[];
  lifecycleState: SkillVersionLifecycleState;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt: string;
};
```

The capability statement must describe what a learner can understand or do, not merely the content label of a chapter.

## 6. Skill Lifecycle

```text
DRAFT
UNDER_REVIEW
APPROVED
PUBLISHED
ACTIVE
SUPERSEDED
RETIRED
REVOKED
```

Lifecycle laws:

1. Draft meaning may change.
2. Published meaning must not be rewritten in place.
3. Semantic change requires a new skill version.
4. Identity replacement requires an explicit evolution record.
5. Retirement does not erase historical references.
6. Revocation blocks authoritative use but preserves audit history.

## 7. Graph Relationship Model

Every graph edge must have an explicit relationship type.

```ts
type SkillRelationshipType =
  | 'HARD_PREREQUISITE'
  | 'SOFT_PREREQUISITE'
  | 'CO_REQUISITE'
  | 'PART_OF'
  | 'SPECIALIZES'
  | 'GENERALIZES'
  | 'SUPPORTS'
  | 'COMMON_CONFUSION_WITH'
  | 'TRANSFER_RELEVANT_TO'
  | 'CONTRASTS_WITH';
```

An edge must include:

- source skill version;
- target skill version;
- relationship type;
- direction;
- rationale;
- confidence;
- provenance;
- lifecycle state;
- effective period;
- verification state.

No unlabeled edge is authoritative.

## 8. Dependency Semantics

A prerequisite edge is not a statement that every learner will fail without the source skill.
It is a structural statement that the target capability normally relies on the source capability under a defined interpretation.

```text
HARD_PREREQUISITE
The target capability cannot be interpreted or performed reliably without the source capability.

SOFT_PREREQUISITE
The source capability materially improves access to the target but may be bypassed in some contexts.

CO_REQUISITE
The capabilities are normally developed together and should not be treated as a strict one-way chain.
```

Dependency meaning must be documented, versioned, and reviewable.

## 9. Graph Identity

A published graph is a versioned authority object.

```ts
type SkillGraphVersion = {
  graphVersionId: string;
  version: number;
  skillVersionIds: SkillVersionId[];
  relationshipIds: string[];
  publicationState: GraphPublicationState;
  provenance: ProvenanceReference[];
  effectiveFrom?: string;
  effectiveTo?: string;
};
```

A graph version may reference immutable skill versions and relationship versions.
Published graph meaning must never float silently to newer skill versions.

## 10. Curriculum Integration

Curriculum alignment is explicit and directional.

```text
Curriculum Node → requires / introduces / reinforces → Skill Version
```

The skill graph must not infer curriculum authority from graph structure.
The curriculum runtime must not infer cognitive dependency merely from curriculum order.

Alignment types include:

```text
INTRODUCES
DEVELOPS
REINFORCES
EXPECTS
ASSESSES
OPTIONAL_EXTENSION
```

## 11. Learner Runtime Integration

Learner-specific engines consume graph authority through version-pinned references.

Examples:

```text
Assessment Evidence → observed against SkillVersionId
Progress State      → tracked against SkillId + evidence interpretation policy
Recommendation      → justified using graph path + learner evidence
Mission             → targets one or more SkillVersionIds
Learning Activity   → declares intended skill coverage
```

The graph may support diagnosis, but diagnosis remains an inference owned by learner-facing runtime policy.

## 12. Understanding Debt

Understanding debt is not stored as a permanent property of a learner or a skill.
It is a time-bound inference derived from evidence and graph structure.

A valid understanding-debt analysis requires:

- explicit target skill;
- pinned graph version;
- learner evidence set;
- prerequisite path;
- diagnostic policy version;
- confidence;
- competing explanations;
- expiry or reevaluation rule.

The graph provides dependency structure, not certainty about learner causation.

## 13. Runtime Commands

```text
CreateSkill
CreateSkillVersion
SubmitSkillVersionForReview
ApproveSkillVersion
PublishSkillVersion
RetireSkillVersion
CreateRelationship
ReviewRelationship
PublishRelationship
CreateGraphVersion
VerifyGraphVersion
PublishGraphVersion
WithdrawGraphVersion
MapCurriculumNodeToSkill
RecordSkillEvolution
```

Every command must include actor, tenant or authority context where applicable, correlation identity, expected version, and idempotency identity.

## 14. Runtime Events

```text
SkillCreated
SkillVersionCreated
SkillVersionApproved
SkillVersionPublished
SkillVersionSuperseded
SkillVersionRetired
RelationshipCreated
RelationshipApproved
RelationshipPublished
GraphVersionCreated
GraphVersionVerified
GraphVersionPublished
GraphVersionWithdrawn
CurriculumSkillAlignmentCreated
SkillEvolutionRecorded
```

Events are append-only authority facts.
Snapshots and projections are rebuildable derivatives.

## 15. Failure Model

Representative failure codes:

```text
SKILL_NOT_FOUND
SKILL_VERSION_NOT_FOUND
DUPLICATE_CANONICAL_KEY
INVALID_CAPABILITY_BOUNDARY
RELATIONSHIP_ENDPOINT_MISSING
RELATIONSHIP_TYPE_INVALID
SELF_DEPENDENCY_NOT_ALLOWED
DEPENDENCY_CYCLE_DETECTED
GRAPH_VERSION_NOT_VERIFIED
GRAPH_PUBLICATION_BLOCKED
VERSION_FLOATING_NOT_ALLOWED
PROVENANCE_REQUIRED
CONCURRENT_MODIFICATION
IDEMPOTENCY_CONFLICT
```

Failures must distinguish invalid requests, policy refusal, concurrency conflicts, missing authority, and temporary infrastructure failure.

## 16. Non-Negotiable Laws

1. Stable skill identity is separate from skill version meaning.
2. Published skill meaning is immutable.
3. Every authoritative edge is typed, directional, versioned, and sourced.
4. Curriculum sequence does not automatically establish prerequisite truth.
5. Correlation does not automatically establish dependency.
6. A graph path does not prove learner causation.
7. Learner mastery is never manufactured from graph placement.
8. Explicit version requests never silently float.
9. Historical references survive supersession and retirement.
10. Unknown graph events are never silently ignored.

## 17. Completion Gate

32A is complete when the repository has an explicit authority boundary, canonical identity model, relationship vocabulary, lifecycle model, integration rules, commands, events, failures, and non-negotiable runtime laws for all later Skill Graph slices.
