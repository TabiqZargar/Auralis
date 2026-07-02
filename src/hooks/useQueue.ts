import { useCallback } from "react";
import { useQueueStore } from "@/store";
import type { Song } from "@/types";

export function useQueue() {
  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const shuffle = useQueueStore((s) => s.shuffle);
  const repeatMode = useQueueStore((s) => s.repeatMode);

  const addTrack = useCallback(
    (track: Song) => {
      useQueueStore.getState().addTrack(track);
    },
    [],
  );

  const removeTrack = useCallback(
    (index: number) => {
      useQueueStore.getState().removeTrack(index);
    },
    [],
  );

  const clearQueue = useCallback(() => {
    useQueueStore.getState().clearQueue();
  }, []);

  const setQueue = useCallback(
    (tracks: Song[], startIndex?: number) => {
      useQueueStore.getState().setQueue(tracks, startIndex);
    },
    [],
  );

  const reorderQueue = useCallback(
    (from: number, to: number) => {
      useQueueStore.getState().reorderQueue(from, to);
    },
    [],
  );

  const toggleShuffle = useCallback(() => {
    useQueueStore.getState().toggleShuffle();
  }, []);

  const cycleRepeatMode = useCallback(() => {
    useQueueStore.getState().cycleRepeatMode();
  }, []);

  return {
    queue,
    currentIndex,
    currentTrack: queue[currentIndex]?.song ?? null,
    shuffle,
    repeatMode,
    addTrack,
    removeTrack,
    clearQueue,
    setQueue,
    reorderQueue,
    toggleShuffle,
    cycleRepeatMode,
    queueLength: queue.length,
  };
}
