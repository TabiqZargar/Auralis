import { useNewReleases, useFeaturedPlaylists, useTrendingArtists } from "@/features/home/api/useHome";
import { Section } from "@/components/shared/Section";
import { GridView } from "@/components/shared/GridView";
import { AlbumCard } from "@/components/shared/AlbumCard";
import { PlaylistCard } from "@/components/shared/PlaylistCard";
import { ArtistCard } from "@/components/shared/ArtistCard";
import { Skeleton } from "@/components/ui/Skeleton";

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <GridView>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-md p-3">
          <Skeleton variant="rectangular" className="aspect-square w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </GridView>
  );
}

export function HomePage() {
  const { data: newReleases, isLoading: loadingReleases, error: releasesError } = useNewReleases();
  const { data: playlists, isLoading: loadingPlaylists, error: playlistsError } = useFeaturedPlaylists();
  const { data: artists, isLoading: loadingArtists, error: artistsError } = useTrendingArtists();

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold text-white">Home</h1>

      <Section
        title="New Releases"
        action={{ label: "Show all", onClick: () => {} }}
      >
        {loadingReleases ? (
          <SkeletonGrid count={6} />
        ) : releasesError ? (
          <p className="text-sm text-error">Failed to load new releases.</p>
        ) : newReleases && newReleases.length > 0 ? (
          <GridView>
            {newReleases.slice(0, 12).map((album) => (
              <AlbumCard key={album.id} album={album} size="md" />
            ))}
          </GridView>
        ) : (
          <p className="text-sm text-text-subdued">No new releases available.</p>
        )}
      </Section>

      <Section
        title="Featured Playlists"
        action={{ label: "Show all", onClick: () => {} }}
      >
        {loadingPlaylists ? (
          <SkeletonGrid count={6} />
        ) : playlistsError ? (
          <p className="text-sm text-error">Failed to load featured playlists.</p>
        ) : playlists && playlists.length > 0 ? (
          <GridView>
            {playlists.slice(0, 12).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} size="md" />
            ))}
          </GridView>
        ) : (
          <p className="text-sm text-text-subdued">No featured playlists available.</p>
        )}
      </Section>

      <Section
        title="Popular Artists"
        subtitle="Trending now"
      >
        {loadingArtists ? (
          <SkeletonGrid count={6} />
        ) : artistsError ? (
          <p className="text-sm text-error">Failed to load popular artists.</p>
        ) : artists && artists.length > 0 ? (
          <GridView columns={6} gap="md">
            {artists.slice(0, 6).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} size="md" />
            ))}
          </GridView>
        ) : (
          <p className="text-sm text-text-subdued">No artists available.</p>
        )}
      </Section>
    </div>
  );
}
