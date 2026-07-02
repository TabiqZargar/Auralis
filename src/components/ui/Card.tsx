import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  onClick?: () => void;
}

const paddingClasses: Record<string, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({ children, className = "", padding = "md", hoverable = false, onClick }: CardProps) {
  const Component = onClick ? "button" : "div";
  return (
    <Component
      onClick={onClick}
      className={`rounded-xl border border-white/5 bg-surface-elevated ${paddingClasses[padding]} ${hoverable ? "transition-all duration-200 hover:bg-surface-highlight hover:shadow-lg" : ""} ${onClick ? "w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
