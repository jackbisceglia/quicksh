#!/usr/bin/env bun

import { Command } from "@effect/cli";
import { Effect, pipe } from "effect";
import { BunRuntime, BunContext } from "@effect/platform-bun";
import { InitializeCommand } from "./cli/initialize-command";
import { AskCommand } from "./cli/ask-command";

const content = {
  name: "quicksh",
  version: "1.0.0",
};

const Root = pipe(InitializeCommand, Command.withSubcommands([AskCommand]));

function program() {
  return pipe(
    process.argv,
    Command.run(Root, {
      name: content.name,
      version: content.version,
    }),
    Effect.provide(BunContext.layer)
  );
}

program().pipe(BunRuntime.runMain);
