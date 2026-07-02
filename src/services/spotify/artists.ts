import { spotifyClient } from "./client";
import type { Artist, Album, Song, PaginatedResponse } from "@/types";

export const artistsApi = {
  getArtist(id: string) {
    return spotifyClient.get<Artist>(`/artists/${id}`);
  },
  getArtistAlbums(id: string, offset = 0, limit = 20) {
    return spotifyClient.get<PaginatedResponse<Album>>(`/artists/${id}/albums?offset=${offset}&limit=${limit}`);
  },
  getArtistTopTracks(id: string) {
    return spotifyClient.get<Song[]>(`/artists/${id}/top-tracks`);
  },
  getRelatedArtists(id: string) {
    return spotifyClient.get<Artist[]>(`/artists/${id}/related`);
  },
  followArtist(id: string) {
    return spotifyClient.put<void>(`/artists/${id}/follow`);
  },
  unfollowArtist(id: string) {
    return spotifyClient.delete<void>(`/artists/${id}/follow`);
  },
};
