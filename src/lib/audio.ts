export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;

  initialize() {
    if (this.audioContext) return;
    this.audioContext = new AudioContext();
    this.analyserNode = this.audioContext.createAnalyser();
    this.gainNode = this.audioContext.createGain();
    this.analyserNode.fftSize = 256;
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  connectAudioElement(audioElement: HTMLAudioElement) {
    if (!this.audioContext) return;
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        /* already disconnected */
      }
      this.sourceNode = null;
    }
    try {
      this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
      this.sourceNode.connect(this.analyserNode!);
    } catch {
      /* already connected elsewhere */
    }
  }

  resume() {
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  getAnalyserNode() {
    return this.analyserNode;
  }

  getGainNode() {
    return this.gainNode;
  }

  getContext() {
    return this.audioContext;
  }

  setVolume(value: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(data);
    return data;
  }

  getTimeDomainData(): Uint8Array {
    if (!this.analyserNode) return new Uint8Array(0);
    const data = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteTimeDomainData(data);
    return data;
  }

  getFrequencyBinCount() {
    return this.analyserNode?.frequencyBinCount ?? 0;
  }

  destroy() {
    this.stop();
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        /* already disconnected */
      }
      this.sourceNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyserNode = null;
      this.gainNode = null;
    }
  }

  private animFrame: number | null = null;
  private drawCallback: ((data: Uint8Array, timeDomain: Uint8Array) => void) | null = null;

  startDrawing(cb: (freq: Uint8Array, timeDomain: Uint8Array) => void) {
    this.drawCallback = cb;
    const render = () => {
      if (!this.drawCallback) return;
      const freq = this.getFrequencyData();
      const td = this.getTimeDomainData();
      this.drawCallback(freq, td);
      this.animFrame = requestAnimationFrame(render);
    };
    render();
  }

  stop() {
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    this.drawCallback = null;
  }
}

export const audioEngine = new AudioEngine();
