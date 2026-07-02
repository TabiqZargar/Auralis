import { create } from "zustand";
import type { SettingsState } from "@/types";

interface SettingsActions {
  setAudioQuality: (quality: SettingsState["audioQuality"]) => void;
  setPlaybackSpeed: (speed: number) => void;
  setEqualizerPreset: (preset: string) => void;
  setEqualizerBands: (bands: number[]) => void;
  setLanguage: (lang: string) => void;
  toggleLyrics: () => void;
  toggleVisualizer: () => void;
  toggleGaplessPlayback: () => void;
  toggleAutoPlay: () => void;
  toggleKeyboardShortcuts: () => void;
  toggleNotifications: () => void;
  toggleSocialFeatures: () => void;
  reset: () => void;
}

const initialState: SettingsState = {
  audioQuality: "high",
  playbackSpeed: 1,
  equalizerPreset: "flat",
  equalizerBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  language: "en",
  showLyrics: true,
  showVisualizer: false,
  gaplessPlayback: true,
  autoPlay: true,
  keyboardShortcuts: true,
  notificationsEnabled: true,
  socialFeatures: true,
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  ...initialState,
  setAudioQuality: (quality) => set({ audioQuality: quality }),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  setEqualizerPreset: (preset) => set({ equalizerPreset: preset }),
  setEqualizerBands: (bands) => set({ equalizerBands: bands }),
  setLanguage: (lang) => set({ language: lang }),
  toggleLyrics: () => set((s) => ({ showLyrics: !s.showLyrics })),
  toggleVisualizer: () => set((s) => ({ showVisualizer: !s.showVisualizer })),
  toggleGaplessPlayback: () => set((s) => ({ gaplessPlayback: !s.gaplessPlayback })),
  toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
  toggleKeyboardShortcuts: () => set((s) => ({ keyboardShortcuts: !s.keyboardShortcuts })),
  toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
  toggleSocialFeatures: () => set((s) => ({ socialFeatures: !s.socialFeatures })),
  reset: () => set(initialState),
}));
