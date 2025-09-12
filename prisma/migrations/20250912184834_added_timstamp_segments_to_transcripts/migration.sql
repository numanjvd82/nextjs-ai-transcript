-- CreateTable
CREATE TABLE "public"."Segment" (
    "id" SERIAL NOT NULL,
    "transcriptId" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "end" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Segment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Segment" ADD CONSTRAINT "Segment_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "public"."Transcript"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
