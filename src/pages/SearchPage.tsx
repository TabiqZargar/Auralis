import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { GridView } from "@/components/shared/GridView";
import { Section } from "@/components/shared/Section";
import { AlbumCard } from "@/components/shared/AlbumCard";
import { ArtistCard } from "@/components/shared/ArtistCard";
import { PlaylistCard } from "@/components/shared/PlaylistCard";
import { TrackRow } from "@/components/shared/TrackRow";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDebounce } from "@/hooks";
import { useSearch } from "@/features/search/api/useSearch";
import { config } from "@/config";
import { storageService } from "@/services/storage";
import { Clock, TrendingUp, Music } from "lucide-react";

function SearchSkeleton() {
  return (
    <div className="mt-6 space-y-2">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md px-3 py-2">
          <Skeleton variant="rectangular" className="h-10 w-10" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return storageService.get<string[]>("recent_searches") ?? [];
  });

  const debouncedQuery = useDebounce(query, config.limits.searchDebounceMs);
  const { data: results, isLoading, error } = useSearch(debouncedQuery);

  useEffect(() => {
    if (!debouncedQuery.trim() || isLoading || !results || results.total === 0) return;
    setRecentSearches((prev) => {
      const updated = [
        debouncedQuery,
        ...prev.filter((s) => s !== debouncedQuery),
      ].slice(0, config.storage.recentSearches);
      storageService.set("recent_searches", updated);
      return updated;
    });
  }, [debouncedQuery, isLoading, results]);

  const showResults = debouncedQuery.trim().length > 0;
  const showHome = !showResults && !query.trim();

  const hasResults = results && results.total > 0;

  const albumResults = useMemo(() => results?.albums ?? [], [results]);
  const artistResults = useMemo(() => results?.artists ?? [], [results]);
  const playlistResults = useMemo(() => results?.playlists ?? [], [results]);
  const songResults = useMemo(() => results?.songs ?? [], [results]);

  return (
    <div className="p-6">
      <div className="mb-6 max-w-xl">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search songs, albums, artists, or playlists"
          autoFocus
        />
      </div>

      {/* Initial state: recent searches or prompt */}
      {showHome && (
        <div className="mt-8">
          {recentSearches.length > 0 ? (
            <Section title="Recent Searches">
              <div className="space-y-1">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-text-subdued transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <Clock size={16} />
                    {term}
                  </button>
                ))}
              </div>
            </Section>
          ) : (
            <div className="mt-16 flex flex-col items-center gap-4 text-text-muted">
              <Music size={48} />
              <p className="text-lg">Search for your favorite music</p>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {showResults && isLoading && <SearchSkeleton />}

      {/* Error state */}
      {showResults && !isLoading && error && (
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <p className="text-error">Search failed. Please try again.</p>
          <p className="text-xs text-text-muted">
            Make sure VITE_SPOTIFY_CLIENT_ID and VITE_SPOTIFY_CLIENT_SECRET are set in your .env file.
          </p>
        </div>
      )}

      {/* Empty state */}
      {showResults && !isLoading && !error && !hasResults && (
        <div className="mt-16 flex flex-col items-center gap-3 text-text-muted">
          <TrendingUp size={40} />
          <p className="text-lg">No results found for &ldquo;{debouncedQuery}&rdquo;</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {/* Results */}
      {showResults && !isLoading && hasResults && (
        <div className="mt-2 space-y-8">
          {/* Songs */}
          {songResults.length > 0 && (
            <Section title="Songs">
              <div className="space-y-0.5">
                {songResults.slice(0, 10).map((track) => (
                  <TrackRow key={track.id} track={track} showAlbum showArtists showCover />
                ))}
              </div>
            </Section>
          )}

          {/* Albums */}
          {albumResults.length > 0 && (
            <Section title="Albums">
              <GridView columns={4}>
                {albumResults.slice(0, 8).map((album) => (
                  <AlbumCard key={album.id} album={album} size="md" />
                ))}
              </GridView>
            </Section>
          )}

          {/* Artists */}
          {artistResults.length > 0 && (
            <Section title="Artists">
              <GridView columns={6} gap="md">
                {artistResults.slice(0, 6).map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} size="md" />
                ))}
              </GridView>
            </Section>
          )}

          {/* Playlists */}
          {playlistResults.length > 0 && (
            <Section title="Playlists">
              <GridView columns={4}>
                {playlistResults.slice(0, 8).map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} size="md" />
                ))}
              </GridView>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}
