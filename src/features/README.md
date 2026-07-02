# features/

Feature modules — self-contained slices of application functionality.

## Convention

Every feature follows this structure when applicable:

```
feature-name/
  api/          — API functions (calls to services)
  components/   — Feature-specific components
  hooks/        — Feature-specific React hooks
  store/        — Feature-specific Zustand stores
  types/        — Feature-specific TypeScript types
  utils/        — Feature-specific utilities
  constants/    — Feature-specific constants
  services/     — Feature-specific service logic
  index.ts      — Public barrel export
  README.md     — Feature documentation
```

## Features

| Feature      | Responsibility |
|-------------|---------------|
| player      | Core playback logic, now-playing UI, playback controls |
| queue       | Up-next management, track ordering, history |
| search      | Search UI, suggestions, results display |
| albums      | Album browsing, detail view |
| artists     | Artist profiles, discography |
| playlists   | Playlist CRUD, playlist views |
| library     | User's saved content, recently played |
| lyrics      | Synced/unsynced lyrics display |
| visualizer  | Audio visualization (bars, waves, etc.) |
| equalizer   | EQ controls and presets |
| settings    | User preferences and configuration |

## Rules

- Features may import from `@/services`, `@/store`, `@/hooks`, `@/types`, `@/utils`, `@/constants`, `@/components/shared`, `@/components/ui`.
- Features must NOT import from other features — use the global store for cross-feature communication.
- Feature `index.ts` should export only the public API of the feature.
- Keep features loosely coupled; prefer events/store over direct imports.
