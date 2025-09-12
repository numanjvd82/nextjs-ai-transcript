"use client";

import { useState, useRef } from "react";
import { redirect, useRouter } from "next/navigation";
import Header from "@/components/Header";
import useVideoToAudio from "@/hooks/useVideoToAudio";
import { useAuthUser } from "@/hooks/useAuthUser";
import AudioFileUpload from "@/components/audio/AudioFileUpload";

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

        <div className="bg-white dark:bg-[#121212] rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 shadow-sm">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              You don't have any transcripts yet
            </p>

            <AudioFileUpload />
          </div>
        </div>
      </main>
    </div>
  );
}
