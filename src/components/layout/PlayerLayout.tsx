import { usePlayer, useQueue } from "@/hooks";
import { useFavorites } from "@/hooks/useFavorites";
import { PlayerControls } from "@/components/shared/PlayerControls";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { VolumeControl } from "@/components/shared/VolumeControl";
import { MediaImage } from "@/components/shared/MediaImage";
import { LikeButton } from "@/components/shared/LikeButton";
import { formatArtists } from "@/utils";

export function PlayerLayout() {
  const player = usePlayer();
  const queue = useQueue();
  const { isLiked, toggleLike } = useFavorites();

  return (
    <div className="flex h-full items-center justify-between px-4">
      {/* Left: Track Info */}
      <div className="flex w-[30%] min-w-0 items-center gap-3">
        <MediaImage
          src={player.currentTrack?.coverUrl}
          alt={player.currentTrack?.title ?? "No track"}
          size="sm"
          className="shrink-0"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {player.currentTrack?.title ?? "No track selected"}
          </p>
          <p className="truncate text-xs text-text-subdued">
            {player.currentTrack
              ? formatArtists(player.currentTrack.artists)
              : "Select a track to play"}
          </p>
        </div>
        {player.currentTrack && (
          <LikeButton
            isLiked={isLiked(player.currentTrack.id)}
            onToggle={() => toggleLike(player.currentTrack!)}
            size="sm"
          />
        )}
      </div>

      {/* Center: Controls + Progress */}
      <div className="flex w-[40%] max-w-2xl flex-col items-center gap-1">
        <PlayerControls
          isPlaying={player.isPlaying}
          shuffle={player.shuffle}
          repeatMode={player.repeatMode}
          onTogglePlay={player.togglePlay}
          onPrevious={player.previousTrack}
          onNext={player.nextTrack}
          onToggleShuffle={queue.toggleShuffle}
          onCycleRepeat={queue.cycleRepeatMode}
          size="md"
          disabled={!player.currentTrack || !!player.error}
        />
        <div className="w-full max-w-xl">
          {player.error ? (
            <p className="text-center text-xs text-error">{player.error}</p>
          ) : player.loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-full max-w-xl animate-pulse rounded-full bg-white/10" />
            </div>
          ) : (
            <ProgressBar
              current={player.currentTime}
              total={player.duration}
              onSeek={player.seek}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex w-[30%] items-center justify-end gap-2">
        <VolumeControl
          volume={player.volume}
          muted={player.muted}
          onVolumeChange={player.setVolume}
          onToggleMute={player.toggleMute}
          size="sm"
        />
      </div>
    </div>
  );
}
