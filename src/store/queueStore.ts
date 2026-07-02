import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Song, QueueItem, RepeatMode } from "@/types";
import { zustandStorage } from "./persist";

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
  history: QueueItem[];
}

export interface QueueActions {
  addTrack: (track: Song) => void;
  addTrackNext: (track: Song) => void;
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
  pushHistory: (item: QueueItem) => void;
  popHistory: () => QueueItem | null;
  clearHistory: () => void;
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
  history: [],
};

export const useQueueStore = create<QueueState & QueueActions>()(
  persist(
    (set, get) => ({
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

      addTrackNext: (track) =>
        set((state) => {
          const item = buildItem(track);
          const insertIndex = state.currentIndex + 1;
          const newQueue = [...state.queue];
          newQueue.splice(insertIndex, 0, item);
          const newShuffledOrder = state.shuffle
            ? (() => {
                const base = state.shuffledOrder;
                const pos = base.indexOf(state.currentIndex);
                const adjusted = base.map((i) => (i >= insertIndex ? i + 1 : i));
                adjusted.splice((pos ?? base.length) + 1, 0, insertIndex);
                return adjusted;
              })()
            : state.shuffledOrder;
          return {
            queue: newQueue,
            currentIndex:
              insertIndex <= state.currentIndex
                ? state.currentIndex + 1
                : state.currentIndex,
            shuffledOrder: newShuffledOrder,
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
          const newShuffledOrder = state.shuffle
            ? state.shuffledOrder
                .filter((i) => i !== index)
                .map((i) => (i > index ? i - 1 : i))
            : state.shuffledOrder;
          return {
            queue: newQueue,
            currentIndex: newIndex,
            shuffledOrder: newShuffledOrder,
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
              const newOrder = shuffleIndices(queue.length);
              set({ shuffledOrder: newOrder });
              return newOrder[0]!;
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
        const { queue, currentIndex, shuffle, shuffledOrder, history } = get();

        if (history.length > 0) {
          const prev = history[history.length - 1]!;
          const prevIdx = queue.findIndex((item) => item.song.id === prev.song.id);
          if (prevIdx >= 0) {
            set({
              currentIndex: prevIdx,
              history: history.slice(0, -1),
            });
            return prevIdx;
          }
        }

        if (queue.length === 0) return null;

        let prevIndex: number;
        if (shuffle) {
          const currentShufflePos = shuffledOrder.indexOf(currentIndex);
          const prevShufflePos = currentShufflePos - 1;
          if (prevShufflePos < 0) {
            prevIndex = shuffledOrder[shuffledOrder.length - 1]!;
          } else {
            prevIndex = shuffledOrder[prevShufflePos]!;
          }
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

          const adjustOrder = (order: number[]) => {
            const mapped = order.map((i) => {
              if (i === fromIndex) return toIndex;
              if (fromIndex < i && i <= toIndex) return i - 1;
              if (toIndex <= i && i < fromIndex) return i + 1;
              return i;
            });
            const seen = new Set<number>();
            return mapped.filter((val) => {
              if (seen.has(val)) return false;
              seen.add(val);
              return true;
            });
          };

          return {
            queue: newQueue,
            currentIndex: newIndex,
            shuffledOrder: state.shuffle
              ? adjustOrder(state.shuffledOrder)
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
        return get().playNext();
      },

      pushHistory: (item) =>
        set((state) => ({
          history: [...state.history, item].slice(-100),
        })),

      popHistory: () => {
        const { history } = get();
        if (history.length === 0) return null;
        const item = history[history.length - 1]!;
        set({ history: history.slice(0, -1) });
        return item;
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "queue",
      storage: zustandStorage,
      partialize: (state) => ({
        queue: state.queue,
        currentIndex: state.currentIndex,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
        shuffledOrder: state.shuffledOrder,
      }),
    },
  ),
);

export const useQueueActions = () =>
  useQueueStore(
    (s) =>
      ({
        addTrack: s.addTrack,
        addTrackNext: s.addTrackNext,
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
        pushHistory: s.pushHistory,
        popHistory: s.popHistory,
        clearHistory: s.clearHistory,
      }) as QueueActions,
  );
