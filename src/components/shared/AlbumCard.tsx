import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ROUTE_BUILDERS } from "@/constants";
import { MediaImage } from "./MediaImage";
import { useContextMenuStore } from "@/store/contextMenuStore";
import { useQueueStore, usePlayerStore } from "@/store";
import { useToastStore } from "@/store/toastStore";
import { Play, ListPlus, Disc3 } from "lucide-react";
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const open = useContextMenuStore.getState().open;
    open(e.clientX, e.clientY, [
      {
        label: "Play Album",
        icon: <Play size={14} />,
        onClick: () => {
          if (album.songs.length > 0) {
            const q = useQueueStore.getState();
            const p = usePlayerStore.getState();
            q.setQueue(album.songs, 0);
            p.loadTrack(album.songs[0]!);
          }
        },
      },
      {
        label: "Add to Queue",
        icon: <ListPlus size={14} />,
        onClick: () => {
          const q = useQueueStore.getState();
          album.songs.forEach((song) => q.addTrack(song));
          useToastStore.getState().addToast("Album added to queue", "success", 2000);
        },
      },
      {
        label: "Go to Album",
        icon: <Disc3 size={14} />,
        onClick: () => navigate(ROUTE_BUILDERS.album(album.id)),
      },
    ]);
  };

  return (
    <motion.button
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
    </motion.button>
  );
}
