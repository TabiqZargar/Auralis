import { createJSONStorage } from "zustand/middleware";
import { config } from "@/config";

export const zustandStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    try {
      return localStorage.getItem(`${config.storage.prefix}${name}`);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(`${config.storage.prefix}${name}`, value);
    } catch (e) {
      console.error("Storage write failed:", e);
    }
  },
  removeItem: (name: string) => {
    localStorage.removeItem(`${config.storage.prefix}${name}`);
  },
}));
