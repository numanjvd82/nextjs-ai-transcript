"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface AudioExtractionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isProcessing: boolean;
  error: string | null;
  messageRef: React.RefObject<HTMLParagraphElement | null>;
  audioURL: string | null;
}

export default function AudioExtractionModal({
  isOpen,
  setIsOpen,
  isProcessing,
  error,
  messageRef,
  audioURL,
}: AudioExtractionModalProps) {
  const router = useRouter();
  const initialFocusRef = useRef(null);

  // When audio is ready, close modal and redirect to transcript page
  useEffect(() => {
    if (audioURL && !isProcessing) {
      // Short delay to show completion
      const timer = setTimeout(() => {
        setIsOpen(false);
        // router.push("/transcript/upload");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [audioURL, isProcessing, setIsOpen, router]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {}} // Prevent closing while processing
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
                  {audioURL ? "Audio Extraction Complete" : "Extracting Audio"}
                </Dialog.Title>

                <div className="mt-4">
                  {isProcessing && (
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Extracting audio from your video file...
                      </p>
                      <p
                        ref={messageRef}
                        className="text-xs text-gray-400 dark:text-gray-500 max-w-full overflow-hidden text-ellipsis"
                      ></p>
                    </div>
                  )}

                  {error && (
                    <div className="text-center">
                      <p className="text-red-500 dark:text-red-400">{error}</p>
                      <button
                        type="button"
                        className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {audioURL && !isProcessing && (
                    <div className="text-center">
                      <p className="text-green-500 dark:text-green-400 mb-4">
                        Audio successfully extracted!
                      </p>
                      <div className="flex justify-center">
                        <div className="h-8 w-8 animate-bounce text-purple-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
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
