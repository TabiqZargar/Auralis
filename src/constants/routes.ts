export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  LIBRARY: "/library",
  ALBUM: "/album/:id",
  ARTIST: "/artist/:id",
  PLAYLIST: "/playlist/:id",
  SETTINGS: "/settings",
} as const;

export const ROUTE_BUILDERS = {
  album: (id: string) => `/album/${id}`,
  artist: (id: string) => `/artist/${id}`,
  playlist: (id: string) => `/playlist/${id}`,
} as const;
