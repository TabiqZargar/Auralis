import { ROUTES } from "@/constants";

export interface AppRoute {
  path: string;
  label: string;
  icon?: string;
  showInNav?: boolean;
}

export const routes: AppRoute[] = [
  { path: ROUTES.HOME, label: "Home", icon: "House", showInNav: true },
  { path: ROUTES.SEARCH, label: "Search", icon: "Search", showInNav: true },
  { path: ROUTES.LIBRARY, label: "Library", icon: "Library", showInNav: true },
  { path: ROUTES.SETTINGS, label: "Settings", icon: "Settings", showInNav: false },
];
