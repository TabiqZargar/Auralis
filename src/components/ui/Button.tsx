import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: "bg-accent text-black hover:bg-accent-hover focus-visible:ring-accent",
  secondary: "bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/60",
  ghost: "bg-transparent text-text-subdued hover:text-white hover:bg-white/5 focus-visible:ring-white/60",
  danger: "bg-error/10 text-error hover:bg-error/20 focus-visible:ring-error",
};

const sizeClasses: Record<string, string> = {
  sm: "h-8 gap-1.5 rounded px-3 text-xs",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  lg: "h-12 gap-2.5 rounded-xl px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === "sm" ? 14 : size === "lg" ? 22 : 18} className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
