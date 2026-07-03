import { useEffect, useRef, useState } from "react";
import { usePlayerStore, useThemeStore } from "@/store";
import { extractDominantColor, hexToRgba } from "@/utils/color";

function darkenColor(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const r = Math.max(0, Number.parseInt(clean.slice(0, 2), 16) - amount);
  const g = Math.max(0, Number.parseInt(clean.slice(2, 4), 16) - amount);
  const b = Math.max(0, Number.parseInt(clean.slice(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function useDynamicTheme() {
  const currentTrack = usePlayerStore((s) => s.currentSong);
  const [dominantColor, setDominantColor] = useState("#1db954");
  const prevTrackRef = useRef<string | null>(null);

  useEffect(() => {
    const coverUrl = currentTrack?.coverUrl;
    if (!coverUrl || coverUrl === prevTrackRef.current) return;
    prevTrackRef.current = coverUrl;

    extractDominantColor(coverUrl).then((color) => {
      setDominantColor(color);
    });
  }, [currentTrack?.coverUrl]);

  useEffect(() => {
    const root = document.documentElement;
    const dark = darkenColor(dominantColor, 60);
    const darker = darkenColor(dominantColor, 100);
    const glow = hexToRgba(dominantColor, 0.15);

    root.style.setProperty("--dynamic-accent", dominantColor);
    root.style.setProperty("--dynamic-bg-from", dark);
    root.style.setProperty("--dynamic-bg-to", darker);
    root.style.setProperty("--dynamic-glow", glow);

    useThemeStore.getState().setAccentColor(dominantColor);
  }, [dominantColor]);

  return { dominantColor };
}
