interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  size?: "sm" | "md";
}

export function VolumeControl(_props: VolumeControlProps) {
  return null;
}
