-- CreateEnum
CREATE TYPE "GradeLevel" AS ENUM ('G11', 'G12');

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "gradeLevel" "GradeLevel" NOT NULL,
    "strandId" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_sectionName_key" ON "Section"("sectionName");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_strandId_fkey" FOREIGN KEY ("strandId") REFERENCES "Strand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
