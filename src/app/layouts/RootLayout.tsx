import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-[--sidebar-width] shrink-0 border-r border-white/5 bg-surface md:block">
          {/* Sidebar */}
        </aside>
        <main className="relative flex flex-1 flex-col overflow-y-auto">
          <Outlet />
        </main>
        <aside className="hidden w-[--right-panel-width] shrink-0 border-l border-white/5 bg-surface xl:block">
          {/* Right Panel */}
        </aside>
      </div>
      <footer
        className="h-[--player-height] shrink-0 border-t border-white/5 bg-surface"
        style={{ gridRow: "player" }}
      >
        {/* Bottom Player */}
      </footer>
    </div>
  );
}
