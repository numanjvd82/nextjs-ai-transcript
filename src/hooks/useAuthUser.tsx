"use client";

import { useEffect, useState } from "react";

export interface User {
  id: number;
  username?: string;
  email: string;
}

interface UseAuthUserResult {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => Promise<void>;
}

/**
 * Custom hook for getting the authenticated user
 * This hook can be used in client components to get the current user
 */
export function useAuthUser(): UseAuthUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  async function fetchUser() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/me");
      const data = await response.json();

      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const mutate = async () => {
    await fetchUser();
  };

  return { user, isLoading, error, mutate };
}
