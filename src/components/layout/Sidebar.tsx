import { useNavigate, useLocation } from "react-router";
import { useLibraryStore } from "@/store";
import { ROUTES, ROUTE_BUILDERS } from "@/constants";
import { Home, Search, Library, Heart, Music, Plus } from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const mainLinks = [
  { path: ROUTES.HOME, label: "Home", icon: Home },
  { path: ROUTES.SEARCH, label: "Search", icon: Search },
  { path: ROUTES.LIBRARY, label: "Your Library", icon: Library },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const playlists = useLibraryStore((s) => s.playlists);

  if (collapsed) {
    return (
      <aside className="flex w-[--sidebar-collapsed-width] flex-col items-center gap-4 border-r border-white/5 bg-surface/80 py-4 backdrop-blur-xl">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              aria-label={link.label}
              className={`rounded-lg p-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                isActive ? "bg-white/10 text-white" : "text-text-subdued hover:text-white"
              }`}
            >
              <Icon size={22} />
            </button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="flex w-[--sidebar-width] flex-col border-r border-white/5 bg-surface/80 backdrop-blur-xl">
      <nav className="flex flex-col gap-1 p-4">
        {mainLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                isActive ? "bg-white/10 text-white" : "text-text-subdued hover:text-white"
              }`}
            >
              <Icon size={22} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mx-4 mb-2 border-t border-white/5" />

      <div className="flex flex-col gap-1 px-4">
        <button
          onClick={() => navigate(ROUTES.LIBRARY)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-text-subdued transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <Heart size={20} />
          <span>Liked Songs</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Playlists</span>
          <button
            onClick={() => {
              const lib = useLibraryStore.getState();
              const id = crypto.randomUUID();
              lib.addPlaylist({
                id,
                title: "New Playlist",
                description: "",
                coverUrl: "",
                owner: "user",
                public: false,
                collaborative: false,
                totalTracks: 0,
                songs: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            }}
            aria-label="Create playlist"
            className="rounded p-1 text-text-muted transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-4 pb-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => navigate(ROUTE_BUILDERS.playlist(playlist.id))}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              location.pathname === ROUTE_BUILDERS.playlist(playlist.id)
                ? "bg-white/10 text-white"
                : "text-text-subdued hover:text-white"
            }`}
          >
            <Music size={16} className="shrink-0" />
            <span className="truncate">{playlist.title}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
