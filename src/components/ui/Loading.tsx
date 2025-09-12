"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
  message?: string;
}

export default function Loading({
  size = "medium",
  fullScreen = false,
  message,
}: LoadingProps) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-10 w-10",
    large: "h-16 w-16",
  };

  const content = (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <ArrowPathIcon
        className={`${sizeClasses[size]} animate-spin text-foreground`}
      />
      {message && (
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}
