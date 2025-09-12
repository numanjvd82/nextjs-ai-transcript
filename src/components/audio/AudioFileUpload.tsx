"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudArrowUpIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import useVideoToAudio from "@/hooks/useVideoToAudio";
import AudioExtractionModal from "@/components/modals/AudioExtractionModal";

interface AudioFileUploadProps {
  className?: string;
}

export default function AudioFileUpload({ className }: AudioFileUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtractionModalOpen, setIsExtractionModalOpen] = useState(false);
  const { setVideoFile, audioURL, isProcessing, error, messageRef } =
    useVideoToAudio(null);

  // Function to handle file upload button click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type;

      // Validation
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        alert("File size exceeds 100MB limit. Please upload a smaller file.");
        return;
      }

      if (fileType.startsWith("audio/")) {
        router.push("/transcript/upload");
      } else if (fileType.startsWith("video/")) {
        setVideoFile(file);
        setIsExtractionModalOpen(true);
      } else {
        alert("Please upload a valid audio or video file.");
      }
    }
  };

  return (
    <div className={className}>
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id="upload-input"
        type="file"
        accept="audio/*,video/*,.mp3,.mp4,.wav,.ogg,.webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview audio if available */}
      {audioURL && <audio src={audioURL} controls className="mt-4" />}

      {/* Audio Extraction Modal */}
      <AudioExtractionModal
        isOpen={isExtractionModalOpen}
        setIsOpen={setIsExtractionModalOpen}
        isProcessing={isProcessing}
        error={error}
        messageRef={messageRef}
        audioURL={audioURL}
      />
    </div>
  );
}
