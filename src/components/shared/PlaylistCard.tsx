import { useNavigate } from "react-router";
import { ROUTE_BUILDERS } from "@/constants";
import { MediaImage } from "./MediaImage";
import type { Playlist } from "@/types";

interface PlaylistCardProps {
  playlist: Playlist;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const sizeClasses = {
  sm: { card: "w-36", image: "sm" as const },
  md: { card: "w-44", image: "md" as const },
  lg: { card: "w-56", image: "lg" as const },
};

export function PlaylistCard({ playlist, size = "md", onClick }: PlaylistCardProps) {
  const navigate = useNavigate();
  const { card, image } = sizeClasses[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(ROUTE_BUILDERS.playlist(playlist.id));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group/card flex w-full flex-col items-start gap-2 rounded-md bg-transparent p-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <div className={`${card}`}>
        <MediaImage
          src={playlist.coverUrl}
          alt={playlist.title}
          size={image}
          className="w-full shadow-lg"
        />
      </div>
      <div className="w-full min-w-0">
        <p className="truncate text-sm font-semibold text-white">{playlist.title}</p>
        <p className="line-clamp-2 text-xs text-text-subdued">
          {playlist.description || `${playlist.totalTracks} tracks`}
        </p>
      </div>
    </button>
  );
}
