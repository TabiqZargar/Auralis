# Music Player

A feature-rich web-based music player built with React 19, TypeScript, Tailwind CSS 4, and the Spotify Web API.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript 5.6 |
| Routing | React Router 7 |
| State | Zustand 5 |
| Data Fetching | TanStack React Query 5 |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 11 |
| HTTP | Axios 1.7 |
| Icons | Lucide React |
| Build | Vite 6 |

## Features

### Implemented & Working

- **Audio Playback** — Play/pause/stop/seek via HTML5 Audio, volume control, playback speed
- **Player Controls** — Next/previous, shuffle, repeat (off/all/one), progress bar with seek
- **Queue Management** — Add to queue, play next, remove, reorder, clear, navigate history
- **Search** — Debounced search across tracks, albums, artists, and playlists via Spotify API
- **Home Page** — New Releases, Featured Playlists, Trending Artists sections with skeleton loading
- **Detail Pages** — Album, Artist, and Playlist pages with hero banners, track lists, and genre tags
- **Liked Songs** — Toggle favorite on any track, persisted locally in Zustand store
- **Recently Played** — Automatic tracking of recently played tracks (max 50)
- **Playlist CRUD** — Create, rename, delete, duplicate playlists; add/remove/reorder songs
- **Keyboard Shortcuts** — Space (play/pause), arrows (seek), Ctrl+arrows (next/prev), M (mute), F (like), Q (queue), / (help)
- **Media Session** — OS-level media controls via Browser Media Session API
- **Context Menu** — Right-click menus on tracks
- **Toast Notifications** — Success/error/info toasts with auto-dismiss
- **Audio Visualizer** — 4 modes: bars, circle, waveform, particles (canvas-based)
- **Equalizer Display** — Real-time frequency bar display
- **Synced Lyrics** — Time-synced lyrics with auto-scroll and click-to-seek
- **Now Playing Overlay** — Full-screen view with album art, visualizer, lyrics, and queue
- **Dynamic Theming** — Extracts dominant color from album art to tint the UI
- **Dark/Light Mode** — Theme toggle with CSS variable swapping
- **Page Transitions** — Animated route transitions via Framer Motion
- **Spotify Fallback** — Automatic fallback to local mock data when Spotify API returns 403
- **Responsive Layout** — Adapts to different screen sizes

### Stub / Placeholder (Not Yet Implemented)

| Component | Status |
|-----------|--------|
| `LibraryPage` | Renders empty `<h1>Library</h1>` |
| `SettingsPage` | Renders empty `<h1>Settings</h1>` |
| `Sidebar` | Returns `null` |
| `Navbar` | Returns `null` |
| `RightPanel` | Returns `null` |
| `MobileNav` | Returns `null` |

### Settings That Exist But Have No Logic

- **Crossfade** — `crossfadeEnabled` / `crossfadeDuration` stored but no playback logic handles it
- **Gapless Playback** — Setting stored but no implementation
- **Equalizer Presets** — Preset name stored but no frequency band mapping
- **Audio Quality** — Setting stored but no bitrate/quality switching

## What's Holding Back Deployment

### Critical

1. **No actual audio output from mock tracks** — All mock data uses programmatically generated silent WAV blobs. The UI changes state but produces no sound. The Spotify `preview_url` is discarded by the adapter layer (`adapters.ts` maps `audioUrl` to the silent blob instead of using `preview_url`).

2. **Spotify Client Secret exposed in client bundle** — `VITE_SPOTIFY_CLIENT_SECRET` is in a `VITE_`-prefixed env var, which Vite bundles into client-side JavaScript. This secret is visible in the browser DevTools and must never be committed to a public repository.

3. **AudioContext never connected to the audio element** — `lib/audio.ts` has a `connectAudioElement` function that is a no-op. The `AnalyserNode` never receives real audio data, so the visualizer and equalizer render silence even when audio is playing.

### High

4. **No Authorization Code flow** — Only the Client Credentials flow is implemented. This provides read-only access to public Spotify data. User-specific features (streaming, user library sync, user playlists) require the Authorization Code with PKCE flow, which is not implemented.

5. **Dynamic theming is a stub** — `extractDominantColor()` in `utils/color.ts` always returns `#1db954` (Spotify green) regardless of input. Real color extraction from album art is not implemented.

### Medium

6. **No lyrics data source** — The lyrics panel uses a hardcoded mock array. No lyrics API (Spotify, Genius, Musixmatch, LRCLIB) is integrated.

7. **No state persistence** — The `zustandStorage` adapter exists in `store/persist.ts` but is not applied to any store. All liked songs, playlists, queue, and settings are lost on page refresh.

8. **5 stub pages/components** — Library, Settings, Sidebar, Navbar, and Mobile Nav are empty shells.

### Low

9. **Duplicate Axios instances** — Three separate Axios clients are created (`lib/axios.ts`, `services/spotify/client.ts`, `services/spotify/api.ts`).

10. **Feature index files are empty** — All 12 feature modules export nothing from their `index.ts`.

## Project Structure

```
src/
  app/            # Router, layouts, providers, entry point
  assets/         # Static assets
  components/     # Shared UI components (layout, shared, ui)
  config/         # App configuration
  constants/      # Routes, themes, keyboard shortcuts
  features/       # Feature modules (home, search, albums, artists,
                  #   playlists, player, queue, library, lyrics,
                  #   equalizer, visualizer, settings)
  hooks/          # Shared custom hooks
  lib/            # Library wrappers (audio, axios)
  mocks/          # Local mock data (artists, albums, playlists, tracks)
  pages/          # Route-level page components
  services/       # External integrations (spotify, audio, storage)
  store/          # Zustand state stores
  styles/         # Global styles, CSS variables
  types/          # TypeScript interfaces
  utils/          # Pure utility functions
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Spotify API credentials

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SPOTIFY_CLIENT_ID` | Yes | Spotify API Client ID |
| `VITE_SPOTIFY_CLIENT_SECRET` | Yes | Spotify API Client Secret (**must not be exposed in client**) |
| `VITE_SPOTIFY_REDIRECT_URI` | No | OAuth redirect URI (for future Authorization Code flow) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript type checking |
