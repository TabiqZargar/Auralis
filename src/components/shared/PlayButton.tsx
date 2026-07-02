import { Play, Pause } from "lucide-react";

interface PlayButtonProps {
  onClick: () => void;
  isPlaying?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function PlayButton({
  onClick,
  isPlaying = false,
  size = "md",
  variant = "primary",
  disabled = false,
}: PlayButtonProps) {
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const variantClasses =
    variant === "primary"
      ? "bg-accent text-black hover:scale-105 hover:bg-accent-hover"
      : "bg-white/10 text-white hover:bg-white/20";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={isPlaying ? "Pause" : "Play"}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:cursor-not-allowed disabled:opacity-50 ${sizeMap[size]} ${variantClasses}`}
    >
      {isPlaying ? (
        <Pause size={iconSizeMap[size]} fill="currentColor" />
      ) : (
        <Play
          size={iconSizeMap[size]}
          fill="currentColor"
          className="ml-0.5"
        />
      )}
    </button>
  );
}
