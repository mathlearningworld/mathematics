# 20G — File and Object Storage

## 1. Purpose

This document defines the infrastructure contract for file and object storage in Math Learning World.

The platform may store learner avatars, evidence images, generated reports, curriculum assets, world assets, exports, and other binary objects. These objects must be handled through explicit storage abstractions rather than direct provider calls inside application or domain code.

## 2. Core Principle

> Binary objects are external resources with their own lifecycle, authorization, integrity, and cost model.

The database stores metadata and references. The object store stores bytes.

## 3. Architectural Boundary

The Domain Layer must not know:

- bucket names;
- provider SDKs;
- signed URL formats;
- upload session mechanics;
- CDN configuration;
- physical object keys.

The Application Layer declares intent through ports. Infrastructure adapters implement storage behavior.

## 4. Storage Port

A storage port should expose capabilities such as:

```ts
interface ObjectStoragePort {
  beginUpload(input: BeginUploadInput): Promise<UploadSession>;
  completeUpload(input: CompleteUploadInput): Promise<StoredObject>;
  getDownloadAccess(input: DownloadAccessInput): Promise<DownloadAccess>;
  deleteObject(input: DeleteObjectInput): Promise<void>;
  inspectObject(input: InspectObjectInput): Promise<ObjectMetadata | null>;
}
```

Ports must describe application meaning, not provider-specific operations.

## 5. Object Identity

Every stored object must have a stable internal identifier independent of the provider key.

Recommended metadata:

- objectId;
- tenantId or workspaceId;
- ownerId when applicable;
- purpose;
- provider;
- bucket or container reference;
- storageKey;
- originalFilename;
- mediaType;
- byteSize;
- checksum;
- status;
- createdAt;
- completedAt;
- deletedAt.

Application code should reference `objectId`, not raw storage keys.

## 6. Object Lifecycle

Recommended states:

```text
PENDING_UPLOAD
UPLOADED
VERIFIED
AVAILABLE
QUARANTINED
DELETE_PENDING
DELETED
FAILED
```

A database record may be created before bytes arrive. Availability must not be assumed until upload completion and verification succeed.

## 7. Upload Flow

Preferred direct-upload flow:

```text
Client
  -> API requests upload session
  -> Application validates purpose and authorization
  -> Infrastructure creates signed upload access
  -> Client uploads directly to object storage
  -> Client or provider callback confirms completion
  -> Application verifies metadata and marks object AVAILABLE
```

Large binary payloads should not pass through the primary API unless a specific requirement justifies it.

## 8. Signed Access

Signed URLs or temporary credentials must:

- expire quickly;
- grant the minimum required operation;
- target a single object or constrained prefix;
- never expose permanent provider credentials;
- be issued only after authorization.

A signed URL is not authorization by itself. Authorization must happen before issuance.

## 9. Key Strategy

Storage keys must be opaque and collision-resistant.

Recommended shape:

```text
<environment>/<tenant>/<purpose>/<object-id>/<version>
```

Do not use user-supplied filenames as authoritative keys.

## 10. Integrity Verification

Uploaded objects should be checked using available controls:

- expected content length;
- media type allowlist;
- checksum or provider ETag where reliable;
- image or document decoding when required;
- malware scanning for risky inputs;
- metadata consistency.

The system must reject or quarantine objects that fail verification.

## 11. Authorization

Object access must be derived from application policy.

Examples:

- learners may access their own private evidence;
- parents may access evidence for linked children;
- teachers may access authorized class materials;
- public curriculum assets may use public or CDN-backed access;
- internal reports remain private.

Storage ACLs must not replace application authorization.

## 12. Public and Private Objects

Objects must be classified explicitly:

```text
PUBLIC_ASSET
TENANT_PRIVATE
USER_PRIVATE
INTERNAL
TEMPORARY
```

Public delivery may use a CDN. Private objects require controlled access.

## 13. Metadata Persistence

The relational database is the source of truth for object ownership, purpose, lifecycle, and authorization metadata.

The object provider is the source of truth for physical byte existence and provider-level metadata.

Reconciliation processes must detect divergence between the two.

## 14. Deletion

Deletion should be modeled as a workflow, not an untracked SDK call.

Preferred sequence:

```text
Application marks DELETE_PENDING
  -> asynchronous deletion executes
  -> provider confirms absence
  -> metadata becomes DELETED
```

Hard deletion may be delayed for recovery, audit, or compliance requirements.

## 15. Orphan Management

The system must detect:

- uploaded bytes without metadata;
- metadata pointing to missing objects;
- expired pending uploads;
- failed deletions;
- stale temporary assets.

A scheduled reconciliation job should report and safely clean eligible orphans.

## 16. Versioning

Mutable logical assets should create new object versions rather than overwrite existing bytes where auditability matters.

Examples:

- generated reports;
- curriculum packages;
- learner submissions;
- published world assets.

The application decides which version is active.

## 17. Provider Isolation

Provider adapters may target services such as S3-compatible storage, cloud object stores, or local development storage.

Provider-specific details must remain inside Infrastructure:

- SDK clients;
- bucket configuration;
- multipart uploads;
- provider error mapping;
- signed request generation;
- retention rules.

## 18. Failure Handling

Storage failures must be mapped to stable infrastructure or application errors such as:

```text
STORAGE_UNAVAILABLE
UPLOAD_SESSION_EXPIRED
OBJECT_NOT_FOUND
OBJECT_INTEGRITY_FAILED
OBJECT_ACCESS_DENIED
OBJECT_DELETE_FAILED
```

Raw provider exceptions must not leak across the infrastructure boundary.

## 19. Observability

Record metrics and logs for:

- upload session creation;
- upload completion rate;
- verification failures;
- object size distribution;
- download access issuance;
- storage latency;
- delete backlog;
- orphan count;
- provider errors;
- estimated storage and transfer cost.

Logs must not expose signed URLs or secret credentials.

## 20. Local Development

Local development may use a filesystem adapter or S3-compatible container, provided the same application port is preserved.

Development shortcuts must not introduce production-only assumptions into application code.

## 21. Testing

Required tests include:

- port contract tests;
- provider adapter tests;
- signed-access constraint tests;
- authorization tests;
- lifecycle transition tests;
- integrity verification tests;
- deletion and orphan reconciliation tests;
- failure mapping tests.

## 22. Anti-Patterns

Do not:

- store large binary data directly in relational tables without explicit justification;
- expose permanent object URLs for private content;
- let controllers call provider SDKs directly;
- trust filename extensions as media validation;
- use raw filenames as keys;
- assume upload success before verification;
- delete provider objects without durable state tracking;
- embed bucket names throughout the codebase.

## 23. Completion Criteria

File and object storage infrastructure is complete when:

- application ports are defined;
- provider adapters are isolated;
- metadata and lifecycle are durable;
- authorization precedes access issuance;
- integrity controls are enforced;
- deletion and reconciliation are reliable;
- failures are mapped consistently;
- observability and contract tests exist.
