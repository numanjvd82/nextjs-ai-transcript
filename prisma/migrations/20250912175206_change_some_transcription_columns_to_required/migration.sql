/*
  Warnings:

  - Made the column `detectedLang` on table `Transcript` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sentiment` on table `Transcript` required. This step will fail if there are existing NULL values in that column.
  - Made the column `confidenceScore` on table `Transcript` required. This step will fail if there are existing NULL values in that column.
  - Made the column `durationSec` on table `Transcript` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Transcript" ALTER COLUMN "detectedLang" SET NOT NULL,
ALTER COLUMN "sentiment" SET NOT NULL,
ALTER COLUMN "confidenceScore" SET NOT NULL,
ALTER COLUMN "durationSec" SET NOT NULL;
