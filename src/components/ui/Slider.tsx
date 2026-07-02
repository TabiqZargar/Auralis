import { useCallback, useRef } from "react";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

export function Slider({
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  onSeekStart,
  onSeekEnd,
  orientation = "horizontal",
  size = "md",
  className = "",
  ariaLabel = "Slider",
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const clamp = useCallback(
    (val: number) => Math.min(max, Math.max(min, val)),
    [min, max],
  );

  const toValue = useCallback(
    (clientPos: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const rect = track.getBoundingClientRect();
      let ratio: number;
      if (orientation === "horizontal") {
        ratio = (clientPos - rect.left) / rect.width;
      } else {
        ratio = (rect.bottom - clientPos) / rect.height;
      }
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      return clamp(stepped);
    },
    [min, max, step, clamp, value, orientation],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      onSeekStart?.();
      const newValue = toValue(e.clientX);
      onChange(newValue);
      const handlePointerMove = (ev: PointerEvent) => {
        if (!isDragging.current) return;
        const v = toValue(ev.clientX);
        onChange(v);
      };
      const handlePointerUp = () => {
        isDragging.current = false;
        onSeekEnd?.();
        document.removeEventListener("pointermove", handlePointerMove);
        document.removeEventListener("pointerup", handlePointerUp);
      };
      document.addEventListener("pointermove", handlePointerMove);
      document.addEventListener("pointerup", handlePointerUp);
    },
    [toValue, onChange, onSeekStart, onSeekEnd],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const stepSize = step;
      let newValue = value;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        newValue = clamp(value + stepSize);
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        newValue = clamp(value - stepSize);
        e.preventDefault();
      } else if (e.key === "Home") {
        newValue = min;
        e.preventDefault();
      } else if (e.key === "End") {
        newValue = max;
        e.preventDefault();
      }
      if (newValue !== value) {
        onChange(newValue);
      }
    },
    [value, step, min, max, clamp, onChange],
  );

  const percentage = max !== min ? ((value - min) / (max - min)) * 100 : 0;

  const heightClass = size === "sm" ? "h-1" : size === "lg" ? "h-1.5" : "h-1";

  return (
    <div
      className={`group/slider relative flex w-full cursor-pointer items-center ${className}`}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-orientation={orientation}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={trackRef}
        className={`relative w-full overflow-hidden rounded-full bg-white/15 ${heightClass}`}
      >
        <div
          className={`absolute left-0 top-0 h-full rounded-full bg-white transition-[width] duration-75 group-hover/slider:bg-accent ${heightClass}`}
          style={{ width: `${percentage}%` }}
        />
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-sm transition-opacity duration-150 group-hover/slider:opacity-100 ${
            size === "sm" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"
          }`}
          style={{ left: `calc(${percentage}% - ${size === "sm" ? 6 : size === "lg" ? 8 : 7}px)` }}
        />
      </div>
    </div>
  );
}
