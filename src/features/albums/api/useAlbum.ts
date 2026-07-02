import { useQuery } from "@tanstack/react-query";
import { spotifyGet } from "@/services/spotify/api";
import {
  mapSpotifyAlbum,
  type SpotifyAlbum,
} from "@/services/spotify/adapters";
import type { Album } from "@/types";

const ALBUM_STALE_TIME = 1000 * 60 * 10;

async function fetchAlbum(id: string): Promise<Album> {
  const data = await spotifyGet<SpotifyAlbum>(`/albums/${id}`);
  return mapSpotifyAlbum(data);
}

export function useAlbum(id: string | undefined) {
  return useQuery({
    queryKey: ["spotify", "album", id],
    queryFn: () => fetchAlbum(id!),
    staleTime: ALBUM_STALE_TIME,
    gcTime: ALBUM_STALE_TIME * 2,
    retry: 2,
    enabled: !!id,
  });
}
