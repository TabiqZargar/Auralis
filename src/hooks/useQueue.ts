import { useCallback } from "react";
import { useQueueStore, usePlayerStore } from "@/store";
import type { Song } from "@/types";

export function useQueue() {
  const store = useQueueStore();
  const player = usePlayerStore();

  const addSong = useCallback(
    (song: Song) => {
      store.addToQueue({
        song,
        addedBy: "user",
        addedAt: new Date().toISOString(),
        position: store.items.length,
      });
    },
    [store],
  );

  const playNext = useCallback(
    (song: Song) => {
      store.addToQueueNext({
        song,
        addedBy: "user",
        addedAt: new Date().toISOString(),
        position: store.currentIndex + 1,
      });
    },
    [store],
  );

  const toggleShuffle = useCallback(() => {
    player.setShuffle(player.shuffle === "on" ? "off" : "on");
  }, [player]);

  const cycleRepeatMode = useCallback(() => {
    const next = player.repeat === "off" ? "all" : player.repeat === "all" ? "one" : "off";
    player.setRepeat(next);
  }, [player]);

  return {
    items: store.items,
    queue: store.items,
    currentIndex: store.currentIndex,
    currentItem: store.items[store.currentIndex],
    addSong,
    playNext,
    removeFromQueue: store.removeFromQueue,
    reorderQueue: store.reorderQueue,
    clearQueue: store.clearQueue,
    toggleShuffle,
    cycleRepeatMode,
    shuffle: player.shuffle,
    repeatMode: player.repeat,
  };
}
