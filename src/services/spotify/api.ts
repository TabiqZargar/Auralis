import axios, { AxiosError } from "axios";
import { config } from "@/config";

let apiInstance: ReturnType<typeof axios.create> | null = null;

function getApi() {
  if (apiInstance) return apiInstance;

  apiInstance = axios.create({
    baseURL: config.spotify.apiBaseUrl,
    timeout: 10000,
  });

  apiInstance.interceptors.request.use(async (request) => {
    const { getSpotifyToken } = await import("./token");
    const token = await getSpotifyToken();
    request.headers.Authorization = `Bearer ${token}`;
    return request;
  });

  return apiInstance;
}

export async function spotifyGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const api = getApi();
  const cleanParams = Object.fromEntries(
    Object.entries(params ?? {}).filter(([_, v]) => v !== undefined && v !== ""),
  );
  const { data } = await api.get<T>(path, { params: cleanParams });
  return data;
}

export function isSpotifyError(error: unknown): error is AxiosError<{ error: { message: string; status: number } }> {
  return axios.isAxiosError(error);
}
