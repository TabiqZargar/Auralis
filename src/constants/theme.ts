export const THEME = {
  ACCENT_COLORS: [
    "green",
    "blue",
    "purple",
    "red",
    "orange",
    "yellow",
    "pink",
    "teal",
  ] as const,
  DEFAULT_ACCENT: "green",
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 72,
  PLAYER_HEIGHT: 90,
  RIGHT_PANEL_WIDTH: 360,
  HEADER_HEIGHT: 64,
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
