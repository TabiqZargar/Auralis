import { useParams } from "react-router";
import { useArtist, useRelatedArtists } from "@/features/artists/api/useArtist";
import { MediaImage } from "@/components/shared/MediaImage";
import { TrackRow } from "@/components/shared/TrackRow";
import { PlayButton } from "@/components/shared/PlayButton";
import { Section } from "@/components/shared/Section";
import { GridView } from "@/components/shared/GridView";
import { AlbumCard } from "@/components/shared/AlbumCard";
import { ArtistCard } from "@/components/shared/ArtistCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePlayerStore, useQueueStore } from "@/store";
import { formatNumber } from "@/utils";
import { useCallback } from "react";

function ArtistSkeleton() {
  return (
    <div className="p-6">
      <div className="mb-8 flex items-end gap-6">
        <Skeleton variant="circular" className="h-52 w-52" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  );
}

export function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useArtist(id);
  const { data: relatedArtists } = useRelatedArtists(id);

  const handlePlayTopTrack = useCallback(() => {
    if (!data) return;
    useQueueStore.getState().setQueue(data.topTracks.map(s => ({ song: s, addedBy: "user", addedAt: new Date().toISOString(), position: 0 })));
    const first = data.topTracks[0];
    if (first) {
      usePlayerStore.getState().setCurrentSong(first);
    }
  }, [data]);

  if (isLoading) return <ArtistSkeleton />;

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-error">Failed to load artist.</p>
      </div>
    );
  }

  const { artist, topTracks, albums } = data;

  return (
    <div className="p-6">
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-b from-surface-highlight to-surface">
        <div className="flex flex-col items-center gap-6 p-8 md:flex-row md:items-end">
          <MediaImage
            src={artist.imageUrl}
            alt={artist.name}
            size="xl"
            className="shrink-0 !rounded-full shadow-2xl"
          />
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-subdued">Artist</p>
            <h1 className="text-3xl font-bold text-white md:text-5xl">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-text-subdued">
              {artist.followers > 0 && (
                <span>{formatNumber(artist.followers)} followers</span>
              )}
              {artist.genres.length > 0 && (
                <>
                  <span>&middot;</span>
                  {artist.genres.slice(0, 3).map((g) => (
                    <span key={g} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                      {g}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Play */}
      {topTracks.length > 0 && (
        <div className="mb-8">
          <PlayButton onClick={handlePlayTopTrack} isPlaying={false} size="lg" />
        </div>
      )}

      {/* Top Tracks */}
      {topTracks.length > 0 && (
        <Section title="Popular">
          <div className="space-y-0.5">
            {topTracks.slice(0, 10).map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx + 1}
                showAlbum
                showCover
                showArtists={false}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Albums */}
      {albums.length > 0 && (
        <Section title="Discography">
          <GridView columns={5}>
            {albums.slice(0, 10).map((album) => (
              <AlbumCard key={album.id} album={album} size="md" />
            ))}
          </GridView>
        </Section>
      )}

      {/* Related Artists */}
      {relatedArtists && relatedArtists.length > 0 && (
        <Section title="Fans Also Like">
          <GridView columns={6} gap="md">
            {relatedArtists.slice(0, 6).map((related) => (
              <ArtistCard key={related.id} artist={related} size="md" />
            ))}
          </GridView>
        </Section>
      )}
    </div>
  );
}
