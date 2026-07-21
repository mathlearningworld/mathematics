# 27G — Recommendation Projection Runtime

Status: PROJECTION RUNTIME DEFINED  
Depends on: 27A–27F

## 1. Purpose

Recommendation Projection Runtime transforms verified recommendation state into audience-specific read models without changing recommendation meaning, authority, confidence, priority, limitations, or provenance.

It exists to answer:

> How should the same recommendation truth be presented safely and usefully to each consumer?

Projection is not recommendation generation. Projection is not reprioritization. Projection is not assessment. Projection is not mission activation.

## 2. Runtime Position

```text
Assessment Claims
        ↓
Recommendation Candidate Runtime
        ↓
Recommendation Prioritization Runtime
        ↓
Learning / Practice / Mission Recommendations
        ↓
Recommendation Verification Runtime
        ↓
Recommendation Projection Runtime
        ↓
Learner / Parent / Teacher / Mission / Operational Views
```

Projection consumes authoritative recommendation records and produces audience-bound read models.

## 3. Authority Boundary

Projection MAY:

- select fields allowed for a consumer,
- simplify language,
- group recommendations,
- localize presentation,
- provide audience-appropriate explanations,
- hide restricted evidence details,
- expose action affordances,
- preserve supersession and freshness state.

Projection MUST NOT:

- change recommendation type,
- increase confidence,
- lower or raise priority,
- remove limitations,
- erase blockers,
- convert optional guidance into mandatory action,
- infer mastery,
- activate missions,
- resolve contradictions,
- rewrite provenance.

## 4. Projection Principle

```text
One Recommendation Truth
        ↓
Many Audience Views
```

All projections must derive from the same verified source state.

A projection may contain less information than its source, but never stronger meaning.

## 5. Projection Audiences

Initial audiences:

```text
LEARNER
PARENT
TEACHER
MENTOR
MISSION_ENGINE
LEARNING_ENGINE
PRACTICE_ENGINE
OPERATIONS
AUDIT
```

Each audience has a separate projection contract.

## 6. Canonical Projection Envelope

Every projected recommendation must include:

```text
projectionId
projectionVersion
projectionType
audience
learnerId
recommendationCaseId
recommendationSetId
recommendationId
sourceRecommendationVersion
status
priorityBand
recommendationType
target
summary
reasonSummary
confidence
limitations
freshness
supersession
allowedActions
createdAt
```

Internal audiences may additionally receive source references and verification metadata.

## 7. Learner Projection

The learner view should answer:

```text
What should I do next?
Why is this useful?
How much should I do?
Can I choose something else?
What happens after I finish?
```

Learner projections emphasize:

- clear next action,
- low-language visual meaning,
- optionality,
- progress continuity,
- manageable dosage,
- supportive explanation,
- no deficit labeling.

Learner projection must not expose labels such as:

```text
WEAK
FAILED
LOW ABILITY
BEHIND
```

Instead it may say:

```text
Build this foundation first
Try one more representation
Collect more evidence here
Practice this skill in a new context
```

## 8. Parent Projection

The parent view should answer:

```text
What does the learner currently need?
Why is the system recommending this?
How can I help without replacing the learner?
What evidence is still missing?
When should human support be considered?
```

Parent projections may include:

- foundation gaps,
- broad confidence ranges,
- recurring learning patterns,
- recommended support actions,
- suggested observation prompts,
- escalation thresholds,
- limitations and uncertainty.

Parent projection must not imply diagnosis or guaranteed outcomes.

## 9. Teacher Projection

Teacher projection supports classroom interpretation and intervention.

It may include:

```text
skill target
prerequisite chain
readiness blockers
misconception hypotheses
representation gaps
evidence sufficiency
recommended instructional response
recommended practice response
recommended reassessment point
cohort relevance
```

Teacher views must preserve the difference between:

```text
observed evidence
assessment claim
recommendation
human judgment
```

## 10. Mentor Projection

Mentor projection presents actionable support boundaries:

- what concept to clarify,
- what representation to use,
- what not to reveal directly,
- which learner response to observe,
- when to stop helping,
- when to return control to the learner,
- when to escalate.

Mentor projection never authorizes changing mastery or assessment state.

## 11. Mission Engine Projection

Mission Engine receives machine-oriented proposals, not learner-facing cards.

Required fields:

```text
missionRecommendationId
missionType
goalAlignment
foundationDependencies
readinessGate
priorityBand
optionality
estimatedEffort
successEvidenceContract
completionDoesNotImplyMastery
supersessionPolicy
sourceRecommendationRefs
```

Mission Engine decides whether to accept, modify, defer, or reject the proposal.

## 12. Learning Engine Projection

Learning Engine projection includes:

```text
learningPurpose
conceptTarget
prerequisiteContext
representationSequence
supportLevel
expectedEvidence
stoppingConditions
reassessmentTrigger
```

It must not prescribe exact lesson content unless the content authority belongs to the Learning Engine.

## 13. Practice Engine Projection

Practice Engine projection includes:

```text
practicePurpose
targetSkill
difficultyBand
representationMix
itemVariationPolicy
dosageBounds
stoppingRules
loopProtection
expectedEvidence
```

Practice Engine owns item delivery and activity execution.

## 14. Operational Projection

Operational views support system health and traceability.

They may include:

- unpublished recommendation counts,
- held or quarantined records,
- stale projections,
- failed projection builds,
- supersession lag,
- audience delivery status,
- replay divergence alerts.

Operational projections must not expose restricted learner details beyond operational need.

## 15. Audit Projection

Audit projection preserves complete traceability:

```text
source assessment claim refs
candidate refs
priority decision refs
policy versions
verification decision
projection policy version
field redactions
consumer audience
publication timestamp
```

Audit projection is append-only and non-editable.

## 16. Projection Pipeline

```text
Verified Recommendation Set
        ↓
Audience Authorization
        ↓
Projection Policy Resolution
        ↓
Field Selection
        ↓
Meaning-Preserving Transformation
        ↓
Explanation Rendering
        ↓
Freshness and Supersession Binding
        ↓
Projection Validation
        ↓
Publication
```

## 17. Projection Policy

Projection policy is versioned and includes:

```text
policyVersion
audienceRules
fieldVisibilityRules
languageRules
confidenceDisplayRules
limitationDisplayRules
redactionRules
actionRules
freshnessRules
```

A replay must use the historical projection policy unless explicitly running a current-policy re-projection.

## 18. Meaning-Preserving Transformation

Allowed transformations:

- technical-to-plain language,
- long-to-short explanation,
- numerical confidence to confidence band,
- grouping related actions,
- hiding internal identifiers,
- localization,
- ordering fields for usability.

Forbidden transformations:

- “eligible” → “required”,
- “possible misconception” → “misconception confirmed”,
- “limited evidence” → omission of uncertainty,
- “priority P2” → “urgent”,
- “mission proposal” → “active mission”,
- “practice completed” → “mastered”.

## 19. Explanation Model

Every user-facing projection should carry an explanation object:

```text
what
why
basedOn
whyNow
whatBefore
whatAfter
limitations
reviewTrigger
```

The explanation may be condensed by audience but its logical meaning must remain traceable.

## 20. Confidence Projection

Projection may map a numeric or structured confidence model into bands:

```text
HIGH
MODERATE
LOW
INSUFFICIENT
CONFLICTING
```

Rules:

```text
projected confidence ≤ source recommendation confidence
projection cannot hide conflicting evidence
projection cannot merge confidence with mastery
projection cannot present confidence as success probability
```

## 21. Priority Projection

Priority may be shown as:

```text
DO_FIRST
DO_NEXT
KEEP_WARM
OPTIONAL
WAIT
NEEDS_REVIEW
```

The mapping from canonical priority band must be deterministic and versioned.

## 22. Freshness Projection

Each projection must expose whether the recommendation is:

```text
CURRENT
AGING
STALE
SUPERSEDED
WITHDRAWN
```

A stale projection must not silently remain actionable.

## 23. Supersession Projection

When a recommendation is superseded, the projection must:

- stop presenting it as current,
- preserve historical access where authorized,
- link to the successor recommendation,
- retain the original explanation and state,
- never overwrite the original record.

## 24. Projection Build Identity

Projection identity must be deterministic over:

```text
recommendationId
recommendationVersion
audience
projectionPolicyVersion
locale
```

Equivalent inputs must produce equivalent projection meaning.

## 25. Idempotency

Rebuilding the same projection with the same source and policy must not create conflicting active projections.

Allowed outcomes:

```text
NO_CHANGE
REBUILT_EQUIVALENT
NEW_VERSION_REQUIRED
REJECTED_DIVERGENCE
```

## 26. Localization

Localization may alter wording and examples but not authority or decision meaning.

Localized projections must preserve:

- recommendation type,
- target identity,
- priority mapping,
- confidence band,
- limitations,
- optionality,
- stopping rules.

## 27. Accessibility

Projection runtime should support:

- low-text presentation,
- screen-reader labels,
- symbolic and visual cues,
- age-appropriate explanations,
- reduced cognitive load,
- alternative representation hints.

Accessibility is part of projection quality, not a separate afterthought.

## 28. Privacy and Redaction

Projection runtime applies least-privilege disclosure.

Examples:

```text
Learner: actionable explanation, minimal internal evidence
Parent: support-oriented summary
Teacher: deeper educational evidence
Audit: full traceability
Operations: health metadata without unnecessary learner detail
```

Redaction decisions are recorded.

## 29. Failure States

```text
SOURCE_NOT_VERIFIED
AUDIENCE_NOT_AUTHORIZED
POLICY_NOT_FOUND
UNSUPPORTED_AUDIENCE
MEANING_DIVERGENCE
CONFIDENCE_ESCALATION
LIMITATION_DROPPED
STALE_SOURCE
SUPERSESSION_CONFLICT
PROJECTION_VALIDATION_FAILED
```

## 30. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

Projection publication cannot exceed the source recommendation publication decision.

## 31. Projection Consistency Rules

For all projections of the same recommendation:

```text
same target identity
same recommendation type
same canonical priority
same source confidence ceiling
same optionality meaning
same limitations truth
same supersession state
```

Audience views may differ in detail, never in underlying truth.

## 32. Projection Testing Contract

Minimum tests:

- learner projection hides restricted fields,
- teacher projection preserves source traceability,
- confidence never increases,
- limitations are not dropped,
- superseded recommendations cannot remain current,
- same input yields deterministic projection,
- locale change preserves semantics,
- unauthorized audience is rejected,
- mission projection does not activate missions,
- completion wording does not imply mastery.

## 33. Completion Rule

27G is complete when Recommendation Engine has a versioned, deterministic, audience-specific projection model that preserves recommendation truth, authority, uncertainty, limitations, freshness, and provenance across all supported consumers.
