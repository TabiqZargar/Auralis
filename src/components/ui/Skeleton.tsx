interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-white/10";
  const variantClass =
    variant === "circular" ? "rounded-full" : variant === "text" ? "rounded h-4" : "rounded-lg";

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;

  return <div className={`${baseClass} ${variantClass} ${className}`} style={style} />;
}
