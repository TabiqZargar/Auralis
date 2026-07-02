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
    apiBaseUrl: "https://api.spotify.com/v1",
    accountsBaseUrl: "https://accounts.spotify.com",
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID ?? "",
    clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET ?? "",
    tokenEndpoint: "/api/token",
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
