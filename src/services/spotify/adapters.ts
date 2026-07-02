import type { Song, Album, Artist, Playlist } from "@/types";
import { createSilentAudioUrl } from "@/utils/audio";

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtistRef {
  id: string;
  name: string;
  external_urls: { spotify: string };
  href: string;
  type: "artist";
  uri: string;
}

interface SpotifyAlbumRef {
  id: string;
  name: string;
  album_type: string;
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  uri: string;
  href: string;
  external_urls: { spotify: string };
  artists: SpotifyArtistRef[];
}

export interface SpotifyTrackItem {
  id: string;
  name: string;
  artists: SpotifyArtistRef[];
  album: SpotifyAlbumRef;
  duration_ms: number;
  track_number: number;
  disc_number: number;
  popularity: number;
  explicit: boolean;
  preview_url: string | null;
  uri: string;
  href: string;
  external_urls: { spotify: string };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtistRef[];
  images: SpotifyImage[];
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  genres: string[];
  label: string;
  copyrights: { text: string; type: string }[];
  popularity: number;
  tracks: { items: SpotifyTrackItem[] };
  uri: string;
  href: string;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genres: string[];
  followers: { href: string | null; total: number };
  popularity: number;
  uri: string;
  href: string;
  external_urls: { spotify: string };
  type: "artist";
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: SpotifyImage[];
  owner: { id: string; display_name: string };
  public: boolean;
  collaborative: boolean;
  tracks: { items: { track: SpotifyTrackItem | null }[]; total: number };
  uri: string;
  href: string;
  external_urls: { spotify: string };
  followers: { total: number };
}

export interface SpotifySearchResult {
  tracks?: { items: SpotifyTrackItem[] };
  albums?: { items: SpotifyAlbum[] };
  artists?: { items: SpotifyArtist[] };
  playlists?: { items: SpotifyPlaylist[] };
}

export interface SpotifyNewReleases {
  albums: { items: SpotifyAlbum[] };
}

export interface SpotifyFeaturedPlaylists {
  playlists: { items: SpotifyPlaylist[] };
}

export interface SpotifyArtistTopTracks {
  tracks: SpotifyTrackItem[];
}

const silentUrl = createSilentAudioUrl();

function pickImage(images: SpotifyImage[] | undefined): string {
  if (!images || images.length === 0) return "";
  const sorted = [...images].sort((a, b) => b.width - a.width);
  return sorted[Math.floor(sorted.length / 2)]?.url ?? sorted[0]?.url ?? "";
}

export function mapSpotifyTrack(item: SpotifyTrackItem): Song {
  return {
    id: item.id,
    title: item.name,
    artists: item.artists.map((a) => ({
      id: a.id,
      name: a.name,
      imageUrl: "",
      genres: [],
      followers: 0,
      popularity: 0,
      topTracks: [],
      albums: [],
      bio: "",
    })),
    album: {
      id: item.album.id,
      title: item.album.name,
      artists: item.album.artists.map((a) => ({
        id: a.id,
        name: a.name,
        imageUrl: "",
        genres: [],
        followers: 0,
        popularity: 0,
        topTracks: [],
        albums: [],
        bio: "",
      })),
      coverUrl: pickImage(item.album.images),
      releaseDate: item.album.release_date,
      totalTracks: item.album.total_tracks,
      genres: [],
      label: "",
      copyrights: [],
      songs: [],
      popularity: 0,
    },
    duration: Math.round(item.duration_ms / 1000),
    trackNumber: item.track_number,
    discNumber: item.disc_number,
    genres: [],
    releaseDate: item.album.release_date,
    coverUrl: pickImage(item.album.images),
    audioUrl: silentUrl,
    popularity: item.popularity,
  };
}

export function mapSpotifyAlbum(album: SpotifyAlbum): Album {
  const songs = (album.tracks?.items ?? []).map(mapSpotifyTrack);
  return {
    id: album.id,
    title: album.name,
    artists: album.artists.map((a) => ({
      id: a.id,
      name: a.name,
      imageUrl: "",
      genres: [],
      followers: 0,
      popularity: 0,
      topTracks: [],
      albums: [],
      bio: "",
    })),
    coverUrl: pickImage(album.images),
    releaseDate: album.release_date,
    totalTracks: album.total_tracks,
    genres: album.genres ?? [],
    label: album.label ?? "",
    copyrights: (album.copyrights ?? []).map((c) => c.text),
    songs,
    popularity: album.popularity ?? 0,
  };
}

export function mapSpotifyArtist(artist: SpotifyArtist): Artist {
  return {
    id: artist.id,
    name: artist.name,
    imageUrl: pickImage(artist.images),
    genres: artist.genres ?? [],
    followers: artist.followers?.total ?? 0,
    popularity: artist.popularity ?? 0,
    topTracks: [],
    albums: [],
    bio: "",
  };
}

export function mapSpotifyPlaylist(playlist: SpotifyPlaylist): Playlist {
  const songs = (playlist.tracks?.items ?? [])
    .filter((item): item is { track: SpotifyTrackItem } => item.track !== null)
    .map((item) => mapSpotifyTrack(item.track));
  return {
    id: playlist.id,
    title: playlist.name,
    description: playlist.description ?? "",
    coverUrl: pickImage(playlist.images),
    owner: playlist.owner?.display_name ?? playlist.owner?.id ?? "Unknown",
    public: playlist.public ?? true,
    collaborative: playlist.collaborative ?? false,
    totalTracks: playlist.tracks?.total ?? songs.length,
    songs,
    createdAt: "",
    updatedAt: "",
  };
}
