import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { NowPlayingOverlay } from "@/components/layout/NowPlayingOverlay";
import { QueuePanel } from "@/components/layout/QueuePanel";
import { ContextMenu } from "@/components/shared/ContextMenu";
import { ToastContainer } from "@/components/shared/ToastContainer";
import { DynamicBackground } from "@/components/shared/DynamicBackground";
import { MOCK_TRACKS } from "@/features/player/constants/mockTracks";
import {
  useQueueStore,
  usePlayerStore,
  useLibraryStore,
  useSettingsStore,
} from "@/store";
import { useContextMenuStore } from "@/store/contextMenuStore";
import { useToastStore } from "@/store/toastStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useDynamicTheme } from "@/hooks/useDynamicTheme";
import { audioEngine } from "@/lib/audio";
import { audioPlayerService } from "@/services/audio";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function RootLayout() {
  const hasInitialized = useRef(false);
  const location = useLocation();
  const cm = useContextMenuStore();
  const addToast = useToastStore((s) => s.addToast);

  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  useDynamicTheme();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    audioEngine.initialize();
    audioPlayerService.initialize();

    const audioEl = audioPlayerService.getElement();
    if (audioEl) {
      try {
        audioEngine.connectAudioElement(audioEl);
      } catch {
        /* element may not be ready */
      }
    }

    const unsubSongChange = usePlayerStore.subscribe(
      (s, ps) => {
        if (s.currentSong !== ps.currentSong && s.currentSong) {
          audioPlayerService.load(s.currentSong.audioUrl);
          audioPlayerService.play()?.then(
            () => {
              usePlayerStore.getState().setStatus("playing");
              audioEngine.resume();
              useLibraryStore.getState().addRecentlyPlayed(s.currentSong!);
            },
            () => usePlayerStore.getState().setStatus("error"),
          );
        } else if (s.status !== ps.status) {
          if (s.status === "playing" && s.currentSong) {
            audioPlayerService.play()?.then(
              () => audioEngine.resume(),
              () => usePlayerStore.getState().setStatus("error"),
            );
          } else if (s.status === "paused") {
            audioPlayerService.pause();
          }
        }
      },
    );

    const q = useQueueStore.getState();
    const p = usePlayerStore.getState();

    if (q.items.length === 0) {
      q.setQueue(MOCK_TRACKS.map(s => ({ song: s, addedBy: "user", addedAt: new Date().toISOString(), position: 0 })));
      const firstTrack = MOCK_TRACKS[0]!;
      p.setCurrentSong(firstTrack);
    }

    return () => {
      unsubSongChange();
      audioPlayerService.destroy();
      audioEngine.destroy();
    };
  }, []);

  const handlePlayPause = useCallback(() => {
    const p = usePlayerStore.getState();
    if (!p.currentSong) return;
    if (p.status === "playing") {
      p.setStatus("paused");
    } else {
      p.setStatus("playing");
    }
  }, []);

  const handleNext = useCallback(() => {
    const p = usePlayerStore.getState();
    useQueueStore.getState().next();
    const fresh = useQueueStore.getState();
    const nextItem = fresh.items[fresh.currentIndex];
    if (nextItem) {
      p.setCurrentSong(nextItem.song);
    } else {
      p.setStatus("paused");
    }
  }, []);

  const handlePrevious = useCallback(() => {
    const p = usePlayerStore.getState();
    if (p.currentTime > 3) {
      audioPlayerService.seek(0);
      p.setCurrentTime(0);
      return;
    }
    useQueueStore.getState().previous();
    const fresh = useQueueStore.getState();
    const prevItem = fresh.items[fresh.currentIndex];
    if (prevItem) {
      p.setCurrentSong(prevItem.song);
    }
  }, []);

  const handleSeekForward = useCallback(() => {
    const p = usePlayerStore.getState();
    const newTime = Math.min(p.currentTime + 5, p.duration);
    audioPlayerService.seek(newTime);
    p.setCurrentTime(newTime);
  }, []);

  const handleSeekBackward = useCallback(() => {
    const p = usePlayerStore.getState();
    const newTime = Math.max(p.currentTime - 5, 0);
    audioPlayerService.seek(newTime);
    p.setCurrentTime(newTime);
  }, []);

  const handleMute = useCallback(() => {
    usePlayerStore.getState().toggleMute();
  }, []);

  const handleToggleQueue = useCallback(() => {
    setQueueOpen((prev) => !prev);
  }, []);

  const handleToggleLyrics = useCallback(() => {
    useSettingsStore.getState().toggleLyrics();
    addToast(
      useSettingsStore.getState().showLyrics ? "Lyrics shown" : "Lyrics hidden",
      "info",
      1500,
    );
  }, [addToast]);

  const handleLike = useCallback(() => {
    const track = usePlayerStore.getState().currentSong;
    if (!track) return;
    const lib = useLibraryStore.getState();
    const wasLiked = lib.isLiked(track.id);
    lib.toggleLikedSong(track);
    addToast(
      wasLiked ? "Removed from Liked Songs" : "Added to Liked Songs",
      "success",
      2000,
    );
  }, [addToast]);

  const handleShowHelp = useCallback(() => {
    addToast(
      "Shortcuts: Space=Play/Pause, \u2190/\u2192=Seek, Ctrl+\u2190/\u2192=Prev/Next, M=Mute, F=Like, Q=Queue, ?=Help",
      "info",
      5000,
    );
  }, [addToast]);

  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSeekForward: handleSeekForward,
    onSeekBackward: handleSeekBackward,
    onMute: handleMute,
    onToggleQueue: handleToggleQueue,
    onToggleLyrics: handleToggleLyrics,
    onLike: handleLike,
    onShowHelp: handleShowHelp,
  });

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <DynamicBackground />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Sidebar placeholder */}
        <aside className="hidden w-[--sidebar-width] shrink-0 border-r border-white/5 bg-surface/80 backdrop-blur-xl md:block">
          {/* Sidebar - to be implemented */}
        </aside>

        {/* Main content with page transitions */}
        <main className="relative flex flex-1 flex-col overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Panel / Queue */}
        <AnimatePresence>
          {queueOpen && (
            <QueuePanel isOpen={true} onClose={() => setQueueOpen(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Player Bar */}
      <footer className="relative z-10 h-[--player-height] shrink-0 border-t border-white/5 bg-surface-elevated/95 backdrop-blur-xl">
        <PlayerLayout onExpand={() => setNowPlayingOpen(true)} />
      </footer>

      {/* Now Playing Overlay */}
      <NowPlayingOverlay
        isOpen={nowPlayingOpen}
        onClose={() => setNowPlayingOpen(false)}
      />

      {/* Context Menu */}
      {cm.show && (
        <ContextMenu
          items={cm.items}
          position={{ x: cm.x, y: cm.y }}
          onClose={cm.close}
        />
      )}

      {/* Toasts */}
      <ToastContainer />
    </div>
  );
}
