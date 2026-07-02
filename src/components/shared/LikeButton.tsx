import { Heart } from "lucide-react";

interface LikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass = {
  sm: { btn: "p-1", icon: 14 },
  md: { btn: "p-1.5", icon: 18 },
  lg: { btn: "p-2", icon: 22 },
};

export function LikeButton({
  isLiked,
  onToggle,
  size = "md",
  className = "",
}: LikeButtonProps) {
  const { btn, icon } = sizeClass[size];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isLiked ? "Unlike song" : "Like song"}
      className={`${btn} ${className} rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        isLiked
          ? "text-accent hover:text-accent-hover"
          : "text-text-subdued hover:text-white"
      }`}
    >
      <Heart
        size={icon}
        fill={isLiked ? "currentColor" : "none"}
        className={isLiked ? "scale-110" : ""}
      />
    </button>
  );
}
