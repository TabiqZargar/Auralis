import { useNavigate } from "react-router";
import { useLibraryStore } from "@/store";
import { Section } from "@/components/shared/Section";
import { GridView } from "@/components/shared/GridView";
import { PlaylistCard } from "@/components/shared/PlaylistCard";
import { TrackRow } from "@/components/shared/TrackRow";
import { ROUTES } from "@/constants";
import { Heart, Clock, ListMusic } from "lucide-react";

export function LibraryPage() {
  const navigate = useNavigate();
  const likedSongs = useLibraryStore((s) => s.likedSongs);
  const playlists = useLibraryStore((s) => s.playlists);
  const recentlyPlayed = useLibraryStore((s) => s.recentlyPlayed);

  return (
    <div className="p-6">
      <h1 className="mb-8 text-3xl font-bold text-white">Your Library</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-pink-600 to-pink-800 p-4 text-left transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Heart size={32} className="text-white" />
          <div>
            <p className="text-lg font-bold text-white">Liked Songs</p>
            <p className="text-sm text-white/80">{likedSongs.length} songs</p>
          </div>
        </button>

        <button
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 text-left transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ListMusic size={32} className="text-white" />
          <div>
            <p className="text-lg font-bold text-white">Playlists</p>
            <p className="text-sm text-white/80">{playlists.length} playlists</p>
          </div>
        </button>

        <button
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="flex items-center gap-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-left transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Clock size={32} className="text-white" />
          <div>
            <p className="text-lg font-bold text-white">Recently Played</p>
            <p className="text-sm text-white/80">{recentlyPlayed.length} tracks</p>
          </div>
        </button>
      </div>

      {likedSongs.length > 0 && (
        <Section title="Liked Songs">
          <div className="space-y-0.5">
            {likedSongs.slice(0, 10).map((track) => (
              <TrackRow key={track.id} track={track} showAlbum showArtists showCover />
            ))}
          </div>
        </Section>
      )}

      {playlists.length > 0 && (
        <Section title="Playlists">
          <GridView columns={4}>
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} size="md" />
            ))}
          </GridView>
        </Section>
      )}

      {recentlyPlayed.length > 0 && (
        <Section title="Recently Played">
          <div className="space-y-0.5">
            {recentlyPlayed.slice(0, 15).map((track) => (
              <TrackRow key={track.id} track={track} showAlbum showArtists showCover />
            ))}
          </div>
        </Section>
      )}

      {likedSongs.length === 0 && playlists.length === 0 && recentlyPlayed.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center text-text-muted">
          <ListMusic size={48} />
          <p className="text-lg">Your library is empty</p>
          <p className="text-sm">Like songs or create playlists to get started</p>
        </div>
      )}
    </div>
  );
}
