import { useCallback, useRef } from "react";
import { visualizerService } from "@/services/audio";
import { audioEngine } from "@/lib/audio";

export function useVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const attach = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    const analyser = audioEngine.getAnalyserNode();
    if (analyser) {
      visualizerService.attach(canvas, analyser);
    }
  }, []);

  const start = useCallback(
    (drawFn: (data: Uint8Array, canvas: HTMLCanvasElement) => void) => {
      visualizerService.start(drawFn);
    },
    [],
  );

  const stop = useCallback(() => {
    visualizerService.stop();
  }, []);

  const detach = useCallback(() => {
    visualizerService.detach();
  }, []);

  return { attach, start, stop, detach, canvasRef };
}
