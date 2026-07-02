import { create } from "zustand";
import type { PlayerState, Song, RepeatMode, ShuffleMode } from "@/types";

interface PlayerActions {
  setCurrentSong: (song: Song | null) => void;
  setStatus: (status: PlayerState["status"]) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeat: (mode: RepeatMode) => void;
  setShuffle: (mode: ShuffleMode) => void;
  setCrossfade: (enabled: boolean, duration?: number) => void;
  reset: () => void;
}

const initialState: PlayerState = {
  currentSong: null,
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  muted: false,
  repeat: "off",
  shuffle: "off",
  crossfadeEnabled: false,
  crossfadeDuration: 3,
};

export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  ...initialState,
  setCurrentSong: (song) => set({ currentSong: song, currentTime: 0, status: "loading" }),
  setStatus: (status) => set({ status }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),
  setRepeat: (mode) => set({ repeat: mode }),
  setShuffle: (mode) => set({ shuffle: mode }),
  setCrossfade: (enabled, duration) =>
    set({ crossfadeEnabled: enabled, ...(duration !== undefined && { crossfadeDuration: duration }) }),
  reset: () => set(initialState),
}));
