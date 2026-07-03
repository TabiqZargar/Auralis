export class AudioPlayerService {
  private audioElement: HTMLAudioElement | null = null;
  private mediaSource: MediaSource | null = null;

  initialize() {
    this.audioElement = new Audio();
    this.audioElement.preload = "auto";
    this.audioElement.crossOrigin = "anonymous";
  }

  getElement() {
    return this.audioElement;
  }

  load(src: string) {
    if (!this.audioElement) return;
    this.audioElement.src = src;
    this.audioElement.load();
  }

  play() {
    return this.audioElement?.play();
  }

  pause() {
    this.audioElement?.pause();
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  }

  seek(time: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
    }
  }

  setVolume(value: number) {
    if (this.audioElement) {
      this.audioElement.volume = value;
    }
  }

  setPlaybackRate(rate: number) {
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  getCurrentTime() {
    return this.audioElement?.currentTime ?? 0;
  }

  getDuration() {
    return this.audioElement?.duration ?? 0;
  }

  destroy() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = "";
      this.audioElement = null;
    }
  }
}

export const audioPlayerService = new AudioPlayerService();
