import sharp from "sharp";
import { access } from "node:fs/promises";
for (const id of ["obsidian", "neroli", "santal"]) {
  const source = `public/posters/${id}.png`;
  await access(source);
  await sharp(source)
    .webp({ quality: 87, alphaQuality: 95 })
    .toFile(`public/posters/${id}.webp`);
}
console.log("Blender renders optimized to local WebP posters.");
