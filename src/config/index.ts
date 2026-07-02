export const config = {
  appName: "Music Player",
  version: "0.1.0",
  environment: import.meta.env.MODE as "development" | "production" | "test",

  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001",
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
    cacheTime: 5 * 60 * 1000,
    staleTime: 30 * 1000,
  },

  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? "",
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI ?? "http://localhost:5173/callback",
    scopes: [
      "user-read-email",
      "user-read-private",
      "user-library-read",
      "user-library-modify",
      "playlist-read-private",
      "playlist-modify-public",
      "playlist-modify-private",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
      "streaming",
    ],
  },

  storage: {
    prefix: "music_player_",
    recentSearches: 10,
    recentlyPlayed: 50,
  },

  limits: {
    searchDebounceMs: 300,
    maxSearchResults: 50,
    maxQueueSize: 500,
    maxPlaylistTracks: 10000,
    maxLibraryItems: 10000,
  },
} as const;
