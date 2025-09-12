import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DocumentTextIcon,
  LanguageIcon,
  FaceSmileIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { getSignedUrl } from "@/lib/r2";
import SegmentedTranscript from "@/components/transcript/SegmentedTranscript";

export default async function TranscriptPage({
  params,
}: {
  params: { id: string };
}) {
  // Get the current user session
  const { id } = params;
  const session = await getServerSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth?callbackUrl=/transcript/" + id);
  }

  try {
    // Fetch transcript data server-side
    const transcript = await prisma.transcript.findUnique({
      where: {
        id: Number(id),
        userId: session.user.id, // Security: ensure user can only see their own transcripts
      },
      include: {
        segments: true, // Include segments for timestamped transcript
      },
    });

    // Return 404 if transcript not found
    if (!transcript) {
      notFound();
    }

    const audioUrl = await getSignedUrl(transcript.audioUrl);

    // Check if we have segments to show
    const hasSegments = transcript.segments && transcript.segments.length > 0;

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Transcript</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Generated on {new Date(transcript.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Total duration: {transcript.durationSec} seconds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <LanguageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold">Language</h3>
              </div>
              <p>{transcript.detectedLang}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Confidence:{" "}
                {transcript.confidenceScore
                  ? (transcript.confidenceScore * 100).toFixed(1)
                  : "N/A"}
                %
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <FaceSmileIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold">Sentiment</h3>
              </div>
              <p
                className={`font-medium ${
                  transcript.sentiment === "Positive"
                    ? "text-green-600 dark:text-green-400"
                    : transcript.sentiment === "Negative"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {transcript.sentiment}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <TagIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold">Labels</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transcript.labels &&
                  transcript.labels.map((label: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                    >
                      {label}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Use the new SegmentedTranscript component if segments exist */}
          {hasSegments && audioUrl ? (
            <SegmentedTranscript
              segments={transcript.segments}
              audioUrl={audioUrl}
            />
          ) : (
            <>
              {/* Show the original transcript content */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm mb-8">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
                  <h2 className="text-xl font-semibold">Transcript Content</h2>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="whitespace-pre-line">{transcript.content}</p>
                </div>
              </div>

              {/* Show the regular audio player if no segments */}
              {audioUrl && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Audio</h2>
                  <audio src={audioUrl} controls className="w-full" />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    );
  } catch (error) {
    // Handle errors gracefully
    console.error("Error fetching transcript:", error);

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6 flex flex-col items-center justify-center">
          <div className="text-red-500 text-lg mb-4">
            Error loading transcript
          </div>
          <a
            href="/transcript"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Transcripts
          </a>
        </main>
      </div>
    );
  }
}
