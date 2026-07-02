import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = "", style, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-text-subdued">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}
        <input
          className={`w-full rounded-lg bg-surface-highlight py-2.5 pr-4 text-sm text-white placeholder-text-muted outline-none transition-colors focus:bg-surface-elevated focus:ring-2 focus:ring-white/30 ${icon ? "pl-10" : "pl-4"} ${error ? "ring-2 ring-error" : ""} ${className}`}
          style={style}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
