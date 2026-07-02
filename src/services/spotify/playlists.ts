import { spotifyClient } from "./client";
import type { Playlist, Song, PaginatedResponse } from "@/types";

export const playlistsApi = {
  getPlaylist(id: string) {
    return spotifyClient.get<Playlist>(`/playlists/${id}`);
  },
  getPlaylistTracks(id: string, offset = 0, limit = 100) {
    return spotifyClient.get<PaginatedResponse<Song>>(`/playlists/${id}/tracks?offset=${offset}&limit=${limit}`);
  },
  createPlaylist(data: { title: string; description?: string; public?: boolean }) {
    return spotifyClient.post<Playlist>("/playlists", data);
  },
  updatePlaylist(id: string, data: Partial<Playlist>) {
    return spotifyClient.put<Playlist>(`/playlists/${id}`, data);
  },
  deletePlaylist(id: string) {
    return spotifyClient.delete<void>(`/playlists/${id}`);
  },
  addTracks(id: string, trackIds: string[]) {
    return spotifyClient.post<void>(`/playlists/${id}/tracks`, { trackIds });
  },
  removeTracks(id: string, trackIds: string[]) {
    return spotifyClient.delete<void>(`/playlists/${id}/tracks`, { data: { trackIds } });
  },
  reorderTracks(id: string, fromIndex: number, toIndex: number) {
    return spotifyClient.put<void>(`/playlists/${id}/tracks/reorder`, { fromIndex, toIndex });
  },
};
