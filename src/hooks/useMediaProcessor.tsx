"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

// Define the supported media types
const AUDIO_MIME_TYPES = [
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/webm",
];

export default function useMediaProcessor(file: File | null) {
  const [loaded, setLoaded] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(file);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Check if this is an audio file that doesn't need processing
      if (mediaFile && AUDIO_MIME_TYPES.includes(mediaFile.type)) {
        // For audio files, we can skip FFmpeg and just use the file directly
        const audio = new Audio(URL.createObjectURL(mediaFile));

        await new Promise((resolve) => {
          audio.onloadedmetadata = () => {
            console.log("Audio duration:", audio.duration);
            setDuration(audio.duration);
            resolve(true);
          };
        });

        // Create URL for the audio file
        const url = URL.createObjectURL(mediaFile);
        setAudioURL(url);
        setAudioFile(mediaFile);
        setLoaded(true);
        setIsProcessing(false);
        return;
      }

      // For video files, we need to load FFmpeg
      const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

      const ffmpeg = ffmpegRef.current;

      // Configure logs
      ffmpeg.on("log", ({ message }) => {
        console.log(message);
        if (messageRef.current) messageRef.current.innerHTML = message;
      });

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
      });
      setLoaded(true);
    } catch (err) {
      console.error("Failed to load FFmpeg:", err);
      setError(err instanceof Error ? err.message : "Failed to load FFmpeg");
    } finally {
      setIsProcessing(false);
    }
  };

  const extractAudio = async () => {
    if (!mediaFile) {
      setError("Please select a media file first");
      return null;
    }

    // If we already processed this as an audio file directly, return it
    if (audioFile) {
      return audioFile;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const ffmpeg = ffmpegRef.current;

      // Write the input file
      await ffmpeg.writeFile("input.mp4", await fetchFile(mediaFile));

      // Execute FFmpeg command
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-vn",
        "-acodec",
        "libmp3lame",
        "-q:a",
        "2",
        "output.mp3",
      ]);

      // Read the output file
      const data = await ffmpeg.readFile("output.mp3");
      const audioBlob = new Blob([data], { type: "audio/mp3" });
      const processedAudioFile = new File([audioBlob], "extracted-audio.mp3", {
        type: "audio/mp3",
      });

      if (processedAudioFile.size > 25 * 1024 * 1024) {
        setError(
          "Audio Size is too big. It should be equal or smaller than 25mb"
        );
        return null;
      }

      // create an audio instance to get duration
      const audio = new Audio(URL.createObjectURL(processedAudioFile));
      await new Promise((resolve) => {
        audio.onloadedmetadata = () => {
          console.log("Audio duration:", audio.duration);
          setDuration(audio.duration);
          resolve(true);
        };
      });

      // Create URL for the audio file
      const url = URL.createObjectURL(processedAudioFile);
      setAudioURL(url);
      setAudioFile(processedAudioFile);

      return processedAudioFile;
    } catch (err) {
      console.error("Failed to extract audio:", err);
      setError(err instanceof Error ? err.message : "Failed to extract audio");
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Only load FFmpeg when there's a file and we haven't loaded it yet
    if (mediaFile && !loaded && !isProcessing) {
      load();
    }
  }, [mediaFile, loaded, isProcessing]);

  useEffect(() => {
    // Extract audio when FFmpeg is loaded and we have a media file
    if (loaded && mediaFile && !isProcessing && !audioFile) {
      extractAudio();
    }

    // Clean up function
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [loaded, mediaFile, audioFile]);

  return {
    loaded,
    isProcessing,
    error,
    audioURL,
    messageRef,
    duration,
    setMediaFile,
    audioFile,
  };
}
