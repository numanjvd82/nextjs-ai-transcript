/*
  Warnings:

  - Added the required column `audioUrl` to the `Transcript` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidenceScore` to the `Transcript` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detectedLang` to the `Transcript` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durationSec` to the `Transcript` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentiment` to the `Transcript` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transcript` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Transcript_meetingId_key";

-- AlterTable
ALTER TABLE "public"."Transcript" ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "detectedLang" TEXT NOT NULL,
ADD COLUMN     "durationSec" INTEGER NOT NULL,
ADD COLUMN     "embedding" JSONB,
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "sentiment" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
