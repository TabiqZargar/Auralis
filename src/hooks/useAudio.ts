import { useCallback, useEffect, useRef } from "react";
import { audioPlayerService } from "@/services/audio";

export function useAudio() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    audioPlayerService.initialize();
    return () => {
      audioPlayerService.destroy();
      initializedRef.current = false;
    };
  }, []);

  const load = useCallback((src: string) => {
    audioPlayerService.load(src);
  }, []);

  const play = useCallback(() => {
    return audioPlayerService.play();
  }, []);

  const pause = useCallback(() => {
    audioPlayerService.pause();
  }, []);

  const togglePlay = useCallback(() => {
    return audioPlayerService.togglePlay();
  }, []);

  const seek = useCallback((time: number) => {
    audioPlayerService.seek(time);
  }, []);

  const setVolume = useCallback((value: number) => {
    audioPlayerService.setVolume(value);
  }, []);

  const toggleMute = useCallback(() => {
    audioPlayerService.toggleMute();
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    audioPlayerService.setPlaybackRate(rate);
  }, []);

  const stop = useCallback(() => {
    audioPlayerService.stop();
  }, []);

  return {
    load,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    stop,
  };
}
