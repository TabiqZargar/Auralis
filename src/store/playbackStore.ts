import { create } from "zustand";
import type { PlaybackState } from "@/types";

interface PlaybackActions {
  setDeviceId: (id: string | null) => void;
  setDeviceName: (name: string) => void;
  setIsActive: (active: boolean) => void;
  setAvailableDevices: (devices: string[]) => void;
  setConnectionStatus: (status: PlaybackState["connectionStatus"]) => void;
  reset: () => void;
}

const initialState: PlaybackState = {
  deviceId: null,
  deviceName: "Browser",
  isActive: false,
  availableDevices: [],
  connectionStatus: "disconnected",
};

export const usePlaybackStore = create<PlaybackState & PlaybackActions>((set) => ({
  ...initialState,
  setDeviceId: (id) => set({ deviceId: id }),
  setDeviceName: (name) => set({ deviceName: name }),
  setIsActive: (active) => set({ isActive: active }),
  setAvailableDevices: (devices) => set({ availableDevices: devices }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  reset: () => set(initialState),
}));
