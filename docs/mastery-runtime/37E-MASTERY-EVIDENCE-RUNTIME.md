# Chapter 37E — Mastery Evidence Runtime

## 1. Purpose

Mastery Evidence Runtime defines how evidence is accepted, normalized, related, qualified, versioned, corrected, and assembled for mastery evaluation.

It preserves the distinction between observed learning evidence and an authorized mastery conclusion.

> Evidence may justify a decision. Evidence is not the decision.

## 2. Authority Boundary

This runtime owns:

- mastery evidence references
- evidence source registration
- intake validation
- normalization metadata
- evidence dimensions
- trust classification
- dependence and duplication analysis
- freshness and retention metadata
- contradiction records
- correction and withdrawal lineage
- evidence bundles
- coverage summaries
- evidence access policy

It does not own:

- assessment execution
- session activity execution
- curriculum truth
- mastery evaluation policy
- mastery state transitions
- human decision authority
- learner-facing projection wording

## 3. Evidence Sources

Canonical source classes:

- `ASSESSMENT_RESPONSE`
- `LEARNING_ACTIVITY`
- `DIAGNOSTIC_OBSERVATION`
- `SESSION_PERFORMANCE`
- `TRANSFER_TASK`
- `RETENTION_CHECK`
- `TEACHER_OBSERVATION`
- `PARENT_OBSERVATION`
- `LEARNER_EXPLANATION`
- `PORTFOLIO_ARTIFACT`
- `EXTERNAL_CERTIFIED_RESULT`
- `SYSTEM_DERIVED_OBSERVATION`

Source class does not imply trust. Trust is assigned by a versioned source policy.

## 4. Evidence Reference Contract

```ts
export interface MasteryEvidenceReference {
  evidenceId: string;
  tenantId: string;
  learnerId: string;
  skillId: string;
  sourceRuntime: string;
  sourceClass: MasteryEvidenceSourceClass;
  sourceRecordId: string;
  sourceVersion: number;
  observedAt: string;
  recordedAt: string;
  acceptedAt?: string;
  evidenceSchemaVersion: number;
  contentHash: string;
  correlationId: string;
  causationId?: string;
}
```

The evidence runtime stores authoritative references and qualification metadata. Large or sensitive source payloads remain with their owning runtime unless policy requires durable capture.

## 5. Evidence Lifecycle

```text
RECEIVED
  → VALIDATED
  → NORMALIZED
  → QUALIFIED
  → ACCEPTED
  → ACTIVE
  → SUPERSEDED | CORRECTED | WITHDRAWN | EXPIRED
```

Rejected states:

- `INVALID_IDENTITY`
- `UNTRUSTED_SOURCE`
- `UNSUPPORTED_SCHEMA`
- `DUPLICATE_SOURCE_RECORD`
- `HASH_MISMATCH`
- `CONSENT_REQUIRED`
- `OUTSIDE_POLICY_SCOPE`

Historical states are preserved.

## 6. Intake Validation

Evidence is accepted only when:

1. tenant and learner identities are valid;
2. the source runtime is registered;
3. the source record exists;
4. source version and content hash match;
5. the skill mapping is valid for the declared version;
6. required consent or legal basis exists;
7. observed time is plausible;
8. the payload schema is supported;
9. source actor authority is valid;
10. replayed intake is idempotent.

## 7. Trust Classification

Trust classes:

- `UNVERIFIED`
- `LOW`
- `STANDARD`
- `HIGH`
- `CERTIFIED`

Trust is multidimensional:

```ts
export interface EvidenceTrustProfile {
  sourceAuthenticity: number;
  scoringReliability: number;
  identityConfidence: number;
  environmentControl: number;
  independenceConfidence: number;
  reviewerAuthority: number;
  policyVersion: string;
}
```

No single trust number may hide a critical weakness in one dimension.

## 8. Evidence Dimensions

Evidence may contribute to:

- conceptual understanding
- procedural fluency
- application
- transfer
- explanation
- error detection
- strategy selection
- retention
- independence
- consistency
- speed, only when educationally relevant

Completion and engagement are contextual dimensions, not mastery dimensions by default.

## 9. Qualification Record

```ts
export interface MasteryEvidenceQualification {
  evidenceId: string;
  qualificationVersion: number;
  mappedSkillIds: string[];
  dimensions: Record<string, number>;
  trustProfile: EvidenceTrustProfile;
  independenceGroupId: string;
  freshnessClass: 'CURRENT' | 'AGING' | 'STALE' | 'EXPIRED';
  contradictionTags: string[];
  accommodationContextRef?: string;
  policyVersion: string;
  qualifiedAt: string;
  qualificationHash: string;
}
```

Qualification metadata is immutable per version.

## 10. Independence and Dependence

Multiple evidence records may arise from one underlying event. The runtime groups dependent records to prevent confidence inflation.

Dependence indicators include:

- same assessment attempt
- same source artifact
- same teacher judgment copied across skills
- repeated scoring of one response
- derived metrics from one raw observation
- retries with answer exposure
- group work without individual attribution

Evaluation counts evidence diversity by independent groups, not raw record count.

## 11. Deduplication

Two records are duplicates when they represent the same source fact under the same source version and content hash.

Deduplication keys may include:

```text
tenantId + sourceRuntime + sourceRecordId + sourceVersion
```

Near-duplicate detection creates a relationship; it must not delete either record automatically.

## 12. Skill Mapping

Every evidence-to-skill mapping records:

- skill ID
- curriculum context
- graph version
- mapping method
- mapping confidence
- mapping actor or model
- mapping policy version

A later mapping correction supersedes the old mapping but preserves lineage.

## 13. Freshness

Freshness depends on:

- skill volatility
- learner age and context
- evidence dimension
- retention policy
- observation environment
- evidence trust

Freshness classes are policy outputs, not universal constants.

Stale evidence remains historically valid but may have reduced decision weight.

## 14. Retention Evidence

Retention evidence must distinguish:

- delayed recall
- relearning
- prompted recall
- independent reconstruction
- transfer after delay

A recent repeated exercise immediately after instruction is not equivalent to durable retention evidence.

## 15. Contradiction Model

```ts
export interface EvidenceContradiction {
  contradictionId: string;
  tenantId: string;
  learnerId: string;
  skillId: string;
  evidenceIds: string[];
  contradictionType: string;
  severity: 'INFORMATIONAL' | 'MINOR' | 'MATERIAL' | 'SEVERE' | 'CRITICAL';
  detectedBy: string;
  detectionPolicyVersion: string;
  detectedAt: string;
  resolutionStatus: 'OPEN' | 'EXPLAINED' | 'RESOLVED' | 'SUPERSEDED';
}
```

Contradiction resolution does not erase either side. It records why one interpretation became authoritative.

## 16. Correction and Withdrawal

Correction occurs when source facts were inaccurate.

Withdrawal occurs when evidence must no longer support decisions because of:

- invalid identity
- compromised assessment
- scoring defect
- source retraction
- consent or legal change
- corrupted artifact

Correction and withdrawal create new events and trigger adaptation. They never mutate the original ledger record in place.

## 17. Human-Contributed Evidence

Teacher, parent, and learner evidence requires:

- actor identity
- relationship to learner
- observation context
- structured claim
- observation date
- skill mapping
- confidence statement
- conflict-of-interest disclosure when relevant

Human evidence is valuable but not automatically authoritative.

## 18. Accessibility and Accommodation

Evidence qualification must preserve whether an accommodation:

- removed an irrelevant barrier;
- changed the construct being measured;
- changed timing only;
- changed response modality;
- provided scaffolding;
- exposed solution content.

Accommodation data is sensitive. Projection access is restricted and redacted by role.

## 19. Evidence Bundle

```ts
export interface MasteryEvidenceBundle {
  bundleId: string;
  tenantId: string;
  learnerId: string;
  skillId: string;
  evidenceIds: string[];
  qualificationVersions: Record<string, number>;
  independentGroupIds: string[];
  coverageSummary: Record<string, number>;
  contradictionIds: string[];
  frozenAt: string;
  policyVector: Record<string, string>;
  bundleHash: string;
}
```

A bundle is a frozen evaluation input. Later evidence produces a new bundle.

## 20. Coverage Summary

Coverage reports:

- dimensions observed
- dimensions missing
- source diversity
- context diversity
- time diversity
- independence count
- freshness distribution
- trust distribution
- unresolved contradictions

Coverage completeness does not imply mastery.

## 21. Evidence Ledger

The evidence ledger is append-only and records:

- intake
- validation
- qualification
- acceptance
- mapping
- correction
- withdrawal
- supersession
- contradiction
- access-policy changes

Each entry includes tenant, actor, correlation, causation, schema version, and integrity hash.

## 22. Idempotency

Intake idempotency key:

```text
tenantId + sourceRuntime + sourceRecordId + sourceVersion
```

Qualification idempotency key:

```text
evidenceId + qualificationPolicyVersion + mappingVersion
```

The same command returns the prior result when inputs match. A changed payload under the same key is rejected as an integrity conflict.

## 23. Access Control

Access decisions consider:

- tenant
- learner relationship
- role
- purpose
- evidence sensitivity
- consent
- legal basis
- source restrictions

Mastery evaluation may consume protected evidence through a service contract without exposing raw content to projections.

## 24. Privacy and Retention

The runtime must support:

- data minimization
- purpose limitation
- role-based redaction
- legal retention schedules
- deletion or anonymization workflows where legally permitted
- immutable audit lineage without unnecessary sensitive payload retention

## 25. Cross-Runtime Interfaces

### Assessment Runtime

Publishes assessment observations and corrections.

### Session Runtime

Publishes activity and performance references.

### Diagnostic Runtime

Publishes diagnostic observations with uncertainty metadata.

### Journey Runtime

Provides journey context but cannot elevate evidence trust.

### Mastery Evaluation Runtime

Consumes frozen evidence bundles.

### Adaptive Mastery Runtime

Consumes correction, contradiction, freshness, and new-evidence signals.

## 26. Events

Canonical events:

- `MasteryEvidenceReceived`
- `MasteryEvidenceRejected`
- `MasteryEvidenceNormalized`
- `MasteryEvidenceQualified`
- `MasteryEvidenceAccepted`
- `MasteryEvidenceMapped`
- `MasteryEvidenceContradictionDetected`
- `MasteryEvidenceCorrected`
- `MasteryEvidenceWithdrawn`
- `MasteryEvidenceSuperseded`
- `MasteryEvidenceBundleFrozen`

## 27. Observability

Required metrics:

- intake rate by source class
- rejection rate by reason
- qualification latency
- duplicate and dependence rate
- evidence freshness distribution
- contradiction rate
- correction and withdrawal rate
- bundle freeze latency
- unauthorized access attempts

Logs must avoid raw learner responses unless an explicitly protected diagnostic workflow requires them.

## 28. Failure Handling

- unavailable source records remain pending, not fabricated;
- unsupported schemas are quarantined;
- hash mismatch is an integrity failure;
- mapping uncertainty routes to review;
- partial bundle construction fails closed;
- replay never duplicates accepted evidence;
- cross-tenant references are rejected.

## 29. Runtime Invariants

1. Evidence and mastery decision remain separate authorities.
2. Original evidence history is never silently overwritten.
3. Every active evidence record has source identity and integrity hash.
4. Dependence is modeled before confidence aggregation.
5. Coverage is not mastery.
6. Contradictions are preserved and visible to evaluation.
7. Correction and withdrawal trigger governed adaptation.
8. Accommodation context is protected and policy-aware.
9. Evidence bundles freeze exact versions.
10. Commercial status never changes evidence trust.
11. Cross-tenant evidence access is impossible.
12. Replay is idempotent.

## 30. Completion Criteria

37E is complete when the system can demonstrate:

- source-verified intake;
- immutable qualification lineage;
- dependence-aware grouping;
- freshness and retention handling;
- contradiction preservation;
- correction and withdrawal flows;
- privacy-safe access control;
- deterministic evidence bundles;
- idempotent replay;
- clean authority separation from mastery decisions.
