import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

const positionClasses: Record<string, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({ content, children, position = "top", delay = 200 }: TooltipProps) {
  return (
    <div className="group/tooltip relative inline-flex">
      {children}
      <div
        style={{ animationDelay: `${delay}ms` }}
        className={`pointer-events-none absolute z-[300] hidden whitespace-nowrap rounded-md bg-surface-elevated px-2.5 py-1.5 text-xs text-white shadow-lg opacity-0 transition-opacity duration-150 group-hover/tooltip:block group-hover/tooltip:opacity-100 ${positionClasses[position]}`}
      >
        {content}
      </div>
    </div>
  );
}
