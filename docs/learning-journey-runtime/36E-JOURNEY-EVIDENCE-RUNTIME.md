# 36E — Journey Evidence Runtime

## 1. Purpose

Journey Evidence Runtime governs longitudinal evidence across many sessions, phases, milestones, interventions, and external observations.

It creates an auditable journey-level evidence record without replacing the authority of session evidence, assessment, diagnostic, progress, or mastery runtimes.

## 2. Core Rule

> Journey evidence aggregates and qualifies evidence across time; it does not manufacture mastery, erase contradiction, or treat activity completion as understanding.

## 3. Authority Boundary

Journey Evidence Runtime owns:

- journey evidence references
- longitudinal evidence bundles
- milestone evidence qualification
- phase evidence summaries
- evidence conflict records
- evidence coverage analysis
- journey completion evidence package
- evidence provenance and lineage
- evidence freshness and supersession semantics

It does not own:

- raw session evidence creation
- assessment scoring truth
- diagnostic interpretation authority
- mastery certification
- curriculum requirement authority
- intervention decision authority
- journey lifecycle authority

## 4. Evidence Sources

Permitted evidence sources include:

- Learning Session Runtime
- Assessment Engine
- Diagnostic Runtime
- Progress Engine
- Intervention Runtime
- teacher observations
- parent or guardian observations
- learner reflections
- imported institutional records
- system operational evidence

Every source must have an explicit trust class and validation policy.

## 5. Evidence Reference

Journey Runtime stores references rather than duplicating source authority.

```text
JourneyEvidenceRef
- evidenceRefId
- journeyId
- sourceRuntime
- sourceEntityType
- sourceEntityId
- sourceVersion
- evidenceType
- learnerId
- skillRefs[]
- objectiveRefs[]
- phaseId
- milestoneIds[]
- observedAt
- recordedAt
- trustClass
- confidence
- privacyClass
- integrityHash
```

## 6. Evidence Trust Classes

Recommended classes:

- VERIFIED_SYSTEM
- VERIFIED_HUMAN
- INSTITUTIONAL_IMPORT
- LEARNER_SELF_REPORT
- INFERRED_SYSTEM
- UNVERIFIED_EXTERNAL

Trust class does not determine educational truth by itself. It controls admissibility and review requirements.

## 7. Evidence Intake Lifecycle

```text
RECEIVED
→ SOURCE_VALIDATED
→ INTEGRITY_VALIDATED
→ AUTHORITY_VALIDATED
→ DUPLICATION_CHECKED
→ CLASSIFIED
→ LINKED
→ QUALIFIED | QUARANTINED | REJECTED
```

No evidence affects journey conclusions before qualification.

## 8. Intake Validation

Validation checks:

- tenant and learner identity
- source runtime authority
- source entity existence
- source version immutability
- integrity hash
- timestamp plausibility
- privacy permissions
- evidence schema version
- duplicate or replay detection
- skill and objective reference validity

## 9. Evidence Immutability

Qualified evidence references are append-only.

Corrections are represented by:

- superseding reference
- correction event
- source retraction
- trust-class revision
- linkage correction

Past evidence is never silently rewritten.

## 10. Longitudinal Evidence Bundle

```text
JourneyEvidenceBundle
- bundleId
- journeyId
- bundleType
- scopeRef
- evidenceRefs[]
- coverageMap
- contradictionRefs[]
- missingEvidenceRequirements[]
- freshnessSummary
- confidenceSummary
- generatedAt
- generatorVersion
```

Bundle types may include:

- PHASE
- MILESTONE
- OBJECTIVE
- PREREQUISITE
- INTERVENTION
- JOURNEY_COMPLETION

Bundles are derived read models and may be regenerated.

## 11. Evidence Dimensions

Evidence should be classified across dimensions such as:

- correctness
- reasoning quality
- transfer
- retention
- fluency
- independence
- explanation
- error pattern
- help required
- consistency
- persistence
- accessibility context

A single score is not sufficient for journey-level evidence.

## 12. Evidence Coverage

Coverage answers whether required evidence exists, not whether mastery is proven.

```text
EvidenceCoverage
- requirementId
- requiredDimensions[]
- presentDimensions[]
- missingDimensions[]
- minimumObservations
- currentObservations
- timeWindowRequirement
- timeWindowSatisfied
- sourceDiversityRequirement
- sourceDiversitySatisfied
- status
```

Statuses:

- NOT_STARTED
- PARTIAL
- SUFFICIENT_FOR_REVIEW
- COMPLETE
- STALE
- CONFLICTED

## 13. Milestone Evidence Qualification

A milestone may define evidence requirements such as:

- required skill references
- minimum evidence count
- required evidence dimensions
- retention interval
- transfer context
- independent performance requirement
- source diversity
- assessment requirement
- human review requirement

Journey Evidence Runtime determines whether the package is review-ready. It does not independently declare mastery.

## 14. Evidence Conflict

Conflicts include:

- strong success followed by strong failure
- assessment result inconsistent with session performance
- human observation inconsistent with system evidence
- retention evidence contradicting immediate fluency
- source identity mismatch
- duplicated evidence with different outcomes

```text
EvidenceConflict
- conflictId
- journeyId
- evidenceRefs[]
- conflictType
- affectedSkills[]
- severity
- detectedAt
- resolutionStatus
- resolutionAuthority
- resolutionNotes
```

## 15. Conflict Resolution

Resolution options:

- request additional evidence
- schedule diagnostic
- defer milestone decision
- downgrade confidence
- narrow evidence scope
- accept contextual explanation
- quarantine invalid source
- escalate to human review

Conflict resolution must not delete contradictory evidence.

## 16. Evidence Freshness

Evidence freshness depends on:

- skill volatility
- time since observation
- retention requirement
- learner developmental context
- intervention since observation
- curriculum or content version change

Freshness classifications:

- CURRENT
- AGING
- STALE
- INVALIDATED_BY_CONTEXT

Stale evidence remains historical evidence but may no longer satisfy current requirements.

## 17. Evidence Supersession

Supersession means a newer item is preferred for a defined decision context. It does not mean the old evidence disappears.

```text
EvidenceSupersession
- priorEvidenceRef
- nextEvidenceRef
- scope
- reason
- effectiveAt
- authority
```

## 18. Human-Contributed Evidence

Human evidence requires:

- actor identity
- relationship to learner
- authorized role
- structured observation type
- observation context
- observed time
- optional attachment refs
- confidence declaration
- conflict-of-interest flag where relevant

Free-text comments may supplement but must not replace structured fields required for decisions.

## 19. Learner Reflection

Learner reflection may capture:

- confidence
- perceived difficulty
- strategy used
- help required
- emotional state
- explanation of reasoning

Self-report is valuable context but cannot be treated as verified performance evidence without supporting policy.

## 20. Privacy and Consent

Evidence records must enforce:

- tenant isolation
- learner privacy
- guardian consent policy
- age-appropriate visibility
- purpose limitation
- data minimization
- retention policy
- export and deletion policy where legally permitted
- protected educator notes

Deletion requirements must preserve legally required audit metadata without retaining unnecessary content.

## 21. Journey Completion Evidence Package

```text
JourneyCompletionEvidencePackage
- packageId
- journeyId
- objectiveRef
- finalPlanVersion
- completedPhaseRefs[]
- completedMilestoneRefs[]
- evidenceBundleRefs[]
- unresolvedConflictRefs[]
- missingRequirementRefs[]
- interventionSummaryRef
- diagnosticSummaryRefs[]
- readinessForCompletionReview
- generatedAt
- generatorVersion
```

The package supports completion review. It is not itself a mastery certificate.

## 22. Evidence Events

Recommended events:

- `JourneyEvidenceReceived`
- `JourneyEvidenceQualified`
- `JourneyEvidenceQuarantined`
- `JourneyEvidenceRejected`
- `JourneyEvidenceLinked`
- `JourneyEvidenceSuperseded`
- `JourneyEvidenceConflictDetected`
- `JourneyEvidenceConflictResolved`
- `JourneyEvidenceCoverageChanged`
- `MilestoneEvidenceReviewReady`
- `JourneyCompletionEvidencePrepared`

## 23. Idempotency

Evidence intake requires a stable key derived from:

- source runtime
- source entity ID
- source version
- evidence type
- learner ID

Repeated delivery must return the existing result without creating a second qualified reference.

## 24. Concurrency

Concurrent evidence intake may append independently when references differ.

Derived bundle publication must use:

- expected journey evidence revision
- bundle generator version
- input watermark

Stale bundle writes must be rejected.

## 25. Evidence Ledger

The journey evidence ledger records:

- intake outcome
- validation decisions
- qualification result
- linkage changes
- supersession
- conflicts
- conflict resolutions
- bundle publication
- package publication

The ledger is append-only and replayable.

## 26. Projection Contract

Journey Evidence Runtime publishes read-safe summaries such as:

- evidence coverage by milestone
- unresolved conflict count
- stale evidence count
- source diversity
- review readiness
- missing evidence dimensions

Sensitive raw evidence must not be exposed through generic projections.

## 27. Cross-Runtime Handoffs

### To Journey Orchestration

- milestone evidence review-ready
- evidence missing
- conflict blocking progression
- additional evidence requested

### To Adaptive Journey Runtime

- evidence gap signal
- contradiction signal
- retention regression signal
- faster-than-expected progress signal

### To Diagnostic Runtime

- diagnostic request context
- contradiction evidence package

### To Mastery Runtime

- qualified evidence package only through an explicit contract

## 28. Failure Codes

- `EVIDENCE_SOURCE_UNAUTHORIZED`
- `EVIDENCE_SOURCE_NOT_FOUND`
- `EVIDENCE_VERSION_INVALID`
- `EVIDENCE_INTEGRITY_FAILED`
- `EVIDENCE_DUPLICATE`
- `EVIDENCE_PRIVACY_FORBIDDEN`
- `EVIDENCE_SCHEMA_UNSUPPORTED`
- `EVIDENCE_LINKAGE_INVALID`
- `EVIDENCE_QUARANTINED`
- `EVIDENCE_BUNDLE_VERSION_CONFLICT`

## 29. Observability

Metrics:

- evidence intake rate
- qualification rate
- quarantine rate
- rejection rate
- duplicate rate
- evidence source distribution
- coverage completeness
- conflict detection rate
- conflict resolution time
- stale evidence rate
- completion package readiness rate

Audit logs must include evidence reference IDs and authority metadata while minimizing sensitive content.

## 30. Verification Requirements

Verification must prove:

- immutable evidence references
- source-version validation
- deterministic deduplication
- tenant isolation
- privacy enforcement
- no mastery declaration
- conflict preservation
- stale evidence behavior
- bundle regeneration determinism
- completion package traceability

## 31. Invariants

1. Every journey evidence reference points to a versioned source.
2. Qualified evidence is never silently mutated.
3. Duplicate delivery does not create duplicate authority.
4. Conflicting evidence remains visible until explicitly resolved.
5. Coverage completeness does not equal mastery.
6. Stale evidence remains historical but cannot satisfy freshness rules.
7. Human evidence always records actor and context.
8. Derived bundles identify their input watermark and generator version.
9. Completion packages identify unresolved conflicts and missing requirements.
10. Sensitive evidence is exposed only through authorized views.

## 32. Completion Condition

36E is complete when the platform can intake, validate, qualify, aggregate, conflict-check, protect, and package longitudinal journey evidence while preserving source authority, privacy, historical truth, and explicit separation from mastery certification.
