import sharp from "sharp";

// Original, deterministic dark-water texture for the local product stage.
const width = 1200;
const height = 440;
const pixels = Buffer.alloc(width * height * 3);
const highlights = Buffer.alloc(width * height * 4);
let seed = 248013;
function noise() {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 0xffffffff - 0.5;
}
for (let y = 0; y < height; y++) {
  const depth = y / height;
  for (let x = 0; x < width; x++) {
    const across = x / width;
    const beam = Math.exp(-(((across - 0.53) / 0.27) ** 2)) * (1 - depth * 0.7);
    const wave =
      Math.sin(y * 0.16 + x * 0.011 + Math.sin(x * 0.026) * 1.3) +
      0.42 * Math.sin(y * 0.37 - x * 0.021);
    const brokenCrest = Math.max(0, Math.sin(x * 0.026 + y * 0.047)) ** 2;
    const crest = Math.max(0, wave - 0.57) ** 2 * brokenCrest * (1 - depth * 0.65);
    const grain = noise() * 2.3;
    const top = [43, 29, 22];
    const bottom = [21, 17, 16];
    const index = (y * width + x) * 3;
    for (let channel = 0; channel < 3; channel++) {
      const value =
        top[channel] * (1 - depth) +
        bottom[channel] * depth +
        beam * [16, 8, 3][channel] +
        crest * [24, 15, 8][channel] +
        grain;
      pixels[index + channel] = Math.max(0, Math.min(255, value));
    }
    const overlayIndex = (y * width + x) * 4;
    highlights[overlayIndex] = 225;
    highlights[overlayIndex + 1] = 164;
    highlights[overlayIndex + 2] = 98;
    const broadRipple = Math.max(0, Math.sin(y * 0.075 + x * 0.007 + Math.sin(x * 0.014))) ** 3;
    highlights[overlayIndex + 3] = Math.min(
      105,
      (crest * 85 + broadRipple * 24) * beam,
    );
  }
}
await sharp(pixels, { raw: { width, height, channels: 3 } })
  .webp({ quality: 88, effort: 5 })
  .toFile("public/textures/studio-water.webp");
console.log("Wrote original studio-water.webp");
await sharp(highlights, { raw: { width, height, channels: 4 } })
  .webp({ quality: 88, effort: 5 })
  .toFile("public/textures/studio-water-highlights.webp");
console.log("Wrote original studio-water-highlights.webp");
