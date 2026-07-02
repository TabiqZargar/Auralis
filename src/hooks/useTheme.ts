import { useEffect } from "react";
import { useThemeStore } from "@/store";

export function useTheme() {
  const store = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (store.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [store.mode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", store.accentColor);
  }, [store.accentColor]);

  return {
    mode: store.mode,
    accentColor: store.accentColor,
    reducedMotion: store.reducedMotion,
    compactMode: store.compactMode,
    setMode: store.setMode,
    setAccentColor: store.setAccentColor,
    setReducedMotion: store.setReducedMotion,
    setCompactMode: store.setCompactMode,
  };
}
