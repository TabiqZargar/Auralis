import type { ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  items: { label: string; onClick: () => void; icon?: ReactNode; disabled?: boolean }[];
  align?: "start" | "end";
}

export function Dropdown(_props: DropdownProps) {
  return null;
}
