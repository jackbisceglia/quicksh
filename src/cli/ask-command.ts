import { Args, Command } from "@effect/cli";
import { Options } from "@effect/cli";
import { how as howLib } from "../lib/how";
import { Console, Effect, pipe } from "effect";
import { models } from "../lib/models";
import { withBold, withBrackets, withIndent, withPadding } from "./style";
import { copyToClipboard } from "../lib/clipboard";

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
  prompt: string;
  indent: number;
  prefix: string;
};

function Format(options: LogOptions) {
  const user = "you";
  const assistant = "qsh";

  function userMessage(prompt: string) {
    const indicator = withBold(withBrackets(user));
    const body = withIndent(options.prompt, {
      tabsize: 2,
      prefix: options.prefix,
    });

    const content = [indicator, body].join("\n");

    return withPadding(content, { padding: { top: 1 } });
  }

  function assistantMessage(explanation: string) {
    const indicator = withBold(withBrackets(assistant));
    const body = withIndent(explanation, {
      tabsize: 2,
      prefix: options.prefix,
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
  Options.choice(config.options.model.name, models.supported),
  Options.withAlias(config.options.model.alias),
  Options.withDefault(models.default)
);

export const AskCommand = Command.make(
  config.command.name,
  { prompt: Prompt, model: Model },
  (options) =>
    Effect.gen(function* () {
      const fmt = Format({
        model: options.model,
        prompt: options.prompt,
        indent: 2,
        prefix: "⬝",
      });

      yield* Console.log(fmt.userMessage(options.prompt));

      const llm = yield* howLib(options.model, options.prompt);

      yield* Console.log(fmt.assistantMessage(llm.explanation));

      yield* copyToClipboard(llm.command);
      yield* Console.log(fmt.conclusion(llm.command));
    })
);
