import { useCallback } from "react";
import { useQueueStore } from "@/store";
import type { Song } from "@/types";
import { useToastStore } from "@/store/toastStore";

export function useQueue() {
  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const shuffle = useQueueStore((s) => s.shuffle);
  const repeatMode = useQueueStore((s) => s.repeatMode);
  const addToast = useToastStore((s) => s.addToast);

  const addTrack = useCallback(
    (track: Song) => {
      useQueueStore.getState().addTrack(track);
      addToast("Added to queue", "info", 2000);
    },
    [addToast],
  );

  const addTrackNext = useCallback(
    (track: Song) => {
      useQueueStore.getState().addTrackNext(track);
      addToast("Playing next", "info", 2000);
    },
    [addToast],
  );

  const removeTrack = useCallback(
    (index: number) => {
      useQueueStore.getState().removeTrack(index);
      addToast("Removed from queue", "info", 2000);
    },
    [addToast],
  );

  const clearQueue = useCallback(() => {
    useQueueStore.getState().clearQueue();
    addToast("Queue cleared", "info", 2000);
  }, [addToast]);

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
    addTrackNext,
    removeTrack,
    clearQueue,
    setQueue,
    reorderQueue,
    toggleShuffle,
    cycleRepeatMode,
    queueLength: queue.length,
  };
}
