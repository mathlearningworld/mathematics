# 31E — Curriculum Publication Runtime

## Status

Architecture definition for Chapter 31, Slice E.

## Purpose

The Curriculum Publication Runtime governs how an approved curriculum version becomes visible, discoverable, resolvable, and consumable by downstream runtimes.

Publication is not file upload and not simple visibility. It is an authority transition that binds content, provenance, effective dates, policy, and distribution state into a reproducible release.

## Core Principle

Approved ≠ Published.

Published ≠ Active.

Visible ≠ Authoritative.

Publication may expose curriculum content, but authority exists only when lifecycle, effective date, provenance, and policy all permit authoritative resolution.

## Runtime Ownership

The Publication Runtime owns:

- publication packages
- publication readiness evaluation
- publication approvals
- release scheduling
- activation orchestration
- distribution manifests
- publication visibility
- withdrawal and revocation notices
- publication audit trail
- downstream invalidation notifications
- publication status projection

It does not own:

- curriculum content editing
- curriculum version identity
- learning sequence design
- assessment validity
- learner assignment
- mastery or progress

## Publication Aggregate

### CurriculumPublication

Required fields:

- publicationId
- curriculumVersionId
- publicationState
- publicationChannel
- authorityId
- readinessDecisionId
- releaseLabel
- scheduledAt
- publishedAt
- activatedAt
- withdrawnAt
- revokedAt
- distributionManifestId
- policyVersion
- createdAt

### DistributionManifest

Defines exactly what is distributed.

Required fields:

- manifestId
- curriculumVersionId
- artifactDigest
- localizationSet
- includedNodeCount
- includedAssetRefs
- catalogMetadataDigest
- alignmentMetadataVersion
- generatedAt
- generatorVersion

### PublicationDecision

Records the authoritative decision.

Decision classes:

- APPROVE_FOR_PUBLICATION
- REJECT_PUBLICATION
- SCHEDULE_PUBLICATION
- ACTIVATE_PUBLICATION
- WITHDRAW_PUBLICATION
- REVOKE_PUBLICATION

## Publication Lifecycle

```text
PREPARING
READINESS_REVIEW
APPROVED_FOR_PUBLICATION
SCHEDULED
PUBLISHED
ACTIVE
WITHDRAWN
REVOKED
FAILED
```

### PREPARING

Publication package is being assembled. Not visible and not authoritative.

### READINESS_REVIEW

Package is frozen for readiness checks.

### APPROVED_FOR_PUBLICATION

Readiness and authority checks passed, but release is not yet visible.

### SCHEDULED

Release is approved for a future publication time.

### PUBLISHED

Artifacts and catalog metadata are visible. The curriculum version may still be outside its effective window.

### ACTIVE

Publication is visible and the curriculum version is eligible for authoritative current resolution.

### WITHDRAWN

No longer offered for new discovery or assignment, but preserved for historical resolution.

### REVOKED

Must not be used for new authoritative interpretation. Historical references remain visible with warnings.

### FAILED

Publication attempt failed before a valid release became authoritative.

## Transition Rules

```text
PREPARING -> READINESS_REVIEW
READINESS_REVIEW -> PREPARING
READINESS_REVIEW -> APPROVED_FOR_PUBLICATION
READINESS_REVIEW -> FAILED
APPROVED_FOR_PUBLICATION -> SCHEDULED
APPROVED_FOR_PUBLICATION -> PUBLISHED
SCHEDULED -> PUBLISHED
PUBLISHED -> ACTIVE
ACTIVE -> WITHDRAWN
ACTIVE -> REVOKED
PUBLISHED -> WITHDRAWN
PUBLISHED -> REVOKED
WITHDRAWN -> REVOKED
FAILED -> PREPARING
```

Forbidden examples:

- PREPARING -> ACTIVE
- FAILED -> ACTIVE
- REVOKED -> ACTIVE
- publication without an approved curriculum version
- activation without effective-date eligibility

## Publication Readiness

A publication package is ready only when all required gates pass.

### Identity Gate

- curriculumVersionId exists
- curriculum identity is stable
- version state is APPROVED or SCHEDULED as policy requires

### Provenance Gate

- official source artifact is linked
- authority identity is verified
- content digest is reproducible
- provenance class is declared

### Structural Gate

- hierarchy is valid
- node identifiers are unique
- required labels and codes exist
- no orphan curriculum nodes exist

### Temporal Gate

- effective dates are valid
- activation does not create prohibited overlap
- scheduled publication time precedes or matches allowed activation policy

### Distribution Gate

- manifest is complete
- artifact digests match
- localization policy passes
- catalog metadata is generated
- dependency notifications are prepared

### Governance Gate

- required reviewers approved
- policy version is active
- unresolved blocking findings are zero
- audit evidence is complete

## Publication Command Contract

Input:

```text
publicationId
curriculumVersionId
commandType
expectedPublicationVersion
requestedAt
actorContext
authorityContext
correlationId
```

Output:

```text
publicationId
publicationVersion
publicationState
decisionId
effectiveAt?
warnings[]
```

Commands must be idempotent by command identity and expected version.

## Publication Channels

Supported channel classes:

- PUBLIC_CATALOG
- INSTITUTION_PRIVATE
- PILOT
- PREVIEW
- ARCHIVE
- REGULATORY_EXCHANGE

Channel differences may change visibility and distribution scope, but may not alter curriculum meaning.

A preview channel must never be resolved as authoritative current curriculum unless policy explicitly permits pilot authority.

## Scheduling Semantics

Scheduling binds:

- publication time
- activation time
- effective date
- distribution channel
- policy version

The runtime must distinguish:

- artifact release time
- catalog visibility time
- legal/effective start time
- downstream adoption time

These timestamps may differ and must never be collapsed into one ambiguous date.

## Activation Semantics

Activation requires:

- publication state PUBLISHED
- curriculum version eligible for activation
- effective date reached
- no blocking revocation or withdrawal
- no prohibited active-window conflict
- activation policy still valid

Activation emits an authoritative event for downstream consumers.

## Publication Events

```text
CurriculumPublicationPrepared
CurriculumPublicationReadinessPassed
CurriculumPublicationReadinessFailed
CurriculumPublicationApproved
CurriculumPublicationScheduled
CurriculumPublicationReleased
CurriculumPublicationActivated
CurriculumPublicationWithdrawn
CurriculumPublicationRevoked
CurriculumPublicationFailed
```

Every event includes:

- publicationId
- curriculumVersionId
- publicationVersion
- policyVersion
- actorId
- authorityId
- occurredAt
- correlationId

## Downstream Notifications

Publication must notify interested runtimes without directly mutating them.

Notifications may include:

- curriculum catalog refresh required
- alignment revalidation candidate
- lesson mapping review required
- assessment mapping review required
- mission target review required
- progress projection version availability
- cache invalidation token

Notification ≠ automatic acceptance.

Each downstream runtime retains authority over its own validation and adoption.

## Visibility Rules

Visibility is evaluated from:

- publication state
- channel
- actor context
- institution context
- jurisdiction restrictions
- effective window
- revocation state

A record may be visible for audit while unavailable for selection.

The API must distinguish:

- discoverable
- selectable
- resolvable
- authoritative
- historically readable

## Withdrawal vs Revocation

### Withdrawal

Used when a publication should no longer be offered for new use but historical use remains valid.

### Revocation

Used when the publication must not support new authoritative interpretation because of a serious authority, provenance, or content defect.

Neither operation deletes the publication or its history.

## Failure Recovery

Publication operations must be resumable.

A failed distribution step must not leave a partially authoritative release.

Required design:

- atomic publication-state transition
- durable outbox event
- idempotent artifact distribution
- manifest digest verification
- retry-safe downstream notification
- compensating withdrawal when exposure occurred without valid activation

## Failure Codes

```text
PUBLICATION_NOT_FOUND
CURRICULUM_VERSION_NOT_APPROVED
PUBLICATION_READINESS_FAILED
PUBLICATION_ALREADY_EXISTS
INVALID_PUBLICATION_TRANSITION
PUBLICATION_EFFECTIVE_WINDOW_CONFLICT
PUBLICATION_MANIFEST_MISMATCH
PUBLICATION_DIGEST_MISMATCH
PUBLICATION_AUTHORITY_MISSING
PUBLICATION_POLICY_INVALID
PUBLICATION_CHANNEL_FORBIDDEN
PUBLICATION_ACTIVATION_TOO_EARLY
PUBLICATION_ALREADY_REVOKED
PUBLICATION_DISTRIBUTION_FAILED
```

## Verification Rules

A publication is valid only when:

- the package references one exact curriculum version
- all manifest digests match stored content
- publication state history is continuous
- activation occurred only after valid publication
- required approvals predate publication
- channel rules are satisfied
- visible artifacts match the approved manifest
- revocation and withdrawal notices propagate
- downstream notification events are durable
- replay reproduces the same publication state

## Audit Requirements

Record for every decision:

- who requested it
- who approved it
- authority represented
- readiness evidence
- policy version
- prior and next state
- publication channel
- temporal decision basis
- artifact digest
- correlation ID

## Invariants

1. Publication never changes curriculum content.
2. One publication package references one exact curriculum version.
3. Published does not automatically mean active.
4. Visibility does not imply authority.
5. Activation requires both publication eligibility and effective-date eligibility.
6. Partial distribution must never create partial authority.
7. Withdrawal and revocation preserve historical evidence.
8. Downstream systems are notified, not silently rewritten.
9. Distribution artifacts must match the approved manifest.
10. Publication state is reproducible from durable decisions and events.

## Completion Rule

31E is complete when an approved curriculum version can be packaged, reviewed, scheduled, published, activated, withdrawn, revoked, audited, and replayed without ambiguity between visibility, publication, and authority.
