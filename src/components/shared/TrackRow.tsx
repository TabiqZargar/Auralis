import type { Song } from "@/types";

interface TrackRowProps {
  track: Song;
  index?: number;
  showAlbum?: boolean;
  showArtists?: boolean;
  showCover?: boolean;
  selected?: boolean;
  onPlay?: () => void;
  onAddToQueue?: () => void;
}

export function TrackRow(_props: TrackRowProps) {
  return null;
}
