# Builders Valley Material Standard

## Status

Foundation Contract — Active

## Purpose

Materials communicate structure, use, age, safety, and environmental meaning. They must make the world easier to understand, not merely more detailed.

## Core Principle

**Material follows world function.**

A material is valid only when it supports the purpose, construction, climate, wear, and gameplay role of the object or terrain using it.

## Material Families

Builders Valley uses controlled material families rather than isolated one-off surfaces.

Each family must define:

- purpose;
- visual weight;
- roughness and reflectance range;
- scale and texture density;
- approved contexts;
- prohibited contexts;
- runtime owner or asset authority.

Canonical families include:

- Terrain Soil;
- Terrain Grass;
- Terrain Rock;
- Water;
- Structural Stone;
- Structural Wood;
- Crafted Metal;
- Workshop Surface;
- Learning Artifact;
- Path and Route Surface.

## Terrain Materials

Terrain materials must preserve large terrain masses and route readability.

They must not:

- fragment the ground into noisy patches;
- use texture detail to imitate missing terrain form;
- make walkable and non-walkable areas indistinguishable;
- change scale arbitrarily between adjacent zones;
- create visible grid repetition in canonical views.

## Structural Materials

Buildings, bridges, gates, and constructed landmarks must communicate how they are built.

Material transitions should correspond to believable construction boundaries such as:

- foundation to wall;
- support to deck;
- frame to roof;
- repaired section to original section;
- natural terrain to crafted intervention.

A decorative material boundary without structural meaning is discouraged.

## Gameplay Semantics

Where possible, material language should reinforce gameplay meaning.

Examples:

- stable path surfaces read differently from loose terrain;
- interactable learning artifacts remain distinct from background props;
- safe areas use calmer, coherent material groups;
- dangerous or inaccessible terrain communicates resistance through form and surface together.

Material alone must not carry critical gameplay state when shape, animation, or interaction feedback is also required.

## Texture Density and Scale

All materials must use a consistent world-scale reference.

Forbidden patterns:

- oversized grain on small objects;
- tiny high-frequency detail on large terrain masses;
- adjacent materials with visibly unrelated texel density;
- texture scale changed solely to hide repetition;
- detail maps that overpower silhouette and form.

## Variation Policy

Variation is allowed to prevent repetition, but must remain inside the material family.

Approved variation may include:

- subtle hue or value shift;
- controlled roughness variation;
- edge wear at meaningful contact points;
- moisture, dirt, or age linked to environment;
- sparse macro variation across large terrain.

Random variation without environmental cause is not accepted.

## Material Layering

Material layering follows this order:

1. base construction or geological material;
2. environmental exposure;
3. use and wear;
4. local storytelling detail.

Later layers must never erase the readability of earlier layers.

## Runtime Ownership

There must be one authoritative material definition for each shared material family.

Landmark modules may configure approved parameters or local instances, but must not create near-duplicate global materials that diverge silently.

Runtime-generated terrain blending must reference the approved terrain material contract.

## Asset Acceptance

A material asset is ready when:

- its family and purpose are declared;
- scale is verified against the world reference;
- approved and forbidden usages are documented;
- it behaves correctly under canonical lighting;
- it preserves silhouette and gameplay readability;
- its ownership and reuse boundary are clear.

## Verification

Materials pass when:

- surfaces communicate what they are and how they are used;
- walkable routes remain clear;
- terrain mass reads before texture detail;
- adjacent assets share consistent scale and response to light;
- variation feels environmental rather than random;
- no duplicate material authority has been introduced.

## Failure Conditions

Materials fail when:

- detail replaces form;
- visual noise weakens the Hero Frame;
- surface meaning conflicts with gameplay meaning;
- texture scale exposes asset inconsistency;
- a landmark depends on a private copy of a shared material without justification.
