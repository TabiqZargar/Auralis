import { spotifyClient } from "./client";
import type { Album, Song, PaginatedResponse } from "@/types";

export const albumsApi = {
  getAlbum(id: string) {
    return spotifyClient.get<Album>(`/albums/${id}`);
  },
  getAlbumTracks(id: string, offset = 0, limit = 50) {
    return spotifyClient.get<PaginatedResponse<Song>>(`/albums/${id}/tracks?offset=${offset}&limit=${limit}`);
  },
  getSeveralAlbums(ids: string[]) {
    return spotifyClient.get<Album[]>(`/albums?ids=${ids.join(",")}`);
  },
  getNewReleases(offset = 0, limit = 20) {
    return spotifyClient.get<PaginatedResponse<Album>>(`/albums/new-releases?offset=${offset}&limit=${limit}`);
  },
};
