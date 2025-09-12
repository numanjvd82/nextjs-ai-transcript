import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import {
  DocumentTextIcon,
  CalendarIcon,
  LanguageIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/helpers";

export default async function TranscriptList() {
  // Get the current user session
  const session = await getServerSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth?callbackUrl=/transcript");
  }

  try {
    // Fetch only transcripts belonging to the current user
    const transcripts = await prisma.transcript.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        content: true,
        detectedLang: true,
        labels: true,
        createdAt: true,
        sentiment: true,
        confidenceScore: true,
        // Only select fields we need for display
      },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Transcripts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your transcribed content
            </p>
          </div>

          {transcripts.length === 0 ? (
            <div className="bg-white dark:bg-[#121212] rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-12 shadow-sm text-center">
              <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                You don't have any transcripts yet
              </p>
              <Link
                href="/dashboard"
                className="inline-block rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-6 py-2 font-medium hover:bg-black/[.05] dark:hover:bg-white/[.06]"
              >
                Create New Transcript
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transcripts.map((transcript, i) => (
                <Link
                  href={`/transcript/${transcript.id}`}
                  key={transcript.id}
                  className="block bg-white dark:bg-[#121212] rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold mb-3 line-clamp-1">
                        {`Transcript ${i + 1}`}
                      </h2>
                      <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs font-medium">
                        {transcript.detectedLang || "Unknown"}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                      {transcript.content.substring(0, 120)}
                      {transcript.content.length > 120 ? "..." : ""}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {transcript.labels &&
                        transcript.labels.slice(0, 3).map((label, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                          >
                            {label}
                          </span>
                        ))}
                      {transcript.labels && transcript.labels.length > 3 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          +{transcript.labels.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>
                          {formatDate(transcript.createdAt, "MMM D, YYYY")}
                        </span>
                      </div>

                      {transcript.sentiment && (
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            transcript.sentiment === "positive"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                              : transcript.sentiment === "negative"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {transcript.sentiment.charAt(0).toUpperCase() +
                            transcript.sentiment.slice(1)}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch transcripts:", error);

    // Error state UI
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Transcripts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your transcribed content
            </p>
          </div>

          <div className="bg-white dark:bg-[#121212] rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-12 shadow-sm text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Unable to load transcripts
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              There was an error retrieving your transcripts. Please try again
              later.
            </p>
            <Link
              href="/dashboard"
              className="inline-block rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-6 py-2 font-medium hover:bg-black/[.05] dark:hover:bg-white/[.06]"
            >
              Return to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }
}
