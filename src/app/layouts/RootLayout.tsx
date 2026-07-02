import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
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

    const audioEl = audioPlayerService.getElement();
    if (audioEl) {
      try {
        audioEngine.connectAudioElement(audioEl);
      } catch {
        /* element may not be ready */
      }
    }

    const q = useQueueStore.getState();
    const p = usePlayerStore.getState();

    if (q.queue.length === 0) {
      q.setQueue(MOCK_TRACKS, 0);
      const firstTrack = MOCK_TRACKS[0];
      if (firstTrack) {
        p.loadTrack(firstTrack);
      }
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    const p = usePlayerStore.getState();
    if (!p.currentTrack) return;
    if (p.isPlaying) {
      audioPlayerService.pause();
      p.pause();
    } else {
      audioPlayerService.play().then(
        () => {
          p.play();
          audioEngine.resume();
        },
        (err) => p.setError(err?.message ?? "Playback failed"),
      );
    }
  }, []);

  const handleNext = useCallback(() => {
    const q = useQueueStore.getState();
    const p = usePlayerStore.getState();
    if (q.queue[q.currentIndex]) {
      q.pushHistory(q.queue[q.currentIndex]!);
    }
    const nextIndex = q.playNext();
    if (nextIndex !== null && q.queue[nextIndex]) {
      const nextTrack = q.queue[nextIndex]!.song;
      p.loadTrack(nextTrack);
      audioPlayerService.load(nextTrack.audioUrl);
      audioPlayerService.play().then(
        () => {
          p.play();
          audioEngine.resume();
          useLibraryStore.getState().addRecentlyPlayed(nextTrack);
        },
        (err) => p.setError(err?.message ?? "Playback failed"),
      );
    } else {
      p.pause();
    }
  }, []);

  const handlePrevious = useCallback(() => {
    const q = useQueueStore.getState();
    const p = usePlayerStore.getState();
    if (p.currentTime > 3) {
      audioPlayerService.seek(0);
      p.seek(0);
      return;
    }
    const prevIndex = q.playPrevious();
    if (prevIndex !== null && q.queue[prevIndex]) {
      const prevTrack = q.queue[prevIndex]!.song;
      p.loadTrack(prevTrack);
      audioPlayerService.load(prevTrack.audioUrl);
      audioPlayerService.play().then(
        () => p.play(),
        (err) => p.setError(err?.message ?? "Playback failed"),
      );
    }
  }, []);

  const handleSeekForward = useCallback(() => {
    const p = usePlayerStore.getState();
    const newTime = Math.min(p.currentTime + 5, p.duration);
    audioPlayerService.seek(newTime);
    p.seek(newTime);
  }, []);

  const handleSeekBackward = useCallback(() => {
    const p = usePlayerStore.getState();
    const newTime = Math.max(p.currentTime - 5, 0);
    audioPlayerService.seek(newTime);
    p.seek(newTime);
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
    const track = usePlayerStore.getState().currentTrack;
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
        {/* Sidebar */}
        <div className="hidden shrink-0 md:block">
          <Sidebar />
        </div>

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

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Toasts */}
      <ToastContainer />
    </div>
  );
}
