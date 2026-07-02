import { usePlayer } from "@/hooks";
import { PlayerControls } from "@/components/shared/PlayerControls";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { VolumeControl } from "@/components/shared/VolumeControl";
import { MediaImage } from "@/components/shared/MediaImage";
import { LikeButton } from "@/components/shared/LikeButton";
import { formatArtists } from "@/utils";

export function PlayerLayout() {
  const {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    muted,
    loading,
    error,
    shuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle: onToggleShuffle,
    cycleRepeatMode: onCycleRepeat,
  } = usePlayer();

  return (
    <div className="flex h-full items-center justify-between px-4">
      {/* Left: Track Info */}
      <div className="flex w-[30%] min-w-0 items-center gap-3">
        <MediaImage
          src={currentTrack?.coverUrl}
          alt={currentTrack?.title ?? "No track"}
          size="sm"
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {currentTrack?.title ?? "No track selected"}
          </p>
          <p className="truncate text-xs text-text-subdued">
            {currentTrack ? formatArtists(currentTrack.artists) : "Select a track to play"}
          </p>
        </div>
        {currentTrack && (
          <LikeButton isLiked={false} onToggle={() => {}} size="sm" />
        )}
      </div>

      {/* Center: Controls + Progress */}
      <div className="flex w-[40%] max-w-2xl flex-col items-center gap-1">
        <PlayerControls
          isPlaying={isPlaying}
          shuffle={shuffle}
          repeatMode={repeatMode}
          onTogglePlay={togglePlay}
          onPrevious={previousTrack}
          onNext={nextTrack}
          onToggleShuffle={onToggleShuffle}
          onCycleRepeat={onCycleRepeat}
          size="md"
          disabled={!currentTrack || !!error}
        />
        <div className="w-full max-w-xl">
          {error ? (
            <p className="text-center text-xs text-error">{error}</p>
          ) : loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
            </div>
          ) : (
            <ProgressBar
              current={currentTime}
              total={duration}
              onSeek={seek}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex w-[30%] items-center justify-end gap-2">
        <VolumeControl
          volume={volume}
          muted={muted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
          size="sm"
        />
      </div>
    </div>
  );
}
