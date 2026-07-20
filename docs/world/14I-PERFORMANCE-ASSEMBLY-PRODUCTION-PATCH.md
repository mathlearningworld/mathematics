# 14I — Performance Assembly Production Patch

## Document Identity

- Document ID: MLW-DOC-014I
- Status: PRODUCTION GUIDE — ACTIVE
- Parent: MLW-DOC-014 Level Assembly Guide
- Scope: Builder's Valley — Production Environment Slice 001A
- Applies to: environment art, gameplay readability, lighting, atmosphere, audio, effects, world streaming, runtime quality, and validation
- Predecessors: MLW-DOC-014A through MLW-DOC-014H
- Successor: MLW-DOC-014J Final Environment Validation

---

## 1. Purpose

This document defines the authoritative performance assembly contract for Builder's Valley.

Performance is not a late optimization pass. It is a production constraint that shapes how the world is assembled, lit, streamed, animated, heard, and validated from the beginning.

The environment must preserve:

1. clear gameplay readability,
2. stable input response,
3. predictable traversal,
4. legible learning interactions,
5. reliable save and recovery behavior,
6. acceptable visual and audio quality,
7. scalability across supported hardware.

No visual feature is considered production-ready when it causes unstable frame pacing, excessive memory pressure, blocking loads, interaction delay, or quality collapse on an approved target profile.

---

## 2. Performance Doctrine

Builder's Valley follows these rules:

- Stability before spectacle.
- Frame pacing before peak frame rate.
- Interaction latency before decorative density.
- Readability before visual complexity.
- Bounded cost before dynamic abundance.
- Measured evidence before subjective confidence.
- Degrade gracefully before failing abruptly.
- Optimize the assembled scene, not isolated assets only.
- Fix root causes before lowering global quality.
- Performance regressions are production regressions.

The intended player experience must remain coherent when scalability systems reduce detail. Low-quality modes may simplify rendering, but they must not remove required paths, interaction cues, learning targets, landmark identity, or safety boundaries.

---

## 3. Ownership and Decision Authority

### 3.1 Environment Assembly Owner

Owns:

- scene hierarchy,
- instance count,
- visibility ranges,
- landmark density,
- prop clustering,
- streaming boundaries,
- environment-specific optimization evidence.

### 3.2 Technical Art Owner

Owns:

- material complexity,
- shader variants,
- texture policy,
- LOD generation,
- shadow configuration,
- vegetation rendering,
- particle scalability.

### 3.3 Runtime Engineering Owner

Owns:

- profiling instrumentation,
- quality-level switching,
- streaming runtime,
- memory telemetry,
- frame-time capture,
- fallback behavior,
- performance regression checks.

### 3.4 Gameplay Owner

Owns:

- interaction responsiveness,
- collision necessity,
- physics activation rules,
- gameplay-critical visibility,
- acceptance of degradation behavior.

### 3.5 Audio Owner

Owns:

- active voice count,
- spatialization cost,
- occlusion cost,
- reverb cost,
- streaming and decompression policy,
- audio quality degradation.

### 3.6 Production Authority

A performance exception requires all of the following:

- measured evidence,
- named owner,
- affected target profile,
- player-visible impact,
- mitigation plan,
- expiration or revalidation condition.

Unmeasured exceptions are not accepted.

---

## 4. Supported Runtime Profiles

The production slice must define and validate at least these profiles.

### 4.1 Desktop Standard

Intent:

- primary authoring and review profile,
- stable 60 FPS target,
- full gameplay readability,
- medium-to-high visual fidelity.

Required frame budget:

- target frame time: 16.67 ms,
- warning threshold: above 18.0 ms sustained,
- failure threshold: above 22.0 ms sustained in representative play,
- severe hitch threshold: any unexpected frame above 50 ms,
- blocking-load failure: any repeatable traversal stall above 100 ms.

### 4.2 Desktop Reduced

Intent:

- older integrated or entry-level hardware,
- stable 30 FPS minimum target,
- preserved gameplay and learning clarity.

Required frame budget:

- target frame time: 33.33 ms,
- warning threshold: above 36 ms sustained,
- failure threshold: above 42 ms sustained,
- severe hitch threshold: any repeated frame above 80 ms.

### 4.3 Mobile / Low-End Compatibility

Intent:

- future-compatible scalable assembly,
- reduced effects and material cost,
- preserved interaction and route comprehension.

Required frame budget:

- target: stable 30 FPS,
- no persistent thermal-collapse behavior during the approved test duration,
- no interaction cue may disappear due only to quality reduction,
- memory use must remain within the approved device envelope.

### 4.4 Development Diagnostic

Intent:

- exposes cost rather than hiding it,
- enables debug overlays, timing markers, streaming states, LOD states, and object counts,
- may run slower than shipping profiles,
- must never be used as evidence for shipping performance.

---

## 5. Measurement Rules

All performance claims must be captured under controlled conditions.

Each evidence package must identify:

- build or commit identifier,
- target profile,
- hardware and operating system,
- resolution and render scale,
- quality level,
- test route,
- test duration,
- warm or cold start,
- capture tool,
- average frame time,
- 95th percentile frame time,
- 99th percentile frame time,
- worst hitch,
- CPU frame time,
- GPU frame time,
- memory peak,
- active streaming events,
- known debug overhead.

A single screenshot of an FPS counter is insufficient evidence.

Minimum representative capture duration:

- 60 seconds for a focused hotspot,
- 3 minutes for a traversal route,
- 10 minutes for a stability and memory observation,
- longer duration when testing thermal or accumulation risk.

---

## 6. Canonical Performance Test Routes

The following routes form the minimum environment validation set.

### Route P1 — Entry Reveal

Covers:

- initial valley reveal,
- primary landmark visibility,
- atmosphere and lighting convergence,
- first streaming activation,
- initial ambient audio population.

### Route P2 — River Traversal

Covers:

- water rendering,
- shoreline vegetation,
- reflection or approximation cost,
- waterfall audio and particles,
- occlusion transitions.

### Route P3 — Dense Vegetation Edge

Covers:

- foliage overdraw,
- wind animation,
- shadow density,
- alpha-tested materials,
- LOD transitions.

### Route P4 — Workshop Exterior to Interior

Covers:

- exterior/interior visibility transition,
- lighting and reflection changes,
- audio threshold transition,
- object density,
- interaction response,
- streaming residency.

### Route P5 — Landmark Circuit

Covers:

- repeated camera turns,
- landmark visibility,
- long-distance LODs,
- occlusion recovery,
- texture streaming stability.

### Route P6 — Gameplay Interaction Loop

Covers:

- approach object,
- collect object,
- switch tool,
- place object,
- recover or repeat,
- UI and world feedback.

This route is mandatory because acceptable rendering performance cannot compensate for delayed interaction.

### Route P7 — Stress Camera Sweep

Covers:

- rapid 360-degree rotation,
- streaming request bursts,
- visibility-system churn,
- shadow cache behavior,
- shader compilation exposure.

---

## 7. CPU Budget Contract

The CPU frame must remain bounded across normal traversal and interaction.

Primary CPU cost categories:

- gameplay update,
- scene traversal,
- visibility processing,
- animation,
- physics,
- audio update,
- streaming coordination,
- scripting,
- UI projection,
- garbage collection or memory management.

Required rules:

- no environment object may run an unconditional per-frame update without documented need,
- decorative actors must use event-driven, batched, instanced, or distance-gated behavior,
- inactive interaction targets must not perform full-cost polling,
- repeated spatial queries must be bounded and profiled,
- construction or placement previews must reuse data rather than recreate heavy objects each frame,
- environment animation must prefer shared or material-driven motion where appropriate,
- expensive logic must be disabled beyond its relevance range,
- runtime object creation bursts must not occur during ordinary traversal.

CPU failure indicators:

- sustained main-thread saturation,
- repeated script spikes,
- recurring garbage collection hitches,
- excessive object activation churn,
- physics cost unrelated to visible gameplay,
- audio or occlusion updates scaling without a cap.

---

## 8. GPU Budget Contract

The GPU budget must account for the fully assembled frame, not isolated asset previews.

Primary GPU cost categories:

- opaque geometry,
- alpha-tested vegetation,
- transparent particles,
- water,
- shadows,
- post-processing,
- atmosphere,
- material complexity,
- lighting,
- screen resolution,
- overdraw.

Required rules:

- every expensive effect must have a scalability path,
- transparency layers must be bounded,
- vegetation must not create uncontrolled overdraw corridors,
- full-resolution effects require measured justification,
- water quality must scale independently where practical,
- distant surfaces must use cheaper materials or LOD substitutions,
- decorative lights must not multiply shadow cost without explicit approval,
- post-processing must preserve readability at reduced quality.

GPU-bound scenes must be identified by route and camera direction. Global quality reduction is not an acceptable first response when one local assembly hotspot causes the issue.

---

## 9. Draw Call and State Change Budget

The environment must minimize submission overhead while preserving modular ownership.

Required practices:

- use instancing for repeated compatible props,
- use foliage systems or equivalent batching for repeated vegetation,
- avoid unique materials where parameter variation is sufficient,
- avoid unnecessary mesh splits,
- group static objects only when it does not break culling efficiency,
- preserve independent gameplay objects when interaction authority requires it,
- measure material and pipeline state changes,
- prevent hidden interior and exterior sets from rendering simultaneously without need.

Do not merge assets solely to reduce draw calls when doing so creates:

- poor occlusion behavior,
- oversized streaming units,
- invalid collision ownership,
- broken interaction boundaries,
- excessive memory residency.

Optimization must balance submission count, culling granularity, streaming granularity, and workflow ownership.

---

## 10. Geometry and Triangle Budget

Geometry budgets must be evaluated by visible frame and distance band.

Distance bands:

- Near: interaction and player-scale detail,
- Mid: navigation and landmark recognition,
- Far: silhouette and world orientation,
- Background: atmosphere-supported composition.

Required rules:

- near geometry may retain interaction-critical shape,
- mid geometry must preserve recognizable silhouette,
- far geometry must remove non-contributing topology,
- hidden backfaces and internal geometry must be reviewed,
- collision geometry must not default to render geometry,
- small repeated props require aggressive distance policy,
- terrain and cliff tessellation must correspond to visible contribution,
- workshop interiors must not remain fully detailed outside their readable range.

Triangle count alone does not determine cost. Evidence must consider vertex processing, material count, shadows, skinning, and overdraw.

---

## 11. Material and Shader Contract

Materials are performance-bearing runtime systems.

Required rules:

- maintain a bounded master-material family,
- prefer parameter instances over copied shader graphs,
- remove unused features and permutations,
- document expensive branches,
- define quality switches for high-cost features,
- keep gameplay cues independent from optional decorative effects,
- avoid uncontrolled world-position, noise, parallax, refraction, and layered blend cost,
- validate shader compilation before release capture,
- prevent runtime shader compilation hitches on canonical routes.

Material complexity classes:

- Class A — critical hero or water material,
- Class B — standard environment surface,
- Class C — repeated vegetation or prop material,
- Class D — distant or fallback material.

Class A materials require explicit evidence. Most repeated world surfaces should remain in Classes B–D.

---

## 12. Texture Budget and Streaming

Texture use must remain intentional, reusable, and observable.

Required rules:

- texel density must follow asset role and viewing distance,
- texture dimensions must be justified by visible contribution,
- channel packing should be used where it reduces cost without harming maintainability,
- repeated materials should share texture sets,
- large unique textures require approval,
- mipmaps are mandatory unless technically inappropriate,
- streaming priority must reflect player visibility and gameplay importance,
- interaction markers and critical learning surfaces must not remain blurry during use,
- texture pool over-budget warnings are release blockers unless formally accepted,
- camera cuts and rapid turns must not expose persistent low-resolution textures.

Evidence must include:

- texture memory by category,
- largest resident textures,
- non-streaming textures,
- pool peak,
- visible streaming defects,
- route-specific residency behavior.

---

## 13. Mesh and World Streaming Contract

Streaming must hide technical boundaries from normal play.

Streaming units must be designed around:

- player movement speed,
- sight lines,
- landmark visibility,
- interaction continuity,
- memory envelope,
- loading bandwidth,
- recovery behavior.

Required rules:

- gameplay-critical geometry loads before interaction becomes possible,
- collision and navigation data must be ready before access,
- landmarks needed for orientation must not pop in late,
- unload operations must not remove objects still referenced by gameplay state,
- entry and workshop thresholds require prefetch zones,
- streaming must not create repeated load/unload thrashing,
- save and recovery state must tolerate streamed-out regions,
- streaming failure must degrade safely rather than exposing voids or invalid traversal.

Blocking synchronous loads during ordinary traversal are prohibited unless documented and approved.

---

## 14. LOD Production Contract

Every scalable asset family must define a distance behavior.

LOD requirements:

- LOD0 preserves near-field appearance and interaction silhouette,
- intermediate LODs reduce cost progressively,
- final LOD preserves navigation silhouette or transitions to an approved impostor,
- screen-size thresholds must be tested in the assembled scene,
- transitions must avoid distracting shape collapse,
- collision behavior must remain authoritative and stable,
- material count should not increase in lower LODs,
- lower LODs must not retain unnecessary bones, effects, or complex shaders,
- shadows may use a simpler LOD or terminate earlier than visible geometry.

Automatic LOD generation is allowed only when validated. Generated results are not accepted solely because the tool completed successfully.

LOD failure examples:

- visible popping during normal movement,
- disappearing landmark identity,
- interaction silhouette changing materially,
- lower LOD costing more due to material splits,
- shadow shape changing distractingly,
- collision mismatch.

---

## 15. HLOD and Proxy Contract

HLOD or world proxies should reduce distant submission cost for static groups.

Required rules:

- group assets by shared visibility and streaming behavior,
- avoid combining gameplay-interactive actors into destructive proxies,
- preserve landmark silhouette and color grouping,
- proxy transition must occur outside interaction range,
- proxy materials must be cheaper than source materials,
- proxy textures must not create disproportionate memory use,
- interior objects must not contribute to exterior proxies unless visibly necessary,
- HLOD generation must be reproducible.

HLOD is an optimization layer, not a substitute for correct source-asset budgets.

---

## 16. Visibility and Culling Contract

### 16.1 Frustum Culling

All renderable objects must participate correctly unless intentionally exempt.

### 16.2 Distance Culling

Small decorative objects, particles, lights, shadows, and audio emitters require bounded ranges.

### 16.3 Occlusion Culling

Occlusion should be used where workshop walls, terrain, cliffs, and large vegetation masses create meaningful hidden sets.

Required rules:

- culling granularity must not be so large that hidden content remains visible,
- bounds must be accurate,
- animated or moving bounds must not cause disappearance,
- critical landmarks require conservative visibility,
- culling must not remove active interaction feedback,
- occlusion configuration must be tested during rapid movement and camera rotation.

False disappearance is more severe than modest overdraw for gameplay-critical objects.

---

## 17. Lighting and Shadow Budget

Lighting must comply with MLW-DOC-014F while remaining within runtime budget.

Required rules:

- define the maximum shadow-casting light set by zone,
- prefer baked, cached, static, or simplified solutions where appropriate,
- limit dynamic shadow distance,
- vegetation shadows require profile-specific scaling,
- small props should not cast expensive shadows by default,
- interior and exterior lighting sets must transition intentionally,
- decorative lights require distance and visibility bounds,
- contact shadows and similar effects require quality switches,
- shadow resolution must reflect visual importance,
- cascade or equivalent distribution must prioritize playable space.

Gameplay readability must survive when optional shadows are reduced or disabled.

---

## 18. Water Performance Contract

Water must comply with MLW-DOC-014A and remain independently scalable.

Required rules:

- reflection method must have lower-cost alternatives,
- refraction and transparency cost must be bounded,
- shoreline foam and waterfall particles require distance scaling,
- water simulation must not update outside relevant zones,
- distant water may use simplified shading,
- underwater or secondary passes must not activate when unused,
- overlapping transparent water surfaces must be avoided,
- collision and gameplay logic must not depend on the highest visual quality.

---

## 19. Vegetation Performance Contract

Vegetation must comply with MLW-DOC-014B.

Required rules:

- use instancing or equivalent batching,
- cap material variants,
- reduce wind complexity by distance,
- reduce or disable distant shadows,
- use density scaling by quality profile,
- preserve path edges and gameplay readability at every density level,
- avoid dense alpha-card stacking along primary camera routes,
- define cull distances by vegetation class,
- ensure collision exists only where gameplay requires it,
- wildlife or ambient movement must not cause full vegetation updates.

Density reduction must be composition-aware rather than random removal that damages visual guidance.

---

## 20. Atmosphere and Particle Budget

Atmosphere must comply with MLW-DOC-014G.

Required rules:

- fog and volumetric effects require profile-specific quality,
- particle systems require maximum active count and spawn rate,
- invisible emitters must stop or sleep,
- transparent particle overdraw must be measured,
- waterfall mist, dust, pollen, leaves, and workshop smoke must have independent bounds,
- weather or ambient systems must degrade gracefully,
- effects must not obscure interaction cues at any quality level,
- off-screen simulation must be reduced or disabled.

Particle systems must define:

- maximum particles,
- lifetime,
- spawn cap,
- cull distance,
- off-screen behavior,
- collision policy,
- quality scaling.

---

## 21. Audio Performance Contract

Audio must comply with MLW-DOC-014H.

Required rules:

- cap active voices by category,
- virtualize or stop inaudible emitters,
- bound occlusion queries,
- limit simultaneous convolution or expensive reverb processing,
- stream long ambience where appropriate,
- preload latency-sensitive interaction sounds,
- scale wildlife and decorative emitters by quality,
- prevent duplicate emitters at streaming boundaries,
- prioritize learning voice, interaction confirmation, and safety feedback above ambience.

Audio performance degradation must never suppress required instructional or interaction feedback.

---

## 22. Physics and Collision Budget

Required rules:

- static environment uses static collision,
- complex collision is reserved for justified cases,
- decorative objects should not simulate physics by default,
- sleeping bodies must remain asleep until relevant,
- collision layers must prevent unnecessary pair tests,
- continuous collision is limited to objects that require it,
- placement previews must use simplified validation geometry where possible,
- water, vegetation, and particles must not generate unnecessary physics queries,
- physics activation bursts must be profiled.

Collision quality must preserve traversal and placement correctness. Performance optimization must not introduce walk-through walls, invalid slopes, floating placement, or unreachable objects.

---

## 23. Animation Budget

Required rules:

- animation updates are distance-gated,
- repeated ambient motion should share clocks or material animation where appropriate,
- skeletal animation is reserved for assets that need deformation,
- off-screen animation must reduce update rate or stop,
- workshop mechanisms require bounded active states,
- vegetation wind should not rely on thousands of independent CPU animations,
- animation state changes must not allocate excessively,
- interaction-critical animation remains responsive at reduced quality.

---

## 24. UI and Interaction Responsiveness

Environment performance includes the player's ability to act.

Required rules:

- tool selection feedback must appear without perceptible delay,
- collect and place actions must not wait on decorative effects,
- interaction prompts must remain stable during streaming,
- frame drops must not create duplicate actions,
- placement confirmation must be authoritative exactly once,
- camera and character control must remain responsive under representative load,
- auto-tool selection logic must not trigger excessive scans or allocations,
- UI animation must scale independently from world rendering where possible.

A scene that renders at target FPS but delays input, selection, collection, or placement fails this guide.

---

## 25. Runtime Quality Levels

The slice must support explicit, testable quality profiles.

### 25.1 Quality Level: High

May include:

- longest approved view distances,
- highest approved shadow quality,
- richer atmosphere,
- denser vegetation,
- enhanced water,
- larger ambient audio population.

High is still bounded by the Desktop Standard budget.

### 25.2 Quality Level: Standard

Production baseline.

Must preserve:

- intended composition,
- landmark identity,
- interaction readability,
- stable target performance.

### 25.3 Quality Level: Reduced

May reduce:

- vegetation density,
- shadow distance,
- particle density,
- water reflection quality,
- atmosphere resolution,
- decorative audio voices,
- distant mesh detail.

Must preserve:

- paths,
- boundaries,
- landmarks,
- interaction targets,
- learning surfaces,
- essential audio feedback.

### 25.4 Quality Level: Safe

Emergency compatibility mode.

Must:

- prioritize stable operation,
- disable optional expensive features,
- retain all required gameplay functionality,
- expose no invalid world state,
- remain visually understandable.

---

## 26. Adaptive Quality Rules

Adaptive quality is permitted only when deterministic limits are defined.

Required rules:

- do not oscillate rapidly between levels,
- use cooldown and hysteresis,
- never change collision or gameplay rules,
- never hide active interaction targets,
- preserve consistent landmark identity,
- record quality changes in diagnostics,
- recover quality gradually after sustained stability,
- prioritize reducing decorative cost before readability cost.

Adaptive systems must not conceal regressions during certification captures. Fixed-profile captures remain mandatory.

---

## 27. Memory Budget Contract

Memory must be measured as a timeline, not a single snapshot.

Categories:

- textures,
- meshes,
- materials and shaders,
- audio,
- animation,
- physics,
- UI,
- streaming cache,
- runtime objects,
- temporary allocations.

Required rules:

- define an approved peak per target profile,
- leave safety margin for runtime variation,
- verify memory returns after leaving streamed zones,
- detect accumulation across repeated gameplay loops,
- prevent duplicate asset residency,
- bound caches,
- avoid large temporary allocation spikes,
- classify persistent growth as a blocker until explained.

Memory evidence must include:

- startup baseline,
- peak during each canonical route,
- post-route settled value,
- repeated-loop trend,
- unload recovery,
- allocation hotspot notes.

---

## 28. Hitch Prevention

Hitches are treated separately from average frame rate.

Potential hitch sources:

- synchronous asset loads,
- shader compilation,
- garbage collection,
- large object activation,
- physics registration,
- audio decompression,
- texture residency changes,
- save operations,
- navigation rebuilds,
- dynamic light or shadow invalidation.

Required rules:

- prewarm required shaders and effects,
- distribute heavy initialization,
- prefetch before thresholds,
- avoid mass activation in one frame,
- reuse pooled objects where appropriate,
- perform save work without blocking interaction,
- capture hitch markers with source attribution.

Any repeated hitch at the same route position requires root-cause investigation.

---

## 29. Thermal and Sustained Performance

For mobile or thermally constrained profiles:

- test beyond initial cold-device performance,
- record frame behavior over the approved duration,
- observe frequency reduction or thermal warnings,
- verify adaptive quality does not oscillate,
- reduce sustained GPU and CPU saturation,
- avoid background systems that accumulate cost over time.

A profile that passes only during the first minute is not certified.

---

## 30. Build and Configuration Integrity

Performance evidence is valid only for a known configuration.

Required metadata:

- source commit,
- build type,
- compiler or engine configuration,
- enabled plugins or systems,
- debug flags,
- logging level,
- quality configuration,
- resolution,
- frame cap and synchronization mode.

Editor performance is not equivalent to packaged runtime performance.

Development logging, overlays, and diagnostics must be identified because they may alter results.

---

## 31. Profiling Workflow

The canonical optimization loop is:

1. reproduce on a named route,
2. capture a baseline,
3. identify whether CPU, GPU, memory, streaming, or I/O is dominant,
4. isolate the largest contributing systems,
5. apply the smallest architecture-safe change,
6. recapture under identical conditions,
7. compare player-visible quality,
8. record evidence,
9. test other quality profiles,
10. run regression routes.

Do not optimize from intuition alone.

Do not combine many unrelated changes before recapture, because the causal improvement becomes unclear.

---

## 32. Performance Validation Matrix

Each required profile must be tested against the following matrix.

| Area | Entry Reveal | River | Vegetation | Workshop | Landmark Circuit | Gameplay Loop | Stress Sweep |
|---|---:|---:|---:|---:|---:|---:|---:|
| Frame pacing | Required | Required | Required | Required | Required | Required | Required |
| CPU timing | Required | Required | Required | Required | Required | Required | Required |
| GPU timing | Required | Required | Required | Required | Required | Required | Required |
| Memory | Sample | Sample | Sample | Required | Required | Required | Required |
| Streaming | Required | Required | Required | Required | Required | Required | Required |
| LOD/culling | Required | Required | Required | Required | Required | Sample | Required |
| Interaction latency | Sample | Sample | Sample | Required | Sample | Required | Required |
| Audio cost | Required | Required | Required | Required | Required | Required | Sample |
| Visual degradation | Required | Required | Required | Required | Required | Required | Required |

“Sample” means evidence may be captured selectively when the route does not materially exercise the category. “Required” means omission blocks exit.

---

## 33. Evidence Package

The final 14I evidence package must contain:

1. target hardware list,
2. runtime profile definitions,
3. quality configuration snapshot,
4. canonical route description,
5. frame-time captures,
6. CPU and GPU breakdown,
7. memory timeline,
8. streaming event evidence,
9. LOD and culling captures,
10. texture residency evidence,
11. hitch log,
12. interaction-response evidence,
13. before-and-after evidence for major fixes,
14. accepted exceptions,
15. final sign-off matrix.

Recommended artifact names:

- `BV-PERF-P1-ENTRY-<PROFILE>-<DATE>`
- `BV-PERF-P2-RIVER-<PROFILE>-<DATE>`
- `BV-PERF-P3-VEGETATION-<PROFILE>-<DATE>`
- `BV-PERF-P4-WORKSHOP-<PROFILE>-<DATE>`
- `BV-PERF-P5-LANDMARK-<PROFILE>-<DATE>`
- `BV-PERF-P6-GAMEPLAY-<PROFILE>-<DATE>`
- `BV-PERF-P7-STRESS-<PROFILE>-<DATE>`

Evidence names must be unique and traceable to the tested build.

---

## 34. Failure Codes

### PERF-FRAME-BUDGET-EXCEEDED

Sustained frame time exceeds the approved target profile.

### PERF-FRAME-PACING-UNSTABLE

Average performance appears acceptable, but frame delivery is visibly inconsistent.

### PERF-HITCH-REPEATABLE

A repeatable unexpected frame spike occurs on a canonical route.

### PERF-CPU-OVER-BUDGET

CPU work exceeds the allocated frame budget.

### PERF-GPU-OVER-BUDGET

GPU work exceeds the allocated frame budget.

### PERF-MEMORY-PEAK-EXCEEDED

Peak memory exceeds the approved envelope.

### PERF-MEMORY-GROWTH

Memory fails to settle or grows across repeated loops.

### PERF-STREAMING-BLOCK

Traversal causes blocking load or visible world incompleteness.

### PERF-STREAMING-THRASH

Assets repeatedly load and unload around a boundary.

### PERF-TEXTURE-RESIDENCY

Critical surfaces remain below required texture quality during use.

### PERF-LOD-POP

LOD transition creates distracting or gameplay-relevant visual discontinuity.

### PERF-CULLING-FALSE-NEGATIVE

Required visible content disappears incorrectly.

### PERF-SHADER-HITCH

Runtime shader compilation causes a visible hitch.

### PERF-OVERDRAW-HOTSPOT

Transparency or vegetation layering creates an unacceptable GPU hotspot.

### PERF-SHADOW-BUDGET

Shadow rendering exceeds the profile budget.

### PERF-PARTICLE-BUDGET

Particle simulation or rendering exceeds the approved cost.

### PERF-AUDIO-VOICE-BUDGET

Audio voice, spatialization, occlusion, or reverb cost exceeds its cap.

### PERF-PHYSICS-BUDGET

Physics work exceeds justified gameplay need.

### PERF-INTERACTION-LATENCY

Collection, placement, tool selection, or confirmation becomes perceptibly delayed.

### PERF-QUALITY-READABILITY-LOSS

A reduced quality profile removes or weakens required gameplay readability.

### PERF-EVIDENCE-INCOMPLETE

A performance claim lacks the required traceable evidence.

---

## 35. Severity Classification

### Blocker

- crash or out-of-memory,
- invalid world state,
- missing collision or critical geometry due to streaming,
- severe interaction failure,
- sustained inability to meet minimum profile,
- repeatable blocking loads.

### Critical

- unstable frame pacing on primary routes,
- major memory accumulation,
- repeated severe hitch,
- landmark or interaction cue lost under supported quality level.

### Major

- local hotspot exceeding budget,
- visible LOD pop,
- unnecessary shadow or particle cost,
- texture streaming defect that recovers but is clearly visible.

### Minor

- isolated inefficiency with no current player-visible impact,
- evidence formatting issue,
- optional diagnostic improvement.

Blocker and Critical failures prevent 14I exit.

---

## 36. Revalidation Triggers

14I must be revalidated when any of the following changes:

- environment geometry density,
- terrain or landmark layout,
- water system,
- vegetation density or shader,
- workshop interior population,
- lighting or shadow model,
- atmosphere or post-processing,
- particle systems,
- audio population or occlusion,
- interaction scan logic,
- placement preview system,
- streaming boundaries,
- LOD/HLOD generation,
- texture resolution or compression policy,
- supported resolution,
- quality profile definitions,
- engine or rendering backend,
- target hardware list.

A passing result is not permanent after material scene change.

---

## 37. Production Checklist

### Assembly

- [ ] Scene hierarchy supports culling and streaming.
- [ ] Repeated assets use appropriate instancing.
- [ ] Hidden interiors and exteriors are bounded.
- [ ] Decorative updates are distance-gated or event-driven.

### Rendering

- [ ] Material families are bounded.
- [ ] Shader variants are controlled.
- [ ] Water has scalable quality.
- [ ] Vegetation density scales safely.
- [ ] Transparency hotspots are measured.

### Geometry

- [ ] LODs exist for scalable asset families.
- [ ] HLOD/proxies are validated where useful.
- [ ] Collision is simpler than render geometry where appropriate.
- [ ] Landmark silhouettes survive distance reduction.

### Lighting

- [ ] Dynamic lights are bounded.
- [ ] Shadow distance and quality scale by profile.
- [ ] Decorative shadows can reduce without readability loss.

### Streaming and Memory

- [ ] Critical assets prefetch before need.
- [ ] No blocking load occurs on canonical routes.
- [ ] Memory peak remains within envelope.
- [ ] Memory settles after repeated routes.

### Interaction

- [ ] Collect and place loops remain responsive.
- [ ] Auto-tool selection remains bounded.
- [ ] UI feedback is not delayed by decorative systems.
- [ ] Quality reduction preserves every required cue.

### Evidence

- [ ] Every profile has traceable captures.
- [ ] Hardware and build metadata are recorded.
- [ ] Frame-time percentiles are included.
- [ ] Hitches have source attribution.
- [ ] Exceptions have owners and mitigation.

---

## 38. Exit Gate

The Builder's Valley Performance Assembly may be marked complete only when all of the following are true:

1. supported runtime profiles are explicitly defined,
2. canonical test routes are implemented and repeatable,
3. frame pacing meets the approved threshold on required profiles,
4. no unresolved Blocker or Critical performance failure remains,
5. memory remains within the approved envelope and does not accumulate across repeated loops,
6. no repeatable blocking load or severe traversal hitch remains,
7. LOD, HLOD, culling, and streaming preserve world continuity,
8. reduced quality modes preserve gameplay and learning readability,
9. collection, tool selection, placement, and confirmation remain responsive,
10. lighting, atmosphere, water, vegetation, particles, and audio stay within bounded costs,
11. evidence is traceable to a specific build and target profile,
12. accepted exceptions are documented with owner and revalidation trigger,
13. environment, technical art, runtime, gameplay, and audio owners approve their respective sections,
14. the slice is ready to enter MLW-DOC-014J Final Environment Validation.

Exit status values:

- `NOT_TESTED`
- `TESTING`
- `FAILED`
- `CONDITIONAL_PASS`
- `PASS`

Only `PASS` permits unconditional closure in 14J.

`CONDITIONAL_PASS` may proceed to final review only when every exception is non-critical, time-bounded, owned, and explicitly visible in the final validation record.

---

## 39. Final Production Principle

Builder's Valley must feel alive without becoming computationally unstable.

The correct result is not the most expensive world the hardware can briefly display. The correct result is a coherent, readable, responsive world that sustains its intended experience across the full play loop and across every approved quality profile.

Performance assembly is complete only when the world remains understandable, interactive, and trustworthy under real runtime conditions.