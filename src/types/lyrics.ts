export interface LyricLine {
  time: number;
  text: string;
  duration: number;
}

export interface Lyrics {
  songId: string;
  source: "spotify" | "genius" | "local";
  lines: LyricLine[];
  language: string;
  copyright: string;
}

export interface SyncedLyrics extends Lyrics {
  lines: LyricLine[];
}

export interface UnsyncedLyrics extends Lyrics {
  lines: { time: 0; text: string; duration: 0 }[];
}
