import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

type TranscriptionResponse = {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
};

export async function streamAudioTranscription(audioFile: File) {
  try {
    const dir = "/tmp";
    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = `/tmp/${Date.now()}-${audioFile.name}`;
    // Save the uploaded file to /tmp
    const arrayBuffer = await audioFile.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

    // stream the file
    const fileStream = fs.createReadStream(filePath);

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: (() => {
          const form = new FormData();
          form.append("file", fileStream, {
            filename: "audio.mp3",
            contentType: "audio/mpeg",
          });
          form.append("model", "whisper-large-v3");
          form.append("response_format", "verbose_json");
          return form;
        })(),
      }
    );

    if (!response.ok)
      throw new Error(`Transcription failed: ${await response.text()}`);
    return response.json() as Promise<TranscriptionResponse>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Transcription error: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during transcription.");
    }
  }
}
