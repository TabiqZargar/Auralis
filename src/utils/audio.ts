let blobUrl: string | null = null;

function generateToneBuffer(
  sampleRate: number,
  frequency: number,
  durationSec: number,
  type: "sine" | "triangle" = "sine",
): Float32Array {
  const length = Math.floor(sampleRate * durationSec);
  const buffer = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const phase = 2 * Math.PI * frequency * t;

    if (type === "triangle") {
      buffer[i] = (2 / Math.PI) * Math.asin(Math.sin(phase)) * 0.3;
    } else {
      buffer[i] = Math.sin(phase) * 0.3;
    }

    const fadeDuration = 0.05;
    const fadeSamples = Math.floor(sampleRate * fadeDuration);
    if (i < fadeSamples) {
      buffer[i] *= i / fadeSamples;
    }
    if (i > length - fadeSamples) {
      buffer[i] *= (length - i) / fadeSamples;
    }
  }
  return buffer;
}

function encodeWav(sampleRate: number, samples: Float32Array): ArrayBuffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(headerSize + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return buffer;
}

export function createSilentAudioUrl(): string {
  if (blobUrl) return blobUrl;
  const sampleRate = 44100;
  const samples = new Float32Array(Math.floor(sampleRate * 0.01));
  const wav = encodeWav(sampleRate, samples);
  blobUrl = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
  return blobUrl;
}

export function createTestToneUrl(
  frequency: number,
  durationSec: number,
  type: "sine" | "triangle" = "sine",
): string {
  const sampleRate = 44100;
  const samples = generateToneBuffer(sampleRate, frequency, durationSec, type);
  const wav = encodeWav(sampleRate, samples);
  return URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
}
