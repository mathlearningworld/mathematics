# 16I — Parent & Teacher Projection

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16I — Parent & Teacher Projection  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`, `docs/world/16F-HINT-AND-MENTOR-SUPPORT.md`, `docs/world/16G-MASTERY-AND-PROGRESSION.md`, `docs/world/16H-REMEDIATION.md`  
**Downstream Consumers:** 16J Analytics & Governance, parent application, teacher workspace, learner profile projection, notification runtime, consent runtime, reporting runtime

---

## 1. Purpose

This guide defines how Math Learning World converts complex learning-runtime state into accurate, humane, actionable views for parents and teachers without exposing raw internal machinery, overstating certainty, ranking children unnecessarily, or turning temporary struggle into a permanent label.

The central doctrine is:

> Projection must make learning understandable and actionable while preserving truth, uncertainty, dignity, privacy, and the learner's right to grow.

A conforming projection system must answer:

> What does this adult need to understand now, what evidence supports that interpretation, how certain is the system, what action is appropriate, and what information must remain hidden or delayed?

Parent and teacher projections are not alternate sources of learning truth. They are audience-specific interpretations of authoritative runtime records.

---

## 2. Architectural Position

```text
Authoritative Learning Records
        ↓
Projection Eligibility and Consent
        ↓
Audience and Relationship Resolution
        ↓
Projection Policy
        ↓
Educational Interpretation
        ↓
Confidence and Freshness Qualification
        ↓
Narrative and Visual Projection
        ↓
Action Recommendation
        ↓
Parent or Teacher View
        ↓
Acknowledgement / Follow-up / Escalation
```

Phase 16I is the authority for parent-facing and teacher-facing learning projections, audience-specific interpretation, projection safety, actionability, and communication lifecycle.

It does not own curriculum truth, diagnosis truth, evidence interpretation, mastery decisions, remediation placement, learning analytics governance, or direct modification of learner state.

---

## 3. Authority Boundary

### 3.1 Phase 16I owns

- parent and teacher projection contracts;
- audience-specific view models;
- relationship and access resolution;
- projection eligibility;
- consent-aware visibility;
- confidence and freshness display rules;
- educational-language transformation;
- strengths, needs, and next-step presentation;
- action recommendation contracts;
- alert and notification presentation;
- projection lifecycle;
- projection versioning;
- acknowledgement and follow-up records;
- projection replay and audit;
- safety, dignity, and privacy rules;
- child-facing visibility of adult actions where policy requires it.

### 3.2 Phase 16I does not own

- declaring mastery;
- changing diagnosis directly;
- inventing evidence;
- changing remediation eligibility;
- ranking learners against peers by default;
- exposing raw event streams as educational meaning;
- turning probability into certainty;
- generating punitive labels;
- granting a parent or teacher access without a verified relationship;
- allowing an adult projection to become an execution command against the learner runtime.

---

## 4. Projection Principles

### 4.1 Truth before reassurance

The system must not hide meaningful difficulty merely to make a report feel positive.

### 4.2 Dignity before diagnosis language

A learner is never described as inherently weak, lazy, careless, slow, or incapable.

The system describes observable learning state, for example:

- `needs more evidence across unfamiliar contexts`;
- `currently relies on visual support`;
- `shows stable understanding of equal sharing`;
- `has not yet demonstrated independent transfer`.

### 4.3 Action before data volume

A projection should prioritize what the adult can understand and do, not how much data the system can display.

### 4.4 Uncertainty must remain visible

Low-confidence, stale, contradictory, or highly assisted evidence must not be presented as settled truth.

### 4.5 No hidden peer ranking by default

The primary frame is learner growth against learning targets and prerequisites, not comparison against classmates.

### 4.6 Same truth, different audience

Parents and teachers may receive different language, detail, and actions, but the underlying learning truth must remain consistent.

---

## 5. Authoritative Inputs

A projection may consume only versioned outputs from upstream authorities.

```ts
interface ProjectionSourceBundle {
  learnerId: string;
  curriculumContext: CurriculumContextRef;
  diagnosisSnapshot: LearnerCognitiveSnapshotRef;
  masterySnapshot: MasterySnapshotRef;
  progressionSnapshot: ProgressionSnapshotRef;
  remediationSnapshot?: RemediationSnapshotRef;
  supportHistorySummary: SupportHistorySummaryRef;
  evidenceSummary: EvidenceSummaryRef;
  generatedAt: string;
  sourceVersion: number;
}
```

Raw telemetry may be linked for audit but must not be projected directly without interpretation by its owning authority.

---

## 6. Audiences

```ts
type ProjectionAudience =
  | 'PARENT_PRIMARY'
  | 'PARENT_GUARDIAN'
  | 'TEACHER_CLASSROOM'
  | 'TEACHER_SPECIALIST'
  | 'SCHOOL_LEARNING_SUPPORT'
  | 'AUTHORIZED_MENTOR';
```

Each audience has different legitimate needs.

### 6.1 Parent projection

Parents usually need:

- a clear picture of current understanding;
- visible progress over time;
- an explanation of meaningful struggle;
- practical support that does not turn home into a second classroom;
- alerts when sustained help may be needed;
- reassurance grounded in evidence rather than empty praise.

### 6.2 Teacher projection

Teachers usually need:

- target-level mastery and prerequisite state;
- class and group patterns;
- misconception hypotheses;
- assistance dependence;
- remediation state;
- evidence freshness and confidence;
- suggested instructional responses;
- follow-up and observation tools.

### 6.3 Mentor projection

Authorized mentors receive only the minimum information required for the active support relationship.

---

## 7. Relationship and Access Contract

```ts
interface LearnerAudienceRelationship {
  relationshipId: string;
  learnerId: string;
  accountId: string;
  audience: ProjectionAudience;
  organizationId?: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED' | 'EXPIRED';
  scopes: ProjectionScope[];
  validFrom: string;
  validUntil?: string;
  verifiedBy: RelationshipVerificationMethod;
  version: number;
}

type ProjectionScope =
  | 'LEARNING_OVERVIEW'
  | 'TARGET_DETAIL'
  | 'MASTERY_HISTORY'
  | 'REMEDIATION_STATUS'
  | 'SUPPORT_HISTORY'
  | 'ACTION_RECOMMENDATIONS'
  | 'CLASS_AGGREGATES'
  | 'EXPORT_REPORT';
```

A projection request must fail closed when relationship, scope, or consent cannot be verified.

---

## 8. Consent and Visibility

Projection visibility is determined by:

```text
Verified Relationship
+ Granted Scope
+ Learner Age Policy
+ Guardian Consent
+ School Authority
+ Data Sensitivity
+ Purpose Limitation
+ Time Validity
```

Consent must be versioned and auditable.

```ts
interface ProjectionConsentRecord {
  consentId: string;
  learnerId: string;
  grantedByAccountId: string;
  grantedToAccountId?: string;
  grantedToOrganizationId?: string;
  scopes: ProjectionScope[];
  purpose: string;
  status: 'ACTIVE' | 'WITHDRAWN' | 'EXPIRED';
  grantedAt: string;
  withdrawnAt?: string;
  version: number;
}
```

Withdrawing consent prevents new projections outside legal or institutional retention obligations. It does not rewrite historical audit records.

---

## 9. Projection Domains

A projection is composed from bounded domains rather than one undifferentiated score.

```ts
interface LearningProjection {
  projectionId: string;
  learnerId: string;
  audience: ProjectionAudience;
  generatedAt: string;
  validUntil: string;
  sourceVersion: number;
  projectionVersion: number;
  overallStatus: ProjectionOverallStatus;
  strengths: StrengthProjection[];
  learningNeeds: LearningNeedProjection[];
  currentPath: LearningPathProjection;
  support: SupportProjection;
  remediation?: RemediationProjection;
  recommendedActions: RecommendedAction[];
  confidence: ProjectionConfidence;
  freshness: ProjectionFreshness;
  alerts: ProjectionAlert[];
}
```

### 9.1 Strength projection

A strength must name the mathematical capability and the quality of supporting evidence.

```ts
interface StrengthProjection {
  learningTargetId: string;
  title: string;
  description: string;
  masteryState: string;
  independence: 'ASSISTED' | 'PARTLY_INDEPENDENT' | 'INDEPENDENT';
  transfer: 'NOT_OBSERVED' | 'EMERGING' | 'CONFIRMED';
  confidence: number;
}
```

### 9.2 Learning-need projection

```ts
interface LearningNeedProjection {
  learningTargetId: string;
  needType:
    | 'INSUFFICIENT_EVIDENCE'
    | 'UNSTABLE_UNDERSTANDING'
    | 'ASSISTANCE_DEPENDENCE'
    | 'MISCONCEPTION_SIGNAL'
    | 'PREREQUISITE_GAP'
    | 'TRANSFER_NOT_CONFIRMED'
    | 'REVIEW_DUE';
  description: string;
  evidenceSummary: string;
  urgency: 'OBSERVE' | 'SUPPORT_SOON' | 'ACTION_RECOMMENDED' | 'ESCALATE';
  confidence: number;
}
```

### 9.3 Current-path projection

The current path communicates:

- what the learner is working toward;
- why the target matters;
- what has been unlocked;
- what remains protected;
- what review or remediation is active.

---

## 10. Projection Status

```ts
type ProjectionOverallStatus =
  | 'ON_TRACK'
  | 'PROGRESSING_WITH_SUPPORT'
  | 'REVIEW_NEEDED'
  | 'TARGETED_REMEDIATION_ACTIVE'
  | 'INSUFFICIENT_CURRENT_EVIDENCE'
  | 'HUMAN_FOLLOW_UP_RECOMMENDED';
```

This status is a communication summary only. It must not replace target-level state.

---

## 11. Confidence Projection

Confidence must be derived from upstream confidence, evidence breadth, independence, freshness, contradiction, and projection completeness.

```ts
interface ProjectionConfidence {
  level: 'LOW' | 'MODERATE' | 'HIGH';
  score: number;
  reasons: ProjectionConfidenceReason[];
  qualifiedLanguageRequired: boolean;
}

type ProjectionConfidenceReason =
  | 'LIMITED_EVIDENCE'
  | 'STALE_EVIDENCE'
  | 'CONTRADICTORY_EVIDENCE'
  | 'HIGH_ASSISTANCE'
  | 'NARROW_CONTEXT'
  | 'TRANSFER_CONFIRMED'
  | 'MULTIPLE_INDEPENDENT_OBSERVATIONS';
```

Low-confidence projections must use language such as:

- `the current evidence suggests...`;
- `the system has not yet observed enough...`;
- `this may indicate...`.

They must not use categorical language such as `cannot`, `does not understand`, or `has mastered` unless the authoritative state supports it.

---

## 12. Freshness

```ts
interface ProjectionFreshness {
  newestEvidenceAt?: string;
  oldestRelevantEvidenceAt?: string;
  status: 'CURRENT' | 'AGING' | 'STALE' | 'NO_RECENT_EVIDENCE';
  nextRefreshExpectedAt?: string;
}
```

Stale projections may remain visible for continuity but must display their age and must not trigger high-impact action automatically.

---

## 13. Parent View Contract

The default parent view should answer five questions:

1. What is my child learning now?
2. What is becoming stronger?
3. Where is support still needed?
4. What can we do at home without taking over?
5. Is there anything that needs timely attention?

```ts
interface ParentLearningView {
  learnerId: string;
  summary: string;
  currentLearningGoal: ParentGoalView;
  recentGrowth: ParentGrowthView[];
  supportNeeded: ParentSupportNeedView[];
  homeActions: ParentHomeAction[];
  alerts: ParentAlert[];
  confidenceNote?: string;
  generatedAt: string;
}
```

### 13.1 Parent home actions

Home actions must be:

- brief;
- optional;
- low-pressure;
- connected to daily life;
- free from grading responsibility;
- designed not to reveal mission answers;
- safe for parents with limited mathematics confidence.

Examples:

- compare two recipe quantities;
- ask the learner to explain two different ways to share equally;
- notice ratios in a map, model, or construction task;
- invite explanation before correction.

The system must not instruct parents to repeatedly drill a child unless a validated intervention explicitly requires it.

---

## 14. Teacher View Contract

```ts
interface TeacherLearnerView {
  learnerId: string;
  curriculumContext: CurriculumContextRef;
  targetStates: TeacherTargetProjection[];
  prerequisiteRisks: PrerequisiteRiskProjection[];
  misconceptionSignals: MisconceptionSignalProjection[];
  supportDependence: SupportDependenceProjection;
  remediationStatus?: TeacherRemediationProjection;
  recommendedInstructionalActions: TeacherAction[];
  observationRequests: TeacherObservationRequest[];
  confidence: ProjectionConfidence;
  generatedAt: string;
}
```

Teacher projections may expose more technical educational detail than parent projections, but must still distinguish:

- evidence from inference;
- diagnosis from hypothesis;
- temporary state from durable pattern;
- independent success from assisted success.

---

## 15. Class and Group Projection

Teacher class views may aggregate patterns only when aggregation does not expose unnecessary individual data.

```ts
interface TeacherClassProjection {
  classId: string;
  curriculumContext: CurriculumContextRef;
  targetDistribution: TargetDistribution[];
  commonPrerequisiteGaps: GroupLearningPattern[];
  commonMisconceptionSignals: GroupLearningPattern[];
  supportDemand: GroupSupportDemand;
  suggestedGrouping: SuggestedInstructionalGroup[];
  generatedAt: string;
}
```

Suggested groups are temporary instructional groupings, not ability tracks.

They must include:

- purpose;
- supporting evidence;
- expected duration;
- exit criteria;
- prohibition against public learner labeling.

---

## 16. Recommended Actions

```ts
interface RecommendedAction {
  actionId: string;
  audience: ProjectionAudience;
  actionType:
    | 'OBSERVE'
    | 'ENCOURAGE_EXPLANATION'
    | 'PROVIDE_CONTEXTUAL_PRACTICE'
    | 'REVIEW_PREREQUISITE'
    | 'COORDINATE_WITH_TEACHER'
    | 'CHECK_REMEDIATION_PROGRESS'
    | 'REQUEST_HUMAN_REVIEW'
    | 'NO_ACTION_REQUIRED';
  title: string;
  rationale: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  expiresAt?: string;
  sourceRefs: string[];
}
```

Every action must be traceable to authoritative records.

A recommendation must not:

- punish the learner;
- expose private peer information;
- prescribe unsupported clinical conclusions;
- bypass curriculum, assessment, mastery, or remediation authorities;
- imply that more time or more questions always solve the underlying problem.

---

## 17. Alerts

```ts
type ProjectionAlertType =
  | 'SUSTAINED_PREREQUISITE_GAP'
  | 'REPEATED_REMEDIATION'
  | 'DECLINING_RETENTION'
  | 'HIGH_SUPPORT_DEPENDENCE'
  | 'INSUFFICIENT_EVIDENCE_OVER_TIME'
  | 'CONTRADICTORY_LEARNING_SIGNALS'
  | 'HUMAN_REVIEW_REQUESTED';
```

Alerts must have:

- a clear reason;
- evidence and confidence references;
- urgency;
- intended recipient;
- expiration or resolution criteria;
- acknowledgement state;
- escalation policy.

Alerts are not diagnoses of disability, health, motivation, parenting quality, or teacher quality.

---

## 18. Notification Policy

Notifications are a delivery mechanism, not a source of urgency.

A conforming notification policy must prevent:

- duplicate alerts;
- notification fatigue;
- late-night non-critical delivery;
- escalation from weak evidence;
- exposure of sensitive learning details on lock screens;
- contradictory parent and teacher messages.

```ts
interface ProjectionNotification {
  notificationId: string;
  projectionId: string;
  recipientAccountId: string;
  channel: 'IN_APP' | 'EMAIL' | 'PUSH';
  sensitivity: 'STANDARD' | 'PRIVATE';
  scheduledAt: string;
  deliveredAt?: string;
  acknowledgedAt?: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'SUPPRESSED';
}
```

---

## 19. Projection Lifecycle

```text
REQUESTED
    ↓
AUTHORIZED
    ↓
SOURCE_RESOLVED
    ↓
GENERATED
    ↓
VALIDATED
    ↓
PUBLISHED
    ↓
VIEWED / ACKNOWLEDGED
    ↓
SUPERSEDED / EXPIRED / REVOKED
```

```ts
type ProjectionLifecycleState =
  | 'REQUESTED'
  | 'AUTHORIZED'
  | 'SOURCE_RESOLVED'
  | 'GENERATED'
  | 'VALIDATED'
  | 'PUBLISHED'
  | 'SUPERSEDED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'FAILED';
```

Published projections are immutable snapshots. Corrections create a superseding projection and preserve audit history.

---

## 20. Projection Generation Policy

```ts
interface ProjectionGenerationPolicy {
  audience: ProjectionAudience;
  includedDomains: ProjectionDomain[];
  confidenceThresholds: ConfidenceThresholdPolicy;
  freshnessPolicy: FreshnessPolicy;
  languagePolicyVersion: string;
  actionPolicyVersion: string;
  privacyPolicyVersion: string;
}
```

Generation must be deterministic for the same:

- source bundle version;
- audience;
- relationship scope;
- consent state;
- policy versions;
- locale.

---

## 21. Language Transformation

The language layer transforms technical state without changing meaning.

Example:

```text
Runtime state:
PROVISIONAL mastery, independence 0.61,
transfer not observed, review due in 10 days

Parent projection:
Your child is beginning to use this idea independently.
The system will check it again in a different situation before treating it as secure.

Teacher projection:
Provisional mastery. Independent evidence is emerging,
but transfer evidence is absent. Schedule a varied-context observation.
```

Neither projection may say `mastered` because the authoritative state does not support it.

---

## 22. Strengths-First Ordering

Unless immediate safety or urgent educational follow-up requires otherwise, projections should present:

1. current goal;
2. observed strength or growth;
3. learning need;
4. evidence qualification;
5. recommended action.

Strengths-first ordering does not mean hiding difficulty. It preserves context and learner dignity.

---

## 23. Learner Visibility and Voice

Where age and policy permit, the learner should be able to see:

- what adults can view;
- why an alert exists;
- what support is planned;
- whether a projection contains uncertainty;
- how to add a learner reflection.

```ts
interface LearnerReflection {
  reflectionId: string;
  learnerId: string;
  projectionId?: string;
  promptId: string;
  responseType: 'TEXT' | 'VOICE' | 'CHOICE' | 'DRAWING_REF';
  submittedAt: string;
  visibility: 'LEARNER_ONLY' | 'PARENT_AND_LEARNER' | 'TEACHER_AND_LEARNER' | 'AUTHORIZED_TEAM';
}
```

Learner reflections enrich human understanding but do not automatically rewrite diagnosis or mastery.

---

## 24. Acknowledgement and Follow-up

```ts
interface ProjectionAcknowledgement {
  acknowledgementId: string;
  projectionId: string;
  accountId: string;
  acknowledgedAt: string;
  response:
    | 'SEEN'
    | 'WILL_FOLLOW_UP'
    | 'NEEDS_CLARIFICATION'
    | 'REQUEST_TEACHER_CONTACT'
    | 'REQUEST_HUMAN_REVIEW';
  note?: string;
}
```

Acknowledgement must not be interpreted as completion of the recommended educational action.

---

## 25. Projection Persistence

Suggested persistence records:

```text
learning_projections
projection_source_refs
projection_sections
projection_actions
projection_alerts
projection_notifications
projection_acknowledgements
projection_relationships
projection_consents
learner_reflections
projection_audit_events
```

Required properties include:

- tenant-safe identity;
- learner-safe access boundaries;
- immutable published snapshots;
- source and policy version references;
- idempotent generation keys;
- revocation and expiry state;
- auditability without exposing unnecessary content.

---

## 26. Idempotency and Concurrency

Projection generation key:

```text
learnerId
+ audience
+ relationshipId
+ sourceVersion
+ policyVersionSet
+ locale
```

Repeated generation with the same key must return the existing equivalent projection or a semantically identical result.

Concurrent requests must not produce conflicting active projections for the same key.

---

## 27. API-Oriented Contracts

### 27.1 Generate projection

```http
POST /api/v1/learners/{learnerId}/projections
```

```ts
interface GenerateProjectionRequest {
  audience: ProjectionAudience;
  relationshipId: string;
  locale: string;
  requestedDomains?: ProjectionDomain[];
}
```

### 27.2 Read current projection

```http
GET /api/v1/learners/{learnerId}/projections/current?audience=PARENT_PRIMARY
```

### 27.3 Read projection history

```http
GET /api/v1/learners/{learnerId}/projections
```

### 27.4 Acknowledge projection

```http
POST /api/v1/projections/{projectionId}/acknowledgements
```

### 27.5 Read teacher class projection

```http
GET /api/v1/classes/{classId}/learning-projection
```

### 27.6 Submit learner reflection

```http
POST /api/v1/learners/{learnerId}/reflections
```

All endpoints require tenant, relationship, scope, and consent enforcement.

---

## 28. Runtime Services

Suggested service boundaries:

```text
ProjectionAuthorizationService
ProjectionSourceResolver
ParentProjectionService
TeacherProjectionService
ClassProjectionService
ProjectionConfidenceService
ProjectionLanguageService
RecommendedActionService
ProjectionAlertService
ProjectionNotificationService
ProjectionAuditService
```

The language service may phrase authoritative meaning but cannot alter upstream state.

---

## 29. Failure Taxonomy

```ts
type ProjectionFailureCode =
  | 'RELATIONSHIP_NOT_FOUND'
  | 'RELATIONSHIP_INACTIVE'
  | 'SCOPE_NOT_GRANTED'
  | 'CONSENT_REQUIRED'
  | 'CONSENT_WITHDRAWN'
  | 'SOURCE_BUNDLE_INCOMPLETE'
  | 'SOURCE_VERSION_CONFLICT'
  | 'PROJECTION_POLICY_NOT_FOUND'
  | 'PROJECTION_STALE'
  | 'PROJECTION_SUPERSEDED'
  | 'AUDIENCE_NOT_SUPPORTED'
  | 'LOCALE_NOT_SUPPORTED'
  | 'ALERT_RECIPIENT_UNRESOLVED'
  | 'NOTIFICATION_SUPPRESSED'
  | 'PROJECTION_CONCURRENCY_CONFLICT';
```

Failures must not fall back to broader visibility or weaker privacy rules.

---

## 30. Safety Rules

A conforming projection system must never:

- shame a learner;
- publish a permanent deficit label;
- expose another learner's data;
- infer a medical or developmental diagnosis from educational telemetry;
- recommend punishment;
- encourage excessive study as the default response;
- hide uncertainty;
- omit assistance attribution when it changes interpretation;
- convert an adult's concern directly into mastery regression;
- allow an unverified account to access learner information.

---

## 31. Privacy and Data Minimization

Each projection must contain only what the audience needs for the authorized purpose.

Parent projections generally omit:

- internal event identifiers;
- other learners' data;
- teacher notes not intended for family disclosure;
- raw misconception confidence internals;
- system debugging information.

Teacher projections generally omit:

- unrelated family data;
- private parent messages outside agreed workflows;
- learner information outside the teacher's legitimate educational relationship.

Exports must be separately authorized and watermarked or traceable where appropriate.

---

## 32. Ratio Reasoning Validation Slice

### 32.1 Scenario

The learner can build equivalent ratios with blocks when a visual template is present, but independent transfer to a map-scale activity has not yet been observed.

### 32.2 Authoritative state

```text
Target: Equivalent ratio reasoning
Mastery: PROVISIONAL
Independent evidence: moderate
Assistance: visual scaffold used
Transfer: not observed
Freshness: current
Remediation: not active
```

### 32.3 Parent projection

```text
Your child is beginning to recognize and build equivalent ratios.
Visual models are still helpful, and the system will check whether the idea can be used in a new situation before marking it as secure.

At home, you can ask how doubling both quantities keeps a recipe tasting the same. Let your child explain before offering correction.
```

### 32.4 Teacher projection

```text
Equivalent-ratio reasoning is provisional.
The learner succeeds with visual scaffolding but lacks independent transfer evidence.
Use a varied-context task without the original template and observe whether both quantities are transformed multiplicatively.
```

### 32.5 Prohibited projection

```text
The learner has mastered ratios.
```

This is prohibited because transfer and full independence are not yet supported.

---

## 33. Acceptance Criteria

Phase 16I is conforming when:

1. every projection is derived from authoritative versioned sources;
2. parent and teacher views preserve the same underlying truth;
3. relationship, scope, and consent are enforced before generation;
4. confidence and freshness remain visible;
5. assisted success is not presented as fully independent mastery;
6. recommendations are traceable and non-punitive;
7. projections avoid unnecessary peer ranking;
8. published snapshots are immutable and auditable;
9. sensitive details are minimized by audience;
10. stale or incomplete evidence cannot produce high-certainty claims;
11. learner dignity is protected in all language;
12. projection actions cannot directly mutate learning truth;
13. duplicate generation is idempotent;
14. revocation and expiry are enforced;
15. parent and teacher alerts include resolution criteria.

---

## 34. Handoff to 16J Analytics & Governance

Phase 16I produces governed projection records that 16J may analyze for system quality, including:

- projection freshness;
- projection confidence distribution;
- alert rates;
- recommendation acknowledgement;
- parent and teacher engagement;
- disagreement and clarification requests;
- access and consent failures;
- language-policy effectiveness;
- projection-to-action follow-through.

16J may evaluate whether projection policies are effective and fair, but must not silently rewrite an individual learner's projection or learning truth.

---

## 35. Final Doctrine

> A trustworthy learning system does not merely know what is happening. It explains what matters to the right adult, at the right level of detail, with honest uncertainty and a humane next step.

Phase 16I completes the visibility layer between the learner runtime and the adults responsible for support. It transforms internal learning state into shared understanding without sacrificing evidence integrity, learner dignity, or privacy.
