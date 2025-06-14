import { OpenAiClient } from "@effect/ai-openai";
import { Config, Layer, pipe } from "effect";
import { FetchHttpClient } from "@effect/platform";

const OpenAIBase = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
});

export const OpenAI = pipe(OpenAIBase, Layer.provide(FetchHttpClient.layer));
