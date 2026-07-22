# Builders Valley Color Standard

## Status

Foundation Contract — Active

## Purpose

Color establishes visual hierarchy, emotional tone, environmental identity, and gameplay meaning across Builders Valley.

## Core Principle

**Color communicates before it decorates.**

Every dominant color decision must support at least one of these responsibilities:

- guide attention;
- identify an environment or landmark family;
- communicate safety, activity, or progression;
- separate player, route, terrain, and interaction;
- reinforce the learning or narrative purpose of a place.

## Color Hierarchy

Each scene must define:

1. **Dominant Field** — the broad environmental color family.
2. **Supporting Field** — secondary terrain and structural colors.
3. **Gameplay Accent** — limited color used for interaction, route, or focal meaning.
4. **Critical State Color** — reserved color for warnings, failure, or exceptional state.

Gameplay accents must remain scarce enough to retain meaning.

## Semantic Color Families

The following meanings are directional standards, not rigid single-value palettes:

### Natural Green

Communicates growth, safe exploration, vegetation, and living terrain.

It must not automatically imply interactability.

### Earth and Stone

Communicates stability, terrain mass, age, support, and construction foundation.

Value separation is required where route and cliff share related hues.

### Water Blue

Communicates water, calm, distance, and environmental cooling.

Blue must not be used indiscriminately for generic interactive objects.

### Warm Craft Tones

Warm amber, orange, and controlled red-brown communicate workshops, making, human presence, and inhabited spaces.

They may become focal accents only when the place has a crafted or active purpose.

### Learning Accent

Learning artifacts may use a controlled accent family that remains recognizable across landmarks without making the entire world look like interface chrome.

### Warning and Failure

High-alert colors must be reserved for real danger, invalid action, or urgent state. They must not be consumed by ordinary decoration.

## Value Before Hue

A scene must remain readable when viewed in grayscale.

Value structure must establish:

- player separation;
- route clarity;
- landmark prominence;
- foreground and background distinction;
- readable interaction zones.

Hue differences alone are insufficient for critical gameplay communication.

## Saturation Policy

Saturation is a limited production resource.

Highest saturation should normally belong to the intended gameplay focus or meaningful local story element.

Forbidden patterns:

- equally saturated terrain, props, player, and landmark;
- saturated background competing with the route;
- global saturation used to compensate for weak lighting;
- random bright props with no semantic purpose.

## Landmark Identity

Each landmark may define a local palette identity, but it must remain compatible with the global world palette.

A landmark palette must declare:

- dominant environmental family;
- structural family;
- gameplay accent;
- prohibited accent conflicts;
- transition behavior from adjacent zones.

Adjacent landmarks must transition through terrain, atmosphere, vegetation, or structure rather than abrupt unexplained palette replacement.

## Accessibility

Critical states and interactions must not depend on color alone.

They must also use one or more of:

- shape;
- position;
- motion;
- iconography;
- material response;
- sound;
- text where necessary.

Color review must include common color-vision limitations and low-contrast display conditions.

## Lighting Relationship

Color must be approved under canonical lighting, not only under neutral asset-preview lighting.

Lighting may shift mood, but must not destroy semantic distinctions or make canonical material families unrecognizable.

## Runtime Ownership

Global palette tokens, post-processing color policy, exposure, and grading must have one authoritative owner.

Landmark modules may select approved palette roles but must not introduce private grading systems or silent global overrides.

## Verification

Color passes when:

- the Primary Read is immediately visible;
- route and player remain distinct from terrain;
- semantic accents retain consistent meaning;
- grayscale readability remains acceptable;
- saturation is controlled;
- adjacent zones transition coherently;
- critical information remains understandable without color alone.

## Failure Conditions

Color fails when:

- decorative accents compete with gameplay focus;
- palette meaning changes between landmarks without contract justification;
- route readability depends only on hue;
- grading hides material or lighting problems;
- multiple runtime systems control global color independently.
