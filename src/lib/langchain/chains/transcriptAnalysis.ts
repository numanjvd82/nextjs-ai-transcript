import { RunnableParallel } from "@langchain/core/runnables";
import { languageChain } from "./langDetection";
import { sentimentChain } from "./sentimentAnalysis";

// This runs both chains in parallel with the same input
export const analysisChain = RunnableParallel.from({
  language: languageChain,
  sentiment: sentimentChain,
}).pipe(async (results) => {
  // Combine results into a single object
  return {
    detectedLanguage: results.language.language,
    confidence: results.language.confidence,
    sentiment: results.sentiment.sentiment,
    labels: results.sentiment.labels,
  };
});
