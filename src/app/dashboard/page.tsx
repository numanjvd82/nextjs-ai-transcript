"use client";

import { Fragment, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { CloudArrowUpIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import useVideoToAudio from "@/hooks/useVideoToAudio";

interface User {
  id: string;
  username?: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setVideoFile, audioURL } = useVideoToAudio(null);

  // Function to handle file upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
      const fileType = file.type;
      if (fileType.startsWith("audio/")) {
        router.push("/transcript/upload");
      } else if (fileType.startsWith("video/")) {
        setVideoFile(file);
      } else {
        alert("Please upload a valid audio or video file.");
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Redirect to login if not authenticated
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        // Redirect to login if error
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-foreground/20 rounded-full border-t-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transcripts</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view your AI transcripts
          </p>
        </div>

        <div className="bg-white dark:bg-[#121212] rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] p-6 shadow-sm">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              You don't have any transcripts yet
            </p>
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors px-6 py-2 font-medium hover:bg-black/[.05] dark:hover:bg-white/[.06]">
                Create New Transcript
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg focus:outline-none z-10">
                    <div className="py-1">
                      <MenuItem>
                        {({ focus }) => (
                          <div
                            onClick={handleUploadClick}
                            className={`${
                              focus ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex w-full cursor-pointer items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            <CloudArrowUpIcon className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                            Upload Media File (.mp3, .mp4, etc)
                          </div>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ focus }) => (
                          <span
                            onClick={() => router.push("/transcript/record")}
                            className={`${
                              focus ? "bg-gray-100 dark:bg-gray-700" : ""
                            } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            <MicrophoneIcon className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                            Record Audio
                          </span>
                        )}
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </MenuButton>
            </Menu>

            {/* File input separated from the menu for better event handling */}
            <input
              ref={fileInputRef}
              id="upload-input"
              type="file"
              accept="audio/*,video/*,.mp3,.mp4,.wav,.ogg,.webm"
              className="hidden"
              onChange={handleFileChange}
            />
            <audio
              src={audioURL ? audioURL : undefined}
              controls
              className="mt-4"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
