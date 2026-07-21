# 16F — Hint & Mentor Support

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16F — Hint & Mentor Support  
**Document Type:** Child Architecture / Production Contract  
**Status:** Foundation Complete  
**Parent Authority:** `docs/world/16-LEARNING-MISSION-SYSTEM-GUIDE.md`  
**Upstream Authorities:** `docs/world/16A-LEARNING-TARGET-AND-COGNITIVE-TRANSFORMATION-GRAPH.md`, `docs/world/16B-LEARNER-READINESS-AND-COGNITIVE-DIAGNOSIS.md`, `docs/world/16C-COGNITIVE-MISSION-PLANNING-AND-GENERATION.md`, `docs/world/16D-WORLD-ACTIVITY-BINDING.md`, `docs/world/16E-MATHEMATICAL-EVIDENCE-AND-ASSESSMENT.md`  
**Downstream Consumers:** 16G Mastery & Progression, 16H Remediation, 16I Parent/Teacher Projection, 16J Analytics & Governance, mission runtime, NPC runtime, mentor runtime, evidence runtime

---

## 1. Purpose

This guide defines how Math Learning World provides help without replacing learner thinking, corrupting evidence, or allowing assistance to masquerade as independent understanding.

The central doctrine is:

> Support must preserve productive struggle, reveal structure gradually, and remain visible in the evidence trail.

A conforming support system must answer:

> What obstacle is blocking the learner, what is the smallest useful intervention, who or what should deliver it, and how must the assessment confidence change afterward?

---

## 2. Architectural Position

```text
Learner Cognitive Snapshot
        ↓
Mission State + Runtime Evidence
        ↓
Support Need Detection
        ↓
Support Policy Resolution
        ↓
Hint or Mentor Intervention
        ↓
Learner Response
        ↓
Assistance-Attributed Evidence
        ↓
Assessment Confidence Adjustment
```

Phase 16F is the authority for instructional assistance during active learning experiences.

It does not own curriculum structure, cognitive transformation definitions, diagnosis truth, mission generation, world binding, assessment conclusions, mastery policy, or remediation placement.

---

## 3. Authority Boundary

### 3.1 Phase 16F owns

- support-need detection;
- hint eligibility and timing;
- hint sequencing;
- mentor eligibility and routing;
- assistance attribution;
- independence protection;
- support cooldowns and escalation;
- support delivery contracts;
- support event provenance;
- support quality and safety rules;
- support lifecycle and failure handling.

### 3.2 Phase 16F does not own

- declaring a learner mastered;
- rewriting the learner diagnosis directly;
- choosing the curriculum target;
- changing the mission's educational intent;
- inventing mathematical evidence after the fact;
- rewarding task completion as proof of understanding;
- deciding long-term remediation placement.

---

## 4. Core Principles

### 4.1 Minimum Effective Support

The system must provide the smallest intervention likely to restore productive thinking.

It should prefer:

```text
attention cue
    before
representation cue
    before
relationship cue
    before
strategy cue
    before
worked step
    before
full demonstration
```

### 4.2 Evidence Visibility

Every intervention that may affect learner performance must be recorded.

No assisted success may be projected as independent success.

### 4.3 Productive Struggle Protection

Difficulty alone is not a reason to intervene.

The system must distinguish between:

- productive struggle;
- random trial behavior;
- repeated misconception;
- interface confusion;
- inaccessible presentation;
- emotional overload;
- inactivity caused by distraction or interruption.

### 4.4 Assistance Must Not Become Answer Delivery

A hint may reveal structure, constraints, contrasts, or a next observation.

It must not silently execute the reasoning the learner is supposed to demonstrate.

### 4.5 Human Mentorship Is First-Class but Attributed

Parent, sibling, teacher, peer, or system mentor support may be valuable.

The system must capture what kind of help occurred and must not treat the resulting evidence as fully independent unless later confirmed.

---

## 5. Support Need Model

```ts
interface SupportNeed {
  supportNeedId: string;
  learnerId: string;
  missionInstanceId: string;
  transformationId: string;
  detectedAt: string;
  reason: SupportNeedReason;
  severity: SupportNeedSeverity;
  confidence: number;
  blockingStepId?: string;
  misconceptionHypothesisId?: string;
  interfaceObstacle?: InterfaceObstacle;
  emotionalSignal?: EmotionalSignal;
  evidenceRefs: string[];
}
```

### 5.1 SupportNeedReason

```ts
type SupportNeedReason =
  | 'PROLONGED_INACTIVITY'
  | 'REPEATED_INVALID_ACTION'
  | 'REPEATED_SAME_STRATEGY_FAILURE'
  | 'MISCONCEPTION_PATTERN'
  | 'CONTRADICTION_NOT_NOTICED'
  | 'REPRESENTATION_BREAKDOWN'
  | 'TOOL_OR_INTERFACE_CONFUSION'
  | 'EXCESSIVE_RANDOM_TRIALS'
  | 'EMOTIONAL_OVERLOAD'
  | 'LEARNER_REQUESTED_HELP'
  | 'MENTOR_REQUESTED_SUPPORT';
```

### 5.2 Severity

```ts
type SupportNeedSeverity =
  | 'OBSERVE'
  | 'LIGHT_SUPPORT'
  | 'STRUCTURED_SUPPORT'
  | 'MENTOR_RECOMMENDED'
  | 'MISSION_PAUSE_RECOMMENDED';
```

---

## 6. Hint Taxonomy

### 6.1 Level H0 — No Hint

The learner continues independently.

The runtime may provide neutral feedback such as world consequences, but no instructional cue.

### 6.2 Level H1 — Attention Cue

Purpose: direct attention without naming the relationship.

Examples:

- highlight two quantities that should be compared;
- animate the part of the structure that changed;
- ask the learner to inspect both mixtures;
- indicate that one measurement has not yet been considered.

### 6.3 Level H2 — Representation Cue

Purpose: suggest a useful way to organize the situation.

Examples:

- place quantities into paired containers;
- expose a ratio table frame without filling it;
- show equal groups or unit bars;
- allow the learner to overlay two constructions.

### 6.4 Level H3 — Relationship Cue

Purpose: point toward the mathematical relationship without completing it.

Examples:

- ask whether both quantities changed by the same factor;
- ask whether equal differences are enough;
- prompt comparison per one unit;
- reveal that two equivalent forms should preserve a relationship.

### 6.5 Level H4 — Strategy Cue

Purpose: suggest a strategy that the learner must execute.

Examples:

- scale both quantities by the same factor;
- test a unit rate;
- construct a counterexample;
- compare equivalent fractions using a common representation.

### 6.6 Level H5 — Partial Worked Step

Purpose: model one bounded step while preserving remaining reasoning.

This level materially reduces independence and must lower evidence weight.

### 6.7 Level H6 — Full Demonstration

Purpose: resolve instructional deadlock or protect emotional safety.

A full demonstration is not evidence of learner understanding.

It must trigger a future re-attempt or transfer task before independent learning can be claimed.

---

## 7. Hint Policy Contract

```ts
interface HintPolicy {
  hintPolicyId: string;
  version: number;
  transformationId: string;
  allowedLevels: HintLevel[];
  minimumIndependentAttemptCount: number;
  minimumObservationSeconds: number;
  cooldownSeconds: number;
  learnerRequestAllowed: boolean;
  autoOfferAllowed: boolean;
  autoApplyAllowed: boolean;
  maximumHintsPerMission: number;
  evidencePenaltyPolicyId: string;
  escalationPolicyId: string;
}
```

```ts
type HintLevel = 'H0' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
```

### 7.1 Auto-apply restriction

Instructional hints above H1 must not be silently auto-applied.

The learner should retain agency to request, accept, or decline support unless accessibility or safety policy requires otherwise.

---

## 8. Hint Selection

Hint selection must be grounded in:

- current mission step;
- intended cognitive transformation;
- learner diagnosis;
- recent action sequence;
- prior hints already used;
- misconception hypothesis;
- accessibility needs;
- emotional state signals;
- evidence requirements still unmet.

The selector must not choose hints only from time elapsed.

```ts
interface HintSelectionRequest {
  learnerId: string;
  missionInstanceId: string;
  supportNeedId: string;
  missionStepId: string;
  cognitiveSnapshotVersion: number;
  priorSupportEvents: SupportEventRef[];
  availableHintDefinitions: string[];
}
```

```ts
interface HintSelectionResult {
  selectedHintId?: string;
  selectedLevel?: HintLevel;
  rationaleCode: string;
  expectedBarrierAddressed?: string;
  evidenceImpact: EvidenceImpact;
  fallbackAction: 'WAIT' | 'OFFER_MENTOR' | 'PAUSE_MISSION' | 'NO_SUPPORT';
}
```

---

## 9. Hint Definition

```ts
interface HintDefinition {
  hintId: string;
  version: number;
  transformationId: string;
  missionPatternId?: string;
  level: HintLevel;
  targetedBarrier: string;
  deliveryMode: HintDeliveryMode;
  contentRef: string;
  prohibitedRevelations: string[];
  expectedLearnerAction: string;
  evidenceImpact: EvidenceImpact;
  accessibilityVariants: AccessibilityVariantRef[];
}
```

```ts
type HintDeliveryMode =
  | 'WORLD_ANIMATION'
  | 'OBJECT_HIGHLIGHT'
  | 'NPC_PROMPT'
  | 'VISUAL_OVERLAY'
  | 'MANIPULATIVE_FRAME'
  | 'AUDIO_PROMPT'
  | 'TEXT_PROMPT'
  | 'GUIDED_DEMONSTRATION';
```

---

## 10. Mentor Model

A mentor is an attributed source of support, not an invisible extension of the learner.

```ts
interface MentorProfile {
  mentorId: string;
  mentorType: MentorType;
  accountId?: string;
  displayName: string;
  verifiedRelationship?: string;
  allowedLearnerIds: string[];
  capabilityProfileId: string;
  supervisionPolicyId: string;
  active: boolean;
}
```

```ts
type MentorType =
  | 'SYSTEM_NPC'
  | 'PARENT'
  | 'SIBLING'
  | 'TEACHER'
  | 'PEER'
  | 'APPROVED_TUTOR';
```

### 10.1 Mentor capability boundaries

A mentor may:

- ask questions;
- direct attention;
- request an explanation;
- demonstrate a bounded example;
- encourage revision;
- help with interface operation;
- provide emotional support.

A mentor must not:

- submit an answer as the learner;
- manipulate evidence attribution;
- certify mastery;
- conceal assistance;
- bypass mission safeguards;
- coerce the learner into a prescribed explanation.

---

## 11. Mentor Session Contract

```ts
interface MentorSession {
  mentorSessionId: string;
  learnerId: string;
  mentorId: string;
  missionInstanceId: string;
  startedAt: string;
  endedAt?: string;
  mode: MentorSessionMode;
  supportGoal: string;
  status: MentorSessionStatus;
  interventionIds: string[];
  supervisionFlags: string[];
}
```

```ts
type MentorSessionMode =
  | 'IN_WORLD_NPC'
  | 'CO_PRESENT_FAMILY'
  | 'REMOTE_TEACHER'
  | 'PEER_COLLABORATION'
  | 'SYSTEM_GUIDED';
```

```ts
type MentorSessionStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'FLAGGED';
```

---

## 12. Mentor Intervention Record

```ts
interface MentorIntervention {
  interventionId: string;
  mentorSessionId: string;
  occurredAt: string;
  interventionType: MentorInterventionType;
  targetBarrier?: string;
  contentSummary: string;
  learnerResponseRef?: string;
  assistanceMagnitude: AssistanceMagnitude;
  evidenceImpact: EvidenceImpact;
}
```

```ts
type MentorInterventionType =
  | 'ATTENTION_PROMPT'
  | 'CLARIFYING_QUESTION'
  | 'REPRESENTATION_SUGGESTION'
  | 'STRATEGY_SUGGESTION'
  | 'PARTIAL_MODEL'
  | 'FULL_MODEL'
  | 'INTERFACE_HELP'
  | 'EMOTIONAL_SUPPORT'
  | 'METACOGNITIVE_PROMPT';
```

---

## 13. Assistance Magnitude

```ts
type AssistanceMagnitude =
  | 'NONE'
  | 'MINIMAL'
  | 'LIGHT'
  | 'MODERATE'
  | 'SUBSTANTIAL'
  | 'SOLUTION_REVEALING';
```

Assistance magnitude must be derived from what was revealed, not merely from the hint label.

A poorly designed H2 hint may be solution-revealing in a narrow task. The runtime must evaluate actual informational impact.

---

## 14. Evidence Impact

```ts
interface EvidenceImpact {
  independenceWeightMultiplier: number;
  confidenceCap?: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresIndependentConfirmation: boolean;
  invalidatesCurrentEvidenceRequirementIds: string[];
  createsFollowUpRequirementIds: string[];
}
```

Recommended default interpretation:

| Assistance | Independence multiplier | Independent confirmation |
|---|---:|---|
| H0 | 1.00 | No |
| H1 | 0.90 | Sometimes |
| H2 | 0.75 | Usually |
| H3 | 0.60 | Yes |
| H4 | 0.45 | Yes |
| H5 | 0.20 | Mandatory |
| H6 | 0.00 | Mandatory |

These values are policy defaults, not universal truths. The actual transformation and evidence requirement may override them.

---

## 15. Support Lifecycle

```text
NOT_NEEDED
    ↓
OBSERVING
    ↓
NEED_DETECTED
    ↓
SUPPORT_OFFERED
    ↓
ACCEPTED | DECLINED
    ↓
DELIVERED
    ↓
LEARNER_RESPONSE_OBSERVED
    ↓
EVIDENCE_ATTRIBUTED
    ↓
RESOLVED | ESCALATED | PAUSED
```

```ts
type SupportLifecycleState =
  | 'NOT_NEEDED'
  | 'OBSERVING'
  | 'NEED_DETECTED'
  | 'SUPPORT_OFFERED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'DELIVERED'
  | 'RESPONSE_OBSERVED'
  | 'EVIDENCE_ATTRIBUTED'
  | 'RESOLVED'
  | 'ESCALATED'
  | 'PAUSED';
```

---

## 16. Escalation Policy

Escalation must be based on barrier persistence, not impatience.

```text
independent observation
        ↓
light cue
        ↓
representation support
        ↓
relationship support
        ↓
strategy support
        ↓
mentor support
        ↓
worked example
        ↓
mission pause or remediation recommendation
```

Escalation should stop when:

- the learner resumes productive reasoning;
- the obstacle was only interface-related;
- emotional overload requires a pause;
- the mission can no longer produce valid independent evidence;
- continued support would reveal the full target relationship.

---

## 17. Learner Agency

The learner should be able to:

- request help;
- decline nonessential help;
- ask for a different representation;
- request repetition;
- indicate that the issue is interface confusion rather than mathematics;
- pause a mentor session;
- attempt independently after support.

The system must not shame the learner for requesting help.

Hint use is learning data, not misconduct.

---

## 18. Accessibility Support

Accessibility assistance must be separated from mathematical assistance whenever possible.

Examples of accessibility support:

- text-to-speech;
- larger manipulatives;
- reduced visual clutter;
- color-independent encodings;
- alternative input methods;
- slower animation;
- captioning;
- language simplification.

Accessibility support must not automatically reduce mathematical independence unless it reveals mathematical structure beyond the original task.

```ts
interface AccessibilitySupportEvent {
  eventId: string;
  learnerId: string;
  missionInstanceId: string;
  accommodationType: string;
  mathematicalInformationAdded: boolean;
  evidenceImpact: EvidenceImpact;
}
```

---

## 19. Emotional Safety

The support engine may detect signals such as:

- rapid repeated failures;
- abandonment attempts;
- unusually long inactivity;
- explicit frustration input;
- repeated deletion or destruction unrelated to strategy;
- mentor concern.

It must not infer clinical or psychological diagnoses.

Permitted responses include:

- pause suggestion;
- encouragement;
- lower-pressure re-entry;
- optional mentor contact;
- mission restart without penalty;
- alternative representation.

---

## 20. Multiplayer and Collaborative Work

Collaborative success does not automatically identify which learner understood what.

For multiplayer missions, the runtime must record:

- action ownership;
- explanation ownership;
- object manipulation ownership;
- suggestion source;
- final decision ownership;
- mentor-like peer support;
- shared versus individual evidence.

```ts
interface CollaborationAttribution {
  learnerId: string;
  contributionType: string;
  actionRefs: string[];
  explanationRefs: string[];
  assistanceReceivedFrom: string[];
  assistanceGivenTo: string[];
  independentEvidenceEligible: boolean;
}
```

---

## 21. Ratio Reasoning Validation Slice

### 21.1 Context

A learner believes two mixtures are equivalent whenever the difference between ingredients is the same.

Mission target:

```text
Difference-Based Comparison
        ↓
Multiplicative Comparison
```

World activity:

Repair mortar is prepared in two mixing stations.

### 21.2 Independent attempt

The learner selects:

```text
2 sand : 1 binder
4 sand : 3 binder
```

and claims they are equivalent because both differ by one.

### 21.3 H1 attention cue

The NPC asks the learner to inspect how many times larger each ingredient became.

The system does not name proportionality.

### 21.4 H2 representation cue

The world places both mixtures into paired unit trays.

The learner can see that doubling `2:1` would produce `4:2`, not `4:3`.

### 21.5 Evidence interpretation

If the learner revises successfully after H2:

- evidence supports responsiveness to representation;
- evidence does not yet prove independent multiplicative reasoning;
- follow-up independent confirmation is required;
- the next mission should remove the paired-tray scaffold.

### 21.6 Mentor intervention

A parent mentor asks:

> If the sand doubled, what would have to happen to the binder for the mixture to stay the same?

This intervention is recorded as a relationship cue, not as independent learner evidence.

---

## 22. Support Event Contract

```ts
interface SupportEvent {
  supportEventId: string;
  learnerId: string;
  missionInstanceId: string;
  supportNeedId?: string;
  sourceType: 'SYSTEM' | 'NPC' | 'HUMAN_MENTOR' | 'PEER';
  sourceId?: string;
  hintId?: string;
  mentorInterventionId?: string;
  deliveredAt: string;
  acceptedAt?: string;
  declinedAt?: string;
  assistanceMagnitude: AssistanceMagnitude;
  evidenceImpact: EvidenceImpact;
  contentVersion: number;
  correlationId: string;
}
```

---

## 23. Runtime Services

Recommended service boundaries:

```text
SupportNeedDetector
HintPolicyResolver
HintSelector
HintDeliveryService
MentorEligibilityService
MentorSessionService
AssistanceAttributionService
SupportEscalationService
SupportAuditService
```

Each service must expose deterministic inputs and outputs suitable for replay and audit.

---

## 24. API-Oriented Contracts

### 24.1 Detect support need

```http
POST /api/v1/learning-support/support-needs:detect
```

### 24.2 Offer hint

```http
POST /api/v1/learning-support/missions/{missionInstanceId}/hints:offer
```

### 24.3 Accept hint

```http
POST /api/v1/learning-support/hint-offers/{offerId}:accept
```

### 24.4 Decline hint

```http
POST /api/v1/learning-support/hint-offers/{offerId}:decline
```

### 24.5 Request mentor

```http
POST /api/v1/learning-support/missions/{missionInstanceId}/mentors:request
```

### 24.6 Record mentor intervention

```http
POST /api/v1/learning-support/mentor-sessions/{mentorSessionId}/interventions
```

### 24.7 Complete mentor session

```http
POST /api/v1/learning-support/mentor-sessions/{mentorSessionId}:complete
```

---

## 25. Failure Taxonomy

```ts
type LearningSupportFailureCode =
  | 'SUPPORT_NEED_NOT_FOUND'
  | 'MISSION_NOT_ACTIVE'
  | 'HINT_NOT_ALLOWED'
  | 'HINT_COOLDOWN_ACTIVE'
  | 'HINT_LIMIT_REACHED'
  | 'HINT_CONTENT_VERSION_MISMATCH'
  | 'HINT_WOULD_REVEAL_PROHIBITED_INFORMATION'
  | 'MENTOR_NOT_ELIGIBLE'
  | 'MENTOR_NOT_AUTHORIZED_FOR_LEARNER'
  | 'MENTOR_SESSION_NOT_ACTIVE'
  | 'INTERVENTION_ATTRIBUTION_REQUIRED'
  | 'EVIDENCE_IMPACT_UNRESOLVED'
  | 'SUPPORT_EVENT_DUPLICATE'
  | 'SUPPORT_POLICY_VERSION_MISMATCH'
  | 'MISSION_PAUSE_REQUIRED';
```

---

## 26. Idempotency and Ordering

All support writes must accept an idempotency key.

Support events must preserve ordering through:

- mission instance sequence;
- support event sequence;
- correlation ID;
- causation ID;
- policy version;
- content version.

Duplicate mentor interventions or hint acceptances must not be counted twice.

---

## 27. Privacy and Child Safety

The mentor system must:

- restrict access to authorized relationships;
- minimize recorded free text;
- separate learner-visible and administrator-only data;
- prevent open contact discovery by minors;
- support moderation and audit;
- retain only information required for learning support and safety;
- avoid public comparison of hint usage.

Human mentor communication channels must follow product child-safety policy before implementation.

---

## 28. Analytics Semantics

Permitted aggregate metrics include:

- hint request rate;
- hint level distribution;
- time from support to productive action;
- independent confirmation rate;
- mentor response rate;
- repeated barrier rate;
- accessibility support usage;
- escalation frequency.

Prohibited interpretations include:

- fewer hints always means stronger learning;
- more hints means laziness;
- fast completion means mastery;
- mentor use means failure.

---

## 29. Handoff to Phase 16G

Phase 16G must receive:

```ts
interface SupportAdjustedAssessmentContext {
  learnerId: string;
  transformationId: string;
  assessmentResultId: string;
  supportEventIds: string[];
  maximumAssistanceMagnitude: AssistanceMagnitude;
  independentEvidenceWeight: number;
  independentConfirmationRequired: boolean;
  pendingFollowUpRequirementIds: string[];
}
```

Phase 16G may use this context when deciding mastery and progression.

It must not discard assistance history or promote assisted performance to independent mastery without policy-backed confirmation.

---

## 30. Acceptance Criteria

Phase 16F is architecturally complete when:

- every instructional intervention is attributable;
- hint levels preserve a minimum-support progression;
- independent and assisted evidence remain distinguishable;
- mentor sessions have explicit authority and safety boundaries;
- accessibility support is not confused with mathematical assistance;
- support escalation is deterministic and auditable;
- full demonstrations require later independent confirmation;
- multiplayer assistance can be attributed;
- Phase 16E receives evidence-impact metadata;
- Phase 16G receives support-adjusted assessment context.

---

## 31. Foundation Decision

**Result:** PASS — FOUNDATION COMPLETE

Phase 16F establishes a bounded support architecture in which hints and mentors help learners resume meaningful mathematical activity without silently replacing their thinking.

The resulting runtime preserves three truths simultaneously:

```text
The learner may need help.
        ≠
The help should do the thinking.
        ≠
Assisted success proves independent mastery.
```

This foundation is ready to hand off to Phase 16G — Mastery & Progression.
