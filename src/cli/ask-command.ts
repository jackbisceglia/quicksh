import { Args, Command } from "@effect/cli";
import { Options } from "@effect/cli";
import { how } from "../lib/how";
import { Console, Effect, pipe } from "effect";
import { withBold, withBrackets, withIndent, withPadding } from "./style";
import { copyToClipboard } from "../lib/clipboard";
import { MODELS } from "../lib/llm/providers";

const config = {
  command: { name: "how" },
  args: {
    prompt: { name: "prompt" },
  },
  options: {
    model: { name: "model", alias: "m" },
  },
};

type LogOptions = {
  model: string;
  indent: number;
  prefix: string;
};

function Format(opts: LogOptions) {
  const user = "you";
  const assistant = "qsh";

  function userMessage(prompt: string) {
    const indicator = withBold(withBrackets(user));
    const body = withIndent(prompt, { tabsize: 2, prefix: opts.prefix });

    const content = [indicator, body].join("\n");

    return withPadding(content, { padding: { top: 1 } });
  }

  function assistantMessage(explanation: string) {
    const indicator = withBold(withBrackets(assistant));
    const body = withIndent(explanation, {
      tabsize: 2,
      prefix: opts.prefix,
    });

    const content = [indicator, body].join("\n");

    return withPadding(content, { padding: { top: 1 } });
  }

  function conclusion(command: string) {
    const indicator = withBold("qsh copied");

    const content = [indicator, command].join(": ");

    return withPadding(content, { padding: { top: 2, bottom: 1 } });
  }

  return { userMessage, assistantMessage, conclusion };
}

const Prompt = Args.text({ name: config.args.prompt.name });

const Model = pipe(
  Options.choice(config.options.model.name, MODELS.supported),
  Options.withAlias(config.options.model.alias),
  Options.withDefault(MODELS.default),
);

export const AskCommand = Command.make(
  config.command.name,
  { prompt: Prompt, model: Model },
  (options) =>
    Effect.gen(function* () {
      const fmt = Format({
        model: options.model,
        indent: 2,
        prefix: "⬝",
      });

      yield* Console.log(fmt.userMessage(options.prompt));

      const response = yield* how(options.prompt);

      yield* Console.log(fmt.assistantMessage(response.value.explanation));

      yield* copyToClipboard(response.value.command);
      yield* Console.log(fmt.conclusion(response.value.command));
    }),
);
