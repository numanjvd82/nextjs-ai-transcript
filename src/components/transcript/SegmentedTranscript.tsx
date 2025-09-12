"use client";

import { useRef, useState, useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { TranscriptSegment } from "@/lib/types/model";
import dayjs from "dayjs";
import { formatTime } from "@/lib/helpers";

interface SegmentedTranscriptProps {
  segments: TranscriptSegment[];
  audioUrl: string;
}

export default function SegmentedTranscript({
  segments,
  audioUrl,
}: SegmentedTranscriptProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);

  // Safely get segment time
  const getSegmentTime = (time: number | null | undefined) => {
    return typeof time === "number" && isFinite(time) ? time : 0;
  };

  // Play from a specific timestamp
  const playFromTimestamp = (
    startTime: number | null | undefined,
    segmentId: number
  ) => {
    if (!audioRef.current) return;

    // Ensure we have a valid time
    const safeTime = getSegmentTime(startTime);

    // Ensure the time is within the valid range
    const safeCurrentTime = Math.min(Math.max(0, safeTime), duration || 0);

    audioRef.current.currentTime = safeCurrentTime;
    audioRef.current.play().catch((err) => {
      console.error("Error playing audio:", err);
    });

    setIsPlaying(true);
    setActiveSegmentId(segmentId);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
      });
    }

    setIsPlaying(!isPlaying);
  };

  // Update current time and active segment
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Find the active segment based on current time
      const activeSegment = segments.find((segment) => {
        const startTime = getSegmentTime(segment.start);
        const endTime = getSegmentTime(segment.end);
        return audio.currentTime >= startTime && audio.currentTime <= endTime;
      });

      if (activeSegment) {
        setActiveSegmentId(activeSegment.id);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setActiveSegmentId(null);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [segments]);

  // Remove console.log in production
  console.log(currentTime, isPlaying, activeSegmentId);

  return (
    <div className="flex flex-col space-y-6">
      {/* Custom audio player */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </button>

          <div className="flex-1">
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-purple-600 rounded-full"
                style={{
                  width: `${
                    duration > 0 ? (currentTime / duration) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Hidden native audio element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          preload="metadata"
          onError={(e) => console.error("Audio error:", e)}
        />
      </div>

      {/* Segmented transcript */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Transcript with Timestamps
        </h2>

        <div className="space-y-4">
          {segments && segments.length > 0 ? (
            segments.map((segment) => (
              <div
                key={segment.id}
                className={`p-3 rounded-lg transition-colors ${
                  activeSegmentId === segment.id
                    ? "bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-600"
                    : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <button
                    onClick={() => playFromTimestamp(segment.start, segment.id)}
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline focus:outline-none"
                  >
                    {formatTime(segment.start)} - {formatTime(segment.end)}
                  </button>
                </div>
                <p className="text-gray-800 dark:text-gray-200">
                  {segment.text || "No text available"}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No segmented transcript available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
