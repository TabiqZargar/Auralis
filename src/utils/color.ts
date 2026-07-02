export function generateGradient(color1: string, color2: string, angle = 135): string {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!imageUrl || imageUrl === "") {
      resolve("#1db954");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve("#1db954");
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);

        const imageData = ctx.getImageData(0, 0, size, size).data;
        const colorBuckets: Map<string, number> = new Map();

        for (let i = 0; i < imageData.length; i += 16) {
          const r = Math.round(imageData[i]! / 32) * 32;
          const g = Math.round(imageData[i + 1]! / 32) * 32;
          const b = Math.round(imageData[i + 2]! / 32) * 32;
          const key = `${r},${g},${b}`;
          colorBuckets.set(key, (colorBuckets.get(key) ?? 0) + 1);
        }

        let maxCount = 0;
        let dominantKey = "29,185,84";
        for (const [key, count] of colorBuckets) {
          if (count > maxCount) {
            maxCount = count;
            dominantKey = key;
          }
        }

        const [r, g, b] = dominantKey.split(",").map(Number);
        const hex = `#${((1 << 24) | ((r ?? 0) << 16) | ((g ?? 0) << 8) | (b ?? 0)).toString(16).slice(1)}`;
        resolve(hex);
      } catch {
        resolve("#1db954");
      }
    };

    img.onerror = () => {
      resolve("#1db954");
    };
  });
}

export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace("#", "");
  const r = Number.parseInt(cleanHex.slice(0, 2), 16);
  const g = Number.parseInt(cleanHex.slice(2, 4), 16);
  const b = Number.parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isLightColor(hex: string): boolean {
  const cleanHex = hex.replace("#", "");
  const r = Number.parseInt(cleanHex.slice(0, 2), 16);
  const g = Number.parseInt(cleanHex.slice(2, 4), 16);
  const b = Number.parseInt(cleanHex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export function darkenColor(hex: string, amount: number): string {
  const cleanHex = hex.replace("#", "");
  const r = Math.max(0, Number.parseInt(cleanHex.slice(0, 2), 16) - amount);
  const g = Math.max(0, Number.parseInt(cleanHex.slice(2, 4), 16) - amount);
  const b = Math.max(0, Number.parseInt(cleanHex.slice(4, 6), 16) - amount);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
