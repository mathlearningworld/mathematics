# Chapter 38E — Learning Path Evidence Runtime

## 1. Purpose

The Learning Path Evidence Runtime defines how the system captures, validates, links, and interprets evidence about whether a learning path is reachable, appropriate, efficient, and educationally effective.

Its responsibility is not to decide mastery and not to decide the next route. It provides durable, explainable evidence that other runtimes may use when evaluating planning quality, execution quality, adaptation outcomes, and path effectiveness.

> Path evidence explains what happened along the route, why the route changed, and whether the route produced the intended learning conditions.

---

## 2. Runtime Boundary

This runtime owns:

- path evidence contracts
- evidence intake and validation
- evidence lineage
- execution evidence
- deviation evidence
- planning-quality evidence
- path-efficiency evidence
- adaptation-outcome evidence
- completion evidence
- reachability evidence
- evidence bundles
- evidence confidence and completeness
- privacy-aware evidence access
- evidence retention and withdrawal metadata

It does not own:

- mastery decisions
- assessment scoring
- path planning decisions
- adaptation activation
- session execution
- projection rendering
- durable storage implementation details

---

## 3. Evidence Classes

### 3.1 Structural Evidence

Describes whether the path itself is coherent.

Examples:

- prerequisite closure satisfied
- every node reachable
- no cycles in the active remainder
- curriculum requirements covered
- accessibility equivalents available
- time-budget feasibility

### 3.2 Execution Evidence

Describes what occurred during path execution.

Examples:

- node authorized
- node started
- node completed
- node failed
- node skipped with authority
- session interrupted
- retry performed
- branch selected

### 3.3 Learning Evidence Linkage

References evidence owned by Assessment, Session, or Mastery Runtime without duplicating authority.

Examples:

- assessment result reference
- session outcome reference
- mastery decision reference
- evidence bundle reference

### 3.4 Deviation Evidence

Describes divergence from the approved path.

Examples:

- out-of-order execution
- unauthorized skip attempt
- content substitution
- human override
- operational interruption
- unavailable content

### 3.5 Adaptation Evidence

Describes why and how a path changed.

Examples:

- trigger references
- adaptation assessment
- chosen candidate
- rejected alternatives
- approval record
- old/new path delta

### 3.6 Outcome Evidence

Describes whether the path produced the expected operational and educational conditions.

Examples:

- objective completion
- remediation success
- retention recovery
- acceleration validity
- replan effectiveness
- learner burden
- time efficiency

---

## 4. Core Evidence Contract

```ts
interface LearningPathEvidenceRecord {
  evidenceId: string
  tenantId: string
  learnerId: string
  pathId: string
  pathVersion: number
  nodeId?: string
  evidenceType: string
  sourceRuntime: string
  sourceReferenceId: string
  correlationId: string
  causationId?: string
  actorType: 'SYSTEM' | 'LEARNER' | 'TEACHER' | 'PARENT' | 'ADMIN'
  actorId?: string
  occurredAt: string
  recordedAt: string
  schemaVersion: number
  payload: Record<string, unknown>
  confidence?: number
  integrityHash?: string
  privacyClass: 'STANDARD' | 'SENSITIVE' | 'RESTRICTED'
  withdrawalState: 'ACTIVE' | 'WITHDRAWN' | 'SUPERSEDED'
}
```

Every record must be immutable after acceptance. Corrections are represented by superseding evidence, never in-place rewriting.

---

## 5. Evidence Intake Pipeline

```text
Receive Evidence
→ Validate Identity and Tenant
→ Validate Source Authority
→ Validate Schema Version
→ Verify Path and Node References
→ Deduplicate Source Reference
→ Validate Temporal Consistency
→ Classify Privacy
→ Compute Integrity Metadata
→ Accept or Reject
→ Append Evidence Record
→ Update Evidence Bundle Index
→ Publish Evidence Accepted Event
```

Evidence rejection must be explicit and durable when operationally significant.

---

## 6. Evidence Lineage

Evidence lineage must permit reconstruction of:

- which path version was active
- which node was involved
- which session or assessment produced the evidence
- which decision consumed it
- which adaptation was caused by it
- which projection displayed it

```ts
interface LearningPathEvidenceLineage {
  evidenceId: string
  upstreamReferences: EvidenceReference[]
  downstreamReferences: EvidenceReference[]
  supersedesEvidenceId?: string
  derivedByPolicyVersion?: string
  derivedAt?: string
}
```

Derived evidence must never hide its source records or derivation policy.

---

## 7. Path Evidence Bundle

A path evidence bundle is an immutable, versioned index over related evidence.

```ts
interface LearningPathEvidenceBundle {
  bundleId: string
  tenantId: string
  learnerId: string
  pathId: string
  pathVersion: number
  bundleVersion: number
  evidenceIds: string[]
  completeness: 'PARTIAL' | 'SUFFICIENT' | 'COMPLETE'
  confidence: number
  generatedAt: string
  policyVersion: string
  integrityRoot: string
}
```

The bundle is not a new authority over the original evidence. It is a deterministic composition for evaluation and audit.

---

## 8. Planning Quality Evidence

Planning quality must be evaluated using more than completion rate.

Dimensions include:

- prerequisite correctness
- path reachability
- objective coverage
- unnecessary-node rate
- remediation precision
- acceleration precision
- time-budget fit
- content availability fit
- accessibility fit
- branch quality
- replan frequency
- learner burden

Representative metrics:

```text
planned nodes vs executed nodes
planned duration vs actual duration
blocked-node rate
repeated-node rate
unauthorized deviation rate
replan rate
remediation success rate
acceleration reversal rate
```

Metrics are evidence signals, not automatic educational conclusions.

---

## 9. Execution Evidence

For each path node, evidence should support the following lifecycle:

```text
ELIGIBLE
→ AUTHORIZED
→ STARTED
→ OUTCOME_RECORDED
→ COMPLETED | FAILED | SKIPPED | BLOCKED
```

Required evidence includes:

- authorization reference
- execution owner
- start and end timestamps
- session reference
- terminal outcome
- reason codes
- relevant assessment or mastery references
- retry lineage

A node must not be marked completed solely because the UI advanced.

---

## 10. Completion Evidence

Path completion is an operational conclusion that all required path obligations reached an allowed terminal state.

Path completion evidence must prove:

- required nodes are terminal
- required objectives are addressed
- unresolved blockers are absent or explicitly waived
- active sessions are closed
- pending evidence commits are resolved
- final path version is identified
- completion authority is recorded

Path completion does not prove mastery.

---

## 11. Deviation Evidence

Every material deviation must capture:

- expected action
- actual action
- reason
- actor
- authorization state
- impact on reachability
- whether replan was required
- whether evidence comparability changed

Deviation classes:

```text
AUTHORIZED_VARIATION
OPERATIONAL_SUBSTITUTION
HUMAN_OVERRIDE
LEARNER_SELF_DIRECTED_EXTENSION
UNAUTHORIZED_DEVIATION
SYSTEM_RECOVERY_ACTION
```

Unauthorized deviations must not be silently normalized into successful execution.

---

## 12. Adaptation Outcome Evidence

After an adaptation is activated, the runtime must collect evidence about whether the change helped.

Dimensions include:

- blocker resolution
- reduction in repeated failure
- improved completion probability
- lower learner burden
- reduced time waste
- improved retention
- valid acceleration
- absence of new prerequisite violations

An adaptation may be operationally successful but educationally inconclusive. These outcomes must remain distinct.

---

## 13. Confidence and Completeness

Evidence confidence reflects source reliability, integrity, and comparability.

Evidence completeness reflects whether the required evidence classes are present.

Neither confidence nor completeness should be represented as a hidden magic score. Their components must be inspectable.

Example:

```ts
interface EvidenceQualityAssessment {
  sourceReliability: number
  identityIntegrity: number
  temporalIntegrity: number
  schemaValidity: number
  comparability: number
  coverage: number
  finalConfidence: number
  missingRequirements: string[]
}
```

---

## 14. Evidence Withdrawal and Supersession

Evidence may be withdrawn when:

- privacy policy requires withdrawal
- the source record is proven invalid
- identity was misattributed
- a legal or institutional policy requires removal from active evaluation

Rules:

- withdrawal must preserve an audit marker where legally permitted
- derived bundles must be invalidated or regenerated
- downstream decisions are not silently rewritten
- reevaluation must create new lineage

Supersession is used for correction while preserving historical traceability.

---

## 15. Privacy and Access Control

Evidence access must enforce:

- tenant isolation
- learner-level authorization
- role-based field visibility
- purpose limitation
- minimum necessary disclosure
- sensitive-field redaction
- audit logging
- retention policy

Parent, teacher, and learner projections may consume the same evidence but expose different details.

---

## 16. Integrity

Minimum integrity controls:

- stable source reference
- idempotent intake key
- schema validation
- immutable accepted records
- integrity hash
- bundle integrity root
- path-version binding
- actor and source attribution
- timestamp validation
- correlation and causation metadata

Evidence with failed integrity validation must not enter authoritative evaluation bundles.

---

## 17. Replay and Reconstruction

Evidence reconstruction must produce the same accepted record set for the same event history and policy versions.

Replay must not:

- send notifications
- execute sessions
- mutate mastery
- activate adaptations
- duplicate external side effects

Replay may:

- rebuild evidence indexes
- regenerate bundles
- verify integrity
- compare historical derivations

---

## 18. Events

Representative events:

```text
LearningPathEvidenceReceived
LearningPathEvidenceRejected
LearningPathEvidenceAccepted
LearningPathEvidenceSuperseded
LearningPathEvidenceWithdrawn
LearningPathEvidenceBundleCreated
LearningPathEvidenceBundleInvalidated
LearningPathCompletionEvidenceConfirmed
LearningPathDeviationRecorded
LearningPathAdaptationOutcomeRecorded
```

---

## 19. Observability

Minimum metrics:

- evidence intake volume
- rejection rate
- duplicate rate
- integrity failure rate
- evidence latency
- bundle completeness distribution
- bundle confidence distribution
- deviation rate
- unauthorized deviation rate
- path completion evidence lag
- adaptation outcome availability
- withdrawn evidence count
- supersession count

---

## 20. Cross-Runtime Contracts

### Inputs

- Learning Path Planning Runtime: candidate and approval evidence
- Orchestration Runtime: execution transitions
- Adaptive Runtime: trigger, assessment, and activation evidence
- Session Runtime: session outcomes
- Assessment Runtime: assessment evidence references
- Mastery Runtime: mastery decision references
- Curriculum and Skill Graph Runtime: structural-version references

### Outputs

- Learning Path Projection Runtime: evidence-backed read data
- Verification Runtime: conformance and integrity evidence
- Adaptive Runtime: qualified adaptation signals
- Analytics Runtime: privacy-safe aggregate signals
- Audit Runtime: immutable evidence lineage

---

## 21. Acceptance Criteria

The Learning Path Evidence Runtime is acceptable only when:

- accepted evidence is immutable
- every record is tenant-bound
- source authority is validated
- duplicate intake is idempotent
- path and node versions are explicit
- derived evidence preserves lineage
- completion evidence is distinct from mastery evidence
- withdrawals invalidate dependent bundles
- replay reconstructs deterministically
- privacy rules are enforced by role and purpose
- integrity failures cannot enter authoritative bundles

---

## 22. Final Boundary

Learning Path Evidence Runtime does not claim that the learner mastered a skill.

It establishes a trustworthy record of the route, its execution, its changes, and its effects.

> The path may be planned by policy and executed by sessions, but its quality can be trusted only when every meaningful transition is supported by durable, attributable, versioned evidence.
