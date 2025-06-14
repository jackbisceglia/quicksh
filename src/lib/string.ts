import { Array, Iterable, pipe, String } from "effect";

export function withPrefix(content: string) {
  return (prefix: string) => [prefix, content].join("\n");
}

export function withProcessedTemplate(content: string) {
  return pipe(
    content,
    String.linesWithSeparators,
    Iterable.map((line) => String.trimStart(line)),
    Array.join("\n"),
  );
}
