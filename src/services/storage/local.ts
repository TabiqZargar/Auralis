import { config } from "@/config";

export const storageService = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${config.storage.prefix}${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${config.storage.prefix}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error("Storage write failed:", error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${config.storage.prefix}${key}`);
  },

  clear(): void {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(config.storage.prefix),
    );
    keys.forEach((k) => localStorage.removeItem(k));
  },
};
