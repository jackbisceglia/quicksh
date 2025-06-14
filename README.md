# quicksh

A CLI tool that generates shell commands using AI. Ask a question in natural language and get executable commands with explanations.

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **CLI**: Effect CLI
- **AI**: OpenAI API

## Usage

```bash
# Install dependencies
bun install

# Set OpenAI API key
export OPENAI_API_KEY=your_key_here

# Ask for a command
bun run qsh ask "find all .js files modified in the last week"

# Use different model (default: gpt-4o-mini)
bun run qsh ask -m gpt-4o "find all .js files modified in the last week"

# SAMPLE OUTPUT
# [you]
#   ⬝ find all .js files modified in the last week
#
# [qsh]
#   ⬝ This command finds all files ending with .js in the current directory and its subdirectories that were modified in the last 7 days.
#
# qsh copied: find . -type f -name '*.js' -mtime -7
#
```

Commands are automatically copied to your clipboard for immediate use.
