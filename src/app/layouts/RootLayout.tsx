import { Outlet } from "react-router";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { ContextMenu } from "@/components/shared/ContextMenu";
import { ToastContainer } from "@/components/shared/ToastContainer";
import { MOCK_TRACKS } from "@/features/player/constants/mockTracks";
import { useEffect, useRef, useCallback } from "react";
import { useQueueStore, usePlayerStore, useLibraryStore, useSettingsStore } from "@/store";
import { useContextMenuStore } from "@/store/contextMenuStore";
import { useToastStore } from "@/store/toastStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { audioPlayerService } from "@/services/audio";

export function RootLayout() {
  const hasInitialized = useRef(false);
  const cm = useContextMenuStore();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

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
        () => p.play(),
        (err) =>
          p.setError(err?.message ?? "Playback failed"),
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
    addToast("Queue panel toggle (coming soon)", "info", 1500);
  }, [addToast]);

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
      "Shortcuts: Space=Play/Pause, ←/→=Seek, Ctrl+←/→=Prev/Next, M=Mute, F=Like, ?=Help",
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

      <ToastContainer />

      {cm.show && (
        <ContextMenu
          items={cm.items}
          position={{ x: cm.x, y: cm.y }}
          onClose={cm.close}
        />
      )}
    </div>
  );
}
