import { useRef, useEffect } from "react";
import type { ReactNode } from "react";

export interface ContextMenuItem {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  position: { x: number; y: number };
  onClose: () => void;
}

export function ContextMenu({ items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (items.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[200] min-w-44 overflow-hidden rounded-lg border border-white/10 bg-surface-elevated py-1 shadow-2xl"
      role="menu"
    >
      {items.map((item, i) => {
        if (item.divider) {
          return (
            <div
              key={i}
              className="my-1 border-t border-white/10"
              role="separator"
            />
          );
        }
        return (
          <button
            key={i}
            role="menuitem"
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors focus:outline-none ${
              item.disabled
                ? "cursor-not-allowed opacity-40"
                : item.danger
                  ? "text-red-400 hover:bg-red-400/10"
                  : "text-white hover:bg-white/10"
            }`}
          >
            {item.icon && (
              <span className="w-4 shrink-0 text-text-subdued">{item.icon}</span>
            )}
            <span className="truncate">{item.label ?? ""}</span>
          </button>
        );
      })}
    </div>
  );
}
