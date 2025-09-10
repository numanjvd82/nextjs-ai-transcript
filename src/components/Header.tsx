"use client";

import Link from "next/link";
import Image from "next/image";
import UserMenu from "@/components/auth/UserMenu";
import { useEffect, useState } from "react";

interface User {
  id: string;
  username?: string;
  email: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-solid border-black/[.08] dark:border-white/[.145] bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={24}
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          {!isLoading &&
            (user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth?tab=login"
                  className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="text-sm font-medium bg-foreground text-background py-1.5 px-4 rounded-full hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            ))}
        </div>
      </div>
    </header>
  );
}
