# Math Learning World — Art Bible v1

**Status:** Foundation
**Scope:** Builders Valley and future world regions
**Role:** Source of Truth for visual identity, pixel-art production, world composition, lighting, materials, and asset review

---

## 1. Product Art Mission

Math Learning World must feel like a living place for exploration, construction, discovery, and reflection. The world is not decoration around lessons. The world itself carries meaning.

The visual system must support these product principles:

- World before interface
- Experience before label
- Intent before input
- Visual consequence before textual explanation
- Discovery before symbolic reveal
- One coherent world, many mathematical ideas

The target is not generic educational software and not a direct copy of another game. The target is a warm, crafted, intelligent world with a distinct identity.

---

## 2. Core Visual Identity

### Emotional qualities

- Warm
- Crafted
- Ancient but functional
- Curious
- Safe for experimentation
- Intelligent without feeling academic
- Playful without becoming childish

### Style statement

> High-detail crafted pixel world with modern readability, strong material identity, authored landmarks, and restrained luminous accents.

### Priority order

1. Gameplay readability
2. World identity
3. Material clarity
4. Spatial depth
5. Atmosphere
6. Decorative richness

Decoration must never reduce interaction clarity.

---

## 3. Projection and Pixel Rules

- Projection: orthographic three-quarter top-down
- Base grid: rectangular
- Base tile: 32 × 32
- Character frame target: 32 × 48
- Texture filter: nearest-neighbor
- Primary light direction: upper-left
- Silhouettes must remain readable at gameplay scale
- Small detail must support material identity, not create noise
- No anti-aliased edges inside gameplay sprites unless explicitly approved
- Asset scale must be consistent with the player and world grid

### Pixel density rule

Each asset requires three readable levels:

1. silhouette
2. major material planes
3. selective detail

If level 1 fails, level 3 must not be added.

---

## 4. Material Language

### Wood

- Warm mid-brown body
- Dark structural outline
- Light edge only on upper-left surfaces
- Visible plank direction
- Selective knots, joints, nails, repairs
- Old and new wood must be distinguishable

### Stone

- Cool gray base
- Irregular planes
- Minimal repeated cracks
- Moss only where moisture or age makes sense
- Structural stone must feel heavier than decorative debris

### Metal

- Dark forged base
- Small bright edge highlights
- Used for tools, fasteners, reinforcement, and system UI frames
- Avoid excessive shine

### Soil

- Irregular edge
- Multiple value patches
- Grass intrusion along borders
- Usage marks near workshop and paths
- Never read as a perfect rectangle unless it is intentionally built flooring

### Water

- Clear directional flow
- Layered highlights
- Local foam or sparkle only around disturbance
- Shadows and reflections must respect nearby structures

### Vegetation

- Use clustered rhythm, not uniform scatter
- Separate large, medium, and small forms
- Foreground vegetation may overlap feet or lower props slightly
- Interaction targets must remain readable

---

## 5. Color and Lighting

### Palette behavior

- World colors remain moderately saturated
- UI gold is reserved for focus, selection, discovery, and meaningful reward
- Blue supports water, observation, information, and calm guidance
- Green supports growth, stability, and valid states
- Red indicates danger or invalid world state, never learner shame

### Lighting contract

- Main light comes from upper-left
- Contact shadows sit lower-right
- Large objects require consistent ground contact
- Landmark shadows must help explain volume
- Glow is rare and semantic
- Ambient lighting must not flatten material contrast

---

## 6. Depth Architecture

Every authored scene should use these layers:

1. Background terrain
2. Ground transitions
3. Ground details
4. Landmark base/deck
5. Player and gameplay objects
6. Midground props
7. Foreground overlap
8. Effects and atmosphere
9. HUD

A landmark should not be rendered as one flat sprite when depth relationships matter. Split the asset into layers when player overlap, water shadow, railing, canopy, or foreground vegetation requires it.

---

## 7. World Composition Grammar

### Landmark hierarchy

Every landmark must contain:

1. Primary form
2. Supporting props
3. Ground transition
4. Environmental framing
5. Story detail
6. Lighting or shadow response

### Density rhythm

Use alternating visual density:

- dense landmark
- breathing space
- small secondary cluster
- open navigation area

Do not fill every empty space. Empty space must support movement, anticipation, or visual framing.

### Scale rhythm

Each composition should include:

- large anchor
- medium support
- small detail
- micro-noise used sparingly

### Repetition rule

Repeated assets require at least two differences among:

- scale
- flip
- angle
- value
- surrounding cluster
- wear state
- elevation or depth

---

## 8. Landmark Completion Model

A landmark is complete only when it satisfies all six dimensions:

### Identity

The landmark is recognizable as belonging to Math Learning World.

### Function

The player understands where to move, stand, interact, or build.

### Structure

The object has believable support, material, and depth.

### Context

The surrounding ground and props explain why it exists there.

### Story

Wear, repair, storage, tools, growth, or residue imply previous use.

### Atmosphere

Light, shadow, water, vegetation, and sound support the mood.

---

## 9. Theme Packs

World production must proceed by complete themes rather than random assets.

Initial themes:

- Bridge Theme
- Workshop Theme
- Forest Theme
- Village Theme
- Mine Theme
- Research / Discovery Theme

Each theme must define:

- palette behavior
- material mix
- landmark kit
- supporting props
- ground transitions
- foreground elements
- effects
- wear and story variants
- composition examples

---

## 10. Asset Pipeline

### Required files

Every asset pack must include:

- source image or sprite sheet
- manifest
- license/provenance record
- semantic asset IDs
- anchor information
- category
- review status
- intended layer

### Recommended folder structure

```text
frontend/assets/builders-valley/
  bridge/
  workshop/
  vegetation/
  water/
  environment/
  ui/

frontend/assets/manifests/
frontend/assets/licenses/

docs/art/
  Math-Learning-World-Art-Bible-v1.md
  Builders-Valley-Bridge-Theme-v1.md
  Builders-Valley-Workshop-Theme-v1.md
```

### Naming

```text
BV_<CATEGORY>_<OBJECT>_<VARIANT>
```

Examples:

```text
BV_BRIDGE_DECK_01
BV_BRIDGE_POST_REPAIRED_01
BV_WORKSHOP_WOOD_PILE_01
BV_WATER_SHADOW_BRIDGE_01
```

---

## 11. Art Review Gate

An asset or composition passes only when:

1. It reads correctly at gameplay scale
2. Its material is identifiable
3. Light direction is consistent
4. Anchor and depth are correct
5. It supports the landmark hierarchy
6. It does not obstruct gameplay information
7. It uses semantic IDs and provenance
8. It belongs to an approved theme
9. It has screenshot evidence in runtime
10. It does not require gameplay changes merely to look correct

---

## 12. Current Production Strategy

The active strategy is:

```text
Stable Gameplay
→ Complete One Landmark Theme
→ Lock Visual Standard
→ Reuse Standard Across Regions
→ Add Lighting and Atmosphere
→ Introduce Discovery Presentation
```

The current priority is **Bridge Landmark Vertical Slice**. Random asset expansion is paused until Bridge Theme v1 reaches visual completion.
