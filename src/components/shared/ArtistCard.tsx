import { useNavigate } from "react-router";
import { ROUTE_BUILDERS } from "@/constants";
import { MediaImage } from "./MediaImage";
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(ROUTE_BUILDERS.artist(artist.id));
    }
  };

  return (
    <button
      onClick={handleClick}
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
