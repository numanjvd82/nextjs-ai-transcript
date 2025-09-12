import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedUrl } from "@/lib/r2";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transcript = await prisma.transcript.findUnique({
      where: {
        id: Number(params.id),
      },
    });

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript not found" },
        { status: 404 }
      );
    }

    const signedUrl = await getSignedUrl(transcript.audioUrl);

    return NextResponse.json({
      ...transcript,
      audioUrl: signedUrl,
    });
  } catch (error: any) {
    console.error("Error fetching transcript:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
