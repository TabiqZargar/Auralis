import { create } from "zustand";
import type { QueueState, Song, QueueItem } from "@/types";

interface QueueActions {
  setQueue: (items: QueueItem[]) => void;
  addToQueue: (item: QueueItem) => void;
  addToQueueNext: (item: QueueItem) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  setCurrentIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
  playSong: (song: Song, index?: number) => void;
}

const initialState: QueueState = {
  items: [],
  currentIndex: -1,
  history: [],
};

export const useQueueStore = create<QueueState & QueueActions>((set, get) => ({
  ...initialState,
  setQueue: (items) => set({ items, currentIndex: 0, history: [] }),
  addToQueue: (item) => set((state) => ({ items: [...state.items, item] })),
  addToQueueNext: (item) =>
    set((state) => {
      const nextIndex = state.currentIndex + 1;
      const items = [...state.items];
      items.splice(nextIndex, 0, item);
      return { items };
    }),
  removeFromQueue: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
      currentIndex:
        index < state.currentIndex
          ? state.currentIndex - 1
          : state.currentIndex,
    })),
  reorderQueue: (fromIndex, toIndex) =>
    set((state) => {
      const items = [...state.items];
      const [item] = items.splice(fromIndex, 1);
      if (item) items.splice(toIndex, 0, item);
      return { items };
    }),
  clearQueue: () => set(initialState),
  setCurrentIndex: (index) => set({ currentIndex: index }),
  next: () => {
    const { items, currentIndex } = get();
    if (currentIndex < items.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },
  previous: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },
  playSong: (song, index) =>
    set((state) => ({
      items: index !== undefined
        ? state.items
        : [{ song, addedBy: "user", addedAt: new Date().toISOString(), position: 0 }],
      currentIndex: index ?? 0,
    })),
}));
