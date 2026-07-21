# 26B — Assessment Evidence Runtime

## Status

- Chapter: 26 — Assessment Engine Architecture
- Slice: 26B
- State: EVIDENCE RUNTIME DEFINED
- Depends on: 26A Assessment Engine Foundation

---

## 1. Purpose

The Assessment Evidence Runtime assembles, validates, classifies, and versions the evidence set used by an Assessment Case.

It does not decide readiness or mastery. It decides whether the evidence entering assessment is attributable, usable, sufficiently diverse, and honestly represented.

---

## 2. Runtime Position

```text
World Events
+ Discovery Evidence
+ Learning Claims
+ Mastery / Transfer Claims
+ Adult Observations
        ↓
Assessment Evidence Runtime
        ↓
Versioned Assessment Evidence Set
        ↓
Assessment Model Runtime
```

---

## 3. Why a Dedicated Evidence Runtime Exists

Assessment is unsafe when evaluators read arbitrary records directly.

A dedicated runtime prevents:

- duplicate evidence inflation,
- accidental cross-learner evidence mixing,
- stale evidence being treated as current,
- unsupported manual conclusions,
- loss of source provenance,
- contradictory evidence being hidden,
- one representation dominating a broad claim,
- replay producing different evidence sets.

---

## 4. Core Aggregate

```text
AssessmentEvidenceSet
```

```ts
export interface AssessmentEvidenceSet {
  evidenceSetId: string;
  learnerId: string;
  assessmentCaseId: string;
  scopeFingerprint: string;
  policyRef: AssessmentPolicyRef;
  entries: AssessmentEvidenceEntry[];
  qualitySummary: EvidenceQualitySummary;
  contradictionSummary: ContradictionSummary;
  diversitySummary: EvidenceDiversitySummary;
  assembledAt: string;
  sourceCutoffAt: string;
  runtimeVersion: string;
  version: number;
  status: AssessmentEvidenceSetStatus;
}
```

Statuses:

```text
ASSEMBLING
VALIDATING
READY
INSUFFICIENT
CONTRADICTORY
STALE
INVALID
SUPERSEDED
```

---

## 5. Evidence Entry Contract

```ts
export interface AssessmentEvidenceEntry {
  evidenceRef: string;
  evidenceType: AssessmentEvidenceType;
  sourceAuthority: EvidenceSourceAuthority;
  learnerId: string;
  conceptIds: string[];
  representationIds: string[];
  contextIds: string[];
  occurredAt: string;
  observedAt: string;
  sourceVersion: string;
  independenceLevel: IndependenceLevel;
  supportProfile?: SupportProfile;
  outcomeProfile?: OutcomeProfile;
  transferProfile?: TransferProfile;
  retentionProfile?: RetentionProfile;
  provenance: EvidenceProvenance;
  integrity: EvidenceIntegrity;
  assessmentUsability: EvidenceUsability;
}
```

---

## 6. Evidence Types

```text
WORLD_ACTION
WORLD_OUTCOME
DISCOVERY_OBSERVATION
PATTERN_RECOGNITION
CONCEPT_FORMATION
LEARNING_STATE_TRANSITION
MASTERY_CLAIM
TRANSFER_CLAIM
RETENTION_OBSERVATION
STRATEGY_OBSERVATION
HINT_USAGE
SUPPORT_USAGE
ERROR_PATTERN
NEGATIVE_TRANSFER
MISSION_COMPLETION
MISSION_ABANDONMENT
ADULT_OBSERVATION
LEARNER_EXPLANATION
SYSTEM_VERIFICATION
```

Evidence type does not determine truth by itself. Authority and provenance remain separate.

---

## 7. Source Authority

```text
AUTHORITATIVE_RUNTIME
DERIVED_ENGINE_CLAIM
VERIFIED_HUMAN_OBSERVATION
UNVERIFIED_HUMAN_OBSERVATION
SELF_REPORT
EXTERNAL_IMPORT
```

Authority affects how evidence may support a claim.

For example:

- a verified world action may support performance evidence,
- a mastery claim may support a bounded assessment but must remain traceable to its own evidence,
- a parent observation may identify a review opportunity but cannot silently override runtime evidence.

---

## 8. Provenance

```ts
export interface EvidenceProvenance {
  sourceSystem: string;
  sourceAggregateType: string;
  sourceAggregateId: string;
  sourceEventId?: string;
  correlationId?: string;
  causationId?: string;
  missionId?: string;
  sessionId?: string;
  policyVersion?: string;
  capturedBy?: string;
}
```

Every entry must be traceable to an originating record.

---

## 9. Integrity Validation

The runtime validates:

1. learner identity,
2. tenant or account boundary,
3. source existence,
4. source version,
5. timestamp consistency,
6. concept-scope compatibility,
7. duplicate identity,
8. tamper or mutation indicators,
9. replay compatibility,
10. required provenance fields.

Invalid evidence is retained for audit but excluded from evaluative support.

---

## 10. Evidence Usability

```text
ELIGIBLE
ELIGIBLE_WITH_LIMITATIONS
CONTEXT_ONLY
CONTRADICTING
STALE
DUPLICATE
OUT_OF_SCOPE
UNVERIFIED
INVALID
```

Usability is purpose-specific.

Evidence may be eligible for diagnosis but ineligible for a high-confidence readiness claim.

---

## 11. Evidence Quality Dimensions

```ts
export interface EvidenceQualitySummary {
  attribution: number;
  integrity: number;
  recency: number;
  independence: number;
  diversity: number;
  representationCoverage: number;
  contextCoverage: number;
  temporalCoverage: number;
  contradictionBurden: number;
  supportDependenceBurden: number;
  overallClassification: EvidenceStrength;
}
```

The dimensions must remain visible. They must not be irreversibly collapsed into a single hidden score.

---

## 12. Evidence Strength

```text
NONE
WEAK
LIMITED
MODERATE
STRONG
ROBUST
CONTRADICTORY
```

Strength is an evidence-set property under a declared purpose and policy.

---

## 13. Diversity Model

Assessment evidence diversity includes:

- task variation,
- representation variation,
- context variation,
- strategy variation,
- support variation,
- temporal separation,
- mission variation,
- near- and far-transfer opportunities.

Repeated identical events increase volume but not necessarily diversity.

---

## 14. Duplicate Control

An evidence fingerprint may include:

```text
learnerId
+ sourceEventId
+ sourceAggregateVersion
+ concept scope
+ occurrence timestamp
+ evidence semantic type
```

Duplicate ingestion must be idempotent.

The runtime must not count replayed or re-delivered events as new learning evidence.

---

## 15. Temporal Semantics

The runtime distinguishes:

```text
occurredAt
observedAt
recordedAt
assembledAt
sourceCutoffAt
```

Late-arriving evidence may trigger reevaluation but must not rewrite the historical evidence set used by an earlier claim.

---

## 16. Recency and Staleness

Staleness is concept- and purpose-specific.

Examples:

- a recent mission-readiness claim may require current independent evidence,
- a historical learning diagnosis may intentionally include older evidence,
- durable transfer may require temporally separated observations.

Policies define staleness windows; UI code does not.

---

## 17. Independence Profile

```text
UNOBSERVED
FULLY_SUPPORTED
HEAVILY_SUPPORTED
PARTIALLY_SUPPORTED
MINIMALLY_SUPPORTED
INDEPENDENT
INDEPENDENT_WITH_SELF_CORRECTION
```

Support must include its type:

- direct answer,
- procedural hint,
- conceptual hint,
- visual cue,
- environmental affordance,
- peer or mentor assistance,
- system correction.

Correctness under heavy support is not equivalent to independent performance.

---

## 18. Contradiction Handling

Contradiction is preserved, classified, and surfaced.

```ts
export interface ContradictionSummary {
  status: 'NONE' | 'LOCAL' | 'MATERIAL' | 'UNRESOLVED';
  clusters: ContradictionCluster[];
  affectedConceptIds: string[];
  affectedRepresentationIds: string[];
  likelyExplanations: string[];
}
```

Possible explanations include:

- context dependence,
- representation dependence,
- unstable strategy,
- support dependence,
- retention decay,
- negative transfer,
- noisy or invalid evidence.

The runtime must not resolve contradictions by averaging them away.

---

## 19. Evidence Assembly Command

```ts
export interface AssembleAssessmentEvidenceCommand {
  assessmentCaseId: string;
  learnerId: string;
  scope: AssessmentScope;
  policyRef: AssessmentPolicyRef;
  sourceCutoffAt: string;
  expectedAssessmentCaseVersion: number;
  correlationId: string;
}
```

Result:

```ts
export interface AssembleAssessmentEvidenceResult {
  evidenceSetId: string;
  evidenceSetVersion: number;
  status: AssessmentEvidenceSetStatus;
  eligibleEvidenceCount: number;
  excludedEvidenceCount: number;
  qualitySummary: EvidenceQualitySummary;
  assembledAt: string;
}
```

---

## 20. Assembly Pipeline

```text
Resolve Assessment Scope
    ↓
Read Source Authorities
    ↓
Normalize Evidence Entries
    ↓
Validate Identity and Provenance
    ↓
Deduplicate
    ↓
Apply Scope Filters
    ↓
Classify Usability
    ↓
Measure Diversity and Quality
    ↓
Detect Contradictions
    ↓
Freeze Versioned Evidence Set
```

---

## 21. Exclusion Reasons

```text
LEARNER_MISMATCH
TENANT_MISMATCH
OUTSIDE_TIME_WINDOW
OUTSIDE_CONCEPT_SCOPE
OUTSIDE_PURPOSE_SCOPE
DUPLICATE_SOURCE
MISSING_PROVENANCE
INVALID_SOURCE_VERSION
UNVERIFIED_EXTERNAL_IMPORT
STALE_FOR_POLICY
CORRUPTED_SOURCE
```

Every exclusion remains auditable.

---

## 22. Evidence Set Immutability

A READY evidence set is immutable.

New or corrected evidence creates:

- a new evidence-set version,
- a new assessment evaluation,
- a superseding claim when appropriate.

Historical claims retain the exact evidence set used at their evaluation time.

---

## 23. Replay Contract

Given identical source cutoff, scope, policy, and source ledger, replay must assemble a semantically equivalent evidence set.

Replay verifies:

- stable deduplication,
- stable scope filtering,
- stable quality classification,
- stable contradiction detection,
- stable ordering independent of delivery order.

---

## 24. Privacy and Access

Evidence assembly must enforce:

- learner ownership or authorized relationship,
- role-based field visibility,
- purpose limitation,
- minimum necessary access,
- separation of clinical or sensitive external records,
- export and deletion policies without corrupting audit requirements.

---

## 25. Failure Codes

```text
ASSESSMENT_CASE_NOT_FOUND
ASSESSMENT_SCOPE_INVALID
POLICY_NOT_FOUND
POLICY_VERSION_UNSUPPORTED
LEARNER_IDENTITY_MISMATCH
SOURCE_AUTHORITY_UNAVAILABLE
EVIDENCE_PROVENANCE_INVALID
EVIDENCE_SET_ALREADY_FINALIZED
EVIDENCE_SET_CONFLICT
EXPECTED_VERSION_CONFLICT
INSUFFICIENT_ELIGIBLE_EVIDENCE
```

Failures are explicit and machine-readable.

---

## 26. Runtime Invariants

1. Every evidence entry belongs to exactly one learner.
2. Every entry has provenance.
3. Duplicate delivery never increases evidence weight.
4. Contradictory evidence is never silently removed.
5. READY evidence sets are immutable.
6. Evidence usability is purpose- and policy-bound.
7. Adult observations remain distinguishable from authoritative runtime evidence.
8. Late evidence produces a new version, not historical mutation.
9. Source cutoff is recorded.
10. Replay is order-independent.

---

## 27. Completion Definition

26B is complete when the repository defines:

- the Assessment Evidence Set aggregate,
- evidence entry and provenance contracts,
- source authority and usability classification,
- quality, diversity, recency, support, and contradiction semantics,
- deterministic assembly,
- immutability and replay requirements,
- failure and privacy boundaries.

This runtime provides the trusted evidence boundary for all later Assessment Engine evaluations.