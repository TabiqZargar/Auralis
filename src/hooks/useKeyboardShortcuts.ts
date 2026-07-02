import { useEffect } from "react";
import { useSettingsStore } from "@/store";

interface ShortcutHandlers {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onMute: () => void;
  onToggleQueue: () => void;
  onToggleLyrics: () => void;
  onLike: () => void;
  onShowHelp: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const enabled = useSettingsStore((s) => s.keyboardShortcuts);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isInput) return;

      const ctrl = e.ctrlKey || e.metaKey;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlers.onPlayPause();
          break;
        case "ArrowRight":
          if (ctrl) {
            e.preventDefault();
            handlers.onNext();
          } else {
            e.preventDefault();
            handlers.onSeekForward();
          }
          break;
        case "ArrowLeft":
          if (ctrl) {
            e.preventDefault();
            handlers.onPrevious();
          } else {
            e.preventDefault();
            handlers.onSeekBackward();
          }
          break;
        case "KeyM":
          if (!ctrl) {
            e.preventDefault();
            handlers.onMute();
          }
          break;
        case "KeyL":
          if (!ctrl) {
            e.preventDefault();
            handlers.onToggleLyrics();
          }
          break;
        case "KeyQ":
          if (!ctrl) {
            e.preventDefault();
            handlers.onToggleQueue();
          }
          break;
        case "KeyF":
          if (!ctrl) {
            e.preventDefault();
            handlers.onLike();
          }
          break;
        case "Slash":
          if (!ctrl) {
            e.preventDefault();
            handlers.onShowHelp();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handlers]);
}
