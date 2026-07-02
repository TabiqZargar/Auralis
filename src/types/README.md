# types/

Shared TypeScript type definitions.

## Files

| File       | Contents |
|-----------|---------|
| models.ts | Song, Album, Artist, Playlist, QueueItem |
| state.ts  | PlayerState, QueueState, LibraryState, ThemeState, SettingsState, PlaybackState |
| api.ts    | APIResponse, PaginatedResponse, APIError, SearchResults |
| lyrics.ts | LyricLine, Lyrics, SyncedLyrics, UnsyncedLyrics |
| index.ts  | Barrel export |

## Rules

- Feature-specific types live inside the feature folder.
- Keep interfaces focused and composable.
- Prefer `interface` over `type` for object shapes.
- Use `type` for unions, intersections, and utility types.
