import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/Slider";

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  size?: "sm" | "md";
}

export function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  size = "sm",
}: VolumeControlProps) {
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const iconSize = size === "sm" ? 16 : 20;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onToggleMute}
        aria-label={muted ? "Unmute" : "Mute"}
        className="rounded p-1 text-text-subdued transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <VolumeIcon size={iconSize} />
      </button>
      <Slider
        value={muted ? 0 : volume}
        min={0}
        max={1}
        step={0.01}
        onChange={onVolumeChange}
        size="sm"
        className="w-24"
        ariaLabel="Volume"
      />
    </div>
  );
}
