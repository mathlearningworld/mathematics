# 14H — Environment Audio Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014H
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Applies To: MLW-DOC-014 Section 11 — Environment Audio Assembly
- Scope: Builder's Valley — Production Environment Slice 001A

## Purpose

This production patch defines the authoritative Phase 11 environment-audio workflow for Builder's Valley. It extends the world, water, vegetation, landmark, workshop, gameplay-readability, lighting, and atmosphere contracts established by MLW-DOC-014 through MLW-DOC-014G.

Environment audio is not a decorative layer added after visual completion. It is a navigation, orientation, state, safety, presence, and emotional-identity system. The player must be able to hear where important world systems are, understand whether a space is active or calm, and detect meaningful changes without depending on language-heavy UI.

Audio must support learning concentration. It must enrich the world without creating fatigue, masking instructional feedback, or competing with interaction cues.

## 11 Environment Audio Assembly

### 11.1 Environment Audio Objective

Builder's Valley must sound alive, coherent, readable, calm, and spatially trustworthy.

The environment-audio system must:

- reinforce geographic orientation;
- communicate proximity to water, bridge, workshop, and major landmarks;
- distinguish exterior, threshold, and interior acoustic spaces;
- support gameplay readability and interaction discovery;
- preserve instructional, UI, narration, and feedback priority;
- remain comfortable during extended learning sessions;
- avoid random intensity spikes and unnecessary repetition;
- scale across supported runtime quality levels;
- behave deterministically enough for validation and evidence capture;
- avoid implying mechanics, hazards, characters, or events that do not exist.

### 11.2 Authoritative Audio Assembly Order

Environment audio must be assembled in this order:

```text
Dependency Review
→ Audio Ownership Map
→ Listener and Camera Contract
→ Global Ambience Bed
→ Geographic Sound Sources
→ Landmark Audio Identity
→ Workshop Exterior and Interior Zones
→ Interaction and State-Change Support
→ Occlusion and Obstruction
→ Reverb and Acoustic Space
→ Music and Instruction Priority Integration
→ Accessibility and Comfort Controls
→ Quality-Level and Performance Validation
→ Runtime Journey Validation
→ Evidence Capture
→ Section Exit Gate
```

Later steps must not conceal unresolved failures from earlier steps.

### 11.3 Entry Contract

Phase 11 may begin only when:

- terrain and primary traversal routes are stable;
- water locations and flow meaning are approved;
- vegetation density and wind behavior are sufficiently stable;
- landmark placement and gameplay hierarchy are approved;
- workshop exterior, threshold, and interior spaces are defined;
- gameplay-readability decision points are recorded;
- lighting and atmosphere baselines are accepted for the validation state;
- representative player camera and movement behavior are available;
- instructional, UI, interaction, and music audio channels have named ownership.

Material changes to these dependencies invalidate affected audio evidence.

### 11.4 Audio Ownership Model

Every audible element must have one primary owner.

| Audio Layer | Primary Owner | Responsibility |
|---|---|---|
| Global ambience | Environment Audio | Continuous valley identity |
| Water systems | Water Assembly + Environment Audio | Geographic water presence |
| Wind and vegetation | Atmosphere + Environment Audio | Air and foliage movement |
| Landmark identity | Landmark Assembly + Environment Audio | Destination recognition |
| Workshop machinery | Workshop Assembly + Environment Audio | Functional activity and state |
| Interaction confirmation | Gameplay / Interaction | Player action feedback |
| Learning instruction | Learning Runtime | Explanation and teaching priority |
| UI feedback | UI Runtime | Interface confirmation and warning |
| Music | Music System | Emotional pacing without masking |
| Accessibility mix | Audio Runtime | User-level comfort and clarity |

A sound may receive data from another system, but it must not have multiple competing runtime authorities.

### 11.5 Audio Bus and Priority Contract

The approved logical bus hierarchy is:

```text
Master
├── Learning Voice
├── Critical Gameplay
├── UI
├── Interaction
├── Environment
│   ├── Global Ambience
│   ├── Water
│   ├── Wind and Vegetation
│   ├── Wildlife
│   ├── Workshop
│   └── Landmark Accents
├── Music
└── Accessibility Support
```

Priority order during conflict:

```text
Learning Voice
> Critical Gameplay
> UI Confirmation
> Interaction Feedback
> Environment Orientation
> Music
> Decorative Detail
```

Environment audio must yield when instructional clarity requires it.

### 11.6 Listener Contract

The listener must represent the player's perceptual position, not an arbitrary scene object.

The implementation must define:

- listener anchor;
- relationship between camera and character position;
- behavior during camera zoom;
- behavior during camera rotation;
- behavior during cutscenes or guided views;
- teleport or respawn transition behavior;
- pause and menu behavior.

For a third-person or elevated learning camera, the listener may blend between character and camera position, but the result must preserve trustworthy left-right and near-far perception.

The listener must not:

- jump abruptly during ordinary camera motion;
- make nearby interaction sounds appear distant;
- reverse directional meaning;
- pass through walls independently of the player without acoustic compensation;
- change volume solely because the player adjusted field of view.

### 11.7 Global Ambience Bed

The global ambience bed establishes the baseline identity of Builder's Valley.

Approved baseline characteristics:

```text
Calm mountain valley
Warm and safe
Light natural motion
Subtle distant life
Low fatigue
No constant dramatic pressure
```

The ambience bed may include:

- distant wind;
- broad valley air;
- subtle foliage mass;
- distant water presence;
- sparse birds or insects appropriate to time of day;
- low-level workshop activity when geographically plausible.

The ambience bed must not contain strongly localized events that cannot be spatially explained.

Loop requirements:

- no obvious loop seam;
- no highly recognizable event repeating at distracting intervals;
- no persistent tonal buildup;
- no stereo movement unrelated to world direction;
- no excessive low-frequency energy;
- sufficient variation for sustained sessions without constant novelty.

### 11.8 Geographic Sound Map

Audio geography must correspond to visible world geography.

The minimum authoritative geographic sources are:

1. River or stream system;
2. Waterfall or major water landmark;
3. Bridge transition area;
4. Workshop exterior;
5. Workshop threshold;
6. Workshop functional core;
7. Arrival overlook;
8. Vegetation-rich zones;
9. Sheltered or enclosed terrain pockets.

Each geographic source requires:

| Field | Requirement |
|---|---|
| Audio Source ID | Stable identifier |
| World Authority | Object, zone, spline, volume, or system |
| Audible Purpose | Orientation, identity, activity, safety, or ambience |
| Inner Range | Region of stable full presence |
| Outer Range | Maximum meaningful reach |
| Falloff | Approved attenuation behavior |
| Occlusion Rule | None, partial, or strong |
| Priority | Relative importance |
| Quality Policy | Behavior per runtime quality level |
| Validation Points | Named listener locations |

### 11.9 Water Audio Contract

Water audio must communicate scale, direction, distance, and flow energy.

#### 11.9.1 River and Stream

River sound should follow the water body rather than originate from one obvious point.

Requirements:

- use distributed, spline-based, segmented, or equivalent spatial coverage;
- preserve directional continuity while moving alongside the river;
- increase intensity near faster, narrower, or rougher flow where visually supported;
- reduce intensity behind terrain or substantial structures;
- avoid identical phase and timing across repeated segments;
- preserve a calm mix near learning interaction spaces.

#### 11.9.2 Waterfall

The waterfall is a major geographic authority.

It must:

- become audible before full visual reveal when useful for orientation;
- grow consistently with proximity;
- contain low, mid, and high-frequency components appropriate to scale;
- respond to terrain obstruction;
- avoid masking bridge, workshop, or interaction cues;
- remain recognizable at reduced quality.

#### 11.9.3 Water Edge Detail

Small splashes, drips, and shoreline movement may support local realism but are secondary.

They must not:

- imply player contact when none occurred;
- fire at distracting density;
- exceed the authority of the main water body;
- create false hazard urgency.

### 11.10 Wind and Vegetation Audio Contract

Wind audio must agree with visual atmosphere and vegetation motion.

Wind layers may include:

- broad valley wind;
- exposed ridge wind;
- sheltered-area reduction;
- canopy rustle;
- grass movement;
- hanging-object movement;
- workshop cloth or banner motion.

Rules:

- audible intensity must broadly match visible motion;
- calm visuals must not produce storm-like sound;
- gust events must be coordinated with atmosphere authority;
- gusts must not occur so frequently that they become rhythmic distractions;
- dense vegetation may sound fuller than open terrain without becoming noisy;
- wind must not mask instructional audio.

### 11.11 Wildlife and Natural Life

Wildlife audio supports life and time-of-day identity.

Approved use:

- sparse bird calls;
- distant insect layers;
- occasional small-animal movement when environmentally plausible;
- time-of-day-specific natural detail.

Wildlife audio must not:

- imply visible creatures that players are expected to find when none exist;
- repeat distinctive calls too frequently;
- create alarm or danger without gameplay meaning;
- dominate orientation cues;
- continue unchanged across incompatible weather or time states.

### 11.12 Landmark Audio Identity

Primary landmarks may have distinct audio signatures.

#### 11.12.1 Workshop

Workshop identity may include:

- distant hammer rhythm;
- wood or metal handling;
- low machinery hum;
- bell, chime, or crafted tonal marker;
- ventilation, steam, or furnace support where visually justified.

The workshop signature must:

- become clearer during approach;
- remain subordinate to learning and interaction feedback;
- change when workshop state changes;
- avoid sounding fully active when the workshop is visually inactive;
- avoid exact short-loop repetition.

#### 11.12.2 Bridge

Bridge audio may include:

- water relationship;
- wood or rope movement;
- footstep surface response;
- subtle wind exposure;
- transition accent when appropriate.

Bridge sound must communicate transition without turning every crossing into a dramatic event.

#### 11.12.3 Arrival Overlook

Arrival audio should establish calm orientation and world scale.

It should provide a readable blend of:

- distant water;
- broad valley air;
- subtle vegetation;
- faint workshop direction when plausible.

### 11.13 Workshop Acoustic Zones

The workshop requires at least three acoustic states:

```text
Exterior Approach
→ Threshold Transition
→ Interior Functional Core
```

#### 11.13.1 Exterior Approach

Exterior sound preserves valley ambience while introducing workshop activity.

#### 11.13.2 Threshold Transition

The threshold must blend rather than hard-switch.

Transition requirements:

- smooth ambience change;
- progressive reverb change;
- controlled reduction of distant valley layers;
- stable workshop source positions;
- no audible pumping during repeated entry and exit.

#### 11.13.3 Interior Functional Core

Interior audio must communicate room scale and functional zones.

It may include:

- room tone;
- machinery or tool stations;
- fire, steam, or material processes;
- close structural creaks;
- localized work surfaces.

Interior sound must remain calm enough for instruction and puzzle solving.

### 11.14 Interaction Support

Environment audio may support interaction discovery but must not replace explicit interaction feedback.

Approved support forms:

- subtle machine idle near usable stations;
- material resonance near active construction points;
- state-dependent hum, flow, or rhythm;
- small proximity emphasis for important objects;
- completion-state environmental response.

Rules:

- interaction feedback owns action confirmation;
- environment audio owns place and state context;
- a proximity sound must not repeatedly retrigger at the boundary;
- inactive objects must not sound active;
- unavailable interactions must not emit a strong invitation cue.

### 11.15 State-Change Audio

World-state changes must be audible when they are meaningful.

Examples:

- repaired bridge becomes stable;
- workshop station activates;
- water routing changes;
- construction milestone completes;
- new area becomes accessible;
- machine transitions from idle to active.

State-change audio must:

- correspond to a visible or gameplay-observable change;
- occur once per authoritative transition unless repetition is intentional;
- avoid false success language;
- remain audible without overpowering learning voice;
- leave the environment in a coherent new steady state.

### 11.16 Footstep and Surface Relationship

Although character audio may have separate ownership, environment assembly must validate that surfaces produce coherent responses.

Minimum surface families:

- soil or path;
- grass;
- rock;
- wood bridge;
- workshop wood floor;
- workshop stone or metal area;
- shallow water where traversal is supported.

Footstep responses must agree with visible material and collision.

A surface fails when it consistently sounds like a materially different surface.

### 11.17 Occlusion and Obstruction

Audio obstruction must help players trust world geometry.

Approved obstruction tiers:

| Tier | Example | Expected Response |
|---|---|---|
| Open | clear line of sight | full spatial presence |
| Partial | foliage, thin structure, corner | mild attenuation or filtering |
| Strong | terrain mass, closed wall | meaningful attenuation and filtering |
| Enclosed | workshop interior | zone and reverb transition |

Occlusion must not:

- silence a major orientation source too aggressively;
- fluctuate rapidly from small geometry details;
- be calculated at excessive cost for decorative sources;
- contradict visible openings;
- make a nearby source sound impossibly distant.

### 11.18 Reverb and Acoustic Space

Reverb communicates enclosure and material scale.

Required acoustic spaces:

- open valley;
- sheltered terrain pocket;
- bridge underside or constrained crossing area if present;
- workshop exterior edge;
- workshop threshold;
- workshop interior;
- smaller interior or machine alcove if materially distinct.

Reverb requirements:

- smooth transitions;
- no excessive tail masking;
- no strong metallic character unless supported by materials;
- no dramatic cavern response in ordinary rooms;
- consistent behavior for interaction and environment sources;
- instructional voice remains intelligible.

### 11.19 Music Integration

Music and environment audio must cooperate.

Music must not erase geographic sound identity. Environment audio must not fill every frequency band simply because music is absent.

The mix must define:

- music ducking during learning voice;
- environment ducking during critical instruction;
- transition behavior during success moments;
- behavior when music is disabled;
- behavior when environment volume is reduced;
- recovery after temporary ducking.

The world must remain spatially understandable with music disabled.

### 11.20 Learning Audio Integration

Learning voice and instructional sound have highest clarity authority.

During instruction:

- environment ambience may reduce by an approved amount;
- strong workshop transients must be suppressed or delayed;
- wildlife and decorative one-shots may pause;
- water and wind should remain present at a lower stable level when orientation is still useful;
- reverb on learning voice must remain controlled;
- the mix must return smoothly after instruction.

No environment sound may force the learner to replay an explanation because of masking.

### 11.21 Dynamic Range and Loudness

Audio must be comfortable across common consumer devices.

Validation devices should include:

- laptop speakers;
- mobile or tablet speakers where supported;
- ordinary headphones;
- low-volume playback.

The mix must avoid:

- sudden loud transients;
- excessive bass dependence;
- near-silent orientation cues;
- harsh high-frequency repetition;
- constant full-scale ambience;
- large volume differences between exterior and interior.

Exact loudness targets may be defined by implementation technology, but relative hierarchy is mandatory.

### 11.22 Accessibility and Comfort Controls

Minimum user controls:

- Master Volume;
- Learning Voice Volume;
- Music Volume;
- Environment Volume;
- UI / Interaction Volume where product settings allow;
- Mute All;
- Mono compatibility or equivalent spatial-accessibility support where feasible.

Recommended support:

- reduced dynamic range;
- reduced repetitive ambience detail;
- subtitle or visual support for critical non-verbal cues;
- hearing-safe default levels;
- persistent settings.

No required learning outcome may depend exclusively on stereo direction or hearing ability.

### 11.23 Runtime Audio States

The environment-audio runtime must support explicit states.

Minimum state model:

```text
UNINITIALIZED
→ LOADING
→ ACTIVE_EXTERIOR
→ ACTIVE_THRESHOLD
→ ACTIVE_INTERIOR
→ DUCKED_FOR_INSTRUCTION
→ PAUSED
→ SUSPENDED
→ RESUMING
→ ERROR_SAFE
```

The exact implementation may differ, but equivalent behavior must exist.

Requirements:

- pause must not create stacked loops on resume;
- suspend and resume must restore correct zone state;
- scene reload must not duplicate persistent ambience;
- fast travel or respawn must reset stale spatial sources;
- error-safe mode must preserve critical learning and UI audio;
- state changes must be inspectable during debugging.

### 11.24 Randomization Contract

Randomization should reduce repetition without destroying determinism.

Approved variation dimensions:

- clip selection;
- interval range;
- subtle pitch range;
- subtle volume range;
- spatial spawn point within an approved zone;
- time-of-day availability;
- weather-state availability.

Randomization must use bounded values.

It must not:

- produce extreme pitch shifts;
- trigger repeated identical events in clusters;
- create untestable behavior;
- change critical cue meaning;
- produce sounds outside their geographic authority.

Evidence capture may use a fixed seed or deterministic validation mode.

### 11.25 Quality-Level Policy

Environment audio must scale intentionally.

#### High Quality

- full geographic source density;
- approved occlusion and reverb complexity;
- richer variation pools;
- detailed water and workshop layers;
- full atmospheric coupling.

#### Medium Quality

- preserve all orientation and state cues;
- reduce decorative source density;
- simplify occlusion updates;
- reduce simultaneous detail layers;
- retain major reverb zones.

#### Low Quality

- preserve global ambience identity;
- preserve river, waterfall, workshop, bridge, interaction, and state-change authority;
- reduce wildlife and decorative one-shots;
- simplify filtering and reverb;
- limit simultaneous voices;
- avoid audible hard cuts during voice stealing.

Quality reduction must remove decoration before meaning.

### 11.26 Performance Budget

The implementation must define and record:

- maximum simultaneous environment voices;
- maximum high-priority voices;
- streaming and preloading policy;
- compressed memory budget;
- decoded memory budget;
- occlusion update budget;
- reverb-zone cost;
- mobile or low-end fallback policy;
- voice-stealing rules.

Voice-stealing priority must preserve:

```text
Critical Gameplay
→ Interaction
→ Major Geographic Orientation
→ Workshop State
→ Global Ambience
→ Decorative Detail
```

Performance optimization must not remove required orientation cues.

### 11.27 Naming and Asset Organization

Recommended naming form:

```text
AUD_ENV_<REGION>_<SOURCE>_<STATE>_<VARIANT>
```

Examples:

```text
AUD_ENV_VALLEY_WIND_CALM_01
AUD_ENV_RIVER_FLOW_MEDIUM_02
AUD_ENV_WATERFALL_BASE_LOOP_01
AUD_ENV_WORKSHOP_HAMMER_DISTANT_03
AUD_ENV_WORKSHOP_ROOMTONE_ACTIVE_01
AUD_ENV_BRIDGE_WOOD_CREAK_LIGHT_02
```

Required metadata:

- owner;
- source category;
- loop or one-shot;
- spatial or non-spatial;
- priority;
- range;
- quality policy;
- usage state;
- license or provenance where applicable;
- replacement status for temporary assets.

Temporary audio must be explicitly labeled and must not silently become production authority.

### 11.28 Validation Journey

The authoritative runtime journey is:

```text
Arrival Overlook
→ Valley Descent
→ River Orientation
→ Bridge Approach
→ Bridge Crossing
→ Workshop Terrace
→ Workshop Threshold
→ Workshop Functional Core
→ Return Toward Exterior
```

At each stage validate:

- current dominant environment layer;
- visible-to-audible agreement;
- orientation usefulness;
- transition smoothness;
- instruction clarity;
- interaction clarity;
- comfort;
- performance;
- absence of false events.

### 11.29 Required Validation Positions

Minimum named positions:

1. Arrival overlook facing valley;
2. Arrival overlook facing away from valley;
3. Mid-descent with partial river visibility;
4. River edge upstream;
5. River edge downstream;
6. Waterfall audible approach point;
7. Bridge entrance;
8. Bridge midpoint;
9. Workshop distant approach;
10. Workshop terrace;
11. Workshop threshold exterior;
12. Workshop threshold interior;
13. Workshop functional core;
14. Workshop interior behind obstruction;
15. Exit transition back to valley.

### 11.30 Validation Matrix

| Validation Area | Pass Condition |
|---|---|
| Global ambience | Stable, calm, seamless, non-fatiguing |
| Geography | Audible sources match world position |
| Water | Scale and direction remain trustworthy |
| Workshop | Approach and interior identity are distinct |
| Thresholds | No hard cut or repeated pumping |
| Occlusion | Geometry meaning is reinforced |
| Reverb | Space changes are coherent and restrained |
| Learning voice | Fully intelligible in representative conditions |
| Interaction | Feedback remains clearly prioritized |
| Music integration | No destructive masking |
| Accessibility | Required controls and non-audio support exist |
| Quality levels | Meaning survives reduction |
| Performance | Budgets pass on target hardware |
| Suspend / resume | No duplication or stale state |
| Long session | No obvious fatigue or repetitive annoyance |

### 11.31 Evidence Requirements

Phase 11 evidence must include:

- audio ownership map;
- bus and priority hierarchy;
- geographic source map;
- workshop acoustic-zone map;
- listener configuration record;
- attenuation and occlusion settings for major sources;
- reverb-zone settings;
- quality-level policy;
- performance capture;
- runtime journey recording or equivalent evidence;
- instruction-masking validation;
- accessibility-setting evidence;
- known deviations and owner assignments.

Screenshots alone are insufficient for audio acceptance. Evidence must include audible runtime capture or direct engine/runtime inspection.

### 11.32 Failure Codes

Recommended failure codes:

| Code | Meaning |
|---|---|
| AUD-OWN-001 | Audio source has no clear owner |
| AUD-GEO-001 | Sound does not match geographic position |
| AUD-LOOP-001 | Audible loop seam or repetitive pattern |
| AUD-MASK-001 | Environment audio masks learning voice |
| AUD-MASK-002 | Environment audio masks interaction feedback |
| AUD-WATER-001 | Water scale or direction is misleading |
| AUD-WIND-001 | Wind sound contradicts visual motion |
| AUD-WORK-001 | Workshop state and sound disagree |
| AUD-ZONE-001 | Exterior/interior transition is abrupt or unstable |
| AUD-OCC-001 | Occlusion contradicts geometry |
| AUD-REV-001 | Reverb misrepresents space or harms clarity |
| AUD-STATE-001 | Pause, reload, or resume duplicates sources |
| AUD-RAND-001 | Randomization creates distracting or invalid events |
| AUD-ACC-001 | Required learning meaning depends only on hearing |
| AUD-PERF-001 | Voice, memory, or processing budget exceeded |
| AUD-QUAL-001 | Low-quality mode removes required meaning |
| AUD-EVID-001 | Acceptance evidence is incomplete |

### 11.33 Revalidation Triggers

Affected audio must be revalidated when:

- terrain or route geometry changes;
- water bodies, flow, or waterfall position changes;
- vegetation density or wind behavior changes materially;
- landmark placement changes;
- workshop geometry, doors, walls, or activity states change;
- gameplay decision points change;
- listener, camera, or movement behavior changes;
- lighting or atmosphere state ranges change materially;
- learning voice, UI, interaction, or music mix changes;
- attenuation, occlusion, or reverb technology changes;
- target hardware or quality tiers change;
- audio assets are replaced;
- suspend, resume, loading, or scene lifecycle changes.

### 11.34 Prohibited Shortcuts

The following are not acceptable:

- one non-spatial ambience track for the entire level;
- a waterfall audible at equal volume everywhere;
- environment sources placed only by visual guess without runtime validation;
- hard switching at workshop doors;
- using music to hide weak environment audio;
- excessive random one-shots to simulate life;
- allowing decorative sounds to mask instruction;
- removing all environment meaning on low quality;
- accepting only through editor preview;
- treating headphones as the only target device;
- shipping temporary unlicensed audio as production authority;
- declaring completion without long-session listening.

### 11.35 Section Exit Gate

Phase 11 passes only when all of the following are true:

- audio ownership is explicit;
- listener behavior is stable;
- global ambience is calm and seamless;
- river and waterfall provide trustworthy geographic orientation;
- wind and vegetation audio agree with atmosphere motion;
- major landmarks have coherent audio identity;
- workshop exterior, threshold, and interior transitions are accepted;
- interaction and state-change cues retain priority;
- occlusion and reverb reinforce geometry;
- learning voice remains intelligible;
- required meaning does not depend exclusively on hearing;
- quality levels preserve semantic priority;
- performance budgets pass;
- pause, suspend, resume, reload, and traversal do not duplicate or corrupt audio state;
- required evidence is captured;
- all blocking failure codes are resolved or formally accepted with owner and deadline.

The exit state is:

```text
ENVIRONMENT AUDIO ASSEMBLY — PRODUCTION READY
```

This exit state authorizes Phase 12 performance assembly and final environment optimization. It does not authorize final environment completion by itself.
