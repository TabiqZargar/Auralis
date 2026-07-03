import { Slider } from "@/components/ui/Slider";
import { formatDuration } from "@/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  onSeek: (time: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  size?: "sm" | "md";
}

export function ProgressBar({
  current,
  total,
  onSeek,
  onSeekStart,
  onSeekEnd,
  size = "sm",
}: ProgressBarProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 text-right text-xs tabular-nums text-text-subdued">
        {formatDuration(current)}
      </span>
      <Slider
        value={current}
        min={0}
        max={total || 1}
        step={1}
        onChange={onSeek}
        onSeekStart={onSeekStart}
        onSeekEnd={onSeekEnd}
        size={size}
        className="flex-1"
        ariaLabel="Seek"
      />
      <span className="w-10 text-xs tabular-nums text-text-subdued">
        {formatDuration(total)}
      </span>
    </div>
  );
}
