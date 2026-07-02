import { useQuery } from "@tanstack/react-query";
import { spotifyGet } from "@/services/spotify/api";
import {
  mapSpotifyPlaylist,
  type SpotifyPlaylist,
} from "@/services/spotify/adapters";
import type { Playlist } from "@/types";

const PLAYLIST_STALE_TIME = 1000 * 60 * 5;

async function fetchPlaylist(id: string): Promise<Playlist> {
  const data = await spotifyGet<SpotifyPlaylist>(`/playlists/${id}`);
  return mapSpotifyPlaylist(data);
}

export function usePlaylist(id: string | undefined) {
  return useQuery({
    queryKey: ["spotify", "playlist", id],
    queryFn: () => fetchPlaylist(id!),
    staleTime: PLAYLIST_STALE_TIME,
    gcTime: PLAYLIST_STALE_TIME * 2,
    retry: 2,
    enabled: !!id,
  });
}
