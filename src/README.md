# src/

Application source code root.

## Structure

- **app/** — Application shell: providers, router, layouts, entry points
- **assets/** — Static assets (icons, images, fonts, audio files)
- **components/** — Shared reusable components across features
- **features/** — Feature modules, each self-contained with its own api/components/hooks/store/types/utils/constants/services
- **services/** — External integrations (Spotify API, Audio engine, Storage)
- **store/** — Global Zustand state stores
- **hooks/** — Shared custom React hooks
- **lib/** — Third-party library wrappers and initializations
- **constants/** — Application-wide constants
- **types/** — Shared TypeScript interfaces and types
- **utils/** — Pure utility functions
- **styles/** — Global styles, CSS variables, Tailwind configuration
- **config/** — Application configuration
- **pages/** — Route-level page components

## Rules

- Never import from `features/` into `components/` or `hooks/`.
- Features may import from `services/`, `store/`, `hooks/`, `types/`, `utils/`, `constants/`.
- UI components must never import from `features/`.
- Services must never import React or React hooks.
