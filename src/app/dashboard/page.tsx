"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface User {
  id: string;
  username?: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        // Redirect to login if error
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-foreground/20 rounded-full border-t-foreground"></div>
      </div>
    );
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
            <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-6 py-2 font-medium hover:bg-black/[.05] dark:hover:bg-white/[.06]">
              Create New Transcript
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
