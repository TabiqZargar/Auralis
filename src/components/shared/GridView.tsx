import type { ReactNode } from "react";

interface GridViewProps {
  children: ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
}

const columnsClass = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
};

const gapClass = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

export function GridView({ children, columns = 4, gap = "md" }: GridViewProps) {
  return (
    <div className={`grid ${columnsClass[columns]} ${gapClass[gap]}`}>
      {children}
    </div>
  );
}
