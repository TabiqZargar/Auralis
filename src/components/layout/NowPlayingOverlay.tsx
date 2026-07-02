import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore, useQueueStore, useSettingsStore, useToastStore } from "@/store";
import { useFavorites } from "@/hooks/useFavorites";
import { audioEngine } from "@/lib/audio";
import { MediaImage } from "@/components/shared/MediaImage";
import { PlayerControls } from "@/components/shared/PlayerControls";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { VolumeControl } from "@/components/shared/VolumeControl";
import { LikeButton } from "@/components/shared/LikeButton";
import { AudioVisualizer } from "@/components/shared/AudioVisualizer";
import { LyricsPanel } from "@/components/shared/LyricsPanel";
import { Equalizer } from "@/components/shared/Equalizer";
import { formatArtists, formatDuration } from "@/utils";
import {
  Minimize2,
  ListMusic,
  Disc3,
  Mic2,
  BarChart3,
  Circle,
  Waves,
  Sparkles,
} from "lucide-react";
import type { VisualizerMode } from "@/components/shared/AudioVisualizer";
import type { LyricLine } from "@/types";

const MOCK_LYRICS: LyricLine[] = [
  { time: 0, text: "", duration: 5 },
  { time: 5, text: "Under the stars we drift", duration: 4 },
  { time: 9, text: "On waves of silver light", duration: 4 },
  { time: 13, text: "The world is standing still", duration: 4 },
  { time: 17, text: "In this endless night", duration: 4 },
  { time: 21, text: "", duration: 3 },
  { time: 24, text: "Every breath we take", duration: 4 },
  { time: 28, text: "Echoes in the dark", duration: 4 },
  { time: 32, text: "A melody of hope", duration: 4 },
  { time: 36, text: "Leaves its gentle mark", duration: 4 },
  { time: 40, text: "", duration: 3 },
  { time: 43, text: "And the music plays on", duration: 4 },
  { time: 47, text: "Through the quiet storm", duration: 4 },
  { time: 51, text: "Carrying us home", duration: 4 },
  { time: 55, text: "To where we were born", duration: 5 },
];

const visualizerModes: { key: VisualizerMode; label: string; icon: typeof BarChart3 }[] = [
  { key: "bars", label: "Bars", icon: BarChart3 },
  { key: "circle", label: "Circle", icon: Circle },
  { key: "waveform", label: "Wave", icon: Waves },
  { key: "particles", label: "Particles", icon: Sparkles },
];

interface NowPlayingOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NowPlayingOverlay({ isOpen, onClose }: NowPlayingOverlayProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const duration = usePlayerStore((s) => s.duration);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const loading = usePlayerStore((s) => s.loading);
  const error = usePlayerStore((s) => s.error);
  const shuffle = useQueueStore((s) => s.shuffle);
  const repeatMode = useQueueStore((s) => s.repeatMode);
  const showLyrics = useSettingsStore((s) => s.showLyrics);
  const toggleLyrics = useSettingsStore((s) => s.toggleLyrics);
  const toggleVisualizer = useSettingsStore((s) => s.toggleVisualizer);
  const showVisualizer = useSettingsStore((s) => s.showVisualizer);
  const { isLiked, toggleLike } = useFavorites();

  const [visMode, setVisMode] = useState<VisualizerMode>("bars");
  const [showQueue, setShowQueue] = useState(false);

  const addToast = useToastStore((s) => s.addToast);

  const handlePlayPause = useCallback(() => {
    const p = usePlayerStore.getState();
    if (!p.currentTrack) return;
    p.toggle();
  }, []);

  const handleNext = useCallback(() => {
    const q = useQueueStore.getState();
    const p = usePlayerStore.getState();
    if (q.queue[q.currentIndex]) {
      q.pushHistory(q.queue[q.currentIndex]!);
    }
    const nextIdx = q.playNext();
    if (nextIdx !== null && q.queue[nextIdx]) {
      p.loadTrack(q.queue[nextIdx]!.song);
      audioEngine.resume();
    }
  }, []);

  const handlePrev = useCallback(() => {
    const p = usePlayerStore.getState();
    const q = useQueueStore.getState();
    if (p.currentTime > 3) {
      p.seek(0);
      return;
    }
    const prevIdx = q.playPrevious();
    if (prevIdx !== null && q.queue[prevIdx]) {
      p.loadTrack(q.queue[prevIdx]!.song);
      audioEngine.resume();
    }
  }, []);

  const handleSeek = useCallback(
    (time: number) => {
      usePlayerStore.getState().seek(time);
    },
    [],
  );

  const handleSetVolume = useCallback(
    (val: number) => {
      usePlayerStore.getState().setVolume(val);
    },
    [],
  );

  const handleToggleMute = useCallback(() => {
    usePlayerStore.getState().toggleMute();
  }, []);

  const queue = useQueueStore((s) => s.queue);
  const queueCurrentIndex = useQueueStore((s) => s.currentIndex);

  return (
    <AnimatePresence>
      {isOpen && currentTrack && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
          role="dialog"
          aria-label="Now playing fullscreen"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={onClose}
              className="rounded p-2 text-text-subdued transition-colors hover:text-white"
              aria-label="Minimize player"
            >
              <Minimize2 size={20} />
            </button>

            <div className="flex items-center gap-2">
              <Equalizer className="h-8 w-30" />
              <span className="text-xs text-text-subdued">Now Playing</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setShowQueue(!showQueue);
                  if (showQueue) addToast("Queue hidden", "info", 1500);
                  else addToast("Queue shown", "info", 1500);
                }}
                className={`rounded p-2 transition-colors ${
                  showQueue ? "text-accent" : "text-text-subdued hover:text-white"
                }`}
                aria-label="Toggle queue"
              >
                <ListMusic size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main area */}
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
              {/* Album art + Visualizer */}
              <div className="relative flex items-center justify-center">
                {showVisualizer ? (
                  <div className="relative h-72 w-72">
                    <AudioVisualizer
                      mode={visMode}
                      className="h-full w-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MediaImage
                        src={currentTrack.coverUrl}
                        alt={currentTrack.title}
                        size="md"
                        className="h-28 w-28 rounded-full opacity-80 shadow-2xl"
                      />
                    </div>
                  </div>
                ) : (
                  <MediaImage
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    size="full"
                    className="h-72 w-72 shadow-2xl"
                  />
                )}
              </div>

              {/* Track info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                  {currentTrack.title}
                </h2>
                <p className="mt-1 text-sm text-text-subdued">
                  {formatArtists(currentTrack.artists)}
                </p>
                <p className="text-xs text-text-muted">
                  {currentTrack.album.title}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <LikeButton
                  isLiked={isLiked(currentTrack.id)}
                  onToggle={() => toggleLike(currentTrack)}
                  size="lg"
                />
                <PlayerControls
                  isPlaying={isPlaying}
                  shuffle={shuffle}
                  repeatMode={repeatMode}
                  onTogglePlay={handlePlayPause}
                  onPrevious={handlePrev}
                  onNext={handleNext}
                  onToggleShuffle={() => useQueueStore.getState().toggleShuffle()}
                  onCycleRepeat={() => useQueueStore.getState().cycleRepeatMode()}
                  size="lg"
                  disabled={!currentTrack || !!error}
                />
              </div>

              {/* Progress */}
              <div className="w-full max-w-lg">
                {error ? (
                  <p className="text-center text-xs text-error">{error}</p>
                ) : loading ? (
                  <div className="h-1 animate-pulse rounded-full bg-white/10" />
                ) : (
                  <ProgressBar
                    current={currentTime}
                    total={duration}
                    onSeek={handleSeek}
                    size="md"
                  />
                )}
              </div>

              {/* Volume + Visualizer mode */}
              <div className="flex w-full max-w-lg items-center justify-between">
                <div className="w-32">
                  <VolumeControl
                    volume={volume}
                    muted={muted}
                    onVolumeChange={handleSetVolume}
                    onToggleMute={handleToggleMute}
                    size="sm"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleLyrics()}
                    className={`rounded p-1.5 transition-colors ${
                      showLyrics
                        ? "text-accent"
                        : "text-text-subdued hover:text-white"
                    }`}
                    aria-label="Toggle lyrics"
                  >
                    <Mic2 size={16} />
                  </button>
                  <button
                    onClick={() => toggleVisualizer()}
                    className={`rounded p-1.5 transition-colors ${
                      showVisualizer
                        ? "text-accent"
                        : "text-text-subdued hover:text-white"
                    }`}
                    aria-label="Toggle visualizer"
                  >
                    <Disc3 size={16} />
                  </button>
                  {showVisualizer &&
                    visualizerModes.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setVisMode(m.key)}
                        className={`rounded p-1.5 transition-colors ${
                          visMode === m.key
                            ? "text-accent"
                            : "text-text-subdued hover:text-white"
                        }`}
                        aria-label={`Visualizer mode: ${m.label}`}
                        title={m.label}
                      >
                        <m.icon size={14} />
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Side panels */}
            <AnimatePresence>
              {showLyrics && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 360, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden border-l border-white/10 md:block"
                >
                  <div className="flex h-full w-[360px] flex-col">
                    <div className="border-b border-white/10 px-4 py-3">
                      <h3 className="text-sm font-semibold text-white">Lyrics</h3>
                    </div>
                    <LyricsPanel
                      lyrics={MOCK_LYRICS}
                      className="flex-1"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showQueue && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 360, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hidden border-l border-white/10 md:block"
                >
                  <div className="flex h-full w-[360px] flex-col">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <h3 className="text-sm font-semibold text-white">Queue</h3>
                      <span className="text-xs text-text-subdued">
                        {queue.length} tracks
                      </span>
                    </div>
                    <div className="scrollbar-thin flex-1 overflow-y-auto">
                      {queue.length === 0 ? (
                        <p className="p-4 text-center text-sm text-text-subdued">
                          Queue is empty
                        </p>
                      ) : (
                        queue.map((item, i) => (
                          <div
                            key={`${item.song.id}-${i}`}
                            className={`flex items-center gap-3 px-4 py-2 transition-colors hover:bg-white/5 ${
                              i === queueCurrentIndex
                                ? "bg-white/10"
                                : ""
                            }`}
                          >
                            <span className="w-5 text-right text-xs text-text-muted">
                              {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate text-sm ${
                                  i === queueCurrentIndex
                                    ? "text-accent"
                                    : "text-white"
                                }`}
                              >
                                {item.song.title}
                              </p>
                              <p className="truncate text-xs text-text-subdued">
                                {item.song.artists.map((a) => a.name).join(", ")}
                              </p>
                            </div>
                            <span className="text-xs text-text-muted">
                              {formatDuration(item.song.duration)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    {queue.length > 0 && (
                      <div className="border-t border-white/10 px-4 py-2">
                        <p className="text-xs text-text-subdued">
                          Total: {formatDuration(
                            queue.reduce((acc, item) => acc + item.song.duration, 0),
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
