export const qualityPresets = {
  high: { dpr: 1.5, environmentResolution: 128, antialias: true },
  low: { dpr: 1, environmentResolution: 64, antialias: true },
} as const;
export function getQuality(smallViewport: boolean) {
  return smallViewport ? qualityPresets.low : qualityPresets.high;
}
