import { Prisma } from "@prisma/client";

export type Transcript = Prisma.TranscriptGetPayload<{
  select: {
    id: true;
    audioUrl: true;
    createdAt: true;
    updatedAt: true;
    userId: true;
    content: true;
    detectedLang: true;
    labels: true;
    sentiment: true;
    confidenceScore: true;
    durationSec: true;
  };
}>;
