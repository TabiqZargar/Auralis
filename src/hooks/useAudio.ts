import { useCallback, useEffect, useRef } from "react";
import { audioPlayerService } from "@/services/audio";
import { usePlayerStore } from "@/store";

export function useAudio() {
  const playerRef = useRef(audioPlayerService);
  const { volume, muted, currentSong, status } = usePlayerStore();

  useEffect(() => {
    playerRef.current.initialize();
    return () => {
      playerRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    playerRef.current.setVolume(muted ? 0 : volume);
  }, [volume, muted]);

  const load = useCallback((src: string) => {
    playerRef.current.load(src);
  }, []);

  const play = useCallback(() => {
    return playerRef.current.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current.pause();
  }, []);

  const seek = useCallback((time: number) => {
    playerRef.current.seek(time);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    playerRef.current.setPlaybackRate(rate);
  }, []);

  return {
    load,
    play,
    pause,
    seek,
    setPlaybackRate,
    element: playerRef.current.getElement(),
    isPlaying: status === "playing",
    currentSong,
  };
}
