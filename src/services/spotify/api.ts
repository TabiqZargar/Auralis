import axios, { AxiosError } from "axios";

let apiInstance: ReturnType<typeof axios.create> | null = null;

function getApi() {
  if (apiInstance) return apiInstance;

  apiInstance = axios.create({
    baseURL: "https://api.spotify.com/v1",
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
  try {
    const { data } = await api.get<T>(path, { params: cleanParams });
    return data;
  } catch (error) {
    logError(path, error);
    throw error;
  }
}

export async function spotifyPost<T>(path: string, data?: unknown): Promise<T> {
  const api = getApi();
  try {
    const { data: responseData } = await api.post<T>(path, data);
    return responseData;
  } catch (error) {
    logError(path, error);
    throw error;
  }
}

export async function spotifyPut<T>(path: string, data?: unknown): Promise<T> {
  const api = getApi();
  try {
    const { data: responseData } = await api.put<T>(path, data);
    return responseData;
  } catch (error) {
    logError(path, error);
    throw error;
  }
}

export async function spotifyDelete<T>(path: string, config?: Record<string, unknown>): Promise<T> {
  const api = getApi();
  try {
    const { data } = await api.delete<T>(path, config);
    return data;
  } catch (error) {
    logError(path, error);
    throw error;
  }
}

function logError(path: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(`Spotify API Error: ${path}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  } else {
    console.error(`Spotify API Error: ${path}`, error);
  }
}

export function isSpotifyError(error: unknown): error is AxiosError<{ error: { message: string; status: number } }> {
  return axios.isAxiosError(error);
}
