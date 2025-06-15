import { Effect } from "effect";
import type { AiLanguageModel, AiModel } from "@effect/ai";
import { OpenAiLanguageModel } from "@effect/ai-openai";
import type { OpenAiClient } from "@effect/ai-openai/OpenAiClient";

export type SupportedModel = (typeof MODELS.supported)[number];

export const MODELS = {
  default: "gpt-4.1-nano" as const,
  supported: [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
  ] as const,
} as const;

type AIModels = Record<
  SupportedModel,
  AiModel.AiModel<AiLanguageModel.AiLanguageModel, OpenAiClient>
>;

export const AiModels = MODELS.supported
  .map((m) => [m, OpenAiLanguageModel.model(m)] as const)
  .reduce(
    (record, [name, model]) => ({ ...record, [name]: model }),
    {} as AIModels,
  );

export function ProvideModel(selection: SupportedModel) {
  return Effect.provide(AiModels[selection]);
}
