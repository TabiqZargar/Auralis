import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store";
import type { Song } from "@/types";
import { formatArtists } from "@/utils";

interface MediaSessionHandlers {
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
}

export function useMediaSession(handlers: MediaSessionHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const { onPlay, onPause, onNext, onPrevious, onSeek } = handlersRef.current;

    navigator.mediaSession.setActionHandler("play", () => onPlay());
    navigator.mediaSession.setActionHandler("pause", () => onPause());
    navigator.mediaSession.setActionHandler("nexttrack", () => onNext());
    navigator.mediaSession.setActionHandler("previoustrack", () => onPrevious());
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null) onSeek(details.seekTime);
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, []);

  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state, prev) => {
      if (state.currentSong === prev.currentSong && state.status === prev.status) {
        return;
      }
      updateMediaSession(state.currentSong, state.status === "playing");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    updateMediaSession(
      usePlayerStore.getState().currentSong,
      usePlayerStore.getState().status === "playing",
    );
  }, []);
}

function updateMediaSession(track: Song | null, isPlaying: boolean) {
  if (!("mediaSession" in navigator)) return;

  if (!track) {
    navigator.mediaSession.metadata = null;
    return;
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: formatArtists(track.artists),
    album: track.album.title,
    artwork: track.coverUrl
      ? [
          { src: track.coverUrl, sizes: "300x300", type: "image/jpeg" },
          { src: track.coverUrl, sizes: "640x640", type: "image/jpeg" },
        ]
      : [],
  });

  navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
}
