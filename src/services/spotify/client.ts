import { apiClient } from "@/lib/axios";

export const spotifyClient = {
  get<T>(path: string) {
    return apiClient.get<T>(`/spotify${path}`).then((r) => r.data);
  },
  post<T>(path: string, data?: unknown) {
    return apiClient.post<T>(`/spotify${path}`, data).then((r) => r.data);
  },
  put<T>(path: string, data?: unknown) {
    return apiClient.put<T>(`/spotify${path}`, data).then((r) => r.data);
  },
  delete<T>(path: string, config?: Record<string, unknown>) {
    return apiClient.delete<T>(`/spotify${path}`, config).then((r) => r.data);
  },
};
