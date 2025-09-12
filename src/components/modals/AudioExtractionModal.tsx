"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Transcript } from "@/lib/types/model";

interface AudioExtractionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isProcessing: boolean;
  error: string | null;
  messageRef: React.RefObject<HTMLParagraphElement | null>;
  audioURL: string | null;
  duration: number | null; // in seconds
}

export default function AudioExtractionModal({
  isOpen,
  setIsOpen,
  isProcessing,
  error,
  messageRef,
  audioURL,
  duration,
}: AudioExtractionModalProps) {
  const router = useRouter();
  const initialFocusRef = useRef(null);
  const [transcriptResult, setTranscriptResult] = useState<Transcript | null>(
    null
  );
  const [uploadingTranscript, setUploadingTranscript] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [requestAttempted, setRequestAttempted] = useState(false);

  // Send audio to API when extraction is complete
  useEffect(() => {
    // Only attempt to send once and only if we have an audioURL
    if (
      audioURL &&
      !isProcessing &&
      !transcriptResult &&
      !uploadingTranscript &&
      !uploadError &&
      !requestAttempted
    ) {
      setRequestAttempted(true);
      sendAudioToAPI(audioURL);
    }
  }, [
    audioURL,
    isProcessing,
    transcriptResult,
    uploadingTranscript,
    uploadError,
    requestAttempted,
  ]);

  // Function to fetch the audio file and send it to the API
  const sendAudioToAPI = async (url: string) => {
    try {
      setUploadingTranscript(true);
      setUploadError(null);

      // Fetch the audio blob from the URL
      const response = await fetch(url);
      const blob = await response.blob();

      // Create a file from the blob
      const audioFile = new File([blob], "extracted-audio.mp3", {
        type: "audio/mp3",
      });

      // Create form data
      const formData = new FormData();
      formData.append("audioFile", audioFile);
      if (duration) {
        formData.append("durationSec", duration.toString());
      }

      // Send to API
      const apiResponse = await fetch("/api/transcripts", {
        method: "POST",
        body: formData,
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "Failed to upload transcript");
      }

      const data = await apiResponse.json();
      setTranscriptResult(data);

      // Redirect to transcript page after successful upload
      setTimeout(() => {
        setIsOpen(false);
        router.push(`/transcript/${data.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error sending audio to API:", err);
      setUploadError(
        err instanceof Error ? err.message : "Failed to process transcript"
      );
    } finally {
      setUploadingTranscript(false);
    }
  };

  // Function to handle retry
  const handleRetry = () => {
    setRequestAttempted(false);
    setUploadError(null);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          // Only allow closing if we're not processing
          if (!isProcessing && !uploadingTranscript) {
            setIsOpen(false);
          }
        }}
        initialFocus={initialFocusRef}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  ref={initialFocusRef}
                >
                  {transcriptResult
                    ? "Transcription Complete"
                    : uploadingTranscript
                    ? "Processing Transcript"
                    : audioURL
                    ? "Audio Extraction Complete"
                    : "Extracting Audio"}
                </Dialog.Title>

                <div className="mt-4">
                  {/* Audio Extraction Processing */}
                  {isProcessing && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <ArrowPathIcon className="h-12 w-12 animate-spin text-purple-600" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Extracting audio from your video file...
                      </p>
                      <p
                        ref={messageRef}
                        className="text-xs text-gray-400 dark:text-gray-500 max-w-full overflow-hidden text-ellipsis"
                      ></p>
                    </div>
                  )}

                  {/* Transcription Processing */}
                  {uploadingTranscript && !isProcessing && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <ArrowPathIcon className="h-12 w-12 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Processing transcript with AI...
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        This may take a few moments. We're analyzing the audio
                        content.
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {(error || uploadError) && (
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <XCircleIcon className="h-12 w-12 text-red-500" />
                      </div>
                      <p className="text-red-500 dark:text-red-400 mb-4">
                        {error || uploadError}
                      </p>
                      <div className="flex space-x-3 justify-center">
                        {uploadError && (
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={handleRetry}
                          >
                            Retry
                          </button>
                        )}
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Audio Extraction Complete */}
                  {audioURL &&
                    !isProcessing &&
                    !uploadingTranscript &&
                    !transcriptResult &&
                    !error &&
                    !uploadError && (
                      <div className="text-center">
                        <p className="text-green-500 dark:text-green-400 mb-4">
                          Audio successfully extracted!
                        </p>
                        <div className="flex justify-center">
                          <PlusIcon className="h-8 w-8 animate-pulse text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                          Starting transcription process...
                        </p>
                      </div>
                    )}

                  {/* Transcription Complete */}
                  {transcriptResult && !error && !uploadError && (
                    <div className="text-center">
                      <p className="text-green-500 dark:text-green-400 mb-4">
                        Transcription successfully completed!
                      </p>
                      <div className="flex justify-center">
                        <CheckCircleIcon className="h-8 w-8 animate-bounce text-purple-600" />
                      </div>

                      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Language:
                          </span>
                          <span className="ml-2 text-sm">
                            {transcriptResult.detectedLang} (
                            {(transcriptResult.confidenceScore * 100).toFixed(
                              1
                            )}
                            %)
                          </span>
                        </div>
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Sentiment:
                          </span>
                          <span className="ml-2 text-sm">
                            {transcriptResult.sentiment}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Labels:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {transcriptResult.labels.map((label, index) => (
                              <span
                                key={index}
                                className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Redirecting to transcript page...
                      </p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
