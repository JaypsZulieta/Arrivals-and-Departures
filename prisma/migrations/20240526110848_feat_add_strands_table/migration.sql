-- CreateTable
CREATE TABLE "Strand" (
    "id" TEXT NOT NULL,
    "strandName" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Strand_strandName_key" ON "Strand"("strandName");

-- AddForeignKey
ALTER TABLE "Strand" ADD CONSTRAINT "Strand_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;
