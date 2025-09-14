import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { groqChatModelDeterministic as groqTextModel } from "../models/Groq";

const languageSchema = z.object({
  language: z.string(),
  confidence: z.number().min(0).max(1),
});

const languageParser = StructuredOutputParser.fromZodSchema(languageSchema);

const languagePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a strict language detection system. 
        Your only job is to detect the language of the given text.
        Respond ONLY in valid JSON with the following structure:

        {{
          "language": "<Detected language name in English>",
          "confidence": <number between 0 and 1, 2 decimal places>
        }}

        Example:
        {{
          "language": "English",
          "confidence": 0.97
        }}`,
  ],
  ["user", "{text}"],
]);

export const languageChain = languagePrompt
  .pipe(groqTextModel)
  .pipe(languageParser);
