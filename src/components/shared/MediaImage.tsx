import { Music } from "lucide-react";

interface MediaImageProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  rounded?: boolean | "full";
  className?: string;
}

const sizeMap = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-28 w-28",
  xl: "h-48 w-48",
  full: "h-full w-full",
};

const iconSizeMap = {
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
  full: 48,
};

export function MediaImage({
  src,
  alt,
  size = "md",
  className = "",
}: MediaImageProps) {
  const roundedClass = "rounded";

  if (!src) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center bg-surface-highlight ${roundedClass} ${sizeMap[size]} ${className}`}
        aria-label={alt}
      >
        <Music
          size={iconSizeMap[size]}
          className="text-text-muted"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 object-cover ${roundedClass} ${sizeMap[size]} ${className}`}
    />
  );
}
