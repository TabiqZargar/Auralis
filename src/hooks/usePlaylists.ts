import { useCallback } from "react";
import { useLibraryStore, useToastStore } from "@/store";
import type { Song, Playlist } from "@/types";

export function usePlaylists() {
  const playlists = useLibraryStore((s) => s.playlists);
  const addToast = useToastStore((s) => s.addToast);

  const createPlaylist = useCallback(
    (title: string, description?: string) => {
      const store = useLibraryStore.getState();
      const now = new Date().toISOString();
      const playlist: Playlist = {
        id: crypto.randomUUID(),
        title,
        description: description ?? "",
        coverUrl: "",
        owner: "user",
        public: false,
        collaborative: false,
        totalTracks: 0,
        songs: [],
        createdAt: now,
        updatedAt: now,
      };
      store.addPlaylist(playlist);
      addToast(`Playlist "${title}" created`, "success", 2500);
      return playlist;
    },
    [addToast],
  );

  const renamePlaylist = useCallback(
    (id: string, title: string) => {
      useLibraryStore.getState().updatePlaylist(id, {
        title,
        updatedAt: new Date().toISOString(),
      });
      addToast(`Playlist renamed to "${title}"`, "info", 2000);
    },
    [addToast],
  );

  const deletePlaylist = useCallback(
    (id: string) => {
      const store = useLibraryStore.getState();
      const playlist = store.playlists.find((p) => p.id === id);
      store.removePlaylist(id);
      if (playlist) {
        addToast(`Playlist "${playlist.title}" deleted`, "info", 2000);
      }
    },
    [addToast],
  );

  const addSong = useCallback(
    (playlistId: string, song: Song) => {
      useLibraryStore.getState().addSongToPlaylist(playlistId, song);
      addToast("Added to playlist", "success", 2000);
    },
    [addToast],
  );

  const removeSong = useCallback(
    (playlistId: string, songId: string) => {
      useLibraryStore.getState().removeSongFromPlaylist(playlistId, songId);
      addToast("Removed from playlist", "info", 2000);
    },
    [addToast],
  );

  const reorderSongs = useCallback(
    (playlistId: string, from: number, to: number) => {
      useLibraryStore.getState().reorderPlaylistSongs(playlistId, from, to);
    },
    [],
  );

  const duplicatePlaylist = useCallback(
    (id: string) => {
      const store = useLibraryStore.getState();
      const original = store.playlists.find((p) => p.id === id);
      if (original) {
        const dup: Playlist = {
          ...original,
          id: crypto.randomUUID(),
          title: `${original.title} (copy)`,
          updatedAt: new Date().toISOString(),
        };
        store.addPlaylist(dup);
        addToast(`Playlist duplicated as "${dup.title}"`, "success", 2500);
        return dup;
      }
      return null;
    },
    [addToast],
  );

  const getPlaylist = useCallback(
    (id: string) => {
      return useLibraryStore.getState().playlists.find((p) => p.id === id) ?? null;
    },
    [],
  );

  return {
    playlists,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    addSong,
    removeSong,
    reorderSongs,
    duplicatePlaylist,
    getPlaylist,
    playlistCount: playlists.length,
  };
}
