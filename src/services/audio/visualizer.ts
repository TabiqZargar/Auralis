export class VisualizerService {
  private canvas: HTMLCanvasElement | null = null;
  private animationFrameId: number | null = null;
  private analyserNode: AnalyserNode | null = null;

  attach(canvas: HTMLCanvasElement, analyserNode: AnalyserNode) {
    this.canvas = canvas;
    this.analyserNode = analyserNode;
  }

  start(drawFn: (data: Uint8Array, canvas: HTMLCanvasElement) => void) {
    const render = () => {
      if (!this.analyserNode || !this.canvas) return;
      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyserNode.getByteFrequencyData(dataArray);
      drawFn(dataArray, this.canvas);
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  detach() {
    this.stop();
    this.canvas = null;
    this.analyserNode = null;
  }
}

export const visualizerService = new VisualizerService();
