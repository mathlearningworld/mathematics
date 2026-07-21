# 30D — Progress Projection Runtime

## 1. Purpose

The Progress Projection Runtime publishes audience-specific read models derived from verified progress timeline and aggregate state.

It exists to make progress understandable without allowing presentation logic to invent stronger learning meaning.

```text
Verified Progress Timeline
          +
Versioned Progress Aggregates
          ↓
Progress Projection Runtime
          ↓
Learner / Parent / Teacher / Mentor / Operations Views
```

## 2. Authority Boundary

The projection runtime may:

- select information appropriate to an audience;
- summarize and group progress dimensions;
- translate labels and explanations;
- expose freshness, confidence, limitations, conflicts, and provenance;
- expose permitted actions and navigation hints;
- redact sensitive details according to policy.

It must not:

- create assessment claims;
- declare mastery;
- change mission state;
- convert activity into progress;
- convert coverage into understanding;
- hide known regression, conflict, assistance, waiver, or stale data;
- become the source of truth.

```text
Projection may simplify representation.
Projection must never strengthen meaning.
```

## 3. Projection Families

### 3.1 Learner Progress Projection

Shows:

- current learning focus;
- recent meaningful changes;
- progress dimensions;
- next permitted steps;
- recovery opportunities;
- understandable limitations and freshness.

It must avoid ranking language that falsely implies fixed ability.

### 3.2 Parent Progress Projection

Shows:

- foundation health;
- durable gains versus temporary success;
- prerequisite gaps;
- recommended support areas;
- assistance and independence context;
- confidence and data freshness.

### 3.3 Teacher Progress Projection

Shows:

- skill and concept patterns;
- classroom-relevant grouping;
- curriculum coverage;
- regression and recovery indicators;
- evidence limitations;
- learners needing review.

### 3.4 Mentor Progress Projection

Shows only progress information required for the authorized mentoring scope.

### 3.5 Mission Progress Projection

Shows mission advancement using mission-policy semantics without implying mastery.

### 3.6 Curriculum Progress Projection

Shows coverage and curriculum alignment, preserving curriculum version and migration status.

### 3.7 Operations and Audit Projection

Shows processing state, backlog, stale projections, failed rebuilds, quarantined inputs, and lineage references without exposing unnecessary learner content.

## 4. Projection Contract

Every projection should carry at least:

```ts
interface ProgressProjectionEnvelope<T> {
  projectionId: string;
  projectionType: string;
  tenantId: string;
  learnerId?: string;
  audience: string;
  subjectVersion: number;
  aggregateVersion: number;
  timelineSequence: number;
  policyVersion: string;
  projectionVersion: string;
  freshness: ProgressProjectionFreshness;
  generatedAt: string;
  data: T;
  limitations: ProgressProjectionLimitation[];
  provenance: ProgressProjectionProvenance;
}
```

## 5. Freshness Model

```text
CURRENT
AGING
STALE
SUPERSEDED
WITHDRAWN
UNAVAILABLE
REBUILDING
FAILED
```

A projection must expose its freshness state. A stale projection may remain visible only when the audience policy allows it and the stale state is explicit.

```text
Stale but visible ≠ Current.
Unavailable ≠ No progress.
```

## 6. Meaning Preservation Rules

The runtime must preserve these distinctions:

- exposure versus practice;
- practice versus verified gain;
- recent accuracy versus retention;
- mission advancement versus mastery;
- curriculum coverage versus curriculum competence;
- supported success versus independent success;
- group outcome versus individual progress;
- trend versus final judgment.

A projection must not compress these into one unlabeled score.

## 7. Explainability

Every significant displayed progress statement must be explainable through an explanation graph containing:

- contributing aggregate dimensions;
- source timeline ranges;
- applicable policy versions;
- exclusions;
- confidence factors;
- limitations and conflicts;
- freshness state.

Examples:

```text
"Improving in fraction comparison"
→ increased independent accuracy
→ across three recent verified assessments
→ no direct-answer assistance
→ retention not yet verified
```

## 8. Action Affordances

The projection runtime may display actions such as:

- continue learning;
- review prerequisites;
- retry after recovery;
- inspect explanation;
- request teacher review;
- open a recommended mission.

However:

```text
Visible action ≠ Authorized action.
```

The owning runtime must re-authorize every command.

## 9. Privacy and Audience Isolation

Projection generation must enforce:

- tenant isolation;
- learner isolation;
- relationship authorization;
- minimum necessary disclosure;
- age-appropriate language;
- sensitive evidence redaction;
- auditability of access policy.

Cross-audience cache reuse is forbidden unless the cache key includes the full authorization and redaction policy identity.

## 10. Rebuild and Idempotency

Projection generation must be deterministic for the same:

- timeline sequence;
- aggregate version;
- policy version;
- projection version;
- audience authorization context.

Rebuilds must be idempotent. Older rebuild output must not overwrite a newer projection.

## 11. Failure Handling

On projection failure:

- preserve the last known projection when policy permits;
- mark it stale or unavailable;
- record failure metadata;
- enqueue controlled rebuild;
- never fabricate zero progress;
- never silently omit known limitations.

## 12. Core Invariants

```text
Projection ≠ Source of Truth.
Projection ≠ Assessment.
Projection ≠ Mastery.
Projection never strengthens semantic meaning.
Freshness is always visible.
Redaction never changes the underlying meaning.
A missing projection is not evidence of no progress.
Every actionable projection is re-authorized by its owning runtime.
```