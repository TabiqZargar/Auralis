import { useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { usePlayerStore, useQueueStore, useLibraryStore } from "@/store";
import { formatDuration } from "@/utils";
import { MediaImage } from "./MediaImage";
import { LikeButton } from "./LikeButton";
import type { Song } from "@/types";

interface TrackRowProps {
  track: Song;
  index?: number;
  showAlbum?: boolean;
  showArtists?: boolean;
  showCover?: boolean;
  selected?: boolean;
  onPlay?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export function TrackRow({
  track,
  index,
  showAlbum = true,
  showArtists = true,
  showCover = true,
  selected = false,
  onPlay,
  onContextMenu,
}: TrackRowProps) {
  const currentTrackId = usePlayerStore((s) => s.currentSong?.id);
  const isCurrentTrack = currentTrackId === track.id;
  const isPlaying = usePlayerStore((s) => s.status === "playing" && isCurrentTrack);
  const isLiked = useLibraryStore((s) => s.likedSongs.some((ls) => ls.id === track.id));
  const toggleLikedSong = useLibraryStore((s) => s.toggleLikedSong);

  const handlePlay = useCallback(() => {
    if (onPlay) {
      onPlay();
    } else {
      const q = useQueueStore.getState();
      const existingIdx = q.items.findIndex((item) => item.song.id === track.id);
      if (existingIdx >= 0) {
        useQueueStore.getState().setCurrentIndex(existingIdx);
      } else {
        const playerState = usePlayerStore.getState();
        const qState = useQueueStore.getState();
        qState.setQueue([{ song: track, addedBy: "user", addedAt: new Date().toISOString(), position: 0 }]);
        playerState.setCurrentSong(track);
      }
    }
  }, [track, onPlay]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handlePlay}
      onContextMenu={onContextMenu}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handlePlay();
      }}
      aria-label={`Play ${track.title}`}
      className={`group/track flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        selected || isCurrentTrack ? "bg-white/10" : ""
      }`}
    >
      <div className="flex w-6 shrink-0 items-center justify-center">
        <span className="w-4 text-right text-sm text-text-muted group-hover/track:hidden">
          {index ?? ""}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
          className="hidden text-white group-hover/track:block"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" />
          )}
        </button>
      </div>

      {showCover && (
        <MediaImage
          src={track.coverUrl}
          alt={track.title}
          size="sm"
          className="shrink-0"
        />
      )}

      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm ${
              isCurrentTrack ? "text-accent" : "text-white"
            }`}
          >
            {track.title}
          </p>
          {showArtists && track.artists.length > 0 && (
            <p className="truncate text-xs text-text-subdued">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          )}
        </div>

        {showAlbum && (
          <p className="hidden w-40 truncate text-sm text-text-subdued md:block">
            {track.album.title}
          </p>
        )}

        <div className="flex items-center gap-1">
          <div
            className="opacity-0 transition-opacity group-hover/track:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <LikeButton
              isLiked={isLiked}
              onToggle={() => toggleLikedSong(track)}
              size="sm"
            />
          </div>
          <p className="w-12 text-right text-sm tabular-nums text-text-subdued">
            {formatDuration(track.duration)}
          </p>
        </div>
      </div>
    </div>
  );
}
