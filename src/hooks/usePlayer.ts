import { useCallback, useEffect } from "react";
import { usePlayerStore, useQueueStore, useLibraryStore } from "@/store";
import { audioPlayerService } from "@/services/audio";
import type { Song } from "@/types";
import { useAudio } from "./useAudio";
import { useMediaSession } from "./useMediaSession";

export function usePlayer() {
  useAudio();

  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const duration = usePlayerStore((s) => s.duration);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const volume = usePlayerStore((s) => s.volume);
  const muted = usePlayerStore((s) => s.muted);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const loading = usePlayerStore((s) => s.loading);
  const error = usePlayerStore((s) => s.error);

  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const repeatMode = useQueueStore((s) => s.repeatMode);
  const shuffle = useQueueStore((s) => s.shuffle);

  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state, prev) => {
      if (state.volume !== prev.volume) {
        audioPlayerService.setVolume(state.muted ? 0 : state.volume);
      }
      if (state.muted !== prev.muted) {
        audioPlayerService.setVolume(state.muted ? 0 : state.volume);
      }
      if (state.playbackRate !== prev.playbackRate) {
        audioPlayerService.setPlaybackRate(state.playbackRate);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const onTimeUpdate = () => {
      usePlayerStore.getState().updateProgress(
        audioPlayerService.getCurrentTime(),
        audioPlayerService.getDuration(),
      );
    };

    const onPlay = () => {
      usePlayerStore.getState().play();
    };

    const onPause = () => {
      usePlayerStore.getState().pause();
    };

    const onWaiting = () => {
      usePlayerStore.getState().setLoading(true);
    };

    const onCanPlay = () => {
      usePlayerStore.getState().setLoading(false);
    };

    const onError = () => {
      usePlayerStore.getState().setError(
        "Playback failed. The audio file may be missing or unsupported.",
      );
    };

    const onEnded = () => {
      usePlayerStore.getState().pause();
      const q = useQueueStore.getState();

      const prevTrack = q.queue[q.currentIndex]?.song ?? null;
      if (prevTrack) {
        q.pushHistory(q.queue[q.currentIndex]!);
      }

      const nextIndex = q.playNext();
      if (nextIndex !== null && q.queue[nextIndex]) {
        const nextTrack = q.queue[nextIndex]!.song;
        usePlayerStore.getState().loadTrack(nextTrack);
        audioPlayerService.load(nextTrack.audioUrl);
        audioPlayerService.play().then(
          () => {
            usePlayerStore.getState().play();
            useLibraryStore.getState().addRecentlyPlayed(nextTrack);
          },
          (err) =>
            usePlayerStore
              .getState()
              .setError(err?.message ?? "Playback failed"),
        );
      }
    };

    audioPlayerService.on("timeupdate", onTimeUpdate);
    audioPlayerService.on("play", onPlay);
    audioPlayerService.on("pause", onPause);
    audioPlayerService.on("waiting", onWaiting);
    audioPlayerService.on("canplay", onCanPlay);
    audioPlayerService.on("error", onError);
    audioPlayerService.on("ended", onEnded);

    return () => {
      audioPlayerService.off("timeupdate", onTimeUpdate);
      audioPlayerService.off("play", onPlay);
      audioPlayerService.off("pause", onPause);
      audioPlayerService.off("waiting", onWaiting);
      audioPlayerService.off("canplay", onCanPlay);
      audioPlayerService.off("error", onError);
      audioPlayerService.off("ended", onEnded);
    };
  }, []);

  const playTrack = useCallback(
    (track: Song) => {
      usePlayerStore.getState().loadTrack(track);
      audioPlayerService.load(track.audioUrl);
      audioPlayerService.play().then(
        () => {
          usePlayerStore.getState().play();
          useLibraryStore.getState().addRecentlyPlayed(track);
        },
        (err) =>
          usePlayerStore
            .getState()
            .setError(err?.message ?? "Playback failed"),
      );
    },
    [],
  );

  const togglePlay = useCallback(() => {
    const player = usePlayerStore.getState();
    if (!player.currentTrack) return;
    if (player.isPlaying) {
      audioPlayerService.pause();
      usePlayerStore.getState().pause();
    } else {
      audioPlayerService.play().then(
        () => usePlayerStore.getState().play(),
        (err) =>
          usePlayerStore
            .getState()
            .setError(err?.message ?? "Playback failed"),
      );
    }
  }, []);

  const nextTrack = useCallback(() => {
    const q = useQueueStore.getState();

    const prevTrack = q.queue[q.currentIndex]?.song ?? null;
    if (prevTrack) {
      q.pushHistory(q.queue[q.currentIndex]!);
    }

    const nextIndex = q.playNext();
    if (nextIndex !== null && q.queue[nextIndex]) {
      playTrack(q.queue[nextIndex]!.song);
    } else {
      usePlayerStore.getState().pause();
    }
  }, [playTrack]);

  const previousTrack = useCallback(() => {
    const currentTime = usePlayerStore.getState().currentTime;
    if (currentTime > 3) {
      audioPlayerService.seek(0);
      usePlayerStore.getState().seek(0);
      return;
    }
    const q = useQueueStore.getState();
    const prevIndex = q.playPrevious();
    if (prevIndex !== null && q.queue[prevIndex]) {
      playTrack(q.queue[prevIndex]!.song);
    }
  }, [playTrack]);

  const seek = useCallback(
    (time: number) => {
      audioPlayerService.seek(time);
      usePlayerStore.getState().seek(time);
    },
    [],
  );

  const setVolume = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(1, value));
      audioPlayerService.setVolume(clamped);
      usePlayerStore.getState().setVolume(clamped);
    },
    [],
  );

  const toggleMute = useCallback(() => {
    audioPlayerService.toggleMute();
    usePlayerStore.getState().toggleMute();
  }, []);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      audioPlayerService.setPlaybackRate(rate);
      usePlayerStore.getState().setPlaybackRate(rate);
    },
    [],
  );

  useMediaSession({
    onPlay: togglePlay,
    onPause: togglePlay,
    onNext: nextTrack,
    onPrevious: previousTrack,
    onSeek: seek,
  });

  return {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    muted,
    playbackRate,
    loading,
    error,
    queue,
    currentIndex,
    repeatMode,
    shuffle,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
  };
}
