# 32C — Dependency Graph Runtime

## 1. Purpose

Dependency Graph Runtime defines how skills are connected through explicit, reviewable, versioned relationships that represent mathematical dependency rather than mere curricular sequence or statistical association.

Its purpose is to make hidden learning structure visible without overstating certainty.

## 2. Graph Authority

The dependency graph is an authoritative structural model only after its nodes and edges are approved and published.

It owns:

- relationship identity;
- relationship type;
- direction;
- endpoint versions;
- rationale;
- confidence;
- provenance;
- lifecycle;
- graph version membership;
- cycle policy;
- path semantics.

It does not own learner diagnosis or mastery.

## 3. Relationship Contract

```ts
type SkillDependencyRelationship = {
  relationshipId: string;
  relationshipVersionId: string;
  sourceSkillVersionId: string;
  targetSkillVersionId: string;
  relationshipType:
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
  directionality: 'DIRECTED' | 'SYMMETRIC';
  rationale: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  provenance: ProvenanceReference[];
  verificationState: 'UNVERIFIED' | 'VERIFIED' | 'REJECTED' | 'INCONCLUSIVE';
  lifecycleState: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'SUPERSEDED' | 'RETIRED' | 'REVOKED';
  effectiveFrom?: string;
  effectiveTo?: string;
};
```

## 4. Direction Semantics

For prerequisite relationships:

```text
source → target
```

means the source capability supports access to the target capability.

Direction must never be inferred from display order.
Symmetric relationship types must be declared explicitly.

## 5. Relationship Type Laws

### HARD_PREREQUISITE
The target cannot normally be interpreted or performed reliably without the source.

### SOFT_PREREQUISITE
The source materially improves readiness but is not universally required.

### CO_REQUISITE
The skills normally develop together and should not be forced into a false one-way chain.

### PART_OF
The source is a constituent capability within a broader target capability.

### SPECIALIZES / GENERALIZES
These express abstraction hierarchy, not learner order.

### SUPPORTS
The source aids the target but does not meet prerequisite strength.

### COMMON_CONFUSION_WITH
The pair is diagnostically relevant because learners may conflate meanings.

### TRANSFER_RELEVANT_TO
Understanding one skill may support transfer to another domain or representation.

### CONTRASTS_WITH
The relationship clarifies boundaries between nearby capabilities.

## 6. Edge Provenance

Every published edge must cite at least one provenance source, such as:

- curriculum standard;
- domain expert review;
- research evidence;
- validated learning sequence;
- formal mathematical dependency analysis;
- controlled platform observation.

Platform observation alone may suggest an edge but cannot automatically publish it as hard prerequisite authority.

## 7. Confidence and Evidence

Confidence records strength of support for the graph claim, not certainty about every learner.

A relationship confidence decision should consider:

- conceptual necessity;
- empirical consistency;
- expert agreement;
- context sensitivity;
- alternative pathways;
- representation dependence.

Confidence must be independently reviewable from relationship type.

## 8. Graph Version Contract

```ts
type DependencyGraphVersion = {
  graphVersionId: string;
  versionNumber: number;
  nodeVersionIds: string[];
  relationshipVersionIds: string[];
  lifecycleState:
    | 'DRAFT'
    | 'UNDER_REVIEW'
    | 'VERIFIED'
    | 'PUBLISHED'
    | 'SUPERSEDED'
    | 'WITHDRAWN';
  graphHash: string;
  createdAt: string;
  publishedAt?: string;
};
```

A published graph pins exact node and edge versions.

## 9. Cycle Policy

Cycles are evaluated by relationship semantics.

Forbidden by default:

```text
HARD_PREREQUISITE cycles
```

Potentially valid with explicit review:

```text
CO_REQUISITE clusters
SUPPORTS cycles
COMMON_CONFUSION_WITH symmetric links
TRANSFER_RELEVANT_TO cycles
```

A cycle detector must distinguish relationship types rather than treating all edges alike.

## 10. Path Semantics

A graph path is a sequence of typed relationships, not a universal learning prescription.

```ts
type DependencyPath = {
  graphVersionId: string;
  sourceSkillVersionId: string;
  targetSkillVersionId: string;
  steps: Array<{
    relationshipVersionId: string;
    relationshipType: string;
    fromSkillVersionId: string;
    toSkillVersionId: string;
  }>;
  pathStrength: 'REQUIRED' | 'PREFERRED' | 'SUPPORTIVE' | 'MIXED';
};
```

Path strength must derive from edge semantics and policy version.

## 11. Alternative Pathways

The graph must support multiple valid prerequisite routes.

Example:

```text
Target Skill
 ├── Path A: symbolic reasoning
 └── Path B: visual proportional reasoning
```

Alternative pathways must remain visible. The runtime must not collapse them into one arbitrary canonical sequence unless policy explicitly requires one.

## 12. Contextual Dependencies

Some dependencies apply only under a defined context.

```ts
type RelationshipContext = {
  representation?: string;
  ageBand?: string;
  curriculumAuthorityId?: string;
  language?: string;
  taskType?: string;
  toolAvailability?: string;
};
```

A contextual edge must not be projected as universal.

## 13. Graph Queries

Supported queries include:

```text
GetDirectPrerequisites
GetAllAncestors
GetAllDescendants
FindDependencyPaths
FindAlternativePaths
GetCoRequisiteCluster
FindPotentialCycles
GetRelationshipEvidence
CompareGraphVersions
GetGraphNeighborhood
```

Every query response must return the graph version used.

## 14. Commands

```text
CreateDependencyRelationship
ReviseDependencyRelationship
SubmitRelationshipForReview
ApproveDependencyRelationship
PublishDependencyRelationship
RetireDependencyRelationship
CreateDependencyGraphVersion
AddRelationshipToGraphVersion
RemoveRelationshipFromDraftGraphVersion
VerifyDependencyGraphVersion
PublishDependencyGraphVersion
WithdrawDependencyGraphVersion
```

## 15. Events

```text
DependencyRelationshipCreated
DependencyRelationshipRevised
DependencyRelationshipApproved
DependencyRelationshipPublished
DependencyRelationshipRetired
DependencyGraphVersionCreated
RelationshipAddedToGraphVersion
RelationshipRemovedFromDraftGraphVersion
DependencyGraphVersionVerified
DependencyGraphVersionPublished
DependencyGraphVersionWithdrawn
```

## 16. Failure Codes

```text
RELATIONSHIP_NOT_FOUND
RELATIONSHIP_VERSION_NOT_FOUND
INVALID_RELATIONSHIP_TYPE
INVALID_DIRECTIONALITY
RELATIONSHIP_ENDPOINT_MISSING
SELF_RELATIONSHIP_FORBIDDEN
HARD_PREREQUISITE_CYCLE
UNSUPPORTED_CONTEXT_SCOPE
PROVENANCE_REQUIRED
RELATIONSHIP_NOT_VERIFIED
GRAPH_VERSION_HASH_MISMATCH
GRAPH_VERSION_NOT_VERIFIED
PUBLISHED_GRAPH_IMMUTABLE
VERSION_FLOATING_NOT_ALLOWED
CONCURRENT_MODIFICATION
```

## 17. Runtime Invariants

1. Every authoritative edge has explicit type and directionality.
2. Published edges pin exact endpoint versions.
3. Hard prerequisite cycles are blocked unless future policy explicitly models a different semantic structure.
4. Relationship confidence does not equal learner-level certainty.
5. Curriculum order does not automatically create an edge.
6. Statistical association does not automatically create prerequisite authority.
7. Contextual edges are never projected as universal.
8. Published graph versions are immutable.
9. Every path query exposes graph version and edge identities.
10. Alternative pathways are preserved unless explicitly retired.

## 18. Completion Gate

32C is complete when relationship contracts, semantics, provenance, confidence, graph versioning, cycle rules, path interpretation, contextual dependencies, queries, commands, events, failures, and invariants are defined.
