import { useQuery } from "@tanstack/react-query";
import { spotifyGet } from "@/services/spotify/api";
import {
  mapSpotifyTrack,
  mapSpotifyAlbum,
  mapSpotifyArtist,
  mapSpotifyPlaylist,
  type SpotifySearchResult,
} from "@/services/spotify/adapters";
import type { Song, Album, Artist, Playlist } from "@/types";

const SEARCH_STALE_TIME = 1000 * 60 * 2;

export interface SearchData {
  songs: Song[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
  total: number;
}

async function fetchSearch(query: string): Promise<SearchData> {
  if (!query.trim()) {
    return { songs: [], albums: [], artists: [], playlists: [], total: 0 };
  }

  const data = await spotifyGet<SpotifySearchResult>("/search", {
    q: query,
    type: "track,album,artist,playlist",
    limit: 20,
  });

  return {
    songs: (data.tracks?.items ?? []).map(mapSpotifyTrack),
    albums: (data.albums?.items ?? []).map(mapSpotifyAlbum),
    artists: (data.artists?.items ?? []).map(mapSpotifyArtist),
    playlists: (data.playlists?.items ?? []).map(mapSpotifyPlaylist),
    total:
      (data.tracks?.items.length ?? 0) +
      (data.albums?.items.length ?? 0) +
      (data.artists?.items.length ?? 0) +
      (data.playlists?.items.length ?? 0),
  };
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["spotify", "search", query],
    queryFn: () => fetchSearch(query),
    staleTime: SEARCH_STALE_TIME,
    gcTime: SEARCH_STALE_TIME * 2,
    retry: 1,
    enabled: query.trim().length > 0,
  });
}
