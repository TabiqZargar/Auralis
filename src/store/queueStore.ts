import { create } from "zustand";
import type { Song, QueueItem, RepeatMode } from "@/types";

function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }
  return indices;
}

export interface QueueState {
  queue: QueueItem[];
  currentIndex: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  shuffledOrder: number[];
}

export interface QueueActions {
  addTrack: (track: Song) => void;
  removeTrack: (index: number) => void;
  clearQueue: () => void;
  setQueue: (tracks: Song[], startIndex?: number) => void;
  playNext: () => number | null;
  playPrevious: () => number | null;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  getCurrentTrack: () => Song | null;
  getNextIndex: () => number | null;
}

function buildItem(track: Song): QueueItem {
  return {
    song: track,
    addedBy: "user",
    addedAt: new Date().toISOString(),
    position: 0,
  };
}

const initialState: QueueState = {
  queue: [],
  currentIndex: -1,
  repeatMode: "off",
  shuffle: false,
  shuffledOrder: [],
};

export const useQueueStore = create<QueueState & QueueActions>((set, get) => ({
  ...initialState,

  addTrack: (track) =>
    set((state) => {
      const item = buildItem(track);
      const newQueue = [...state.queue, item];
      const firstTrack = state.queue.length === 0;
      return {
        queue: newQueue,
        currentIndex: firstTrack ? 0 : state.currentIndex,
        shuffledOrder: state.shuffle
          ? shuffleIndices(newQueue.length)
          : state.shuffledOrder,
      };
    }),

  removeTrack: (index) =>
    set((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      let newIndex = state.currentIndex;
      if (index < state.currentIndex) {
        newIndex = state.currentIndex - 1;
      } else if (index === state.currentIndex) {
        newIndex = index < newQueue.length ? index : newQueue.length - 1;
      }
      return {
        queue: newQueue,
        currentIndex: newIndex,
        shuffledOrder: state.shuffle
          ? shuffleIndices(newQueue.length)
          : state.shuffledOrder,
      };
    }),

  clearQueue: () => set(initialState),

  setQueue: (tracks, startIndex = 0) =>
    set({
      queue: tracks.map(buildItem),
      currentIndex: startIndex,
      shuffledOrder: shuffleIndices(tracks.length),
    }),

  playNext: () => {
    const { queue, currentIndex, repeatMode, shuffle, shuffledOrder } = get();
    if (queue.length === 0) return null;

    if (repeatMode === "one") return currentIndex;

    let nextIndex: number;
    if (shuffle) {
      const currentShufflePos = shuffledOrder.indexOf(currentIndex);
      const nextShufflePos = currentShufflePos + 1;
      if (nextShufflePos >= shuffledOrder.length) {
        if (repeatMode === "all") {
          set({ shuffledOrder: shuffleIndices(queue.length) });
          return shuffledOrder[0]!;
        }
        return null;
      }
      nextIndex = shuffledOrder[nextShufflePos]!;
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          return null;
        }
      }
    }

    set({ currentIndex: nextIndex });
    return nextIndex;
  },

  playPrevious: () => {
    const { queue, currentIndex, shuffle, shuffledOrder } = get();
    if (queue.length === 0) return null;

    let prevIndex: number;
    if (shuffle) {
      const currentShufflePos = shuffledOrder.indexOf(currentIndex);
      const prevShufflePos = currentShufflePos - 1;
      if (prevShufflePos < 0) {
        return shuffle ? shuffledOrder[shuffledOrder.length - 1]! : currentIndex;
      }
      prevIndex = shuffledOrder[prevShufflePos]!;
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = queue.length - 1;
      }
    }

    set({ currentIndex: prevIndex });
    return prevIndex;
  },

  reorderQueue: (fromIndex, toIndex) =>
    set((state) => {
      const newQueue = [...state.queue];
      const [item] = newQueue.splice(fromIndex, 1);
      if (item) newQueue.splice(toIndex, 0, item);

      let newIndex = state.currentIndex;
      if (fromIndex === state.currentIndex) {
        newIndex = toIndex;
      } else {
        if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) {
          newIndex = state.currentIndex - 1;
        } else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) {
          newIndex = state.currentIndex + 1;
        }
      }

      return {
        queue: newQueue,
        currentIndex: newIndex,
        shuffledOrder: state.shuffle
          ? shuffleIndices(newQueue.length)
          : state.shuffledOrder,
      };
    }),

  toggleShuffle: () =>
    set((state) => {
      if (state.shuffle) {
        return { shuffle: false, shuffledOrder: [] };
      }
      return {
        shuffle: true,
        shuffledOrder: shuffleIndices(state.queue.length),
      };
    }),

  cycleRepeatMode: () =>
    set((state) => {
      const modes: RepeatMode[] = ["off", "all", "one"];
      const currentIdx = modes.indexOf(state.repeatMode);
      const nextMode = modes[(currentIdx + 1) % modes.length]!;
      return { repeatMode: nextMode };
    }),

  getCurrentTrack: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < 0 || currentIndex >= queue.length) return null;
    return queue[currentIndex]?.song ?? null;
  },

  getNextIndex: () => {
    const result = get().playNext();
    return result;
  },
}));

export const useQueueActions = () => useQueueStore((s) => ({
  addTrack: s.addTrack,
  removeTrack: s.removeTrack,
  clearQueue: s.clearQueue,
  setQueue: s.setQueue,
  playNext: s.playNext,
  playPrevious: s.playPrevious,
  reorderQueue: s.reorderQueue,
  toggleShuffle: s.toggleShuffle,
  cycleRepeatMode: s.cycleRepeatMode,
  getCurrentTrack: s.getCurrentTrack,
  getNextIndex: s.getNextIndex,
}) as QueueActions);
