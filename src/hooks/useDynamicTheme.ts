import { useEffect, useRef, useState } from "react";
import { usePlayerStore, useThemeStore } from "@/store";
import { extractDominantColor, hexToRgba, darkenColor } from "@/utils/color";

export function useDynamicTheme() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
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
