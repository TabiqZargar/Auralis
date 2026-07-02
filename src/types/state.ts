import type { Song, QueueItem, Playlist } from "./models";

export type PlaybackStatus = "idle" | "playing" | "paused" | "loading" | "error";

export type RepeatMode = "off" | "all" | "one";

export type ShuffleMode = "off" | "on";

export interface PlayerState {
  currentSong: Song | null;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeat: RepeatMode;
  shuffle: ShuffleMode;
  crossfadeEnabled: boolean;
  crossfadeDuration: number;
}

export interface QueueState {
  items: QueueItem[];
  currentIndex: number;
  history: QueueItem[];
}

export interface LibraryState {
  playlists: Playlist[];
  likedSongs: Song[];
  recentlyPlayed: Song[];
  followedArtists: string[];
  savedAlbums: string[];
}

export interface ThemeState {
  mode: "light" | "dark" | "system";
  accentColor: string;
  reducedMotion: boolean;
  compactMode: boolean;
}

export interface SettingsState {
  audioQuality: "low" | "normal" | "high" | "lossless";
  playbackSpeed: number;
  equalizerPreset: string;
  equalizerBands: number[];
  language: string;
  showLyrics: boolean;
  showVisualizer: boolean;
  gaplessPlayback: boolean;
  autoPlay: boolean;
  keyboardShortcuts: boolean;
  notificationsEnabled: boolean;
  socialFeatures: boolean;
}

export interface PlaybackState {
  deviceId: string | null;
  deviceName: string;
  isActive: boolean;
  availableDevices: string[];
  connectionStatus: "disconnected" | "connecting" | "connected";
}
