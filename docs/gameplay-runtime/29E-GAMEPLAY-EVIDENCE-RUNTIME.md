# 29E — Gameplay Evidence Runtime

## Status

Architecture definition for Chapter 29E.

This slice defines how authorized Gameplay Interactions become evidence candidates that Assessment may inspect, while preserving provenance, assistance context, uncertainty, and authority boundaries.

---

## 1. Purpose

Gameplay Evidence Runtime is responsible for constructing, validating, grouping, qualifying, and publishing evidence candidates produced through gameplay.

It answers:

- Which accepted interactions may support an evidence claim?
- What exactly was observed?
- Who performed the observable action?
- Under what objective, assistance, collaboration, and runtime conditions did it occur?
- How strong, complete, fresh, and trustworthy is the candidate?
- Which Assessment contract may consume it?

It does not decide mastery, proficiency, readiness, grade placement, recommendation, or mission completion.

---

## 2. Authority Boundary

```text
Authorized Gameplay Interactions
                ↓
      Gameplay Evidence Runtime
                ↓
       Evidence Candidate Ledger
                ↓
          Assessment Engine
                ↓
        Assessment Claim / Refusal
```

The evidence runtime may describe observations. Only Assessment may interpret those observations as learning claims.

```text
Observation ≠ Interpretation
Evidence candidate ≠ Assessment claim
Objective success ≠ Mastery
Gameplay score ≠ Understanding
```

---

## 3. Evidence Principles

1. Evidence must retain source provenance.
2. Evidence must retain assistance context.
3. Evidence must retain actor identity and collaboration attribution.
4. Evidence strength must never be inferred from presentation quality alone.
5. Missing context reduces confidence; it must not be silently invented.
6. Evidence may be partial, conflicting, inconclusive, or unusable.
7. Repetition does not automatically create independence.
8. A single event may support multiple candidates only through explicit mapping.
9. Evidence publication is not assessment acceptance.
10. Historical evidence is append-only.

---

## 4. Evidence Candidate Families

```text
ACTION_SEQUENCE
FINAL_OUTCOME
INTERMEDIATE_STATE
PROBLEM_RESPONSE
EXPLANATION
COMPARISON
CLASSIFICATION
CONSTRUCTION
MEASUREMENT
ESTIMATION
SIMULATION_RESULT
ERROR_PATTERN
STRATEGY_USE
SELF_CORRECTION
TRANSFER_ATTEMPT
COLLABORATIVE_CONTRIBUTION
PERSISTENCE_SIGNAL
HELP_SEEKING_SIGNAL
REFLECTION
```

Not all families are suitable for all skills or claims.

---

## 5. Canonical Evidence Candidate

```ts
interface GameplayEvidenceCandidate {
  evidenceCandidateId: string;
  tenantId: string;
  learnerId: string;
  actorId: string;

  sessionId: string;
  missionId?: string;
  missionVersion?: number;
  objectiveId?: string;
  objectiveVersion?: number;

  evidenceFamily: GameplayEvidenceFamily;
  targetClaimTypes: string[];
  targetSkillIds: string[];

  sourceInteractionIds: string[];
  sourceSequenceRange: {
    from: number;
    to: number;
  };

  observation: EvidenceObservation;
  outcomeContext?: EvidenceOutcomeContext;
  assistanceContext: AssistanceContext;
  collaborationContext?: CollaborationContext;
  accessibilityContext?: AccessibilityContext;

  strength: EvidenceStrength;
  completeness: EvidenceCompleteness;
  independence: EvidenceIndependence;
  freshness: EvidenceFreshness;
  integrity: EvidenceIntegrity;

  occurredFrom?: string;
  occurredTo?: string;
  constructedAt: string;
  publishedAt?: string;

  schemaVersion: string;
  policyVersion: string;
  mappingVersion: string;
  integrityHash: string;
}
```

---

## 6. Evidence Construction Pipeline

```text
Observe Accepted Interactions
          ↓
Resolve Evidence Mapping Policy
          ↓
Select Source Interaction Set
          ↓
Validate Actor and Scope
          ↓
Validate Objective and Skill Binding
          ↓
Attach Assistance / Collaboration Context
          ↓
Construct Observation
          ↓
Qualify Strength and Limitations
          ↓
Check Duplicate / Overlap / Independence
          ↓
Persist Candidate
          ↓
Publish to Assessment Intake
```

No candidate may be published before its source interaction set is durably known.

---

## 7. Observation Model

Evidence observations should describe what was actually seen, not what it supposedly means.

Good observation:

```text
Learner placed 8 equal groups of 3 objects and submitted 24.
```

Invalid interpretation inside Gameplay Evidence:

```text
Learner mastered multiplication.
```

Observation fields may include:

- action sequence,
- submitted response,
- constructed world state,
- timing windows,
- correction sequence,
- chosen strategy markers,
- explanation artifact,
- comparison result,
- tool use,
- hint use,
- retry pattern,
- collaboration contribution.

---

## 8. Evidence Strength

```text
STRONG
MODERATE
WEAK
MINIMAL
UNUSABLE
PENDING_REVIEW
```

Strength is determined by policy and may consider:

- directness of observation,
- actor verification,
- task alignment,
- assistance level,
- completeness,
- integrity,
- environmental validity,
- source diversity,
- reproducibility.

Strength is not mastery probability and must not be projected as one.

---

## 9. Completeness

```text
COMPLETE
PARTIAL
FRAGMENTED
MISSING_CONTEXT
TRUNCATED
UNKNOWN
```

Examples:

- A final answer without working may be complete for answer accuracy but partial for reasoning.
- A construction outcome without actor attribution may be unusable for individual assessment.
- A disconnected offline session may retain a complete interaction sequence but unknown wall-clock timing.

---

## 10. Independence and Overlap

```text
INDEPENDENT
PARTIALLY_OVERLAPPING
FULLY_DERIVED
REPEATED_SAME_TASK
SHARED_SOURCE
UNKNOWN
```

Rules:

- Multiple candidates derived from the same interaction set are not independent.
- Replaying the same task does not automatically produce independent evidence.
- A group outcome and an individual contribution may share source data and must declare overlap.
- Assessment must receive overlap metadata to avoid double counting.

---

## 11. Assistance Context

```ts
interface AssistanceContext {
  accommodationUsed: boolean;
  instructionalHelpUsed: boolean;
  hintCount: number;
  highestHintLevel?: string;
  directAnswerExposed: boolean;
  peerHelpUsed: boolean;
  teacherHelpUsed: boolean;
  mentorHelpUsed: boolean;
  systemCorrectionUsed: boolean;
  notes?: string[];
}
```

Rules:

- Accessibility accommodation is not automatically instructional assistance.
- Direct-answer exposure must never be hidden.
- Assistance may limit evidence use without invalidating the gameplay session.
- Evidence created after help may still be valuable for formative assessment.

---

## 12. Collaboration Context

Collaborative candidates must retain:

```text
groupId
participantIds
individualActorId
contributionType
contributionRange
sharedOutcomeId
attributionConfidence
peerAssistance
```

A shared construction may support:

- group-process evidence,
- individual contribution evidence,
- no individual correctness claim.

The runtime must not assign equal evidence to every participant by default.

---

## 13. Accessibility Context

Accessibility metadata may include:

- input adaptation,
- display adaptation,
- timing accommodation,
- language support,
- assistive device,
- alternative interaction mode.

This metadata exists to preserve interpretation fairness, not to reduce evidence strength automatically.

---

## 14. Evidence Integrity

```text
VERIFIED
VERIFIED_WITH_LIMITATIONS
UNVERIFIED_ACTOR
UNVERIFIED_SEQUENCE
SOURCE_MISSING
HASH_MISMATCH
RUNTIME_COMPROMISED
QUARANTINED
```

Integrity verification covers:

- source interaction existence,
- ordered source range,
- actor continuity,
- objective version,
- schema compatibility,
- runtime instance identity,
- content hash,
- prohibited mutation detection.

---

## 15. Freshness

```text
CURRENT
RECENT
AGING
STALE
SUPERSEDED
HISTORICAL
```

Freshness is relative to the target claim and policy. Old evidence remains historical truth but may become unsuitable for current-state assessment.

---

## 16. Mapping Policy

Evidence mapping declares:

```text
interaction types
objective types
evidence family
target skill candidates
target claim types
required source pattern
minimum integrity
assistance limitations
collaboration rules
completion rules
```

Mapping policy may propose target skills but must not fabricate a skill relationship absent from the curriculum or objective contract.

---

## 17. Evidence Bundles

A bundle groups related candidates for Assessment intake.

```ts
interface GameplayEvidenceBundle {
  bundleId: string;
  tenantId: string;
  learnerId: string;
  sessionId: string;
  objectiveId?: string;
  candidateIds: string[];
  targetAssessmentContract: string;
  overlapSummary: unknown;
  bundleLimitations: string[];
  constructedAt: string;
  integrityHash: string;
}
```

A bundle is a transport and interpretation aid. It is not a claim.

---

## 18. Conflicting Evidence

Conflicting candidates must coexist.

Examples:

- correct answer with incorrect explanation,
- successful construction after direct help,
- correct result followed by inconsistent transfer attempt,
- group success with weak individual contribution.

Gameplay Evidence Runtime records the conflict. Assessment decides how to interpret it.

No candidate may erase another merely because it is newer or more convenient.

---

## 19. Evidence Refusal

Candidate construction must refuse when:

```text
source interaction is unauthorized
actor identity is insufficient
objective binding is absent where required
source set is incomplete beyond policy tolerance
integrity validation fails
mapping policy is unavailable
evidence would violate privacy policy
evidence would misattribute collaboration
```

Refusal is recorded as operational evidence processing history, not learner failure.

---

## 20. Publication Decisions

```text
PUBLISH
PUBLISH_WITH_LIMITATIONS
HOLD_FOR_MORE_CONTEXT
HOLD_FOR_REVIEW
QUARANTINE
REJECT
```

`PUBLISH_WITH_LIMITATIONS` must include machine-readable limitations.

Assessment may independently accept, limit, defer, or reject the candidate.

---

## 21. Privacy and Minimization

Evidence must contain only data required for legitimate learning interpretation, audit, safety, and replay.

Rules:

- Raw audio or video must not be retained by default.
- Sensitive free text requires explicit classification.
- World coordinates should be generalized when precise location is unnecessary.
- Peer identities must be minimized in learner-facing projections.
- Retention policy must be explicit per evidence family.

---

## 22. Persistence

The durable model is append-only and includes:

```text
EvidenceCandidateRecord
EvidenceSourceLinkRecord
EvidenceQualificationRecord
EvidenceLimitationRecord
EvidenceBundleRecord
EvidencePublicationRecord
EvidenceRefusalRecord
EvidenceSupersessionRecord
EvidenceVerificationRecord
```

Correction creates a superseding record; it never edits historical meaning in place.

---

## 23. Idempotency

Construction idempotency must prevent duplicate candidates from identical source sets and mapping versions.

Recommended key:

```text
tenantId
learnerId
sessionId
objectiveId
sorted sourceInteractionIds
mappingVersion
evidenceFamily
```

A deliberate re-evaluation under a new mapping version creates a new candidate linked to the previous one.

---

## 24. Replay

Replay modes:

```text
HISTORICAL_EVIDENCE_REPLAY
MAPPING_POLICY_SIMULATION
ASSESSMENT_HANDOFF_REPLAY
RECOVERY_REPLAY
DIAGNOSTIC_REPLAY
```

Historical replay must use original source data and policy versions where available.

Simulation results are comparative artifacts and must never replace historical candidates.

---

## 25. Failure Codes

```text
EVIDENCE_SOURCE_NOT_FOUND
EVIDENCE_SOURCE_UNAUTHORIZED
EVIDENCE_SCOPE_MISMATCH
EVIDENCE_ACTOR_UNVERIFIED
EVIDENCE_OBJECTIVE_UNBOUND
EVIDENCE_MAPPING_UNAVAILABLE
EVIDENCE_MAPPING_INCOMPATIBLE
EVIDENCE_SOURCE_INCOMPLETE
EVIDENCE_OVERLAP_UNRESOLVED
EVIDENCE_COLLABORATION_MISATTRIBUTED
EVIDENCE_ASSISTANCE_CONTEXT_MISSING
EVIDENCE_INTEGRITY_FAILED
EVIDENCE_PRIVACY_BLOCKED
EVIDENCE_DUPLICATE
EVIDENCE_QUARANTINED
```

---

## 26. Required Invariants

1. Every evidence candidate links to durable source interactions.
2. Evidence describes observations, not mastery conclusions.
3. Assistance context is preserved.
4. Accessibility accommodation is distinct from instructional help.
5. Collaboration never implies equal individual evidence.
6. Overlapping candidates declare their dependence.
7. Conflicting evidence is preserved.
8. Publication does not equal Assessment acceptance.
9. Corrections supersede; they do not rewrite history.
10. Evidence processing failure is not learner failure.

---

## 27. Verification Scenarios

Minimum automated verification must cover:

- direct source traceability,
- unauthorized-source refusal,
- assistance propagation,
- accessibility separation,
- collaboration attribution,
- overlap detection,
- duplicate construction idempotency,
- conflicting evidence preservation,
- privacy blocking,
- integrity quarantine,
- stale evidence labeling,
- historical replay determinism,
- mapping-version simulation isolation,
- Assessment handoff without claim strengthening.

---

## 28. Completion Condition

29E is architecturally complete when gameplay observations can be converted into durable, traceable, limitation-aware evidence candidates that Assessment can inspect without allowing Gameplay Runtime to claim understanding, mastery, readiness, or mission success.
