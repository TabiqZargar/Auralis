interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar(_props: SearchBarProps) {
  return null;
}
