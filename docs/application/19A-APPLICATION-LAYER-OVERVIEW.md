# 19A — Application Layer Overview

## 1. Purpose

This document defines the architectural contract for the Application Layer in Math Learning World.

The Application Layer coordinates use cases, orchestrates domain objects, manages transaction boundaries, and exposes application capabilities without containing business rules.

## 2. Scope

This document defines:
- responsibilities of the Application Layer;
- interaction with Presentation, Domain, and Infrastructure layers;
- command/query orchestration;
- transaction boundaries;
- dependency rules;
- application principles;
- anti-patterns;
- completion criteria.

## 3. Core Principle

> The Application Layer orchestrates business behavior but does not own business knowledge.
