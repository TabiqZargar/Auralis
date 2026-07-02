import { createBrowserRouter, RouterProvider } from "react-router";
import { RootLayout } from "@/app/layouts/RootLayout";
import { HomePage } from "@/pages/HomePage";
import { SearchPage } from "@/pages/SearchPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { AlbumPage } from "@/pages/AlbumPage";
import { ArtistPage } from "@/pages/ArtistPage";
import { PlaylistPage } from "@/pages/PlaylistPage";
import { SettingsPage } from "@/pages/SettingsPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "library", element: <LibraryPage /> },
      { path: "album/:id", element: <AlbumPage /> },
      { path: "artist/:id", element: <ArtistPage /> },
      { path: "playlist/:id", element: <PlaylistPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
