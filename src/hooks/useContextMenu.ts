import { useCallback, useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";

export interface ContextMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
}

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    items: [],
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const showContextMenu = useCallback(
    (x: number, y: number, items: ContextMenuItem[]) => {
      setState({ show: true, x, y, items });
    },
    [],
  );

  const hideContextMenu = useCallback(() => {
    setState((prev) => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    if (!state.show) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        hideContextMenu();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideContextMenu();
    };
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state.show, hideContextMenu]);

  const onContextMenu = useCallback(
    (e: React.MouseEvent, items: ContextMenuItem[]) => {
      e.preventDefault();
      e.stopPropagation();
      const x = Math.min(e.clientX, window.innerWidth - 200);
      const y = Math.min(e.clientY, window.innerHeight - 300);
      showContextMenu(x, y, items);
    },
    [showContextMenu],
  );

  return {
    ...state,
    menuRef,
    showContextMenu,
    hideContextMenu,
    onContextMenu,
  };
}
