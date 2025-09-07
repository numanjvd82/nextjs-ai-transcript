"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            // Redirect to transcript page if authenticated
            router.push("/transcript");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-foreground/20 rounded-full border-t-foreground"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="font-sans grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <div className="max-w-2xl text-center sm:text-left">
            <h1 className="text-4xl font-bold mb-4">AI Transcript</h1>
            <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
              Create, manage, and analyze your AI transcripts with ease. Sign in
              to get started with your transcription journey.
            </p>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
              href="/auth"
            >
              Get Started
            </a>
            <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="https://github.com/your-username/ai-transcript"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </main>
        <footer className="flex gap-[24px] flex-wrap items-center justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 AI Transcript. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
