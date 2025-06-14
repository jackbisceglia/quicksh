export const models = {
  supported: [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
  ] as const,
  default: "gpt-4.1-nano" as const,
};
