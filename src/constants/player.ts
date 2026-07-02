export const PLAYER = {
  DEFAULT_VOLUME: 0.7,
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  VOLUME_STEP: 0.05,
  SEEK_STEP: 5,
  CROSSFADE_DURATION: 3,
  MAX_QUEUE_SIZE: 500,
  HISTORY_SIZE: 100,
  PLAYBACK_RATES: [0.5, 0.75, 1, 1.25, 1.5, 2],
} as const;

export const AUDIO_QUALITY = {
  low: { bitrate: 96000, format: "mp3" },
  normal: { bitrate: 160000, format: "mp3" },
  high: { bitrate: 320000, format: "mp3" },
  lossless: { bitrate: 1411000, format: "flac" },
} as const;
