import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueueStore, usePlayerStore } from "@/store";
import { formatDuration } from "@/utils";
import { TrackRow } from "@/components/shared/TrackRow";
import { X } from "lucide-react";

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueuePanel({ isOpen, onClose }: QueuePanelProps) {
  const queue = useQueueStore((s) => s.items);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const listRef = useRef<HTMLDivElement>(null);

  const totalDuration = queue.reduce((acc, item) => acc + item.song.duration, 0);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-queue-index="${currentIndex}"]`);
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [isOpen, currentIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex shrink-0 flex-col border-l border-white/10 bg-surface"
          role="complementary"
          aria-label="Play queue"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Queue</h3>
              <p className="text-xs text-text-subdued">
                {queue.length} track{queue.length !== 1 ? "s" : ""}
                {queue.length > 0 && ` \u00B7 ${formatDuration(totalDuration)}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-text-subdued transition-colors hover:text-white"
              aria-label="Close queue"
            >
              <X size={16} />
            </button>
          </div>

          <div
            ref={listRef}
            className="scrollbar-thin flex-1 overflow-y-auto py-2"
          >
            {queue.length === 0 ? (
              <p className="p-6 text-center text-sm text-text-subdued">
                Queue is empty
              </p>
            ) : (
              queue.map((item, i) => (
                <div key={`${item.song.id}-${i}`} data-queue-index={i}>
                  <TrackRow
                    track={item.song}
                    index={i + 1}
                    showAlbum={false}
                    showCover={false}
                    selected={i === currentIndex}
                    onPlay={() => {
                      usePlayerStore.getState().setCurrentSong(item.song);
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {queue.length > 0 && (
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2">
              <button
                onClick={() => useQueueStore.getState().clearQueue()}
                className="text-xs text-text-subdued transition-colors hover:text-white"
              >
                Clear queue
              </button>
              <span className="text-xs text-text-muted">
                Now playing: {currentIndex + 1} of {queue.length}
              </span>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
