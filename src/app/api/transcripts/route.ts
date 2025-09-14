import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { r2 } from "@/lib/r2";
import { streamAudioTranscription } from "@/lib/langchain/utils/stream";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { analysisChain } from "@/lib/langchain/chains/transcriptAnalysis";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const audioFile = formData.get("audioFile") as File;
    const durationSec = Number(formData.get("durationSec") || 0);

    if (!audioFile || durationSec <= 0) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Save to R2
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `audio/${Date.now()}-${audioFile.name}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: audioFile.type,
      })
    );

    // --- Transcription (streamed upload) ---
    const transcription = await streamAudioTranscription(audioFile);
    const content = transcription.text;
    const segments =
      (transcription as any).segments?.map((s: any) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      })) ?? [];

    // --- Combined Analysis Chain ---
    const analysis = await analysisChain.invoke({ text: content });

    const detectedLang = analysis.detectedLanguage;
    const confidenceScore = analysis.confidence;
    const sentiment = analysis.sentiment;
    const labels = analysis.labels;

    // --- Save to DB ---
    const transcript = await prisma.transcript.create({
      data: {
        meetingId: undefined,
        userId: session.user.id,
        content,
        audioUrl: key,
        detectedLang,
        confidenceScore,
        sentiment,
        labels,
        durationSec,
        segments: {
          createMany: { data: segments },
        },
      },
      include: { segments: true },
    });

    return NextResponse.json(transcript, { status: 201 });
  } catch (err: any) {
    console.error("Transcription Error:", err);
    return NextResponse.json(
      { error: err.message || "Something Went wrong! Please try again" },
      { status: 500 }
    );
  }
}
