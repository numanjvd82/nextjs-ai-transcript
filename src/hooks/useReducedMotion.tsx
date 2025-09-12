"use client";

import { useEffect, useState } from "react";

type ReducedMotionPreference = "reduce" | "no-preference";

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window === "undefined" || !window.matchMedia) return;

    // Check the initial value
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Set up a listener for changes
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onChange);
      return () => {
        mediaQuery.removeEventListener("change", onChange);
      };
    }
    // Older browsers
    else if ("addListener" in mediaQuery) {
      // @ts-ignore - for older browsers that don't have addEventListener
      mediaQuery.addListener(onChange);
      return () => {
        // @ts-ignore - for older browsers
        mediaQuery.removeListener(onChange);
      };
    }
  }, []);

  return prefersReducedMotion;
}
