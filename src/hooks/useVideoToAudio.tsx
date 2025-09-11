"use client";

import { useState, useRef, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export default function useVideoToAudio(file: File | null) {
  const [loaded, setLoaded] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(file);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const load = async () => {
    try {
      setIsProcessing(true);
      setError(null);

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
    if (!videoFile) {
      setError("Please select a media file first");
      return null;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const ffmpeg = ffmpegRef.current;

      // Write the input file
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

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
      const audioFile = new File([audioBlob], "extracted-audio.mp3", {
        type: "audio/mp3",
      });

      // Create URL for the audio file
      const url = URL.createObjectURL(audioFile);
      setAudioURL(url);

      return audioFile;
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
    if (videoFile && !loaded && !isProcessing) {
      load();
    }
  }, [videoFile, loaded, isProcessing]);

  useEffect(() => {
    // Extract audio when FFmpeg is loaded and we have a video file
    if (loaded && videoFile && !isProcessing) {
      extractAudio();
    }

    // Clean up function
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [loaded, videoFile]);

  return {
    loaded,
    isProcessing,
    error,
    audioURL,
    messageRef,
    setVideoFile,
  };
}
