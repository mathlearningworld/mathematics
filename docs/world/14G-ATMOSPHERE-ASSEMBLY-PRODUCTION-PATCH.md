# 14G — Atmosphere Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014G
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 10 — Atmosphere Assembly
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 10 atmosphere-assembly workflow for Builder's Valley. It extends the level, water, vegetation, landmark, workshop, gameplay-readability, and lighting contracts established by MLW-DOC-014 through MLW-DOC-014F.

Atmosphere is the world-scale system that connects sky, air, weather, wind, fog, particles, ambient motion, environmental sound support, and time-of-day behavior into one coherent player experience.

Atmosphere is not decorative polish. It must preserve orientation, gameplay readability, emotional identity, performance stability, and environmental causality.

## 10 Atmosphere Assembly

### 10.1 Atmosphere Objective

Builder's Valley must feel alive, legible, and physically coherent without overwhelming the learner or obscuring gameplay.

The atmosphere system must:

- establish a clear emotional identity for Builder's Valley;
- reinforce terrain depth, water presence, vegetation movement, and landmark hierarchy;
- preserve route, interaction, hazard, and destination readability;
- support approved lighting and exposure contracts;
- remain calm enough for sustained learning sessions;
- provide environmental motion without visual noise;
- scale across supported runtime quality levels;
- avoid weather or effects that imply unsupported mechanics;
- remain deterministic enough for validation and evidence capture.

The approved baseline identity is:

```text
Warm Mountain Valley
+ Clear Workshop Destination
+ Gentle Moving Air
+ Localized Water Moisture
+ Light Craft Dust
+ Calm Educational Adventure
```

### 10.2 Authoritative Assembly Order

Atmosphere must be assembled in this order:

```text
Dependency Review
→ Atmosphere Intent Lock
→ Sky and Horizon Assembly
→ Air Perspective and Fog
→ Wind Authority
→ Vegetation and Cloth Response
→ Water Mist and Moisture
→ Dust, Steam, Smoke, and Local Particles
→ Cloud and Weather State
→ Ambient Motion
→ Environmental Audio Coupling
→ Time-of-Day Integration
→ Quality-Level and Performance Pass
→ Runtime Validation
→ Evidence Capture
→ Section Exit Gate
```

Later steps must not conceal unresolved failures from earlier steps.

### 10.3 Entry Contract

Phase 10 may begin only when:

- terrain silhouette and major elevation layers are stable;
- water surfaces, river flow, waterfall, and crossing logic are defined;
- vegetation families and placement authority are stable enough for wind validation;
- landmark silhouettes and approach viewpoints are approved;
- workshop exterior and interior openings are defined;
- gameplay-readability evidence exists for major journey points;
- lighting baseline, exposure, shadow, and time-of-day authority are established;
- representative runtime camera and movement behavior are available.

If any dependency changes materially, affected atmosphere evidence becomes stale.

### 10.4 Atmosphere Ownership Model

Atmosphere authority is divided into distinct owners.

| Owner | Responsibility | Must Not Own |
|---|---|---|
| Sky System | sky color, sun disk support, horizon gradient, cloud backdrop | local fog pockets or workshop smoke |
| Global Air System | distance haze, aerial perspective, world fog baseline | localized water mist |
| Weather State | cloud coverage, precipitation eligibility, wind range | arbitrary per-prop animation |
| Wind System | shared direction, strength bands, gust timing | unique motion authored independently on every asset |
| Water Atmosphere | waterfall mist, river humidity, spray | global valley fog |
| Workshop Atmosphere | craft dust, steam, smoke, warm interior air | valley-scale weather |
| Ambient Motion | leaves, motes, insects, banners, small loops | navigation-critical animation authority |
| Audio Support | wind, water, workshop ambience, weather support | visual-state ownership |

No system may silently override another system's authority.

### 10.5 Atmosphere Intent Lock

Before implementation, record the approved atmosphere intent.

Required fields:

| Field | Requirement |
|---|---|
| Atmosphere State ID | Stable identifier |
| Emotional Tone | Calm, curious, warm, adventurous |
| Visibility Target | Clear medium-distance navigation |
| Air Density | Light baseline haze |
| Wind Character | Gentle with occasional readable gusts |
| Moisture Character | Localized near water |
| Workshop Air | Warm, active, lightly dusty |
| Weather Permission | Clear and light-cloud baseline |
| Learning Comfort | No constant flashing, shaking, or heavy obstruction |
| Validation Time | Approved time-of-day preset |

The baseline state for Production Environment Slice 001A is:

```text
ATM-BV-CLEAR-WARM-01
```

### 10.6 Sky and Horizon Assembly

The sky must support world orientation rather than compete with the play space.

Sky requirements:

- the horizon gradient must separate terrain silhouettes from the sky;
- sky luminance must remain compatible with the approved exposure range;
- cloud shapes must not form false landmarks stronger than the workshop;
- sun position must agree with directional-light authority;
- sky color must preserve the approved warm, inviting identity;
- high-frequency cloud detail must not create flicker during camera motion;
- the sky must remain stable across supported viewport aspect ratios.

The horizon must:

- preserve distant terrain layer separation;
- avoid a hard visible seam;
- maintain believable atmospheric falloff;
- avoid excessive saturation behind navigation-critical silhouettes.

### 10.7 Air Perspective and Global Fog

Global fog exists to establish depth, not to hide incomplete geometry.

The global air system must:

- separate foreground, middle ground, and background;
- maintain visibility of the workshop and bridge at approved viewpoints;
- preserve water and terrain boundaries;
- avoid flattening all color values into one band;
- remain subordinate to gameplay-readability requirements;
- transition smoothly with distance and elevation.

Global fog must not:

- obscure the primary route;
- erase landmark silhouettes;
- conceal collision mismatches;
- create a false wall at the camera near plane;
- cause visible banding under normal movement;
- change abruptly between adjacent zones.

#### 10.7.1 Fog Density Bands

Use three approved density bands:

| Band | Use |
|---|---|
| FOG-LIGHT | Default clear-valley state |
| FOG-MEDIUM | Controlled scenic or weather state |
| FOG-HEAVY | Validation-only unless future gameplay explicitly authorizes it |

Production Slice 001A must ship with `FOG-LIGHT` as its default authority.

#### 10.7.2 Height Fog

Height fog may support low valley depth and water moisture, but it must:

- remain below critical elevated routes;
- preserve bridge deck readability;
- avoid filling the workshop interior unintentionally;
- transition naturally around slopes;
- remain stable when the camera changes elevation.

### 10.8 Wind Authority

Wind must be authored as a shared environmental system.

The wind state must define:

- dominant direction;
- baseline strength;
- gust strength;
- gust duration;
- gust interval range;
- vertical turbulence allowance;
- zone modifiers;
- quality-level behavior.

Approved baseline:

```text
Direction: valley-aligned
Baseline: gentle
Gusts: occasional, readable, non-disruptive
Vertical turbulence: low
```

Wind must remain consistent across:

- grass;
- shrubs;
- tree canopy;
- hanging cloth;
- banners;
- light particles;
- water spray where applicable;
- ambient audio support.

Objects in the same local area must not appear to receive contradictory wind directions without an explicit turbulence source.

### 10.9 Vegetation Motion Contract

Vegetation motion must communicate wind scale through hierarchy.

#### 10.9.1 Grass

Grass should:

- respond quickly to baseline wind;
- use small amplitude;
- avoid synchronized whole-field oscillation;
- preserve ground-path boundaries;
- reduce motion density near interaction targets.

#### 10.9.2 Shrubs

Shrubs should:

- move less rapidly than grass;
- preserve readable mass and silhouette;
- avoid clipping through nearby geometry;
- avoid constant high-amplitude shaking.

#### 10.9.3 Trees

Trees should use layered motion:

```text
Trunk: nearly stable
Primary branches: slow low-amplitude movement
Secondary branches: moderate response
Leaves: fastest local response
```

Tree motion must not:

- destabilize landmark framing;
- create camera-adjacent flashing;
- intersect workshop roofs or terrain visibly;
- imply storm conditions during the baseline state.

### 10.10 Cloth, Rope, and Hanging Object Motion

Cloth and hanging props must share wind authority while respecting physical attachment.

They require:

- visible anchor points;
- constrained motion range;
- believable settling behavior;
- no penetration through support geometry;
- no rapid oscillation that distracts from learning interactions;
- quality-level fallback behavior.

Navigation banners may support direction, but their motion must not become the sole navigation cue.

### 10.11 Water Mist and Moisture

Water atmosphere must remain localized to physical water sources.

Approved sources:

- waterfall impact;
- fast river sections;
- bridge-side spray where physically justified;
- wet rock contact zones;
- low morning moisture near the river.

Water mist must:

- emerge from a readable physical source;
- follow local wind direction;
- fade before obscuring major routes;
- avoid covering collectible or interaction states;
- avoid entering the workshop unless designed through an opening;
- use depth-aware behavior where supported;
- scale by quality level.

Water mist must not be used as a generic valley fog substitute.

### 10.12 Workshop Atmosphere

The workshop must have a distinct but connected atmosphere identity.

Approved workshop atmosphere elements include:

- warm floating dust in directional light;
- localized steam from approved craft equipment;
- light smoke only from explicit sources;
- subtle heat shimmer where justified;
- occasional small sparks from authorized stations;
- controlled ventilation movement near openings.

Workshop atmosphere must:

- preserve station and tool readability;
- keep interaction prompts unobstructed;
- avoid implying fire or danger when none exists;
- remain below comfort thresholds for repeated learning sessions;
- stop or change when its source is inactive where runtime state exists.

### 10.13 Dust, Pollen, Motes, and Small Particles

Small particles establish air presence but can easily become noise.

Use them according to zone purpose:

| Particle | Approved Zone | Purpose |
|---|---|---|
| Dust motes | Workshop light shafts | Warm interior air |
| Light pollen | Vegetation pockets | Seasonal life cue |
| Dry dust | Path or construction area | Movement and craft context |
| Water droplets | Waterfall and spray zone | Water energy |
| Tiny embers | Authorized craft station only | Active tool feedback |

Rules:

- particle density must decrease around UI-critical interactions;
- particles must not resemble collectibles;
- particles must not trigger false hazard interpretation;
- particles must avoid obvious camera-plane locking;
- particle lifetime and speed must fit the physical source;
- emitters must stop when their source is removed or disabled.

### 10.14 Cloud System

Clouds establish weather possibility and light variation.

The cloud system must define:

- coverage range;
- movement direction;
- movement speed;
- altitude layer;
- shadow participation;
- time-of-day response;
- weather-state compatibility.

Baseline cloud state:

```text
Coverage: light to moderate
Speed: slow
Contrast: soft
Shadow variation: subtle
Storm implication: none
```

Cloud motion must agree with high-altitude wind intent, even when local valley wind differs slightly due to terrain.

### 10.15 Weather-State Contract

Production Slice 001A supports a constrained weather system.

Approved states:

| State ID | Description | Shipping Authority |
|---|---|---|
| WEATHER-CLEAR | Clear warm valley | Default |
| WEATHER-LIGHT-CLOUD | Soft passing cloud coverage | Supported |
| WEATHER-LIGHT-MIST | Localized low moisture | Optional controlled state |
| WEATHER-RAIN | Rain | Not authorized for default slice |
| WEATHER-STORM | Storm | Prohibited |
| WEATHER-SNOW | Snow | Prohibited |

Unsupported weather states must not appear accidentally through random runtime selection.

Any future weather state requires:

- gameplay impact review;
- readability review;
- lighting revalidation;
- water and surface-response review;
- audio support;
- performance validation;
- evidence refresh.

### 10.16 Ambient Motion

Ambient motion should make the world feel active while preserving focus.

Approved ambient-motion families:

- distant birds;
- insects near vegetation or water;
- falling leaves in controlled pockets;
- workshop mechanisms;
- water-wheel or craft motion where supported;
- drifting cloud shadows;
- small hanging props;
- localized steam or smoke.

Ambient motion must use density hierarchy:

```text
Primary gameplay area: low distraction
Transition area: moderate environmental support
Scenic pocket: richer optional motion
Background: broad low-frequency motion
```

No major motion may pull attention away from a required interaction unless it is intentionally guiding the player.

### 10.17 Environmental Audio Coupling

Atmosphere and environmental audio must describe the same world state.

Required coupling examples:

- stronger visible wind supports stronger wind audio;
- waterfall mist corresponds to waterfall audio presence;
- workshop steam or machinery corresponds to authorized source sound;
- cloud or weather changes may adjust ambient beds gradually;
- enclosed workshop space must reduce exposed valley wind appropriately.

Audio must not claim:

- rain when no rain exists;
- dangerous machinery when the station is safe;
- strong wind when vegetation is nearly still;
- water nearby where no visible or geographically plausible source exists.

Atmosphere remains the visual authority; audio supports but does not replace it.

### 10.18 Time-of-Day Integration

Atmosphere must respond coherently to approved time-of-day presets.

For each preset, validate:

- sky gradient;
- fog color and density;
- cloud visibility;
- particle visibility;
- workshop dust and shafts;
- water mist readability;
- wind readability;
- landmark silhouette;
- route and interaction visibility.

Approved initial presets:

| Preset | Role |
|---|---|
| TOD-WARM-MORNING | Primary production and validation preset |
| TOD-CLEAR-DAY | Secondary readability preset |
| TOD-GOLDEN-LATE | Mood validation preset |

Night is not shipping authority for Slice 001A unless separately approved.

### 10.19 Camera and Screen-Space Safety

Atmosphere effects must be validated through the actual player camera.

Requirements:

- no persistent particles directly in front of the camera;
- no fog discontinuity during camera clipping or elevation changes;
- no full-screen flashes from cloud or exposure transitions;
- no rapid alpha sorting artifacts around vegetation;
- no particle density spikes when looking toward emitters;
- no motion pattern likely to cause discomfort;
- no atmospheric element may cover core HUD or prompt regions persistently.

Camera-adjacent effects must use conservative opacity and lifetime.

### 10.20 Color and Contrast Contract

Atmosphere may unify color but must not erase functional contrast.

The system must preserve distinction between:

- traversable and blocked surfaces;
- interactable and decorative objects;
- safe and hazardous zones;
- foreground and background;
- workshop destination and surrounding terrain;
- water edge and ground edge;
- active and inactive workshop stations.

Fog, color grading, sky contribution, and particles must be evaluated together.

### 10.21 Runtime Parameter Contract

Atmosphere runtime values must be centralized rather than scattered across arbitrary objects.

Required parameter groups:

```text
atmosphere.sky
atmosphere.fog
atmosphere.wind
atmosphere.clouds
atmosphere.weather
atmosphere.waterMist
atmosphere.workshopAir
atmosphere.ambientMotion
atmosphere.quality
```

Each group should expose only parameters required for approved runtime behavior.

At minimum, runtime state must support:

- active atmosphere preset;
- active weather state;
- wind direction and strength;
- fog density band;
- cloud coverage;
- local effect enablement;
- quality level;
- reduced-motion mode where supported.

Runtime changes must transition smoothly unless a deliberate scene reset occurs.

### 10.22 Reduced-Motion and Comfort Contract

Atmosphere must support comfortable sustained play.

Reduced-motion behavior should:

- reduce particle count;
- reduce gust frequency and amplitude;
- reduce cloth and vegetation motion amplitude;
- remove unnecessary camera-space particles;
- reduce fast ambient creatures or loops;
- preserve essential state and navigation cues.

Reduced motion must not remove information required to understand hazards or interactions.

### 10.23 Quality-Level Contract

Atmosphere quality tiers must preserve meaning while reducing cost.

| Tier | Required Behavior |
|---|---|
| High | Full approved cloud, fog, particles, mist, and motion |
| Medium | Reduced particle density, simplified shadows, preserved state identity |
| Low | Minimal particles, simplified fog and motion, preserved navigation and weather meaning |

Quality reduction must not:

- remove workshop destination visibility;
- remove all water-atmosphere cues;
- change weather-state meaning;
- create static vegetation next to strongly moving cloth;
- expose hard effect boundaries;
- produce unsupported color shifts.

### 10.24 Performance Budget

Atmosphere must fit the environment runtime budget.

Track at minimum:

- active particle-system count;
- visible particle count;
- overdraw hotspots;
- transparent material count;
- fog and volumetric cost;
- cloud cost;
- vegetation animation cost;
- dynamic shadow contribution;
- CPU update cost for ambient actors;
- memory for effect textures and meshes.

Performance optimization must follow this priority:

```text
Remove invisible work
→ Reduce emitter count
→ Reduce particle count
→ Reduce update frequency
→ Simplify materials
→ Reduce shadow participation
→ Replace local volumetrics with cheaper equivalents
→ Reduce effect distance
```

Do not solve performance by destroying atmosphere identity or gameplay readability.

### 10.25 Determinism and Validation Presets

Validation requires reproducible atmosphere states.

The environment must provide fixed validation presets for:

- clear warm morning;
- clear day;
- golden late day;
- maximum supported fog;
- maximum supported wind;
- low quality;
- reduced motion.

Random systems must support a fixed seed or disabled randomness during evidence capture.

### 10.26 Validation Journey

Run the approved player journey:

```text
Arrival Overlook
→ Valley Descent
→ River Orientation
→ Bridge Decision
→ Workshop Terrace
→ Workshop Threshold
→ Workshop Functional Core
```

At each point verify:

- destination visibility;
- route readability;
- fog continuity;
- wind coherence;
- vegetation motion;
- water mist placement;
- particle distraction;
- atmosphere and lighting agreement;
- sound and visual agreement;
- frame stability.

### 10.27 Validation Matrix

| Validation Area | Pass Condition |
|---|---|
| Sky | Stable, coherent, no horizon seam |
| Fog | Adds depth without hiding gameplay |
| Wind | Shared direction and believable hierarchy |
| Vegetation | Layered motion without distraction |
| Cloth and Props | Constrained, coherent, no clipping |
| Water Atmosphere | Localized, source-driven, readable |
| Workshop Atmosphere | Warm, functional, non-obstructive |
| Particles | Distinct from collectibles and prompts |
| Clouds | Slow, soft, lighting-compatible |
| Weather | Only approved states appear |
| Audio Coupling | Sound agrees with visible state |
| Time of Day | Atmosphere remains coherent across presets |
| Reduced Motion | Comfort improves without losing meaning |
| Quality Levels | Identity and readability preserved |
| Performance | Meets representative runtime budget |

### 10.28 Required Evidence

Evidence must include:

1. sky and horizon capture from Arrival Overlook;
2. fog-depth capture showing foreground, middle ground, and background;
3. workshop landmark visibility under baseline atmosphere;
4. bridge and water mist capture;
5. vegetation wind capture from representative distance;
6. workshop interior atmosphere capture;
7. particle-density capture near an interaction point;
8. time-of-day comparison set;
9. high, medium, and low quality comparison;
10. reduced-motion comparison;
11. performance capture from a representative journey;
12. issue list with disposition.

Evidence must record:

- commit or build identity;
- atmosphere preset;
- weather state;
- time-of-day preset;
- quality level;
- reduced-motion state;
- camera location;
- viewport or device class;
- known temporary exceptions.

### 10.29 Failure Codes

Use these failure codes during review:

| Code | Meaning |
|---|---|
| ATM-SKY-SEAM | Visible sky or horizon discontinuity |
| ATM-FOG-OCCLUSION | Fog hides required gameplay information |
| ATM-FOG-POP | Fog changes abruptly or visibly pops |
| ATM-WIND-CONFLICT | Nearby systems show contradictory wind |
| ATM-MOTION-NOISE | Environmental motion distracts from gameplay |
| ATM-PARTICLE-CONFUSION | Particle resembles collectible, prompt, or hazard |
| ATM-SOURCE-MISMATCH | Effect lacks a believable physical source |
| ATM-WATER-SPREAD | Water mist exceeds authorized local zone |
| ATM-WORKSHOP-OBSCURE | Workshop atmosphere hides stations or prompts |
| ATM-WEATHER-UNAUTHORIZED | Unsupported weather state appears |
| ATM-AUDIO-MISMATCH | Audio and visual atmosphere disagree |
| ATM-TOD-MISMATCH | Atmosphere conflicts with time-of-day lighting |
| ATM-QUALITY-MEANING-LOSS | Lower quality changes gameplay meaning |
| ATM-COMFORT-FAIL | Motion or density causes avoidable discomfort |
| ATM-PERF-BUDGET | Atmosphere exceeds runtime budget |
| ATM-EVIDENCE-STALE | Evidence no longer matches current dependencies |

A failed item must record owner, severity, affected zone, reproduction state, and resolution status.

### 10.30 Revalidation Triggers

Atmosphere evidence must be refreshed when any of these changes materially:

- terrain silhouette or elevation;
- water source, waterfall, or river placement;
- vegetation family, density, or shader behavior;
- landmark silhouette or workshop placement;
- primary route or decision-point layout;
- lighting direction, exposure, time-of-day, or color grading;
- camera behavior or field of view;
- particle materials or emitter logic;
- wind model;
- weather-state logic;
- quality-level behavior;
- reduced-motion behavior;
- environmental audio;
- runtime performance target.

### 10.31 Prohibited Shortcuts

Do not:

- use heavy fog to hide unfinished backgrounds;
- add random particles everywhere to make the world feel alive;
- animate each asset with unrelated wind values;
- use particles as the only interaction cue;
- allow unsupported weather through random selection;
- use screen-space dirt, droplets, or haze continuously;
- create strong weather without corresponding surface, lighting, and audio response;
- solve atmosphere performance by removing all environmental motion;
- accept screenshots while ignoring runtime movement artifacts;
- declare atmosphere complete without reduced-motion and low-quality validation.

### 10.32 Section Exit Gate

Phase 10 is complete only when all statements are true:

- the atmosphere identity is documented and implemented consistently;
- sky and horizon are stable from approved viewpoints;
- fog adds depth without blocking navigation or interaction;
- wind direction and hierarchy are coherent across vegetation, cloth, particles, and audio;
- water mist remains localized and physically justified;
- workshop atmosphere supports function and mood without obstruction;
- particles remain distinct from collectibles, prompts, and hazards;
- only approved weather states can appear;
- atmosphere agrees with lighting and time-of-day presets;
- reduced-motion behavior preserves essential meaning;
- quality levels preserve atmosphere identity and gameplay readability;
- representative runtime performance meets the accepted budget;
- validation evidence is current and reproducible;
- no unresolved critical atmosphere failure remains.

Exit status:

```text
PHASE 10 — ATMOSPHERE ASSEMBLY
READY FOR REVIEW
```

Approval of this phase authorizes progression to environmental-audio assembly. It does not by itself certify the complete environment slice.