# store/

Global Zustand state stores.

## Stores

| Store            | Responsibility |
|-----------------|---------------|
| playerStore     | Current song, playback status, time, volume, repeat/shuffle |
| queueStore      | Queue items, current index, history |
| libraryStore    | Playlists, liked songs, recently played, followed artists |
| themeStore      | Dark/light mode, accent color, reduced motion |
| settingsStore   | Audio quality, equalizer, playback preferences |
| playbackStore   | Device connection state |

## Principles

- Each store is independent — no circular imports between stores.
- Stores hold state + actions (Zustand patterns).
- Feature-specific stores live inside the feature folder, not here.
- Global stores are for state shared across features (player state, library).
- Use selectors for performance: `usePlayerStore((s) => s.status)`.
