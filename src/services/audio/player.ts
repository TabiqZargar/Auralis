type AudioEventName =
  | "loadstart"
  | "loadedmetadata"
  | "canplay"
  | "play"
  | "pause"
  | "ended"
  | "timeupdate"
  | "waiting"
  | "error"
  | "volumechange"
  | "ratechange";

type AudioEventCallback = (event?: Event) => void;

export class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private listeners = new Map<AudioEventName, Set<AudioEventCallback>>();
  private boundHandleEvent: ((event: Event) => void) | null = null;

  initialize() {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = "auto";
    this.audio.crossOrigin = "anonymous";
    this.boundHandleEvent = this.handleEvent.bind(this);
    this.attachEvents();
  }

  getElement() {
    return this.audio;
  }

  load(src: string) {
    if (!this.audio) return;
    if (this.audio.src !== src) {
      this.audio.src = src;
      this.audio.load();
    }
  }

  play() {
    if (!this.audio) return Promise.resolve();
    return this.audio.play();
  }

  pause() {
    this.audio?.pause();
  }

  togglePlay() {
    if (!this.audio) return Promise.resolve();
    if (this.audio.paused) {
      return this.audio.play();
    }
    this.audio.pause();
    return Promise.resolve();
  }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  seek(time: number) {
    if (!this.audio) return;
    this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration || 0));
  }

  setVolume(value: number) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, value));
  }

  setPlaybackRate(rate: number) {
    if (!this.audio) return;
    this.audio.playbackRate = Math.max(0.25, Math.min(4, rate));
  }

  mute() {
    if (this.audio) this.audio.muted = true;
  }

  unmute() {
    if (this.audio) this.audio.muted = false;
  }

  toggleMute() {
    if (!this.audio) return;
    this.audio.muted = !this.audio.muted;
  }

  getCurrentTime() {
    return this.audio?.currentTime ?? 0;
  }

  getDuration() {
    return this.audio?.duration ?? 0;
  }

  getIsPaused() {
    return this.audio?.paused ?? true;
  }

  on(event: AudioEventName, callback: AudioEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: AudioEventName, callback: AudioEventCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  private attachEvents() {
    if (!this.audio || !this.boundHandleEvent) return;
    const events: AudioEventName[] = [
      "loadstart",
      "loadedmetadata",
      "canplay",
      "play",
      "pause",
      "ended",
      "timeupdate",
      "waiting",
      "error",
      "volumechange",
      "ratechange",
    ];
    for (const event of events) {
      this.audio.addEventListener(event, this.boundHandleEvent);
    }
  }

  private detachEvents() {
    if (!this.audio || !this.boundHandleEvent) return;
    const events: AudioEventName[] = [
      "loadstart",
      "loadedmetadata",
      "canplay",
      "play",
      "pause",
      "ended",
      "timeupdate",
      "waiting",
      "error",
      "volumechange",
      "ratechange",
    ];
    for (const event of events) {
      this.audio.removeEventListener(event, this.boundHandleEvent);
    }
  }

  private handleEvent(event: Event) {
    const callbacks = this.listeners.get(event.type as AudioEventName);
    if (callbacks) {
      for (const cb of callbacks) {
        cb(event);
      }
    }
  }

  destroy() {
    this.detachEvents();
    this.listeners.clear();
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
      this.audio = null;
    }
    this.boundHandleEvent = null;
  }
}

export const audioPlayerService = new AudioPlayerService();
