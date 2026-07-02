import { useNavigate } from "react-router";
import { ROUTE_BUILDERS } from "@/constants";
import { MediaImage } from "./MediaImage";
import { useContextMenuStore } from "@/store/contextMenuStore";
import { useQueueStore, usePlayerStore, useLibraryStore } from "@/store";
import { useToastStore } from "@/store/toastStore";
import { Play, ListPlus, User, Heart } from "lucide-react";
import type { Artist } from "@/types";

interface ArtistCardProps {
  artist: Artist;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const sizeClasses = {
  sm: { container: "w-32", image: "sm" as const },
  md: { container: "w-40", image: "md" as const },
  lg: { container: "w-52", image: "lg" as const },
};

export function ArtistCard({ artist, size = "md", onClick }: ArtistCardProps) {
  const navigate = useNavigate();
  const { container, image } = sizeClasses[size];
  const isFollowing = useLibraryStore((s) =>
    s.followedArtists.includes(artist.id),
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(ROUTE_BUILDERS.artist(artist.id));
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const open = useContextMenuStore.getState().open;
    open(e.clientX, e.clientY, [
      {
        label: "Play Top Tracks",
        icon: <Play size={14} />,
        onClick: () => {
          if (artist.topTracks.length > 0) {
            const q = useQueueStore.getState();
            const p = usePlayerStore.getState();
            q.setQueue(artist.topTracks, 0);
            p.loadTrack(artist.topTracks[0]!);
          }
        },
      },
      {
        label: "Add to Queue",
        icon: <ListPlus size={14} />,
        onClick: () => {
          const q = useQueueStore.getState();
          artist.topTracks.forEach((track) => q.addTrack(track));
          artist.albums.forEach((album) =>
            album.songs.forEach((song) => q.addTrack(song)),
          );
          useToastStore.getState().addToast("Artist tracks added to queue", "success", 2000);
        },
      },
      {
        label: isFollowing ? "Unfollow" : "Follow",
        icon: <Heart size={14} />,
        onClick: () =>
          useLibraryStore.getState().toggleFollowArtist(artist.id),
      },
      {
        label: "Go to Artist",
        icon: <User size={14} />,
        onClick: () => navigate(ROUTE_BUILDERS.artist(artist.id)),
      },
    ]);
  };

  return (
    <button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      className="group/card flex w-full flex-col items-center gap-3 rounded-md bg-transparent p-4 text-center transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <div className={`${container}`}>
        <MediaImage
          src={artist.imageUrl}
          alt={artist.name}
          size={image}
          className="!rounded-full shadow-lg"
        />
      </div>
      <div className="w-full min-w-0">
        <p className="truncate text-sm font-semibold text-white">{artist.name}</p>
        {artist.genres.length > 0 && (
          <p className="truncate text-xs text-text-subdued">{artist.genres[0]}</p>
        )}
      </div>
    </button>
  );
}
