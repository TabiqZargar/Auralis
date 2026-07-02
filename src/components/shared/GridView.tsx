import type { ReactNode } from "react";

interface GridViewProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
}

export function GridView(_props: GridViewProps) {
  return null;
}
