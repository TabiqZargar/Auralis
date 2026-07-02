import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

const variantClasses: Record<string, string> = {
  default: "bg-white/10 text-text-subdued",
  success: "bg-accent/10 text-accent",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
};

const sizeClasses: Record<string, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
};

export function Badge({ children, variant = "default", size = "md" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
