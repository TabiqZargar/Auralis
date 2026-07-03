import { useRef, useEffect, useCallback } from "react";
import { audioEngine } from "@/lib/audio";

export type VisualizerMode = "bars" | "circle" | "waveform" | "particles";

interface AudioVisualizerProps {
  mode?: VisualizerMode;
  className?: string;
  barCount?: number;
  width?: number;
  height?: number;
}

function drawBars(
  ctx: CanvasRenderingContext2D,
  freq: Uint8Array,
  w: number,
  h: number,
  barCount: number,
  color: string,
) {
  const len = Math.min(freq.length, barCount);
  const barW = w / len;
  ctx.fillStyle = color;
  for (let i = 0; i < len; i++) {
    const barH = (freq[i]! / 255) * h * 0.8;
    const x = i * barW;
    const y = h - barH;
    const radius = Math.min(barW * 0.3, 4);
    ctx.beginPath();
    ctx.roundRect(x + 1, y, barW - 2, barH, radius);
    ctx.fill();
  }
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  freq: Uint8Array,
  w: number,
  h: number,
  barCount: number,
  color: string,
  glowColor: string,
) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.25;
  const len = Math.min(freq.length, barCount);
  const angleStep = (Math.PI * 2) / len;

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const r = radius + (freq[i]! / 255) * radius * 0.8;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = hexToRgba(color, 0.1);
  ctx.fill();
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  td: Uint8Array,
  w: number,
  h: number,
  color: string,
  glowColor: string,
) {
  const len = td.length;
  const step = w / len;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const x = i * step;
    const y = (td[i]! / 255) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  freq: Uint8Array,
  w: number,
  h: number,
  color: string,
  glowColor: string,
  particles: Particle[],
) {
  const energy =
    freq.reduce((s, v) => s + v, 0) / freq.length / 255;

  while (particles.length < 50) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.2,
    });
  }

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 15;
  ctx.fillStyle = color;

  for (const p of particles) {
    p.x += p.vx + energy * 2;
    p.y += p.vy - energy * 1.5;
    p.alpha = Math.max(0.1, p.alpha - 0.003);
    p.size = Math.max(0.5, p.size + (energy - 0.5) * 0.5);

    if (p.x < 0 || p.x > w || p.y < 0 || p.y > h || p.alpha < 0.1) {
      p.x = Math.random() * w;
      p.y = h + 10;
      p.vx = (Math.random() - 0.5) * 2;
      p.vy = -(Math.random() * 2 + 1);
      p.size = Math.random() * 3 + 1;
      p.alpha = Math.random() * 0.5 + 0.3;
    }

    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function AudioVisualizer({
  mode = "bars",
  className = "",
  barCount = 64,
  width,
  height,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = width ?? canvas.width;
    const h = height ?? canvas.height;
    if (w === 0 || h === 0) return;

    const freq = audioEngine.getFrequencyData();
    const td = audioEngine.getTimeDomainData();
    const c = getComputedStyle(canvas).getPropertyValue("--dynamic-accent").trim() || "#1db954";
    const gc = getComputedStyle(canvas).getPropertyValue("--dynamic-glow").trim() || "rgba(29,185,84,0.3)";

    ctx.clearRect(0, 0, w, h);

    switch (mode) {
      case "bars":
        drawBars(ctx, freq, w, h, barCount, c);
        break;
      case "circle":
        drawCircle(ctx, freq, w, h, barCount, c, gc);
        break;
      case "waveform":
        drawWaveform(ctx, td, w, h, c, gc);
        break;
      case "particles":
        drawParticles(ctx, freq, w, h, c, gc, particlesRef.current);
        break;
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [mode, barCount, width, height]);

  useEffect(() => {
    audioEngine.getContext()?.resume();
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [draw]);

  useEffect(() => {
    particlesRef.current = [];
  }, [mode]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      aria-label={`Audio visualizer in ${mode} mode`}
      role="img"
    />
  );
}
