import { Console, Effect } from "effect";
import { Command } from "@effect/cli";

const config = {
  prompt: "QuickSH - Use 'qsh ask <prompt>' to ask a question",
  command: {
    name: "qsh",
  },
};

export const InitializeCommand = Command.make(config.command.name, {}, () =>
  Effect.gen(function* () {
    yield* Console.log(config.prompt);
  })
);
