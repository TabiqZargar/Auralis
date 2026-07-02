import { useCallback } from "react";
import { useLibraryStore, useToastStore } from "@/store";
import type { Song } from "@/types";

export function useFavorites() {
  const likedSongs = useLibraryStore((s) => s.likedSongs);
  const addToast = useToastStore((s) => s.addToast);

  const isLiked = useCallback(
    (songId: string) => {
      return useLibraryStore.getState().isLiked(songId);
    },
    [],
  );

  const toggleLike = useCallback(
    (song: Song) => {
      const store = useLibraryStore.getState();
      const wasLiked = store.isLiked(song.id);
      store.toggleLikedSong(song);
      addToast(
        wasLiked ? "Removed from Liked Songs" : "Added to Liked Songs",
        "success",
        2000,
      );
    },
    [addToast],
  );

  return {
    likedSongs,
    isLiked,
    toggleLike,
    likedCount: likedSongs.length,
  };
}
