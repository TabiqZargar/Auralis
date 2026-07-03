import { create } from "zustand";
import type { LibraryState, Playlist, Song } from "@/types";

interface LibraryActions {
  setPlaylists: (playlists: Playlist[]) => void;
  addPlaylist: (playlist: Playlist) => void;
  removePlaylist: (id: string) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  toggleLikedSong: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  addRecentlyPlayed: (song: Song) => void;
  toggleFollowArtist: (artistId: string) => void;
  toggleSaveAlbum: (albumId: string) => void;
  reset: () => void;
}

const initialState: LibraryState = {
  playlists: [],
  likedSongs: [],
  recentlyPlayed: [],
  followedArtists: [],
  savedAlbums: [],
};

export const useLibraryStore = create<LibraryState & LibraryActions>((set, get) => ({
  ...initialState,
  setPlaylists: (playlists) => set({ playlists }),
  addPlaylist: (playlist) => set((state) => ({ playlists: [...state.playlists, playlist] })),
  removePlaylist: (id) =>
    set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) })),
  updatePlaylist: (id, updates) =>
    set((state) => ({
      playlists: state.playlists.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  toggleLikedSong: (song) =>
    set((state) => ({
      likedSongs: state.likedSongs.some((s) => s.id === song.id)
        ? state.likedSongs.filter((s) => s.id !== song.id)
        : [song, ...state.likedSongs],
    })),
  isLiked: (songId) => get().likedSongs.some((s) => s.id === songId),
  addRecentlyPlayed: (song) =>
    set((state) => ({
      recentlyPlayed: [song, ...state.recentlyPlayed.filter((s) => s.id !== song.id)].slice(0, 50),
    })),
  toggleFollowArtist: (artistId) =>
    set((state) => ({
      followedArtists: state.followedArtists.includes(artistId)
        ? state.followedArtists.filter((id) => id !== artistId)
        : [...state.followedArtists, artistId],
    })),
  toggleSaveAlbum: (albumId) =>
    set((state) => ({
      savedAlbums: state.savedAlbums.includes(albumId)
        ? state.savedAlbums.filter((id) => id !== albumId)
        : [...state.savedAlbums, albumId],
    })),
  reset: () => set(initialState),
}));
