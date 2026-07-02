import { Outlet } from "react-router";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { MOCK_TRACKS } from "@/features/player/constants/mockTracks";
import { useEffect, useRef } from "react";
import { useQueueStore, usePlayerStore } from "@/store";

export function RootLayout() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const q = useQueueStore.getState();
    const p = usePlayerStore.getState();

    q.setQueue(MOCK_TRACKS, 0);
    const firstTrack = MOCK_TRACKS[0];
    if (firstTrack) {
      p.loadTrack(firstTrack);
    }
  }, []);

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
      <footer className="h-[--player-height] shrink-0 border-t border-white/5 bg-surface-elevated">
        <PlayerLayout />
      </footer>
    </div>
  );
}
