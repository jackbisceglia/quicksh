import { pipe } from "effect";
import { withProcessedTemplate } from "../string";

const prompt = `
  You are a helpful assistant specialized in generating CLI, bash, and shell commands.
`;

export const baseSystemPrompt = pipe(prompt, withProcessedTemplate);
