"use client";

import { ReactNode } from "react";
import { LazyMotion } from "motion/react";

// This function dynamically imports the motion features
// which reduces the initial bundle size
const loadFeatures = () =>
  import("@/lib/motion/features").then((res) => res.default);

interface MotionProviderProps {
  children: ReactNode;
}

export default function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}
