"use client";

import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { useAuthUser } from "@/hooks/useAuthUser";
import FileUpload from "@/components/audio/AudioFileUpload";

export default function DashboardPage() {
  const { user, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-foreground/20 rounded-full border-t-foreground"></div>
      </div>
    );
  }

  if (!user) {
    redirect("/auth?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transcripts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view your AI transcripts
          </p>
        </div>

        <FileUpload />
      </main>
    </div>
  );
}
