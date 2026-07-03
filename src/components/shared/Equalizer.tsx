import { useRef, useEffect } from "react";
import { audioEngine } from "@/lib/audio";
import { hexToRgba } from "@/utils/color";

interface EqualizerProps {
  barCount?: number;
  className?: string;
}

export function Equalizer({ barCount = 10, className = "" }: EqualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 120;
    const h = 32;
    canvas.width = w;
    canvas.height = h;

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(canvas).getPropertyValue("--dynamic-accent").trim() || "#1db954";
      const freq = audioEngine.getFrequencyData();
      const len = Math.min(freq.length, barCount);
      const step = Math.floor(freq.length / barCount);
      const barW = w / barCount;

      for (let i = 0; i < len; i++) {
        const idx = Math.min(i * step, freq.length - 1);
        const val = freq[idx]! / 255;
        const barH = val * h * 0.9;
        const x = i * barW + 1;
        const y = h - barH;

        const gradient = ctx.createLinearGradient(x, y, x, h);
        gradient.addColorStop(0, accent);
        gradient.addColorStop(1, hexToRgba(accent, 0.2));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barW - 2, barH, [2, 2, 0, 0]);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [barCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Audio equalizer"
      role="img"
    />
  );
}
