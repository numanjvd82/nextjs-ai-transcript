"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-2">
          An unexpected error occurred. We've been notified and are working to
          fix the issue.
        </p>

        {error.digest && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Try again
          </button>

          <Link
            href="/"
            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <HomeIcon className="h-4 w-4" />
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
