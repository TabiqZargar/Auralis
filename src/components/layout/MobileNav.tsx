import { useNavigate, useLocation } from "react-router";
import { ROUTES } from "@/constants";
import { Home, Search, Library } from "lucide-react";

const tabs = [
  { path: ROUTES.HOME, label: "Home", icon: Home },
  { path: ROUTES.SEARCH, label: "Search", icon: Search },
  { path: ROUTES.LIBRARY, label: "Library", icon: Library },
];

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-[--player-height] left-0 right-0 z-20 flex border-t border-white/5 bg-surface/95 backdrop-blur-xl md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              isActive ? "text-white" : "text-text-subdued"
            }`}
            aria-label={tab.label}
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
