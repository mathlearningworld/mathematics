# 30C — Progress Aggregation Runtime

## Status

- Chapter: 30 — Progress Engine
- Slice: 30C
- State: Defined

## Purpose

Progress Aggregation Runtime derives explainable learner progress state from the authoritative Progress Timeline.

Aggregation is a deterministic interpretation layer. It does not replace timeline truth, invent mastery, or merge unrelated dimensions into a single misleading score.

## Boundary

```text
Progress Timeline
      ↓
Aggregation Runtime
      ↓
Skill / Concept / Curriculum / Mission Aggregates
      ↓
Projection Runtime
```

## Core Laws

```text
Aggregate ≠ Source of Truth
Average ≠ Understanding
Coverage ≠ Mastery
Velocity ≠ Quality
Recent success ≠ Durable retention
One score ≠ All progress dimensions
```

## Aggregate Families

- LearnerSkillProgress
- LearnerConceptProgress
- LearnerObjectiveProgress
- LearnerMissionProgress
- LearnerCurriculumProgress
- LearnerLearningPathProgress
- LearnerSubjectProgress
- LearnerGradeBandProgress
- LearnerWorldRegionProgress
- LearnerPracticeProgress

Each family must define its own source eligibility, dimensions, weighting policy, completion semantics, freshness rules, and limitations.

## Canonical Aggregate Contract

```text
ProgressAggregate
- aggregateId
- tenantId
- learnerId
- aggregateType
- subjectType
- subjectId
- aggregateVersion
- throughLedgerSequence
- status
- dimensions
- trend
- confidence
- freshness
- coverage
- limitations[]
- sourceSummary
- policyVersion
- computedAt
- invalidatedAt?
- publicationState
```

## Dimension Contract

```text
ProgressDimension
- dimensionType
- value
- unit
- band
- confidence
- sampleSize
- effectiveFrom
- effectiveThrough
- freshness
- limitations[]
- contributingSourceCount
```

Supported dimensions include:

- EXPOSURE
- PRACTICE_VOLUME
- ACCURACY
- REASONING
- INDEPENDENCE
- CONSISTENCY
- RETENTION
- TRANSFER
- SPEED
- STRATEGY_RANGE
- SELF_CORRECTION
- CURRICULUM_COVERAGE
- MISSION_ADVANCEMENT
- GAMEPLAY_APPLICATION

A policy may omit dimensions but must not collapse them silently into a stronger interpretation.

## Aggregation Pipeline

```text
1. Receive aggregate invalidation
2. Resolve learner and subject scope
3. Read verified checkpoint if available
4. Read eligible timeline entries
5. Exclude held, quarantined, withdrawn, or superseded meaning
6. Apply source eligibility policy
7. Apply dimension-specific calculations
8. Detect conflict, regression, and recovery
9. Calculate confidence and freshness
10. Produce explanation graph
11. Compare with prior aggregate
12. Persist new aggregate version
13. Publish projection invalidation and outbox record
```

## Source Eligibility

Eligibility is dimension-specific.

Examples:

```text
Practice session completed
→ eligible for exposure and practice volume
→ not automatically eligible for mastery

Assessment mastery confirmed
→ eligible for mastery-related status
→ may still be stale for retention

Gameplay completion with hints
→ eligible for gameplay application
→ limited for independence

Mission completed
→ eligible for mission advancement
→ not automatically eligible for skill mastery
```

## Weighting Policy

Weighting must be explicit and versioned.

Potential factors:

- source authority
- recency
- independence
- evidence strength
- task difficulty
- transfer distance
- assistance level
- sample sufficiency
- evidence overlap
- integrity status

Forbidden weighting shortcuts:

- time spent as universal quality weight
- raw score as universal understanding weight
- repeated duplicate evidence as independent confirmation
- teacher or parent preference as mastery evidence
- group outcome as full individual weight

## Coverage

Coverage expresses how much of a defined requirement set has eligible progress information.

```text
coverage = eligible observed requirements / total active requirements
```

Coverage must identify:

- curriculum version
- requirement set version
- excluded requirements
- waived requirements
- optional requirements
- unknown mappings

Coverage does not imply mastery.

## Completion Semantics

Aggregate completion may mean:

- all required mission objectives completed
- all curriculum requirements observed
- all required curriculum requirements mastered by Assessment authority
- learning path policy completed
- gameplay region objectives completed

The semantic label must include the owning policy.

Use:

```text
COMPLETE_BY_MISSION_POLICY
COMPLETE_BY_CURRICULUM_COVERAGE_POLICY
COMPLETE_BY_ASSESSMENT_MASTERY_POLICY
COMPLETE_BY_LEARNING_PATH_POLICY
```

Do not use an unqualified `COMPLETE` across aggregate families.

## Trend Model

Trend values:

- STRONGLY_IMPROVING
- IMPROVING
- STABLE
- VARIABLE
- DECLINING
- STRONGLY_DECLINING
- RECOVERING
- INSUFFICIENT_DATA
- CONFLICTED

Trend calculations must disclose:

- comparison window
- included dimensions
- minimum sample threshold
- confidence
- policy version

A trend must never be inferred from a single event.

## Regression Detection

Regression requires:

- prior stable or stronger state
- newer eligible evidence
- dimension-specific decline beyond policy threshold
- sufficient sample or authoritative assessment decision
- no unresolved provenance conflict

Regression result:

```text
RegressionMarker
- subjectId
- affectedDimensions[]
- priorBand
- currentBand
- detectedAt
- effectiveFrom
- confidence
- sourceEntryIds[]
- limitations[]
```

Regression does not delete earlier achievements.

## Recovery Detection

Recovery requires new evidence after regression.

A recovery marker must reference:

- regression marker
- recovering dimensions
- new source entries
- confidence
- remaining limitations

Recovery may be partial.

## Conflict Handling

Conflicts can occur when authoritative sources disagree.

Examples:

- recent assessment indicates weakness while gameplay application is strong
- mission completed but required skill assessment remains insufficient
- high accuracy with low reasoning quality
- strong assisted performance and weak independent performance

Conflict outcome:

- preserve all dimensions
- mark aggregate confidence as CONFLICTED where appropriate
- expose explanation
- avoid selecting the most favorable source silently
- request Assessment or Recommendation follow-up through an event, not direct mutation

## Confidence Calculation

Confidence is derived from:

- source authority quality
- provenance integrity
- independent sample count
- freshness
- consistency
- assistance limitations
- evidence overlap
- replay agreement
- unresolved conflicts

Confidence levels:

- HIGH
- MODERATE
- LOW
- INSUFFICIENT
- CONFLICTED
- UNKNOWN

## Freshness Calculation

Freshness may differ per dimension.

Example:

```text
Exposure: CURRENT
Accuracy: CURRENT
Retention: STALE
Transfer: UNKNOWN
```

Aggregate-level freshness must represent the least safe meaningful state or expose mixed freshness explicitly.

## Curriculum Aggregation

Curriculum progress must bind to a specific curriculum version.

```text
CurriculumProgress
- curriculumId
- curriculumVersion
- gradeBand
- activeRequirementCount
- observedRequirementCount
- masteredRequirementCount
- developingRequirementCount
- blockedRequirementCount
- unknownRequirementCount
- coverage
- masteryCoverage
```

When curriculum changes:

- preserve historical aggregate under prior version
- create a new aggregate lineage
- map compatible requirements explicitly
- do not retroactively claim completion under the new version

## Mission Aggregation

Mission progress consumes Mission Engine authority.

It may summarize:

- required objective state
- optional objective state
- blocker state
- completion state
- progress through mission stages

It may not reinterpret mission transitions or complete a mission.

## Skill Aggregation

Skill progress must separate:

- exposure
- practice
- evidence
- mastery authority
- retention
- transfer
- independence

A skill can be mastered but stale for retention. A skill can show strong gameplay application but insufficient formal assessment evidence.

## Cross-Subject Aggregation

Cross-subject or grade-level rollups must preserve uncertainty.

Forbidden:

- averaging unrelated skills into a precise learner ability score without policy
- hiding critical prerequisite gaps behind strong performance elsewhere
- presenting broad completion when required subdomains are blocked

Required:

- dimension breakdown
- requirement weighting policy
- blocked prerequisite visibility
- confidence and missing-data visibility

## Incremental Aggregation

Incremental updates are allowed when deterministic.

Requirements:

- prior aggregate version verified
- no invalidation before checkpoint boundary
- source entry order continuous
- policy version unchanged
- calculation hash matches

Otherwise perform full rebuild from a verified checkpoint or ledger origin.

## Rebuild and Replay

Rebuild modes:

- INCREMENTAL
- FROM_CHECKPOINT
- FULL_LEDGER
- POLICY_SIMULATION
- DIAGNOSTIC

Historical rebuild uses historical policy versions.

Current-policy simulation must create a separate simulation result and never overwrite historical aggregates.

## Explanation Graph

Every aggregate version must be explainable.

```text
Aggregate Version
  ├─ contributing timeline entries
  ├─ excluded timeline entries and reasons
  ├─ dimension calculations
  ├─ weighting policy
  ├─ confidence calculation
  ├─ freshness calculation
  ├─ conflicts
  └─ limitations
```

A user-facing explanation may simplify language but must preserve the same meaning.

## Persistence

The following must commit atomically:

- new aggregate version
- aggregate lineage reference
- calculation hash
- explanation graph reference
- source through-sequence
- projection invalidation
- outbox record

Old aggregate versions remain durable.

## Publication States

- COMPUTING
- CURRENT
- CURRENT_WITH_LIMITATIONS
- STALE
- HELD
- QUARANTINED
- SUPERSEDED
- FAILED

A failed rebuild must not replace the last verified aggregate.

## Observability

Required metrics:

- aggregate computation duration
- incremental versus full rebuild ratio
- stale aggregate count
- invalidation backlog
- conflict rate
- regression marker rate
- recovery marker rate
- explanation generation failures
- policy simulation volume
- calculation hash mismatch
- projection publication lag

## Aggregation Invariants

1. Aggregates derive only from eligible timeline entries.
2. Held, quarantined, withdrawn, and superseded meaning does not influence current public aggregates.
3. No aggregate strengthens source meaning.
4. Dimensions remain independently visible.
5. Coverage never implies mastery.
6. Mission completion never implies skill mastery.
7. Gameplay success never implies independent understanding.
8. Regression and recovery are append-only interpretations.
9. Aggregate policy is versioned.
10. Failed rebuild never replaces verified state.
11. Cross-subject rollups preserve blockers and uncertainty.
12. Historical policy replay never uses current policy silently.
13. Aggregate versions are immutable.
14. Explanation lineage is required.
15. Checkpoint optimization never changes results.

## Acceptance Gate

30C is satisfied when architecture and implementation can demonstrate:

- separate aggregate families
- independent progress dimensions
- explicit source eligibility and weighting
- coverage versus mastery separation
- trend, regression, and recovery semantics
- confidence and mixed freshness
- curriculum version binding
- mission and skill authority boundaries
- deterministic incremental and full rebuild
- immutable aggregate versions
- complete explanation lineage
- no semantic escalation beyond timeline authority
