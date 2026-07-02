import { create } from "zustand";
import type { ReactNode } from "react";

export interface ContextMenuItem {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
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

interface ContextMenuActions {
  open: (x: number, y: number, items: ContextMenuItem[]) => void;
  close: () => void;
}

export const useContextMenuStore = create<ContextMenuState & ContextMenuActions>(
  (set) => ({
    show: false,
    x: 0,
    y: 0,
    items: [],

    open: (x, y, items) => set({ show: true, x, y, items }),

    close: () => set({ show: false, items: [] }),
  }),
);
