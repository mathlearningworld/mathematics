# Builders Valley — Bridge Theme v1

**Status:** Active Vertical Slice
**Authority:** Math Learning World Art Bible v1
**Runtime target:** Builders Valley World Composition
**Goal:** Complete one landmark to production-quality visual coherence before expanding random assets

---

## 1. Landmark Purpose

The bridge is the first complete visual landmark of Builders Valley.

It must communicate:

- crossing and connection
- craft and repair
- safety with visible age
- movement between two meaningful areas
- a world made by people, not generated from isolated props

The player should recognize it as a specific place, not merely a generic bridge sprite.

---

## 2. Theme Identity

### Emotional tone

- dependable
- hand-built
- frequently repaired
- warm against cool water
- inviting rather than monumental

### Material mix

- primary: wood
- structural: wood + small forged metal fasteners
- environmental: stone, soil, moss, grass
- accent: lantern gold
- effect: cool blue water shadow and highlights

### Visual contrast

The bridge should be warmer, denser, and more structured than the surrounding river and grass.

---

## 3. Required Bridge Kit

### Structure

- deck plank variants A/B/C
- rear rail
- front rail
- support posts
- support beam
- bridge end caps
- bank connection pieces

### Story variants

- older plank
- replacement plank
- rope repair
- nail/metal reinforcement
- moss patch
- worn walking line
- small repair materials near one entrance

### Environment

- bridge water shadow
- local water sparkle
- bank stones
- grass transition
- flowers used sparingly
- mud/soil transition
- small debris

### Lighting

- contact shadow under posts
- long bridge shadow on water
- upper-left highlights on rails and deck
- restrained lantern glow

---

## 4. Layer Contract

The bridge runtime presentation must support:

```text
WATER_BACKGROUND
WATER_SHADOW
BANK_GROUND
BRIDGE_SUPPORTS
BRIDGE_DECK
PLAYER_AND_WORLD_OBJECTS
REAR_RAIL_OR_SIDE_STRUCTURE
FRONT_RAIL
FOREGROUND_GRASS
WATER_SPARKLE_AND_LIGHT
```

The player must never be fully hidden by a single bridge sprite. Any element that needs to overlap the player must be isolated into a dedicated layer.

---

## 5. Composition Contract

### Primary form

The deck is the main readable shape. It must clearly span the river.

### Secondary forms

- paired entrance posts
- restrained rails
- lanterns or markers
- support structure

### Ground transition

- west and east approach paths
- irregular bank stones
- grass intrusion
- no hard cliff wall blocking the walking line

### Story cluster

Only one side should carry the strongest repair story, preventing mirrored artificial symmetry.

Suggested story cluster:

- replacement planks
- rope or metal repair
- wood pile or tool bucket
- small muddy working patch

### Breathing space

Do not surround the bridge with equal-density props on all sides. Preserve clear movement and visual focus.

---

## 6. Symmetry Rules

The structure may be approximately symmetrical for stability, but detail must be asymmetrical.

Allowed symmetry:

- deck span
- primary supports
- main entrance alignment

Required asymmetry:

- wear
- repair
- moss
- vegetation
- debris
- lantern condition
- bank stone arrangement

---

## 7. Scale Rules

The bridge must include:

- large: full span and rail silhouette
- medium: posts, lanterns, bank stones
- small: nails, rope, moss, replacement planks
- micro: selective sparkle, grass tips, debris

Micro-detail must remain subordinate to the walking path.

---

## 8. Color Rules

### Wood

Use at least three values:

- dark structural wood
- mid deck wood
- lighter replacement or highlighted wood

### Water relationship

The bridge shadow should cool and darken the water without becoming opaque. Sparkle must not appear through the darkest shadow center.

### Accent

Gold lantern light may identify the entrances, but it must not compete with selected-hotbar gold in the HUD.

---

## 9. Runtime Readability Requirements

The player must understand:

- where the walkable path is
- where the bridge begins and ends
- which elements are decorative
- that the river continues below
- that the bridge has depth and support

The bridge must remain readable when:

- the player stands at either entrance
- the player stands near the center
- the hotbar is visible
- nearby resource targets are selected

---

## 10. Bridge Theme Completion Checklist

### Structure

- [ ] Deck uses true plank material rather than dirt-path substitution
- [ ] Supports visually meet the banks or water
- [ ] Rails read as side protection, not a blocking wall
- [ ] End caps resolve the transition into land

### Story

- [ ] At least one repair area exists
- [ ] Old/new material contrast is visible
- [ ] One localized maintenance prop cluster exists
- [ ] Wear follows the walking direction

### Environment

- [ ] Bank transition is irregular
- [ ] Vegetation frames but does not block entry
- [ ] Shadow aligns with light direction
- [ ] Water highlights respond to bridge presence

### Depth

- [ ] Player overlap is natural
- [ ] Foreground rail only covers lower body when appropriate
- [ ] Supports and water shadow sit behind the deck
- [ ] Foreground vegetation is restrained

### Evidence

- [ ] Screenshot from west approach
- [ ] Screenshot from east approach
- [ ] Screenshot with player on center span
- [ ] Screenshot showing HUD and bridge together
- [ ] No gameplay regression in collect/place/recollect loop

---

## 11. Non-Goals

Bridge Theme v1 does not include:

- bridge construction gameplay
- bridge physics
- learning missions
- fraction or measurement overlays
- NPC behavior
- collision redesign
- water simulation rewrite
- final lighting system

Those systems may use this landmark later but must not be embedded prematurely.

---

## 12. Next Production Slice

### Bridge Theme v1A — Structural Art Completion

Produce or refine:

1. deck plank variants
2. support beam and post alignment
3. bank end caps
4. narrow rails
5. water shadow alignment

### Bridge Theme v1B — Story and Wear

Produce or refine:

1. replacement plank
2. rope/metal repair
3. moss and wear
4. repair prop cluster
5. asymmetric bank detail

### Bridge Theme v1C — Runtime Composition Lock

Integrate approved assets, capture evidence, verify gameplay remains unchanged, and declare:

```text
BUILDERS_VALLEY_BRIDGE_THEME_V1_LOCKED
```

Only after this lock should Workshop Theme v1 become the next complete landmark slice.
