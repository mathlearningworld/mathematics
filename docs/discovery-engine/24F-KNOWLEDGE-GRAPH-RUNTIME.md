# Chapter 24 — Discovery Engine Architecture

# 24F — Knowledge Graph Runtime

## Status

- Chapter: 24
- Slice: 24F
- Authority: Discovery Engine Architecture
- Scope: concept identity, semantic relationships, prerequisite links, representation links, discovery lineage, graph evolution, and runtime invariants

## Purpose

The Knowledge Graph Runtime defines how discovered concepts, patterns, representations, and supporting evidence are related without reducing mathematics to a flat checklist.

It provides a semantic map that higher-level systems can query when deciding what evidence is relevant, what transfer means, which misconceptions are nearby, and which future experiences may be meaningful.

## Core Principle

> The graph represents relationships between concepts and evidence; it does not manufacture understanding from connectivity alone.

A connected node is not mastered. A prerequisite edge is not proof that a learner has satisfied it.

## Runtime Position

```text
Concept Definitions
  + Pattern Definitions
  + Representation Definitions
  + Discovery Evidence
    → Knowledge Graph Runtime
      → Semantic Queries
        → Discovery Evaluation / Guidance / Learning Engine
```

## Graph Model

```ts
interface KnowledgeNode {
  nodeId: string;
  nodeType:
    | 'CONCEPT'
    | 'PATTERN'
    | 'REPRESENTATION'
    | 'STRATEGY'
    | 'MISCONCEPTION'
    | 'WORLD_AFFORDANCE';
  canonicalKey: string;
  version: number;
  status: 'ACTIVE' | 'DEPRECATED' | 'SUPERSEDED';
  metadata: Record<string, unknown>;
}

interface KnowledgeEdge {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  relationType: KnowledgeRelationType;
  direction: 'DIRECTED' | 'BIDIRECTIONAL';
  strength?: number;
  policyVersion: number;
  evidenceRefs?: string[];
}
```

## Relationship Types

Core relationship types may include:

- `PREREQUISITE_FOR`
- `SUPPORTS`
- `CONTRASTS_WITH`
- `GENERALIZES_TO`
- `SPECIALIZES`
- `REPRESENTED_BY`
- `CAN_TRANSFER_TO`
- `COMMONLY_CONFUSED_WITH`
- `COUNTEREXAMPLE_TO`
- `DISCOVERABLE_THROUGH`
- `COMPOSED_OF`
- `EQUIVALENT_UNDER_POLICY`

Each relationship must have a defined semantic meaning. Free-form edges must not become hidden policy.

## Concept Identity

A concept node identifies mathematical meaning independently from:

- grade level,
- textbook chapter,
- one language label,
- one visual representation,
- one game mission,
- or one country curriculum.

Curriculum mappings attach to concept nodes as external alignment metadata.

## Representation Nodes

Representations may include:

- physical grouping,
- block spacing,
- number line movement,
- area model,
- symbolic expression,
- table,
- graph,
- verbal statement,
- resource recipe,
- spatial construction.

Representations are not concepts themselves. Multiple representations may expose the same concept, and one representation may support several concepts.

## Pattern Nodes

Pattern nodes describe observable structures that may support concept formation.

Examples:

- equal intervals,
- repeated groups,
- invariant total under rearrangement,
- mirror correspondence,
- proportional scaling,
- balancing two sides.

A pattern node connects world evidence to candidate concept nodes while preserving uncertainty.

## Prerequisite Semantics

`PREREQUISITE_FOR` means prior understanding is normally required to make a later concept reliably interpretable.

It does not mean:

- content must be taught in a fixed grade,
- the learner may never explore the later concept early,
- all prerequisite evidence must come from formal lessons.

The graph should support strong, soft, and contextual prerequisite policies.

```ts
interface PrerequisitePolicy {
  mode: 'REQUIRED' | 'RECOMMENDED' | 'CONTEXTUAL';
  rationale: string;
  minimumDiscoveryState?: string;
}
```

## Generalization and Specialization

The graph must preserve scope.

Example:

```text
Equal horizontal spacing
  → specializes
Equal spacing under a fixed metric
  → generalizes to
Iteration of a constant unit
```

This supports claim splitting and prevents narrow evidence from proving a broad concept.

## Misconception Nodes

Misconceptions are represented explicitly when evidence shows a stable incorrect relation.

Examples:

- larger perimeter always means larger area,
- denominator size directly means fraction size,
- equal visual size means equal quantity under all conditions,
- adding the same amount preserves ratio.

A misconception node must link to:

- contradictory concept nodes,
- common triggering representations,
- diagnostic evidence patterns,
- possible counterexample experiences.

It must not label the learner permanently.

## World Affordance Nodes

World affordances describe what kinds of mathematical evidence a game mechanic can produce.

Examples:

- uniform placement socket,
- measurable path,
- grouping container,
- balance mechanism,
- scalable recipe,
- rotatable shape,
- coordinate grid.

This creates a bridge between gameplay systems and discoverable mathematical meaning without putting educational logic inside the scene.

## Discovery Lineage

The graph should preserve the semantic path from world action to concept claim.

```text
World Affordance
  → Observation Pattern
    → Pattern Node
      → Representation Node
        → Concept Node
```

Lineage queries must return evidence references and policy versions.

## Learner Overlay

The canonical knowledge graph and learner-specific discovery state must remain separate.

```ts
interface LearnerKnowledgeOverlay {
  learnerId: string;
  nodeId: string;
  discoveryState: string;
  confidence: number;
  evidenceRefs: string[];
  revision: number;
}
```

The canonical graph defines possible relationships. The overlay records what the current evidence suggests for one learner.

## Graph Queries

Useful queries include:

- which concepts may explain this pattern,
- which representations support this concept,
- which prerequisite claims are weak,
- where transfer evidence is missing,
- which misconceptions fit current contradictions,
- which world affordances can expose a boundary condition,
- which neighboring concept is appropriate for exploration.

Queries return candidates and rationale, not unquestionable truth.

## Versioning

Concept and relationship definitions evolve.

The graph must version:

- nodes,
- edges,
- semantic relation policies,
- external curriculum mappings,
- inference rules.

Historical discovery claims must preserve the graph version under which they were evaluated.

## Deprecation and Supersession

A node may be superseded when:

- its scope was too broad,
- two concepts were incorrectly merged,
- one concept needs splitting,
- terminology changes,
- a relationship is corrected.

Supersession must preserve migration lineage.

## Localization Boundary

Labels and explanations are localized projections of canonical semantic nodes.

Node identity must not depend on Thai, English, or any other display language.

## Curriculum Mapping Boundary

Curriculum standards may map to multiple concept nodes, and one concept may map to standards across grades and countries.

```ts
interface CurriculumAlignment {
  curriculumId: string;
  standardCode: string;
  nodeId: string;
  alignmentType: 'INTRODUCES' | 'DEVELOPS' | 'EXPECTS' | 'EXTENDS';
  version: number;
}
```

Curriculum alignment does not redefine concept identity.

## Runtime Invariants

1. Concept identity is independent from grade, mission, UI, and language.
2. Learner state is not stored inside the canonical graph.
3. Every edge has declared semantic meaning and policy version.
4. Representation nodes cannot substitute for concept nodes.
5. Narrow evidence cannot prove a broader generalization without transfer.
6. Misconception nodes describe evidence patterns, not permanent learner identity.
7. Historical claims preserve graph-version lineage.
8. Deprecated nodes remain traceable through supersession links.
9. Curriculum mappings remain external alignments.
10. Graph connectivity alone cannot create mastery or discovery state.

## Verification Targets

Verification must cover:

- concept identity stability,
- representation-to-concept many-to-many links,
- prerequisite query semantics,
- generalization scope,
- misconception candidate queries,
- learner overlay separation,
- graph-version replay,
- node supersession migration,
- localization independence,
- curriculum mapping without identity coupling.

## Architectural Outcome

This slice creates a durable semantic map between world affordances, observable patterns, representations, concepts, and misconceptions.

It allows Discovery and future Learning systems to reason across contexts while preventing curriculum order, UI labels, or graph connectivity from becoming hidden claims of understanding.