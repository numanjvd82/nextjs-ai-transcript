import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { groq } from "@/lib/groq";
import { getServerSession } from "@/lib/auth";

type LanguageDetection = {
  language: string;
  confidence: number;
};

type SentimentAnalysis = {
  sentiment: "Positive" | "Neutral" | "Negative";
  labels: string[];
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return;
    const formData = await req.formData();
    const file = formData.get("audioFile") as File;
    const durationSec = Number(formData.get("durationSec") || 0);

    if (!file || durationSec <= 0) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const key = `audio/${Date.now()}-${file.name}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // ---- 2. Transcription with Groq Whisper ----
    const transcription = await groq.audio.transcriptions.create({
      file: new File([buffer], file.name, { type: "audio/mpeg" }),
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    const content = transcription.text;
    // If segments are inside 'transcription', use the correct property name
    const segments =
      (transcription as any).segments?.map((s: any) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      })) ?? [];

    const getSentimentRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
        You are a strict language detection system. 
        Your only job is to detect the language of the given text.
        Respond ONLY in valid JSON with the following structure:

        {
          "language": "<Detected language name in English>",
          "confidence": <number between 0 and 1, 2 decimal places>
        }

        Example:
        {
          "language": "English",
          "confidence": 0.97
        }
      `,
        },
        { role: "user", content },
      ],
      response_format: { type: "json_object" },
    });

    const sentimentAnalysisRes = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
        You are a strict sentiment classifier. 
        Your only job is to classify the text sentiment and assign descriptive labels.
        Respond ONLY in valid JSON with the following structure:

        {
          "sentiment": "Positive" | "Neutral" | "Negative",
          "labels": ["<short-label-1>", "<short-label-2>", ...]
        }

        Rules:
        - sentiment must be EXACTLY "Positive", "Neutral", or "Negative"
        - labels must be a short array (1–5 items) of lowercase, dash-separated tags
        - keep labels meaningful but concise

        Example:
        {
          "sentiment": "Negative",
          "labels": ["customer-complaint", "billing-issue"]
        }
      `,
        },
        { role: "user", content },
      ],
      response_format: { type: "json_object" },
    });

    if (
      !getSentimentRes.choices[0]?.message?.content ||
      !sentimentAnalysisRes.choices[0]?.message?.content
    ) {
      return NextResponse.json(
        { error: "Failed to analyze transcript" },
        { status: 500 }
      );
    }

    // Extract language detection result
    const langMsg = getSentimentRes.choices[0]?.message?.content;
    const langResult: LanguageDetection = JSON.parse(langMsg);

    // Extract sentiment analysis result
    const sentimentMsg = sentimentAnalysisRes.choices[0]?.message?.content;
    const sentimentResult: SentimentAnalysis = JSON.parse(sentimentMsg);

    // Extract safely
    const detectedLang = langResult?.language;
    const confidenceScore = langResult?.confidence;
    const sentiment = sentimentResult?.sentiment;
    const labels = sentimentResult?.labels ?? [];

    // ---- 5. Save to DB ----
    const transcript = await prisma.transcript.create({
      data: {
        meetingId: undefined,
        userId: session.user.id,
        content,
        audioUrl: key,
        detectedLang: detectedLang,
        confidenceScore,
        sentiment,
        labels,
        durationSec,
        segments: {
          createMany: { data: segments },
        },
      },
      include: {
        segments: true,
      },
    });

    return NextResponse.json(transcript, { status: 201 });
  } catch (error: any) {
    console.error("Error processing transcript:", {
      error: error,
      stack: error?.stack,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
