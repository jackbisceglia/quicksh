import { Effect, Config, Data, Console } from "effect";

class NoResonseError extends Data.TaggedError("NoResonseError")<{
  m: string;
}> {}
class InvalidResonseError extends Data.TaggedError("InvalidResonseError")<{
  m: string;
}> {}

// NOTE: THIS IS LARGELY AI GEN'D
// TODO: REPLACE WITH EFFECT/AI
export function how(model: string, prompt: string) {
  return Effect.gen(function* () {
    const apiKey = yield* Config.string("OPENAI_API_KEY");

    const response = yield* Effect.tryPromise({
      try: () =>
        fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful CLI assistant. Provide concise, practical answers.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "bash_assistant_output",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    explanation: { type: "string" },
                    command: { type: "string" },
                  },
                  required: ["explanation", "command"],
                  additionalProperties: false,
                },
              },
            },
          }),
        }),
      catch: (error) => new Error(`Failed to call OpenAI API: ${error}`),
    });

    const data = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: (error) => new Error(`Failed to parse response: ${error}`),
    }) as Effect.Effect<any, Error, never>;

    const content = JSON.parse((data as any).choices?.[0]?.message?.content);

    if (!content) {
      return yield* new NoResonseError({ m: "No response received" });
    }

    if (!content.explanation || !content.command) {
      const missing = [content.explanation, content.command].filter((b) => !b);
      yield* Console.log("missing: ", content.explanation, content.command);
      const property = missing.length > 1 ? "properties" : "property";

      return yield* new InvalidResonseError({
        m: `Invalid response received, missing "${missing.join(
          ", "
        )}" ${property} in response`,
      });
    }

    return {
      explanation: content.explanation as string,
      command: content.command as string,
    };
  });
}
