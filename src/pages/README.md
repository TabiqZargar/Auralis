# pages/

Route-level page components.

## Pages

| Page          | Route          | Description |
|--------------|----------------|-------------|
| HomePage     | `/`            | Landing page with curated content |
| SearchPage   | `/search`      | Search interface and results |
| LibraryPage  | `/library`     | User's playlists and saved content |
| AlbumPage    | `/album/:id`   | Album detail view |
| ArtistPage   | `/artist/:id`  | Artist profile and discography |
| PlaylistPage | `/playlist/:id`| Playlist detail view |
| SettingsPage | `/settings`    | User preferences |

## Rules

- Pages compose features, shared components, and layout components.
- Pages represent top-level routes.
- Keep pages thin — delegate UI to components, logic to hooks/stores.
