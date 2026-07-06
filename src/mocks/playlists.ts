import type { Playlist } from "@/types";
import { mockTracks } from "./tracks";

export const mockPlaylists: Playlist[] = [
  {
    id: "mock-playlist-1",
    title: "Today's Top Hits",
    description: "The biggest songs right now.",
    coverUrl: "https://mosaic.scdn.co/640/ab67616d0000b273bb54dde68cd23e2a268ae0f5ab67616d0000b27382ea2e9e1858c05d0a5c9b9e",
    owner: "Spotify",
    public: true,
    collaborative: false,
    totalTracks: 50,
    songs: mockTracks.filter((t) =>
      ["mock-track-4", "mock-track-7", "mock-track-18", "mock-track-16"].includes(t.id)
    ),
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "mock-playlist-2",
    title: "Rock Classics",
    description: "Rock legends & epic guitar anthems.",
    coverUrl: "https://mosaic.scdn.co/640/ab67616d0000b273ce4f1737bc8a646c8c4bd22a403767f82e58762a3b8a1c9e",
    owner: "Spotify",
    public: true,
    collaborative: false,
    totalTracks: 100,
    songs: mockTracks.filter((t) =>
      ["mock-track-1", "mock-track-2", "mock-track-3", "mock-track-10", "mock-track-11", "mock-track-12", "mock-track-13"].includes(t.id)
    ),
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "mock-playlist-3",
    title: "Pop Hits 2024",
    description: "The best pop songs of the year.",
    coverUrl: "https://mosaic.scdn.co/640/ab67616d0000b273bb54dde68cd23e2a268ae0f5dc30583ba717007b00dce025",
    owner: "Spotify",
    public: true,
    collaborative: false,
    totalTracks: 75,
    songs: mockTracks.filter((t) =>
      ["mock-track-7", "mock-track-8", "mock-track-9", "mock-track-18", "mock-track-19", "mock-track-20"].includes(t.id)
    ),
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "mock-playlist-4",
    title: "Hip Hop Classics",
    description: "Essential hip hop tracks.",
    coverUrl: "https://mosaic.scdn.co/640/ab67616d0000b27382ea2e9e1858c05d0a5c9b9eab67616d0000b273dc30583ba717007b00dce025",
    owner: "Spotify",
    public: true,
    collaborative: false,
    totalTracks: 60,
    songs: mockTracks.filter((t) =>
      ["mock-track-4", "mock-track-5", "mock-track-6"].includes(t.id)
    ),
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "mock-playlist-5",
    title: "Indie Mix",
    description: "Fresh indie tracks to discover.",
    coverUrl: "https://mosaic.scdn.co/640/ab67616d0000b273a9a38d5cc09f4a827b1f5895ab67616d0000b273dc30583ba717007b00dce025",
    owner: "Spotify",
    public: true,
    collaborative: false,
    totalTracks: 40,
    songs: mockTracks.filter((t) =>
      ["mock-track-10", "mock-track-11", "mock-track-16", "mock-track-17"].includes(t.id)
    ),
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "mock-playlist-6",
    title: "Throwback Jams",
    description: "Nostalgic hits from the past decades.",
    coverUrl: "https://mosaic.scdn.co/640/ab67616d0000b273dc30583ba717007b00dce025ab67616d0000b273403767f82e58762a3b8a1c9e",
    owner: "Spotify",
    public: true,
    collaborative: false,
    totalTracks: 80,
    songs: mockTracks.filter((t) =>
      ["mock-track-1", "mock-track-14", "mock-track-15", "mock-track-12", "mock-track-13"].includes(t.id)
    ),
    createdAt: "",
    updatedAt: "",
  },
];

export const mockFeaturedPlaylists = mockPlaylists.slice(0, 6);
