# 18C — Value Objects

## Purpose
Define immutable value objects used by the Math Learning World domain.

## Principles
- Immutable
- Equality by value
- No identity
- Self-validating

## Candidate Value Objects
- SkillId
- MissionId
- GradeLevel
- Difficulty
- LearningProgress
- MasteryScore
- RewardAmount
- Coordinate2D
- TimeWindow

## Design Rules
- No persistence concerns.
- No infrastructure dependencies.
- Encapsulate validation and invariants.
- Reusable across aggregates.
