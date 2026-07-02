import type { Album } from "@/types";

interface AlbumCardProps {
  album: Album;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function AlbumCard(_props: AlbumCardProps) {
  return null;
}
