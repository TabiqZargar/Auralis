export interface Song {
  id: string;
  title: string;
  artists: Artist[];
  album: Album;
  duration: number;
  trackNumber: number;
  discNumber: number;
  genres: string[];
  releaseDate: string;
  coverUrl: string;
  audioUrl: string;
  popularity: number;
}

export interface Album {
  id: string;
  title: string;
  artists: Artist[];
  coverUrl: string;
  releaseDate: string;
  totalTracks: number;
  genres: string[];
  label: string;
  copyrights: string[];
  songs: Song[];
  popularity: number;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  followers: number;
  popularity: number;
  topTracks: Song[];
  albums: Album[];
  bio: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  owner: string;
  public: boolean;
  collaborative: boolean;
  totalTracks: number;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  song: Song;
  addedBy: string;
  addedAt: string;
  position: number;
}
