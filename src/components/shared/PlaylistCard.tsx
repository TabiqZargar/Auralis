import type { Playlist } from "@/types";

interface PlaylistCardProps {
  playlist: Playlist;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function PlaylistCard(_props: PlaylistCardProps) {
  return null;
}
