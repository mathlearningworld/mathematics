# Math Learning World — Production Authority

**Status:** ACTIVE  
**Production branch:** `production/builders-valley-vsc-001`  
**First production target:** Builders Valley Vertical Slice 001

## Purpose

This directory is the production authority for turning the approved Math Learning World vision into a playable, reviewable, production-quality game slice.

The existing product blueprint remains the authority for product purpose, learning philosophy, and long-term platform direction. The artifacts in this directory govern production composition, vertical-slice scope, visual quality, gameplay proof, and implementation sequencing.

## Authority hierarchy

```text
Product Blueprint
    ↓
Game / World Vision Authority
    ↓
World Experience Blueprint (WEB)
    ↓
Production Composition Pack (PCP)
    ↓
Vertical Slice Contract (VSC)
    ↓
Production Environment Slices (PES)
    ↓
Runtime implementation and evidence
```

Lower-level artifacts may refine implementation details but must not silently contradict higher-level authority.

## Active production doctrine

### Composition first

The repository must not improve the environment by accumulating unrelated assets. Camera, focal hierarchy, spatial rhythm, player journey, terrain masses, landmark placement, lighting intent, and gameplay readability are decided before detailed environment production.

### Gameplay remains authoritative

Art exists to strengthen the world experience and make player intention readable. Production work must preserve the existing gather → carry → place loop unless a separately approved gameplay contract changes it.

### One approved slice before world expansion

Builders Valley is the Gold Standard slice. New landmarks and regions must not be expanded into production simultaneously until this slice proves the complete pipeline.

### Evidence over declaration

A production work package is not complete because code or assets exist. Completion requires an approved in-engine frame plus gameplay, composition, art, technical, and performance evidence appropriate to the package.

## Active artifact set

- `builders-valley/VSC-001-Builders-Valley.md` — vertical-slice contract
- `builders-valley/PCP-001-Composition-Authority.md` — composition and camera authority
- Future PES artifacts will define executable environment work packages.

## Immediate production sequence

```text
PES-001A  Camera + painted target frame
PES-001B  Terrain and river foundation
PES-001C  Bridge landmark production
PES-001D  Workshop production cluster
PES-001E  Vegetation, lighting, atmosphere
PES-001F  Gameplay integration and polish
```

Only `PES-001A` is active at production start. Later packages remain planned until the previous package passes its review gate.
