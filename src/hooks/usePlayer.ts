import { useCallback } from "react";
import { usePlayerStore, useQueueStore, useLibraryStore } from "@/store";
import type { Song } from "@/types";

export function usePlayer() {
  const player = usePlayerStore();
  const queue = useQueueStore();
  const library = useLibraryStore();

  const playSong = useCallback(
    (song: Song, queueIndex?: number) => {
      player.setCurrentSong(song);
      queue.playSong(song, queueIndex);
      library.addRecentlyPlayed(song);
    },
    [player, queue, library],
  );

  const togglePlay = useCallback(() => {
    if (player.status === "playing") {
      player.setStatus("paused");
    } else if (player.currentSong) {
      player.setStatus("playing");
    }
  }, [player]);

  const nextTrack = useCallback(() => {
    queue.next();
    const nextItem = queue.items[queue.currentIndex + 1];
    if (nextItem) {
      playSong(nextItem.song, queue.currentIndex + 1);
    }
  }, [queue, playSong]);

  const previousTrack = useCallback(() => {
    if (player.currentTime > 3) {
      player.setCurrentTime(0);
      return;
    }
    queue.previous();
    const prevItem = queue.items[queue.currentIndex - 1];
    if (prevItem) {
      playSong(prevItem.song, queue.currentIndex - 1);
    }
  }, [queue, player, playSong]);

  return {
    playSong,
    togglePlay,
    nextTrack,
    previousTrack,
    currentSong: player.currentSong,
    status: player.status,
    volume: player.volume,
    currentTime: player.currentTime,
    duration: player.duration,
  };
}
