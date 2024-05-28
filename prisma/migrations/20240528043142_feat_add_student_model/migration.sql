-- CreateTable
CREATE TABLE "Student" (
    "learnerReferenceNumber" TEXT NOT NULL,
    "guardianPhoneNumber" TEXT NOT NULL,
    "personId" INTEGER NOT NULL,
    "sectionId" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("learnerReferenceNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_personId_key" ON "Student"("personId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
