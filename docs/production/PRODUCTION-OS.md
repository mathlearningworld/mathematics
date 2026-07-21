# Math Learning World — Production OS

**Status:** ACTIVE  
**Repository authority:** `main`  
**Purpose:** Convert approved product and world intent into small, executable, reviewable production slices.

## 1. Authority chain

```text
Product Blueprint
→ Game and World Vision
→ World Experience Blueprint (WEB)
→ Production Composition Pack (PCP)
→ Vertical Slice Contract (VSC)
→ Production Environment Slice (PES)
→ Runtime Evidence
→ Creative Approval
→ Milestone Tag
```

Lower levels may refine implementation details but must not silently contradict higher authority.

## 2. Operating model

The Production OS uses a runtime-first iteration loop:

```text
Architect defines authority and executable slice
→ implementation is committed to main in small commits
→ Human runs the local runtime
→ screenshots, console output and interaction evidence are returned
→ Architect reviews evidence
→ targeted patch is committed
→ repeat until the slice passes
```

Repository completion and runtime completion are separate states.

## 3. Standard package types

- **WEB** — player journey, world rhythm, landmark sequence and emotional intent.
- **PCP** — camera, focal hierarchy, composition, spatial masses, lighting intent and visual constraints.
- **VSC** — exact vertical-slice boundary, gameplay proof and completion criteria.
- **PES** — executable environment work package with ownership, non-goals and evidence gates.

## 4. Gate model

### Repository Gate

Checks scope isolation, module ownership, imports, contracts, public inspection metadata and repository consistency.

### Runtime Gate

Checks application start, console state, rendering, pointer alignment, interaction continuity and performance.

### Composition Gate

Checks focal hierarchy, paths, silhouettes, negative space, landmark readability and authored rhythm.

### Gameplay Gate

Checks that art work preserves player movement and the gather → carry → place loop unless a separate gameplay contract changes it.

### Creative Director Gate

Requires approved in-engine frames and explicit acceptance of intentional deviations.

## 5. Branch and commit policy

- `main` is the single long-lived development branch and Source of Truth.
- Use small commits with one production meaning each.
- Push frequently.
- Use milestone tags after verified runtime approval.
- Temporary branches are exceptional; merge, verify `HEAD = origin/main`, then delete immediately.

## 6. Module ownership rule

A production package owns its own workflow-bound implementation. Shared modules are allowed only for neutral primitives that do not transfer domain ownership or introduce hidden coupling.

For Builders Valley:

```text
BuildersValleyScene.js                 gameplay and world authority
BuildersValleyHeroSlicePatch.js        temporary hero landmark blockout
BuildersValleyCompositionPatch.js      camera and composition authority
BuildersValleyTerrainRiverPatch.js     PES-001B terrain and river owner
terrain/*                              internal PES-001B rendering modules
```

## 7. Completion language

Use these states precisely:

```text
CONTRACT READY
IMPLEMENTATION STARTED
REPOSITORY PASS
RUNTIME PASS
COMPOSITION PASS
GAMEPLAY PASS
CREATIVE APPROVED
COMPLETE
```

A committed implementation without local evidence is never declared complete.
