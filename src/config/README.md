# config/

Application configuration.

## Contents

- `index.ts` — Centralized config object with environment variables, API settings, Spotify OAuth config, storage prefix, and application limits.

## Rules

- Configuration is read-only at runtime.
- Environment variables use the `VITE_` prefix.
- Feature-specific config lives inside the feature folder.
- No secrets — only public configuration values.
