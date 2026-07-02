# hooks/

Shared custom React hooks used across features and components.

## Hooks

| Hook            | Purpose |
|----------------|---------|
| useAudio        | Low-level audio element control (load, play, pause, seek) |
| usePlayer       | High-level player orchestration (play song, next, previous, toggle) |
| useQueue        | Queue manipulation convenience wrapper |
| useDebounce     | Generic value debouncing |
| useTheme        | Theme application and control |
| useVisualizer   | Canvas-based audio visualization lifecycle |

## Rules

- Feature-specific hooks live inside the feature folder, not here.
- Hooks may access `@/store`, `@/services`, and `@/lib`.
- Hooks should be composable — prefer small focused hooks over monoliths.
