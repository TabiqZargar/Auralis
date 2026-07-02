import { useQuery } from "@tanstack/react-query";
import { spotifyGet } from "@/services/spotify/api";
import {
  mapSpotifyAlbum,
  mapSpotifyPlaylist,
  mapSpotifyArtist,
  type SpotifyNewReleases,
  type SpotifyFeaturedPlaylists,
} from "@/services/spotify/adapters";
import type { Album, Playlist, Artist } from "@/types";

const HOME_STALE_TIME = 1000 * 60 * 5;
const HOME_CACHE_TIME = 1000 * 60 * 30;

const FEATURED_ARTIST_IDS = [
  "1dfeR4HaWDbWqFHLkxsg1d", // Queen
  "3TVXtAsR1Inumwj472S9r4", // Drake
  "06HL4z0CvFAxyc27GXpf02", // Taylor Swift
  "4Z8W4fKeB5YxbusRsdQVPb", // Radiohead
  "1w5Kfo2jwwIPruYS2UWh56", // Pearl Jam
  "3fMbdgg4jU18AjLCKBhRSm", // Michael Jackson
];

async function fetchNewReleases(): Promise<Album[]> {
  const data = await spotifyGet<SpotifyNewReleases>("/browse/new-releases", { limit: 12 });
  return (data.albums?.items ?? []).map(mapSpotifyAlbum);
}

async function fetchFeaturedPlaylists(): Promise<Playlist[]> {
  const data = await spotifyGet<SpotifyFeaturedPlaylists>("/browse/featured-playlists", {
    limit: 12,
  });
  return (data.playlists?.items ?? []).map(mapSpotifyPlaylist);
}

async function fetchTrendingArtists(): Promise<Artist[]> {
  const results = await Promise.allSettled(
    FEATURED_ARTIST_IDS.map((id) =>
      spotifyGet<import("@/services/spotify/adapters").SpotifyArtist>(`/artists/${id}`),
    ),
  );
  return results
    .filter(
      (r): r is PromiseFulfilledResult<import("@/services/spotify/adapters").SpotifyArtist> =>
        r.status === "fulfilled",
    )
    .map((r) => mapSpotifyArtist(r.value));
}

export function useNewReleases() {
  return useQuery({
    queryKey: ["spotify", "new-releases"],
    queryFn: fetchNewReleases,
    staleTime: HOME_STALE_TIME,
    gcTime: HOME_CACHE_TIME,
    retry: 2,
  });
}

export function useFeaturedPlaylists() {
  return useQuery({
    queryKey: ["spotify", "featured-playlists"],
    queryFn: fetchFeaturedPlaylists,
    staleTime: HOME_STALE_TIME,
    gcTime: HOME_CACHE_TIME,
    retry: 2,
  });
}

export function useTrendingArtists() {
  return useQuery({
    queryKey: ["spotify", "trending-artists"],
    queryFn: fetchTrendingArtists,
    staleTime: HOME_STALE_TIME,
    gcTime: HOME_CACHE_TIME,
    retry: 2,
  });
}
