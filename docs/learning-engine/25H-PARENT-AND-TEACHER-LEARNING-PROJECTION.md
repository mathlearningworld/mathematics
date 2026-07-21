# 25H — Parent and Teacher Learning Projection

## 1. Purpose

The Parent and Teacher Learning Projection converts authoritative learning records into understandable, role-appropriate views for adults supporting the learner.

Its purpose is not to rank children, predict fixed ability, or replace professional judgment.

> The projection helps adults understand what the learner currently demonstrates, what remains uncertain, what support may be useful, and why the system reached that view.

```text
Discovery Evidence
  + Learning State
  + Mastery Claims
  + Transfer Claims
  + Learning Path
  + Recommendations
        ↓
Projection Runtime
        ↓
Parent View / Teacher View / Mentor View
```

---

## 2. Architectural Boundary

### The projection owns

- role-specific read models
- evidence summarization
- uncertainty and limitation presentation
- progression history
- goal and path visibility
- recommendation explanation
- alerts and review prompts
- consent-aware access
- projection versioning
- localization and accessibility

### The projection does not own

- learning truth
- discovery evaluation
- mastery evaluation
- transfer evaluation
- recommendation ranking
- curriculum authority
- mission execution
- learner rewards
- permanent learner classification

A projection may display a claim. It may not create or alter that claim.

---

## 3. Audience Separation

Parent and teacher views share authoritative sources but serve different decisions.

### Parent projection

Supports questions such as:

- What is my child currently working toward?
- What has become more stable?
- Where does support remain necessary?
- Is there a foundational gap affecting current learning?
- What can we do at home without turning learning into pressure?
- Why is the system recommending this next experience?

### Teacher projection

Supports questions such as:

- Which concepts are stable, emerging, or unresolved?
- Which representations or contexts have been observed?
- Is the learner transferring knowledge?
- Which misconceptions require contrast or discussion?
- Which students need a targeted instructional response?
- What evidence supports the current interpretation?

### Mentor projection

Supports immediate guidance while preserving the rule that mentors observe and assist but do not manufacture discovery or mastery.

The system must not simply expose the same dashboard with different labels. Each projection requires distinct information density, terminology, and action boundaries.

---

## 4. Projection Principles

### 4.1 Evidence before labels

Show what happened and how it was interpreted before summarizing with a state label.

### 4.2 Scope before certainty

Every statement must make clear which concept, representation, context, and time range it covers.

### 4.3 Uncertainty is visible

Unknown retention, missing transfer evidence, and contradictory observations must not be hidden.

### 4.4 Progress is multidimensional

Avoid reducing learning to one percentage.

### 4.5 No permanent learner identity

Use language such as:

- “currently needs support when…”
- “evidence is not yet available for…”
- “has shown stable understanding in…”

Do not use:

- “is weak”
- “is not a math person”
- “low ability”
- “gifted forever”

### 4.6 Adult action must be bounded

Adults may provide goals, context, confirmation, and support. They may not directly edit authoritative learning claims.

---

## 5. Canonical Projection Model

```text
LearningProjection
- projectionId
- learnerId
- audienceRole
- generatedAt
- sourceSnapshotVersion
- projectionPolicyVersion
- consentScope
- activeGoals
- conceptSummaries
- learningPathSummary
- recommendationSummary
- reviewPrompts
- alerts
- limitations
```

Each concept summary should contain:

```text
ConceptLearningSummary
- conceptId
- displayName
- learningStatus
- masteryStatus
- confidence
- stability
- transferBreadth
- retentionStatus
- supportDependence
- representationsObserved
- strategiesObserved
- contradictionSummary
- evidenceWindow
- evidenceRefs
- explanation
- limitations
- nextUsefulEvidence
```

---

## 6. Parent Projection

The parent view should prioritize clarity, emotional safety, and practical support.

### Recommended sections

```text
1. Current Learning Goals
2. What Is Becoming Stronger
3. What Is Still Being Explored
4. Where Support Helps
5. Suggested Next Experience
6. Simple Home Support
7. Questions or Alerts Requiring Review
```

### Example parent summary

> The learner can build and compare equal groups independently in concrete scenes. The same idea has begun to appear in diagrams, but symbolic transfer has not yet been observed. The next recommendation uses a short bridge from visual groups to symbols. This is not a test and does not block other exploration.

### Parent actions

Parents may:

- acknowledge a goal
- choose among safe recommendation alternatives
- add contextual notes
- request a teacher review
- set session-duration boundaries
- confirm that an offline activity occurred
- manage consent and sharing

Offline activity confirmation becomes contextual evidence only. It must not automatically create mastery.

---

## 7. Teacher Projection

The teacher view may expose greater evidence density and group-level patterns while retaining learner-level explainability.

### Individual learner view

```text
Concept Profile
- state dimensions
- evidence timeline
- representations
- transfer map
- support history
- misconception signals
- retention checks
- current path
- recommendation reasons
```

### Group view

Group aggregation may answer:

- How many learners lack evidence for a prerequisite?
- Which representation causes the highest transfer failure?
- Which misconception appears across several learners?
- Which learners are ready for an extension opportunity?
- Where is the system uncertain rather than negative?

Group views must not expose unnecessary personal details and must allow drill-down only where permission exists.

### Teacher actions

Teachers may:

- set or prioritize learning goals
- assign a bounded experience
- request evidence collection
- add an observation note
- confirm classroom context
- propose a misconception contrast
- request re-evaluation
- review system explanations

Teacher observation must be distinguished from system-derived evidence and retain its author, timestamp, scope, and confidence.

---

## 8. Learning Dimensions Display

The projection should show separate dimensions rather than a single score.

Example:

```text
Concept: Proportional Comparison

Understanding depth       Supported
Independence              Strong
Representation breadth    Visual + concrete
Transfer                  Context-bound
Retention                 Not yet checked
Strategy flexibility      Emerging
Contradiction burden      Low
```

Visual design may simplify these dimensions, but the underlying distinctions must remain available.

---

## 9. Evidence Timeline

Adults should be able to inspect how the current interpretation developed.

```text
Observed
  → Emerging
    → Supported
      → Transfer attempt
        → Contradiction
          → Recovery evidence
```

Timeline entries should show:

- date and time
- experience or mission
- context
- representation
- support used
- authoritative outcome
- interpretation change
- policy version

The timeline must not expose hidden chain-of-thought or private learner content beyond consent scope.

---

## 10. Mastery Presentation

Mastery must be displayed as a scoped, revisable claim.

Bad presentation:

```text
Fractions: 82% mastered
```

Better presentation:

```text
Equivalent fractions
- mastered in visual area models
- independent across three variations
- near transfer observed
- symbolic retention not yet checked
- claim evaluated under policy v3
```

When mastery is provisional, context-bound, dormant, contradicted, or revoked, the projection must display that state without shame-oriented language.

---

## 11. Transfer Presentation

Transfer views should show the relationship between source and target contexts.

```text
Equal Groups
  concrete objects
      ↓ near transfer observed
  rectangular arrays
      ↓ cross-representation emerging
  multiplication symbols
      ↓ not yet observed
  word problems
      ↓ unresolved
```

Negative transfer should be framed diagnostically:

> The learner reused an additive strategy in a multiplicative situation. This suggests the two structures should be contrasted explicitly.

It must not be framed as a behavioral failure.

---

## 12. Foundation Debt Without Stigmatization

The projection must make foundational risk visible while preserving advanced learning.

Example:

```text
Current exploration
- linear relationships

Foundation support track
- translating verbal relationships into equations

Reason
- the learner can reason visually but repeatedly loses the relationship during symbolic translation
```

The view should explain whether the foundation issue:

- blocks the active goal
- increases effort but does not block progress
- creates negative transfer risk
- can be addressed in parallel

Avoid grade-based shame such as “working below level.” Prefer concept-specific descriptions.

---

## 13. Recommendation Presentation

Every displayed recommendation should answer:

1. What is suggested?
2. Why is it useful now?
3. What evidence will it help collect?
4. How demanding is it?
5. What support is available?
6. What alternatives exist?
7. Is it optional, assigned, or required by policy?

Example:

```text
Suggested next experience
Representation bridge: arrays → multiplication symbols

Why now
Understanding is stable with arrays, but symbolic transfer has not yet been observed.

Alternative
Continue open construction exploration and revisit this bridge later.
```

---

## 14. Alerts

Alerts must be rare, meaningful, and actionable.

### Valid alert categories

```text
PERSISTENT_CONTRADICTION
REPEATED_NEGATIVE_TRANSFER
FOUNDATION_RISK_AFFECTING_GOAL
HIGH_SUPPORT_DEPENDENCE
RETENTION_DECLINE
EXTENDED_NO_EVIDENCE
ACCESSIBILITY_MISMATCH
LEARNER_DISTRESS_SIGNAL
CONSENT_OR_DATA_QUALITY_ISSUE
```

### Alert contract

```text
LearningAlert
- alertId
- learnerId
- category
- severity
- scope
- createdAt
- evidenceRefs
- explanation
- uncertainty
- suggestedReview
- lifecycleStatus
```

An alert is not a diagnosis. Medical, psychological, or disability conclusions must never be inferred from gameplay evidence alone.

---

## 15. Review Prompts

Instead of over-alerting, the system may produce review prompts:

- “Would you like to compare this misconception across two representations?”
- “Retention has not been checked for six weeks.”
- “The learner declined three timed tasks but completed untimed versions; review task format rather than ability.”
- “Evidence is strong in Thai-language prompts but absent in low-language visual tasks; check whether language load is influencing performance.”

Review prompts preserve uncertainty and invite human judgment.

---

## 16. Adult Observation Contract

```text
AdultObservation
- observationId
- learnerId
- authorId
- authorRole
- observedAt
- conceptScope
- context
- representation
- description
- supportObserved
- confidence
- evidenceAttachmentRefs
- consentScope
- status
```

Statuses:

```text
SUBMITTED
VALIDATED
LINKED
CONTESTED
SUPERSEDED
REVOKED
```

Adult observations may contribute contextual evidence after validation, but they must remain distinguishable from authoritative world events.

---

## 17. Consent and Access Control

Projection access must be explicit and role-bound.

Consider:

- learner age
- parent or guardian authority
- teacher class relationship
- mentor assignment
- institution policy
- data-sharing consent
- retention period
- sensitive note categories

Access must be revocable. Revocation affects future access without falsifying historical audit records.

The system should support field-level redaction where full projection access is unnecessary.

---

## 18. Privacy by Design

The projection should expose the minimum information necessary for the adult's role.

Prohibited by default:

- unrelated personal messages
- raw behavioral telemetry without purpose
- hidden emotional inference
- family socioeconomic inference
- cross-family comparison
- commercial targeting
- public leaderboards

Exported reports must include scope, generated date, source version, and limitations so they are not mistaken for permanent records of ability.

---

## 19. Localization and Accessibility

Projection language must be understandable to non-specialists while preserving access to technical detail.

Requirements:

- Thai-first language support for the initial product context
- plain-language parent summaries
- expandable technical teacher detail
- screen-reader-compatible structure
- non-color-only status indicators
- adjustable text size
- accessible charts and tables
- low-bandwidth rendering
- exportable text summaries

Translation must preserve claim scope and uncertainty. Terms such as “mastery,” “transfer,” and “support dependence” require controlled glossary definitions.

---

## 20. Projection Freshness

Every projection must declare freshness.

```text
ProjectionFreshness
- sourceSnapshotVersion
- generatedAt
- lastEvidenceAt
- staleAfter
- staleReason
```

A stale projection must not appear current. Material new evidence should invalidate or regenerate affected summaries.

---

## 21. Persistence and Replay

Persist:

- projection generation request
- audience role
- consent scope
- source snapshot versions
- projection policy version
- generated read model
- redaction decisions
- delivery and access audit
- adult actions

A historical projection must remain reproducible under its original policy version. New policies create new projections rather than rewriting history.

---

## 22. Projection Invalidation

Regenerate or invalidate when:

- learning state changes materially
- mastery claim is superseded or revoked
- transfer evidence changes
- active goal changes
- recommendation expires
- consent changes
- role relationship ends
- projection policy changes
- source data is quarantined

Invalidation must be targeted; an unrelated concept update should not rebuild every projection unnecessarily.

---

## 23. Comparison and Ranking Restrictions

Cross-learner comparison is permitted only for legitimate instructional planning and must use concept-specific, evidence-aware aggregates.

The system must not produce:

- permanent class rank
- intelligence rank
- overall child score
- public comparison
- predicted life outcome
- commercial value score

Teacher group views should prefer distributions of evidence needs over ordered learner lists.

Example:

```text
12 learners: symbolic transfer not yet observed
5 learners: negative transfer between additive and multiplicative structures
8 learners: ready for cross-context challenge
```

---

## 24. Human Override and Disagreement

Adults may disagree with a projection.

The system should support:

```text
REQUEST_REVIEW
ADD_CONTEXT
CONTEST_INTERPRETATION
REPORT_DATA_ERROR
PROPOSE_GOAL_CHANGE
```

A disagreement does not silently overwrite the claim. It opens a review record linking:

- disputed statement
- adult reasoning
- supporting context
- reviewer
- resolution
- resulting claim version

---

## 25. Failure Modes

### Dashboard theater

Attractive charts provide no actionable meaning.

### Single-score collapse

All learning dimensions are reduced to a percentage.

### Label permanence

Temporary evidence becomes a fixed identity.

### Parent pressure engine

Recommendations are presented as mandatory performance targets.

### Teacher surveillance

Raw telemetry is exposed without instructional purpose.

### Hidden uncertainty

Unknown or contradictory evidence is shown as certainty.

### Context loss

A mastery label is displayed without representation or transfer scope.

### Adult truth override

An adult can directly set mastery.

### Stale projection

Old summaries appear current after material evidence changes.

All are prohibited.

---

## 26. Runtime Invariants

1. Projection data must originate from authoritative source records.
2. A projection must never mutate a learning claim.
3. Every summary must retain concept and evidence scope.
4. Uncertainty and limitations must remain visible.
5. Parent and teacher views must be role-specific.
6. No permanent learner identity label may be inferred.
7. Adult observations must remain distinguishable from world evidence.
8. Adult disagreement must create a review record, not silent mutation.
9. Consent and access decisions must be auditable.
10. Stale projections must be marked or regenerated.
11. Accessibility accommodations must not be shown as lower ability.
12. Cross-learner views must avoid public ranking and unnecessary personal detail.
13. Alerts must be evidence-linked and non-diagnostic.
14. Recommendation explanations must preserve optionality and alternatives.
15. Historical projections must remain replayable under their original policy.

---

## 27. Example Parent Projection

```text
Current goal
Understand multiplicative comparison across pictures and symbols.

What is becoming stronger
The learner independently builds equal groups and compares them in several visual scenes.

What remains uncertain
The same relationship has not yet been demonstrated consistently with symbolic equations.

Suggested next experience
A short visual-to-symbol bridge with optional prompts.

Why this is suggested
It will help determine whether the visual understanding transfers to symbols.

Foundation note
Verbal-to-equation translation remains difficult and can be supported in parallel.

Limitations
Retention after a longer delay has not yet been checked.
```

---

## 28. Example Teacher Projection

```text
Concept
Multiplicative comparison

State
SUPPORTED

Evidence profile
- 7 independent concrete observations
- 4 visual-array variations
- 2 symbolic attempts
- 1 successful symbolic attempt with prompt

Transfer
- near transfer: observed
- cross-representation: emerging
- verbal problem transfer: unresolved

Misconception signal
Additive comparison used in 3 of 5 verbal contexts.

Instructional opportunity
Contrast additive and multiplicative structures using matched visual scenes.

System uncertainty
Insufficient delayed evidence for retention.
```

---

## 29. Integration Boundary

```text
Learning Engine
        ↓ authoritative claims
Projection Runtime
        ↓ role-specific read model
Parent / Teacher / Mentor
        ↓ goals, context, review requests
Learning Path or Review Workflow
```

The return path must never allow projections to bypass learning authority.

---

## 30. Completion Criteria

25H is architecturally complete when:

- audience-specific projections are defined
- multidimensional learning is preserved
- evidence scope and uncertainty are visible
- parent and teacher action boundaries are explicit
- adult observation and disagreement contracts exist
- alerts are bounded and non-diagnostic
- consent, privacy, localization, and accessibility are defined
- projection freshness and invalidation are deterministic
- historical replay is supported
- ranking and identity-label restrictions are enforceable

The Parent and Teacher Learning Projection is then ready to make Learning Engine evidence understandable and useful without becoming an alternate source of learning truth.
