import { useQuery } from "@tanstack/react-query";
import { spotifyGet } from "@/services/spotify/api";
import {
  mapSpotifyAlbum,
  mapSpotifyArtist,
  mapSpotifyTrack,
  type SpotifyArtist,
  type SpotifyArtistTopTracks,
  type SpotifyAlbum,
} from "@/services/spotify/adapters";
import type { Artist, Album, Song } from "@/types";

const ARTIST_STALE_TIME = 1000 * 60 * 10;

interface ArtistData {
  artist: Artist;
  topTracks: Song[];
  albums: Album[];
  relatedArtists: Artist[];
}

async function fetchArtist(id: string): Promise<ArtistData> {
  const [artistData, topTracksData, albumsData] = await Promise.all([
    spotifyGet<SpotifyArtist>(`/artists/${id}`),
    spotifyGet<SpotifyArtistTopTracks>(`/artists/${id}/top-tracks`, { market: "US" }),
    spotifyGet<{ items: SpotifyAlbum[] }>(`/artists/${id}/albums`, {
      limit: 10,
      include_groups: "album,single",
    }),
  ]);

  const artist = mapSpotifyArtist(artistData);
  const topTracks = (topTracksData.tracks ?? []).map(mapSpotifyTrack);
  const albums = (albumsData.items ?? []).map(mapSpotifyAlbum);
  const artistWithTracks: Artist = { ...artist, topTracks, albums };

  return {
    artist: artistWithTracks,
    topTracks,
    albums,
    relatedArtists: [],
  };
}

export function useArtist(id: string | undefined) {
  return useQuery({
    queryKey: ["spotify", "artist", id],
    queryFn: () => fetchArtist(id!),
    staleTime: ARTIST_STALE_TIME,
    gcTime: ARTIST_STALE_TIME * 2,
    retry: 2,
    enabled: !!id,
  });
}

export function useRelatedArtists(id: string | undefined) {
  return useQuery({
    queryKey: ["spotify", "artist", id, "related"],
    queryFn: async () => {
      const data = await spotifyGet<{ artists: SpotifyArtist[] }>(`/artists/${id}/related-artists`);
      return (data.artists ?? []).map(mapSpotifyArtist);
    },
    staleTime: ARTIST_STALE_TIME,
    enabled: !!id,
    retry: 1,
  });
}
