import { spotifyClient } from "./client";
import type { SearchResults, PaginatedResponse } from "@/types";

export const searchApi = {
  search(query: string, type = "track,album,artist,playlist", offset = 0, limit = 20) {
    return spotifyClient.get<SearchResults>(
      `/search?q=${encodeURIComponent(query)}&type=${type}&offset=${offset}&limit=${limit}`,
    );
  },
  searchSuggestions(query: string) {
    return spotifyClient.get<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },
};
