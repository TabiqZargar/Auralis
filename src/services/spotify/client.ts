import axios from "axios";
import { getSpotifyToken } from "./token";

let spotifyAxios: ReturnType<typeof axios.create> | null = null;

function getSpotifyClient() {
  if (spotifyAxios) return spotifyAxios;
  spotifyAxios = axios.create({
    baseURL: "https://api.spotify.com/v1",
  });
  spotifyAxios.interceptors.request.use(async (request) => {
    const token = await getSpotifyToken();
    request.headers.Authorization = `Bearer ${token}`;
    return request;
  });
  return spotifyAxios;
}

export const spotifyClient = {
  get<T>(path: string) {
    return getSpotifyClient().get<T>(path).then((r) => r.data);
  },
  post<T>(path: string, data?: unknown) {
    return getSpotifyClient().post<T>(path, data).then((r) => r.data);
  },
  put<T>(path: string, data?: unknown) {
    return getSpotifyClient().put<T>(path, data).then((r) => r.data);
  },
  delete<T>(path: string) {
    return getSpotifyClient().delete<T>(path).then((r) => r.data);
  },
};
