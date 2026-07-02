import { create } from "zustand";
import type { ThemeState } from "@/types";

interface ThemeActions {
  setMode: (mode: ThemeState["mode"]) => void;
  setAccentColor: (color: string) => void;
  setReducedMotion: (value: boolean) => void;
  setCompactMode: (value: boolean) => void;
  reset: () => void;
}

const initialState: ThemeState = {
  mode: "dark",
  accentColor: "#1db954",
  reducedMotion: false,
  compactMode: false,
};

export const useThemeStore = create<ThemeState & ThemeActions>((set) => ({
  ...initialState,
  setMode: (mode) => set({ mode }),
  setAccentColor: (color) => set({ accentColor: color }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setCompactMode: (value) => set({ compactMode: value }),
  reset: () => set(initialState),
}));
