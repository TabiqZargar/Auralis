import { useNavigate } from "react-router";
import { ROUTE_BUILDERS } from "@/constants";
import { MediaImage } from "./MediaImage";
import type { Album } from "@/types";

interface AlbumCardProps {
  album: Album;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const sizeClasses = {
  sm: { card: "w-36", image: "sm" as const },
  md: { card: "w-44", image: "md" as const },
  lg: { card: "w-56", image: "lg" as const },
};

export function AlbumCard({ album, size = "md", onClick }: AlbumCardProps) {
  const navigate = useNavigate();
  const { card, image } = sizeClasses[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(ROUTE_BUILDERS.album(album.id));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group/card flex w-full flex-col items-start gap-2 rounded-md bg-transparent p-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <div className={`${card}`}>
        <MediaImage
          src={album.coverUrl}
          alt={album.title}
          size={image}
          className="w-full shadow-lg transition-shadow duration-300 group-hover/card:shadow-xl"
        />
      </div>
      <div className="w-full min-w-0">
        <p className="truncate text-sm font-semibold text-white">{album.title}</p>
        <p className="truncate text-xs text-text-subdued">
          {album.artists.map((a) => a.name).join(", ")}
        </p>
      </div>
    </button>
  );
}
