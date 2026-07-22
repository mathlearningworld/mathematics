# Builders Valley Runtime Ownership Standard

## Status

Authoritative foundation contract for runtime ownership in Builders Valley.

## Purpose

This document defines who owns each runtime domain and how authority flows from the Production Bible into implementation.

Builders Valley uses explicit ownership to prevent duplicate authority, conflicting mutation, hidden coupling, and visual overdraw.

## Core Rule

> One runtime domain has one authoritative owner.

Other systems may read, request, or project state, but they must not independently redefine or mutate the same domain.

## Authority Flow

```text
Product Constitution
        ↓
Foundation Contracts
        ↓
Landmark Contract
        ↓
Runtime Owner
        ↓
Rendered / Interactive Projection
        ↓
Verification Evidence
```

Runtime implements approved contracts. Runtime does not invent product policy, world layout, camera language, gameplay purpose, or acceptance criteria.

## Runtime Domains

### World Authority

Owns:

- active world identity
- world lifecycle
- root world assembly
- global coordinate frame
- landmark registration
- global runtime readiness

Must not:

- redefine landmark gameplay
- create parallel terrain or camera authority
- hide failed initialization behind fallback visuals

### Terrain Authority

Owns:

- primary terrain mass
- terrain cuts and traversable routes
- cliff and boundary geometry
- terrain collision source
- approved terrain material assignment

Must not:

- allow multiple systems to generate overlapping primary terrain
- use decorative props to replace missing terrain form
- mutate the camera to compensate for weak terrain composition

### Camera Authority

Owns:

- active gameplay camera
- framing policy
- follow and transition behavior
- camera constraints
- approved hero-frame configuration

Must not:

- accept uncontrolled writes from landmarks or decorative runtimes
- patch composition failures with arbitrary zoom or offset changes
- create multiple active primary cameras

### Lighting Authority

Owns:

- global light direction
- ambient and environment lighting
- fog, exposure, and global post-processing
- approved landmark-local lighting boundaries

Must not:

- permit landmark lighting to override global readability
- use lighting to conceal geometry or composition defects
- create duplicate environment-light owners

### Material Authority

Owns:

- shared material families
- canonical material configuration
- runtime material registration
- approved variation rules

Must not:

- permit uncontrolled local copies of shared materials
- use texture detail to replace structural form
- encode critical state using color alone

### Landmark Authority

Each landmark owns its own workflow-bound runtime implementation, including:

- landmark-local composition
- landmark gameplay interactions
- landmark-local props and storytelling
- landmark-local state
- landmark acceptance mapping

A landmark must not own:

- global camera policy
- global terrain authority
- global lighting authority
- unrelated landmark behavior

### Interaction Authority

Owns:

- interaction eligibility
- active target resolution
- input-to-action translation
- interaction state transitions
- feedback events

Must not:

- bypass landmark contracts
- mutate terrain, camera, or world state directly without an approved command boundary
- duplicate the same interaction lifecycle in multiple modules

### Persistence Authority

Owns:

- save and load boundaries
- durable world and player state
- version compatibility
- recovery behavior
- persistence error reporting

Must not:

- persist visual projections as authoritative domain state
- silently discard incompatible state
- infer successful recovery without verified runtime evidence

## Ownership Contract

Every runtime domain must declare:

```text
Domain
Authoritative Owner
Inputs
Outputs
Allowed Readers
Allowed Commands
Forbidden Mutations
Failure Behavior
Verification Evidence
```

## Read, Request, Mutate

Ownership distinguishes three permissions:

### Read

A system may observe authoritative state.

### Request

A system may submit an intent or command to the owner.

### Mutate

Only the authoritative owner may directly change authoritative state.

Reading state does not grant mutation authority.

## No Shared Mutation

Two modules must never directly mutate the same authoritative runtime state.

When two domains must coordinate, use:

```text
Requester
    ↓ command / intent
Authoritative Owner
    ↓ transition
Published Result / Projection
```

## Module UI and Runtime Ownership

Workflow-bound UI and runtime behavior remain inside the owning module.

Shared components are appropriate only for neutral primitives that:

- contain no landmark workflow policy
- contain no domain transition authority
- do not increase coupling
- can be replaced without changing product behavior

## Failure Policy

Ownership failures must be explicit.

Examples:

- missing owner
- duplicate owner
- initialization order violation
- rejected command
- stale projection
- unavailable dependency

A fallback may preserve operability, but it must not pretend that authoritative initialization succeeded.

## Runtime Readiness Gate

Runtime ownership is ready only when:

- every active domain has one declared owner
- dependencies and initialization order are documented
- forbidden mutations are identified
- failure behavior is observable
- verification evidence is defined
- no parallel primary renderer or authority remains active

## Acceptance Checklist

- [ ] One authoritative World owner exists.
- [ ] One authoritative Terrain owner exists.
- [ ] One authoritative Camera owner exists.
- [ ] One authoritative Lighting owner exists.
- [ ] Shared materials have one registration authority.
- [ ] Each landmark owns only its local workflow and presentation.
- [ ] Interaction commands pass through an explicit owner.
- [ ] Persistence is separate from visual projection.
- [ ] Duplicate mutation paths are removed or blocked.
- [ ] Failure states are visible and testable.

## Non-Goals

This document does not choose specific frameworks, class names, stores, scene libraries, or rendering engines.

Those implementation details may evolve while the ownership contract remains stable.
