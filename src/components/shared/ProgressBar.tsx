interface ProgressBarProps {
  current: number;
  total: number;
  onSeek: (time: number) => void;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
  size?: "sm" | "md";
}

export function ProgressBar(_props: ProgressBarProps) {
  return null;
}
