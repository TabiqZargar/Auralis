import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
}

export function Dropdown({ trigger, items, align = "start" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button onClick={() => setOpen(!open)} className="focus:outline-none" aria-haspopup="true" aria-expanded={open}>
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute top-full z-[150] mt-1 min-w-[160px] rounded-lg border border-white/10 bg-surface-elevated py-1 shadow-xl ${align === "end" ? "right-0" : "left-0"}`}
          role="menu"
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { if (!item.disabled) { item.onClick(); setOpen(false); } }}
              disabled={item.disabled}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-subdued transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              role="menuitem"
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
