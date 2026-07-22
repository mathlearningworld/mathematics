# 39E — Learning Activity Evidence Runtime

## 1. Purpose

Learning Activity Evidence Runtime defines the durable, attributable, replayable evidence produced across the full lifecycle of a learning activity.

It answers:

- what activity was authorized,
- what was actually executed,
- which attempts occurred,
- which state transitions were accepted,
- why an activity completed, failed, expired, or was cancelled,
- which session and content versions were involved,
- which evidence belongs to activity completion,
- which evidence may later be interpreted by Mastery Runtime.

> Activity evidence proves what happened in an activity.
>
> It does not independently prove mastery.

## 2. Runtime Boundary

Learning Activity Evidence Runtime owns:

- evidence envelopes,
- evidence identity,
- source attribution,
- lifecycle evidence,
- authorization evidence,
- execution evidence,
- attempt evidence,
- checkpoint evidence,
- completion and closure evidence,
- cancellation, expiry, and abort evidence,
- adaptive lineage evidence,
- evidence integrity,
- evidence supersession and withdrawal,
- evidence bundles,
- evidence replay compatibility,
- role-aware evidence projection contracts.

It does not own:

- activity state authority,
- activity authorization,
- session execution,
- scoring policy authority,
- mastery interpretation,
- path planning,
- learner-facing projection ownership.

## 3. Core Distinction

```text
Activity completion evidence ≠ Mastery evidence
Activity score ≠ Mastery state
Attempt success ≠ Durable understanding
Projection display ≠ Evidence authority
```

Activity evidence may be consumed by Mastery Runtime, but only Mastery Runtime may interpret it into mastery state.

## 4. Evidence Envelope

```ts
interface LearningActivityEvidenceEnvelope {
  evidenceId: string;
  tenantId: string;
  learnerId: string;
  activityId: string;
  activityVersion: number;
  evidenceType: LearningActivityEvidenceType;
  schemaVersion: string;
  sourceRuntime: string;
  sourceEntityId: string;
  sourceEntityVersion?: number;
  sourceEventId?: string;
  sessionId?: string;
  attemptId?: string;
  pathId?: string;
  pathVersion?: number;
  contentDefinitionId?: string;
  contentDefinitionVersion?: string;
  occurredAt: string;
  recordedAt: string;
  actorType: EvidenceActorType;
  actorId?: string;
  correlationId: string;
  causationId?: string;
  payload: Record<string, unknown>;
  integrity: EvidenceIntegrityMetadata;
  status: EvidenceRecordStatus;
  supersedesEvidenceId?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
}
```

## 5. Evidence Types

```ts
type LearningActivityEvidenceType =
  | 'ACTIVITY_CREATED'
  | 'ACTIVITY_AUTHORIZED'
  | 'AUTHORIZATION_REVOKED'
  | 'ACTIVITY_STARTED'
  | 'SESSION_BOUND'
  | 'ATTEMPT_STARTED'
  | 'ATTEMPT_RESPONSE_RECORDED'
  | 'ATTEMPT_EVALUATED'
  | 'HINT_USED'
  | 'SCAFFOLD_USED'
  | 'CHECKPOINT_CREATED'
  | 'ACTIVITY_PAUSED'
  | 'ACTIVITY_RESUMED'
  | 'ACTIVITY_COMPLETION_REQUESTED'
  | 'ACTIVITY_COMPLETED'
  | 'ACTIVITY_CLOSED'
  | 'ACTIVITY_CANCELLED'
  | 'ACTIVITY_ABORTED'
  | 'ACTIVITY_EXPIRED'
  | 'ACTIVITY_FAILED'
  | 'ACTIVITY_ADAPTED'
  | 'ACTIVITY_REPLACED'
  | 'ACTIVITY_RETRY_CREATED'
  | 'HUMAN_REVIEW_RECORDED'
  | 'EVIDENCE_CORRECTED'
  | 'EVIDENCE_WITHDRAWN';
```

## 6. Evidence Categories

### 6.1 Structural Evidence

Proves the shape and authority context of the activity:

- activity definition,
- activity version,
- objective references,
- path reference,
- prerequisite references,
- authorization reference,
- content version,
- policy versions,
- learner and tenant identity.

### 6.2 Execution Evidence

Proves what the runtime executed:

- session binding,
- start time,
- pause and resume transitions,
- checkpoints,
- active duration,
- device or runtime context,
- interruption and recovery events.

### 6.3 Attempt Evidence

Proves bounded learner attempts:

- attempt identity,
- prompt or item reference,
- response representation,
- submission time,
- evaluation result,
- hints and scaffolds,
- latency,
- retry lineage,
- evaluator version.

### 6.4 Completion Evidence

Proves why activity completion was accepted:

- completion command,
- expected version,
- completion rule version,
- required attempt coverage,
- accepted terminal status,
- linked evidence set,
- completion timestamp.

### 6.5 Termination Evidence

Proves cancellation, abort, expiry, or failure:

- authority,
- reason,
- last committed checkpoint,
- unresolved obligations,
- evidence completeness,
- replacement relationship.

### 6.6 Adaptation Evidence

Proves adaptive reconsideration:

- trigger set,
- policy version,
- candidate set,
- selected decision,
- human review,
- source and target lineage,
- activation result.

## 7. Evidence Identity

Every evidence record must have a globally unique evidence identity within the platform.

Identity must not be derived solely from timestamps.

For idempotent producer integration, evidence may include a deterministic producer key:

```ts
interface EvidenceProducerKey {
  producerRuntime: string;
  producerEntityId: string;
  producerEventId: string;
  evidenceType: string;
}
```

The same producer key must resolve to the same evidence record.

## 8. Attribution

Every evidence record must be attributable to:

- a runtime producer,
- an entity version,
- an actor or system authority,
- a tenant,
- a learner,
- an occurrence time,
- a recording time,
- a correlation chain.

Evidence without sufficient attribution is not eligible for authoritative downstream interpretation.

## 9. Occurred Time vs Recorded Time

```text
occurredAt = when the activity fact happened
recordedAt = when the evidence was durably stored
```

Both are required where delayed ingestion is possible.

Clock skew and delayed delivery must not reorder authoritative activity state. Activity aggregate version remains the ordering authority.

## 10. Authorization Evidence

Authorization evidence must include:

- authorization decision ID,
- authorization policy version,
- eligible activity version,
- learner and tenant identity,
- prerequisite references,
- validity window,
- constraints,
- revocation status.

Authorization evidence proves permission was granted. It does not prove the activity started.

## 11. Start Evidence

Activity start evidence must bind:

- activity ID and expected version,
- authorization ID,
- session ID,
- learner identity,
- start command ID,
- start timestamp,
- content definition version,
- orchestration policy version.

## 12. Session Binding Evidence

Session binding evidence proves which Learning Session Runtime instance executed the activity.

An activity may have multiple historical session bindings across pause, recovery, or retry, but at most one active binding where the orchestration contract requires it.

## 13. Attempt Evidence Model

```ts
interface LearningActivityAttemptEvidence {
  attemptId: string;
  activityId: string;
  activityVersion: number;
  attemptOrdinal: number;
  sessionId: string;
  itemReference: string;
  itemVersion: string;
  responseFormat: string;
  responseReference?: string;
  responseDigest?: string;
  startedAt: string;
  submittedAt?: string;
  evaluatedAt?: string;
  evaluatorVersion?: string;
  outcome?: 'CORRECT' | 'INCORRECT' | 'PARTIAL' | 'UNSCORABLE' | 'WITHDRAWN';
  score?: number;
  maxScore?: number;
  hintsUsed: number;
  scaffoldsUsed: string[];
  latencyMs?: number;
  retryOfAttemptId?: string;
}
```

Sensitive response content may be stored by reference or digest rather than duplicated into every evidence envelope.

## 14. Response Integrity

When raw learner responses are retained, integrity must cover:

- exact response bytes or canonical representation,
- item identity and version,
- submission time,
- evaluator version,
- transformation pipeline version,
- content encoding.

## 15. Evaluation Evidence

Evaluation evidence must distinguish:

- deterministic correctness,
- rubric evaluation,
- model-assisted evaluation,
- teacher evaluation,
- self-report,
- unscorable result.

Model-assisted evaluation must record:

- model or evaluator version,
- prompt or rubric version,
- confidence,
- review requirement,
- final accepted evaluator authority.

## 16. Hint and Scaffold Evidence

Hint and scaffold usage is part of activity execution evidence.

It may affect downstream mastery interpretation, but Activity Evidence Runtime does not decide that effect.

Evidence must include:

- hint or scaffold identity,
- version,
- trigger,
- learner request vs automatic presentation,
- display time,
- completion or dismissal,
- attempt relationship.

## 17. Checkpoint Evidence

Checkpoint evidence supports pause, recovery, and replay.

A checkpoint must identify:

- activity version,
- session version,
- last committed attempt,
- pending item state,
- elapsed active time,
- RNG or variant seed where required,
- content state reference,
- checkpoint schema version,
- integrity hash.

Checkpoint evidence is not a replacement for aggregate persistence.

## 18. Pause and Resume Evidence

Pause evidence must record:

- pause reason,
- authority,
- checkpoint reference,
- unresolved attempt state,
- timestamp.

Resume evidence must record:

- resume authority,
- checkpoint used,
- recovery version,
- content compatibility result,
- new session binding if applicable.

## 19. Completion Evidence

Activity completion evidence must be accepted only after all required evidence obligations are satisfied.

Typical obligations:

- required attempts committed,
- final evaluation committed,
- active session closed or detached,
- checkpoint resolved,
- required evidence links present,
- no unresolved ambiguous writes,
- expected aggregate version matches.

## 20. Closure Evidence

Completion and closure are distinct.

```text
Completion = work criteria were accepted.
Closure = all runtime obligations were finalized.
```

Closure evidence may include:

- completion evidence reference,
- evidence bundle ID,
- session release,
- outbox publication state,
- terminal aggregate version,
- closure timestamp.

## 21. Cancellation Evidence

Cancellation evidence must record:

- actor and authority,
- reason code,
- activity state at cancellation,
- checkpoint reference,
- attempt evidence retained,
- downstream path impact,
- replacement activity reference where applicable.

Cancellation never deletes prior attempts.

## 22. Abort Evidence

Abort is reserved for abnormal or safety-related termination.

Abort evidence must distinguish:

- learner-requested stop,
- runtime fault,
- safety stop,
- operator intervention,
- policy violation,
- content corruption.

## 23. Expiry Evidence

Expiry evidence must identify:

- timing policy version,
- expiry threshold,
- last eligible timestamp,
- current activity state,
- whether extension was considered,
- replacement or reauthorization requirement.

## 24. Failure Evidence

Failure evidence must not conflate:

- learner outcome,
- runtime technical failure,
- content failure,
- authorization failure,
- evidence persistence failure.

Each failure domain receives a distinct reason code and source authority.

## 25. Adaptation Evidence

Adaptation evidence must bind source and target lineages.

```ts
interface ActivityAdaptationEvidence {
  adaptationDecisionId: string;
  sourceActivityId: string;
  sourceActivityVersion: number;
  targetActivityId?: string;
  targetActivityVersion?: number;
  triggerIds: string[];
  policyVersion: string;
  decisionType: string;
  reasonCodes: string[];
  activated: boolean;
  humanReviewReference?: string;
}
```

## 26. Evidence Status

```ts
type EvidenceRecordStatus =
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'WITHDRAWN'
  | 'QUARANTINED';
```

Evidence is append-only. Status changes create new evidence or explicit status events; they do not erase history.

## 27. Correction and Supersession

A correction must:

1. reference the original evidence,
2. state the correction reason,
3. identify correction authority,
4. preserve original payload and integrity metadata,
5. provide corrected payload,
6. emit a supersession relationship,
7. notify downstream consumers.

## 28. Withdrawal

Withdrawal is used when evidence must no longer be considered valid.

Withdrawal must include:

- evidence ID,
- reason,
- authority,
- timestamp,
- downstream re-evaluation requirement,
- affected activity and mastery references.

Withdrawal does not physically delete the historical record unless legally required by a separate governed process.

## 29. Quarantine

Evidence may be quarantined for:

- integrity mismatch,
- unknown schema version,
- invalid tenant relationship,
- unsupported producer,
- duplicate identity conflict,
- corrupted payload,
- policy violation.

Quarantined evidence must not be consumed for mastery evaluation.

## 30. Evidence Integrity

```ts
interface EvidenceIntegrityMetadata {
  canonicalizationVersion: string;
  payloadHash: string;
  previousEvidenceHash?: string;
  signature?: string;
  signingKeyId?: string;
  verifiedAt?: string;
}
```

Integrity strategy may include:

- canonical payload hashing,
- event-stream chaining,
- digital signatures,
- immutable object storage,
- database constraints,
- audit-log correlation.

## 31. Evidence Chain

Evidence may form an ordered chain by aggregate version or event sequence.

Chain verification must detect:

- missing evidence,
- duplicate sequence,
- unexpected version gaps,
- payload mutation,
- invalid supersession,
- cross-tenant contamination.

## 32. Evidence Bundle

An evidence bundle is a stable manifest of evidence supporting an activity outcome.

```ts
interface LearningActivityEvidenceBundle {
  bundleId: string;
  tenantId: string;
  learnerId: string;
  activityId: string;
  terminalActivityVersion: number;
  evidenceIds: string[];
  bundleType: 'COMPLETION' | 'CANCELLATION' | 'ABORT' | 'EXPIRY' | 'ADAPTATION';
  createdAt: string;
  schemaVersion: string;
  manifestHash: string;
}
```

The bundle freezes membership by evidence identity. It does not duplicate all payloads.

## 33. Mastery Consumption Contract

Mastery Runtime may consume eligible activity evidence through an explicit contract.

The contract should include:

- evidence bundle ID,
- activity objective references,
- evidence schema versions,
- evaluator versions,
- integrity status,
- withdrawal status,
- adaptation lineage,
- completion status.

Mastery Runtime remains responsible for deciding whether and how evidence affects mastery.

## 34. Replay

Evidence replay reconstructs the evidence state from committed records.

Replay must not:

- re-run learner evaluation unless explicitly performing a governed re-evaluation,
- re-run adaptation policy,
- infer missing evidence silently,
- modify original occurrence time,
- replace original schema versions.

## 35. Re-evaluation

A governed re-evaluation creates new evidence lineage.

It must record:

- original evidence references,
- new evaluator version,
- re-evaluation policy,
- reason,
- new result,
- supersession or coexistence semantics.

## 36. Producer Contract

Evidence producers must guarantee:

- stable producer event identity,
- idempotent publication,
- tenant and learner identity,
- source version,
- schema version,
- occurrence time,
- correlation metadata,
- retry-safe delivery.

## 37. Consumer Contract

Evidence consumers must:

- deduplicate by evidence identity,
- validate schema and integrity,
- enforce tenant isolation,
- handle supersession and withdrawal,
- persist processing offset or inbox state,
- avoid treating delivery order as aggregate order when versions disagree.

## 38. Transactional Publication

Activity state transition and evidence publication intent should be committed atomically through an outbox or equivalent mechanism.

This prevents:

- state committed without evidence publication intent,
- evidence published for a rejected transition,
- duplicate evidence under retry.

## 39. Privacy

Evidence payloads must apply data minimization.

Controls include:

- response references instead of duplication,
- role-based access,
- field-level redaction,
- retention policy,
- encryption,
- audit logging,
- child-data protection,
- legal deletion workflow where required.

## 40. Role-Aware Access

### Learner

May access understandable activity history and own responses subject to policy.

### Parent or Guardian

May access authorized summaries and evidence appropriate to guardianship.

### Teacher

May access instructional evidence for assigned learners and contexts.

### Operator

May access operational and integrity metadata according to least privilege.

### Mastery Runtime

Receives machine-readable evidence under service authorization.

## 41. Projection Contract

Projection may display evidence-derived summaries such as:

- attempts completed,
- hints used,
- activity duration,
- completion status,
- retry history,
- adaptation history.

Projection must expose freshness and must not replace the evidence store.

## 42. Retention

Retention policy must distinguish:

- aggregate events,
- evidence envelopes,
- raw responses,
- media attachments,
- derived summaries,
- audit logs,
- legal holds.

Deleting a derived projection does not delete authoritative evidence.

## 43. Observability

Metrics should include:

- evidence records produced,
- duplicate producer events,
- ingestion latency,
- integrity failures,
- quarantine rate,
- supersession rate,
- withdrawal rate,
- missing evidence obligations,
- bundle creation failures,
- downstream mastery-consumption lag,
- replay divergence.

## 44. Failure Recovery

When evidence persistence outcome is ambiguous:

1. inspect evidence by producer key,
2. inspect activity aggregate version,
3. inspect outbox state,
4. return the committed result when found,
5. retry idempotently when absent,
6. quarantine conflicting duplicates,
7. do not fabricate completion evidence.

## 45. Verification Scenarios

Minimum scenarios:

1. activity transition and outbox intent are atomic,
2. duplicate producer event creates one evidence record,
3. stale activity version is rejected,
4. cancellation preserves prior attempt evidence,
5. completion fails when mandatory evidence is missing,
6. evidence correction preserves the original,
7. withdrawn evidence is excluded from mastery consumption,
8. quarantined evidence cannot enter a completion bundle,
9. replay reconstructs identical evidence status,
10. delayed evidence preserves occurredAt and recordedAt,
11. cross-tenant evidence linkage is rejected,
12. bundle manifest hash detects membership mutation,
13. evaluator re-run creates new lineage,
14. projection deletion does not affect evidence authority,
15. adaptive replacement links source and target evidence.

## 46. Runtime Invariants

1. Every evidence record has a unique evidence ID.
2. Every evidence record belongs to exactly one tenant and learner.
3. Every activity evidence record references an activity ID and version.
4. Evidence is append-only.
5. Corrections preserve original evidence.
6. Withdrawal does not silently erase history.
7. Quarantined evidence is excluded from authoritative consumption.
8. Producer retries are idempotent.
9. Activity completion evidence does not equal mastery evidence.
10. Evidence occurrence time and recording time remain distinct.
11. Evidence publication intent corresponds to a committed activity transition.
12. Evidence bundles contain stable evidence identities.
13. Replay reconstructs without re-deciding.
14. Cross-tenant linkage is forbidden.
15. Projection is never the evidence authority.
16. Sensitive response data follows minimization and access policy.
17. Adaptation evidence preserves source and target lineage.
18. Every downstream consumer handles supersession and withdrawal.
19. Integrity failure prevents authoritative interpretation.
20. No terminal activity is closed before required evidence obligations are satisfied.

## 47. Final Boundary

```text
Activity Runtime owns activity state.
Evidence Runtime proves activity facts.
Mastery Runtime interprets eligible evidence.
Projection Runtime explains evidence-derived views.

Evidence may support a mastery decision.
Evidence alone does not own that decision.
```
