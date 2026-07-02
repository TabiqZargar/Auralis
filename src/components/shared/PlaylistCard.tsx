import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ROUTE_BUILDERS } from "@/constants";
import { MediaImage } from "./MediaImage";
import { useContextMenuStore } from "@/store/contextMenuStore";
import { useQueueStore, usePlayerStore, useLibraryStore } from "@/store";
import { useToastStore } from "@/store/toastStore";
import { Play, ListPlus, Trash2, Copy, Pencil, Disc3 } from "lucide-react";
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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const open = useContextMenuStore.getState().open;
    const isUserPlaylist = playlist.owner === "user";

    const items: Parameters<typeof open>[2] = [
      {
        label: "Play Playlist",
        icon: <Play size={14} />,
        onClick: () => {
          if (playlist.songs.length > 0) {
            const q = useQueueStore.getState();
            const p = usePlayerStore.getState();
            q.setQueue(playlist.songs, 0);
            p.loadTrack(playlist.songs[0]!);
          }
        },
      },
      {
        label: "Add to Queue",
        icon: <ListPlus size={14} />,
        onClick: () => {
          const q = useQueueStore.getState();
          playlist.songs.forEach((song) => q.addTrack(song));
          useToastStore.getState().addToast("Playlist added to queue", "success", 2000);
        },
      },
      ...(isUserPlaylist
        ? [
            { divider: true, label: "", onClick: undefined } as const,
            {
              label: "Rename",
              icon: <Pencil size={14} />,
              onClick: () => {
                const name = window.prompt("New playlist name:", playlist.title);
                if (name?.trim()) {
                  useLibraryStore.getState().updatePlaylist(playlist.id, {
                    title: name.trim(),
                    updatedAt: new Date().toISOString(),
                  });
                  useToastStore.getState().addToast(`Renamed to "${name.trim()}"`, "success", 2000);
                }
              },
            },
            {
              label: "Duplicate",
              icon: <Copy size={14} />,
              onClick: () => {
                useLibraryStore.getState().duplicatePlaylist(playlist.id);
              },
            },
            {
              label: "Delete",
              icon: <Trash2 size={14} />,
              danger: true,
              onClick: () => {
                useLibraryStore.getState().removePlaylist(playlist.id);
                useToastStore.getState().addToast("Playlist deleted", "info", 2000);
              },
            },
          ]
        : []),
      {
        label: "Go to Playlist",
        icon: <Disc3 size={14} />,
        onClick: () => navigate(ROUTE_BUILDERS.playlist(playlist.id)),
      },
    ];

    open(e.clientX, e.clientY, items);
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
    </motion.button>
  );
}
