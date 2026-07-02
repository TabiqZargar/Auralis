import { useState } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  fallback?: string;
}

const sizeMap: Record<string, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-2xl",
};

export function Avatar({ src, alt = "", size = "md", fallback }: AvatarProps) {
  const [error, setError] = useState(false);
  const initials = fallback ?? (alt ? alt.slice(0, 2).toUpperCase() : "?");

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className={`rounded-full object-cover ${sizeMap[size]}`}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-surface-highlight font-medium text-white ${sizeMap[size]}`}
      aria-label={alt}
    >
      {initials}
    </div>
  );
}
