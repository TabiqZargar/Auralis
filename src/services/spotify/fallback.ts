import { AxiosError } from "axios";
import { mockNewReleases } from "@/mocks/albums";
import { mockFeaturedPlaylists } from "@/mocks/playlists";
import { mockTrendingArtists } from "@/mocks/artists";
import type { Album, Playlist, Artist } from "@/types";

let isSpotifyUnavailable = false;

export function isSpotify403Error(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
}

export function checkSpotifyAvailability(error: unknown): boolean {
  if (isSpotify403Error(error)) {
    if (!isSpotifyUnavailable) {
      console.warn("Spotify API unavailable. Using local mock data.");
      isSpotifyUnavailable = true;
    }
    return false;
  }
  return true;
}

export function getMockNewReleases(): Album[] {
  return mockNewReleases;
}

export function getMockFeaturedPlaylists(): Playlist[] {
  return mockFeaturedPlaylists;
}

export function getMockTrendingArtists(): Artist[] {
  return mockTrendingArtists;
}

export function isUnavailable(): boolean {
  return isSpotifyUnavailable;
}
