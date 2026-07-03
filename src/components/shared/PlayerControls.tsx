import {
  Shuffle,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
} from "lucide-react";
import { PlayButton } from "./PlayButton";

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: "off" | "one" | "all";
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function PlayerControls({
  isPlaying,
  shuffle,
  repeatMode,
  onTogglePlay,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  size = "md",
  disabled = false,
}: PlayerControlsProps) {
  const btnSize = size === "sm" ? "sm" : "md";
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleShuffle}
        aria-label={`Shuffle ${shuffle ? "on" : "off"}`}
        className={`rounded p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
          shuffle
            ? "text-accent hover:text-accent-hover"
            : "text-text-subdued hover:text-white"
        }`}
      >
        <Shuffle size={iconSize} />
      </button>

      <button
        onClick={onPrevious}
        aria-label="Previous track"
        className="rounded p-1.5 text-text-subdued transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <SkipBack size={iconSize} />
      </button>

      <PlayButton
        onClick={onTogglePlay}
        isPlaying={isPlaying}
        size={btnSize}
        disabled={disabled}
      />

      <button
        onClick={onNext}
        aria-label="Next track"
        className="rounded p-1.5 text-text-subdued transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <SkipForward size={iconSize} />
      </button>

      <button
        onClick={onCycleRepeat}
        aria-label={`Repeat ${repeatMode}`}
        className={`rounded p-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
          repeatMode !== "off"
            ? "text-accent hover:text-accent-hover"
            : "text-text-subdued hover:text-white"
        }`}
      >
        {repeatMode === "one" ? (
          <Repeat1 size={iconSize} />
        ) : (
          <Repeat size={iconSize} />
        )}
      </button>
    </div>
  );
}
