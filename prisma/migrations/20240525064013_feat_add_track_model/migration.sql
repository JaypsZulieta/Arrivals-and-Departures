-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "trackName" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Track_trackName_key" ON "Track"("trackName");
