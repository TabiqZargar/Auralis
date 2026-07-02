import { create } from "zustand";
import type { Song } from "@/types";
import { PLAYER } from "@/constants";

export interface PlayerState {
  currentTrack: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  loading: boolean;
  error: string | null;
}

export interface PlayerActions {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  loadTrack: (track: Song) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  updateProgress: (currentTime: number, duration: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetPlayer: () => void;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  volume: PLAYER.DEFAULT_VOLUME,
  muted: false,
  playbackRate: 1,
  loading: false,
  error: null,
};

export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  ...initialState,

  play: () => set({ isPlaying: true, error: null }),

  pause: () => set({ isPlaying: false }),

  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),

  loadTrack: (track) =>
    set({
      currentTrack: track,
      currentTime: 0,
      duration: 0,
      loading: true,
      error: null,
      isPlaying: false,
    }),

  seek: (time) => set({ currentTime: time }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  toggleMute: () => set((state) => ({ muted: !state.muted })),

  setPlaybackRate: (rate) =>
    set({ playbackRate: Math.max(0.25, Math.min(4, rate)) }),

  updateProgress: (currentTime, duration) =>
    set({
      currentTime,
      duration: duration || 0,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  resetPlayer: () => set(initialState),
}));
