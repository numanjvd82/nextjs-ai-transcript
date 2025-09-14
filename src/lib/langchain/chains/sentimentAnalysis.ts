import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import z from "zod";
import { groqChatModelDeterministic as groqTextModel } from "../models/Groq";

const sentimentSchema = z.object({
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
  labels: z.array(z.string()).min(1).max(5),
});

const sentimentParser = StructuredOutputParser.fromZodSchema(sentimentSchema);

const sentimentPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
    You are a strict sentiment classifier. 
        Your only job is to classify the text sentiment and assign descriptive labels.
        Respond ONLY in valid JSON with the following structure:

        {{
          "sentiment": "Positive" | "Neutral" | "Negative",
          "labels": ["<short-label-1>", "<short-label-2>", ...]
        }}

        Rules:
        - sentiment must be EXACTLY "Positive", "Neutral", or "Negative"
        - labels must be a short array (1–5 items) of lowercase, dash-separated tags
        - keep labels meaningful but concise

        Example:
        {{
          "sentiment": "Negative",
          "labels": ["customer-complaint", "billing-issue"]
        }}
    `,
  ],
  ["user", "{text}"],
]);

export const sentimentChain = sentimentPrompt
  .pipe(groqTextModel)
  .pipe(sentimentParser);
