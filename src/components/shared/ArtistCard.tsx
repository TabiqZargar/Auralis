import type { Artist } from "@/types";

interface ArtistCardProps {
  artist: Artist;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function ArtistCard(_props: ArtistCardProps) {
  return null;
}
