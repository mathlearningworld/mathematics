# VSC-001 — Builders Valley Vertical Slice Contract

**Status:** APPROVED FOR PRODUCTION  
**Version:** 1.0  
**Owner:** Game Direction / Creative Technical Direction  
**Reference world:** Builders Valley — Bridge Crossing starting area

## 1. Slice goal

Builders Valley must prove that Math Learning World can feel like a real game world in which exploration, gathering, construction, visual reasoning, and learning are one coherent experience.

The slice is not a decorative demo. It must prove a production pipeline that can be reused for later landmarks without redesigning camera, composition, environment language, interaction readability, or review gates.

## 2. Player promise

Within the slice, the player should feel:

1. invited into a believable, warm, handcrafted valley;
2. curious about the bridge, river, waterfall, and workshop;
3. able to understand gathering and placement with minimal instruction;
4. that rebuilding changes the world rather than merely completing a UI task;
5. motivated to continue toward the forest and later landmarks.

## 3. Core proof

The slice must demonstrate this complete loop:

```text
Observe the world
→ identify a useful object or resource
→ approach and gather it
→ carry it with clear intent
→ place or rebuild with clear preview
→ receive world-based feedback
→ see a meaningful environmental change
```

The approved existing gather/carry/place runtime is preserved during the environment production passes unless an explicit gameplay change is approved separately.

## 4. In scope

- One production-quality starting-area composition.
- Locked gameplay camera and target frame.
- River, waterfall, bridge, workshop cluster, terrain masses, cliffs, and vegetation supporting one hero composition.
- Existing gather, carry, placement, retargeting, and contextual tool behavior integrated into the final scene.
- Production-consistent scale, palette, shape language, lighting intent, depth layering, and interaction readability.
- One complete before/after world change meaningful to the bridge-crossing experience.
- Screenshot and runtime evidence for each production gate.

## 5. Out of scope

- Producing all eight world landmarks.
- Expanding curriculum, mission, economy, social, parent, teacher, or mentor systems.
- Rewriting the existing interaction architecture.
- Building a generalized procedural world generator.
- Adding large volumes of props before composition approval.
- Treating post-processing as a substitute for terrain, value, scale, or composition quality.

## 6. Hero composition contract

The approved first-look hierarchy is:

```text
Primary:   bridge crossing and rebuild purpose
Secondary: river and waterfall leading line
Tertiary:  workshop as the human anchor
Support:   cliffs, forest framing, vegetation, props
Actor:     player readable without becoming the largest focal point
```

The frame must remain readable with UI hidden, effects reduced, and the image viewed at 50% scale.

## 7. Art contract

The slice uses a warm, inviting, layered pixel-painted environment language.

Required:

- natural variation rather than visible repeated tiling;
- worn, used, handcrafted materials;
- clear foreground, gameplay plane, midground, and background separation;
- coherent player-to-tile-to-prop-to-building scale;
- warm key light and cooler environmental fill;
- controlled accents reserved for interaction, reward, light, and special meaning;
- silhouettes that remain readable during movement and interaction.

Forbidden:

- unrelated asset styles mixed in the same hero frame;
- oversized landmarks that destroy gameplay scale;
- uniformly scattered vegetation;
- screen overlays used to hide weak composition;
- detail density that competes with interaction targets.

## 8. Technical contract

- Current runtime architecture remains modular and authoritative for interaction behavior.
- Production composition must be implemented without coupling the environment slice to unrelated learning or backend modules.
- Sorting, collision, placement cells, and interaction targets must remain deterministic.
- Camera behavior must not cause target instability or placement ambiguity.
- Runtime verification belongs to local execution; repository review must not claim runtime or operational completion without evidence.
- Performance target: stable play at the project's intended desktop baseline, with no obvious frame degradation caused by the hero environment.

## 9. Production gates

### Gate 1 — Gameplay

The gather → carry → place loop works through the production scene without regression.

### Gate 2 — Composition

The primary focal point, leading lines, negative space, world depth, and player journey are readable in the in-engine frame.

### Gate 3 — Art direction

Scale, palette, material language, terrain transitions, vegetation grammar, and landmark identity are coherent.

### Gate 4 — Technical

Layering, collision, interaction targeting, placement authority, camera behavior, and performance evidence pass.

### Gate 5 — Polish

Animation, water motion, environmental response, light, particles, audio, and feedback strengthen the established composition without masking structural weaknesses.

## 10. Definition of done

VSC-001 is complete only when:

- PES-001A through PES-001F have passed their individual gates;
- one approved in-engine hero screenshot represents the intended slice quality;
- the core loop has local runtime evidence;
- the scene remains strong without UI and excessive effects;
- the bridge area feels like one authored production environment rather than a prototype assembled from separate objects;
- the resulting rules and kits can be reused as the production reference for the next Builders Valley landmark.
