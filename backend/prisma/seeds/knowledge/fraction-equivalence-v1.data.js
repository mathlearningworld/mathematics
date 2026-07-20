/**
 * ──────────────────────────────────────────────
 * Mathematics Platform — Fraction Equivalence Seed V1
 * ──────────────────────────────────────────────
 * Pure immutable seed data for the first reviewed mathematical
 * knowledge graph slice: fraction equivalence.
 *
 * CONTRACT
 * - No Prisma import
 * - No database connection
 * - No environment dependency
 * - No UUID generation
 * - No timestamps
 * - No grade, country, theme, mastery, price, credit, or age fields
 * - All records are frozen against accidental mutation
 * - Database owns UUIDs and timestamps
 * ──────────────────────────────────────────────
 */

// ── Subject ──────────────────────────────────

const subject = Object.freeze({
  code: "MATH",
  slug: "mathematics",
  internalName: "Mathematics",
  description:
    "The formal study of quantity, structure, space, pattern, relation, change, and uncertainty.",
  state: "REVIEW",
  version: 1,
});

// ── Concepts ─────────────────────────────────

const conceptA = Object.freeze({
  code: "MATH.WHOLE.MULTIPLICATIVE_RELATION",
  slug: "whole-number-multiplicative-relation",
  subjectCode: "MATH",
  internalName: "Whole Number Multiplicative Relation",
  semanticDefinition:
    "A relationship in which one quantity is composed of an integer number of equal-sized groups or is obtained by scaling another quantity by a whole-number factor.",
  boundaryNotes:
    "Includes equal groups, whole-number factors, and inverse division relationships. Excludes formal fraction equivalence.",
  state: "REVIEW",
  version: 1,
});

const conceptB = Object.freeze({
  code: "MATH.FRACTION.QUANTITY",
  slug: "fraction-quantity",
  subjectCode: "MATH",
  internalName: "Fraction as Quantity",
  semanticDefinition:
    "A fraction a/b, where a is a nonnegative integer and b is a positive integer, represents a copies of the unit fraction 1/b.",
  boundaryNotes:
    "Includes area, length, set, and number-line representations. Excludes fraction equivalence rules and arithmetic algorithms.",
  state: "REVIEW",
  version: 1,
});

const conceptC = Object.freeze({
  code: "MATH.FRACTION.EQUIVALENCE",
  slug: "fraction-equivalence",
  subjectCode: "MATH",
  internalName: "Fraction Equivalence",
  semanticDefinition:
    "Two fractions are equivalent when they denote the same quantity even though their numerators and denominators may differ.",
  boundaryNotes:
    "Includes visual equivalence, multiplicative scaling, and justification of equality. Excludes addition, subtraction, multiplication, and division of fractions.",
  state: "REVIEW",
  version: 1,
});

const concepts = Object.freeze([conceptA, conceptB, conceptC]);

// ── Skills ────────────────────────────────────

const skill1 = Object.freeze({
  code: "MATH.WHOLE.PARTITION_EQUAL_GROUPS",
  slug: "partition-into-equal-groups",
  conceptCode: "MATH.WHOLE.MULTIPLICATIVE_RELATION",
  internalName: "Partition a Quantity into Equal Groups",
  capabilityStatement:
    "Partition a whole quantity into a specified number of equal groups.",
  observableOutcome:
    "Given objects or a continuous quantity, the learner constructs equal groups and detects when groups are unequal.",
  state: "REVIEW",
  version: 1,
});

const skill2 = Object.freeze({
  code: "MATH.WHOLE.RECOGNIZE_MULTIPLICATIVE_SCALE",
  slug: "recognize-whole-number-multiplicative-scale",
  conceptCode: "MATH.WHOLE.MULTIPLICATIVE_RELATION",
  internalName: "Recognize Whole Number Multiplicative Scale",
  capabilityStatement:
    "Recognize that one quantity is a whole-number multiple of another.",
  observableOutcome:
    "Given two quantities or representations, the learner identifies and demonstrates the whole-number scale factor.",
  state: "REVIEW",
  version: 1,
});

const skill3 = Object.freeze({
  code: "MATH.FRACTION.RECOGNIZE_EQUAL_PARTITION",
  slug: "recognize-equal-partition",
  conceptCode: "MATH.FRACTION.QUANTITY",
  internalName: "Recognize Equal Partition",
  capabilityStatement:
    "Determine whether a whole has been partitioned into equal-sized parts.",
  observableOutcome:
    "The learner accepts equal partitions and rejects unequal partitions regardless of visual orientation.",
  state: "REVIEW",
  version: 1,
});

const skill4 = Object.freeze({
  code: "MATH.FRACTION.IDENTIFY_UNIT_FRACTION",
  slug: "identify-unit-fraction",
  conceptCode: "MATH.FRACTION.QUANTITY",
  internalName: "Identify a Unit Fraction",
  capabilityStatement:
    "Interpret 1/b as one part when a whole is partitioned into b equal parts.",
  observableOutcome:
    "Given a partitioned whole, the learner identifies one equal part and names its unit-fraction quantity.",
  state: "REVIEW",
  version: 1,
});

const skill5 = Object.freeze({
  code: "MATH.FRACTION.COMPOSE_FROM_UNIT_FRACTIONS",
  slug: "compose-fraction-from-unit-fractions",
  conceptCode: "MATH.FRACTION.QUANTITY",
  internalName: "Compose a Fraction from Unit Fractions",
  capabilityStatement:
    "Interpret a/b as a copies of the unit fraction 1/b.",
  observableOutcome:
    "The learner constructs or selects a quantity equal to a/b by combining a equal parts of size 1/b.",
  state: "REVIEW",
  version: 1,
});

const skill6 = Object.freeze({
  code: "MATH.FRACTION.CONNECT_REPRESENTATIONS",
  slug: "connect-fraction-representations",
  conceptCode: "MATH.FRACTION.QUANTITY",
  internalName: "Connect Fraction Representations",
  capabilityStatement:
    "Recognize the same fraction quantity across area, length, set, and symbolic representations.",
  observableOutcome:
    "The learner matches structurally different representations that denote the same fraction quantity.",
  state: "REVIEW",
  version: 1,
});

const skill7 = Object.freeze({
  code: "MATH.FRACTION.LOCATE_ON_NUMBER_LINE",
  slug: "locate-fraction-on-number-line",
  conceptCode: "MATH.FRACTION.QUANTITY",
  internalName: "Locate a Fraction on a Number Line",
  capabilityStatement:
    "Locate a/b by iterating lengths of 1/b from zero on a number line.",
  observableOutcome:
    "The learner places a fraction at the correct distance from zero and explains the equal interval size used.",
  state: "REVIEW",
  version: 1,
});

const skill8 = Object.freeze({
  code: "MATH.FRACTION.EQUIVALENCE_VISUAL",
  slug: "recognize-visual-fraction-equivalence",
  conceptCode: "MATH.FRACTION.EQUIVALENCE",
  internalName: "Recognize Visual Fraction Equivalence",
  capabilityStatement:
    "Determine that two fraction representations cover or locate the same quantity despite different partitions.",
  observableOutcome:
    "The learner overlays, aligns, partitions, or measures two models to demonstrate that they represent the same quantity.",
  state: "REVIEW",
  version: 1,
});

const skill9 = Object.freeze({
  code: "MATH.FRACTION.EQUIVALENCE_SCALE",
  slug: "generate-equivalent-fraction-by-scaling",
  conceptCode: "MATH.FRACTION.EQUIVALENCE",
  internalName: "Generate an Equivalent Fraction by Scaling",
  capabilityStatement:
    "Generate an equivalent fraction by multiplying numerator and denominator by the same nonzero whole number.",
  observableOutcome:
    "The learner transforms a/b into ka/kb and connects the symbolic transformation to repartitioning the same quantity.",
  state: "REVIEW",
  version: 1,
});

const skill10 = Object.freeze({
  code: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
  slug: "justify-fraction-equivalence",
  conceptCode: "MATH.FRACTION.EQUIVALENCE",
  internalName: "Justify Fraction Equivalence",
  capabilityStatement:
    "Justify whether two fractions are equivalent using quantity, representation, number-line position, or multiplicative structure.",
  observableOutcome:
    "For a previously unseen pair of fractions, the learner produces valid evidence for equivalence or non-equivalence rather than relying only on a memorized rule.",
  state: "REVIEW",
  version: 1,
});

const skills = Object.freeze([
  skill1,
  skill2,
  skill3,
  skill4,
  skill5,
  skill6,
  skill7,
  skill8,
  skill9,
  skill10,
]);

// ── Dependencies ──────────────────────────────

const dep1 = Object.freeze({
  prerequisiteSkillCode: "MATH.WHOLE.PARTITION_EQUAL_GROUPS",
  dependentSkillCode: "MATH.FRACTION.RECOGNIZE_EQUAL_PARTITION",
  kind: "REQUIRED",
  rationale:
    "Learners must be able to partition a whole into equal groups before they can recognize whether a partition is equal.",
  state: "REVIEW",
  version: 1,
});

const dep2 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.RECOGNIZE_EQUAL_PARTITION",
  dependentSkillCode: "MATH.FRACTION.IDENTIFY_UNIT_FRACTION",
  kind: "REQUIRED",
  rationale:
    "Recognizing equal partitions is a prerequisite for identifying a single equal part as a unit fraction.",
  state: "REVIEW",
  version: 1,
});

const dep3 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.IDENTIFY_UNIT_FRACTION",
  dependentSkillCode: "MATH.FRACTION.COMPOSE_FROM_UNIT_FRACTIONS",
  kind: "REQUIRED",
  rationale:
    "Learners must understand a unit fraction before they can compose a non-unit fraction from copies of that unit fraction.",
  state: "REVIEW",
  version: 1,
});

const dep4 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.COMPOSE_FROM_UNIT_FRACTIONS",
  dependentSkillCode: "MATH.FRACTION.CONNECT_REPRESENTATIONS",
  kind: "REQUIRED",
  rationale:
    "Composing fractions from unit fractions provides the foundation for recognizing the same quantity across different representations.",
  state: "REVIEW",
  version: 1,
});

const dep5 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.COMPOSE_FROM_UNIT_FRACTIONS",
  dependentSkillCode: "MATH.FRACTION.LOCATE_ON_NUMBER_LINE",
  kind: "REQUIRED",
  rationale:
    "Understanding a fraction as composed unit fractions is necessary to iterate unit intervals on a number line.",
  state: "REVIEW",
  version: 1,
});

const dep6 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.CONNECT_REPRESENTATIONS",
  dependentSkillCode: "MATH.FRACTION.EQUIVALENCE_VISUAL",
  kind: "REQUIRED",
  rationale:
    "Connecting representations prepares learners to compare quantities across different partitions, which is the foundation of visual equivalence.",
  state: "REVIEW",
  version: 1,
});

const dep7 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.EQUIVALENCE_VISUAL",
  dependentSkillCode: "MATH.FRACTION.EQUIVALENCE_SCALE",
  kind: "REQUIRED",
  rationale:
    "Visual equivalence provides the concrete intuition that scaling numerator and denominator preserves quantity.",
  state: "REVIEW",
  version: 1,
});

const dep8 = Object.freeze({
  prerequisiteSkillCode: "MATH.WHOLE.RECOGNIZE_MULTIPLICATIVE_SCALE",
  dependentSkillCode: "MATH.FRACTION.EQUIVALENCE_SCALE",
  kind: "REQUIRED",
  rationale:
    "Recognizing whole-number multiplicative scaling is necessary to understand that multiplying numerator and denominator by the same factor preserves the fraction quantity.",
  state: "REVIEW",
  version: 1,
});

const dep9 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.EQUIVALENCE_SCALE",
  dependentSkillCode: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
  kind: "REQUIRED",
  rationale:
    "Learners must be able to generate equivalent fractions before they can justify equivalence or non-equivalence for arbitrary pairs.",
  state: "REVIEW",
  version: 1,
});

const dep10 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.LOCATE_ON_NUMBER_LINE",
  dependentSkillCode: "MATH.FRACTION.EQUIVALENCE_VISUAL",
  kind: "SUPPORTING",
  rationale:
    "Number-line positioning provides an alternative visual foundation for recognizing that two fractions occupy the same point.",
  state: "REVIEW",
  version: 1,
});

const dep11 = Object.freeze({
  prerequisiteSkillCode: "MATH.FRACTION.LOCATE_ON_NUMBER_LINE",
  dependentSkillCode: "MATH.FRACTION.JUSTIFY_EQUIVALENCE",
  kind: "SUPPORTING",
  rationale:
    "Number-line position offers a complementary justification strategy for equivalence beyond symbolic scaling.",
  state: "REVIEW",
  version: 1,
});

const dependencies = Object.freeze([
  dep1,
  dep2,
  dep3,
  dep4,
  dep5,
  dep6,
  dep7,
  dep8,
  dep9,
  dep10,
  dep11,
]);

// ── Exported Seed ─────────────────────────────

/**
 * The complete Fraction Equivalence V1 knowledge seed.
 * This is the only public export from this module.
 */
export const fractionKnowledgeSeedV1 = Object.freeze({
  seedCode: "FRACTION_EQUIVALENCE_V1",
  version: 1,
  subject,
  concepts,
  skills,
  dependencies,
});
