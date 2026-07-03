import { useCallback } from "react";
import { useQueueStore } from "@/store";
import type { Song } from "@/types";

export function useQueue() {
  const store = useQueueStore();

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

  return {
    items: store.items,
    currentIndex: store.currentIndex,
    currentItem: store.items[store.currentIndex],
    addSong,
    playNext,
    removeFromQueue: store.removeFromQueue,
    reorderQueue: store.reorderQueue,
    clearQueue: store.clearQueue,
  };
}
