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
    const q = useQueueStore.getState();
    q.next();
    const fresh = useQueueStore.getState();
    const nextItem = fresh.items[fresh.currentIndex];
    if (nextItem) {
      playSong(nextItem.song, fresh.currentIndex);
    }
  }, [playSong]);

  const previousTrack = useCallback(() => {
    const p = usePlayerStore.getState();
    if (p.currentTime > 3) {
      p.setCurrentTime(0);
      return;
    }
    const q = useQueueStore.getState();
    q.previous();
    const fresh = useQueueStore.getState();
    const prevItem = fresh.items[fresh.currentIndex];
    if (prevItem) {
      playSong(prevItem.song, fresh.currentIndex);
    }
  }, [playSong]);

  return {
    playSong,
    togglePlay,
    nextTrack,
    previousTrack,
    currentSong: player.currentSong,
    currentTrack: player.currentSong,
    isPlaying: player.status === "playing",
    loading: player.status === "loading",
    error: player.status === "error" ? "Playback error" : null,
    shuffle: player.shuffle,
    repeatMode: player.repeat,
    volume: player.volume,
    currentTime: player.currentTime,
    duration: player.duration,
    muted: player.muted,
    seek: player.setCurrentTime,
    setVolume: player.setVolume,
    toggleMute: player.toggleMute,
  };
}
