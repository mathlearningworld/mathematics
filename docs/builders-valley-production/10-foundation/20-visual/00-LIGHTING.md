# Builders Valley Lighting Standard

## Status

Foundation Contract — Active

## Purpose

Lighting establishes readability, mood, direction, and learning focus across Builders Valley. It is not a decorative post-process layer and must never compensate for weak terrain, camera, or composition.

## Core Principle

**Light guides attention before interface.**

A player should understand where to look, where to move, and which landmark matters through the world itself before relying on labels, arrows, or overlays.

## Lighting Responsibilities

Lighting must:

- separate player, route, terrain mass, and landmark;
- establish foreground, midground, and background depth;
- support the intended emotional tone of the area;
- preserve gameplay readability during movement;
- strengthen the Hero Frame without becoming a one-frame-only trick;
- remain consistent with the landmark contract and time-of-day policy.

Lighting must not:

- invent gameplay importance that is absent from the blueprint;
- hide route failure, scale failure, or composition failure;
- use excessive bloom, fog, glare, or contrast to create false quality;
- create multiple competing focal points;
- be tuned independently by multiple runtime systems.

## Lighting Hierarchy

Every landmark scene must define:

1. **Primary Read** — the first subject the player should notice.
2. **Secondary Read** — the route, interaction zone, or supporting terrain.
3. **Ambient Read** — background information that provides context without competing.

The Primary Read must remain legible in both the Hero Frame and normal player movement.

## Directional Light

The primary directional light must:

- reveal terrain shape and route boundaries;
- avoid flattening major masses;
- avoid placing the primary landmark entirely in silhouette unless explicitly required;
- maintain a stable visual direction across adjacent landmarks;
- be owned by one authoritative world-lighting runtime.

## Local Lights

Local lights are permitted only when they communicate a concrete world purpose, such as:

- workshop activity;
- inhabited shelter;
- safe rest area;
- learning interaction point;
- navigational threshold.

Local lights must not be scattered as decoration.

## Contrast Policy

Contrast must be strongest at the intended gameplay focus, but still preserve nearby route information.

Forbidden patterns:

- landmark brighter than every other object with no environmental reason;
- dark route beneath a bright decorative background;
- player blending into terrain or vegetation;
- high-frequency lighting changes that reduce movement readability;
- post-processing that clips highlights or crushes important shadow detail.

## Atmosphere and Fog

Atmosphere may support depth, distance, scale, and mood. It must not:

- obscure the playable route;
- erase landmark silhouette;
- flatten all depth layers into one tone;
- hide incomplete geometry;
- become the primary source of visual interest.

## Time-of-Day Policy

Each production slice must declare one of the following:

- fixed canonical time;
- controlled time variant;
- dynamic time-of-day.

Dynamic time-of-day is forbidden unless gameplay, verification, and screenshot acceptance explicitly support all required lighting states.

## Runtime Ownership

The world must have one authoritative owner for:

- primary directional light;
- ambient/environment light;
- global fog and atmosphere;
- exposure policy;
- shared post-processing.

Landmark runtimes may request or configure approved local lights but must not silently replace global lighting authority.

## Landmark Lighting Contract

Before implementation, each landmark must declare:

- intended mood;
- canonical time-of-day;
- Primary Read;
- required local lights;
- forbidden lighting effects;
- expected player and route visibility;
- Hero Frame lighting acceptance.

## Verification

Lighting passes when:

- the landmark is readable without UI;
- the player is visually separated from the environment;
- the route remains understandable during movement;
- foreground, midground, and background are distinct;
- lighting supports rather than replaces composition;
- no duplicate global lighting authority exists;
- screenshots match the canonical mood and focal hierarchy.

## Failure Conditions

Lighting fails when:

- removing effects reveals an unreadable composition;
- bloom or fog carries the entire visual result;
- the landmark is attractive but the route is unclear;
- the Hero Frame works while normal play does not;
- local runtime code overrides global lighting without contract authority.
