import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
}

export function Section({ title, subtitle, children, action }: SectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-text-subdued">{subtitle}</p>}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-semibold text-text-subdued transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {action.label}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
