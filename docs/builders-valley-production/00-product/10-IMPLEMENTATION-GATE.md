# Builders Valley Implementation Gate

Status: APPROVED FOUNDATION V1
Authority: Product Constitution
Scope: All Builders Valley runtime implementation missions

## 1. Purpose

This gate determines whether a Builders Valley design is ready to enter runtime implementation.

The gate exists to prevent implementation from becoming the place where unresolved product, terrain, camera, composition, ownership, or acceptance decisions are made implicitly.

No landmark, world-area rebuild, renderer replacement, terrain authority migration, or major visual pass may begin until the required evidence below is approved.

## 2. Authority Order

Readiness must be evaluated against this authority order:

1. Product Constitution
2. Foundation Standards
3. Landmark Contract
4. Runtime Mapping
5. Verification Plan

Runtime convenience cannot override a missing or conflicting higher-level decision.

## 3. Gate Result

Every implementation proposal must receive exactly one result:

- READY — implementation may begin within the approved scope.
- READY WITH CONDITIONS — implementation may begin only after named conditions are satisfied and recorded.
- NOT READY — implementation must not begin.

Silence, incomplete notes, concept art alone, or an existing runtime patch do not count as approval.

## 4. Definition of Ready

### 4.1 Product Alignment

Required:

- the mission supports the World Bible;
- the player purpose is explicit;
- the expected learning or gameplay value is explicit;
- non-goals are stated;
- the mission does not reduce the world to a decorative scene.

### 4.2 Landmark Identity

Required for landmark work:

- landmark name and role;
- navigation purpose;
- gameplay purpose;
- environmental story;
- relationship to adjacent landmarks;
- recognizable silhouette intent;
- approach and exit logic.

### 4.3 Terrain Contract

Required:

- primary terrain masses;
- elevation relationships;
- traversal surfaces;
- boundaries and blocked areas;
- terrain-created gameplay problem;
- river, canyon, cliff, terrace, or slope logic where applicable;
- organic silhouette expectations;
- legacy terrain elements to retain, migrate, or retire.

A list of props is not a terrain contract.

### 4.4 Composition Contract

Required:

- primary focal point;
- secondary focal points;
- foreground, midground, and background roles;
- visual mass hierarchy;
- negative space;
- path readability;
- landmark relationship to terrain;
- detail-density limits;
- elements that must not compete with the focal hierarchy.

### 4.5 Camera Contract

Required:

- projection type;
- intended angle and height;
- framing purpose;
- player visibility requirements;
- visible landmark requirements;
- camera movement or follow behavior;
- constraints that preserve gameplay readability;
- reproducible Hero Frame camera state.

### 4.6 Asset Contract

Required when assets are introduced or replaced:

- purpose of each primary asset family;
- scale range;
- orientation rules;
- material family;
- variation rules;
- interaction role;
- placement boundary;
- prohibited uses;
- whether the asset is terrain, landmark structure, vegetation, or prop.

### 4.7 Lighting, Material, and Color Contract

Required:

- lighting condition;
- shadow and depth intent;
- material hierarchy;
- color hierarchy;
- interaction contrast;
- destination emphasis;
- readability under the target camera;
- atmospheric constraints.

### 4.8 Runtime Ownership

Required:

- one owner for each visual concern;
- world authority entry point;
- renderer boundaries;
- lifecycle and load order;
- files and modules expected to change;
- legacy systems affected;
- duplicate or overlapping ownership risks;
- retirement or migration plan for replaced systems.

No implementation may introduce a second undeclared owner for an existing concern.

### 4.9 Gameplay Preservation

Required:

- player movement expectations;
- collision expectations;
- interaction expectations;
- placement and collection behavior where relevant;
- save or progression impact;
- required invariant behavior;
- explicit statement of behavior that must not change.

A visual mission is not permitted to silently change gameplay.

### 4.10 Verification Plan

Required:

- repository checks;
- runtime build and launch checks;
- target route or scene;
- interaction checks;
- reproducible screenshot position;
- Hero Frame comparison criteria;
- regression checks;
- evidence package expected from the human runtime owner.

### 4.11 Screenshot Acceptance Criteria

Required:

- expected visible change;
- terrain hierarchy criteria;
- landmark readability criteria;
- camera criteria;
- lighting and depth criteria;
- gameplay readability criteria;
- prohibited overlap or legacy presentation;
- explicit PASS and FAIL conditions.

“Looks better” is not an acceptance criterion.

## 5. Mandatory Pre-Implementation Questions

Before approval, the architect or reviewer must be able to answer:

1. Why does this place or system exist for the player?
2. What terrain creates its purpose?
3. What must the player notice first?
4. How does the camera reveal that hierarchy?
5. Which system owns each visible concern?
6. What old system will be removed, migrated, or constrained?
7. What gameplay behavior must remain unchanged?
8. What exact screenshot or runtime evidence will prove success?
9. What would cause immediate rejection?
10. Is the scope small enough to diagnose from runtime evidence?

If any answer is unknown, the mission is NOT READY unless the missing item is formally declared as a blocking condition.

## 6. Prohibited Implementation Starts

Implementation must not start from any of the following alone:

- a request to add an asset;
- a vague visual preference;
- a concept image without extracted contracts;
- an existing patch that appears easy to extend;
- a desire to make the scene richer;
- runtime code being the only available explanation of intent;
- an unresolved ownership conflict;
- an unrepeatable screenshot;
- a missing gameplay-preservation statement.

## 7. Scope Control

Every approved mission must define:

- mission identifier;
- included concerns;
- excluded concerns;
- expected files or modules;
- allowed runtime behavior changes;
- prohibited changes;
- rollback boundary;
- next mission that is explicitly deferred.

One mission must not combine terrain replacement, camera redesign, landmark architecture, new gameplay, broad asset production, and UI redesign unless the product owner explicitly approves a larger integrated slice.

## 8. Execution Handoff

The executor receives a Command Pack containing:

- authority documents;
- mission objective;
- current runtime evidence;
- exact scope;
- constraints;
- implementation sequence;
- files to inspect first;
- acceptance criteria;
- verification commands;
- evidence return format.

The executor must report discovered conflicts before widening scope.

## 9. Runtime Evidence Loop

Approved implementation follows this loop:

1. Architect approves blueprint and gate.
2. Executor implements the approved slice.
3. Human runs the real runtime.
4. Human returns build results, screenshots, console output, and gameplay observations.
5. Architect compares evidence with contracts.
6. Architect issues a targeted patch or acceptance decision.
7. Repeat until the slice passes.

Conversation confidence does not replace runtime evidence.

## 10. Definition of Done

A mission is complete only when all required gates pass:

### Repository Gate

- approved scope is reflected in changed paths;
- ownership boundaries are clear;
- no undeclared competing renderer is introduced;
- contracts and runtime mapping remain aligned;
- repository evidence is reviewable.

### Runtime Gate

- dependencies resolve in the target environment;
- build passes;
- runtime launches;
- target scene loads;
- no blocking console or runtime error is introduced.

### Operational Gate

- required gameplay behavior works;
- camera behavior is correct;
- world interaction remains usable;
- screenshot evidence is reproducible;
- acceptance criteria pass;
- legacy overlap is removed or explicitly approved.

Repository completion alone is not Delivery completion.

## 11. Gate Record Template

```text
Mission:
Authority Documents:
Scope:
Non-Goals:
Product Alignment: PASS / FAIL
Landmark Contract: PASS / N/A / FAIL
Terrain Contract: PASS / FAIL
Composition Contract: PASS / FAIL
Camera Contract: PASS / FAIL
Asset Contract: PASS / N/A / FAIL
Lighting-Material-Color: PASS / FAIL
Runtime Ownership: PASS / FAIL
Gameplay Preservation: PASS / FAIL
Verification Plan: PASS / FAIL
Screenshot Acceptance: PASS / FAIL

Gate Result: READY / READY WITH CONDITIONS / NOT READY
Conditions:
Approved By:
Approval Evidence:
```

## 12. Change Control

Changes to this gate require an explicit reason and impact analysis across:

- Product Constitution;
- Foundation Standards;
- Landmark templates;
- runtime handoff process;
- verification process.

The gate must not be weakened merely to accelerate implementation. Its purpose is to increase implementation speed by removing ambiguity before code is written.
