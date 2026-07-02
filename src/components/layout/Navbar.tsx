import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";

interface NavbarProps {
  onMenuToggle?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  title?: string;
}

export function Navbar({ showSearch, searchValue = "", onSearchChange, title }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <header className="flex h-[--header-height] items-center gap-4 px-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className="rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-between">
        {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
        {showSearch && onSearchChange && (
          <div className="ml-auto w-full max-w-sm">
            <SearchBar value={searchValue} onChange={onSearchChange} placeholder="What do you want to listen to?" />
          </div>
        )}
      </div>
    </header>
  );
}
