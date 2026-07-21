# Chapter 28C — Mission Activation Runtime

## 1. Purpose

The Mission Activation Runtime governs the transition from a proposal-ready mission candidate into active learner work.

Activation is a controlled authority boundary:

```text
Candidate
  ↓
Proposal
  ↓
Acceptance / Approval
  ↓
Activation Verification
  ↓
ACTIVE Mission
```

No candidate, recommendation, UI action, or gameplay scene may bypass this boundary.

## 2. Responsibility

The runtime owns:

- mission proposal creation
- proposal presentation state
- learner or authorized-human acceptance
- approval requirements
- activation eligibility checks
- mission contract finalization
- activation idempotency
- activation concurrency control
- active-load limits
- gameplay delivery reservation
- activation publication
- activation audit records

It does not own:

- recommendation truth
- candidate generation
- assessment interpretation
- gameplay completion
- mastery declaration
- mission progress calculation after activation

## 3. Activation stages

```text
ELIGIBLE_FOR_PROPOSAL
  ↓
PROPOSED
  ├── DEFERRED
  ├── REJECTED
  └── ACCEPTED
        ↓
PENDING_APPROVAL? 
        ↓
APPROVED
        ↓
ACTIVATION_READY
        ↓
ACTIVE
```

A system may skip `PENDING_APPROVAL` only when policy explicitly allows self-activation.

## 4. Proposal contract

```text
MissionProposal {
  proposalId
  tenantId
  learnerId
  candidateId
  candidateVersion
  missionDraft
  optionality
  rationale
  sourceRefs[]
  proposedAt
  expiresAt?
  requiredApprovals[]
  proposalState
  version
}
```

Proposal state:

```text
PROPOSED
VIEWED
DEFERRED
ACCEPTED
REJECTED
EXPIRED
SUPERSEDED
WITHDRAWN
```

## 5. Acceptance semantics

Acceptance means the learner or authorized actor agrees to proceed under the presented mission contract.

Acceptance does not mean:

- the mission is already active
- gameplay resources are available
- prerequisites remain valid
- required approvals are complete
- the learner has mastered the target

Acceptance must reference the exact proposal version shown to the actor.

## 6. Approval model

Approval types may include:

```text
LEARNER_CONSENT
PARENT_APPROVAL
TEACHER_APPROVAL
MENTOR_APPROVAL
SAFETY_APPROVAL
ENTITLEMENT_APPROVAL
SYSTEM_POLICY_APPROVAL
```

Approval record:

```text
MissionApproval {
  approvalId
  proposalId
  proposalVersion
  approvalType
  actorId
  actorRole
  decision
  rationale?
  decidedAt
}
```

Approval decisions:

```text
APPROVED
REJECTED
REQUEST_CHANGES
DEFERRED
```

## 7. Self-activation policy

Self-activation may be allowed for low-risk optional or exploratory missions when:

- learner identity is verified
- no human approval is required
- source remains current
- delivery capability is available
- active-load policy permits it
- no blocking prerequisite exists

Self-activation must still pass the full activation verifier.

## 8. Activation readiness

A mission is activation-ready only when all required conditions are true:

```text
proposal accepted
required approvals complete
candidate not expired
source not stale or withdrawn
learner and tenant scope match
prerequisites remain satisfied
delivery capability available
active-load limit allows activation
no duplicate active mission
mission contract valid
evidence policy valid
expected version matches
```

## 9. Revalidation at activation time

Eligibility must be revalidated immediately before activation because context may change between proposal and acceptance.

Examples:

- recommendation was superseded
- another mission already covers the target
- learner load reached the limit
- a prerequisite became blocked
- gameplay scene became unavailable
- approval expired

The runtime must fail closed rather than activate from stale assumptions.

## 10. Mission contract finalization

Activation creates or finalizes the durable mission contract:

```text
ActiveMissionContract {
  missionId
  tenantId
  learnerId
  missionVersion
  proposalId
  candidateId
  missionType
  purpose
  title
  rationale
  objectives[]
  sourceRefs[]
  optionality
  activationPolicy
  progressPolicy
  completionPolicy
  evidencePolicy
  supportPolicy
  deliveryPlan
  activatedAt
  activatedBy
  state: ACTIVE
}
```

The activated contract is immutable except through explicit versioned mission commands.

## 11. Active-load policy

The runtime must prevent mission overload.

Possible constraints:

```text
maximum total active missions
maximum active foundation missions
maximum active assessment missions
maximum estimated daily minutes
maximum cognitive-load score
maximum concurrent teacher-guided missions
```

Load policy must not silently cancel existing missions. It may block, defer, or require human review.

## 12. Duplicate-active protection

Before activation, the runtime checks material overlap with active missions.

Outcomes:

```text
NO_CONFLICT
EXACT_DUPLICATE_BLOCK
OVERLAP_REQUIRES_REVIEW
REPLACE_EXISTING
MERGE_NOT_ALLOWED_AFTER_ACTIVATION
```

Replacement must use explicit supersession or cancellation semantics.

## 13. Delivery reservation

Activation may require a delivery reservation from downstream runtimes:

```text
Gameplay Runtime
Learning Runtime
Practice Runtime
Assessment Runtime
Mentor Scheduling
Teacher Scheduling
```

Reservation outcomes:

```text
RESERVED
AVAILABLE_WITHOUT_RESERVATION
TEMPORARILY_UNAVAILABLE
PERMANENTLY_UNAVAILABLE
FALLBACK_AVAILABLE
```

A mandatory unavailable delivery path blocks activation.

## 14. Activation command

```text
ActivateMissionCommand {
  commandId
  correlationId
  tenantId
  learnerId
  actorId
  actorRole
  proposalId
  proposalVersion
  candidateId
  candidateVersion
  expectedMissionVersion?
  requestedAt
}
```

## 15. Activation result

```text
ActivateMissionResult {
  missionId
  missionVersion
  state: ACTIVE
  activatedAt
  activationEventId
  idempotencyStatus
  deliveryPlan
}
```

## 16. Idempotency

Repeated activation using the same commandId must return the same result.

If the same proposal is activated with a different commandId after successful activation, the runtime returns the existing mission result or an explicit `MISSION_ALREADY_ACTIVE` outcome according to API policy.

Activation must never create two active missions from one accepted proposal.

## 17. Optimistic concurrency

Activation checks:

- proposal version
- candidate version
- source version where required
- learner active-load version
- mission aggregate version if pre-created

Any mismatch fails with a version conflict and causes no partial activation.

## 18. Transaction boundary

Activation persistence should atomically commit:

- mission aggregate creation or transition
- activation event
- proposal state transition
- candidate state transition
- delivery reservation reference
- idempotency record
- audit record

If any required write fails, activation does not publish.

## 19. Publication

Only after durable activation succeeds may the system publish:

```text
MissionActivated
MissionAvailableToGameplay
MissionAvailableToLearnerProjection
```

Publication must use outbox or equivalent durable delivery semantics.

UI projection is not the source of truth for activation.

## 20. Activation failures

Representative codes:

```text
MISSION_PROPOSAL_NOT_FOUND
MISSION_PROPOSAL_VERSION_CONFLICT
MISSION_PROPOSAL_NOT_ACCEPTED
MISSION_PROPOSAL_EXPIRED
MISSION_PROPOSAL_WITHDRAWN
MISSION_CANDIDATE_STALE
MISSION_SOURCE_STALE
MISSION_SOURCE_WITHDRAWN
MISSION_APPROVAL_REQUIRED
MISSION_APPROVAL_REJECTED
MISSION_APPROVAL_EXPIRED
MISSION_PREREQUISITE_BLOCKED
MISSION_DUPLICATE_ACTIVE
MISSION_ACTIVE_LOAD_EXCEEDED
MISSION_DELIVERY_UNAVAILABLE
MISSION_SCOPE_MISMATCH
MISSION_ACTOR_UNAUTHORIZED
MISSION_ALREADY_ACTIVE
MISSION_ACTIVATION_CONFLICT
MISSION_CONTRACT_INVALID
```

## 21. Failure atomicity

Activation failures must not leave:

- active mission without proposal transition
- proposal accepted but falsely shown as activated
- reserved gameplay slot without mission
- candidate consumed without mission
- outbox event without durable mission

Recovery must be deterministic from durable state.

## 22. Activation events

```text
MissionProposed
MissionProposalViewed
MissionProposalDeferred
MissionProposalAccepted
MissionProposalRejected
MissionApprovalRequested
MissionApprovalGranted
MissionApprovalRejected
MissionActivationReadinessConfirmed
MissionActivationBlocked
MissionActivated
MissionActivationPublicationQueued
```

## 23. Human experience principles

The learner-facing activation experience should communicate:

- what the mission is
- why it is recommended
- whether it is optional or required by an accepted plan
- estimated effort
- what support is available
- what completion means
- that completion is not automatically mastery

The UI must not use coercive language for optional missions.

## 24. Activation invariants

1. Candidate is not proposal.
2. Proposal is not acceptance.
3. Acceptance is not activation.
4. Approval is not activation.
5. Only Mission Activation Runtime creates ACTIVE state.
6. Activation cannot modify assessment or recommendation truth.
7. Activation uses the exact accepted proposal version.
8. Activation revalidates current context.
9. Stale or withdrawn sources fail closed.
10. Blocking prerequisites prevent activation.
11. Mandatory unavailable delivery prevents activation.
12. Active-load limits are enforced before commit.
13. One accepted proposal cannot create multiple active missions.
14. Activation is idempotent.
15. Version conflicts cause no partial mutation.
16. Durable state precedes publication.
17. Projection cannot create activation truth.
18. Gameplay cannot self-activate a mission.
19. Human approval cannot erase provenance.
20. Activation does not imply mastery or readiness.

## 25. Verification scenarios

Automated verification must cover at least:

- accepted eligible proposal activates successfully
- unaccepted proposal is rejected
- expired proposal is rejected
- stale source is rejected
- missing approval is rejected
- rejected approval blocks activation
- blocked prerequisite prevents activation
- active-load overflow prevents activation
- unavailable mandatory delivery prevents activation
- duplicate command returns same mission
- concurrent activation creates one mission only
- proposal version conflict fails closed
- cross-learner activation is rejected
- transaction failure publishes no activation event
- successful durable activation publishes through outbox
- gameplay cannot directly set ACTIVE state

## 26. Output to lifecycle runtime

28C emits an active mission with:

```text
missionId
missionVersion
state: ACTIVE
objectives[]
progressPolicy
completionPolicy
evidencePolicy
deliveryPlan
activatedAt
sourceRefs[]
```

This becomes the authoritative input for Chapter 28D Mission Lifecycle Runtime.

## 27. Acceptance criteria for 28C

Chapter 28C is satisfied when:

- proposal, acceptance, approval, and activation are separated
- activation readiness is explicit
- stale-context revalidation is required
- active-load and duplicate protection exist
- delivery reservation semantics are defined
- command, result, transaction, and event contracts exist
- idempotency and optimistic concurrency are specified
- publication occurs only after durable commit
- activation invariants and verification scenarios are defined

## 28. Closing statement

Activation is where educational intent becomes operational commitment. It must therefore be deliberate, reversible only through explicit lifecycle rules, and incapable of overstating what the learner understands.

```text
Recommendation suggests.
Candidate structures.
Proposal communicates.
Acceptance consents.
Activation commits.
Gameplay begins.
```
