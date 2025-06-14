type Padding =
  | number
  | {
      top?: number;
      bottom?: number;
    };

type WithPaddignOptions = {
  padding?: Padding;
};

export function withPadding(message: string, options?: WithPaddignOptions) {
  const top =
    typeof options?.padding === "number"
      ? options.padding
      : options?.padding?.top ?? 0;
  const bottom =
    typeof options?.padding === "number"
      ? options.padding
      : options?.padding?.bottom ?? 0;

  return `${"\n".repeat(top)}${message}${"\n".repeat(bottom)}`;
}

export function withBrackets(message: string) {
  return `[${message}]`;
}

export function withBold(message: string) {
  return `\x1b[1m${message}\x1b[0m`;
}

type WithIndentOptions = {
  tabsize?: number;
  prefix?: string;
};

export function withIndent(message: string, options: WithIndentOptions = {}) {
  const tab = options.tabsize ?? 2;
  const prefix = options.prefix ?? " ";

  return `${" ".repeat(tab)}${prefix}  ${message}`;
}
