import { useParams } from "react-router";
import { useAlbum } from "@/features/albums/api/useAlbum";
import { MediaImage } from "@/components/shared/MediaImage";
import { TrackRow } from "@/components/shared/TrackRow";
import { PlayButton } from "@/components/shared/PlayButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePlayerStore, useQueueStore } from "@/store";
import { formatDuration } from "@/utils";
import { useCallback } from "react";

function AlbumSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-end gap-6">
        <Skeleton variant="rectangular" className="h-48 w-48" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-1">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="h-4 w-6" />
            <Skeleton variant="rectangular" className="h-10 w-10" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/5" />
            </div>
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlbumPage() {
  const { id } = useParams<{ id: string }>();
  const { data: album, isLoading, error } = useAlbum(id);

  const handlePlayAll = useCallback(() => {
    if (!album) return;
    useQueueStore.getState().setQueue(album.songs.map(s => ({ song: s, addedBy: "user", addedAt: new Date().toISOString(), position: 0 })));
    const first = album.songs[0];
    if (first) {
      usePlayerStore.getState().setCurrentSong(first);
    }
  }, [album]);

  if (isLoading) return <AlbumSkeleton />;

  if (error || !album) {
    return (
      <div className="p-6">
        <p className="text-error">Failed to load album.</p>
      </div>
    );
  }

  const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="p-6">
      {/* Hero */}
      <div className="mb-8 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
        <MediaImage src={album.coverUrl} alt={album.title} size="xl" className="shrink-0 shadow-2xl" />
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-subdued">Album</p>
          <h1 className="text-3xl font-bold text-white md:text-5xl">{album.title}</h1>
          <div className="flex flex-wrap items-center gap-1 text-sm text-text-subdued">
            <span className="font-semibold text-white">
              {album.artists.map((a) => a.name).join(", ")}
            </span>
            {album.releaseDate && (
              <>
                <span>&middot;</span>
                <span>{new Date(album.releaseDate).getFullYear()}</span>
              </>
            )}
            {album.totalTracks > 0 && (
              <>
                <span>&middot;</span>
                <span>{album.totalTracks} tracks</span>
              </>
            )}
            {totalDuration > 0 && (
              <>
                <span>&middot;</span>
                <span>{formatDuration(totalDuration)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Play */}
      <div className="mb-6">
        <PlayButton onClick={handlePlayAll} isPlaying={false} size="lg" />
      </div>

      {/* Track list header */}
      {album.songs.length > 0 && (
        <div className="mb-2 flex items-center gap-3 border-b border-white/10 px-3 pb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
          <span className="w-6 text-center">#</span>
          <span className="flex-1">Title</span>
          <span className="hidden w-40 md:block">Album</span>
          <span className="w-12 text-right">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="4" r="1.5" fill="currentColor" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </span>
        </div>
      )}

      {/* Track list */}
      <div className="space-y-0.5">
        {album.songs.map((track, idx) => (
          <TrackRow
            key={track.id}
            track={track}
            index={idx + 1}
            showAlbum={false}
            showCover
            showArtists
          />
        ))}
      </div>

      {/* Footer metadata */}
      {album.genres.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
          {album.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-text-subdued"
            >
              {genre}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
