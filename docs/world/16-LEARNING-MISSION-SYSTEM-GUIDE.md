# 16 — Learning Mission System Guide

**Project:** Math Learning World  
**World:** Builder's Valley  
**Phase:** 16 — Learning Mission System  
**Document Type:** Parent Architecture / Production Contract  
**Status:** Bootstrap  
**Upstream Dependencies:** World Foundation, Environment Foundation, Phase 15 — NPC & Population System  
**Planned Child Guides:** 16A–16J

---

## 1. Purpose

This guide establishes the parent architecture for converting mathematical learning goals into playable, observable, and recoverable missions inside Builder's Valley.

The system will connect curriculum requirements, prerequisite knowledge, learner mastery, world activities, NPC participation, mission state, evidence collection, remediation, rewards, and parent or teacher visibility through one authoritative runtime model.

The central principle is:

> A learning mission is not a decorative quest with a math question attached. It is an authoritative learning progression that uses world activity to produce verifiable mathematical understanding.

---

## 2. Production Outcome

A conforming implementation must allow the game to:

- select a clear learning target;
- determine prerequisite readiness;
- generate or assign a suitable mission;
- express the mission through meaningful world activity;
- collect evidence from player actions rather than completion clicks alone;
- distinguish success, partial understanding, guessing, assistance, and failure;
- preserve learner progress deterministically across save and load;
- trigger remediation without trapping the learner in repetitive failure;
- allow above-level progression when prerequisite mastery is sufficient;
- expose understandable progress evidence to learners, parents, mentors, and teachers;
- integrate with NPC roles, schedules, conversations, reputation, events, economy, and construction without allowing those systems to redefine learning authority.

---

## 3. Initial Scope

Phase 16 will define:

- learning-target identity;
- curriculum and skill references;
- prerequisite graphs;
- learner readiness;
- mission definitions and mission instances;
- mission selection;
- world-context binding;
- task and challenge composition;
- mathematical evidence;
- hints and assistance;
- mastery updates;
- remediation loops;
- rewards and progression;
- mentor, parent, and teacher projections;
- save/load and recovery;
- telemetry and validation;
- production exit criteria.

---

## 4. Authority Boundary

The Learning Mission System owns:

- why a learning mission exists;
- which mathematical target it serves;
- what prerequisite state is required;
- what evidence counts;
- how mission learning state transitions;
- when mastery may change;
- when remediation is required;
- when a learning outcome is complete.

Other systems may provide presentation and activity surfaces, but they must not independently award mastery or declare learning completion.

---

## 5. Planned Child Guide Map

The initial Phase 16 decomposition is:

- **16A — Learning Target & Skill Graph**
- **16B — Learner Readiness & Diagnostic State**
- **16C — Mission Definition & Generation**
- **16D — World Activity Binding**
- **16E — Mathematical Evidence & Assessment**
- **16F — Hint, Assistance & Mentor Support**
- **16G — Mastery, Progression & Unlocking**
- **16H — Remediation & Recovery Loops**
- **16I — Parent, Teacher & Analytics Projection**
- **16J — Learning Mission Validation**

This map is provisional until the parent Production Guide is completed and reviewed.

---

## 6. Current State

This file is the Phase 16 bootstrap artifact. It reserves the parent authority, records the intended system boundary, and provides the starting point for the full Production Guide.
