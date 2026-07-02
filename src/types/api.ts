export interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
}

export interface APIError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface SearchResults {
  songs: import("./models").Song[];
  albums: import("./models").Album[];
  artists: import("./models").Artist[];
  playlists: import("./models").Playlist[];
  total: number;
}
