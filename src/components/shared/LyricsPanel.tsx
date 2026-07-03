import { useRef, useEffect, useState, useCallback } from "react";
import { usePlayerStore } from "@/store";
import type { LyricLine } from "@/types";

interface LyricsPanelProps {
  lyrics: LyricLine[];
  className?: string;
}

export function LyricsPanel({ lyrics, className = "" }: LyricsPanelProps) {
  const currentTime = usePlayerStore((s) => s.currentTime);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  let currentLineIndex = -1;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (lyrics[i] && lyrics[i]!.time <= currentTime) {
      currentLineIndex = i;
      break;
    }
  }

  const handleScroll = useCallback(() => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => setIsUserScrolling(false), 3000);
  }, []);

  useEffect(() => {
    if (isUserScrolling || currentLineIndex < 0) return;
    const el = lineRefs.current[currentLineIndex];
    if (el && containerRef.current) {
      const container = containerRef.current;
      const offset = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;
      container.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, [currentLineIndex, isUserScrolling]);

  if (lyrics.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        aria-label="No lyrics available"
      >
        <p className="text-sm text-text-subdued">No lyrics available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`scrollbar-thin overflow-y-auto ${className}`}
      role="region"
      aria-label="Song lyrics"
      tabIndex={0}
    >
      <div className="flex flex-col gap-4 px-4 py-8">
        {lyrics.map((line, i) => (
          <p
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className={`cursor-pointer text-center leading-relaxed transition-all duration-300 ${
              i === currentLineIndex
                ? "scale-105 text-white opacity-100"
                : i < currentLineIndex
                  ? "text-text-muted opacity-40"
                  : "text-text-subdued opacity-60 hover:opacity-80"
            }`}
            onClick={() => {
              setIsUserScrolling(false);
              usePlayerStore.getState().setCurrentTime(line.time);
            }}
            style={{
              fontSize: i === currentLineIndex ? "1.25rem" : "1rem",
              fontWeight: i === currentLineIndex ? 600 : 400,
            }}
          >
            {line.text || "\u00A0"}
          </p>
        ))}
      </div>
    </div>
  );
}
