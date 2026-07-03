import type { Song } from "@/types";

interface TrackListProps {
  tracks: Song[];
  onPlay?: (index: number) => void;
  onAddToQueue?: (track: Song) => void;
  showIndex?: boolean;
  showAlbum?: boolean;
  showArtists?: boolean;
  compact?: boolean;
}

export function TrackList(_props: TrackListProps) {
  return null;
}
