import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import SplashScreen from "@/components/ui/SplashScreen";
import MotionProvider from "@/components/ui/MotionProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Transcript",
  description: "Transcribe audio and video files with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MotionProvider>
          <SplashScreen>
            <Suspense
              fallback={
                <Loading fullScreen size="large" message="Loading..." />
              }
            >
              {children}
            </Suspense>
          </SplashScreen>
        </MotionProvider>
      </body>
    </html>
  );
}
