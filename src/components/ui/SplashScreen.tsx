"use client";

import { useEffect, useState } from "react";
import { LazyMotion, m, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// This function dynamically imports the motion features
// which reduces the initial bundle size
const loadFeatures = () =>
  import("@/lib/motion/features").then((res) => res.default);

interface SplashScreenProps {
  children: React.ReactNode;
  minimumLoadingTimeMs?: number;
}

export default function SplashScreen({
  children,
  minimumLoadingTimeMs = 1500,
}: SplashScreenProps) {
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Ensure splash screen shows for at least the minimum time
    const timer = setTimeout(() => {
      setLoading(false);
    }, minimumLoadingTimeMs);

    return () => clearTimeout(timer);
  }, [minimumLoadingTimeMs]);

  return (
    <LazyMotion features={loadFeatures}>
      <AnimatePresence mode="wait">
        {loading ? (
          <m.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50"
          >
            <m.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.2, 1],
                      rotate: [0, 0, 0],
                      opacity: [0.8, 1, 0.8],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mb-8"
            >
              <div className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                AI Transcript
              </div>
            </m.div>

            <m.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scaleY: [1, 0.8, 1],
                      opacity: [0.3, 1, 0.3],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse",
              }}
              className="flex gap-2"
            >
              <span className="block w-3 h-3 rounded-full bg-purple-600"></span>
              <span className="block w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="block w-3 h-3 rounded-full bg-blue-500"></span>
            </m.div>
          </m.div>
        ) : (
          <m.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
