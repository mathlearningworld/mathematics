# 33B — Diagnostic Evidence Runtime

## 1. Purpose

Diagnostic Evidence Runtime defines how observations become admissible diagnostic evidence without losing their original meaning, provenance, uncertainty, or version context.

Its responsibility is not to decide what a learner knows. Its responsibility is to establish whether a piece of information is valid, relevant, sufficiently described, and safe to use in later diagnostic inference.

---

## 2. Core Runtime Law

> Evidence may support an inference only when its origin, meaning, version, scope, and quality are known. Missing context must never be replaced by confidence.

---

## 3. Evidence Authority Boundary

Diagnostic Evidence Runtime may:

- receive observations from authorized sources;
- normalize metadata;
- validate evidence contracts;
- preserve raw source references;
- classify evidence type;
- calculate quality features;
- group evidence into windows;
- mark evidence stale, superseded, disputed, or unusable;
- expose evidence for inference and audit.

It must not:

- rewrite source observations;
- alter assessment scores;
- claim mastery;
- create skill dependencies;
- infer a root cause by itself;
- discard contradictory evidence merely because it lowers confidence.

---

## 4. Evidence Record

```ts
interface DiagnosticEvidence {
  evidenceId: string
  tenantId: string
  learnerId: string
  sourceSystem: EvidenceSourceSystem
  sourceRecordId: string
  sourceRecordVersion: string
  evidenceType: DiagnosticEvidenceType
  observedAt: string
  receivedAt: string
  targetSkillVersionIds: string[]
  curriculumVersionId?: string
  graphVersionId?: string
  context: EvidenceContext
  payloadRef: EvidencePayloadRef
  quality: EvidenceQuality
  status: EvidenceStatus
  provenance: EvidenceProvenance
  version: number
}
```

The diagnostic record must preserve a resolvable pointer to the original source. A normalized copy is not a replacement for source authority.

---

## 5. Evidence Types

```text
ASSESSMENT_RESPONSE
ASSESSMENT_ATTEMPT_SUMMARY
WORKED_SOLUTION_STEP
HINT_USAGE
ERROR_CLASSIFICATION
RESPONSE_LATENCY
TRANSFER_TASK_RESULT
REMEDIATION_OUTCOME
LEARNING_ACTIVITY_OBSERVATION
TEACHER_OBSERVATION
MENTOR_OBSERVATION
LEARNER_SELF_REPORT
PARENT_OBSERVATION
SYSTEM_BEHAVIOR_SIGNAL
PROGRESS_TRANSITION
PRIOR_DIAGNOSTIC_OUTCOME
```

Each type must declare its admissible diagnostic uses. For example, a learner self-report may provide context but must not be silently treated as equivalent to validated performance evidence.

---

## 6. Source Systems

```text
ASSESSMENT_ENGINE
LEARNING_ENGINE
PROGRESS_ENGINE
GAMEPLAY_RUNTIME
TEACHER_WORKSPACE
MENTOR_WORKSPACE
LEARNER_WORKSPACE
PARENT_WORKSPACE
IMPORT_PIPELINE
DIAGNOSTIC_RUNTIME
```

Imported evidence must include source authority, import method, transformation details, and verification status.

---

## 7. Evidence Status

```text
RECEIVED
VALIDATING
ADMISSIBLE
ADMISSIBLE_WITH_WARNINGS
DISPUTED
STALE
SUPERSEDED
REJECTED
QUARANTINED
REVOKED
```

`REJECTED` evidence remains auditable. It must not disappear from the historical record.

---

## 8. Evidence Quality Model

```ts
interface EvidenceQuality {
  completeness: number
  directness: number
  reliability: number
  recency: number
  skillCoverage: number
  contextCoverage: number
  transferCoverage: number
  independence: number
  warnings: string[]
}
```

Quality dimensions must remain separate. A single composite value may be used for ranking or policy gates, but the underlying dimensions must remain available.

### Completeness

Whether required metadata and response details are present.

### Directness

How directly the evidence observes the claimed skill rather than a proxy.

### Reliability

Whether the instrument, observer, or runtime source is dependable for this use.

### Recency

Whether the evidence remains temporally relevant.

### Skill Coverage

Whether the evidence meaningfully samples the skill definition.

### Context Coverage

Whether the evidence spans relevant representations, environments, or prompt forms.

### Transfer Coverage

Whether performance generalizes beyond a repeated item pattern.

### Independence

Whether apparently multiple observations are genuinely distinct rather than duplicates or derivatives of the same source event.

---

## 9. Provenance

Every evidence item must retain:

- source system;
- source record ID and version;
- producing actor or runtime;
- observation timestamp;
- ingestion timestamp;
- transformation chain;
- schema version;
- validation policy version;
- skill mapping method;
- human edits or annotations;
- dispute and revocation history.

Evidence transformed from another item must declare the parent evidence IDs. Derived evidence must not masquerade as an independent observation.

---

## 10. Skill Binding

Evidence may bind to:

```text
DIRECT_SKILL_BINDING
ITEM_TO_SKILL_BINDING
CURRICULUM_TO_SKILL_ALIGNMENT
HUMAN_CONFIRMED_BINDING
INFERRED_BINDING
UNRESOLVED_BINDING
```

The binding method affects admissibility and confidence.

Rules:

1. Historical evidence remains bound to the original `SkillVersionId`.
2. A later skill alias does not rewrite prior evidence.
3. Approximate evolution mapping must remain marked approximate.
4. Evidence with unresolved skill binding cannot support a skill-specific high-confidence diagnosis.
5. Curriculum placement does not independently establish cognitive skill binding.

---

## 11. Evidence Windows

A diagnostic case evaluates evidence within an explicit window.

```ts
interface EvidenceWindow {
  startAt: string
  endAt: string
  timezone: string
  inclusionPolicyVersion: string
  minimumEvidenceRequirements: EvidenceRequirement[]
}
```

Windows may be:

```text
FIXED_TIME_WINDOW
ATTEMPT_COUNT_WINDOW
LEARNING_EPISODE_WINDOW
PRE_POST_INTERVENTION_WINDOW
ROLLING_WINDOW
HISTORICAL_COMPARISON_WINDOW
```

Window selection must be recorded because it can materially change the inference.

---

## 12. Deduplication and Independence

The runtime must detect:

- repeated delivery of the same source event;
- retries with the same idempotency identity;
- summaries derived from already-present response records;
- copied human observations;
- duplicate imported records;
- multiple projections of one underlying event.

Deduplication must not erase legitimate repeated attempts. Evidence identity and learner action identity are distinct.

---

## 13. Contradictory Evidence

Contradiction is first-class.

Examples:

- strong performance in symbolic form but weak performance in word problems;
- correct repeated practice but failed transfer;
- teacher observation conflicts with recent assessment evidence;
- progress state is stable while current evidence is stale;
- remediation improves one representation but not another.

Contradictory evidence must:

- remain visible;
- reduce or qualify confidence when relevant;
- trigger targeted evidence collection where possible;
- never be removed merely to create a cleaner narrative.

---

## 14. Human Observation

Human observations must include:

- observer identity and role;
- observation time;
- direct observation versus interpretation;
- context;
- target skill or unresolved target;
- confidence;
- optional supporting artifact;
- edit history.

The runtime must distinguish:

```text
DIRECT_OBSERVATION
PROFESSIONAL_INTERPRETATION
INFORMAL_INTERPRETATION
LEARNER_REPORTED_CONTEXT
```

Human evidence is valuable but not automatically authoritative for every diagnostic claim.

---

## 15. Accessibility and Context

Evidence validation must preserve context that may affect interpretation:

- language of instruction;
- reading load;
- representation format;
- accessibility accommodations;
- input device constraints;
- time pressure;
- interruption or technical failure;
- prior hint exposure;
- collaborative versus independent work.

The runtime must not classify a language-access barrier as a mathematical misconception without supporting evidence.

---

## 16. Admissibility Gates

Evidence is admissible only when mandatory gates pass.

```text
IDENTITY_GATE
TENANT_SCOPE_GATE
SOURCE_INTEGRITY_GATE
SCHEMA_GATE
VERSION_GATE
TEMPORAL_GATE
SKILL_BINDING_GATE
CONSENT_AND_POLICY_GATE
DUPLICATION_GATE
QUALITY_GATE
```

Gate outcomes:

```text
PASS
PASS_WITH_WARNINGS
FAIL
INCONCLUSIVE
```

`INCONCLUSIVE` does not silently become `PASS`.

---

## 17. Commands

```text
RegisterDiagnosticEvidence
ValidateDiagnosticEvidence
DisputeDiagnosticEvidence
ResolveEvidenceDispute
SupersedeDiagnosticEvidence
RevokeDiagnosticEvidence
RebindEvidenceWithEvolutionMapping
BuildEvidenceWindow
RefreshEvidenceQuality
```

All mutation commands require tenant scope, actor identity, command identity, correlation identity, and expected version where applicable.

---

## 18. Events

```text
DiagnosticEvidenceRegistered
DiagnosticEvidenceValidated
DiagnosticEvidenceAdmitted
DiagnosticEvidenceAdmittedWithWarnings
DiagnosticEvidenceDisputed
EvidenceDisputeResolved
DiagnosticEvidenceMarkedStale
DiagnosticEvidenceSuperseded
DiagnosticEvidenceRejected
DiagnosticEvidenceQuarantined
DiagnosticEvidenceRevoked
EvidenceSkillBindingRevised
EvidenceWindowBuilt
EvidenceQualityRefreshed
```

Events are append-only. Correction creates new history; it does not replace prior meaning.

---

## 19. Failure Codes

```text
EVIDENCE_ALREADY_REGISTERED
SOURCE_RECORD_NOT_FOUND
SOURCE_VERSION_MISMATCH
INVALID_TENANT_SCOPE
INVALID_LEARNER_SCOPE
UNSUPPORTED_EVIDENCE_TYPE
UNSUPPORTED_SCHEMA_VERSION
UNRESOLVED_SKILL_BINDING
EVIDENCE_OUTSIDE_WINDOW
EVIDENCE_DUPLICATE
EVIDENCE_POLICY_BLOCKED
EVIDENCE_QUALITY_TOO_LOW
EVIDENCE_ALREADY_REVOKED
CONCURRENT_MODIFICATION
```

---

## 20. Runtime Invariants

1. Source evidence is never rewritten by the diagnostic layer.
2. Every normalized evidence item retains source provenance.
3. Derived evidence declares its parent evidence.
4. Contradictory evidence remains visible.
5. Missing data is not interpreted as failure.
6. Evidence quality dimensions remain inspectable.
7. Skill bindings remain version-specific.
8. Duplicate delivery does not create duplicate authority.
9. Human interpretation is distinguished from direct observation.
10. Accessibility context is preserved for interpretation.
11. Rejected and revoked evidence remains auditable.
12. Evidence admission never independently creates a diagnosis.
