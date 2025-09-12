"use client";

import Link from "next/link";
import Image from "next/image";
import UserMenu from "@/components/auth/UserMenu";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function Header() {
  const { user, isLoading } = useAuthUser();

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center">
          <div className="flex items-center text-xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              AI Transcript
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {!isLoading &&
            (user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth?tab=login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-5 rounded-lg hover:opacity-90 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}
