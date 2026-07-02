# services/

External integrations and infrastructure services.

## Structure

- **spotify/** — Spotify Web API client and resource-specific API modules
  - `client.ts` — Configured Axios client with auth interceptors
  - `albums.ts` — Album-related API calls
  - `artists.ts` — Artist-related API calls
  - `playlists.ts` — Playlist CRUD API calls
  - `search.ts` — Search API calls
- **audio/** — Audio playback and visualization services
  - `player.ts` — HTMLAudioElement wrapper
  - `visualizer.ts` — Web Audio API visualizer
- **storage/** — Local storage abstraction

## Rules

- Services must never import React or React hooks.
- API modules export plain functions, not classes (stateless).
- Services are consumed by hooks, stores, and TanStack Query.
- UI components must never call services directly.
