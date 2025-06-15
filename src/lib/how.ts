import { baseSystemPrompt } from "./llm/prompts";
import { pipe, Schema } from "effect";
import { LLM } from "../lib/llm";
import { withProcessedTemplate, withPrefix } from "./string";
import { MODELS, ProvideModel, type SupportedModel } from "./llm/providers";

const system = pipe(
  baseSystemPrompt,
  withPrefix(`
    When given a user's query:
      1. Analyze the intent behind the request.
      2. Provide a concise natural-language description of the intended action.
      3. Output only the exact shell command needed to accomplish it, with no additional explanation.

    The generated command will be copied directly to the user's clipboard.
  `),
  withProcessedTemplate,
);

export function how(prompt: string, model?: SupportedModel) {
  const schema = Schema.Struct({
    explanation: Schema.String,
    command: Schema.String,
  });

  return pipe(
    LLM.generateObject({ system, prompt, schema }),
    ProvideModel(model ?? MODELS.default),
  );
}
