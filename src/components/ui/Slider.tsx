interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export function Slider(_props: SliderProps) {
  return null;
}
