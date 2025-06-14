import { Effect } from "effect";
import { execSync } from "child_process";

// NOTE: THIS IS ALL AI GEN'D
// TODO: COME BACK AND CHECK/MAKE THIS GOOD

class ClipboardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClipboardError";
  }
}

export function copyToClipboard(text: string) {
  return Effect.tryPromise({
    try: async () => {
      const platform = process.platform;

      try {
        if (platform === "darwin") {
          // macOS
          execSync("pbcopy", { input: text, encoding: "utf8" });
        } else if (platform === "linux") {
          // Try xclip first, then xsel
          try {
            execSync("xclip -selection clipboard", {
              input: text,
              encoding: "utf8",
            });
          } catch {
            execSync("xsel --clipboard --input", {
              input: text,
              encoding: "utf8",
            });
          }
        } else if (platform === "win32") {
          // Windows
          execSync("clip", { input: text, encoding: "utf8" });
        } else {
          throw new ClipboardError(`Unsupported platform: ${platform}`);
        }
      } catch (error) {
        throw new ClipboardError(`Failed to copy to clipboard: ${error}`);
      }
    },
    catch: (error) =>
      new ClipboardError(
        error instanceof Error ? error.message : String(error)
      ),
  });
}
