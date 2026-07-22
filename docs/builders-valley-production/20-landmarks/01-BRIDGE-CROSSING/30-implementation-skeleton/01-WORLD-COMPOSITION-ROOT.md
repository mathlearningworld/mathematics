# Bridge Crossing Implementation Skeleton — World Composition Root

## Purpose

This document defines the single composition boundary that will assemble Builders Valley runtime authorities and Bridge Crossing without mixing their ownership.

## Composition Root

Proposed entry point:

```text
src/builders-valley/world/world-composition-root.ts
```

The composition root is responsible for wiring concrete implementations to runtime ports and registering landmarks. It is not a domain service and must not contain Bridge Crossing transition logic.

## Required Inputs

The composition root receives or creates exactly one implementation for each global authority:

- terrain authority
- camera authority
- persistence authority
- player observation authority
- lighting authority
- material authority
- landmark registry

## Bridge Crossing Assembly

```text
Global Authorities
      ↓
Runtime Port Adapters
      ↓
Bridge Crossing State Machine
      ↓
Bridge Crossing Controller
      ↓
Registration + Projection + Completion Verifier
      ↓
Landmark Registry
```

## Composition Responsibilities

1. Construct the Bridge Crossing state authority once.
2. Inject required global ports into the controller and verifier.
3. Register one Bridge Crossing descriptor with the landmark registry.
4. Expose a world runtime facade for application startup.
5. Ensure reload can reconstruct meaningful landmark state from persistence.
6. Refuse startup when a required authority is missing.

## Forbidden Responsibilities

The composition root must not:

- decide valid landmark transitions
- render landmark UI
- mutate terrain directly for gameplay convenience
- duplicate camera or persistence authority
- contain conditional gameplay rules unique to Bridge Crossing
- silently substitute an in-memory adapter in production

## Startup Contract

Startup succeeds only when:

- every mandatory global port is bound
- Bridge Crossing registration is unique
- initial or rehydrated state is valid
- activation and destination boundaries are available
- verification hooks are registered

Startup fails explicitly when any invariant is violated.

## Runtime Facade

The composition root should expose an equivalent of:

```ts
interface BuildersValleyRuntime {
  start(): Promise<void>;
  stop(): Promise<void>;
  getLandmarkRegistry(): LandmarkRegistryReadPort;
}
```

Exact framework syntax may differ, but lifecycle and read boundaries must remain explicit.

## Evidence Required

Implementation evidence must identify:

- actual composition-root path
- concrete port bindings
- registration call
- startup failure behavior
- test proving duplicate registration is rejected
- test proving missing mandatory authority blocks startup
