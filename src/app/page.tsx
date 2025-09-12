"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { useAuthUser } from "@/hooks/useAuthUser";
import {
  MicrophoneIcon,
  PencilIcon,
  ShareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Loading from "@/components/ui/Loading";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();

  // Redirect authenticated users to the transcript page
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              AI Transcript
            </h1>
            <p className="text-xl mb-10 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your audio and video into searchable, editable text with
              powerful AI capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth?tab=signup"
                className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-3 text-white font-medium transition-all hover:shadow-lg hover:opacity-90"
              >
                Create Account
              </Link>
              <Link
                href="/auth?tab=login"
                className="rounded-lg border border-gray-300 dark:border-gray-700 px-8 py-3 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <MicrophoneIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                AI-Powered Transcription
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI models convert your audio into highly accurate text,
                saving you hours of manual work.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <PencilIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Editing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Intuitive editor allows you to refine transcripts with ease. Add
                timestamps, speakers, and annotations.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                <ShareIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Seamless Sharing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share transcripts securely with customizable access controls.
                Export to various formats with one click.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-10 text-center text-white max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to start transcribing?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who save time and increase
              productivity with AI Transcript.
            </p>
            <Link
              href="/auth?tab=signup"
              className="inline-block rounded-lg bg-white text-purple-600 px-8 py-3 font-medium transition-all hover:shadow-lg hover:bg-gray-100"
            >
              Get Started Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} AI Transcript. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
