-- CreateEnum
CREATE TYPE "knowledge_state" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'RETIRED');

-- CreateEnum
CREATE TYPE "skill_dependency_kind" AS ENUM ('REQUIRED', 'SUPPORTING');

-- CreateTable
CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "internal_name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "state" "knowledge_state" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concepts" (
    "id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "code" VARCHAR(120) NOT NULL,
    "slug" VARCHAR(160) NOT NULL,
    "internal_name" VARCHAR(200) NOT NULL,
    "semantic_definition" TEXT NOT NULL,
    "boundary_notes" TEXT,
    "state" "knowledge_state" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "concept_id" UUID NOT NULL,
    "code" VARCHAR(180) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "internal_name" VARCHAR(240) NOT NULL,
    "capability_statement" TEXT NOT NULL,
    "observable_outcome" TEXT NOT NULL,
    "state" "knowledge_state" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_dependencies" (
    "id" UUID NOT NULL,
    "prerequisite_skill_id" UUID NOT NULL,
    "dependent_skill_id" UUID NOT NULL,
    "kind" "skill_dependency_kind" NOT NULL DEFAULT 'REQUIRED',
    "rationale" TEXT NOT NULL,
    "state" "knowledge_state" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "skill_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");

-- CreateIndex
CREATE INDEX "subjects_state_idx" ON "subjects"("state");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_code_key" ON "concepts"("code");

-- CreateIndex
CREATE INDEX "concepts_subject_id_state_idx" ON "concepts"("subject_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_subject_id_slug_key" ON "concepts"("subject_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "skills_code_key" ON "skills"("code");

-- CreateIndex
CREATE INDEX "skills_concept_id_state_idx" ON "skills"("concept_id", "state");

-- CreateIndex
CREATE UNIQUE INDEX "skills_concept_id_slug_key" ON "skills"("concept_id", "slug");

-- CreateIndex
CREATE INDEX "skill_dependencies_dependent_skill_id_kind_state_idx" ON "skill_dependencies"("dependent_skill_id", "kind", "state");

-- CreateIndex
CREATE INDEX "skill_dependencies_prerequisite_skill_id_kind_state_idx" ON "skill_dependencies"("prerequisite_skill_id", "kind", "state");

-- CreateIndex
CREATE UNIQUE INDEX "skill_dependencies_prerequisite_skill_id_dependent_skill_id_key" ON "skill_dependencies"("prerequisite_skill_id", "dependent_skill_id");

-- AddForeignKey
ALTER TABLE "concepts" ADD CONSTRAINT "concepts_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "concepts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_dependencies" ADD CONSTRAINT "skill_dependencies_prerequisite_skill_id_fkey" FOREIGN KEY ("prerequisite_skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_dependencies" ADD CONSTRAINT "skill_dependencies_dependent_skill_id_fkey" FOREIGN KEY ("dependent_skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
