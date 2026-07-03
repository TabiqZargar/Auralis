import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
}

export function Section(_props: SectionProps) {
  return null;
}
