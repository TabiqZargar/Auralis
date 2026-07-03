import { TrackRow } from "./TrackRow";
import type { Song } from "@/types";

interface TrackListProps {
  tracks: Song[];
  onPlay?: (index: number) => void;
  onContextMenu?: (e: React.MouseEvent, track: Song, index: number) => void;
  showIndex?: boolean;
  showAlbum?: boolean;
  showArtists?: boolean;
  compact?: boolean;
}

export function TrackList({
  tracks,
  onPlay,
  onContextMenu,
  showIndex = true,
  showAlbum = true,
  showArtists = true,
}: TrackListProps) {
  if (tracks.length === 0) return null;

  return (
    <div className="flex flex-col" role="list" aria-label="Track list">
      {tracks.map((track, i) => (
        <TrackRow
          key={track.id}
          track={track}
          index={showIndex ? i + 1 : undefined}
          showAlbum={showAlbum}
          showArtists={showArtists}
          showCover={false}
          onPlay={onPlay ? () => onPlay(i) : undefined}
          onContextMenu={
            onContextMenu
              ? (e: React.MouseEvent) => onContextMenu(e, track, i)
              : undefined
          }
        />
      ))}
    </div>
  );
}
